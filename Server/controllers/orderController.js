
import mongoose from 'mongoose'
import { randomBytes } from 'node:crypto'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Cart from '../models/Cart.js'

export const createOrder = async (req, res) => {
    let session

    try {
        const { addressId, idempotencyKey } = req.body
        const userId = req.user._id

        if (
            typeof idempotencyKey !== 'string' ||
            idempotencyKey.length < 8 ||
            idempotencyKey.length > 128
        ) {
            return res.status(400).json({
                success: false,
                message: 'A valid idempotencyKey is required',
            })
        }

        if (!mongoose.isValidObjectId(addressId)) {
            return res.status(400).json({
                success: false,
                message: 'Valid address ID is required',
            })
        }

        // Return the existing order when the same request is retried.
        const existingOrder = await Order.findOne({
            user: userId,
            idempotencyKey,
        })

        if (existingOrder) {
            return res.status(200).json({
                success: true,
                message: 'This order was already placed',
                order: existingOrder,
            })
        }

        const address = req.user.addresses.id(addressId)

        if (!address) {
            return res.status(400).json({
                success: false,
                message: 'Delivery address not found',
            })
        }

        session = await mongoose.startSession()

        let createdOrder

        await session.withTransaction(async () => {
            const cart = await Cart.findOne({
                user: userId,
            }).session(session)

            if (!cart || cart.items.length === 0) {
                throw new Error('CART_EMPTY')
            }

            // Combine duplicate product entries in the cart.
            const quantities = new Map()

            for (const item of cart.items) {
                const productId = item.product.toString()
                const quantity = item.quantity

                quantities.set(
                    productId,
                    (quantities.get(productId) || 0) + quantity
                )
            }

            for (const quantity of quantities.values()) {
                if (
                    !Number.isInteger(quantity) ||
                    quantity < 1 ||
                    quantity > 100
                ) {
                    throw new Error('INVALID_QUANTITY')
                }
            }

            const productIds = [...quantities.keys()]

            const products = await Product.find({
                _id: { $in: productIds },
                isActive: true,
            }).session(session)

            if (products.length !== productIds.length) {
                throw new Error('PRODUCT_UNAVAILABLE')
            }

            const orderItems = []
            let subtotal = 0

            for (const product of products) {
                const quantity = quantities.get(
                    product._id.toString()
                )

                // Atomic stock deduction prevents overselling.
                const result = await Product.updateOne(
                    {
                        _id: product._id,
                        isActive: true,
                        stock: { $gte: quantity },
                    },
                    {
                        $inc: { stock: -quantity },
                    },
                    { session }
                )

                if (result.modifiedCount !== 1) {
                    throw new Error('STOCK_UNAVAILABLE')
                }

                orderItems.push({
                    product: product._id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    quantity,
                })

                subtotal += product.price * quantity
            }

            const [order] = await Order.create(
                [{
                    orderNumber:
                        `ORD-${Date.now()}-${randomBytes(4).toString('hex').toUpperCase()}`,
                    idempotencyKey,
                    user: userId,
                    items: orderItems,
                    shippingAddress: {
                        label: address.label,
                        recipientName: address.recipientName,
                        phone: address.phone,
                        street: address.street,
                        area: address.area,
                        city: address.city,
                    },
                    subtotal,
                }],
                { session }
            )

            const cartResult = await Cart.updateOne(
                {
                    _id: cart._id,
                    user: userId,
                },
                {
                    $set: { items: [] },
                },
                { session }
            )

            if (cartResult.modifiedCount !== 1) {
                throw new Error('CART_CLEAR_FAILED')
            }

            createdOrder = order
        })

        return res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            order: createdOrder,
        })
    } catch (error) {
        // Another concurrent request may have used the same key.
        if (error.code === 11000) {
            try {
                const existingOrder = await Order.findOne({
                    user: req.user._id,
                    idempotencyKey: req.body.idempotencyKey,
                })

                if (existingOrder) {
                    return res.status(200).json({
                        success: true,
                        message: 'This order was already placed',
                        order: existingOrder,
                    })
                }
            } catch (lookupError) {
                console.error(
                    'Duplicate order lookup error:',
                    lookupError.message
                )
            }
        }

        const errors = {
            CART_EMPTY: [400, 'Your cart is empty'],
            INVALID_QUANTITY: [400, 'Invalid cart quantity'],
            PRODUCT_UNAVAILABLE: [
                400,
                'One or more products are unavailable',
            ],
            STOCK_UNAVAILABLE: [
                409,
                'Stock changed. Please refresh your cart and try again.',
            ],
            CART_CLEAR_FAILED: [
                409,
                'Unable to complete checkout. Please retry.',
            ],
        }

        const knownError = errors[error.message]

        if (knownError) {
            return res.status(knownError[0]).json({
                success: false,
                message: knownError[1],
            })
        }

        console.error('Create order error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to place order',
        })
    } finally {
        if (session) {
            await session.endSession()
        }
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id,
        }).sort({ createdAt: -1 })

        return res.json({
            success: true,
            count: orders.length,
            orders,
        })
    } catch (error) {
        console.error('Get orders error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch orders',
        })
    }
}

export const cancelMyOrder = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.orderId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid order ID',
        })
    }

    let session

    try {
        session = await mongoose.startSession()

        let cancelledOrder

        await session.withTransaction(async () => {
            const order = await Order.findOne({
                _id: req.params.orderId,
                user: req.user._id,
            }).session(session)

            if (!order) {
                throw new Error('ORDER_NOT_FOUND')
            }

            if (order.status !== 'Pending') {
                throw new Error('ORDER_NOT_CANCELLABLE')
            }

            const updatedOrder = await Order.findOneAndUpdate(
                {
                    _id: order._id,
                    user: req.user._id,
                    status: 'Pending',
                },
                {
                    $set: { status: 'Cancelled' },
                },
                {
                    new: true,
                    session,
                }
            )

            if (!updatedOrder) {
                throw new Error('ORDER_NOT_CANCELLABLE')
            }

            for (const item of order.items) {
                const result = await Product.updateOne(
                    { _id: item.product },
                    { $inc: { stock: item.quantity } },
                    { session }
                )

                if (result.matchedCount !== 1) {
                    throw new Error('PRODUCT_NOT_FOUND')
                }
            }

            cancelledOrder = updatedOrder
        })

        return res.json({
            success: true,
            message: 'Order cancelled and stock restored',
            order: cancelledOrder,
        })
    } catch (error) {
        if (error.message === 'ORDER_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            })
        }

        if (error.message === 'ORDER_NOT_CANCELLABLE') {
            return res.status(409).json({
                success: false,
                message: 'Only pending orders can be cancelled',
            })
        }

        console.error('Cancel order error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to cancel order',
        })
    } finally {
        if (session) {
            await session.endSession()
        }
    }
}

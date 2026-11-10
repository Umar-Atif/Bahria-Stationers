
import mongoose from 'mongoose'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'

// GET /api/cart
export const getMyCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user._id,
        }).populate({
            path: 'items.product',
            select: 'name price image stock category isActive',
        })

        if (!cart) {
            return res.json({
                success: true,
                items: [],
                subtotal: 0,
            })
        }

        const items = cart.items
            .filter(
                (item) =>
                    item.product &&
                    item.product.isActive
            )
            .map((item) => ({
                product: item.product._id,
                name: item.product.name,
                price: item.product.price,
                image: item.product.image,
                category: item.product.category,
                stock: item.product.stock,
                quantity: item.quantity,
                lineTotal:
                    item.product.price * item.quantity,
                available:
                    item.product.stock >= item.quantity,
            }))

        const subtotal = items.reduce(
            (total, item) => total + item.lineTotal,
            0
        )

        return res.json({
            success: true,
            items,
            subtotal,
        })
    } catch (error) {
        console.error('Get cart error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to fetch cart',
        })
    }
}

// POST /api/cart/items
export const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body

        if (
            !mongoose.isValidObjectId(productId) ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 100
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product or quantity',
            })
        }

        const product = await Product.findOne({
            _id: productId,
            isActive: true,
        })

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            })
        }

        if (product.stock < 1) {
            return res.status(409).json({
                success: false,
                message: 'Product is out of stock',
            })
        }

        // Create the cart if it does not exist.
        let cart = await Cart.findOne({
            user: req.user._id,
        })

        if (!cart) {
            try {
                cart = await Cart.create({
                    user: req.user._id,
                    items: [],
                })
            } catch (error) {
                // Another request may have created the cart first.
                if (error.code !== 11000) {
                    throw error
                }

                cart = await Cart.findOne({
                    user: req.user._id,
                })
            }
        }

        if (!cart) {
            throw new Error('Unable to initialize cart')
        }

        const existingItem = cart.items.find(
            (item) =>
                item.product.toString() ===
                productId.toString()
        )

        const newQuantity =
            (existingItem?.quantity || 0) + quantity

        if (newQuantity > 100) {
            return res.status(400).json({
                success: false,
                message: 'Maximum quantity per product is 100',
            })
        }

        if (newQuantity > product.stock) {
            return res.status(409).json({
                success: false,
                message: 'Requested quantity exceeds available stock',
            })
        }

        if (existingItem) {
            existingItem.quantity = newQuantity
        } else {
            cart.items.push({
                product: product._id,
                quantity,
            })
        }

        await cart.save()

        return res.status(200).json({
            success: true,
            message: 'Product added to cart',
            cart,
        })
    } catch (error) {
        console.error('Add to cart error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to add product to cart',
        })
    }
}

// PATCH /api/cart/items/:productId
export const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params
        const { quantity } = req.body

        if (
            !mongoose.isValidObjectId(productId) ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 100
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product or quantity',
            })
        }

        const cart = await Cart.findOne({
            user: req.user._id,
        })

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
            })
        }

        const item = cart.items.find(
            (entry) =>
                entry.product.toString() ===
                productId.toString()
        )

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Product is not in your cart',
            })
        }

        const product = await Product.findOne({
            _id: productId,
            isActive: true,
        })

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or unavailable',
            })
        }

        if (quantity > product.stock) {
            return res.status(409).json({
                success: false,
                message: 'Requested quantity exceeds available stock',
            })
        }

        item.quantity = quantity

        await cart.save()

        return res.json({
            success: true,
            message: 'Cart quantity updated',
            cart,
        })
    } catch (error) {
        console.error('Update cart error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to update cart',
        })
    }
}

// DELETE /api/cart/items/:productId
export const removeCartItem = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID',
            })
        }

        const cart = await Cart.findOne({
            user: req.user._id,
        })

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found',
            })
        }

        const initialLength = cart.items.length

        cart.items = cart.items.filter(
            (item) =>
                item.product.toString() !==
                productId.toString()
        )

        if (cart.items.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: 'Product is not in your cart',
            })
        }

        await cart.save()

        return res.json({
            success: true,
            message: 'Product removed from cart',
            cart,
        })
    } catch (error) {
        console.error('Remove cart item error:', error.message)

        return res.status(500).json({
            success: false,
            message: 'Unable to remove product',
        })
    }
}

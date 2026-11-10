import mongoose from 'mongoose'
import Order from '../models/Order.js'

export const getAllOrders = async (req, res) => {
    try {
        const { status } = req.query
        const filter = {}

        if (status) {
            const allowedStatuses = [
                'Pending',
                'Confirmed',
                'Processing',
                'Shipped',
                'Delivered',
                'Cancelled',
            ]

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid order status',
                })
            }

            filter.status = status
        }

        const orders = await Order.find(filter)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })

        res.json({
            success: true,
            count: orders.length,
            orders,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to fetch orders',
        })
    }
}

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params
        const { status } = req.body

        if (!mongoose.isValidObjectId(orderId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order ID',
            })
        }

        const allowedStatuses = [
            'Confirmed',
            'Processing',
            'Shipped',
            'Delivered',
        ]

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status transition',
            })
        }

        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            })
        }

        const transitions = {
            Pending: ['Confirmed'],
            Confirmed: ['Processing'],
            Processing: ['Shipped'],
            Shipped: ['Delivered'],
            Delivered: [],
            Cancelled: [],
        }

        if (!transitions[order.status]?.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot change status from ${order.status} to ${status}`,
            })
        }


        const updatedOrder = await Order.findOneAndUpdate(
            {
                _id: order._id,
                status: order.status,
            },
            {
                $set: { status },
            },
            {
                returnDocument: 'after',
                runValidators: true,
            }
        )

        if (!updatedOrder) {
            return res.status(409).json({
                success: false,
                message: 'Order status changed. Please refresh and try again.',
            })
        }

        return res.json({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder,
        })

        res.json({
            success: true,
            message: 'Order status updated successfully',
            order,
        })
    } catch (error) {
        console.error('Update order status error:', error)

        return res.status(500).json({
            success: false,
            message: 'Unable to update order status',
        })
    }
}

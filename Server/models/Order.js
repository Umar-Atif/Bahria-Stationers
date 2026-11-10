
import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: { type: String, required: true },
        image: { type: String, default: '' },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
)

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        idempotencyKey: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items) => items.length > 0,
                message: 'Order must contain at least one item',
            },
        },
        shippingAddress: {
            label: { type: String, default: 'Home' },
            recipientName: { type: String, required: true },
            phone: { type: String, required: true },
            street: { type: String, required: true },
            area: { type: String, required: true },
            city: { type: String, required: true },
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: [
                'Pending',
                'Confirmed',
                'Processing',
                'Shipped',
                'Delivered',
                'Cancelled',
            ],
            default: 'Pending',
        },
    },
    { timestamps: true }
)

// Prevent duplicate orders for the same user and idempotency key.
orderSchema.index(
    { user: 1, idempotencyKey: 1 },
    {
        unique: true,
        partialFilterExpression: {
            idempotencyKey: { $type: 'string' },
        },
    }
)

const Order = mongoose.model('Order', orderSchema)

export default Order

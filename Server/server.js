import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDB from './config/db.js'

import institutionRoutes from './routes/institutionRoutes.js'
import classRoutes from './routes/classRoutes.js'
import productRoutes from './routes/productRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import addressRoutes from './routes/addressRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import adminOrderRoutes from './routes/adminOrderRoutes.js'
import cartRoutes from './routes/cartRoutes.js'

dotenv.config()

const app = express()

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(cors({
    origin: CLIENT_URL,
}))

app.use(express.json())

app.get('/', (req, res) => {
    res.json({ success: true, message: 'Stationery Store API is running!' })
})

// Routes
app.use('/api/institutions', institutionRoutes)
app.use('/api/classes', classRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/addresses', addressRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin/orders', adminOrderRoutes)
app.use('/api/cart', cartRoutes)

const PORT = process.env.PORT || 5000

import Order from './models/Order.js'

const startServer = async () => {
    await connectDB()

    await Order.collection.createIndex(
        { user: 1, idempotencyKey: 1 },
        {
            unique: true,
            partialFilterExpression: {
                idempotencyKey: { $type: 'string' },
            },
        }
    )

    console.log('Order idempotency index verified')

    app.listen(PORT, () => {
        console.log(`Server is running`)
    })
}

startServer().catch((error) => {
    console.error('Server startup failed:', error.message)
    process.exit(1)
})


import express from 'express'
import {
    createOrder,
    getMyOrders,
    cancelMyOrder,
} from '../controllers/orderController.js'
import requireUser from '../middleware/requireUser.js'

const router = express.Router()

router.post('/', requireUser, createOrder)
router.get('/my-orders', requireUser, getMyOrders)
router.patch('/:orderId/cancel', requireUser, cancelMyOrder)

export default router

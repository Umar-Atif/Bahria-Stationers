import express from 'express'
import {
    getAllOrders,
    updateOrderStatus,
} from '../controllers/adminOrderController.js'
import { requireAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', requireAdmin, getAllOrders)
router.patch('/:orderId/status', requireAdmin, updateOrderStatus)

export default router

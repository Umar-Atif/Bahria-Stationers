import express from 'express'
import {
    getMyCart,
    addToCart,
    updateCartItem,
    removeCartItem,
} from '../controllers/cartController.js'
import requireUser from '../middleware/requireUser.js'

const router = express.Router()

router.get('/', requireUser, getMyCart)
router.post('/items', requireUser, addToCart)
router.patch('/items/:productId', requireUser, updateCartItem)
router.delete('/items/:productId', requireUser, removeCartItem)

export default router

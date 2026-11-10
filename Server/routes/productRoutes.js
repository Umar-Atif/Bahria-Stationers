import express from 'express'
import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { requireAdmin } from '../middleware/authMiddleware.js'
import upload from '../middleware/upload.js'

const router = express.Router()

// Public read endpoints
router.get('/', getProducts)
router.get('/:productId', getSingleProduct)

// Admin-only endpoints
router.post('/', requireAdmin, upload.single('image'), createProduct)
router.patch('/:productId', requireAdmin, upload.single('image'), updateProduct)
router.delete('/:productId', requireAdmin, deleteProduct)

export default router

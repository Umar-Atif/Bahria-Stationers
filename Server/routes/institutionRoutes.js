
import express from 'express'
import {
    getInstitutions,
    createInstitution,
    updateInstitution,
    deleteInstitution,
} from '../controllers/institutionController.js'
import { requireAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public: active institutions dekhna
router.get('/', getInstitutions)

// Admin only
router.post('/', requireAdmin, createInstitution)
router.patch('/:institutionId', requireAdmin, updateInstitution)
router.delete('/:institutionId', requireAdmin, deleteInstitution)

export default router

import express from 'express'
import {
    getClassesByInstitution,
    createClass,
    updateClass,
    deleteClass,
} from '../controllers/classController.js'
import { requireAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public: institution ki active classes
router.get('/institution/:institutionId', getClassesByInstitution)

// Admin only
router.post('/', requireAdmin, createClass)
router.patch('/:classId', requireAdmin, updateClass)
router.delete('/:classId', requireAdmin, deleteClass)

export default router

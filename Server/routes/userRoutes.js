import express from 'express'
import {
    getMyProfile,
    updateMyProfile,
} from '../controllers/userController.js'
import requireUser from '../middleware/requireUser.js'

const router = express.Router()

router.get('/me', requireUser, getMyProfile)
router.patch('/me', requireUser, updateMyProfile)

export default router

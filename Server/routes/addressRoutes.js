import express from 'express'
import {
    addAddress,
    updateAddress,
    deleteAddress,
    getAddresses,
} from '../controllers/addressController.js'
import requireUser from '../middleware/requireUser.js'

const router = express.Router()

router.get('/', requireUser, getAddresses)
router.post('/', requireUser, addAddress)
router.patch('/:addressId', requireUser, updateAddress)
router.delete('/:addressId', requireUser, deleteAddress)

export default router
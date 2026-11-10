export const addAddress = async (req, res) => {
    try {
        const { label, recipientName, phone, street, area, city } = req.body

        const requiredFields = {
            recipientName,
            phone,
            street,
            area,
            city,
        }

        for (const [field, value] of Object.entries(requiredFields)) {
            if (typeof value !== 'string' || !value.trim()) {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`,
                })
            }
        }

        req.user.addresses.push({
            label: label?.trim() || 'Home',
            recipientName: recipientName.trim(),
            phone: phone.trim(),
            street: street.trim(),
            area: area.trim(),
            city: city.trim(),
        })

        await req.user.save()

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            addresses: req.user.addresses,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to add address',
        })
    }
}

export const updateAddress = async (req, res) => {
    try {
        const address = req.user.addresses.id(req.params.addressId)

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found',
            })
        }

        const allowedFields = [
            'label',
            'recipientName',
            'phone',
            'street',
            'area',
            'city',
        ]

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                if (
                    typeof req.body[field] !== 'string' ||
                    !req.body[field].trim()
                ) {
                    return res.status(400).json({
                        success: false,
                        message: `${field} must be a non-empty string`,
                    })
                }

                address[field] = req.body[field].trim()
            }
        }

        await req.user.save()

        res.json({
            success: true,
            message: 'Address updated successfully',
            addresses: req.user.addresses,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to update address',
        })
    }
}

export const deleteAddress = async (req, res) => {
    try {
        const address = req.user.addresses.id(req.params.addressId)

        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found',
            })
        }

        address.deleteOne()
        await req.user.save()

        res.json({
            success: true,
            message: 'Address deleted successfully',
            addresses: req.user.addresses,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to delete address',
        })
    }
}

export const getAddresses = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            addresses: req.user.addresses,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to fetch addresses',
        })
    }
}

export const getMyProfile = async (req, res) => {
    try {
        res.json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
                addresses: req.user.addresses,
                createdAt: req.user.createdAt,
            },
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to fetch profile',
        })
    }
}

export const updateMyProfile = async (req, res) => {
    try {
        const { name, phone } = req.body

        if (name !== undefined) {
            if (typeof name !== 'string' || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Name cannot be empty',
                })
            }

            req.user.name = name.trim()
        }

        if (phone !== undefined) {
            if (typeof phone !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: 'Phone must be a string',
                })
            }

            req.user.phone = phone.trim()
        }

        await req.user.save()

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone,
            },
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Unable to update profile',
        })
    }
}

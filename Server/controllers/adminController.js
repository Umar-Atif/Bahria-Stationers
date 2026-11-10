import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export const loginAdmin = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase()
        const password = req.body.password

        if (!email || typeof password !== 'string' || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            })
        }

        const admin = await Admin.findOne({ email }).select('+password')

        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            })
        }

        const passwordMatches = await bcrypt.compare(
            password,
            admin.password
        )

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            })
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'Authentication is not configured',
            })
        }

        const token = jwt.sign(
            { id: admin._id.toString(), role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            success: true,
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Admin login failed',
        })
    }
}

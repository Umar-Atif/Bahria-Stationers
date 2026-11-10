import jwt from 'jsonwebtoken'
import Admin from '../models/Admin.js'

export const requireAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            })
        }

        const token = authHeader.slice(7)

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: 'Authentication is not configured',
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role !== 'admin' || !decoded.id) {
            return res.status(403).json({
                success: false,
                message: 'Admin access required',
            })
        }

        const admin = await Admin.findOne({
            _id: decoded.id,
            role: 'admin',
            isActive: true,
        })

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Admin account is unavailable',
            })
        }

        req.admin = {
            id: admin._id.toString(),
            role: admin.role,
        }

        next()
    } catch (error) {
        if (error.name === 'JsonWebTokenError' ||
            error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token',
            })
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication failed',
        })
    }
}

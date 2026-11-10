import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const requireUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required',
            })
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (decoded.role !== 'customer') {
            return res.status(403).json({
                success: false,
                message: 'Customer access only',
            })
        }

        const user = await User.findOne({
            _id: decoded.id,
            isActive: true,
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Customer account not found or inactive',
            })
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        })
    }
}

export default requireUser

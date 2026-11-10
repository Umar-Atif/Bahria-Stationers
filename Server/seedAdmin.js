import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Admin from './models/Admin.js'

const seedAdmin = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing from .env')
        }

        const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
        const password = process.env.ADMIN_PASSWORD

        if (!email || !password || password.length < 12) {
            throw new Error(
                'Set ADMIN_EMAIL and an ADMIN_PASSWORD of at least 12 characters'
            )
        }

        await mongoose.connect(process.env.MONGO_URI)

        const existingAdmin = await Admin.findOne({ email })

        if (existingAdmin) {
            console.log('An admin with this email already exists.')
            return
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await Admin.create({
            name: 'Store Admin',
            email,
            password: hashedPassword,
            role: 'admin',
        })

        console.log('Admin account created successfully.')
    } catch (error) {
        console.error('Admin seed failed:', error.message)
        process.exitCode = 1
    } finally {
        await mongoose.disconnect()
    }
}

seedAdmin()

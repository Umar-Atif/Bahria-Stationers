import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        phone: {
            type: String,
            default: '',
            trim: true,
        },
        addresses: [
            {
                label: {
                    type: String,
                    default: 'Home',
                },
                recipientName: {
                    type: String,
                    required: true,
                },
                phone: {
                    type: String,
                    required: true,
                },
                street: {
                    type: String,
                    required: true,
                },
                area: {
                    type: String,
                    required: true,
                },
                city: {
                    type: String,
                    required: true,
                },
            },
        ],
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

const User = mongoose.model('User', userSchema)

export default User

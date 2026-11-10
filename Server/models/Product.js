// import mongoose from 'mongoose'

// const productSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: true,
//             trim: true,
//         },
//         slug: {
//             type: String,
//             required: true,
//             unique: true,
//             trim: true,
//             lowercase: true,
//         },
//         description: {
//             type: String,
//             default: '',
//         },
//         category: {
//             type: String,
//             enum: ['Books', 'Copies', 'Stationery'],
//             required: true,
//         },
//         institution: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Institution',
//             default: null,
//         },
//         class: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'Class',
//             default: null,
//         },
//         price: {
//             type: Number,
//             required: true,
//             min: 0,
//         },
//         stock: {
//             type: Number,
//             required: true,
//             min: 0,
//             default: 0,
//         },
//         image: {
//             type: String,
//             default: '',
//         },
//         isActive: {
//             type: Boolean,
//             default: true,
//         },
//     },
//     { timestamps: true }
// )

// productSchema.pre('validate', function () {
//     if (this.category === 'Stationery') {
//         this.institution = null
//         this.class = null
//     }

//     if (this.category === 'Books' || this.category === 'Copies') {
//         if (!this.institution || !this.class) {
//             this.invalidate(
//                 'class',
//                 'Books and Copies require an institution and class'
//             )
//         }
//     }
// })

// const Product = mongoose.model('Product', productSchema)

// export default Product

import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            default: '',
        },
        category: {
            type: String,
            enum: ['Books', 'Copies', 'Stationery'],
            required: true,
        },
        institution: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Institution',
            default: null,
        },
        classes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Class',
            },
        ],
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        image: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
)

productSchema.pre('validate', function () {
    if (this.category === 'Stationery') {
        this.institution = null
        this.classes = []
    }

    if (this.category === 'Books' || this.category === 'Copies') {
        if (!this.institution) {
            this.invalidate(
                'institution',
                'Books and Copies require an institution'
            )
        }

        if (!this.classes || this.classes.length === 0) {
            this.invalidate(
                'classes',
                'Books and Copies require at least one class'
            )
        }
    }
})

const Product = mongoose.model('Product', productSchema)

export default Product

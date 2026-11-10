// import mongoose from 'mongoose'
// import Product from '../models/Product.js'
// import Institution from '../models/Institution.js'
// import Class from '../models/Class.js'
// import uploadImage from '../utils/uploadImage.js'

// export const getProducts = async (req, res) => {
//     try {
//         const { category, institutionId, classId } = req.query

//         const filter = { isActive: true }

//         if (category) {
//             if (!['Books', 'Copies', 'Stationery'].includes(category)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Invalid category',
//                 })
//             }

//             filter.category = category
//         }

//         if (institutionId || classId) {
//             if (
//                 !institutionId ||
//                 !classId ||
//                 !mongoose.isValidObjectId(institutionId) ||
//                 !mongoose.isValidObjectId(classId)
//             ) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Valid institutionId and classId are required',
//                 })
//             }

//             filter.institution = institutionId
//             filter.class = classId
//         }

//         if (category === 'Stationery') {
//             filter.institution = null
//             filter.class = null
//         }

//         const products = await Product.find(filter)
//             .populate('institution', 'name slug')
//             .populate('class', 'name slug')
//             .sort({ name: 1 })

//         res.status(200).json({
//             success: true,
//             count: products.length,
//             data: products,
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch products',
//         })
//     }
// }

// export const getSingleProduct = async (req, res) => {
//     try {
//         if (!mongoose.isValidObjectId(req.params.productId)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid product ID',
//             })
//         }

//         const product = await Product.findOne({
//             _id: req.params.productId,
//             isActive: true,
//         })
//             .populate('institution', 'name slug')
//             .populate('class', 'name slug')

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found',
//             })
//         }

//         res.status(200).json({
//             success: true,
//             data: product,
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to fetch product',
//         })
//     }
// }

// export const createProduct = async (req, res) => {
//     try {
//         const {
//             name, slug, description, category,
//             institution, class: classId,
//         } = req.body

//         const price = Number(req.body.price)
//         const stock = Number(req.body.stock)

//         if (
//             !name?.trim() ||
//             !slug?.trim() ||
//             !['Books', 'Copies', 'Stationery'].includes(category) ||
//             typeof price !== 'number' ||
//             !Number.isFinite(price) ||
//             price < 0 ||
//             !Number.isInteger(stock) ||
//             stock < 0
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid product details, price, stock or category',
//             })
//         }

//         let institutionId = null
//         let validatedClassId = null

//         if (category === 'Stationery') {
//             if (institution || classId) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Stationery must not have an institution or class',
//                 })
//             }
//         } else {
//             if (
//                 !mongoose.isValidObjectId(institution) ||
//                 !mongoose.isValidObjectId(classId)
//             ) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Books and Copies require valid institution and class IDs',
//                 })
//             }

//             const [foundInstitution, foundClass] = await Promise.all([
//                 Institution.findOne({ _id: institution, isActive: true }),
//                 Class.findOne({
//                     _id: classId,
//                     institution,
//                     isActive: true,
//                 }),
//             ])

//             if (!foundInstitution || !foundClass) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Active institution and its class are required',
//                 })
//             }

//             institutionId = institution
//             validatedClassId = classId
//         }


//         const uploadedImage = req.file
//             ? await uploadImage(req.file.buffer)
//             : null

//         const product = await Product.create({
//             name: name.trim(),
//             slug: slug.trim().toLowerCase(),
//             description: description || '',
//             category,
//             institution: institutionId,
//             class: validatedClassId,
//             price,
//             stock,
//             image: uploadedImage?.url || '',
//         })


//         res.status(201).json({ success: true, data: product })
//     } catch (error) {
//         console.error('Create product error:', error)
//         if (error.code === 11000) {
//             return res.status(409).json({
//                 success: false,
//                 message: 'Product slug already exists',
//             })
//         }

//         res.status(500).json({
//             success: false,
//             message: 'Failed to create product',
//         })
//     }
// }

// export const updateProduct = async (req, res) => {
//     try {
//         const { productId } = req.params;

//         if (req.body.price !== undefined) {
//             req.body.price = Number(req.body.price)
//         }

//         if (req.body.stock !== undefined) {
//             req.body.stock = Number(req.body.stock)
//         }

//         if (!mongoose.isValidObjectId(productId)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid product ID',
//             })
//         }

//         const product = await Product.findById(productId)

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found',
//             })
//         }

//         const allowedFields = [
//             'name', 'slug', 'description', 'price', 'stock', 'isActive',
//         ]

//         for (const field of allowedFields) {
//             if (req.body[field] !== undefined) {
//                 product[field] = req.body[field]
//             }
//         }

//         if (req.body.name !== undefined) {
//             if (typeof req.body.name !== 'string' || !req.body.name.trim()) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Name cannot be empty',
//                 })
//             }
//             product.name = req.body.name.trim()
//         }

//         if (req.body.slug !== undefined) {
//             if (typeof req.body.slug !== 'string' || !req.body.slug.trim()) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Slug cannot be empty',
//                 })
//             }
//             product.slug = req.body.slug.trim().toLowerCase()
//         }

//         if (req.body.price !== undefined) {
//             if (
//                 typeof req.body.price !== 'number' ||
//                 !Number.isFinite(req.body.price) ||
//                 req.body.price < 0
//             ) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Price must be a non-negative number',
//                 })
//             }
//         }

//         if (req.body.stock !== undefined) {
//             if (!Number.isInteger(req.body.stock) || req.body.stock < 0) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Stock must be a non-negative integer',
//                 })
//             }
//         }

//         if (
//             req.body.isActive !== undefined &&
//             typeof req.body.isActive !== 'boolean'
//         ) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'isActive must be a boolean',
//             })
//         }

//         if (req.file) {
//             const uploadedImage = await uploadImage(req.file.buffer)
//             product.image = uploadedImage.url
//         }

//         await product.save()

//         res.json({ success: true, data: product })
//     } catch (error) {
//         if (error.code === 11000) {
//             return res.status(409).json({
//                 success: false,
//                 message: 'Product slug already exists',
//             })
//         }

//         res.status(500).json({
//             success: false,
//             message: 'Failed to update product',
//         })
//     }
// }

// export const deleteProduct = async (req, res) => {
//     try {
//         if (!mongoose.isValidObjectId(req.params.productId)) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Invalid product ID',
//             })
//         }

//         const product = await Product.findByIdAndUpdate(
//             req.params.productId,
//             { $set: { isActive: false } },
//             { new: true }
//         )

//         if (!product) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Product not found',
//             })
//         }

//         res.json({
//             success: true,
//             message: 'Product deactivated successfully',
//         })
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to deactivate product',
//         })
//     }
// }

import mongoose from 'mongoose'
import Product from '../models/Product.js'
import Institution from '../models/Institution.js'
import Class from '../models/Class.js'
import uploadImage from '../utils/uploadImage.js'

// Convert classes received through FormData or JSON into an array.
const parseClasses = (value) => {
    if (Array.isArray(value)) return value

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }

    return []
}

// Validate institution and all selected classes.
const validateInstitutionClasses = async (institutionId, classIds) => {
    if (!mongoose.isValidObjectId(institutionId)) {
        return { error: 'A valid institution is required.' }
    }

    if (!Array.isArray(classIds) || classIds.length === 0) {
        return { error: 'Please select at least one class.' }
    }

    if (classIds.some(id => !mongoose.isValidObjectId(id))) {
        return { error: 'One or more class IDs are invalid.' }
    }

    const uniqueClassIds = [...new Set(classIds.map(String))]

    if (uniqueClassIds.length !== classIds.length) {
        return { error: 'Duplicate classes are not allowed.' }
    }

    const [institution, classes] = await Promise.all([
        Institution.findOne({
            _id: institutionId,
            isActive: true,
        }),
        Class.find({
            _id: { $in: uniqueClassIds },
            institution: institutionId,
            isActive: true,
        }),
    ])

    if (!institution) {
        return { error: 'Active institution not found.' }
    }

    if (classes.length !== uniqueClassIds.length) {
        return {
            error: 'All selected classes must belong to the selected active institution.',
        }
    }

    return { classIds: uniqueClassIds }
}

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
    try {
        const { category, institutionId, classId } = req.query

        const filter = { isActive: true }

        if (category) {
            if (!['Books', 'Copies', 'Stationery'].includes(category)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category',
                })
            }

            filter.category = category
        }

        if (institutionId || classId) {
            if (
                !institutionId ||
                !classId ||
                !mongoose.isValidObjectId(institutionId) ||
                !mongoose.isValidObjectId(classId)
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid institutionId and classId are required',
                })
            }

            filter.institution = institutionId
            filter.classes = classId
        }

        if (category === 'Stationery') {
            filter.institution = null
            filter.classes = { $size: 0 }
        }

        const products = await Product.find(filter)
            .populate('institution', 'name slug')
            .populate('classes', 'name slug')
            .sort({ name: 1 })

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        })
    } catch (error) {
        console.error('Get products error:', error)

        res.status(500).json({
            success: false,
            message: 'Failed to fetch products',
        })
    }
}

// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID',
            })
        }

        const product = await Product.findOne({
            _id: req.params.productId,
            isActive: true,
        })
            .populate('institution', 'name slug')
            .populate('classes', 'name slug')

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            })
        }

        res.status(200).json({
            success: true,
            data: product,
        })
    } catch (error) {
        console.error('Get single product error:', error)

        res.status(500).json({
            success: false,
            message: 'Failed to fetch product',
        })
    }
}

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            slug,
            description,
            category,
            institution,
        } = req.body

        const classIds = parseClasses(req.body.classes)

        const price = Number(req.body.price)
        const stock = Number(req.body.stock)

        if (
            !name?.trim() ||
            !slug?.trim() ||
            !['Books', 'Copies', 'Stationery'].includes(category) ||
            !Number.isFinite(price) ||
            price < 0 ||
            !Number.isInteger(stock) ||
            stock < 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product details, price, stock or category',
            })
        }

        let institutionId = null
        let validatedClassIds = []

        if (category === 'Stationery') {
            if (institution || classIds.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Stationery must not have an institution or classes',
                })
            }
        } else {
            const validation = await validateInstitutionClasses(
                institution,
                classIds
            )

            if (validation.error) {
                return res.status(400).json({
                    success: false,
                    message: validation.error,
                })
            }

            institutionId = institution
            validatedClassIds = validation.classIds
        }

        const uploadedImage = req.file
            ? await uploadImage(req.file.buffer)
            : null

        const product = await Product.create({
            name: name.trim(),
            slug: slug.trim().toLowerCase(),
            description: description || '',
            category,
            institution: institutionId,
            classes: validatedClassIds,
            price,
            stock,
            image: uploadedImage?.url || '',
        })

        res.status(201).json({
            success: true,
            data: product,
        })
    } catch (error) {
        console.error('Create product error:', error)

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Product slug already exists',
            })
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create product',
        })
    }
}

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID',
            })
        }

        const product = await Product.findById(productId)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            })
        }

        const allowedFields = [
            'name',
            'slug',
            'description',
            'price',
            'stock',
            'isActive',
        ]

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                product[field] = req.body[field]
            }
        }

        if (req.body.name !== undefined) {
            if (
                typeof req.body.name !== 'string' ||
                !req.body.name.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Name cannot be empty',
                })
            }

            product.name = req.body.name.trim()
        }

        if (req.body.slug !== undefined) {
            if (
                typeof req.body.slug !== 'string' ||
                !req.body.slug.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Slug cannot be empty',
                })
            }

            product.slug = req.body.slug.trim().toLowerCase()
        }

        if (req.body.price !== undefined) {
            product.price = Number(req.body.price)

            if (
                !Number.isFinite(product.price) ||
                product.price < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Price must be a non-negative number',
                })
            }
        }

        if (req.body.stock !== undefined) {
            product.stock = Number(req.body.stock)

            if (
                !Number.isInteger(product.stock) ||
                product.stock < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Stock must be a non-negative integer',
                })
            }
        }

        if (
            req.body.isActive !== undefined &&
            ![true, false, 'true', 'false'].includes(req.body.isActive)
        ) {
            return res.status(400).json({
                success: false,
                message: 'isActive must be a boolean',
            })
        }

        if (req.body.isActive !== undefined) {
            product.isActive = req.body.isActive === true ||
                req.body.isActive === 'true'
        }

        // Update institution and classes when supplied.
        const category = req.body.category ?? product.category
        const institutionId =
            req.body.institution !== undefined
                ? req.body.institution
                : product.institution?.toString()

        const classesProvided = req.body.classes !== undefined

        const classIds = classesProvided
            ? parseClasses(req.body.classes)
            : product.classes.map(item => item.toString())

        if (!['Books', 'Copies', 'Stationery'].includes(category)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category',
            })
        }

        product.category = category

        if (category === 'Stationery') {
            if (
                (req.body.institution && req.body.institution !== '') ||
                classIds.length > 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: 'Stationery must not have an institution or classes',
                })
            }

            product.institution = null
            product.classes = []
        } else {
            const validation = await validateInstitutionClasses(
                institutionId,
                classIds
            )

            if (validation.error) {
                return res.status(400).json({
                    success: false,
                    message: validation.error,
                })
            }

            product.institution = institutionId
            product.classes = validation.classIds
        }

        if (req.file) {
            const uploadedImage = await uploadImage(req.file.buffer)
            product.image = uploadedImage.url
        }

        await product.save()

        const updatedProduct = await Product.findById(product._id)
            .populate('institution', 'name slug')
            .populate('classes', 'name slug')

        res.json({
            success: true,
            data: updatedProduct,
        })
    } catch (error) {
        console.error('Update product error:', error)

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Product slug already exists',
            })
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update product',
        })
    }
}

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID',
            })
        }

        const product = await Product.findByIdAndUpdate(
            req.params.productId,
            { $set: { isActive: false } },
            { new: true }
        )

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            })
        }

        res.json({
            success: true,
            message: 'Product deactivated successfully',
        })
    } catch (error) {
        console.error('Delete product error:', error)

        res.status(500).json({
            success: false,
            message: 'Failed to deactivate product',
        })
    }
}
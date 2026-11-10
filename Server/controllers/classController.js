import Class from '../models/Class.js'
import Institution from '../models/Institution.js'
import mongoose from 'mongoose'

export const getClassesByInstitution = async (req, res) => {
    try {
        const { institutionId } = req.params

        if (!/^[0-9a-fA-F]{24}$/.test(institutionId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid institution ID',
            })
        }

        const institution = await Institution.findOne({
            _id: institutionId,
            isActive: true,
        })

        if (!institution) {
            return res.status(404).json({
                success: false,
                message: 'Institution not found',
            })
        }

        const classes = await Class.find({
            institution: institutionId,
            isActive: true,
        }).sort({ sortOrder: 1, name: 1 })

        res.status(200).json({
            success: true,
            count: classes.length,
            data: classes,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch classes',
        })
    }
}

export const createClass = async (req, res) => {
    try {
        const { name, slug, institutionId, sortOrder } = req.body

        if (
            !name?.trim() ||
            !slug?.trim() ||
            !mongoose.isValidObjectId(institutionId)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Name, slug and valid institutionId are required',
            })
        }

        const institution = await Institution.findOne({
            _id: institutionId,
            isActive: true,
        })

        if (!institution) {
            return res.status(404).json({
                success: false,
                message: 'Active institution not found',
            })
        }

        const newClass = await Class.create({
            name: name.trim(),
            slug: slug.trim().toLowerCase(),
            institution: institutionId,
            sortOrder: sortOrder ?? 0,
        })

        res.status(201).json({
            success: true,
            data: newClass,
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'This class slug already exists for the institution',
            })
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create class',
        })
    }
}

export const updateClass = async (req, res) => {
    try {
        const { classId } = req.params
        const { name, slug, sortOrder, isActive } = req.body

        if (!mongoose.isValidObjectId(classId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid class ID',
            })
        }

        const updates = {}

        if (name !== undefined) {
            if (typeof name !== 'string' || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Name cannot be empty',
                })
            }
            updates.name = name.trim()
        }

        if (slug !== undefined) {
            if (typeof slug !== 'string' || !slug.trim()) {
                return res.status(400).json({
                    success: false,
                    message: 'Slug cannot be empty',
                })
            }
            updates.slug = slug.trim().toLowerCase()
        }

        if (sortOrder !== undefined) {
            if (!Number.isFinite(sortOrder)) {
                return res.status(400).json({
                    success: false,
                    message: 'sortOrder must be a number',
                })
            }
            updates.sortOrder = sortOrder
        }

        if (isActive !== undefined) {
            if (typeof isActive !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    message: 'isActive must be a boolean',
                })
            }
            updates.isActive = isActive
        }

        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { $set: updates },
            { new: true, runValidators: true }
        )

        if (!updatedClass) {
            return res.status(404).json({
                success: false,
                message: 'Class not found',
            })
        }

        res.json({ success: true, data: updatedClass })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'This class slug already exists for the institution',
            })
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update class',
        })
    }
}

export const deleteClass = async (req, res) => {
    try {
        const { classId } = req.params

        if (!mongoose.isValidObjectId(classId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid class ID',
            })
        }

        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { $set: { isActive: false } },
            { new: true }
        )

        if (!updatedClass) {
            return res.status(404).json({
                success: false,
                message: 'Class not found',
            })
        }

        res.json({
            success: true,
            message: 'Class deactivated successfully',
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to deactivate class',
        })
    }
}

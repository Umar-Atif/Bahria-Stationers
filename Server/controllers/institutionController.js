import Institution from '../models/Institution.js'
import mongoose from 'mongoose'

export const getInstitutions = async (req, res) => {
    try {
        const institutions = await Institution.find({ isActive: true })
            .sort({ name: 1 })

        res.status(200).json({
            success: true,
            count: institutions.length,
            data: institutions,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch institutions',
        })
    }
}

export const createInstitution = async (req, res) => {
  try {
    const { name, slug, type, image } = req.body

    if (!name?.trim() || !slug?.trim() ||
        !['school', 'college'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Name, slug and valid type are required',
      })
    }

    const institution = await Institution.create({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      type,
      image: image || '',
    })

    res.status(201).json({
      success: true,
      data: institution,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Institution slug already exists',
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create institution',
    })
  }
}

export const updateInstitution = async (req, res) => {
  try {
    const { institutionId } = req.params
    const { name, slug, type, image, isActive } = req.body

    if (!/^[0-9a-fA-F]{24}$/.test(institutionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid institution ID',
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

    if (type !== undefined) {
      if (!['school', 'college'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid institution type',
        })
      }
      updates.type = type
    }

    if (image !== undefined) updates.image = image

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: 'isActive must be a boolean',
        })
      }
      updates.isActive = isActive
    }

    const institution = await Institution.findByIdAndUpdate(
      institutionId,
      { $set: updates },
      { new: true, runValidators: true }
    )

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found',
      })
    }

    res.json({ success: true, data: institution })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Institution slug already exists',
      })
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update institution',
    })
  }
}

export const deleteInstitution = async (req, res) => {
  try {
    const { institutionId } = req.params

    if (!/^[0-9a-fA-F]{24}$/.test(institutionId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid institution ID',
      })
    }

    const institution = await Institution.findByIdAndUpdate(
      institutionId,
      { $set: { isActive: false } },
      { new: true }
    )

    if (!institution) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found',
      })
    }

    res.json({
      success: true,
      message: 'Institution deactivated successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate institution',
    })
  }
}


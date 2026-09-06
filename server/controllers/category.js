const Category = require("../models/Category")
const ticketModel = require("../models/Ticket")

const createCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Only admin can create category" })
        }
        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            return res.status(400).json({ msg: "Category already exists" })
        }
        const category = await Category.create({ name, description })
        return res.status(200).json({ msg: "Category created successfully", category })
    } catch (error) {
        next(error)
    }
}

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find()
        return res.status(200).json({ count: categories.length, categories })
    } catch (error) {
        next(error)
    }
}

const getActiveCategories = async (req, res, next) => {
    try {
        const categories = await Category.find({ isActive: true })
        return res.status(200).json({ count: categories.length, categories })
    } catch (error) {
        next(error)
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const { name, description } = req.body
        const { id: categoryId } = req.params
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Only admin can update category" })
        }
        const category = await Category.findById(categoryId)
        if (!category) {
            return res.status(404).json({ msg: "Category not found" })
        }
        const existingCategory = await Category.findOne({ name })
        if (existingCategory && existingCategory._id.toString() !== categoryId) {
            return res.status(400).json({ msg: "Category already exists" })
        }
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name, description }, { new: true })
        return res.status(200).json({ msg: "Category Updated Successfully", updatedCategory })

    } catch (error) {
        next(error)
    }
}

const deactivateCategory = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Only admin can deactivate category" })
        }
        const { id: categoryId } = req.params

        const category = await Category.findById(categoryId)
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' })
        }

        category.isActive = false
        await category.save()

        return res.status(200).json({ msg: "Category deactivated successfully", deactivateCategory })
    } catch (error) {
        next(error)
    }
}

module.exports = { createCategory, getAllCategories, getActiveCategories, updateCategory, deactivateCategory }
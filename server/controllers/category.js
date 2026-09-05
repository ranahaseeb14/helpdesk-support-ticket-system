const Category = require("../models/Category")
const ticketModel = require("../models/Ticket")

const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Only admin can create category" })
        }
        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            return res.status(400).json({ msg: "Category already exists" })
        }
        const category = await Category.create({ name })
        return res.status(200).json({ msg: "Category created successfully" })
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

const updateCategory = async (req, res, next) => {
    try {
        const { name } = req.body
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
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { name }, { new: true })
        return res.status(200).json({ msg: "Category Updated Successfully", updatedCategory })

    } catch (error) {
        next(error)
    }
}

const deleteCategorybyId = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ msg: "Only admin can delete category" })
        }
        const { id: categoryId } = req.params
        const category = await Category.findById(categoryId)
        if (!category) {
            return res.status(404).json({ msg: 'Category not found' })
        }
        const isUsed = await ticketModel.findOne({ category: categoryId })
        if (isUsed) {
            return res.status(400).json({ msg: 'Category is in use, cannot delete' })
        }
        const deleteCategory = await Category.findByIdAndDelete(categoryId)

        return res.status(200).json({ msg: "Category Deleted Successfully", deleteCategory })
    } catch (error) {
        next(error)
    }
}

module.exports = { createCategory, getAllCategories, updateCategory, deleteCategorybyId }
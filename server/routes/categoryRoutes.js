const express = require("express")

const router = express.Router()

const protect = require("../middleware/authMiddleware")

const { createCategory, getAllCategories, updateCategory, deleteCategorybyId } = require("../controllers/category")

router.post('/categories', protect, createCategory)

router.get('/categories', protect, getAllCategories)

router.patch('/categories/:id', protect, updateCategory)

router.delete('/categories/:id', protect, deleteCategorybyId)

module.exports = router
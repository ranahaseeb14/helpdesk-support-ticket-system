const express = require("express")

const router = express.Router()

const protect = require("../middleware/authMiddleware")

const { createCategory, getAllCategories, updateCategory, deactivateCategory, getActiveCategories } = require("../controllers/category")

const Category = require("../models/Category")

router.post('/categories', protect, createCategory)

router.get('/categories', protect, getAllCategories)

router.get('/categories/active', protect, getActiveCategories)

router.patch('/categories/:id', protect, updateCategory)

router.patch('/categories/:id/deactivate', protect, deactivateCategory)

module.exports = router
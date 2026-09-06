const mongoose = require("mongoose")
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Category = mongoose.model('Category', categorySchema)

module.exports = Category
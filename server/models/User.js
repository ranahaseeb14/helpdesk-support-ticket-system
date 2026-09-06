const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Please fill Email'],
            maxLength: [50, 'Email cannot exceed 50 characters']
        },
        password: {
            type: String,
            select: false,
            required: [true, 'Please fill Password'],
            minLength: [8, 'Password Should be atleast of 8 character']
        },
        role: {
            type: String,
            enum: ['requester', 'agent', 'admin', 'null'],
            default: 'requester',
            required: true
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isOwner: {
            type: Boolean,
            default: false,
        },
    }, { timestamps: true })

userSchema.index({ role: 1, isActive: 1 })

const userModel = mongoose.model('User', userSchema)

module.exports = userModel
const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isInternal: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

commentSchema.index({ ticket: 1, isInternal: 1 })

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment
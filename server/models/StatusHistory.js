const mongoose = require("mongoose")
const historySchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
        index: true
    },
    changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    oldStatus: {
        type: String,
        required: true
    },
    newStatus: {
        type: String,
        required: true
    }
}, { timestamps: true })

const StatusHistory = mongoose.model('StatusHistory', historySchema)
module.exports = StatusHistory
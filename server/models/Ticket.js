const mongoose = require("mongoose")
const Category = require("./Category")

const ticketSchema = new mongoose.Schema(
    {
        ticketNo: {
            type: String,
            required: true,
            unique: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium'
        },
        status: {
            type: String,
            enum: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
            default: 'Open',
            index: true
        },
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        assignedAgent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
            index: true
        },
        dueDate: {
            type: Date,
            default: null
        },
        resolution: {
            type: String,
            default: ''
        },
    }, { timestamps: true }
)

const ticketModel = mongoose.model('Ticket', ticketSchema)

module.exports = ticketModel
const ticketModel = require("../models/Ticket")
const userModel = require("../models/User")
const Counter = require("../models/Counter")
const StatusHistory = require("../models/StatusHistory")
const Category = require("../models/Category")

const createTicket = async (req, res, next) => {
    try {
        const { title, description, category, priority, dueDate } = req.body
        const categoryExists = await Category.findById(category)
        if (!categoryExists) {
            return res.status(400).json({ msg: "Invalid Category" })
        }
        const counter = await Counter.findOneAndUpdate(
            { name: 'ticketNo' },
            { $inc: { seq: 1 } },
            { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true }
        )
        const newTicketNo = `TKT-${counter.seq}`

        const newTicket = await ticketModel.create({
            ticketNo: newTicketNo,
            title,
            description,
            category,
            priority,
            requester: req.user.id,
            status: 'Open',
            dueDate: dueDate || null
        })
        res.status(201).json({
            msg: "Ticket Created", ticket: newTicket
        })
    } catch (error) {
        next(error)
    }
}
const getAllTickets = async (req, res, next) => {
    try {
        let filter = {}
        if (req.user.role === 'requester') {
            filter = { requester: req.user.id }
        } else if (req.user.role === 'agent') {
            filter = { assignedAgent: req.user.id }
        }

        const { status, priority, page = 1, limit = 20 } = req.query

        if (status) filter.status = status
        if (priority) filter.priority = priority

        const skip = (Number(page) - 1) * Number(limit)

        const tickets = await ticketModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .populate('category', 'name')
        const totalTickets = await ticketModel.countDocuments(filter)
        res.status(200).json({
            count: tickets.length,
            totalTickets,
            totalPages: Math.ceil(totalTickets / Number(limit)),
            currentPage: Number(page),
            tickets
        })
    } catch (error) {
        next(error)
    }
}
const getSingleTicket = async (req, res, next) => {
    try {
        const ticket = await ticketModel.findById(req.params.id).populate('category', 'name')
        if (!ticket) {
            return res.status(404).json({ msg: "Ticket not found" })
        }

        const isRequester = ticket.requester.toString() === req.user.id
        const isAssignedAgent = ticket.assignedAgent?.toString() === req.user.id
        const isAdmin = req.user.role === 'admin'

        if (!isRequester && !isAssignedAgent && !isAdmin) {
            return res.status(403).json({
                msg: "Not Authorized to view this ticket"
            })
        }
        res.status(200).json({ ticket })

    } catch (error) {
        next(error)
    }
}

const assignTicket = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: "Only Admin can assign Tickets" })
        }
        const { agentId } = req.body

        const ticket = await ticketModel.findById(req.params.id)
        if (!ticket) {
            return res.status(404).json({ msg: "Ticket not found" })
        }
        const agent = await userModel.findById(agentId)
        if (!agent || agent.role !== 'agent') {
            return res.status(400).json({ msg: "Invalid agent selected" })
        }

        ticket.assignedAgent = agentId
        ticket.status = 'Assigned'
        await ticket.save()

        res.status(200).json({ msg: "Ticket assigned successfully" })

    } catch (error) {
        next(error)
    }
}

const updateTicketStatus = async (req, res, next) => {
    try {

        const { status: newStatus, resolutionNote } = req.body
        const ticket = await ticketModel.findById(req.params.id)
        if (!ticket) {
            return res.status(404).json({ msg: "Ticket not found" })
        }
        const isAssignedAgent = ticket.assignedAgent?.toString() === req.user.id
        const isAdmin = req.user.role === 'admin'

        if (!isAssignedAgent && !isAdmin) {
            return res.status(403).json({ msg: "Not authorized to update this ticket's status" })
        }
        const allowedTransitions = {
            'Open': ['Assigned'],
            'Assigned': ['In Progress'],
            'In Progress': ['Resolved'],
            'Resolved': ['Closed'],
        }
        const currentStatus = ticket.status

        if (!allowedTransitions[currentStatus] || !allowedTransitions[currentStatus].includes(newStatus)) {
            return res.status(400).json({
                msg: `Cannot change status from ${currentStatus} to ${newStatus}`
            })
        }
        if (newStatus === 'Resolved' && (!resolutionNote || resolutionNote.trim() === '')) {
            return res.status(400).json({ msg: "Resolution Note is Required to resolve a ticket" })
        }

        ticket.status = newStatus

        if (newStatus === 'Resolved') {
            ticket.resolution = resolutionNote
        }

        const historyRecord = await StatusHistory.create({
            ticket: ticket._id,
            oldStatus: currentStatus,
            newStatus: newStatus,
            changedBy: req.user.id
        })
        await ticket.save()


        res.status(200).json({ msg: "Status updated", ticket })

    } catch (error) {
        next(error)
    }
}
const getStatusHistory = async (req, res, next) => {
    try {
        const { id: ticketId } = req.params
        const ticket = await ticketModel.findById(ticketId)
        if (!ticket) {
            return res.status(404).json({ msg: "Ticket not found" })
        }
        const userId = req.user.id.toString()
        const isRequester = ticket.requester.toString() === userId
        const isAssignedAgent = ticket.assignedAgent?.toString() === userId
        const isAdmin = req.user.role === "admin"

        if (!isRequester && !isAssignedAgent && !isAdmin) {
            return res.status(403).json({ msg: "Not authorized to see the Status History" })
        }
        const history = await StatusHistory.find({ ticket: ticketId }).sort({ createdAt: 1 }).populate('changedBy', 'name')

        return res.status(200).json({ history })
    } catch (error) {
        next(error)
    }
}

const updateTicketPriority = async (req, res, next) => {
    try {
        const ticket = await ticketModel.findById(req.params.id)
        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' })
        }
        const isAssignedAgent = ticket.assignedAgent?.toString() === req.user.id
        const isAdmin = req.user.role === 'admin'

        if (!isAssignedAgent && !isAdmin) {
            return res.status(403).json({ msg: 'Not authorized to change priority' })
        }
        const { priority } = req.body
        const validPriorities = ['Low', 'Medium', 'High']
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({ msg: 'Invalid Priority' })
        }
        ticket.priority = priority
        await ticket.save()
        return res.status(200).json({ msg: "Priority updated", ticket })
    } catch (error) {
        next(error)
    }
}


const reopenTicket = async (req, res, next) => {
    try {
        const { id: ticketId } = req.params
        const ticket = await ticketModel.findById(ticketId)
        if (!ticket) {
            return res.status(404).json({ msg: "Ticket not found" })
        }
        if (ticket.status !== "Closed") {
            return res.status(400).json({ msg: "Only Closed tickets can reopen" })
        }
        const userId = req.user.id.toString()
        const isRequester = ticket.requester.toString() === userId
        const isAdmin = req.user.role === "admin"

        if (!isRequester && !isAdmin) {
            return res.status(403).json({ msg: "Not Authorized to reopen this ticket" })
        }

        const oldStatus = ticket.status
        const newStatus = "Open"
        ticket.status = newStatus
        await ticket.save()

        const historyRecord = await StatusHistory.create({
            ticket: ticketId,
            oldStatus: oldStatus,
            newStatus: newStatus,
            changedBy: userId
        })
        return res.status(200).json({ msg: "Ticket Reopened Successfully", ticket })

    } catch (error) {
        next(error)
    }
}

const getdashboardStats = async (req, res, next) => {
    try {
        let filter = {}
        if (req.user.role === 'requester') {
            filter = { requester: req.user.id }
        } else if (req.user.role === 'agent') {
            filter = { assignedAgent: req.user.id }
        }
        const totalCount = await ticketModel.countDocuments(filter)
        const openCount = await ticketModel.countDocuments({ ...filter, status: 'Open' })
        const resolvedCount = await ticketModel.countDocuments({ ...filter, status: 'Resolved' })
        const overdueCount = await ticketModel.countDocuments({
            ...filter, dueDate: { $lt: new Date() },
            status: { $nin: ['Resolved', 'Closed'] }
        })
        const priorityGroups = await ticketModel.aggregate([
            { $match: filter },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ])

        res.status(200).json({
            totalCount,
            openCount,
            resolvedCount,
            overdueCount,
            priorityGroups
        })

    } catch (error) {
        next(error)
    }
}

module.exports = { createTicket, getAllTickets, getSingleTicket, assignTicket, updateTicketStatus, getStatusHistory, updateTicketPriority, reopenTicket, getdashboardStats }
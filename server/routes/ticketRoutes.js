const express = require("express")

const router = express.Router()

const { createTicket, getAllTickets, getSingleTicket, assignTicket, updateTicketStatus, getStatusHistory, reopenTicket, getdashboardStats, updateTicketPriority } = require("../controllers/ticket")

const { addComment, getCommentsbyTicket, deleteComment } = require("../controllers/comment")

const protect = require("../middleware/authMiddleware")

router.post('/tickets', protect, createTicket)

router.get('/tickets', protect, getAllTickets)

router.get('/tickets/dashboard', protect, getdashboardStats)

router.get('/tickets/:id', protect, getSingleTicket)

router.patch('/tickets/:id/assign', protect, assignTicket)

router.patch('/tickets/:id/status', protect, updateTicketStatus)

router.patch('/tickets/:id/priority', protect, updateTicketPriority)

router.get('/tickets/:id/status-history', protect, getStatusHistory)

router.patch('/tickets/:id/reopen', protect, reopenTicket)


// Comment Controller ke routes

router.post('/tickets/:id/comments', protect, addComment)

router.get('/tickets/:id/comments', protect, getCommentsbyTicket)

router.delete('/tickets/:id/comments', protect, deleteComment)

module.exports = router
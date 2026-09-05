const Comment = require("../models/Comment")
const ticketModel = require("../models/Ticket")
const userModel = require("../models/User")

const addComment = async (req, res, next) => {
    try {
        const { id: ticketId } = req.params
        const { message, isInternal } = req.body

        const ticket = await ticketModel.findById(ticketId)
        if (!ticket) {
            return res.status(404).json({ msg: "Ticket not found" })
        }

        const userId = req.user.id.toString()
        const isRequester = ticket.requester.toString() === userId
        const isAssignedAgent = ticket.assignedAgent?.toString() === userId
        const isAdmin = req.user.role === "admin"

        if (!isRequester && !isAssignedAgent && !isAdmin) {
            return res.status(403).json({ msg: "Not authorized to comment on this ticket" })
        }
        let finalIsInternal = false

        if (isInternal === true) {
            if (isRequester) {
                return res.status(403).json({ msg: "Requesters can't create internal comments" })
            }
            finalIsInternal = true
        }

        const newComment = await Comment.create({
            ticket: ticketId,
            author: req.user.id,
            message,
            isInternal: finalIsInternal,
        })
        return res.status(201).json({ msg: "Comment added", comment: newComment })
    }
    catch (error) {
        next(error)
    }
}

const getCommentsbyTicket = async (req, res, next) => {
    try {
        const ticket = await ticketModel.findById(req.params.id)
        if (!ticket) {
            return res.status(404).json({ msg: "Ticket not found" })
        }

        const userId = req.user.id.toString()
        const isRequester = ticket.requester.toString() === userId
        const isAssignedAgent = ticket.assignedAgent?.toString() === userId
        const isAdmin = req.user.role === "admin"

        if (!isRequester && !isAssignedAgent && !isAdmin) {
            return res.status(403).json({ msg: "Not authorized to see the comments" })
        }
        let filter = { ticket: req.params.id }

        if (isRequester) {
            filter.isInternal = false
        }
        const comments = await Comment.find(filter).sort({ createdAt: 1 }).populate('author', 'name')
        return res.status(200).json({ comments })
    } catch (error) {
        next(error)
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const { id: commentId } = req.params
        const comment = await Comment.findById(commentId)
        if (!comment) {
            return res.status(404).json({ msg: "Comment not found" })
        }

        const userId = req.user.id.toString()
        const isOwner = comment.author.toString() === userId
        const isAdmin = req.user.role === "admin"

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ msg: "You are not allowed to delete this comment" })
        }
        const deletedComment = await Comment.findByIdAndDelete(commentId)
        return res.status(200).json({ msg: "Comment has been deleted" })
    } catch (error) {
        next(error)
    }
}

module.exports = { addComment, getCommentsbyTicket, deleteComment }
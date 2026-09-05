import React, { useEffect, useState } from 'react'
import { Button, Form, Badge } from 'react-bootstrap'
import { theme } from '../../theme'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { motion, AnimatePresence } from 'framer-motion'

function CommentSection({ ticketId }) {
    const { user } = useAuth()
    const [comments, setComments] = useState([])
    const [message, setMessage] = useState("")
    const [isInternal, setIsInternal] = useState(false)
    const [expanded, setExpanded] = useState(false)

    async function fetchComments() {
        try {
            const token = localStorage.getItem('token')
            const res = await api.get(`/api/tickets/${ticketId}/comments`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setComments(res.data.comments)
        } catch (error) {
            console.log(error)
        }
    }

    async function submitHandler(e) {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            await api.post(`/api/tickets/${ticketId}/comments`, { message, isInternal }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setMessage("")
            setIsInternal(false)
            fetchComments()
        } catch (error) {
            console.log(error)
        }
    }
    console.log(comments)
    useEffect(() => {
        fetchComments()
    }, [ticketId])

    return (
        <div>
            <Form onSubmit={submitHandler}>
                <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Write a comment..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ borderRadius: '10px' }}
                />
                <div className="d-flex justify-content-between align-items-center mt-2">
                    {(user.role === 'agent' || user.role === 'admin') ? (
                        <Form.Switch
                            label="Internal Note"
                            checked={isInternal}
                            onChange={(e) => setIsInternal(e.target.checked)}
                            style={{ fontSize: '13px' }}
                        />
                    ) : <span />}
                    <Button type='submit' style={{ backgroundColor: theme.accent, border: 'none', borderRadius: '8px' }}>
                        Add Comment
                    </Button>
                </div>
            </Form>
            <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => setExpanded(!expanded)}
            >
                <h6 style={{ color: theme.primary, fontWeight: 600, margin: 0 }}>
                    Comments <span style={{ color: theme.textMuted, fontWeight: 400, fontSize: '13px' }}>({comments.length})</span>
                </h6>
                {expanded ? <BsChevronUp color={theme.textMuted} /> : <BsChevronDown color={theme.textMuted} />}
            </div>
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="d-flex flex-column gap-3 mt-3">
                            {comments.length === 0 ? (
                                <p className="text-muted" style={{ fontSize: '14px' }}>No comments yet.</p>
                            ) : (
                                comments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className="p-3"
                                        style={{
                                            backgroundColor: comment.isInternal ? '#fef9e7' : theme.bgLight,
                                            borderRadius: '10px',
                                            fontSize: '14px'
                                        }}
                                    >
                                        <div className="d-flex justify-content-between align-items-start">
                                            <span style={{ color: theme.textMuted, fontSize: '12px' }}>
                                                {comment.author?.name}
                                            </span>
                                            <span style={{ color: theme.primary }}>{comment.message}</span>
                                            {comment.isInternal && (
                                                <Badge bg={null} style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: '11px', flexShrink: 0 }} className="ms-2">
                                                    Internal
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    )
}

export default CommentSection
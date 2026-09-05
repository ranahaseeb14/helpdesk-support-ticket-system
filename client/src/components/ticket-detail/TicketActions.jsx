import React, { useEffect, useState } from 'react'
import { Button, Form, Badge } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { theme, getPriorityStyle } from '../../theme'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const allowedTransitions = {
    'Open': ['Assigned'],
    'Assigned': ['In Progress'],
    'In Progress': ['Resolved'],
    'Resolved': ['Closed']
}

function TicketActions({ ticket, ticketId, onUpdate }) {
    const { user } = useAuth()
    const [agents, setAgents] = useState([])
    const [expanded, setExpanded] = useState(false)
    const priorityStyle = getPriorityStyle(ticket?.priority)

    async function fetchAgents() {
        try {
            const token = localStorage.getItem('token')
            const res = await api.get(`/api/users/agents`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setAgents(res.data.agents)
        } catch (error) {
            console.log(error)
        }
    }
    async function handleAssign(agentId) {
        try {
            const token = localStorage.getItem('token')
            await api.patch(`/api/tickets/${ticketId}/assign`, { agentId }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            onUpdate()
        } catch (error) {
            console.log(error)
        }
    }
    async function handleStatusChange(newStatus) {
        try {
            const token = localStorage.getItem('token')
            let resolutionNote = ""
            if (newStatus === 'Resolved') {
                resolutionNote = prompt("Please Write Resolution Note:")
                if (!resolutionNote) return
            }
            await api.patch(`/api/tickets/${ticketId}/status`, { status: newStatus, resolutionNote }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            onUpdate()
        } catch (error) {
            console.log(error)
        }
    }
    async function handlePriorityChange(newPriority) {
        try {
            const token = localStorage.getItem('token')
            await api.patch(`/api/tickets/${ticketId}/priority`, { priority: newPriority }, { headers: { Authorization: `Bearer ${token}` } })
            onUpdate()
        } catch (error) {
            console.log(error)
        }
    }
    async function handleReopen() {
        try {
            const token = localStorage.getItem('token')
            await api.patch(`/api/tickets/${ticketId}/reopen`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })
            onUpdate()
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchAgents()
    }, [])

    const isAssignedAgent = user.role === 'agent' && ticket.assignedAgent === user._id
    const isAdmin = user.role === 'admin'

    return (
        <div>
            <div
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => setExpanded(!expanded)}
            >
                <h6 style={{ color: theme.primary, fontWeight: 600, margin: 0 }}>Actions</h6>
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

                            {(isAdmin || isAssignedAgent) && ticket.status !== 'Closed' && (
                                <div>
                                    <h6 style={{ color: theme.textMuted, fontWeight: 600, fontSize: '13px' }} className="mb-2">Change Status</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {allowedTransitions[ticket.status]?.map((nextStatus) => (
                                            <motion.span key={nextStatus} whileTap={{ scale: 0.95 }} style={{ display: 'inline-block' }}>
                                                <Button
                                                    onClick={() => handleStatusChange(nextStatus)}
                                                    style={{ backgroundColor: theme.accent, border: 'none', borderRadius: '8px' }}
                                                    size="sm"
                                                >
                                                    Mark as {nextStatus}
                                                </Button>
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(isAdmin || isAssignedAgent) && (
                                <div>
                                    <h6 style={{ color: theme.textMuted, fontWeight: 600, fontSize: '13px' }} className="mb-2">Priority</h6>
                                    <div className="d-flex align-items-center gap-2">
                                        <Badge bg={null} style={{
                                            backgroundColor: priorityStyle.bg,
                                            color: priorityStyle.text,
                                            fontSize: '13px',
                                            padding: '6px 12px',
                                            borderRadius: '8px'
                                        }}>
                                            {ticket.priority}
                                        </Badge>
                                        <Form.Select
                                            onChange={(e) => handlePriorityChange(e.target.value)}
                                            defaultValue=""
                                            style={{ borderRadius: '8px', maxWidth: '180px' }}
                                            size="sm"
                                        >
                                            <option value="" disabled>Change Priority</option>
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </Form.Select>
                                    </div>
                                </div>
                            )}

                            {isAdmin && ticket.status !== 'Closed' && (
                                <div>
                                    <h6 style={{ color: theme.textMuted, fontWeight: 600, fontSize: '13px' }} className="mb-2">Assign Agent</h6>
                                    <Form.Select
                                        onChange={(e) => handleAssign(e.target.value)}
                                        defaultValue=""
                                        style={{ borderRadius: '8px', maxWidth: '220px' }}
                                        size="sm"
                                    >
                                        <option value="" disabled>Select Agent</option>
                                        {agents.map((agent) => (
                                            <option key={agent._id} value={agent._id}>{agent.name}</option>
                                        ))}
                                    </Form.Select>
                                </div>
                            )}

                            {ticket.status === 'Closed' && (user._id === ticket.requester || isAdmin) && (
                                <div>
                                    <Button onClick={handleReopen} size="sm" style={{ backgroundColor: theme.accent, border: 'none', borderRadius: '8px' }}>
                                        Reopen Ticket
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default TicketActions
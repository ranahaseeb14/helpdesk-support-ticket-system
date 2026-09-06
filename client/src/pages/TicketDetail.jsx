import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, Badge, Spinner, Modal, Button, Form } from 'react-bootstrap'
import { motion } from 'framer-motion'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { theme, getStatusStyle, getPriorityStyle } from '../theme'
import Layout from '../components/Layout'
import CommentSection from '../components/ticket-detail/CommentSection'
import TicketActions from '../components/ticket-detail/TicketActions'
import StatusHistoryTimeline from '../components/ticket-detail/StatusHistoryTimeline'

function TicketDetail() {
    const { user } = useAuth()
    const { id } = useParams()
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editForm, setEditForm] = useState({ title: '', description: '', priority: '' })

    const statusStyle = getStatusStyle(ticket?.status)
    const priorityStyle = getPriorityStyle(ticket?.priority)

    function openEditModal() {
        setEditForm({ title: ticket.title, description: ticket.description, priority: ticket.priority })
        setShowEditModal(true)
    }


    async function fetchTicket() {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await api.get(`/api/tickets/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTicket(res.data.ticket)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpdateTicket(e) {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            await api.patch(`/api/tickets/${id}`, editForm, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setShowEditModal(false)
            fetchTicket()
        } catch (error) {
            alert(error.response?.data?.msg || "Something went wrong")
        }
    }

    useEffect(() => {
        fetchTicket()
    }, [id])
    return (
        <Layout hideFooter>
            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                    <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '14px' }}>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                                <div>
                                    <h3>{ticket.ticketNo}</h3>
                                    <h5 className="text-muted">{ticket.title}</h5>
                                </div>
                                <div>
                                    {ticket.requester === user._id && ticket.status !== 'Closed' && (
                                        <Button size="sm" variant="outline-secondary" onClick={openEditModal} className="mt-2">
                                            Edit Ticket
                                        </Button>
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    <motion.div key={ticket.status} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                        <Badge bg={null} style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, fontSize: '13px', padding: '6px 12px', borderRadius: '8px' }}>
                                            {ticket.status}
                                        </Badge>
                                    </motion.div>
                                    <Badge bg={null} style={{ backgroundColor: priorityStyle.bg, color: priorityStyle.text, fontSize: '13px', padding: '6px 12px', borderRadius: '8px' }}>
                                        {ticket.priority}
                                    </Badge>
                                </div>
                            </div>
                            <hr />
                            <p>{ticket.description}</p>

                            {ticket.dueDate && <p className="text-muted small">Due: {new Date(ticket.dueDate).toLocaleDateString()}</p>}
                            {ticket.resolution && (
                                <div className="alert alert-success mt-2">
                                    <strong>Resolution:</strong> {ticket.resolution}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                    <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '14px' }}>
                        <Card.Body>
                            <CommentSection ticketId={id} user={user} />
                        </Card.Body>
                        <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '14px' }}>
                            <Card.Body>
                                <StatusHistoryTimeline ticketId={id} />
                            </Card.Body>
                        </Card>
                    </Card>
                    {user.role === 'agent' || user.role === 'admin' ? (
                        <Card className="border-0 shadow-sm mb-3" style={{ borderRadius: '14px' }}>
                            <Card.Body>
                                <TicketActions ticket={ticket} user={user} ticketId={id} onUpdate={fetchTicket} />
                            </Card.Body>
                        </Card>
                    ) : null}
                </>
            )}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateTicket}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            />
                        </Form.Group>
                        <Button type="submit" style={{ backgroundColor: theme.accent, border: 'none' }}>
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Layout>
    )
}
export default TicketDetail
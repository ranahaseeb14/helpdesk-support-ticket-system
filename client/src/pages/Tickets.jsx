import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Badge, Spinner, Button, Row, Col, Pagination } from 'react-bootstrap'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { theme, getStatusStyle, getPriorityStyle } from '../theme'
import { BsSearch, BsPlusLg } from 'react-icons/bs'

function Tickets() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [priorityFilter, setPriorityFilter] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    async function fetchTickets() {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await api.get(`/api/tickets`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    status: statusFilter,
                    priority: priorityFilter,
                    page,
                    limit: 20
                }
            })
            setTickets(res.data.tickets)
            setTotalPages(res.data.totalPages)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchTickets()
    }, [statusFilter, priorityFilter, page])

    function handleStatusChange(value) {
        setStatusFilter(value)
        setPage(1)
    }

    function handlePriorityChange(value) {
        setPriorityFilter(value)
        setPage(1)
    }

    const displayedTickets = tickets.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.ticketNo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return (
        <Layout>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h4 style={{ color: theme.primary, fontWeight: 600 }}>Tickets</h4>
                {user.role === 'requester' && (
                    <Button
                        style={{ backgroundColor: theme.accent, border: 'none' }}
                        onClick={() => navigate('/create-tickets')}
                    >
                        <BsPlusLg className="me-1" /> Create Ticket
                    </Button>
                )}
            </div>
            <Row className="g-2 mb-4">
                <Col md={6}>
                    <div className="position-relative">
                        <BsSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted }} />
                        <Form.Control
                            placeholder="Search by title or ticket number..."
                            style={{ paddingLeft: '36px', borderRadius: '10px' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </Col>
                <Col md={3}>
                    <Form.Select style={{ borderRadius: '10px' }} value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)}>
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </Form.Select>
                </Col>
                <Col md={3}>
                    <Form.Select style={{ borderRadius: '10px' }} value={priorityFilter} onChange={(e) => handlePriorityChange(e.target.value)}>
                        <option value="">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </Form.Select>
                </Col>
            </Row>
            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" style={{ color: theme.accent }} />
                </div>
            ) : displayedTickets.length === 0 ? (
                <p className="text-muted mt-4 text-center">No tickets match your filters.</p>
            ) : (
                <div className="d-flex flex-column gap-2">
                    {displayedTickets.map((t, index) => {
                        const statusStyle = getStatusStyle(t.status)
                        const priorityStyle = getPriorityStyle(t.priority)
                        return (
                            <motion.div
                                key={t._id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                whileHover={{ backgroundColor: '#f8fafc' }}
                            >
                                <Link to={`/ticket/${t._id}`} className="text-decoration-none text-dark">
                                    <div
                                        className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-3"
                                        style={{ border: `1px solid ${theme.border}`, borderRadius: '12px', backgroundColor: 'white' }}
                                    >
                                        <div>
                                            <div style={{ fontSize: '13px', color: theme.textMuted }}>{t.ticketNo}</div>
                                            <div style={{ fontWeight: 600, color: theme.primary }}>{t.title}</div>
                                        </div>
                                        <div className="d-flex gap-2 align-items-center">
                                            <Badge bg='null' style={{
                                                backgroundColor: priorityStyle.bg,
                                                color: priorityStyle.text,
                                                fontWeight: 500,
                                                fontSize: '13px',
                                                padding: '6px 12px',
                                                borderRadius: '8px'
                                            }}>
                                                {t.priority}
                                            </Badge>
                                            <Badge bg='null' style={{
                                                backgroundColor: statusStyle.bg,
                                                color: statusStyle.text,
                                                fontWeight: 500,
                                                fontSize: '13px',
                                                padding: '6px 12px',
                                                borderRadius: '8px'
                                            }}>
                                                {t.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        )
                    })}
                </div>
            )}
            {!loading && totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                        <Pagination.Prev
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            style={{
                                border: `1px solid ${theme.border}`,
                                color: page === 1 ? theme.textMuted : theme.primary,
                                borderRadius: '8px',
                                marginRight: '6px'
                            }}
                        />
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                            <Pagination.Item
                                key={num}
                                active={num === page}
                                onClick={() => setPage(num)}
                                style={{
                                    backgroundColor: num === page ? theme.accent : 'white',
                                    color: num === page ? 'white' : theme.primary,
                                    border: `1px solid ${num === page ? theme.accent : theme.border}`,
                                    borderRadius: '8px',
                                    marginRight: '6px'
                                }}
                            >
                                {num}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            style={{
                                border: `1px solid ${theme.border}`,
                                color: page === totalPages ? theme.textMuted : theme.primary,
                                borderRadius: '8px'
                            }}
                        />
                    </Pagination>
                </div>
            )}
        </Layout>
    )
}

export default Tickets
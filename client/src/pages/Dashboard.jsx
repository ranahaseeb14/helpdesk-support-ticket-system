import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Card, Row, Col, Spinner } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { theme } from '../theme'
import api from '../api/axios'
import { BsTicketPerforated, BsExclamationCircle, BsCheckCircle, BsClockHistory } from 'react-icons/bs'

function Dashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    async function fetchStats() {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await api.get(`/api/tickets/dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setStats(res.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchStats()
    }, [])
    const cards = [
        { label: 'Total Tickets', value: stats?.totalCount ?? 0, icon: <BsTicketPerforated size={22} /> },
        { label: 'Open', value: stats?.openCount ?? 0, icon: <BsExclamationCircle size={22} /> },
        { label: 'Resolved', value: stats?.resolvedCount ?? 0, icon: <BsCheckCircle size={22} /> },
        { label: 'Overdue', value: stats?.overdueCount ?? 0, icon: <BsClockHistory size={22} /> },
    ]
    return (
        <Layout>
            <h4 className="mb-4" style={{ color: theme.primary, fontWeight: 600 }}>Overview</h4>
            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" style={{ color: theme.accent }} />
                </div>
            ) : (
                <>
                    <Row className="g-3">
                        {cards.map((card, index) => (
                            <Col md={3} sm={6} key={card.label}>
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
                                    whileHover={{ y: -3 }}
                                >
                                    <Card
                                        className="border-0 shadow-sm"
                                        style={{ borderRadius: '14px', borderLeft: `4px solid ${card.accent}` }}
                                    >
                                        <Card.Body className="d-flex align-items-center gap-3">
                                            <div
                                                style={{
                                                    width: '42px',
                                                    height: '42px',
                                                    borderRadius: '10px',
                                                    backgroundColor: `${card.accent}15`,
                                                    color: card.accent,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '20px'
                                                }}
                                            >
                                                {card.icon}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '22px', fontWeight: 700, color: theme.primary }}>{card.value}</div>
                                                <div style={{ fontSize: '13px', color: theme.textMuted }}>{card.label}</div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </motion.div>
                            </Col>
                        ))}
                    </Row>

                    {stats?.priorityGroups?.length > 0 && (
                        <Card className="border-0 shadow-sm mt-4" style={{ borderRadius: '14px' }}>
                            <Card.Body>
                                <h6 style={{ color: theme.primary, fontWeight: 600 }} className="mb-3">Tickets by Priority</h6>
                                <div className="d-flex gap-4 flex-wrap">
                                    {stats.priorityGroups.map((group) => (
                                        <div key={group._id} className="d-flex align-items-center gap-2">
                                            <span style={{ fontSize: '13px', color: theme.textMuted }}>{group._id}</span>
                                            <span style={{ fontWeight: 700, color: theme.primary }}>{group.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </>
            )}
        </Layout>
    )
}

export default Dashboard

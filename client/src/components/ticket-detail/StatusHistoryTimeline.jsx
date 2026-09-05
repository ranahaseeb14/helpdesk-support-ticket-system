import React, { useEffect, useState } from 'react'
import { theme } from '../../theme'
import api from '../../api/axios'
import { BsArrowRight, BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { motion, AnimatePresence } from 'framer-motion'

function StatusHistoryTimeline({ ticketId }) {
    const [history, setHistory] = useState([])
    const [expanded, setExpanded] = useState(false)

    async function fetchHistory() {
        try {
            const token = localStorage.getItem('token')
            const res = await api.get(`/api/tickets/${ticketId}/status-history`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setHistory(res.data.history)
        } catch (error) {
            console.log(error)
        }
    }
    console.log(history)
    useEffect(() => {
        fetchHistory()
    }, [ticketId])

    return (
        <div>
            <div
                className="d-flex justify-content-b etween align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => setExpanded(!expanded)}
            >
                <h6 style={{ color: theme.primary, fontWeight: 600, margin: 0 }}>
                    Status History <span style={{ color: theme.textMuted, fontWeight: 400, fontSize: '13px' }}>({history.length})</span>
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
                            {history.length === 0 ? (
                                <p className="text-muted" style={{ fontSize: '14px' }}>No status changes yet.</p>
                            ) : (
                                history.map((entry) => (
                                    <div key={entry._id} className="d-flex align-items-center gap-2" style={{ fontSize: '14px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: theme.accent, flexShrink: 0 }} />
                                        <span style={{ color: theme.textMuted }}>{entry.oldStatus}</span>
                                        <BsArrowRight style={{ color: theme.textMuted }} />
                                        <span style={{ fontWeight: 600, color: theme.primary }}>{entry.newStatus}</span>
                                        <span style={{ color: theme.textMuted, fontSize: '12px' }}>
                                            • {entry.changedBy?.name || "Unknown"} • {new Date(entry.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default StatusHistoryTimeline
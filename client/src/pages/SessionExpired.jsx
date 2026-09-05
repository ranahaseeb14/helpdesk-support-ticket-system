import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { theme } from '../theme'
import { BsExclamationCircle } from 'react-icons/bs'

function SessionExpired() {
    const navigate = useNavigate()

    return (
        <motion.div
            className='container d-flex justify-content-center align-items-center'
            style={{ minHeight: '100vh' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <Card className="border-0 shadow-sm text-center" style={{ width: '400px', borderRadius: '16px' }}>
                <Card.Body className="p-4">
                    <BsExclamationCircle size={40} color={theme.accent} className="mb-3" />
                    <h5 style={{ color: theme.primary, fontWeight: 600 }}>Session Expired</h5>
                    <p style={{ color: theme.textMuted, fontSize: '14px' }}>
                        Please log in again to continue.
                    </p>
                    <Button
                        onClick={() => navigate('/')}
                        style={{ backgroundColor: theme.accent, border: 'none', borderRadius: '10px', padding: '8px 24px' }}
                    >
                        Login Again
                    </Button>
                </Card.Body>
            </Card>
        </motion.div>
    )
}

export default SessionExpired
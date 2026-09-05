import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { theme } from '../theme'

function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{
                borderTop: `1px solid ${theme.border}`,
                backgroundColor: theme.bgLight,
                padding: '14px 0',
                marginTop: '40px'
            }}
        >
            <div
                className="container d-flex justify-content-between align-items-center flex-column flex-sm-row gap-2 text-center text-sm-start"
                style={{ fontSize: '13px', color: theme.textMuted }}
            >
                <span>© 2026 HelpDesk Pro</span>

                <div className="d-flex gap-3 align-items-center">
                    <Link to="#" style={{ color: theme.textMuted, textDecoration: 'none' }}
                        onMouseEnter={(e) => e.target.style.color = theme.accent}
                        onMouseLeave={(e) => e.target.style.color = theme.textMuted}>
                        Support
                    </Link>
                    <Link to="#" style={{ color: theme.textMuted, textDecoration: 'none' }}
                        onMouseEnter={(e) => e.target.style.color = theme.accent}
                        onMouseLeave={(e) => e.target.style.color = theme.textMuted}>
                        Privacy
                    </Link>
                    <span>v1.0</span>
                </div>
            </div>
        </motion.footer>
    )
}

export default Footer
import React from 'react'
import { Navbar as BsNavbar, Nav, Container, Button, Badge } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { theme } from '../theme'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    function logoutHandler() {
        logout()
        navigate('/')
    }
    function isActive(path) {
        return location.pathname === path
    }
    const linkStyle = (path) => ({
        color: isActive(path) ? theme.accentLight : '#cbd5e1',
        fontWeight: isActive(path) ? 600 : 400,
        borderBottom: isActive(path) ? `2px solid ${theme.accentLight}` : '2px solid transparent',
        paddingBottom: '4px'
    })
    const initials = user.name?.charAt(0).toUpperCase()

    return (
        <BsNavbar
            expand="lg"
            variant="dark"
            fixed="top"
            style={{
                backgroundColor: 'rgba(30, 27, 75, 0.85)',
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${theme.border}30`,
                zIndex: 1030
            }}
        >
            <Container>
                <BsNavbar.Brand as={Link} to="/dashboard" className="fw-bold">
                    🎫 Helpdesk
                </BsNavbar.Brand>

                <BsNavbar.Toggle aria-controls="main-navbar" />

                <BsNavbar.Collapse id="main-navbar">
                    <Nav className="ms-auto align-items-lg-center gap-lg-4">
                        <Nav.Link as={Link} to="/tickets" style={linkStyle('/tickets')}>Tickets</Nav.Link>

                        {user.role === 'requester' && (
                            <Nav.Link as={Link} to="/create-tickets" style={linkStyle('/create-tickets')}>Create Ticket</Nav.Link>
                        )}

                        {user.role === 'admin' && (
                            <>
                                <Nav.Link as={Link} to="/manage-users" style={linkStyle('/manage-users')}>Manage Users</Nav.Link>
                                <Nav.Link as={Link} to="/manage-categories" style={linkStyle('/manage-categories')}>Categories</Nav.Link>
                            </>
                        )}

                        <div className="d-flex align-items-center gap-2 ms-lg-3 mt-2 mt-lg-0">
                            <div
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: theme.accent,
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    fontWeight: 600
                                }}
                            >
                                {initials}
                            </div>
                            <div className="d-none d-lg-block">
                                <div style={{ fontSize: '13px', color: 'white' }}>{user.name}</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'capitalize' }}>{user.role}</div>
                            </div>
                            <Button variant="outline-light" size="sm" onClick={logoutHandler}>Logout</Button>
                        </div>
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    )
}

export default Navbar
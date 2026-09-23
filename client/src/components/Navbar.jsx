import React, { useEffect, useState } from 'react'
import { Navbar as BsNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { theme } from '../theme'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isSticky, setIsSticky] = useState(false)

    useEffect(() => {
        function handleScroll() {
            setIsSticky(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    function logoutHandler() {
        logout()
        navigate('/')
    }
    function isActive(path) {
        return location.pathname === path
    }
    const linkStyle = (path) => ({
        color: isActive(path) ? theme.accentLight : 'white',
        fontWeight: isActive(path) ? 600 : 400,
        borderBottom: isActive(path) ? `2px solid ${theme.accentLight}` : '2px solid transparent',
        paddingBottom: '4px'
    })
    const initials = user.name?.charAt(0).toUpperCase()

    return (
        <BsNavbar
            expand="lg"
            variant="dark"
            style={{
                backgroundColor: isSticky ? 'rgba(30, 27, 75, 0.79)' : 'rgba(30, 27, 75, 0.85)',
                backdropFilter: 'blur(10px)',
                borderBottom: `1px solid ${theme.border}30`,
                zIndex: 1030,
                position: 'fixed',
                top: isSticky ? 0 : '40px',
                left: isSticky ? 0 : '70px',
                right: isSticky ? 0 : '70px',
                transition: 'top 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), border-radius 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), padding 0.5s ease, box-shadow 0.5s ease',
                boxShadow: isSticky ? '0 4px 12px rgba(0,0,0,0.3)' : 'none',
                padding: isSticky ? '16px 15px' : '16px 15px',
                borderRadius: isSticky ? '0 0 30px 30px' : '35px'
            }}
        >
            <Container className='d-flex justify-content-between align-items-center w-100'>
                <BsNavbar.Brand as={Link} to="/dashboard" className="fw-bold m-0">
                    🎫 Helpdesk
                </BsNavbar.Brand>

                <BsNavbar.Toggle aria-controls="main-navbar" />

                <BsNavbar.Collapse id="main-navbar">
                    <div className='d-lg-flex justify-content-lg-between align-items-center w-100 ms-lg-4'>
                        <Nav className="mx-auto text-center gap-lg-4">
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
                        </Nav>
                        <Dropdown align="end">
                            <Dropdown.Toggle
                                as="div"
                                id='profile-dropdown'
                                style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                <div className='d-flex align-items-center justify-content-center'
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: theme.accent,
                                        color: 'white',
                                        fontSize: '14px',
                                        fontWeight: 600
                                    }}
                                >
                                    {initials}
                                </div>
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ minWidth: '200px' }}>
                                <div className='px-3 py-2'>
                                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{user.name}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>{user.role}</div>
                                </div>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={logoutHandler}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    )
}

export default Navbar
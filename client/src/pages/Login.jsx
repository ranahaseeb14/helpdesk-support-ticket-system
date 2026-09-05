import React, { useState } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { Form, Button, Card, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { theme } from '../theme'
import { motion } from 'framer-motion'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [authData, setAuthData] = useState({
        email: "",
        password: ""
    })
    function changeHandler(e) {
        const name = e.target.name
        const value = e.target.value
        setAuthData({ ...authData, [name]: value })
    }
    async function submitHandler(e) {
        e.preventDefault()
        if (!authData.email || !authData.password) {
            setError("Please fill in all fields")
            return
        }
        try {
            setLoading(true)
            const res = await api.post(`/api/login`, authData)
            login(res.data.user, res.data.token)
            setAuthData({
                email: "",
                password: ""
            })
            const redirectPath = localStorage.getItem('redirectAfterLogin')
            localStorage.removeItem('redirectAfterLogin')
            navigate(redirectPath || '/dashboard')
        } catch (error) {
            setError(error.response?.data?.msg || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <motion.div
                className='container d-flex justify-content-center align-items-center'
                style={{ minHeight: '100vh' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}>
                <Card className="border-0 shadow-sm" style={{ width: '450px', borderRadius: '16px' }}>
                    <Card.Body className='p-4'>
                        <h2 className='text-center mb-4' style={{ color: theme.primary, fontWeight: 700 }}>Login Here</h2>
                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control style={{ borderRadius: '10px', border: `1px solid ${theme.border}` }} type="email" placeholder="example@email.com" name='email' value={authData.email} onChange={changeHandler} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                                <Form.Label>Password</Form.Label>
                                <div className="d-flex align-items-center position-relative">
                                    <Form.Control
                                        style={{ borderRadius: '10px', border: `1px solid ${theme.border}` }}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        name='password'
                                        value={authData.password}
                                        onChange={changeHandler}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ position: 'absolute', right: '12px', cursor: 'pointer' }}
                                    >
                                        {showPassword ? <BsEyeSlash /> : <BsEye />}
                                    </span>
                                </div>
                            </Form.Group>
                            <p>Don't have an account? Please <Link to="/register">Register</Link></p>
                            <Button
                                type='submit'
                                className='w-100 mt-3' disabled={loading}
                                style={{ backgroundColor: theme.accent, border: 'none', borderRadius: '10px', padding: '10px', boxShadow: `0 2px 8px ${theme.accent}40` }}
                            >{loading ? <Spinner animation="border" size="sm" /> : "Login"}</Button>
                            {error && <p className='text-danger mt-3' style={{ fontSize: '14px' }}>{error}</p>}
                        </Form>
                    </Card.Body>
                </Card>
            </motion.div>
            <Footer />
        </>
    )
}

export default Login

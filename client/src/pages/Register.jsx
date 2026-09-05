import React, { useState } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { Form, Button, Card, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { theme } from '../theme'
import { motion } from 'framer-motion'
import Footer from '../components/Footer'
import api from '../api/axios'

function Register() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [authData, setAuthData] = useState({
        name: "",
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
        if (!authData.name || !authData.email || !authData.password) {
            setError("Please fill in all fields")
            return
        }
        try {
            setLoading(true)
            const res = await api.post(`/api/register`, authData)
            setAuthData({
                name: "",
                email: "",
                password: ""
            })
            navigate('/')
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
                        <h2 className='text-center mb-4' style={{ color: theme.primary, fontWeight: 700 }}>Register Here</h2>
                        <Form onSubmit={submitHandler}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Name</Form.Label>
                                <Form.Control
                                    style={{ borderRadius: '10px', border: `1px solid ${theme.border}` }}
                                    type="text" placeholder="John Doe" name='name' value={authData.name} onChange={changeHandler} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control
                                    style={{ borderRadius: '10px', border: `1px solid ${theme.border}` }}
                                    type="email" placeholder="johndoe@email.com" name='email' value={authData.email} onChange={changeHandler} />
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
                            <p>Already have an account? <Link to="/">Login</Link></p>
                            <Button
                                type='submit' disabled={loading}
                                className='w-100 mt-3'
                                style={{ backgroundColor: theme.accent, border: 'none', borderRadius: '10px', padding: '10px', boxShadow: `0 2px 8px ${theme.accent}40` }}
                            >{loading ? <Spinner animation="border" size="sm" /> : "Register"}</Button>
                            {error && <p className='text-danger mt-3' style={{ fontSize: '14px' }}>{error}</p>}
                        </Form>
                    </Card.Body>
                </Card>
            </motion.div>
            <Footer />
        </>
    )
}

export default Register

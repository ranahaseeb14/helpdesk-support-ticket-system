import React, { useEffect, useState } from 'react'
import { Form, Button, Card, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'
import { theme } from '../theme'
import api from '../api/axios'

function CreateTickets() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    const [error, setError] = useState("")
    const [categories, setCategories] = useState([])
    const [details, setDetails] = useState({
        title: "",
        description: "",
        category: "",
        priority: "",
        dueDate: ""
    })
    function changeHandler(e) {
        const name = e.target.name
        const value = e.target.value
        setDetails({ ...details, [name]: value })
    }
    async function fetchCategories() {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await api.get(`/api/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCategories(res.data.categories)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchCategories()
    }, [])
    async function submitHandler(e) {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const res = await api.post(`/api/tickets`, details, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setDetails({
                title: "",
                description: "",
                category: "",
                priority: ""
            })
            navigate('/dashboard')
        } catch (error) {
            setError(error.response?.data?.msg || "Something went wrong")
        }
    }
    return (
        <Layout>
            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Card className="border-0 shadow-sm mx-auto mt-4" style={{ maxWidth: '600px', borderRadius: '14px' }}>
                    <Card.Body className="p-4 p-md-5">
                        <h3 className="mb-4" style={{ color: theme.primary, fontWeight: 700 }}>Help Desk Request Form</h3>

                        <Form onSubmit={submitHandler}>

                            <Form.Group className="mb-4">
                                <Form.Label style={{ fontWeight: 600, color: theme.primary }}>Title</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. Laptop not turning on"
                                    name="title"
                                    value={details.title}
                                    onChange={changeHandler}
                                    style={{ borderRadius: '8px', border: `1px solid ${theme.border}`, padding: '10px 14px' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label style={{ fontWeight: 600, color: theme.primary }}>What's the issue?</Form.Label>
                                <Form.Select
                                    name="category"
                                    value={details.category}
                                    onChange={changeHandler}
                                    style={{ borderRadius: '8px', border: `1px solid ${theme.border}`, padding: '10px 14px' }}
                                >
                                    <option value="">Please Select</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label style={{ fontWeight: 600, color: theme.primary }}>Priority</Form.Label>
                                <Form.Select
                                    name="priority"
                                    value={details.priority}
                                    onChange={changeHandler}
                                    style={{ borderRadius: '8px', border: `1px solid ${theme.border}`, padding: '10px 14px' }}
                                >
                                    <option value="">Please Select</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label style={{ fontWeight: 600, color: theme.primary }}>Due Date (optional)</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="dueDate"
                                    value={details.dueDate}
                                    onChange={changeHandler}
                                    style={{ borderRadius: '8px', border: `1px solid ${theme.border}`, padding: '10px 14px' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-4">
                                <Form.Label style={{ fontWeight: 600, color: theme.primary }}>Additional Details</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Describe the problem in detail..."
                                    name="description"
                                    value={details.description}
                                    onChange={changeHandler}
                                    style={{ borderRadius: '8px', border: `1px solid ${theme.border}`, padding: '10px 14px' }}
                                />
                            </Form.Group>

                            <div className="text-center mt-4">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        backgroundColor: theme.accent,
                                        border: 'none',
                                        borderRadius: '30px',
                                        padding: '10px 40px',
                                        fontWeight: 600,
                                        letterSpacing: '0.5px',
                                        boxShadow: `0 2px 8px ${theme.accent}40`
                                    }}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : "SEND"}
                                </Button>
                            </div>

                            {error && <p className='text-danger mt-3 text-center' style={{ fontSize: '14px' }}>{error}</p>}
                        </Form>
                    </Card.Body>
                </Card>
            )}
        </Layout>
    )
}

export default CreateTickets

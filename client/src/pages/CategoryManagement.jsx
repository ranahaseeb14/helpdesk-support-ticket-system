import React, { useEffect, useState } from 'react'
import { Form, Button, Table, Spinner, Card } from 'react-bootstrap'
import Layout from '../components/Layout'
import { AnimatePresence, motion } from 'framer-motion'
import { BsChevronDown, BsChevronUp } from 'react-icons/bs'
import { theme } from '../theme'
import api from '../api/axios'

function CategoryManagement() {
    const [category, setCategory] = useState([])
    const [categoryName, setCategoryName] = useState("")
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(false)

    async function fetchCategory() {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await api.get(`/api/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCategory(res.data.categories)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    async function handleCreateCategory(e) {
        e.preventDefault()
        try {
            const token = localStorage.getItem('token')
            const res = await api.post(`/api/categories`, { name: categoryName }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setCategoryName("")
            fetchCategory()
        } catch (error) {
            console.log(error)
        }
    }
    async function handleDeleteCategory(id) {
        const isConfirmed = window.confirm("Are you sure you want to delete this category?")
        if (!isConfirmed) return
        try {
            const token = localStorage.getItem('token')
            const res = await api.delete(`/api/categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchCategory()
        } catch (error) {
            alert(
                error.response?.data?.msg ||
                "Category is in use, cannot delete."
            )
        }
    }
    useEffect(() => {
        fetchCategory()
    }, [])
    return (
        <Layout>
            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                    <h4 style={{ color: theme.primary, fontWeight: 600 }} className="mb-1">Category Management</h4>
                    <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '14px' }}>
                        <Card.Body className="p-4">
                            <h6 style={{ color: theme.primary, fontWeight: 600 }} className="mb-3">Add New Category</h6>
                            <Form onSubmit={handleCreateCategory} className="d-flex gap-2" style={{ maxWidth: '450px' }}>
                                <Form.Control
                                    type="text"
                                    placeholder="e.g. Hardware, Software, Network..."
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    style={{
                                        borderRadius: '10px',
                                        border: `1px solid ${theme.border}`,
                                        padding: '10px 16px',
                                        fontSize: '14px'
                                    }}
                                />
                                <Button
                                    type="submit"
                                    style={{
                                        backgroundColor: theme.accent,
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '10px 20px',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        whiteSpace: 'nowrap',
                                        boxShadow: `0 2px 8px ${theme.accent}40`
                                    }}
                                >
                                    + Add Category
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <Card className="border-0 shadow-sm" style={{ borderRadius: '14px' }}>
                        <Card.Body>
                            <div
                                className="d-flex justify-content-between align-items-center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => setExpanded(!expanded)}
                            >
                                <h6 style={{ color: theme.primary, fontWeight: 600, margin: 0 }}>
                                    All Categories <span style={{ color: theme.textMuted, fontWeight: 400, fontSize: '13px' }}>({category.length})</span>
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
                                        <Table hover className="mb-0 mt-3" style={{ fontSize: '14px' }}>
                                            <thead>
                                                <tr style={{ color: theme.textMuted, fontSize: '13px' }}>
                                                    <th>Category Name</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {category.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={2} className="text-center text-muted">No categories found.</td>
                                                    </tr>
                                                ) : (
                                                    category.map((myCategories, index) => {
                                                        return (
                                                            <motion.tr
                                                                key={myCategories._id}
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                transition={{ delay: index * 0.05 }}
                                                            >
                                                                <td style={{ color: theme.primary, fontWeight: 500 }}>{myCategories.name}</td>
                                                                <td>
                                                                    <motion.span whileHover={{ scale: 1.05 }} style={{ display: 'inline-block' }}>
                                                                        <Button
                                                                            onClick={() => handleDeleteCategory(myCategories._id)}
                                                                            style={{
                                                                                backgroundColor: '#fee2e2',
                                                                                color: '#991b1b',
                                                                                border: 'none',
                                                                                borderRadius: '8px',
                                                                                padding: '5px 14px',
                                                                                fontSize: '13px',
                                                                                fontWeight: 500
                                                                            }}>Delete</Button>
                                                                    </motion.span>
                                                                </td>
                                                            </motion.tr>
                                                        )
                                                    })
                                                )}
                                            </tbody>
                                        </Table>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </Card.Body>
                    </Card>
                </>
            )}
        </Layout>
    )
}

export default CategoryManagement

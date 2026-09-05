import React, { useState } from 'react'
import { useEffect } from 'react'
import { Form, Badge, Table, Spinner, Card } from 'react-bootstrap'
import Layout from '../components/Layout'
import { motion } from 'framer-motion'
import { theme } from '../theme'
import api from '../api/axios'

function ManageUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    async function fetchUsers() {
        try {
            setLoading(true)
            const token = localStorage.getItem('token')
            const res = await api.get(`/api/users`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setUsers(res.data.users)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    async function handleRoleChange(userId, newRole) {
        try {
            const token = localStorage.getItem('token')
            const res = await api.patch(`/api/users/${userId}/role`, { role: newRole }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            fetchUsers()
        } catch (error) {
            console.log(error)
        }
    }
    function getRoleStyle(role) {
        if (role === 'admin') return { bg: '#ede9fe', text: '#5b21b6' }
        if (role === 'agent') return { bg: '#e0e7ff', text: '#3730a3' }
        return { bg: '#f1f5f9', text: '#475569' }
    }
    useEffect(() => {
        fetchUsers()
    }, [])
    return (
        <Layout>
            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                    <h4 style={{ color: theme.primary, fontWeight: 600 }} className="mb-1">Manage Users</h4>
                    <Card className="border-0 shadow-sm mt-3" style={{ borderRadius: '14px' }}>
                        <Card.Body>
                            <Table hover responsive className="mb-0" style={{ fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ color: theme.textMuted, fontSize: '13px' }}>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Current Role</th>
                                        <th>Change Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((myUsers, index) => {
                                        const roleStyle = getRoleStyle(myUsers.role)
                                        return (
                                            <motion.tr key={myUsers._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}>
                                                <td style={{ color: theme.primary, fontWeight: 500 }}>{myUsers.name}</td>
                                                <td style={{ color: theme.textMuted }}>{myUsers.email}</td>
                                                <td>
                                                    <Badge bg={null} style={{ backgroundColor: roleStyle.bg, color: roleStyle.text, fontSize: '12px', padding: '5px 10px', borderRadius: '6px' }}>
                                                        {myUsers.role}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Form.Select onChange={(e) => handleRoleChange(myUsers._id, e.target.value)} defaultValue="" size="sm" style={{ borderRadius: '8px', maxWidth: '160px' }}>
                                                        <option value="" disabled>Change Role</option>
                                                        <option value="requester">Requester</option>
                                                        <option value="agent">Agent</option>
                                                        <option value="admin">Admin</option>
                                                    </Form.Select>
                                                </td>
                                            </motion.tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </>
            )}
        </Layout>
    )
}

export default ManageUsers

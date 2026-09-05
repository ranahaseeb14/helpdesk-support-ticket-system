const express = require("express")

const router = express.Router()

const { register, login, getActiveAgents, changeRole, getAllUsers } = require("../controllers/auth")

const protect = require('../middleware/authMiddleware')

router.post('/register', register)

router.post('/login', login)

router.get('/users/agents', protect, getActiveAgents)

router.get('/users', protect, getAllUsers)

router.patch('/users/:id/role', protect, changeRole)

module.exports = router
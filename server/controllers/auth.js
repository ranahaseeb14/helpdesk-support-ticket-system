const userModel = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = async (req, res, next) => {
    try {
        if (!req.body || !req.body.email) {
            return res.status(400).json({ msg: 'Request body is missing or invalid' })
        }
        const { name, email, password, role } = req.body
        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                msg: "User Already Exist, please use another email"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 8)
        const result = await userModel.create({
            name: name,
            email: email,
            password: hashedPassword,
            role: role
        })
        result.password = undefined
        res.status(201).json({
            msg: 'User registered successfully',
            result
        })
    } catch (error) {
        next(error)
    }
}
const login = async (req, res, next) => {
    try {
        if (!req.body || !req.body.email) {
            return res.status(400).json({ msg: 'Request body is missing or invalid' })
        }
        const { email, password } = req.body
        const existingUser = await userModel.findOne({ email }).select('+password')
        if (!existingUser) {
            return res.status(404).json({
                msg: "Email is not found, Please create account first"
            })
        }
        if (!existingUser.isActive) {
            return res.status(403).json({
                msg: "Your account was deactivated, Please contact admin"
            })
        }
        const matchedPassword = await bcrypt.compare(password, existingUser.password)
        if (!matchedPassword) {
            return res.status(400).json({
                msg: 'Invalid Email or Password'
            })
        }
        const token = jwt.sign(
            { id: existingUser._id, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )
        existingUser.password = undefined;
        res.status(200).json({
            msg: "User logged In",
            user: existingUser,
            token
        })
    } catch (error) {
        next(error)
    }
}

const getActiveAgents = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not Authorized' })
        }
        const agents = await userModel.find({ isActive: true, role: 'agent' }).select('name email')
        res.status(200).json({ agents })
    } catch (error) {
        next(error)
    }
}
const getAllUsers = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Not Authorized' })
        }
        const users = await userModel.find().select('name email role isActive isOwner')
        res.status(200).json({ users })
    } catch (error) {
        next(error)
    }
}

const changeRole = async (req, res, next) => {
    try {
        const isAdmin = req.user.role === 'admin'

        if (!isAdmin) {
            return res.status(403).json({ msg: 'Not authorized to change the role of users' })
        }
        const { id: userId } = req.params

        if (userId === req.user.id) {
            return res.status(403).json({ msg: "You cannot change your own role" })
        }

        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({ msg: 'User not found' })
        }
        if (user.isOwner) {
            return res.status(403).json({ msg: "This user's role cannot be changed" })
        }
        const { role: newRole } = req.body
        const validRoles = ['requester', 'agent', 'admin']
        const currentRole = user.role
        if (!validRoles.includes(newRole)) {
            return res.status(400).json({
                msg: `Cannot change role from ${currentRole} to ${newRole}`
            })
        }
        user.role = newRole

        await user.save()

        return res.status(200).json({ msg: 'Role changed Successfully', user })
    } catch (error) {
        next(error)
    }
}

module.exports = { register, login, getActiveAgents, getAllUsers, changeRole }
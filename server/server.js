const express = require("express")
const cors = require("cors")
const app = express()
require("dotenv").config()
const port = process.env.PORT
const connectDB = require("./db-configuration/connect")
const authRoute = require("./routes/authRoutes")
const ticketRoute = require("./routes/ticketRoutes")
const categoryRoute = require("./routes/categoryRoutes")
const errorHandler = require("./middleware/errorHandler")

connectDB()

app.use(cors({ origin: process.env.FRONTEND_URL }))

app.use(express.json())

app.use('/api', authRoute)

app.use('/api', ticketRoute)

app.use('/api', categoryRoute)

app.use((req, res, next) => {
    res.status(404).json({ msg: `Route not found: ${req.originalUrl}` })
})

app.use(errorHandler)

app.listen(port, () => {
    console.log(`Application is up and Running on port ${port}`)
})
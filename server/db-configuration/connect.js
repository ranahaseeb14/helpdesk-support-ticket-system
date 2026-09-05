const mongoose = require("mongoose")

function connectDB() {
    mongoose.connect(process.env.HELPDESK_DB).then(() => {
        console.log("DB is connected successfully")
    }).catch(err => {
        console.log("Error occured in DB connection")
    })
}

module.exports = connectDB
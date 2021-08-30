const mongoose = require('../config/mongoDb')

const logsSchema = new mongoose.Schema({
    user: {
        type: String,
        lowercase: true
    },
    method: {
        type: String
    },
    url: {
        type: String
    },
    requestBody: {
        type: String
    },
}, { timestamps: true })

const Logs = mongoose.model('log', logsSchema)

module.exports = Logs
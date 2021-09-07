const Logs = require('../models/logs')

async function save(name, method, url, body) {
    try {
        const log = {
            user: name,
            method,
            url,
            requestBody: JSON.stringify(body)
        }
        await Logs.create(log)
    } catch (error) {
        console.log('log save err', error)
    }
}
module.exports = { save }
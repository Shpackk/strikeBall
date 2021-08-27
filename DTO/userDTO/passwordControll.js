const bcrypt = require('bcrypt')

async function hash(password) {
    return await bcrypt.hash(password, 10)
}

async function compare(inputPassword, dbPassword) {
    return await bcrypt.compare(inputPassword, dbPassword)
}

module.exports = { hash, compare }
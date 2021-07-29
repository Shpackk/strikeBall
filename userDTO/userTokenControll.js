const jwt = require('jsonwebtoken')

module.exports.sign = user => {
    const userToSign = {
        id: user.id,
        name: user.name,
        role: user.role
    }
    return jwt.sign(userToSign, process.env.JWT_SECRET)
}


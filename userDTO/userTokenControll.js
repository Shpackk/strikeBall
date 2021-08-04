const jwt = require('jsonwebtoken')

module.exports.sign = user => {
    const userToSign = {
        id: user.id,
        name: user.name,
        role: user.role
    }
    return jwt.sign(userToSign, process.env.JWT_SECRET)
}

module.exports.signForReset = user => {
    const userToSign = {
        id: user.id,
        name: user.name,
        role: user.role
    }
    return jwt.sign(userToSign, process.env.JWT_SECRET, { expiresIn: '900s' })
}
module.exports.verifyForReset = token => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports.decode = token => {
    return jwt.decode(token, process.env.JWT_SECRET)
}




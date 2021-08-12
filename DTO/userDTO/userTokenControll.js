const jwt = require('jsonwebtoken')

module.exports.sign = user => {
    const userToSign = {
        id: user.id,
        name: user.name,
        roleId: user.RoleId
    }
    try {
        return jwt.sign(userToSign, process.env.JWT_SECRET)
    } catch (error) {
        throw error
    }
}

module.exports.signForReset = user => {
    const userToSign = {
        id: user.id,
        name: user.name,
        roleId: user.RoleId
    }
    try {
        return jwt.sign(userToSign, process.env.JWT_SECRET, { expiresIn: '900s' })
    } catch (error) {
        throw error
    }
}
module.exports.verifyForReset = token => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        throw error
    }
}

module.exports.decode = token => {
    try {
        return jwt.decode(token, process.env.JWT_SECRET)
    } catch (error) {
        throw error
    }
}




const { Role } = require('../models/index')

function isTokenValid(tokenUserId) {
    if (!tokenUserId) {
        throw { msg: "Bad token" }
    }
    return
}

async function requireAdmin(req, res, next) {
    try {
        isTokenValid(req.user.roleId)
        const result = await Role.findOne({
            where: {
                id: req.user.roleId
            }
        })
        if (result.dataValues.role != 'admin') {
            return res.status(403).json({ message: "No permission" })
        }
        else {
            next()
        }
    } catch (error) {
        next(error)
    }
}

async function requireManagerAdmin(req, res, next) {
    try {
        isTokenValid(req.user.roleId)
        const result = await Role.findOne({
            where: {
                id: req.user.roleId
            }
        })
        if (result.dataValues.role == 'user') {
            return res.status(403).json({ message: "No permission" })
        }
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = {
    requireAdmin,
    requireManagerAdmin
}
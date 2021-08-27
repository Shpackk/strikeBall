const { Role } = require('../models/index')

async function requireAdmin(req, res, next) {
    try {
        validToken(req.user.roleId)
        const result = await Role.findOne({
            where: {
                id: req.user.roleId
            }
        })

        if (result.dataValues.role != 'admin') {
            res.json({ "message": "No permission" })
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
        validToken(req.user.roleId)
        const result = await Role.findOne({
            where: {
                id: req.user.roleId
            }
        })
        if ((result.dataValues.role == 'admin') || (result.dataValues.role == 'manager')) {
            next()
        }
        else {
            res.status(403).json({ "message": "No permission" })
        }
    } catch (error) {
        next(error)
    }
}

function validToken(tokenUserId) {
    if (!tokenUserId) {
        const error = {
            "msg": "Bad token"
        }
        throw error
    }
    return
}

module.exports = {
    requireAdmin,
    requireManagerAdmin
}
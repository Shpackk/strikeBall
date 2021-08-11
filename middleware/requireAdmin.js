const { Role } = require('../models/index')


async function requireAdmin(req, res, next) {
    try {
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
        throw error
    }
}

async function requireManagerAdmin(req, res, next) {
    try {
        const result = await Role.findOne({
            where: {
                id: req.user.roleId
            }
        })
        if ((result.dataValues.role == 'admin') || (result.dataValues.role == 'manager')) {
            next()
        }
        else {
            res.json({ "message": "No permission" })
        }
    } catch (error) {
        throw error
    }
}


module.exports = {
    requireAdmin,
    requireManagerAdmin
}
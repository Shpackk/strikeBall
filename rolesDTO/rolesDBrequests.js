const { Role } = require('../models/index')

async function findRole(roleName) {
    try {
        const role = await Role.findOne({
            where: {
                role: roleName
            }
        })
        return role.dataValues.id
    } catch (error) {
        throw error
    }
}

module.exports = { findRole }
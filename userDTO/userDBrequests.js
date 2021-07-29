const User = require('../models/User')

async function writeUser(name, role, password) {
    return await User.create({
        name,
        role,
        password
    })
} // fix module exports

async function deleteUser(name, role) {
    return await User.destroy({
        where: {
            name,
            role
        }
    })
}

async function updateUser(name, role) {
    return await User.update({ role }, {
        where: {
            name
        }
    })
}

async function findOneByName(name) {
    return await User.findOne({
        where: {
            name
        }
    })
}
async function findOneById(id) {
    return await User.findOne({
        where: {
            id
        }
    })
}
module.exports = { writeUser, deleteUser, updateUser, findOneById, findOneByName }
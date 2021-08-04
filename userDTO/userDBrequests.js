const User = require('../models/User')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

// for users JWT signup
async function createUser(name, role, password, email) {
    return await User.create({
        email,
        name,
        role,
        password,
    })

}

//for all users view
async function findAllUsers() {
    return await User.findAll({ attributes: ['id', 'email', 'name', 'role',] })
}

//find all managers
async function findAllManagers() {
    return await User.findAll({
        where: {
            role: 'manager'
        },
        attributes: ['id', 'email', 'name', 'role']
    })
}


//google auth
async function createUserGoogle(user) {
    return await User.findOrCreate({
        where: {
            googleId: user.googleId
        },
        defaults: {
            googleId: user.googleId,
            name: user.name,
            role: 'user',
            picture: user.picture,
            email: user.email
        }
    })
}

// delete user 
async function deleteUser(name, role) {
    return await User.destroy({
        where: {
            name,
            role
        }
    })
}

// update info of user
async function updateUser(name, id) {
    return await User.update({ name }, {
        where: {
            id
        }
    })
}

// check if user is already registered 
async function findOneUser(user) {
    return await User.findOne({
        where: {
            [Op.or]: [{ name: user.name }, { email: user.email }]
        }
    })
}

//for loging in 
async function findOneByName(name) {
    return await User.findOne({
        where: {
            name
        }
    })
}

// to view one users info
async function findOneById(id) {
    return await User.findOne({
        where: {
            id
        },
        attributes: ['id', 'email', 'name', 'role', 'picture']
    })
}

//find by email for password reset
async function findOneByEmail(email) {
    const user = await User.findOne({
        where: {
            email
        },
        attributes: ['id', 'name', 'role']
    })
    return user.dataValues
}

// find one by id to update password
async function updatePassword(id, password) {
    return await User.update({ password }, {
        where: {
            id
        }
    })
}


module.exports = {
    createUser, deleteUser, updateUser, findOneById, findOneUser,
    createUserGoogle, findAllUsers, findOneByName, findAllManagers,
    findOneByEmail, updatePassword
}
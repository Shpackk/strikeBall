const { request } = require('express')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { User, Request } = require('../models/index')

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
    try {
        return await User.findAll({
            where: {
                role: 'manager'
            },
            attributes: ['id', 'email', 'name', 'role']
        })
    } catch (error) {
        return error
    }
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
async function findOneUser(name, email) {

    try {
        return await User.findOne({
            where: {
                [Op.or]: [{ name }, { email }]
            }
        })
    } catch (error) {
        return error
    }
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

// create request for manager's registration 
async function newRequest(user, type) {
    try {
        const found = await Request.findOne({
            where: {
                userEmail: user.email
            }
        })
        if (found) {
            const error = {
                "msg": "applied"
            }
            throw error
        }
        const createdRequest = await Request.create({
            status: 'active',
            userEmail: user.email,
            userName: user.name,
            userPass: user.password,
            requestType: type
        })
        if (createdRequest) {
            return "You succesfully applied! We will approve and send you an email"
        }
    } catch (error) {
        throw error
    }
}

async function extractRequests() {
    try {
        const requests = await Request.findAll({
            //if we delete request after decission, no sense to pass 'approved' column
            attributes: ['id', 'status', 'userEmail', 'userName', 'requestType']
        })
        return requests
    } catch (error) {
        throw error
    }
}

async function findRequest(reqId) {
    try {
        return await Request.findOne({
            where: {
                id: reqId
            },
            attributes: ['userEmail', 'userName', 'userPass']
        })
    } catch (error) {
        throw error
    }
}

async function acceptRequest(reqId, userName, password, email) {
    try {
        await deleteRequest(reqId)
        return await createUser(userName, 'manager', password, email)
    } catch (error) {
        throw error
    }
}

async function deleteRequest(reqId) {
    return await Request.destroy({
        where: {
            id: reqId
        }
    })
}




module.exports = {
    createUser, deleteUser, updateUser, findOneById, findOneUser,
    createUserGoogle, findAllUsers, findOneByName, findAllManagers,
    findOneByEmail, updatePassword, newRequest, extractRequests,
    acceptRequest, deleteRequest, findRequest
}
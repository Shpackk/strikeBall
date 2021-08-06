const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { User, Request } = require('../models/index')
const teamDbRequest = require('../teamDTO/teamDBrequests')

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
    try {
        return await User.findOne({
            where: {
                id
            },
            attributes: ['id', 'email', 'name', 'role', 'picture']
        })
    } catch (error) {
        throw error
    }
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

// create request
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

        if (type == 'manager') {
            await Request.create({
                status: 'active',
                userEmail: user.email,
                userName: user.name,
                userPass: user.password,
                requestType: type,
                UserId: user.id
            })
        }
        if (type != 'manager') {
            await Request.create({
                status: 'active',
                userEmail: user.email,
                userName: user.name,
                requestType: type,
                UserId: user.id
            })
        }
    } catch (error) {
        throw error
    }
}

async function extractRequests() {
    try {
        const requests = await Request.findAll({
            //if we delete request after decission, no sense to pass 'approved' column
            attributes: ['id', 'status', 'userEmail', 'requestType']
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
            attributes: ['userEmail', 'userName', 'userPass', 'requestType']
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

async function acceptTeamJoin(requestId, userEmail, requestType) {
    const teamId = requestType.match(/\d+/)[0]
    try {
        await deleteRequest(requestId)
        const user = await User.update({ TeamId: teamId }, {
            where: {
                email: userEmail
            },
            returning: true
        })
        await checkInAnotherTeam(teamId, user[1][0].dataValues.id)
        return await teamDbRequest.addToTeam(user[1][0].dataValues.id, teamId)
    } catch (error) {
        throw error
    }
}

async function acceptTeamLeave(requestId, userEmail, requestType) {
    const teamId = requestType.match(/\d+/)[0]

    try {
        await deleteRequest(requestId)
        const user = await User.update({ TeamId: teamId }, {
            where: {
                email: userEmail
            },
            returning: true
        })
        return await teamDbRequest.deleteFromTeam(user[1][0].dataValues.id, teamId)
    } catch (error) {
        throw error
    }
}

async function extractUserRequest(userId) {
    try {
        return await Request.findAll({
            where: {
                UserId: userId
            },
            attributes: ['id', 'status', 'requestType']
        })
    } catch (error) {
        throw error
    }

}

async function checkInAnotherTeam(teamId, userId) {
    if (teamId == 1) {
        const isInTeam = await teamDbRequest.checkUserInTeam(userId, 2)
        if (isInTeam) {
            await teamDbRequest.deleteFromTeam(userId, 2)
            return
        }
        return
    }
    if (teamId == 2) {
        const isInTeam = await teamDbRequest.checkUserInTeam(userId, 1)
        if (isInTeam) {
            await teamDbRequest.deleteFromTeam(userId, 1)
            return
        }
        return
    }
}

module.exports = {
    createUser, deleteUser, updateUser, findOneById, findOneUser,
    createUserGoogle, findAllUsers, findOneByName, findAllManagers,
    findOneByEmail, updatePassword, newRequest, extractRequests,
    acceptRequest, deleteRequest, findRequest, acceptTeamJoin,
    acceptTeamLeave, extractUserRequest
}
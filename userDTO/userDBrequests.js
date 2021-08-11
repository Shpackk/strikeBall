const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { User, Request, Team, Role } = require('../models/index')
const teamDbRequest = require('../teamDTO/teamDBrequests')

// for users JWT signup
async function createUser(name, roleId, password, email, picturePath) {
    try {
        return await User.create({
            email,
            name,
            RoleId: roleId,
            password,
            picture: picturePath
        })
    } catch (error) {
        throw error
    }
}

//for all users view
async function findAllUsers() {
    try {
        return await User.findAll({
            attributes: ['id', 'email', 'name', 'RoleId',],
            include: [{ model: Team, attributes: ['id', 'name'] }]
        })
    } catch (error) {
        throw error
    }
}

//find all managers
async function findAllManagers() {
    try {
        return await User.findAll({
            where: {
                RoleId: 2
            }
            // ,
            // attributes: ['id', 'email', 'name']
        })
    } catch (error) {
        throw error
    }
}

//find one manager

async function findOneManager(id) {
    try {
        return await User.findOne({
            where: {
                id
            }
        })
    } catch (error) {
        throw error
    }
}


//google auth
async function createUserGoogle(user) {
    const roleId = 1
    try {
        return await User.findOrCreate({
            where: {
                googleId: user.googleId
            },
            defaults: {
                googleId: user.googleId,
                name: user.name,
                RoleId: roleId,
                picture: user.picture,
                email: user.email
            }
        })
    } catch (error) {
        throw error
    }
}

// delete user 
async function deleteUser(userId) {
    try {
        return await User.destroy({
            where: {
                id: userId
            }
        })
    } catch (error) {
        throw error
    }
}

// update info of user
async function updateUser(userInfo, id) {
    try {
        return await User.update(userInfo, {
            where: {
                id
            }
        })
    } catch (error) {
        throw error
    }
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
        throw error
    }
}

//for loging in 
async function findOneByName(name) {
    try {
        return await User.findOne({
            where: {
                name
            }
        })
    } catch (error) {
        throw error
    }
}

// to view one users info
async function findOneById(id) {
    try {
        return await User.findOne({
            where: {
                id
            },
            attributes: ['id', 'email', 'name', 'picture'],
            include: [{ model: Team, attributes: ['id', 'name'] }, { model: Role, attributes: ['id', 'role'] }]
        })
    } catch (error) {
        throw error
    }
}

//find by email for password reset
async function findOneByEmail(email) {
    try {
        const user = await User.findOne({
            where: {
                email
            },
            attributes: ['id', 'name', 'RoleId']
        })
        return user.dataValues
    } catch (error) {
        throw error
    }
}

// find one by id to update password
async function updatePassword(id, password) {
    try {
        return await User.update({ password }, {
            where: {
                id
            }
        })
    } catch (error) {
        throw error
    }
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
        return await createUser(userName, 2, password, email)
    } catch (error) {
        throw error
    }
}

async function deleteRequest(reqId) {
    try {
        return await Request.destroy({
            where: {
                id: reqId
            }
        })
    } catch (error) {
        throw error
    }
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
    try {
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
    } catch (error) {
        throw error
    }
}

async function getUsersByTeam(teamId) {
    try {
        const users = await Team.findOne({
            where: {
                id: teamId
            },
            include: [{ model: User, attributes: ['id', 'name', 'email'] }]
        })
        if (users.length < 1) {
            return "No players in this team"
        }
        return users.dataValues.Users
    } catch (error) {
        throw error
    }
}

module.exports = {
    createUser, deleteUser, updateUser, findOneById, findOneUser,
    createUserGoogle, findAllUsers, findOneByName, findAllManagers,
    findOneByEmail, updatePassword, newRequest, extractRequests,
    acceptRequest, deleteRequest, findRequest, acceptTeamJoin,
    acceptTeamLeave, extractUserRequest, getUsersByTeam,
    findOneManager
}
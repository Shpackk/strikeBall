const Sequelize = require('sequelize')
const Op = Sequelize.Op
const { User, Request, Team, Role, Banlist } = require('../../models/index')
const teamDbRequest = require('../teamDTO/teamDBrequests')

async function createUser(name, roleId, password, email, picturePath) {
    try {
        return await User.create({
            email,
            name,
            roleId,
            password,
            picture: picturePath
        })
    } catch (error) {
        throw error
    }
}

async function findAllUsers(limit, offset) {
    try {
        return await User.findAndCountAll({
            limit,
            offset: limit * offset,
            attributes: ['id', 'email', 'name', 'roleId',],
            include: [
                {
                    model: Team,
                    as: 'team',
                    attributes: ['id', 'name']
                },
                {
                    model: Banlist,
                    as: 'banlist',
                    attributes: ['description']
                }
            ]
        })
    } catch (error) {
        throw error
    }
}

async function findAllManagers(limit, offset) {
    try {
        return await User.findAll({
            limit,
            offset: limit * offset,
            where: {
                roleId: 2
            },
            attributes: ['id', 'email', 'name']
        })
    } catch (error) {
        throw error
    }
}

async function findOneManager(id) {
    try {
        return await User.findOne({
            where: {
                id,
                roleId: '2'
            },
            attributes: ['id', 'name', 'email']
        })
    } catch (error) {
        throw error
    }
}

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
                roleId,
                picture: user.picture,
                email: user.email
            }
        })
    } catch (error) {
        throw error
    }
}

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

async function updateUser(userInfo, id) {
    try {
        return await User.update(userInfo, {
            where: {
                id
            },
            returning: true
        })
    } catch (error) {
        throw error
    }
}

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

async function findOneById(id) {
    try {
        return await User.findOne({
            where: {
                id
            },
            attributes: ['id', 'email', 'name', 'picture'],
            include: [
                {
                    model: Team,
                    as: 'team',
                    attributes: ['id', 'name']
                },
                {
                    model: Role,
                    as: 'role',
                    attributes: ['id', 'role']
                },
                {
                    model: Banlist,
                    as: 'banlist',
                    attributes: ['description']
                }
            ]
        })
    } catch (error) {
        throw error
    }
}

async function findOneByEmail(email) {
    try {
        const user = await User.findOne({
            where: {
                email
            },
            attributes: ['id', 'name', 'roleId']
        })
        return user.dataValues
    } catch (error) {
        throw error
    }
}

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

async function newRequest(user, type, teamId) {
    let request = {
        status: 'active',
        userEmail: user.email,
        userName: user.name,
        requestType: type,
        UserId: user.id,
        teamId
    }
    request.userPass = (type == 'register') ? user.password : null
    try {
        const found = await Request.findOne({
            where: {
                userEmail: user.email
            }
        })
        if (found) {
            throw { msg: "applied" }
        }
        await Request.create(request)
    } catch (error) {
        throw error
    }
}

async function extractRequests(roleId) {
    const attributes = ['id', 'status', 'userEmail', 'requestType', 'teamId']
    try {
        const requestConf = (roleId == 3) ?
            { attributes }
            : {
                limit,
                offset: limit * offset,
                where:
                {
                    requestType: { [Op.not]: "register" },
                    attributes
                }
            }

        return await Request.findAll(requestConf)
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
            attributes: ['userEmail', 'userName', 'userPass', 'requestType', 'teamId']
        })
    } catch (error) {
        throw error
    }
}

async function acceptRequest(reqId, userName, password, email) {
    try {
        await clearRequest(reqId)
        return await createUser(userName, 2, password, email)
    } catch (error) {
        throw error
    }
}

async function clearRequest(reqId) {
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

async function updateTeamStatus(requestId, userEmail, requestType, teamId) {
    try {
        await clearRequest(requestId)
        const user = await User.findOne({
            where: {
                email: userEmail
            }
        })
        if (requestType == 'join') {
            await checkInAnotherTeam(teamId, user.dataValues.id)
            const result = await teamDbRequest.addToTeam(user.dataValues.id, teamId)
            user.teamId = teamId
            user.save()
            return result
        } else {
            return await teamDbRequest.deleteFromTeam(user.dataValues.id, teamId)
        }
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
    const teamToCheck = teamId == 1 ? 2 : 1
    try {
        const isInTeam = await teamDbRequest.checkUserInTeam(userId, teamToCheck)
        if (isInTeam) {
            await teamDbRequest.deleteFromTeam(userId, teamToCheck)
            return
        }
        return
    } catch (error) {
        throw error
    }
}

async function getUsersByTeam(teamId, limit, offset) {
    try {
        const users = await Team.findOne({
            limit,
            offset: limit * offset,
            where: {
                id: teamId
            },
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }]
        })
        if (users.length < 1) {
            return "No players in this team"
        }
        return users.dataValues.Users
    } catch (error) {
        throw error
    }
}

async function findAdminId() {
    try {
        const adminId = await User.findOne({
            where: {
                roleId: 3
            },
            attributes: ['id']
        })
        return adminId
    } catch (error) {
        throw error
    }
}

module.exports = {
    createUser,
    deleteUser,
    newRequest,
    updateUser,
    findRequest,
    findOneUser,
    findAdminId,
    findOneById,
    clearRequest,
    findAllUsers,
    findOneByName,
    acceptRequest,
    getUsersByTeam,
    findOneByEmail,
    updatePassword,
    findOneManager,
    findAllManagers,
    extractRequests,
    updateTeamStatus,
    createUserGoogle,
    extractUserRequest,
}
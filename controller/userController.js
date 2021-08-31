const dbRequest = require('../DTO/userDTO/userDBrequests')
const dbTeamRequest = require('../DTO/teamDTO/teamDBrequests')
const banDbRequest = require('../DTO/banDTO/banRequests')
const check = require('../middleware/inputVerify')
const token = require('../DTO/userDTO/userTokenControll')
const mailer = require('../service/mailMessageHandler')
const socket = require('../service/socketMessaging')
const passControl = require('../DTO/userDTO/passwordControll')
const mongoLog = require('../service/mongoLogsSaver.js')

// to view all users
async function viewUsers(req, res, next) {
    const teamid = req.query.teamid
    try {
        const users = teamid ?
            await dbRequest.getUsersByTeam(teamid)
            : await dbRequest.findAllUsers()
        res.status(200).json(users)
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}

// delete user
async function deleteUser(req, res, next) {
    const userId = req.params.id
    try {
        const result = await dbRequest.deleteUser(userId)
        res.status(201).json(result + " Deleted")
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}

// view one user by id
async function viewOneById(req, res, next) {
    let userId
    req.params.id ?
        userId = req.params.id
        : userId = req.user.id
    try {
        const user = await dbRequest.findOneById(userId)
        user ?
            res.status(200).json(user)
            : next({ status: 404 })
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}


//all managers view
async function viewManagers(req, res, next) {
    try {
        const managers = await dbRequest.findAllManagers()
        res.status(200).json(managers)
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}

async function viewManagerById(req, res, next) {
    const managerId = req.params.id
    try {
        const manager = await dbRequest.findOneManager(managerId)
        res.json(manager)
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}

// update users info 
async function userInfoUpdate(req, res, next) {
    const userId = req.user.id
    const newUserInfo = Object.assign({}, req.body) // multer brokes req.body
    try {
        newUserInfo.picture = req.file ? req.file.path : null
        check.inputValidation(newUserInfo)
        const isUserNameTaken = newUserInfo.name ? await dbRequest.findOneByName(newUserInfo.name) : null
        if (isUserNameTaken) {
            throw { msg: "taken name" }
        }
        if ((newUserInfo.newPassword) && (newUserInfo.newPassword == newUserInfo.confirmPassword)) {
            newUserInfo.password = await passControl.hash(newUserInfo.confirmPassword)
            const newProfile = await dbRequest.updateUser(newUserInfo, userId)
            res.json(newProfile)
        } else {
            const newProfile = await dbRequest.updateUser(newUserInfo, userId)
            res.json(newProfile)
        }
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}

async function forgotPassword(req, res, next) {
    const userReq = req.body
    const topic = 'Password Reset'
    try {
        check.inputValidation(userReq.email)
        const user = await dbRequest.findOneByEmail(userReq.email)
        const accessToken = token.signForReset(user)
        const link = `localhost:3000/user/reset-password/${accessToken}`
        res.status(201).json({
            status: 'Success',
            message: 'Link has been sent to your email!',
            time: 'Link expires in 15 minutes'
        })
        mailer.sandMail(userReq.email, topic, link)
        await mongoLog.save(req.body.email, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}

async function resetPassword(req, res, next) {
    const { accessToken } = req.params
    const user = req.body
    try {
        check.inputValidation(user)
        const verifiedToken = token.verifyForReset(accessToken)
        if (verifiedToken) {
            if (user.newPass == user.confirmPass) {
                const hashedPassword = await passControl.hash(user.confirmPass, 10)
                await dbRequest.updatePassword(verifiedToken.id, hashedPassword)
                res.json({
                    message: "Your password has been changed successfully "
                })
            } else next({ msg: "missmatch" })
        } else next({ msg: "Bad token" })
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}


async function getRequests(req, res, next) {
    try {
        const requests = await dbRequest.extractRequests(req.user.roleId)
        res.status(200).json(requests)
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}

async function populateRequest(req, res, next) {
    const requestId = req.params.id
    const approved = req.body.approved
    try {
        const request = await dbRequest.findRequest(requestId)
        if (!request) throw { status: 404 }
        if ((request.dataValues.requestType == 'manager registration') && (approved)) {
            await dbRequest.acceptRequest(requestId, request.dataValues.userName, request.dataValues.userPass, request.dataValues.userEmail)
        }
        else if ((request.dataValues.requestType.includes('team')) && (approved)) {
            await dbRequest.updateTeamStatus(requestId, request.dataValues.userEmail, request.dataValues.requestType)
            await socket.findAndNotify(request.dataValues.userEmail, request.dataValues.requestType)
            await socket.notificationForAdmin(`${request.dataValues.userEmail} ${request.dataValues.requestType} sucessfull`)
        }
        else {
            await dbRequest.clearRequest(requestId)
        }
        res.status(200).json({ message: `Decision for ${request.dataValues.userEmail} request is set to ${approved}` })
        await mailer.sandMail(request.dataValues.userEmail, request.dataValues.requestType, approved)
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}

async function userOwnRequests(req, res, next) {
    try {
        const request = await dbRequest.extractUserRequest(req.user.id)
        if (request.length < 1) {
            return res.status(200).json({
                message: "You have no active requests"
            })
        }
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
        res.status(200).json(request)
    } catch (error) {
        next(error)
    }
}

async function userDeleteRequest(req, res, next) {
    await mongoLog.save(req.user.name, req.method, req.url, req.body)
    const requestId = req.params.id
    try {
        const request = await dbRequest.findRequest(requestId)
        if (request) {
            await dbRequest.clearRequest(requestId)
            res.status(200).json({
                message: "Request is sucessfully deleted"
            })
        } else next({ status: 404 })
    } catch (error) {
        next(error)
    }
}

async function banUser(req, res, next) {
    const userId = req.params.id
    const { description, type } = req.body
    const typeLowerCase = type.toLowerCase()
    try {
        const user = await dbRequest.findOneById(userId)
        if (user == null) {
            throw { status: 404 }
        }
        const isBanned = await banDbRequest.isBanned(user.dataValues.email)
        if (typeLowerCase == 'ban' && !isBanned) {
            user.dataValues.Team ?
                await dbTeamRequest.deleteFromTeam(userId, user.dataValues.Team.dataValues.id)
                : await banDbRequest.banUser(userId, description, user.dataValues.email)
        }
        else if (typeLowerCase == 'unban' && isBanned) {
            await banDbRequest.unbanUser(userId)
        }
        else {
            return res.status(409).json({ message: `Unknown command or user's account already has this status` })
        }
        await mongoLog.save(req.user.name, req.method, req.url, req.body)
        mailer.sandMail(user.dataValues.email, typeLowerCase, description)
        res.status(200).json({ message: `User ${user.dataValues.name} ${type} sucessfull` })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    banUser,
    viewUsers,
    deleteUser,
    getRequests,
    viewOneById,
    viewManagers,
    resetPassword,
    userInfoUpdate,
    forgotPassword,
    userOwnRequests,
    viewManagerById,
    populateRequest,
    userDeleteRequest,
}


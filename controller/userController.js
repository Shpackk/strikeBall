const dbRequest = require('../DTO/userDTO/userDBrequests')
const banDbRequest = require('../DTO/banDTO/banRequests')
const check = require('../middleware/inputVerify')
const token = require('../DTO/userDTO/userTokenControll')
const mailer = require('../service/mailMessageHandler')
const bcrypt = require('bcrypt')

// to view all users
async function viewUsers(req, res, next) {
    const teamid = req.query.teamid
    try {
        if (!teamid) {
            const users = await dbRequest.findAllUsers()
            res.status(202).json(users)
        } else {
            const users = await dbRequest.getUsersByTeam(teamid)
            res.status(202).json(users)
        }
    } catch (error) {
        next(error)
    }
}

// delete user
async function deleteUser(req, res, next) {
    const userId = req.params.id
    try {
        const result = await dbRequest.deleteUser(userId)
        res.status(202).json(result + " Deleted")
    } catch (error) {
        throw (error)
    }
}

// view one user by id
async function viewOneById(req, res, next) {
    const userId = req.params.id
    try {
        const user = await dbRequest.findOneById(userId)
        if (user == null) {
            throw error
        }
        res.status(202).json(user)
    } catch (error) {
        error.status = 404
        next(error)
    }
}

//all managers view
async function viewManagers(req, res, next) {
    try {
        const managers = await dbRequest.findAllManagers()
        res.json(managers)
    } catch (error) {
        next(error)
    }
}

async function viewManagerById(req, res, next) {
    const managerId = req.params.id
    try {
        const manager = await dbRequest.findOneManager(managerId)
        res.json(manager)
    } catch (error) {
        next(error)
    }
}

// update users info 
async function userInfoUpdate(req, res, next) {
    const userId = req.user.id
    const newUserInfo = Object.assign({}, req.body) // multer brokes req.body
    newUserInfo.picture = req.file ? req.file.path : null
    try {
        check.inputValidation(newUserInfo)
        const isUserNameTaken = newUserInfo.name ? await dbRequest.findOneByName(newUserInfo.name) : null
        if (isUserNameTaken) {
            const error = {
                "msg": "taken name"
            }
            throw error
        }
        if (newUserInfo.hasOwnProperty('newPassword')) {
            if (newUserInfo.newPassword == newUserInfo.confirmPassword) {
                const password = await bcrypt.hash(newUserInfo.confirmPassword, 10)
                delete newUserInfo.newPassword
                delete newUserInfo.confirmPassword
                newUserInfo.password = password
                await dbRequest.updateUser(newUserInfo, userId)
                res.json({ "message": "Your info has been updated" })
            }
        } else {
            await dbRequest.updateUser(newUserInfo, userId)
            res.json({ "message": "Your info has been updated" })
        }
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
        mailer.sandMail(userReq.email, topic, link)
        res.status(201).json({
            'status': 'Success',
            'message': 'Link has been sent to your email!',
            'time': 'Link expires in 15 minutes'
        })
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
                const hashedPassword = await bcrypt.hash(user.confirmPass, 10)
                await dbRequest.updatePassword(verifiedToken.id, hashedPassword)
                res.json({
                    "message": "Your password has been changed successfully "
                })
            } else {
                const error = {
                    "msg": "missmatch"
                }
                throw error
            }
        }
        throw error
    } catch (error) {
        next(error)
    }
}

async function profile(req, res, next) {
    try {
        const user = await dbRequest.findOneById(req.user.id)
        if (!user) {
            const error = {
                'status': 404
            }
            throw error
        }
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

async function getRequests(req, res, next) {
    try {
        const requests = await dbRequest.extractRequests(req.user.roleId)
        res.status(200).json(requests)
    } catch (error) {
        next(error)
    }
}

async function populateRequest(req, res, next) {
    const requestId = req.params.id
    const approved = req.body.approved
    try {
        const request = await dbRequest.findRequest(requestId)
        if (!request) {
            throw error = {
                status: 404
            }
        }
        if (request.dataValues.requestType == 'manager registration') {
            switch (approved) {
                case true:
                    await dbRequest.acceptRequest(requestId, request.dataValues.userName, request.dataValues.userPass, request.dataValues.userEmail)
                    break;
                case false:
                    await dbRequest.clearRequest(requestId)
                    break;
                default:
                    break;
            }
            mailer.sandMail(request.dataValues.userEmail, 'Registration', approved)
            res.json({ "message": `Decision for ${request.dataValues.userEmail} request is set to ${approved}` })
        }
        if (request.dataValues.requestType.includes('join')) {
            switch (approved) {
                case true:
                    await dbRequest.acceptTeamJoin(requestId, request.dataValues.userEmail, request.dataValues.requestType)
                    break;
                case false:
                    await dbRequest.clearRequest(requestId)
                    break;
                default:
                    break;
            }
            mailer.sandMail(request.dataValues.userEmail, 'TeamJoin', approved)
            res.json({ "message": `Decision for ${request.dataValues.userEmail} request is set to ${approved}` })
        }
        if (request.dataValues.requestType.includes('leave')) {
            switch (approved) {
                case true:
                    await dbRequest.acceptTeamLeave(requestId, request.dataValues.userEmail, request.dataValues.requestType)
                    break;
                case false:
                    await dbRequest.clearRequest(requestId)
                    break;
                default:
                    break;
            }
            mailer.sandMail(request.dataValues.userEmail, 'TeamLeave', approved)
            res.json({ "message": `Decision for ${request.dataValues.userEmail} request is set to ${approved}` })
        }

    } catch (error) {
        next(error)
    }

}

async function userOwnRequests(req, res, next) {
    try {
        const request = await dbRequest.extractUserRequest(req.user.id)
        if (request.length < 1) {
            res.status(201).json({
                "message": "You have no active requests"
            })
        }
        res.status(201).json(request)
    } catch (error) {
        next(error)
    }
}

async function userDeleteRequest(req, res, next) {
    const requestId = req.params.id
    try {
        const request = await dbRequest.findRequest(requestId)
        if (request) {
            await dbRequest.clearRequest(requestId)
            res.status(200).json({
                "message": "Request is sucessfully deleted"
            })
        } else {
            throw error
        }
    } catch (error) {
        error.status = 404
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
            const error = {
                status: 404
            }
            throw error
        }
        const isBanned = await banDbRequest.isBanned(user.dataValues.email)
        switch (typeLowerCase) {
            case 'ban':
                if (isBanned) {
                    res.json(`User ${user.dataValues.email} is already banned`)
                } else {
                    await banDbRequest.banUser(userId, description, user.dataValues.email)
                }
                break;
            case 'unban':
                if (isBanned) {
                    await banDbRequest.unbanUser(userId)
                } else {
                    res.json({ "message": "You cannot unban user who is not banned" })
                }
                break;
            default:
                res.status(409).json({ "message": "Unknown command" })
                break;
        }
        res.json({ "message": `User ${user.dataValues.name} ${type} sucessfull` })
        mailer.sandMail(user.dataValues.email, typeLowerCase, description)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    profile,
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


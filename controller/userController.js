const dbRequest = require('../userDTO/userDBrequests')
const check = require('../middleware/inputVerify')
const token = require('../userDTO/userTokenControll')
const mailer = require('../service/nodeMailer')
// const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// const db = require('../models')

// to view all users
async function viewUsers(req, res, next) {
    try {
        const users = await dbRequest.findAllUsers()
        res.status(202).json(users)
    } catch (error) {
        error.status = 404
        next(error)
    }
}

// delete user
async function deleteUser(req, res, next) {
    const { name, role } = req.body
    check.inputValidation(name, role)
    dbRequest.deleteUser(name, role)
        .then(result => {
            res.status(202).json(result + " Deleted")
        }).catch(error => {
            error.status = 404
            next(error)
        })

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
        console.log('WTF')
        error.status = 404
        next(error)
    }
}

//all managers view
async function viewManagers(req, res, next) {
    try {
        const managers = await dbRequest.findAllManagers()
        if (managers.length != 0) {
            res.json(managers)
        } else {
            throw error
        }
    } catch (error) {
        error.msg = "managers"
        next(error)
    }
}

// update users info 
async function userInfoUpdate(req, res, next) {
    // login, avatar, password
    const userId = req.user.id
    console.log(userId)


    // check.inputValidation(name)
    // dbRequest.updateUser(name, activeUserId)
    //     .then((result) => {
    //         res.status(200).json(result + " Updated");
    //     }).catch(error => {
    //         error.status = 404
    //         next(error)
    //     })
}

async function forgotPassword(req, res, next) {
    const { email } = req.body
    check.inputValidation(email)
    try {
        const user = await dbRequest.findOneByEmail(email)
        const accessToken = token.signForReset(user)
        const link = `Follow to reset password localhost:3000/user/reset-password/${accessToken}`
        mailer.sendLink(email, link)
        res.status(201).json({
            'status': 'Success',
            'message': 'Link has been sent to your email!',
            'time': 'Link expires in 15 minutes'
        })
    } catch (error) {
        error.status = 404
        next(error)
    }
}

async function resetPassword(req, res, next) {
    const { accessToken } = req.params
    const user = req.body
    //del id from link
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
        const user = await dbRequest.findOneById(req.params.id)
        if (!user) {
            const error = {
                'status': 404
            }
            throw error
        }
        res.status(302).json(user)
    } catch (error) {
        next(error)
    }
}

async function getRequests(req, res, next) {
    try {
        const requests = await dbRequest.extractRequests()
        res.json(requests)
    } catch (error) {
        next(error)
    }
}

async function populateRequest(req, res, next) {
    const requestId = req.params.id
    const approved = req.body.approved
    const message = `Your request is answered by ${approved}`
    try {
        const request = await dbRequest.findRequest(requestId)
        if (!request) {
            throw error = {
                status: 404
            }
        }
        if (request.dataValues.requestType == 'manager') {
            switch (approved) {
                case true:
                    await dbRequest.acceptRequest(requestId, request.dataValues.userName, request.dataValues.userPass, request.dataValues.userEmail)
                    break;
                case false:
                    await dbRequest.deleteRequest(requestId)
                    break;
                default:
                    break;
            }
            mailer.sandMail(request.dataValues.userEmail, 'Registration', message)
            res.json(`Approval for ${request.dataValues.userEmail} is ${approved}`)
        }
        if (request.dataValues.requestType.includes('join')) {
            switch (approved) {
                case true:
                    await dbRequest.acceptTeamJoin(requestId, request.dataValues.userEmail, request.dataValues.requestType)
                    break;
                case false:
                    await dbRequest.deleteRequest(requestId)
                    break;
                default:
                    break;
            }
            mailer.sandMail(request.dataValues.userEmail, 'Request For Joining A Team', message)
            res.json(`Approval for ${request.dataValues.userEmail} is ${approved}`)
        }
        if (request.dataValues.requestType.includes('leave')) {
            switch (approved) {
                case true:
                    await dbRequest.acceptTeamLeave(requestId, request.dataValues.userEmail, request.dataValues.requestType)
                    break;
                case false:
                    await dbRequest.deleteRequest(requestId)
                    break;
                default:
                    break;
            }
            mailer.sandMail(request.dataValues.userEmail, 'Request For Leaving A Team', message)
            res.json(`Approval for ${request.dataValues.userEmail} is ${approved}`)
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
                "Msg": "You have no active requests"
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
            await dbRequest.deleteRequest(requestId)
            res.status(200).json({
                "msg": "Request is sucessfully deleted"
            })
        } else {
            throw error
        }
    } catch (error) {
        error.status = 404
        next(error)
    }
}
module.exports = {
    viewUsers, userInfoUpdate, deleteUser, viewOneById,
    viewManagers, forgotPassword, resetPassword, profile,
    getRequests, populateRequest, userOwnRequests, userDeleteRequest
}


const bcrypt = require('bcrypt')
const dbRequest = require('../DTO/userDTO/userDBrequests')
const banDbRequest = require('../DTO/banDTO/banRequests')
const token = require('../DTO/userDTO/userTokenControll')
const check = require('../middleware/inputVerify')
const socket = require('../service/socketMessaging')
const rolesDbRequest = require('../DTO/rolesDTO/rolesDBrequests')


module.exports.createUser = async (req, res, next) => {
    try {
        const user = {
            name: req.body.name.toLowerCase(),
            email: req.body.email.toLowerCase(),
            role: req.body.role,
            password: req.body.password
        }
        const picturePath = req.file ? req.file.path : ''
        check.inputValidation(user)
        const checkUser = await dbRequest.findOneUser(user.name, user.email)
        if (!checkUser) {
            const roleId = await rolesDbRequest.findRole(user.role)
            if (user.role == 'user') {
                const hashedPassword = await bcrypt.hash(user.password, 10)
                const userDB = await dbRequest.createUser(user.name, roleId, hashedPassword, user.email, picturePath)
                const accessToken = token.sign(userDB.dataValues)
                res.status(200).json({
                    id: userDB.dataValues.id,
                    email: userDB.dataValues.email,
                    name: userDB.dataValues.name,
                    roleId: roleId,
                    token: accessToken
                })
            }
            if (user.role == 'manager') {
                user.password = await bcrypt.hash(user.password, 10)
                await dbRequest.newRequest(user, 'manager registration')
                socket.notificationForAdmin('New Manager Registration')
                res.status(201).json({
                    "message": 'You sucessfully applied!'
                })
            }
        } else {
            error = { "status": 409 }
            throw error
        }
    } catch (error) {
        next(error)
    }
}

module.exports.loginUser = async (req, res, next) => {
    const user = req.body
    try {
        check.inputValidation(user)
        const userDB = await dbRequest.findOneByName(user.name)
        if (userDB == null) {
            const error = { status: 404 }
            throw error
        }
        const isBanned = await banDbRequest.isBanned(userDB.email)
        if (isBanned != null) {
            res.status(403).json({ "message": `${userDB.email}, we're sorry, but you are banned from our service` })
        }
        const auth = await bcrypt.compare(user.password, userDB.password)
        if (auth) {
            const accessToken = token.sign(userDB.dataValues)
            res.json({
                id: userDB.id,
                name: userDB.name,
                roleId: userDB.RoleId,
                token: accessToken
            }).status(201)
        } else {
            const error = {
                "msg": "wrong password"
            }
            throw error
        }
    } catch (error) {
        next(error)
    }
}

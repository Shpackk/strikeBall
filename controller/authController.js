const check = require('../middleware/inputVerify')
const token = require('../service/tokenService')
const socket = require('../service/socketMessaging')
const mongoLog = require('../service/mongoLogsSaver.js')
const dbRequest = require('../DTO/userDTO/userDBrequests')
const passControl = require('../service/passwordService')
const banDbRequest = require('../DTO/banDTO/banRequests')
const rolesDbRequest = require('../DTO/rolesDTO/rolesDBrequests')

module.exports.createUser = async (req, res, next) => {
    const user = {
        name: req.body.name.toLowerCase(),
        email: req.body.email.toLowerCase(),
        role: req.body.role,
        password: req.body.password
    }
    try {
        const picturePath = req.file ? req.file.path : ''
        check.inputValidation(user)
        const checkUser = await dbRequest.findOneUser(user.name, user.email)
        if (!checkUser) {
            const roleId = await rolesDbRequest.findRole(user.role)
            if (user.role == 'user') {
                const hashedPassword = await passControl.hash(user.password, 10)
                await dbRequest.createUser(user.name, roleId, hashedPassword, user.email, picturePath)
                res.status(200).json({ message: "You can now log in!" })
            }
            if (user.role == 'manager') {
                user.password = await passControl.hash(user.password, 10)
                await dbRequest.newRequest(user, 'register')
                await socket.notificationForAdmin('New Manager Registration')
                res.status(201).json({ message: 'You sucessfully applied!' })
            }
        } else next({ status: 409 })
        await mongoLog.save(user.name, req.method, req.url, req.body)
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
            throw { status: 404 }
        }
        const isBanned = await banDbRequest.isBanned(userDB.email)
        if (isBanned != null) {
            res.status(403).json({ message: `${userDB.email}, we're sorry, but you are banned from our service` })
        } else {
            const auth = await passControl.compare(user.password, userDB.password)
            if (auth) {
                const accessToken = token.sign(userDB.dataValues)
                res.status(201).json({
                    id: userDB.id,
                    name: userDB.name,
                    roleId: userDB.roleId,
                    token: accessToken
                })
            } else next({ msg: "wrong password" })
        }
        await mongoLog.save(req.body.name, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}

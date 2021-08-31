const passControl = require('../DTO/userDTO/passwordControll')
const dbRequest = require('../DTO/userDTO/userDBrequests')
const banDbRequest = require('../DTO/banDTO/banRequests')
const token = require('../DTO/userDTO/userTokenControll')
const check = require('../middleware/inputVerify')
const socket = require('../service/socketMessaging')
const rolesDbRequest = require('../DTO/rolesDTO/rolesDBrequests')
const mongoLog = require('../service/mongoLogsSaver.js')


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
                user.password = await passControl.hash(user.password, 10)
                await dbRequest.newRequest(user, 'manager registration')
                await socket.notificationForAdmin('New Manager Registration')
                res.status(201).json({
                    message: 'You sucessfully applied!'
                })
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
                    roleId: userDB.RoleId,
                    token: accessToken
                })
            } else next({ msg: "wrong password" })
        }
        await mongoLog.save(req.body.name, req.method, req.url, req.body)
    } catch (error) {
        next(error)
    }
}

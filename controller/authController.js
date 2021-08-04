const bcrypt = require('bcrypt')
const dbRequest = require('../userDTO/userDBrequests')
const token = require('../userDTO/userTokenControll')
const check = require('../middleware/inputVerify')

module.exports.createUser = async (req, res, next) => {
    try {
        const user = req.body
        check.inputValidation(user)
        const checkUser = await dbRequest.findOneUser(user)
        if (!checkUser) {
            const hashedPassword = await bcrypt.hash(user.password, 10)
            dbRequest.createUser(user.name, user.role, hashedPassword, user.email)
                .then(user => {
                    const accessToken = token.sign(user.dataValues)
                    res.json({
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        token: accessToken
                    }).status(201)
                })
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
        const auth = await bcrypt.compare(user.password, userDB.password)
        if (auth) {
            const accessToken = token.sign(userDB.dataValues)
            res.json({
                id: userDB.id,
                name: userDB.name,
                role: userDB.role,
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

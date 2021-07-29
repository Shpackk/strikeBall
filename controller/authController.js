const bcrypt = require('bcrypt')
const dbRequest = require('../userDTO/userDBrequests')
const token = require('../userDTO/userTokenControll')
const check = require('../middleware/inputVerify')

module.exports.createUser = async (req, res, next) => {
    try {
        // add email to reqistration
        const { name, role, password } = req.body
        const checkResult = check.badInput(name, role, password)
        if (checkResult) {
            error = { "msg": checkResult }
            throw error
        }
        const checkUser = await dbRequest.findOneByName(name)
        if (!checkUser) {
            const hashedPassword = await bcrypt.hash(password, 10)
            dbRequest.writeUser(name, role, hashedPassword)
                .then(user => {
                    const accessToken = token.sign(user.dataValues)
                    res.json({
                        id: user.id,
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

module.exports.loginUser = (req, res, next) => {
    const { name, password } = req.body
    dbRequest.findOneByName(name)
        .then(user => {
            const auth = bcrypt.compare(password, user.password)
            if (auth) {
                const accessToken = token.sign(user.dataValues)
                res.json({
                    id: user.id,
                    name: user.name,
                    role: user.role,
                    token: accessToken
                }).status(201)
            }
        }).catch(error => {
            error.status = 404
            next(error)
        })
}
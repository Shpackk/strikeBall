const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports.createUser = async (req, res) => {
    const { name, role, password } = req.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ name, role, password: hashedPassword })
        const accessToken = jwt.sign({ user }, process.env.JWT_SECRET)
        res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
        res.status(201).json({ user })
    } catch (error) {
        res.status(400).send(error)
    }
}

module.exports.loginUser = (req, res) => {
    const { name, password } = req.body
    User.findOne({ where: { name } })
        .then(user => {
            const auth = bcrypt.compare(password, user.password)
            if (auth) {
                res.cookie('jwt', accessToken, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 })
                res.status(201).json({ user })
            }
        }).catch(error => {
            res.send('No users found', error)
        })
}

module.exports.deleteUser = async (req, res) => {
    const name = req.body.name
    const role = req.body.role
    try {
        const result = await User.destroy({
            where: {
                name,
                role
            }
        })
        res.json(result)
    } catch (error) {
        console.log(error)
    }
}

module.exports.patchUser = (req, res) => {
    const name = req.body.name
    const role = req.body.role
    User.update({ role }, {
        where: {
            name
        }
    }).then((result) => {
        res.json(result).status(200);
    });
}

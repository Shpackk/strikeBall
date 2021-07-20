const { Router } = require('express')
const User = require('../models/User')
const router = Router();

router.post('/user/create', (req, res) => {
    const name = req.body.name
    const role = req.body.role
    User.create({
        name,
        role
    })
        .then(result => res.send(result))
        .catch(err => console.log(err))
})

router.delete('/user/delete', (req, res) => {
    const name = req.body.name
    const role = req.body.role
    User.destroy({
        where: {
            name,
            role
        }
    }).then(result => {
        res.json(result)
    }).catch(err => console.log(err))
})

router.patch('/user/role', (req, res) => {
    const name = req.body.name
    const role = req.body.role
    User.update({ role }, {
        where: {
            name
        }
    }).then((result) => {
        res.json(result).status(200);
    });
})

module.exports = router;
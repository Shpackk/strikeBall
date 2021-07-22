const User = require('../models/User')

module.exports.create_user = (req, res) => {
    const name = req.body.name
    const role = req.body.role
    User.create({
        name,
        role
    })
        .then(result => res.send(result))
        .catch(err => console.log(err))
}

module.exports.delete_user = async (req, res) => {
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
    // 20-25 dto
    // data access object
    // repositories
}

module.exports.patch_user = (req, res) => {
    const name = req.body.name
    const role = req.body.role
    User.update({ role }, {
        where: {
            name
        }
    }).then((result) => {
        res.json(result).status(200);
        // add status codes to response
        // error handler 
        // null check 
    });
}
const dbRequest = require('../userDTO/userDBrequests')

module.exports.deleteUser = async (req, res, next) => {
    const { name, role } = req.body
    try {
        dbRequest.deleteUser(name, role)
            .then(result => {
                res.status(202).json(result + " Deleted")
            })
    } catch (error) {
        error.status = 404
        next(error)
    }
}

module.exports.patchUser = (req, res, next) => {
    const { name, role } = req.body
    dbRequest.updateUser(name, role)
        .then((result) => {
            res.status(200).json(result + " Updated");
        }).catch(error => {
            error.status = 404
            next(error)
        })
}


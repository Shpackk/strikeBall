const dbRequest = require('../userDTO/userDBrequests')
const check = require('../middleware/inputVerify')

module.exports.deleteUser = async (req, res, next) => {
    const { name, role } = req.body
    check.inputValidation(name, role)
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
    check.inputValidation(name, role)
    dbRequest.updateUser(name, role)
        .then((result) => {
            res.status(200).json(result + " Updated");
        }).catch(error => {
            error.status = 404
            next(error)
        })
}


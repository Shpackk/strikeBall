function errorHandler(err, req, res, next) {
    // status codes err
    if (err.status === 409) {
        res.status(409).json({ "message": "user is already registered" })
    }
    if (err.status === 404) {
        res.status(404).json({ "message": "Not Found" })
    }
    if (err.status === 500) {
        res.status(500).json({ "message": "Server error, please try again" })
    }
    // msg errors ( fields verify)
    if (err.msg == "role") {
        res.status(400).json({ "message": "Enter correct role" })
    }
    if (err.msg == "password") {
        res.status(400).json({ "message": "Password should be greater than 5" })
    }
    if (err.msg == "name") {
        res.status(400).json({ "message": "Name should be in lowerCase and greater than 4" })
    }
    if (err.msg == "email") {
        res.status(400).json({ "message": "Bad Email" })
    }
}

module.exports = errorHandler

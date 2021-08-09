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
    if (err.msg == "wrong password") {
        res.status(400).json({
            "message": "You passed wrong password",
            "restoreLink": "localhost:3000/user/forgot-password"
        })
    }
    if (err.msg == "missmatch") {
        res.status(400).json({ "message": "Passwords did not match" })
    }
    if (err.msg == "managers") {
        res.status(404).json({ "message": "No managers yet" })
    }
    if (err.msg == "applied") {
        res.status(409).json({ "message": "You already applied. Please wait until we approve." })
    }
    if (err.msg == 'already in team') {
        res.status(409).json({ "message": "You already in this team. Switch team or request for leaving" })
    }
    if (err.msg == "not in team") {
        res.status(409).json({ "message": "You can't leave team you are not in" })
    }
    if (err.msg == 'teamkick') {
        res.status(404).json({ "message": "User not found or he is not in this team" })
    }
}

module.exports = errorHandler

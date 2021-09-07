function errorHandler(err, req, res, next) {
    // status codes err
    if (err.status === 409) {
        return res.status(409).json({ message: "user is already registered" })
    }
    if (err.status === 404) {
        return res.status(404).json({ message: "Not Found" })
    }
    if (err.status === 500) {
        return res.status(500).json({ message: "Server error, please try again" })
    }
    // msg errors ( fields verify)
    if (err.msg == "Bad token") {
        return res.status(409).json({ message: "Invalid token or token is expired. Please re-login" })
    }
    if (err.msg == "role") {
        return res.status(400).json({ message: "Enter correct role" })
    }
    if (err.msg == "password") {
        return res.status(400).json({ message: "Password should be greater than 5" })
    }
    if (err.msg == "name") {
        return res.status(400).json({ message: "Name should be in lowerCase and greater than 4" })
    }
    if (err.msg == 'email') {
        return res.status(400).json({ message: "Bad Email" })
    }
    if (err.msg == "wrong password") {
        return res.status(400).json({
            message: "You passed wrong password",
            restoreLink: "localhost:3000/user/forgot-password"
        })
    }
    if (err.msg == "missmatch") {
        return res.status(400).json({ message: "Passwords did not match" })
    }
    if (err.msg == "managers") {
        return res.status(404).json({ message: "No managers yet" })
    }
    if (err.msg == "applied") {
        return res.status(409).json({ message: "You already applied. Please wait until we approve." })
    }
    if (err.msg == 'already in team') {
        return res.status(409).json({ message: "You already in this team. Switch team or request for leaving" })
    }
    if (err.msg == "not in team") {
        return res.status(409).json({ message: "You can't leave team you are not in" })
    }
    if (err.msg == 'teamkick') {
        return res.status(404).json({ message: "User not found or he is not in this team" })
    }
    if (err.msg == 'taken name') {
        return res.status(409).json({ message: "This name is already taken" })
    }
    if (err.msg == 'No such team') {
        return res.status(404).json({ message: "This team doesnt exist" })
    }
    if (err.msg == "Filetype") {
        return res.status(409).json({ message: "Non-supported filetype. Pick PNG,JPG,JPEG" })
    }
    else {
        return res.status(409).json({ message: err })
    }
}

module.exports = errorHandler

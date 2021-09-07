function errorHandler(err, req, res, next) {
    let message = ''
    if (err.status === 409) {
        message = "user is already registered"
    }
    if (err.status === 404) {
        message = "Not Found"
    }
    if (err.status === 500) {
        message = "Server error, please try again"
    }
    if (err.msg == "Bad token") {
        err.status = 409
        message = "Invalid token or token is expired. Please re-login"
    }
    if (err.msg == "role") {
        err.status = 400
        message = "Enter correct role"
    }
    if (err.msg == "password") {
        err.status = 400
        message = "Password should be greater than 5"
    }
    if (err.msg == "name") {
        err.status = 400
        message = "Name should be in lowerCase and greater than 4"
    }
    if (err.msg == 'email') {
        err.status = 400
        message = "Bad Email"
    }
    if (err.msg == "wrong password") {
        err.status = 400
        message = "You passed wrong password. To reset password = localhost:3000/user/forgot-password"
    }
    if (err.msg == "missmatch") {
        err.status = 400
        message = "Passwords did not match"
    }
    if (err.msg == "managers") {
        err.status = 404
        message = "No managers yet"
    }
    if (err.msg == "applied") {
        err.status = 409
        message = "You already applied. Please wait until we approve."
    }
    if (err.msg == 'already in team') {
        err.status = 409
        message = "You already in this team. Switch team or request for leaving"
    }
    if (err.msg == "not in team") {
        err.status = 409
        message = "You can't leave team you are not in"
    }
    if (err.msg == 'teamkick') {
        err.status = 404
        message = "User not found or he is not in this team"
    }
    if (err.msg == 'taken name') {
        err.status = 409
        message = "This name is already taken"
    }
    if (err.msg == 'No such team') {
        err.status = 404
        message = "This team doesnt exist"
    }
    if (err.msg == "Filetype") {
        err.status = 409
        message = "Non-supported filetype. Pick PNG,JPG,JPEG"
    }
    return res.status(err.msg ? err.status : 500).json({ message: message ? message : err })
}

module.exports = errorHandler

const Role = require('../models/Roles')

function inputValidation(user) {
    const checkResult = badInput(user)
    if (checkResult) {
        error = { "msg": checkResult }
        throw error
    }
    return
}


function badInput(user) {
    const namePattern = /[a-z0-9]{5,}/
    if (namePattern.test(user.name) == false) {
        return "name"
    }
    if (user.hasOwnProperty('role')) {
        if (user.role == "") {
            return "role"
        }
    }

    if (user.hasOwnProperty('password')) {
        if (user.password.length < 5) {
            return "password"
            // add (if password)
        }
    }
    if (user.hasOwnProperty('email')) {
        const emailPattern = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gm
        if (!emailPattern.test(user.email)) {
            return "email"
        }
    }

    return false
}

module.exports = { inputValidation }


const Role = require('../models/Roles')

function badInput(name, role, password) {
    if (name.length < 4) {
        return "name"
    }
    if (role == "") {
        return "role"
    }
    if (password.length < 5) {
        return "password"
        // add (if password)
    }
    return false

    //email RegExp check



}
// function isRoleInvalid(role) {
//     if (role == "") {
//         return "role"
//     }
//     if (role != "") {
//         Role.findOne({
//             where: {
//                 role
//             }
//         }).then(result => {
//             console.log(result.dataValues.role)
//             return
//         })
//     }

// }


module.exports = { badInput }




function deleteUser(req, res) {
    res.render('delete')
}
function signUp(req, res) {
    res.render('signup')
}
function getAllUsers(req, res) {
    res.json({})
}



module.exports = { deleteUser, signUp, getAllUsers }


function deleteUser(req, res) {
    res.render('delete')
}
function signUp(req, res) {
    res.render('signup')
}
function getAllUsers(req, res) {
    res.json({})
}
function home(req, res) {
    res.render('index')
}
function login(req, res) {
    res.render('login')
}




module.exports = { deleteUser, signUp, getAllUsers, home, login }
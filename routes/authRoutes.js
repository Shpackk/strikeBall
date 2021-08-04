const { Router } = require('express');
const passport = require('passport');
const authController = require('../controller/authController')
const getController = require('../controller/getController')
const token = require('../userDTO/userTokenControll')
require('../config/passportJWT')
require('../config/passportGoogle')
const router = Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))

router.get('/auth/google/callback', function (req, res, next) {
    passport.authenticate('google', (err, user, info) => {
        const accessToken = token.sign({ user })
        const data = { user }
        res.header('token', accessToken)
        res.render('profile', {
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            picture: data.user.picture
        })
    })(req, res, next)
})
//-------------------
router.post('/user/signup', authController.createUser)

router.post('/user/login', authController.loginUser)

router.get('/signup', getController.signUp)

module.exports = router
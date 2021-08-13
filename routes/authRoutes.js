const { Router } = require('express');
const passport = require('passport');
const authController = require('../controller/authController')
const getController = require('../controller/getController')
const token = require('../DTO/userDTO/userTokenControll')
const multer = require('../service/staticFilesHandler')
require('../config/passportJWT')
require('../config/passportGoogle')
require('../config/passportFacebook')
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
            RoleId: 1,
            picture: data.user.picture
        })
    })(req, res, next)
})
//--------------

// router.get('/auth/facebook', passport.authenticate('facebook'))

// router.get('/auth/facebook/callback', function (req, res, next) {
//     passport.authenticate('facebook', (err, user, info) => {
//         console.log(user)
//         // const accessToken = token.sign({ user })
//         // const data = { user }
//         // res.header('token', accessToken)
//         // res.render('profile', {
//         //     email: data.user.email,
//         //     name: data.user.name,
//         //     RoleId: 1,
//         //     picture: data.user.picture
//         // })
//     })(req, res, next)
// })

//-------------------
router.post('/signup', multer.single('picture'), authController.createUser)

router.post('/login', authController.loginUser)

router.get('/signup', getController.signUp)

module.exports = router
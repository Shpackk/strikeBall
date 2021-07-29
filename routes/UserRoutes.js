const { Router } = require('express');
const passport = require('passport');
const userController = require('../controller/userController')
const authController = require('../controller/authController')
require('../config/passportJWT')
const router = Router();


router.post('/user/create', authController.createUser)

router.post('/user/login', authController.loginUser)

router.delete('/user/delete', passport.authenticate('jwt', { session: false },), userController.deleteUser)

router.patch('/user/role', userController.patchUser)

module.exports = router;

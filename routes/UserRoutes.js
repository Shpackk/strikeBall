const { Router } = require('express');
const router = Router();
const passport = require('passport');
const userController = require('../controller/userController')
const getController = require('../controller/getController');
const User = require('../models/User');

require('../config/passportJWT')
require('../config/passportGoogle')


router.get('/user/:id', passport.authenticate('jwt', { session: false },), userController.viewOneById)

router.get('/user/delete', passport.authenticate('jwt', { session: false },), getController.deleteUser)// for page view

router.get('/user/viewUsers', passport.authenticate('jwt', { session: false },), userController.viewUsers)

router.get('/user/managers', passport.authenticate('jwt', { session: false },), userController.viewManagers)

router.get('/user/profile/:id', passport.authenticate('jwt', { session: false },), userController.profile) // CURR

router.post('/user/forgot-password', userController.forgotPassword)

router.post('/user/reset-password/:accessToken', userController.resetPassword)

router.delete('/user/delete', passport.authenticate('jwt', { session: false },), userController.deleteUser)

router.patch('/user/:id/update', passport.authenticate('jwt', { session: false },), userController.userInfoUpdate)

module.exports = router;

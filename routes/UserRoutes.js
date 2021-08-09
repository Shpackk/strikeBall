const { Router } = require('express');
const router = Router();
const passport = require('passport');
const userController = require('../controller/userController')
const getController = require('../controller/getController');
const User = require('../models/User');

require('../config/passportJWT')
require('../config/passportGoogle')


router.get('/user/delete', passport.authenticate('jwt', { session: false },), getController.deleteUser)// for page view

router.get('/users/all', passport.authenticate('jwt', { session: false }), userController.viewUsers)

router.get('/users/manager', passport.authenticate('jwt', { session: false },), userController.viewManagers)// fix

router.get('/requests', passport.authenticate('jwt', { session: false },), userController.getRequests)

router.post('/user/forgot-password', userController.forgotPassword)

router.post('/user/reset-password/:accessToken', userController.resetPassword)

router.delete('/user/delete/', passport.authenticate('jwt', { session: false },), userController.deleteUser)

router.patch('/user/update', passport.authenticate('jwt', { session: false },), userController.userInfoUpdate)

router.get('/user/requests', passport.authenticate('jwt', { session: false },), userController.userOwnRequests)

router.delete('/user/requests/delete/:id', passport.authenticate('jwt', { session: false },), userController.userDeleteRequest)

router.get('/user/profile/:id', passport.authenticate('jwt', { session: false },), userController.profile)

router.get('/user/:id', passport.authenticate('jwt', { session: false },), userController.viewOneById)

router.patch('/requests/:id', passport.authenticate('jwt', { session: false },), userController.populateRequest)

router.post('/user/:id/ban', passport.authenticate('jwt', { session: false },), userController.banUser)

router.delete('/user/:id/unban', passport.authenticate('jwt', { session: false },), userController.unbanUser)

module.exports = router;

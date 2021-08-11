const { Router } = require('express');
const router = Router();
const passport = require('passport');
const userController = require('../controller/userController')
const role = require('../middleware/requireAdmin')
const multer = require('../service/multer')
require('../config/passportJWT')
require('../config/passportGoogle')
// const getController = require('../controller/getController');
// const User = require('../models/User');


// router.get('/user/delete', passport.authenticate('jwt', { session: false }), getController.deleteUser)// for page view

router.get('/managers', passport.authenticate('jwt', { session: false }), role.requireAdmin, userController.viewManagers)

router.get('/requests', passport.authenticate('jwt', { session: false }), role.requireAdmin, userController.getRequests)

router.post('/user/forgot-password', userController.forgotPassword)

router.post('/user/reset-password/:accessToken', userController.resetPassword)

router.delete('/user/delete/:id', passport.authenticate('jwt', { session: false }), role.requireAdmin, userController.deleteUser)

router.patch('/user/update', multer.single('picture'), passport.authenticate('jwt', { session: false }), userController.userInfoUpdate)

router.get('/user/requests', passport.authenticate('jwt', { session: false }), userController.userOwnRequests)

router.get('/user/profile', passport.authenticate('jwt', { session: false }), userController.profile)

router.delete('/user/requests/delete/:id', passport.authenticate('jwt', { session: false }), userController.userDeleteRequest)

router.get('/users', passport.authenticate('jwt', { session: false }), userController.viewUsers)

router.get('/user/:id', passport.authenticate('jwt', { session: false }), role.requireManagerAdmin, userController.viewOneById)

router.patch('/requests/:id', passport.authenticate('jwt', { session: false }), role.requireManagerAdmin, userController.populateRequest)

router.post('/user/:id/ban', passport.authenticate('jwt', { session: false }), role.requireAdmin, userController.banUser)


module.exports = router;

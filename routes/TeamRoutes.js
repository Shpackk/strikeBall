const { Router } = require('express');
const passport = require('passport');
const teamController = require('../controller/teamController')
require('../config/passportJWT')
const router = Router();


// router.get('/team/view')

router.post('/team/createTeam', passport.authenticate('jwt', { session: false }), teamController.createTeam)

router.patch('/team/:id/join', passport.authenticate('jwt', { session: false }), teamController.joinTeam)

router.delete('/team/:id/leave', passport.authenticate('jwt', { session: false }), teamController.leaveTeam)

router.get('/team/:id/players', passport.authenticate('jwt', { session: false },), teamController.viewPlayersInTeam)

router.delete('/team/:id/kick', passport.authenticate('jwt', { session: false },), teamController.kickPlayerFromTeam)

module.exports = router;
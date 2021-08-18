const { Router } = require('express');
const passport = require('passport');
const teamController = require('../controller/teamController')
const role = require('../middleware/requireAdmin')
const router = Router();
require('../config/passportJWT')


router.post('/team/createTeam', passport.authenticate('jwt', { session: false }), role.requireManagerAdmin, teamController.createTeam)

router.patch('/team/:id/join', passport.authenticate('jwt', { session: false }), teamController.joinTeam)

router.delete('/team/:id/leave', passport.authenticate('jwt', { session: false }), teamController.leaveTeam)

router.get('/team/:id/players', passport.authenticate('jwt', { session: false }), teamController.viewPlayersInTeam)

router.delete('/team/:id/kick', passport.authenticate('jwt', { session: false }), role.requireManagerAdmin, teamController.kickPlayerFromTeam)

module.exports = router;
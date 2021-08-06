const { Router } = require('express');
const passport = require('passport');
const teamController = require('../controller/teamController')
require('../config/passportJWT')
const router = Router();


// router.get('/team/view')

router.post('/team/createTeam', passport.authenticate('jwt', { session: false }), teamController.createTeam)

router.patch('/team/join/:id', passport.authenticate('jwt', { session: false }), teamController.joinTeam)

router.delete('/team/leave/:id', passport.authenticate('jwt', { session: false }), teamController.leaveTeam)

module.exports = router;
const { Router } = require('express');
const passport = require('passport');
const TeamController = require('../controller/teamController')
require('../config/passportJWT')
const router = Router();


router.post('/team/createTeam', passport.authenticate('jwt', { session: false }), TeamController.createTeam)

router.patch('/team/addUser', passport.authenticate('jwt', { session: false }), TeamController.addToTeam)

router.delete('/team/deleteUser', passport.authenticate('jwt', { session: false }), TeamController.deleteFromTeam)

module.exports = router;
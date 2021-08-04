const { Router } = require('express');
const passport = require('passport');
const teamController = require('../controller/teamController')
require('../config/passportJWT')
const router = Router();


// router.get('/team/view')

router.post('/team/createTeam', passport.authenticate('jwt', { session: false }), teamController.createTeam)

router.patch('/team/:id/add', passport.authenticate('jwt', { session: false }), teamController.addToTeam)

router.delete('/team/:id/delete', passport.authenticate('jwt', { session: false }), teamController.deleteFromTeam)

module.exports = router;
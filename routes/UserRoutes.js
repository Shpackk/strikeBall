const { Router } = require('express')
const userController = require('../controller/userController')
const router = Router();


router.post('/user/create', userController.createUser)

router.delete('/user/delete', userController.deleteUser)

router.patch('/user/role', userController.patchUser)

router.post('/user/login', userController.loginUser)

module.exports = router;

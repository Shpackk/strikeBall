const { Router } = require('express')
const userController = require('../controller/userController')
const router = Router();


router.post('/user/create', userController.create_user)

router.delete('/user/delete', userController.delete_user)

router.patch('/user/role', userController.patch_user)

module.exports = router;

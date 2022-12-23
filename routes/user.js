const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/user/register',userController.newUser);
router.post('/user/login',userController.login);
router.get('/user',userController.getUser);
router.put('/user',userController.editUser);
router.put('/user/rep/up',userController.upVote);
router.put('/user/rep/down',userController.downVote);


module.exports = router;
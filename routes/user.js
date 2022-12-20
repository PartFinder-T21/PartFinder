const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/user/register',userController.newUser);
router.post('/user/login',userController.login);


module.exports = router;
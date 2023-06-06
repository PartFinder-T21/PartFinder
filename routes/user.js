const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const tokenChecker = require("../tokenChecker");
const corsMiddleware = require("../corsMiddleware");

router.post('/user/register',corsMiddleware,userController.newUser);
router.post('/user/login',corsMiddleware,userController.login);
router.get('/user',userController.getUser);
router.put('/user',tokenChecker,userController.editUser);
router.put('/user/rep/up',tokenChecker,userController.upVote);
router.put('/user/rep/down',tokenChecker,userController.downVote);
router.delete('/user/delete',tokenChecker,userController.deleteUser);

module.exports = router;
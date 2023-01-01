const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');
const tokenChecker = require("../tokenChecker");

//methods for managing groups
router.post('/group',tokenChecker,groupController.newGroup);
router.get('/group',groupController.getGroups);
router.get('/group/:user',tokenChecker,groupController.getMyGroups);
router.put('/group',tokenChecker,groupController.editGroup);
router.delete('/group',tokenChecker,groupController.deleteGroup);

//methods for handling player requests
router.put('/group/accept',tokenChecker,groupController.addPlayer);
router.put('/group/decline',tokenChecker,groupController.declinePlayer);
router.put('/group/remove',tokenChecker,groupController.removePlayer);
router.put('/group/request',tokenChecker,groupController.requestJoin);

//methods for player interaction
router.put('/group/chat',tokenChecker,groupController.newMessage);
router.get('/group/chat/:code',tokenChecker,groupController.getMessages);
router.put('/group/chat/roll',tokenChecker,groupController.rollDice);

module.exports = router;
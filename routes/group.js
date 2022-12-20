const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');

//methods for managing groups
router.post('/group',groupController.newGroup);
router.get('/group',groupController.getGroups);
router.put('/group',groupController.editGroup);
router.delete('/group',groupController.deleteGroup);

//methods for handling player requests
router.put('/group/accept',groupController.addPlayer);
router.put('/group/decline',groupController.declinePlayer);
router.put('/group/remove',groupController.removePlayer);
router.put('/group/request',groupController.requestJoin);

//methods for player interaction
router.put('/group/chat',groupController.newMessage);
router.get('/group/chat',groupController.getMessages);
//router.put('/group/chat',groupController.throwDice);

module.exports = router;
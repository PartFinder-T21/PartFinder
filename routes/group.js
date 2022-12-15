const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');

router.post('/group',groupController.newGroup);
router.get('/group',groupController.getAllGroups);
router.get('/group',groupController.getOneGroup)
router.put('/group',groupController.editGroup);

router.put('/group/accept',groupController.addPlayer);
router.put('/group/decline',groupController.declinePlayer);
router.put('/group/remove',groupController.removePlayer);
router.put('/group/request',groupController.requestJoin);
router.delete('/group',groupController.deleteGroup);


module.exports = router;
const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');

router.post('/group',groupController.newGroup);
router.get('/group',groupController.getAllGroups);
router.put('/group/:id',groupController.editGroup);


router.put('/group/accept/:character',groupController.addPlayer);
router.put('/group/decline/:character',groupController.declinePlayer);
router.put('/group/remove/:user',groupController.removePlayer);
router.delete('/group',groupController.deleteGroup);


module.exports = router;
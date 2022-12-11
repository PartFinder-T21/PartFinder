const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');

router.post('/group',groupController.newGroup);
router.get('/group',groupController.getAllGroups);



module.exports = router;
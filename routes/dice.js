const express = require('express');
const router = express.Router();
const diceController = require('../controllers/dice');

router.get('/dice',diceController.throwDice);

module.exports = router;
const express = require('express');
const router = express.Router();
const characterController = require('../controllers/character');
const tokenChecker = require("../tokenChecker");

router.post('/character',tokenChecker,characterController.newCharacter);
router.get('/character',tokenChecker,characterController.getCharacters);
router.put('/character',tokenChecker,characterController.editCharacter);
router.delete('/character',tokenChecker,characterController.deleteOneCharacter);

module.exports = router;
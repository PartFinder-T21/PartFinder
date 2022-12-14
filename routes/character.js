const express = require('express');
const router = express.Router();
const characterController = require('../controllers/character');

router.post('/character',characterController.newCharacter);
router.get('/character',characterController.getAllCharacters);
router.get('/character',characterController.getOneCharacter);
router.put('/character',characterController.editCharacter);
router.delete('/character',characterController.deleteOneCharacter)

module.exports = router;
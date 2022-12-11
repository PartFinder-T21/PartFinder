const express = require('express');
const router = express.Router();
const characterController = require('../controllers/character');

router.post('/characters',characterController.newCharacter);
router.get('/characters',characterController.getAllCharacters);
router.get('/characters/:name:user',characterController.getOneCharacter);
router.put('/character/:name:user',characterController.editCharacter);
router.delete('/character/:name:user',characterController.deleteOneCharacter)

module.exports = router;
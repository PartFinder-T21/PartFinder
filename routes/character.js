const express = require('express');
const router = express.Router();
const characterController = require('../controllers/character');

router.post('/characters',characterController.newCharacter);
router.get('/characters',characterController.getAllCharacters);
router.get('/characters/:name',characterController.getOneCharacter);
router.put('/character/:name',characterController.editCharacter);
router.delete('/character/:name',characterController.deleteOneCharacter)

module.exports = router;
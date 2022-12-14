const express = require('express');
const router = express.Router();
const characterController = require('../controllers/character');

router.post('/character',characterController.newCharacter);
router.get('/character',characterController.getAllCharacters);
router.get('/character/:id',characterController.getOneCharacter);
router.put('/character/:id',characterController.editCharacter);
router.delete('/character/:id',characterController.deleteOneCharacter)

module.exports = router;
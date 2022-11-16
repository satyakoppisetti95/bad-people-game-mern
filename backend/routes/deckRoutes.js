const express = require('express')
const router = express.Router()
const deckController = require('../controllers/deckController')
const {authorize} = require('../middleware/authMiddleware');

router.route('/create').post(authorize,deckController.createDeck)

module.exports = router
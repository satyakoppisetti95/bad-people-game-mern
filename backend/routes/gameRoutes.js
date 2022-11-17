const express = require('express')
const router = express.Router()
const gameController = require('../controllers/gameController')
const {authorize} = require('../middleware/authMiddleware');

router.route('/create').post(authorize,gameController.createGame)
router.route('/players').get(authorize,gameController.getPlayersOfGame)
router.route('/join').post(authorize,gameController.joinGame)
router.route('/start').post(authorize,gameController.startGame)
router.route('/question').get(authorize,gameController.getCurrentQuestion)
router.route('/answer').post(authorize,gameController.answerQuestion)
router.route('/ready').post(authorize,gameController.setPlayerReady)

module.exports = router
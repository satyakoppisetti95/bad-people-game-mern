const mongoose = require('mongoose')

const GAME_STATUS_ENUM = ['waiting', 'started', 'finished']
const ROUND_STATUS_ENUM = ['choosing','voting','waiting', 'results','finished']
const PLAYER_STATUS_ENUM = ['voting','waiting','ready','finished','results']
const gameSchema = mongoose.Schema(
  {
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    players: [{ 
      name: { type: String, required: true },
      score: { type: Number, required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      status: { type: String, enum: PLAYER_STATUS_ENUM, default: 'waiting' },
    }],
    gameStatus: { type: String, required: true, enum: GAME_STATUS_ENUM },
    roundStatus: { type: String, required: false, enum: ROUND_STATUS_ENUM },
    currentRound: { type: Number, default: 0 },
    questions: { type: Array, required: true },
    numberOfRounds: { type: Number, default: 10 },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Game', gameSchema)
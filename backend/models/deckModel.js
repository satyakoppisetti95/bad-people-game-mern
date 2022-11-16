const mongoose = require('mongoose')

const deckSchema = mongoose.Schema(
  {
    name: {type: String, required: [true, 'Please add a name']},
    cards: {type: Array, required: [true, 'Please add cards']},
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Deck', deckSchema)
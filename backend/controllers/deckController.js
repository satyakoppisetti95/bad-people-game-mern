const asyncHandler = require('express-async-handler')
const deckModel = require('../models/deckModel');

exports.createDeck = asyncHandler(async (req, res) => {
    const { name, cards } = req.body;
    if (!name || !cards) {
        res.status(400);
        throw new Error('Please add all fields');
    }
    const deck = await deckModel.create({
        name,
        cards,
    });
    if (deck) {
        res.status(201).json(deck);
    } else {
        res.status(400);
        throw new Error('Invalid deck data');
    }
});
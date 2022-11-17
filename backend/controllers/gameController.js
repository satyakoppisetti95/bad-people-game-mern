const asyncHandler = require('express-async-handler')
const gameModel = require('../models/gameModel');
const userModel = require('../models/userModel');
const deckModel = require('../models/deckModel');

// @desc    Create a new game
// @route   POST /api/games
// @access  Private

//function to create random 4 digit game code
const generateGameCode = () => {
    let gameCode = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 4; i++) {
        gameCode += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return gameCode;
};

exports.createGame = asyncHandler(async (req, res) => {
    const user = await userModel.findById(req.user._id);
    if(!user){
        throw new Error('User not found');
    }
    if(user.isInGame){
        throw new Error('User is already in a game');
    }
    const game = await gameModel.create({
        host: req.user._id,
        code: generateGameCode(),
        players: [{ 
            name: user.name,
            score: 0,
            userId: user._id,
            status: 'waiting'
          }],
        gameStatus: 'waiting',
        questions: [],
    });

    user.isInGame = true;
    user.game = game._id;
    await user.save();

    res.status(201).json(game);
});

exports.joinGame = asyncHandler(async (req, res) => {
    const {gameCode} = req.body;
    const game = await gameModel.findOne({code: gameCode});
    if(!game){
        res.status(404);
        throw new Error('Game not found');
    }
    if(game.gameStatus !== 'waiting'){
        res.status(400);
        throw new Error('Game has already started or finished');
    }
    const user = await userModel.findById(req.user._id);
    game.players.push({ 
        name: user.name,
        score: 0,
        userId: user._id,
        status: 'waiting'
    });
    await game.save();

    user.isInGame = true;
    user.game = game._id;
    await user.save();

    res.status(200).json(game);
});

exports.getPlayersOfGame = asyncHandler(async (req, res) => {
    const game = await gameModel.findById(req.user.game);
    if(!game){
        throw new Error('Game not found');
    }
    const result = game.players.map(player => {
        return {
            name: player.name,
            score: player.score,
            status: player.status
        }
    });
    res.status(200).json({players: result,status: game.gameStatus});
});

const getPlayerForRound = (players, round) => {
    return players[round % players.length];
};

exports.startGame = asyncHandler(async (req, res) => {
    if(!req.body.id){
        throw new Error('Invalid request');
    }
    const game = await gameModel.findById(req.body.id);
    if(!game){
        throw new Error('Game not found');
    }
    if(game.host.toString() !== req.user._id.toString()){
        throw new Error('User is not the host of the game');
    }
    if(game.gameStatus !== 'waiting'){
        throw new Error('Game has already started or finished');
    }
    if(game.players.length < 3){
        throw new Error('Cannot start game, not enough players');
    }
    let numberOfRounds = req.body.numberOfRounds || 10;
    
    //get default deck
    const deck = await deckModel.findOne({name: 'Default'}); // todo: later on, allow user to choose deck
    if(!deck){
        throw new Error('Default deck not found');
    }
    //shuffle deck
    const shuffledDeck = deck.cards.sort(() => Math.random() - 0.5);
    //get random questions
    const questions = shuffledDeck.slice(0, numberOfRounds);

    for(let i = 0; i < questions.length; i++){
        game.questions.push({
            question: questions[i],
            playerAnswers: [],
            dictator: getPlayerForRound(game.players, i),
        });
    }

    game.gameStatus = 'started';
    game.roundStatus = 'choosing';

    //set players status
    game.players.forEach(player => {
        if(player.userId.toString() === game.questions[0].dictator.userId.toString()){
            player.status = 'voting';
        } else {
            player.status = 'waiting';
        }
    });

    await game.save();
    res.status(200).json(await gameModel.findById(req.body.id).select('-questions'));
});

exports.getCurrentQuestion = asyncHandler(async (req, res) => {
    const game = await gameModel.findById(req.user.game);
    if(!game){
        throw new Error('Game not found');
    }
    if(game.gameStatus !== 'started'){
        throw new Error('Game has not started or has finished');
    }
    const currentRound = game.currentRound;
    const question = game.questions[currentRound];
    if(!question){
        throw new Error('Question not found');
    }
    const playerStatus = game.players.find(player => player.userId.toString() === req.user._id.toString()).status;
    const players = game.players.map(player => {
        return {
            name: player.name,
            score: player.score,
            status: player.status,
        };
    });
    res.status(200).json({question:question.question,dictator:question.dictator,roundStatus:game.roundStatus,playerStatus:playerStatus,players:players});
});


exports.answerQuestion = asyncHandler(async (req, res) => {
    if(!req.body.answer){
        throw new Error('Invalid request');
    }
    const game = await gameModel.findById(req.user.game);
    if(!game){
        throw new Error('Game not found');
    }
    if(game.gameStatus !== 'started'){
        throw new Error('Game has not started or has finished');
    }
    if(req.user._id.toString() === game.questions[game.currentRound].dictator.userId.toString()){
        if(game.roundStatus !== 'choosing' || game.questions[game.currentRound].answer){
            throw new Error('Dictator has already chosen an answer');
        }
        game.questions[game.currentRound].answer = req.body.answer;
        game.markModified('questions');
        game.roundStatus = 'voting';
        game.players.forEach(player => {
            if(player.userId.toString() === game.questions[game.currentRound].dictator.userId.toString()){
                player.status = 'waiting';
            }
        });
        game.markModified('players');
    }else{
        if(game.roundStatus !== 'voting'){
            throw new Error('Round is not in voting phase');
        }
        if(!game.questions[game.currentRound].answer){
            throw new Error('Dictator has not submitted an answer yet');
        }
        game.questions[game.currentRound].playerAnswers.push({
            user: {name:req.user.name, userId:req.user._id},
            answer: req.body.answer,
        });
        game.markModified('questions');
        //set player status to waiting
        game.players.forEach(player => {
            if(player.userId.toString() === req.user._id.toString()){
                player.status = 'waiting';
            }
        });
    }

    if(game.questions[game.currentRound].playerAnswers.length === game.players.length - 1){
        game.roundStatus = 'results';
        //calculate scores
        const dictatorAnswer = game.questions[game.currentRound].answer;
        const playerAnswers = game.questions[game.currentRound].playerAnswers;
        const dictator = game.questions[game.currentRound].dictator;
        const players = game.players;
        playerAnswers.forEach(playerAnswer => {
            if(playerAnswer.answer === dictatorAnswer && playerAnswer.user.userId.toString() !== dictator.userId.toString()){
                const player = players.find(player => player.userId.toString() === playerAnswer.user.userId.toString());
                player.score++;
            }
        });
        game.markModified('players');
    }

    await game.save();
    res.status(200).json({message: 'Answer submitted'});
});


exports.setPlayerReady = asyncHandler(async (req, res) => {
    const game = await gameModel.findById(req.user.game);
    if(!game){
        throw new Error('Game not found');
    }
    if(game.gameStatus !== 'started'){
        throw new Error('Game has not started or has finished');
    }
    const player = game.players.find(player => player.userId.toString() === req.user._id.toString());
    if(!player){
        throw new Error('Player not found');
    }
    // if(player.status !== 'results'){
    //     throw new Error('Player is not waiting');
    // }
    player.status = 'ready';
    game.markModified('players');
    await game.save();

    // if all players are ready, move to next round
    if(game.players.every(player => player.status === 'ready')){
        game.currentRound++;
        //check if game is over
        if(game.currentRound === game.questions.length){
            game.gameStatus = 'finished';
            game.roundStatus = 'finished';
        }else{
            game.roundStatus = 'choosing';
            game.players.forEach(player => {
                if(player.userId.toString() === game.questions[game.currentRound].dictator.userId.toString()){
                    player.status = 'voting';
                } else {
                    player.status = 'waiting';
                }
            });
            game.markModified('players');
        }
        await game.save();
    }

    res.status(200).json({message: 'Player is ready'});
});
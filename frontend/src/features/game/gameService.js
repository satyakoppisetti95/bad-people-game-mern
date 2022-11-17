import axios from 'axios'

const API_URL = '/api/games/'

const getConfig = (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    return config
}
const createGame = async (token) => {
    const config = getConfig(token)
    const response = await axios.post(API_URL+'create', {}, config)
    return response.data
}

const joinGame = async (gameCode, token ) => {
    const config = getConfig(token)
    const response = await axios.post(API_URL + 'join', { gameCode }, config)
    return response.data
}

const startGame = async (gameId, token) => {
    const config = getConfig(token)
    const response = await axios.post(API_URL + 'start', { id:gameId }, config)
    return response.data
}

const getGame = async (gameId, token) => {
    const config = getConfig(token)
    const response = await axios.get(API_URL + gameId, config)
    return response.data
}


const getCurrentQuestion = async (token) => {
    const config = getConfig(token)
    const response = await axios.get(API_URL + 'question', config)
    return response.data
}

const getPlayersOfGame = async (token) => {
    const config = getConfig(token)
    const response = await axios.get(API_URL + 'players', config)
    return response.data
}

const answerQuestion = async (answer, token) => {
    const config = getConfig(token)
    const response = await axios.post(API_URL + 'answer', { answer }, config)
    return response.data
}

const gameService = {
    createGame,
    joinGame,
    startGame,
    getGame,
    getCurrentQuestion,
    getPlayersOfGame,
    answerQuestion
}

export default gameService;
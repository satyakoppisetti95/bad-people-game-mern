import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import gameService from './gameService'

const constructErrorMsg = (error) => {
    const message =
        (error.response &&
            error.response.data &&
            error.response.data.message) ||
        error.message ||
        error.toString()
    return message
}

const initialState = {
    game: null,
    isHost: false,
    gameStarted: false,
    gameEnded: false,
    waitingForPlayers: false,
    waitingForResponses: false,
    showQuestion: false,
    isError: null,
    isSuccess: null,
    message: null,
    isLoading: false,
    players: [],
    currentQuestion: null,
    roundStatus: null,
    playerStatus: null,
    leaderboard: null,
}


export const createGame = createAsyncThunk(
    'game/createGame',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await gameService.createGame(token)
        } catch (error) {
            const message = constructErrorMsg(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const joinGame = createAsyncThunk(
    'game/joinGame',
    async (gameCode, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await gameService.joinGame(gameCode, token)
        } catch (error) {
            const message = constructErrorMsg(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const startGame = createAsyncThunk(
    'game/startGame',
    async (gameId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await gameService.startGame(gameId,token)
        } catch (error) {
            const message = constructErrorMsg(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)


export const getGame = createAsyncThunk(
    'game/getGame',
    async (gameId, thunkAPI) => {
        try {
            console.log("getGame called")
            const token = thunkAPI.getState().auth.user.token
            return await gameService.getGame(gameId, token)
        } catch (error) {
            const message = constructErrorMsg(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)



export const getCurrentQuestion = createAsyncThunk(
    'game/getCurrentQuestion',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await gameService.getCurrentQuestion(token)
        } catch (error) {
            const message = constructErrorMsg(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getPlayersOfGame = createAsyncThunk(
    'game/getPlayersOfGame',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await gameService.getPlayersOfGame(token)
        } catch (error) {
            const message = constructErrorMsg(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const answerQuestion = createAsyncThunk(
    'game/answerQuestion',
    async (answer, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await gameService.answerQuestion(answer, token)
        } catch (error) {
            const message = constructErrorMsg(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const getCurrentRoundScores = createAsyncThunk(
    'game/getCurrentRoundScores',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await gameService.getCurrentRoundScores(token)
        } catch (error) {
            const message = constructErrorMsg(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const setPlayerReady = createAsyncThunk(
    'game/setPlayerReady',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await gameService.setPlayerReady(token)
        } catch (error) {
            const message = constructErrorMsg(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const leaveGame = createAsyncThunk(
    'game/leaveGame',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token
            return await gameService.leaveGame(token)
        } catch (error) {
            const message = constructErrorMsg(error)
            return thunkAPI.rejectWithValue(message)
        }
    }
)


export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        reset: (state) => {
            console.log("resetting game state")
            return initialState
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createGame.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createGame.fulfilled, (state, action) => {
                state.game = action.payload
                state.isHost = true
                state.waitingForPlayers = true
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(createGame.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getPlayersOfGame.fulfilled, (state, action) => {
                state.players = action.payload.players
                state.gameStarted = action.payload.status === "started"
            })
            .addCase(getPlayersOfGame.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(startGame.pending, (state) => {
                state.isLoading = true
            })
            .addCase(startGame.fulfilled, (state, action) => {
                state.game = action.payload
                state.gameStarted = true
                state.waitingForPlayers = false
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(startGame.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(joinGame.pending, (state) => {
                state.isLoading = true
                state.isError = false
                state.message = null
            })
            .addCase(joinGame.fulfilled, (state, action) => {
                state.game = action.payload
                state.isHost = false
                state.waitingForPlayers = true
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(joinGame.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getGame.fulfilled, (state, action) => {
                state.game = action.payload
                state.players = action.payload.players
                state.isError = false
                state.isSuccess = true
                state.message = null
                if(action.payload.isStarted){
                    state.gameStarted = true
                    state.waitingForPlayers = false
                }
            })
            .addCase(getGame.rejected, (state, action) => {
                state.isError = true
                state.isSuccess = false
                state.message = action.payload
            })
            .addCase(getCurrentQuestion.fulfilled, (state, action) => {
                state.currentQuestion = action.payload
                state.players = action.payload.players
                state.roundStatus = action.payload.roundStatus
                state.playerStatus = action.payload.playerStatus
            })
            .addCase(getCurrentQuestion.rejected, (state, action) => {
                state.isError = true
                state.isSuccess = false
                state.message = action.payload
                state.players = null
                state.roundStatus = null
                state.playerStatus = null
            })
            .addCase(answerQuestion.fulfilled, (state, action) => {
                if(state.roundStatus === 'choosing'){
                    state.roundStatus = 'voting'
                }
                state.playerStatus = 'waiting'
                state.players = action.payload.players
            })
            .addCase(getCurrentRoundScores.fulfilled, (state, action) => {
                state.leaderboard = action.payload
                state.players = action.payload.players
                state.playerStatus = action.payload.playerStatus
                state.roundStatus = action.payload.roundStatus
            })
            .addCase(setPlayerReady.fulfilled, (state, action) => {
                state.playerStatus = 'ready'
                state.players = action.payload.players
            })
            .addCase(leaveGame.fulfilled, (state, action) => {
                state.game = null
            })
    },
})

export const { reset } = gameSlice.actions
export default gameSlice.reducer
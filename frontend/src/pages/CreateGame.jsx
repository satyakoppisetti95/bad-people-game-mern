import { Button, Container, Row, Col, Spinner } from 'react-bootstrap'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createGame, getPlayersOfGame, startGame } from '../features/game/gameSlice'
import PlayerCard from '../components/playerCard'
function CreateGame() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const { game, players, isLoading, isError, message, gameStarted } = useSelector(
        (state) => state.game
    )

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
        if (!game) {
            dispatch(createGame())
        }

    }, [user, game, navigate, dispatch])
    // useWhatChanged([user, game], 'a, b, c, d');

    useEffect(() => {
        const pullPlayers = game && setInterval(() => {
            // console.log('pulling players')
            dispatch(getPlayersOfGame(game._id))
        }, 3000)

        return () => {
            if (pullPlayers) {
                clearInterval(pullPlayers)
            }
        }
    }, [game,dispatch])

    useEffect(() => {
        if (gameStarted) {
            navigate('/question')
        }
    }, [gameStarted, navigate])

    const onStartGame = () => {
        dispatch(startGame(game._id))
    }


    if (isLoading) {
        return (
            <Container style={{ marginTop: '32px', textAlign: 'center' }}>
                <Spinner animation="border" role="status">
                </Spinner>
            </Container>
        )
    }

    return (
        <Container style={{ marginTop: '32px', textAlign: 'center' }}>
            <Row>
                <Col xs={12} md={4} lg={4}></Col>
                <Col xs={12} md={4} lg={4}>

                    {
                        isError ?
                            (
                                <>
                                    <h3>{message}</h3>
                                    {user.game ?
                                        (<div className="d-grid gap-2">
                                            <Button variant="primary" style={{ marginTop: '32px' }}> Resume Game</Button>
                                        </div>) : <> </>}
                                    <div className="d-grid gap-2">
                                        <Button variant="info" href="/" style={{ marginTop: '32px' }}> Go Back</Button>
                                    </div>
                                </>
                            )
                            :
                            (
                                game ?
                                    (
                                        <>
                                            <h1>{game.code}</h1>
                                            <h6>Enter above code to join game</h6>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '24px' }}>
                                                <div>Waiting for players...</div>
                                                <div>{players.length > 0 ? players.length : ""}</div>
                                            </div>
                                            {players.map((player) => (
                                                <PlayerCard key={player.name} player={player} />
                                            ))}
                                            {players.length > 2 ?
                                                <div className="d-grid gap-2">
                                                    <Button variant="primary" onClick={onStartGame} style={{ marginTop: '32px' }}>START GAME</Button>
                                                </div>
                                                :
                                                null}
                                        </>
                                    ) :
                                    (
                                        <></>
                                    )
                            )
                    }
                </Col>
                <Col xs={12} md={4} lg={4}></Col>
            </Row>

        </Container>
    );
}

export default CreateGame;

import { Button, Container, Row, Col, Spinner,Form,Card } from 'react-bootstrap'
import { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { joinGame, getPlayersOfGame } from '../features/game/gameSlice'
import PlayerCard from '../components/playerCard'
import { toast } from 'react-toastify'
function CreateGame() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const { game, players, isLoading,isError,message,gameStarted } = useSelector(
        (state) => state.game
    )
    //todo : resume game
    useEffect(() => {
        if (isError) {
          toast.error(message)
        }
    }, [isError, message])

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
    }, [user, navigate])

    useEffect(() => {
        const pullPlayers = game && setInterval(() => {
            console.log('pulling players')
            dispatch(getPlayersOfGame(game._id))
        }, 3000)
        return () => {
            if(pullPlayers){
                clearInterval(pullPlayers)
            }
        }
    }, [game,dispatch])

    useEffect(() => {
        if (gameStarted) {
            navigate('/question')
        }
    }, [gameStarted,navigate])

    const [gameCode, setGameCode] = useState('')

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(joinGame(gameCode))
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
                    {game ?
                        (
                            <>
                                <h1>{game.code}</h1>
                                <h3> Waiting for host to start game</h3>
                                <br></br>
                                <h3> Players in game...</h3>
                                {players.map((player) => (
                                    <PlayerCard key={player.name} player={player} />
                                ))}
                            </>
                        ):
                        (
                            <>
                                
                                <Card>
                                    <Card.Body>
                                    <h1>Join Game</h1>
                                    <Form onSubmit={onSubmit}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Enter game code</Form.Label>
                                            <Form.Control type="text" placeholder="Enter Game Code" value={gameCode} onChange={(e)=>setGameCode(e.target.value.toUpperCase())} id='gameCode' name='gameCode'/>
                                        </Form.Group>
                                        <Button variant="primary" type="submit" >
                                            Submit
                                        </Button>
                                    </Form>
                                    </Card.Body>
                                </Card>
                            </>
                        )
                    }
                    
                </Col>
                <Col xs={12} md={4} lg={4}></Col>
            </Row>

        </Container>
    );
}

export default CreateGame;
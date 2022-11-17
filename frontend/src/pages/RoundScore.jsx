import { Button, Container, Row, Col, Spinner, Card } from 'react-bootstrap'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getCurrentRoundScores, setPlayerReady,leaveGame } from '../features/game/gameSlice'
import { FaCheckCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
function RoundScore() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const { players, isError, message, roundStatus, playerStatus, leaderboard } = useSelector(
        (state) => state.game
    )

    useEffect(() => {
        if (isError) {
          toast.error(message)
        }
    }, [isError, message])

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
        if(roundStatus !== 'results'){
            navigate('/question')
        }
    }, [user, navigate, roundStatus])

    useEffect(() => {
        dispatch(getCurrentRoundScores())
    }, [dispatch])

    useEffect(() => {
        const pullQuestion = (leaderboard && (leaderboard.currentRound + 1 < leaderboard.totalRounds)) && setInterval(() => {
            console.log('pulling statuses')
            dispatch(getCurrentRoundScores())
        }, 3000)
        return () => {
            if(pullQuestion){
                clearInterval(pullQuestion)
            }
        }
    }, [playerStatus,leaderboard,dispatch])

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(setPlayerReady())
    }

    const onLeave = (e) => {
        e.preventDefault()
        dispatch(leaveGame())
        navigate('/')
    }

    return (
        <Container style={{ marginTop: '32px', textAlign: 'center' }}>
            <Row>
                <Col xs={12} md={4} lg={4}></Col>
                <Col xs={12} md={4} lg={4}>
                    {leaderboard ?
                        (
                            <>
                                <h1>Results</h1><br/>
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                    <h6>Round {leaderboard.currentRound + 1}{"/"}{leaderboard.totalRounds}</h6>
                                </div>
                                <Card>
                                    <Card.Body>
                                        <br/>
                                        <h3>{leaderboard.question}</h3>
                                        <h6>by {leaderboard.dictator.name} </h6>
                                        <hr/>
                                        <div style={{textAlign:'start'}}>
                                            <h6>Correct Answer</h6>
                                            <Card style={{backgroundColor:'rgb(182, 255, 219)'}}>
                                                <Card.Body>
                                                    <h5>{leaderboard.correctAnswer}</h5>
                                                </Card.Body>
                                            </Card>
                                            <br/>
                                            <h6>Bad People</h6>
                                            {leaderboard.playerAnswers.map((submission, index) => (
                                                <Card key={index} style={{backgroundColor:submission.answer === leaderboard.correctAnswer ? 'rgb(182, 255, 219)' : 'rgb(255, 182, 182)'}}>
                                                    <Card.Body>
                                                        <h6>{submission.user.name} said</h6>
                                                        <h5>{submission.answer}</h5>
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </div>
                                    </Card.Body>
                                </Card>

                                <Card style={{marginTop:'32px'}}>
                                    <Card.Body>
                                        <h3>{"Score board"}</h3>

                                        {players.map((player, index) => (
                                            <Card key={"score-card-"+index}>
                                                <Card.Body>
                                                    <div style={{display:'flex',justifyContent:'space-between'}}>
                                                        <div>
                                                            {player.name} {player.status === 'ready' ? <FaCheckCircle style={{color:'green'}}/> : <></>}
                                                        </div>
                                                        <h5>{player.score}</h5>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))}
                                    </Card.Body>
                                </Card>
                                
                                <br/>
                                {
                                    leaderboard.currentRound + 1 < leaderboard.totalRounds ?
                                    (
                                        <div className="d-grid gap-2">
                                        <Button variant="primary" onClick={onSubmit} disabled={playerStatus === 'ready'}>Ready</Button>
                                        </div>
                                    ):
                                    (
                                        <div className="d-grid gap-2">
                                        <Button variant="primary" onClick={onLeave}>Leave Game</Button>
                                        </div>
                                    )
                                }
                                
                                <br/><br/>
                            </>
                        ) :
                        (
                            <Container style={{ marginTop: '32px', textAlign: 'center' }}>
                                <Spinner animation="border" role="status">
                                </Spinner>
                            </Container>
                        )
                    }

                </Col>
                <Col xs={12} md={4} lg={4}></Col>
            </Row>

        </Container>
    );
}

export default RoundScore;
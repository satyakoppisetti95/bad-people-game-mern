import { Button, Container, Row, Col, Spinner, Card,Form } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getCurrentQuestion, answerQuestion } from '../features/game/gameSlice'
import PlayerCard from '../components/playerCard'

function QuestionPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const { game, players, isLoading, isError, message, roundStatus, currentQuestion, playerStatus } = useSelector(
        (state) => state.game
    )

    const [answer, setAnswer] = useState('')

    useEffect(() => {
        if (!user) {
            navigate('/login')
        }
        // if (!game) {
        //     navigate('/dashboard')
        // }
    }, [user, navigate])

    useEffect(() => {
        dispatch(getCurrentQuestion())
    }, [dispatch])

    useEffect(() => {
        const pullQuestion = ((roundStatus === 'choosing' &&  playerStatus !== 'voting') || (playerStatus === 'waiting' && roundStatus !== 'results')) && setInterval(() => {
            console.log('pulling question')
            dispatch(getCurrentQuestion())
        }, 3000)
        return () => {
            if(pullQuestion){
                clearInterval(pullQuestion)
            }
        }
    }, [roundStatus])

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(answerQuestion(answer))
    }

    return (
        <Container style={{ marginTop: '32px', textAlign: 'center' }}>
            <Row>
                <Col xs={12} md={4} lg={4}></Col>
                <Col xs={12} md={4} lg={4}>
                    {currentQuestion ?
                        (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'end' }}>
                                    <h6>Question {currentQuestion.currentRound + 1}{"/"}{currentQuestion.totalRounds}</h6>
                                </div>
                                <Card>
                                    <Card.Body>
                                        <h3 style={{marginBottom:'32px'}}>{currentQuestion.question}</h3>
                                        <h6>by {currentQuestion.dictator.name} </h6>
                                        <hr/>
                                        <br></br>
                                        {
                                            playerStatus === 'voting' ? (
                                                <>
                                                    <h6 style={{color:'#3c3c3c'}}>Pick your answer </h6>
                                                    <Form.Select aria-label="Default select example" onChange={(e)=>setAnswer(e.target.value)}>
                                                        <option value="">--</option>
                                                        {players.map((player) => (
                                                            <option value={player.name}>{player.name}</option>
                                                        ))}
                                                    </Form.Select>
                                                    <br/>
                                                    <div className="d-grid gap-2">
                                                        <Button variant="dark" onClick={onSubmit}  style={{marginTop:'16px'}}>Submit Answer</Button>
                                                    </div>
                                                </>
                                            ) : <></>
                                        }
                                        {
                                            roundStatus === 'choosing' && playerStatus !== 'voting' ? (
                                                <>
                                                    <h6>Waiting for {currentQuestion.dictator.name} to pick answer ...</h6>
                                                </>
                                            ) : <></>
                                        }
                                        {
                                            roundStatus === 'voting' && playerStatus !== 'voting' ? (
                                                <>
                                                    <h6>Waiting for everyone to pick answers...</h6>
                                                    {
                                                        players.map((player) => (
                                                            <PlayerCard key={player.name} player={player} showCheck={ player.status === 'waiting' }/>
                                                        ))
                                                    }
                                                </>
                                            ) : <></>
                                        }
                                    </Card.Body>
                                </Card>
                                
                            </>
                        ) :
                        (
                            <Container style={{ marginTop: '32px', textAlign: 'center' }}>
                                <Spinner animation="border" role="status">
                                </Spinner>
                                loading question...
                            </Container>
                        )
                    }

                </Col>
                <Col xs={12} md={4} lg={4}></Col>
            </Row>

        </Container>
    );
}

export default QuestionPage;
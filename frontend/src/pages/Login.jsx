import { useState, useEffect } from 'react'
import { FaSignInAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { login, reset } from '../features/auth/authSlice'
import {Spinner,Container,Row,Col,Card,Form ,Button} from 'react-bootstrap'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  )
  
  useEffect(() => {
    if (isError) {
      toast.error(message)
    }
    if (isSuccess || user) {
      navigate('/')
    }
    dispatch(reset())
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const userData = {
      email,
      password,
    }
    dispatch(login(userData))
  }

  if (isLoading) {
    return (
      <div style={{textAlign:'center',marginTop:'64px'}}>
        <Spinner />
      </div>
    )
  }

  return (
    <Container>
        <Row >
            <Col xs={12} md={4} lg={4}></Col>
            <Col xs={12} md={4} lg={4}>
                <h1 style={{textAlign:'center',marginTop:'64px',marginBottom:'64px'}}><FaSignInAlt /> Login</h1>
                <Card>
                    <Card.Body>
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={onChange} id='email' name='email'/>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" id='password' name='password' value={password} onChange={onChange}/>
                        </Form.Group>
                        <div className="d-grid gap-2">
                        <Button variant="dark" type="submit" >
                            Login
                        </Button>
                        </div>
                    </Form>
                    </Card.Body>
                </Card>
            </Col>
            <Col xs={12} md={4} lg={4}></Col>
        </Row>
    </Container>
  )
}

export default Login
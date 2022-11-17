import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FaUser } from 'react-icons/fa'
import { register, reset } from '../features/auth/authSlice'
import { Spinner, Container, Row, Col, Card, Form, Button } from 'react-bootstrap'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const { name, email, password, password2 } = formData

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

    if (password !== password2) {
      toast.error('Passwords do not match')
    } else {
      const userData = {
        name,
        email,
        password,
      }

      dispatch(register(userData))
    }
  }

  if (isLoading) {
    <div style={{ textAlign: 'center', marginTop: '64px' }}>
      <Spinner />
    </div>
  }

  return (
    <Container>
      <Row >
        <Col xs={12} md={4} lg={4}></Col>
        <Col xs={12} md={4} lg={4}>
          <h1 style={{ textAlign: 'center', marginTop: '64px', marginBottom: '64px' }}><FaUser /> Register</h1>
          <Card>
            <Card.Body>
              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Display name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your name" value={name} onChange={onChange} id='name' name='name' />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" value={email} onChange={onChange} id='email' name='email' />
                </Form.Group>

                <Form.Group className="mb-3" >
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Enter password" id='password' name='password' value={password} onChange={onChange} />
                </Form.Group>

                <Form.Group className="mb-3" >
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Confirm password" id='password2' name='password2' value={password2} onChange={onChange} />
                </Form.Group>

                <Button variant="primary" type="submit" >
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={4} lg={4}></Col>
      </Row>


    </Container>
  )
}

export default Register
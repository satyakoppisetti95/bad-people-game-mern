import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'
import { Navbar, Nav, Container, Offcanvas } from 'react-bootstrap'

function Header() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const onLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/')
  }

  return (
    <Navbar bg="dark" variant="dark" key="lg" expand="lg">
      <Container  >
        <Navbar.Brand href="/">Bad people</Navbar.Brand>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} placement="end"/>
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-lg`}
          aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
              Bad People
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              {user ?
                (
                  <>
                    <Nav.Link >{user.name}</Nav.Link>
                    <Nav.Link onClick={onLogout}>
                      <FaSignOutAlt /> Logout
                    </Nav.Link>
                  </>
                )
                :
                (
                  <>
                    <Nav.Link href="/login"><FaSignInAlt />Login</Nav.Link>
                    <Nav.Link href="/register"><FaUser /> Register</Nav.Link>
                  </>
                )
              }
            </Nav>

          </Offcanvas.Body>
        </Navbar.Offcanvas>
          
      </Container>
    </Navbar>
  )
}

export default Header
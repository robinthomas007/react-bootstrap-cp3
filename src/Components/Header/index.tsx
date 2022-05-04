import React, { useEffect } from 'react'
import logo from './../../Static/Images/logo.png';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useColor } from '../../Context/ColorModeContext';
import jwt_decode from 'jwt-decode';
import getCookie from './../Common/cookie';
import { useAuth } from './../../Context/authContext'
import Nav from 'react-bootstrap/Nav'

export default function Header() {

  const colorModeContext = useColor()
  const auth = useAuth();
  useEffect(() => {
    if (colorModeContext.colorMode === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    else {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    }
  }, [colorModeContext.colorMode]);

  useEffect(() => {
    try {
      const token = getCookie('cp3_auth');
      let user: any = jwt_decode(token);
      localStorage.setItem('user', user);
      auth.login(user)
      console.log("Logged in success --", user)
    } catch (err) {
      console.log("Error getting Token", err)
    }
  }, [])

  return (
    <Container fluid>
      <Row className='bg-header-theme text-white'>
        <Col md={8}>
          <img src={logo} alt="Logo" />
        </Col>
        <Col md={4}>
          <Nav className="justify-content-end pt-20">
            <Nav.Item>
              <Nav.Link>
                <span onClick={colorModeContext.toggleColorMode}>
                  {colorModeContext.colorMode === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
                </span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link>
                <AccountCircleIcon /> &nbsp; <span>Welcome, {auth.user.name}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link>Logout</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
    </Container>

  )
}
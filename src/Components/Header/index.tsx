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

export default function Header() {

  const colorModeContext = useColor()
  let user = 'Robin Thomas'
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
      user = jwt_decode(token);
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
        <Col md={1} className="pt-20">
          <span onClick={colorModeContext.toggleColorMode}>
            {colorModeContext.colorMode === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
          </span>
        </Col>
        <Col md={2} className="pt-20"> <AccountCircleIcon /> &nbsp; <span>Welcome, {user}</span></Col>
        <Col md={1} className="pt-20"><span>Logout</span></Col>
      </Row>
    </Container>

  )
}
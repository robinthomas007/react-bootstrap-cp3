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
import { NavLink } from 'react-router-dom';
import SearchIcon from "@mui/icons-material/Search";
import ApprovalIcon from '@mui/icons-material/Approval';
import { ADMIN } from './../Common/Utils';

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
      const localUser = localStorage.getItem('user')
      let userLoggedIn = localUser ? JSON.parse(localStorage.getItem('user') || '') : ''
      if (!userLoggedIn.name) {
        const token = getCookie('cp3_auth');
        let user: any = jwt_decode(token);
        user.role = user.groups && user.groups.includes(ADMIN) ? 'admin' : 'user'
        localStorage.setItem('user', JSON.stringify(user));
        auth.login(user)
      }
    } catch (err) {
      console.log("Error getting Token", err)
    }
  }, [])

  const adminNavLinks = [
    {
      name: 'Policy',
      icon: <ApprovalIcon />,
      path: '/policy'
    }
  ]

  return (
    <Container fluid>
      <Row className='bg-header-theme text-white cp3-header'>
        <Col xl={4} xxl={6}>
          <img className="cp3-logo" src={logo} alt="Logo" />
        </Col>
        <Col xl={8} xxl={6}>
          <Nav className="justify-content-around">
            <Nav.Item className="nav-item-link">
              <NavLink to='/'>
                <SearchIcon /> Search
                <div className="line"></div>
              </NavLink>
            </Nav.Item>
            {auth.user.role === 'admin' && adminNavLinks.map((nav, i) =>
              <Nav.Item key={i} className="nav-item-link">
                <NavLink to={nav.path}>
                  {nav.icon} {nav.name}
                  <div className="line"></div>
                </NavLink>
              </Nav.Item>
            )}
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
    </Container >

  )
}
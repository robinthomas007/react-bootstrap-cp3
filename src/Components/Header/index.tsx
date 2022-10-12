import React, { useEffect } from "react";
import logo from "./../../Static/Images/logo.png";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useColor } from "../../Context/ColorModeContext";
import { useAuth } from "./../../Context/authContext";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ApprovalIcon from "@mui/icons-material/Approval";
import PolicyIcon from '@mui/icons-material/Policy';

export default function Header() {
  const colorModeContext = useColor();
  const auth = useAuth();
  useEffect(() => {
    if (colorModeContext.colorMode === "light") {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    } else {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    }
  }, [colorModeContext.colorMode]);

  const adminNavLinks = [
    {
      name: "Policy",
      icon: <ApprovalIcon />,
      path: "/policy",
    },
  ];

  return (
    <Container fluid>
      <Row className="bg-header-theme text-white cp3-header">
        <Col xl={3} xxl={5}>
          <a href="/">
            <img className="cp3-logo" src={logo} alt="Logo" />
          </a>
        </Col>
        <Col xl={9} xxl={7}>
          <Nav className="justify-content-around">
            <Nav.Item className="nav-item-link">
              <NavLink to="/first_seen">
                <PolicyIcon /> First Seen
                <div className="line"></div>
              </NavLink>
            </Nav.Item>
            <Nav.Item className="nav-item-link">
              <NavLink to="/">
                <SearchIcon /> Search
                <div className="line"></div>
              </NavLink>
            </Nav.Item>
            {auth.user.role === "admin" &&
              adminNavLinks.map((nav, i) => (
                <Nav.Item key={i} className="nav-item-link">
                  <NavLink to={nav.path}>
                    {nav.icon} {nav.name}
                    <div className="line"></div>
                  </NavLink>
                </Nav.Item>
              ))}
            <Nav.Item>
              <Nav.Link>
                <span onClick={colorModeContext.toggleColorMode}>
                  {colorModeContext.colorMode === "light" ? (
                    <LightModeIcon />
                  ) : (
                    <DarkModeIcon />
                  )}
                </span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link>
                <AccountCircleIcon /> &nbsp;{" "}
                <span>Welcome, {auth.user.name}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link>Logout</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
      </Row>
    </Container>
  );
}

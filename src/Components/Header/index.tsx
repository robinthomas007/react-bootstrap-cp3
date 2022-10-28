import React, { useEffect, useState } from "react";
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
import { NavLink, useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ApprovalIcon from "@mui/icons-material/Approval";
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import PolicyIcon from '@mui/icons-material/Policy';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Loader from "./../Common/loader";
import getCookie from "./../Common/cookie";
import axios from "axios";
import { BASE_URL } from "./../../App";
import { config } from "./../Common/Utils";
import moment from 'moment';
import './header.css'

const hexArray = [
  '#FF26A8',
  '#26A4FF',
  '#CE53FA',
  '#609491',
  '#26A4FF',
  '#FF26A8',
  '#26A4FF',
  '#CE53FA',
  '#d4953c',
  '#609491',
  '#26A4FF',
  '#CE53FA',
];

export default function Header() {
  const colorModeContext = useColor();
  const auth = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNoti, setShowNoti] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (colorModeContext.colorMode === "light") {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    } else {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    }
  }, [colorModeContext.colorMode]);

  useEffect(() => {
    getAllNotifications();
    const interval = setInterval(() => {
      getAllNotifications();
    }, 50000);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(interval)
    }
  }, [])

  const handleClickOutside = (event: any) => {
    const elem = document.querySelector('.notification-wrapper-div');
    if (elem && !elem.contains(event.target) && (event.target.id !== 'notify-wrapper' && event.target.parentElement.id !== 'notify-wrapper')) {
      if (document.querySelector('.notification-wrapper')) {
        setShowNoti(false)
        event.preventDefault();
      }
    }
  }

  const getAllNotifications = () => {
    axios
      .post(BASE_URL + "Notification/GetUnReadNotification", {}, config)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setNotifications(response.data)
        }
        if (response.data && response.data.length === 0) {
          setNotifications([])
          setShowNoti(false)
        }
      })
      .catch((err) => {

      })
      .finally(() => { });
  }

  const openNotification = () => {
    if (notifications.length > 0)
      setShowNoti(!showNoti)
  }

  const getAlias = (name: any) => {
    if (name) {
      const nameArr = name.split(' ');
      return nameArr[0].charAt().toUpperCase() + nameArr[0].charAt(1).toUpperCase();
    }
    return 'UK';
  };

  const markAsRead = (id: number) => {
    setLoading(true)
    axios
      .get(BASE_URL + "Notification/ReadNotification", {
        params: { notificationId: id },
        headers: {
          cp3_auth: getCookie("cp3_auth"),
        }
      })
      .then((response) => {
        if (response.status === 200) {
          getAllNotifications();
          setLoading(false)
          navigate("/first_seen");
        }
      })
      .catch((err) => {
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      });
  }

  const renderNotifications = () => {
    return notifications.map((noti: any, i) => {
      return (
        <div key={i} className="noti-item">
          <div className="alias"><span style={{ background: hexArray[Math.floor(Math.random() * hexArray.length)] }}> {getAlias(noti.userName)}</span></div>
          <div className="noti-content" onClick={() => markAsRead(noti.notificationId)}>
            <strong>{noti.userName}</strong> {noti.notificationType.toLowerCase()} the {noti.source === 'FS' ? 'First Seen' : 'Greenlist'} record for <strong>"{noti.trackName}"</strong>
            <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
          </div>
        </div>
      )
    })
  }

  const adminNavLinks = [
    {
      name: "Policy",
      icon: <ApprovalIcon />,
      path: "/policy",
    },
  ];

  return (
    <Container fluid>
      {loading && <Loader />}
      <Row className="bg-header-theme text-white cp3-header">
        <Col xl={2} xxl={4}>
          <a href="/">
            <img className="cp3-logo" src={logo} alt="Logo" />
          </a>
        </Col>
        <Col xl={10} xxl={8}>
          <Nav className="justify-content-around">
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
            {auth.user.FS && <Nav.Item className="nav-item-link">
              <NavLink to="/first_seen">
                <PolicyIcon /> First Seen
                <div className="line"></div>
              </NavLink>
            </Nav.Item>}
            {/* <Nav.Item className="nav-item-link">
              <NavLink to="/green_list">
                <TrackChangesIcon /> Greenlist
                <div className="line"></div>
              </NavLink>
            </Nav.Item> */}
            <Nav.Link>
              <div>
                <div className="notify-wrapper" id="notify-wrapper">
                  <NotificationsIcon id="notify-wrapper" onClick={openNotification} className="noti-icon" />
                  {notifications.length > 0 && <span className="noti-count">{notifications.length}</span>}
                </div>
                <div className="notification-wrapper-div">
                  {showNoti && <div className="notification-wrapper arrow-top">
                    {renderNotifications()}
                  </div>}
                </div>
              </div>
            </Nav.Link>
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

import React, { useEffect, useState, useRef } from "react";
import logo from "./../../Static/Images/logo.png";
import Container from "react-bootstrap/Container";
import { Row, Button, Collapse, Form } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import FeedbackIcon from '@mui/icons-material/Feedback';
import CloseIcon from '@mui/icons-material/Close';
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
import html2canvas from 'html2canvas';
import axios from "axios";
import { BASE_URL } from "./../../App";
import { config, isSessionExpired } from "./../Common/Utils";
import moment from 'moment';
import './header.css'
import Preview from './preview'

const hexArray = [
  '#FDD981',
  '#F88E86',
  '#F57F17',
  '#FBC02D'
];

export default function Header() {
  const colorModeContext = useColor();
  const auth = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNoti, setShowNoti] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [comments, setComments] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const modalRef = useRef(null);

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
    }, 300000);
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
        setLoading(false)
      })
      .catch((err) => {
        isSessionExpired(err)
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

  const clearNotification = () => {
    setLoading(true)
    axios
      .get(BASE_URL + "Notification/ClearNotification", {
        headers: {
          cp3_auth: getCookie("cp3_auth"),
        }
      })
      .then((response) => {
        if (response.status === 200) {
          getAllNotifications()
        }
      })
      .catch((err) => {
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      });
  }

  const markAsRead = (id: number, source: string) => {
    return false;
    // mark as read api on hold for client varification
    // axios
    //   .get(BASE_URL + "Notification/ReadNotification", {
    //     params: { notificationId: id },
    //     headers: {
    //       cp3_auth: getCookie("cp3_auth"),
    //     }
    //   })
    //   .then((response) => {
    //     if (response.status === 200) {
    //       const updatedNotification: any = notifications.map((noti: any) => {
    //         if (noti.notificationId === id) {
    //           return { ...noti, isRead: true };
    //         }
    //         return noti
    //       })
    //       setNotifications(updatedNotification)
    //       setLoading(false)
    //     }
    //   })
    //   .catch((err) => {
    //     setLoading(false)
    //   })
    //   .finally(() => {
    //     setLoading(false)
    //   });
  }

  const naviagetNotificationPage = (source: string, notificationId: string) => {
    switch (source) {
      case "FS":
        navigate('/first_seen', { state: { notificationId: notificationId }, replace: true },);
        break;
      case "GL":
        navigate("/green_list", { state: { notificationId: notificationId }, replace: true });
        break;
      case "CP3":
        navigate("/", { state: { notificationId: notificationId }, replace: true });
        break;
      default:
        navigate("/", { state: { notificationId: notificationId }, replace: true });
    }
    setShowNoti(false)
  }

  const renderNotifications = () => {
    return notifications.map((noti: any, i) => {
      if (noti.groupValueCount > 0 && noti.groupType === "") {
        return (
          <div key={i} className={`${noti.isRead ? 'read' : ''} noti-item`}>
            <div className="alias"><span style={{ background: hexArray[Math.floor(Math.random() * hexArray.length)] }}> {getAlias(noti.userName)}</span></div>
            <div className="noti-content" onClick={() => naviagetNotificationPage(noti.source, noti.notificationId)} onMouseEnter={() => !noti.isRead && markAsRead(noti.notificationId, noti.source)}>
              {noti.notificationType.toLowerCase() === 'created' && (
                <>
                  <strong>{noti.userName}</strong> <span>{noti.notificationType.toLowerCase()} {noti.groupValueCount > 10 ? '10+' : noti.groupValueCount} {noti.source === 'FS' ? 'First Seen' : noti.source === 'CP3' ? 'CP3' : noti.source === 'GL' ? 'GreenList' : ''} records.</span>
                </>
              )}
              {noti.notificationType.toLowerCase() === 'updated' && (
                <>
                  <strong>{noti.userName}</strong> <span>{noti.notificationType.toLowerCase()} {noti.groupValueCount > 10 ? '10+' : noti.groupValueCount} {noti.source === 'FS' ? 'First Seen' : noti.source === 'GL' ? 'GreenList' : ''} records.</span>
                </>
              )}
              <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
            </div>
          </div>
        )
      }
      if (noti.groupValueCount > 0 && noti.groupType !== "") {
        return (
          <div key={i} className={`${noti.isRead ? 'read' : ''} noti-item`}>
            <div className="alias"><span style={{ background: hexArray[Math.floor(Math.random() * hexArray.length)] }}> {getAlias(noti.userName)}</span></div>
            <div className="noti-content" onClick={() => naviagetNotificationPage(noti.source, noti.notificationId)} onMouseEnter={() => !noti.isRead && markAsRead(noti.notificationId, noti.source)}>
              {noti.notificationType.toLowerCase() === 'created' && (
                <>
                  <strong>{noti.userName}</strong> <span>{noti.notificationType.toLowerCase()} {noti.groupValueCount > 10 ? '10+' : noti.groupValueCount} {noti.source === 'FS' ? 'First Seen' : noti.source === 'CP3' ? 'CP3' : noti.source === 'GL' ? 'GreenList' : ''} records for {noti.groupType} <strong>"{noti.trackName}"</strong></span>
                </>
              )}
              {noti.notificationType.toLowerCase() === 'updated' && (
                <>
                  <strong>{noti.userName}</strong> <span>{noti.notificationType.toLowerCase()} {noti.groupValueCount > 10 ? '10+' : noti.groupValueCount} {noti.source === 'FS' ? 'First Seen' : noti.source === 'GL' ? 'GreenList' : ''} records for {noti.groupType} <strong>"{noti.trackName}"</strong></span>
                </>
              )}
              <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
            </div>
          </div>
        )
      }
      return (
        <div key={i} className={`${noti.isRead ? 'read' : ''} noti-item`}>
          <div className="alias"><span style={{ background: hexArray[Math.floor(Math.random() * hexArray.length)] }}> {getAlias(noti.userName)}</span></div>
          <div className="noti-content" onClick={() => naviagetNotificationPage(noti.source, noti.notificationId)} onMouseEnter={() => !noti.isRead && markAsRead(noti.notificationId, noti.source)}>
            <strong>{noti.userName}</strong> {noti.notificationType.toLowerCase()} the {noti.source === 'FS' ? 'First Seen' : noti.source === 'CP3' ? 'CP3' : 'Greenlist'} record for <strong>"{noti.trackName}"</strong>
            <span> ({moment.utc(noti.createdDateTime).fromNow()})</span>
          </div>
        </div>
      )
    })
  }

  const handleChange = (e: React.ChangeEvent<any>) => {
    setComments(e.target.value);
  };

  const convertToBase64 = (selectedFile: any) => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        setScreenshot(e.target.result);
      };

      reader.readAsDataURL(selectedFile);
    }
  }

  const handleFileChange = (e: any) => {
    convertToBase64(e.target.files[0])
  };

  const handleDrop = (e: any) => {
    console.log(e, 'asdasd')
    e.preventDefault();
    convertToBase64(e.dataTransfer.files[0])
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleBrowseClick = () => {
    console.log(fileInputRef, "fileInputRef")
    fileInputRef.current?.click();
  };

  const captureScreenshot = (id = 'root') => {
    console.log(id, "id")
    setScreenshot(null);
    const targetElement = document.getElementById(id);
    console.log(targetElement, "targetElementtargetElement", modalRef.current)
    const screenshotSound = new Audio('https://www.soundjay.com/mechanical/sounds/camera-shutter-click-01.mp3');
    screenshotSound.play();
    if (targetElement) {
      html2canvas(targetElement, {
        ignoreElements: (element) => element === modalRef.current,
      }).then((canvas) => {
        const dataUrl = canvas.toDataURL();
        setScreenshot(dataUrl);
      });
    }
  };

  const submitfeedback = () => {
    console.log(screenshot)
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
        <Col xl={1} xxl={3}>
          <NavLink to="/">
            <img className="cp3-logo" src={logo} alt="Logo" />
          </NavLink>
        </Col>
        <Col xl={11} xxl={9}>
          <Nav className="justify-content-around">
            <Nav.Item className="nav-item-link">
              <NavLink to="/feedback">
                <FeedbackIcon /> Feedback
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
            {auth.user.FS && <Nav.Item className="nav-item-link">
              <NavLink to="/first_seen">
                <PolicyIcon /> First Seen
                <div className="line"></div>
              </NavLink>
            </Nav.Item>}
            <Nav.Item className="nav-item-link">
              <NavLink to="/green_list">
                <TrackChangesIcon /> Greenlist
                <div className="line"></div>
              </NavLink>
            </Nav.Item>
            <Nav.Link>
              <div>
                <div className="notify-wrapper" id="notify-wrapper">
                  <NotificationsIcon id="notify-wrapper" onClick={openNotification} className="noti-icon" />
                  {notifications.length > 0 && <span className="noti-count">{notifications.length}</span>}
                </div>
                <div className="notification-wrapper-div">
                  {showNoti && <div className="notification-wrapper arrow-top">
                    <div className="clr-noti">
                      <span onClick={clearNotification}>Clear</span>
                    </div>
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
      <div className="feedback" ref={modalRef}>
        <Button
          onClick={() => { setOpen(!open); setScreenshot(null) }}
          aria-controls="example-collapse-text"
          aria-expanded={open}
          variant="secondary"
          className={`${open ? 'feedback-btn-inner' : ''} text-white feedback-btn`}
        >
          {open && <span className="send-feedback-heading">Send Feedback</span>}
          <FeedbackIcon />
        </Button>
        {openPreview && (
          <Preview
            show={openPreview}
            handleClose={() => setOpenPreview(false)}
            screenshot={screenshot}
            setScreenshot={setScreenshot}
            captureScreenshot={captureScreenshot}
          />
        )}
        <div style={{ minHeight: '150px' }}>
          <Collapse in={open} dimension="width">
            <div id="feedback-collapse" className="feedback-collapse">
              <div className="feedback-form">
                <Row className="pb-20">
                  <Col md={12}>
                    <CloseIcon className="feedback-close-icon" onClick={() => { setOpen(!open); setScreenshot(null) }} />
                    <Form.Group className="mb-3" controlId="comments">
                      <Form.Label>Comments</Form.Label>
                      <Form.Control
                        value={comments}
                        onChange={handleChange}
                        name="notes"
                        as="textarea"
                        rows={8}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="fileInput">
                      <Form.Label>Image / Screenshot</Form.Label>
                      {screenshot ?
                        (<div className="screenshot-preview">
                          <CloseIcon className="screenshot-close-icon" onClick={() => setScreenshot(null)} />
                          <img width={260} className="feedback-img-preview" src={screenshot} alt="Screenshot" />
                          <Button variant="secondary-white" onClick={() => setOpenPreview(true)} className="overlay screenshot-preview-overlay-btn"> Crop Image </Button>
                        </div>
                        ) :
                        (<div
                          className="drop-area"
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onClick={handleBrowseClick}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.png,.jpeg"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                          />

                          <span className="click-to-browse">
                            Click to browse or drag and drop
                          </span>
                        </div>)}
                    </Form.Group>
                    <Button variant="secondary-white" className="text-white capture-btn" type="button" onClick={() => captureScreenshot('root')}>
                      Capture Screenshot
                    </Button>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <div className="feedback-footer">
                      <Button
                        className="text-white"
                        onClick={() => { setOpen(!open); setScreenshot(null) }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="secondary"
                        className="text-white"
                        onClick={submitfeedback}
                      >
                        Submit
                      </Button>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </Collapse>
        </div>
      </div>
    </Container>
  );
}

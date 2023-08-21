/** @format */

import React, { useRef, useState } from "react";
import { Row, Button, Collapse, Form, Col } from "react-bootstrap";
import html2canvas from "html2canvas";
import Preview from "./preview";
import FeedbackIcon from "@mui/icons-material/Feedback";
import CloseIcon from "@mui/icons-material/Close";
import { BASE_URL } from "../../App";
import axios from "axios";
import getCookie from "../Common/cookie";
import Loader from "../Common/loader";
import { useLocation } from "react-router-dom";

function FeedbackModal() {
  const modalRef = useRef(null);
  const [comments, setComments] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [loading, setLoading] = useState(false)
  const location = useLocation();

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
  };
  const handleBrowseClick = () => {
    console.log(fileInputRef, "fileInputRef");
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: any) => {
    convertToBase64(e.target.files[0]);
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    convertToBase64(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const captureScreenshot = (id = "root") => {
    id === 'root' && setScreenshot(null);
    const targetElement = (id === 'root') ? document.getElementById(id) : document.getElementsByClassName(id)[0] as HTMLElement;
    const screenshotSound = new Audio(
      "https://www.soundjay.com/mechanical/sounds/camera-shutter-click-01.mp3"
    );
    id === 'root' && screenshotSound.play();
    if (targetElement) {
      html2canvas(targetElement, {
        ignoreElements: (element) => element === modalRef.current,
      }).then((canvas) => {
        const dataUrl = canvas.toDataURL();
        setScreenshot(dataUrl);
      });
    }
  };

  const submitfeedback = async () => {
    setLoading(true)
    const updatedBlob = screenshot ? (
      screenshot.split("data:image/png;base64,")[1] ||
      screenshot.split("data:image/jpeg;base64,")[1] ||
      screenshot.split("data:image/jpg;base64,")[1]
    ) : undefined;
    const config = {
      headers: {
        cp3_auth: getCookie("cp3_auth"),
      },
    };
    axios
      .post(
        BASE_URL + "feedback/addfeedback",
        {
          comments: comments,
          statusId: 1,
          pageName: "testRoute",
          base64Image: updatedBlob,
          feedbackId: 0,
        },
        config
      )
      .then((res) => {
        setOpen(!open);
        setLoading(false)
        if (location.pathname === "/feedback") {
          window.location.reload()
        }
        setComments('')
      }).catch((e) => {
        setLoading(false)
      })
  };

  return (
    <div className="feedback" ref={modalRef}>
      {loading && <Loader />}
      <Button
        onClick={() => {
          setOpen(!open);
          setScreenshot(null);
        }}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="secondary"
        className={`${open ? "feedback-btn-inner" : ""
          } text-white feedback-btn`}
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
      <div style={{ minHeight: "150px" }}>
        <Collapse in={open} dimension="width">
          <div id="feedback-collapse" className="feedback-collapse">
            <div className="feedback-form">
              <Row className="pb-20">
                <Col md={12}>
                  <CloseIcon
                    className="feedback-close-icon"
                    onClick={() => {
                      setOpen(!open);
                      setScreenshot(null);
                    }}
                  />
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
                    {screenshot ? (
                      <div className="screenshot-preview">
                        <CloseIcon
                          className="screenshot-close-icon"
                          onClick={() => setScreenshot(null)}
                        />
                        <img
                          width={260}
                          className="feedback-img-preview"
                          src={screenshot}
                          alt="Screenshot"
                        />
                        <Button
                          variant="secondary-white"
                          onClick={() => setOpenPreview(true)}
                          className="overlay screenshot-preview-overlay-btn"
                        >
                          {" "}
                          Crop Image{" "}
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="drop-area"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={handleBrowseClick}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: "none" }}
                        />

                        <span className="click-to-browse">
                          Click to browse or drag and drop
                        </span>
                      </div>
                    )}
                  </Form.Group>
                  <Button
                    variant="secondary-white"
                    className="text-white capture-btn"
                    type="button"
                    onClick={() => captureScreenshot("root")}
                  >
                    Capture Screenshot
                  </Button>
                </Col>
              </Row>
              <Row className="pb-20">
                <Col md={12}>
                  <div className="feedback-footer">
                    <Button
                      className="text-white"
                      onClick={() => {
                        setOpen(!open);
                        setScreenshot(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="secondary"
                      className="text-white"
                      onClick={submitfeedback}
                      disabled={comments === "" || !screenshot}
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
  );
}

export default FeedbackModal;

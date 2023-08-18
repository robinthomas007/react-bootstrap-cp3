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

function FeedbackModal() {
  const modalRef = useRef(null);
  const [comments, setComments] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);

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
    console.log(e, "asdasd");
    e.preventDefault();
    convertToBase64(e.dataTransfer.files[0]);
  };
  const handleDragOver = (e: any) => {
    e.preventDefault();
  };
  const captureScreenshot = (id = "root") => {
    console.log(id, "id");
    setScreenshot(null);
    const targetElement = document.getElementById(id);
    console.log(targetElement, "targetElementtargetElement", modalRef.current);
    const screenshotSound = new Audio(
      "https://www.soundjay.com/mechanical/sounds/camera-shutter-click-01.mp3"
    );
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
  const blobToBase64 = (blob: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };

  // blobToBase64(blobData).then((res) => {
  //   // do what you wanna do
  //   console.log(res); // res is base64 now
  // });
  // fetch(imageAddressAsStringValue)
  //   .then((res) => res.blob())
  //   .then(blobToBase64)
  //   .then((finalResult) => {
  //     storeOnMyLocalDatabase(finalResult);
  //   });
  const submitfeedback = async () => {
    console.log(screenshot);
    const updatedBlob = screenshot?.split("data:image/png;base64,")[1];
    console.log("updatedBlob", updatedBlob);
    console.log("url of addfeedback" + BASE_URL + "FeedBack/AddFeedBack");
    // const base64Image = await blobToBase64(updatedBlob);
    // console.log("base64Image", base64Image);
    // blobToBase64(updatedBlob).then((res) => {
    //   console.log(res);
    // });
    const config = {
      headers: {
        cp3_auth: getCookie("cp3_auth"),
      },
    };
    axios
      .post(
        BASE_URL + "feedback/addfeedback",
        {
          comments: "test",
          statusId: 1,
          pageName: "testRoute",
          base64Image: updatedBlob,
          feedbackId: 0,
        },
        config
      )
      .then((res) => {
        console.log("responseof addFeddback", res);
      });
  };

  return (
    <div className="feedback" ref={modalRef}>
      <Button
        onClick={() => {
          setOpen(!open);
          setScreenshot(null);
        }}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="secondary"
        className={`${
          open ? "feedback-btn-inner" : ""
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
                          accept=".jpg,.png,.jpeg"
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

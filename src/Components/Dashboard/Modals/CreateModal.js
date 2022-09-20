import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "../../Common/button";
import CloseIcon from "@mui/icons-material/Close";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import SelectField from "./../../Common/select";
import Datepicker from "./../../Common/DatePicker";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { getUsername, config } from "./../../Common/Utils";
import { BASE_URL } from "./../../../App";
import { toast } from "react-toastify";
import Loader from "./../../Common/loader";
import moment from "moment";

export default function FilterModal(props) {
  const [altTitle, setAltTitle] = useState([]);
  const [track, setTrack] = useState({
    title: "",
    artist: "",
    isrc: "",
    album: "",
    labelId: "",
    leakDate: "",
    releaseDate: "",
    blockPolicyId: "",
  });
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (props.editParams && props.editParams.trackId) {
      const obj = {};
      if (props.editParams.subTitle) {
        const subTitle = props.editParams.subTitle.split(",");
        const temp = [];
        subTitle.forEach((el, index) => {
          temp.push(index + 1);
          obj["altTitile" + (index + 1)] = el;
        });
        setAltTitle(temp);
      }
      setTrack({
        ...props.editParams,
        leakDate: props.editParams.leakDate ? moment(props.editParams.leakDate).format("MM-DD-YYYY") : '',
        releaseDate: props.editParams.releaseDate ? moment(props.editParams.releaseDate).format("MM-DD-YYYY") : '',
        labelId: props.labelFacets.filter(
          (label) => Number(props.editParams.labelId) === Number(label.id)
        )[0],
        blockPolicyId: props.policyFacets.filter(
          (p) => Number(props.editParams.blockPolicyId) === Number(p.id)
        )[0],
        ...obj,
      });
    }
  }, [props]);

  const handleSubmit = () => {
    const form = document.querySelector("#create-resource-form");
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setValidated(false);
      setLoading(true);
      const subTitle = [];
      Object.keys(track).forEach(function (k, i) {
        if (k.includes("altTitile")) {
          subTitle.push(track[k]);
        }
      });
      const data = {
        title: track.title,
        artist: track.artist,
        isrc: track.isrc,
        album: track.album,
        source: props.editParams.trackId ? props.editParams.source : '',
        leakDate: track.leakDate,
        releaseDate: track.releaseDate,
        blockPolicyId: track.blockPolicyId
          ? Number(track.blockPolicyId.id)
          : 0,
        labelId: track.labelId ? Number(track.labelId.id) : "",
        subTitle: subTitle.length > 0 ? subTitle.join(",") : "",
        username: getUsername(),
      };
      if (track.trackId) {
        axios
          .put(
            BASE_URL + "Track/UpdateTracks",
            { ...data, trackId: track.trackId },
            config
          )
          .then(() => {
            toast.success("Track details updated successfully!", {
              autoClose: 3000,
              closeOnClick: true,
            });
            props.handleClose();
            props.getSearchPageData();
          })
          .catch((err) => {
            if (err.response && err.response.data) {
              toast.error(err.response.data.Message, {
                autoClose: 3000,
                closeOnClick: true,
              });
            }
          })
          .finally(() => setLoading(false));
      } else {
        axios
          .post(BASE_URL + "Track/AddTracks", data, config)
          .then((response) => {
            toast.success("Track Created successfully!", {
              autoClose: 3000,
              closeOnClick: true,
            });
            setTrack({ ...track, trackId: response.data.trackId });
            props.handleClose();
            props.getSearchPageData();
          })
          .catch((err) => {
            if (err.response && err.response.data) {
              toast.error(err.response.data.Message, {
                autoClose: 3000,
                closeOnClick: true,
              });
            }
          })
          .finally(() => setLoading(false));
      }
    }
  };

  const removeAltTitle = (ele, index) => {
    const subTitle = "altTitile" + ele;
    const modifiedTrackobj = track;
    delete modifiedTrackobj[subTitle];
    setTrack(modifiedTrackobj);
    let newArr = [...altTitle];
    newArr.splice(index, 1);
    setAltTitle(newArr);
  };

  const getAlterNativeTitle = () => {
    return altTitle.map((ele, index) => {
      const altTitle = "altTitile" + ele;
      return (
        <Row className="pb-20" key={index}>
          <Col md={12}>
            <Form.Group controlId="title" className="d-flex align-items-center">
              <Form.Label className="form-label-width">
                Alt Title {index + 1}
              </Form.Label>
              <Form.Control
                value={track[altTitle] ? track[altTitle] : ""}
                type="text"
                name="title"
                placeholder="Enter Title"
                onChange={(e) =>
                  setTrack({ ...track, [altTitle]: e.target.value })
                }
              />
              <span className="alt-title-icon">
                <RemoveCircleIcon onClick={() => removeAltTitle(ele, index)} />
              </span>
            </Form.Group>
          </Col>
        </Row>
      );
    });
  };

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      className="filter-modal-wrapper"
    >
      {loading && <Loader />}

      <Modal.Header>
        <Modal.Title>Create Record</Modal.Title>
        <CloseIcon
          fontSize="inherit"
          className="modal-cls-btn"
          onClick={props.handleClose}
        />
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form
            noValidate
            validated={validated}
            id="create-resource-form"
            onSubmit={handleSubmit}
          >
            <Row className="pb-20">
              <Col md={6}>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="title"
                      className="d-flex align-items-start"
                    >
                      <Form.Label className="form-label-width">
                        Title
                      </Form.Label>
                      <div className="f-width">
                        <Form.Control
                          required
                          value={track.title}
                          type="text"
                          name="track_title"
                          placeholder="Enter Title"
                          onChange={(e) =>
                            setTrack({ ...track, title: e.target.value })
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Title is required
                        </Form.Control.Feedback>
                      </div>
                      <span className="alt-title-icon">
                        <AddCircleIcon
                          onClick={() =>
                            setAltTitle([
                              ...altTitle,
                              altTitle.length > 0
                                ? altTitle[altTitle.length - 1] + 1
                                : 0,
                            ])
                          }
                        />
                      </span>
                    </Form.Group>
                  </Col>
                </Row>
                {getAlterNativeTitle()}
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="artist"
                      className="d-flex align-items-center"
                    >
                      <Form.Label className="form-label-width">
                        Artist
                      </Form.Label>
                      <div className="f-width">
                        <Form.Control
                          required
                          value={track.artist}
                          type="text"
                          name="artist"
                          placeholder="Enter Artist"
                          onChange={(e) =>
                            setTrack({ ...track, artist: e.target.value })
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Artist is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="isrc"
                      className="d-flex align-items-center"
                    >
                      <Form.Label className="form-label-width">ISRC</Form.Label>
                      <Form.Control
                        value={track.isrc}
                        type="text"
                        name="isrc"
                        placeholder="Enter ISRC"
                        onChange={(e) =>
                          setTrack({ ...track, isrc: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="album"
                      className="d-flex align-items-center"
                    >
                      <Form.Label className="form-label-width">Album</Form.Label>
                      <Form.Control
                        value={track.album}
                        type="text"
                        name="album"
                        placeholder="Enter Album"
                        onChange={(e) =>
                          setTrack({ ...track, album: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="labelId"
                      className="d-flex align-items-center"
                    >
                      <Form.Label className="form-label-width">
                        Label
                      </Form.Label>
                      <div className="f-width">
                        <Form.Control
                          required
                          value={track.labelId}
                          name="labelId"
                          className="d-none"
                          onChange={(e) => null}
                        />
                        <SelectField
                          value={track.labelId}
                          options={props.labelFacets}
                          name="labelId"
                          handleChange={(data) =>
                            setTrack({ ...track, labelId: data })
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Label is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="blockPolicyId"
                      className="d-flex align-items-center"
                    >
                      <Form.Label className="form-label-width">
                        Policy
                      </Form.Label>
                      <SelectField
                        value={track.blockPolicyId}
                        options={props.policyFacets}
                        name="blockPolicyId"
                        handleChange={(data) =>
                          setTrack({ ...track, blockPolicyId: data })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col md={6}>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="leakDate"
                      className="d-flex align-items-center"
                    >
                      <Form.Label className="form-label-width">
                        Leak Date
                      </Form.Label>
                      <Datepicker
                        selected={track.leakDate}
                        handleDateChange={(date) => {
                          setTrack({ ...track, leakDate: date });
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="releaseDate"
                      className="d-flex align-items-center"
                    >
                      <Form.Label className="form-label-width">
                        Release Date
                      </Form.Label>
                      <Datepicker
                        selected={track.releaseDate}
                        handleDateChange={(date) =>
                          setTrack({ ...track, releaseDate: date })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label="Submit"
          handleClick={handleSubmit}
          className="text-white"
          variant="secondary"
        />
        <Button
          label="Cancel"
          handleClick={props.handleClose}
          variant="light"
        />
      </Modal.Footer>
    </Modal>
  );
}

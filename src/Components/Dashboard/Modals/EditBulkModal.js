import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "../../Common/button";
import CloseIcon from "@mui/icons-material/Close";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import SelectField from "./../../Common/select";
import Datepicker from "./../../Common/DatePicker";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SearchIcon from '@mui/icons-material/Search';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import { config } from "./../../Common/Utils";
import { BASE_URL } from "./../../../App";
import { toast } from "react-toastify";
import Loader from "./../../Common/loader";
import getCookie from "./../../Common/cookie";
import moment from "moment";
import './editmodal.css'

export default function EditBulkModal(props) {
  const [trackList, setTrackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [duplicateIsrc, SetDuplicateIsrc] = useState(false);
  const [duplicateIsrcList, setDuplicateIsrcList] = useState([]);

  const newTrack = {
    title: "",
    artist: "",
    isrc: "",
    album: "",
    labelId: "",
    leakDate: "",
    releaseDate: "",
    blockPolicyId: "",
  }

  useEffect(() => {
    if (props.editParams && props.editParams.length > 0) {
      let trackArray = []
      props.editParams.forEach(track => {
        const labelFacets = track.source !== 'REP' ? props.labelFacets : [{ id: track.labelId, name: track.label }]
        const trackObj = {
          ...track,
          leakDate: track.leakDate ? moment(track.leakDate).format("MM-DD-YYYY") : '',
          releaseDate: track.releaseDate ? moment(track.releaseDate).format("MM-DD-YYYY") : '',
          labelId: labelFacets.filter(
            (label) => Number(track.labelId) === Number(label.id)
          )[0],
          blockPolicyId: props.policyFacets.filter(
            (p) => Number(track.blockPolicyId) === Number(p.id)
          )[0],
        }
        trackArray.push(trackObj)
      });
      setTrackList(trackArray)
    } else {
      setTrackList([...trackList, newTrack])
    }
  }, [props]);

  const handleSubmit = () => {
    const form = document.querySelector("#create-resource-form");
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setValidated(false);
      setLoading(true);
      const reqData = []
      trackList.forEach(track => {
        const data = {
          trackId: track.trackId ? track.trackId : 0,
          title: track.title,
          artist: track.artist,
          isrc: track.isrc,
          album: track.album,
          source: track.source ? track.source : '',
          leakDate: track.leakDate,
          releaseDate: track.releaseDate,
          blockPolicyId: track.blockPolicyId ? Number(track.blockPolicyId.id) : 0,
          labelId: track.labelId ? Number(track.labelId.id) : "",
          subTitle: track.subTitle,
        };
        reqData.push(data)
      });
      axios
        .post(
          BASE_URL + 'Track/BulkUpdateTracks',
          reqData,
          config
        )
        .then(() => {
          toast.success("Track details updated successfully!", {
            autoClose: 3000,
            closeOnClick: true,
          });
          props.handleClose();
          setTimeout(() => {
            props.getSearchPageData();
          }, 1000);
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
  };

  const removeAltTitle = (track, i, index) => {
    let newSubArr = track.subTitle.split(",")
    newSubArr.splice(i, 1);
    handleOnchange({ ...track, subTitle: newSubArr.length > 0 ? newSubArr.toLocaleString() : '' }, index)
  };

  const handleOnchange = (track, index) => {
    const modifiedTrackList = [...trackList]
    modifiedTrackList[index] = track
    setTrackList(modifiedTrackList)
  }

  const removeTrackList = (index) => {
    const modifiedTrackList = [...trackList]
    modifiedTrackList.splice(index, 1);
    setTrackList(modifiedTrackList)
  }
  const copyTrackList = (index) => {
    const modifiedTrackList = [...trackList]
    modifiedTrackList[trackList.length] = { ...modifiedTrackList[index] }
    modifiedTrackList[trackList.length].trackId = '';
    modifiedTrackList[trackList.length].source = 'CP3';
    setTrackList(modifiedTrackList)
  }

  const getAlterNativeTitle = (track, index) => {
    const subtitles = track.subTitle ? track.subTitle.split(",") : []
    return subtitles.map((ele, i) => {
      return (
        <Col md={2} key={i}>
          <Form.Group controlId="title" className="d-flex align-items-start flex-direction-column">
            <Form.Label className="form-label">
            </Form.Label>
            <div className="f-width d-flex">
              <Form.Control
                value={ele}
                type="text"
                name="title"
                placeholder="Enter Title"
                onChange={(e) => {
                  let newSubArr = track.subTitle.split(",")
                  newSubArr[i] = e.target.value
                  handleOnchange({ ...track, subTitle: newSubArr.toLocaleString() }, index)
                }
                }
              />
              <span className="alt-title-icon">
                <RemoveCircleIcon onClick={() => removeAltTitle(track, i, index)} />
              </span>
            </div>
          </Form.Group>
        </Col>
      );
    });
  };

  const checkDuplicateIsrc = (e) => {
    if (e.target.value && e.target.value.length === 12) {
      axios
        .get(
          BASE_URL + 'Track/CheckIsrc', {
          params: {
            isrc: e.target.value
          },
          headers: {
            cp3_auth: getCookie("cp3_auth"),
          },
        })
        .then((res) => {
          if (res.data) {
            SetDuplicateIsrc(true)
            setDuplicateIsrcList([...duplicateIsrcList, e.target.value]);
          } else {
            const isrcList = trackList.map((item) => item.isrc)
            const hasDuplicate = isrcList.some(item => duplicateIsrcList.includes(item))
            if (!hasDuplicate) {
              SetDuplicateIsrc(false)
              setDuplicateIsrcList([]);
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => setLoading(false));
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-90w"
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
        <Form
          noValidate
          validated={validated}
          id="create-resource-form"
          onSubmit={handleSubmit}
        >
          <Row className="pb-10">
            <Col md={2}>
              <Form.Label className="form-label ">
                Title
              </Form.Label>
            </Col>
            <Col md={2}>
              <Form.Label className="form-label">
                Artist
              </Form.Label>
            </Col>
            <Col>
              <Form.Label className="form-label">ISRC</Form.Label>
            </Col>
            <Col>
              <Form.Label className="form-label">Album</Form.Label>
            </Col>
            <Col>
              <Form.Label className="form-label">
                Label
              </Form.Label>
            </Col>
            <Col>
              <Form.Label className="form-label">
                Policy
              </Form.Label>
            </Col>
            <Col>
              <Form.Label className="form-label">
                Leak Date
              </Form.Label>
            </Col>
            <Col>
              <Form.Label className="form-label">
                Release Date
              </Form.Label>
            </Col>
            <Col></Col>
          </Row>
          {trackList.map((track, index) => {
            return (
              <Row className="pb-10 pt-10 border-bottom" key={index}>
                <Col md={2}>
                  <Form.Group
                    controlId="title"
                    className="d-flex align-items-start flex-direction-column"
                  >
                    <div className="f-width d-flex">
                      <Form.Control
                        required
                        value={track.title}
                        type="text"
                        name="track_title"
                        disabled={track.source === 'REP'}
                        placeholder="Enter Title"
                        onChange={(e) =>
                          handleOnchange({ ...track, title: e.target.value }, index)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        Title is required
                      </Form.Control.Feedback>
                      <span className="alt-title-icon">
                        <AddCircleIcon
                          onClick={() => {
                            track.source !== 'REP' && handleOnchange({ ...track, subTitle: track.subTitle ? track.subTitle + ',' : ' ' }, index)
                          }
                          }
                        />
                      </span>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group
                    controlId="artist"
                    className="d-flex align-items-start flex-direction-column">
                    <div className="f-width d-flex">
                      <Form.Control
                        required
                        value={track.artist}
                        type="text"
                        disabled={track.source === 'REP'}
                        name="artist"
                        placeholder="Enter Artist"
                        onChange={(e) =>
                          handleOnchange({ ...track, artist: e.target.value }, index)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        Artist is required
                      </Form.Control.Feedback>
                      <span className="alt-title-icon">
                        <SearchIcon
                          onClick={() => { console.log("") }
                          }
                        />
                      </span>
                    </div>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    controlId="isrc"
                    className="d-flex align-items-start flex-direction-column">
                    <Form.Control
                      className={duplicateIsrcList.includes(track.isrc) ? 'dup-warn' : ''}
                      value={track.isrc}
                      type="text"
                      name="isrc"
                      placeholder="Enter ISRC"
                      disabled={track.source === 'REP'}
                      onBlur={(e) => checkDuplicateIsrc(e)}
                      onChange={(e) =>
                        handleOnchange({ ...track, isrc: e.target.value }, index)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    controlId="album"
                    className="d-flex align-items-start flex-direction-column">
                    <Form.Control
                      value={track.album}
                      type="text"
                      name="album"
                      disabled={track.source === 'REP'}
                      placeholder="Enter Album"
                      onChange={(e) =>
                        handleOnchange({ ...track, album: e.target.value }, index)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    controlId="labelId"
                    className="d-flex align-items-start flex-direction-column">
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
                        options={track.source !== 'REP' ? props.labelFacets : [{ id: track.labelId, name: track.label }]}
                        name="labelId"
                        isDisabled={track.source === 'REP'}
                        handleChange={(data) =>
                          handleOnchange({ ...track, labelId: data }, index)
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        Label is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    controlId="blockPolicyId"
                    className="d-flex align-items-start flex-direction-column">
                    <SelectField
                      value={track.blockPolicyId}
                      options={props.policyFacets}
                      name="blockPolicyId"
                      handleChange={(data) =>
                        handleOnchange({ ...track, blockPolicyId: data }, index)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    controlId="leakDate"
                    className="d-flex align-items-start flex-direction-column">
                    <Datepicker
                      selected={track.leakDate}
                      handleDateChange={(date) =>
                        handleOnchange({ ...track, leakDate: moment(date).isValid() ? date : null }, index)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    controlId="releaseDate"
                    className="d-flex align-items-start flex-direction-column">
                    <Datepicker
                      disabled={track.source === 'REP'}
                      selected={track.releaseDate}
                      handleDateChange={(date) => {
                        handleOnchange({ ...track, releaseDate: moment(date).isValid() ? date : null }, index)
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col className="d-flex align-items-end justify-content-space-evenly">
                  <AddCircleIcon onClick={() => { setTrackList([...trackList, newTrack]) }} />
                  <LibraryAddIcon onClick={() => copyTrackList(index)} />
                  <RemoveCircleIcon onClick={() => removeTrackList(index)} />
                </Col>
                <Col md={12}>
                  <Row className="pb-20">
                    {getAlterNativeTitle(track, index)}
                  </Row>
                </Col>
              </Row>
            )
          })}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {duplicateIsrc && <div className="d-flex justify-content-center align-items-center">
          <p className="duplicate-isrc-warn">A CP3 record with this ISRC already exists. You can proceed to create the duplicate record by hitting the ‘Create Duplicate Record’ button below or you can click cancel to return to the search screen.</p>
        </div>}
        <Button
          label={duplicateIsrc ? 'Create Duplicate' : 'Submit'}
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

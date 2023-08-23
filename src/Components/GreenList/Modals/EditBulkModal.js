/** @format */

import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "../../Common/button";
import CloseIcon from "@mui/icons-material/Close";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Datepicker from "./../../Common/DatePicker";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import SearchIcon from "@mui/icons-material/Search";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { config, callPartyService } from "./../../Common/Utils";
import MultiSelectHierarchy from "./../../Common/treeSelect/multiSelectHierarchy";
import { BASE_URL } from "./../../../App";
import { toast } from "react-toastify";
import Loader from "./../../Common/loader";
import moment from "moment";
// import "./editmodal.css";

export default function EditBulkModal(props) {
  const [greenList, setGreenList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  const newGreenList = {
    account: "",
    accountManager: "",
    artist: "",
    contact: "",
    album: "",
    labelId: "",
    endDate: "",
    url: "",
    notes: "",
  };

  const launchIt = (track, index) => {
    callPartyService(track, index, handleOnchange, false);
  };

  useEffect(() => {
    if (props.editParams && props.editParams.length > 0) {
      let greenListArray = [];
      props.editParams.forEach((gl) => {
        const trackObj = {
          ...gl,
          endDate: gl.endDate ? moment(gl.endDate).format("MM-DD-YYYY") : "",
          labelId: { id: gl.labelId, name: gl.labelName },
        };
        greenListArray.push(trackObj);
      });
      setGreenList(greenListArray);
    } else {
      setGreenList([...greenList, newGreenList]);
    }
  }, [props]);

  const handleSubmit = () => {
    const form = document.querySelector("#create-greenList-form");
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setValidated(false);
      setLoading(true);
      const reqData = [];

      greenList.forEach((greenlist) => {
        const data = {
          greenListId: greenlist.greenListId ? greenlist.greenListId : 0,
          account: greenlist.account,
          artist: greenlist.artist,
          accountManager: greenlist.accountManager,
          contact: greenlist.contact,
          url: greenlist.url,
          notes: greenlist.notes,
          source: "GL",
          endDate: greenlist.endDate,
          labelId: greenlist.labelId ? Number(greenlist.labelId.id) : "",
        };
        reqData.push(data);
      });
      axios
        .post(BASE_URL + "GreenList/BulkUpdateGreenList", reqData, config)
        .then(() => {
          toast.success("GreenList details updated successfully!", {
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

  const handleOnchange = (track, index) => {
    const modifiedTrackList = [...greenList];
    modifiedTrackList[index] = track;
    setGreenList(modifiedTrackList);
  };

  const removeTrackList = (index) => {
    const modifiedTrackList = [...greenList];
    modifiedTrackList.splice(index, 1);
    setGreenList(modifiedTrackList);
  };

  const copyTrackList = (index) => {
    const modifiedTrackList = [...greenList];
    modifiedTrackList[greenList.length] = { ...modifiedTrackList[index] };
    modifiedTrackList[greenList.length].trackId = "";
    modifiedTrackList[greenList.length].source = "CP3";
    setGreenList(modifiedTrackList);
  };

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-99w"
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
          id="create-greenList-form"
          onSubmit={handleSubmit}
        >
          <Row className="pb-10">
            <Col md={1}>
              <Form.Label className="form-label ">Account</Form.Label>
            </Col>
            <Col md={2}>
              <Form.Label className="form-label ">Artist</Form.Label>
            </Col>
            <Col md={1}>
              <Form.Label className="form-label">Label</Form.Label>
            </Col>
            <Col md={1}>
              <Form.Label className="form-label">Account Manager</Form.Label>
            </Col>
            <Col md={1}>
              <Form.Label className="form-label">Contact</Form.Label>
            </Col>
            <Col md={2}>
              <Form.Label className="form-label">Greenlisted URL</Form.Label>
            </Col>
            <Col md={1}>
              <Form.Label className="form-label">End Date</Form.Label>
            </Col>
            <Col md={1}>
              <Form.Label className="form-label">Notes</Form.Label>
            </Col>
          </Row>
          {greenList.map((row, index) => {
            return (
              <Row className="pb-10 pt-10 border-bottom" key={index}>
                <Col md={1}>
                  <Form.Group
                    controlId="account"
                    className="d-flex align-items-start flex-direction-column"
                  >
                    <div className="f-width d-flex">
                      <Form.Control
                        required
                        value={row.account}
                        type="text"
                        name="account"
                        placeholder="Enter Account"
                        onChange={(e) =>
                          handleOnchange(
                            { ...row, account: e.target.value },
                            index
                          )
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        Account is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>

                <Col md={2}>
                  <Form.Group
                    controlId="artist"
                    className="d-flex align-items-start flex-direction-column"
                  >
                    <div className="f-width d-flex">
                      <Form.Control
                        required
                        value={row.artist}
                        type="text"
                        name="artist"
                        placeholder="Enter Artist"
                        onChange={(e) =>
                          handleOnchange(
                            { ...row, artist: e.target.value },
                            index
                          )
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        Artist is required
                      </Form.Control.Feedback>
                      <span className="alt-title-icon">
                        <SearchIcon
                          onClick={() => {
                            launchIt(row, index);
                          }}
                        />
                      </span>
                    </div>
                  </Form.Group>
                </Col>

                <Col md={1}>
                  <Form.Group
                    controlId="labelId"
                    className="d-flex align-items-start flex-direction-column"
                  >
                    <div className="f-width ms-drp-wrapper">
                      <Form.Control
                        required
                        value={row.labelId}
                        name="labelId"
                        className="d-none"
                        onChange={(e) => null}
                      />
                      <MultiSelectHierarchy
                        handleChangeCheckbox={(data) =>
                          handleOnchange({ ...row, labelId: data[0] }, index)
                        }
                        type={"requestFormInput"}
                        isMultiSelect={false}
                        isAdmin={true}
                        selectedLabelIds={row.labelId ? [row.labelId] : []}
                      />
                      <Form.Control.Feedback type="invalid">
                        Label is required
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                </Col>
                <Col md={1}>
                  <Form.Group
                    controlId="accountManager"
                    className="d-flex align-items-start flex-direction-column"
                  >
                    <div className="f-width d-flex">
                      <Form.Control
                        value={row.accountManager}
                        type="text"
                        name="accountManager"
                        placeholder="Enter Account Manager"
                        onChange={(e) =>
                          handleOnchange(
                            { ...row, accountManager: e.target.value },
                            index
                          )
                        }
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col md={1}>
                  <Form.Group
                    controlId="contact"
                    className="d-flex align-items-start flex-direction-column"
                  >
                    <Form.Control
                      value={row.contact}
                      type="text"
                      name="contact"
                      placeholder="Enter Contact"
                      onChange={(e) =>
                        handleOnchange(
                          { ...row, contact: e.target.value },
                          index
                        )
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group
                    controlId="url"
                    className="d-flex align-items-start flex-direction-column"
                  >
                    <Form.Control
                      value={row.url}
                      type="text"
                      name="url"
                      placeholder="Enter url"
                      onChange={(e) =>
                        handleOnchange({ ...row, url: e.target.value }, index)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={1}>
                  <Form.Group
                    controlId="endDate"
                    className="d-flex align-items-start flex-direction-column"
                  >
                    <Datepicker
                      selected={row.endDate}
                      handleDateChange={(date) =>
                        handleOnchange(
                          {
                            ...row,
                            endDate: moment(date).isValid() ? date : null,
                          },
                          index
                        )
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group
                    controlId="notes"
                    className="d-flex align-items-start flex-direction-column"
                  >
                    <Form.Control
                      value={row.notes}
                      type="text"
                      name="notes"
                      as="textarea"
                      rows={2}
                      placeholder="Create a New Note..."
                      onChange={(e) =>
                        handleOnchange({ ...row, notes: e.target.value }, index)
                      }
                    />
                  </Form.Group>
                </Col>

                <Col
                  className="d-flex align-items-end justify-content-space-evenly"
                  style={{ paddingBottom: "10px" }}
                >
                  <AddCircleIcon
                    onClick={() => {
                      setGreenList([...greenList, newGreenList]);
                    }}
                  />
                  <LibraryAddIcon onClick={() => copyTrackList(index)} />
                  <RemoveCircleIcon onClick={() => removeTrackList(index)} />
                </Col>
              </Row>
            );
          })}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label={"Submit"}
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

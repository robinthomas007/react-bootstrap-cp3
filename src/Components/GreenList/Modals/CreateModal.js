/** @format */

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
import { getUsername, config, callPartyService } from "./../../Common/Utils";
import { BASE_URL } from "./../../../App";
import { toast } from "react-toastify";
import Loader from "./../../Common/loader";
import moment from "moment";
import SearchIcon from "@mui/icons-material/Search";
import MultiSelectHierarchy from "./../../Common/treeSelect/multiSelectHierarchy";

export default function CreateProjectModal(props) {
  const [greenlist, setGreenlist] = useState({
    account: "",
    artist: "",
    accountManager: "",
    contact: "",
    labelId: "",
    endDate: "",
    url: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (props.editParams && props.editParams.length > 0) {
      const editParams = props.editParams[0];
      const obj = {};
      setGreenlist({
        ...editParams,
        releaseDate: editParams.endDate
          ? moment(editParams.endDate).format("MM-DD-YYYY")
          : "",
        labelId:
          props.labelFacets &&
          props.labelFacets.filter(
            (label) => Number(editParams.labelId) === Number(label.id)
          )[0],
        ...obj,
      });
    }
  }, [props]);

  const launchIt = (track) => {
    callPartyService(track, "", setGreenlist, true);
  };

  const handleSubmit = () => {
    const form = document.querySelector("#create-resource-form");
    if (form.checkValidity() === false) {
      setValidated(true);
    } else {
      setValidated(false);
      setLoading(true);

      const data = {
        account: greenlist.account,
        artist: greenlist.artist,
        accountManager: greenlist.accountManager,
        contact: greenlist.contact,
        url: greenlist.url,
        notes: greenlist.notes,
        source: "GL",
        endDate: greenlist.endDate,
        labelId: greenlist.labelId ? Number(greenlist.labelId.id) : "",
        username: getUsername(),
      };
      if (greenlist.greenListId) {
        axios
          .put(
            BASE_URL + "GreenList/UpdateGreenList",
            { ...data, greenListId: greenlist.greenListId },
            config
          )
          .then(() => {
            toast.success("GreenList details updated successfully!", {
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
          .post(BASE_URL + "GreenList/AddGreenList", data, config)
          .then((response) => {
            toast.success("GreenList Created successfully!", {
              autoClose: 3000,
              closeOnClick: true,
            });
            setGreenlist({
              ...greenlist,
              greenListId: response.data.greenListId,
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
      }
    }
  };

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
      size="md"
      className="filter-modal-wrapper"
    >
      {loading && <Loader />}

      <Modal.Header>
        <Modal.Title>Add Greenlist URL</Modal.Title>
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
              <Col md={11}>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="title"
                      className="d-flex align-items-start"
                    >
                      <Form.Label className="form-label-width">
                        Account
                      </Form.Label>
                      <div className="f-width">
                        <Form.Control
                          required
                          value={greenlist.account}
                          type="text"
                          name="account"
                          placeholder="Enter Title"
                          onChange={(e) =>
                            setGreenlist({
                              ...greenlist,
                              account: e.target.value,
                            })
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Account is required
                        </Form.Control.Feedback>
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="artist"
                      className="d-flex align-items-center"
                    >
                      <Form.Label className="form-label-width">
                        Artist
                      </Form.Label>
                      <div className="f-width d-flex">
                        <Form.Control
                          required
                          value={greenlist.artist}
                          type="text"
                          name="artist"
                          placeholder="Enter Artist"
                          onChange={(e) =>
                            setGreenlist({
                              ...greenlist,
                              artist: e.target.value,
                            })
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          Artist is required
                        </Form.Control.Feedback>
                        <span className="alt-title-icon">
                          <SearchIcon
                            onClick={() => {
                              launchIt(greenlist);
                            }}
                          />
                        </span>
                      </div>
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
                          value={greenlist.labelId}
                          name="labelId"
                          className="d-none"
                          onChange={(e) => null}
                        />
                        <MultiSelectHierarchy
                          handleChangeCheckbox={(data) =>
                            setGreenlist({ ...greenlist, labelId: data[0] })
                          }
                          type={"requestFormInput"}
                          isMultiSelect={false}
                          isAdmin={true}
                          selectedLabelIds={
                            greenlist.labelId ? [greenlist.labelId] : []
                          }
                        />
                        {/*<SelectField
                          value={greenlist.labelId}
                          options={props.labelFacets}
                          name="labelId"
                          handleChange={(data) =>
                            setGreenlist({ ...greenlist, labelId: data })
                          }
                        />*/}
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
                      controlId="accountManager"
                      className="d-flex align-items-center"
                    >
                      <Form.Label className="form-label-width">
                        Account Manager
                      </Form.Label>
                      <Form.Control
                        value={greenlist.accountManager}
                        type="text"
                        name="accountManager"
                        placeholder="Enter Account Manager"
                        onChange={(e) =>
                          setGreenlist({
                            ...greenlist,
                            accountManager: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="contact"
                      className="d-flex align-items-center"
                    >
                      <Form.Label className="form-label-width">
                        Contact
                      </Form.Label>
                      <Form.Control
                        value={greenlist.contact}
                        type="text"
                        name="contact"
                        placeholder="Enter contact"
                        onChange={(e) =>
                          setGreenlist({
                            ...greenlist,
                            contact: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="url"
                      className="d-flex align-items-center"
                    >
                      <Form.Label className="form-label-width">
                        Greenlisted URL
                      </Form.Label>
                      <Form.Control
                        value={greenlist.url}
                        type="text"
                        name="url"
                        placeholder="Enter url"
                        onChange={(e) =>
                          setGreenlist({ ...greenlist, url: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="endDate"
                      className="d-flex align-items-center"
                    >
                      <Form.Label className="form-label-width">
                        End Date
                      </Form.Label>
                      <Datepicker
                        selected={greenlist.endDate}
                        handleDateChange={(date) =>
                          setGreenlist({
                            ...greenlist,
                            endDate: moment(date).isValid() ? date : null,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col></Col>
              <Col md={11}>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group
                      controlId="url"
                      className="d-flex align-items-start"
                    >
                      <Form.Label className="form-label-width">
                        Notes
                      </Form.Label>
                      <Form.Control
                        value={greenlist.notes}
                        onChange={(e) =>
                          setGreenlist({ ...greenlist, notes: e.target.value })
                        }
                        name="notes"
                        as="textarea"
                        rows={3}
                        placeholder="Create a New Note..."
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

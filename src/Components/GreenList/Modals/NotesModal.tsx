import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "../../Common/button";
import CloseIcon from "@mui/icons-material/Close";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import axios from "axios";
import moment from "moment";
import { useAuth } from "./../../../Context/authContext";
import { BASE_URL } from "../../../App";
import getCookie from "./../../Common/cookie";
import { config } from "./../../Common/Utils";

type filterProps = {
  show: boolean;
  handleClose: any;
  labelFacets: Array<any>;
  selectedNotes: any;
};

export default function NotesrModal(props: filterProps) {
  const [notes, setNotes] = React.useState<any>();
  const [notesData, setNotesData] = React.useState<any>([]);
  const auth = useAuth();

  const handleChange = (e: React.ChangeEvent<any>) => {
    setNotes(e.target.value);
  };

  useEffect(() => {
    axios
      .get(BASE_URL + "GreenList/GetGreenListNotes", {
        params: {
          sourceId: props.selectedNotes.greenListId,
          source: props.selectedNotes.source || 'GL'
        },
        headers: {
          cp3_auth: getCookie("cp3_auth"),
        },
      })
      .then((res: any) => {
        setNotesData(res.data);
      })
      .catch((err) => {
        console.log("error feching data", err);
      });
  }, [props.selectedNotes.greenListId, props.selectedNotes.source]);

  const handleSubmit = () => {
    axios
      .put(BASE_URL + "GreenList/UpdateGreenListNotes", {
        sourceId: props.selectedNotes.greenListId,
        comments: notes,
        source: props.selectedNotes.source,
        userName: auth.user.name || "Guest",
      }, config)
      .then((res: any) => {
        setNotesData([...notesData, res.data]);
        setNotes("");
      })
      .catch((err) => {
        console.log("error feching data", err);
      });
  };
  const getNotes = () => {
    return notesData.map((note: any, index: number) => {
      return (
        <ListGroup.Item key={index}>
          <span className="notes-name-date">
            {note.userName} - {moment(note.createdOn).format("DD/MM/YYYY")}
          </span>{" "}
          <span> {note.noteDescription}</span>
        </ListGroup.Item>
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
      className="notes-modal"
    >
      <Modal.Header>
        <Modal.Title>Notes for {props.selectedNotes.title}</Modal.Title>
        <CloseIcon
          fontSize="inherit"
          className="modal-cls-btn"
          onClick={props.handleClose}
        />
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row className="pb-20">
              <Col md={12}>
                <ListGroup variant="flush">
                  {notesData.length > 0 && getNotes()}
                </ListGroup>
              </Col>
            </Row>
            <Row className="pb-20">
              <Col md={12}>
                <Form.Group className="mb-3" controlId="notes">
                  <Form.Control
                    value={notes}
                    onChange={handleChange}
                    name="notes"
                    as="textarea"
                    rows={3}
                    placeholder="Create a New Note..."
                  />
                </Form.Group>
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
        <Button label="Close" handleClick={props.handleClose} variant="light" />
      </Modal.Footer>
    </Modal>
  );
}

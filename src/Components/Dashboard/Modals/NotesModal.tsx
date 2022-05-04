import React, { useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from '../../Common/button'
import CloseIcon from '@mui/icons-material/Close';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import axios from 'axios';
import moment from 'moment';
import { useAuth } from './../../../Context/authContext'

type filterProps = {
  show: boolean;
  handleClose: any;
  labelFacets: Array<any>;
  selectedNotes: any
}


export default function NotesrModal(props: filterProps) {

  const [notes, setNotes] = React.useState<any>();
  const [notesData, setNotesData] = React.useState<any>([]);
  const auth = useAuth();


  const handleChange = (e: React.ChangeEvent<any>) => {
    setNotes(e.target.value);
  }

  useEffect(() => {
    axios.get('https://api.dev.cp3.umgapps.com/api/Track/GetTrackNotes', {
      params: {
        trackId: props.selectedNotes.trackId
      },
    }).then((res: any) => {
      setNotesData(res.data)
    }).catch((err) => {
      console.log("error feching data", err)
    })
  }, [props.selectedNotes.trackId])

  const handleSubmit = () => {
    axios.put('https://api.dev.cp3.umgapps.com/api/Track/UpdateNotes', {
      trackId: props.selectedNotes.trackId,
      comments: notes,
      userName: auth.user.name || 'Guest'

    }).then((res: any) => {
      setNotesData([...notesData, res.data])
      setNotes('')
    }).catch((err) => {
      console.log("error feching data", err)
    })
  }
  const getNotes = () => {
    return notesData.map((note: any, index: number) => {
      return <ListGroup.Item key={index}>
        <span className="notes-name-date">{note.userName}  - {moment(note.createdOn).format('DD/MM/YYYY')}</span> <span> {note.notes}</span>
      </ListGroup.Item>
    })
  }

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
        <CloseIcon fontSize="inherit" className="modal-cls-btn" onClick={props.handleClose} />
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
                  <Form.Control value={notes} onChange={handleChange} name="notes" as="textarea" rows={3} placeholder="Create a New Note..." />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button label='Submit' handleClick={handleSubmit} className="text-white" variant="secondary" />
        <Button label='Close' handleClick={props.handleClose} variant="light" />
      </Modal.Footer>
    </Modal >
  )
}

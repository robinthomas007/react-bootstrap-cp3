import React, { useEffect, useState } from 'react'
import axios from "axios";
import Modal from 'react-bootstrap/Modal'
import Button from '../../Common/button'
import CloseIcon from '@mui/icons-material/Close';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import SelectField from './../../Common/select'
import Datepicker from './../../Common/DatePicker'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { getPolicy } from './../../Common/Api'
import { getUsername, config } from "./../../Common/Utils";
import { BASE_URL } from "./../../../App";
import { toast } from 'react-toastify';
import Loader from "./../../Common/loader";

export default function FilterModal(props) {

  const [policy, setPolicy] = useState([])
  const [altTitle, setAltTitle] = useState([])
  const [track, setTrack] = useState({
    title: '',
    artist: '',
    isrc: '',
    labelId: '',
    leakDate: '',
    releaseDate: '',
    blockPolicyId: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPolicy().then((res) => {
      const policyRes = []
      if (res.data) {
        res.data.forEach(element => {
          const obj = {
            id: element.blockPolicyId,
            name: element.policyName
          }
          policyRes.push(obj)
        });
      }
      setPolicy(policyRes);
    })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  useEffect(() => {
    if (props.editParams && props.editParams.trackId) {
      const obj = {}
      if (props.editParams.subTitle) {
        const subTitle = props.editParams.subTitle.split(',')
        const temp = []
        subTitle.forEach((el, index) => {
          temp.push(index + 1)
          obj["altTitile" + (index + 1)] = el
        });
        setAltTitle(temp)
      }
      setTrack({
        ...props.editParams,
        labelId: props.labelFacets.filter((label) => props.editParams.labelId.includes(label.id))[0],
        blockPolicyId: policy.filter((p) => props.editParams.blockPolicyId === p.id)[0],
        ...obj
      });
    }
  }, [props, policy])

  const handleSubmit = () => {
    setLoading(true);
    const subTitle = []
    Object.keys(track).forEach(function (k, i) {
      if (k.includes('altTitile')) {
        subTitle.push(track[k])
      }
    })
    const data = {
      title: track.title,
      artist: track.artist,
      isrc: track.isrc,
      leakDate: track.leakDate,
      releaseDate: track.releaseDate,
      blockPolicyId: track.blockPolicyId ? track.blockPolicyId.id : '',
      labelId: track.blockPolicyId ? track.blockPolicyId.id : '',
      subTitle: subTitle.length > 0 ? subTitle.join(",") : '',
      username: getUsername(),
    };
    if (track.trackId) {
      axios
        .put(BASE_URL + "Track/UpdateTracks", { ...data, trackId: track.trackId }, config)
        .then(() => {
          toast.success('Track details updated successfully!', {
            autoClose: 3000,
            closeOnClick: true,
          });
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
          toast.success('Track Created successfully!', {
            autoClose: 3000,
            closeOnClick: true,
          });
          setTrack({ ...track, trackId: response.data.trackId })
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

  const removeAltTitle = (ele, index) => {
    const subTitle = 'altTitile' + ele
    const modifiedTrackobj = track
    delete modifiedTrackobj[subTitle]
    setTrack(modifiedTrackobj)
    let newArr = [...altTitle]
    newArr.splice(index, 1);
    setAltTitle(newArr)
  }

  const getAlterNativeTitle = () => {
    return altTitle.map((ele, index) => {
      const altTitle = 'altTitile' + ele
      return (
        <Row className="pb-20" key={index}>
          <Col md={12}>
            <Form.Group controlId="title" className="d-flex align-items-center">
              <Form.Label className="form-label-width">Alt Title {index + 1}</Form.Label>
              <Form.Control value={track[altTitle]} type="text" name="title" placeholder="Enter Title" onChange={(e) =>
                setTrack({ ...track, [altTitle]: e.target.value })
              } />
              <span className="alt-title-icon"><RemoveCircleIcon onClick={() => removeAltTitle(ele, index)} /></span>
            </Form.Group>
          </Col>
        </Row>
      )
    })
  }

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
        <CloseIcon fontSize="inherit" className="modal-cls-btn" onClick={props.handleClose} />
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row className="pb-20">
              <Col md={6}>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group controlId="title" className="d-flex align-items-center">
                      <Form.Label className="form-label-width">Title</Form.Label>
                      <Form.Control value={track.title} type="text" name="title" placeholder="Enter Title" onChange={(e) =>
                        setTrack({ ...track, title: e.target.value })
                      } />
                      <span className="alt-title-icon"><AddCircleIcon onClick={() => setAltTitle([...altTitle, altTitle.length + 1])} /></span>
                    </Form.Group>
                  </Col>
                </Row>
                {getAlterNativeTitle()}
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group controlId="artist" className="d-flex align-items-center">
                      <Form.Label className="form-label-width">Artist</Form.Label>
                      <Form.Control value={track.artist} type="text" name="artist" placeholder="Enter Artist" onChange={(e) =>
                        setTrack({ ...track, artist: e.target.value })
                      } />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group controlId="isrc" className="d-flex align-items-center">
                      <Form.Label className="form-label-width">ISRC</Form.Label>
                      <Form.Control value={track.isrc} type="text" name="isrc" placeholder="Enter ISRC" onChange={(e) =>
                        setTrack({ ...track, isrc: e.target.value })
                      } />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group controlId="labelId" className="d-flex align-items-center">
                      <Form.Label className="form-label-width">Label</Form.Label>
                      <SelectField value={track.labelId} options={props.labelFacets} name="labelId" handleChange={(data) =>
                        setTrack({ ...track, labelId: data })
                      } />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group controlId="blockPolicyId" className="d-flex align-items-center">
                      <Form.Label className="form-label-width">Policy</Form.Label>
                      <SelectField value={track.blockPolicyId} options={policy} name="blockPolicyId" handleChange={(data) =>
                        setTrack({ ...track, blockPolicyId: data })
                      } />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
              <Col md={6}>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group controlId="leakDate" className="d-flex align-items-center">
                      <Form.Label className="form-label-width">Leak Date</Form.Label>
                      <Datepicker selected={track.leakDate} handleDateChange={(date) => setTrack({ ...track, leakDate: date })} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="pb-20">
                  <Col md={12}>
                    <Form.Group controlId="releaseDate" className="d-flex align-items-center">
                      <Form.Label className="form-label-width">Release Date</Form.Label>
                      <Datepicker selected={track.releaseDate} handleDateChange={(date) => setTrack({ ...track, releaseDate: date })} />
                    </Form.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button label='Submit' handleClick={handleSubmit} className="text-white" variant="secondary" />
        <Button label='Cancel' handleClick={props.handleClose} variant="light" />
      </Modal.Footer>
    </Modal>
  )
}

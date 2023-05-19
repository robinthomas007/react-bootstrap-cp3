import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "../../Common/button";
import CloseIcon from "@mui/icons-material/Close";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function RightsModal({ rightsData, show, handleClose }) {


  const [copied, setcopied] = useState({})

  useEffect(() => {
    setTimeout(() => {
      if (copied.key) {
        setcopied({})
      }
    }, 1000);
  }, [copied]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      className="notes-modal"
    >
      <Modal.Header>
        <Modal.Title>UGC Rights Territories</Modal.Title>
        <CloseIcon
          fontSize="inherit"
          className="modal-cls-btn"
          onClick={handleClose}
        />
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col md={6}>
              <div>
                <label>Restricted</label>
                <div className="rights-cards restricted">
                  {rightsData.restricted && <ContentCopyIcon className="copy-icon" onClick={() => { setcopied({ key: 'restricted' }); navigator.clipboard.writeText(rightsData.restricted) }} />}
                  <span className="copied">{copied.key === 'restricted' ? 'Copied!' : ''}</span>
                  <p className="rights-data">{rightsData.restricted}</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div>
                <label>Unrestricted</label>
                <div className="rights-cards unrestricted">
                  {rightsData.unRestricted && <ContentCopyIcon className="copy-icon" onClick={() => { setcopied({ key: 'unrestricted' }); navigator.clipboard.writeText(rightsData.unRestricted) }} />}
                  <span className="copied">{copied.key === 'unrestricted' ? 'Copied!' : ''}</span>
                  <p className="rights-data">{rightsData.unRestricted}</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button label="Close" handleClick={handleClose} variant="light" />
      </Modal.Footer>
    </Modal>
  );
}

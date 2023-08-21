import React from "react";
import Modal from "react-bootstrap/Modal";
import CloseIcon from "@mui/icons-material/Close";

export default function NotesrModal(props) {
  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      dialogClassName="modal-90w"
      className="notes-modal"
    >
      <CloseIcon
        fontSize="inherit"
        className="modal-cls-btn"
        onClick={props.handleClose}
        style={{ right: 5, position: 'absolute', top: 5, zIndex: 99, fontSize: 16 }}
      />
      <Modal.Body>
        <div id="ReactCrop">
          <img id="preview-img" width={'100%'} src={props.screenshot} alt="Screenshot" />
        </div>
        <div className="preview-comments">
          {props.comments}
        </div>
      </Modal.Body>
    </Modal>
  );
}

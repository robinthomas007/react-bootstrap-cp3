import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "react-bootstrap";
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import RectangleSelection from './test'

export default function NotesrModal(props) {
  const [crop, setCrop] = useState()

  const getCroppedImg = (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result);
        };
        reader.readAsDataURL(blob);
      }, 'image/png', 1.0);
    });
  };

  const handleCrop = async () => {
    if (props.screenshot) {
      const croppedImage = await getCroppedImg(document.querySelector('#preview-img'), crop);
      console.log(croppedImage, "croppedImagecroppedImage")
      props.setScreenshot(croppedImage)
      props.handleClose()
    }
  };

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
      <Modal.Header>
        <Modal.Title>Highlight or Crop info on your screenshot
        </Modal.Title>
        <CloseIcon
          fontSize="inherit"
          className="modal-cls-btn"
          onClick={props.handleClose}
        />
      </Modal.Header>
      <Modal.Body>
        <div id="ReactCrop">
          <ReactCrop crop={crop} onChange={c => setCrop(c)}>
            <img id="preview-img" width={'100%'} src={props.screenshot} alt="Screenshot" />
          </ReactCrop>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          label="Submit"
          onClick={handleCrop}
          className="text-white"
          variant="secondary">
          Crop
        </Button>
        {<Button
          label="Submit"
          onClick={() => props.captureScreenshot('ReactCrop')}
          className="text-white"
          variant="secondary">
          highlight
        </Button>}
        <Button onClick={props.handleClose} variant="light">Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

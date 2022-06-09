import React from 'react';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './react-toastify-override.css';

const CustomToast = () => (
  <ToastContainer
    closeButton={false}
    position="top-center"
    autoClose={false}
    hideProgressBar={false}
    closeOnClick
    rtl={false}
    draggable={false}
    pauseOnFocusLoss={false}
    pauseOnHover={false}
    transition={Zoom}
  />
);

export default CustomToast
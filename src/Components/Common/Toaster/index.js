import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './react-toastify-override.css';

const CustomToast = () => (
  <ToastContainer
    closeButton={false}
    position="top-right"
    autoClose={false}
    hideProgressBar={false}
    closeOnClick
    rtl={false}
    draggable={false}
    pauseOnFocusLoss={false}
    pauseOnHover={false}
  />
);

export default CustomToast
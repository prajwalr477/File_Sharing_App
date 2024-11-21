import React from 'react';
import './Modal.css'; // You can create a separate CSS file for styling

const Modal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className='logout'>Confirm Logout</h2>
        <p className='logout_para'>Are you sure you want to log out?</p>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="confirm-btn" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;

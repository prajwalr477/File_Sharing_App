import React, { useState } from 'react';  // Import useState from React
import { useNavigate, Link } from 'react-router-dom';  // Import Link from react-router-dom
import Modal from '../components/Modal';
import './Header.css';
import logo from '../assets/logo.jpg';


export default function Header() {

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility

  // Handle logout button click
  const handleLogoutClick = () => {
    setIsModalOpen(true); // Show the modal on logout click
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Confirm logout and redirect to login
  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');  // Remove token from localStorage
    setIsModalOpen(false);  // Close the modal
    navigate('/');  // Redirect to login page
  };


  return (
    <header>
      <div className="nav-bar">
        <div className="logo">
        <img src={logo} alt="logo" />
          <h1>PESync</h1>
        </div>
        <div className="links">
          <Link to="/Home">Home</Link>
          <Link to="/About">About Us</Link>
          <Link to="/Contact">Contact</Link>
          <Link to="/FAQ">FAQ</Link>
          <button onClick={handleLogoutClick}>Log Out</button>
        </div>
      </div>
      {/* Modal for logout confirmation */}
      <Modal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleLogoutConfirm}
      />
    </header>
  );
}

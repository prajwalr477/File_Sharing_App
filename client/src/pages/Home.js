import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { socket } from '../socket';  // Assuming socket.js file exists

export default function HomePage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal for logout

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
    // Emit logout event (optional)
    socket.emit('logout', { user: localStorage.getItem('username') });

    // Disconnect the socket
    console.log('Socket connected before disconnect:', socket.connected);
    console.log('Disconnecting socket...');
    socket.disconnect();
    console.log('Socket connected after disconnect:', socket.connected);
    

    // Clear token and user info from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Close modal and navigate to login
    setIsModalOpen(false);
    navigate('/');
  };

  return (
    <div>
      <Header />
      <main>
        <section id="home">
          <h2>Welcome to Accio</h2>
          <p>This is the home page of our sample application.</p>

          <Link to="/file-share">
            <button>Go to FileShare</button>
          </Link>

          <button onClick={handleLogoutClick}>Log Out</button>
        </section>
      </main>

      {/* Modal for logout confirmation */}
      <Modal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleLogoutConfirm} />
    </div>
  );
}

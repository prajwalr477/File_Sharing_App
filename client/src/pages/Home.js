import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { socket } from '../socket';  // Assuming socket.js file exists

export default function HomePage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal for logout
  const [notifications, setNotifications] = useState([]); // Notifications state

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

  // Simulate receiving notifications dynamically
  useEffect(() => {
    // Listen for incoming notifications
    socket.on('new-notification', (notification) => {
      console.log('New Notification received:', notification); // Debugging log
      setNotifications((prev) => [...prev, notification]); // Add the notification to state
    });

    return () => {
      socket.off('new-notification'); // Clean up socket event listener
    };
  }, []); // Only run once on mount

  // Handle Accept action for a notification
  const handleAccept = (sender) => {
    console.log(`Accepted request from ${sender}`);
    socket.emit('accept-notification', { sender });
    setNotifications(notifications.filter((notification) => notification.sender !== sender));
  };

  // Handle Decline action for a notification
  const handleDecline = (sender) => {
    console.log(`Declined request from ${sender}`);
    socket.emit('decline-notification', { sender });
    setNotifications(notifications.filter((notification) => notification.sender !== sender));
  };

  return (
    <div>
      <Header
        messageCount={notifications.length}
        notifications={notifications}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />
      <main>
        <section id="home">
          <h2>Welcome to Accio</h2>
          <p>This is the home page of our sample application.</p>

          <Link to="/file-share">
            <button>Go to FileShare</button>
          </Link>

          <Link to="/share-link">
            <button>Go to FileShare via link</button>
          </Link>

          <button onClick={handleLogoutClick}>Log Out</button>
        </section>
      </main>

      {/* Modal for logout confirmation */}
      <Modal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleLogoutConfirm} />
    </div>
  );
}

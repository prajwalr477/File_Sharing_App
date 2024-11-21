import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Modal from '../components/Modal';
import { socket } from '../socket'; // Assuming socket.js file exists
import './Home.css'

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
        
        
        {/* Main Section */}
        <section className="main-section">
          <div className="main-left">
            <div id="file-upload-section">
            <Link to="/share-link">
            <button>Go to FileShare</button>
          </Link>
          <Link to="/file-share">
            <button>Create Room</button>
          </Link>
          <Link to="/receiver">
            <button>Join Room</button>
          </Link>
            </div>
          </div>
          <div className="main-right">
            <div className="right">
              <div className="right-centered">
                <h1>Share files directly from your device to anywhere</h1>
                <p className="description">
                  Send files of any size directly from your device without ever storing anything online.
                </p>
                <div className="features">
                  <div className="features-left">
                    <div className="feature">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 512 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="none"
                          strokeLinecap="round"
                          strokeMiterlimit={10}
                          strokeWidth={32}
                          d="M256 256s-48-96-126-96c-54.12 0-98 43-98 96s43.88 96 98 96c37.51 0 71-22.41 94-48m32-48s48 96 126 96c54.12 0 98-43 98-96s-43.88-96-98-96c-37.51 0-71 22.41-94 48"
                        />
                      </svg>
                      <span>No file size limit</span>
                    </div>
                    <div className="feature">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 512 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={32}
                          d="M320 120l48 48-48 48"
                        />
                        <path
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={32}
                          d="M352 168H144a80.24 80.24 0 00-80 80v16m128 128l-48-48 48-48"
                        />
                        <path
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={32}
                          d="M160 344h208a80.24 80.24 0 0080-80v-16"
                        />
                      </svg>
                      <span>Peer-to-peer</span>
                    </div>
                  </div>
                  <div className="features-right">
                    <div className="feature">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 512 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M432 208H288l32-192L80 304h144l-32 192z" />
                      </svg>
                      <span>Blazingly fast</span>
                    </div>
                    <div className="feature">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth={0}
                        viewBox="0 0 512 512"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={32}
                          d="M288 304v-18c0-16.63-14.26-30-32-30s-32 13.37-32 30v18"
                        />
                        <path d="M304 416h-96a32 32 0 01-32-32v-48a32 32 0 0132-32h96a32 32 0 0132 32v48a32 32 0 01-32 32z" />
                        <path
                          fill="none"
                          strokeLinejoin="round"
                          strokeWidth={32}
                          d="M416 221.25V416a48 48 0 01-48 48H144a48 48 0 01-48-48V96a48 48 0 0148-48h98.75a32 32 0 0122.62 9.37l141.26 141.26a32 32 0 019.37 22.62z"
                        />
                        <path
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={32}
                          d="M256 50.88V176a32 32 0 0032 32h125.12"
                        />
                      </svg>
                      <span>End-to-end encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Informational Section */}
        <section className="info-section">
          <div className="what">
            <div className="head">
              <h1>Why Accio?</h1>
            </div>
            <div className="content">
              <cite>
                We are a free and independent peer-to-peer (P2P) file-sharing service
                that prioritizes your privacy and keeps your data safe. We store
                nothing online: simply close your browser to stop sending. Our mission
                is to make sure people keep their data safely in their own hands.
              </cite>
            </div>
          </div>
        </section>
      </main>
      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        confirmLogout={handleLogoutConfirm}
      />
    </div>
  );
}

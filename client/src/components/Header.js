import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import io from 'socket.io-client';

// Connect to the backend socket server
const socket = io('http://localhost:5000'); // Ensure this is your server URL

export default function Header({ messageCount = 0, notifications = [] }) {
  const [newNotifications, setNewNotifications] = useState(notifications);

  useEffect(() => {
    // Listen for 'new-notification' event
    socket.on('new-notification', (notification) => {
      console.log('New notification received:', notification);
      setNewNotifications((prevNotifications) => [
        ...prevNotifications,
        notification,
      ]);
    });

    // Clean up the socket listener when component unmounts
    return () => {
      socket.off('new-notification');
    };
  }, []); // Empty array means it only runs on mount

  return (
    <header>
      <h1>Accio</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/user-prompt">FileShare</Link></li>
          <li><Link to="#about">About</Link></li>
          <li><Link to="#services">Services</Link></li>
          <li><Link to="#contact">Contact</Link></li>
        </ul>
        <div className="notifications">
          <Link to="/notifications">
            Notifications ({messageCount})
          </Link>
          <div className="notification-dropdown">
            {newNotifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              newNotifications.map((notification, index) => (
                <div key={index} className="notification-item">
                  <p>{notification.sender} wants to connect</p>
                </div>
              ))
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

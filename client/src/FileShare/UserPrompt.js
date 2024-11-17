import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

const UserPrompt = () => {
  const [friendUsername, setFriendUsername] = useState('');
  const [status, setStatus] = useState('');
  const [friendRequests, setFriendRequests] = useState([]); // Store incoming friend requests

  useEffect(() => {
    // Check socket connection status when this component mounts
    console.log('Socket connected status:', socket.connected);

    // Log when the user is connected or disconnected
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Listen for incoming friend requests
    socket.on('receive-friend-request', ({ from }) => {
      setFriendRequests((prev) => [...prev, from]);
      console.log(`Friend request received from: ${from}`);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receive-friend-request');
    };
  }, []);

  // Handle friend username change
  const handleUsernameChange = (e) => {
    setFriendUsername(e.target.value);
  };

  // Handle connect button click
  const handleConnect = () => {
    if (!friendUsername) {
      setStatus('Please enter a valid username.');
      return;
    }

    setStatus('Request sent, waiting for response...');
    socket.emit('connect-request', { username: friendUsername });

    // Listen for the response from the server
    socket.on('user-status', (response) => {
      if (response === 'offline') {
        setStatus('User is not online.');
      } else if (response === 'request-accepted') {
        setStatus('Request accepted. Data channel established.');
      }
    });
  };

  return (
    <div className="user-prompt-container">
      <h2>Enter Friend's Username</h2>
      <input 
        type="text" 
        value={friendUsername} 
        onChange={handleUsernameChange} 
        placeholder="Friend's Username" 
      />
      <button onClick={handleConnect}>Connect</button>
      <p>{status}</p> {/* Display the status message */}

      <div>
        <h3>Friend Requests</h3>
        <ul>
          {friendRequests.map((request, index) => (
            <li key={index}>{request} sent you a friend request</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserPrompt;

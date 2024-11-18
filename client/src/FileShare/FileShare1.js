import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './FileShare1.css';

const serverURL =
  process.env.NODE_ENV === 'production'
    ? window.location.origin // Use the deployed website's origin in production
    : 'http://localhost:5000'; // Localhost for development
const socket = io(serverURL);

const FileShare = ({ addNotification }) => {
  const [username, setUsername] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [dataChannel, setDataChannel] = useState(null);
  const [peerConnection, setPeerConnection] = useState(new RTCPeerConnection());
  const [receivedFileChunks, setReceivedFileChunks] = useState([]);
  const [fileMetadata, setFileMetadata] = useState(null);
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [connectionRequestSender, setConnectionRequestSender] = useState('');
  const CHUNK_SIZE = 16384;

  useEffect(() => {
    // Log all received events for debugging
    socket.onAny((event, ...args) => {
      console.log(`Received event: ${event}`, args);
    });
  
    // Existing socket event listeners
    socket.on('connect', () => {
      console.log('Connected to server.');
      updateStatus('Connected to server.');
    });
  
    socket.on('connection-request', ({ fromUsername }) => {
      console.log(`Connection request received from ${fromUsername}`);
      setConnectionRequestSender(fromUsername);
      setShowConnectionPopup(true);
      updateStatus(`Connection request received from ${fromUsername}.`);
    });
  
    socket.on('new-notification', ({ sender, message }) => {
      console.log(`Notification received: ${message} (from ${sender})`);
      updateStatus(`Notification from ${sender}: ${message}`);
    });
  
    socket.on('connection-approved', ({ message }) => {
      console.log(message);
      updateStatus(message);
      setIsConnected(true);
    });
  
    socket.on('connection-denied', ({ message }) => {
      console.log(message);
      updateStatus(message);
    });
  
    socket.on('startDataChannel', () => {
      console.log('Data channel established. Ready for file transfer!');
      updateStatus('Data channel established. Ready for file transfer!');
      setIsConnected(true);
      setShowConnectionPopup(false);
    });
  
    // Cleanup on component unmount
    return () => {
      socket.offAny();
      socket.off('connect');
      socket.off('connection-request');
      socket.off('new-notification');
      socket.off('connection-approved');
      socket.off('connection-denied');
      socket.off('startDataChannel');
    };
  }, []);
  
  const updateStatus = (message) => {
    setStatus(message);
    if (addNotification) {
      addNotification(message); // Send the status update to notifications
    }
  };
  
  const handleUsernameSubmit = async () => {
    console.log(`Registering user: ${username}`);
    const response = await fetch(`${serverURL}/validate-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
  
    const result = await response.json();
  
    if (result.message) {
      console.log(`User validated: ${username}`);
      socket.emit('register-user', username); // Emit user registration to the server
      updateStatus('User registered successfully.');
  
      // Send notification to the target user after validation
      if (targetUser.trim() !== '') {
        socket.emit('send-notification', {
          toUsername: targetUser,
          message: `${username} has registered and is ready to connect!`,
        });
        console.log(`Notification sent to ${targetUser}`);
      }
    } else {
      console.error(`Validation failed: ${result.error || 'Unknown error'}`);
      updateStatus(result.error || 'Failed to validate user.');
    }
  };
  
  const handleConnectionRequest = () => {
    if (targetUser.trim() === '') {
      console.warn('Target username cannot be empty.');
      updateStatus('Target username cannot be empty.');
      return;
    }
    console.log(`Sending connection request from ${username} to ${targetUser}`);
    socket.emit('connection-request', {
      toUsername: targetUser,
      fromUsername: username,
    });
    updateStatus(`Connection request sent to ${targetUser}.`);
  };
  
  const createOffer = async () => {
    if (!file) {
      console.warn('No file selected for sharing.');
      updateStatus('Please select a file to share.');
      return;
    }
  
    console.log('Creating data channel and offer for file transfer.');
    const channel = peerConnection.createDataChannel('fileTransfer');
    setDataChannel(channel);
  
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
  
    socket.emit('offer', { offer, toUsername: targetUser });
    updateStatus('Offer sent to initiate file transfer.');
  };
  
  const acceptConnection = () => {
    console.log(`Accepting connection request from ${connectionRequestSender}`);
    socket.emit('connection-response', {
      toUsername: connectionRequestSender,
      accepted: true,
    });
    updateStatus('Connection request accepted.');
    setShowConnectionPopup(false);
  };
  
  const rejectConnection = () => {
    console.log(`Rejecting connection request from ${connectionRequestSender}`);
    socket.emit('connection-response', {
      toUsername: connectionRequestSender,
      accepted: false,
    });
    updateStatus('Connection request rejected.');
    setShowConnectionPopup(false);
  };
  

  return (
    <div className="file-share-container">
      {!isConnected ? (
        <div className="username-modal">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleUsernameSubmit}>Submit</button>
        </div>
      ) : (
        <>
          <h1>File Share App</h1>
          <div className="file-input">
            <input
              type="text"
              placeholder="Enter target username"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
            />
            <button onClick={handleConnectionRequest}>Send Connection Request</button>
          </div>
          <div className="file-input">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={createOffer}>Send File</button>
          </div>
          {status && <p className="status-message">{status}</p>}
        </>
      )}

      {showConnectionPopup && (
        <div className="connection-popup">
          <p>{connectionRequestSender} wants to connect.</p>
          <button onClick={acceptConnection}>Accept</button>
          <button onClick={rejectConnection}>Reject</button>
        </div>
      )}
    </div>
  );
};

export default FileShare;

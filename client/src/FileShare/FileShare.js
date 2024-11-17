import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './FileShare.css';

const serverURL =
  process.env.NODE_ENV === 'production'
    ? window.location.origin // Use the deployed website's origin in production
    : 'http://localhost:5000'; // Localhost for development
const socket = io(serverURL); // Server URL

const FileShare = () => {
  const [username, setUsername] = useState('');
  const [targetUser, setTargetUser] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [dataChannel, setDataChannel] = useState(null);
  const [peerConnection, setPeerConnection] = useState(new RTCPeerConnection());
  const [receivedFileChunks, setReceivedFileChunks] = useState([]);
  const [fileMetadata, setFileMetadata] = useState(null);
  const CHUNK_SIZE = 16384;

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server.');
    });

    socket.on('connection-request', (fromUsername) => {
      const accept = window.confirm(`${fromUsername} wants to connect. Accept?`);
      if (accept) {
        socket.emit('accept-connection', fromUsername);
        setStatus('Connection established!');
        setIsConnected(true);
      }
    });

    return () => {
      socket.off('connection-request');
    };
  }, []);

  const handleUsernameSubmit = async () => {
    const response = await fetch('http://localhost:5000/validate-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    const result = await response.json();

    if (result.success) {
      socket.emit('register-user', username);
      setStatus('User registered successfully.');
    } else {
      setStatus(result.error || 'Validation failed.');
    }
  };

  const handleConnectionRequest = () => {
    socket.emit('connection-request', targetUser);
    setStatus(`Connection request sent to ${targetUser}.`);
  };

  const createOffer = async () => {
    const channel = peerConnection.createDataChannel('fileTransfer');
    setDataChannel(channel);

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit('offer', { offer, targetUser });
    setStatus('Offer sent!');
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
            <input type="text" placeholder="Enter target username" value={targetUser} onChange={(e) => setTargetUser(e.target.value)} />
            <button onClick={handleConnectionRequest}>Send Connection Request</button>
          </div>
          <div className="file-input">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={createOffer}>Send File</button>
          </div>
          {status && <p className="status-message">{status}</p>}
        </>
      )}
    </div>
  );
};

export default FileShare;

import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './FileShare.css';

// Ensure socket is initialized globally to avoid duplication
const socket = io('http://localhost:5000'); // Replace with your server URL

const FileShare = () => {
  const [file, setFile] = useState(null);
  const [peerConnection] = useState(new RTCPeerConnection());
  const [dataChannel, setDataChannel] = useState(null);
  const [status, setStatus] = useState('');
  const [isOfferSent, setIsOfferSent] = useState(false);
  const [receivedFileChunks, setReceivedFileChunks] = useState([]);
  const [fileMetadata, setFileMetadata] = useState(null);

  const CHUNK_SIZE = 16384;

  useEffect(() => {
    // Set up the data channel and signaling handlers

    peerConnection.ondatachannel = (event) => {
      const channel = event.channel;
      setDataChannel(channel);

      channel.onopen = () => setStatus('Data channel is open.');
      channel.onclose = () => setStatus('Data channel is closed.');
      channel.onmessage = (event) => {
        if (event.data instanceof ArrayBuffer) {
          setReceivedFileChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };
    };

    // Handle signaling events
    socket.on('offer', async (offer) => {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer', answer);
    });

    socket.on('answer', (answer) => {
      peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', (candidate) => {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) socket.emit('ice-candidate', event.candidate);
    };

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
    };
  }, [peerConnection]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const metadata = { name: selectedFile.name, type: selectedFile.type };
    socket.emit('file-metadata', metadata);
  };

  const sendFile = () => {
    if (!file || !dataChannel || dataChannel.readyState !== 'open') {
      setStatus('No file or data channel not ready.');
      return;
    }

    const fileReader = new FileReader();
    let offset = 0;

    fileReader.onload = (event) => {
      dataChannel.send(event.target.result);
      offset += event.target.result.byteLength;

      if (offset < file.size) fileReader.readAsArrayBuffer(file.slice(offset, offset + CHUNK_SIZE));
      else setStatus('File sent successfully!');
    };

    fileReader.readAsArrayBuffer(file.slice(offset, offset + CHUNK_SIZE));
  };

  const createOffer = () => {
    if (isOfferSent) return;

    const channel = peerConnection.createDataChannel('fileTransfer');
    setDataChannel(channel);

    channel.onopen = () => setStatus('Data channel is open.');
    channel.onclose = () => setStatus('Data channel is closed.');

    peerConnection.createOffer().then((offer) => {
      peerConnection.setLocalDescription(offer);
      socket.emit('offer', offer);
      setIsOfferSent(true);
      setStatus('Offer sent!');
    });
  };

  const handleReceiveFile = () => {
    if (receivedFileChunks.length === 0) return setStatus('No file chunks received.');

    const receivedBlob = new Blob(receivedFileChunks, { type: fileMetadata?.type });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(receivedBlob);
    link.download = fileMetadata?.name || 'downloaded_file';
    link.click();

    setReceivedFileChunks([]);
    setStatus('File downloaded.');
  };

  return (
    <div className="file-share-container">
      <h1>File Sharing App</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={sendFile}>Send File</button>
      <button onClick={createOffer}>Create Offer</button>
      <button onClick={handleReceiveFile}>Download File</button>
      <p>{status}</p>
    </div>
  );
};

export default FileShare;

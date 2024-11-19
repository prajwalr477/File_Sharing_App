import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import download from "downloadjs";

const ReceiverApp = () => {
  const [roomID, setRoomID] = useState("");
  const [activeScreen, setActiveScreen] = useState("join-screen");
  const [fileShare, setFileShare] = useState({
    metadata: null,
    transmitted: 0,
    buffer: null, // Use null until metadata is received
    progress: 0,
  });

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    // Handle metadata reception
    socket.current.on("file-meta", (metadata) => {
      console.log(`Metadata received for Room ID: ${roomID}`);
    
      if (!metadata || !metadata.total_buffer_size || !metadata.filename) {
        console.error("Invalid metadata received!");
        return;
      }
    
      setFileShare({
        metadata,
        transmitted: 0,
        buffer: new Uint8Array(metadata.total_buffer_size),
        progress: 0,
      });
    
      // Request the first file chunk
      socket.current.emit("fs-start", { uid: roomID });
    });
    

    // Handle file chunks
    socket.current.on("file-raw", ({ buffer }) => {
      console.log(`Received chunk of size: ${buffer.byteLength}`);
    
      setFileShare((prev) => {
        if (!prev.metadata) {
          console.error("Metadata is missing!");
          return prev;
        }
    
        const start = prev.transmitted;
        const end = start + buffer.byteLength;
    
        // Check if the buffer size exceeds the total buffer size
        if (end > prev.metadata.total_buffer_size) {
          console.error(
            `Buffer overflow! Expected: ${prev.metadata.total_buffer_size}, Got: ${end}`
          );
          return prev; // Prevent overwriting
        }
    
        // Update the buffer safely
        const updatedBuffer = new Uint8Array(prev.buffer);
        updatedBuffer.set(new Uint8Array(buffer), start);
    
        const transmitted = end;
        const progress = Math.trunc(
          (transmitted / prev.metadata.total_buffer_size) * 100
        );
    
        if (transmitted >= prev.metadata.total_buffer_size) {
          console.log("File received completely. Downloading...");
          const blob = new Blob([updatedBuffer]);
          download(blob, prev.metadata.filename);
          return { metadata: null, transmitted: 0, buffer: null, progress: 0 };
        }
    
        return {
          ...prev,
          transmitted,
          buffer: updatedBuffer,
          progress,
        };
      });
    
      // Request the next chunk only if no overflow
      socket.current.emit("fs-start", { uid: roomID });
    });
    



    return () => {
      socket.current.disconnect();
    };
  }, [roomID]);

  const handleConnect = () => {
    if (!roomID.trim()) return;
    console.log(`Receiver connecting to Room ID: ${roomID}`);
    socket.current.emit("receiver-join", { uid: roomID });
    setActiveScreen("fs-screen");
  };

  return (
    <div className="app">
      {activeScreen === "join-screen" && (
        <div className="screen join-screen active">
          <h2>Join a Room</h2>
          <input
            type="text"
            placeholder="Room ID"
            value={roomID}
            onChange={(e) => setRoomID(e.target.value)}
          />
          <button onClick={handleConnect}>Join</button>
        </div>
      )}

      {activeScreen === "fs-screen" && (
        <div className="screen fs-screen">
          <h2>Receiving File</h2>
          {fileShare.metadata && (
            <div>
              <p>{fileShare.metadata.filename}</p>
              <p>Progress: {fileShare.progress}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReceiverApp;

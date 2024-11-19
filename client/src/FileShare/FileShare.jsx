import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SenderApp = () => {
  const [joinID, setJoinID] = useState("");
  const [activeScreen, setActiveScreen] = useState("join-screen");
  const [fileTransfer, setFileTransfer] = useState({
    file: null,
    buffer: null,
    progress: 0,
  });

  const socket = useRef(null);
  const joinIDRef = useRef(""); // Use a ref for Room ID

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    // Handle the init event
    socket.current.on("init", (uid) => {
      console.log(`Receiver connected with ID: ${uid}`);
      setActiveScreen("fs-screen"); // Switch to the file-sharing screen
    });

    // Handle fs-share event
    socket.current.on("fs-share", () => {
      console.log("Receiver requested file chunk. Sending next chunk...");
      sendNextChunk();
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const generateID = () => {
    return `${Math.trunc(Math.random() * 999)}-${Math.trunc(
      Math.random() * 999
    )}-${Math.trunc(Math.random() * 999)}`;
  };

  const handleCreateRoom = () => {
    const newJoinID = generateID();
    setJoinID(newJoinID);
    joinIDRef.current = newJoinID; // Update the ref
    console.log(`Room created with ID: ${newJoinID}`);
    socket.current.emit("sender-join", { uid: newJoinID });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const buffer = new Uint8Array(reader.result);
      setFileTransfer({
        file,
        buffer,
        progress: 0,
      });

      console.log(`Sending file metadata for Room ID: ${joinIDRef.current}`);
      socket.current.emit("file-meta", {
        uid: joinIDRef.current, // Use ref to ensure the correct Room ID is used
        metadata: {
          filename: file.name,
          total_buffer_size: buffer.length,
          buffer_size: 1024,
        },
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const sendNextChunk = () => {
    const currentJoinID = joinIDRef.current;
    if (!currentJoinID) {
      console.error("Room ID is missing during chunk emission!");
      return;
    }
  
    setFileTransfer((prev) => {
      if (!prev.buffer || prev.buffer.length === 0) {
        console.warn("No more chunks to send.");
        return prev;
      }
  
      const chunkSize = 1024; // Default chunk size
      const chunk = prev.buffer.slice(0, chunkSize);
      const remainingBuffer = prev.buffer.slice(chunkSize);
  
      console.log(
        `Sending chunk for Room ID: ${currentJoinID}, chunk size: ${chunk.byteLength}`
      );
  
      socket.current.emit("file-raw", {
        uid: joinIDRef.current,
        buffer: chunk,
      });
  
      return {
        ...prev,
        buffer: remainingBuffer,
        progress: Math.trunc(
          ((prev.file.size - remainingBuffer.length) / prev.file.size) * 100
        ),
      };
    });
  };
  

  // Debug fallback: Manually switch screens
  const handleDebugSwitch = () => {
    setActiveScreen("fs-screen");
  };

  return (
    <div className="app">
      {activeScreen === "join-screen" && (
        <div className="screen join-screen active">
          <h2>Create a Room</h2>
          <button onClick={handleCreateRoom}>Create Room</button>
          {joinID && <p>Room ID: {joinID}</p>}
          <button onClick={handleDebugSwitch}>Debug: Go to File Sharing</button>
        </div>
      )}

      {activeScreen === "fs-screen" && (
        <div className="screen fs-screen">
          <h2>Share a File</h2>
          <input type="file" onChange={handleFileChange} />
          {fileTransfer.file && (
            <div>
              <p>{fileTransfer.file.name}</p>
              <p>Progress: {fileTransfer.progress}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SenderApp;
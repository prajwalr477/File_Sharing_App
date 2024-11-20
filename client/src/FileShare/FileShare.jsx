import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

const SenderApp = () => {
  const [joinID, setJoinID] = useState("");
  const [activeScreen, setActiveScreen] = useState("join-screen");
  const [uploadedFiles, setUploadedFiles] = useState([]); // List to store all uploaded files

  const socket = useRef(null);
  const joinIDRef = useRef("");
  const fileBufferRef = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("init", (uid) => {
      console.log(`Receiver connected with ID: ${uid}`);
      setActiveScreen("fs-screen");
    });

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
    joinIDRef.current = newJoinID;
    socket.current.emit("sender-join", { uid: newJoinID });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const buffer = new Uint8Array(reader.result);
      fileBufferRef.current = buffer;

      // Add the new file to the uploadedFiles list
      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        { name: file.name, size: file.size },
      ]);

      console.log("File loaded and buffer set:", buffer);

      socket.current.emit("file-meta", {
        uid: joinIDRef.current,
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
    const chunkSize = 1024;
    const fileBuffer = fileBufferRef.current;

    if (!fileBuffer || fileBuffer.byteLength === 0) {
      console.warn("No more chunks to send.");
      fileBufferRef.current = null; // Reset for the next file upload
      return;
    }

    const chunk = fileBuffer.slice(0, chunkSize);
    fileBufferRef.current = fileBuffer.slice(chunkSize);

    socket.current.emit("file-raw", {
      uid: joinIDRef.current,
      buffer: chunk,
    });
  };

  return (
    <div className="app">
      {activeScreen === "join-screen" && (
        <div className="screen join-screen active">
          <h2>Create a Room</h2>
          <button onClick={handleCreateRoom}>Create Room</button>
          {joinID && <p>Room ID: {joinID}</p>}
        </div>
      )}

      {activeScreen === "fs-screen" && (
        <div className="screen fs-screen">
          <h2>Share Files</h2>
          <input type="file" onChange={handleFileChange} />

          <div className="uploaded-files">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="file-details">
                <p>File Name: {file.name}</p>
                <p>File Size: {(file.size / 1024).toFixed(2)} KB</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SenderApp;

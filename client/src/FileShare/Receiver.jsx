import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import download from "downloadjs";

const ReceiverApp = () => {
  const [roomID, setRoomID] = useState("");
  const [activeScreen, setActiveScreen] = useState("join-screen");
  const [fileTransfers, setFileTransfers] = useState([]); // List to store details of all files

  const socket = useRef(null);
  const fileBufferRef = useRef(null);
  const transmittedRef = useRef(0);
  const fileMetadataRef = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("file-meta", (metadata) => {
      console.log("Metadata received:", metadata);
      fileMetadataRef.current = metadata;
      fileBufferRef.current = new Uint8Array(metadata.total_buffer_size);
      transmittedRef.current = 0;

      // Add new file metadata to the list
      setFileTransfers((prevTransfers) => [
        ...prevTransfers,
        { metadata, progress: 0 },
      ]);

      socket.current.emit("fs-start", { uid: roomID });
    });

    socket.current.on("file-raw", ({ buffer }) => {
      const start = transmittedRef.current;
      const end = start + buffer.byteLength;

      fileBufferRef.current.set(new Uint8Array(buffer), start);
      transmittedRef.current = end;

      const progress = Math.trunc(
        (transmittedRef.current / fileMetadataRef.current.total_buffer_size) *
          100
      );

      // Update progress for the current file
      setFileTransfers((prevTransfers) =>
        prevTransfers.map((transfer) =>
          transfer.metadata.filename === fileMetadataRef.current.filename
            ? { ...transfer, progress }
            : transfer
        )
      );

      if (end >= fileMetadataRef.current.total_buffer_size) {
        const blob = new Blob([fileBufferRef.current]);
        download(blob, fileMetadataRef.current.filename);
      } else {
        socket.current.emit("fs-start", { uid: roomID });
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [roomID]);

  const handleConnect = () => {
    if (!roomID.trim()) return;
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
          <h2>Receiving Files</h2>
          <div className="file-list">
            {fileTransfers.map((transfer, index) => (
              <div key={index} className="file-details">
                <p>File Name: {transfer.metadata.filename}</p>
                <p>File Size: {(transfer.metadata.total_buffer_size / 1024).toFixed(2)} KB</p>
                <p>Progress: {transfer.progress}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiverApp;

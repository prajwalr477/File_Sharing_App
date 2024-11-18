import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
//import "./styles.css";

const App = () => {
  const [receiverID, setReceiverID] = useState(null);
  const [joinID, setJoinID] = useState("");
  const [activeScreen, setActiveScreen] = useState("join-screen");
  const socket = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    socket.current = io('http://localhost:5000');

    socket.current.on("init", (uid) => {
      setReceiverID(uid);
      setActiveScreen("fs-screen");
    });

    socket.current.on("fs-share", () => {
      setFileTransfer((prev) => ({ ...prev, sendChunk: true }));
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
    socket.current.emit("sender-join", {
      uid: newJoinID,
    });
  };

  const [fileTransfer, setFileTransfer] = useState({
    file: null,
    buffer: null,
    progress: 0,
    sendChunk: false,
  });

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
        sendChunk: false,
      });

      socket.current.emit("file-meta", {
        uid: receiverID,
        metadata: {
          filename: file.name,
          total_buffer_size: buffer.length,
          buffer_size: 1024,
        },
      });
    };
    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    if (fileTransfer.sendChunk) {
      const { buffer, file } = fileTransfer;
      if (buffer.length > 0) {
        const chunk = buffer.slice(0, 1024);
        socket.current.emit("file-raw", {
          uid: receiverID,
          buffer: chunk,
        });
        setFileTransfer((prev) => ({
          ...prev,
          buffer: buffer.slice(1024),
          progress: Math.trunc(
            ((file.size - buffer.length) / file.size) * 100
          ),
          sendChunk: false,
        }));
      }
    }
  }, [fileTransfer.sendChunk]);

  return (
    <div className="app">
      {activeScreen === "join-screen" && (
        <div className="screen join-screen active">
          <div className="form">
            <h2>Share your files Securely</h2>
            <div className="form-input">
              <button id="sender-start-con-btn" onClick={handleCreateRoom}>
                Create room
              </button>
            </div>
            <div className="form-input" id="join-id">
              {joinID && (
                <>
                  <b>Room ID</b>
                  <span>{joinID}</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeScreen === "fs-screen" && (
        <div className="screen fs-screen">
          <div className="file-input">
            <label htmlFor="file-input">Click here to select files for sharing</label>
            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
            />
          </div>
          <div className="files-list">
            <div className="title">Shared Files</div>
            {fileTransfer.file && (
              <div className="item">
                <div className="progress">{fileTransfer.progress}%</div>
                <div className="filename">{fileTransfer.file.name}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import download from "downloadjs";

const ReceiverApp = () => {
  const [senderID, setSenderID] = useState("");
  const [activeScreen, setActiveScreen] = useState("join-screen");
  const [fileShare, setFileShare] = useState({
    metadata: null,
    transmitted: 0,
    buffer: [],
    progress: 0,
  });

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("file-meta", (metadata) => {
      setFileShare((prev) => ({
        ...prev,
        metadata,
        transmitted: 0,
        buffer: [],
        progress: 0,
      }));
      socket.current.emit("fs-start", { uid: senderID });
    });

    socket.current.on("file-raw", (buffer) => {
      setFileShare((prev) => {
        const transmitted = prev.transmitted + buffer.byteLength;
        const progress = Math.trunc(
          (transmitted / prev.metadata.total_buffer_size) * 100
        );

        if (transmitted === prev.metadata.total_buffer_size) {
          download(new Blob([...prev.buffer, buffer]), prev.metadata.filename);
          return { metadata: null, transmitted: 0, buffer: [], progress: 0 };
        }

        return {
          ...prev,
          transmitted,
          buffer: [...prev.buffer, buffer],
          progress,
        };
      });
    });

    return () => {
      socket.current.disconnect();
    };
  }, [senderID]);

  const handleConnect = () => {
    if (!senderID.trim()) return;

    const joinID = `${Math.trunc(Math.random() * 999)}-${Math.trunc(
      Math.random() * 999
    )}-${Math.trunc(Math.random() * 999)}`;

    socket.current.emit("receiver-join", { uid: joinID, sender_uid: senderID });
    setActiveScreen("fs-screen");
  };

  return (
    <div className="app">
      {activeScreen === "join-screen" && (
        <div className="screen join-screen active">
          <div className="form">
            <h2>Share your files securely</h2>
            <div className="form-input">
              <label htmlFor="join-id">Join ID</label>
              <input
                type="text"
                id="join-id"
                value={senderID}
                onChange={(e) => setSenderID(e.target.value)}
              />
            </div>
            <div className="form-input">
              <button id="receiver-start-con-btn" onClick={handleConnect}>
                Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {activeScreen === "fs-screen" && (
        <div className="screen fs-screen">
          <div className="files-list">
            <div className="title">Shared Files</div>
            {fileShare.metadata && (
              <div className="item">
                <div className="progress">{fileShare.progress}%</div>
                <div className="filename">{fileShare.metadata.filename}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiverApp;

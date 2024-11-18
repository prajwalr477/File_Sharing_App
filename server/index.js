const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import the auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Set up server and Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins, adjust for production
    methods: ['GET', 'POST'],
  },
});

// In-memory store for connected users
const users = {};

// In-memory store for pending requests
const pendingRequests = {}; // { toUsername: [{ fromUsername, socketId }] }

// File sharing: In-memory file transfer state
const fileSessions = {}; // { sessionId: { senderSocket, receiverSocket, metadata, buffer } }

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  /**
   * File sharing events
   */
  socket.on('sender-join', (data) => {
    const { uid } = data;
    socket.join(uid);
    console.log(`Sender joined with ID: ${uid}`);
  });

  socket.on('receiver-join', (data) => {
    const { uid, sender_uid } = data;
    socket.join(uid);
    console.log(`Receiver joined with ID: ${uid}, connected to sender: ${sender_uid}`);
    // Notify sender to start the file transfer to this receiver
    socket.to(sender_uid).emit('init', uid);
  });

  socket.on("fs-start", (data) => {
    const { uid } = data;
    socket.to(uid).emit("fs-share", {}); // Signal receiver to prepare for file chunks
});

socket.on("file-raw", (data) => {
    const { uid, buffer } = data;
    socket.to(uid).emit("file-raw", buffer);
});


  socket.on('file-meta', (data) => {
    const { uid, metadata } = data;
    console.log(`File metadata received for session ${uid}:`, metadata);

    // Ensure that the receiver has already joined
    socket.to(uid).emit('file-meta', metadata); // Emit metadata to the receiver
});

socket.on('receiver-join', (data) => {
  const { uid, sender_uid } = data;
  socket.join(uid);
  console.log(`Receiver joined with ID: ${uid}, connected to sender: ${sender_uid}`);
  // Notify the sender that the receiver is ready to receive the file
  socket.to(sender_uid).emit('init', uid);
});



  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    for (const [username, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[username];
        console.log(`User disconnected: ${username}`);
        break;
      }
    }
  });
});

// Define port and start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


  /**
   * Peer-to-peer connection and signaling events (uncomment if needed)
   */
  // socket.on('register-user', (username) => {
  //   users[username] = socket.id;
  //   console.log(`User registered: ${username} with socket ID: ${socket.id}`);

  //   if (pendingRequests[username]) {
  //     pendingRequests[username].forEach((request) => {
  //       io.to(socket.id).emit('connection-request', { fromUsername: request.fromUsername });
  //     });
  //     delete pendingRequests[username];
  //   }
  // });

  // socket.on('connection-request', ({ toUsername, fromUsername }) => {
  //   const targetSocketId = users[toUsername];

  //   if (targetSocketId) {
  //     io.to(targetSocketId).emit('new-notification', {
  //       sender: fromUsername,
  //       message: `${fromUsername} wants to connect.`,
  //     });
  //   } else {
  //     console.log(`User ${toUsername} is offline. Storing request.`);
  //     if (!pendingRequests[toUsername]) {
  //       pendingRequests[toUsername] = [];
  //     }
  //     pendingRequests[toUsername].push({ fromUsername, socketId: socket.id });
  //   }
  // });

  // socket.on('connection-response', ({ toUsername, accepted }) => {
  //   const targetSocketId = users[toUsername];
  //   if (targetSocketId) {
  //     const message = accepted
  //       ? `${toUsername} accepted your request.`
  //       : `${toUsername} declined your request.`;
  //     io.to(targetSocketId).emit(accepted ? 'connection-approved' : 'connection-denied', { message });
  //   }
  // });

  // socket.on('offer', (offer, toUsername) => {
  //   const targetSocketId = users[toUsername];
  //   if (targetSocketId) {
  //     io.to(targetSocketId).emit('offer', offer);
  //   }
  // });

  // socket.on('answer', (answer, toUsername) => {
  //   const targetSocketId = users[toUsername];
  //   if (targetSocketId) {
  //     io.to(targetSocketId).emit('answer', answer);
  //   }
  // });

  // socket.on('ice-candidate', (candidate, toUsername) => {
  //   const targetSocketId = users[toUsername];
  //   if (targetSocketId) {
  //     io.to(targetSocketId).emit('ice-candidate', candidate);
  //   }
  // });

  // socket.on('logout', (username) => {
  //   delete users[username];
  //   console.log(`User logged out: ${username}`);
  // });

  
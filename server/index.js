import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import DBConnection from './database/db.js';
import router from './routes/routes.js';

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

// Import the auth routes

app.use('/auth', authRoutes);


app.use('/share-link', router);





// Connect to MongoDB
DBConnection();

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
  socket.on("sender-join", (data) => {
    const { uid } = data;
    console.log(`Sender joined Room ID: ${uid}`);
    socket.join(uid);
  });

  socket.on("receiver-join", (data) => {
    const { uid } = data;
    console.log(`Receiver joined Room ID: ${uid}`);
    socket.join(uid);
    socket.to(uid).emit("init", socket.id);
  });

  socket.on("file-meta", (data) => {
    const { uid, metadata } = data;
    console.log(`Metadata received for Room ID: ${uid}`);
    socket.to(uid).emit("file-meta", metadata);
  });

  socket.on("fs-start", (data) => {
    const { uid } = data;
    console.log(`Receiver requesting next chunk for Room ID: ${uid}`);
    socket.to(uid).emit("fs-share");
  });

  socket.on("file-raw", (data) => {
    const { uid, buffer } = data;

    if (!uid || !buffer) {
      console.error("Invalid data in file-raw event. Ensure Room ID and buffer are provided.");
      return;
    }

    console.log(
      `Chunk received for Room ID: ${uid}, chunk size: ${buffer.byteLength}`
    );
    socket.to(uid).emit("file-raw", { buffer });
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

  
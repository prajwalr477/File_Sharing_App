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
    origin: '*', // Allow all origins, adjust if necessary in production
    methods: ['GET', 'POST'],
  },
});

// In-memory store for connected users
const users = {};

// In-memory store for pending requests
const pendingRequests = {};  // { toUsername: [{ fromUsername, socketId }] }

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Register a user with their username
  socket.on('register-user', (username) => {
    users[username] = socket.id;
    console.log(`User registered: ${username} with socket ID: ${socket.id}`);

    // If there are pending requests for this user, notify them
    if (pendingRequests[username]) {
      pendingRequests[username].forEach(request => {
        io.to(socket.id).emit('connection-request', { fromUsername: request.fromUsername });
      });
      // Clear the pending requests after notifying
      delete pendingRequests[username];
    }
  });

  // When a connection request is sent
  socket.on('connection-request', ({ toUsername, fromUsername }) => {
    const targetSocketId = users[toUsername];
    
    if (targetSocketId) {
      // User is online, send request
      io.to(targetSocketId).emit('connection-request', { fromUsername });
      console.log(`Connection request sent from ${fromUsername} to ${toUsername}`);
    } else {
      // User is offline, store the request
      console.log(`User ${toUsername} is offline. Storing request.`);
      if (!pendingRequests[toUsername]) {
        pendingRequests[toUsername] = [];
      }
      pendingRequests[toUsername].push({ fromUsername, socketId: socket.id });
      console.log(`Connection request stored for ${toUsername} from ${fromUsername}`);
      socket.emit('connection-denied', { message: 'User not available or not logged in.' });
    }
  });

  // Handle connection response (accept/decline)
  socket.on('connection-response', ({ toUsername, accepted }) => {
    const targetSocketId = users[toUsername];
    if (targetSocketId) {
      if (accepted) {
        io.to(targetSocketId).emit('connection-approved');
        console.log(`Connection approved by ${toUsername}`);
      } else {
        io.to(targetSocketId).emit('connection-denied', { message: 'Connection request denied.' });
        console.log(`Connection denied by ${toUsername}`);
      }
    } else {
      // Handle case where the user isn't online
      socket.emit('connection-denied', { message: 'User not available or not logged in.' });
    }

    // If user was offline, clear the pending request
    if (pendingRequests[toUsername]) {
      pendingRequests[toUsername] = pendingRequests[toUsername].filter(request => request.fromUsername !== toUsername);
    }
  });

  // Handle WebRTC signaling
  socket.on('offer', (offer, toUsername) => {
    const targetSocketId = users[toUsername];
    if (targetSocketId) {
      io.to(targetSocketId).emit('offer', offer);
      console.log(`Offer forwarded to ${toUsername}`);
    }
  });

  socket.on('answer', (answer, toUsername) => {
    const targetSocketId = users[toUsername];
    if (targetSocketId) {
      io.to(targetSocketId).emit('answer', answer);
      console.log(`Answer forwarded to ${toUsername}`);
    }
  });

  socket.on('ice-candidate', (candidate, toUsername) => {
    const targetSocketId = users[toUsername];
    if (targetSocketId) {
      io.to(targetSocketId).emit('ice-candidate', candidate);
    }
  });

  socket.on('logout', (data) => {
    console.log(`User logged out: ${data.user}`);
  });

  // Clean up on disconnect
  socket.on('disconnect', () => {
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

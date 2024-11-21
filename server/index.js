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


  
import { io } from 'socket.io-client';

// Ensure that the socket is initialized only once for the entire app
const socket = io('http://localhost:5000'); // or use your production URL

socket.on('connect', () => {
    console.log('Connected to server:', socket.id);
});

export { socket };

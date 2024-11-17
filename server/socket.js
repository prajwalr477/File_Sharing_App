io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
  
    // Handle connect-request from client
    socket.on('connect-request', ({ username }) => {
      // Check if the user is online (you can use a simple check, or query a database if you prefer)
      const targetUserSocket = findUserSocketByUsername(username); // Implement this function to get the user's socket by username
  
      if (targetUserSocket) {
        // If the user is online, emit a message to them
        targetUserSocket.emit('user-status', 'request-accepted');
      } else {
        // If the user is not online, inform the requester
        socket.emit('user-status', 'offline');
      }
    });
  
    // Helper function to find user's socket by username
    const findUserSocketByUsername = (username) => {
      // Example logic to find the socket id based on the username (you can implement a better way to track users)
      const userSockets = io.sockets.sockets;
      for (let socketId in userSockets) {
        let userSocket = userSockets[socketId];
        if (userSocket.username === username) {
          return userSocket;
        }
      }
      return null;  // If no socket is found for the username
    };
  
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
  
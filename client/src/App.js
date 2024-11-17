import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import HomePage from './pages/Home';  // Example Home page
import Auth from './pages/loginsignup/auth';  // Example Login/Signup page
import FileShare from './FileShare/FileShare';  // FileShare page
import UserPrompt from './FileShare/UserPrompt';  // UserPrompt page (import it here)
import { socket } from './socket';  // Import the socket instance

const App = () => {
  // Define the routes
  const routes = [
    { path: '/', element: <Auth /> },  // Login page
    { path: '/home', element: <HomePage /> },  // Home page
    { path: '/user-prompt', element: <UserPrompt /> },  // UserPrompt page
    { path: '/file-share', element: <FileShare /> },  // FileShare page
  ];

  // Initialize the routes
  const element = useRoutes(routes);

  // Ensuring socket connection persists across all route changes
  useEffect(() => {
    if (!socket.connected) {
      socket.connect(); // Make sure the socket connection is established once on app load
    }

    // Socket event listeners (optional)
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Cleanup socket event listeners when component unmounts
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);  // Empty array ensures this effect only runs on mount

  return element;  // Return the routes element
};

export default App;

import React from 'react';
import { useRoutes } from 'react-router-dom';
import HomePage from './pages/Home';  // Example Home page
import Auth from './pages/loginsignup/auth';  // Example Login/Signup page
import FileShare from './FileShare/FileShare';  // Example FileShare page

const App = () => {
  // Define the routes
  const routes = [
    { path: '/', element: <Auth /> },  // Login page
    { path: '/home', element: <HomePage /> },  // Home page
    { path: '/file-share', element: <FileShare /> },  // FileShare page
    // Add more routes as needed
  ];

  const element = useRoutes(routes);

  return element;  // Return the routes element
};

export default App;

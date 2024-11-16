/*
import React, { useState } from 'react';
import './App.css';
import Auth from './pages/loginsignup/auth'; // Login/Signup component
import HomePage from './pages/Home'; // Home Page component
import FileShare from './FileShare/FileShare'


function App() {
  // State to track if the user is authenticated
  
    
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to handle successful login/signup
  const handleAuthSuccess = () => {
    setIsAuthenticated(true); // Set user as authenticated
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Conditional Rendering 
        {!isAuthenticated ? (
          <Auth onAuthSuccess={handleAuthSuccess} /> // Pass handler to Auth
        ) : (
          <main>
            <FileShare />
          </main>
        )}
      </header>
    </div>
  );
}

export default App;

  */


/*
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './pages/loginsignup/auth';
import Home from './pages/Home';

function App() {
  const handleAuthSuccess = () => {
    console.log('User has successfully logged in');
    localStorage.setItem('isAuthenticated', 'true');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Auth onAuthSuccess={handleAuthSuccess} />}
      />
      <Route
        path="/home"
        element={<Home />}
      />
    </Routes>
  );
}

export default App;

*/


import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import FileShare from './FileShare/FileShare';
import Auth from './pages/loginsignup/auth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/file-share" element={<FileShare />} />
      </Routes>
    </Router>
  );
}

export default App;


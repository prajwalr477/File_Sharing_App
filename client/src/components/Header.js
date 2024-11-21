import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import io from 'socket.io-client';


export default function Header({}) {
  

 
  return (
    <header>
      <h1>Accio</h1>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/user-prompt">FileShare</Link></li>
          <li><Link to="#about">About</Link></li>
          <li><Link to="#services">Services</Link></li>
          <li><Link to="#contact">Contact</Link></li>
        </ul>
        
      </nav>
    </header>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ messageCount }) {
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
        <div className="messages">
          <span>Messages ({messageCount || 0})</span>
          {/* Dropdown can be added here */}
        </div>
      </nav>
    </header>
  );
}

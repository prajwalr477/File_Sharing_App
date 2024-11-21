import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import io from 'socket.io-client';
import logo from '../assets/logo.jpg';


export default function Header() {
  return (
    <header>
      <div className="nav-bar">
        <div className="logo">
        <img src={logo} alt="logo" />
          <h1>PESync</h1>
        </div>
        <div className="links">
          <Link to="/Home">Home</Link>
          <Link to="/About">About Us</Link>
          <Link to="/Contact">Contact</Link>
          <Link to="/FAQ">FAQ</Link>
        </div>
      </div>
    </header>
  );
}

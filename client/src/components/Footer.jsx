import React from 'react';
import './footer.css';
import '../pages/Privacy'

export default function Footer() {
  return (
    <footer>
      <p>&copy; PESync 2024. All Rights Reserved.</p>
      <nav>
        <a href="/About">About</a>
        <a href="/Contact">Contact</a>
        <a href="/Privacy">Privacy Policy</a>
      </nav>
    </footer>
  );
}

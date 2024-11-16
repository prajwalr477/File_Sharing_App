import React, { useState } from 'react';  // Import useState from React
import { useNavigate, Link } from 'react-router-dom';  // Import Link from react-router-dom
import Header from '../components/Header';
import Modal from '../components/Modal';

export default function HomePage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility

  // Handle logout button click
  const handleLogoutClick = () => {
    setIsModalOpen(true); // Show the modal on logout click
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Confirm logout and redirect to login
  const handleLogoutConfirm = () => {
    localStorage.removeItem('token');  // Remove token from localStorage
    setIsModalOpen(false);  // Close the modal
    navigate('/');  // Redirect to login page
  };

  return (
    <div>
      <Header />
      <main>
        <section id="home">
          <h2>Welcome to Accio</h2>
          <p>This is the home page of our sample application.</p>
          
          {/* FileShare link */}
          <Link to="/file-share">
            <button>Go to FileShare</button>
          </Link>
          
          {/* Log out button */}
          <button onClick={handleLogoutClick}>Log Out</button>
        </section>
        
        <section id="about">
          <h2>About Us</h2>
          <p>Learn more about our services and mission.</p>
        </section>
        
        <section id="services">
          <h2>Our Services</h2>
          <p>We offer a range of services to meet your needs.</p>
        </section>
        
        <section id="contact">
          <h2>Contact Us</h2>
          <p>Feel free to reach out for more information!</p>
        </section>
      </main>

      {/* Modal for logout confirmation */}
      <Modal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}

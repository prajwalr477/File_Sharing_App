import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function HomePage() {
    return (
        <div>
            <Header />
            <main>
                <section id="home">
                    <h2>Welcome to Accio</h2>
                    <p>This is the home page of our sample application.</p>
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
                
                {/* Replace button with Link */}
                <section>
                    <h2><Link to="/file-share">Go to FileShare</Link></h2>
                </section>
            </main>
        </div>
    );
}

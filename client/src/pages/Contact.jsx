import React from 'react';
import Header from '../components/Header';
import './Contact.css';
import PersonContainer from './PersonContainer'; // Importing the new PersonContainer component

export default function Contact() {
    return (
        <div>
            <Header />
            <main>
                <section id="contact" className="contact">
                    <h1>Contact</h1>
                </section>

                <section className="content">
                    <p>If you have any questions, requests, or other feedback, we would love to hear it! We are a small team consisting of three people. We work on PESync in our spare time. This means we might not always respond right away.</p>
                    <p>We've gotten rid of our contact form as it didn't work very well. Our main communication will be via mail (see link below).</p>
                </section>

                {/* Use the PersonContainer component here */}
                <PersonContainer />
            </main>
        </div>
    );
}

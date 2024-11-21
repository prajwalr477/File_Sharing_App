import React from 'react';
import Header from '../components/Header';
import './AboutUs.css';
import PersonContainer from './PersonContainer'; // Importing the new PersonContainer component

export default function Privacy() {
    return (
        <div>
            <Header />
            <main>
                <section id="contact" className="contact">
                    <h1></h1>
                </section>
                <section className="content" style={{ fontWeight: 10 }}>
                <h1 >Privacy Policy</h1>
                    <p style={{ marginBottom: '40px' }}>We don’t store your data, period</p>
                    <p style={{ marginBottom: '40px' }}>We only keep track of the total number of daily users, and count daily statistics about the transfers.</p>
                    <p style={{ marginBottom: '40px' }}>This means we can see the total number of successful and failed file transfers, and to see how often our fallback was used. This way we can quickly detect bugs or issues, and act fast to fix them.</p>
                    <p style={{ marginBottom: '40px' }}>PESync is fully GDPR compliant (General Data Protection Regulation), as your data is never stored anywhere. Privacy and security are some of the main goals of this platform.</p>
                    <p style={{ marginBottom: '40px' }}>If you still have any concerns about privacy, don't hesitate to send us a message.</p>
                    <p>Even though we do our utmost best to make our platform as secure as possible, your security is still your own responsibility. The share links are meant to be private, so use them as such.</p>
                </section>

            </main>
        </div>
    );
}

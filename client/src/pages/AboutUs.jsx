import React from 'react';
import Header from '../components/Header';
import './AboutUs.css';
import PersonContainer from './PersonContainer'; // Importing the new PersonContainer component

export default function About() {
    return (
        <div>
            <Header />
            <main>
                <section id="contact" className="contact">
                    <h1>Nice to meet you</h1>
                    <p>We're Pawan, Prajwal and Sharavana students of PESU. Our project is to create a react app.Thats when we came across this idea of creating a website for file-sharing as the name suggests.</p>
                    <p>Creating this application gave immense pleasure as we were able to use our potetial to the fullest & understand our strengths & weaknesses.</p>
                </section>
                {/* Use the PersonContainer component here */}
                <PersonContainer />
            </main>
        </div>
    );
}

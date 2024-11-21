import React from 'react';
import './PersonContainer.css';
import face from '../assets/face.jpg';  // Import the face image

export default function PersonContainer() {
    return (
        <section className="person-container">
            <div className="person1">
                <img src={face} alt="John Doe" /> {/* Use the imported face image */}
                <div className="explain">
                    <p className="name">John Doe</p>
                    <p className="role">Developer</p>
                    <p className="email">
                        <a href="mailto:johndoes@gmail.com">johndoes@gmail.com</a>
                    </p>
                </div>
            </div>

            <div className="person1">
                <img src={face} alt="John Doe" /> {/* Use the imported face image */}
                <div className="explain">
                    <p className="name">John Doe</p>
                    <p className="role">Developer</p>
                    <p className="email">
                        <a href="mailto:johndoes@gmail.com">johndoes@gmail.com</a>
                    </p>
                </div>
            </div>

            <div className="person1">
                <img src={face} alt="John Doe" /> {/* Use the imported face image */}
                <div className="explain">
                    <p className="name">John Doe</p>
                    <p className="role">Developer</p>
                    <p className="email">
                        <a href="mailto:johndoes@gmail.com">johndoes@gmail.com</a>
                    </p>
                </div>
            </div>
        </section>
    );
}

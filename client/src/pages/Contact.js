import React from "react";
import Header from "../components/Header";

export default function Contact() {
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
          <div className="nav-bar">
            <div className="logo">
              <img src="logo.jpg" alt="logo" />
              <h1>PESync</h1>
            </div>
            <div className="links">
              <a href="smtg.html">Home</a>
              <a href="about.html">About Us</a>
              <a href="blog.html">Blog</a>
              <a href="faq.html">FAQ</a>
            </div>
          </div>
          <section className="contact">
            <h1>Contact</h1>
          </section>
          <section className="content">
            <p>
              If you have any questions, requests, or other feedback, we would
              love to hear it! We are a small team consisting of three people.
              We work on PESync in our spare time. This means we might not
              always respond right away.
            </p>
            <p>
              We've gotten rid of our contact form as it didn't work very well.
              Our main communication will be via mail (see link below).
            </p>
          </section>
          <section className="person-container">
            <div className="person1">
              <img src="face.jpg" alt="face" />
              <div className="explain">
                <p className="name">John Doe</p>
                <p className="role">Developer</p>
                <p className="email">
                  <a href="mailto:johndoes@gmail.com">johndoes@gmail.com</a>
                </p>
              </div>
            </div>
            <div className="person1">
              <img src="face.jpg" alt="face" />
              <div className="explain">
                <p className="name">John Doe</p>
                <p className="role">Developer</p>
                <p className="email">
                  <a href="mailto:johndoes@gmail.com">johndoes@gmail.com</a>
                </p>
              </div>
            </div>
            <div className="person1">
              <img src="face.jpg" alt="face" />
              <div className="explain">
                <p className="name">John Doe</p>
                <p className="role">Developer</p>
                <p className="email">
                  <a href="mailto:johndoes@gmail.com">johndoes@gmail.com</a>
                </p>
              </div>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

import React from "react";
import Header from "../components/Header";

export default function AboutUs() {
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
          <div className="nav-bar">
            <div className="logo">
              <img src="logo.jpg" alt="logo" />
              <h1>PESync</h1>
            </div>
            <div className="links">
              <a href="smtg.html">Home</a>
              <a href="blog.html">Blog</a>
              <a href="contact.html">Contact</a>
              <a href="faq.html">FAQ</a>
            </div>
          </div>
          <section
            className="contact"
            style={{ marginTop: 90, lineHeight: "0.8" }}
          >
            <h1>Nice to meet you</h1>
          </section>
          <section className="content">
            <p>
              We're Pawan, Prajwal and Sharavana students of PESU. Our project
              is to create a react app. That's when we came across this idea of
              creating a website for file-sharing as the name suggests.
            </p>
            <p>
              Creating this application gave immense pleasure as we were able to
              use our potential to the fullest &amp; understand our strengths
              &amp; weaknesses.
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

        <section id="services">
          <h2>Our Services</h2>
          <p>We offer a range of services to meet your needs.</p>
        </section>

        <section id="contact">
          <h2>Contact Us</h2>
          <p>Feel free to reach out for more information!</p>
        </section>
      </main>
    </div>
  );
}

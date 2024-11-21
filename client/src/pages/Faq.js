import React from "react";
import Header from "../components/Header";

function Faq() {
  return (
    <div>
        <Header />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>FAQ</title>
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link rel="stylesheet" href="blog.css" />
      <div className="nav-bar">
        <div className="logo">
          <img src="logo.jpg" alt="logo" />
          <h1>PESync</h1>
        </div>
        <div className="links">
          <a href="smtg.html">Home</a>
          <a href="about.html">About Us</a>
          <a href="blog.html">Blog</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
      <section className="contact">
        <h1>FAQ</h1>
      </section>
      <section className="content">
        <p>
          A knowledge base with the most common issues and questions about
          transferring your files with PESync. This page also features some tips
          and tricks on how to optimize your file transfer(s).
        </p>
        <p>
          For connection issues you can also check out our server status to see
          if everything is up and running.
        </p>
      </section>
      <section className="faq">
        <article className="faq-item">
          <h2>Why peer to peer?</h2>
          <p>
            Peer-to-peer communication means the communication flows directly
            between two devices rather than via an intermediate server. This
            means your data will not be stored somewhere else before it reaches
            its destination. ToffeeShare achieves this via WebRTC, a relatively
            new communication API used in modern browsers. Under the hood of
            WebRTC is a protocol called STUN.
          </p>
          <p>
            What might be interesting to know is that ToffeeShare initially
            started out as a native application, running our own proprietary
            version of the STUN protocol. When we discovered this had also
            become possible within the browser, we decided to focus on that
            first. We might still launch the native version in the near future,
            but this is currently not a priority. Feel free to contact us about
            it, so we can give you a demo.
          </p>
        </article>
        <article className="faq-item">
          <h2>Why is it slower than my maximum network speed?</h2>
          <p>
            Expect maximum transfer speeds of between 10 and 100 Mbit per
            second. Keep in mind that you're doing both the 'uploading' and
            downloading at the same time, so this also saves a lot of time.
          </p>
        </article>
        <article className="faq-item">
          <h2>How can I send an entire folder?</h2>
          <p>
            You cannot directly send folders with ToffeeShare. This is because
            we'll have to create a zip file or another sort of archive in
            transit, which will make the peer-to-peer transfer much slower.
          </p>
        </article>
        <article className="faq-item">
          <h2>The progress bar is stuck at 0%</h2>
          <p>
            ToffeeShare has been tested on many different networks, but we can't
            guarantee that it will work everywhere. If the progress bar is stuck
            at 0%, it usually means a connection cannot be made. When sharing
            from a mobile phone, you could try to switch from a mobile network
            to WiFi. If it feels like something is not working as it should,
            please send us a message.
          </p>
        </article>
        <article className="faq-item">
          <h2>It says 100% but I don't see the file(s)</h2>
          <p>
            To be able to download large files, we start downloading straight to
            your computer using the built-in browser file downloader. This
            process, however, sporadically fails to kick in, meaning the file is
            downloading, but not being saved. What usually helps is to restart
            the transfer. You should see a message appear as if you're
            downloading a general file from a website. If this keeps happening,
            please contact us, as it means something else might be wrong.
          </p>
        </article>
      </section>
    </div>
  );
}

export default Faq;

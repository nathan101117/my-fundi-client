import React from "react";
import "../styles/About.css"; // Import CSS file

function About() {
  return (
    <div className="about-container">
      <div className="hero">
        <h1>About My Fundi</h1>
        <p>Your trusted platform connecting skilled artisans with clients.</p>
      </div>

      {/* About Us Content */}
      <section className="about-content">
        <h2>Who We Are</h2>
        <p>
          My Fundi is an innovative job-matching platform designed to bridge the gap between
          skilled artisans and clients looking for reliable services. Whether you need a 
          plumber, electrician, carpenter, or painter, My Fundi ensures quality connections.
        </p>

        <h2>Our Mission</h2>
        <p>
          We aim to empower artisans by providing them with steady work opportunities while 
          offering clients an easy, secure way to hire experienced professionals.
        </p>

        <h2>Our Vision</h2>
        <p>
          To be the leading platform for skilled workers, transforming how clients find and hire 
          artisans across Africa and beyond.
        </p>
      </section>

      {/* Contact CTA */}
      <section className="about-cta">
        <h3>Want to learn more?</h3>
        <button className="btn primary-btn">Contact Us</button>
      </section>
    </div>
  );
}

export default About;

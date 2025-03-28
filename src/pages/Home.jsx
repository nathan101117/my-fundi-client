import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css"; // Import CSS file

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay">
          <h1>Find Skilled Artisans, Anytime, Anywhere!</h1>
          <p>Connecting trusted professionals with clients in need of reliable services.</p>
          <div className="hero-buttons">
            <button className="btn primary-btn" onClick={() => navigate("/register")}>
              👷 Join as an Artisan
            </button>
            <button className="btn secondary-btn" onClick={() => navigate("/register")}>
              🏠 Hire an Artisan
            </button>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="categories">
        <h2>Explore Top Services</h2>
        <div className="category-grid">
          <div className="category-card">🔧 Plumbing</div>
          <div className="category-card">⚡ Electrical</div>
          <div className="category-card">🎨 Painting</div>
          <div className="category-card">🛠 Carpentry</div>
          <div className="category-card">🏠 Roofing</div>
          <div className="category-card">🚪 Welding</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">✔ Sign up as an Artisan or Client.</div>
          <div className="step">✔ Clients post job requests with budget & details.</div>
          <div className="step">✔ Artisans apply for jobs and get hired.</div>
          <div className="step">✔ Clients review, hire, and rate artisans.</div>
        </div>
      </section>

      {/* Why Choose Us? */}
      <section className="why-us">
        <h2>Why Choose My Fundi?</h2>
        <div className="benefits">
          <div className="benefit">✅ Verified Artisans</div>
          <div className="benefit">🔒 Secure Transactions</div>
          <div className="benefit">🌟 24/7 Customer Support</div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>Success Stories</h2>
        <div className="testimonial-grid">
          <div className="testimonial">
            <p>"My Fundi helped me find a reliable plumber in just 5 minutes!"</p>
            <footer>- Anne, Homeowner</footer>
          </div>
          <div className="testimonial">
            <p>"I got my first electrical job through My Fundi and now I’m fully booked!"</p>
            <footer>- David, Artisan</footer>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta">
        <h2>Ready to Get Started?</h2>
        <button className="btn primary-btn" onClick={() => navigate("/register")}>
          Join Now
        </button>
      </section>
    </div>
  );
}

export default Home;

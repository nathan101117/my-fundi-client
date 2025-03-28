import React from "react";
import "../styles/WhyUs.css"; // Import CSS file

function WhyUs() {
  return (
    <div className="whyus-container">
      <div className="hero">
        <h1>Why Choose My Fundi?</h1>
        <p>Reliable, Secure, and Easy-to-Use Artisan Hiring Platform.</p>
      </div>

      {/* Key Benefits */}
      <section className="whyus-content">
        <h2>Why We Stand Out</h2>
        <div className="benefits-grid">
          <div className="benefit-card">✅ Verified Artisans - Background checked & reliable</div>
          <div className="benefit-card">🔒 Secure Payments - Fair transactions & no scams</div>
          <div className="benefit-card">🌟 Customer Support - 24/7 help for smooth experiences</div>
          <div className="benefit-card">📍 Local Services - Find artisans near you instantly</div>
          <div className="benefit-card">📈 More Work for Artisans - Get hired faster</div>
          <div className="benefit-card">💰 Fair Pricing - No overcharging, no underpaying</div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="whyus-cta">
        <h3>Start hiring skilled artisans today!</h3>
        <button className="btn primary-btn">Join Now</button>
      </section>
    </div>
  );
}

export default WhyUs;

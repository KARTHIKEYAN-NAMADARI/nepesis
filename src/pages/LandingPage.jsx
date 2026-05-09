import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <h2>Your Personal Health Ecosystem</h2>
          <p>
            Connect your wearable devices, log meals with AI nutrition recognition,
            and join social challenges to reach your fitness goals.
          </p>
          <Link to="/auth" className="cta-button">Get Started Now</Link>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <h3>Smartwatch Integration</h3>
          <p>Sync activity, workouts, and hydration seamlessly from your connected wearable devices to monitor your progress in real-time.</p>
        </div>
        <div className="feature-card">
          <h3>AI Food Recognition</h3>
          <p>Simply snap a photo of your meal. Our AI instantly recognizes the food and estimates calories and macros for effortless logging.</p>
        </div>
        <div className="feature-card">
          <h3>Social Challenges</h3>
          <p>Compete with friends, join group challenges, and share fleeting meal snaps to stay motivated and accountable on your journey.</p>
        </div>
      </section>

      <section className="demo-preview">
        <div className="preview-panel">
          <h3>Health Score Preview</h3>
          <div className="score-circle">
            <span className="score-value">85</span>
            <span className="score-label">Excellent</span>
          </div>
          <div className="energy-balance">
            <h4>Energy Balance</h4>
            <p className="positive-status">Optimal Caloric Deficit for Weight Loss</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

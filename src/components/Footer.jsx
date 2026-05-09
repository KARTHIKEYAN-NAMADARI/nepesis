import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Smart Health. All rights reserved.</p>
        <p className="project-summary">Demo website for a connected health and fitness platform.</p>
      </div>
    </footer>
  );
};

export default Footer;

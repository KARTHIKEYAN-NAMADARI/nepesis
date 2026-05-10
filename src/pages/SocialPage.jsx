import React from 'react';
import SocialGroups from '../components/SocialGroups';
import './SocialPage.css';

const SocialPage = () => {
  return (
    <div className="social-page">
      <header className="page-header">
        <h2>Community & Friends</h2>
        <p>Stay motivated by connecting with others and joining challenges.</p>
      </header>

      <div className="social-content">
        <SocialGroups />
      </div>
    </div>
  );
};

export default SocialPage;

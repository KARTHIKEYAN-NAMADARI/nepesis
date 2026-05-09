import React from 'react';
import HealthAnalytics from '../components/HealthAnalytics';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  return (
    <div className="analytics-page">
      <header className="page-header">
        <h2>Health Analytics</h2>
        <p>Deep dive into your health trends and AI-driven insights.</p>
      </header>

      <div className="analytics-content">
        <HealthAnalytics />
      </div>
    </div>
  );
};

export default AnalyticsPage;

import React from 'react';
import './HealthAnalytics.css';

const MOCK_WEEKLY_DATA = [
  { day: 'Mon', calories: 2100, activity: 45 },
  { day: 'Tue', calories: 1950, activity: 60 },
  { day: 'Wed', calories: 2300, activity: 30 },
  { day: 'Thu', calories: 2000, activity: 50 },
  { day: 'Fri', calories: 1850, activity: 45 },
  { day: 'Sat', calories: 2500, activity: 90 },
  { day: 'Sun', calories: 2200, activity: 20 }
];

const HealthAnalytics = () => {
  const healthScore = 82;
  const scoreChange = '+5';

  const factors = [
    { name: 'Activity', value: 85, color: '#3498db' },
    { name: 'Energy Balance', value: 75, color: '#e74c3c' },
    { name: 'Consistency', value: 90, color: '#2ecc71' }
  ];

  const maxCalories = Math.max(...MOCK_WEEKLY_DATA.map(d => d.calories));
  const maxActivity = Math.max(...MOCK_WEEKLY_DATA.map(d => d.activity));

  return (
    <div className="health-analytics">
      <div className="analytics-grid">

        {/* Score Overview */}
        <div className="analytics-card score-overview">
          <h3>Health Score</h3>
          <div className="circular-score">
            <div className="inner-circle">
              <span className="score">{healthScore}</span>
              <span className="change positive">{scoreChange} pts</span>
            </div>
          </div>
          <p className="score-desc">Your overall health score is in the top 20% of users this week!</p>

          <div className="score-factors">
            <h4>Score Breakdown</h4>
            {factors.map(factor => (
              <div key={factor.name} className="factor-item">
                <div className="factor-header">
                  <span>{factor.name}</span>
                  <span>{factor.value}%</span>
                </div>
                <div className="factor-bar-bg">
                  <div
                    className="factor-bar-fill"
                    style={{ width: `${factor.value}%`, backgroundColor: factor.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Charts */}
        <div className="analytics-card charts-section">
          <h3>Weekly Trends</h3>

          <div className="chart-container">
            <h4>Activity (Minutes)</h4>
            <div className="bar-chart">
              {MOCK_WEEKLY_DATA.map(day => (
                <div key={day.day} className="bar-column">
                  <div
                    className="bar activity-bar"
                    style={{ height: `${(day.activity / maxActivity) * 100}%` }}
                  >
                    <span className="bar-tooltip">{day.activity}m</span>
                  </div>
                  <span className="day-label">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-container">
            <h4>Calories Consumed</h4>
            <div className="bar-chart">
              {MOCK_WEEKLY_DATA.map(day => (
                <div key={day.day} className="bar-column">
                  <div
                    className="bar calorie-bar"
                    style={{ height: `${(day.calories / maxCalories) * 100}%` }}
                  >
                    <span className="bar-tooltip">{day.calories}</span>
                  </div>
                  <span className="day-label">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="analytics-card insights-section">
          <h3>AI Insights</h3>
          <div className="insight-list">
            <div className="insight-item positive">
              <span className="icon">🎯</span>
              <div className="insight-content">
                <h4>Goal Achievement</h4>
                <p>You hit your 10k step goal 5 out of 7 days this week. Great consistency!</p>
              </div>
            </div>
            <div className="insight-item warning">
              <span className="icon">💧</span>
              <div className="insight-content">
                <h4>Hydration Warning</h4>
                <p>Your water intake drops by 30% on weekends. Try keeping a bottle nearby.</p>
              </div>
            </div>
            <div className="insight-item neutral">
              <span className="icon">🔥</span>
              <div className="insight-content">
                <h4>Calorie Trend</h4>
                <p>You tend to consume 400 more calories on workout days, which perfectly matches your energy expenditure.</p>
              </div>
            </div>
          </div>

          <div className="period-summary">
            <h4>7-Day Summary</h4>
            <div className="summary-grid">
              <div className="summary-stat">
                <span className="value">2,128</span>
                <span className="label">Avg kcal/day</span>
              </div>
              <div className="summary-stat">
                <span className="value">48m</span>
                <span className="label">Avg active/day</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HealthAnalytics;

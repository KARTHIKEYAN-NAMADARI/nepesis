import React, { useState, useContext, useMemo, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import SmartwatchSync from '../components/SmartwatchSync';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  const [workouts, setWorkouts] = useState([]);
  const [hydrationLogs, setHydrationLogs] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('smart_health_token');
            const response = await fetch('/api/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setWorkouts(data.workouts.map(w => ({ ...w, time: new Date(w.time) })));
                setHydrationLogs(data.hydrationLogs.map(h => ({ ...h, time: new Date(h.time) })));
                setMeals(data.meals.map(m => ({ ...m, time: new Date(m.time) })));
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };
    fetchDashboardData();
  }, []);

  // Base metrics
  const consistencyScore = workouts.length > 0 ? 85 : 0; // % - 0 if no workouts
  const dailyHydrationGoal = 2500; // ml

  const handleSync = (newWorkout, newHydration) => {
    setWorkouts(prev => [newWorkout, ...prev]);
    setHydrationLogs(prev => [newHydration, ...prev]);
  };

  // Calculations
  const caloriesConsumed = useMemo(() => {
      return meals.reduce((sum, meal) => sum + meal.calories, 0);
  }, [meals]);

  const totalCaloriesBurned = useMemo(() => {
    return workouts.reduce((sum, workout) => sum + workout.calories, 0);
  }, [workouts]);

  const totalActiveMinutes = useMemo(() => {
    return workouts.reduce((sum, workout) => sum + workout.duration, 0);
  }, [workouts]);

  const totalHydration = useMemo(() => {
    return hydrationLogs.reduce((sum, log) => sum + log.amount, 0);
  }, [hydrationLogs]);

  const hydrationPercentage = Math.min(100, Math.round((totalHydration / dailyHydrationGoal) * 100));

  const energyBalance = caloriesConsumed - totalCaloriesBurned;

  const healthScore = useMemo(() => {
    if (workouts.length === 0 && hydrationLogs.length === 0 && meals.length === 0) {
        return 0; // Completely new account
    }

    let score = 50;
    score += Math.min(20, (totalActiveMinutes / 60) * 20);
    if (energyBalance < 0 && energyBalance > -800) score += 15;
    else if (energyBalance >= 0 && energyBalance < 300) score += 10;
    else score += 5;
    score += (consistencyScore / 100) * 10;
    score += (hydrationPercentage / 100) * 5;
    return Math.min(100, Math.round(score));
  }, [totalActiveMinutes, energyBalance, consistencyScore, hydrationPercentage, workouts.length, hydrationLogs.length, meals.length]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h2>Welcome back, {user?.name}!</h2>
        <div className="live-summary">
          Your health score is {healthScore}. {healthScore === 0 ? "Let's get started by syncing a device or logging a meal!" : "Keep up the good work!"}
        </div>
      </header>

      <div className="dashboard-content">
        <div className="main-column">
          <SmartwatchSync onSync={handleSync} />

          <div className="metrics-grid">
            <div className="metric-card score-card">
              <h3>Health Score</h3>
              <div className="score-display">{healthScore}</div>
            </div>

            <div className="metric-card">
              <h3>Energy Balance</h3>
              <div className="metric-value">{energyBalance > 0 ? '+' : ''}{energyBalance} kcal</div>
              <p className={`status-text ${energyBalance <= 0 && (workouts.length > 0 || meals.length > 0) ? 'positive' : 'warning'}`}>
                {energyBalance === 0 ? 'Balanced' : energyBalance < 0 ? 'Caloric Deficit' : 'Caloric Surplus'}
              </p>
            </div>

            <div className="metric-card">
              <h3>Calories</h3>
              <div className="split-metric">
                <div>
                  <span className="label">Consumed</span>
                  <span className="value">{caloriesConsumed}</span>
                </div>
                <div>
                  <span className="label">Burned</span>
                  <span className="value">{totalCaloriesBurned}</span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <h3>Activity</h3>
              <div className="metric-value">{totalActiveMinutes} mins</div>
              <p className="status-text">Active today</p>
            </div>

            <div className="metric-card">
              <h3>Hydration</h3>
              <div className="metric-value">{hydrationPercentage}%</div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{width: `${hydrationPercentage}%`}}
                ></div>
              </div>
              <p className="status-text">{totalHydration}ml / {dailyHydrationGoal}ml</p>
            </div>

            <div className="metric-card">
              <h3>Consistency</h3>
              <div className="metric-value">{consistencyScore}%</div>
              <p className="status-text">Weekly goal completion</p>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="log-section">
            <h3>Recent Workouts</h3>
            <div className="log-list">
              {workouts.length === 0 ? (
                <p className="empty-state">No workouts synced yet.</p>
              ) : (
                workouts.map(w => (
                  <div key={w.id} className="log-item">
                    <div className="log-icon workout">🏃</div>
                    <div className="log-details">
                      <h4>{w.type}</h4>
                      <p>{w.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <div className="log-stats">
                      <span>{w.duration} min</span>
                      <span className="calories">{w.calories} kcal</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="log-section">
            <h3>Hydration Log</h3>
            <div className="log-list">
              {hydrationLogs.length === 0 ? (
                <p className="empty-state">No water logged yet.</p>
              ) : (
                hydrationLogs.map(h => (
                  <div key={h.id} className="log-item">
                    <div className="log-icon water">💧</div>
                    <div className="log-details">
                      <h4>Water</h4>
                      <p>{h.time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <div className="log-stats">
                      <span>{h.amount} ml</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

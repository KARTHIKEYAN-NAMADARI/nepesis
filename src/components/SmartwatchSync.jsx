import React, { useState, useEffect } from 'react';
import './SmartwatchSync.css';

const SmartwatchSync = ({ onSync }) => {
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const [autoSync, setAutoSync] = useState(false);

  const performSync = async () => {
    setSyncing(true);

    // Generate mock workout
    const workoutTypes = ['Running', 'Cycling', 'Swimming', 'HIIT', 'Yoga'];
    const randomWorkout = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
    const randomDuration = Math.floor(Math.random() * 45) + 15; // 15-60 mins
    const randomCalories = Math.floor(randomDuration * (Math.random() * 5 + 5)); // 75-600 kcal

    const newWorkout = {
      id: Date.now().toString(),
      type: randomWorkout,
      duration: randomDuration,
      calories: randomCalories,
      time: new Date()
    };

    // Generate mock hydration
    const randomWater = Math.floor(Math.random() * 3 + 1) * 250; // 250, 500, 750 ml
    const newHydration = {
      id: Date.now().toString() + '_h',
      amount: randomWater,
      time: new Date()
    };

    try {
        const token = localStorage.getItem('smart_health_token');
        const response = await fetch('/api/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ workout: newWorkout, hydration: newHydration })
        });

        if (response.ok) {
            setLastSync(new Date());
            if (onSync) {
                onSync(newWorkout, newHydration);
            }
        }
    } catch (error) {
        console.error('Sync failed:', error);
    } finally {
        setSyncing(false);
    }
  };

  useEffect(() => {
    let interval;
    if (autoSync) {
      interval = setInterval(() => {
        performSync();
      }, 5 * 60 * 1000); // Sync every 5 minutes
    }
    return () => clearInterval(interval);
  }, [autoSync]);

  return (
    <div className="smartwatch-sync">
      <div className="sync-header">
        <h3>Device Sync</h3>
        <div className="auto-sync-toggle">
          <label>
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
            />
            Auto-sync (5m)
          </label>
        </div>
      </div>

      <div className="sync-status">
        <p>Last synced: {lastSync.toLocaleTimeString()}</p>
        <button
          onClick={performSync}
          disabled={syncing}
          className={`sync-btn ${syncing ? 'syncing' : ''}`}
        >
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
    </div>
  );
};

export default SmartwatchSync;

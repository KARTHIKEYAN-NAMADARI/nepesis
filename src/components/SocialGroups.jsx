import React, { useState } from 'react';
import './SocialGroups.css';

const MOCK_FRIENDS = [
  { id: 1, name: 'Alex Johnson', score: 92, avatar: 'A', status: 'Online' },
  { id: 2, name: 'Sam Smith', score: 85, avatar: 'S', status: 'Just finished a run' },
  { id: 3, name: 'Jordan Lee', score: 78, avatar: 'J', status: 'Offline' }
];

const MOCK_GROUPS = [
  { id: 1, name: '10K Steps Daily', members: 124, progress: 85, desc: 'Hit 10,000 steps every day this month.' },
  { id: 2, name: 'Weekend Warriors', members: 56, progress: 40, desc: 'Most active minutes on weekends.' }
];

const INITIAL_SNAPS = [
  { id: 1, sender: 'Alex Johnson', time: '10m ago', title: 'Post-workout Smoothie', desc: 'Protein + Berries!', viewed: false },
  { id: 2, sender: 'Sam Smith', time: '1h ago', title: 'Healthy Lunch', desc: 'Grilled chicken salad keeping me going.', viewed: false }
];

const SocialGroups = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [snaps, setSnaps] = useState(INITIAL_SNAPS);

  const handleViewSnap = (snapId) => {
    setSnaps(snaps.map(snap =>
      snap.id === snapId ? { ...snap, viewed: true } : snap
    ));
  };

  const activeSnaps = snaps.filter(s => !s.viewed);

  return (
    <div className="social-component">
      <div className="social-tabs">
        <button
          className={activeTab === 'friends' ? 'active' : ''}
          onClick={() => setActiveTab('friends')}
        >
          Friends
        </button>
        <button
          className={activeTab === 'groups' ? 'active' : ''}
          onClick={() => setActiveTab('groups')}
        >
          Groups
        </button>
        <button
          className={activeTab === 'snaps' ? 'active' : ''}
          onClick={() => setActiveTab('snaps')}
        >
          Meal Snaps {activeSnaps.length > 0 && <span className="badge">{activeSnaps.length}</span>}
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'friends' && (
          <div className="friends-list">
            <div className="list-header">
              <h3>Leaderboard</h3>
              <button className="add-btn">+ Add Friend</button>
            </div>
            {MOCK_FRIENDS.sort((a, b) => b.score - a.score).map((friend, index) => (
              <div key={friend.id} className="friend-item">
                <span className="rank">#{index + 1}</span>
                <div className="friend-avatar">{friend.avatar}</div>
                <div className="friend-info">
                  <h4>{friend.name}</h4>
                  <p className="status">{friend.status}</p>
                </div>
                <div className="friend-score">
                  <span className="score-val">{friend.score}</span>
                  <span className="score-lbl">Score</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="groups-list">
            <div className="list-header">
              <h3>Active Challenges</h3>
              <button className="add-btn">+ Create Group</button>
            </div>
            {MOCK_GROUPS.map(group => (
              <div key={group.id} className="group-card">
                <div className="group-header">
                  <h4>{group.name}</h4>
                  <span className="members">{group.members} members</span>
                </div>
                <p className="group-desc">{group.desc}</p>
                <div className="group-progress">
                  <div className="progress-labels">
                    <span>Group Progress</span>
                    <span>{group.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${group.progress}%` }}></div>
                  </div>
                </div>
                <button className="view-details-btn">View Details</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'snaps' && (
          <div className="snaps-list">
            <div className="list-header">
              <h3>Recent Meal Snaps</h3>
              <button className="add-btn">📸 Send Snap</button>
            </div>
            <p className="snaps-info">Snaps disappear after you view them!</p>

            {activeSnaps.length === 0 ? (
              <div className="empty-state">
                <p>You're all caught up! No new meal snaps.</p>
              </div>
            ) : (
              <div className="snap-grid">
                {activeSnaps.map(snap => (
                  <div
                    key={snap.id}
                    className="snap-card"
                    onClick={() => handleViewSnap(snap.id)}
                  >
                    <div className="snap-placeholder-img">
                      <span>📸 Tap to view</span>
                    </div>
                    <div className="snap-info">
                      <h4>{snap.sender}</h4>
                      <p className="snap-time">{snap.time}</p>
                    </div>
                    <div className="snap-hidden-content">
                      <h5>{snap.title}</h5>
                      <p>{snap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialGroups;

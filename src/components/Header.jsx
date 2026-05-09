import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="logo-container">
        <h1>Smart Health</h1>
      </div>

      {user ? (
        <>
          <nav className="main-nav">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
            <NavLink to="/food-ai" className={({ isActive }) => isActive ? 'active' : ''}>Food AI</NavLink>
            <NavLink to="/social" className={({ isActive }) => isActive ? 'active' : ''}>Social</NavLink>
            <NavLink to="/analytics" className={({ isActive }) => isActive ? 'active' : ''}>Analytics</NavLink>
          </nav>
          <div className="user-controls">
            <div className="user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="user-name">{user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </>
      ) : (
        <nav className="public-nav">
          <NavLink to="/auth" className="login-btn">Login / Get Started</NavLink>
        </nav>
      )}
    </header>
  );
};

export default Header;

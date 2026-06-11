import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome, FaEnvelope, FaUsers, FaCompass, FaUser,
  FaBell, FaPlus, FaSignOutAlt, FaUserPlus, FaHeart, FaUserFriends,
  FaCog
} from 'react-icons/fa';
import PingUpLogo from './PingUpLogo';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, unreadNotificationsCount, unreadMessagesCount, openSettings } = useApp();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/feed', icon: <FaHome />, label: 'Feed' },
    { path: '/messages', icon: <FaEnvelope />, label: 'Messages', badge: unreadMessagesCount },
    { path: '/connections', icon: <FaUserFriends />, label: 'Connections' },
    { path: '/discover', icon: <FaCompass />, label: 'Discover' },
    { path: '/notifications', icon: <FaBell />, label: 'Notifications', badge: unreadNotificationsCount },
    { path: '/following', icon: <FaHeart />, label: 'Following' },
    { path: '/follow-requests', icon: <FaUserPlus />, label: 'Requests' },
    { path: `/profile/${currentUser.username}`, icon: <FaUser />, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo" onClick={() => navigate('/feed')} style={{ cursor: 'pointer' }}>
        <PingUpLogo size={26} color="var(--primary)" />
        <span>pingup</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span style={{ position: 'relative' }}>
              {item.icon}
              {item.badge > 0 && (
                <span className="sidebar-badge">{item.badge > 9 ? '9+' : item.badge}</span>
              )}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Create Post Button */}
      <Link to="/create-post" className="sidebar-create-btn">
        <FaPlus size={14} />
        <span>Create Post</span>
      </Link>

      {/* User Profile */}
      <div className="sidebar-user">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="sidebar-user-avatar"
          onClick={() => navigate(`/profile/${currentUser.username}`)}
          style={{ cursor: 'pointer' }}
        />
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{currentUser.name}</div>
          <div className="sidebar-user-handle">@{currentUser.username}</div>
        </div>
        <button className="sidebar-logout-btn" onClick={openSettings} title="Settings" style={{ marginRight: '8px' }}>
          <FaCog size={15} />
        </button>
        <button className="sidebar-logout-btn" onClick={handleLogout} title="Logout">
          <FaSignOutAlt size={15} />
        </button>
      </div>
    </aside>
  );
}

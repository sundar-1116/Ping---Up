import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { VerifiedBadge } from '../components/SharedComponents';
import { useApp } from '../context/AppContext';

export default function ConnectionsPage() {
  const navigate = useNavigate();
  const { users, toggleFollow, isFollowing, following, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filtered = users.filter(u => {
    if (u.id === currentUser?.id) return false;
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'following') return matchesSearch && isFollowing(u.id);
    if (activeTab === 'followers') return matchesSearch; // mock: all are "followers"
    return matchesSearch;
  });

  return (
    <div className="main-content">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Connections</h1>
          <p className="page-subtitle">People you know and follow</p>
        </div>

        {/* Search */}
        <div className="search-bar-wrap">
          <FaSearch className="search-bar-icon" />
          <input
            type="text"
            className="search-bar-input"
            placeholder="Search connections..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="tab-row">
          {['all', 'following', 'followers'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'following' && <span className="tab-count">{following.length}</span>}
            </button>
          ))}
        </div>

        {/* User list */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-text">No users found</div>
            <div className="empty-state-sub">Try a different search term</div>
          </div>
        ) : (
          <div className="user-list">
            {filtered.map(user => (
              <div key={user.id} className="user-list-item">
                <div style={{ position: 'relative' }}>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="user-list-avatar"
                    onClick={() => navigate(`/profile/${user.username}`)}
                    style={{ cursor: 'pointer' }}
                  />
                  {user.online && <span className="contact-online-dot" />}
                </div>

                <div
                  className="user-list-info"
                  onClick={() => navigate(`/profile/${user.username}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="user-list-name">
                    {user.name}
                    {user.verified && <VerifiedBadge />}
                  </div>
                  <div className="user-list-handle">@{user.username}</div>
                  <div className="user-list-meta">
                    <span>{user.followers?.toLocaleString()} followers</span>
                    {user.mutualFriends > 0 && (
                      <span className="mutual-badge">
                        {user.mutualFriends} mutual
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className={`follow-btn ${isFollowing(user.id) ? 'following' : ''}`}
                  onClick={() => toggleFollow(user.id)}
                >
                  {isFollowing(user.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

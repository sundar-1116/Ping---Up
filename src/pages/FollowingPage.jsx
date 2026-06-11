import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VerifiedBadge } from '../components/SharedComponents';
import { useApp } from '../context/AppContext';
import { USERS } from '../data/mockData';

export default function FollowingPage() {
  const navigate = useNavigate();
  const { following, toggleFollow, isFollowing } = useApp();

  const followingUsers = USERS.filter(u => following.includes(u.id));

  return (
    <div className="main-content">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Following</h1>
          <p className="page-subtitle">
            {followingUsers.length} people you follow
          </p>
        </div>

        {followingUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-text">Not following anyone yet</div>
            <div className="empty-state-sub">
              <button
                style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => navigate('/discover')}
              >
                Discover people to follow →
              </button>
            </div>
          </div>
        ) : (
          <div className="user-list">
            {followingUsers.map(user => (
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
                    <span>· {user.posts} posts</span>
                  </div>
                  <div className="user-list-bio">{user.bio?.slice(0, 80)}</div>
                </div>

                <button
                  className="follow-btn following"
                  onClick={() => toggleFollow(user.id)}
                >
                  Following
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { VerifiedBadge } from '../components/SharedComponents';
import { useApp } from '../context/AppContext';

export default function FollowRequestsPage() {
  const navigate = useNavigate();
  const { followRequests, acceptFollowRequest, declineFollowRequest } = useApp();

  return (
    <div className="main-content">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Follow Requests</h1>
          <p className="page-subtitle">
            {followRequests.length > 0
              ? `${followRequests.length} pending request${followRequests.length > 1 ? 's' : ''}`
              : 'No pending requests'}
          </p>
        </div>

        {followRequests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">✅</div>
            <div className="empty-state-text">All caught up!</div>
            <div className="empty-state-sub">You have no pending follow requests.</div>
          </div>
        ) : (
          <div className="user-list">
            {followRequests.map(req => (
              <div key={req.id} className="user-list-item">
                <img
                  src={req.user.avatar}
                  alt={req.user.name}
                  className="user-list-avatar"
                  onClick={() => navigate(`/profile/${req.user.username}`)}
                  style={{ cursor: 'pointer' }}
                />
                <div
                  className="user-list-info"
                  onClick={() => navigate(`/profile/${req.user.username}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="user-list-name">
                    {req.user.name}
                    {req.user.verified && <VerifiedBadge />}
                  </div>
                  <div className="user-list-handle">@{req.user.username}</div>
                  <div className="user-list-meta">
                    <span>{req.user.followers?.toLocaleString()} followers</span>
                    <span>· {req.time}</span>
                  </div>
                  <div className="user-list-bio">{req.user.bio?.slice(0, 80)}</div>
                </div>

                <div className="follow-request-actions">
                  <button
                    className="accept-btn"
                    onClick={() => acceptFollowRequest(req.id)}
                  >
                    <FaCheck size={13} /> Confirm
                  </button>
                  <button
                    className="decline-btn"
                    onClick={() => declineFollowRequest(req.id)}
                  >
                    <FaTimes size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

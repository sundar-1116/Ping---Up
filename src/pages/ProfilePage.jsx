import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaGlobe, FaEllipsisH } from 'react-icons/fa';
import { PostCard } from '../components/SharedComponents';
import { VerifiedBadge } from '../components/SharedComponents';
import { useApp } from '../context/AppContext';
import { USERS } from '../data/mockData';

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { currentUser, posts, toggleFollow, isFollowing, showToast, openSettings } = useApp();
  const [activeTab, setActiveTab] = useState('posts');
  const [lightboxPost, setLightboxPost] = useState(null);

  // Find user - either current or from list
  const isOwnProfile = username === currentUser.username;
  const profileUser = isOwnProfile
    ? currentUser
    : USERS.find(u => u.username === username) || USERS[0];

  const userPosts = posts.filter(p => p.author.username === username);
  const mediaPosts = userPosts.filter(p => p.image);
  const likedPosts = posts.filter(p => p.liked);
  const savedPosts = posts.filter(p => p.saved);

  const tabContent = () => {
    switch (activeTab) {
      case 'posts': return userPosts;
      case 'media': return mediaPosts;
      case 'likes': return likedPosts;
      case 'saved': return isOwnProfile ? savedPosts : [];
      default: return userPosts;
    }
  };

  const following = !isOwnProfile && isFollowing(profileUser.id);

  return (
    <div className="main-content">
      <div className="profile-page-wrap">
        {/* ── Cover Banner ── */}
        <div className="profile-cover" style={{ background: profileUser.coverGradient }} />

        {/* ── Profile Card ── */}
        <div className="profile-info-card">
          {/* Avatar (overlaps cover) */}
          <div className="profile-avatar-float">
            <img src={profileUser.avatar} alt={profileUser.name} className="profile-avatar" />
          </div>

          {/* Actions (top right) */}
          <div className="profile-actions-row">
            {isOwnProfile ? (
              <button className="btn-outline" onClick={openSettings}>
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className={`btn-primary ${following ? 'btn-outline' : ''}`}
                  onClick={() => toggleFollow(profileUser.id)}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
                <button
                  className="btn-outline"
                  onClick={() => navigate('/messages')}
                >
                  Message
                </button>
              </>
            )}
            <button className="btn-icon" onClick={() => showToast('Options')}>
              <FaEllipsisH />
            </button>
          </div>

          {/* Name & handle */}
          <div className="profile-name">
            {profileUser.name}
            {profileUser.verified && <VerifiedBadge size={18} />}
          </div>
          <div className="profile-handle">@{profileUser.username}</div>

          {/* Bio */}
          {profileUser.bio && (
            <p className="profile-bio">{profileUser.bio}</p>
          )}

          {/* Meta info */}
          <div className="profile-meta">
            {profileUser.location && (
              <span className="profile-meta-item">
                <FaMapMarkerAlt size={12} /> {profileUser.location}
              </span>
            )}
            {profileUser.website && (
              <span className="profile-meta-item" style={{ color: 'var(--primary)', cursor: 'pointer' }}>
                <FaGlobe size={12} /> {profileUser.website}
              </span>
            )}
            <span className="profile-meta-item">
              <FaCalendarAlt size={12} /> Joined {profileUser.joinedDate}
            </span>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-num">{profileUser.posts || userPosts.length}</div>
              <div className="profile-stat-label">Posts</div>
            </div>
            <div
              className="profile-stat"
              onClick={() => navigate('/connections')}
              style={{ cursor: 'pointer' }}
            >
              <div className="profile-stat-num">{profileUser.followers?.toLocaleString()}</div>
              <div className="profile-stat-label">Followers</div>
            </div>
            <div
              className="profile-stat"
              onClick={() => navigate('/following')}
              style={{ cursor: 'pointer' }}
            >
              <div className="profile-stat-num">{profileUser.following?.toLocaleString()}</div>
              <div className="profile-stat-label">Following</div>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="profile-tabs">
          {['posts', 'media', 'likes', ...(isOwnProfile ? ['saved'] : [])].map(tab => (
            <button
              key={tab}
              className={`profile-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Posts ── */}
        <div className="profile-posts">
          {tabContent().length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <div className="empty-state-text">No {activeTab} yet</div>
              <div className="empty-state-sub">
                {isOwnProfile ? `Your ${activeTab} will appear here.` : `${profileUser.name} has no ${activeTab} yet.`}
              </div>
            </div>
          ) : (
            tabContent().map(post => (
              <PostCard key={post.id} post={post} onImageClick={setLightboxPost} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

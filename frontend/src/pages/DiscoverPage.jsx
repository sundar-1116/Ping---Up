import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFire, FaHashtag } from 'react-icons/fa';
import { VerifiedBadge } from '../components/SharedComponents';
import { PostCard } from '../components/SharedComponents';
import { useApp } from '../context/AppContext';

const TRENDING_TAGS = [
  { tag: 'webdev', posts: '12.4K' },
  { tag: 'reactjs', posts: '8.9K' },
  { tag: 'design', posts: '7.2K' },
  { tag: 'startup', posts: '6.1K' },
  { tag: 'ai', posts: '15.3K' },
  { tag: 'nodejs', posts: '5.8K' },
  { tag: 'uidesign', posts: '4.4K' },
  { tag: 'javascript', posts: '11.2K' },
];

export default function DiscoverPage() {
  const navigate = useNavigate();
  const { users, posts, toggleFollow, isFollowing, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('people');

  const filteredUsers = users.filter(u =>
    u.id !== currentUser?.id && (
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.bio?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const filteredPosts = posts.filter(p =>
    p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="discover-wrap">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Discover</h1>
          <p className="page-subtitle">Find new people, posts, and trends</p>
        </div>

        {/* Search Bar */}
        <div className="search-bar-wrap big">
          <FaSearch className="search-bar-icon" />
          <input
            type="text"
            className="search-bar-input"
            placeholder="Search people, posts, hashtags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="tab-row">
          {['people', 'posts', 'trending'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'trending' ? '🔥 Trending' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'people' && (
          <div className="user-grid">
            {filteredUsers.map(user => (
              <div key={user.id} className="user-card">
                <div
                  className="user-card-cover"
                  style={{ background: user.coverGradient, height: 70, borderRadius: '10px 10px 0 0', margin: '-20px -20px 0', marginBottom: 0 }}
                />
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="user-card-avatar"
                  onClick={() => navigate(`/profile/${user.username}`)}
                  style={{ cursor: 'pointer' }}
                />
                <div className="user-card-name" onClick={() => navigate(`/profile/${user.username}`)} style={{ cursor: 'pointer' }}>
                  {user.name}
                  {user.verified && <VerifiedBadge />}
                </div>
                <div className="user-card-handle">@{user.username}</div>
                <div className="user-card-bio">{user.bio?.slice(0, 60)}...</div>
                <div className="user-card-stats">
                  <span>{user.followers?.toLocaleString()} followers</span>
                  {user.mutualFriends > 0 && <span>· {user.mutualFriends} mutual</span>}
                </div>
                <button
                  className={`user-card-follow-btn ${isFollowing(user.id) ? 'following' : ''}`}
                  onClick={() => toggleFollow(user.id)}
                >
                  {isFollowing(user.id) ? 'Following' : 'Follow'}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'posts' && (
          <div>
            {filteredPosts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-text">No posts found</div>
                <div className="empty-state-sub">Try a different search term</div>
              </div>
            ) : (
              filteredPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        )}

        {activeTab === 'trending' && (
          <div className="trending-section">
            <div className="trending-grid">
              {TRENDING_TAGS.map(({ tag, posts: count }) => (
                <div
                  key={tag}
                  className="trending-card"
                  onClick={() => { setSearch(tag); setActiveTab('posts'); }}
                >
                  <div className="trending-hash">#</div>
                  <div className="trending-tag">{tag}</div>
                  <div className="trending-count">{count} posts</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

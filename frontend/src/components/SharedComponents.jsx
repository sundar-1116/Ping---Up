import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaHeart, FaRegHeart, FaComment, FaRetweet, FaBookmark,
  FaRegBookmark, FaEllipsisH, FaShare, FaTimes,
  FaChevronLeft, FaChevronRight, FaPlay, FaPause, FaVolumeUp, FaVolumeMute,
  FaTrash
} from 'react-icons/fa';
import { useApp } from '../context/AppContext';

// ─── Verified Badge ────────────────────────────────────────
export function VerifiedBadge({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#3b82f6" style={{ flexShrink: 0 }}>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
    </svg>
  );
}

// ─── Post Card ────────────────────────────────────────────
export function PostCard({ post, onImageClick }) {
  const navigate = useNavigate();
  const { likePost, savePost, addComment, deletePost, currentUser, showToast } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText.trim());
    setCommentText('');
    showToast('Comment posted!');
  };

  const isOwn = post.author.id === currentUser.id;

  return (
    <article className="post-card">
      {/* Header */}
      <div className="post-header">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="post-avatar"
          onClick={() => navigate(`/profile/${post.author.username}`)}
        />
        <div className="post-user-info">
          <div
            className="post-user-name"
            onClick={() => navigate(`/profile/${post.author.username}`)}
          >
            {post.author.name}
            {post.author.verified && <VerifiedBadge />}
          </div>
          <div className="post-meta">@{post.author.username} · {post.timestamp}</div>
        </div>
        <div style={{ position: 'relative' }}>
          <button className="post-more-btn" onClick={() => setShowMenu(v => !v)}>
            <FaEllipsisH size={16} />
          </button>
          {showMenu && (
            <div className="dropdown-menu" onClick={() => setShowMenu(false)}>
              <button className="dropdown-item" onClick={() => { navigator.clipboard?.writeText(window.location.href); showToast('Link copied!'); }}>
                <FaShare size={13} /> Copy Link
              </button>
              {isOwn && (
                <button className="dropdown-item danger" onClick={() => deletePost(post.id)}>
                  <FaTimes size={13} /> Delete Post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="post-content">
        {post.content.split(' ').map((word, i) =>
          word.startsWith('#') ? (
            <span key={i} className="post-hashtag">{word} </span>
          ) : (
            <span key={i}>{word} </span>
          )
        )}
      </div>

      {/* Image */}
      {post.image && !imgError && (
        <div className="post-image-container">
          <img
            src={post.image}
            alt="Post media"
            className="post-image"
            crossOrigin="anonymous"
            onError={() => setImgError(true)}
            onClick={() => onImageClick && onImageClick(post)}
            loading="lazy"
          />
        </div>
      )}
      {post.image && imgError && (
        <div className="post-image-error">
          <span>📷 Image unavailable</span>
        </div>
      )}

      {/* Actions */}
      <div className="post-actions">
        <button
          className={`post-action-btn ${post.liked ? 'liked' : ''}`}
          onClick={() => likePost(post.id)}
        >
          {post.liked ? <FaHeart /> : <FaRegHeart />}
          <span>{post.likes}</span>
        </button>
        <button className="post-action-btn" onClick={() => setShowComments(v => !v)}>
          <FaComment />
          <span>{post.comments.length}</span>
        </button>
        <button className="post-action-btn" onClick={() => showToast('Reposted!')}>
          <FaRetweet />
          <span>{post.reposts}</span>
        </button>
        <button
          className={`post-action-btn ${post.saved ? 'saved' : ''}`}
          onClick={() => savePost(post.id)}
          style={{ marginLeft: 'auto' }}
        >
          {post.saved ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="comments-section">
          {post.comments.length > 0 && (
            <div className="comments-list">
              {post.comments.map(c => (
                <div key={c.id} className="comment-item">
                  <img
                    src={c.user.avatar}
                    alt={c.user.name}
                    className="comment-avatar"
                    onClick={() => navigate(`/profile/${c.user.username}`)}
                  />
                  <div className="comment-body">
                    <span className="comment-name">{c.user.name}</span>
                    <span className="comment-text"> {c.text}</span>
                    <div className="comment-time">{c.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form className="comment-form" onSubmit={handleComment}>
            <img src={currentUser.avatar} alt="you" className="comment-avatar" />
            <input
              type="text"
              className="comment-input"
              placeholder="Write a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
            />
            <button type="submit" className="comment-submit-btn" disabled={!commentText.trim()}>
              Post
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

// ─── Stories Row ──────────────────────────────────────────
export function StoriesRow({ stories, onStoryClick, onCreateStory }) {
  const { currentUser } = useApp();

  return (
    <div className="stories-row">
      {/* Create Story */}
      <div className="story-card create" onClick={onCreateStory}>
        <div className="story-create-icon">+</div>
        <div className="story-create-label">Create Story</div>
      </div>

      {/* Stories */}
      {stories.map((story, index) => (
        <div
          key={story.id}
          className={`story-card has-image ${story.seen ? 'seen' : ''}`}
          onClick={() => onStoryClick && onStoryClick(index)}
        >
          {story.type === 'video' ? (
            <video
              src={story.media}
              className="story-bg-media"
              muted
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <img
              src={story.media}
              alt="story"
              crossOrigin="anonymous"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
          <img src={story.user.avatar} alt={story.user.name} className="story-avatar" />
          <div className="story-overlay">
            <div className="story-user-label">{story.user.name.split(' ')[0]}</div>
            {story.type === 'video' && (
              <div className="story-video-badge">▶ Video</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Full Story Viewer (with timer, video, auto-advance) ───
const PHOTO_DURATION = 10000; // 10 seconds

export function StoryViewer({ stories, startIndex = 0, onClose }) {
  const { deleteStory, currentUser } = useApp();
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const elapsedRef = useRef(0);

  const story = stories[currentIndex];
  const isOwnStory = story?.user?.id === currentUser?.id;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this story?")) {
      const idToDelete = story.id;
      if (stories.length <= 1) {
        onClose();
      } else {
        if (currentIndex >= stories.length - 1) {
          setCurrentIndex(stories.length - 2);
        } else {
          setProgress(0);
          elapsedRef.current = 0;
          startTimeRef.current = null;
        }
      }
      deleteStory(idToDelete);
    }
  };

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  }, [currentIndex]);

  // Reset state when story changes
  useEffect(() => {
    setProgress(0);
    elapsedRef.current = 0;
    setPaused(false);
    startTimeRef.current = null;
    return () => clearInterval(timerRef.current);
  }, [currentIndex]);

  // Timer for photo stories
  useEffect(() => {
    if (!story || story.type === 'video') return;

    const start = () => {
      startTimeRef.current = Date.now() - elapsedRef.current;
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const pct = Math.min((elapsed / PHOTO_DURATION) * 100, 100);
        setProgress(pct);
        if (pct >= 100) {
          clearInterval(timerRef.current);
          goNext();
        }
      }, 50);
    };

    if (!paused) {
      start();
    } else {
      elapsedRef.current = Date.now() - (startTimeRef.current || Date.now());
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [story, paused, goNext]);

  // Video story — watch for end
  useEffect(() => {
    if (!videoRef.current || story?.type !== 'video') return;
    const vid = videoRef.current;

    const handleTimeUpdate = () => {
      if (vid.duration) {
        setProgress((vid.currentTime / vid.duration) * 100);
      }
    };
    const handleEnded = () => goNext();

    vid.addEventListener('timeupdate', handleTimeUpdate);
    vid.addEventListener('ended', handleEnded);
    vid.play().catch(() => {});

    return () => {
      vid.removeEventListener('timeupdate', handleTimeUpdate);
      vid.removeEventListener('ended', handleEnded);
    };
  }, [story, goNext]);

  // Pause/resume video
  useEffect(() => {
    if (!videoRef.current || story?.type !== 'video') return;
    if (paused) videoRef.current.pause();
    else videoRef.current.play().catch(() => {});
  }, [paused, story]);

  if (!story) return null;

  return (
    <div className="story-viewer-overlay" onClick={goNext}>
      {/* Close */}
      <button
        className="story-viewer-close"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      >✕</button>

      {/* Progress bars */}
      <div className="story-progress-bars" onClick={e => e.stopPropagation()}>
        {stories.map((_, i) => (
          <div key={i} className="story-progress-track">
            <div
              className="story-progress-fill"
              style={{
                width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="story-viewer-header" onClick={e => e.stopPropagation()}>
        <img src={story.user.avatar} alt={story.user.name} className="story-viewer-avatar" />
        <div style={{ flex: 1 }}>
          <div className="story-viewer-name">{story.user.name}</div>
          <div className="story-viewer-time">{story.time}</div>
        </div>
        <button
          className="story-ctrl-btn"
          onClick={() => setPaused(p => !p)}
        >
          {paused ? <FaPlay size={12} /> : <FaPause size={12} />}
        </button>
        {story.type === 'video' && (
          <button
            className="story-ctrl-btn"
            onClick={() => {
              setMuted(m => !m);
              if (videoRef.current) videoRef.current.muted = !muted;
            }}
          >
            {muted ? <FaVolumeMute size={12} /> : <FaVolumeUp size={12} />}
          </button>
        )}
        {isOwnStory && (
          <button
            className="story-ctrl-btn story-delete-btn"
            onClick={handleDelete}
            title="Delete Story"
            style={{ color: '#ef4444' }}
          >
            <FaTrash size={12} />
          </button>
        )}
      </div>

      {/* Media */}
      <div className="story-viewer-media-wrap">
        {/* Prev area */}
        <div
          className="story-nav-area left"
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
        >
          {currentIndex > 0 && <FaChevronLeft size={18} />}
        </div>

        {story.type === 'video' ? (
          <video
            ref={videoRef}
            src={story.media}
            className="story-viewer-media"
            muted={muted}
            playsInline
            autoPlay
          />
        ) : (
          <img
            src={story.media}
            alt="story"
            className="story-viewer-media"
            crossOrigin="anonymous"
          />
        )}

        {/* Next area */}
        <div
          className="story-nav-area right"
          onClick={(e) => { e.stopPropagation(); goNext(); }}
        >
          {currentIndex < stories.length - 1 && <FaChevronRight size={18} />}
        </div>
      </div>

      {/* Pause indicator */}
      {paused && (
        <div className="story-paused-indicator">
          <FaPause size={28} />
          <span>Paused</span>
        </div>
      )}

      {/* Timer info for photos */}
      {story.type !== 'video' && (
        <div className="story-timer-label">
          {Math.max(0, Math.ceil(PHOTO_DURATION / 1000 - (progress / 100) * (PHOTO_DURATION / 1000)))}s
        </div>
      )}
    </div>
  );
}

// ─── Create Story Modal ────────────────────────────────────
export function CreateStoryModal({ onClose, onPublish }) {
  const { currentUser, showToast } = useApp();
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');

    if (!isVideo && !isImage) {
      showToast('Please select an image or video file');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      showToast('File must be under 100MB');
      return;
    }

    setMediaType(isVideo ? 'video' : 'image');
    const reader = new FileReader();
    reader.onload = ev => setMediaPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handlePublish = () => {
    if (!mediaPreview) {
      showToast('Please select a photo or video first');
      return;
    }
    onPublish({ type: mediaType, media: mediaPreview });
    showToast('Story added! 🎉');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-story-modal" onClick={e => e.stopPropagation()}>
        <div className="create-story-header">
          <h3>Create Story</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="create-story-user">
          <img src={currentUser.avatar} alt={currentUser.name} className="create-post-avatar" />
          <div>
            <div className="create-post-name">{currentUser.name}</div>
            <div className="create-post-handle">@{currentUser.username}</div>
          </div>
        </div>

        {/* Media Upload Area */}
        {!mediaPreview ? (
          <div
            className="story-upload-area"
            onClick={() => fileRef.current?.click()}
          >
            <div className="story-upload-icon">📸</div>
            <div className="story-upload-label">Click to add a Photo or Video</div>
            <div className="story-upload-sub">Photos: JPG, PNG, GIF · Videos: MP4, MOV (max 100MB)</div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFile}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          <div className="story-preview-wrap">
            {mediaType === 'video' ? (
              <video
                src={mediaPreview}
                className="story-preview-media"
                controls
                muted
              />
            ) : (
              <img src={mediaPreview} alt="preview" className="story-preview-media" />
            )}
            <button
              className="story-preview-remove"
              onClick={() => { setMediaPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
            >
              ✕ Remove
            </button>
          </div>
        )}

        <div className="create-story-footer">
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handlePublish} disabled={!mediaPreview}>
            Add to Story
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Image Lightbox ───────────────────────────────────────
export function Lightbox({ post, onClose }) {
  if (!post) return null;
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-user">
        <img src={post.author.avatar} alt={post.author.name} className="lightbox-user-avatar" />
        <div className="lightbox-user-name">
          {post.author.name}
          {post.author.verified && <VerifiedBadge size={16} />}
        </div>
      </div>
      <button className="lightbox-close" onClick={onClose}>✕</button>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <img
          src={post.image}
          alt="Post"
          className="lightbox-img"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
}

// ─── Right Sidebar ────────────────────────────────────────
export function RightSidebar() {
  const { messages } = useApp();
  const navigate = useNavigate();

  return (
    <aside className="right-sidebar">
      {/* Sponsored */}
      <div className="right-sidebar-section">
        <div className="right-sidebar-title">Sponsored</div>
        <img
          src="https://picsum.photos/id/60/400/200"
          alt="sponsored"
          className="sponsored-img"
          crossOrigin="anonymous"
        />
        <div className="sponsored-name">Email Marketing Pro</div>
        <div className="sponsored-desc">Supercharge your marketing with a powerful, easy-to-use platform built for results.</div>
      </div>

      {/* Recent Messages */}
      <div className="right-sidebar-section">
        <div className="right-sidebar-title">Recent Messages</div>
        {messages.slice(0, 3).map(m => (
          <div key={m.id} className="message-item" onClick={() => navigate('/messages')}>
            <div style={{ position: 'relative' }}>
              <img src={m.user.avatar} alt={m.user.name} className="message-avatar" />
              {m.user.online && <span className="online-dot" />}
            </div>
            <div className="message-info">
              <div className="message-name">{m.user.name}</div>
              <div className="message-preview">{m.lastMessage}</div>
            </div>
            <div className="message-time">{m.time}</div>
          </div>
        ))}
        <button className="view-all-btn" onClick={() => navigate('/messages')}>
          View all messages
        </button>
      </div>
    </aside>
  );
}

// ─── Toast ────────────────────────────────────────────────
export function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type || ''}`}>
      {toast.msg}
    </div>
  );
}

// ─── Settings Drawer ─────────────────────────────────────
export function SettingsDrawer() {
  const { isSettingsOpen, closeSettings, currentUser, updateCurrentUser, showToast } = useApp();
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [avatar, setAvatar] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'account'

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isSettingsOpen && currentUser) {
      setName(currentUser.name || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      setLocation(currentUser.location || '');
      setWebsite(currentUser.website || '');
      setAvatar(currentUser.avatar || '');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [isSettingsOpen, currentUser]);

  if (!isSettingsOpen) return null;

  const handleAvatarFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image must be under 10MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      setAvatar(ev.target.result);
      showToast('New photo uploaded! Click Save to apply.');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    updateCurrentUser({
      name: name.trim(),
      bio: bio.trim(),
      location: location.trim(),
      website: website.trim(),
      avatar: avatar
    });
    closeSettings();
  };

  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      showToast('Username cannot be empty', 'error');
      return;
    }

    const updatedData = {
      username: username.trim().toLowerCase().replace(/\s+/g, '')
    };

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
      if (newPassword.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
      }
      updatedData.password = newPassword;
    }

    updateCurrentUser(updatedData);
    closeSettings();
  };

  return (
    <div className={`settings-drawer-overlay ${isSettingsOpen ? 'open' : ''}`} onClick={closeSettings}>
      <div className="settings-drawer" onClick={e => e.stopPropagation()}>
        <div className="settings-drawer-header">
          <h3>Account & Profile Settings</h3>
          <button className="settings-close-btn" onClick={closeSettings}>✕</button>
        </div>

        <div className="settings-tabs">
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Edit Profile
          </button>
          <button
            type="button"
            className={`settings-tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account & Password
          </button>
        </div>

        <div className="settings-drawer-content">
          {activeTab === 'profile' ? (
            <form onSubmit={handleSaveProfile} className="settings-form">
              <div className="settings-avatar-section">
                <img src={avatar} alt="Avatar Preview" className="settings-avatar-preview" />
                <div className="settings-avatar-actions">
                  <button
                    type="button"
                    className="btn-primary btn-sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Photo
                  </button>
                  <button
                    type="button"
                    className="btn-outline btn-sm"
                    onClick={() => setAvatar(`https://api.dicebear.com/9.x/avataaars/svg?seed=${name || 'Sundar'}&backgroundColor=b6e3f4`)}
                  >
                    Generate Random
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarFile}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>

              <div className="settings-field">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your display name"
                />
              </div>

              <div className="settings-field">
                <label>Bio</label>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <div className="settings-field">
                <label>Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Hyderabad, India"
                />
              </div>

              <div className="settings-field">
                <label>Website</label>
                <input
                  type="text"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="e.g. sundar.dev"
                />
              </div>

              <div className="settings-footer">
                <button type="button" className="btn-outline" onClick={closeSettings}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSaveAccount} className="settings-form">
              <div className="settings-field">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Username"
                />
              </div>

              <div className="settings-field">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              {newPassword && (
                <div className="settings-field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                  />
                </div>
              )}

              <div className="settings-footer">
                <button type="button" className="btn-outline" onClick={closeSettings}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaTimes, FaMapMarkerAlt, FaSmile } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const MAX_CHARS = 500;

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { currentUser, addPost } = useApp();
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('Image must be under 10MB');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePublish = async () => {
    if (!content.trim() && !imagePreview) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    addPost({
      content: content.trim(),
      image: imagePreview || null,
    });
    navigate('/feed');
  };

  const charsLeft = MAX_CHARS - content.length;
  const canPublish = (content.trim() || imagePreview) && !loading;

  return (
    <div className="main-content">
      <div className="create-post-page">
        <div className="page-header">
          <h1 className="create-post-title">Create Post</h1>
          <p className="create-post-subtitle">Share your thoughts with the world</p>
        </div>

        <div className="create-post-card">
          {/* User info */}
          <div className="create-post-user">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="create-post-avatar"
            />
            <div>
              <div className="create-post-name">{currentUser.name}</div>
              <div className="create-post-handle">@{currentUser.username}</div>
            </div>
          </div>

          {/* Text area */}
          <textarea
            ref={textareaRef}
            className="create-post-textarea"
            placeholder="What's happening?"
            value={content}
            onChange={e => setContent(e.target.value.slice(0, MAX_CHARS))}
            rows={3}
          />

          {/* Image preview */}
          {imagePreview && (
            <div className="create-post-image-wrap">
              <img src={imagePreview} alt="preview" className="create-post-image-preview" />
              <button className="create-post-remove-img" onClick={removeImage}>
                <FaTimes size={14} />
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="create-post-footer">
            <div className="create-post-tools">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageSelect}
                style={{ display: 'none' }}
                id="post-image-input"
              />
              <label htmlFor="post-image-input" className="create-post-upload-btn" title="Add Image">
                <FaImage size={20} />
              </label>
              <button
                className="create-post-upload-btn"
                title="Add Emoji"
                onClick={() => setContent(c => c + ' 😊')}
              >
                <FaSmile size={20} />
              </button>
              <button
                className="create-post-upload-btn"
                title="Add Location"
                onClick={() => setContent(c => c + ' 📍')}
              >
                <FaMapMarkerAlt size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {content.length > 0 && (
                <span
                  className={`char-counter ${charsLeft < 50 ? 'warning' : ''} ${charsLeft < 20 ? 'danger' : ''}`}
                >
                  {charsLeft}
                </span>
              )}
              <button
                className="create-post-publish-btn"
                onClick={handlePublish}
                disabled={!canPublish}
              >
                {loading ? <span className="btn-spinner" /> : 'Publish Post'}
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="create-post-tips">
          <h3 className="tips-title">Tips for great posts</h3>
          <ul className="tips-list">
            <li>Use #hashtags to reach more people</li>
            <li>Add an image to boost engagement by 3x</li>
            <li>Keep it authentic and engaging</li>
            <li>Tag others with @username</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

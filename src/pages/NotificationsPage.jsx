import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaComment, FaUserPlus, FaAt, FaBell } from 'react-icons/fa';
import { VerifiedBadge } from '../components/SharedComponents';
import { useApp } from '../context/AppContext';

function NotifIcon({ type }) {
  const map = {
    like: { icon: <FaHeart />, color: '#ef4444', bg: '#fef2f2' },
    comment: { icon: <FaComment />, color: '#3b82f6', bg: '#eff6ff' },
    follow: { icon: <FaUserPlus />, color: '#8b5cf6', bg: '#f5f3ff' },
    follow_request: { icon: <FaUserPlus />, color: '#f59e0b', bg: '#fffbeb' },
    mention: { icon: <FaAt />, color: '#10b981', bg: '#ecfdf5' },
  };
  const style = map[type] || { icon: <FaBell />, color: '#6b7280', bg: '#f9fafb' };
  return (
    <div
      style={{
        width: 36, height: 36, borderRadius: '50%',
        background: style.bg, color: style.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, flexShrink: 0,
      }}
    >
      {style.icon}
    </div>
  );
}

function notifText(n) {
  switch (n.type) {
    case 'like': return 'liked your post';
    case 'comment': return `commented: "${n.text}"`;
    case 'follow': return 'started following you';
    case 'follow_request': return 'sent you a follow request';
    case 'mention': return 'mentioned you in a post';
    default: return 'interacted with you';
  }
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, markNotificationsRead } = useApp();

  React.useEffect(() => {
    const timer = setTimeout(() => markNotificationsRead(), 1000);
    return () => clearTimeout(timer);
  }, []);

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div className="main-content">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            {unread.length > 0 ? `${unread.length} new notification${unread.length > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <div className="empty-state-text">No notifications yet</div>
            <div className="empty-state-sub">When someone interacts with you, you'll see it here.</div>
          </div>
        ) : (
          <div className="notifications-list">
            {unread.length > 0 && (
              <>
                <div className="notif-section-label">New</div>
                {unread.map(n => (
                  <NotifItem key={n.id} notif={n} navigate={navigate} isUnread />
                ))}
              </>
            )}
            {read.length > 0 && (
              <>
                <div className="notif-section-label" style={{ marginTop: 16 }}>Earlier</div>
                {read.map(n => (
                  <NotifItem key={n.id} notif={n} navigate={navigate} />
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NotifItem({ notif, navigate, isUnread }) {
  return (
    <div
      className={`notif-item ${isUnread ? 'unread' : ''}`}
      onClick={() => notif.post && navigate('/feed')}
      style={{ cursor: notif.post ? 'pointer' : 'default' }}
    >
      <div style={{ position: 'relative' }}>
        <img
          src={notif.user.avatar}
          alt={notif.user.name}
          className="notif-avatar"
          onClick={e => { e.stopPropagation(); navigate(`/profile/${notif.user.username}`); }}
          style={{ cursor: 'pointer' }}
        />
        <NotifIcon type={notif.type} />
      </div>
      <div className="notif-body">
        <span
          className="notif-user-name"
          onClick={e => { e.stopPropagation(); navigate(`/profile/${notif.user.username}`); }}
        >
          {notif.user.name}
        </span>{' '}
        <span className="notif-text">{notifText(notif)}</span>
        <div className="notif-time">{notif.time}</div>
      </div>
      {notif.post?.image && (
        <img src={notif.post.image} alt="post" className="notif-post-thumb" />
      )}
      {isUnread && <div className="notif-dot" />}
    </div>
  );
}

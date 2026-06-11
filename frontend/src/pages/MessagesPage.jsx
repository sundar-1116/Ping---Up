import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaPaperPlane, FaSearch, FaEllipsisV } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

export default function MessagesPage() {
  const location = useLocation();
  const {
    messages, sendMessage, currentUser, users,
    markMessagesAsRead, clearChatHistory, deleteConversation, showToast
  } = useApp();

  const targetUserId = location.state?.userId;
  const initialActiveId = targetUserId ? `conv_${targetUserId}` : (messages[0]?.id || null);

  const [activeId, setActiveId] = useState(initialActiveId);
  const [draftConv, setDraftConv] = useState(null);

  useEffect(() => {
    if (targetUserId && !messages.find(m => m.id === `conv_${targetUserId}`)) {
      const targetUser = users.find(u => u.id === targetUserId);
      if (targetUser) {
        setDraftConv({
          id: `conv_${targetUserId}`,
          user: targetUser,
          lastMessage: 'Start a conversation',
          time: 'Just now',
          unread: 0,
          chat: []
        });
      }
    } else {
      setDraftConv(null);
    }
  }, [targetUserId, messages, users]);

  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);

  const activeConv = messages.find(m => m.id === activeId) || (draftConv?.id === activeId ? draftConv : null);

  // Automatically mark messages as read when active conversation changes
  useEffect(() => {
    if (activeId) {
      markMessagesAsRead(activeId);
    }
  }, [activeId, markMessagesAsRead]);

  // Close the header menu when switching chats
  useEffect(() => {
    setShowMenu(false);
  }, [activeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.chat]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !activeId) return;
    sendMessage(activeId, text.trim());
    setText('');
  };

  const handleDeleteConversation = () => {
    if (!activeConv) return;
    if (window.confirm(`Are you sure you want to delete your conversation with ${activeConv.user.name}?`)) {
      deleteConversation(activeId);
      const remaining = messages.filter(m => m.id !== activeId);
      if (remaining.length > 0) {
        setActiveId(remaining[0].id);
      } else {
        setActiveId(null);
      }
    }
  };

  const allMessages = draftConv && !messages.find(m => m.id === draftConv.id) ? [draftConv, ...messages] : messages;
  const filteredMessages = allMessages.filter(m =>
    m.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content">
      <div className="messages-page-wrap">
        {/* ── Contact List ── */}
        <div className="messages-list">
          <div className="messages-list-header">
            <div className="messages-list-title">Messages</div>
            <div className="messages-search-wrap">
              <FaSearch className="messages-search-icon" size={13} />
              <input
                type="text"
                className="messages-search"
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="messages-contacts">
            {filteredMessages.map(m => (
              <div
                key={m.id}
                className={`contact-item ${activeId === m.id ? 'active' : ''}`}
                onClick={() => setActiveId(m.id)}
              >
                <div className="contact-avatar-wrap">
                  <img src={m.user.avatar} alt={m.user.name} className="contact-avatar" />
                  {m.user.online && <span className="contact-online-dot" />}
                </div>
                <div className="contact-info">
                  <div className="contact-name">{m.user.name}</div>
                  <div className="contact-last-msg">{m.lastMessage}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <div className="contact-time">{m.time}</div>
                  {m.unread > 0 && (
                    <div className="unread-badge">{m.unread}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Chat Window ── */}
        {activeConv ? (
          <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
              <div style={{ position: 'relative' }}>
                <img
                  src={activeConv.user.avatar}
                  alt={activeConv.user.name}
                  className="chat-header-avatar"
                />
                {activeConv.user.online && (
                  <span className="contact-online-dot" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div className="chat-header-name">{activeConv.user.name}</div>
                <div className="chat-header-status">
                  {activeConv.user.online ? '● Online' : 'Offline'}
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <button className="btn-icon" onClick={() => setShowMenu(v => !v)}>
                  <FaEllipsisV />
                </button>
                {showMenu && (
                  <div className="dropdown-menu" style={{ right: 0, top: '44px' }} onClick={() => setShowMenu(false)}>
                    <button className="dropdown-item" onClick={() => showToast('Muted notifications for this chat!')}>
                      🔔 Mute Notifications
                    </button>
                    <button className="dropdown-item" onClick={() => clearChatHistory(activeId)}>
                      🧹 Clear History
                    </button>
                    <button className="dropdown-item danger" onClick={handleDeleteConversation}>
                      🗑️ Delete Chat
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {activeConv.chat.map(msg => (
                <div
                  key={msg.id}
                  className={`chat-msg ${msg.from === 'me' ? 'mine' : ''}`}
                >
                  {msg.from !== 'me' && (
                    <img
                      src={activeConv.user.avatar}
                      alt="them"
                      className="chat-msg-avatar"
                    />
                  )}
                  {msg.from === 'me' && (
                    <img
                      src={currentUser.avatar}
                      alt="me"
                      className="chat-msg-avatar"
                    />
                  )}
                  <div>
                    <div className="chat-bubble">{msg.text}</div>
                    <div className="chat-time">{msg.time}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-input-area" onSubmit={handleSend}>
              <input
                type="text"
                className="chat-input"
                placeholder={`Message ${activeConv.user.name}...`}
                value={text}
                onChange={e => setText(e.target.value)}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!text.trim()}
              >
                <FaPaperPlane size={15} />
              </button>
            </form>
          </div>
        ) : (
          <div className="chat-window" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <div className="empty-state-text">Select a conversation</div>
              <div className="empty-state-sub">Choose from your existing conversations or start a new one</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Global & User States
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [stories, setStories] = useState([]);
  const [following, setFollowing] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Generic states
  const [followRequests, setFollowRequests] = useState([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = 'default') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Fetch all app data from backend
  const fetchAppData = useCallback(async () => {
    try {
      const [postsRes, usersRes, storiesRes, messagesRes, notificationsRes, requestsRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/users'),
        fetch('/api/stories'),
        fetch('/api/messages'),
        fetch('/api/notifications'),
        fetch('/api/follow-requests')
      ]);

      if (postsRes.ok) setPosts(await postsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (storiesRes.ok) setStories(await storiesRes.json());
      if (messagesRes.ok) setMessages(await messagesRes.json());
      if (notificationsRes.ok) setNotifications(await notificationsRes.json());
      if (requestsRes.ok) setFollowRequests(await requestsRes.json());
    } catch (err) {
      console.error('Error fetching app data:', err);
    }
  }, []);

  // On App Mount: check active session from HTTP cookie
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);
          setIsLoggedIn(true);
          setFollowing(user.followingIds || []);
        } else {
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch all app feed/connections data when user logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetchAppData();
    }
  }, [isLoggedIn, fetchAppData]);

  // Auth Operations
  const login = useCallback(async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login failed');
    }
    const user = await res.json();
    setCurrentUser(user);
    setFollowing(user.followingIds || []);
    setIsLoggedIn(true);
    showToast(`Welcome back, ${user.name}! 👋`);
  }, [showToast]);

  const signup = useCallback(async (name, username, email, password, avatar) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, email, password, avatar })
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Signup failed');
    }
    const user = await res.json();
    setCurrentUser(user);
    setFollowing(user.followingIds || []);
    setIsLoggedIn(true);
    showToast(`Welcome to PingUp, ${user.name}! 🎉`);
  }, [showToast]);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Server logout failed:', err);
    }
    setCurrentUser(null);
    setIsLoggedIn(false);
    setPosts([]);
    setUsers([]);
    setStories([]);
    setFollowing([]);
    setMessages([]);
    setNotifications([]);
    showToast('Logged out successfully');
  }, [showToast]);

  // Post Operations
  const likePost = useCallback(async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      if (res.ok) {
        const { liked, likesCount } = await res.json();
        setPosts(prev => prev.map(p =>
          p.id === postId ? { ...p, liked, likes: likesCount } : p
        ));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const savePost = useCallback(async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/save`, { method: 'POST' });
      if (res.ok) {
        const { saved, savesCount } = await res.json();
        setPosts(prev => prev.map(p =>
          p.id === postId ? { ...p, saved, saves: savesCount } : p
        ));
        showToast(saved ? 'Post saved!' : 'Post unsaved');
      }
    } catch (err) {
      console.error(err);
    }
  }, [showToast]);

  const addComment = useCallback(async (postId, text) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const comment = await res.json();
        setPosts(prev => prev.map(p =>
          p.id === postId ? { ...p, comments: [...p.comments, comment] } : p
        ));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const addPost = useCallback(async (newPost) => {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to create post');
    }
    const post = await res.json();
    setPosts(prev => [post, ...prev]);

    // Refresh me session to update profile posts counter
    const meRes = await fetch('/api/auth/me');
    if (meRes.ok) setCurrentUser(await meRes.json());

    showToast('Post published! 🎉');
    return post;
  }, [showToast]);

  const deletePost = useCallback(async (postId) => {
    const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    if (res.ok) {
      setPosts(prev => prev.filter(p => p.id !== postId));

      const meRes = await fetch('/api/auth/me');
      if (meRes.ok) setCurrentUser(await meRes.json());

      showToast('Post deleted');
    }
  }, [showToast]);

  // Story Operations
  const addStory = useCallback(async (storyData) => {
    const res = await fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storyData)
    });
    if (res.ok) {
      const story = await res.json();
      setStories(prev => [story, ...prev]);
      showToast('Story added! 🎉');
    }
  }, [showToast]);

  const deleteStory = useCallback(async (storyId) => {
    const res = await fetch(`/api/stories/${storyId}`, { method: 'DELETE' });
    if (res.ok) {
      setStories(prev => prev.filter(s => s.id !== storyId));
      showToast('Story deleted');
    }
  }, [showToast]);

  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  // Profile Update
  const updateCurrentUser = useCallback(async (updatedData) => {
    const res = await fetch('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData)
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Failed to update profile');
    }
    const user = await res.json();
    setCurrentUser(user);

    // Refresh application state to update lists
    fetchAppData();
    showToast('Profile updated! ✨');
  }, [fetchAppData, showToast]);

  // Follow Operations
  const toggleFollow = useCallback(async (userId) => {
    const res = await fetch(`/api/users/${userId}/follow`, { method: 'POST' });
    if (res.ok) {
      const { following: isFollowing } = await res.json();
      const user = users.find(u => u.id === userId);
      showToast(isFollowing ? `Following ${user?.name} 🎉` : `Unfollowed ${user?.name}`);

      // Instantly update following state
      setFollowing(prev => isFollowing ? [...prev, userId] : prev.filter(id => id !== userId));

      // Refresh data
      const [meRes, usersRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/users')
      ]);
      if (meRes.ok) setCurrentUser(await meRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    }
  }, [users, showToast]);

  const isFollowing = useCallback((userId) => following.includes(userId), [following]);

  const acceptFollowRequest = useCallback(async (reqId) => {
    try {
      const res = await fetch(`/api/follow-requests/${reqId}/accept`, { method: 'POST' });
      if (res.ok) {
        setFollowRequests(prev => prev.filter(r => r.id !== reqId));
        showToast('Follow request accepted! 🎉');
        
        // Refresh me and users to update followers count
        const [meRes, usersRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/users')
        ]);
        if (meRes.ok) setCurrentUser(await meRes.json());
        if (usersRes.ok) setUsers(await usersRes.json());
      }
    } catch (err) {
      console.error(err);
    }
  }, [showToast]);

  const declineFollowRequest = useCallback(async (reqId) => {
    try {
      const res = await fetch(`/api/follow-requests/${reqId}/decline`, { method: 'POST' });
      if (res.ok) {
        setFollowRequests(prev => prev.filter(r => r.id !== reqId));
        showToast('Follow request deleted');
      }
    } catch (err) {
      console.error(err);
    }
  }, [showToast]);

  // Message Operations
  const sendMessage = useCallback(async (conversationId, text) => {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, text })
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages(prev => {
        if (prev.some(m => m.id === conversationId)) {
          return prev.map(m =>
            m.id === conversationId
              ? {
                  ...m,
                  lastMessage: text,
                  time: 'Just now',
                  chat: [...m.chat, msg]
                }
              : m
          );
        } else {
          // If it's a new conversation, fetch messages to get the full conversation with user details
          fetch('/api/messages').then(r => r.json()).then(data => setMessages(data));
          return prev;
        }
      });
    }
  }, []);

  const markMessagesAsRead = useCallback((conversationId) => {
    // Frontend dynamic read mapping, backend has read flags as well
    setMessages(prev => prev.map(m =>
      m.id === conversationId ? { ...m, unread: 0 } : m
    ));
  }, []);

  const clearChatHistory = useCallback((conversationId) => {
    showToast('Chat history cleared');
  }, [showToast]);

  const deleteConversation = useCallback((conversationId) => {
    setMessages(prev => prev.filter(m => m.id !== conversationId));
    showToast('Conversation deleted');
  }, [showToast]);

  // Notification Operations
  const markNotificationsRead = useCallback(async () => {
    const res = await fetch('/api/notifications/read', { method: 'POST' });
    if (res.ok) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = messages.reduce((sum, m) => sum + m.unread, 0);

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      currentUser,
      authLoading,
      posts,
      messages,
      users,
      followRequests,
      notifications,
      stories,
      following,
      isSettingsOpen,
      toast,
      unreadNotificationsCount,
      unreadMessagesCount,
      login,
      signup,
      logout,
      likePost,
      savePost,
      addComment,
      addPost,
      deletePost,
      addStory,
      deleteStory,
      openSettings,
      closeSettings,
      updateCurrentUser,
      toggleFollow,
      isFollowing,
      acceptFollowRequest,
      declineFollowRequest,
      sendMessage,
      markMessagesAsRead,
      clearChatHistory,
      deleteConversation,
      markNotificationsRead,
      showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};

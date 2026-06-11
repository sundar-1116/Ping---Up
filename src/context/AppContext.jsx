import React, { createContext, useContext, useState, useCallback } from 'react';
import { CURRENT_USER, POSTS, MESSAGES_DATA, USERS, FOLLOW_REQUESTS, NOTIFICATIONS, STORIES } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({ ...CURRENT_USER, password: 'password123' });
  const [posts, setPosts] = useState(POSTS);
  const [messages, setMessages] = useState(MESSAGES_DATA);
  const [followRequests, setFollowRequests] = useState(FOLLOW_REQUESTS);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [stories, setStories] = useState(STORIES);
  const [following, setFollowing] = useState(['user_1', 'user_3']);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = 'default') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const login = useCallback((email, password) => {
    setIsLoggedIn(true);
    showToast('Welcome back to PingUp! 👋');
  }, [showToast]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    showToast('Logged out successfully');
  }, [showToast]);

  const likePost = useCallback((postId) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  }, []);

  const savePost = useCallback((postId) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, saved: !p.saved }
        : p
    ));
    showToast('Post saved!');
  }, [showToast]);

  const addComment = useCallback((postId, text) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? {
            ...p,
            comments: [...p.comments, {
              id: `c_${Date.now()}`,
              user: CURRENT_USER,
              text,
              time: 'Just now',
            }]
          }
        : p
    ));
  }, []);

  const addPost = useCallback((newPost) => {
    const post = {
      id: `post_${Date.now()}`,
      author: CURRENT_USER,
      ...newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: [],
      reposts: 0,
      saves: 0,
      liked: false,
      saved: false,
    };
    setPosts(prev => [post, ...prev]);
    setCurrentUser(prev => ({ ...prev, posts: prev.posts + 1 }));
    showToast('Post published! 🎉');
    return post;
  }, [showToast]);

  const deletePost = useCallback((postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setCurrentUser(prev => ({ ...prev, posts: Math.max(0, prev.posts - 1) }));
    showToast('Post deleted');
  }, [showToast]);

  const deleteStory = useCallback((storyId) => {
    setStories(prev => prev.filter(s => s.id !== storyId));
    showToast('Story deleted');
  }, [showToast]);

  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  const updateCurrentUser = useCallback((updatedData) => {
    setCurrentUser(prev => ({ ...prev, ...updatedData }));
    
    // Update posts authored by current user
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.author.id === currentUser.id) {
        return {
          ...post,
          author: { ...post.author, ...updatedData }
        };
      }
      return post;
    }));

    // Update stories posted by current user
    setStories(prevStories => prevStories.map(story => {
      if (story.user.id === currentUser.id) {
        return {
          ...story,
          user: { ...story.user, ...updatedData }
        };
      }
      return story;
    }));

    showToast('Profile updated! ✨');
  }, [currentUser.id, showToast]);

  const addStory = useCallback((storyData) => {
    const newStory = {
      id: `story_${Date.now()}`,
      user: CURRENT_USER,
      type: storyData.type || 'image',
      media: storyData.media,
      time: 'Just now',
      seen: false,
    };
    setStories(prev => [newStory, ...prev]);
  }, []);

  const toggleFollow = useCallback((userId) => {
    const user = USERS.find(u => u.id === userId);
    setFollowing(prev => {
      const isFollowing = prev.includes(userId);
      if (isFollowing) {
        showToast(`Unfollowed ${user?.name}`);
        return prev.filter(id => id !== userId);
      } else {
        showToast(`Following ${user?.name} 🎉`);
        return [...prev, userId];
      }
    });
  }, [showToast]);

  const isFollowing = useCallback((userId) => following.includes(userId), [following]);

  const acceptFollowRequest = useCallback((reqId) => {
    const req = followRequests.find(r => r.id === reqId);
    setFollowRequests(prev => prev.filter(r => r.id !== reqId));
    if (req) {
      showToast(`Accepted ${req.user.name}'s request`);
    }
  }, [followRequests, showToast]);

  const declineFollowRequest = useCallback((reqId) => {
    setFollowRequests(prev => prev.filter(r => r.id !== reqId));
    showToast('Request declined');
  }, [showToast]);

  const sendMessage = useCallback((conversationId, text) => {
    setMessages(prev => prev.map(m =>
      m.id === conversationId
        ? {
            ...m,
            lastMessage: text,
            time: 'Just now',
            chat: [...m.chat, { id: Date.now(), from: 'me', text, time: 'Just now' }]
          }
        : m
    ));
  }, []);

  const markMessagesAsRead = useCallback((conversationId) => {
    setMessages(prev => prev.map(m =>
      m.id === conversationId ? { ...m, unread: 0 } : m
    ));
  }, []);

  const clearChatHistory = useCallback((conversationId) => {
    setMessages(prev => prev.map(m =>
      m.id === conversationId ? { ...m, chat: [], lastMessage: 'No messages' } : m
    ));
    showToast('Chat history cleared');
  }, [showToast]);

  const deleteConversation = useCallback((conversationId) => {
    setMessages(prev => prev.filter(m => m.id !== conversationId));
    showToast('Conversation deleted');
  }, [showToast]);

  const markNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const unreadMessagesCount = messages.reduce((sum, m) => sum + m.unread, 0);

  return (
    <AppContext.Provider value={{
      isLoggedIn,
      currentUser,
      posts,
      messages,
      users: USERS,
      followRequests,
      notifications,
      stories,
      following,
      isSettingsOpen,
      toast,
      unreadNotificationsCount,
      unreadMessagesCount,
      login,
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

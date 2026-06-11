const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'db.json');

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Password Hashing helpers
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, hash) {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return verifyHash === hash;
}

// Read database helper
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(getInitialSeedData());
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file:', error);
    return getInitialSeedData();
  }
}

// Write database helper
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing database file:', error);
  }
}

// Seed data generator
function getInitialSeedData() {
  const users = [
    {
      id: 'user_sundar',
      name: 'Sundar',
      username: 'sundar',
      email: 'sundar@example.com',
      ...hashPassword('password123'),
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sundar&backgroundColor=b6e3f4&clothingColor=3c4f5c',
      bio: 'Full-stack developer & content creator. Building awesome things with MERN Stack. 🚀',
      location: 'Hyderabad, India',
      website: 'sundar.dev',
      joinedDate: 'January 2024',
      coverGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      verified: true
    },
    {
      id: 'user_1',
      name: 'Alison Mars',
      username: 'alison',
      email: 'alison@example.com',
      ...hashPassword('password123'),
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=AlisonMars&backgroundColor=ffd5dc',
      bio: 'Hey there! I am using PingUp. Designer & traveler ✈️',
      location: 'New York, USA',
      website: '',
      joinedDate: 'March 2024',
      coverGradient: 'linear-gradient(135deg, #c4b5fd, #f9a8d4)',
      verified: true
    },
    {
      id: 'user_2',
      name: 'Richard John',
      username: 'richard_j',
      email: 'richard@example.com',
      ...hashPassword('password123'),
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=RichardJohn&backgroundColor=c0aede',
      bio: 'Designer & Developer | React enthusiast 💻',
      location: 'London, UK',
      website: 'richardj.io',
      joinedDate: 'February 2024',
      coverGradient: 'linear-gradient(135deg, #a8edea, #fed6e3)',
      verified: false
    },
    {
      id: 'user_3',
      name: 'John Warren',
      username: 'john_w',
      email: 'john@example.com',
      ...hashPassword('password123'),
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=JohnWarren&backgroundColor=d1f4e0',
      bio: 'Tech enthusiast & adventure seeker 🏔️ | Building the future',
      location: 'Sydney, Australia',
      website: '',
      joinedDate: 'December 2023',
      coverGradient: 'linear-gradient(135deg, #fccb90, #d57eeb)',
      verified: false
    },
    {
      id: 'user_4',
      name: 'Sarah Chen',
      username: 'sarah_c',
      email: 'sarah@example.com',
      ...hashPassword('password123'),
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=SarahChen&backgroundColor=ffdfbf',
      bio: 'Product Manager @ TechCorp | UX lover | Coffee addict ☕',
      location: 'Austin, TX',
      website: 'sarahchen.co',
      joinedDate: 'November 2023',
      coverGradient: 'linear-gradient(135deg, #84fab0, #8fd3f4)',
      verified: true
    },
    {
      id: 'user_5',
      name: 'Mike Dev',
      username: 'mikedev',
      email: 'mike@example.com',
      ...hashPassword('password123'),
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=MikeDev&backgroundColor=b9f2f0',
      bio: 'React & Node.js developer | Open source contributor',
      location: 'Remote 🌍',
      website: 'mikedev.tech',
      joinedDate: 'April 2024',
      coverGradient: 'linear-gradient(135deg, #f093fb, #f5576c)',
      verified: false
    },
    {
      id: 'user_6',
      name: 'Emma Wilson',
      username: 'emma_w',
      email: 'emma@example.com',
      ...hashPassword('password123'),
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=EmmaWilson&backgroundColor=e0f2fe',
      bio: 'Photographer & artist 📸 | Capturing beautiful moments',
      location: 'Paris, France',
      website: '',
      joinedDate: 'January 2024',
      coverGradient: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
      verified: true
    }
  ];

  const follows = [
    { followerId: 'user_sundar', followingId: 'user_1' },
    { followerId: 'user_sundar', followingId: 'user_3' },
    { followerId: 'user_1', followingId: 'user_sundar' },
    { followerId: 'user_2', followingId: 'user_sundar' },
    { followerId: 'user_3', followingId: 'user_sundar' },
    { followerId: 'user_4', followingId: 'user_sundar' }
  ];

  const posts = [
    {
      id: 'post_1',
      authorId: 'user_sundar',
      content: 'Stay ahead of the curve with fresh content on #code, #design, #startups, and everything in between. 🚀',
      image: 'https://picsum.photos/id/0/700/500',
      timestamp: '31 minutes ago',
      likes: ['user_2', 'user_3'],
      savedBy: [],
      reposts: 5,
      saves: 8,
      comments: [
        { id: 'c1', userId: 'user_1', text: 'Amazing content! 🔥', time: '25 min ago' },
        { id: 'c2', userId: 'user_2', text: 'Love this! Keep it up', time: '20 min ago' }
      ]
    },
    {
      id: 'post_2',
      authorId: 'user_1',
      content: 'Get ahead of the crowd — waitlist members receive exclusive early-bird rates. Join now and be among the first to experience the future! 🌟 #innovation #tech #startup',
      image: 'https://picsum.photos/id/1/700/500',
      timestamp: '22 days ago',
      likes: ['user_sundar'],
      savedBy: [],
      reposts: 18,
      saves: 22,
      comments: [
        { id: 'c3', userId: 'user_3', text: 'Count me in! 🙌', time: '21 days ago' }
      ]
    },
    {
      id: 'post_3',
      authorId: 'user_2',
      content: 'Just finished redesigning my portfolio! Loving the new dark mode aesthetic. #design #portfolio #uidesign #webdev',
      image: 'https://picsum.photos/id/180/700/500',
      timestamp: '2 hours ago',
      likes: ['user_sundar', 'user_4'],
      savedBy: [],
      reposts: 9,
      saves: 14,
      comments: []
    },
    {
      id: 'post_4',
      authorId: 'user_3',
      content: 'Morning hike views are unmatched. 🏔️ Nature is the best reset button. #travel #nature #hiking #mindfulness',
      image: 'https://picsum.photos/id/29/700/500',
      timestamp: '5 hours ago',
      likes: ['user_1'],
      savedBy: ['user_sundar'],
      reposts: 67,
      saves: 89,
      comments: [
        { id: 'c4', userId: 'user_4', text: 'Breathtaking! Where is this?', time: '4 hrs ago' },
        { id: 'c5', userId: 'user_sundar', text: 'Goals! 😍', time: '3 hrs ago' }
      ]
    }
  ];

  const stories = [
    { id: 'story_1', userId: 'user_1', type: 'image', media: 'https://picsum.photos/id/10/400/700', time: '20 minutes ago', seen: [] },
    { id: 'story_2', userId: 'user_sundar', type: 'image', media: 'https://picsum.photos/id/20/400/700', time: '20 minutes ago', seen: [] },
    { id: 'story_3', userId: 'user_3', type: 'image', media: 'https://picsum.photos/id/30/400/700', time: '22 minutes ago', seen: ['user_sundar'] }
  ];

  const messages = [
    { id: 'm1', senderId: 'user_1', receiverId: 'user_sundar', text: 'Hey! How are you doing?', timestamp: '6 days ago', read: true },
    { id: 'm2', senderId: 'user_sundar', receiverId: 'user_1', text: "Hey Alison! I'm great, thanks for asking 😊", timestamp: '6 days ago', read: true },
    { id: 'm3', senderId: 'user_1', receiverId: 'user_sundar', text: 'How are you?', timestamp: '6 days ago', read: false },
    { id: 'm4', senderId: 'user_sundar', receiverId: 'user_1', text: 'All good! Working on some exciting projects. You?', timestamp: '6 days ago', read: true },
    { id: 'm5', senderId: 'user_1', receiverId: 'user_sundar', text: 'Same here! Building something really cool 🚀', timestamp: '6 days ago', read: false }
  ];

  const notifications = [
    { id: 'n1', type: 'like', senderId: 'user_1', receiverId: 'user_sundar', postId: 'post_1', time: '2 min ago', read: false },
    { id: 'n2', type: 'comment', senderId: 'user_2', receiverId: 'user_sundar', postId: 'post_1', text: 'Amazing content! 🔥', time: '15 min ago', read: false },
    { id: 'n3', type: 'follow', senderId: 'user_3', receiverId: 'user_sundar', time: '1 hour ago', read: false }
  ];

  const followRequests = [
    { id: 'req_1', followerId: 'user_1', followingId: 'user_sundar', time: '2 hours ago' }
  ];

  return { users, follows, posts, stories, messages, notifications, followRequests };
}

// In-memory sessions store
const sessions = {};

// Custom Session Middleware
app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie || '';
  const cookies = {};
  cookieHeader.split(';').forEach(c => {
    const parts = c.split('=');
    if (parts.length === 2) {
      cookies[parts[0].trim()] = parts[1].trim();
    }
  });

  const sessionToken = cookies['__Host-session'];
  if (sessionToken && sessions[sessionToken]) {
    const userId = sessions[sessionToken];
    const db = readDb();
    const user = db.users.find(u => u.id === userId);
    if (user) {
      // Remove sensitive password fields before returning
      const { salt, hash, ...safeUser } = user;
      req.user = safeUser;
      req.sessionToken = sessionToken;
    }
  }
  next();
});

// Auth check middleware
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

// ─── AUTHENTICATION ROUTES ───────────────────────────────────

app.get('/api/auth/me', (req, res) => {
  if (req.user) {
    // Dynamically calculate followers & following count
    const db = readDb();
    const followers = db.follows.filter(f => f.followingId === req.user.id).length;
    const followingIds = db.follows.filter(f => f.followerId === req.user.id).map(f => f.followingId);
    const userPosts = db.posts.filter(p => p.authorId === req.user.id).length;
    
    res.json({
      ...req.user,
      followers,
      following: followingIds.length,
      followingIds,
      posts: userPosts
    });
  } else {
    res.status(401).json({ error: 'Not logged in' });
  }
});

app.post('/api/auth/signup', (req, res) => {
  const { name, username, email, password, avatar } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const formattedUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  const formattedEmail = email.trim().toLowerCase();

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  const db = readDb();

  if (db.users.some(u => u.email.toLowerCase() === formattedEmail)) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }
  if (db.users.some(u => u.username.toLowerCase() === formattedUsername)) {
    return res.status(400).json({ error: 'This username is already taken.' });
  }

  const newUser = {
    id: 'user_' + Date.now(),
    name: name.trim(),
    username: formattedUsername,
    email: formattedEmail,
    ...hashPassword(password),
    avatar: avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${formattedUsername}&backgroundColor=b6e3f4`,
    bio: "Hey there! I am using PingUp. Let's connect! 🚀",
    location: 'Remote 🌍',
    website: '',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    coverGradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
    verified: false
  };

  db.users.push(newUser);

  // Send a welcome message from Sundar
  const welcomeMsg1 = {
    id: 'msg_welcome_' + Date.now(),
    senderId: 'user_sundar',
    receiverId: newUser.id,
    text: 'Hey there! Welcome to PingUp! 🚀',
    timestamp: 'Just now',
    read: false
  };
  const welcomeMsg2 = {
    id: 'msg_welcome_2_' + Date.now(),
    senderId: 'user_sundar',
    receiverId: newUser.id,
    text: "Feel free to post, message people, or edit your profile. Let's connect!",
    timestamp: 'Just now',
    read: false
  };
  db.messages.push(welcomeMsg1, welcomeMsg2);

  // Send a welcome notification
  const welcomeNotification = {
    id: 'n_welcome_' + Date.now(),
    type: 'follow',
    senderId: 'user_sundar',
    receiverId: newUser.id,
    time: 'Just now',
    read: false
  };
  db.notifications.push(welcomeNotification);

  // Seed exactly one request for the new user so they have one to accept/delete!
  if (!db.followRequests) db.followRequests = [];
  const seedRequest = {
    id: 'req_' + Date.now(),
    followerId: 'user_1', // Alison Mars
    followingId: newUser.id,
    time: '2 hours ago'
  };
  db.followRequests.push(seedRequest);

  writeDb(db);

  // Start Session
  const sessionToken = crypto.randomBytes(32).toString('hex');
  sessions[sessionToken] = newUser.id;

  res.setHeader(
    'Set-Cookie',
    `__Host-session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Secure`
  );

  const { salt, hash, ...safeUser } = newUser;
  res.status(201).json({
    ...safeUser,
    followers: 0,
    following: 0,
    followingIds: [],
    posts: 0
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = readDb();
  const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user || !verifyPassword(password, user.salt, user.hash)) {
    return res.status(401).json({ error: 'Incorrect email or password' });
  }

  const sessionToken = crypto.randomBytes(32).toString('hex');
  sessions[sessionToken] = user.id;

  res.setHeader(
    'Set-Cookie',
    `__Host-session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Secure`
  );

  const followers = db.follows.filter(f => f.followingId === user.id).length;
  const followingIds = db.follows.filter(f => f.followerId === user.id).map(f => f.followingId);
  const userPosts = db.posts.filter(p => p.authorId === user.id).length;

  const { salt, hash, ...safeUser } = user;
  res.json({
    ...safeUser,
    followers,
    following: followingIds.length,
    followingIds,
    posts: userPosts
  });
});

app.post('/api/auth/logout', requireAuth, (req, res) => {
  delete sessions[req.sessionToken];
  res.setHeader(
    'Set-Cookie',
    '__Host-session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0'
  );
  res.json({ success: true });
});

// ─── POST ROUTES ─────────────────────────────────────────────

app.get('/api/posts', (req, res) => {
  const db = readDb();
  const postsForClient = db.posts.map(p => {
    const author = db.users.find(u => u.id === p.authorId) || { name: 'Deleted User', username: 'deleted', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=deleted' };
    const commentsFormatted = p.comments.map(c => {
      const commentUser = db.users.find(u => u.id === c.userId) || { name: 'Deleted User', username: 'deleted', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=deleted' };
      return {
        id: c.id,
        user: { id: commentUser.id, name: commentUser.name, username: commentUser.username, avatar: commentUser.avatar },
        text: c.text,
        time: c.time
      };
    });
    return {
      id: p.id,
      author: { id: author.id, name: author.name, username: author.username, avatar: author.avatar, verified: author.verified },
      content: p.content,
      image: p.image,
      timestamp: p.timestamp,
      likes: p.likes.length,
      comments: commentsFormatted,
      reposts: p.reposts || 0,
      saves: p.saves || 0,
      liked: req.user ? p.likes.includes(req.user.id) : false,
      saved: req.user ? (p.savedBy || []).includes(req.user.id) : false
    };
  });

  // Sort by ID or reverse chronological logic (we will keep original array order or reverse it to show newest first)
  res.json(postsForClient.reverse());
});

app.post('/api/posts', requireAuth, (req, res) => {
  const { content, image } = req.body;
  if (!content && !image) {
    return res.status(400).json({ error: 'Post must have content or an image' });
  }

  const db = readDb();
  const newPost = {
    id: 'post_' + Date.now(),
    authorId: req.user.id,
    content: content || '',
    image: image || null,
    timestamp: 'Just now',
    likes: [],
    savedBy: [],
    reposts: 0,
    saves: 0,
    comments: []
  };

  db.posts.push(newPost);
  writeDb(db);

  res.status(201).json({
    id: newPost.id,
    author: req.user,
    content: newPost.content,
    image: newPost.image,
    timestamp: newPost.timestamp,
    likes: 0,
    comments: [],
    reposts: 0,
    saves: 0,
    liked: false,
    saved: false
  });
});

app.delete('/api/posts/:id', requireAuth, (req, res) => {
  const db = readDb();
  const postIndex = db.posts.findIndex(p => p.id === req.params.id);

  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (db.posts[postIndex].authorId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to delete this post' });
  }

  db.posts.splice(postIndex, 1);
  writeDb(db);
  res.json({ success: true });
});

app.post('/api/posts/:id/like', requireAuth, (req, res) => {
  const db = readDb();
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const likedIndex = post.likes.indexOf(req.user.id);
  let liked = false;
  if (likedIndex === -1) {
    post.likes.push(req.user.id);
    liked = true;

    // Send notification to the post author
    if (post.authorId !== req.user.id) {
      db.notifications.push({
        id: 'n_like_' + Date.now(),
        type: 'like',
        senderId: req.user.id,
        receiverId: post.authorId,
        postId: post.id,
        time: 'Just now',
        read: false
      });
    }
  } else {
    post.likes.splice(likedIndex, 1);
  }

  writeDb(db);
  res.json({ liked, likesCount: post.likes.length });
});

app.post('/api/posts/:id/save', requireAuth, (req, res) => {
  const db = readDb();
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (!post.savedBy) post.savedBy = [];
  const savedIndex = post.savedBy.indexOf(req.user.id);
  let saved = false;

  if (savedIndex === -1) {
    post.savedBy.push(req.user.id);
    post.saves = (post.saves || 0) + 1;
    saved = true;
  } else {
    post.savedBy.splice(savedIndex, 1);
    post.saves = Math.max(0, (post.saves || 0) - 1);
  }

  writeDb(db);
  res.json({ saved, savesCount: post.saves });
});

app.post('/api/posts/:id/comment', requireAuth, (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  const db = readDb();
  const post = db.posts.find(p => p.id === req.params.id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const newComment = {
    id: 'c_' + Date.now(),
    userId: req.user.id,
    text: text.trim(),
    time: 'Just now'
  };

  post.comments.push(newComment);

  // Send notification to the post author
  if (post.authorId !== req.user.id) {
    db.notifications.push({
      id: 'n_comment_' + Date.now(),
      type: 'comment',
      senderId: req.user.id,
      receiverId: post.authorId,
      postId: post.id,
      text: text.trim().slice(0, 30),
      time: 'Just now',
      read: false
    });
  }

  writeDb(db);

  res.status(201).json({
    id: newComment.id,
    user: { id: req.user.id, name: req.user.name, username: req.user.username, avatar: req.user.avatar },
    text: newComment.text,
    time: newComment.time
  });
});

// ─── USER & FOLLOW ROUTES ───────────────────────────────────

app.get('/api/users', requireAuth, (req, res) => {
  const db = readDb();
  const safeUsers = db.users
    .filter(u => u.id !== req.user.id)
    .map(({ salt, hash, ...u }) => {
      const followers = db.follows.filter(f => f.followingId === u.id).length;
      const following = db.follows.filter(f => f.followerId === u.id).length;
      return {
        ...u,
        followers,
        following,
        mutualFriends: Math.floor(Math.random() * 3) // mock mutuals
      };
    });
  res.json(safeUsers);
});

app.get('/api/users/:username', requireAuth, (req, res) => {
  const db = readDb();
  const user = db.users.find(u => u.username.toLowerCase() === req.params.username.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const followers = db.follows.filter(f => f.followingId === user.id).length;
  const following = db.follows.filter(f => f.followerId === user.id).length;
  const userPosts = db.posts.filter(p => p.authorId === user.id).length;

  const { salt, hash, ...safeUser } = user;
  res.json({
    ...safeUser,
    followers,
    following,
    posts: userPosts
  });
});

app.post('/api/users/:id/follow', requireAuth, (req, res) => {
  const targetId = req.params.id;
  if (targetId === req.user.id) {
    return res.status(400).json({ error: 'You cannot follow yourself' });
  }

  const db = readDb();
  const targetUser = db.users.find(u => u.id === targetId);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  const followIndex = db.follows.findIndex(
    f => f.followerId === req.user.id && f.followingId === targetId
  );

  let isFollowing = false;
  if (followIndex === -1) {
    db.follows.push({ followerId: req.user.id, followingId: targetId });
    isFollowing = true;

    // Send notification
    db.notifications.push({
      id: 'n_follow_' + Date.now(),
      type: 'follow',
      senderId: req.user.id,
      receiverId: targetId,
      time: 'Just now',
      read: false
    });
  } else {
    db.follows.splice(followIndex, 1);
  }

  writeDb(db);
  res.json({ following: isFollowing });
});

// ─── FOLLOW REQUEST ROUTES ──────────────────────────────────
app.get('/api/follow-requests', requireAuth, (req, res) => {
  const db = readDb();
  if (!db.followRequests) db.followRequests = [];
  const requests = db.followRequests
    .filter(r => r.followingId === req.user.id)
    .map(r => {
      const user = db.users.find(u => u.id === r.followerId) || { name: 'Someone', username: 'someone', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=someone' };
      return {
        id: r.id,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio,
          followers: db.follows.filter(f => f.followingId === user.id).length
        },
        time: r.time
      };
    });
  res.json(requests);
});

app.post('/api/follow-requests/:id/accept', requireAuth, (req, res) => {
  const db = readDb();
  if (!db.followRequests) db.followRequests = [];
  const requestIndex = db.followRequests.findIndex(r => r.id === req.params.id && r.followingId === req.user.id);
  if (requestIndex === -1) {
    return res.status(404).json({ error: 'Request not found' });
  }

  const request = db.followRequests[requestIndex];

  // Add to follows if not already exists
  const exists = db.follows.some(f => f.followerId === request.followerId && f.followingId === req.user.id);
  if (!exists) {
    db.follows.push({ followerId: request.followerId, followingId: req.user.id });

    // Send notification
    db.notifications.push({
      id: 'n_accept_' + Date.now(),
      type: 'follow',
      senderId: req.user.id,
      receiverId: request.followerId,
      time: 'Just now',
      read: false
    });
  }

  // Remove request
  db.followRequests.splice(requestIndex, 1);
  writeDb(db);

  res.json({ success: true });
});

app.post('/api/follow-requests/:id/decline', requireAuth, (req, res) => {
  const db = readDb();
  if (!db.followRequests) db.followRequests = [];
  const requestIndex = db.followRequests.findIndex(r => r.id === req.params.id && r.followingId === req.user.id);
  if (requestIndex === -1) {
    return res.status(404).json({ error: 'Request not found' });
  }

  db.followRequests.splice(requestIndex, 1);
  writeDb(db);

  res.json({ success: true });
});

app.post('/api/profile/update', requireAuth, (req, res) => {
  const { name, bio, location, website, avatar, username, password } = req.body;

  const db = readDb();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (name !== undefined) user.name = name.trim();
  if (bio !== undefined) user.bio = bio.trim();
  if (location !== undefined) user.location = location.trim();
  if (website !== undefined) user.website = website.trim();
  if (avatar !== undefined) user.avatar = avatar;

  if (username !== undefined) {
    const formattedUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (formattedUsername !== user.username) {
      if (db.users.some(u => u.username.toLowerCase() === formattedUsername)) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
      user.username = formattedUsername;
    }
  }

  if (password !== undefined && password.length >= 8) {
    const hashed = hashPassword(password);
    user.salt = hashed.salt;
    user.hash = hashed.hash;
  } else if (password !== undefined && password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  writeDb(db);
  const { salt, hash, ...safeUser } = user;
  res.json(safeUser);
});

// ─── STORY ROUTES ────────────────────────────────────────────

app.get('/api/stories', requireAuth, (req, res) => {
  const db = readDb();
  const storiesForClient = db.stories.map(s => {
    const user = db.users.find(u => u.id === s.userId) || { name: 'Deleted User', username: 'deleted', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=deleted' };
    return {
      id: s.id,
      user: { id: user.id, name: user.name, username: user.username, avatar: user.avatar },
      type: s.type,
      media: s.media,
      time: s.time,
      seen: s.seen.includes(req.user.id)
    };
  });
  res.json(storiesForClient);
});

app.post('/api/stories', requireAuth, (req, res) => {
  const { type, media } = req.body;
  if (!media) {
    return res.status(400).json({ error: 'Story media is required' });
  }

  const db = readDb();
  const newStory = {
    id: 'story_' + Date.now(),
    userId: req.user.id,
    type: type || 'image',
    media,
    time: 'Just now',
    seen: []
  };

  db.stories.unshift(newStory);
  writeDb(db);

  res.status(201).json({
    id: newStory.id,
    user: req.user,
    type: newStory.type,
    media: newStory.media,
    time: newStory.time,
    seen: false
  });
});

app.delete('/api/stories/:id', requireAuth, (req, res) => {
  const db = readDb();
  const index = db.stories.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Story not found' });
  }

  if (db.stories[index].userId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to delete this story' });
  }

  db.stories.splice(index, 1);
  writeDb(db);
  res.json({ success: true });
});

// ─── MESSAGING ROUTES ─────────────────────────────────────────

app.get('/api/messages', requireAuth, (req, res) => {
  const db = readDb();
  // Find all conversations involving req.user.id
  const myMessages = db.messages.filter(
    m => m.senderId === req.user.id || m.receiverId === req.user.id
  );

  // Group by the other user's ID
  const conversationsMap = {};
  myMessages.forEach(m => {
    const otherUserId = m.senderId === req.user.id ? m.receiverId : m.senderId;
    if (!conversationsMap[otherUserId]) {
      conversationsMap[otherUserId] = [];
    }
    conversationsMap[otherUserId].push(m);
  });

  const formattedConversations = Object.keys(conversationsMap).map(otherUserId => {
    const otherUser = db.users.find(u => u.id === otherUserId) || { name: 'Deleted User', username: 'deleted', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=deleted', online: false };
    const chatHistory = conversationsMap[otherUserId].map(msg => ({
      id: msg.id,
      from: msg.senderId === req.user.id ? 'me' : 'them',
      text: msg.text,
      time: msg.timestamp
    }));
    
    // Sort chat messages chronological
    // For simplicity, keep original message order

    const lastMsg = chatHistory[chatHistory.length - 1];
    const unreadCount = conversationsMap[otherUserId].filter(
      m => m.receiverId === req.user.id && !m.read
    ).length;

    return {
      id: 'conv_' + otherUserId,
      user: { id: otherUser.id, name: otherUser.name, username: otherUser.username, avatar: otherUser.avatar, online: otherUser.online || false },
      lastMessage: lastMsg ? lastMsg.text : '',
      time: lastMsg ? lastMsg.time : 'Just now',
      unread: unreadCount,
      chat: chatHistory
    };
  });

  res.json(formattedConversations);
});

app.post('/api/messages', requireAuth, (req, res) => {
  const { conversationId, text } = req.body;
  if (!conversationId || !text || !text.trim()) {
    return res.status(400).json({ error: 'Receiver ID and text content are required' });
  }

  // conversationId format: "conv_{userId}"
  const receiverId = conversationId.replace('conv_', '');

  const db = readDb();
  const receiver = db.users.find(u => u.id === receiverId);
  if (!receiver) {
    return res.status(404).json({ error: 'Receiver not found' });
  }

  const newMsg = {
    id: 'm_' + Date.now(),
    senderId: req.user.id,
    receiverId: receiver.id,
    text: text.trim(),
    timestamp: 'Just now',
    read: false
  };

  db.messages.push(newMsg);
  writeDb(db);

  res.status(201).json({
    id: newMsg.id,
    from: 'me',
    text: newMsg.text,
    time: newMsg.timestamp
  });
});

// ─── NOTIFICATION ROUTES ─────────────────────────────────────

app.get('/api/notifications', requireAuth, (req, res) => {
  const db = readDb();
  const myNotifs = db.notifications.filter(n => n.receiverId === req.user.id);
  
  const formatted = myNotifs.map(n => {
    const sender = db.users.find(u => u.id === n.senderId) || { name: 'Someone', username: 'someone', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=someone' };
    let post = null;
    if (n.postId) {
      const p = db.posts.find(x => x.id === n.postId);
      if (p) {
        post = { id: p.id, image: p.image };
      }
    }
    return {
      id: n.id,
      type: n.type,
      user: { id: sender.id, name: sender.name, username: sender.username, avatar: sender.avatar },
      post,
      text: n.text || '',
      time: n.time,
      read: n.read
    };
  });

  res.json(formatted.reverse());
});

app.post('/api/notifications/read', requireAuth, (req, res) => {
  const db = readDb();
  db.notifications.forEach(n => {
    if (n.receiverId === req.user.id) {
      n.read = true;
    }
  });
  writeDb(db);
  res.json({ success: true });
});

// Start server
app.listen(PORT, '127.0.0.1', () => {
  console.log(`API Backend Server listening on http://127.0.0.1:${PORT}`);
});

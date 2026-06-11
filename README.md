# 📱 PingUp - Truly Connect

🚀 **Live Frontend Demo (Vercel):** [https://ping-up-nva1.vercel.app/](https://ping-up-nva1.vercel.app/)

[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-brightgreen?logo=vercel&logoColor=white)](https://ping-up-nva1.vercel.app/)
[![Render Deployment](https://img.shields.io/badge/Render-Deployed-purple?logo=render&logoColor=white)](https://ping-up-9buz.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**PingUp** is a premium, full-stack social network web application inspired by modern platforms like Instagram and Twitter. Built with a dedicated React/Vite frontend and a Node.js/Express backend, it features dynamic user account creation, real-time messaging flows, story creation, notifications, follow request approvals, and profile management with persistent storage.

---

## 🏗️ Architecture & Project Structure

The project is structured as a monorepo containing:
* `/frontend`: The React.js client interface created with Vite.
* `/backend`: Node.js & Express server handling API requests, user session tracking, password hashing, and storage.

---

## ✨ Features

### 1. 🔑 Dynamic User Account Management & Auth
- **User-Specific Profiles**: No shared static accounts! Users can sign up with their own display name, username, email, and password.
- **Security**: Secure password hashing using PBKDF2 cryptography with unique salts for every user.
- **Cookie Session Store**: HTTP-only cookied sessions preserve login state securely across requests.
- **Starting Fresh**: New accounts initialize with `0 followers`, `0 following`, and `0 posts`.

### 2. 📳 Interactive Feed & Post Management
- **Media Uploads**: Publish text posts with image links.
- **Rich Engagements**: Like, bookmark/save, comment, and delete posts with instant UI counters synced with the backend.
- **Media Lightbox**: Click on any post image to view it in full screen.

### 3. 📸 Instagram-Style Stories
- **Creation Flow**: Create and upload photo/video stories.
- **Timer Engine**: Viewing photo stories is controlled by a precise 10-second timer, while video stories play in full before automatically advancing.
- **Skip-on-Tap Gesture**: Tap anywhere on the story viewer screen to instantly skip/advance to the next story.

### 4. 💬 Live Message Center
- **Direct Messaging Flow**: Message another user directly by clicking "Message" on their profile card.
- **Dynamic Conversations**: Instant message sending and inbox re-fetching.
- **Status Checks**: Visual indicator of online users and unread counts.
- **Inbox Cleanup**: Dedicated controls to clear chat history or delete conversations entirely.

### 5. 👥 Follow & Connection Engine
- **Follow Requests**: New accounts receive a seeded request that can be accepted or deleted.
- **Follow Requests Panel**: Decline/delete or approve incoming follows with real-time followers/following counter updates.
- **Discovery Grid**: Search and explore other profiles on a dedicated discover page.

---

## 🛠️ Tech Stack

- **Frontend**: React (v19), React Router (v7), Vanilla CSS (responsive glassmorphism layout, customized animations).
- **Backend**: Node.js, Express, Custom Cookie Session Middleware, PBKDF2 Password Cryptography.
- **Database**: Local JSON-file database (`db.json`) on backend.
- **Deployment**: Vercel (Frontend), Render (Backend).

---

## 🚀 Local Development Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   The backend will run on [http://localhost:5000](http://localhost:5000).

### 2. Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   Open the development URL (e.g. [http://localhost:5173](http://localhost:5173)) in your browser.

---

## ☁️ Deployment

### 1. Backend (Render)
Hosted as a Node.js web service on [Render](https://render.com/) pointing to the `/backend` subdirectory:
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Port**: `5000` (Listen address bound to `0.0.0.0`)

### 2. Frontend (Vercel)
Hosted on [Vercel](https://vercel.com/) pointing to the `/frontend` subdirectory:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **API Rewrite Proxy**: `vercel.json` is configured to route `/api/:path*` traffic directly to the Render endpoint, avoiding CORS issues and enabling secure cookie sharing.



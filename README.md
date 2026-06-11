# 📱 PingUp - Truly Connect

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**PingUp** is a premium, high-fidelity social network mockup inspired by modern platforms like Instagram and Twitter. Designed from the ground up to feel smooth, visual-heavy, and alive, PingUp offers a responsive layout that looks stunning on laptops, desktops, and mobile devices alike.

---

## ✨ Features

### 1. 📳 Interactive Feed & Post Management
- **Media Lightbox**: Click on any post image to view it in full screen.
- **Rich Engagements**: Like, bookmark/save, comment, and repost with instant UI counters.
- **Delete Option**: Delete your own posts directly via the post dropdown menu, instantly recalculating counts.

### 2. 📸 Instagram-Style Stories
- **Creation Flow**: Create and upload photo/video stories.
- **Timer Engine**: Viewing photo stories is controlled by a precise 10-second timer, while video stories play in full before automatically advancing.
- **Skip-on-Tap Gesture**: Click anywhere on the story viewer screen to instantly skip/advance to the next story.
- **Story Deletion**: Directly delete your own stories using the red trash button in the header.

### 3. 💬 Real-Time Message Center
- **Dynamic Conversations**: Engage in chat threads with visual status checks (Online/Offline).
- **Unread Clearing**: Opening a conversation automatically clears unread counts across all badges (in sidebar, contacts list, etc.).
- **Header Actions Dropdown**: Three-dots options menu in every chat to:
  - 🧹 Clear chat history.
  - 🗑️ Delete the entire conversation.
  - 🔔 Mute notifications.

### 4. ⚙️ Account & Profile Settings Drawer
- **Responsive Drawer Panel**: Slides out from the right on any page (replaces empty spaces on wide viewports).
- **Profile Edit**: Modify display name, bio, website, location, and update avatar (Dicebear seed generation or file base64 uploads).
- **Security & Account**: Change username and password with validation.
- **Global Invalidation**: Changes to credentials immediately propagate to updating posts and stories.

### 5. 👥 Connections & Social Discovery
- **Discovery Grid**: Search and explore other profiles on a dedicated discover page.
- **Connections & Requests**: Approve or decline incoming requests, view following lists, and toggle follows dynamically.

---

## 🛠️ Tech Stack

- **Core**: React, Javascript, HTML5.
- **Styling**: Vanilla CSS (Tailwind avoided for customized glassmorphic design and control over animations).
- **Icons**: `react-icons` (FontAwesome).
- **Build Tool**: Vite (Fast HMR & clean bundler output).

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the project.
2. Open terminal in the directory and install dependencies:
   ```bash
   npm install
   ```

### Development Server
Run the local dev server:
   ```bash
   npm run dev
   ```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
Build the bundle for deployment:
   ```bash
   npm run build
   ```

---

## 📤 Uploading to GitHub

To publish this project to your GitHub repository, run the following commands in your project root directory:

1. **Initialize Git Repository**:
   ```bash
   git init
   ```

2. **Add all files to staging**:
   ```bash
   git add .
   ```

3. **Create the initial commit**:
   ```bash
   git commit -m "feat: complete PingUp application with delete options, settings drawer, and space optimization"
   ```

4. **Rename branch to main**:
   ```bash
   git branch -M main
   ```

5. **Link to your GitHub Remote Repository**:
   *(Replace `<username>` and `<repo-name>` with your actual GitHub info)*
   ```bash
   git remote add origin https://github.com/<username>/<repo-name>.git
   ```

6. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

---

## 🚀 Deployment

We recommend deploying this project on **Vercel** because it offers instant builds, zero-config for React/Vite, automatic CDN routing, and seamless integration with GitHub.

### Deploying to Vercel

1. **Sign Up/Login**: Go to [Vercel](https://vercel.com/) and sign up using your GitHub account.
2. **Import Project**: Click on **Add New** > **Project** on your Vercel Dashboard.
3. **Connect Repository**: Select and import your `Ping---Up` repository from the list.
4. **Configure Settings**:
   - Vercel automatically detects the Vite setup and sets the build command to `npm run build` and the output directory to `dist`.
   - Leave all standard settings as default.
5. **Deploy**: Click **Deploy**. Vercel will build and serve your app in under a minute!
6. **Automatic Updates**: Every time you commit and push to your GitHub `main` branch, Vercel will automatically trigger a new deployment.


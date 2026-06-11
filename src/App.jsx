import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Toast, SettingsDrawer } from './components/SharedComponents';
import Sidebar from './components/Sidebar';

// Pages
import LoginPage from './pages/LoginPage';
import FeedPage from './pages/FeedPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import MessagesPage from './pages/MessagesPage';
import ConnectionsPage from './pages/ConnectionsPage';
import DiscoverPage from './pages/DiscoverPage';
import FollowRequestsPage from './pages/FollowRequestsPage';
import FollowingPage from './pages/FollowingPage';
import NotificationsPage from './pages/NotificationsPage';

import './index.css';

// ─── Protected Route ──────────────────────────────────────
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useApp();
  if (!isLoggedIn) return <Navigate to="/" replace />;
  return children;
}

// ─── App Shell (with Sidebar) ─────────────────────────────
function AppShell({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </div>
  );
}

// ─── Root Router ──────────────────────────────────────────
function AppRoutes() {
  const { isLoggedIn, toast } = useApp();

  return (
    <>
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/feed" replace /> : <LoginPage />}
        />

        {/* Protected — All inside AppShell */}
        <Route path="/feed" element={
          <ProtectedRoute>
            <AppShell><FeedPage /></AppShell>
          </ProtectedRoute>
        } />

        <Route path="/profile/:username" element={
          <ProtectedRoute>
            <AppShell><ProfilePage /></AppShell>
          </ProtectedRoute>
        } />

        <Route path="/create-post" element={
          <ProtectedRoute>
            <AppShell><CreatePostPage /></AppShell>
          </ProtectedRoute>
        } />

        <Route path="/messages" element={
          <ProtectedRoute>
            <AppShell><MessagesPage /></AppShell>
          </ProtectedRoute>
        } />

        <Route path="/connections" element={
          <ProtectedRoute>
            <AppShell><ConnectionsPage /></AppShell>
          </ProtectedRoute>
        } />

        <Route path="/discover" element={
          <ProtectedRoute>
            <AppShell><DiscoverPage /></AppShell>
          </ProtectedRoute>
        } />

        <Route path="/following" element={
          <ProtectedRoute>
            <AppShell><FollowingPage /></AppShell>
          </ProtectedRoute>
        } />

        <Route path="/follow-requests" element={
          <ProtectedRoute>
            <AppShell><FollowRequestsPage /></AppShell>
          </ProtectedRoute>
        } />

        <Route path="/notifications" element={
          <ProtectedRoute>
            <AppShell><NotificationsPage /></AppShell>
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Settings Drawer */}
      <SettingsDrawer />

      {/* Global Toast */}
      <Toast toast={toast} />
    </>
  );
}

// ─── Main App ─────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

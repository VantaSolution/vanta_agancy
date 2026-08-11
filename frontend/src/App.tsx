import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { WebsiteProvider } from '@/context/WebsiteContext';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DashboardPage } from '@/pages/admin/DashboardPage';
import { ProjectsPage } from '@/pages/admin/ProjectsPage';
import { ServicesPage } from '@/pages/admin/ServicesPage';
import { MessagesPage } from '@/pages/admin/MessagesPage';
import { ContentPage } from '@/pages/admin/ContentPage';
import { MediaPage } from '@/pages/admin/MediaPage';
import { SettingsPage } from '@/pages/admin/SettingsPage';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-label">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Website */}
      <Route path="/" element={<HomePage />} />

      {/* Admin Auth */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Admin Panel (Protected) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="content" element={<ContentPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WebsiteProvider>
          <AppRoutes />
        </WebsiteProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

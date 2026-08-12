import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { WebsiteProvider } from '@/context/WebsiteContext';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { AdminLayout } from '@/components/admin/AdminLayout';

// Route-level code-splitting for Admin Panel pages
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const ProjectsPage = lazy(() => import('@/pages/admin/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const ServicesPage = lazy(() => import('@/pages/admin/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const MessagesPage = lazy(() => import('@/pages/admin/MessagesPage').then((m) => ({ default: m.MessagesPage })));
const ContentPage = lazy(() => import('@/pages/admin/ContentPage').then((m) => ({ default: m.ContentPage })));
const MediaPage = lazy(() => import('@/pages/admin/MediaPage').then((m) => ({ default: m.MediaPage })));
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage').then((m) => ({ default: m.SettingsPage })));

const PageLoader = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div className="text-label" style={{ color: 'var(--color-accent)', fontWeight: 500 }}>Loading...</div>
  </div>
);

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Website — Eagerly loaded for zero-delay paint */}
      <Route path="/" element={<HomePage />} />

      {/* Admin Auth */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Admin Panel (Protected + Lazy Loaded) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Suspense fallback={<PageLoader />}><DashboardPage /></Suspense>} />
        <Route path="projects" element={<Suspense fallback={<PageLoader />}><ProjectsPage /></Suspense>} />
        <Route path="services" element={<Suspense fallback={<PageLoader />}><ServicesPage /></Suspense>} />
        <Route path="messages" element={<Suspense fallback={<PageLoader />}><MessagesPage /></Suspense>} />
        <Route path="content" element={<Suspense fallback={<PageLoader />}><ContentPage /></Suspense>} />
        <Route path="media" element={<Suspense fallback={<PageLoader />}><MediaPage /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageLoader />}><SettingsPage /></Suspense>} />
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

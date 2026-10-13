import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/i18n';
import { messagesAPI } from '@/api/endpoints';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Mail,
  FileText,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const { t, isRtl } = useTranslation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    messagesAPI.list().then((messages) => {
      setUnreadCount(messages.filter((m) => m.status === 'new').length);
    }).catch(() => {});
  }, []);

  // Handle escape key to close mobile sidebar and body scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: t('admin.nav.dashboard'), path: '/admin', id: 'dashboard' },
    { icon: FolderKanban, label: t('admin.nav.projects'), path: '/admin/projects', id: 'projects' },
    { icon: Wrench, label: t('admin.nav.services'), path: '/admin/services', id: 'services' },
    { icon: Mail, label: t('admin.nav.messages'), path: '/admin/messages', id: 'messages' },
    { icon: FileText, label: t('admin.nav.content'), path: '/admin/content', id: 'content' },
    { icon: Image, label: t('admin.nav.media'), path: '/admin/media', id: 'media' },
    { icon: Settings, label: t('admin.nav.settings'), path: '/admin/settings', id: 'settings' },
  ];

  const sidebarWidth = '260px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 998,
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}
        style={{
          width: sidebarWidth,
          position: 'fixed',
          top: 0,
          bottom: 0,
          insetInlineStart: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem 0',
          zIndex: 999,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Logo & Admin Badge */}
        <div style={{ padding: '0 1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a
            href="/"
            target="_blank"
            style={{
              fontFamily: isRtl ? 'var(--font-arabic-heading)' : 'var(--font-heading)',
              fontSize: '1.125rem',
              fontWeight: 700,
              letterSpacing: isRtl ? 'normal' : '0.08em',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
            }}
          >
            VANTA<span style={{ color: 'var(--color-accent)' }}>.</span>
          </a>
          <span
            style={{
              padding: '2px 8px',
              fontSize: '0.625rem',
              fontWeight: 600,
              letterSpacing: isRtl ? 'normal' : '0.1em',
              color: 'var(--color-accent)',
              border: '1px solid var(--color-accent-muted)',
              borderRadius: '4px',
              textTransform: 'uppercase',
            }}
          >
            {t('admin.badge')}
          </span>
        </div>

        {/* Language switcher inside sidebar */}
        <div style={{ padding: '0 1.5rem', marginBottom: '1.25rem' }}>
          <LanguageToggle variant="button" style={{ width: '100%', justifyContent: 'center' }} />
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '0 0.75rem', overflowY: 'auto' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setIsSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                backgroundColor: isActive ? 'var(--color-bg-elevated)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s ease',
                marginBottom: '2px',
                position: 'relative',
              })}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
              {item.id === 'messages' && unreadCount > 0 && (
                <span
                  style={{
                    marginInlineStart: 'auto',
                    padding: '1px 7px',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    color: 'var(--color-bg-primary)',
                    backgroundColor: 'var(--color-accent)',
                    borderRadius: '10px',
                    minWidth: '20px',
                    textAlign: 'center',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User & Logout */}
        <div style={{ padding: '0 1.5rem', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-accent-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-accent)',
              }}
            >
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.name || 'Admin'}
              </p>
              <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} dir="ltr">
                {user?.email || 'admin@vanta.studio'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 0',
              fontSize: '0.8125rem',
              color: 'var(--color-text-muted)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s ease',
              width: '100%',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-status-error)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <LogOut size={16} className="rtl-flip" />
            <span>{t('admin.signOut')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className="admin-main"
        style={{
          flex: 1,
          minWidth: 0,
          maxWidth: '100%',
          marginInlineStart: sidebarWidth,
          minHeight: '100vh',
        }}
      >
        {/* Top bar (mobile) */}
        <div
          className="admin-topbar"
          style={{
            display: 'none',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '12px 1.5rem',
            backgroundColor: 'var(--color-bg-surface)',
            borderBottom: '1px solid var(--color-border-subtle)',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              padding: '6px',
              color: 'var(--color-text-primary)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label={t('nav.menu')}
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span
            style={{
              fontFamily: isRtl ? 'var(--font-arabic-heading)' : 'var(--font-heading)',
              fontSize: '0.9375rem',
              fontWeight: 700,
              letterSpacing: isRtl ? 'normal' : '0.06em',
            }}
          >
            VANTA<span style={{ color: 'var(--color-accent)' }}>.</span>
          </span>
          <LanguageToggle variant="badge" />
        </div>

        {/* Page content */}
        <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)', minWidth: 0, maxWidth: '100%' }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          [dir="rtl"] .admin-sidebar {
            transform: translateX(100%);
          }
          .admin-sidebar.open {
            transform: translateX(0) !important;
          }
          .admin-main {
            margin-inline-start: 0 !important;
          }
          .admin-topbar {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}

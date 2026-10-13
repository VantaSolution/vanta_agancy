import React, { useEffect, useState } from 'react';
import { dashboardAPI, projectsAPI, messagesAPI } from '@/api/endpoints';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { formatNumber } from '@/utils/formatters';
import { FolderKanban, Eye, FileText, Mail, ArrowUpRight } from 'lucide-react';
import type { DashboardStats, Project, ContactMessage } from '@/types';

export function DashboardPage() {
  const navigate = useNavigate();
  const { t, decode, language } = useTranslation();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    dashboardAPI.getStats().then(setStats).catch(() => {});
    projectsAPI.list().then((p) => setRecentProjects(p.slice(0, 5))).catch(() => {});
    messagesAPI.list().then((m) => setRecentMessages(m.slice(0, 5))).catch(() => {});
  }, []);

  const statCards = stats ? [
    {
      label: t('admin.dashboard.totalProjects'),
      value: formatNumber(stats.totalProjects, language),
      icon: FolderKanban,
      color: 'var(--color-accent)',
    },
    {
      label: t('admin.dashboard.published'),
      value: formatNumber(stats.publishedProjects, language),
      icon: Eye,
      color: 'var(--color-status-success)',
    },
    {
      label: t('admin.dashboard.drafts'),
      value: formatNumber(stats.draftProjects, language),
      icon: FileText,
      color: 'var(--color-status-warning)',
    },
    {
      label: t('admin.dashboard.messages'),
      value: formatNumber(stats.totalMessages, language),
      icon: Mail,
      color: 'var(--color-status-info)',
      badge: stats.unreadMessages > 0 ? `${formatNumber(stats.unreadMessages, language)} ${t('admin.dashboard.newBadge')}` : undefined,
    },
  ] : [];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.375rem' }}>
          {t('admin.dashboard.title')}
        </h1>
        <p className="text-body-sm">{t('admin.dashboard.subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((card) => (
          <div key={card.label} className="admin-card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="text-label" style={{ fontSize: '0.6875rem' }}>{card.label}</span>
              <card.icon size={18} style={{ color: card.color }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {card.value}
              </span>
              {card.badge && (
                <span style={{ fontSize: '0.6875rem', fontWeight: 500, color: card.color }}>{card.badge}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent content */}
      <div className="admin-content-grid">
        {/* Recent Projects */}
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600 }}>
              {t('admin.dashboard.recentProjects')}
            </h2>
            <button
              onClick={() => navigate('/admin/projects')}
              style={{ fontSize: '0.75rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              <span>{t('common.viewAll')}</span>
              <ArrowUpRight size={12} className="rtl-arrow-up-right" />
            </button>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-body-sm" style={{ textAlign: 'center', padding: '2rem 0' }}>
              {t('admin.dashboard.noProjectsYet')}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    transition: 'background 0.15s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/admin/projects')}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>
                    {decode(project.name)}
                  </span>
                  <span
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.625rem',
                      fontWeight: 500,
                      borderRadius: '4px',
                      backgroundColor: project.isPublished ? 'var(--color-status-success-muted)' : 'var(--color-status-warning-muted)',
                      color: project.isPublished ? 'var(--color-status-success)' : 'var(--color-status-warning)',
                    }}
                  >
                    {project.isPublished ? t('status.published') : t('status.draft')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600 }}>
              {t('admin.dashboard.recentMessages')}
            </h2>
            <button
              onClick={() => navigate('/admin/messages')}
              style={{ fontSize: '0.75rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              <span>{t('common.viewAll')}</span>
              <ArrowUpRight size={12} className="rtl-arrow-up-right" />
            </button>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-body-sm" style={{ textAlign: 'center', padding: '2rem 0' }}>
              {t('admin.dashboard.noMessagesYet')}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    transition: 'background 0.15s ease',
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate('/admin/messages')}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-elevated)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: msg.status === 'new' ? 600 : 400 }}>
                      {msg.name}
                    </span>
                    {msg.projectType && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginInlineStart: '8px' }}>
                        {decode(msg.projectType)}
                      </span>
                    )}
                  </div>
                  {msg.status === 'new' && (
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-content-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1.5rem;
          min-width: 0;
        }
        .admin-content-grid > div {
          min-width: 0;
        }
        @media (max-width: 768px) {
          .admin-content-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
}

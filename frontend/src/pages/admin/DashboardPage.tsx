import React, { useEffect, useState } from 'react';
import { dashboardAPI, projectsAPI, messagesAPI } from '@/api/endpoints';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Eye, FileText, Mail, ArrowUpRight } from 'lucide-react';
import type { DashboardStats, Project, ContactMessage } from '@/types';

export function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    dashboardAPI.getStats().then(setStats);
    projectsAPI.list().then((p) => setRecentProjects(p.slice(0, 5)));
    messagesAPI.list().then((m) => setRecentMessages(m.slice(0, 5)));
  }, []);

  const statCards = stats ? [
    { label: 'Total Projects', value: stats.totalProjects, icon: FolderKanban, color: 'var(--color-accent)' },
    { label: 'Published', value: stats.publishedProjects, icon: Eye, color: 'var(--color-status-success)' },
    { label: 'Drafts', value: stats.draftProjects, icon: FileText, color: 'var(--color-status-warning)' },
    { label: 'Messages', value: stats.totalMessages, icon: Mail, color: 'var(--color-status-info)', badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} new` : undefined },
  ] : [];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.375rem' }}>
          Dashboard
        </h1>
        <p className="text-body-sm">Overview of your agency website</p>
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Projects */}
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600 }}>Recent Projects</h2>
            <button onClick={() => navigate('/admin/projects')} style={{ fontSize: '0.75rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowUpRight size={12} />
            </button>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-body-sm" style={{ textAlign: 'center', padding: '2rem 0' }}>No projects yet</p>
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
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{project.name}</span>
                  <span
                    style={{
                      padding: '2px 8px',
                      fontSize: '0.625rem',
                      fontWeight: 500,
                      borderRadius: '4px',
                      backgroundColor: project.isPublished ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: project.isPublished ? 'var(--color-status-success)' : 'var(--color-status-warning)',
                    }}
                  >
                    {project.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Messages */}
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 600 }}>Recent Messages</h2>
            <button onClick={() => navigate('/admin/messages')} style={{ fontSize: '0.75rem', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowUpRight size={12} />
            </button>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-body-sm" style={{ textAlign: 'center', padding: '2rem 0' }}>No messages yet</p>
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
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)', marginLeft: '8px' }}>
                      {msg.projectType}
                    </span>
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
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

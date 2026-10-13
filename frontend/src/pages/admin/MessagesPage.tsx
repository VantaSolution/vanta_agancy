import React, { useEffect, useState } from 'react';
import { messagesAPI } from '@/api/endpoints';
import { useTranslation } from '@/i18n';
import { formatDateTime, formatNumber } from '@/utils/formatters';
import { Mail, MailOpen, Reply, Archive, Trash2, ArrowLeft } from 'lucide-react';
import type { ContactMessage, MessageStatus } from '@/types';

const statusColors: Record<MessageStatus, string> = {
  new: 'var(--color-accent)',
  read: 'var(--color-status-info)',
  replied: 'var(--color-status-success)',
  archived: 'var(--color-text-dim)',
};

export function MessagesPage() {
  const { t, decode, language, isRtl } = useTranslation();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<MessageStatus | 'all'>('all');

  const statusLabels: Record<MessageStatus, string> = {
    new: t('status.new'),
    read: t('status.read'),
    replied: t('status.replied'),
    archived: t('status.archived'),
  };

  const load = () => messagesAPI.list().then(setMessages).catch(() => {});
  useEffect(() => { load(); }, []);

  const filtered = filter === 'all' ? messages : messages.filter((m) => m.status === filter);

  const handleStatusChange = async (id: string, status: MessageStatus) => {
    await messagesAPI.updateStatus(id, status);
    load();
    if (selectedMessage?.id === id) {
      setSelectedMessage((prev) => prev ? { ...prev, status } : null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.messages.deleteConfirm'))) {
      await messagesAPI.delete(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
      load();
    }
  };

  const openMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'new') {
      await messagesAPI.updateStatus(message.id, 'read');
      load();
    }
  };

  const filterOptions: { key: MessageStatus | 'all'; label: string }[] = [
    { key: 'all', label: t('admin.messages.filterAll') },
    { key: 'new', label: t('admin.messages.filterNew') },
    { key: 'read', label: t('admin.messages.filterRead') },
    { key: 'replied', label: t('admin.messages.filterReplied') },
    { key: 'archived', label: t('admin.messages.filterArchived') },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>
          {t('admin.messages.title')}
        </h1>
        <p className="text-body-sm">
          {t('admin.messages.subtitle', {
            total: formatNumber(messages.length, language),
            unread: formatNumber(messages.filter((m) => m.status === 'new').length, language),
          })}
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {filterOptions.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: filter === f.key ? 600 : 400,
              color: filter === f.key ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
              backgroundColor: filter === f.key ? 'var(--color-accent)' : 'var(--color-bg-surface)',
              border: `1px solid ${filter === f.key ? 'var(--color-accent)' : 'var(--color-border-subtle)'}`,
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {selectedMessage ? (
        /* Message Detail */
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <button
            onClick={() => setSelectedMessage(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8125rem',
              color: 'var(--color-text-muted)',
              marginBottom: '1.5rem',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
            }}
          >
            <ArrowLeft size={16} className="rtl-rotate-180" />
            <span>{t('admin.messages.backToInbox')}</span>
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                {selectedMessage.name}
              </h2>
              <a href={`mailto:${selectedMessage.email}`} style={{ fontSize: '0.875rem', color: 'var(--color-accent)', textDecoration: 'none', direction: 'ltr', display: 'inline-block' }}>
                {selectedMessage.email}
              </a>
            </div>
            <span style={{ padding: '3px 10px', fontSize: '0.6875rem', fontWeight: 500, borderRadius: '4px', backgroundColor: `${statusColors[selectedMessage.status]}20`, color: statusColors[selectedMessage.status] }}>
              {statusLabels[selectedMessage.status]}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: '8px' }}>
            {selectedMessage.company && (
              <div>
                <span className="text-label" style={{ fontSize: '0.625rem' }}>{t('admin.messages.company')}</span>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>{selectedMessage.company}</p>
              </div>
            )}
            {selectedMessage.projectType && (
              <div>
                <span className="text-label" style={{ fontSize: '0.625rem' }}>{t('admin.messages.projectType')}</span>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>{decode(selectedMessage.projectType)}</p>
              </div>
            )}
            {selectedMessage.budgetRange && (
              <div>
                <span className="text-label" style={{ fontSize: '0.625rem' }}>{t('admin.messages.budget')}</span>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>{decode(selectedMessage.budgetRange)}</p>
              </div>
            )}
            <div>
              <span className="text-label" style={{ fontSize: '0.625rem' }}>{t('admin.messages.receivedAt')}</span>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>{formatDateTime(selectedMessage.createdAt, language)}</p>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <span className="text-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.625rem' }}>
              {t('contact.messageLabel')}
            </span>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>
              {selectedMessage.message}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a
              href={`mailto:${selectedMessage.email}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.8125rem', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-primary)', fontWeight: 600, borderRadius: '6px', textDecoration: 'none' }}
            >
              <Reply size={14} className="rtl-flip" />
              <span>{t('admin.messages.replyViaEmail')}</span>
            </a>
            {selectedMessage.status === 'new' && (
              <button
                onClick={() => handleStatusChange(selectedMessage.id, 'read')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.8125rem', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '6px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <MailOpen size={14} />
                <span>{t('admin.messages.markRead')}</span>
              </button>
            )}
            {selectedMessage.status !== 'replied' && (
              <button
                onClick={() => handleStatusChange(selectedMessage.id, 'replied')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.8125rem', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '6px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <Reply size={14} className="rtl-flip" />
                <span>{t('admin.messages.markReplied')}</span>
              </button>
            )}
            {selectedMessage.status !== 'archived' && (
              <button
                onClick={() => handleStatusChange(selectedMessage.id, 'archived')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.8125rem', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '6px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                <Archive size={14} />
                <span>{t('admin.messages.archive')}</span>
              </button>
            )}
            <button
              onClick={() => handleDelete(selectedMessage.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.8125rem', backgroundColor: 'var(--color-status-error-muted)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '6px', color: 'var(--color-status-error)', cursor: 'pointer' }}
            >
              <Trash2 size={14} />
              <span>{t('admin.messages.delete')}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Message List */
        <div className="admin-card" style={{ overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <Mail size={32} style={{ color: 'var(--color-text-dim)', margin: '0 auto 1rem' }} />
              <p className="text-body-sm">{t('admin.messages.noMessages')}</p>
            </div>
          ) : (
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((msg, index) => (
              <div
                key={msg.id}
                onClick={() => openMessage(msg)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderBottom: index < filtered.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  backgroundColor: msg.status === 'new' ? 'var(--color-bg-selected)' : 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = msg.status === 'new' ? 'var(--color-bg-selected)' : 'transparent')}
              >
                {msg.status === 'new' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: msg.status === 'new' ? 600 : 400, color: 'var(--color-text-primary)' }}>{msg.name}</span>
                    {msg.company && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>• {msg.company}</span>}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>{msg.message}</p>
                </div>
                <div style={{ textAlign: 'end', flexShrink: 0 }}>
                  {msg.projectType && <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{decode(msg.projectType)}</span>}
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)' }}>{formatDateTime(msg.createdAt, language)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

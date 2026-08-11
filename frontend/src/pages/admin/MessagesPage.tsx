import React, { useEffect, useState } from 'react';
import { messagesAPI } from '@/api/endpoints';
import { Mail, MailOpen, Reply, Archive, Trash2, X, ArrowLeft } from 'lucide-react';
import type { ContactMessage, MessageStatus } from '@/types';

const statusColors: Record<MessageStatus, string> = {
  new: 'var(--color-accent)',
  read: 'var(--color-status-info)',
  replied: 'var(--color-status-success)',
  archived: 'var(--color-text-dim)',
};

const statusLabels: Record<MessageStatus, string> = {
  new: 'New',
  read: 'Read',
  replied: 'Replied',
  archived: 'Archived',
};

export function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<MessageStatus | 'all'>('all');

  const load = () => messagesAPI.list().then(setMessages);
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
    if (confirm('Delete this message?')) {
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>Messages</h1>
        <p className="text-body-sm">
          {messages.length} total · {messages.filter((m) => m.status === 'new').length} unread
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {(['all', 'new', 'read', 'replied', 'archived'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px',
              fontSize: '0.75rem',
              fontWeight: filter === f ? 600 : 400,
              color: filter === f ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
              backgroundColor: filter === f ? 'var(--color-accent)' : 'var(--color-bg-surface)',
              border: `1px solid ${filter === f ? 'var(--color-accent)' : 'var(--color-border-subtle)'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              textTransform: 'capitalize' as const,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {selectedMessage ? (
        /* Message Detail */
        <div className="admin-card" style={{ padding: '1.5rem' }}>
          <button onClick={() => setSelectedMessage(null)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', cursor: 'pointer', background: 'none', border: 'none' }}>
            <ArrowLeft size={16} /> Back to inbox
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>{selectedMessage.name}</h2>
              <a href={`mailto:${selectedMessage.email}`} style={{ fontSize: '0.875rem', color: 'var(--color-accent)', textDecoration: 'none' }}>{selectedMessage.email}</a>
            </div>
            <span style={{ padding: '3px 10px', fontSize: '0.6875rem', fontWeight: 500, borderRadius: '4px', backgroundColor: `${statusColors[selectedMessage.status]}20`, color: statusColors[selectedMessage.status] }}>
              {statusLabels[selectedMessage.status]}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem', padding: '1rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: '8px' }}>
            {selectedMessage.company && <div><span className="text-label" style={{ fontSize: '0.625rem' }}>Company</span><p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>{selectedMessage.company}</p></div>}
            {selectedMessage.projectType && <div><span className="text-label" style={{ fontSize: '0.625rem' }}>Project Type</span><p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>{selectedMessage.projectType}</p></div>}
            {selectedMessage.budgetRange && <div><span className="text-label" style={{ fontSize: '0.625rem' }}>Budget</span><p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>{selectedMessage.budgetRange}</p></div>}
            <div><span className="text-label" style={{ fontSize: '0.625rem' }}>Date</span><p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', marginTop: '4px' }}>{formatDate(selectedMessage.createdAt)}</p></div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <span className="text-label" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.625rem' }}>Message</span>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>{selectedMessage.message}</p>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <button onClick={() => handleStatusChange(selectedMessage.id, 'read')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.8125rem', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '6px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}><MailOpen size={14} /> Mark Read</button>
            <button onClick={() => handleStatusChange(selectedMessage.id, 'replied')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.8125rem', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '6px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}><Reply size={14} /> Mark Replied</button>
            <button onClick={() => handleStatusChange(selectedMessage.id, 'archived')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.8125rem', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '6px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}><Archive size={14} /> Archive</button>
            <button onClick={() => handleDelete(selectedMessage.id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.8125rem', backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px', color: 'var(--color-status-error)', cursor: 'pointer' }}><Trash2 size={14} /> Delete</button>
          </div>
        </div>
      ) : (
        /* Message List */
        <div className="admin-card" style={{ overflow: 'hidden' }}>
          {filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <Mail size={32} style={{ color: 'var(--color-text-dim)', margin: '0 auto 1rem' }} />
              <p className="text-body-sm">No messages {filter !== 'all' ? `with status "${filter}"` : 'yet'}</p>
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
                  backgroundColor: msg.status === 'new' ? 'rgba(232, 255, 74, 0.02)' : 'transparent',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = msg.status === 'new' ? 'rgba(232, 255, 74, 0.02)' : 'transparent')}
              >
                {msg.status === 'new' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', flexShrink: 0 }} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: msg.status === 'new' ? 600 : 400, color: 'var(--color-text-primary)' }}>{msg.name}</span>
                    {msg.company && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>• {msg.company}</span>}
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>{msg.message}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {msg.projectType && <span style={{ display: 'block', fontSize: '0.6875rem', color: 'var(--color-text-muted)', marginBottom: '2px' }}>{msg.projectType}</span>}
                  <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)' }}>{formatDate(msg.createdAt)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useState, useCallback } from 'react';
import { servicesAPI } from '@/api/endpoints';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation, getErrorMessage } from '@/i18n';
import { formatNumber } from '@/utils/formatters';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, X, AlertCircle } from 'lucide-react';
import type { Service } from '@/types';

const emptyService: Partial<Service> = {
  name: '', shortDescription: '', fullDescription: '', icon: 'globe', isActive: true,
};

export function ServicesPage() {
  const { refreshWebsiteData } = useWebsite();
  const { t, decode, language, isRtl } = useTranslation();
  const [services, setServices] = useState<Service[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service>>(emptyService);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const load = async () => {
    const list = await servicesAPI.list();
    setServices(list);
    await refreshWebsiteData();
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editingService.name) return;
    setSaving(true);
    try {
      if (editingService.id) {
        await servicesAPI.update(editingService.id, editingService);
        showToast(t('admin.services.toastUpdated'), 'success');
      } else {
        await servicesAPI.create(editingService);
        showToast(t('admin.services.toastCreated'), 'success');
      }
      setIsEditing(false);
      setEditingService(emptyService);
      await load();
    } catch (error: any) {
      console.error('Failed to save service:', error);
      showToast(getErrorMessage(error, 'admin.services.toastSaveError', t), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.services.deleteConfirm'))) {
      try {
        await servicesAPI.delete(id);
        showToast(t('admin.services.toastDeleted'), 'success');
        await load();
      } catch (error: any) {
        console.error('Failed to delete service:', error);
        showToast(getErrorMessage(error, 'admin.services.toastDeleteError', t), 'error');
      }
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      await servicesAPI.update(service.id, { isActive: !service.isActive });
      showToast(service.isActive ? t('admin.services.toastDeactivated') : t('admin.services.toastActivated'), 'success');
      await load();
    } catch (error: any) {
      console.error('Failed to toggle active:', error);
      showToast(t('common.error'), 'error');
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--color-text-primary)',
    fontSize: '0.9375rem',
    fontFamily: 'inherit',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: isRtl ? 'normal' : '0.06em',
    textTransform: isRtl ? 'none' : ('uppercase' as const),
    color: 'var(--color-text-muted)',
  };

  const toastStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '1.5rem',
    insetInlineEnd: '1.5rem',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 20px',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: 500,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    animation: 'fadeInUp 0.3s ease-out',
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          ...toastStyle,
          backgroundColor: toast.type === 'error' ? 'var(--color-status-error-muted)' : 'var(--color-status-success-muted)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
          color: toast.type === 'error' ? 'var(--color-status-error)' : 'var(--color-status-success)',
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{ marginInlineStart: '8px', cursor: 'pointer', color: 'inherit', opacity: 0.7 }}
            aria-label={t('common.close')}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            {t('admin.services.title')}
          </h1>
          <p className="text-body-sm">
            {t('admin.services.subtitle', {
              total: formatNumber(services.length, language),
              active: formatNumber(services.filter((s) => s.isActive).length, language),
            })}
          </p>
        </div>
        <button
          onClick={() => { setEditingService(emptyService); setIsEditing(true); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
            fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-bg-primary)',
            backgroundColor: 'var(--color-accent)', borderRadius: '6px', cursor: 'pointer',
          }}
        >
          <Plus size={16} /> {t('admin.services.addService')}
        </button>
      </div>

      {/* Services List */}
      {services.length === 0 ? (
        <div className="admin-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p className="text-body-sm" style={{ marginBottom: '1rem' }}>
            {t('admin.services.emptyDesc')}
          </p>
          <button
            onClick={() => { setEditingService(emptyService); setIsEditing(true); }}
            style={{ color: 'var(--color-accent)', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' }}
          >
            + {t('admin.services.createService')}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {services.map((service, index) => (
            <div
              key={service.id}
              className="admin-card"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', minWidth: 0 }}>
                <span className="text-mono" style={{ color: 'var(--color-text-dim)', fontSize: '0.875rem', fontWeight: 600 }}>
                  {formatNumber(String(index + 1).padStart(2, '0'), language)}
                </span>
                <div style={{ minWidth: 0 }}>
                  <span style={{ fontWeight: 600, fontSize: '1rem', display: 'block', marginBottom: '2px', color: 'var(--color-text-primary)' }}>
                    {decode(service.name)}
                  </span>
                  <p className="text-body-sm" style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '500px' }}>
                    {decode(service.shortDescription) || '—'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Active Toggle Button */}
                <button
                  onClick={() => toggleActive(service)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    color: service.isActive ? 'var(--color-status-success)' : 'var(--color-text-muted)',
                    backgroundColor: service.isActive ? 'var(--color-status-success-muted)' : 'var(--color-bg-elevated)',
                    border: `1px solid ${service.isActive ? 'rgba(16, 185, 129, 0.25)' : 'var(--color-border-subtle)'}`,
                  }}
                >
                  {service.isActive ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  <span>{service.isActive ? t('status.active') : t('status.inactive')}</span>
                </button>

                {/* Edit */}
                <button
                  onClick={() => { setEditingService(service); setIsEditing(true); }}
                  aria-label={t('common.edit')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  <Edit2 size={14} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(service.id)}
                  aria-label={t('common.delete')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    color: 'var(--color-status-error)',
                    backgroundColor: 'var(--color-status-error-muted)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isEditing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'var(--color-bg-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600 }}>
                {editingService.id ? t('admin.services.editTitle') : t('admin.services.newTitle')}
              </h2>
              <button onClick={() => setIsEditing(false)} style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }} aria-label={t('common.close')}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>{t('admin.services.name')}</label>
                <input
                  type="text"
                  value={editingService.name || ''}
                  onChange={(e) => setEditingService((s) => ({ ...s, name: e.target.value }))}
                  style={fieldStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>{t('admin.services.shortDesc')}</label>
                <input
                  type="text"
                  value={editingService.shortDescription || ''}
                  onChange={(e) => setEditingService((s) => ({ ...s, shortDescription: e.target.value }))}
                  style={fieldStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>{t('admin.services.fullDesc')}</label>
                <textarea
                  value={editingService.fullDescription || ''}
                  onChange={(e) => setEditingService((s) => ({ ...s, fullDescription: e.target.value }))}
                  rows={4}
                  style={{ ...fieldStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                <div>
                  <label style={labelStyle}>{t('admin.services.icon')}</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={editingService.icon || ''}
                    onChange={(e) => setEditingService((s) => ({ ...s, icon: e.target.value }))}
                    placeholder={t('admin.services.iconPlaceholder')}
                    style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input
                      type="checkbox"
                      checked={editingService.isActive !== false}
                      onChange={(e) => setEditingService((s) => ({ ...s, isActive: e.target.checked }))}
                    />
                    <span>{t('admin.services.activeCheck')}</span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={() => setIsEditing(false)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)', background: 'none', cursor: 'pointer' }}>
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-primary)', fontWeight: 600, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

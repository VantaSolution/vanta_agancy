import React, { useEffect, useState } from 'react';
import { settingsAPI, authAPI } from '@/api/endpoints';
import { useAuth } from '@/context/AuthContext';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation, getErrorMessage } from '@/i18n';
import { Save, Check } from 'lucide-react';
import type { Settings } from '@/types';

type Tab = 'general' | 'social' | 'seo' | 'admin';

export function SettingsPage() {
  const { logout } = useAuth();
  const { refreshWebsiteData } = useWebsite();
  const { t, isRtl } = useTranslation();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => { settingsAPI.get().then(setSettings).catch(() => {}); }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          alert(t('validation.passwordsDoNotMatch'));
          setIsSaving(false);
          return;
        }
        if (newPassword.length < 6) {
          alert(t('validation.passwordMinLength'));
          setIsSaving(false);
          return;
        }
      }

      await settingsAPI.update(settings);

      // Update admin user credentials in database
      await authAPI.updateProfile({
        name: settings.admin?.name,
        email: settings.admin?.email,
        newPassword: newPassword || undefined,
      });

      if (newPassword) {
        setNewPassword('');
        setConfirmPassword('');
      }

      await refreshWebsiteData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert(getErrorMessage(err, 'admin.settings.toastError', t));
    } finally {
      setIsSaving(false);
    }
  };

  const updateGeneral = (field: string, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, general: { ...settings.general, [field]: value } });
  };

  const updateSocial = (field: string, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, social: { ...settings.social, [field]: value } });
  };

  const updateSeo = (field: string, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, seo: { ...settings.seo, [field]: value } });
  };

  const updateAdmin = (field: string, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, admin: { ...settings.admin, [field]: value } });
  };

  if (!settings) return <div className="text-body-sm">{t('common.loading')}</div>;

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

  const tabs: { key: Tab; label: string }[] = [
    { key: 'general', label: t('admin.settings.tabs.general') },
    { key: 'social', label: t('admin.settings.tabs.social') },
    { key: 'seo', label: t('admin.settings.tabs.seo') },
    { key: 'admin', label: t('admin.settings.tabs.admin') },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            {t('admin.settings.title')}
          </h1>
          <p className="text-body-sm">{t('admin.settings.subtitle')}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
            fontSize: '0.8125rem', fontWeight: 600,
            color: saved ? 'var(--color-status-success)' : 'var(--color-bg-primary)',
            backgroundColor: saved ? 'var(--color-status-success-muted)' : 'var(--color-accent)',
            border: saved ? '1px solid var(--color-status-success)' : 'none',
            borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease',
          }}
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          <span>{saved ? t('common.saved') : isSaving ? t('common.saving') : t('admin.settings.saveSettings')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 16px', fontSize: '0.875rem', fontWeight: 500,
              color: activeTab === tab.key ? 'var(--color-accent)' : 'var(--color-text-muted)',
              borderBottom: activeTab === tab.key ? '2px solid var(--color-accent)' : '2px solid transparent',
              background: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="admin-card" style={{ padding: '1.5rem' }}>
        {activeTab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>{t('admin.settings.general.agencyName')}</label>
                <input
                  type="text"
                  value={settings.general.agencyName}
                  onChange={(e) => updateGeneral('agencyName', e.target.value)}
                  style={fieldStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>{t('admin.settings.general.email')}</label>
                <input
                  type="email"
                  dir="ltr"
                  value={settings.general.email}
                  onChange={(e) => updateGeneral('email', e.target.value)}
                  style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>{t('admin.settings.general.location')}</label>
                <input
                  type="text"
                  value={settings.general.location}
                  onChange={(e) => updateGeneral('location', e.target.value)}
                  style={fieldStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>{t('admin.settings.general.logoUrl')}</label>
                <input
                  type="text"
                  dir="ltr"
                  value={settings.general.logo}
                  onChange={(e) => updateGeneral('logo', e.target.value)}
                  placeholder="https://..."
                  style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Instagram</label>
              <input
                type="text"
                dir="ltr"
                value={settings.social.instagram}
                onChange={(e) => updateSocial('instagram', e.target.value)}
                style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
              />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn</label>
              <input
                type="text"
                dir="ltr"
                value={settings.social.linkedin}
                onChange={(e) => updateSocial('linkedin', e.target.value)}
                style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
              />
            </div>
            <div>
              <label style={labelStyle}>GitHub</label>
              <input
                type="text"
                dir="ltr"
                value={settings.social.github}
                onChange={(e) => updateSocial('github', e.target.value)}
                style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Twitter / X</label>
              <input
                type="text"
                dir="ltr"
                value={settings.social.twitter}
                onChange={(e) => updateSocial('twitter', e.target.value)}
                style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>{t('admin.settings.seo.websiteTitle')}</label>
              <input
                type="text"
                value={settings.seo.websiteTitle}
                onChange={(e) => updateSeo('websiteTitle', e.target.value)}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('admin.settings.seo.metaDescription')}</label>
              <textarea
                value={settings.seo.metaDescription}
                onChange={(e) => updateSeo('metaDescription', e.target.value)}
                rows={3}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('admin.settings.seo.ogImage')}</label>
              <input
                type="text"
                dir="ltr"
                value={settings.seo.ogImage}
                onChange={(e) => updateSeo('ogImage', e.target.value)}
                placeholder="https://..."
                style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>{t('admin.settings.adminUser.name')}</label>
                <input
                  type="text"
                  value={settings.admin.name}
                  onChange={(e) => updateAdmin('name', e.target.value)}
                  style={fieldStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>{t('admin.settings.adminUser.email')}</label>
                <input
                  type="email"
                  dir="ltr"
                  value={settings.admin.email}
                  onChange={(e) => updateAdmin('email', e.target.value)}
                  style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              <span style={{ ...labelStyle, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                {t('admin.settings.adminUser.newPassword')}
              </span>
              <p className="text-body-sm" style={{ marginBottom: '1rem', fontSize: '0.75rem' }}>
                {t('admin.settings.adminUser.passwordNote')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>{t('admin.settings.adminUser.newPassword')}</label>
                  <input
                    type="password"
                    dir="ltr"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('admin.settings.adminUser.confirmPassword')}</label>
                  <input
                    type="password"
                    dir="ltr"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

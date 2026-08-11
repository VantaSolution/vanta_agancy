import React, { useEffect, useState } from 'react';
import { settingsAPI, authAPI } from '@/api/endpoints';
import { useAuth } from '@/context/AuthContext';
import { useWebsite } from '@/context/WebsiteContext';
import { Save, Check } from 'lucide-react';
import type { Settings } from '@/types';

type Tab = 'general' | 'social' | 'seo' | 'admin';

export function SettingsPage() {
  const { logout } = useAuth();
  const { refreshWebsiteData } = useWebsite();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => { settingsAPI.get().then(setSettings); }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          alert('New password and Confirm password do not match!');
          setIsSaving(false);
          return;
        }
        if (newPassword.length < 6) {
          alert('Password must be at least 6 characters long.');
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
        alert('Admin profile & password updated successfully!');
      }

      await refreshWebsiteData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert(err?.response?.data?.error?.message || 'Failed to update settings');
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

  if (!settings) return <div className="text-body-sm">Loading...</div>;

  const fieldStyle: React.CSSProperties = { width: '100%', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '10px 14px', color: 'var(--color-text-primary)', fontSize: '0.9375rem', fontFamily: 'var(--font-body)', outline: 'none' };
  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--color-text-muted)' };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'general', label: 'General' },
    { key: 'social', label: 'Social' },
    { key: 'seo', label: 'SEO' },
    { key: 'admin', label: 'Admin' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>Settings</h1>
          <p className="text-body-sm">Manage your agency configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
            fontSize: '0.8125rem', fontWeight: 600,
            color: saved ? 'var(--color-status-success)' : 'var(--color-bg-primary)',
            backgroundColor: saved ? 'rgba(34,197,94,0.15)' : 'var(--color-accent)',
            border: saved ? '1px solid var(--color-status-success)' : 'none',
            borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease',
          }}
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'Saved!' : isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '1.5rem' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 16px', fontSize: '0.875rem', fontWeight: 500,
              color: activeTab === tab.key ? 'var(--color-accent)' : 'var(--color-text-muted)',
              borderBottom: activeTab === tab.key ? '2px solid var(--color-accent)' : '2px solid transparent',
              background: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Agency Name</label>
                <input
                  type="text"
                  value={settings.general.agencyName}
                  onChange={(e) => updateGeneral('agencyName', e.target.value)}
                  style={fieldStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={settings.general.email}
                  onChange={(e) => updateGeneral('email', e.target.value)}
                  style={fieldStyle}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Location</label>
                <input
                  type="text"
                  value={settings.general.location}
                  onChange={(e) => updateGeneral('location', e.target.value)}
                  style={fieldStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Logo URL</label>
                <input
                  type="text"
                  value={settings.general.logo}
                  onChange={(e) => updateGeneral('logo', e.target.value)}
                  placeholder="Logo image URL"
                  style={fieldStyle}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Instagram</label>
              <input
                type="text"
                value={settings.social.instagram}
                onChange={(e) => updateSocial('instagram', e.target.value)}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>LinkedIn</label>
              <input
                type="text"
                value={settings.social.linkedin}
                onChange={(e) => updateSocial('linkedin', e.target.value)}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>GitHub</label>
              <input
                type="text"
                value={settings.social.github}
                onChange={(e) => updateSocial('github', e.target.value)}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Twitter / X</label>
              <input
                type="text"
                value={settings.social.twitter}
                onChange={(e) => updateSocial('twitter', e.target.value)}
                style={fieldStyle}
              />
            </div>
          </div>
        )}

        {activeTab === 'seo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Website Title</label>
              <input
                type="text"
                value={settings.seo.websiteTitle}
                onChange={(e) => updateSeo('websiteTitle', e.target.value)}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Meta Description</label>
              <textarea
                value={settings.seo.metaDescription}
                onChange={(e) => updateSeo('metaDescription', e.target.value)}
                rows={3}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={labelStyle}>OG Image URL</label>
              <input
                type="text"
                value={settings.seo.ogImage}
                onChange={(e) => updateSeo('ogImage', e.target.value)}
                placeholder="Social share image URL"
                style={fieldStyle}
              />
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Admin Name</label>
                <input
                  type="text"
                  value={settings.admin.name}
                  onChange={(e) => updateAdmin('name', e.target.value)}
                  style={fieldStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Admin Email</label>
                <input
                  type="email"
                  value={settings.admin.email}
                  onChange={(e) => updateAdmin('email', e.target.value)}
                  style={fieldStyle}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
              <span style={{ ...labelStyle, marginBottom: '1rem', color: 'var(--color-text-primary)' }}>Change Password</span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    style={fieldStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    style={fieldStyle}
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

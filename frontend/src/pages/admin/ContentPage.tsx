import React, { useEffect, useState } from 'react';
import { contentAPI } from '@/api/endpoints';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation } from '@/i18n';
import { Save, Check } from 'lucide-react';
import type { WebsiteContent } from '@/types';

type Tab = 'hero' | 'about' | 'cta' | 'contact';

export function ContentPage() {
  const { refreshWebsiteData } = useWebsite();
  const { t, isRtl } = useTranslation();
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { contentAPI.get().then(setContent).catch(() => {}); }, []);

  const handleSave = async () => {
    if (!content) return;
    setIsSaving(true);
    try {
      await contentAPI.update(content);
      await refreshWebsiteData();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      alert(t('admin.content.toastError'));
    } finally {
      setIsSaving(false);
    }
  };

  const update = (section: keyof WebsiteContent, field: string, value: string) => {
    if (!content) return;
    setContent({ ...content, [section]: { ...content[section], [field]: value } });
  };

  const updateSocial = (field: string, value: string) => {
    if (!content) return;
    setContent({ ...content, contact: { ...content.contact, socialLinks: { ...content.contact.socialLinks, [field]: value } } });
  };

  if (!content) return <div className="text-body-sm">{t('common.loading')}</div>;

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
    { key: 'hero', label: t('admin.content.tabs.hero') },
    { key: 'about', label: t('admin.content.tabs.about') },
    { key: 'cta', label: t('admin.content.tabs.cta') },
    { key: 'contact', label: t('admin.content.tabs.contact') },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            {t('admin.content.title')}
          </h1>
          <p className="text-body-sm">{t('admin.content.subtitle')}</p>
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
          <span>{saved ? t('common.saved') : isSaving ? t('common.saving') : t('admin.content.saveContent')}</span>
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
        {activeTab === 'hero' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>{t('admin.content.hero.headline')}</label>
              <textarea
                value={content.hero.headline}
                onChange={(e) => update('hero', 'headline', e.target.value)}
                rows={3}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('admin.content.hero.description')}</label>
              <textarea
                value={content.hero.description}
                onChange={(e) => update('hero', 'description', e.target.value)}
                rows={3}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>{t('admin.content.hero.primaryCta')}</label>
                <input
                  type="text"
                  value={content.hero.primaryCta}
                  onChange={(e) => update('hero', 'primaryCta', e.target.value)}
                  style={fieldStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>{t('admin.content.hero.secondaryCta')}</label>
                <input
                  type="text"
                  value={content.hero.secondaryCta}
                  onChange={(e) => update('hero', 'secondaryCta', e.target.value)}
                  style={fieldStyle}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>{t('admin.content.about.heading')}</label>
              <textarea
                value={content.about.heading}
                onChange={(e) => update('about', 'heading', e.target.value)}
                rows={2}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('admin.content.about.description')}</label>
              <textarea
                value={content.about.description}
                onChange={(e) => update('about', 'description', e.target.value)}
                rows={4}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('admin.content.about.supportingContent')}</label>
              <textarea
                value={content.about.supportingContent}
                onChange={(e) => update('about', 'supportingContent', e.target.value)}
                rows={4}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {activeTab === 'cta' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={labelStyle}>{t('admin.content.cta.heading')}</label>
              <textarea
                value={content.cta.heading}
                onChange={(e) => update('cta', 'heading', e.target.value)}
                rows={2}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('admin.content.cta.description')}</label>
              <textarea
                value={content.cta.description}
                onChange={(e) => update('cta', 'description', e.target.value)}
                rows={3}
                style={{ ...fieldStyle, resize: 'vertical' }}
              />
            </div>
            <div>
              <label style={labelStyle}>{t('admin.content.cta.buttonText')}</label>
              <input
                type="text"
                value={content.cta.buttonText}
                onChange={(e) => update('cta', 'buttonText', e.target.value)}
                style={fieldStyle}
              />
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>{t('admin.content.contact.email')}</label>
                <input
                  type="email"
                  dir="ltr"
                  value={content.contact.email}
                  onChange={(e) => update('contact', 'email', e.target.value)}
                  style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                />
              </div>
              <div>
                <label style={labelStyle}>{t('admin.content.contact.phone')}</label>
                <input
                  type="text"
                  dir="ltr"
                  value={content.contact.phone}
                  onChange={(e) => update('contact', 'phone', e.target.value)}
                  style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('admin.content.contact.location')}</label>
              <input
                type="text"
                value={content.contact.location}
                onChange={(e) => update('contact', 'location', e.target.value)}
                style={fieldStyle}
              />
            </div>
            <div>
              <span style={{ ...labelStyle, marginBottom: '0.75rem' }}>{t('contact.social')}</span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Instagram</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={content.contact.socialLinks.instagram}
                    onChange={(e) => updateSocial('instagram', e.target.value)}
                    style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>LinkedIn</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={content.contact.socialLinks.linkedin}
                    onChange={(e) => updateSocial('linkedin', e.target.value)}
                    style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>GitHub</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={content.contact.socialLinks.github}
                    onChange={(e) => updateSocial('github', e.target.value)}
                    style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                  />
                </div>
                <div>
                  <label style={{ ...labelStyle, fontSize: '0.6875rem' }}>Twitter / X</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={content.contact.socialLinks.twitter}
                    onChange={(e) => updateSocial('twitter', e.target.value)}
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

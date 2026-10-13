import React from 'react';
import { useTranslation } from '@/i18n';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  variant?: 'minimal' | 'button' | 'badge';
  className?: string;
  style?: React.CSSProperties;
}

export function LanguageToggle({ variant = 'minimal', className = '', style }: LanguageToggleProps) {
  const { language, toggleLanguage, t } = useTranslation();
  const nextLangName = language === 'ar' ? 'English' : 'العربية';
  const currentBadge = language === 'ar' ? 'AR' : 'EN';
  const toggleLabel = t('nav.languageToggle');

  if (variant === 'button') {
    return (
      <button
        onClick={toggleLanguage}
        className={`language-toggle-btn ${className}`}
        aria-label={toggleLabel}
        title={toggleLabel}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '6px',
          fontSize: '0.8125rem',
          fontWeight: 600,
          backgroundColor: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-subtle)',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          ...style,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-accent)';
          e.currentTarget.style.color = 'var(--color-accent)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
          e.currentTarget.style.color = 'var(--color-text-primary)';
        }}
      >
        <Globe size={15} style={{ color: 'var(--color-accent)' }} />
        <span>{nextLangName}</span>
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <button
        onClick={toggleLanguage}
        aria-label={toggleLabel}
        title={toggleLabel}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 700,
          backgroundColor: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-subtle)',
          color: 'var(--color-accent)',
          cursor: 'pointer',
          letterSpacing: '0.05em',
          transition: 'all 0.2s ease',
          ...style,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-accent-muted)';
          e.currentTarget.style.borderColor = 'var(--color-accent)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
          e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
        }}
      >
        <Globe size={13} />
        <span>{currentBadge}</span>
      </button>
    );
  }

  // Default 'minimal'
  return (
    <button
      onClick={toggleLanguage}
      aria-label={toggleLabel}
      title={toggleLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '0.8125rem',
        fontWeight: 500,
        color: 'var(--color-text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        background: 'none',
        border: '1px solid transparent',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = 'var(--color-accent)';
        e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
        e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = 'var(--color-text-secondary)';
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      <Globe size={15} style={{ color: 'var(--color-accent)' }} />
      <span style={{ fontFamily: language === 'ar' ? 'var(--font-heading)' : 'var(--font-arabic-heading)' }}>
        {nextLangName}
      </span>
    </button>
  );
}

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { Home, ArrowLeft, ArrowRight, Wrench, FolderKanban, Mail } from 'lucide-react';

export function NotFoundPage() {
  const { t, isRtl } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className="grid-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem clamp(1.5rem, 4vw, 4rem)',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg-primary)',
      }}
    >
      {/* Top Bar with Brand & Language Toggle */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        <Link
          to="/"
          style={{
            fontFamily: isRtl ? 'var(--font-arabic-heading)' : 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: isRtl ? 'normal' : '0.08em',
            color: 'var(--color-text-primary)',
            textDecoration: 'none',
          }}
        >
          VANTA<span style={{ color: 'var(--color-accent)' }}>.</span>
        </Link>
        <LanguageToggle variant="badge" />
      </header>

      {/* Main 404 Hero Card */}
      <main
        style={{
          maxWidth: '700px',
          margin: '3rem auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <span
          className="text-label-accent"
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: 'var(--color-accent-muted)',
            borderRadius: '4px',
            marginBottom: '1.5rem',
            fontSize: '0.8125rem',
          }}
        >
          {t('notFound.tag')}
        </span>

        <h1
          style={{
            fontFamily: isRtl ? 'var(--font-arabic-heading)' : 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 700,
            letterSpacing: isRtl ? 'normal' : '-0.02em',
            lineHeight: 1.1,
            color: 'var(--color-text-primary)',
            marginBottom: '1.5rem',
          }}
        >
          {t('notFound.title')}
        </h1>

        <p
          className="text-body-lg"
          style={{
            color: 'var(--color-text-secondary)',
            marginBottom: '2.5rem',
            lineHeight: 1.7,
            maxWidth: '560px',
            marginInline: 'auto',
          }}
        >
          {t('notFound.description')}
        </p>

        {/* Primary Actions */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3rem',
          }}
        >
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-bg-primary)',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Home size={16} />
            <span>{t('notFound.returnHome')}</span>
          </button>

          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              fontSize: '0.9375rem',
              fontWeight: 500,
              backgroundColor: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              borderRadius: '6px',
              border: '1px solid var(--color-border-subtle)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
            }}
          >
            {isRtl ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
            <span>{t('notFound.goBack')}</span>
          </button>
        </div>

        {/* Quick Directory Links */}
        <div
          style={{
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            textAlign: 'start',
          }}
        >
          <a
            href="/#services"
            style={{
              padding: '14px 18px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Wrench size={16} style={{ color: 'var(--color-accent)' }} />
            <span>{t('notFound.exploreServices')}</span>
          </a>

          <a
            href="/#work"
            style={{
              padding: '14px 18px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FolderKanban size={16} style={{ color: 'var(--color-accent)' }} />
            <span>{t('notFound.featuredWork')}</span>
          </a>

          <a
            href="/#contact"
            style={{
              padding: '14px 18px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-subtle)',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Mail size={16} style={{ color: 'var(--color-accent)' }} />
            <span>{t('notFound.contactStudio')}</span>
          </a>
        </div>
      </main>

      {/* Footer copyright */}
      <footer
        style={{
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--color-text-dim)',
          paddingTop: '2rem',
        }}
      >
        <span className="text-mono">{t('notFound.brandFooter')}</span>
      </footer>
    </div>
  );
}

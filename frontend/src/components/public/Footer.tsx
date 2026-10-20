import React from 'react';
import { Link } from 'react-router-dom';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation } from '@/i18n';
import { Instagram, Linkedin, Github, ArrowUp } from 'lucide-react';

export function Footer() {
  const { content, settings } = useWebsite();
  const { t, decode, isRtl } = useTranslation();

  const rawAgencyName = settings?.general?.agencyName || 'VANTA';
  const agencyName = decode(rawAgencyName) || 'VANTA';
  const agencyEmail = settings?.general?.email || content?.contact?.email || 'hello@vanta.studio';
  const rawLocation = settings?.general?.location || content?.contact?.location;
  const agencyLocation = decode(rawLocation) || t('contact.locationValue');
  const socialLinks = settings?.social || content?.contact?.socialLinks || { instagram: '#', linkedin: '#', github: '#', twitter: '#' };

  const footerNav = [
    { label: t('nav.services'), href: '#services' },
    { label: t('nav.work'), href: '#work' },
    { label: t('nav.process'), href: '#process' },
    { label: t('nav.about'), href: '#about' },
    { label: t('nav.contact'), href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        borderTop: '1px solid var(--color-border-subtle)',
        padding: 'clamp(3rem, 6vw, 5rem) 0 2rem',
      }}
    >
      <div className="container-wide">
        {/* Main footer content */}
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{
                fontFamily: isRtl ? 'var(--font-arabic-heading)' : 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: isRtl ? 'normal' : '0.08em',
                color: 'var(--color-text-primary)',
                textDecoration: 'none',
                display: 'inline-block',
                marginBottom: '1rem',
                textTransform: 'uppercase',
              }}
            >
              {agencyName}<span style={{ color: 'var(--color-accent)' }}>.</span>
            </a>
            <p className="text-body-sm" style={{ maxWidth: '300px', marginBottom: '1.5rem' }}>
              {t('footer.tagline')}
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  <Instagram size={18} />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  <Linkedin size={18} />
                </a>
              )}
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  style={{ color: 'var(--color-text-muted)', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
                >
                  <Github size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <span className="text-label" style={{ display: 'block', marginBottom: '1.25rem' }}>
              {t('footer.navigation')}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {footerNav.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Direct Contact */}
          <div>
            <span className="text-label" style={{ display: 'block', marginBottom: '1.25rem' }}>
              {t('contact.infoTitle')}
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href={`mailto:${agencyEmail}`}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  overflowWrap: 'anywhere',
                  wordBreak: 'break-word',
                  direction: 'ltr',
                  display: 'inline-block',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
              >
                {agencyEmail}
              </a>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                {agencyLocation}
              </span>
            </div>
          </div>

          {/* Availability & Back to top */}
          <div>
            <span className="text-label" style={{ display: 'block', marginBottom: '1.25rem' }}>
              {t('common.status')}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span
                className="pulse-dot"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent)',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                {t('hero.availableForProjects')}
              </span>
            </div>
            <p className="text-body-sm" style={{ marginBottom: '1.25rem' }}>
              {t('hero.version')}
            </p>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--color-text-secondary)',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent)';
                e.currentTarget.style.borderColor = 'var(--color-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
              }}
              aria-label={isRtl ? 'الرجوع للأعلى' : 'Back to top'}
            >
              <span>{isRtl ? 'للأعلى' : 'Back to top'}</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <span className="text-mono" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', overflowWrap: 'anywhere' }}>
            © <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>{new Date().getFullYear()}</span> {agencyName}. {t('footer.rightsReserved')}
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link
              to="/admin/login"
              style={{
                color: 'var(--color-text-dim)',
                fontSize: '0.75rem',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-dim)')}
            >
              {isRtl ? 'لوحة التحكم' : 'Staff Portal'}
            </Link>
            <span className="text-mono" style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', overflowWrap: 'anywhere' }}>
              {t('footer.designedAndBuilt')}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr repeat(3, minmax(0, 1fr));
          gap: clamp(2rem, 4vw, 3rem);
          margin-bottom: 4rem;
        }
        .footer-grid > div {
          min-width: 0;
        }
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
      `}</style>
    </footer>
  );
}

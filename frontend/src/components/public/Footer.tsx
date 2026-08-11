import React from 'react';
import { useWebsite } from '@/context/WebsiteContext';
import { Instagram, Linkedin, Github } from 'lucide-react';

const footerNav = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export function Footer() {
  const { content, settings } = useWebsite();
  const agencyName = settings?.general?.agencyName || 'VANTA';
  const agencyEmail = settings?.general?.email || content?.contact?.email || 'hello@vanta.studio';
  const agencyLocation = settings?.general?.location || content?.contact?.location || 'Remote — Worldwide';
  const socialLinks = settings?.social || content?.contact?.socialLinks || { instagram: '#', linkedin: '#', github: '#', twitter: '#' };

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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
            gap: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: '4rem',
          }}
        >
          {/* Brand */}
          <div>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
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
              Digital studio engineering fast, modern websites and applications for forward-thinking businesses.
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
              NAVIGATION
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
              DIRECT CONTACT
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <a
                href={`mailto:${agencyEmail}`}
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
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

          {/* Availability */}
          <div>
            <span className="text-label" style={{ display: 'block', marginBottom: '1.25rem' }}>
              STATUS
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <span
                className="pulse-dot"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent)',
                  display: 'inline-block',
                }}
              />
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                Taking on new projects
              </span>
            </div>
            <p className="text-body-sm">
              Estimated project start: within 1-2 weeks.
            </p>
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
          <span className="text-mono" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
            © {new Date().getFullYear()} {agencyName}. ALL RIGHTS RESERVED.
          </span>

          <span className="text-mono" style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem' }}>
            DESIGNED & ENGINEERED FOR HIGH PERFORMANCE
          </span>
        </div>
      </div>
    </footer>
  );
}

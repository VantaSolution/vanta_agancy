import React from 'react';
import { useNavbar } from '@/hooks/useNavbar';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation } from '@/i18n';
import { ArrowUpRight } from 'lucide-react';
import { LanguageToggle } from '@/components/common/LanguageToggle';

export function Navbar() {
  const { isScrolled, isMobileMenuOpen, activeSection, toggleMobileMenu, closeMobileMenu } = useNavbar();
  const { settings } = useWebsite();
  const { t, decode, isRtl } = useTranslation();
  const rawAgencyName = settings?.general?.agencyName || 'VANTA';
  const agencyName = decode(rawAgencyName) || 'VANTA';

  const navLinks = [
    { label: t('nav.services'), href: '#services', id: 'services' },
    { label: t('nav.work'), href: '#work', id: 'work' },
    { label: t('nav.process'), href: '#process', id: 'process' },
    { label: t('nav.about'), href: '#about', id: 'about' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    closeMobileMenu();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMobileMenu();
    const target = document.querySelector('#contact');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Accessible Skip Link */}
      <a href="#main-content" className="skip-link">
        {isRtl ? 'الانتقال إلى المحتوى الرئيسي' : 'Skip to main content'}
      </a>

      <nav
        role="navigation"
        aria-label={t('nav.mainNav')}
        style={{
          position: 'fixed',
          top: 0,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          zIndex: 1000,
          padding: isScrolled ? '12px 0' : '20px 0',
          backgroundColor: isScrolled ? 'rgba(9, 10, 15, 0.88)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--color-border-subtle)' : '1px solid transparent',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="container-wide" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Dynamic Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            aria-label={`${agencyName} - ${t('nav.home')}`}
            style={{
              fontFamily: isRtl ? 'var(--font-arabic-heading)' : 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 700,
              letterSpacing: isRtl ? 'normal' : '0.08em',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            {agencyName}<span style={{ color: 'var(--color-accent)' }}>.</span>
          </a>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
            <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    aria-current={isActive ? 'page' : undefined}
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: isRtl ? 'normal' : '0.04em',
                      color: isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      textDecoration: 'none',
                      position: 'relative',
                      padding: '4px 0',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = isActive ? 'var(--color-accent)' : 'var(--color-text-secondary)')}
                  >
                    {link.label}
                    {isActive && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '-2px',
                          insetInlineStart: 0,
                          insetInlineEnd: 0,
                          height: '2px',
                          backgroundColor: 'var(--color-accent)',
                          borderRadius: '1px',
                        }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Language Switcher */}
            <LanguageToggle variant="badge" />

            {/* CTA Button */}
            <a
              href="#contact"
              onClick={scrollToContact}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-bg-primary)',
                backgroundColor: 'var(--color-accent)',
                borderRadius: '4px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>{t('nav.startProject')}</span>
              <ArrowUpRight size={14} className="rtl-arrow-up-right" />
            </a>
          </div>

          {/* Mobile Right Controls */}
          <div style={{ display: 'none', alignItems: 'center', gap: '10px' }} className="mobile-controls">
            <LanguageToggle variant="badge" />
            <button
              onClick={toggleMobileMenu}
              className="mobile-toggle"
              aria-label={isMobileMenuOpen ? t('nav.closeMenu') : t('nav.menu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '5px',
                width: '40px',
                height: '40px',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid var(--color-border-subtle)',
                backgroundColor: 'var(--color-bg-elevated)',
              }}
            >
              <span
                style={{
                  width: '18px',
                  height: '2px',
                  backgroundColor: 'var(--color-text-primary)',
                  transition: 'all 0.3s ease',
                  transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
                }}
              />
              <span
                style={{
                  width: '18px',
                  height: '2px',
                  backgroundColor: 'var(--color-text-primary)',
                  transition: 'all 0.3s ease',
                  opacity: isMobileMenuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  width: '18px',
                  height: '2px',
                  backgroundColor: 'var(--color-text-primary)',
                  transition: 'all 0.3s ease',
                  transform: isMobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
                }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t('nav.mobileNav')}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: 'rgba(9, 10, 15, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem',
            animation: 'fadeInUp 0.25s ease-out',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.75rem', width: '100%', maxWidth: '300px' }}>
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    fontFamily: isRtl ? 'var(--font-arabic-heading)' : 'var(--font-heading)',
                    fontSize: '1.5rem',
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? 'var(--color-accent)' : 'var(--color-text-primary)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {isActive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} />}
                  <span>{link.label}</span>
                </a>
              );
            })}

            <div style={{ marginTop: '0.75rem' }}>
              <LanguageToggle variant="button" />
            </div>

            <a
              href="#contact"
              onClick={scrollToContact}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '14px 24px',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--color-bg-primary)',
                backgroundColor: 'var(--color-accent)',
                borderRadius: '6px',
                textDecoration: 'none',
                marginTop: '1rem',
                boxShadow: '0 4px 20px rgba(0, 210, 255, 0.25)',
              }}
            >
              <span>{t('nav.startProject')}</span>
              <ArrowUpRight size={16} className="rtl-arrow-up-right" />
            </a>
          </div>
        </div>
      )}

      {/* CSS for Mobile Toggle Visibility */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-controls { display: flex !important; }
        }
      `}</style>
    </>
  );
}

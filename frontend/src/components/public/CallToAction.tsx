import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation } from '@/i18n';
import { ArrowUpRight } from 'lucide-react';

export function CallToAction() {
  const ref = useScrollReveal(0.15);
  const { content } = useWebsite();
  const { t, decode } = useTranslation();

  const heading = content?.cta?.heading ? decode(content.cta.heading) : t('cta.heading');
  const description = content?.cta?.description ? decode(content.cta.description) : t('cta.description');
  const buttonText = content?.cta?.buttonText ? decode(content.cta.buttonText) : t('cta.buttonText');

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="section-padding noise-overlay"
      style={{
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '100%',
        background: 'linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-surface) 45%, #0C1525 100%)',
      }}
    >
      {/* Accent glow */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          insetInlineEnd: '-200px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          insetInlineStart: '-150px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-narrow" ref={ref} style={{ position: 'relative', zIndex: 2 }}>
        <div className="reveal" style={{ textAlign: 'center' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '2rem' }}>
            {t('cta.tag')}
          </span>

          <h2
            className="text-display"
            style={{
              marginBottom: '1.5rem',
              lineHeight: 1.2,
              whiteSpace: 'pre-line',
            }}
          >
            {heading}
          </h2>

          <p
            className="text-body-lg reveal reveal-delay-2"
            style={{
              maxWidth: '520px',
              margin: '0 auto 2.5rem',
            }}
          >
            {description}
          </p>

          <button
            className="reveal reveal-delay-3"
            onClick={scrollToContact}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 36px',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-bg-primary)',
              backgroundColor: 'var(--color-accent)',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 210, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span>{buttonText}</span>
            <ArrowUpRight size={18} strokeWidth={2.5} className="rtl-arrow-up-right" />
          </button>
        </div>
      </div>
    </section>
  );
}

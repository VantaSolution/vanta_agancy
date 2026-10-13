import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from '@/i18n';
import { ArrowUpRight } from 'lucide-react';

export function Process() {
  const ref = useScrollReveal(0.1);
  const { t, dict } = useTranslation();

  const processSteps = dict.process.steps;

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="process" className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container-wide" ref={ref}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '1rem' }}>
            {t('process.tag')}
          </span>
          <h2 className="text-section-title">{t('process.heading')}</h2>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="process-desktop reveal reveal-delay-2">
          {/* Connection line */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              insetInlineStart: '12.5%',
              insetInlineEnd: '12.5%',
              height: '1px',
              backgroundColor: 'var(--color-border-default)',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '2rem',
              position: 'relative',
            }}
          >
            {processSteps.map((step, index) => (
              <div
                key={step.number}
                className={`reveal reveal-delay-${index + 2}`}
                style={{
                  textAlign: 'center',
                  position: 'relative',
                }}
              >
                {/* Node dot */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '2px solid var(--color-accent)',
                    backgroundColor: 'var(--color-bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <span
                    className="text-mono"
                    style={{
                      color: 'var(--color-accent)',
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.75rem',
                  }}
                >
                  {step.title}
                </h3>

                <p
                  className="text-body-sm"
                  style={{
                    maxWidth: '240px',
                    margin: '0 auto',
                    lineHeight: 1.7,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="process-mobile reveal reveal-delay-2">
          <div style={{ position: 'relative', paddingInlineStart: '3rem' }}>
            {/* Vertical line */}
            <div
              style={{
                position: 'absolute',
                insetInlineStart: '15px',
                top: '24px',
                bottom: '24px',
                width: '1px',
                backgroundColor: 'var(--color-border-default)',
              }}
            />

            {processSteps.map((step, index) => (
              <div
                key={step.number}
                style={{
                  marginBottom: index < processSteps.length - 1 ? '3rem' : '0',
                  position: 'relative',
                }}
              >
                {/* Node dot */}
                <div
                  style={{
                    position: 'absolute',
                    insetInlineStart: '-3rem',
                    top: '0',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '2px solid var(--color-accent)',
                    backgroundColor: 'var(--color-bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                  }}
                >
                  <span className="text-mono" style={{ color: 'var(--color-accent)', fontSize: '0.6875rem', fontWeight: 600 }}>
                    {step.number}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {step.title}
                </h3>

                <p className="text-body-sm" style={{ lineHeight: 1.7 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Relocated Primary CTA — High Conversion Flow Post-Process */}
        <div
          className="reveal reveal-delay-3"
          style={{
            marginTop: 'clamp(3.5rem, 6vw, 5rem)',
            position: 'relative',
            borderRadius: '16px',
            border: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-bg-surface)',
            padding: 'clamp(2.5rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)',
            textAlign: 'center',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '420px',
              height: '320px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 210, 255, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <span
            className="text-label-accent"
            style={{ display: 'inline-block', marginBottom: '1rem' }}
          >
            {t('process.ctaTag')}
          </span>

          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 3vw, 2.125rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
              lineHeight: 1.3,
            }}
          >
            {t('process.ctaHeading')}
          </h3>

          <p
            className="text-body"
            style={{
              maxWidth: '560px',
              margin: '0 auto clamp(1.75rem, 3vw, 2.25rem)',
              color: 'var(--color-text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.7,
            }}
          >
            {t('process.ctaDescription')}
          </p>

          <button
            onClick={scrollToContact}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 36px',
              fontSize: '1.0625rem',
              fontWeight: 700,
              color: 'var(--color-bg-primary)',
              backgroundColor: 'var(--color-accent)',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 6px 24px rgba(0, 210, 255, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 36px rgba(0, 210, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 210, 255, 0.25)';
            }}
          >
            <span>{t('process.ctaButton')}</span>
            <ArrowUpRight size={18} strokeWidth={2.5} className="rtl-arrow-up-right" />
          </button>
        </div>
      </div>

      <style>{`
        .process-desktop { display: block; position: relative; }
        .process-mobile { display: none; }
        
        @media (max-width: 768px) {
          .process-desktop { display: none !important; }
          .process-mobile { display: block !important; }
        }
      `}</style>
    </section>
  );
}

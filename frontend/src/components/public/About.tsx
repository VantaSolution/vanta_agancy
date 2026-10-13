import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation } from '@/i18n';

export function About() {
  const ref = useScrollReveal(0.15);
  const { content } = useWebsite();
  const { t, decode, dict } = useTranslation();

  const heading = content?.about?.heading ? decode(content.about.heading) : t('about.heading');
  const description = content?.about?.description ? decode(content.about.description) : t('about.description');
  const supportingContent = content?.about?.supportingContent ? decode(content.about.supportingContent) : t('about.supportingContent');

  const pillars = dict.about.pillars;

  return (
    <section id="about" className="section-padding">
      <div className="container-wide" ref={ref}>
        <div
          className="reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: 'clamp(3rem, 6vw, 6rem)',
            alignItems: 'start',
          }}
        >
          {/* Left */}
          <div>
            <span className="text-label-accent" style={{ display: 'block', marginBottom: '1.5rem' }}>
              {t('about.tag')}
            </span>
            <h2 className="text-section-title" style={{ marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
              {heading}
            </h2>
            <p className="text-body-lg" style={{ marginBottom: '1.5rem', maxWidth: '480px' }}>
              {description}
            </p>
            <p className="text-body" style={{ maxWidth: '480px' }}>
              {supportingContent}
            </p>
          </div>

          {/* Right: Pillars */}
          <div>
            {pillars.map((pillar, index) => (
              <div
                key={pillar.label}
                className={`reveal reveal-delay-${index + 2}`}
                style={{
                  padding: '1.5rem 0',
                  borderBottom: index < pillars.length - 1 ? '1px solid var(--color-border-subtle)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.375rem' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--color-accent)',
                      transform: 'rotate(45deg)',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {pillar.label}
                  </span>
                </div>
                <p className="text-body-sm" style={{ paddingInlineStart: '20px' }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #about .container-wide > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

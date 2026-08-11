import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useWebsite } from '@/context/WebsiteContext';

export function About() {
  const ref = useScrollReveal(0.15);
  const { content } = useWebsite();

  const aboutContent = content?.about || {
    heading: "SMALL STUDIO.\nBIG DIGITAL IMPACT.",
    description: "We're a focused digital studio that combines design, development, strategy, and performance into one seamless process.",
    supportingContent: "Every project we take on gets the full attention of our senior team.",
  };

  const pillars = [
    { label: 'Design', desc: 'Visual systems that communicate' },
    { label: 'Development', desc: 'Clean code, modern architecture' },
    { label: 'Strategy', desc: 'Business-aligned decisions' },
    { label: 'Performance', desc: 'Speed and reliability' },
  ];

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
              // ABOUT
            </span>
            <h2 className="text-section-title" style={{ marginBottom: '1.5rem', whiteSpace: 'pre-line' }}>
              {aboutContent.heading}
            </h2>
            <p className="text-body-lg" style={{ marginBottom: '1.5rem', maxWidth: '460px' }}>
              {aboutContent.description}
            </p>
            <p className="text-body" style={{ maxWidth: '460px' }}>
              {aboutContent.supportingContent}
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
                <p className="text-body-sm" style={{ paddingLeft: '20px' }}>
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

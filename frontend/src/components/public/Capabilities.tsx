import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { capabilities } from '@/data/capabilities';

export function Capabilities() {
  const ref = useScrollReveal(0.15);

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
      <div className="container-wide" ref={ref}>
        <div
          className="reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(3rem, 6vw, 6rem)',
            alignItems: 'start',
          }}
        >
          {/* Left: Statement */}
          <div>
            <span className="text-label-accent" style={{ display: 'block', marginBottom: '1.5rem' }}>
              // CAPABILITIES
            </span>
            <h2
              className="text-section-title"
              style={{ marginBottom: '1.5rem' }}
            >
              DESIGNED TO<br />
              LOOK <span style={{ color: 'var(--color-accent)' }}>GOOD</span>.<br />
              ENGINEERED TO<br />
              <span style={{ color: 'var(--color-accent)' }}>PERFORM</span>.
            </h2>
            <p className="text-body-lg" style={{ maxWidth: '400px' }}>
              Every project we ship is built with the same foundation — clean code, modern tools, and a relentless focus on quality.
            </p>
          </div>

          {/* Right: Capabilities Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0',
            }}
          >
            {capabilities.map((cap, index) => (
              <div
                key={cap.name}
                className={`reveal reveal-delay-${Math.min(index + 1, 8)}`}
                style={{
                  padding: '1.5rem',
                  borderBottom: index < capabilities.length - 2 ? '1px solid var(--color-border-subtle)' : 'none',
                  borderRight: index % 2 === 0 ? '1px solid var(--color-border-subtle)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  {/* Animated indicator */}
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-accent)',
                    }}
                    className="pulse-dot"
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.9375rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {cap.name}
                  </span>
                </div>
                <p className="text-body-sm" style={{ paddingLeft: '16px' }}>
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .container-wide > div[class*="reveal"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

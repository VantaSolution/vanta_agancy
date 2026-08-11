import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export function Intro() {
  const ref = useScrollReveal();

  return (
    <section
      className="section-padding-sm"
      style={{
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div className="container-narrow" ref={ref}>
        <div className="reveal" style={{ textAlign: 'center' }}>
          {/* Accent line */}
          <div
            style={{
              width: '40px',
              height: '2px',
              backgroundColor: 'var(--color-accent)',
              margin: '0 auto 2.5rem',
            }}
          />

          <h2
            className="text-section-title"
            style={{ marginBottom: '1.5rem' }}
          >
            WE DON'T JUST BUILD WEBSITES.<br />
            <span style={{ color: 'var(--color-accent)' }}>WE BUILD DIGITAL PRESENCE.</span>
          </h2>

          <p
            className="text-body-lg reveal reveal-delay-2"
            style={{
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.8,
            }}
          >
            From a simple landing page to a complete digital platform, we design and develop experiences that make businesses look credible, perform better, and convert visitors into customers.
          </p>
        </div>
      </div>
    </section>
  );
}

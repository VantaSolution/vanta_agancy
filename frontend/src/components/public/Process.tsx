import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { processSteps } from '@/data/process';

export function Process() {
  const ref = useScrollReveal(0.1);

  return (
    <section id="process" className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container-wide" ref={ref}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '1rem' }}>
            // PROCESS
          </span>
          <h2 className="text-section-title">FROM IDEA TO LAUNCH</h2>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="process-desktop reveal reveal-delay-2">
          {/* Connection line */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '12.5%',
              right: '12.5%',
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
          <div style={{ position: 'relative', paddingLeft: '3rem' }}>
            {/* Vertical line */}
            <div
              style={{
                position: 'absolute',
                left: '15px',
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
                    left: '-3rem',
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

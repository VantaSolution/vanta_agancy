import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from '@/i18n';

export function Capabilities() {
  const ref = useScrollReveal(0.15);
  const { t, dict } = useTranslation();

  const capabilities = dict.capabilities.items;

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
      <div className="container-wide" ref={ref}>
        <div
          className="reveal capabilities-layout"
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
              {t('capabilities.tag')}
            </span>
            <h2
              className="text-section-title"
              style={{ marginBottom: '1.5rem' }}
            >
              {t('capabilities.titleLine1')}<br />
              <span style={{ color: 'var(--color-accent)' }}>{t('capabilities.titleGood')}</span>.<br />
              {t('capabilities.titleLine2')}<br />
              <span style={{ color: 'var(--color-accent)' }}>{t('capabilities.titlePerform')}</span>.
            </h2>
            <p className="text-body-lg" style={{ maxWidth: '420px' }}>
              {t('capabilities.description')}
            </p>
          </div>

          {/* Right: Capabilities Grid */}
          <div className="capabilities-grid">
            {capabilities.map((cap, index) => (
              <div
                key={cap.name}
                className={`capabilities-item reveal reveal-delay-${Math.min(index + 1, 8)}`}
                style={{
                  borderBottom: index < capabilities.length - 2 ? '1px solid var(--color-border-subtle)' : 'none',
                  borderInlineEnd: index % 2 === 0 ? '1px solid var(--color-border-subtle)' : 'none',
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
                      flexShrink: 0,
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
                <p className="text-body-sm" style={{ paddingInlineStart: '16px' }}>
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        .capabilities-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0;
          min-width: 0;
        }
        .capabilities-item {
          padding: 1.5rem;
          min-width: 0;
        }
        @media (max-width: 900px) {
          .capabilities-layout {
            grid-template-columns: minmax(0, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .capabilities-grid {
            grid-template-columns: minmax(0, 1fr) !important;
          }
          .capabilities-item {
            border-inline-end: none !important;
            padding: 1.25rem 0.5rem !important;
            border-bottom: 1px solid var(--color-border-subtle) !important;
          }
        }
      `}</style>
    </section>
  );
}

import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from '@/i18n';

export function Intro() {
  const ref = useScrollReveal();
  const { t } = useTranslation();

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
            style={{ marginBottom: '1.5rem', whiteSpace: 'pre-line' }}
          >
            {t('intro.headlineBeforeAccent')}
            <span style={{ color: 'var(--color-accent)' }}>{t('intro.headlineAccent')}</span>
          </h2>

          <p
            className="text-body-lg reveal reveal-delay-2"
            style={{
              maxWidth: '640px',
              margin: '0 auto',
              lineHeight: 1.8,
            }}
          >
            {t('intro.description')}
          </p>
        </div>
      </div>
    </section>
  );
}

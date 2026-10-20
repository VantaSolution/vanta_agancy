import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from '@/i18n';
import { Gauge, ShieldCheck, Code2, Clock } from 'lucide-react';

export function Intro() {
  const ref = useScrollReveal(0.12);
  const { t, isRtl } = useTranslation();

  const metrics = [
    {
      icon: Gauge,
      value: '< 0.8s',
      label: isRtl ? 'سرعة تحميل فائقة' : 'Sub-Second Load Time',
    },
    {
      icon: Code2,
      value: '100%',
      label: isRtl ? 'كود نظيف ومخصص بالكامل' : 'Bespoke Clean Code',
    },
    {
      icon: ShieldCheck,
      value: '99.9%',
      label: isRtl ? 'ثبات وجاهزية سحابية' : 'Uptime SLA Reliability',
    },
    {
      icon: Clock,
      value: '24/7',
      label: isRtl ? 'متابعة ودعم فني مستمر' : 'Proactive Monitoring',
    },
  ];

  return (
    <section
      className="section-padding-sm"
      style={{
        borderTop: '1px solid var(--color-border-subtle)',
        borderBottom: '1px solid var(--color-border-subtle)',
        position: 'relative',
        backgroundColor: 'rgba(17, 19, 26, 0.4)',
      }}
    >
      <div className="container-narrow" ref={ref}>
        <div className="reveal" style={{ textAlign: 'center' }}>
          {/* Accent Line with subtle pulse glow */}
          <div
            style={{
              width: '48px',
              height: '2px',
              backgroundColor: 'var(--color-accent)',
              margin: '0 auto 2.5rem',
              boxShadow: '0 0 12px rgba(0, 210, 255, 0.5)',
            }}
          />

          <h2
            className="text-section-title"
            style={{
              marginBottom: '1.5rem',
              whiteSpace: 'pre-line',
              lineHeight: isRtl ? 1.35 : 1.15,
            }}
          >
            {t('intro.headlineBeforeAccent')}
            <span style={{ color: 'var(--color-accent)' }}>{t('intro.headlineAccent')}</span>
          </h2>

          <p
            className="text-body-lg reveal reveal-delay-2"
            style={{
              maxWidth: '680px',
              margin: '0 auto 3rem',
              lineHeight: 1.8,
              color: 'var(--color-text-secondary)',
            }}
          >
            {t('intro.description')}
          </p>

          {/* Quick Technical Highlights Ribbon */}
          <div
            className="reveal reveal-delay-3"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1.25rem',
              paddingTop: '1rem',
            }}
          >
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  style={{
                    padding: '1.25rem 1rem',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(0, 210, 255, 0.08)',
                      color: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {m.value}
                  </div>
                  <div
                    className="text-mono"
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--color-text-muted)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from '@/i18n';
import {
  Zap,
  MonitorSmartphone,
  Search,
  Code2,
  Server,
  Sparkles,
  BarChart3,
  ShieldCheck,
  LucideIcon
} from 'lucide-react';

const capabilityIcons: LucideIcon[] = [
  Zap,
  MonitorSmartphone,
  Search,
  Code2,
  Server,
  Sparkles,
  BarChart3,
  ShieldCheck,
];

export function Capabilities() {
  const ref = useScrollReveal(0.12);
  const { t, dict, isRtl } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const capabilities = dict.capabilities.items;

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-bg-surface)', position: 'relative' }}>
      <div className="container-wide" ref={ref}>
        <div
          className="reveal capabilities-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 1.35fr',
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
              style={{
                marginBottom: '1.5rem',
                lineHeight: isRtl ? 1.35 : 1.12,
              }}
            >
              {t('capabilities.titleLine1')}<br />
              <span style={{ color: 'var(--color-accent)' }}>{t('capabilities.titleGood')}</span>.<br />
              {t('capabilities.titleLine2')}<br />
              <span style={{ color: 'var(--color-accent)' }}>{t('capabilities.titlePerform')}</span>.
            </h2>
            <p className="text-body-lg" style={{ maxWidth: '440px', lineHeight: 1.75, color: 'var(--color-text-secondary)' }}>
              {t('capabilities.description')}
            </p>
          </div>

          {/* Right: Capabilities Cards Grid */}
          <div className="capabilities-grid">
            {capabilities.map((cap, index) => {
              const Icon = capabilityIcons[index % capabilityIcons.length];
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={cap.name}
                  className={`capabilities-item reveal reveal-delay-${Math.min(index + 1, 8)}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    padding: '1.35rem',
                    backgroundColor: isHovered ? 'var(--color-bg-elevated)' : 'transparent',
                    border: `1px solid ${isHovered ? 'rgba(0, 210, 255, 0.35)' : 'var(--color-border-subtle)'}`,
                    borderRadius: '10px',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isHovered ? 'translateY(-3px)' : 'none',
                    boxShadow: isHovered ? '0 8px 24px rgba(0, 0, 0, 0.3)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: isHovered ? 'rgba(0, 210, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          color: isHovered ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.25s ease',
                        }}
                      >
                        <Icon size={16} />
                      </div>

                      <h3
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: isHovered ? 'var(--color-accent)' : 'var(--color-text-primary)',
                          transition: 'color 0.2s ease',
                        }}
                      >
                        {cap.name}
                      </h3>
                    </div>

                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: isHovered ? 'var(--color-accent)' : 'var(--color-border-strong)',
                        boxShadow: isHovered ? '0 0 8px #00D2FF' : 'none',
                        transition: 'all 0.25s ease',
                      }}
                      className={isHovered ? 'pulse-dot' : undefined}
                    />
                  </div>

                  <p className="text-body-sm" style={{ lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
                    {cap.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Responsive layout styles */}
      <style>{`
        .capabilities-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
        }
        @media (max-width: 900px) {
          .capabilities-layout {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
        @media (max-width: 600px) {
          .capabilities-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

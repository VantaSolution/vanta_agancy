import React, { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation } from '@/i18n';
import { ShieldCheck, Zap, Layers, Sparkles } from 'lucide-react';

export function About() {
  const ref = useScrollReveal(0.12);
  const { content } = useWebsite();
  const { t, decode, dict, isRtl } = useTranslation();
  const [isImageHovered, setIsImageHovered] = useState(false);

  const heading = content?.about?.heading ? decode(content.about.heading) : t('about.heading');
  const description = content?.about?.description ? decode(content.about.description) : t('about.description');
  const supportingContent = content?.about?.supportingContent ? decode(content.about.supportingContent) : t('about.supportingContent');

  const pillars = dict.about.pillars;
  const pillarIcons = [Zap, ShieldCheck, Layers];

  return (
    <section id="about" className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background ambient radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          insetInlineEnd: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-wide" ref={ref} style={{ position: 'relative', zIndex: 2 }}>
        <div
          className="about-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            gap: 'clamp(2.5rem, 5vw, 5rem)',
            alignItems: 'center',
          }}
        >
          {/* Left Column: Narrative & Pillars */}
          <div>
            <div className="reveal">
              <span className="text-label-accent" style={{ display: 'block', marginBottom: '1.25rem' }}>
                {t('about.tag')}
              </span>
              <h2
                className="text-section-title"
                style={{
                  marginBottom: '1.5rem',
                  whiteSpace: 'pre-line',
                  lineHeight: 1.15,
                }}
              >
                {heading}
              </h2>
              <p
                className="text-body-lg"
                style={{
                  marginBottom: '1.25rem',
                  maxWidth: '540px',
                  color: 'var(--color-text-primary)',
                }}
              >
                {description}
              </p>
              <p
                className="text-body"
                style={{
                  marginBottom: '2.5rem',
                  maxWidth: '540px',
                  lineHeight: 1.7,
                }}
              >
                {supportingContent}
              </p>
            </div>

            {/* Strategic Pillars */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {pillars.map((pillar, index) => {
                const IconComponent = pillarIcons[index % pillarIcons.length];
                return (
                  <div
                    key={pillar.label}
                    className={`reveal reveal-delay-${index + 2}`}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border-subtle)',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.35)';
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
                      e.currentTarget.style.transform = isRtl ? 'translateX(-6px)' : 'translateX(6px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-surface)';
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.375rem' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(0, 210, 255, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--color-accent)',
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent size={15} />
                      </div>
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '1.0625rem',
                          fontWeight: 600,
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {pillar.label}
                      </span>
                    </div>
                    <p
                      className="text-body-sm"
                      style={{
                        paddingInlineStart: '40px',
                        lineHeight: 1.6,
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {pillar.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Architectural Visual Showcase */}
          <div className="reveal reveal-delay-3" style={{ position: 'relative' }}>
            {/* Visual Container */}
            <div
              onMouseEnter={() => setIsImageHovered(true)}
              onMouseLeave={() => setIsImageHovered(false)}
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid var(--color-border-default)',
                backgroundColor: 'var(--color-bg-surface)',
                boxShadow: isImageHovered
                  ? '0 24px 48px rgba(0, 0, 0, 0.6), 0 0 32px rgba(0, 210, 255, 0.15)'
                  : '0 16px 36px rgba(0, 0, 0, 0.4)',
                transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Corner Viewfinder Brackets */}
              <div style={{ position: 'absolute', top: '16px', insetInlineStart: '16px', width: '18px', height: '18px', borderTop: '2px solid var(--color-accent)', borderInlineStart: '2px solid var(--color-accent)', zIndex: 3, opacity: 0.8 }} />
              <div style={{ position: 'absolute', top: '16px', insetInlineEnd: '16px', width: '18px', height: '18px', borderTop: '2px solid var(--color-accent)', borderInlineEnd: '2px solid var(--color-accent)', zIndex: 3, opacity: 0.8 }} />
              <div style={{ position: 'absolute', bottom: '16px', insetInlineStart: '16px', width: '18px', height: '18px', borderBottom: '2px solid var(--color-accent)', borderInlineStart: '2px solid var(--color-accent)', zIndex: 3, opacity: 0.8 }} />
              <div style={{ position: 'absolute', bottom: '16px', insetInlineEnd: '16px', width: '18px', height: '18px', borderBottom: '2px solid var(--color-accent)', borderInlineEnd: '2px solid var(--color-accent)', zIndex: 3, opacity: 0.8 }} />

              {/* Architecture Artwork */}
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-bg-primary)',
                }}
              >
                <img
                  src="/images/about-architecture.jpg"
                  alt={isRtl ? 'هندسة النظم والتطوير التقني في استوديو ڤانتا' : 'Precision Software Architecture by VANTA Studio'}
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={480}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s ease',
                    transform: isImageHovered ? 'scale(1.04)' : 'scale(1)',
                    filter: isImageHovered ? 'brightness(1.05)' : 'brightness(0.95)',
                  }}
                />

                {/* Gradient Shading */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(9, 10, 15, 0.85) 0%, rgba(9, 10, 15, 0.1) 50%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Bottom Caption Pill */}
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: 'var(--color-bg-surface)',
                  borderTop: '1px solid var(--color-border-subtle)',
                }}
              >
                <div>
                  <span
                    className="text-mono"
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--color-accent)',
                      display: 'block',
                      marginBottom: '2px',
                    }}
                  >
                    SYSTEM ARCHITECTURE
                  </span>
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {isRtl ? 'بنية سحابية وثبات بنسبة 99.9%' : '99.9% Uptime Cloud Architecture'}
                  </span>
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: '#10b981',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  <span className="pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <span>Verified</span>
                </div>
              </div>
            </div>

            {/* Floating Telemetry Badge */}
            <div
              className="float-animation"
              style={{
                position: 'absolute',
                top: '-16px',
                insetInlineEnd: '-12px',
                padding: '10px 16px',
                borderRadius: '10px',
                backgroundColor: 'rgba(17, 19, 26, 0.92)',
                border: '1px solid rgba(0, 210, 255, 0.35)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 210, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 4,
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--color-accent)' }} />
              <div>
                <span className="text-mono" style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', display: 'block' }}>
                  LATENCY
                </span>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                  &lt; 200ms TTFB
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 3.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}

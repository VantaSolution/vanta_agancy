import React, { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from '@/i18n';
import { ArrowUpRight, Search, Compass, Code2, Rocket, LucideIcon } from 'lucide-react';

const processIcons: LucideIcon[] = [Search, Compass, Code2, Rocket];

export function Process() {
  const ref = useScrollReveal(0.1);
  const { t, dict, isRtl } = useTranslation();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const processSteps = dict.process.steps;

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="process" className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0, 210, 255, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-wide" ref={ref} style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '1rem' }}>
            {t('process.tag')}
          </span>
          <h2 className="text-section-title">{t('process.heading')}</h2>
          <p className="text-body" style={{ maxWidth: '580px', margin: '1rem auto 0', color: 'var(--color-text-secondary)' }}>
            {isRtl
              ? 'منهجية عمل واضحة ومدروسة، بتضمن لك وضوح تام في كل خطوة، وسرعة في التنفيذ، وجودة تليق بتطلعاتك.'
              : 'A disciplined engineering methodology delivering total transparency, rapid velocity, and uncompromising code quality.'}
          </p>
        </div>

        {/* Desktop: Step Cards with Connected Progress Rail */}
        <div className="process-desktop reveal reveal-delay-2" style={{ position: 'relative' }}>
          {/* Glowing connecting track line behind node circles */}
          <div
            style={{
              position: 'absolute',
              top: '44px',
              insetInlineStart: '10%',
              insetInlineEnd: '10%',
              height: '2px',
              background: 'linear-gradient(90deg, rgba(0, 210, 255, 0.2) 0%, rgba(0, 210, 255, 0.6) 50%, rgba(0, 210, 255, 0.2) 100%)',
              zIndex: 1,
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.5rem',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {processSteps.map((step, index) => {
              const Icon = processIcons[index % processIcons.length];
              const isHovered = hoveredStep === index;

              return (
                <div
                  key={step.number}
                  className={`reveal reveal-delay-${index + 2}`}
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep(null)}
                  style={{
                    backgroundColor: isHovered ? 'var(--color-bg-elevated)' : 'var(--color-bg-surface)',
                    border: `1px solid ${isHovered ? 'rgba(0, 210, 255, 0.4)' : 'var(--color-border-subtle)'}`,
                    borderRadius: '14px',
                    padding: '2rem 1.25rem',
                    textAlign: 'center',
                    position: 'relative',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isHovered ? 'translateY(-6px)' : 'none',
                    boxShadow: isHovered
                      ? '0 16px 36px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 210, 255, 0.12)'
                      : '0 4px 16px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  {/* Step Node Circle with Icon */}
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      border: `2px solid ${isHovered ? 'var(--color-accent)' : 'rgba(0, 210, 255, 0.35)'}`,
                      backgroundColor: 'var(--color-bg-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      position: 'relative',
                      boxShadow: isHovered ? '0 0 18px rgba(0, 210, 255, 0.4)' : 'none',
                      transition: 'all 0.3s ease',
                      color: isHovered ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    }}
                  >
                    <Icon size={22} />
                  </div>

                  {/* Step Number Tag */}
                  <span
                    className="text-mono"
                    style={{
                      display: 'inline-block',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: 'var(--color-accent)',
                      marginBottom: '0.625rem',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(0, 210, 255, 0.08)',
                    }}
                  >
                    STEP {step.number}
                  </span>

                  {/* Step Title */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.0625rem',
                      fontWeight: 600,
                      color: isHovered ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      marginBottom: '0.75rem',
                      lineHeight: 1.3,
                      transition: 'color 0.2s ease',
                    }}
                  >
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p
                    className="text-body-sm"
                    style={{
                      lineHeight: 1.7,
                      color: 'var(--color-text-muted)',
                      fontSize: '0.8125rem',
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Vertical Connected Timeline */}
        <div className="process-mobile reveal reveal-delay-2">
          <div style={{ position: 'relative', paddingInlineStart: '3.25rem' }}>
            {/* Vertical Rail */}
            <div
              style={{
                position: 'absolute',
                insetInlineStart: '18px',
                top: '24px',
                bottom: '24px',
                width: '2px',
                background: 'linear-gradient(180deg, rgba(0, 210, 255, 0.6) 0%, rgba(0, 210, 255, 0.2) 100%)',
              }}
            />

            {processSteps.map((step, index) => {
              const Icon = processIcons[index % processIcons.length];
              return (
                <div
                  key={step.number}
                  style={{
                    marginBottom: index < processSteps.length - 1 ? '2.5rem' : '0',
                    position: 'relative',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                >
                  {/* Floating Icon Node */}
                  <div
                    style={{
                      position: 'absolute',
                      insetInlineStart: '-3.25rem',
                      top: '1.25rem',
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: '2px solid var(--color-accent)',
                      backgroundColor: 'var(--color-bg-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-accent)',
                      zIndex: 2,
                    }}
                  >
                    <Icon size={16} />
                  </div>

                  <span
                    className="text-mono"
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--color-accent)',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    STEP {step.number}
                  </span>

                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {step.title}
                  </h3>

                  <p className="text-body-sm" style={{ lineHeight: 1.65, color: 'var(--color-text-secondary)' }}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Relocated Primary CTA — High Conversion Flow Post-Process */}
        <div
          className="reveal reveal-delay-3"
          style={{
            marginTop: 'clamp(3.5rem, 6vw, 5rem)',
            position: 'relative',
            borderRadius: '16px',
            border: '1px solid var(--color-border-subtle)',
            backgroundColor: 'var(--color-bg-surface)',
            padding: 'clamp(2.5rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)',
            textAlign: 'center',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '450px',
              height: '350px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 210, 255, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <span
            className="text-label-accent"
            style={{ display: 'inline-block', marginBottom: '1rem' }}
          >
            {t('process.ctaTag')}
          </span>

          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.5rem, 3vw, 2.125rem)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              marginBottom: '1rem',
              lineHeight: 1.3,
            }}
          >
            {t('process.ctaHeading')}
          </h3>

          <p
            className="text-body"
            style={{
              maxWidth: '560px',
              margin: '0 auto clamp(1.75rem, 3vw, 2.25rem)',
              color: 'var(--color-text-secondary)',
              fontSize: '1rem',
              lineHeight: 1.7,
            }}
          >
            {t('process.ctaDescription')}
          </p>

          <button
            onClick={scrollToContact}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 36px',
              fontSize: '1.0625rem',
              fontWeight: 700,
              color: 'var(--color-bg-primary)',
              backgroundColor: 'var(--color-accent)',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 6px 24px rgba(0, 210, 255, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 36px rgba(0, 210, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 24px rgba(0, 210, 255, 0.25)';
            }}
          >
            <span>{t('process.ctaButton')}</span>
            <ArrowUpRight size={18} strokeWidth={2.5} className="rtl-arrow-up-right" />
          </button>
        </div>
      </div>

      <style>{`
        .process-desktop { display: block; position: relative; }
        .process-mobile { display: none; }
        
        @media (max-width: 900px) {
          .process-desktop { display: none !important; }
          .process-mobile { display: block !important; }
        }
      `}</style>
    </section>
  );
}

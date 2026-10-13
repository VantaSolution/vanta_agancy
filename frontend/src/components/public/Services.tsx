import React, { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation } from '@/i18n';
import { formatNumber } from '@/utils/formatters';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

export function Services() {
  const ref = useScrollReveal(0.1);
  const { services } = useWebsite();
  const { t, decode, language, dict, isRtl } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // If services from backend exist, decode their names/descriptions.
  // If fallback defaults, use localized dict list.
  const activeServices = (services && services.length > 0)
    ? services
    : (dict.services.list as any);

  const toggleService = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-wide" ref={ref}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: '4rem' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '1rem' }}>
            {t('services.tag')}
          </span>
          <h2 className="text-section-title">{t('services.heading')}</h2>
        </div>

        {/* Service Rows */}
        <div className="reveal reveal-delay-2" role="region" aria-label={t('services.listLabel')}>
          {activeServices.map((service: any, index: number) => {
            const isHovered = hoveredIndex === index;
            const isExpanded = expandedIndex === index || isHovered;
            const number = String(index + 1).padStart(2, '0');
            const localizedNumber = language === 'ar' ? formatNumber(number, 'ar') : number;

            const localizedName = decode(service.name);
            const localizedDesc = decode(service.shortDescription);

            return (
              <div
                key={service.id || index}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                aria-label={t('services.detailsAria', { name: localizedName })}
                onClick={() => toggleService(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleService(index);
                  }
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  position: 'relative',
                  borderTop: index === 0 ? '1px solid var(--color-border-subtle)' : 'none',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  padding: isExpanded ? '2.25rem 0' : '1.75rem 0',
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden',
                  outlineOffset: '4px',
                }}
              >
                {/* Hover accent line */}
                <div
                  style={{
                    position: 'absolute',
                    insetInlineStart: 0,
                    top: 0,
                    bottom: 0,
                    width: '3px',
                    backgroundColor: 'var(--color-accent)',
                    transform: isExpanded ? 'scaleY(1)' : 'scaleY(0)',
                    transformOrigin: 'top',
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr auto',
                    gap: '1.5rem',
                    alignItems: 'start',
                  }}
                >
                  {/* Number */}
                  <span
                    className="text-mono"
                    style={{
                      color: isExpanded ? 'var(--color-accent)' : 'var(--color-text-dim)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      transition: 'color 0.25s ease',
                      paddingTop: '4px',
                    }}
                  >
                    {localizedNumber}
                  </span>

                  {/* Title & Description */}
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                        fontWeight: 600,
                        color: isExpanded ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        transition: 'color 0.25s ease',
                        marginBottom: isExpanded && localizedDesc ? '0.75rem' : '0',
                      }}
                    >
                      {localizedName}
                    </h3>

                    {localizedDesc && (
                      <div
                        style={{
                          maxHeight: isExpanded ? '140px' : '0',
                          opacity: isExpanded ? 1 : 0,
                          overflow: 'hidden',
                          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      >
                        <p
                          className="text-body-sm"
                          style={{
                            maxWidth: '650px',
                            lineHeight: 1.7,
                            marginBottom: '1rem',
                          }}
                        >
                          {localizedDesc}
                        </p>

                        <button
                          onClick={scrollToContact}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 14px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            borderRadius: '4px',
                            color: 'var(--color-bg-primary)',
                            backgroundColor: 'var(--color-accent)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-accent)')}
                        >
                          <span>{t('cta.buttonText')}</span>
                          <ArrowUpRight size={13} className="rtl-arrow-up-right" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Interactive Expand Indicator */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: isExpanded ? 'var(--color-accent-muted)' : 'transparent',
                      color: isExpanded ? 'var(--color-accent)' : 'var(--color-text-dim)',
                      transition: 'all 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.35s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation } from '@/i18n';
import { formatNumber } from '@/utils/formatters';
import {
  ChevronDown,
  ArrowUpRight,
  Globe,
  Target,
  Building2,
  CalendarCheck,
  ShoppingBag,
  Cpu,
  Server,
  LucideIcon
} from 'lucide-react';

// Service icon mapping
const serviceIcons: LucideIcon[] = [
  Globe,          // Website Development
  Target,         // Landing Pages
  Building2,      // Business Websites
  CalendarCheck,  // Booking Systems
  ShoppingBag,    // E-Commerce
  Cpu,            // Custom Web Applications (SaaS)
  Server,         // Maintenance & Hosting
];

// Highlight badges for each service
const serviceBadges: Record<number, string[]> = {
  0: ['React 18', 'TypeScript', 'Edge CDN', '99+ Core Web Vitals'],
  1: ['Conversion-Engineered', 'A/B Testing Ready', 'Micro-Interactions'],
  2: ['Corporate Identity', 'CMS / Control Panel', 'Responsive Architecture'],
  3: ['Real-time Slots', 'WhatsApp / SMS Sync', 'Zero Double-Booking'],
  4: ['Stripe / Local Pay', 'Automated Inventory', 'Sub-second Checkout'],
  5: ['Role-based Auth', 'High-density Dashboards', 'Scalable APIs'],
  6: ['24/7 Health Monitoring', 'Automated Backups', 'Zero-downtime CI/CD'],
};

export function Services() {
  const ref = useScrollReveal(0.1);
  const { services } = useWebsite();
  const { t, decode, language, dict, isRtl } = useTranslation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // First service open by default

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
        <div className="reveal" style={{ marginBottom: '3.5rem' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '1rem' }}>
            {t('services.tag')}
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <h2 className="text-section-title">{t('services.heading')}</h2>
            <p className="text-body" style={{ maxWidth: '480px', color: 'var(--color-text-secondary)' }}>
              {isRtl
                ? 'حلول برمجية وتصميمات مدروسة، مبنية من الصفر عشان تدّي علامتك التجارية تفوق تقني حقيقي وتجربة تبهر عملاءك.'
                : 'Comprehensive digital engineering solutions crafted from scratch to give your business an undeniable competitive edge.'}
            </p>
          </div>
        </div>

        {/* Service Rows */}
        <div
          className="reveal reveal-delay-2"
          role="region"
          aria-label={t('services.listLabel')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          {activeServices.map((service: any, index: number) => {
            const isHovered = hoveredIndex === index;
            const isExpanded = expandedIndex === index;
            const number = String(index + 1).padStart(2, '0');
            const localizedNumber = language === 'ar' ? formatNumber(number, 'ar') : number;

            const localizedName = decode(service.name);
            const localizedDesc = decode(service.shortDescription);
            const Icon = serviceIcons[index % serviceIcons.length];
            const badges = serviceBadges[index] || ['Bespoke', 'High-Performance', 'Full-Stack'];

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
                  backgroundColor: isExpanded
                    ? 'var(--color-bg-surface)'
                    : isHovered
                    ? 'rgba(17, 19, 26, 0.65)'
                    : 'transparent',
                  border: `1px solid ${isExpanded ? 'rgba(0, 210, 255, 0.3)' : isHovered ? 'var(--color-border-default)' : 'var(--color-border-subtle)'}`,
                  borderRadius: '12px',
                  padding: isExpanded ? '2rem 1.75rem' : '1.5rem 1.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden',
                  boxShadow: isExpanded
                    ? '0 12px 30px rgba(0, 0, 0, 0.35), 0 0 20px rgba(0, 210, 255, 0.08)'
                    : isHovered
                    ? '0 4px 16px rgba(0, 0, 0, 0.2)'
                    : 'none',
                }}
              >
                {/* Active Indicator Bar */}
                <div
                  style={{
                    position: 'absolute',
                    insetInlineStart: 0,
                    top: 0,
                    bottom: 0,
                    width: '3.5px',
                    backgroundColor: 'var(--color-accent)',
                    transform: isExpanded ? 'scaleY(1)' : isHovered ? 'scaleY(0.5)' : 'scaleY(0)',
                    transformOrigin: 'center',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '1.5rem',
                    alignItems: 'start',
                  }}
                >
                  {/* Icon & Number Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: isExpanded
                          ? 'rgba(0, 210, 255, 0.15)'
                          : isHovered
                          ? 'var(--color-bg-elevated)'
                          : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isExpanded ? 'var(--color-accent)' : 'var(--color-border-subtle)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isExpanded ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    <span
                      className="text-mono"
                      style={{
                        color: isExpanded ? 'var(--color-accent)' : 'var(--color-text-dim)',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        transition: 'color 0.25s ease',
                      }}
                    >
                      {localizedNumber}
                    </span>
                  </div>

                  {/* Title, Badges & Description */}
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
                        fontWeight: 600,
                        color: isExpanded ? 'var(--color-text-primary)' : isHovered ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        transition: 'color 0.25s ease',
                        marginBottom: isExpanded ? '0.75rem' : '0',
                      }}
                    >
                      {localizedName}
                    </h3>

                    {/* Expanded Detail View */}
                    <div
                      style={{
                        maxHeight: isExpanded ? '280px' : '0',
                        opacity: isExpanded ? 1 : 0,
                        overflow: 'hidden',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {localizedDesc && (
                        <p
                          className="text-body-sm"
                          style={{
                            maxWidth: '700px',
                            lineHeight: 1.75,
                            marginBottom: '1.25rem',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          {localizedDesc}
                        </p>
                      )}

                      {/* Deliverable Highlights Chips */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap',
                          marginBottom: '1.25rem',
                        }}
                      >
                        {badges.map((b) => (
                          <span
                            key={b}
                            style={{
                              fontSize: '0.6875rem',
                              fontFamily: 'var(--font-mono)',
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              backgroundColor: 'rgba(0, 210, 255, 0.08)',
                              color: 'var(--color-accent)',
                              border: '1px solid rgba(0, 210, 255, 0.2)',
                            }}
                          >
                            {b}
                          </span>
                        ))}
                      </div>

                      {/* Direct CTA */}
                      <button
                        onClick={scrollToContact}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 18px',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          borderRadius: '6px',
                          color: 'var(--color-bg-primary)',
                          backgroundColor: 'var(--color-accent)',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 4px 14px rgba(0, 210, 255, 0.25)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <span>{t('cta.buttonText')}</span>
                        <ArrowUpRight size={14} className="rtl-arrow-up-right" />
                      </button>
                    </div>
                  </div>

                  {/* Indicator Toggle Circle */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: isExpanded ? 'rgba(0, 210, 255, 0.15)' : 'var(--color-bg-elevated)',
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

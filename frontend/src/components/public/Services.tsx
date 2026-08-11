import React, { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useWebsite } from '@/context/WebsiteContext';

export function Services() {
  const ref = useScrollReveal(0.1);
  const { services } = useWebsite();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeServices = services || [];

  return (
    <section id="services" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-wide" ref={ref}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: '4rem' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '1rem' }}>
            // SERVICES
          </span>
          <h2 className="text-section-title">WHAT WE BUILD</h2>
        </div>

        {/* Service Rows */}
        <div className="reveal reveal-delay-2">
          {activeServices.map((service, index) => {
            const isHovered = hoveredIndex === index;
            const number = String(index + 1).padStart(2, '0');

            return (
              <div
                key={service.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  position: 'relative',
                  borderTop: index === 0 ? '1px solid var(--color-border-subtle)' : 'none',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  padding: isHovered ? '2.5rem 0' : '1.75rem 0',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  overflow: 'hidden',
                }}
              >
                {/* Hover accent line */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    backgroundColor: 'var(--color-accent)',
                    transform: isHovered ? 'scaleY(1)' : 'scaleY(0)',
                    transformOrigin: 'top',
                    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                />

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr',
                    gap: '2rem',
                    alignItems: 'center',
                  }}
                >
                  {/* Number */}
                  <span
                    className="text-mono"
                    style={{
                      color: isHovered ? 'var(--color-accent)' : 'var(--color-text-dim)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {number}
                  </span>

                  {/* Title & Description */}
                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                        fontWeight: 600,
                        color: isHovered ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        transition: 'color 0.3s ease',
                        marginBottom: isHovered && service.shortDescription ? '0.5rem' : '0',
                      }}
                    >
                      {service.name}
                    </h3>

                    {service.shortDescription && (
                      <p
                        className="text-body-sm"
                        style={{
                          maxHeight: isHovered ? '60px' : '0',
                          opacity: isHovered ? 1 : 0,
                          overflow: 'hidden',
                          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                          maxWidth: '600px',
                        }}
                      >
                        {service.shortDescription}
                      </p>
                    )}
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

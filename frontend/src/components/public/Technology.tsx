import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from '@/i18n';
import { technologies, technologyConnections } from '@/data/technologies';

interface NodePosition {
  x: number;
  y: number;
}

export function Technology() {
  const ref = useScrollReveal(0.1);
  const { t, dict } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<NodePosition[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const calculatePositions = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const w = rect.width;
    const h = Math.max(400, rect.height);
    setDimensions({ width: w, height: h });

    // Arrange in a circular/organic layout
    const centerX = w / 2;
    const centerY = h / 2;
    const radius = Math.min(w, h) * 0.35;

    const newPositions = technologies.map((_, i) => {
      const angle = (i / technologies.length) * Math.PI * 2 - Math.PI / 2;
      const jitterX = (Math.random() - 0.5) * 30;
      const jitterY = (Math.random() - 0.5) * 30;
      return {
        x: centerX + Math.cos(angle) * radius + jitterX,
        y: centerY + Math.sin(angle) * radius + jitterY,
      };
    });

    setPositions(newPositions);
  }, []);

  useEffect(() => {
    calculatePositions();
    window.addEventListener('resize', calculatePositions);
    return () => window.removeEventListener('resize', calculatePositions);
  }, [calculatePositions]);

  const isConnectedToHovered = (index: number): boolean => {
    if (hoveredIndex === null) return false;
    return technologyConnections.some(
      ([a, b]) =>
        (a === hoveredIndex && b === index) ||
        (b === hoveredIndex && a === index) ||
        a === index && a === hoveredIndex ||
        b === index && b === hoveredIndex
    );
  };

  return (
    <section
      className="section-padding grid-bg-dense"
      style={{ backgroundColor: 'var(--color-bg-surface)', overflow: 'hidden' }}
    >
      <div className="container-wide" ref={ref}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '1rem' }}>
            {t('technology.tag')}
          </span>
          <h2 className="text-section-title">{t('technology.heading')}</h2>
          <p className="text-body" style={{ maxWidth: '600px', margin: '1rem auto 0' }}>
            {t('technology.subtitle')}
          </p>
        </div>

        {/* Constellation */}
        <div
          ref={containerRef}
          className="tech-constellation reveal reveal-delay-2"
          style={{
            position: 'relative',
            height: '500px',
            maxWidth: '900px',
            width: '100%',
            minWidth: 0,
            margin: '0 auto',
          }}
        >
          {/* SVG Connections */}
          {positions.length > 0 && (
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              {technologyConnections.map(([from, to], i) => {
                if (!positions[from] || !positions[to]) return null;
                const isHighlighted =
                  hoveredIndex !== null &&
                  (from === hoveredIndex || to === hoveredIndex);

                return (
                  <line
                    key={i}
                    x1={positions[from].x}
                    y1={positions[from].y}
                    x2={positions[to].x}
                    y2={positions[to].y}
                    stroke={isHighlighted ? 'rgba(0, 210, 255, 0.45)' : 'rgba(255, 255, 255, 0.06)'}
                    strokeWidth={isHighlighted ? 1.5 : 0.5}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                );
              })}
            </svg>
          )}

          {/* Nodes */}
          {technologies.map((tech, index) => {
            const pos = positions[index];
            if (!pos) return null;

            const isHovered = hoveredIndex === index;
            const isConnected = isConnectedToHovered(index);
            const isActive = isHovered || isConnected;
            const isDimmed = hoveredIndex !== null && !isActive;

            return (
              <div
                key={tech.name}
                className="tech-node"
                role="button"
                tabIndex={0}
                aria-label={`${tech.name} (${(dict.technology.categories as Record<string, string>)[tech.category] || tech.category})`}
                onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setHoveredIndex(hoveredIndex === index ? null : index);
                  }
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  transform: `translate(-50%, -50%) scale(${isHovered ? 1.1 : 1})`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: isDimmed ? 0.3 : 1,
                  zIndex: isHovered ? 10 : 1,
                  outlineOffset: '6px',
                }}
              >
                {/* Glow ring */}
                <div
                  className="tech-glow"
                  style={{
                    position: 'absolute',
                    inset: '-12px',
                    borderRadius: '50%',
                    border: `1px solid ${isHovered ? 'var(--color-accent)' : isConnected ? 'rgba(0, 210, 255, 0.25)' : 'var(--color-border-subtle)'}`,
                    backgroundColor: isHovered ? 'var(--color-accent-muted)' : 'transparent',
                    transition: 'all 0.3s ease',
                  }}
                />

                {/* Center dot */}
                <div
                  className="tech-dot"
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isHovered ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    position: 'relative',
                    zIndex: 2,
                    transition: 'background-color 0.3s ease',
                  }}
                />

                {/* Label */}
                <div
                  className="tech-label"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '16px',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8125rem',
                    fontWeight: isHovered ? 600 : 500,
                    color: isHovered ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.02em',
                  }}
                >
                  {tech.name}
                </div>

                {/* Category label on hover */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: '16px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span className="text-label" style={{ color: 'var(--color-text-dim)', fontSize: '0.625rem' }}>
                      {(dict.technology.categories as Record<string, string>)[tech.category] || tech.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile fallback: simple grid */}
      <style>{`
        @media (max-width: 640px) {
          .tech-constellation {
            height: auto !important;
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1rem !important;
            position: relative !important;
            max-width: 100% !important;
            min-width: 0 !important;
          }
          .tech-constellation > svg {
            display: none !important;
          }
          .tech-node {
            position: relative !important;
            left: auto !important;
            top: auto !important;
            transform: none !important;
            text-align: center;
            padding: 1.25rem 0.75rem !important;
            border: 1px solid var(--color-border-subtle);
            border-radius: 8px;
            min-width: 0 !important;
          }
          .tech-glow {
            display: none !important;
          }
          .tech-dot {
            width: 8px;
            height: 8px;
            margin: 0 auto;
          }
          .tech-label {
            position: relative !important;
            top: auto !important;
            left: auto !important;
            transform: none !important;
            margin-top: 8px !important;
            white-space: normal !important;
            word-break: break-word !important;
          }
        }
      `}</style>
    </section>
  );
}

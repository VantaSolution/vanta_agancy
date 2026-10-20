import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useTranslation } from '@/i18n';
import { technologies, technologyConnections } from '@/data/technologies';
import { Layers, Server, Database, Cloud, Code } from 'lucide-react';

interface NodePosition {
  x: number;
  y: number;
}

// Fixed deterministic offsets for organic arrangement
const deterministicOffsets = [
  [-12, 10],
  [14, -15],
  [0, -18],
  [18, 12],
  [-10, -8],
  [15, 14],
  [-16, -12],
  [12, -10],
  [-14, 16],
  [8, -14],
];

export function Technology() {
  const ref = useScrollReveal(0.1);
  const { t, dict, isRtl } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<NodePosition[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const calculatePositions = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const w = rect.width;
    const h = Math.max(420, rect.height);

    const centerX = w / 2;
    const centerY = h / 2;
    const radiusX = Math.min(w * 0.42, 360);
    const radiusY = Math.min(h * 0.38, 170);

    const newPositions = technologies.map((_, i) => {
      const angle = (i / technologies.length) * Math.PI * 2 - Math.PI / 2;
      const [offsetX, offsetY] = deterministicOffsets[i % deterministicOffsets.length];
      return {
        x: centerX + Math.cos(angle) * radiusX + offsetX,
        y: centerY + Math.sin(angle) * radiusY + offsetY,
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
        (a === index && a === hoveredIndex) ||
        (b === index && b === hoveredIndex)
    );
  };

  const categories = [
    { name: 'Frontend', icon: Layers, label: t('technology.categories.Frontend') },
    { name: 'Backend', icon: Server, label: t('technology.categories.Backend') },
    { name: 'Database', icon: Database, label: t('technology.categories.Database') },
    { name: 'Infrastructure', icon: Cloud, label: t('technology.categories.Infrastructure') },
    { name: 'Architecture', icon: Code, label: t('technology.categories.Architecture') },
  ];

  return (
    <section
      id="technology"
      className="section-padding grid-bg-dense"
      style={{ backgroundColor: 'var(--color-bg-surface)', overflow: 'hidden', position: 'relative' }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0, 210, 255, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-wide" ref={ref} style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '1rem' }}>
            {t('technology.tag')}
          </span>
          <h2 className="text-section-title">{t('technology.heading')}</h2>
          <p className="text-body" style={{ maxWidth: '620px', margin: '1rem auto 0', color: 'var(--color-text-secondary)' }}>
            {t('technology.subtitle')}
          </p>
        </div>

        {/* Constellation Container */}
        <div
          ref={containerRef}
          className="tech-constellation reveal reveal-delay-2"
          style={{
            position: 'relative',
            height: '460px',
            maxWidth: '920px',
            width: '100%',
            minWidth: 0,
            margin: '0 auto',
          }}
        >
          {/* SVG Connections with High Visibility & Glow */}
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
                    stroke={isHighlighted ? 'rgba(0, 210, 255, 0.85)' : 'rgba(255, 255, 255, 0.08)'}
                    strokeWidth={isHighlighted ? 2 : 0.75}
                    style={{
                      transition: 'stroke 0.3s ease, stroke-width 0.3s ease',
                      filter: isHighlighted ? 'drop-shadow(0 0 6px rgba(0, 210, 255, 0.6))' : 'none',
                    }}
                  />
                );
              })}
            </svg>
          )}

          {/* Interactive Technology Nodes */}
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
                  transform: `translate(-50%, -50%) scale(${isHovered ? 1.15 : 1})`,
                  cursor: 'pointer',
                  transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
                  opacity: isDimmed ? 0.25 : 1,
                  zIndex: isHovered ? 10 : 2,
                  outlineOffset: '6px',
                }}
              >
                {/* Outer Glow Ring */}
                <div
                  className="tech-glow"
                  style={{
                    position: 'absolute',
                    inset: '-14px',
                    borderRadius: '50%',
                    border: `1px solid ${isHovered ? 'var(--color-accent)' : isConnected ? 'rgba(0, 210, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)'}`,
                    backgroundColor: isHovered ? 'rgba(0, 210, 255, 0.18)' : isConnected ? 'rgba(0, 210, 255, 0.05)' : 'transparent',
                    boxShadow: isHovered ? '0 0 20px rgba(0, 210, 255, 0.35)' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />

                {/* Core Node Dot */}
                <div
                  className="tech-dot"
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: isHovered ? 'var(--color-accent)' : isConnected ? '#00D2FF' : 'var(--color-text-secondary)',
                    position: 'relative',
                    zIndex: 2,
                    boxShadow: isHovered || isConnected ? '0 0 10px #00D2FF' : 'none',
                    transition: 'all 0.3s ease',
                  }}
                />

                {/* Permanent Name Pill */}
                <div
                  className="tech-label"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '14px',
                    whiteSpace: 'nowrap',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.8125rem',
                    fontWeight: isHovered ? 700 : 500,
                    color: isHovered ? 'var(--color-accent)' : 'var(--color-text-primary)',
                    backgroundColor: 'rgba(9, 10, 15, 0.85)',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    border: `1px solid ${isHovered ? 'rgba(0, 210, 255, 0.4)' : 'rgba(255, 255, 255, 0.06)'}`,
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    transition: 'all 0.3s ease',
                    letterSpacing: '0.02em',
                  }}
                >
                  {tech.name}
                </div>

                {/* Category Floater on Hover */}
                {isHovered && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      marginBottom: '16px',
                      whiteSpace: 'nowrap',
                      backgroundColor: 'var(--color-bg-primary)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: '1px solid var(--color-accent)',
                      boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <span className="text-mono" style={{ color: 'var(--color-accent)', fontSize: '0.6875rem' }}>
                      {(dict.technology.categories as Record<string, string>)[tech.category] || tech.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tech Stack Pillars Legend */}
        <div
          className="reveal reveal-delay-3"
          style={{
            marginTop: '3.5rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border-subtle)',
                  color: 'var(--color-text-secondary)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.35)';
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <Icon size={14} style={{ color: 'var(--color-accent)' }} />
                <span>{cat.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Responsive mobile grid fallback */}
      <style>{`
        @media (max-width: 640px) {
          .tech-constellation {
            height: auto !important;
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 1rem !important;
            position: relative !important;
            max-width: 100% !important;
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
            border-radius: 10px;
            background-color: var(--color-bg-primary);
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
            padding: 0 !important;
            border: none !important;
            background: none !important;
          }
        }
      `}</style>
    </section>
  );
}

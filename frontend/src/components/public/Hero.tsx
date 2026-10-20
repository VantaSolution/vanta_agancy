import React, { useRef, useEffect, useCallback } from 'react';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation } from '@/i18n';
import { ChevronDown, Activity } from 'lucide-react';

// ─── Canvas Animation: Interactive Constellation & Quantum Nodes ───
function useDigitalCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<{ x: number; y: number; vx: number; vy: number; radius: number; isAnchor?: boolean; pulse?: number }[]>([]);
  const dimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  const init = useCallback((canvas: HTMLCanvasElement) => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    dimensionsRef.current = { width, height };
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);

    // Create nodes with distinct hierarchy (regular nodes + glowing anchors)
    const nodeCount = Math.min(55, Math.max(25, Math.floor(width / 22)));
    nodesRef.current = Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: i % 7 === 0 ? 3.5 : Math.random() * 1.8 + 1,
      isAnchor: i % 7 === 0,
      pulse: Math.random() * Math.PI * 2,
    }));
  }, []);

  const animate = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensionsRef.current;
    if (width === 0 || height === 0) return;

    ctx.clearRect(0, 0, width, height);

    const nodes = nodesRef.current;
    const connectionDistance = 145;
    const mouse = mouseRef.current;
    const mouseDistMax = 160;

    // Update positions
    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
      node.x = Math.max(0, Math.min(width, node.x));
      node.y = Math.max(0, Math.min(height, node.y));

      if (node.pulse !== undefined) {
        node.pulse += 0.03;
      }

      // Gentle interactive mouse repulsion/connection
      if (mouse.active) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseDistMax && dist > 0) {
          const force = (1 - dist / mouseDistMax) * 0.35;
          node.x += (dx / dist) * force;
          node.y += (dy / dist) * force;
        }
      }
    });

    // Draw node-to-node connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.28;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0, 210, 255, ${opacity})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }

      // Connect to mouse if active and within proximity
      if (mouse.active) {
        const dx = nodes[i].x - mouse.x;
        const dy = nodes[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseDistMax) {
          const opacity = (1 - dist / mouseDistMax) * 0.45;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 210, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw nodes & anchor glow rings
    nodes.forEach((node) => {
      if (node.isAnchor) {
        const pulseScale = Math.sin(node.pulse || 0) * 2 + 6;
        // Outer glow halo
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseScale, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 210, 255, 0.15)';
        ctx.fill();

        // Core anchor
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#00D2FF';
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 210, 255, 0.7)';
        ctx.fill();
      }
    });

    animationRef.current = requestAnimationFrame(() => animate(canvas));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    init(canvas);
    animate(canvas);

    const handleResize = () => {
      if (canvas) init(canvas);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [canvasRef, init, animate]);
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useDigitalCanvas(canvasRef);
  const { content } = useWebsite();
  const { t, decode, isRtl } = useTranslation();

  const headline = content?.hero?.headline ? decode(content.hero.headline) : t('hero.headline');
  const description = content?.hero?.description ? decode(content.hero.description) : t('hero.description');
  const secondaryCta = content?.hero?.secondaryCta ? decode(content.hero.secondaryCta) : t('hero.secondaryCta');

  const scrollToWork = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="grid-bg"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: '80px',
      }}
    >
      {/* Ambient Radial Lighting Spotlight */}
      <div
        style={{
          position: 'absolute',
          top: '25%',
          insetInlineEnd: '15%',
          width: 'clamp(400px, 50vw, 750px)',
          height: 'clamp(400px, 50vw, 750px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.12) 0%, rgba(0, 210, 255, 0.02) 45%, transparent 70%)',
          pointerEvents: 'none',
          filter: 'blur(30px)',
        }}
      />

      {/* Subtle secondary backlight */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          insetInlineStart: '10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 210, 255, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Interactive Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          insetInlineEnd: 0,
          width: '65%',
          height: '100%',
          opacity: 0.75,
          pointerEvents: 'none',
        }}
      />

      {/* Gradient Mask for High Contrast Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isRtl
            ? 'linear-gradient(225deg, var(--color-bg-primary) 35%, rgba(9, 10, 15, 0.6) 70%, transparent 100%)'
            : 'linear-gradient(135deg, var(--color-bg-primary) 35%, rgba(9, 10, 15, 0.6) 70%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Edge Ambient Highlight Line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
          opacity: 0.4,
        }}
      />

      <div
        className="container-wide"
        style={{
          position: 'relative',
          zIndex: 2,
          paddingTop: '3.5rem',
          paddingBottom: '3.5rem',
        }}
      >
        <div style={{ maxWidth: '820px' }}>
          {/* Studio Meta Badge & Status Pill */}
          <div
            className="hero-reveal hero-reveal-delay-1"
            style={{
              display: 'flex',
              gap: '1.25rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '5px 12px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(0, 210, 255, 0.08)',
                border: '1px solid rgba(0, 210, 255, 0.25)',
                color: 'var(--color-accent)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}
            >
              <Activity size={13} className="pulse-dot" />
              <span>{t('hero.digitalStudio')}</span>
            </div>

            <span className="text-label" style={{ color: 'var(--color-text-dim)' }}>—</span>
            <span className="text-label" style={{ color: 'var(--color-text-secondary)' }}>{t('hero.webDevelopment')}</span>
            <span className="text-label" style={{ color: 'var(--color-text-dim)' }}>—</span>
            <span className="text-label" style={{ color: 'var(--color-text-muted)' }}>{t('hero.established')}</span>
          </div>

          {/* Dynamic Headline with Refined Typography & Accent */}
          <h1
            className="text-display hero-reveal hero-reveal-delay-2"
            style={{
              marginBottom: '1.5rem',
              maxWidth: '780px',
              whiteSpace: 'pre-line',
              letterSpacing: isRtl ? 'normal' : '-0.03em',
              lineHeight: isRtl ? 1.3 : 1.08,
            }}
          >
            {headline}
          </h1>

          {/* Dynamic Subheading Description */}
          <p
            className="text-body-lg hero-reveal hero-reveal-delay-3"
            style={{
              maxWidth: '560px',
              marginBottom: '2.5rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.75,
            }}
          >
            {description}
          </p>

          {/* Exploration Action */}
          <div
            className="hero-reveal hero-reveal-delay-4"
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}
          >
            <button
              onClick={scrollToWork}
              className="hero-explore-btn"
              aria-label={secondaryCta}
            >
              <span>{secondaryCta}</span>
              <ChevronDown size={16} className="hero-explore-chevron" />
            </button>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div
          className="hero-reveal hero-reveal-delay-5"
          style={{
            position: 'absolute',
            bottom: '2rem',
            insetInlineStart: 'clamp(1.5rem, 4vw, 4rem)',
            insetInlineEnd: 'clamp(1.5rem, 4vw, 4rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem 1.5rem',
            pointerEvents: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="text-mono" style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem' }}>
              {t('hero.version')}
            </span>
          </div>

          <span className="text-mono" style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem', opacity: 0.75 }}>
            {isRtl ? 'انزل للاستكشاف ↓' : 'Scroll to explore ↓'}
          </span>
        </div>
      </div>
    </section>
  );
}

import React, { useRef, useEffect, useCallback } from 'react';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation } from '@/i18n';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

// ─── Canvas Animation: Digital System ───
function useDigitalCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<{ x: number; y: number; vx: number; vy: number; radius: number; }[]>([]);
  const dimensionsRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

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

    // Create nodes
    const nodeCount = Math.min(40, Math.floor(width / 25));
    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
    }));
  }, []);

  const animate = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = dimensionsRef.current;
    if (width === 0 || height === 0) return;

    ctx.clearRect(0, 0, width, height);

    const nodes = nodesRef.current;
    const connectionDistance = 140;

    // Update positions
    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
      node.x = Math.max(0, Math.min(width, node.x));
      node.y = Math.max(0, Math.min(height, node.y));
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0, 210, 255, ${opacity})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 210, 255, 0.75)';
      ctx.fill();
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
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [canvasRef, init, animate]);
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useDigitalCanvas(canvasRef);
  const { content } = useWebsite();
  const { t, decode, isRtl } = useTranslation();

  // If content has bilingual text or is default, decode properly or fallback to localized translation
  const headline = content?.hero?.headline ? decode(content.hero.headline) : t('hero.headline');
  const description = content?.hero?.description ? decode(content.hero.description) : t('hero.description');
  const primaryCta = content?.hero?.primaryCta ? decode(content.hero.primaryCta) : t('hero.primaryCta');
  const secondaryCta = content?.hero?.secondaryCta ? decode(content.hero.secondaryCta) : t('hero.secondaryCta');

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

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
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          insetInlineEnd: 0,
          width: '60%',
          height: '100%',
          opacity: 0.6,
          pointerEvents: 'none',
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isRtl
            ? 'linear-gradient(225deg, var(--color-bg-primary) 40%, transparent 100%)'
            : 'linear-gradient(135deg, var(--color-bg-primary) 40%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top edge accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)',
          opacity: 0.3,
        }}
      />

      <div className="container-wide" style={{ position: 'relative', zIndex: 2, paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ maxWidth: '800px' }}>
          {/* Meta labels */}
          <div
            className="hero-reveal hero-reveal-delay-1"
            style={{
              display: 'flex',
              gap: '1.5rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <span className="text-label-accent">{t('hero.digitalStudio')}</span>
            <span className="text-label" style={{ color: 'var(--color-text-dim)' }}>—</span>
            <span className="text-label">{t('hero.webDevelopment')}</span>
            <span className="text-label" style={{ color: 'var(--color-text-dim)' }}>—</span>
            <span className="text-label">{t('hero.established')}</span>
          </div>

          {/* Dynamic Headline */}
          <h1
            className="text-display hero-reveal hero-reveal-delay-2"
            style={{
              marginBottom: '1.5rem',
              maxWidth: '750px',
              whiteSpace: 'pre-line',
            }}
          >
            {headline}
          </h1>

          {/* Dynamic Description */}
          <p
            className="text-body-lg hero-reveal hero-reveal-delay-3"
            style={{
              maxWidth: '540px',
              marginBottom: '2.5rem',
            }}
          >
            {description}
          </p>

          {/* CTAs */}
          <div
            className="hero-reveal hero-reveal-delay-4"
            style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <button
              onClick={scrollToContact}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--color-bg-primary)',
                backgroundColor: 'var(--color-accent)',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 210, 255, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>{primaryCta}</span>
              <ArrowUpRight size={16} strokeWidth={2.5} className="rtl-arrow-up-right" />
            </button>

            <button
              onClick={scrollToWork}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 28px',
                fontSize: '0.9375rem',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                backgroundColor: 'transparent',
                borderRadius: '6px',
                border: '1px solid var(--color-border-strong)',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)';
                e.currentTarget.style.color = 'var(--color-accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border-strong)';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
            >
              <span>{secondaryCta}</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Bottom metadata row */}
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
            <span
              className="pulse-dot"
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-accent)',
                display: 'inline-block',
              }}
            />
            <span className="text-mono" style={{ color: 'var(--color-text-muted)', fontSize: '0.6875rem' }}>
              {t('hero.availableForProjects')}
            </span>
          </div>

          <span className="text-mono" style={{ color: 'var(--color-text-dim)', fontSize: '0.6875rem' }}>
            {t('hero.version')}
          </span>
        </div>
      </div>
    </section>
  );
}

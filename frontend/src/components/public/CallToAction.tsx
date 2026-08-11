import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useWebsite } from '@/context/WebsiteContext';
import { ArrowUpRight } from 'lucide-react';

export function CallToAction() {
  const ref = useScrollReveal(0.15);
  const { content } = useWebsite();

  const ctaContent = content?.cta || {
    heading: "HAVE AN IDEA?\nLET'S BUILD IT.",
    description: "Tell us what you're building, what problem you're solving, and what you want your website to achieve.",
    buttonText: "Start a Project",
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="section-padding noise-overlay"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0A0A0B 0%, #141415 40%, #1A1A0E 100%)',
      }}
    >
      {/* Accent glow */}
      <div
        style={{
          position: 'absolute',
          top: '-200px',
          right: '-200px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 255, 74, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232, 255, 74, 0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container-narrow" ref={ref} style={{ position: 'relative', zIndex: 2 }}>
        <div className="reveal" style={{ textAlign: 'center' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '2rem' }}>
            // LET'S TALK
          </span>

          <h2
            className="text-display"
            style={{
              marginBottom: '1.5rem',
              lineHeight: 1.1,
              whiteSpace: 'pre-line',
            }}
          >
            {ctaContent.heading}
          </h2>

          <p
            className="text-body-lg reveal reveal-delay-2"
            style={{
              maxWidth: '500px',
              margin: '0 auto 2.5rem',
            }}
          >
            {ctaContent.description}
          </p>

          <button
            className="reveal reveal-delay-3"
            onClick={scrollToContact}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 36px',
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--color-bg-primary)',
              backgroundColor: 'var(--color-accent)',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(232, 255, 74, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {ctaContent.buttonText}
            <ArrowUpRight size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}

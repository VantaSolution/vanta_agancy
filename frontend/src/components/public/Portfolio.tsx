import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useWebsite } from '@/context/WebsiteContext';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';

// ─── Project Card (for when projects exist) ───
function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.projectUrl || '#'}
      target={project.projectUrl ? '_blank' : undefined}
      rel="noopener noreferrer"
      style={{
        display: 'block',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-accent)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Project Image */}
      {project.projectImage && (
        <div
          style={{
            width: '100%',
            height: '240px',
            backgroundColor: 'var(--color-bg-elevated)',
            backgroundImage: `url(${project.projectImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Project Info */}
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
          <div>
            <span className="text-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
              {project.category}
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              {project.name}
            </h3>
          </div>
          <ArrowUpRight size={18} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
        </div>

        <p className="text-body-sm" style={{ marginBottom: '1rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {project.shortDescription}
        </p>

        {project.technologies && project.technologies.length > 0 && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {project.technologies.map((tech) => (
              <span
                key={tech}
                style={{
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}

// ─── Empty State ───
function PortfolioEmptyState() {
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'clamp(4rem, 8vw, 8rem) 2rem',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background grid */}
      <div
        className="grid-bg"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />

      {/* Corner brackets */}
      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', width: '20px', height: '20px', borderTop: '1px solid var(--color-accent)', borderLeft: '1px solid var(--color-accent)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', width: '20px', height: '20px', borderTop: '1px solid var(--color-accent)', borderRight: '1px solid var(--color-accent)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', width: '20px', height: '20px', borderBottom: '1px solid var(--color-accent)', borderLeft: '1px solid var(--color-accent)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', width: '20px', height: '20px', borderBottom: '1px solid var(--color-accent)', borderRight: '1px solid var(--color-accent)', opacity: 0.5 }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <span className="text-label" style={{ display: 'block', marginBottom: '1.5rem' }}>
          [ PORTFOLIO ]
        </span>

        <h3
          className="text-section-subtitle"
          style={{
            marginBottom: '1.5rem',
            maxWidth: '600px',
            margin: '0 auto 1.5rem',
          }}
        >
          SELECTIVE CASE STUDIES ARE CURATED PER CLIENT INQUIRY.
        </h3>

        <p
          className="text-body"
          style={{
            maxWidth: '540px',
            margin: '0 auto 2.5rem',
          }}
        >
          We build custom websites, booking systems, and web applications. Every project is engineered for speed, conversion, and brand presence.
        </p>

        <button
          onClick={scrollToContact}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 28px',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            color: 'var(--color-bg-primary)',
            backgroundColor: 'var(--color-accent)',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            fontFamily: 'var(--font-body)',
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
          START A PROJECT
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

// ─── Portfolio Section ───
export function Portfolio() {
  const ref = useScrollReveal(0.1);
  const { projects } = useWebsite();

  // Published projects
  const publishedProjects = (projects || []).filter((p) => p.isPublished);

  return (
    <section id="work" className="section-padding">
      <div className="container-wide" ref={ref}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '1rem' }}>
            // WORK
          </span>
          <h2 className="text-section-title">SELECTED WORK</h2>
        </div>

        {/* Content */}
        <div className="reveal reveal-delay-2">
          {publishedProjects.length === 0 ? (
            <PortfolioEmptyState />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {publishedProjects
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

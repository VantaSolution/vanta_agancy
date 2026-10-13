import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation } from '@/i18n';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';

// ─── Project Card (for when projects exist) ───
function ProjectCard({ project }: { project: Project }) {
  const { decode, t } = useTranslation();
  const name = decode(project.name);
  const category = decode(project.category);
  const shortDescription = decode(project.shortDescription);
  const hasUrl = Boolean(project.projectUrl && project.projectUrl !== '#');

  const handleClick = (e: React.MouseEvent) => {
    if (!hasUrl) {
      e.preventDefault();
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cardStyle: React.CSSProperties = {
    display: 'block',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: 'var(--color-bg-surface)',
    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
    cursor: 'pointer',
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  };

  const content = (
    <>
      {/* Project Image */}
      {project.projectImage && (
        <div style={{ width: '100%', height: '240px', overflow: 'hidden', backgroundColor: 'var(--color-bg-elevated)', position: 'relative' }}>
          <img
            src={project.projectImage}
            alt={name}
            loading="lazy"
            decoding="async"
            width={400}
            height={240}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              transition: 'transform 0.5s ease',
            }}
          />
        </div>
      )}

      {/* Project Info */}
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
          <div>
            {category && (
              <span className="text-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-accent)' }}>
                {category}
              </span>
            )}
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
              }}
            >
              {name}
            </h3>
          </div>
          <ArrowUpRight size={18} className="rtl-arrow-up-right" style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
        </div>

        {shortDescription && (
          <p className="text-body-sm" style={{ marginBottom: '1rem', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {shortDescription}
          </p>
        )}

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
    </>
  );

  if (hasUrl) {
    return (
      <a
        href={project.projectUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} - ${category || t('portfolio.liveSite')}`}
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-accent)';
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
        }}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        }
      }}
      aria-label={`${name} - ${t('portfolio.ctaButton')}`}
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-accent)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
      }}
    >
      {content}
    </div>
  );
}

// ─── Empty State ───
function PortfolioEmptyState() {
  const { t } = useTranslation();
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
        backgroundColor: 'var(--color-bg-surface)',
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
      <div style={{ position: 'absolute', top: '1.5rem', insetInlineStart: '1.5rem', width: '20px', height: '20px', borderTop: '1px solid var(--color-accent)', borderInlineStart: '1px solid var(--color-accent)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: '1.5rem', insetInlineEnd: '1.5rem', width: '20px', height: '20px', borderTop: '1px solid var(--color-accent)', borderInlineEnd: '1px solid var(--color-accent)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: '1.5rem', insetInlineStart: '1.5rem', width: '20px', height: '20px', borderBottom: '1px solid var(--color-accent)', borderInlineStart: '1px solid var(--color-accent)', opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: '1.5rem', insetInlineEnd: '1.5rem', width: '20px', height: '20px', borderBottom: '1px solid var(--color-accent)', borderInlineEnd: '1px solid var(--color-accent)', opacity: 0.5 }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <span className="text-label" style={{ display: 'block', marginBottom: '1.5rem' }}>
          {t('portfolio.emptyTag')}
        </span>

        <h3
          className="text-section-subtitle"
          style={{
            marginBottom: '1.5rem',
            maxWidth: '650px',
            margin: '0 auto 1.5rem',
          }}
        >
          {t('portfolio.selectiveCaseStudies')}
        </h3>

        <p
          className="text-body"
          style={{
            maxWidth: '560px',
            margin: '0 auto 2.5rem',
          }}
        >
          {t('portfolio.emptyDescription')}
        </p>

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
          <span>{t('portfolio.ctaButton')}</span>
          <ArrowUpRight size={16} strokeWidth={2.5} className="rtl-arrow-up-right" />
        </button>
      </div>
    </div>
  );
}

export function Portfolio() {
  const ref = useScrollReveal(0.1);
  const { projects } = useWebsite();
  const { t, decode } = useTranslation();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const publishedProjects = (projects || []).filter((p) => p.isPublished);

  // Extract distinct categories
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    publishedProjects.forEach((p) => {
      const cat = decode(p.category);
      if (cat) set.add(cat);
    });
    return ['all', ...Array.from(set)];
  }, [publishedProjects, decode]);

  const filteredProjects = selectedCategory === 'all'
    ? publishedProjects
    : publishedProjects.filter((p) => decode(p.category) === selectedCategory);

  return (
    <section id="work" className="section-padding" style={{ position: 'relative' }}>
      <div className="container-wide" ref={ref}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '1rem' }}>
            {t('portfolio.tag')}
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
            <h2 className="text-section-title">{t('portfolio.heading')}</h2>

            {/* Category filter tabs if multiple categories exist */}
            {publishedProjects.length > 0 && categories.length > 2 && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} role="tablist" aria-label={t('portfolio.filterLabel')}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    role="tab"
                    aria-selected={selectedCategory === cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '6px 14px',
                      fontSize: '0.8125rem',
                      fontWeight: selectedCategory === cat ? 600 : 400,
                      borderRadius: '20px',
                      border: `1px solid ${selectedCategory === cat ? 'var(--color-accent)' : 'var(--color-border-subtle)'}`,
                      backgroundColor: selectedCategory === cat ? 'var(--color-accent-muted)' : 'var(--color-bg-elevated)',
                      color: selectedCategory === cat ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {cat === 'all' ? (t('common.all') || 'All') : cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="reveal reveal-delay-2">
          {publishedProjects.length === 0 ? (
            <PortfolioEmptyState />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                gap: '2rem',
              }}
            >
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

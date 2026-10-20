import React, { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation } from '@/i18n';
import { ArrowUpRight, Sparkles, ExternalLink } from 'lucide-react';
import type { Project } from '@/types';

// ─── Project Card ───
function ProjectCard({ project }: { project: Project }) {
  const { decode, t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const name = decode(project.name);
  const category = decode(project.category);
  const shortDescription = decode(project.shortDescription);
  const clientName = decode(project.clientName);
  const hasUrl = Boolean(project.projectUrl && project.projectUrl !== '#');

  const handleClick = (e: React.MouseEvent) => {
    if (!hasUrl) {
      e.preventDefault();
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const cardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${isHovered ? 'var(--color-accent)' : 'var(--color-border-subtle)'}`,
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: 'var(--color-bg-surface)',
    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease',
    transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
    boxShadow: isHovered
      ? '0 16px 36px rgba(0, 0, 0, 0.45), 0 0 24px rgba(0, 210, 255, 0.12)'
      : '0 4px 16px rgba(0, 0, 0, 0.25)',
    cursor: 'pointer',
    textDecoration: 'none',
    position: 'relative',
    height: '100%',
  };

  const content = (
    <>
      {/* Project Image & Frame */}
      {project.projectImage && (
        <div
          style={{
            width: '100%',
            aspectRatio: '16/10',
            overflow: 'hidden',
            backgroundColor: 'var(--color-bg-elevated)',
            position: 'relative',
          }}
        >
          <img
            src={project.projectImage}
            alt={name}
            loading="lazy"
            decoding="async"
            width={640}
            height={400}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center',
              display: 'block',
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s ease',
              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
              filter: isHovered ? 'brightness(1.04)' : 'brightness(0.96)',
            }}
          />

          {/* Subtle gradient vignette at bottom of image */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(17, 19, 26, 0.85) 0%, rgba(17, 19, 26, 0) 40%)',
              pointerEvents: 'none',
            }}
          />

          {/* Featured / Category Chip overlaid on image */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              insetInlineStart: '12px',
              display: 'flex',
              gap: '6px',
            }}
          >
            {project.isFeatured && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(9, 10, 15, 0.75)',
                  border: '1px solid rgba(0, 210, 255, 0.35)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  color: 'var(--color-accent)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                <Sparkles size={11} />
                <span>{t('status.featured')}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Project Content */}
      <div
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Header Row: Category & Client */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.625rem',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {category && (
              <span
                className="text-label"
                style={{
                  color: 'var(--color-accent)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {category}
              </span>
            )}
            {clientName && (
              <span
                className="text-mono"
                style={{
                  color: 'var(--color-text-dim)',
                  fontSize: '0.6875rem',
                }}
              >
                {clientName}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: isHovered ? 'var(--color-accent)' : 'var(--color-text-primary)',
              transition: 'color 0.25s ease',
              marginBottom: '0.75rem',
              lineHeight: 1.3,
            }}
          >
            {name}
          </h3>

          {/* Short Description */}
          {shortDescription && (
            <p
              className="text-body-sm"
              style={{
                marginBottom: '1.25rem',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
                lineClamp: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {shortDescription}
            </p>
          )}
        </div>

        {/* Footer: Technologies & CTA arrow */}
        <div>
          {project.technologies && project.technologies.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
                marginBottom: '1rem',
              }}
            >
              {project.technologies.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    color: 'var(--color-text-muted)',
                    border: '1px solid var(--color-border-subtle)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 4 && (
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    color: 'var(--color-text-dim)',
                  }}
                >
                  +{project.technologies.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Card Action Link */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: isHovered ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                transition: 'color 0.2s ease',
              }}
            >
              {hasUrl ? t('portfolio.liveSite') : t('portfolio.ctaButton')}
            </span>

            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: isHovered ? 'var(--color-accent)' : 'var(--color-bg-elevated)',
                color: isHovered ? 'var(--color-bg-primary)' : 'var(--color-text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.25s ease',
                transform: isHovered ? 'translateY(-2px)' : 'none',
              }}
            >
              {hasUrl ? (
                <ExternalLink size={14} />
              ) : (
                <ArrowUpRight size={14} className="rtl-arrow-up-right" />
              )}
            </div>
          </div>
        </div>
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        >
          <span>{t('portfolio.ctaButton')}</span>
          <ArrowUpRight size={16} strokeWidth={2.5} className="rtl-arrow-up-right" />
        </button>
      </div>
    </div>
  );
}

// ─── Portfolio Component ───
export function Portfolio() {
  const ref = useScrollReveal(0.1);
  const { projects } = useWebsite();
  const { t, decode } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
            <div>
              <h2 className="text-section-title">{t('portfolio.heading')}</h2>
            </div>

            {/* Category filter tabs if multiple categories exist */}
            {publishedProjects.length > 0 && categories.length > 2 && (
              <div
                style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}
                role="tablist"
                aria-label={t('portfolio.filterLabel')}
              >
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedCategory(cat)}
                      style={{
                        padding: '6px 16px',
                        fontSize: '0.8125rem',
                        fontWeight: isSelected ? 600 : 500,
                        borderRadius: '9999px',
                        border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border-subtle)'}`,
                        backgroundColor: isSelected ? 'rgba(0, 210, 255, 0.12)' : 'var(--color-bg-elevated)',
                        color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'var(--color-border-strong)';
                          e.currentTarget.style.color = 'var(--color-text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                          e.currentTarget.style.color = 'var(--color-text-secondary)';
                        }
                      }}
                    >
                      {cat === 'all' ? (t('common.all') || 'All') : cat}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="reveal reveal-delay-2">
          {publishedProjects.length === 0 ? (
            <PortfolioEmptyState />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
                gap: '2rem',
                alignItems: 'stretch',
              }}
            >
              {filteredProjects.map((project, idx) => (
                <div key={project.id} className={`reveal reveal-delay-${(idx % 4) + 1}`}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

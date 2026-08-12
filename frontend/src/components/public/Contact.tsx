import React, { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { messagesAPI } from '@/api/endpoints';
import { Send, Mail, MapPin, Instagram, Linkedin, Github } from 'lucide-react';
import type { ContactFormData } from '@/types';

const projectTypes = [
  'Business Website',
  'Landing Page',
  'E-Commerce',
  'Booking System',
  'Custom Web App',
  'Website Redesign',
  'Maintenance & Hosting',
  'Other',
];

const budgetRanges = [
  'Under $2,000',
  '$2,000 — $5,000',
  '$5,000 — $10,000',
  '$10,000 — $25,000',
  '$25,000+',
  'Not sure yet',
];

interface FormErrors {
  [key: string]: string;
}

export function Contact() {
  const ref = useScrollReveal(0.1);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    company: '',
    projectType: '',
    budgetRange: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.message.trim()) newErrors.message = 'Please describe your project';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await messagesAPI.submit(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', company: '', projectType: '', budgetRange: '', message: '' });
    } catch (err) {
      console.error('Failed to submit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    background: 'var(--color-bg-elevated)',
    border: `1px solid ${hasError ? 'var(--color-status-error)' : 'var(--color-border-subtle)'}`,
    borderRadius: '6px',
    padding: '12px 16px',
    color: 'var(--color-text-primary)',
    fontSize: '0.9375rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    color: 'var(--color-text-muted)',
  };

  return (
    <section id="contact" className="section-padding" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
      <div className="container-wide" ref={ref}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '1rem' }}>
            // CONTACT
          </span>
          <h2 className="text-section-title">START A PROJECT</h2>
        </div>

        <div
          className="reveal reveal-delay-2"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.3fr 1fr',
            gap: 'clamp(3rem, 6vw, 5rem)',
            alignItems: 'start',
          }}
        >
          {/* Form */}
          <div>
            {isSubmitted ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '4rem 2rem',
                  border: '1px solid var(--color-accent)',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-accent-muted)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: 'var(--color-accent)',
                    marginBottom: '0.75rem',
                  }}
                >
                  MESSAGE SENT
                </h3>
                <p className="text-body">
                  Thank you! We'll review your project and get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  style={{
                    marginTop: '1.5rem',
                    padding: '10px 20px',
                    fontSize: '0.8125rem',
                    fontWeight: 500,
                    color: 'var(--color-text-primary)',
                    backgroundColor: 'transparent',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label htmlFor="contact-name" style={labelStyle}>Name *</label>
                    <input
                      id="contact-name"
                      aria-label="Name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Your name"
                      style={inputStyle(!!errors.name)}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-muted)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = errors.name ? 'var(--color-status-error)' : 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    {errors.name && <span style={{ fontSize: '0.75rem', color: 'var(--color-status-error)', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
                  </div>
                  <div>
                    <label htmlFor="contact-email" style={labelStyle}>Email *</label>
                    <input
                      id="contact-email"
                      aria-label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="you@company.com"
                      style={inputStyle(!!errors.email)}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-muted)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? 'var(--color-status-error)' : 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                    {errors.email && <span style={{ fontSize: '0.75rem', color: 'var(--color-status-error)', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="contact-company" style={labelStyle}>Company</label>
                  <input
                    id="contact-company"
                    aria-label="Company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder="Company name (optional)"
                    style={inputStyle(false)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-muted)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label htmlFor="project-type" style={labelStyle}>Project Type</label>
                    <select
                      id="project-type"
                      aria-label="Project Type"
                      value={formData.projectType}
                      onChange={(e) => handleChange('projectType', e.target.value)}
                      style={{
                        ...inputStyle(false),
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 14px center',
                        paddingRight: '36px',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-muted)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <option value="" style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}>Select type</option>
                      {projectTypes.map((type) => (
                        <option key={type} value={type} style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-primary)' }}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget-range" style={labelStyle}>Budget Range</label>
                    <select
                      id="budget-range"
                      aria-label="Budget Range"
                      value={formData.budgetRange}
                      onChange={(e) => handleChange('budgetRange', e.target.value)}
                      style={{
                        ...inputStyle(false),
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717A' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 14px center',
                        paddingRight: '36px',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-muted)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <option value="" style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}>Select budget</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range} style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-primary)' }}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="contact-message" style={labelStyle}>Project Details *</label>
                  <textarea
                    id="contact-message"
                    aria-label="Project Details"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                    rows={5}
                    style={{
                      ...inputStyle(!!errors.message),
                      resize: 'vertical',
                      minHeight: '120px',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-muted)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = errors.message ? 'var(--color-status-error)' : 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                  {errors.message && <span style={{ fontSize: '0.75rem', color: 'var(--color-status-error)', marginTop: '4px', display: 'block' }}>{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 32px',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: 'var(--color-bg-primary)',
                    backgroundColor: isSubmitting ? 'var(--color-text-dim)' : 'var(--color-accent)',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.25s ease',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase' as const,
                  }}
                  onMouseEnter={(e) => { if (!isSubmitting) { e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isSubmitting ? 'var(--color-text-dim)' : 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {isSubmitting ? 'Sending...' : 'SEND PROJECT REQUEST'}
                  <Send size={16} strokeWidth={2.5} />
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div style={{ paddingTop: '0.5rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <span className="text-label" style={{ display: 'block', marginBottom: '1rem' }}>EMAIL</span>
              <a
                href="mailto:hello@vanta.studio"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
              >
                <Mail size={16} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                hello@vanta.studio
              </a>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <span className="text-label" style={{ display: 'block', marginBottom: '1rem' }}>LOCATION</span>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
                <MapPin size={16} />
                Remote — Worldwide
              </p>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <span className="text-label" style={{ display: 'block', marginBottom: '1rem' }}>FOLLOW US</span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[
                  { icon: Instagram, label: 'Instagram', href: '#' },
                  { icon: Linkedin, label: 'LinkedIn', href: '#' },
                  { icon: Github, label: 'GitHub', href: '#' },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-text-muted)',
                      transition: 'all 0.2s ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-accent)';
                      e.currentTarget.style.color = 'var(--color-accent)';
                      e.currentTarget.style.backgroundColor = 'var(--color-accent-muted)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Availability indicator */}
            <div
              style={{
                padding: '1.25rem',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-status-success)',
                }}
                className="pulse-dot"
              />
              <span className="text-body-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Currently accepting new projects
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #contact .container-wide > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          #contact form > div:first-child,
          #contact form > div:nth-child(3) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

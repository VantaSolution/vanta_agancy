import React, { useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation, getErrorMessage } from '@/i18n';
import { messagesAPI } from '@/api/endpoints';
import { Send, Mail, MapPin, Instagram, Linkedin, Github, AlertCircle, Loader2 } from 'lucide-react';
import type { ContactFormData } from '@/types';

interface FormErrors {
  [key: string]: string;
}

export function Contact() {
  const ref = useScrollReveal(0.1);
  const { settings, content } = useWebsite();
  const { t, dict, decode, isRtl } = useTranslation();

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
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const agencyEmail = settings?.general?.email || content?.contact?.email || 'hello@vanta.studio';
  const agencyLocation = decode(settings?.general?.location || content?.contact?.location) || t('contact.locationValue');

  const projectTypes = dict.contact.projectTypes;
  const budgetRanges = dict.contact.budgetRanges;

  const validateField = (field: keyof ContactFormData, value: string): string | null => {
    if (field === 'name' && !value.trim()) return t('validation.nameRequired');
    if (field === 'email') {
      if (!value.trim()) return t('validation.emailRequired');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t('validation.emailInvalid');
    }
    if (field === 'message' && !value.trim()) return t('validation.messageRequired');
    return null;
  };

  const handleBlur = (field: keyof ContactFormData) => {
    const errorMsg = validateField(field, formData[field] || '');
    if (errorMsg) {
      setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = t('validation.nameRequired');
    if (!formData.email.trim()) newErrors.email = t('validation.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = t('validation.emailInvalid');
    if (!formData.message.trim()) newErrors.message = t('validation.messageRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await messagesAPI.submit(formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', company: '', projectType: '', budgetRange: '', message: '' });
      setErrors({});
    } catch (err: any) {
      console.error('Failed to submit message:', err);
      setSubmissionError(getErrorMessage(err, 'errors.generic', t));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    }
    if (submissionError) {
      setSubmissionError(null);
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
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: isRtl ? '0.02em' : '0.08em',
    textTransform: isRtl ? 'none' : ('uppercase' as const),
    color: 'var(--color-text-muted)',
  };

  return (
    <section id="contact" className="section-padding" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
      <div className="container-wide" ref={ref}>
        {/* Header */}
        <div className="reveal" style={{ marginBottom: '3rem' }}>
          <span className="text-label-accent" style={{ display: 'block', marginBottom: '1rem' }}>
            {t('contact.tag')}
          </span>
          <h2 className="text-section-title">{t('contact.heading')}</h2>
          <p className="text-body" style={{ marginTop: '0.75rem', maxWidth: '550px' }}>
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="contact-grid reveal reveal-delay-2">
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
                  {t('contact.successTitle')}
                </h3>
                <p className="text-body" style={{ maxWidth: '500px', margin: '0 auto' }}>
                  {t('contact.successDesc')}
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
                  }}
                >
                  {t('contact.sendAnother')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Submission Error Banner */}
                {submissionError && (
                  <div
                    role="alert"
                    aria-live="polite"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      marginBottom: '1.5rem',
                      borderRadius: '6px',
                      backgroundColor: 'var(--color-status-error-muted)',
                      border: '1px solid var(--color-status-error)',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.875rem',
                    }}
                  >
                    <AlertCircle size={18} style={{ color: 'var(--color-status-error)', flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{submissionError}</span>
                  </div>
                )}

                <div className="form-row-2col">
                  <div>
                    <label htmlFor="contact-name" style={labelStyle}>
                      {t('contact.nameLabel')} <span aria-hidden="true" style={{ color: 'var(--color-accent)' }}>*</span>
                    </label>
                    <input
                      id="contact-name"
                      aria-label={t('contact.nameLabel')}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder={t('contact.namePlaceholder')}
                      style={inputStyle(!!errors.name)}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-muted)'; }}
                      onBlur={(e) => {
                        handleBlur('name');
                        e.currentTarget.style.borderColor = errors.name ? 'var(--color-status-error)' : 'var(--color-border-subtle)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    {errors.name && (
                      <span id="contact-name-error" role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-status-error)', marginTop: '4px', display: 'block' }}>
                        {errors.name}
                      </span>
                    )}
                  </div>
                  <div>
                    <label htmlFor="contact-email" style={labelStyle}>
                      {t('contact.emailLabel')} <span aria-hidden="true" style={{ color: 'var(--color-accent)' }}>*</span>
                    </label>
                    <input
                      id="contact-email"
                      aria-label={t('contact.emailLabel')}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      type="email"
                      dir="ltr"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder={t('contact.emailPlaceholder')}
                      style={{ ...inputStyle(!!errors.email), textAlign: isRtl ? 'right' : 'left' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-muted)'; }}
                      onBlur={(e) => {
                        handleBlur('email');
                        e.currentTarget.style.borderColor = errors.email ? 'var(--color-status-error)' : 'var(--color-border-subtle)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    {errors.email && (
                      <span id="contact-email-error" role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-status-error)', marginTop: '4px', display: 'block' }}>
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="contact-company" style={labelStyle}>{t('contact.companyLabel')}</label>
                  <input
                    id="contact-company"
                    aria-label={t('contact.companyLabel')}
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    placeholder={t('contact.companyPlaceholder')}
                    style={inputStyle(false)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-muted)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>

                <div className="form-row-2col">
                  <div>
                    <label htmlFor="project-type" style={labelStyle}>{t('contact.projectTypeLabel')}</label>
                    <select
                      id="project-type"
                      aria-label={t('contact.projectTypeLabel')}
                      value={formData.projectType}
                      onChange={(e) => handleChange('projectType', e.target.value)}
                      style={{
                        ...inputStyle(false),
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: isRtl ? 'left 14px center' : 'right 14px center',
                        paddingInlineEnd: '36px',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-muted)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <option value="" style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}>
                        {t('contact.projectTypePlaceholder')}
                      </option>
                      {projectTypes.map((type) => (
                        <option key={type.id} value={type.id} style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-primary)' }}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget-range" style={labelStyle}>{t('contact.budgetRangeLabel')}</label>
                    <select
                      id="budget-range"
                      aria-label={t('contact.budgetRangeLabel')}
                      value={formData.budgetRange}
                      onChange={(e) => handleChange('budgetRange', e.target.value)}
                      style={{
                        ...inputStyle(false),
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: isRtl ? 'left 14px center' : 'right 14px center',
                        paddingInlineEnd: '36px',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-muted)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <option value="" style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-muted)' }}>
                        {t('contact.budgetRangePlaceholder')}
                      </option>
                      {budgetRanges.map((range) => (
                        <option key={range.id} value={range.id} style={{ background: 'var(--color-bg-elevated)', color: 'var(--color-text-primary)' }}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="contact-message" style={labelStyle}>
                    {t('contact.messageLabel')} <span aria-hidden="true" style={{ color: 'var(--color-accent)' }}>*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    aria-label={t('contact.messageLabel')}
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder={t('contact.messagePlaceholder')}
                    rows={5}
                    style={{
                      ...inputStyle(!!errors.message),
                      resize: 'vertical',
                      minHeight: '120px',
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-muted)'; }}
                    onBlur={(e) => {
                      handleBlur('message');
                      e.currentTarget.style.borderColor = errors.message ? 'var(--color-status-error)' : 'var(--color-border-subtle)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                  {errors.message && (
                    <span id="contact-message-error" role="alert" style={{ fontSize: '0.75rem', color: 'var(--color-status-error)', marginTop: '4px', display: 'block' }}>
                      {errors.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
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
                    letterSpacing: isRtl ? 'normal' : '0.04em',
                  }}
                  onMouseEnter={(e) => { if (!isSubmitting) { e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isSubmitting ? 'var(--color-text-dim)' : 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {isSubmitting ? (
                    <>
                      <span>{t('contact.submitting')}</span>
                      <Loader2 size={16} strokeWidth={2.5} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>{t('contact.submitButton')}</span>
                      <Send size={16} strokeWidth={2.5} className="rtl-flip" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div style={{ paddingTop: '0.5rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <span className="text-label" style={{ display: 'block', marginBottom: '1rem' }}>
                {t('contact.directEmail')}
              </span>
              <a
                href={`mailto:${agencyEmail}`}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
              >
                <Mail size={16} />
                <span dir="ltr">{agencyEmail}</span>
              </a>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <span className="text-label" style={{ display: 'block', marginBottom: '1rem' }}>
                {t('contact.location')}
              </span>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)' }}>
                <MapPin size={16} />
                {agencyLocation}
              </p>
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <span className="text-label" style={{ display: 'block', marginBottom: '1rem' }}>
                {t('contact.social')}
              </span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {[
                  { icon: Instagram, label: 'Instagram', href: settings?.social?.instagram || '#' },
                  { icon: Linkedin, label: 'LinkedIn', href: settings?.social?.linkedin || '#' },
                  { icon: Github, label: 'GitHub', href: settings?.social?.github || '#' },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
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
                {t('hero.availableForProjects')}
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

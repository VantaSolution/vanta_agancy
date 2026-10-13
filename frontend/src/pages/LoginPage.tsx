import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/i18n';
import { ArrowUpRight, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LanguageToggle } from '@/components/common/LanguageToggle';

export function LoginPage() {
  const { login } = useAuth();
  const { t, isRtl } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      navigate('/admin');
    } catch (err) {
      setError(t('admin.login.invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="grid-bg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
      }}
    >
      {/* Top Language Toggle */}
      <div style={{ position: 'absolute', top: '1.5rem', insetInlineEnd: '1.5rem' }}>
        <LanguageToggle variant="button" />
      </div>

      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <a
            href="/"
            style={{
              fontFamily: isRtl ? 'var(--font-arabic-heading)' : 'var(--font-heading)',
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: isRtl ? 'normal' : '0.08em',
              color: 'var(--color-text-primary)',
              textDecoration: 'none',
            }}
          >
            VANTA<span style={{ color: 'var(--color-accent)' }}>.</span>
          </a>
          <p className="text-label" style={{ marginTop: '0.75rem' }}>
            {t('admin.login.controlPanel')}
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: '12px',
            padding: '2rem',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            {t('admin.login.title')}
          </h1>
          <p className="text-body-sm" style={{ marginBottom: '1.5rem' }}>
            {t('admin.login.subtitle')}
          </p>

          {error && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'var(--color-status-error-muted)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '6px',
                color: 'var(--color-status-error)',
                fontSize: '0.8125rem',
                marginBottom: '1.25rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, letterSpacing: isRtl ? 'normal' : '0.06em', textTransform: isRtl ? 'none' : ('uppercase' as const), color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                {t('admin.login.emailLabel')}
              </label>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('admin.login.emailPlaceholder')}
                required
                className="admin-input"
                style={{ textAlign: isRtl ? 'right' : 'left' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 500, letterSpacing: isRtl ? 'normal' : '0.06em', textTransform: isRtl ? 'none' : ('uppercase' as const), color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                {t('admin.login.passwordLabel')}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="admin-input"
                  style={{ paddingInlineEnd: '40px', textAlign: isRtl ? 'right' : 'left' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? t('admin.login.hidePassword') : t('admin.login.showPassword')}
                  title={showPassword ? t('admin.login.hidePassword') : t('admin.login.showPassword')}
                  style={{
                    position: 'absolute',
                    insetInlineEnd: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '4px',
                    color: 'var(--color-text-dim)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--color-bg-primary)',
                backgroundColor: isLoading ? 'var(--color-text-dim)' : 'var(--color-accent)',
                borderRadius: '8px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{isLoading ? t('admin.login.signingIn') : t('admin.login.signInButton')}</span>
              {!isLoading && <ArrowUpRight size={16} strokeWidth={2.5} className="rtl-arrow-up-right" />}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a
              href="/"
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
            >
              {isRtl ? '→ ' : '← '}{t('admin.login.backToSite')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

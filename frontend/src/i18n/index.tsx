import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ar, type TranslationDictionary } from './ar';
import { en } from './en';
import { decodeBilingual, SupportedLanguage } from '@/utils/bilingual';

interface LanguageContextType {
  language: SupportedLanguage;
  dir: 'rtl' | 'ltr';
  isRtl: boolean;
  t: (path: string, params?: Record<string, string | number>) => string;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  dict: TranslationDictionary;
  decode: (text: string | null | undefined) => string;
}

const STORAGE_KEY = 'vanta_language';
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize with stored language or default to Arabic ('ar') as primary localized experience
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'en' || stored === 'ar') {
        return stored;
      }
    } catch {
      // Ignore localStorage read errors
    }
    return 'ar';
  });

  const dir = language === 'ar' ? 'rtl' : 'ltr';
  const isRtl = language === 'ar';
  const dict = language === 'ar' ? ar : en;

  // Apply dir and lang to html document root whenever language changes, and synchronize SEO meta
  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);

    // Synchronize localized document title and SEO metadata
    const defaultTitle = language === 'ar' ? 'ڤانتا — استوديو رقمي' : 'VANTA — Digital Studio';
    const defaultDesc = language === 'ar'
      ? 'استوديو رقمي متخصص في هندسة وتطوير مواقع وتطبيقات عصرية فائقة السرعة للشركات الطموحة.'
      : 'Premium digital studio specializing in website development, custom web applications, and digital experiences that move businesses forward.';

    document.title = defaultTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', defaultDesc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', defaultTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', defaultDesc);

    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore localStorage write errors
    }
  }, [language, dir]);

  const setLanguage = useCallback((newLang: SupportedLanguage) => {
    setLanguageState(newLang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  /**
   * Translates a dot-notated key path, with parameter interpolation support.
   * Example: t('admin.projects.subtitle', { total: 5, published: 3 })
   */
  const t = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      const keys = path.split('.');
      let result: any = dict;

      for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
          result = result[key];
        } else {
          // Fallback to English dictionary if key missing in current dict
          let fallbackResult: any = en;
          for (const fallbackKey of keys) {
            if (fallbackResult && typeof fallbackResult === 'object' && fallbackKey in fallbackResult) {
              fallbackResult = fallbackResult[fallbackKey];
            } else {
              fallbackResult = undefined;
              break;
            }
          }
          result = fallbackResult !== undefined ? fallbackResult : path;
          break;
        }
      }

      if (typeof result !== 'string') {
        return path;
      }

      // Parameter replacement {key}
      if (params) {
        return Object.entries(params).reduce((str, [paramKey, paramVal]) => {
          return str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
        }, result);
      }

      return result;
    },
    [dict]
  );

  /**
   * Helper to decode bilingual "English ~ Arabic" strings based on current language
   */
  const decode = useCallback(
    (text: string | null | undefined): string => {
      return decodeBilingual(text, language);
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        dir,
        isRtl,
        t,
        setLanguage,
        toggleLanguage,
        dict,
        decode,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

/**
 * Maps technical and API errors safely to localized messages, preventing
 * raw English technical error leakage in Arabic mode.
 */
export function getErrorMessage(
  err: any,
  fallbackKey: string,
  t: (path: string, params?: Record<string, string | number>) => string
): string {
  if (!err) return t(fallbackKey);
  const status = err?.response?.status;
  if (status === 401 || status === 403) return t('errors.unauthorized');
  if (status === 404) return t('errors.notFound');
  if (status === 429) return t('errors.rateLimit');
  if (status >= 500) return t('errors.serverError');
  if (err?.code === 'ECONNABORTED' || err?.message === 'Network Error') return t('errors.network');
  return t(fallbackKey);
}


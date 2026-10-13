/**
 * Localization and formatting utilities for Dates, Numbers, and Currencies.
 * Specially tuned for Arabic (ar-EG) and English (en-US).
 */

import { SupportedLanguage } from './bilingual';

/**
 * Formats a date string or timestamp into a localized human-readable date.
 * Enforces Unicode Bidi Isolation (\u2066...\u2069 or isolation wrapper)
 * so that slashes, dashes, years, and numbers are NEVER flipped backwards in Arabic RTL.
 */
export function formatDate(
  dateInput: string | number | Date | null | undefined,
  lang: SupportedLanguage = 'ar',
  options?: Intl.DateTimeFormatOptions
): string {
  if (!dateInput) return '';

  const date = typeof dateInput === 'object' && dateInput instanceof Date
    ? dateInput
    : new Date(dateInput);

  if (isNaN(date.getTime())) return String(dateInput);

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  const locale = lang === 'ar' ? 'ar-EG' : 'en-US';
  const formatted = new Intl.DateTimeFormat(locale, defaultOptions).format(date);

  // Return isolated string with Left-to-Right / Directional Isolate characters
  // \u2066 is LEFT-TO-RIGHT ISOLATE, \u2069 is POP DIRECTIONAL ISOLATE
  return `\u2066${formatted}\u2069`;
}

/**
 * Formats date and time together (e.g., for messages, audit logs).
 */
export function formatDateTime(
  dateInput: string | number | Date | null | undefined,
  lang: SupportedLanguage = 'ar'
): string {
  return formatDate(dateInput, lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formats standard ISO-style or date-only strings (e.g., YYYY/MM/DD)
 * wrapped in strict LTR isolation so it displays chronologically.
 */
export function formatIsoDate(
  dateStr: string | null | undefined
): string {
  if (!dateStr) return '';
  return `\u2066${dateStr}\u2069`;
}

/**
 * Formats relative time (e.g., "منذ ساعتين", "2 hours ago").
 */
export function formatRelativeTime(
  dateInput: string | number | Date | null | undefined,
  lang: SupportedLanguage = 'ar'
): string {
  if (!dateInput) return '';
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const diffInMinutes = Math.round(diffInSeconds / 60);
  const diffInHours = Math.round(diffInMinutes / 60);
  const diffInDays = Math.round(diffInHours / 24);

  const rtf = new Intl.RelativeTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    numeric: 'auto',
  });

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(diffInSeconds, 'second');
  } else if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute');
  } else if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, 'day');
  } else {
    return formatDate(date, lang);
  }
}

/**
 * Formats a currency amount into Egyptian Pounds (EGP / ج.م) or specified currency.
 * Consistently applies locale standard:
 *  - In Arabic: "١,٥٠٠ ج.م" or "1,500 ج.م"
 *  - In English: "1,500 EGP"
 */
export function formatCurrency(
  amount: number | string,
  lang: SupportedLanguage = 'ar',
  currency: 'EGP' | 'USD' | 'EUR' = 'EGP'
): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return String(amount);

  const formattedNum = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(num);

  if (currency === 'EGP') {
    return lang === 'ar' ? `${formattedNum} ج.م` : `${formattedNum} EGP`;
  }
  if (currency === 'USD') {
    return lang === 'ar' ? `${formattedNum} دولار` : `$${formattedNum}`;
  }
  if (currency === 'EUR') {
    return lang === 'ar' ? `${formattedNum} يورو` : `€${formattedNum}`;
  }

  return `${formattedNum} ${currency}`;
}

/**
 * Formats a plain number with localized thousands separators.
 */
export function formatNumber(
  num: number | string,
  lang: SupportedLanguage = 'ar'
): string {
  const parsed = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(parsed)) return String(num);

  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(parsed);
}

/**
 * Localized pagination counter: "Page X of Y" / "صفحة X من Y".
 */
export function formatPagination(
  current: number,
  total: number,
  lang: SupportedLanguage = 'ar'
): string {
  const currentFormatted = formatNumber(current, lang);
  const totalFormatted = formatNumber(total, lang);
  return lang === 'ar'
    ? `صفحة ${currentFormatted} من ${totalFormatted}`
    : `Page ${currentFormatted} of ${totalFormatted}`;
}

/**
 * Localized table range counter: "Showing X to Y of Z" / "عرض X إلى Y من أصل Z".
 */
export function formatShowingRange(
  start: number,
  end: number,
  total: number,
  lang: SupportedLanguage = 'ar'
): string {
  const s = formatNumber(start, lang);
  const e = formatNumber(end, lang);
  const t = formatNumber(total, lang);

  return lang === 'ar'
    ? `عرض ${s} إلى ${e} من أصل ${t}`
    : `Showing ${s} to ${e} of ${t}`;
}

/**
 * Formats file sizes in bytes into readable KB/MB.
 */
export function formatFileSize(
  bytes: number,
  lang: SupportedLanguage = 'ar'
): string {
  if (bytes < 1024) {
    return lang === 'ar' ? `${bytes} بايت` : `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    const kb = (bytes / 1024).toFixed(1);
    return lang === 'ar' ? `${kb} ك.ب` : `${kb} KB`;
  }
  const mb = (bytes / (1024 * 1024)).toFixed(1);
  return lang === 'ar' ? `${mb} م.ب` : `${mb} MB`;
}

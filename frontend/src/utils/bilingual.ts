/**
 * Utility functions for decoding and encoding bilingual strings.
 * 
 * Supports strings formatted with the delimiter " ~ ", e.g.:
 *   "English Text ~ النص بالعربية"
 * 
 * Also supports JSON bilingual format:
 *   { en: "English", ar: "العربية" }
 * 
 * And raw un-delimited strings with safe fallbacks.
 */

export type SupportedLanguage = 'ar' | 'en';

/**
 * Decodes a bilingual string formatted as "English ~ Arabic" (or JSON)
 * into the string matching the requested language.
 *
 * @param text The input string, possibly containing " ~ " delimiter or JSON.
 * @param lang Target language: 'ar' | 'en' (defaults to 'ar')
 * @returns The localized string segment, trimmed of whitespace.
 */
export function decodeBilingual(
  text: string | null | undefined,
  lang: SupportedLanguage = 'ar'
): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return '';
  }

  // Check if string is JSON-encoded bilingual object: {"en":"...","ar":"..."}
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === 'object' && parsed !== null) {
        if (lang === 'ar' && parsed.ar) return String(parsed.ar).trim();
        if (lang === 'en' && parsed.en) return String(parsed.en).trim();
        return String(parsed.ar || parsed.en || trimmed).trim();
      }
    } catch {
      // Fall through to delimiter check
    }
  }

  // Check for delimiter " ~ " or "~"
  if (trimmed.includes('~')) {
    const parts = trimmed.split('~').map((part) => part.trim());
    if (parts.length >= 2) {
      const englishPart = parts[0] || '';
      const arabicPart = parts[1] || '';

      if (lang === 'ar') {
        // Return Arabic if available, otherwise English fallback
        return arabicPart || englishPart;
      } else {
        // Return English if available, otherwise Arabic fallback
        return englishPart || arabicPart;
      }
    }
  }

  // Check known translations catalog for seeded or single-language database strings
  if (SEED_TRANSLATIONS[trimmed]) {
    return SEED_TRANSLATIONS[trimmed][lang] || trimmed;
  }

  // Reverse check: if string matches an Arabic value, return English when lang === 'en'
  for (const item of Object.values(SEED_TRANSLATIONS)) {
    if (item.ar === trimmed) {
      return lang === 'en' ? item.en : item.ar;
    }
    if (item.en === trimmed) {
      return lang === 'ar' ? item.ar : item.en;
    }
  }

  // Single string with no delimiter and no catalog match:
  return trimmed;
}

/**
 * Built-in fallback catalog for default seeded content, services, categories, and settings
 * ensuring that untranslated database content never leaks English into Arabic mode.
 */
const SEED_TRANSLATIONS: Record<string, { ar: string; en: string }> = {
  // Services
  'Website Development': {
    en: 'Website Development',
    ar: 'تطوير المواقع الإلكترونية',
  },
  'Custom-built, high-performance websites.': {
    en: 'Custom-built, high-performance websites.',
    ar: 'مواقع مخصصة فائقة الأداء مصممة من الصفر بأحدث التقنيات.',
  },
  'Landing Pages': {
    en: 'Landing Pages',
    ar: 'صفحات الهبوط الاستراتيجية',
  },
  'Conversion-focused landing pages.': {
    en: 'Conversion-focused landing pages.',
    ar: 'صفحات هبوط موجهة لزيادة معدل التحويل، تبرز القيمة الفريدة لخدماتك.',
  },
  'Business Websites': {
    en: 'Business Websites',
    ar: 'مواقع الشركات والأعمال',
  },
  'Professional digital presence for businesses.': {
    en: 'Professional digital presence for businesses.',
    ar: 'حضور رقمي فاخر للشركات والمؤسسات يعزز مكانتك في السوق.',
  },
  'Booking Systems': {
    en: 'Booking Systems',
    ar: 'أنظمة الحجز والمنصات الذكية',
  },
  'Restaurant, clinic, and reservation platforms.': {
    en: 'Restaurant, clinic, and reservation platforms.',
    ar: 'أنظمة حجز للمطاعم والعيادات ومقدمي الخدمات مع إدارة المواعيد وقوائم رقمية.',
  },
  'E-Commerce': {
    en: 'E-Commerce',
    ar: 'المتاجر الإلكترونية المتكاملة',
  },
  'Full-featured online stores.': {
    en: 'Full-featured online stores.',
    ar: 'متاجر رقمية متكاملة ببوابات دفع آمنة، إدارة ذكية للمخزون، وتجربة شراء سلسة.',
  },
  'Custom Web Applications': {
    en: 'Custom Web Applications',
    ar: 'تطبيقات الويب المخصصة (SaaS)',
  },
  'Tailored web apps for specific business needs.': {
    en: 'Tailored web apps for specific business needs.',
    ar: 'حلول برمجية ولوحات تحكم وأدوات سحابية مصممة خصيصاً لأتمتة أعمالك.',
  },
  'Maintenance & Hosting': {
    en: 'Maintenance & Hosting',
    ar: 'الدعم الفني والاستضافة السحابية',
  },
  'Ongoing support and infrastructure.': {
    en: 'Ongoing support and infrastructure.',
    ar: 'صيانة مستمرة، مراقبة أمنية على مدار الساعة، وبنية تحتية سحابية مستقرة.',
  },

  // Hero default content
  'WE BUILD DIGITAL EXPERIENCES\nTHAT MOVE BUSINESSES FORWARD.': {
    en: 'WE BUILD DIGITAL EXPERIENCES\nTHAT MOVE BUSINESSES FORWARD.',
    ar: 'نصنع تجارب رقمية استثنائية\nتدفع أعمالك نحو النمو والريادة.',
  },
  'We design and develop fast, modern websites and digital products for businesses that want to stand out, perform better, and grow.': {
    en: 'We design and develop fast, modern websites and digital products for businesses that want to stand out, perform better, and grow.',
    ar: 'نصمم ونطور مواقع ويب فائقة السرعة وتطبيقات حديثة تلبي طموحات الشركات الراغبة في التميز، الأداء العالي، والمظهر الاحترافي الراقي.',
  },
  'Start a Project': {
    en: 'Start a Project',
    ar: 'ابدأ مشروعك معنا',
  },
  'View Our Work': {
    en: 'View Our Work',
    ar: 'استعرض أعمالنا',
  },

  // About default content
  'SMALL STUDIO.\nBIG DIGITAL IMPACT.': {
    en: 'SMALL STUDIO.\nBIG DIGITAL IMPACT.',
    ar: 'استوديو مركز.\nأثر رقمي واسع.',
  },
  "We're a focused digital studio that combines design, development, strategy, and performance into one seamless process.": {
    en: "We're a focused digital studio that combines design, development, strategy, and performance into one seamless process.",
    ar: 'نحن استوديو تقني وإبداعي يجمع بين براعة التصميم، متانة البرمجة، الفكر الاستراتيجي، والسرعة الفائقة في حزمة متناغمة واحدة.',
  },
  'Every project we take on gets the full attention of our senior team.': {
    en: 'Every project we take on gets the full attention of our senior team.',
    ar: 'يحظى كل مشروع نتولاه بالاهتمام الكامل من فريقنا المتمرس. نتعامل مع نمو مشروعك كأنه استثمارنا الخاص.',
  },

  // CTA default content
  "HAVE AN IDEA?\nLET'S BUILD IT.": {
    en: "HAVE AN IDEA?\nLET'S BUILD IT.",
    ar: 'لديك فكرة طموحة؟\nدعنا نبنيها لك معاً.',
  },
  "Tell us what you're building, what problem you're solving, and what you want your website to achieve.": {
    en: "Tell us what you're building, what problem you're solving, and what you want your website to achieve.",
    ar: 'أخبرنا بما تخطط لبنائه والتحدي الذي تسعى لحله والنتائج التي تطمح لتحقيقها، وسنتولى تحويله إلى واقع استثنائي.',
  },

  // General & Location
  'Remote — Worldwide': {
    en: 'Remote — Worldwide',
    ar: 'عن بُعد — تغطية لجميع أنحاء العالم',
  },
  'VANTA — Digital Studio': {
    en: 'VANTA — Digital Studio',
    ar: 'ڤانتا — استوديو رقمي',
  },
  'Premium digital studio.': {
    en: 'Premium digital studio.',
    ar: 'استوديو رقمي متخصص في هندسة وتطوير مواقع وتطبيقات عصرية فائقة السرعة.',
  },
};


/**
 * Encodes two localized strings into the standard "English ~ Arabic" format.
 *
 * @param en English text
 * @param ar Arabic text
 * @returns Combined "English ~ Arabic" string
 */
export function encodeBilingual(en: string, ar: string): string {
  const cleanEn = (en || '').trim();
  const cleanAr = (ar || '').trim();

  if (!cleanEn && !cleanAr) return '';
  if (!cleanAr) return cleanEn;
  if (!cleanEn) return cleanAr;

  return `${cleanEn} ~ ${cleanAr}`;
}

/**
 * Splits a bilingual string into its English and Arabic parts.
 */
export function splitBilingual(text: string | null | undefined): { en: string; ar: string } {
  if (!text) return { en: '', ar: '' };
  return {
    en: decodeBilingual(text, 'en'),
    ar: decodeBilingual(text, 'ar'),
  };
}

/**
 * Checks whether a given string is in bilingual format ("... ~ ...").
 */
export function isBilingual(text: string | null | undefined): boolean {
  if (!text || typeof text !== 'string') return false;
  return text.includes('~');
}

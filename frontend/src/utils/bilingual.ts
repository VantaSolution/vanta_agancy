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
    ar: 'تطوير وتصميم المواقع الإلكترونية',
  },
  'Custom-built, high-performance websites.': {
    en: 'Custom-built, high-performance websites.',
    ar: 'مواقع مخصصة وفائقة السرعة، مبنية من الصفر بأحدث التقنيات وبتفاصيل متقنة تليق باسم شركتك.',
  },
  'Landing Pages': {
    en: 'Landing Pages',
    ar: 'صفحات الهبوط الاستراتيجية (Landing Pages)',
  },
  'Conversion-focused landing pages.': {
    en: 'Conversion-focused landing pages.',
    ar: 'صفحات هبوط معمولة مخصوص لزيادة المبيعات ومعدلات التحويل، تبرز ميزة خدمتك وتجيب لك عملاء حقيقيين.',
  },
  'Business Websites': {
    en: 'Business Websites',
    ar: 'مواقع الشركات والأعمال الفاخرة',
  },
  'Professional digital presence for businesses.': {
    en: 'Professional digital presence for businesses.',
    ar: 'واجهة رقمية فخمة تعكس مكانة شركتك في السوق، وتبني ثقة فورية عند كبار العملاء والمستثمرين.',
  },
  'Booking Systems': {
    en: 'Booking Systems',
    ar: 'أنظمة الحجز والمنصات الذكية',
  },
  'Restaurant, clinic, and reservation platforms.': {
    en: 'Restaurant, clinic, and reservation platforms.',
    ar: 'أنظمة حجز متطورة للمطاعم والعيادات ومقدمي الخدمات مع جداول مواعيد ذكية وقوائم رقمية فورية.',
  },
  'E-Commerce': {
    en: 'E-Commerce',
    ar: 'المتاجر الإلكترونية المتكاملة',
  },
  'Full-featured online stores.': {
    en: 'Full-featured online stores.',
    ar: 'متاجر رقمية متكاملة ببوابات دفع آمنة وسريعة، إدارة ذكية للمخزون، وتجربة شراء سلسة وممتعة.',
  },
  'Custom Web Applications': {
    en: 'Custom Web Applications',
    ar: 'تطبيقات الويب المخصصة (SaaS)',
  },
  'Tailored web apps for specific business needs.': {
    en: 'Tailored web apps for specific business needs.',
    ar: 'أنظمة سحابية ولوحات تحكم وأدوات داخلية متطورة، مصممة مخصوص لأتمتة عملياتك وحل أصعب تحديات الشغل.',
  },
  'Maintenance & Hosting': {
    en: 'Maintenance & Hosting',
    ar: 'الصيانة السحابية والدعم الفني',
  },
  'Ongoing support and infrastructure.': {
    en: 'Ongoing support and infrastructure.',
    ar: 'متابعة وأمان على مدار الساعة، تحديثات مستمرة، وبنية تحتية سحابية تضمن إن موقعك يفضل شغال بكفاءة طول الوقت.',
  },

  // Hero default content
  'WE BUILD DIGITAL EXPERIENCES\nTHAT MOVE BUSINESSES FORWARD.': {
    en: 'WE BUILD DIGITAL EXPERIENCES\nTHAT MOVE BUSINESSES FORWARD.',
    ar: 'بنصنع تجارب رقمية استثنائية\nتطوّر شغلك وتنقله لمستوى أعلى.',
  },
  'We design and develop fast, modern websites and digital products for businesses that want to stand out, perform better, and grow.': {
    en: 'We design and develop fast, modern websites and digital products for businesses that want to stand out, perform better, and grow.',
    ar: 'بنصمم ونطوّر مواقع وتطبيقات ويب سريعة وحديثة، معمولة مخصوص للشركات اللي عاوزة تتميز بمظهر احترافي فخم وأداء عالي يحقق نتائج حقيقية.',
  },
  'Start a Project': {
    en: "Let's Turn Your Idea Into Reality",
    ar: 'خلّينا نبدأ مشروعك',
  },
  'ابدأ مشروعك معنا': {
    en: "Let's Turn Your Idea Into Reality",
    ar: 'خلّينا نبدأ مشروعك',
  },
  "Let's Turn Your Idea Into Reality": {
    en: "Let's Turn Your Idea Into Reality",
    ar: 'خلّينا نبدأ مشروعك',
  },
  'خلّينا نبدأ مشروعك': {
    en: "Let's Turn Your Idea Into Reality",
    ar: 'خلّينا نبدأ مشروعك',
  },
  'View Our Work': {
    en: 'View Our Work',
    ar: 'شوف أعمالنا',
  },

  // About default content
  'SMALL STUDIO.\nBIG DIGITAL IMPACT.': {
    en: 'SMALL STUDIO.\nBIG DIGITAL IMPACT.',
    ar: 'استوديو مركّز.\nأثر رقمي كبير.',
  },
  "We're a focused digital studio that combines design, development, strategy, and performance into one seamless process.": {
    en: "We're a focused digital studio that combines design, development, strategy, and performance into one seamless process.",
    ar: 'إحنا استوديو تقني وإبداعي بيجمع بين جمال التصميم، وقوة البرمجة، والتفكير الاستراتيجي والسرعة العالية في فريق متناغم واحد. من غير زحمة إدارية أو طبقات معقدة — تنفيذ دقيق ونتائج حقيقية.',
  },
  'Every project we take on gets the full attention of our senior team.': {
    en: 'Every project we take on gets the full attention of our senior team.',
    ar: 'كل مشروع بنستلمه بياخد كامل تركيز واهتمام فريقنا المتمرس. بنتعامل مع نجاح مشروعك وكأنه استثمارنا الشخصي، لأن دي الطريقة الوحيدة اللي بتطلع منتجات رقمية ناجحة ومبهرة بجد.',
  },

  // CTA default content
  "HAVE AN IDEA?\nLET'S BUILD IT.": {
    en: "HAVE AN IDEA?\nLET'S BUILD IT.",
    ar: 'عندك فكرة مشروع؟\nخلّينا نبنيها سوا.',
  },
  "Tell us what you're building, what problem you're solving, and what you want your website to achieve.": {
    en: "Tell us what you're building, what problem you're solving, and what you want your website to achieve.",
    ar: 'احكيلنا بتفكر تبني إيه، إيه التحدي اللي عاوز تحله، والنتائج اللي بتطمح توصلها. وإحنا هنتولى تحويل فكرتك لواقع يبهرك.',
  },

  // General & Location
  'Remote — Worldwide': {
    en: 'Remote — Worldwide',
    ar: 'عن بُعد — شغالين مع عملاء من كل أنحاء العالم',
  },
  'VANTA — Digital Studio': {
    en: 'VANTA — Digital Studio',
    ar: 'ڤانتا — استوديو رقمي',
  },
  'Premium digital studio.': {
    en: 'Premium digital studio.',
    ar: 'استوديو رقمي متخصص في هندسة وتطوير مواقع وتطبيقات عصرية وسريعة جداً للشركات الطموحة.',
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

/**
 * Complete Arabic Translation Dictionary for VANTA Studio.
 * Native, professional phrasing crafted for exceptional UX in RTL.
 */

export const ar = {
  // ─── Common / General ───
  common: {
    loading: 'جاري التحميل...',
    error: 'حدث خطأ، يرجى المحاولة مرة أخرى',
    success: 'تمت العملية بنجاح',
    save: 'حفظ',
    saving: 'جاري الحفظ...',
    saved: 'تم الحفظ!',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    create: 'إنشاء',
    back: 'رجوع',
    close: 'إغلاق',
    search: 'بحث',
    filter: 'تصفية',
    all: 'الكل',
    actions: 'الإجراءات',
    status: 'الحالة',
    yes: 'نعم',
    no: 'لا',
    viewAll: 'عرض الكل',
    upload: 'رفع ملف',
    uploading: 'جاري الرفع...',
    uploaded: 'تم الرفع بنجاح',
    copy: 'نسخ',
    copied: 'تم النسخ!',
    confirmDelete: 'هل أنت متأكد من رغبتك في الحذف؟',
    details: 'التفاصيل',
    notFound: 'غير موجود',
    unknown: 'غير محدد',
    retry: 'إعادة المحاولة',
    select: 'اختيار',
    optional: 'اختياري',
    required: 'مطلوب',
    refresh: 'تحديث',
    and: 'و',
    or: 'أو',
    total: 'الإجمالي',
  },

  // ─── Status Badges & Keys ───
  status: {
    active: 'نشط',
    inactive: 'غير نشط',
    published: 'منشور',
    draft: 'مسودة',
    pending: 'قيد الانتظار',
    cancelled: 'ملغي',
    expired: 'منتهي الصلاحية',
    refunded: 'مسترد',
    new: 'جديد',
    read: 'مقروء',
    replied: 'تم الرد',
    archived: 'مؤرشف',
    featured: 'مميز',
  },

  // ─── Pagination & Tables ───
  pagination: {
    page: 'صفحة',
    of: 'من',
    prev: 'السابق',
    next: 'التالي',
    showing: 'عرض',
    to: 'إلى',
    records: 'عنصر',
    pageOf: 'صفحة {page} من {totalPages}',
    showingRange: 'عرض {start} إلى {end} من أصل {total}',
  },

  // ─── Navigation ───
  nav: {
    services: 'خدماتنا',
    work: 'أعمالنا',
    process: 'منهجية العمل',
    about: 'من نحن',
    contact: 'تواصل معنا',
    startProject: 'ابدأ مشروعك',
    controlPanel: 'لوحة التحكم',
    languageToggle: 'تغيير اللغة',
    currentLanguage: 'العربية',
    english: 'English',
    arabic: 'العربية',
    menu: 'القائمة',
    closeMenu: 'إغلاق القائمة',
    home: 'الرئيسية',
    mainNav: 'التنقل الرئيسي',
    mobileNav: 'قائمة التنقل للهواتف',
    skipToContent: 'الانتقال إلى المحتوى الرئيسي',
  },

  // ─── Hero Section ───
  hero: {
    digitalStudio: 'استوديو رقمي',
    webDevelopment: 'تطوير المواقع والأنظمة',
    established: 'تأسس ٢٠٢٦',
    availableForProjects: 'متاح لقبول مشاريع جديدة',
    reachOut: 'تواصل معنا',
    version: 'VANTA.STUDIO — الإصدار ٢.٠',
    headline: 'نصنع تجارب رقمية استثنائية\nتدفع أعمالك نحو النمو والريادة.',
    description: 'نصمم ونطور مواقع ويب فائقة السرعة وتطبيقات حديثة تلبي طموحات الشركات الراغبة في التميز، الأداء العالي، والمظهر الاحترافي الراقي.',
    primaryCta: 'يلا نحوّل فكرتك لواقع',
    secondaryCta: 'استعرض أعمالنا',
  },

  // ─── Intro Section ───
  intro: {
    tag: '// الرؤية',
    headlineBeforeAccent: 'نحن لا نبني مجرد مواقع إلكترونية.\n',
    headlineAccent: 'نحن نصنع حضوراً رقمياً مؤثراً.',
    description: 'من صفحات الهبوط المركزة إلى المنصات الرقمية المتكاملة، نبتكر تجارب تعزز مصداقية علامتك التجارية، وتحقق أعلى معدلات التحويل للعملاء المحتملين.',
  },

  // ─── About Section ───
  about: {
    tag: '// من نحن',
    heading: 'استوديو مركز.\nأثر رقمي واسع.',
    description: 'نحن استوديو تقني وإبداعي يجمع بين براعة التصميم، متانة البرمجة، الفكر الاستراتيجي، والسرعة الفائقة في حزمة متناغمة واحدة.',
    supportingContent: 'يحظى كل مشروع نتولاه بالاهتمام الكامل من فريقنا المتمرس. نتعامل مع نمو مشروعك كأنه استثمارنا الخاص، لأن هكذا تصنع المنتجات الرقمية الناجحة حقاً.',
    pillars: [
      { label: 'التصميم الإبداعي', desc: 'أنظمة وهوية بصرية تتواصل وتؤثر' },
      { label: 'الهندسة البرمجية', desc: 'كود نقي، سرعة خاطفة، وبنية معمارية قابلة للتوسع' },
      { label: 'التخطيط الاستراتيجي', desc: 'قرارات مبنية على تحقيق العائد ونمو الأعمال' },
      { label: 'كفاءة الأداء', desc: 'موثوقية متناهية وأفضل مؤشرات تجربة للمستخدم' },
    ],
  },

  // ─── Services Section ───
  services: {
    tag: '// خدماتنا',
    heading: 'ماذا نبني ونصمم',
    listLabel: 'قائمة الخدمات',
    detailsAria: 'تفاصيل خدمة {name}',
    list: [
      {
        id: '1',
        name: 'تطوير المواقع الإلكترونية',
        shortDescription: 'مواقع مخصصة فائقة الأداء مصممة من الصفر بأحدث التقنيات وتنفيذ دقيق لأدق التفاصيل.',
      },
      {
        id: '2',
        name: 'صفحات الهبوط الاستراتيجية',
        shortDescription: 'صفحات هبوط موجهة لزيادة معدل التحويل، تبرز القيمة الفريدة لخدماتك وتحقق نتائج قابلة للقياس.',
      },
      {
        id: '3',
        name: 'مواقع الشركات والأعمال',
        shortDescription: 'حضور رقمي فاخر للشركات والمؤسسات يعزز مكانتك في السوق ويجذب كبار العملاء بثقة.',
      },
      {
        id: '4',
        name: 'أنظمة الحجز والمنصات الذكية',
        shortDescription: 'أنظمة حجز للمطاعم والعيادات ومقدمي الخدمات مع إدارة المواعيد وقوائم رقمية فورية.',
      },
      {
        id: '5',
        name: 'المتاجر الإلكترونية المتكاملة',
        shortDescription: 'متاجر رقمية متكاملة ببوابات دفع آمنة، إدارة ذكية للمخزون، وتجربة شراء سلسة وممتعة.',
      },
      {
        id: '6',
        name: 'تطبيقات الويب المخصصة (SaaS)',
        shortDescription: 'حلول برمجية ولوحات تحكم وأدوات سحابية مصممة خصيصاً لأتمتة أعمالك وحل تحدياتك المعقدة.',
      },
      {
        id: '7',
        name: 'الدعم الفني والاستضافة السحابية',
        shortDescription: 'صيانة مستمرة، مراقبة أمنية على مدار الساعة، تحديثات دورية، وبنية تحتية سحابية مستقرة.',
      },
    ],
  },

  // ─── Capabilities Section ───
  capabilities: {
    tag: '// إمكانياتنا',
    titleLine1: 'مصممة لتكون',
    titleGood: 'مبهرة وجذابة',
    titleLine2: 'ومهندسة لتعمل',
    titlePerform: 'بأقصى كفاءة',
    description: 'كل مشروع نطلقه مبني على نفس الأسس الثابتة — كود معياري نقي، أحدث أدوات التقنية، والتركيز الصارم على الجودة والأمان.',
    items: [
      { name: 'سرعة البرق والأداء', description: 'تحسين متقدم لمؤشرات أداء الويب الحيوية وسرعة التحميل' },
      { name: 'تصميم متجاوب بالكامل', description: 'مظهر متناسق ومتجاوب بدقة على كافة الهواتف والشاشات' },
      { name: 'أسس تحسين محركات البحث (SEO)', description: 'بنية مهيأة لتصدر نتائج البحث في جوجل وجلب الزوار' },
      { name: 'معمارية برمجية نقية', description: 'هيكل برمجي منظم وسهل التطوير والصيانة المستمرة' },
      { name: 'بنية خلفية قابلة للتوسع', description: 'واجهات برمجية API-First مصممة لنمو مشروعك وتوسعه' },
      { name: 'تجربة مستخدم حديثة UI/UX', description: 'واجهات مريحة وسلسة تدفع الزائر لاتخاذ الإجراء المطلوب' },
      { name: 'جاهزية الربط والتحليلات', description: 'تكامل كامل مع أدوات التتبع والتحليل لفهم جمهورك' },
      { name: 'أعلى معايير الأمان والحماية', description: 'حماية متقدمة من الثغرات البرمجية والتهديدات الشائعة' },
    ],
  },

  // ─── Process Section ───
  process: {
    tag: '// منهجية العمل',
    heading: 'من الفكرة حتى الإطلاق والنجاح',
    ctaTag: '// ابدأ رحلتك الآن',
    ctaHeading: 'جاهز لنقل فكرتك إلى المستوى التالي؟',
    ctaDescription: 'نحن هنا لمساعدتك في بناء منتج رقمي استثنائي يحقق أهدافك ويترك أثراً دائماً.',
    ctaButton: 'يلا نحوّل فكرتك لواقع',
    steps: [
      {
        number: '٠١',
        title: 'الاستكشاف والتحليل',
        description: 'نفهم طبيعة نشاطك، جمهورك، وأهدافك بدقة. نحلل السوق والمنافسين لرسم استراتيجية رقمية تصنع الفارق.',
      },
      {
        number: '٠٢',
        title: 'التصميم وتجربة المستخدم',
        description: 'نصيغ التوجه البصري وتجربة الاستخدام. نصمم كل عنصر ليعبر عن روح علامتك التجارية ويوجه الزائر بنجاح.',
      },
      {
        number: '٠٣',
        title: 'التطوير والبرمجة',
        description: 'نبني الموقع بأحدث الأدوات البرمجية ومعمارية هندسية رصينة. نضمن الأداء العالي والأمان منذ السطر الأول.',
      },
      {
        number: '٠٤',
        title: 'الإطلاق والدعم المستمر',
        description: 'نرفع المشروع، نضبط إعدادات الأمان ونختبر كل وظيفة بدقة قبل التسليم، مع ضمان المتابعة والدعم الفني الدائم.',
      },
    ],
  },

  // ─── Technology Section ───
  technology: {
    tag: '// التقنيات',
    heading: 'مبني بأحدث تقنيات الويب العالمية',
    subtitle: 'نعتمد على ترسانة برمجية متطورة تضمن الاستقرار، السرعة، والأمان المستقبلي لمشروعك.',
    categories: {
      Frontend: 'الواجهة الأمامية',
      Backend: 'الواجهة الخلفية',
      Language: 'لغات البرمجة',
      Database: 'قواعد البيانات',
      Architecture: 'المعمارية البرمجية',
      Infrastructure: 'البنية التحتية',
      Tooling: 'أدوات التطوير',
    },
  },

  // ─── Portfolio Section ───
  portfolio: {
    tag: '// معرض الأعمال',
    heading: 'أعمالنا ومشاريعنا',
    filterLabel: 'تصنيفات معرض الأعمال',
    emptyTag: '[ معرض الأعمال ]',
    selectiveCaseStudies: 'يتم تقديم دراسات الحالة ونماذج الأعمال المفصلة بناءً على طلب العميل ومجال مشروعه.',
    emptyDescription: 'نحن نتخصص في تصميم وتطوير المواقع والمنصات الذكية المخصصة. كل مشروع نهندسه بهدف تحقيق السرعة والتميز والتحويل التجاري.',
    ctaButton: 'استفسر عن مشروعك الآن',
    liveSite: 'زيارة الموقع الحي',
    caseStudy: 'دراسة الحالة',
  },

  // ─── Call To Action Section ───
  cta: {
    tag: '// تواصل فوري',
    heading: 'لديك فكرة طموحة؟\nدعنا نبنيها لك معاً.',
    description: 'أخبرنا بما تخطط لبنائه والتحدي الذي تسعى لحله والنتائج التي تطمح لتحقيقها، وسنتولى تحويله إلى واقع استثنائي.',
    buttonText: 'ابدأ مشروعك الآن',
  },

  // ─── Contact Section ───
  contact: {
    tag: '// تواصل معنا',
    heading: 'ابدأ مشروعك الآن',
    subtitle: 'أخبرنا عن أهدافك وسنرد عليك بعرض مفصل وخطة عمل واضحة.',
    nameLabel: 'اسمك الكريم',
    namePlaceholder: 'مثال: محمد أحمد',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'name@company.com',
    companyLabel: 'الشركة أو المؤسسة (اختياري)',
    companyPlaceholder: 'اسم شركتك أو مشروعك',
    projectTypeLabel: 'نوع المشروع المطلوب',
    projectTypePlaceholder: 'اختر نوع المشروع',
    budgetRangeLabel: 'الميزانية المتوقعة',
    budgetRangePlaceholder: 'اختر الميزانية المتوقعة',
    messageLabel: 'تفاصيل المشروع',
    messagePlaceholder: 'أخبرنا عن فكرة المشروع، متطلباتك الأساسية، والجدول الزمني المفضل لديك...',
    submitButton: 'إرسال تفاصيل المشروع',
    submitting: 'جاري الإرسال...',
    successTitle: 'تم استلام رسالتك بنجاح!',
    successDesc: 'شكراً لاهتمامك. سنقوم بدراسة تفاصيل مشروعك والتواصل معك عبر البريد الإلكتروني خلال ٢٤ ساعة عمل.',
    sendAnother: 'إرسال استفسار آخر',
    infoTitle: 'معلومات التواصل المباشر',
    directEmail: 'البريد الإلكتروني المباشر',
    location: 'الموقع والعمل',
    locationValue: 'عن بُعد — تغطية لجميع أنحاء العالم',
    social: 'قنوات التواصل الاجتماعي',
    projectTypes: [
      { id: 'Business Website', label: 'موقع شركة / أعمال' },
      { id: 'Landing Page', label: 'صفحة هبوط تسويقية' },
      { id: 'E-Commerce', label: 'متجر إلكتروني' },
      { id: 'Booking System', label: 'نظام حجز ومواعيد' },
      { id: 'Custom Web App', label: 'تطبيق ويب مخصص (SaaS)' },
      { id: 'Website Redesign', label: 'إعادة تصميم وتطوير موقع حالي' },
      { id: 'Maintenance & Hosting', label: 'صيانة واستضافة سحابية' },
      { id: 'Other', label: 'أخرى (متطلبات خاصة)' },
    ],
    budgetRanges: [
      { id: 'Under $2,000', label: 'أقل من ٢,٠٠٠ دولار (~ ١٠٠ ألف ج.م)' },
      { id: '$2,000 — $5,000', label: '٢,٠٠٠ — ٥,٠٠٠ دولار (~ ١٠٠ ألف إلى ٢٥٠ ألف ج.م)' },
      { id: '$5,000 — $10,000', label: '٥,٠٠٠ — ١٠,٠٠٠ دولار (~ ٢٥٠ ألف إلى ٥٠٠ ألف ج.م)' },
      { id: '$10,000 — $25,000', label: '١٠,٠٠٠ — ٢٥,٠٠٠ دولار (~ ٥٠٠ ألف إلى ١.٢ مليون ج.م)' },
      { id: '$25,000+', label: 'أكثر من ٢٥,٠٠٠ دولار (+١.٢ مليون ج.م)' },
      { id: 'Not sure yet', label: 'غير محدد بعد (نرغب في مناقشة الخيارات)' },
    ],
  },

  // ─── Form Validation Messages ───
  validation: {
    nameRequired: 'يرجى إدخال الاسم',
    emailRequired: 'يرجى إدخال البريد الإلكتروني',
    emailInvalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    messageRequired: 'يرجى كتابة وصف مختصر للمشروع',
    passwordRequired: 'يرجى إدخال كلمة المرور',
    passwordMinLength: 'يجب أن لا تقل كلمة المرور عن ٦ أحرف',
    passwordsDoNotMatch: 'كلمة المرور الجديدة وتأكيدها غير متطابقين!',
    requiredField: 'هذا الحقل مطلوب',
  },

  // ─── Footer Section ───
  footer: {
    tagline: 'استوديو رقمي متخصص في هندسة وتطوير مواقع وتطبيقات عصرية فائقة السرعة للشركات الطموحة.',
    navigation: 'روابط التنقل',
    services: 'خدماتنا',
    contact: 'تواصل معنا',
    rightsReserved: 'جميع الحقوق محفوظة.',
    designedAndBuilt: 'تصميم وبرمجة استوديو VANTA.',
  },

  // ─── Admin Panel ───
  admin: {
    badge: 'لوحة الإدارة',
    brand: 'فانتا',
    signOut: 'تسجيل الخروج',
    nav: {
      dashboard: 'لوحة التحكم',
      projects: 'المشاريع',
      services: 'الخدمات',
      messages: 'الرسائل الواردة',
      content: 'محتوى الموقع',
      media: 'الوسائط والملفات',
      settings: 'الإعدادات',
    },

    // Dashboard
    dashboard: {
      title: 'لوحة التحكم',
      subtitle: 'نظرة شاملة على أداء موقعك واستفسارات العملاء',
      totalProjects: 'إجمالي المشاريع',
      published: 'المشاريع المنشورة',
      drafts: 'المسودات',
      messages: 'الرسائل الواردة',
      newBadge: 'رسائل جديدة',
      recentProjects: 'أحدث المشاريع',
      recentMessages: 'أحدث الرسائل',
      noProjectsYet: 'لا توجد مشاريع مضافة حتى الآن',
      noMessagesYet: 'لا توجد رسائل واردة حتى الآن',
    },

    // Projects Page
    projects: {
      title: 'إدارة المشاريع',
      subtitle: '{total} مشروع إجمالي · {published} منشور في الموقع',
      addProject: 'إضافة مشروع جديد',
      createProject: 'إنشاء أول مشروع',
      noProjects: 'لا توجد مشاريع مضافة حالياً.',
      emptyDesc: 'أضف أول مشروع لعرضه في معرض أعمال الموقع.',
      name: 'اسم المشروع *',
      namePlaceholder: 'مثال: منصة ريزيرف الذكية',
      category: 'التصنيف',
      categoryPlaceholder: 'مثال: متجر إلكتروني ~ E-Commerce',
      shortDesc: 'وصف مختصر',
      shortDescPlaceholder: 'سلسلة جمل تصف المشروع بإيجاز...',
      fullDesc: 'الوصف التفصيلي (دراسة الحالة)',
      clientName: 'اسم العميل / الشركة',
      image: 'صورة المشروع',
      imageUrlPlaceholder: 'رابط الصورة https://...',
      liveUrl: 'رابط الموقع الحي',
      caseStudyUrl: 'رابط دراسة الحالة',
      technologies: 'التقنيات المستخدمة',
      addTech: 'إضافة تقنية',
      addTechPlaceholder: 'اكتب التقنية واضغط Enter (مثال: React)',
      addBtn: 'إضافة',
      publishedCheck: 'منشور (يظهر في الموقع العام)',
      featuredCheck: 'مشروع مميز (يبرز في الواجهة)',
      editTitle: 'تعديل المشروع',
      newTitle: 'مشروع جديد',
      deleteConfirm: 'هل أنت متأكد من حذف هذا المشروع نهائياً؟',
      toastCreated: 'تمت إضافة المشروع بنجاح',
      toastUpdated: 'تم حفظ تعديلات المشروع بنجاح',
      toastDeleted: 'تم حذف المشروع بنجاح',
      toastPublished: 'تم نشر المشروع في الموقع',
      toastUnpublished: 'تم تحويل المشروع إلى مسودة',
      toastSaveError: 'فشل حفظ المشروع، يرجى التحقق من اتصالك والمحاولة مجدداً',
      toastDeleteError: 'فشل حذف المشروع، يرجى المحاولة مرة أخرى',
    },

    // Services Page
    services: {
      title: 'إدارة الخدمات',
      subtitle: '{total} خدمة إجمالية · {active} نشطة في الموقع',
      addService: 'إضافة خدمة جديدة',
      createService: 'إنشاء أول خدمة',
      noServices: 'لا توجد خدمات مضافة.',
      emptyDesc: 'أضف الخدمات التي يقدمها الاستوديو لتظهر لعملائك.',
      name: 'اسم الخدمة *',
      shortDesc: 'وصف مختصر للخدمة',
      fullDesc: 'الوصف الكامل والمزايا',
      icon: 'أيقونة الخدمة',
      iconPlaceholder: 'globe, layout, building, calendar, shopping-bag, code, server',
      activeCheck: 'خدمة نشطة (تظهر في الموقع)',
      editTitle: 'تعديل الخدمة',
      newTitle: 'خدمة جديدة',
      deleteConfirm: 'هل أنت متأكد من حذف هذه الخدمة نهائياً؟',
      toastCreated: 'تمت إضافة الخدمة بنجاح',
      toastUpdated: 'تم حفظ تعديلات الخدمة بنجاح',
      toastDeleted: 'تم حذف الخدمة بنجاح',
      toastActivated: 'تم تفعيل الخدمة في الموقع',
      toastDeactivated: 'تم إيقاف تفعيل الخدمة',
      toastSaveError: 'فشل حفظ الخدمة، يرجى المحاولة مرة أخرى',
      toastDeleteError: 'فشل حذف الخدمة',
    },

    // Messages Page
    messages: {
      title: 'الرسائل والاستفسارات',
      subtitle: '{total} رسالة إجمالية · {unread} رسالة جديدة غير مقروءة',
      filterAll: 'الكل',
      filterNew: 'جديدة',
      filterRead: 'مقروءة',
      filterReplied: 'تم الرد',
      filterArchived: 'مؤرشفة',
      backToInbox: 'العودة إلى صندوق الوارد',
      noMessages: 'لا توجد رسائل في هذا القسم.',
      deleteConfirm: 'هل أنت متأكد من حذف هذه الرسالة نهائياً؟',
      from: 'من:',
      company: 'الشركة:',
      projectType: 'نوع المشروع:',
      budget: 'الميزانية المتوقعة:',
      receivedAt: 'تاريخ الاستلام:',
      replyViaEmail: 'الرد عبر البريد الإلكتروني',
      markRead: 'تحديد كمقروء',
      markReplied: 'تحديد كتم الرد',
      archive: 'أرشفة',
      delete: 'حذف الرسالة',
    },

    // Content Page
    content: {
      title: 'محتوى الموقع',
      subtitle: 'تعديل النصوص والعناوين الظاهرة في صفحات الموقع العامة',
      saveContent: 'حفظ التعديلات',
      tabs: {
        hero: 'واجهة البداية (Hero)',
        about: 'من نحن (About)',
        cta: 'الدعوة لاتخاذ إجراء (CTA)',
        contact: 'بيانات التواصل (Contact)',
      },
      hero: {
        headline: 'العنوان الرئيسي للواجهة',
        description: 'الوصف التعريفي للواجهة',
        primaryCta: 'نص الزر الرئيسي',
        secondaryCta: 'نص الزر الثانوي',
      },
      about: {
        heading: 'عنوان قسم من نحن',
        description: 'الوصف الرئيسي',
        supportingContent: 'المحتوى الإضافي الداعم',
      },
      cta: {
        heading: 'عنوان قسم الدعوة للعمل',
        description: 'الوصف التحفيزي',
        buttonText: 'نص الزر التفاعلي',
      },
      contact: {
        email: 'بريد التواصل العام',
        phone: 'رقم الهاتف (اختياري)',
        location: 'الموقع الجغرافي',
        instagram: 'رابط إنستجرام',
        linkedin: 'رابط لينكد إن',
        github: 'رابط غيت هاب',
        twitter: 'رابط إكس / تويتر',
      },
      toastSaved: 'تم حفظ محتوى الموقع بنجاح',
      toastError: 'فشل حفظ المحتوى، يرجى المحاولة مرة أخرى',
    },

    // Media Page
    media: {
      title: 'مكتبة الوسائط والملفات',
      subtitle: '{total} ملف وسائط مرفوع',
      uploadButton: 'رفع ملفات جديدة',
      uploading: 'جاري الرفع...',
      noMedia: 'لا توجد ملفات وسائط مرفوعة بعد.',
      emptyDesc: 'ارفع الصور واستخدم روابطها في المشاريع والخدمات.',
      uploadFirst: 'رفع أول ملف الآن',
      copyUrl: 'نسخ الرابط',
      copied: 'تم النسخ!',
      deleteConfirm: 'هل أنت متأكد من حذف هذا الملف؟',
      toastUploaded: 'تم رفع الملف بنجاح',
      toastDeleted: 'تم حذف الملف بنجاح',
      uploadError: 'فشل رفع الملف، يرجى المحاولة مرة أخرى',
    },

    // Settings Page
    settings: {
      title: 'إعدادات المنصة',
      subtitle: 'البيانات الأساسية، محركات البحث، وحساب المسؤول',
      saveSettings: 'حفظ الإعدادات',
      tabs: {
        general: 'عام',
        social: 'شبكات التواصل',
        seo: 'محركات البحث (SEO)',
        admin: 'حساب المسؤول',
      },
      general: {
        agencyName: 'اسم الوكالة / الاستوديو',
        logoUrl: 'رابط الشعار',
        email: 'بريد الإدارة المعتمد',
        location: 'المقر أو صيغة العمل',
      },
      seo: {
        websiteTitle: 'عنوان الموقع في المتصفح ومحركات البحث',
        metaDescription: 'الوصف التعريفي للموقع (Meta Description)',
        ogImage: 'رابط صورة المشاركة على شبكات التواصل (OG Image)',
      },
      adminUser: {
        name: 'اسم المسؤول',
        email: 'البريد الإلكتروني لتسجيل الدخول',
        newPassword: 'كلمة المرور الجديدة (اتركه فارغاً للإبقاء على الحالية)',
        confirmPassword: 'تأكيد كلمة المرور الجديدة',
        passwordNote: 'ملاحظة: إذا أدخلت كلمة مرور جديدة فسيتم تحديث بيانات دخولك فوراً.',
      },
      toastSuccess: 'تم تحديث الإعدادات بنجاح',
      toastError: 'فشل تحديث الإعدادات',
    },

    // Login Page
    login: {
      title: 'مرحباً بعودتك',
      subtitle: 'سجّل دخولك للوصول إلى لوحة إدارة الموقع',
      controlPanel: 'لوحة التحكم المركزية',
      emailLabel: 'البريد الإلكتروني',
      emailPlaceholder: 'admin@vanta.studio',
      passwordLabel: 'كلمة المرور',
      togglePassword: 'تبديل إظهار كلمة المرور',
      showPassword: 'إظهار كلمة المرور',
      hidePassword: 'إخفاء كلمة المرور',
      signInButton: 'تسجيل الدخول',
      signingIn: 'جاري التحقق وتسجيل الدخول...',
      invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      backToSite: 'العودة إلى الموقع الرئيسي',
    },
  },

  // ─── 404 Dedicated Page ───
  notFound: {
    tag: '// خطأ_٤٠٤_الصفحة_غير_موجودة',
    title: 'الصفحة غير موجودة',
    description: 'الرابط الذي تحاول الوصول إليه غير متاح أو تم نقله. تفضل بالعودة إلى الصفحة الرئيسية أو استكشف خدمات وأعمال استوديو ڤانتا.',
    returnHome: 'الرئيسية',
    goBack: 'الرجوع للخلف',
    exploreServices: 'استكشف الخدمات',
    featuredWork: 'الأعمال والمشاريع',
    contactStudio: 'تواصل معنا',
    brandFooter: 'استوديو ڤانتا الرقمي',
  },

  // ─── API & System Errors ───
  errors: {
    network: 'تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت',
    serverError: 'حدث خطأ غير متوقع في الخادم، يرجى المحاولة لاحقاً',
    unauthorized: 'غير مصرح بالوصول، يرجى تسجيل الدخول مجدداً',
    notFound: 'المورد المطلوب غير موجود',
    rateLimit: 'تجاوزت الحد المسموح من الطلبات، يرجى الانتظار قليلاً',
    generic: 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى',
  },
};

export type TranslationDictionary = typeof ar;

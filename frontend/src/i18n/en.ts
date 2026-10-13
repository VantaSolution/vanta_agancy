/**
 * English Translation Dictionary for VANTA Studio.
 * Mirrors the structure of ar.ts 1:1.
 */

import type { TranslationDictionary } from './ar';

export const en: TranslationDictionary = {
  // ─── Common / General ───
  common: {
    loading: 'Loading...',
    error: 'An error occurred, please try again',
    success: 'Operation completed successfully',
    save: 'Save',
    saving: 'Saving...',
    saved: 'Saved!',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    back: 'Back',
    close: 'Close',
    search: 'Search',
    filter: 'Filter',
    all: 'All',
    actions: 'Actions',
    status: 'Status',
    yes: 'Yes',
    no: 'No',
    viewAll: 'View all',
    upload: 'Upload',
    uploading: 'Uploading...',
    uploaded: 'Uploaded successfully',
    copy: 'Copy',
    copied: 'Copied!',
    confirmDelete: 'Are you sure you want to delete this?',
    details: 'Details',
    notFound: 'Not found',
    unknown: 'Unknown',
    retry: 'Retry',
    select: 'Select',
    optional: 'Optional',
    required: 'Required',
    refresh: 'Refresh',
    and: 'and',
    or: 'or',
    total: 'Total',
  },

  // ─── Status Badges & Keys ───
  status: {
    active: 'Active',
    inactive: 'Inactive',
    published: 'Published',
    draft: 'Draft',
    pending: 'Pending',
    cancelled: 'Cancelled',
    expired: 'Expired',
    refunded: 'Refunded',
    new: 'New',
    read: 'Read',
    replied: 'Replied',
    archived: 'Archived',
    featured: 'Featured',
  },

  // ─── Pagination & Tables ───
  pagination: {
    page: 'Page',
    of: 'of',
    prev: 'Previous',
    next: 'Next',
    showing: 'Showing',
    to: 'to',
    records: 'records',
    pageOf: 'Page {page} of {totalPages}',
    showingRange: 'Showing {start} to {end} of {total}',
  },

  // ─── Navigation ───
  nav: {
    services: 'Services',
    work: 'Work',
    process: 'Process',
    about: 'About',
    contact: 'Contact',
    startProject: 'Start a Project',
    controlPanel: 'Control Panel',
    languageToggle: 'Change Language',
    currentLanguage: 'English',
    english: 'English',
    arabic: 'العربية',
    menu: 'Menu',
    closeMenu: 'Close Menu',
    home: 'Home',
    mainNav: 'Main Navigation',
    mobileNav: 'Mobile Navigation Menu',
    skipToContent: 'Skip to main content',
  },

  // ─── Hero Section ───
  hero: {
    digitalStudio: 'DIGITAL STUDIO',
    webDevelopment: 'WEB DEVELOPMENT',
    established: 'EST. 2026',
    availableForProjects: 'AVAILABLE FOR PROJECTS',
    version: 'VANTA.STUDIO — V2.0',
    headline: 'WE BUILD DIGITAL EXPERIENCES\nTHAT MOVE BUSINESSES FORWARD.',
    description: 'We design and develop fast, modern websites and digital products for businesses that want to stand out, perform better, and grow.',
    primaryCta: 'Start a Project',
    secondaryCta: 'View Our Work',
  },

  // ─── Intro Section ───
  intro: {
    tag: '// PHILOSOPHY',
    headlineBeforeAccent: "WE DON'T JUST BUILD WEBSITES.\n",
    headlineAccent: 'WE BUILD DIGITAL PRESENCE.',
    description: 'From a simple landing page to a complete digital platform, we design and develop experiences that make businesses look credible, perform better, and convert visitors into customers.',
  },

  // ─── About Section ───
  about: {
    tag: '// ABOUT',
    heading: 'SMALL STUDIO.\nBIG DIGITAL IMPACT.',
    description: "We're a focused digital studio that combines design, development, strategy, and performance into one seamless process. No bloated teams, no unnecessary layers — just sharp execution and real results.",
    supportingContent: "Every project we take on gets the full attention of our senior team. We treat your business as if it were our own, because that's how good digital products get made.",
    pillars: [
      { label: 'Design', desc: 'Visual systems that communicate' },
      { label: 'Development', desc: 'Clean code, modern architecture' },
      { label: 'Strategy', desc: 'Business-aligned decisions' },
      { label: 'Performance', desc: 'Speed and reliability' },
    ],
  },

  // ─── Services Section ───
  services: {
    tag: '// SERVICES',
    heading: 'WHAT WE BUILD',
    listLabel: 'Services list',
    detailsAria: '{name} service details',
    list: [
      {
        id: '1',
        name: 'Website Development',
        shortDescription: 'Custom-built, high-performance websites designed from the ground up with modern technologies and pixel-perfect execution.',
      },
      {
        id: '2',
        name: 'Landing Pages',
        shortDescription: 'Conversion-focused landing pages that communicate your value proposition clearly and drive measurable results.',
      },
      {
        id: '3',
        name: 'Business Websites',
        shortDescription: 'Professional digital presence for businesses that need to establish credibility and attract customers online.',
      },
      {
        id: '4',
        name: 'Booking Systems',
        shortDescription: 'Restaurant websites, clinic platforms, and reservation systems with real-time scheduling and digital menus.',
      },
      {
        id: '5',
        name: 'E-Commerce',
        shortDescription: 'Full-featured online stores with secure payments, inventory management, and optimized checkout flows.',
      },
      {
        id: '6',
        name: 'Custom Web Applications',
        shortDescription: 'Tailored web applications built to solve specific business problems — dashboards, internal tools, and SaaS platforms.',
      },
      {
        id: '7',
        name: 'Maintenance & Hosting',
        shortDescription: 'Ongoing technical support, performance monitoring, security updates, and reliable cloud hosting infrastructure.',
      },
    ],
  },

  // ─── Capabilities Section ───
  capabilities: {
    tag: '// CAPABILITIES',
    titleLine1: 'DESIGNED TO',
    titleGood: 'LOOK GOOD',
    titleLine2: 'ENGINEERED TO',
    titlePerform: 'PERFORM',
    description: 'Every project we ship is built with the same foundation — clean code, modern tools, and a relentless focus on quality.',
    items: [
      { name: 'Performance', description: 'Optimized for speed and Core Web Vitals' },
      { name: 'Responsive Design', description: 'Pixel-perfect across all devices' },
      { name: 'SEO Foundations', description: 'Built-in search engine optimization' },
      { name: 'Clean Architecture', description: 'Maintainable, scalable code structure' },
      { name: 'Scalable Backend', description: 'API-first approach for future growth' },
      { name: 'Modern UI/UX', description: 'Intuitive interfaces that convert' },
      { name: 'Analytics Ready', description: 'Tracking and insights from day one' },
      { name: 'Security Best Practices', description: 'Hardened against common vulnerabilities' },
    ],
  },

  // ─── Process Section ───
  process: {
    tag: '// PROCESS',
    heading: 'FROM IDEA TO LAUNCH',
    steps: [
      {
        number: '01',
        title: 'DISCOVER',
        description: 'Understand the business, audience, and goals. We analyze your market, competitors, and users to define the right digital strategy.',
      },
      {
        number: '02',
        title: 'DESIGN',
        description: 'Create the visual direction and user experience. Every element is crafted to communicate your brand and guide users toward action.',
      },
      {
        number: '03',
        title: 'DEVELOP',
        description: 'Build the website with modern technologies and clean architecture. Performance, security, and scalability are engineered from day one.',
      },
      {
        number: '04',
        title: 'LAUNCH',
        description: 'Deploy, optimize, and hand over the final product. We ensure everything works flawlessly and provide ongoing support.',
      },
    ],
  },

  // ─── Technology Section ───
  technology: {
    tag: '// TECHNOLOGY',
    heading: 'BUILT WITH MODERN TECHNOLOGY',
    subtitle: 'We rely on a robust, state-of-the-art modern stack to deliver maximum speed, resilience, and security.',
    categories: {
      Frontend: 'Frontend',
      Backend: 'Backend',
      Language: 'Language',
      Database: 'Database',
      Architecture: 'Architecture',
      Infrastructure: 'Infrastructure',
      Tooling: 'Tooling',
    },
  },

  // ─── Portfolio Section ───
  portfolio: {
    tag: '// PORTFOLIO',
    heading: 'FEATURED WORK',
    filterLabel: 'Portfolio category filters',
    emptyTag: '[ PORTFOLIO ]',
    selectiveCaseStudies: 'SELECTIVE CASE STUDIES ARE CURATED PER CLIENT INQUIRY.',
    emptyDescription: 'We build custom websites, booking systems, and web applications. Every project is engineered for speed, conversion, and brand presence.',
    ctaButton: 'Inquire About Your Project',
    liveSite: 'Live Site',
    caseStudy: 'Case Study',
  },

  // ─── Call To Action Section ───
  cta: {
    tag: '// LET’S TALK',
    heading: "HAVE AN IDEA?\nLET'S BUILD IT.",
    description: "Tell us what you're building, what problem you're solving, and what you want your website to achieve. We'll take it from there.",
    buttonText: 'Start a Project',
  },

  // ─── Contact Section ───
  contact: {
    tag: '// CONTACT',
    heading: 'START A PROJECT',
    subtitle: 'Tell us about your project goals and we will respond with a tailored proposal.',
    nameLabel: 'Your Name',
    namePlaceholder: 'John Doe',
    emailLabel: 'Email Address',
    emailPlaceholder: 'name@company.com',
    companyLabel: 'Company / Organization (Optional)',
    companyPlaceholder: 'Your company or project name',
    projectTypeLabel: 'Project Type',
    projectTypePlaceholder: 'Select project type',
    budgetRangeLabel: 'Expected Budget Range',
    budgetRangePlaceholder: 'Select expected budget',
    messageLabel: 'Project Details',
    messagePlaceholder: 'Tell us about what you want to build, key requirements, timeline, etc...',
    submitButton: 'Send Project Request',
    submitting: 'Sending...',
    successTitle: 'Message Received Successfully!',
    successDesc: 'Thank you for reaching out. We will review your project details and get back to you within 24 business hours.',
    sendAnother: 'Send another message',
    infoTitle: 'Direct Information',
    directEmail: 'Direct Email',
    location: 'Location',
    locationValue: 'Remote — Worldwide',
    social: 'Follow Us',
    projectTypes: [
      { id: 'Business Website', label: 'Business Website' },
      { id: 'Landing Page', label: 'Landing Page' },
      { id: 'E-Commerce', label: 'E-Commerce' },
      { id: 'Booking System', label: 'Booking System' },
      { id: 'Custom Web App', label: 'Custom Web App (SaaS)' },
      { id: 'Website Redesign', label: 'Website Redesign' },
      { id: 'Maintenance & Hosting', label: 'Maintenance & Hosting' },
      { id: 'Other', label: 'Other' },
    ],
    budgetRanges: [
      { id: 'Under $2,000', label: 'Under $2,000 (~ 100k EGP)' },
      { id: '$2,000 — $5,000', label: '$2,000 — $5,000 (~ 100k to 250k EGP)' },
      { id: '$5,000 — $10,000', label: '$5,000 — $10,000 (~ 250k to 500k EGP)' },
      { id: '$10,000 — $25,000', label: '$10,000 — $25,000 (~ 500k to 1.2M EGP)' },
      { id: '$25,000+', label: '$25,000+ (+1.2M EGP)' },
      { id: 'Not sure yet', label: 'Not sure yet' },
    ],
  },

  // ─── Form Validation Messages ───
  validation: {
    nameRequired: 'Name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Invalid email address',
    messageRequired: 'Please describe your project',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters long',
    passwordsDoNotMatch: 'New password and Confirm password do not match!',
    requiredField: 'This field is required',
  },

  // ─── Footer Section ───
  footer: {
    tagline: 'Digital studio engineering fast, modern websites and applications for forward-thinking businesses.',
    navigation: 'Navigation',
    services: 'Services',
    contact: 'Contact',
    rightsReserved: 'All rights reserved.',
    designedAndBuilt: 'Designed & built by VANTA Studio.',
  },

  // ─── Admin Panel ───
  admin: {
    badge: 'ADMIN',
    brand: 'VANTA',
    signOut: 'Sign Out',
    nav: {
      dashboard: 'Dashboard',
      projects: 'Projects',
      services: 'Services',
      messages: 'Messages',
      content: 'Content',
      media: 'Media',
      settings: 'Settings',
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your agency website and incoming client inquiries',
      totalProjects: 'Total Projects',
      published: 'Published',
      drafts: 'Drafts',
      messages: 'Messages',
      newBadge: 'new',
      recentProjects: 'Recent Projects',
      recentMessages: 'Recent Messages',
      noProjectsYet: 'No projects yet',
      noMessagesYet: 'No messages yet',
    },

    // Projects Page
    projects: {
      title: 'Projects',
      subtitle: '{total} total · {published} published',
      addProject: 'Add Project',
      createProject: 'Create Project',
      noProjects: 'No projects yet. Add your first project.',
      emptyDesc: 'Add your first project to showcase on the public website.',
      name: 'Project Name *',
      namePlaceholder: 'e.g. Reserve Booking System',
      category: 'Category',
      categoryPlaceholder: 'e.g. E-Commerce ~ متجر إلكتروني',
      shortDesc: 'Short Description',
      shortDescPlaceholder: 'A brief sentence describing the project...',
      fullDesc: 'Full Description',
      clientName: 'Client Name',
      image: 'Project Image URL',
      imageUrlPlaceholder: 'https://...',
      liveUrl: 'Live Project URL',
      caseStudyUrl: 'Case Study URL',
      technologies: 'Technologies Used',
      addTech: 'Add Tech',
      addTechPlaceholder: 'Add tech e.g. React',
      addBtn: 'Add',
      publishedCheck: 'Published (visible on public site)',
      featuredCheck: 'Featured Project',
      editTitle: 'Edit Project',
      newTitle: 'New Project',
      deleteConfirm: 'Delete this project?',
      toastCreated: 'Project saved successfully',
      toastUpdated: 'Project updated successfully',
      toastDeleted: 'Project deleted',
      toastPublished: 'Project published',
      toastUnpublished: 'Project unpublished',
      toastSaveError: 'Failed to save project. Please check your connection and try again.',
      toastDeleteError: 'Failed to delete project. Please try again.',
    },

    // Services Page
    services: {
      title: 'Services',
      subtitle: '{total} total · {active} active',
      addService: 'Add Service',
      createService: 'Create Service',
      noServices: 'No services yet. Add your first service.',
      emptyDesc: 'Add services offered by your studio to display to clients.',
      name: 'Service Name *',
      shortDesc: 'Short Description',
      fullDesc: 'Full Description',
      icon: 'Icon Name',
      iconPlaceholder: 'globe, layout, building, calendar, shopping-bag, code, server',
      activeCheck: 'Active (visible on public site)',
      editTitle: 'Edit Service',
      newTitle: 'New Service',
      deleteConfirm: 'Delete this service?',
      toastCreated: 'Service saved successfully',
      toastUpdated: 'Service updated successfully',
      toastDeleted: 'Service deleted',
      toastActivated: 'Service activated',
      toastDeactivated: 'Service disabled',
      toastSaveError: 'Failed to save service. Please try again.',
      toastDeleteError: 'Failed to delete service',
    },

    // Messages Page
    messages: {
      title: 'Messages',
      subtitle: '{total} total · {unread} unread',
      filterAll: 'All',
      filterNew: 'New',
      filterRead: 'Read',
      filterReplied: 'Replied',
      filterArchived: 'Archived',
      backToInbox: 'Back to inbox',
      noMessages: 'No messages yet',
      deleteConfirm: 'Delete this message?',
      from: 'From:',
      company: 'Company:',
      projectType: 'Project Type:',
      budget: 'Budget Range:',
      receivedAt: 'Received at:',
      replyViaEmail: 'Reply via Email',
      markRead: 'Mark as Read',
      markReplied: 'Mark as Replied',
      archive: 'Archive',
      delete: 'Delete message',
    },

    // Content Page
    content: {
      title: 'Website Content',
      subtitle: 'Edit the content displayed on the public website',
      saveContent: 'Save Content',
      tabs: {
        hero: 'Hero',
        about: 'About',
        cta: 'CTA',
        contact: 'Contact',
      },
      hero: {
        headline: 'Headline',
        description: 'Description',
        primaryCta: 'Primary CTA Text',
        secondaryCta: 'Secondary CTA Text',
      },
      about: {
        heading: 'Heading',
        description: 'Description',
        supportingContent: 'Supporting Content',
      },
      cta: {
        heading: 'Heading',
        description: 'Description',
        buttonText: 'Button Text',
      },
      contact: {
        email: 'General Contact Email',
        phone: 'Phone Number (Optional)',
        location: 'Location',
        instagram: 'Instagram URL',
        linkedin: 'LinkedIn URL',
        github: 'GitHub URL',
        twitter: 'X / Twitter URL',
      },
      toastSaved: 'Website content saved successfully',
      toastError: 'Failed to save content',
    },

    // Media Page
    media: {
      title: 'Media',
      subtitle: '{total} files',
      uploadButton: 'Upload',
      uploading: 'Uploading...',
      noMedia: 'No media files uploaded yet',
      emptyDesc: 'Upload images to use in projects and services.',
      uploadFirst: 'Upload your first file',
      copyUrl: 'Copy URL',
      copied: 'Copied!',
      deleteConfirm: 'Delete this file?',
      toastUploaded: 'Image uploaded successfully',
      toastDeleted: 'File deleted',
      uploadError: 'Failed to upload file, please try again',
    },

    // Settings Page
    settings: {
      title: 'Settings',
      subtitle: 'Configure agency metadata, social links, and admin credentials',
      saveSettings: 'Save Settings',
      tabs: {
        general: 'General',
        social: 'Social',
        seo: 'SEO',
        admin: 'Admin',
      },
      general: {
        agencyName: 'Agency Name',
        logoUrl: 'Logo URL',
        email: 'Contact Email',
        location: 'Location',
      },
      seo: {
        websiteTitle: 'Website Title',
        metaDescription: 'Meta Description',
        ogImage: 'OG Share Image URL',
      },
      adminUser: {
        name: 'Admin Name',
        email: 'Admin Email',
        newPassword: 'New Password (leave blank to keep current)',
        confirmPassword: 'Confirm New Password',
        passwordNote: 'Note: Updating your password will change your login credentials immediately.',
      },
      toastSuccess: 'Settings updated successfully',
      toastError: 'Failed to update settings',
    },

    // Login Page
    login: {
      title: 'Welcome back',
      subtitle: 'Sign in to manage your website',
      controlPanel: 'CONTROL PANEL',
      emailLabel: 'Email Address',
      emailPlaceholder: 'admin@vanta.studio',
      passwordLabel: 'Password',
      togglePassword: 'Toggle password visibility',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      signInButton: 'Sign In',
      signingIn: 'Signing in...',
      invalidCredentials: 'Invalid email or password',
      backToSite: 'Back to website',
    },
  },

  // ─── 404 Dedicated Page ───
  notFound: {
    tag: '// 404_PAGE_NOT_FOUND',
    title: 'PAGE NOT FOUND',
    description: 'The resource or page you are looking for has been moved, renamed, or does not exist. Return to our homepage or explore our core capabilities.',
    returnHome: 'Return Home',
    goBack: 'Go Back',
    exploreServices: 'Explore Services',
    featuredWork: 'Featured Work',
    contactStudio: 'Contact Studio',
    brandFooter: 'VANTA DIGITAL STUDIO',
  },

  // ─── API & System Errors ───
  errors: {
    network: 'Unable to connect to the server. Please check your internet connection.',
    serverError: 'An unexpected server error occurred. Please try again later.',
    unauthorized: 'Session expired or unauthorized. Please sign in again.',
    notFound: 'The requested resource was not found.',
    rateLimit: 'Too many requests. Please wait a moment and try again.',
    generic: 'An unexpected error occurred, please try again.',
  },
};

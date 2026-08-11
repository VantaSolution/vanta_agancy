/* ═══════════════════════════════════════════════════════════
   VANTA — Type Definitions
   ═══════════════════════════════════════════════════════════ */

// ─── Project ───
export interface Project {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  clientName: string;
  projectImage: string;
  galleryImages: string[];
  technologies: string[];
  projectUrl: string;
  caseStudyUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  projectDate: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Service ───
export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Message ───
export type MessageStatus = 'new' | 'read' | 'replied' | 'archived';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budgetRange: string;
  message: string;
  status: MessageStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Website Content ───
export interface HeroContent {
  headline: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface AboutContent {
  heading: string;
  description: string;
  supportingContent: string;
}

export interface CtaContent {
  heading: string;
  description: string;
  buttonText: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  socialLinks: SocialLinks;
}

export interface SocialLinks {
  instagram: string;
  linkedin: string;
  github: string;
  twitter: string;
  [key: string]: string;
}

export interface WebsiteContent {
  hero: HeroContent;
  about: AboutContent;
  cta: CtaContent;
  contact: ContactInfo;
}

// ─── Settings ───
export interface GeneralSettings {
  agencyName: string;
  logo: string;
  email: string;
  location: string;
}

export interface SeoSettings {
  websiteTitle: string;
  metaDescription: string;
  ogImage: string;
}

export interface AdminProfile {
  name: string;
  email: string;
}

export interface Settings {
  general: GeneralSettings;
  social: SocialLinks;
  seo: SeoSettings;
  admin: AdminProfile;
}

// ─── Media ───
export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  altText: string;
  folder: string;
  createdAt: string;
}

// ─── Technology ───
export interface Technology {
  name: string;
  category: string;
  x?: number;
  y?: number;
}

// ─── Process Step ───
export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

// ─── Capability ───
export interface Capability {
  name: string;
  description: string;
}

// ─── Auth ───
export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
}

// ─── API Response ───
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// ─── Dashboard Stats ───
export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalMessages: number;
  unreadMessages: number;
}

// ─── Contact Form ───
export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budgetRange: string;
  message: string;
}

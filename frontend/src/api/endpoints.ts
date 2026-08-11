import apiClient from './client';
import { defaultServices } from '@/data/services';
import { defaultProjects } from '@/data/projects';
import { defaultContent } from '@/data/content';
import type {
  Project,
  Service,
  ContactMessage,
  WebsiteContent,
  Settings,
  MediaItem,
  DashboardStats,
  ContactFormData,
  LoginCredentials,
  AuthResponse,
  AuthUser,
} from '@/types';

// ═══════════════════════════════════════════════════════════
// Mock Data Store (localStorage-backed for dev persistence)
// ═══════════════════════════════════════════════════════════

const STORE_KEYS = {
  projects: 'vanta_projects',
  services: 'vanta_services',
  messages: 'vanta_messages',
  content: 'vanta_content',
  settings: 'vanta_settings',
  media: 'vanta_media',
};

function getStore<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStore<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

const USE_MOCK = import.meta.env.PROD
  ? import.meta.env.VITE_USE_MOCK === 'true'
  : import.meta.env.VITE_USE_MOCK !== 'false';

// ═══════════════════════════════════════════════════════════
// Auth API
// ═══════════════════════════════════════════════════════════

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    if (USE_MOCK) {
      // Mock admin credentials
      if (credentials.email === 'admin@vanta.studio' && credentials.password === 'admin123') {
        const mockUser: AuthUser = {
          userId: '1',
          email: 'admin@vanta.studio',
          name: 'Admin',
          role: 'admin',
        };
        const response: AuthResponse = {
          success: true,
          data: {
            accessToken: 'mock-access-token-' + Date.now(),
            refreshToken: 'mock-refresh-token-' + Date.now(),
            user: mockUser,
          },
        };
        return response;
      }
      throw new Error('Invalid credentials');
    }
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  getMe: async (): Promise<AuthUser> => {
    if (USE_MOCK) {
      const user = localStorage.getItem('user');
      if (user) return JSON.parse(user);
      throw new Error('Not authenticated');
    }
    const { data } = await apiClient.get('/auth/me');
    return data.data;
  },
};

// ═══════════════════════════════════════════════════════════
// Projects API
// ═══════════════════════════════════════════════════════════

export const projectsAPI = {
  list: async (): Promise<Project[]> => {
    if (USE_MOCK) {
      return getStore<Project[]>(STORE_KEYS.projects, defaultProjects);
    }
    const { data } = await apiClient.get('/projects');
    return data.data;
  },

  listPublished: async (): Promise<Project[]> => {
    if (USE_MOCK) {
      const projects = getStore<Project[]>(STORE_KEYS.projects, defaultProjects);
      return projects.filter((p) => p.isPublished).sort((a, b) => a.displayOrder - b.displayOrder);
    }
    const { data } = await apiClient.get('/projects?published=true');
    return data.data;
  },

  getById: async (id: string): Promise<Project | undefined> => {
    if (USE_MOCK) {
      const projects = getStore<Project[]>(STORE_KEYS.projects, defaultProjects);
      return projects.find((p) => p.id === id);
    }
    const { data } = await apiClient.get(`/projects/${id}`);
    return data.data;
  },

  create: async (project: Partial<Project>): Promise<Project> => {
    if (USE_MOCK) {
      const projects = getStore<Project[]>(STORE_KEYS.projects, defaultProjects);
      const newProject: Project = {
        id: Date.now().toString(),
        name: project.name || '',
        slug: project.slug || project.name?.toLowerCase().replace(/\s+/g, '-') || '',
        shortDescription: project.shortDescription || '',
        fullDescription: project.fullDescription || '',
        category: project.category || '',
        clientName: project.clientName || '',
        projectImage: project.projectImage || '',
        galleryImages: project.galleryImages || [],
        technologies: project.technologies || [],
        projectUrl: project.projectUrl || '',
        caseStudyUrl: project.caseStudyUrl || '',
        isFeatured: project.isFeatured || false,
        isPublished: project.isPublished || false,
        displayOrder: projects.length + 1,
        projectDate: project.projectDate || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      projects.push(newProject);
      setStore(STORE_KEYS.projects, projects);
      return newProject;
    }
    const { data } = await apiClient.post('/projects', project);
    return data.data;
  },

  update: async (id: string, updates: Partial<Project>): Promise<Project> => {
    if (USE_MOCK) {
      const projects = getStore<Project[]>(STORE_KEYS.projects, defaultProjects);
      const index = projects.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Project not found');
      projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
      setStore(STORE_KEYS.projects, projects);
      return projects[index];
    }
    const { data } = await apiClient.put(`/projects/${id}`, updates);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      const projects = getStore<Project[]>(STORE_KEYS.projects, defaultProjects);
      setStore(STORE_KEYS.projects, projects.filter((p) => p.id !== id));
      return;
    }
    await apiClient.delete(`/projects/${id}`);
  },

  reorder: async (projectIds: string[]): Promise<void> => {
    if (USE_MOCK) {
      const projects = getStore<Project[]>(STORE_KEYS.projects, defaultProjects);
      projectIds.forEach((id, index) => {
        const project = projects.find((p) => p.id === id);
        if (project) project.displayOrder = index + 1;
      });
      setStore(STORE_KEYS.projects, projects);
      return;
    }
    await apiClient.put('/projects/reorder', { projectIds });
  },
};

// ═══════════════════════════════════════════════════════════
// Services API
// ═══════════════════════════════════════════════════════════

export const servicesAPI = {
  list: async (): Promise<Service[]> => {
    if (USE_MOCK) {
      return getStore<Service[]>(STORE_KEYS.services, defaultServices);
    }
    const { data } = await apiClient.get('/services');
    return data.data;
  },

  listActive: async (): Promise<Service[]> => {
    if (USE_MOCK) {
      const services = getStore<Service[]>(STORE_KEYS.services, defaultServices);
      return services.filter((s) => s.isActive).sort((a, b) => a.displayOrder - b.displayOrder);
    }
    const { data } = await apiClient.get('/services?active=true');
    return data.data;
  },

  create: async (service: Partial<Service>): Promise<Service> => {
    if (USE_MOCK) {
      const services = getStore<Service[]>(STORE_KEYS.services, defaultServices);
      const newService: Service = {
        id: Date.now().toString(),
        name: service.name || '',
        shortDescription: service.shortDescription || '',
        fullDescription: service.fullDescription || '',
        icon: service.icon || 'globe',
        displayOrder: services.length + 1,
        isActive: service.isActive !== undefined ? service.isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      services.push(newService);
      setStore(STORE_KEYS.services, services);
      return newService;
    }
    const { data } = await apiClient.post('/services', service);
    return data.data;
  },

  update: async (id: string, updates: Partial<Service>): Promise<Service> => {
    if (USE_MOCK) {
      const services = getStore<Service[]>(STORE_KEYS.services, defaultServices);
      const index = services.findIndex((s) => s.id === id);
      if (index === -1) throw new Error('Service not found');
      services[index] = { ...services[index], ...updates, updatedAt: new Date().toISOString() };
      setStore(STORE_KEYS.services, services);
      return services[index];
    }
    const { data } = await apiClient.put(`/services/${id}`, updates);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      const services = getStore<Service[]>(STORE_KEYS.services, defaultServices);
      setStore(STORE_KEYS.services, services.filter((s) => s.id !== id));
      return;
    }
    await apiClient.delete(`/services/${id}`);
  },

  reorder: async (serviceIds: string[]): Promise<void> => {
    if (USE_MOCK) {
      const services = getStore<Service[]>(STORE_KEYS.services, defaultServices);
      serviceIds.forEach((id, index) => {
        const service = services.find((s) => s.id === id);
        if (service) service.displayOrder = index + 1;
      });
      setStore(STORE_KEYS.services, services);
      return;
    }
    await apiClient.put('/services/reorder', { serviceIds });
  },
};

// ═══════════════════════════════════════════════════════════
// Messages API
// ═══════════════════════════════════════════════════════════

export const messagesAPI = {
  list: async (): Promise<ContactMessage[]> => {
    if (USE_MOCK) {
      return getStore<ContactMessage[]>(STORE_KEYS.messages, []);
    }
    const { data } = await apiClient.get('/messages');
    return data.data;
  },

  submit: async (formData: ContactFormData): Promise<ContactMessage> => {
    if (USE_MOCK) {
      const messages = getStore<ContactMessage[]>(STORE_KEYS.messages, []);
      const newMessage: ContactMessage = {
        id: Date.now().toString(),
        ...formData,
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      messages.unshift(newMessage);
      setStore(STORE_KEYS.messages, messages);
      return newMessage;
    }
    const { data } = await apiClient.post('/messages', formData);
    return data.data;
  },

  updateStatus: async (id: string, status: ContactMessage['status']): Promise<ContactMessage> => {
    if (USE_MOCK) {
      const messages = getStore<ContactMessage[]>(STORE_KEYS.messages, []);
      const index = messages.findIndex((m) => m.id === id);
      if (index === -1) throw new Error('Message not found');
      messages[index] = { ...messages[index], status, updatedAt: new Date().toISOString() };
      setStore(STORE_KEYS.messages, messages);
      return messages[index];
    }
    const { data } = await apiClient.put(`/messages/${id}`, { status });
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      const messages = getStore<ContactMessage[]>(STORE_KEYS.messages, []);
      setStore(STORE_KEYS.messages, messages.filter((m) => m.id !== id));
      return;
    }
    await apiClient.delete(`/messages/${id}`);
  },
};

// ═══════════════════════════════════════════════════════════
// Content API
// ═══════════════════════════════════════════════════════════

export const contentAPI = {
  get: async (): Promise<WebsiteContent> => {
    if (USE_MOCK) {
      return getStore<WebsiteContent>(STORE_KEYS.content, defaultContent);
    }
    const { data } = await apiClient.get('/content');
    return data.data;
  },

  update: async (content: Partial<WebsiteContent>): Promise<WebsiteContent> => {
    if (USE_MOCK) {
      const existing = getStore<WebsiteContent>(STORE_KEYS.content, defaultContent);
      const updated = { ...existing, ...content };
      setStore(STORE_KEYS.content, updated);
      return updated;
    }
    const { data } = await apiClient.put('/content', content);
    return data.data;
  },
};

// ═══════════════════════════════════════════════════════════
// Settings API
// ═══════════════════════════════════════════════════════════

const defaultSettings: Settings = {
  general: {
    agencyName: 'VANTA',
    logo: '',
    email: 'hello@vanta.studio',
    location: 'Remote — Worldwide',
  },
  social: {
    instagram: '#',
    linkedin: '#',
    github: '#',
    twitter: '#',
  },
  seo: {
    websiteTitle: 'VANTA — Digital Studio',
    metaDescription: 'Premium digital studio specializing in website development, custom web applications, and digital experiences.',
    ogImage: '',
  },
  admin: {
    name: 'Admin',
    email: 'admin@vanta.studio',
  },
};

export const settingsAPI = {
  get: async (): Promise<Settings> => {
    if (USE_MOCK) {
      return getStore<Settings>(STORE_KEYS.settings, defaultSettings);
    }
    const { data } = await apiClient.get('/settings');
    return data.data;
  },

  update: async (settings: Partial<Settings>): Promise<Settings> => {
    if (USE_MOCK) {
      const existing = getStore<Settings>(STORE_KEYS.settings, defaultSettings);
      const updated = { ...existing, ...settings };
      setStore(STORE_KEYS.settings, updated);
      return updated;
    }
    const { data } = await apiClient.put('/settings', settings);
    return data.data;
  },
};

// ═══════════════════════════════════════════════════════════
// Media API
// ═══════════════════════════════════════════════════════════

export const mediaAPI = {
  list: async (): Promise<MediaItem[]> => {
    if (USE_MOCK) {
      return getStore<MediaItem[]>(STORE_KEYS.media, []);
    }
    const { data } = await apiClient.get('/media');
    return data.data;
  },

  upload: async (file: File): Promise<MediaItem> => {
    if (USE_MOCK) {
      const media = getStore<MediaItem[]>(STORE_KEYS.media, []);
      const newMedia: MediaItem = {
        id: Date.now().toString(),
        filename: `${Date.now()}-${file.name}`,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        altText: '',
        folder: 'general',
        createdAt: new Date().toISOString(),
      };
      media.unshift(newMedia);
      setStore(STORE_KEYS.media, media);
      return newMedia;
    }
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post('/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      const media = getStore<MediaItem[]>(STORE_KEYS.media, []);
      setStore(STORE_KEYS.media, media.filter((m) => m.id !== id));
      return;
    }
    await apiClient.delete(`/media/${id}`);
  },
};

// ═══════════════════════════════════════════════════════════
// Dashboard API
// ═══════════════════════════════════════════════════════════

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    if (USE_MOCK) {
      const projects = getStore<Project[]>(STORE_KEYS.projects, defaultProjects);
      const messages = getStore<ContactMessage[]>(STORE_KEYS.messages, []);
      return {
        totalProjects: projects.length,
        publishedProjects: projects.filter((p) => p.isPublished).length,
        draftProjects: projects.filter((p) => !p.isPublished).length,
        totalMessages: messages.length,
        unreadMessages: messages.filter((m) => m.status === 'new').length,
      };
    }
    const { data } = await apiClient.get('/dashboard/stats');
    return data.data;
  },
};

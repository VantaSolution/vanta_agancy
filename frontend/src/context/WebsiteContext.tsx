import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { contentAPI, settingsAPI, servicesAPI, projectsAPI } from '@/api/endpoints';
import { defaultContent } from '@/data/content';
import { defaultServices } from '@/data/services';
import { defaultProjects } from '@/data/projects';
import type { WebsiteContent, Settings, Service, Project } from '@/types';

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

interface WebsiteContextType {
  content: WebsiteContent;
  settings: Settings;
  services: Service[];
  projects: Project[];
  isLoading: boolean;
  refreshWebsiteData: () => Promise<void>;
}

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined);

export function WebsiteProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<WebsiteContent>(defaultContent);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshWebsiteData = useCallback(async () => {
    try {
      const [fetchedContent, fetchedSettings, fetchedServices, fetchedProjects] = await Promise.all([
        contentAPI.get().catch(() => defaultContent),
        settingsAPI.get().catch(() => defaultSettings),
        servicesAPI.listActive().catch(() => defaultServices),
        projectsAPI.listPublished().catch(() => defaultProjects),
      ]);

      if (fetchedContent) setContent(fetchedContent);
      if (fetchedSettings) setSettings(fetchedSettings);
      if (fetchedServices) setServices(fetchedServices);
      if (fetchedProjects) setProjects(fetchedProjects);
    } catch (err) {
      console.error('Failed to load website data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshWebsiteData();
  }, [refreshWebsiteData]);

  return (
    <WebsiteContext.Provider value={{ content, settings, services, projects, isLoading, refreshWebsiteData }}>
      {children}
    </WebsiteContext.Provider>
  );
}

export function useWebsite() {
  const context = useContext(WebsiteContext);
  if (!context) {
    throw new Error('useWebsite must be used within a WebsiteProvider');
  }
  return context;
}

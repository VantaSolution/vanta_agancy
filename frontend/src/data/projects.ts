import { Project } from '@/types';

/**
 * Portfolio projects data.
 * 
 * When this array is empty, the Portfolio section renders
 * an elegant empty state with a CTA.
 * 
 * To add a project, push an object matching the Project interface:
 * 
 * {
 *   id: '1',
 *   name: 'Project Name',
 *   slug: 'project-name',
 *   shortDescription: 'Brief description',
 *   fullDescription: 'Full case study content',
 *   category: 'E-Commerce',
 *   clientName: 'Client Co.',
 *   projectImage: '/images/project-1.jpg',
 *   galleryImages: ['/images/project-1-gallery-1.jpg'],
 *   technologies: ['React', 'Node.js', 'PostgreSQL'],
 *   projectUrl: 'https://example.com',
 *   caseStudyUrl: '/work/project-name',
 *   isFeatured: true,
 *   isPublished: true,
 *   displayOrder: 1,
 *   projectDate: '2026-01-15',
 *   createdAt: '',
 *   updatedAt: '',
 * }
 */
export const defaultProjects: Project[] = [];

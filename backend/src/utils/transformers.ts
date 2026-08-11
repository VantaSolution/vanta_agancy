// Helper functions to map PostgreSQL snake_case rows to camelCase for the frontend API contract

export function mapProject(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description || '',
    fullDescription: row.full_description || '',
    category: row.category || '',
    clientName: row.client_name || '',
    projectImage: row.project_image || '',
    galleryImages: typeof row.gallery_images === 'string' ? JSON.parse(row.gallery_images) : (row.gallery_images || []),
    technologies: typeof row.technologies === 'string' ? JSON.parse(row.technologies) : (row.technologies || []),
    projectUrl: row.project_url || '',
    caseStudyUrl: row.case_study_url || '',
    isFeatured: Boolean(row.is_featured),
    isPublished: Boolean(row.is_published),
    displayOrder: Number(row.display_order || 0),
    projectDate: row.project_date ? new Date(row.project_date).toISOString().split('T')[0] : '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapService(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    shortDescription: row.short_description || '',
    fullDescription: row.full_description || '',
    icon: row.icon || 'globe',
    displayOrder: Number(row.display_order || 0),
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMessage(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    company: row.company || '',
    projectType: row.project_type || '',
    budgetRange: row.budget_range || '',
    message: row.message || '',
    status: row.status || 'new',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMedia(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    filename: row.filename,
    originalName: row.original_name || row.filename,
    mimeType: row.mime_type || '',
    size: Number(row.size || 0),
    url: row.url,
    altText: row.alt_text || '',
    folder: row.folder || 'general',
    createdAt: row.created_at,
  };
}

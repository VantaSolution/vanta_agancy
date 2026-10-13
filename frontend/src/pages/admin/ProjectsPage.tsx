import React, { useEffect, useState, useCallback } from 'react';
import { projectsAPI, mediaAPI } from '@/api/endpoints';
import { useWebsite } from '@/context/WebsiteContext';
import { useTranslation, getErrorMessage } from '@/i18n';
import { formatNumber } from '@/utils/formatters';
import { Plus, Edit2, Trash2, Eye, EyeOff, X, AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import type { Project } from '@/types';

const emptyProject: Partial<Project> = {
  name: '', slug: '', shortDescription: '', fullDescription: '',
  category: '', clientName: '', projectImage: '', galleryImages: [],
  technologies: [], projectUrl: '', caseStudyUrl: '', isFeatured: false,
  isPublished: false, projectDate: new Date().toISOString().split('T')[0],
};

export function ProjectsPage() {
  const { refreshWebsiteData } = useWebsite();
  const { t, decode, language, isRtl } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project>>(emptyProject);
  const [techInput, setTechInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const load = async () => {
    const list = await projectsAPI.list();
    setProjects(list);
    await refreshWebsiteData();
  };

  useEffect(() => { load(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const mediaItem = await mediaAPI.upload(file);
      setEditingProject((p) => ({ ...p, projectImage: mediaItem.url }));
      showToast(t('admin.media.toastUploaded'), 'success');
    } catch (err: any) {
      console.error('Image upload failed:', err);
      showToast(getErrorMessage(err, 'admin.media.uploadError', t), 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!editingProject.name) return;
    setSaving(true);
    try {
      if (editingProject.id) {
        await projectsAPI.update(editingProject.id, editingProject);
        showToast(t('admin.projects.toastUpdated'), 'success');
      } else {
        await projectsAPI.create(editingProject);
        showToast(t('admin.projects.toastCreated'), 'success');
      }
      setIsEditing(false);
      setEditingProject(emptyProject);
      await load();
    } catch (error: any) {
      console.error('Failed to save project:', error);
      showToast(getErrorMessage(error, 'admin.projects.toastSaveError', t), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.projects.deleteConfirm'))) {
      try {
        await projectsAPI.delete(id);
        showToast(t('admin.projects.toastDeleted'), 'success');
        await load();
      } catch (error: any) {
        console.error('Failed to delete project:', error);
        showToast(getErrorMessage(error, 'admin.projects.toastDeleteError', t), 'error');
      }
    }
  };

  const togglePublish = async (project: Project) => {
    try {
      await projectsAPI.update(project.id, { isPublished: !project.isPublished });
      showToast(project.isPublished ? t('admin.projects.toastUnpublished') : t('admin.projects.toastPublished'), 'success');
      await load();
    } catch (error: any) {
      console.error('Failed to toggle publish:', error);
      showToast(t('common.error'), 'error');
    }
  };

  const addTech = () => {
    if (techInput.trim()) {
      setEditingProject((p) => ({ ...p, technologies: [...(p.technologies || []), techInput.trim()] }));
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setEditingProject((p) => ({ ...p, technologies: (p.technologies || []).filter((t) => t !== tech) }));
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'var(--color-text-primary)',
    fontSize: '0.9375rem',
    fontFamily: 'inherit',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: isRtl ? 'normal' : '0.06em',
    textTransform: isRtl ? 'none' : ('uppercase' as const),
    color: 'var(--color-text-muted)',
  };

  const toastStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '1.5rem',
    insetInlineEnd: '1.5rem',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 20px',
    borderRadius: '10px',
    fontSize: '0.875rem',
    fontWeight: 500,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    animation: 'fadeInUp 0.3s ease-out',
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          ...toastStyle,
          backgroundColor: toast.type === 'error' ? 'var(--color-status-error-muted)' : 'var(--color-status-success-muted)',
          border: `1px solid ${toast.type === 'error' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
          color: toast.type === 'error' ? 'var(--color-status-error)' : 'var(--color-status-success)',
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{ marginInlineStart: '8px', cursor: 'pointer', color: 'inherit', opacity: 0.7 }}
            aria-label={t('common.close')}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            {t('admin.projects.title')}
          </h1>
          <p className="text-body-sm">
            {t('admin.projects.subtitle', {
              total: formatNumber(projects.length, language),
              published: formatNumber(projects.filter((p) => p.isPublished).length, language),
            })}
          </p>
        </div>
        <button
          onClick={() => { setEditingProject(emptyProject); setIsEditing(true); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
            fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-bg-primary)',
            backgroundColor: 'var(--color-accent)', borderRadius: '6px', cursor: 'pointer',
          }}
        >
          <Plus size={16} /> {t('admin.projects.addProject')}
        </button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="admin-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p className="text-body-sm" style={{ marginBottom: '1rem' }}>
            {t('admin.projects.emptyDesc')}
          </p>
          <button
            onClick={() => { setEditingProject(emptyProject); setIsEditing(true); }}
            style={{ color: 'var(--color-accent)', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer' }}
          >
            + {t('admin.projects.createProject')}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {projects.map((project) => (
            <div
              key={project.id}
              className="admin-card"
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', minWidth: 0 }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    backgroundImage: project.projectImage ? `url(${project.projectImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-dim)',
                    flexShrink: 0,
                  }}
                >
                  {!project.projectImage && decode(project.name).slice(0, 2).toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                      {decode(project.name)}
                    </span>
                    {project.category && (
                      <span className="text-mono" style={{ fontSize: '0.6875rem', color: 'var(--color-accent)' }}>
                        {decode(project.category)}
                      </span>
                    )}
                  </div>
                  <p className="text-body-sm" style={{ fontSize: '0.8125rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '500px' }}>
                    {decode(project.shortDescription) || '—'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Published Badge Button */}
                <button
                  onClick={() => togglePublish(project)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    color: project.isPublished ? 'var(--color-status-success)' : 'var(--color-text-muted)',
                    backgroundColor: project.isPublished ? 'var(--color-status-success-muted)' : 'var(--color-bg-elevated)',
                    border: `1px solid ${project.isPublished ? 'rgba(16, 185, 129, 0.25)' : 'var(--color-border-subtle)'}`,
                  }}
                >
                  {project.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                  <span>{project.isPublished ? t('status.published') : t('status.draft')}</span>
                </button>

                {/* Edit */}
                <button
                  onClick={() => { setEditingProject(project); setIsEditing(true); }}
                  aria-label={t('common.edit')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    color: 'var(--color-text-secondary)',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  <Edit2 size={14} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(project.id)}
                  aria-label={t('common.delete')}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    color: 'var(--color-status-error)',
                    backgroundColor: 'var(--color-status-error-muted)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isEditing && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'var(--color-bg-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600 }}>
                {editingProject.id ? t('admin.projects.editTitle') : t('admin.projects.newTitle')}
              </h2>
              <button onClick={() => setIsEditing(false)} style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }} aria-label={t('common.close')}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>{t('admin.projects.name')}</label>
                  <input
                    type="text"
                    value={editingProject.name || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, name: e.target.value }))}
                    placeholder={t('admin.projects.namePlaceholder')}
                    style={fieldStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('admin.projects.category')}</label>
                  <input
                    type="text"
                    value={editingProject.category || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, category: e.target.value }))}
                    placeholder={t('admin.projects.categoryPlaceholder')}
                    style={fieldStyle}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>{t('admin.projects.shortDesc')}</label>
                <input
                  type="text"
                  value={editingProject.shortDescription || ''}
                  onChange={(e) => setEditingProject((p) => ({ ...p, shortDescription: e.target.value }))}
                  placeholder={t('admin.projects.shortDescPlaceholder')}
                  style={fieldStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>{t('admin.projects.fullDesc')}</label>
                <textarea
                  value={editingProject.fullDescription || ''}
                  onChange={(e) => setEditingProject((p) => ({ ...p, fullDescription: e.target.value }))}
                  rows={4}
                  style={{ ...fieldStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>{t('admin.projects.clientName')}</label>
                  <input
                    type="text"
                    value={editingProject.clientName || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, clientName: e.target.value }))}
                    style={fieldStyle}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('admin.projects.image')}</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      dir="ltr"
                      value={editingProject.projectImage || ''}
                      onChange={(e) => setEditingProject((p) => ({ ...p, projectImage: e.target.value }))}
                      placeholder={t('admin.projects.imageUrlPlaceholder')}
                      style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                    />
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-bg-elevated)', cursor: uploadingImage ? 'wait' : 'pointer', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                      <Upload size={14} />
                      {uploadingImage ? t('common.uploading') : t('common.upload')}
                      <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>{t('admin.projects.liveUrl')}</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={editingProject.projectUrl || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, projectUrl: e.target.value }))}
                    style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t('admin.projects.caseStudyUrl')}</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={editingProject.caseStudyUrl || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, caseStudyUrl: e.target.value }))}
                    style={{ ...fieldStyle, textAlign: isRtl ? 'right' : 'left' }}
                  />
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label style={labelStyle}>{t('admin.projects.technologies')}</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                    placeholder={t('admin.projects.addTechPlaceholder')}
                    style={fieldStyle}
                  />
                  <button
                    onClick={addTech}
                    style={{ padding: '10px 16px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    {t('admin.projects.addBtn')}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(editingProject.technologies || []).map((tech) => (
                    <span key={tech} style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span>{tech}</span>
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTech(tech)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="checkbox" checked={editingProject.isPublished || false} onChange={(e) => setEditingProject((p) => ({ ...p, isPublished: e.target.checked }))} />
                  <span>{t('admin.projects.publishedCheck')}</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="checkbox" checked={editingProject.isFeatured || false} onChange={(e) => setEditingProject((p) => ({ ...p, isFeatured: e.target.checked }))} />
                  <span>{t('admin.projects.featuredCheck')}</span>
                </label>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={() => setIsEditing(false)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)', background: 'none', cursor: 'pointer' }}>
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-primary)', fontWeight: 600, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

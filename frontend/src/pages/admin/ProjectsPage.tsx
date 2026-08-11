import React, { useEffect, useState } from 'react';
import { projectsAPI } from '@/api/endpoints';
import { useWebsite } from '@/context/WebsiteContext';
import { Plus, Edit2, Trash2, Eye, EyeOff, X } from 'lucide-react';
import type { Project } from '@/types';

const emptyProject: Partial<Project> = {
  name: '', slug: '', shortDescription: '', fullDescription: '',
  category: '', clientName: '', projectImage: '', galleryImages: [],
  technologies: [], projectUrl: '', caseStudyUrl: '', isFeatured: false,
  isPublished: false, projectDate: new Date().toISOString().split('T')[0],
};

export function ProjectsPage() {
  const { refreshWebsiteData } = useWebsite();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project>>(emptyProject);
  const [techInput, setTechInput] = useState('');

  const load = async () => {
    const list = await projectsAPI.list();
    setProjects(list);
    await refreshWebsiteData();
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editingProject.name) return;
    if (editingProject.id) {
      await projectsAPI.update(editingProject.id, editingProject);
    } else {
      await projectsAPI.create(editingProject);
    }
    setIsEditing(false);
    setEditingProject(emptyProject);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this project?')) {
      await projectsAPI.delete(id);
      await load();
    }
  };

  const togglePublish = async (project: Project) => {
    await projectsAPI.update(project.id, { isPublished: !project.isPublished });
    await load();
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

  const fieldStyle: React.CSSProperties = { width: '100%', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', padding: '10px 14px', color: 'var(--color-text-primary)', fontSize: '0.9375rem', fontFamily: 'var(--font-body)', outline: 'none' };
  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '6px', fontSize: '0.75rem', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--color-text-muted)' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>Projects</h1>
          <p className="text-body-sm">{projects.length} total · {projects.filter((p) => p.isPublished).length} published</p>
        </div>
        <button
          onClick={() => { setEditingProject(emptyProject); setIsEditing(true); }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px',
            fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-bg-primary)',
            backgroundColor: 'var(--color-accent)', borderRadius: '6px', cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="admin-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p className="text-body-sm" style={{ marginBottom: '1rem' }}>No projects yet. Add your first project.</p>
          <button
            onClick={() => { setEditingProject(emptyProject); setIsEditing(true); }}
            style={{ color: 'var(--color-accent)', fontWeight: 500, fontSize: '0.875rem' }}
          >
            + Create Project
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
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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
                  }}
                >
                  {!project.projectImage && project.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>{project.name}</span>
                    {project.category && (
                      <span className="text-mono" style={{ fontSize: '0.6875rem', color: 'var(--color-accent)' }}>
                        {project.category}
                      </span>
                    )}
                  </div>
                  <p className="text-body-sm" style={{ fontSize: '0.8125rem' }}>
                    {project.shortDescription || 'No description'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Published Badge */}
                <button
                  onClick={() => togglePublish(project)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    color: project.isPublished ? 'var(--color-status-success)' : 'var(--color-text-muted)',
                    backgroundColor: project.isPublished ? 'rgba(34, 197, 94, 0.1)' : 'var(--color-bg-elevated)',
                    border: `1px solid ${project.isPublished ? 'rgba(34, 197, 94, 0.2)' : 'var(--color-border-subtle)'}`,
                  }}
                >
                  {project.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                  {project.isPublished ? 'Published' : 'Draft'}
                </button>

                {/* Edit */}
                <button
                  onClick={() => { setEditingProject(project); setIsEditing(true); }}
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
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    color: 'var(--color-status-error)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
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
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(10,10,11,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="admin-card" style={{ width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600 }}>{editingProject.id ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setIsEditing(false)} style={{ color: 'var(--color-text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Project Name *</label>
                  <input type="text" value={editingProject.name || ''} onChange={(e) => setEditingProject((p) => ({ ...p, name: e.target.value }))} style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Category</label>
                  <input type="text" value={editingProject.category || ''} onChange={(e) => setEditingProject((p) => ({ ...p, category: e.target.value }))} placeholder="e.g. E-Commerce" style={fieldStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Short Description</label>
                <input type="text" value={editingProject.shortDescription || ''} onChange={(e) => setEditingProject((p) => ({ ...p, shortDescription: e.target.value }))} style={fieldStyle} />
              </div>

              <div>
                <label style={labelStyle}>Full Description</label>
                <textarea value={editingProject.fullDescription || ''} onChange={(e) => setEditingProject((p) => ({ ...p, fullDescription: e.target.value }))} rows={4} style={{ ...fieldStyle, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Client Name</label>
                  <input type="text" value={editingProject.clientName || ''} onChange={(e) => setEditingProject((p) => ({ ...p, clientName: e.target.value }))} style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Project Image URL</label>
                  <input type="text" value={editingProject.projectImage || ''} onChange={(e) => setEditingProject((p) => ({ ...p, projectImage: e.target.value }))} style={fieldStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Live Project URL</label>
                  <input type="text" value={editingProject.projectUrl || ''} onChange={(e) => setEditingProject((p) => ({ ...p, projectUrl: e.target.value }))} style={fieldStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Case Study URL</label>
                  <input type="text" value={editingProject.caseStudyUrl || ''} onChange={(e) => setEditingProject((p) => ({ ...p, caseStudyUrl: e.target.value }))} style={fieldStyle} />
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label style={labelStyle}>Technologies Used</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} placeholder="Add tech e.g. React" style={fieldStyle} />
                  <button onClick={addTech} style={{ padding: '10px 16px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', borderRadius: '8px', cursor: 'pointer' }}>Add</button>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(editingProject.technologies || []).map((tech) => (
                    <span key={tech} style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border-subtle)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      {tech}
                      <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeTech(tech)} />
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="checkbox" checked={editingProject.isPublished || false} onChange={(e) => setEditingProject((p) => ({ ...p, isPublished: e.target.checked }))} />
                  Published (visible on public site)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                  <input type="checkbox" checked={editingProject.isFeatured || false} onChange={(e) => setEditingProject((p) => ({ ...p, isFeatured: e.target.checked }))} />
                  Featured Project
                </label>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button onClick={() => setIsEditing(false)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid var(--color-border-subtle)', background: 'none', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleSave} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--color-accent)', color: 'var(--color-bg-primary)', fontWeight: 600, cursor: 'pointer' }}>Save Project</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

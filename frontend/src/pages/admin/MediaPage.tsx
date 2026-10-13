import React, { useEffect, useState, useRef } from 'react';
import { mediaAPI } from '@/api/endpoints';
import { useTranslation } from '@/i18n';
import { formatFileSize, formatNumber } from '@/utils/formatters';
import { Upload, Trash2, Image, Copy, Check } from 'lucide-react';
import type { MediaItem } from '@/types';

export function MediaPage() {
  const { t, language } = useTranslation();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => mediaAPI.list().then(setMedia).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        await mediaAPI.upload(file);
      }
      load();
    } catch {
      alert(t('admin.media.uploadError'));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t('admin.media.deleteConfirm'))) {
      await mediaAPI.delete(id);
      load();
    }
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>
            {t('admin.media.title')}
          </h1>
          <p className="text-body-sm">
            {t('admin.media.subtitle', { total: formatNumber(media.length, language) })}
          </p>
        </div>
        <div>
          <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} id="media-upload" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-bg-primary)', backgroundColor: 'var(--color-accent)', borderRadius: '8px', border: 'none', cursor: isUploading ? 'wait' : 'pointer' }}
          >
            <Upload size={16} /> <span>{isUploading ? t('admin.media.uploading') : t('admin.media.uploadButton')}</span>
          </button>
        </div>
      </div>

      {media.length === 0 ? (
        <div className="admin-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Image size={40} style={{ color: 'var(--color-text-dim)', margin: '0 auto 1rem' }} />
          <p className="text-body-sm" style={{ marginBottom: '1rem' }}>{t('admin.media.noMedia')}</p>
          <button onClick={() => fileInputRef.current?.click()} style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
            {t('admin.media.uploadFirst')}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {media.map((item) => (
            <div key={item.id} className="admin-card" style={{ overflow: 'hidden' }}>
              {/* Preview */}
              <div
                style={{
                  width: '100%',
                  height: '150px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  backgroundImage: item.mimeType.startsWith('image/') ? `url(${item.url})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {!item.mimeType.startsWith('image/') && <Image size={32} style={{ color: 'var(--color-text-dim)' }} />}
              </div>

              {/* Info */}
              <div style={{ padding: '12px' }}>
                <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>
                  {item.originalName}
                </p>
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginBottom: '8px' }}>
                  {formatFileSize(item.size, language)} · {item.mimeType.split('/')[1]?.toUpperCase()}
                </p>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => copyUrl(item.id, item.url)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '6px', fontSize: '0.6875rem', color: copiedId === item.id ? 'var(--color-status-success)' : 'var(--color-text-muted)', backgroundColor: 'var(--color-bg-elevated)', borderRadius: '4px', border: '1px solid var(--color-border-subtle)', cursor: 'pointer' }}
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check size={12} />
                        <span>{t('admin.media.copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>{t('admin.media.copyUrl')}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    aria-label={t('common.delete')}
                    style={{ padding: '6px 8px', color: 'var(--color-status-error)', backgroundColor: 'var(--color-status-error-muted)', borderRadius: '4px', border: '1px solid rgba(239, 68, 68, 0.25)', cursor: 'pointer' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

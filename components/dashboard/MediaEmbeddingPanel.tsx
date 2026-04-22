'use client';

import { useRef, useState } from 'react';

interface MediaEmbeddingPanelProps {
  selectedImage: File | null;
  setSelectedImage: (f: File | null) => void;
  onExecuteImage: () => void;
  selectedVideo: File | null;
  setSelectedVideo: (f: File | null) => void;
  onExecuteVideo: () => void;
  imageLoading?: boolean;
  videoLoading?: boolean;
}

function UploadZone({
  type,
  file,
  onSelect,
  onExecute,
  onClear,
  loading,
  accept,
}: {
  type: 'image' | 'video';
  file: File | null;
  onSelect: (f: File) => void;
  onExecute: () => void;
  onClear: () => void;
  loading: boolean;
  accept: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const icon = type === 'image' ? (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ) : (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onSelect(f);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ flex: 1, minWidth: '280px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{
          width: '28px', height: '28px', borderRadius: '6px',
          background: type === 'image' ? 'var(--blue-bg)' : 'var(--purple-bg)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={type === 'image' ? 'var(--blue)' : 'var(--purple)'}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {type === 'image' ? (
              <>
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </>
            ) : (
              <>
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </>
            )}
          </svg>
        </div>
        <div>
          <h4 className="text-section-title" style={{ fontSize: '13px' }}>
            {type === 'image' ? 'Image Embedding' : 'Video Embedding'}
          </h4>
          <p className="text-caption">
            {type === 'image' ? 'PNG, JPG, WebP supported' : 'MP4, AVI, MOV supported'}
          </p>
        </div>
      </div>

      {/* Drop zone / file preview */}
      {!file ? (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Drop or click to select ${type}`}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `1px dashed ${dragOver ? 'var(--accent)' : 'var(--border-default)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '28px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            background: dragOver ? 'var(--accent-subtle)' : 'transparent',
          }}
        >
          <div style={{ color: 'var(--text-quaternary)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
            {icon}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
            Drop {type} here or <span style={{ color: 'var(--accent)', fontWeight: 500 }}>browse</span>
          </p>
          <p className="text-caption">Max 50MB</p>
        </div>
      ) : (
        <div style={{
          border: '1px solid var(--border-default)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          background: 'var(--bg-elevated)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '8px',
              background: type === 'image' ? 'var(--blue-bg)' : 'var(--purple-bg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke={type === 'image' ? 'var(--blue)' : 'var(--purple)'}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z" />
                <polyline points="13 2 13 9 20 9" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {file.name}
              </p>
              <p className="text-caption">{formatSize(file.size)} · {file.type || type}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              aria-label="Remove selected file"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-tertiary)', padding: '4px', flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
          if (inputRef.current) inputRef.current.value = '';
        }}
        style={{ display: 'none' }}
        aria-label={`Select ${type} file`}
      />

      {/* Execute button */}
      <button
        className="btn btn-primary"
        onClick={onExecute}
        disabled={!file || loading}
        style={{ width: '100%', marginTop: '12px' }}
      >
        {loading ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
            Processing…
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
            </svg>
            Generate {type === 'image' ? 'Image' : 'Video'} Embedding
          </>
        )}
      </button>
    </div>
  );
}

export default function MediaEmbeddingPanel({
  selectedImage, setSelectedImage, onExecuteImage,
  selectedVideo, setSelectedVideo, onExecuteVideo,
  imageLoading = false, videoLoading = false,
}: MediaEmbeddingPanelProps) {
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', flexWrap: 'wrap' }}>
      <UploadZone
        type="image"
        file={selectedImage}
        onSelect={setSelectedImage}
        onExecute={onExecuteImage}
        onClear={() => setSelectedImage(null)}
        loading={imageLoading}
        accept="image/*"
      />
      <UploadZone
        type="video"
        file={selectedVideo}
        onSelect={setSelectedVideo}
        onExecute={onExecuteVideo}
        onClear={() => setSelectedVideo(null)}
        loading={videoLoading}
        accept="video/*"
      />
    </div>
  );
}

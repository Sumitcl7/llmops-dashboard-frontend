'use client';

import { useState } from 'react';

interface UserControlsProps {
  query: string;
  setQuery: (q: string) => void;
  queryResult: any;
  onSendQuery: () => void;
  onEvaluateDrift: () => void;
  onRunRetrain: () => void;
  selectedImage: File | null;
  setSelectedImage: (f: File | null) => void;
  onExecuteImage: () => void;
  selectedVideo: File | null;
  setSelectedVideo: (f: File | null) => void;
  onExecuteVideo: () => void;
}

export default function UserControls({
  query, setQuery, queryResult,
  onSendQuery, onEvaluateDrift, onRunRetrain,
  selectedImage, setSelectedImage, onExecuteImage,
  selectedVideo, setSelectedVideo, onExecuteVideo,
}: UserControlsProps) {
  const [activeTab, setActiveTab] = useState<'query' | 'upload' | 'actions'>('query');

  const tabs = [
    { key: 'query' as const, label: 'Query Model' },
    { key: 'upload' as const, label: 'Upload Media' },
    { key: 'actions' as const, label: 'Drift Actions' },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div style={{
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid var(--border-default)',
        padding: '0 20px',
      }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: 500,
              color: activeTab === tab.key ? 'var(--text-primary)' : 'var(--text-tertiary)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 150ms ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '20px' }}>
        {/* Query Tab */}
        {activeTab === 'query' && (
          <div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="input"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Type a query to send to the model…"
                onKeyDown={e => e.key === 'Enter' && onSendQuery()}
                aria-label="Query input"
              />
              <button className="btn btn-primary" onClick={onSendQuery}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Send
              </button>
            </div>
            {queryResult && (
              <pre style={{
                marginTop: '12px',
                padding: '12px 16px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                overflowX: 'auto',
                fontFamily: "'SF Mono', 'Cascadia Code', 'Consolas', monospace",
                maxHeight: '200px',
              }}>
                {JSON.stringify(queryResult, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Image upload */}
            <div>
              <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Image Embedding</label>
              <div className="file-upload-zone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setSelectedImage(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                  id="image-upload"
                  aria-label="Select image file"
                />
                <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-quaternary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px' }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <p className="text-caption">{selectedImage ? selectedImage.name : 'Click to select image'}</p>
                </label>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={onExecuteImage}
                disabled={!selectedImage}
                style={{ marginTop: '8px', width: '100%' }}
              >
                Execute Image Embedding
              </button>
            </div>

            {/* Video upload */}
            <div>
              <label className="text-label" style={{ display: 'block', marginBottom: '8px' }}>Video Embedding</label>
              <div className="file-upload-zone">
                <input
                  type="file"
                  accept="video/*"
                  onChange={e => setSelectedVideo(e.target.files?.[0] || null)}
                  style={{ display: 'none' }}
                  id="video-upload"
                  aria-label="Select video file"
                />
                <label htmlFor="video-upload" style={{ cursor: 'pointer', display: 'block' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-quaternary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 8px' }}>
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  <p className="text-caption">{selectedVideo ? selectedVideo.name : 'Click to select video'}</p>
                </label>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={onExecuteVideo}
                disabled={!selectedVideo}
                style={{ marginTop: '8px', width: '100%' }}
              >
                Execute Video Embedding
              </button>
            </div>
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={onEvaluateDrift}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              Evaluate Drift
            </button>
            <button className="btn btn-secondary" onClick={onRunRetrain}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6" /><path d="M2.5 22v-6h6" />
                <path d="M3.34 8A9.96 9.96 0 0112 2c3.17 0 5.97 1.47 7.8 3.77L21.5 8" />
                <path d="M20.66 16A9.96 9.96 0 0112 22c-3.17 0-5.97-1.47-7.8-3.77L2.5 16" />
              </svg>
              Run Retrain Check
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

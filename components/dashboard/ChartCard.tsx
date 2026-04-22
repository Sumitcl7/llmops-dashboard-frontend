'use client';

import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  height?: number;
  action?: React.ReactNode;
}

export default function ChartCard({
  title,
  subtitle,
  children,
  loading = false,
  empty = false,
  emptyMessage = 'No data available',
  height = 280,
  action,
}: ChartCardProps) {
  return (
    <div className="card" role="figure" aria-label={title}>
      {/* Card header */}
      <div className="card-header">
        <div>
          <h3 className="text-section-title">{title}</h3>
          {subtitle && <p className="text-caption" style={{ marginTop: '2px' }}>{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* Chart area */}
      <div className="card-body" style={{ height, position: 'relative' }}>
        {loading ? (
          <div className="skeleton skeleton-chart" style={{ height: '100%' }} />
        ) : empty ? (
          <div className="empty-state" style={{ height: '100%' }}>
            <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" />
              <path d="M7 16l4-4 4 4 5-5" />
            </svg>
            <p className="empty-state-title">{emptyMessage}</p>
            <p className="empty-state-desc">Data will appear once ingested.</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

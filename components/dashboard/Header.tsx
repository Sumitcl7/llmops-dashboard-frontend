'use client';

import { formatRelativeTime } from '@/lib/formatters';

interface HeaderProps {
  lastUpdated: string | null;
  apiStatus: 'connected' | 'disconnected' | 'loading';
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function Header({ lastUpdated, apiStatus, onRefresh, isRefreshing }: HeaderProps) {
  const statusColor =
    apiStatus === 'connected' ? 'var(--green)' :
    apiStatus === 'loading' ? 'var(--amber)' : 'var(--red)';

  const statusLabel =
    apiStatus === 'connected' ? 'Connected' :
    apiStatus === 'loading' ? 'Connecting…' : 'Disconnected';

  return (
    <header className="app-header" role="banner">
      <div className="app-header-inner">
        {/* Left: Title + env badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <h1 className="text-page-title">LLMOps Dashboard</h1>
          </div>
          <span className="badge badge-purple" style={{ fontSize: '10px' }}>
            {process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV'}
          </span>
        </div>

        {/* Right: Status + refresh + timestamp */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* API Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} role="status" aria-label={`API ${statusLabel}`}>
            <div className="pulse-dot" style={{ backgroundColor: statusColor }} />
            <span className="text-caption">{statusLabel}</span>
          </div>

          {/* Last updated */}
          {lastUpdated && (
            <span className="text-caption" title={lastUpdated}>
              Updated {formatRelativeTime(lastUpdated)}
            </span>
          )}

          {/* Refresh button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh dashboard data"
          >
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{
                transition: 'transform 500ms ease',
                transform: isRefreshing ? 'rotate(360deg)' : 'none',
                animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
              }}
            >
              <path d="M21.5 2v6h-6"/>
              <path d="M2.5 22v-6h6"/>
              <path d="M3.34 8A9.96 9.96 0 0 1 12 2c3.17 0 5.97 1.47 7.8 3.77L21.5 8"/>
              <path d="M20.66 16A9.96 9.96 0 0 1 12 22c-3.17 0-5.97-1.47-7.8-3.77L2.5 16"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>
    </header>
  );
}

'use client';

interface ActivityLogProps {
  logLines: string[];
  loading: boolean;
}

export default function ActivityLog({ logLines, loading }: ActivityLogProps) {
  if (loading && logLines.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: '28px', marginBottom: '8px', borderRadius: '6px' }} />
        ))}
      </div>
    );
  }

  if (logLines.length === 0) {
    return (
      <div className="empty-state" style={{ padding: '32px 24px' }}>
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="empty-state-title">No activity yet</p>
        <p className="empty-state-desc">Interactions, drift checks, and retrains will appear here.</p>
      </div>
    );
  }

  return (
    <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '4px 20px' }}>
      {logLines.map((line, i) => {
        // Parse time from "HH:MM:SS - message" format
        const dashIndex = line.indexOf(' - ');
        const time = dashIndex > 0 ? line.slice(0, dashIndex) : '';
        const message = dashIndex > 0 ? line.slice(dashIndex + 3) : line;

        // Determine severity for color coding
        let messageColor = 'var(--text-secondary)';
        if (message.toLowerCase().includes('failed') || message.toLowerCase().includes('error')) {
          messageColor = 'var(--red)';
        } else if (message.toLowerCase().includes('retrain') || message.toLowerCase().includes('trigger')) {
          messageColor = 'var(--purple)';
        } else if (message.toLowerCase().includes('drift')) {
          messageColor = 'var(--orange)';
        } else if (message.toLowerCase().includes('refresh') || message.toLowerCase().includes('ok')) {
          messageColor = 'var(--green)';
        }

        return (
          <div key={i} className="log-entry">
            <span className="log-time">{time}</span>
            <span className="log-message" style={{ color: messageColor }}>{message}</span>
          </div>
        );
      })}
    </div>
  );
}

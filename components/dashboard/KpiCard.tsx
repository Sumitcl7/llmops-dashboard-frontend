'use client';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  status?: 'healthy' | 'warning' | 'drift' | 'error' | 'info' | 'retrain';
  trend?: { value: number; label: string };
  tooltip?: string;
  loading?: boolean;
}

export default function KpiCard({
  title,
  value,
  subtitle,
  status = 'info',
  trend,
  tooltip,
  loading = false,
}: KpiCardProps) {
  const statusColorMap: Record<string, string> = {
    healthy: 'var(--green)',
    warning: 'var(--amber)',
    drift: 'var(--orange)',
    error: 'var(--red)',
    info: 'var(--blue)',
    retrain: 'var(--purple)',
  };

  const valueColor = statusColorMap[status] || 'var(--text-primary)';

  if (loading) {
    return (
      <div className="kpi-card" data-status={status}>
        <div className="skeleton skeleton-text" style={{ width: '50%', marginBottom: '12px' }} />
        <div className="skeleton skeleton-metric" style={{ marginBottom: '8px' }} />
        <div className="skeleton skeleton-text" style={{ width: '70%', height: '12px' }} />
      </div>
    );
  }

  return (
    <div className="kpi-card" data-status={status} role="article" aria-label={`${title}: ${value}`}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span className="text-card-title">{title}</span>
        {tooltip && (
          <span className="info-tooltip" aria-label={tooltip}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-quaternary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span className="tooltip-text">{tooltip}</span>
          </span>
        )}
      </div>

      {/* Value */}
      <div className="text-metric" style={{ color: valueColor, marginBottom: '8px' }}>
        {value}
      </div>

      {/* Bottom row: subtitle + trend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '18px' }}>
        {subtitle && (
          <span className="text-caption">{subtitle}</span>
        )}
        {trend && (
          <span className={`trend ${trend.value > 0 ? 'trend-up' : trend.value < 0 ? 'trend-down' : 'trend-neutral'}`}>
            {trend.value > 0 ? '↑' : trend.value < 0 ? '↓' : '→'}
            {' '}{Math.abs(trend.value).toFixed(2)} {trend.label}
          </span>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { DRIFT_THRESHOLD } from '@/lib/constants';
import { formatDriftScore, formatShortDate } from '@/lib/formatters';

interface DriftCheckRow {
  date: string;
  score: number;
  threshold: number;
  decision: string;
  status: 'safe' | 'warning' | 'drift';
}

interface DriftChecksTableProps {
  driftData: Array<{ date: string; value: number }>;
  retrainData: Array<{ date: string; triggered: number; skipped: number }>;
  loading?: boolean;
}

type SortKey = 'date' | 'score' | 'threshold' | 'decision';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 8;

export default function DriftChecksTable({ driftData, retrainData, loading = false }: DriftChecksTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);

  // Build retrain lookup
  const retrainLookup = useMemo(() => {
    const map: Record<string, { triggered: number; skipped: number }> = {};
    retrainData.forEach(r => { map[r.date] = { triggered: r.triggered, skipped: r.skipped }; });
    return map;
  }, [retrainData]);

  // Build table rows
  const rows: DriftCheckRow[] = useMemo(() => {
    return driftData.map(d => {
      const retrain = retrainLookup[d.date];
      const aboveThreshold = d.value > DRIFT_THRESHOLD;
      let decision = 'No action';
      let status: DriftCheckRow['status'] = 'safe';

      if (aboveThreshold) {
        if (retrain?.triggered) {
          decision = 'Retrain triggered';
          status = 'drift';
        } else if (retrain?.skipped) {
          decision = 'Skipped (cooldown)';
          status = 'warning';
        } else {
          decision = 'Drift detected';
          status = 'drift';
        }
      } else if (d.value > DRIFT_THRESHOLD * 0.8) {
        status = 'warning';
        decision = 'Approaching threshold';
      }

      return {
        date: d.date,
        score: d.value,
        threshold: DRIFT_THRESHOLD,
        decision,
        status,
      };
    });
  }, [driftData, retrainLookup]);

  // Sort
  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') cmp = a.date.localeCompare(b.date);
      else if (sortKey === 'score') cmp = a.score - b.score;
      else if (sortKey === 'threshold') cmp = a.threshold - b.threshold;
      else cmp = a.decision.localeCompare(b.decision);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, sortKey, sortDir]);

  // Paginate
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(0);
  };

  const SortIcon = ({ col }: { col: SortKey }) => (
    <span className={`sort-icon ${sortKey === col ? '' : ''}`} style={{ opacity: sortKey === col ? 1 : 0.3 }}>
      {sortKey === col ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  const statusBadge = (status: DriftCheckRow['status'], decision: string) => {
    const map = {
      safe: 'badge-green',
      warning: 'badge-amber',
      drift: 'badge-red',
    };
    return <span className={`badge ${map[status]}`}>{decision}</span>;
  };

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: '36px', marginBottom: '8px', borderRadius: '6px' }} />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="empty-state-title">No drift checks yet</p>
        <p className="empty-state-desc">Run a drift evaluation to see data here.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table className="data-table" role="table" aria-label="Recent drift checks">
          <thead>
            <tr>
              <th onClick={() => handleSort('date')} className={sortKey === 'date' ? 'sorted' : ''}>
                Timestamp <SortIcon col="date" />
              </th>
              <th onClick={() => handleSort('score')} className={sortKey === 'score' ? 'sorted' : ''}>
                Drift Score <SortIcon col="score" />
              </th>
              <th onClick={() => handleSort('threshold')} className={sortKey === 'threshold' ? 'sorted' : ''}>
                Threshold <SortIcon col="threshold" />
              </th>
              <th>Delta</th>
              <th onClick={() => handleSort('decision')} className={sortKey === 'decision' ? 'sorted' : ''}>
                Decision <SortIcon col="decision" />
              </th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => {
              const delta = row.score - row.threshold;
              return (
                <tr key={i}>
                  <td style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>{formatShortDate(row.date)}</td>
                  <td className="numeric" style={{ fontWeight: 600, color: row.status === 'drift' ? 'var(--red)' : row.status === 'warning' ? 'var(--amber)' : 'var(--green)' }}>
                    {formatDriftScore(row.score)}
                  </td>
                  <td className="numeric" style={{ color: 'var(--text-tertiary)' }}>{row.threshold.toFixed(4)}</td>
                  <td className="numeric" style={{ color: delta > 0 ? 'var(--red)' : 'var(--green)', fontWeight: 500 }}>
                    {delta > 0 ? '+' : ''}{delta.toFixed(4)}
                  </td>
                  <td>{statusBadge(row.status, row.decision)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>← Prev</button>
          <span className="page-info">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next →</button>
        </div>
      )}
    </div>
  );
}

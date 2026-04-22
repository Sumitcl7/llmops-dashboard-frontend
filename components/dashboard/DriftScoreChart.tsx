'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend, Area, ComposedChart,
} from 'recharts';
import { CHART_COLORS, TOOLTIP_STYLE, AXIS_STYLE, GRID_STYLE, DRIFT_THRESHOLD } from '@/lib/constants';
import { formatShortDate, formatDriftScore } from '@/lib/formatters';

interface DriftScoreChartProps {
  data: Array<{ date: string; value: number }>;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const score = payload[0].value as number;
  const aboveThreshold = score > DRIFT_THRESHOLD;

  return (
    <div style={{
      ...TOOLTIP_STYLE.contentStyle,
      minWidth: '180px',
    }}>
      <p style={{ ...TOOLTIP_STYLE.labelStyle, marginBottom: '8px' }}>{label}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Drift Score</span>
        <span style={{
          fontWeight: 700,
          fontSize: '14px',
          fontVariantNumeric: 'tabular-nums',
          color: aboveThreshold ? CHART_COLORS.danger : CHART_COLORS.success,
        }}>
          {formatDriftScore(score)}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Threshold</span>
        <span style={{ color: 'var(--text-quaternary)', fontSize: '12px' }}>{DRIFT_THRESHOLD}</span>
      </div>
      <div style={{
        fontSize: '11px',
        fontWeight: 600,
        padding: '4px 8px',
        borderRadius: '4px',
        textAlign: 'center',
        background: aboveThreshold ? 'var(--red-bg)' : 'var(--green-bg)',
        color: aboveThreshold ? 'var(--red)' : 'var(--green)',
      }}>
        {aboveThreshold ? '⚠ Above Threshold — Retrain Needed' : '✓ Within Safe Range'}
      </div>
    </div>
  );
}

export default function DriftScoreChart({ data }: DriftScoreChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 12, right: 20, bottom: 36, left: 20 }}>
        <defs>
          <linearGradient id="driftGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
            <stop offset="100%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid {...GRID_STYLE} />

        <XAxis
          dataKey="date"
          {...AXIS_STYLE}
          tickFormatter={formatShortDate}
          label={{
            value: 'Time',
            position: 'bottom',
            offset: 20,
            style: { fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 },
          }}
        />

        <YAxis
          domain={[0, 1]}
          {...AXIS_STYLE}
          tickFormatter={(v: number) => v.toFixed(2)}
          label={{
            value: 'Drift Score (0–1)',
            angle: -90,
            position: 'insideLeft',
            offset: -5,
            style: { fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, textAnchor: 'middle' },
          }}
        />

        <Tooltip content={<CustomTooltip />} cursor={TOOLTIP_STYLE.cursor} />

        <Legend
          verticalAlign="top"
          align="right"
          iconType="plainline"
          wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)', paddingBottom: '8px' }}
        />

        <ReferenceLine
          y={DRIFT_THRESHOLD}
          stroke={CHART_COLORS.danger}
          strokeDasharray="6 4"
          strokeWidth={1.5}
          label={{
            value: `Threshold (${DRIFT_THRESHOLD})`,
            position: 'right',
            style: { fill: CHART_COLORS.danger, fontSize: 11, fontWeight: 500 },
          }}
        />

        <Area
          type="monotone"
          dataKey="value"
          fill="url(#driftGradient)"
          stroke="none"
          legendType="none"
        />

        <Line
          type="monotone"
          dataKey="value"
          stroke={CHART_COLORS.primary}
          strokeWidth={2}
          dot={{ r: 3, fill: CHART_COLORS.primary, stroke: 'var(--bg-surface)', strokeWidth: 2 }}
          activeDot={{ r: 5, fill: CHART_COLORS.primary, stroke: '#fff', strokeWidth: 2 }}
          name="Drift Score"
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { CHART_COLORS, TOOLTIP_STYLE, AXIS_STYLE, GRID_STYLE } from '@/lib/constants';
import { formatShortDate } from '@/lib/formatters';

interface RetrainTimelineChartProps {
  data: Array<{ date: string; skipped: number; triggered: number }>;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const triggered = payload.find((p: any) => p.dataKey === 'triggered')?.value ?? 0;
  const skipped = payload.find((p: any) => p.dataKey === 'skipped')?.value ?? 0;

  return (
    <div style={TOOLTIP_STYLE.contentStyle}>
      <p style={{ ...TOOLTIP_STYLE.labelStyle, marginBottom: '8px' }}>{label}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: CHART_COLORS.retrain }} />
            <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Triggered</span>
          </div>
          <span style={{ fontWeight: 700, color: CHART_COLORS.retrain, fontVariantNumeric: 'tabular-nums' }}>{triggered}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: CHART_COLORS.warning }} />
            <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Skipped</span>
          </div>
          <span style={{ fontWeight: 700, color: CHART_COLORS.warning, fontVariantNumeric: 'tabular-nums' }}>{skipped}</span>
        </div>
        <div style={{ borderTop: '1px solid var(--border-default)', marginTop: '4px', paddingTop: '6px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Total checks</span>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '12px' }}>{triggered + skipped}</span>
        </div>
      </div>
    </div>
  );
}

export default function RetrainTimelineChart({ data }: RetrainTimelineChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 12, right: 20, bottom: 36, left: 20 }}>
        <CartesianGrid {...GRID_STYLE} />

        <XAxis
          dataKey="date"
          {...AXIS_STYLE}
          tickFormatter={formatShortDate}
          label={{
            value: 'Date',
            position: 'bottom',
            offset: 20,
            style: { fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 },
          }}
        />

        <YAxis
          {...AXIS_STYLE}
          allowDecimals={false}
          label={{
            value: 'Event Count',
            angle: -90,
            position: 'insideLeft',
            offset: -5,
            style: { fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, textAnchor: 'middle' },
          }}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 92, 252, 0.06)' }} />

        <Legend
          verticalAlign="top"
          align="right"
          iconType="square"
          iconSize={10}
          wrapperStyle={{ fontSize: '12px', paddingBottom: '8px' }}
        />

        <Bar
          dataKey="triggered"
          stackId="retrain"
          fill={CHART_COLORS.retrain}
          radius={[0, 0, 0, 0]}
          maxBarSize={32}
          name="Triggered"
        />
        <Bar
          dataKey="skipped"
          stackId="retrain"
          fill={CHART_COLORS.warning}
          radius={[4, 4, 0, 0]}
          maxBarSize={32}
          name="Skipped"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

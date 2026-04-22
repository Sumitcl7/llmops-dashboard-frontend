'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { CHART_COLORS, TOOLTIP_STYLE, AXIS_STYLE, GRID_STYLE } from '@/lib/constants';
import { formatShortDate, formatNumber } from '@/lib/formatters';

interface QueriesChartProps {
  data: Array<{ date: string; value: number }>;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE.contentStyle}>
      <p style={{ ...TOOLTIP_STYLE.labelStyle, marginBottom: '6px' }}>{label}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Query Count</span>
        <span style={{ fontWeight: 700, fontSize: '14px', color: CHART_COLORS.info, fontVariantNumeric: 'tabular-nums' }}>
          {formatNumber(payload[0].value)}
        </span>
      </div>
    </div>
  );
}

export default function QueriesChart({ data }: QueriesChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 12, right: 20, bottom: 36, left: 20 }}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.info} stopOpacity={0.8} />
            <stop offset="100%" stopColor={CHART_COLORS.info} stopOpacity={0.3} />
          </linearGradient>
        </defs>

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
            value: 'Query Count',
            angle: -90,
            position: 'insideLeft',
            offset: -5,
            style: { fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, textAnchor: 'middle' },
          }}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 92, 252, 0.06)' }} />

        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40} name="Queries">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill="url(#barGradient)"
              opacity={0.6 + (entry.value / maxValue) * 0.4}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

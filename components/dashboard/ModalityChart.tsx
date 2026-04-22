'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { TOOLTIP_STYLE, AXIS_STYLE, GRID_STYLE } from '@/lib/constants';
import { formatNumber } from '@/lib/formatters';

interface ModalityChartProps {
  data: Array<{ name: string; value: number }>;
}

const BAR_COLORS = ['#7C5CFC', '#60A5FA', '#3FB950', '#F97316', '#A78BFA', '#D29922'];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE.contentStyle}>
      <p style={{ ...TOOLTIP_STYLE.labelStyle, marginBottom: '6px' }}>{label}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Count</span>
        <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
          {formatNumber(payload[0].value)}
        </span>
      </div>
    </div>
  );
}

export default function ModalityChart({ data }: ModalityChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 12, right: 20, bottom: 36, left: 20 }} layout="horizontal">
        <CartesianGrid {...GRID_STYLE} />

        <XAxis
          dataKey="name"
          {...AXIS_STYLE}
          label={{
            value: 'Modality Type',
            position: 'bottom',
            offset: 20,
            style: { fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500 },
          }}
        />

        <YAxis
          {...AXIS_STYLE}
          allowDecimals={false}
          label={{
            value: 'Usage Count',
            angle: -90,
            position: 'insideLeft',
            offset: -5,
            style: { fill: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, textAnchor: 'middle' },
          }}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 92, 252, 0.06)' }} />

        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48} name="Count">
          <LabelList
            dataKey="value"
            position="top"
            style={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 600 }}
          />
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} fillOpacity={0.75} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

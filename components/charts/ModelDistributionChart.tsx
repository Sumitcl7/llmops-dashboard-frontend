'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector,
} from 'recharts';
import { TOOLTIP_STYLE } from '@/lib/constants';
import { formatNumber } from '@/lib/formatters';

/* ─── Types ─── */

interface ModelDistributionChartProps {
  data: Array<{ name: string; value: number }>;
}

/* ─── Color palette – curated for dark backgrounds ─── */

const MODEL_COLORS = [
  '#7C5CFC',  // electric purple
  '#60A5FA',  // sky blue
  '#3FB950',  // emerald green
  '#F97316',  // vivid orange
  '#EC4899',  // hot pink
  '#FBBF24',  // amber
  '#A78BFA',  // soft lavender
  '#06B6D4',  // teal cyan
];

/* ─── Custom active sector (on hover) ─── */

function renderActiveShape(props: any) {
  const {
    cx, cy, innerRadius, outerRadius,
    startAngle, endAngle, fill,
    payload, percent, value,
  } = props;

  return (
    <g>
      {/* Enlarged active slice */}
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: 'drop-shadow(0 0 8px rgba(124,92,252,0.3))' }}
      />
      {/* Inner glow ring */}
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={innerRadius - 2}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        fillOpacity={0.4}
      />
      {/* Center text */}
      <text x={cx} y={cy - 12} textAnchor="middle" fill="#EDEDEF" fontSize={18} fontWeight={700}>
        {formatNumber(value)}
      </text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#8B8B93" fontSize={12} fontWeight={500}>
        {payload.name}
      </text>
      <text x={cx} y={cy + 26} textAnchor="middle" fill="#5C5C63" fontSize={11}>
        {(percent * 100).toFixed(1)}%
      </text>
    </g>
  );
}

/* ─── Custom tooltip ─── */

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div style={TOOLTIP_STYLE.contentStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
        <span
          style={{
            width: 10, height: 10, borderRadius: '50%',
            backgroundColor: entry.payload.fill || entry.color,
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <span style={{ ...TOOLTIP_STYLE.labelStyle, marginBottom: 0 }}>{entry.name}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px' }}>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Requests</span>
        <span style={{
          fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {formatNumber(entry.value)}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', marginTop: '2px' }}>
        <span style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Share</span>
        <span style={{
          fontWeight: 600, fontSize: '13px', color: entry.payload.fill || entry.color,
          fontVariantNumeric: 'tabular-nums',
        }}>
          {((entry.payload.percent ?? 0) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

/* ─── Legend item ─── */

function LegendItem({
  color, name, value, percent, isActive, onMouseEnter, onMouseLeave,
}: {
  color: string;
  name: string;
  value: number;
  percent: number;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 10px',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backgroundColor: isActive ? 'rgba(124, 92, 252, 0.08)' : 'transparent',
        opacity: isActive ? 1 : 0.8,
      }}
    >
      <span
        style={{
          width: 10, height: 10, borderRadius: '50%',
          backgroundColor: color, flexShrink: 0,
          boxShadow: isActive ? `0 0 8px ${color}60` : 'none',
          transition: 'box-shadow 0.2s ease',
        }}
      />
      <span style={{
        flex: 1, fontSize: '12px', fontWeight: 500,
        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
        transition: 'color 0.2s ease',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {name}
      </span>
      <span style={{
        fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)',
        fontVariantNumeric: 'tabular-nums',
        minWidth: '36px', textAlign: 'right',
      }}>
        {formatNumber(value)}
      </span>
      <span style={{
        fontSize: '11px', fontWeight: 500, color: color,
        fontVariantNumeric: 'tabular-nums',
        minWidth: '38px', textAlign: 'right',
      }}>
        {(percent * 100).toFixed(1)}%
      </span>
    </div>
  );
}

/* ─── Main chart component ─── */

export default function ModelDistributionChart({ data }: ModelDistributionChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  const enrichedData = useMemo(
    () => data.map((d) => ({ ...d, percent: total > 0 ? d.value / total : 0 })),
    [data, total],
  );

  const handlePieEnter = useCallback((_: any, index: number) => setActiveIndex(index), []);
  const handlePieLeave = useCallback(() => setActiveIndex(undefined), []);

  if (data.length === 0) return null;

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', gap: '8px' }}>
      {/* Donut chart */}
      <div style={{ flex: '1 1 55%', minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={enrichedData}
              cx="50%"
              cy="50%"
              innerRadius="52%"
              outerRadius="78%"
              dataKey="value"
              nameKey="name"
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              onMouseEnter={handlePieEnter}
              onMouseLeave={handlePieLeave}
              paddingAngle={2}
              stroke="none"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {enrichedData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={MODEL_COLORS[index % MODEL_COLORS.length]}
                  fillOpacity={activeIndex !== undefined && activeIndex !== index ? 0.35 : 0.85}
                  style={{ transition: 'fill-opacity 0.25s ease', cursor: 'pointer' }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            {/* Default center text when nothing is hovered */}
            {activeIndex === undefined && (
              <>
                <text
                  x="50%" y="46%"
                  textAnchor="middle" dominantBaseline="central"
                  fill="#EDEDEF" fontSize={20} fontWeight={700}
                >
                  {formatNumber(total)}
                </text>
                <text
                  x="50%" y="56%"
                  textAnchor="middle" dominantBaseline="central"
                  fill="#5C5C63" fontSize={11}
                >
                  total requests
                </text>
              </>
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend */}
      <div style={{
        flex: '1 1 45%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '2px',
        minWidth: 0,
        overflow: 'hidden',
      }}>
        <div style={{
          fontSize: '11px', fontWeight: 600, color: 'var(--text-tertiary)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
          padding: '0 10px', marginBottom: '4px',
        }}>
          Models
        </div>
        {enrichedData.map((d, i) => (
          <LegendItem
            key={d.name}
            color={MODEL_COLORS[i % MODEL_COLORS.length]}
            name={d.name}
            value={d.value}
            percent={d.percent}
            isActive={activeIndex === i}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(undefined)}
          />
        ))}
      </div>
    </div>
  );
}
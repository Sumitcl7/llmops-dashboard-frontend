/** Design tokens and configuration constants */

export const DRIFT_THRESHOLD = 0.0001;
export const MIN_SAMPLES = 50;
export const COOLDOWN_HOURS = 6;

export const CHART_COLORS = {
  primary: '#7C5CFC',
  primaryLight: '#A78BFA',
  success: '#3FB950',
  warning: '#D29922',
  danger: '#F85149',
  drift: '#F97316',
  retrain: '#A78BFA',
  info: '#60A5FA',
  muted: '#5C5C63',
  grid: '#1E1E24',
  tick: '#5C5C63',
} as const;

export const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#1C1C21',
    border: '1px solid #36363E',
    borderRadius: '8px',
    padding: '12px 16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    fontSize: '13px',
  },
  labelStyle: { color: '#EDEDEF', fontWeight: 600 as const, marginBottom: '4px', fontSize: '13px' },
  itemStyle: { color: '#8B8B93', fontSize: '13px', padding: '2px 0' },
  cursor: { stroke: '#7C5CFC', strokeWidth: 1, strokeDasharray: '4 4' },
} as const;

export const AXIS_STYLE = {
  tick: { fill: '#5C5C63', fontSize: 11 },
  axisLine: { stroke: '#26262C' },
  tickLine: { stroke: '#26262C' },
} as const;

export const GRID_STYLE = {
  strokeDasharray: '3 3',
  stroke: '#1E1E24',
  vertical: false,
} as const;

'use client'

import dynamic from 'next/dynamic'
import LoadingSpinner from '../common/LoadingSpinner'

const PieChart = dynamic(() => import('recharts').then((m) => m.PieChart), { ssr: false, loading: () => <LoadingSpinner /> })
const Pie = dynamic(() => import('recharts').then((m) => m.Pie), { ssr: false })
const Cell = dynamic(() => import('recharts').then((m) => m.Cell), { ssr: false })
const Tooltip = dynamic(() => import('recharts').then((m) => m.Tooltip), { ssr: false })
const ResponsiveContainer = dynamic(() => import('recharts').then((m) => m.ResponsiveContainer), { ssr: false, loading: () => <LoadingSpinner /> })

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b']

export default function ModelDistributionChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.5rem' }} labelStyle={{ color: '#f8fafc' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
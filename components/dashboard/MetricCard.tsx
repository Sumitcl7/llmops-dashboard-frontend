import LoadingSpinner from '../common/LoadingSpinner'

interface MetricCardProps {
  title: string
  value: string | number
  subtext: string
  loading?: boolean
  highlight?: 'success' | 'warning' | 'danger'
}

export default function MetricCard({
  title,
  value,
  subtext,
  loading = false,
  highlight = 'success',
}: MetricCardProps) {
  const colors: Record<string, string> = {
    success: 'text-green-400',
    warning: 'text-amber-400',
    danger: 'text-red-400',
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-slate-700 transition-colors">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{title}</h3>
      <div className="flex items-baseline gap-2">
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : (
          <>
            <p className={`text-3xl font-bold ${colors[highlight]}`}>{value}</p>
            <p className="text-xs text-slate-500">{subtext}</p>
          </>
        )}
      </div>
    </div>
  )
}
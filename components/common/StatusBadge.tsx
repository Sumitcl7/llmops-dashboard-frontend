import { ActivityLogEntry } from '@/lib/types'

export default function StatusBadge({ type }: { type: ActivityLogEntry['type'] }) {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    query: { bg: 'bg-blue-900', text: 'text-blue-400', label: 'Q' },
    embed: { bg: 'bg-cyan-900', text: 'text-cyan-400', label: 'E' },
    retrain: { bg: 'bg-purple-900', text: 'text-purple-400', label: 'R' },
    evaluate: { bg: 'bg-green-900', text: 'text-green-400', label: 'D' },
    error: { bg: 'bg-red-900', text: 'text-red-400', label: 'X' },
    info: { bg: 'bg-slate-800', text: 'text-slate-400', label: 'i' },
  }

  const badge = badges[type]

  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold ${badge.bg} ${badge.text}`}>
      {badge.label}
    </span>
  )
}
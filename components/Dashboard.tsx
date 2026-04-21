'use client'
import { DashboardSummary, MetricsData, ActivityLogEntry } from '@/lib/types'
import LoadingSpinner from './common/LoadingSpinner'

interface DashboardProps {
  summary: DashboardSummary | null
  metrics: MetricsData | null
  logs: ActivityLogEntry[]
  loading: boolean
  error: string | null
}

export default function Dashboard({ summary, loading, error }: DashboardProps) {
  if (loading && !summary) {
    return <div className="flex items-center justify-center h-screen"><LoadingSpinner size="lg" /></div>
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-slate-50">LLMOps Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time ML operations monitoring</p>
        </div>
      </header>

      {error && <div className="bg-red-900/20 border-l-4 border-red-500 p-4 mx-4 mt-4 rounded"><p className="text-red-400 text-sm">{error}</p></div>}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">Total Queries</h3>
            <p className="text-3xl font-bold text-green-400">{summary?.totalQueries || 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">Model Split</h3>
            <p className="text-3xl font-bold text-blue-400">{summary?.modelRoutingSplit.modelA || 0}%</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">Images</h3>
            <p className="text-3xl font-bold text-cyan-400">{summary?.imageEmbeddingCount || 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">Drift Score</h3>
            <p className="text-3xl font-bold text-amber-400">{(summary?.latestDriftScore || 0).toFixed(3)}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase mb-3">Retrains</h3>
            <p className="text-3xl font-bold text-purple-400">{summary?.retrainTriggerCount || 0}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
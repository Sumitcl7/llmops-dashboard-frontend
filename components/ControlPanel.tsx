'use client'

import { useState } from 'react'
import { ActivityLogEntry } from '@/lib/types'
import { apiClient } from '@/lib/api'
import Button from './common/Button'
import Toggle from './inputs/Toggle'
import PromptInput from './inputs/PromptInput'
import FileUpload from './inputs/FileUpload'
import LoadingSpinner from './common/LoadingSpinner'

interface ControlPanelProps {
  autoRefresh: boolean
  onAutoRefreshChange: (value: boolean) => void
  onRefresh: () => Promise<void>
  isRefreshing: boolean
  onAddLog: (entry: ActivityLogEntry) => void
}

export default function ControlPanel({
  autoRefresh,
  onAutoRefreshChange,
  onRefresh,
  isRefreshing,
  onAddLog,
}: ControlPanelProps) {
  const [queryLoading, setQueryLoading] = useState(false)
  const [embedLoading, setEmbedLoading] = useState(false)
  const [evaluateLoading, setEvaluateLoading] = useState(false)
  const [retrainLoading, setRetrainLoading] = useState(false)

  const handleQuery = async (prompt: string) => {
    setQueryLoading(true)
    try {
      const response = await apiClient.query(prompt)
      onAddLog({
        id: response.id,
        type: 'query',
        message: `Query: "${prompt.substring(0, 50)}..."`,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      onAddLog({
        id: Date.now().toString(),
        type: 'error',
        message: `Query failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setQueryLoading(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    setEmbedLoading(true)
    try {
      const response = await apiClient.embedImage(file)
      onAddLog({
        id: response.id,
        type: 'embed',
        message: `Image embedded: ${response.fileName}`,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      onAddLog({
        id: Date.now().toString(),
        type: 'error',
        message: `Image embedding failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setEmbedLoading(false)
    }
  }

  const handleVideoUpload = async (file: File) => {
    setEmbedLoading(true)
    try {
      const response = await apiClient.embedVideo(file)
      onAddLog({
        id: response.id,
        type: 'embed',
        message: `Video embedded: ${response.fileName}`,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      onAddLog({
        id: Date.now().toString(),
        type: 'error',
        message: `Video embedding failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setEmbedLoading(false)
    }
  }

  const handleEvaluate = async () => {
    setEvaluateLoading(true)
    try {
      const response = await apiClient.evaluateDrift()
      onAddLog({
        id: Date.now().toString(),
        type: 'evaluate',
        message: `Drift ${response.driftDetected ? 'DETECTED' : 'not detected'} - Score: ${response.driftScore.toFixed(3)}`,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      onAddLog({
        id: Date.now().toString(),
        type: 'error',
        message: `Drift evaluation failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setEvaluateLoading(false)
    }
  }

  const handleRetrain = async () => {
    setRetrainLoading(true)
    try {
      const response = await apiClient.runRetrainCheck()
      onAddLog({
        id: response.jobId,
        type: 'retrain',
        message: `Retrain job queued - Est. ${response.estimatedDuration}s`,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      onAddLog({
        id: Date.now().toString(),
        type: 'error',
        message: `Retrain check failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setRetrainLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" size="sm" onClick={onRefresh} disabled={isRefreshing}>
          {isRefreshing ? <LoadingSpinner size="xs" /> : 'Refresh'}
        </Button>
        <Toggle label="Auto-refresh" checked={autoRefresh} onChange={onAutoRefreshChange} />
      </div>

      <div className="space-y-3">
        <PromptInput onSubmit={handleQuery} loading={queryLoading} />

        <div className="flex gap-3">
          <FileUpload onUpload={handleImageUpload} loading={embedLoading} accept="image/*" label="Upload Image" />
          <FileUpload onUpload={handleVideoUpload} loading={embedLoading} accept="video/*" label="Upload Video" />
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={handleEvaluate} disabled={evaluateLoading}>
            {evaluateLoading ? <LoadingSpinner size="xs" /> : 'Evaluate Drift'}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleRetrain} disabled={retrainLoading}>
            {retrainLoading ? <LoadingSpinner size="xs" /> : 'Run Retrain Check'}
          </Button>
        </div>
      </div>
    </div>
  )
}
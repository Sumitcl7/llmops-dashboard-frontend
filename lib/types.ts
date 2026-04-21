export interface DashboardSummary {
  totalQueries: number;
  totalInteractions: number;
  modelRoutingSplit: { modelA: number; modelB: number };
  imageEmbeddingCount: number;
  latestDriftScore: number;
  retrainTriggerCount: number;
}

export interface QueryResponse {
  id: string;
  query: string;
  response: string;
  model: string;
  timestamp: string;
  confidence?: number;
}

export interface EmbedResponse {
  id: string;
  fileType: 'image' | 'video';
  fileName: string;
  embeddingDimension: number;
  processingTime: number;
  timestamp: string;
}

export interface EvaluateResponse {
  driftDetected: boolean;
  driftScore: number;
  affectedMetrics: string[];
  recommendation: string;
  timestamp: string;
}

export interface RetrainResponse {
  jobId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  startTime: string;
  estimatedDuration: number;
  message: string;
}

export interface MetricsData {
  queryCount: Array<{ time: string; count: number }>;
  modelUsage: Array<{ name: string; value: number }>;
  modalityDistribution: Array<{ type: string; count: number }>;
  driftTrend: Array<{ time: string; score: number }>;
  retrainTimeline: Array<{ time: string; triggered: number; skipped: number }>;
}

export interface ActivityLogEntry {
  id: string;
  type: 'query' | 'embed' | 'retrain' | 'evaluate' | 'error' | 'info';
  message: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

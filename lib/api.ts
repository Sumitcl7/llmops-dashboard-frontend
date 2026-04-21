import { DashboardSummary, MetricsData, QueryResponse, EmbedResponse, EvaluateResponse, RetrainResponse } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';

const RETRY_CONFIG = { MAX_RETRIES: 3, INITIAL_DELAY: 1000, MAX_DELAY: 5000, BACKOFF_MULTIPLIER: 2 };

async function fetchWithRetry(url: string, options: RequestInit = {}, retryCount = 0): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error('HTTP Error');
    return response;
  } catch (error) {
    if (retryCount < RETRY_CONFIG.MAX_RETRIES) {
      const delay = Math.min(
        RETRY_CONFIG.INITIAL_DELAY * Math.pow(RETRY_CONFIG.BACKOFF_MULTIPLIER, retryCount),
        RETRY_CONFIG.MAX_DELAY
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retryCount + 1);
    }
    throw error;
  }
}

export const apiClient = {
  async getSummary(): Promise<DashboardSummary> {
    const response = await fetchWithRetry(`${API_BASE}/dashboard/summary`);
    return response.json();
  },

  async getMetrics(): Promise<MetricsData> {
    const response = await fetchWithRetry(`${API_BASE}/metrics`);
    return response.json();
  },

  async query(prompt: string): Promise<QueryResponse> {
    const response = await fetchWithRetry(`${API_BASE}/query?query=${encodeURIComponent(prompt)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    return response.json();
  },

  async embedImage(file: File): Promise<EmbedResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetchWithRetry(`${API_BASE}/embed-image`, { method: 'POST', body: formData });
    return response.json();
  },

  async embedVideo(file: File): Promise<EmbedResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetchWithRetry(`${API_BASE}/embed-video`, { method: 'POST', body: formData });
    return response.json();
  },

  async evaluateDrift(): Promise<EvaluateResponse> {
    const response = await fetchWithRetry(`${API_BASE}/retrain/evaluate`);
    return response.json();
  },

  async runRetrainCheck(): Promise<RetrainResponse> {
    const response = await fetchWithRetry(`${API_BASE}/retrain/run-now`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    return response.json();
  },
};
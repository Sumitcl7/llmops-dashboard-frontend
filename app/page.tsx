"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Header from "@/components/dashboard/Header";
import KpiCard from "@/components/dashboard/KpiCard";
import ChartCard from "@/components/dashboard/ChartCard";
import DriftScoreChart from "@/components/dashboard/DriftScoreChart";
import QueriesChart from "@/components/dashboard/QueriesChart";
import RetrainTimelineChart from "@/components/dashboard/RetrainTimelineChart";
import ModalityChart from "@/components/dashboard/ModalityChart";
import ModelDistributionChart from "@/components/charts/ModelDistributionChart";
import DriftChecksTable from "@/components/dashboard/DriftChecksTable";
import MediaEmbeddingPanel from "@/components/dashboard/MediaEmbeddingPanel";
import ActivityLog from "@/components/dashboard/ActivityLog";
import { DRIFT_THRESHOLD } from "@/lib/constants";
import { formatDriftScore, formatNumber } from "@/lib/formatters";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

/* ─── API Response Types ─── */

type Summary = {
  total_interactions: number;
  model_usage: Record<string, number>;
  modality_usage: Record<string, number>;
  latest_drift_score: number;
  retrain_trigger_count: number;
};

type Charts = {
  queries_over_time: Record<string, number>;
  model_usage_distribution: Record<string, number>;
  modality_distribution: Record<string, number>;
  drift_over_time: Record<string, number>;
  retrain_timeline: Record<string, { skipped: number; triggered: number }>;
};

/* ─── Main Page ─── */

export default function Page() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [charts, setCharts] = useState<Charts | null>(null);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'loading'>('loading');

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

  const log = useCallback((msg: string) => {
    setLogLines((prev) => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev].slice(0, 30));
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setApiStatus('loading');
      const [s, c] = await Promise.all([
        fetch(`${API}/dashboard/summary`),
        fetch(`${API}/dashboard/charts`),
      ]);
      if (!s.ok) throw new Error(`summary ${s.status}`);
      if (!c.ok) throw new Error(`charts ${c.status}`);

      const sData = await s.json();
      const cData = await c.json();

      setSummary(sData);
      setCharts(cData);
      setApiStatus('connected');
      setLastUpdated(new Date().toISOString());
      log("Dashboard refreshed");
    } catch (e: any) {
      setApiStatus('disconnected');
      log(`Load failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [log]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  /* ─── Existing action handlers (preserved) ─── */

  const sendQuery = async () => {
    if (!query.trim()) { log("Please type a query first"); return; }
    try {
      const res = await fetch(`${API}/query?query=${encodeURIComponent(query)}`, { method: "POST" });
      if (!res.ok) throw new Error(`query ${res.status}`);
      const data = await res.json();
      setQueryResult(data);
      log(`Query sent, routed to: ${data.model}`);
      await loadDashboard();
    } catch (e: any) { log(`Query failed: ${e.message}`); }
  };

  const evaluateDrift = async () => {
    try {
      const res = await fetch(`${API}/retrain/evaluate`);
      if (!res.ok) throw new Error(`retrain/evaluate ${res.status}`);
      const data = await res.json();
      log(`Drift score=${data.drift_score} | trigger=${data.trigger_retrain} | reason=${data.reason}`);
      await loadDashboard();
    } catch (e: any) { log(`Drift evaluate failed: ${e.message}`); }
  };

  const runRetrain = async () => {
    try {
      const res = await fetch(`${API}/retrain/run-now`, { method: "POST" });
      if (!res.ok) throw new Error(`retrain/run-now ${res.status}`);
      const data = await res.json();
      log(`Manual retrain check executed: ${data.message || "ok"}`);
      await loadDashboard();
    } catch (e: any) { log(`Manual retrain failed: ${e.message}`); }
  };

  const executeImageUpload = async () => {
    if (!selectedImage) { log("Please select an image first"); return; }
    try {
      const fd = new FormData();
      fd.append("file", selectedImage);
      const res = await fetch(`${API}/embed-image`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`embed-image ${res.status}`);
      const data = await res.json();
      log(`Image embedded OK | file=${selectedImage.name} | dim=${data.embedding_dim}`);
      setSelectedImage(null);
      await loadDashboard();
    } catch (e: any) { log(`Image execute failed: ${e.message}`); }
  };

  const executeVideoUpload = async () => {
    if (!selectedVideo) { log("Please select a video first"); return; }
    try {
      const fd = new FormData();
      fd.append("file", selectedVideo);
      const res = await fetch(`${API}/embed-video`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`embed-video ${res.status}`);
      const data = await res.json();
      log(`Video embedded OK | file=${selectedVideo.name} | dim=${data.embedding_dim}`);
      setSelectedVideo(null);
      await loadDashboard();
    } catch (e: any) { log(`Video execute failed: ${e.message}`); }
  };

  /* ─── Derived chart data ─── */

  const queriesData = useMemo(
    () => Object.entries(charts?.queries_over_time || {}).map(([date, value]) => ({ date, value })),
    [charts]
  );

  const modelData = useMemo(
    () => Object.entries(charts?.model_usage_distribution || {}).map(([name, value]) => ({ name, value })),
    [charts]
  );

  const modalityData = useMemo(
    () => Object.entries(charts?.modality_distribution || {}).map(([name, value]) => ({ name, value })),
    [charts]
  );

  const driftData = useMemo(
    () => Object.entries(charts?.drift_over_time || {}).map(([date, value]) => ({ date, value })),
    [charts]
  );

  const retrainData = useMemo(
    () =>
      Object.entries(charts?.retrain_timeline || {}).map(([date, v]) => ({
        date,
        skipped: v.skipped,
        triggered: v.triggered,
      })),
    [charts]
  );

  /* ─── Computed KPI values ─── */

  const driftScore = summary?.latest_drift_score ?? 0;
  const delta = driftScore - DRIFT_THRESHOLD;
  const totalModels = Object.keys(summary?.model_usage || {}).length;
  const totalRetrains = summary?.retrain_trigger_count ?? 0;
  const totalInteractions = summary?.total_interactions ?? 0;
  const imageCount = summary?.modality_usage?.image ?? 0;
  const videoCount = summary?.modality_usage?.video ?? 0;

  const driftStatus: 'healthy' | 'warning' | 'drift' =
    driftScore > DRIFT_THRESHOLD ? 'drift' :
    driftScore > DRIFT_THRESHOLD * 0.8 ? 'warning' : 'healthy';

  // Previous drift score for trend
  const prevDriftScore = driftData.length >= 2 ? driftData[driftData.length - 2]?.value : undefined;
  const driftTrend = prevDriftScore !== undefined
    ? { value: driftScore - prevDriftScore, label: 'vs previous' }
    : undefined;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* ─── Header ─── */}
      <Header
        lastUpdated={lastUpdated}
        apiStatus={apiStatus}
        onRefresh={loadDashboard}
        isRefreshing={loading}
      />

      {/* ─── Dashboard Content ─── */}
      <div className="dashboard-grid" style={{ paddingTop: '24px' }}>

        {/* ═══ Section: KPI Overview ═══ */}
        <section aria-label="Key metrics">
          <div className="section-header">
            <h2 className="text-section-title" style={{ color: 'var(--text-secondary)' }}>Overview</h2>
            <span className="text-caption">{totalInteractions} total interactions</span>
          </div>

          <div className="kpi-row">
            <KpiCard
              title="Drift Score"
              value={formatDriftScore(driftScore)}
              subtitle={`Threshold: ${DRIFT_THRESHOLD}`}
              status={driftStatus}
              trend={driftTrend}
              tooltip="Current drift score from latest evaluation. Values above threshold trigger retrain."
              loading={loading && !summary}
            />
            <KpiCard
              title="Threshold"
              value={DRIFT_THRESHOLD.toFixed(4)}
              subtitle="Configured limit"
              status="info"
              tooltip="Drift threshold from DRIFT_THRESHOLD config. Scores above this trigger retraining."
              loading={loading && !summary}
            />
            <KpiCard
              title="Threshold Delta"
              value={`${delta > 0 ? '+' : ''}${delta.toFixed(4)}`}
              subtitle={delta > 0 ? 'Above threshold' : 'Below threshold'}
              status={delta > 0 ? 'drift' : 'healthy'}
              tooltip="Difference between current drift score and threshold. Positive = above threshold."
              loading={loading && !summary}
            />
            <KpiCard
              title="Total Interactions"
              value={formatNumber(totalInteractions)}
              subtitle={`${imageCount} images · ${videoCount} videos`}
              status="info"
              tooltip="Total queries, embeddings, and interactions processed."
              loading={loading && !summary}
            />
            <KpiCard
              title="Retrain Count"
              value={totalRetrains}
              subtitle="Total triggered"
              status={totalRetrains > 0 ? 'retrain' : 'healthy'}
              tooltip="Number of retrain events triggered by drift detection."
              loading={loading && !summary}
            />
            <KpiCard
              title="Active Models"
              value={totalModels}
              subtitle={Object.keys(summary?.model_usage || {}).join(', ') || '—'}
              status="info"
              tooltip="Number of distinct models currently in use."
              loading={loading && !summary}
            />
            <KpiCard
              title="API Health"
              value={apiStatus === 'connected' ? 'Online' : apiStatus === 'loading' ? '…' : 'Offline'}
              subtitle={lastUpdated ? `Synced ${new Date(lastUpdated).toLocaleTimeString()}` : 'Not synced'}
              status={apiStatus === 'connected' ? 'healthy' : apiStatus === 'loading' ? 'warning' : 'error'}
              tooltip="Backend API connection status."
              loading={false}
            />
            <KpiCard
              title="Cooldown"
              value={`${6}h`}
              subtitle="Between retrains"
              status="info"
              tooltip="COOLDOWN_HOURS: minimum time between consecutive retrain triggers."
              loading={false}
            />
          </div>
        </section>

        {/* ═══ Section: Drift Analytics ═══ */}
        <section aria-label="Drift analytics">
          <div className="section-header">
            <h2 className="text-section-title" style={{ color: 'var(--text-secondary)' }}>Drift Analytics</h2>
          </div>

          <div className="chart-row">
            <ChartCard
              title="Drift Score Over Time"
              subtitle="Score vs. threshold with retrain markers"
              loading={loading && !charts}
              empty={driftData.length === 0}
              emptyMessage="No drift data recorded"
              height={300}
            >
              <DriftScoreChart data={driftData} />
            </ChartCard>

            <ChartCard
              title="Queries Over Time"
              subtitle="Daily query volume"
              loading={loading && !charts}
              empty={queriesData.length === 0}
              emptyMessage="No query data recorded"
              height={300}
            >
              <QueriesChart data={queriesData} />
            </ChartCard>
          </div>
        </section>

        {/* ═══ Section: Retrain & Distribution ═══ */}
        <section aria-label="Retrain activity and model distribution">
          <div className="section-header">
            <h2 className="text-section-title" style={{ color: 'var(--text-secondary)' }}>Retrain Activity & Distribution</h2>
          </div>

          <div className="chart-row">
            <ChartCard
              title="Retrain Events Timeline"
              subtitle="Triggered vs. skipped retrain checks"
              loading={loading && !charts}
              empty={retrainData.length === 0}
              emptyMessage="No retrain events recorded"
              height={300}
            >
              <RetrainTimelineChart data={retrainData} />
            </ChartCard>

            <ChartCard
              title="Modality Distribution"
              subtitle="Usage breakdown by input type"
              loading={loading && !charts}
              empty={modalityData.length === 0}
              emptyMessage="No modality data recorded"
              height={300}
            >
              <ModalityChart data={modalityData} />
            </ChartCard>

            <ChartCard
              title="Model Usage Distribution"
              subtitle="Request share by model"
              loading={loading && !charts}
              empty={modelData.length === 0}
              emptyMessage="No model usage data recorded"
              height={300}
            >
              <ModelDistributionChart data={modelData} />
            </ChartCard>
          </div>
        </section>

        {/* ═══ Section: Drift Checks Table ═══ */}
        <section aria-label="Recent drift checks">
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="text-section-title">Recent Drift Checks</h3>
                <p className="text-caption" style={{ marginTop: '2px' }}>Sortable table of all drift evaluations with numeric scores</p>
              </div>
              <span className="badge badge-muted">{driftData.length} records</span>
            </div>
            <DriftChecksTable
              driftData={driftData}
              retrainData={retrainData}
              loading={loading && !charts}
            />
          </div>
        </section>

        {/* ═══ Section: Media Embedding ═══ */}
        <section aria-label="Media embedding">
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="text-section-title">Media Embedding</h3>
                <p className="text-caption" style={{ marginTop: '2px' }}>Upload images or videos to generate vector embeddings</p>
              </div>
              <span className="badge badge-blue">
                {(summary?.modality_usage?.image ?? 0) + (summary?.modality_usage?.video ?? 0)} embedded
              </span>
            </div>
            <MediaEmbeddingPanel
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              onExecuteImage={executeImageUpload}
              selectedVideo={selectedVideo}
              setSelectedVideo={setSelectedVideo}
              onExecuteVideo={executeVideoUpload}
            />
          </div>
        </section>

        {/* ═══ Section: Query Model + Drift Actions ═══ */}
        <section aria-label="Query and actions">
          <div className="chart-row">
            {/* Query Model */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="text-section-title">Query Model</h3>
                  <p className="text-caption" style={{ marginTop: '2px' }}>Send a text query to the LLM router</p>
                </div>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    className="input"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Type a query to send to the model…"
                    onKeyDown={e => e.key === 'Enter' && sendQuery()}
                    aria-label="Query input"
                  />
                  <button className="btn btn-primary" onClick={sendQuery}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Send
                  </button>
                </div>
                {queryResult && (
                  <pre style={{
                    marginTop: '12px', padding: '12px 16px',
                    background: 'var(--bg-primary)', border: '1px solid var(--border-default)',
                    borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--text-secondary)',
                    overflowX: 'auto', fontFamily: "'SF Mono','Cascadia Code','Consolas',monospace",
                    maxHeight: '180px',
                  }}>
                    {JSON.stringify(queryResult, null, 2)}
                  </pre>
                )}
              </div>
            </div>

            {/* Drift Actions */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="text-section-title">Drift Actions</h3>
                  <p className="text-caption" style={{ marginTop: '2px' }}>Evaluate drift or trigger a retrain check</p>
                </div>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={evaluateDrift} style={{ justifyContent: 'flex-start' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  Evaluate Drift Score
                </button>
                <button className="btn btn-secondary" onClick={runRetrain} style={{ justifyContent: 'flex-start' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6" /><path d="M2.5 22v-6h6" />
                    <path d="M3.34 8A9.96 9.96 0 0112 2c3.17 0 5.97 1.47 7.8 3.77L21.5 8" />
                    <path d="M20.66 16A9.96 9.96 0 0112 22c-3.17 0-5.97-1.47-7.8-3.77L2.5 16" />
                  </svg>
                  Run Retrain Check
                </button>
                <p className="text-caption" style={{ marginTop: '4px' }}>
                  Drift evaluation compares recent embeddings against baseline. Retrain check runs the full pipeline if drift exceeds threshold.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Section: Activity Log ═══ */}
        <section aria-label="Activity log">
          <div className="card">
            <div className="card-header">
              <div>
                <h3 className="text-section-title">System Activity Log</h3>
                <p className="text-caption" style={{ marginTop: '2px' }}>Real-time event stream</p>
              </div>
              <span className="badge badge-muted">{logLines.length} events</span>
            </div>
            <ActivityLog logLines={logLines} loading={loading} />
          </div>
        </section>
      </div>
    </div>
  );
}
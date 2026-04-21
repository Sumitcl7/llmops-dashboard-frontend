"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"];

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

export default function Page() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [charts, setCharts] = useState<Charts | null>(null);
  const [query, setQuery] = useState("");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // explicit select + execute states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

  const log = (msg: string) => {
    setLogLines((prev) => [`${new Date().toLocaleTimeString()} - ${msg}`, ...prev].slice(0, 20));
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
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
      log("Dashboard refreshed");
    } catch (e: any) {
      log(`Load failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const sendQuery = async () => {
    if (!query.trim()) {
      log("Please type a query first");
      return;
    }

    try {
      const res = await fetch(`${API}/query?query=${encodeURIComponent(query)}`, { method: "POST" });
      if (!res.ok) throw new Error(`query ${res.status}`);
      const data = await res.json();

      setQueryResult(data);
      log(`Query sent, routed to: ${data.model}`);
      await loadDashboard();
    } catch (e: any) {
      log(`Query failed: ${e.message}`);
    }
  };

  const evaluateDrift = async () => {
    try {
      const res = await fetch(`${API}/retrain/evaluate`);
      if (!res.ok) throw new Error(`retrain/evaluate ${res.status}`);
      const data = await res.json();

      log(`Drift score=${data.drift_score} | trigger=${data.trigger_retrain} | reason=${data.reason}`);
      await loadDashboard();
    } catch (e: any) {
      log(`Drift evaluate failed: ${e.message}`);
    }
  };

  const runRetrain = async () => {
    try {
      const res = await fetch(`${API}/retrain/run-now`, { method: "POST" });
      if (!res.ok) throw new Error(`retrain/run-now ${res.status}`);
      const data = await res.json();

      log(`Manual retrain check executed: ${data.message || "ok"}`);
      await loadDashboard();
    } catch (e: any) {
      log(`Manual retrain failed: ${e.message}`);
    }
  };

  const executeImageUpload = async () => {
    if (!selectedImage) {
      log("Please select an image first");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("file", selectedImage);

      const res = await fetch(`${API}/embed-image`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`embed-image ${res.status}`);

      const data = await res.json();
      log(`Image embedded OK | file=${selectedImage.name} | dim=${data.embedding_dim}`);

      setSelectedImage(null);
      await loadDashboard();
    } catch (e: any) {
      log(`Image execute failed: ${e.message}`);
    }
  };

  const executeVideoUpload = async () => {
    if (!selectedVideo) {
      log("Please select a video first");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("file", selectedVideo);

      const res = await fetch(`${API}/embed-video`, { method: "POST", body: fd });
      if (!res.ok) throw new Error(`embed-video ${res.status}`);

      const data = await res.json();
      log(`Video embedded OK | file=${selectedVideo.name} | dim=${data.embedding_dim}`);

      setSelectedVideo(null);
      await loadDashboard();
    } catch (e: any) {
      log(`Video execute failed: ${e.message}`);
    }
  };

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

  return (
    <main style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Dashboard</h1>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <button onClick={loadDashboard}>Refresh</button>
        <button onClick={evaluateDrift}>Evaluate Drift</button>
        <button onClick={runRetrain}>Run Retrain Check</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
        <div style={{ background: "#111", padding: 12, borderRadius: 8 }}>Total: {summary?.total_interactions ?? 0}</div>
        <div style={{ background: "#111", padding: 12, borderRadius: 8 }}>Models: {Object.keys(summary?.model_usage || {}).length}</div>
        <div style={{ background: "#111", padding: 12, borderRadius: 8 }}>Image: {summary?.modality_usage?.image ?? 0}</div>
        <div style={{ background: "#111", padding: 12, borderRadius: 8 }}>Drift: {(summary?.latest_drift_score ?? 0).toFixed(4)}</div>
        <div style={{ background: "#111", padding: 12, borderRadius: 8 }}>Retrains: {summary?.retrain_trigger_count ?? 0}</div>
      </div>

      <div style={{ background: "#111", padding: 12, marginBottom: 20, borderRadius: 8 }}>
        <h3>User Input</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type query..."
            style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #333", background: "#0f0f0f", color: "#fff" }}
          />
          <button onClick={sendQuery}>Send</button>
        </div>
        {queryResult && (
          <pre style={{ marginTop: 10, background: "#000", padding: 10, borderRadius: 6, overflowX: "auto" }}>
            {JSON.stringify(queryResult, null, 2)}
          </pre>
        )}
      </div>

      <div style={{ background: "#111", padding: 12, marginBottom: 20, borderRadius: 8 }}>
        <h3>Uploads (Select + Execute)</h3>

        <div style={{ marginBottom: 12 }}>
          <div style={{ marginBottom: 6 }}>Image</div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
          />
          <button style={{ marginLeft: 8 }} onClick={executeImageUpload}>Execute Image</button>
          <div style={{ fontSize: 12, marginTop: 4, color: "#aaa" }}>
            {selectedImage ? `Selected: ${selectedImage.name}` : "No image selected"}
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 6 }}>Video</div>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setSelectedVideo(e.target.files?.[0] || null)}
          />
          <button style={{ marginLeft: 8 }} onClick={executeVideoUpload}>Execute Video</button>
          <div style={{ fontSize: 12, marginTop: 4, color: "#aaa" }}>
            {selectedVideo ? `Selected: ${selectedVideo.name}` : "No video selected"}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: "#111", padding: 12, borderRadius: 8, overflowX: "auto" }}>
          <h3>Queries Over Time</h3>
          <LineChart width={500} height={250} data={queriesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </div>

        <div style={{ background: "#111", padding: 12, borderRadius: 8, overflowX: "auto" }}>
          <h3>Model Usage</h3>
          <PieChart width={500} height={250}>
            <Pie data={modelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {modelData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div style={{ background: "#111", padding: 12, borderRadius: 8, overflowX: "auto" }}>
          <h3>Modality Distribution</h3>
          <BarChart width={500} height={250} data={modalityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </div>

        <div style={{ background: "#111", padding: 12, borderRadius: 8, overflowX: "auto" }}>
          <h3>Drift Trend</h3>
          <LineChart width={500} height={250} data={driftData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#00C49F" />
          </LineChart>
        </div>
      </div>

      <div style={{ background: "#111", padding: 12, marginTop: 16, borderRadius: 8, overflowX: "auto" }}>
        <h3>Retrain Timeline</h3>
        <BarChart width={1040} height={280} data={retrainData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="skipped" fill="#ffc658" />
          <Bar dataKey="triggered" fill="#ff8042" />
        </BarChart>
      </div>

      <div style={{ background: "#111", padding: 12, marginTop: 16, borderRadius: 8 }}>
        <h3>Activity Log</h3>
        <div style={{ maxHeight: 220, overflow: "auto", fontSize: 13, color: "#ddd" }}>
          {loading && <div>Loading...</div>}
          {logLines.length === 0 ? <div>No activity yet.</div> : logLines.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </main>
  );
}
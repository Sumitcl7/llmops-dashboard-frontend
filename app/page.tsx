"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./landing.css";

/* ─── SVG Icon Components ─── */

function DriftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function RetrainIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.5 2v6h-6" /><path d="M2.5 22v-6h6" />
      <path d="M3.34 8A9.96 9.96 0 0112 2c3.17 0 5.97 1.47 7.8 3.77L21.5 8" />
      <path d="M20.66 16A9.96 9.96 0 0112 22c-3.17 0-5.97-1.47-7.8-3.77L2.5 16" />
    </svg>
  );
}

function MultiModelIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function MediaIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" /><line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

/* ─── Features Data ─── */

const features = [
  {
    icon: <DriftIcon />,
    title: "Drift Detection",
    desc: "Continuously monitor embedding drift with configurable thresholds. Get real-time alerts when your model starts degrading.",
  },
  {
    icon: <RetrainIcon />,
    title: "Auto-Retrain Pipeline",
    desc: "Automated retraining triggers with cooldown management. Never miss a drift event, never waste compute on premature retrains.",
  },
  {
    icon: <MultiModelIcon />,
    title: "Multi-Model Routing",
    desc: "Intelligent query routing across multiple LLM providers. Track usage distribution and optimize costs across models.",
  },
  {
    icon: <MediaIcon />,
    title: "Multimodal Embeddings",
    desc: "Generate and track vector embeddings for text, images, and video. Full modality distribution analytics included.",
  },
  {
    icon: <ChartIcon />,
    title: "Real-time Analytics",
    desc: "Interactive dashboards with live charts for drift scores, query volume, retrain events, and model usage distribution.",
  },
  {
    icon: <ShieldIcon />,
    title: "Production Ready",
    desc: "Built for production ML pipelines with FastAPI backend, health monitoring, and comprehensive activity logging.",
  },
];

/* ─── Main Landing Page ─── */

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* ─── Navbar ─── */}
      <nav className={`landing-nav ${scrolled ? "scrolled" : ""}`} id="landing-nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            DriftSentry
          </Link>
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="https://github.com/Sumitcl7/drift-aware-llmops" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li>
              <Link href="/dashboard" className="nav-cta">
                Open Dashboard →
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="hero-section" id="hero">
        <div className="hero-bg">
          <div className="hero-glow-1" />
          <div className="hero-glow-2" />
          <div className="hero-glow-3" />
          <div className="hero-grid" />
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Drift-Aware MLOps Platform
          </div>

          <h1 className="hero-title">
            Monitor, Detect &<br />
            <span className="gradient-text">Auto-Retrain</span> Your LLMs
          </h1>

          <p className="hero-subtitle">
            An end-to-end MLOps platform that continuously monitors model drift,
            triggers intelligent retraining, and provides real-time analytics
            across your entire LLM pipeline.
          </p>

          <div className="hero-actions">
            <Link href="/dashboard" className="btn-hero-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
              Open Dashboard
            </Link>
            <a
              href="https://github.com/Sumitcl7/drift-aware-llmops"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-secondary"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">6+</div>
              <div className="hero-stat-label">Monitoring Metrics</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">3</div>
              <div className="hero-stat-label">Modalities Supported</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">Real-time</div>
              <div className="hero-stat-label">Drift Detection</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">Auto</div>
              <div className="hero-stat-label">Retrain Pipeline</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="features-section" id="features">
        <div className="features-inner">
          <div className="section-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
            Core Capabilities
          </div>
          <h2 className="section-title">
            Everything you need for<br />production LLM operations
          </h2>
          <p className="section-subtitle">
            Built for ML engineers who need robust monitoring, automated retraining,
            and real-time insights into their LLM pipelines.
          </p>

          <div className="features-grid">
            {features.map((f, i) => (
              <div className="glass-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="glass-card-icon">{f.icon}</div>
                <h3 className="glass-card-title">{f.title}</h3>
                <p className="glass-card-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="how-section" id="how-it-works">
        <div className="how-inner">
          <div className="section-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            Getting Started
          </div>
          <h2 className="section-title">Up and running in minutes</h2>
          <p className="section-subtitle">
            Three simple steps to deploy drift-aware monitoring for your LLM pipeline.
          </p>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 className="step-title">Start the Backend</h3>
              <p className="step-desc">
                Launch the FastAPI server that handles drift evaluation, model routing, and embedding generation.
              </p>
              <div className="step-code">$ uvicorn main:app --reload</div>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3 className="step-title">Launch the Dashboard</h3>
              <p className="step-desc">
                Start the Next.js dashboard to visualize drift scores, query volumes, and retrain events in real-time.
              </p>
              <div className="step-code">$ npm run dev</div>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3 className="step-title">Monitor & Retrain</h3>
              <p className="step-desc">
                Send queries, upload media, and let the system automatically detect drift and trigger retraining when needed.
              </p>
              <div className="step-code">POST /query?query=&quot;your prompt&quot;</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="cta-inner">
          <h2 className="cta-title">
            Ready to take control of your<br />
            <span className="gradient-text">LLM pipeline?</span>
          </h2>
          <p className="cta-subtitle">
            Start monitoring drift, automate retraining, and gain full visibility
            into your production ML systems.
          </p>
          <div className="hero-actions">
            <Link href="/dashboard" className="btn-hero-primary">
              Go to Dashboard →
            </Link>
            <a
              href="https://github.com/Sumitcl7/drift-aware-llmops"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-secondary"
            >
              Star on GitHub ⭐
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="footer-copy">© 2026 LLMOps Dashboard — Drift-Aware Monitoring Platform</span>
          <ul className="footer-links">
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li><a href="https://github.com/Sumitcl7/drift-aware-llmops" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            <li><a href="#features">Features</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
}
# Drift-Aware LLMOps Dashboard

Production-grade ML Operations dashboard for monitoring model drift, managing retraining lifecycle, and tracking system health. Next.js dashboard for monitoring and controlling the Drift-Aware LLMOps backend.

## Tech Stack

| Layer     | Technology                              |
| --------- | --------------------------------------- |
| Frontend  | Next.js 16, React 19, TypeScript        |
| Styling   | Tailwind CSS v4 + Custom CSS Variables  |
| Charts    | Recharts 3                              |
| Backend   | FastAPI (EC2 + Uvicorn + Nginx)         |
| Data      | Supabase                                |
| Hosting   | AWS Amplify (Frontend)                  |

## Features
- Text/image/video interaction UI
- Dashboard KPI cards + complex charts
- Drift evaluation trigger
- Manual retrain check trigger
- Activity log for real-time monitoring

## Dashboard Structure

### Header
Sticky top navigation bar with:
- **Environment badge** — Shows DEV or PROD
- **API connection status** — Live pulse indicator (green/amber/red)
- **Last updated timestamp** — Relative time since last data sync
- **Refresh button** — Manual data refresh trigger

### KPI Overview (8 cards)
Each card shows a prominent numeric value with contextual metadata.

### Drift Analytics & Distribution Charts
- **Drift Score Over Time**: Score vs. threshold with retrain markers
- **Queries Over Time**: Daily query volume
- **Retrain Events Timeline**: Triggered vs. skipped retrain checks
- **Modality Distribution**: Usage breakdown by input type
- **Model Usage Distribution**: Request share by model

### Recent Drift Checks (Table)
Sortable, paginated table showing timestamps, scores, thresholds, deltas, and decisions.

### User Controls (Tabbed)
Three-tab interface for querying models, uploading media for embedding, and executing drift actions.

## 1. Setup (Local)

### Clone
```bash
git clone https://github.com/Sumitcl7/llmops-dashboard-frontend.git
cd llmops-dashboard-frontend
```

### Install dependencies
```bash
npm install
```

### Environment variables
Create `.env.local` from `.env.local.example`:

```bash
# Windows PowerShell
Copy-Item .env.local.example .env.local
# Linux/macOS
cp .env.local.example .env.local
```

Set:
```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

## 2. Run Frontend

```bash
npm run dev
```

Open `http://localhost:3000`

## 3. Build for Production

```bash
npm run build
npm start
```

## 4. Deployment Options

Configure `NEXT_PUBLIC_API_BASE` in `.env.local` or environment settings to point to your FastAPI backend.

### Option A: Vercel (fastest)
- Import GitHub repo
- Add env var: `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-domain>`
- Deploy

### Option B: AWS Amplify
- Connect GitHub repo
- Add same env var
- Build + host

## Screenshots

> _Screenshots will be added after deployment._

| Section               | Description                                  |
| --------------------- | -------------------------------------------- |
| `screenshot-header`   | Header with status indicator and env badge   |
| `screenshot-kpis`     | KPI overview cards with numeric values       |
| `screenshot-charts`   | Drift and query charts with axis labels      |
| `screenshot-table`    | Drift checks table with sorting              |
| `screenshot-controls` | Tabbed user controls panel                   |
| `screenshot-log`      | Activity log with color-coded events         |

## License
For academic/demo use.

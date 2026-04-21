# LLMOps Dashboard Frontend (Next.js)

Next.js dashboard for monitoring and controlling the Drift-Aware LLMOps backend.

Features:
- text/image/video interaction UI
- dashboard cards + charts
- drift evaluation trigger
- manual retrain check trigger
- activity log

## Tech Stack
- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Recharts

---

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

---

## 2. Run Frontend

```bash
npm run dev
```

Open:
`http://localhost:3000`

---

## 3. Backend Connection

Frontend expects backend at:
`NEXT_PUBLIC_API_BASE_URL`

Make sure backend is running and `/health` returns 200.

---

## 4. Build for Production

```bash
npm run build
npm start
```

---

## 5. Deployment Options

### Option A: Vercel (fastest)
- Import GitHub repo
- Add env var:
  - `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-domain>`
- Deploy

### Option B: AWS Amplify
- Connect GitHub repo
- Add same env var
- Build + host

---

## Notes

- Do not commit `.env.local`
- Ensure backend CORS allows frontend domain in production.
- If dashboard shows stale values, hard refresh (`Ctrl+F5`).

---

## License
For academic/demo use.

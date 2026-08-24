# SENTINEL — Telco KPI Monitoring & Anomaly Detection

Web dashboard for early anomaly detection on telecommunication KPIs, comparing
two detection methods on the same data: **Z-Score** (univariate) and
**Isolation Forest** (multivariate).

This repository holds the **Next.js frontend**. It talks to a NestJS gateway,
which owns PostgreSQL access and orchestrates a Python/FastAPI ML service.

---

## Purpose

Network operations teams see KPI degradations late, because a value that looks
acceptable on its own can still be anomalous in context. SENTINEL makes both
views available side by side:

- per-KPI statistical deviation (Z-Score), and
- cross-KPI behavioural deviation (Isolation Forest),

so an operator can see **what** moved, **when** it moved (to the 5-minute
interval, in WIB), and **whether both methods agree**.

---

## Features

| Area | What it does |
| --- | --- |
| **Dashboard** | KPI catalogue size, healthy vs. critical KPI counts for the reference day, and a KPI trend chart with 24h / 7d / 30d ranges. |
| **KPI Monitoring** | Per-KPI comparison chart (today vs. the same weekday last week) at 5-minute resolution, with anomaly markers on the chart. |
| **Anomaly details** | One modal for both methods: timestamp, detected value, baseline, z-score vs. threshold, Isolation Forest score, severity, and source. |
| **Method agreement** | A timestamp flagged by both detectors renders once, labelled "Both methods", instead of as duplicate rows. |
| **Auto-refresh** | KPI Monitoring re-polls the gateway every 5 minutes without a page reload, preserving filters. |
| **Timezone** | All dashboard time logic is Asia/Jakarta (WIB, UTC+7) — never the browser's timezone. |
| **Theming** | Light and dark mode, one design-token file, no flash of the wrong theme on load. |

---

## Tech stack

**Frontend** Next.js 14 (App Router) · React 18 · TypeScript (strict) ·
Tailwind CSS · Apache ECharts · React Hook Form + Zod · lucide-react

**Backend** NestJS 10 · Prisma · PostgreSQL

**ML** Python · FastAPI · scikit-learn · pandas · NumPy

---

## Architecture

```
Browser
  │
  ▼
Next.js (this repo)          UI, state, chart configuration
  │  REST, { success, data } envelope
  ▼
NestJS gateway               validation, PostgreSQL access, ML orchestration
  ├────────────► PostgreSQL  kpis, kpi_metrics (5-minute readings)
  └────────────► FastAPI     Z-Score / Isolation Forest execution
```

Two rules shape the whole system:

1. **Next.js never touches PostgreSQL.** Every figure on screen comes from the
   gateway.
2. **Python never touches PostgreSQL.** The gateway reads the data and passes it
   to the ML service in the request body, which keeps detection runs
   reproducible.

Endpoints the frontend uses:

| Endpoint | Used by |
| --- | --- |
| `GET /dashboard/overview?range=&kpi=` | Dashboard: KPI health counts + trend series |
| `GET /kpi-monitoring/overview?kpis=&date=` | KPI Monitoring: today vs. last week series + both detectors' anomalies |

Both are aggregate reads: one request per page state, no per-card fan-out.

---

## KPI monitoring

- Ten telco KPIs (throughput, latency, packet loss, availability, jitter, PRB
  utilization, active users, RRC success rate, handover success rate, call drop
  rate) sampled every 5 minutes.
- Each chart draws **today** (solid) against **the same weekday one week ago**
  (dashed) over a shared 288-slot axis, distinguished by colour *and* line
  style so both modes and colour-vision differences stay readable.
- Today's line stops at the latest available reading; a dashed marker labels
  that point, and last week's line always spans the full 24 hours.
- Missing 5-minute intervals stay gaps — no interpolation, no invented values.

## Z-Score anomaly detection

Univariate. For the selected day, each KPI's readings are standardised and any
point whose |z| exceeds the configured threshold (default **3.0σ**) is flagged.
The modal shows the actual value, the mean baseline, the z-score, and the
threshold it crossed. Every KPI chart carries its own Z-Score alert button.

## Isolation Forest anomaly detection

Multivariate — it needs **two or more selected KPIs**. All selected KPIs are
treated as features of one observation per timestamp, and the model isolates
rows that are collectively unusual even when no single KPI breaches its own
threshold. The summary card reports the day's anomaly count and opens the
detail list, grouped by the KPI that drove each detection, with the anomaly
score and contamination shown. `random_state` is fixed, so runs are repeatable.

---

## Screenshots

<!-- Add images to Sentinel/public/screenshots/ and reference them here. -->

| Dashboard | KPI Monitoring | Anomaly details |
| --- | --- | --- |
| _screenshot pending_ | _screenshot pending_ | _screenshot pending_ |

---

## Local development

The frontend needs the gateway (and therefore PostgreSQL and the ML service)
running. Start them bottom-up:

```bash
# 1. PostgreSQL — create a database, then in nest-gateway/
cp .env.example .env
npm install
npm run prisma:deploy      # apply migrations
npm run prisma:seed        # deterministic 31-day KPI dataset

# 2. ML service — in ml-service/
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --port 8000

# 3. Gateway — in nest-gateway/
npm run start:dev          # http://localhost:3001

# 4. Frontend — in Sentinel/
cp .env.local.example .env.local
npm install
npm run dev                # http://localhost:3000
```

Visit `/login` (any email + an 8-character password — see *Authentication*
below), then `/dashboard`.

Checks:

```bash
npm run build              # frontend: type-check + production build
cd ../nest-gateway && npm run lint && npm test
cd ../ml-service && pytest -q
```

### Environment variables

**Sentinel (`.env.local`)**

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3001` | NestJS gateway base URL |

**Gateway (`nest-gateway/.env`)** — `DATABASE_URL`, `ML_SERVICE_URL`, `PORT`,
`AUTH_TOKEN_SECRET`, plus pagination/timeout tuning; see
`nest-gateway/.env.example`.

**ML service (`ml-service/.env`)** — `ZSCORE_THRESHOLD` (3.0),
`ISOLATION_FOREST_CONTAMINATION` (0.05), `ISOLATION_FOREST_RANDOM_STATE` (42);
see `ml-service/.env.example`.

---

## Project structure

```
src/
├── app/                        App Router routes (login, dashboard, kpi-monitoring)
├── features/
│   ├── auth/                   login form, schema, service
│   ├── dashboard/              shell (sidebar/topbar), stat cards, KPI trend chart
│   └── kpi-monitoring/         comparison charts, filters, anomaly modal, polling hook
├── components/
│   ├── atoms/                  Button, Input, Card, Badge, Typography, …
│   ├── molecules/              EChart, Modal, DateRangePicker, ThemeToggle, …
│   └── templates/              AuthTemplate, DashboardTemplate (app shell)
├── lib/                        api-client, ThemeProvider, WIB formatting
├── hooks/                      useTheme
├── utils/                      cn()
└── styles/variables.css        all design tokens, light + dark
```

Conventions: feature-based + Atomic Design. Reusable UI lives in
`components/` and knows nothing about domain logic; anything feature-specific
lives in that feature's folder. Charts render through the single `EChart`
molecule — the only file importing `echarts` — and chart config is built by
pure functions in `chart-options.service.ts`. Tailwind classes resolve to CSS
variables in `variables.css`, so theming happens in one file.

### Authentication (mocked)

`features/auth/services/auth.service.ts` still resolves a mocked login: any
Zod-valid submission routes to `/dashboard`, and the signed-in identity shown
in the top bar is local. The gateway's `/auth` and `/users/me` endpoints exist
but are not wired to the UI yet.

---

## Research context

This dashboard is the artefact of an undergraduate thesis:

> *Analisis Perbandingan Metode Isolation Forest dan Z-Score untuk Deteksi Dini
> Anomali pada Dashboard Monitoring KPI Telco Berbasis Web*

The methodology is fixed: **Z-Score = univariate**, **Isolation Forest =
multivariate**. Both run over identical inputs so their results are directly
comparable, and reproducibility is a requirement rather than a nice-to-have —
the seeded dataset is anchored to a fixed 31-day window, the RNG and
`random_state` are seeded, and detection parameters are configuration, not
code. Results produced here are intended to be usable as thesis evidence.

Architecture and API contracts are documented in `../DOCUMENTATION.md`.

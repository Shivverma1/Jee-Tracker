# 🎓 JEE Study Tracker

A full-stack web app that helps JEE aspirants track study progress, discover and
save YouTube lectures, manage chapter checklists, take revision notes, and stay
on top of their daily goals — with a built-in Pomodoro timer and exam countdown.

> **Works out of the box** — without any API keys the app runs in **mock mode**
> (placeholder videos + an in-memory database), so you can explore everything
> immediately. Add keys to go live.

---

## ✨ Features

| Module | What it does |
| --- | --- |
| **Subject Dashboard** | Physics / Chemistry / Maths progress bars, chapter completion %, daily goal tracker |
| **Video Search & Save** | Search JEE videos on YouTube, filter by subject, save to a playlist, mark watched, rate 1–5★ |
| **Top Channels Tracker** | Physics Wallah, Vedantu, Unacademy, Khan Sir, Etoos — subscriber counts, latest & most-viewed videos |
| **Study Stats** | Hours today, weekly streak, topics covered, subject-wise pie chart, 7-day bar chart, session logging |
| **Chapter Checklist** | Every JEE chapter with status: Not Started / In Progress / Completed / Need Revision |
| **Revision Notes** | Color-coded notes tagged by subject & chapter, full-text search |
| **Extras** | Pomodoro timer, JEE exam countdown, motivational quotes, PDF export, WhatsApp share, **dark mode**, offline cache |

Color scheme: **Physics `#3B82F6`** · **Chemistry `#10B981`** · **Mathematics `#F59E0B`**.

---

## 🧱 Tech Stack

- **Frontend:** React 18 + Vite + TailwindCSS + Recharts + Framer Motion
- **Backend:** Python FastAPI
- **Database:** Supabase (PostgreSQL) — optional, with in-memory fallback
- **External API:** YouTube Data API v3 — optional, with mock fallback
- **Deploy:** Vercel (frontend) + Render (backend)

```
jee-tracker/
├── frontend/      # React app
├── backend/       # FastAPI app
├── render.yaml    # Render blueprint
├── README.md
└── .env.example
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js 18+
- Python 3.10+

### 1. Backend

```bash
cd backend
python -m venv .venv
# Windows:  .venv\Scripts\activate
# macOS/Linux:  source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # optional — fill in keys to go live
uvicorn main:app --reload
```

API runs at **http://localhost:8000** — interactive docs at **/docs**.
Check **http://localhost:8000/api/health** to see whether you're in live or mock mode.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env          # leave VITE_API_URL blank to use the dev proxy
npm run dev
```

App runs at **http://localhost:5173**. The Vite dev server proxies `/api` → `localhost:8000`.

---

## 🔑 Environment Variables

All keys are **optional**. Without them the app uses mock data + in-memory storage.

| Variable | Where | Description |
| --- | --- | --- |
| `YOUTUBE_API_KEY` | backend | YouTube Data API v3 key ([get one here](https://console.cloud.google.com/apis/library/youtube.googleapis.com)) |
| `SUPABASE_URL` | backend | Supabase project URL |
| `SUPABASE_KEY` | backend | Supabase anon/service key |
| `CORS_ORIGINS` | backend | Comma-separated allowed frontend origins |
| `VITE_API_URL` | frontend | Backend base URL (blank = dev proxy) |

### Supabase setup
1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`backend/supabase_schema.sql`](backend/supabase_schema.sql).
3. Copy the project URL and API key into `backend/.env`.

---

## ☁️ Deployment

### Backend → Render
- Push this repo to GitHub.
- On Render, **New → Blueprint** and point it at the repo (uses `render.yaml`), **or**
  create a Web Service manually with:
  - Root directory: `backend`
  - Build: `pip install -r requirements.txt`
  - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Add env vars (`YOUTUBE_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, `CORS_ORIGINS`).

### Frontend → Vercel
- **New Project** → import the repo, set **Root Directory** to `frontend`.
- Vercel auto-detects Vite (`vercel.json` included).
- Add env var `VITE_API_URL` = your Render backend URL.

---

## 📡 API Overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service + mode status |
| `GET` | `/api/videos/search?q=&subject=` | Search YouTube |
| `GET/POST/PATCH/DELETE` | `/api/videos` | Saved playlist CRUD |
| `GET` | `/api/channels` | Pre-loaded channels |
| `GET` | `/api/channels/{id}/videos?order=date\|viewCount` | Channel videos |
| `GET/PUT` | `/api/progress/chapters` | Chapter checklist |
| `GET` | `/api/progress/summary` | Per-subject completion % |
| `GET/POST/PUT/DELETE` | `/api/notes` | Notes CRUD + search |
| `GET/POST` | `/api/stats/dashboard`, `/api/stats/sessions` | Stats + session logging |
| `GET` | `/api/meta/quote` | Random motivational quote |

Full interactive docs at `/docs` (Swagger UI).

---

## 📄 License

MIT — built for JEE aspirants. Good luck! 🚀

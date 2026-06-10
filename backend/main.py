"""JEE Study Tracker — FastAPI application entrypoint."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import database as db
from config import get_settings
from routers import channels, meta, notes, progress, stats, videos

settings = get_settings()

app = FastAPI(
    title="JEE Study Tracker API",
    description="Backend for the JEE Exam Study Content Tracker.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(videos.router)
app.include_router(channels.router)
app.include_router(progress.router)
app.include_router(notes.router)
app.include_router(stats.router)
app.include_router(meta.router)


@app.get("/")
def root():
    return {"name": "JEE Study Tracker API", "status": "ok", "docs": "/docs"}


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "youtube_api": "live" if settings.youtube_enabled else "mock",
        "database": "supabase" if db.using_supabase() else "in-memory",
    }

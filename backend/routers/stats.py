"""Study statistics: sessions, streaks, time distribution, daily goal."""
from collections import defaultdict
from datetime import date, datetime, timedelta

from fastapi import APIRouter

import database as db
from data.jee_data import SUBJECTS
from models.schemas import StudySession

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.post("/sessions", status_code=201)
def log_session(payload: StudySession):
    data = payload.model_dump(exclude={"id"})
    data["date"] = data.get("date") or date.today().isoformat()
    return db.sessions.insert(data)


@router.get("/sessions")
def list_sessions():
    return db.sessions.list()


@router.get("/dashboard")
def dashboard():
    sessions = db.sessions.list()
    today = date.today()
    week_ago = today - timedelta(days=6)

    today_minutes = 0
    week_minutes = 0
    subject_minutes: dict[str, int] = defaultdict(int)
    topics_this_week: set[str] = set()
    days_with_study: set[str] = set()

    for s in sessions:
        try:
            d = datetime.fromisoformat(s["date"]).date()
        except (ValueError, KeyError, TypeError):
            continue
        minutes = s.get("minutes", 0)
        if d == today:
            today_minutes += minutes
        if week_ago <= d <= today:
            week_minutes += minutes
            subject_minutes[s["subject"]] += minutes
            if s.get("topic"):
                topics_this_week.add(s["topic"])
            days_with_study.add(d.isoformat())

    # Current streak — consecutive days up to today with at least one session.
    all_days = {
        datetime.fromisoformat(s["date"]).date()
        for s in sessions if s.get("date")
    }
    streak = 0
    cursor = today
    while cursor in all_days:
        streak += 1
        cursor -= timedelta(days=1)

    distribution = [
        {
            "subject": subj,
            "name": SUBJECTS[subj]["name"],
            "color": SUBJECTS[subj]["color"],
            "minutes": subject_minutes.get(subj, 0),
        }
        for subj in ("physics", "chemistry", "mathematics")
    ]

    # Last 7 days for a weekly bar chart.
    weekly = []
    for i in range(6, -1, -1):
        d = today - timedelta(days=i)
        mins = sum(
            s.get("minutes", 0) for s in sessions
            if s.get("date") and datetime.fromisoformat(s["date"]).date() == d
        )
        weekly.append({"date": d.isoformat(), "label": d.strftime("%a"), "minutes": mins})

    return {
        "today_minutes": today_minutes,
        "today_hours": round(today_minutes / 60, 1),
        "week_minutes": week_minutes,
        "week_hours": round(week_minutes / 60, 1),
        "streak": streak,
        "topics_this_week": len(topics_this_week),
        "distribution": distribution,
        "weekly": weekly,
    }

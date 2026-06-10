"""Data persistence layer.

Uses Supabase (PostgreSQL) when SUPABASE_URL/KEY are configured. Otherwise it
transparently falls back to an in-memory store so the app is fully functional
for local development and demos without any external account.
"""
import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from config import get_settings

settings = get_settings()

_supabase = None
if settings.supabase_enabled:
    try:
        from supabase import create_client

        _supabase = create_client(settings.supabase_url, settings.supabase_key)
    except Exception as exc:  # pragma: no cover - defensive
        print(f"[database] Supabase init failed, using in-memory store: {exc}")
        _supabase = None


def using_supabase() -> bool:
    return _supabase is not None


# ---------------------------------------------------------------------------
# In-memory fallback store
# ---------------------------------------------------------------------------
_mem: dict[str, list[dict[str, Any]]] = {
    "videos": [],
    "chapters": [],
    "notes": [],
    "sessions": [],
}


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class Table:
    """Minimal CRUD wrapper that targets Supabase or the in-memory list."""

    def __init__(self, name: str):
        self.name = name

    def list(self, filters: Optional[dict] = None) -> list[dict]:
        filters = filters or {}
        if _supabase:
            query = _supabase.table(self.name).select("*")
            for key, value in filters.items():
                query = query.eq(key, value)
            return query.order("created_at", desc=True).execute().data or []
        rows = _mem[self.name]
        result = [r for r in rows if all(r.get(k) == v for k, v in filters.items())]
        return sorted(result, key=lambda r: r.get("created_at", ""), reverse=True)

    def insert(self, payload: dict) -> dict:
        record = {**payload}
        record.setdefault("id", str(uuid.uuid4()))
        record.setdefault("created_at", _now())
        if _supabase:
            res = _supabase.table(self.name).insert(record).execute()
            return (res.data or [record])[0]
        _mem[self.name].append(record)
        return record

    def update(self, row_id: str, payload: dict) -> Optional[dict]:
        if _supabase:
            res = _supabase.table(self.name).update(payload).eq("id", row_id).execute()
            return (res.data or [None])[0]
        for row in _mem[self.name]:
            if row["id"] == row_id:
                row.update(payload)
                return row
        return None

    def upsert(self, payload: dict, match: dict) -> dict:
        """Insert, or update the first row matching `match`."""
        if _supabase:
            res = _supabase.table(self.name).upsert(payload).execute()
            return (res.data or [payload])[0]
        for row in _mem[self.name]:
            if all(row.get(k) == v for k, v in match.items()):
                row.update(payload)
                return row
        return self.insert(payload)

    def delete(self, row_id: str) -> bool:
        if _supabase:
            _supabase.table(self.name).delete().eq("id", row_id).execute()
            return True
        before = len(_mem[self.name])
        _mem[self.name] = [r for r in _mem[self.name] if r["id"] != row_id]
        return len(_mem[self.name]) < before


videos = Table("videos")
chapters = Table("chapters")
notes = Table("notes")
sessions = Table("sessions")

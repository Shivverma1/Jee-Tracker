"""Quick revision notes endpoints."""
from fastapi import APIRouter, HTTPException, Query

import database as db
from models.schemas import Note

router = APIRouter(prefix="/api/notes", tags=["notes"])


@router.get("")
def list_notes(subject: str | None = Query(None), search: str | None = Query(None)):
    filters = {"subject": subject} if subject else None
    rows = db.notes.list(filters)
    if search:
        term = search.lower()
        rows = [
            r for r in rows
            if term in r.get("title", "").lower()
            or term in r.get("content", "").lower()
            or term in (r.get("chapter") or "").lower()
        ]
    return rows


@router.post("", status_code=201)
def create_note(payload: Note):
    return db.notes.insert(payload.model_dump(exclude={"id", "created_at"}))


@router.put("/{note_id}")
def update_note(note_id: str, payload: Note):
    updated = db.notes.update(note_id, payload.model_dump(exclude={"id", "created_at"}))
    if not updated:
        raise HTTPException(status_code=404, detail="Note not found")
    return updated


@router.delete("/{note_id}", status_code=204)
def delete_note(note_id: str):
    if not db.notes.delete(note_id):
        raise HTTPException(status_code=404, detail="Note not found")

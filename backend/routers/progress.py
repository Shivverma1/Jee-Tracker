"""Chapter checklist and subject progress endpoints."""
from fastapi import APIRouter

import database as db
from data.jee_data import CHAPTERS, SUBJECTS
from models.schemas import ChapterProgress

router = APIRouter(prefix="/api/progress", tags=["progress"])


@router.get("/chapters")
def get_chapters():
    """Return every JEE chapter merged with its saved status."""
    saved = {(r["subject"], r["chapter"]): r["status"] for r in db.chapters.list()}
    result = {}
    for subject, chapter_list in CHAPTERS.items():
        result[subject] = [
            {
                "chapter": chapter,
                "status": saved.get((subject, chapter), "not_started"),
            }
            for chapter in chapter_list
        ]
    return result


@router.put("/chapters")
def set_chapter(payload: ChapterProgress):
    return db.chapters.upsert(
        {"subject": payload.subject, "chapter": payload.chapter, "status": payload.status},
        match={"subject": payload.subject, "chapter": payload.chapter},
    )


@router.get("/summary")
def progress_summary():
    """Per-subject completion percentage for dashboard progress bars."""
    saved = {(r["subject"], r["chapter"]): r["status"] for r in db.chapters.list()}
    summary = []
    for subject, meta in SUBJECTS.items():
        if subject == "all":
            continue
        chapter_list = CHAPTERS[subject]
        total = len(chapter_list)
        counts = {"not_started": 0, "in_progress": 0, "completed": 0, "need_revision": 0}
        for chapter in chapter_list:
            counts[saved.get((subject, chapter), "not_started")] += 1
        completed = counts["completed"]
        summary.append(
            {
                "subject": subject,
                "name": meta["name"],
                "color": meta["color"],
                "total": total,
                "completed": completed,
                "percentage": round(completed / total * 100) if total else 0,
                "counts": counts,
            }
        )
    return summary

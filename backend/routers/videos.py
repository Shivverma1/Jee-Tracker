"""Video search and personal playlist endpoints."""
from fastapi import APIRouter, HTTPException, Query

import database as db
import youtube_service as yt
from models.schemas import SaveVideoRequest, UpdateVideoRequest

router = APIRouter(prefix="/api/videos", tags=["videos"])


@router.get("/search")
async def search(
    q: str = Query(..., min_length=1),
    subject: str | None = Query(None),
    max_results: int = Query(12, ge=1, le=25),
):
    try:
        return await yt.search_videos(q, subject, max_results)
    except Exception as exc:  # network / quota errors
        raise HTTPException(status_code=502, detail=f"YouTube search failed: {exc}")


@router.get("")
def list_saved(subject: str | None = Query(None)):
    filters = {"subject": subject} if subject else None
    return db.videos.list(filters)


@router.post("", status_code=201)
def save_video(payload: SaveVideoRequest):
    existing = db.videos.list({"video_id": payload.video_id})
    if existing:
        return existing[0]
    return db.videos.insert({**payload.model_dump(), "watched": False, "rating": 0})


@router.patch("/{video_id}")
def update_video(video_id: str, payload: UpdateVideoRequest):
    data = {k: v for k, v in payload.model_dump().items() if v is not None}
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update")
    updated = db.videos.update(video_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Video not found")
    return updated


@router.delete("/{video_id}", status_code=204)
def delete_video(video_id: str):
    if not db.videos.delete(video_id):
        raise HTTPException(status_code=404, detail="Video not found")

"""Pydantic request/response models."""
from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, Field

Subject = Literal["physics", "chemistry", "mathematics"]
ChapterStatus = Literal["not_started", "in_progress", "completed", "need_revision"]


class VideoBase(BaseModel):
    video_id: str
    title: str
    channel: str
    thumbnail: str
    published_at: Optional[str] = None
    description: Optional[str] = ""
    view_count: Optional[str] = None


class SavedVideo(VideoBase):
    id: Optional[str] = None
    subject: Subject
    topic: Optional[str] = ""
    watched: bool = False
    rating: int = Field(0, ge=0, le=5)
    saved_at: Optional[datetime] = None


class SaveVideoRequest(VideoBase):
    subject: Subject
    topic: Optional[str] = ""


class UpdateVideoRequest(BaseModel):
    watched: Optional[bool] = None
    rating: Optional[int] = Field(None, ge=0, le=5)


class ChapterProgress(BaseModel):
    subject: Subject
    chapter: str
    status: ChapterStatus = "not_started"


class Note(BaseModel):
    id: Optional[str] = None
    subject: Subject
    chapter: Optional[str] = ""
    title: str
    content: str
    created_at: Optional[datetime] = None


class StudySession(BaseModel):
    id: Optional[str] = None
    subject: Subject
    minutes: int = Field(..., gt=0)
    topic: Optional[str] = ""
    date: Optional[str] = None  # ISO date (YYYY-MM-DD)

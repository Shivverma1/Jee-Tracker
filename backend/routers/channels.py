"""Pre-loaded JEE YouTube channel tracker endpoints."""
import asyncio

from fastapi import APIRouter, HTTPException

import youtube_service as yt
from data.jee_data import CHANNELS

router = APIRouter(prefix="/api/channels", tags=["channels"])

_CHANNEL_MAP = {c["id"]: c for c in CHANNELS}


@router.get("")
async def list_channels():
    """Channel cards enriched with live subscriber counts when available."""
    async def enrich(channel: dict) -> dict:
        try:
            cid = await yt.resolve_channel_id(channel.get("search_name", ""), channel["channel_id"])
            details = await yt.channel_details(cid)
        except Exception:
            details = None
        if details:
            subs = details.get("subscribers")
            return {
                **channel,
                "subscribers": _humanize(subs) if subs else channel["subscribers"],
                "video_count": details.get("video_count"),
                "thumbnail": details.get("thumbnail", channel["thumbnail"]),
            }
        return channel

    return await asyncio.gather(*(enrich(c) for c in CHANNELS))


@router.get("/{channel_id}/videos")
async def get_channel_videos(channel_id: str, order: str = "date"):
    channel = _CHANNEL_MAP.get(channel_id)
    if not channel:
        raise HTTPException(status_code=404, detail="Channel not found")
    if order not in ("date", "viewCount"):
        raise HTTPException(status_code=400, detail="order must be 'date' or 'viewCount'")
    try:
        cid = await yt.resolve_channel_id(channel.get("search_name", ""), channel["channel_id"])
        return await yt.channel_videos(cid, order=order)
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"YouTube fetch failed: {exc}")


def _humanize(count: str | None) -> str:
    try:
        n = int(count)
    except (TypeError, ValueError):
        return count or "—"
    if n >= 1_000_000:
        return f"{n / 1_000_000:.1f}M"
    if n >= 1_000:
        return f"{n / 1_000:.1f}K"
    return str(n)

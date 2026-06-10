"""YouTube Data API v3 integration with graceful mock fallback."""
import httpx

from config import get_settings
from data.jee_data import CHANNELS

settings = get_settings()
YT_BASE = "https://www.googleapis.com/youtube/v3"

SUBJECT_KEYWORDS = {
    "physics": "Physics JEE",
    "chemistry": "Chemistry JEE",
    "mathematics": "Maths JEE",
}


def _mock_videos(query: str, count: int = 9) -> list[dict]:
    """Deterministic placeholder results used when no API key is set."""
    channels = [c["name"] for c in CHANNELS]
    return [
        {
            "video_id": f"mock{i}",
            "title": f"{query} — Complete Lecture Part {i + 1} | JEE Main + Advanced",
            "channel": channels[i % len(channels)],
            "thumbnail": f"https://picsum.photos/seed/{query.replace(' ', '')}{i}/480/270",
            "published_at": "2024-01-15T10:00:00Z",
            "description": f"Detailed explanation of {query} for JEE aspirants.",
            "view_count": f"{(i + 1) * 125}K",
        }
        for i in range(count)
    ]


async def search_videos(query: str, subject: str | None = None, max_results: int = 12) -> list[dict]:
    search_term = query.strip()
    if subject and subject in SUBJECT_KEYWORDS:
        search_term = f"{search_term} {SUBJECT_KEYWORDS[subject]}"
    else:
        search_term = f"{search_term} JEE"

    if not settings.youtube_enabled:
        return _mock_videos(search_term, max_results)

    params = {
        "part": "snippet",
        "q": search_term,
        "type": "video",
        "maxResults": max_results,
        "relevanceLanguage": "en",
        "key": settings.youtube_api_key,
    }
    async with httpx.AsyncClient(timeout=15) as client:
        res = await client.get(f"{YT_BASE}/search", params=params)
        res.raise_for_status()
        items = res.json().get("items", [])

    return [
        {
            "video_id": item["id"]["videoId"],
            "title": item["snippet"]["title"],
            "channel": item["snippet"]["channelTitle"],
            "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
            "published_at": item["snippet"]["publishedAt"],
            "description": item["snippet"]["description"],
            "view_count": None,
        }
        for item in items
        if item.get("id", {}).get("videoId")
    ]


# Cache resolved channel IDs for the process lifetime to save quota.
_channel_id_cache: dict[str, str] = {}


async def resolve_channel_id(search_name: str, fallback: str) -> str:
    """Find the real channel ID by name search, falling back to the known ID.

    Channel IDs occasionally change or may be entered incorrectly; resolving by
    name keeps the app working without manual data edits.
    """
    if not settings.youtube_enabled or not search_name:
        return fallback
    if search_name in _channel_id_cache:
        return _channel_id_cache[search_name]
    try:
        params = {
            "part": "snippet",
            "q": search_name,
            "type": "channel",
            "maxResults": 1,
            "key": settings.youtube_api_key,
        }
        async with httpx.AsyncClient(timeout=15) as client:
            res = await client.get(f"{YT_BASE}/search", params=params)
            res.raise_for_status()
            items = res.json().get("items", [])
        if items:
            cid = items[0]["snippet"]["channelId"]
            _channel_id_cache[search_name] = cid
            return cid
    except Exception:
        pass
    return fallback


async def channel_details(channel_id: str) -> dict | None:
    if not settings.youtube_enabled:
        return None
    params = {"part": "statistics,snippet", "id": channel_id, "key": settings.youtube_api_key}
    async with httpx.AsyncClient(timeout=15) as client:
        res = await client.get(f"{YT_BASE}/channels", params=params)
        res.raise_for_status()
        items = res.json().get("items", [])
    if not items:
        return None
    item = items[0]
    stats = item.get("statistics", {})
    return {
        "subscribers": stats.get("subscriberCount"),
        "video_count": stats.get("videoCount"),
        "view_count": stats.get("viewCount"),
        "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
    }


async def channel_videos(channel_id: str, order: str = "date", max_results: int = 6) -> list[dict]:
    """Latest (order=date) or most viewed (order=viewCount) videos for a channel."""
    if not settings.youtube_enabled:
        label = "Latest" if order == "date" else "Most Viewed"
        return _mock_videos(f"{label} Lecture", max_results)
    params = {
        "part": "snippet",
        "channelId": channel_id,
        "order": order,
        "type": "video",
        "maxResults": max_results,
        "key": settings.youtube_api_key,
    }
    async with httpx.AsyncClient(timeout=15) as client:
        res = await client.get(f"{YT_BASE}/search", params=params)
        res.raise_for_status()
        items = res.json().get("items", [])
    return [
        {
            "video_id": item["id"]["videoId"],
            "title": item["snippet"]["title"],
            "channel": item["snippet"]["channelTitle"],
            "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
            "published_at": item["snippet"]["publishedAt"],
        }
        for item in items
        if item.get("id", {}).get("videoId")
    ]

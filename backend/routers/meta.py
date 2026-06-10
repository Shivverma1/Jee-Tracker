"""Misc metadata endpoints: subjects, quotes."""
import random

from fastapi import APIRouter

from data.jee_data import MOTIVATIONAL_QUOTES, SUBJECTS

router = APIRouter(prefix="/api/meta", tags=["meta"])


@router.get("/subjects")
def subjects():
    return [{"key": k, **v} for k, v in SUBJECTS.items()]


@router.get("/quote")
def quote():
    return {"quote": random.choice(MOTIVATIONAL_QUOTES)}

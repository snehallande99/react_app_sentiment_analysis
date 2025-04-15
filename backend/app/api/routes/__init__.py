from fastapi import APIRouter
from . import sentiment

router = APIRouter()
router.include_router(sentiment.router, tags=["Sentiment Analysis"])

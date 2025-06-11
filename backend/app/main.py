from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.sentiment import router as sentiment_router # Renamed for clarity

app = FastAPI(title="Sentiment Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sentiment_router, prefix="/api") 
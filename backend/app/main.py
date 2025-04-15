from fastapi import FastAPI
from app.api.routes import router as api_router

app = FastAPI(title="Sentiment Analysis API")
app.include_router(api_router)
from fastapi.middleware.cors import CORSMiddleware



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for dev only, restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

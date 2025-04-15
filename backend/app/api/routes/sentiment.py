from datetime import date
from fastapi import APIRouter, Query, UploadFile, File
import requests  # ✅ correct

import pandas as pd
import joblib
from io import StringIO
import os

from ...models.fakenews import collect_sentiment_data, create_pie_chart,analyze_sentiment,emoji_sentiment_score,detect_fake_news

router = APIRouter()

@router.post("/predict-sentiment")
async def predict_sentiment(file: UploadFile = File(...)):
    model_path = os.path.join("app", "models", "sentiment_model.pkl")
    model = joblib.load(model_path)
    print("\n\n----------------------\n\n")
    # Read file into dataframe
    content = await file.read()
    df = pd.read_csv(StringIO(content.decode("utf-8")))

    if "text" not in df.columns:
        return {"error": "CSV must contain a 'text' column."}

    # Predict
    predictions = model.predict(df["text"])
    df["predicted_label"] = predictions

    return df.to_dict(orient="records")


API_KEY = os.getenv("NEWS_API_KEY", "033302b4ad3c4ca1bc664e1c784bb622")

@router.get("/fetch-news")
def fetch_news(
    category: str = Query(...),
    from_date: date = Query(..., alias="from"),
    to_date: date = Query(..., alias="to"),
    language: str = "en"
):
    
    articles = fetch_news_api(
        api_key=API_KEY,
        category=category,
        language=language,
        start_date=from_date.isoformat(),
        end_date=to_date.isoformat()
    )
    return articles


def fetch_news_api(api_key, category, language, start_date, end_date):
    url = "https://newsapi.org/v2/everything"
    params = {
        'apiKey': api_key,
        'q': category,
        'language': language,
        'from': f"{start_date}T00:00:00",
        'to': f"{end_date}T23:59:59",
        'sortBy': 'publishedAt'
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        return []

    articles = []
    for a in response.json().get("articles", []):
        pub_date = a.get('publishedAt', '').split("T")[0]
        if start_date <= pub_date <= end_date:
            articles.append({
                'title': a['title'],
                'description': (a['description'][:200] + "...") if a.get('description') else "No description",
                'url': a['url'],
                'published_at': a['publishedAt'],
                'language': language
            })
    return articles[:10]




@router.get("/fetch-news-with-sentiment")
def fetch_news_with_sentiment(
    category: str = Query(...),
    from_date: date = Query(..., alias="from"),
    to_date: date = Query(..., alias="to"),
    language: str = "en"
):
    
    articles = fetch_news_api(
        api_key=API_KEY,
        category=category,
        language=language,
        start_date=from_date.isoformat(),
        end_date=to_date.isoformat()
    )
    data = []
    for article in articles:
            sentiment, score = analyze_sentiment(article['title'], language)
            emoji_sent = emoji_sentiment_score(article['title'])
            fake_label = detect_fake_news(article['title'])
            article.update({
                'title_sentiment': sentiment,
                'title_score': score,
                'emoji_sentiment': emoji_sent,
                'fake_news': fake_label
            })
            data.append(article)
    return data
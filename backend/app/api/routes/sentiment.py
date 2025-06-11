from datetime import date, datetime
from fastapi import APIRouter, Query, UploadFile, File, HTTPException
import requests
import pandas as pd
import joblib
from io import StringIO
import os
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from transformers import pipeline
import emoji
import re
import torch
import unicodedata
from typing import List, Dict
import praw

from app.models.fakenews import collect_sentiment_data, create_pie_chart,analyze_sentiment,emoji_sentiment_score,detect_fake_news

router = APIRouter()

# Initialize YouTube API client
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY", "AIzaSyAkV-yU_MMD1C7HaBhD1KzPkxebgKAob5M")
youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

# Initialize Reddit API client
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID", "rR9DjWxscpZ2_CqlPEuhpA")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET", "ehfl-fSSr_LfZen77UvDgo7q6a5YmQ")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT", "sentiment_analysis_bot_v1.0_by_Salt_Quantity_7075")

reddit = praw.Reddit(
    client_id=REDDIT_CLIENT_ID,
    client_secret=REDDIT_CLIENT_SECRET,
    user_agent=REDDIT_USER_AGENT
)

# Initialize sentiment analyzer with a more robust model
sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="finiteautomata/bertweet-base-sentiment-analysis",  # Better for social media content
    device=0 if torch.cuda.is_available() else -1
)

def preprocess_text(text: str) -> str:
    """Enhanced preprocessing for social media text"""
    # Convert emojis to text
    text = emoji.demojize(text)
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # Handle common social media patterns
    text = re.sub(r'@\w+', '', text)  # Remove mentions
    text = re.sub(r'#\w+', '', text)  # Remove hashtags
    text = re.sub(r'RT\s*:', '', text)  # Remove retweet markers
    
    # Normalize unicode characters
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    
    # Handle repeated characters (e.g., "soooooo" -> "so")
    text = re.sub(r'(.)\1+', r'\1', text)
    
    # Remove non-alphanumeric characters but keep important punctuation
    text = re.sub(r'[^a-zA-Z0-9\s.,!?]', '', text)
    
    # Remove extra whitespace and strip
    text = ' '.join(text.split()).strip()
    
    # If the text becomes empty after processing, provide a placeholder
    if not text:
        return "[EMPTY_COMMENT]"
    
    return text

def analyze_sentiment_common(text: str) -> str:
    """Enhanced sentiment analysis with confidence threshold"""
    processed_text = preprocess_text(text)
    
    if not processed_text:
        return 'Neutral'

    try:
        # Get sentiment prediction with confidence score
        result = sentiment_pipeline([processed_text], truncation=True)[0]
        
        # Map labels to our categories
        label_mapping = {
            'POS': 'Positive',
            'NEG': 'Negative',
            'NEU': 'Neutral'
        }
        
        # Get the predicted label and confidence score
        predicted_label = label_mapping.get(result['label'], 'Neutral')
        confidence = result['score']
        
        # If confidence is low, default to Neutral
        if confidence < 0.6:
            return 'Neutral'
            
        return predicted_label
        
    except Exception as e:
        print(f"Error analyzing sentiment for text: '{processed_text}'. Error: {e}")
        return 'Neutral'

# Rename analyze_sentiment_youtube to analyze_sentiment_common as it's now shared
analyze_sentiment_youtube = analyze_sentiment_common

@router.post("/youtube/analyze")
async def analyze_youtube_comments(video_id: Dict[str, str]):
    video_id_str = video_id.get('videoId')
    if not video_id_str:
        raise HTTPException(status_code=400, detail="Video ID is required")

    comments = []
    try:
        youtube_request = youtube.commentThreads().list(
            part='snippet',
            videoId=video_id_str,
            maxResults=100,
            textFormat='plainText'
        )
        
        while youtube_request and len(comments) < 100:
            response = youtube_request.execute()
            
            for item in response['items']:
                comment = item['snippet']['topLevelComment']['snippet']
                comment_text = comment['textDisplay']
                sentiment = analyze_sentiment_common(comment_text) # Use common analysis function
                comments.append({
                    'text': comment_text,
                    'sentiment': sentiment,
                    'author': comment['authorDisplayName'],
                    'publishedAt': comment['publishedAt']
                })
            
            youtube_request = youtube.commentThreads().list_next(youtube_request, response)

    except HttpError as e:
        raise HTTPException(status_code=e.resp.status, detail=f'YouTube API error: {e.content.decode()}')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Server error: {str(e)}')

    # Calculate sentiment distribution
    sentiment_counts = {
        'Positive': 0,
        'Negative': 0,
        'Neutral': 0
    }
    
    for comment in comments:
        sentiment_counts[comment['sentiment']] += 1

    return {
        'comments': comments,
        'sentimentDistribution': sentiment_counts,
        'totalComments': len(comments)
    }

@router.post("/reddit/analyze")
async def analyze_reddit_comments(post_url_data: Dict[str, str]):
    post_url = post_url_data.get('postUrl')
    if not post_url:
        raise HTTPException(status_code=400, detail="Reddit post URL is required")

    comments = []
    try:
        submission = reddit.submission(url=post_url)
        submission.comments.replace_more(limit=0) # Flatten comment tree

        for top_level_comment in submission.comments.list()[:100]: # Limit to 100 comments
            if top_level_comment.author and top_level_comment.body:
                comment_text = top_level_comment.body
                sentiment = analyze_sentiment_common(comment_text) # Use common analysis function
                comments.append({
                    'text': comment_text,
                    'sentiment': sentiment,
                    'author': top_level_comment.author.name,
                    'publishedAt': datetime.fromtimestamp(top_level_comment.created_utc).isoformat()
                })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Reddit API error or processing error: {str(e)}')

    # Calculate sentiment distribution
    sentiment_counts = {
        'Positive': 0,
        'Negative': 0,
        'Neutral': 0
    }
    
    for comment in comments:
        sentiment_counts[comment['sentiment']] += 1

    return {
        'comments': comments,
        'sentimentDistribution': sentiment_counts,
        'totalComments': len(comments)
    }

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
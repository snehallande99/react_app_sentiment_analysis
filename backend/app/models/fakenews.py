import os
import re
from datetime import datetime, timedelta

import dash_bootstrap_components as dbc
import emoji
import feedparser
import joblib
import nltk
import plotly.graph_objs as go
import requests
from dash import Dash, Input, Output, dcc, html
from nltk.sentiment import SentimentIntensityAnalyzer
from transformers import pipeline

# Download NLTK data
nltk.download('vader_lexicon', quiet=True)
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # points to backend/app/models
MODEL_PATH = os.path.join(BASE_DIR, "fake_news_xgboost.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "tfidf_vectorizer.pkl")

fake_news_model = joblib.load(MODEL_PATH)
tfidf_vectorizer = joblib.load(VECTORIZER_PATH)

multilingual_sentiment_analyzer = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

# RSS Feed URLs
RSS_FEEDS = {
    "finance_en": "https://rss.cnn.com/rss/money_news_international.rss",
    "finance_hi": "https://www.bbc.com/hindi/index.xml",
    "healthcare_en": "https://www.who.int/rss-feeds/news-english.xml",
    "healthcare_hi": "https://www.bbc.com/hindi/science-and-environment/index.xml",
    "education_en": "https://www.theguardian.com/education/rss",
    "education_hi": "https://www.bbc.com/hindi/india/index.xml"
}

# Clean input text
def clean_text(text):
    return re.sub(r"[^a-zA-Z0-9\s]", "", text.lower())

# Emoji sentiment analysis (basic)
def emoji_sentiment_score(text):
    pos_emojis = ['😊', '😂', '😍', '😄', '😁', '😎']
    neg_emojis = ['☹️', '😢', '😡', '😠', '😭']
    score = 0
    for e in emoji.distinct_emoji_list(text):
        if e in pos_emojis:
            score += 1
        elif e in neg_emojis:
            score -= 1
    if score > 0:
        return "Positive 😊"
    elif score < 0:
        return "Negative ☹️"
    return "Neutral 😐"

# Fetch RSS news
def fetch_rss_news(category, language):
    feed_key = f"{category}_{language}"
    feed_url = RSS_FEEDS.get(feed_key, None)
    if not feed_url:
        return []
    feed = feedparser.parse(feed_url)
    articles = []
    for entry in feed.entries[:10]:
        description = entry.summary if 'summary' in entry else "No description"
        short_description = (description[:200] + "...") if len(description) > 200 else description
        articles.append({
            'title': entry.title,
            'description': short_description,
            'url': entry.link,
            'published_at': entry.get('published', 'Unknown'),
            'language': language
        })
    return articles

# NewsAPI fallback
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

# Fake news detection
def detect_fake_news(text):
    cleaned = clean_text(text)
    vector = tfidf_vectorizer.transform([cleaned])
    pred = fake_news_model.predict(vector)[0]
    return "Fake News ❌" if pred == 0 else "Real News ✅"

# Sentiment analysis
def analyze_sentiment(text, language):
    if language == 'en':
        scores = SentimentIntensityAnalyzer().polarity_scores(text)
        compound = scores['compound']
        if compound >= 0.05:
            return "Positive 😊", compound
        elif compound <= -0.05:
            return "Negative ☹️", compound
        else:
            return "Neutral 😐", compound
    else:
        result = multilingual_sentiment_analyzer(text)[0]
        label = result['label'].lower()
        score = result['score']
        if score>0.4:
            return "सकारात्मक 😊", score
        elif score<0.3:
            return "नकारात्मक ☹️", score
        else:
            return "तटस्थ 😐", score

# Collect sentiment data
def collect_sentiment_data(api_key, category, start_date, end_date):
    data = []
    for lang in ['en', 'hi']:
        articles = fetch_rss_news(category, lang) or fetch_news_api(api_key, category, lang, start_date, end_date)
        for article in articles:
            sentiment, score = analyze_sentiment(article['title'], lang)
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

# Pie chart
def create_pie_chart(data, category):
    count = {'Positive 😊': 0, 'Negative ☹️': 0, 'Neutral 😐': 0}
    mapping = {'सकारात्मक 😊': 'Positive 😊', 'नकारात्मक ☹️': 'Negative ☹️', 'तटस्थ 😐': 'Neutral 😐'}
    for d in data:
        s = mapping.get(d['title_sentiment'], d['title_sentiment'])
        count[s] += 1
    if all(v == 0 for v in count.values()):
        return go.Figure().update_layout(title="No sentiment data found")
    return go.Figure(data=[go.Pie(labels=list(count.keys()), values=list(count.values()))]).update_layout(
        title=f'Sentiment Distribution for {category.capitalize()} News'
    )


def update_output( category, start_date, end_date):
    api_key = os.getenv("NEWS_API_KEY", "033302b4ad3c4ca1bc664e1c784bb622")
    data = collect_sentiment_data(api_key, category, start_date, end_date)
    chart = create_pie_chart(data, category)
    map_hi_en = {"सकारात्मक 😊": "Positive 😊", "नकारात्मक ☹️": "Negative ☹️", "तटस्थ 😐": "Neutral 😐"}

    news_list = [
        html.Div([
            html.H5(d['title']),
            html.P(f"📄 Description: {d['description']}"),
            html.P(f"💬 Title Sentiment: {map_hi_en.get(d['title_sentiment'], d['title_sentiment'])} ({d['title_score']:.2f})"),
            html.P(f"😀 Emoji Sentiment: {d['emoji_sentiment']}"),
            html.P(f"📰 Fake News Check: {d['fake_news']}"),
            html.A("🔗 Read More", href=d['url'], target="_blank"),
            html.P(f"🗓️ Published: {d['published_at']}"),
            html.Hr()
        ]) for d in data
    ]

    return chart, news_list


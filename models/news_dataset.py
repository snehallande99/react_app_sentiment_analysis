import feedparser
import pandas as pd
import requests
from tqdm import tqdm

# RSS Feed URLs (English & Hindi sources)
RSS_FEEDS = {
    "finance_en": "https://rss.cnn.com/rss/money_news_international.rss",
    "finance_hi": "https://www.bbc.com/hindi/index.xml",
    "healthcare_en": "https://www.who.int/rss-feeds/news-english.xml",
    "healthcare_hi": "https://www.bbc.com/hindi/science-and-environment/index.xml",
    "education_en": "https://www.theguardian.com/education/rss",
    "education_hi": "https://www.bbc.com/hindi/india/index.xml"
}

# Fetch news from RSS Feeds
def fetch_rss_news():
    news_data = []
    for category, url in RSS_FEEDS.items():
        feed = feedparser.parse(url)
        for entry in feed.entries[:10]:  # Fetch top 10 news articles per category
            news_data.append({
                "title": entry.title,
                "description": entry.summary if hasattr(entry, "summary") else "",
                "category": category,
                "language": "hi" if "hi" in category else "en"
            })
    return news_data

# Save news data as a DataFrame
news_articles = fetch_rss_news()
df = pd.DataFrame(news_articles)
df.to_csv("news_dataset.csv", index=False)
print("News Dataset Saved!")

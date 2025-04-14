import pandas as pd
from transformers import pipeline

# Load the dataset (Ensure the CSV file exists)
df = pd.read_csv("news_dataset.csv")  # Make sure this file exists

# Load Sentiment Analysis Model (mBERT)
sentiment_analyzer = pipeline("sentiment-analysis", model="nlptown/bert-base-multilingual-uncased-sentiment")

# Apply sentiment analysis
def get_sentiment(text):
    try:
        result = sentiment_analyzer(str(text)[:512])[0]  # Ensure text is a string & limit to 512 tokens
        return result["label"]
    except Exception as e:
        print(f"Error processing: {text} - {e}")
        return "Neutral"  # Default fallback

# Apply sentiment analysis on the "title" column
df["sentiment"] = df["title"].apply(get_sentiment)

# Save the labeled dataset
df.to_csv("labeled_news_dataset.csv", index=False)
print("✅ Sentiment Labels Added & Dataset Saved!")

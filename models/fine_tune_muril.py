import random
import re

import feedparser
import pandas as pd
import requests
import torch
from bs4 import BeautifulSoup
from datasets import Dataset, DatasetDict
from sklearn.model_selection import train_test_split
from transformers import (AutoModelForSequenceClassification, AutoTokenizer,
                          DataCollatorWithPadding, Trainer, TrainingArguments)

# ----------------- 1️⃣ Scrape News from RSS Feeds & NewsAPI -----------------
RSS_FEEDS = {
    "finance_en": "https://rss.cnn.com/rss/money_news_international.rss",
    "finance_hi": "https://www.bbc.com/hindi/index.xml",
    "healthcare_en": "https://www.who.int/rss-feeds/news-english.xml",
    "healthcare_hi": "https://www.bbc.com/hindi/science-and-environment/index.xml",
    "education_en": "https://www.theguardian.com/education/rss",
    "education_hi": "https://www.bbc.com/hindi/india/index.xml"
}

def fetch_news_from_rss():
    """Fetch news from RSS feeds"""
    news_data = []
    for category, url in RSS_FEEDS.items():
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries[:10]:  # Fetch only 10 articles per category
                title = entry.get("title", "")
                description = entry.get("description", "")
                news_data.append({"category": category, "title": title, "content": description})
        except Exception as e:
            print(f"❌ Error fetching RSS feed {category}: {e}")
    return news_data

def fetch_news_from_newsapi():
    """Fetch news from NewsAPI"""
    API_KEY = "033302b4ad3c4ca1bc664e1c784bb622"  # Replace with your NewsAPI key
    NEWSAPI_URL = "https://newsapi.org/v2/top-headlines"
    categories = ["business", "health", "education"]

    news_data = []
    for category in categories:
        try:
            params = {"category": category, "language": "en", "apiKey": API_KEY}
            response = requests.get(NEWSAPI_URL, params=params)
            if response.status_code == 200:
                articles = response.json().get("articles", [])
                for article in articles[:10]:  # Fetch only 10 articles per category
                    title = article.get("title", "")
                    description = article.get("description", "")
                    news_data.append({"category": category, "title": title, "content": description})
            else:
                print(f"❌ API error for {category}: {response.status_code}")
        except Exception as e:
            print(f"❌ Error fetching NewsAPI data: {e}")
    return news_data

# Fetch news
rss_news = fetch_news_from_rss()
api_news = fetch_news_from_newsapi()

# Convert to DataFrame
df = pd.DataFrame(rss_news + api_news)
df.drop_duplicates(subset=["title"], inplace=True)  # Remove duplicate news
print(f"✅ News fetched successfully! Total articles: {len(df)}")

# ----------------- 2️⃣ Preprocessing -----------------
def clean_text(text):
    """Cleans text by removing HTML tags, URLs, special characters, and extra spaces"""
    if pd.isna(text):  # Handle NaN values
        return ""
    text = BeautifulSoup(text, "html.parser").get_text()  # Remove HTML tags
    text = re.sub(r"http\S+|www\S+", "", text)  # Remove URLs
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)  # Remove special characters
    text = re.sub(r"\s+", " ", text).strip()  # Remove extra spaces
    return text

df["cleaned_title"] = df["title"].apply(clean_text)
df["cleaned_content"] = df["content"].apply(clean_text)

# Assigning labels randomly for now (replace with actual labels if available)
df["label"] = df["cleaned_title"].apply(lambda x: random.choice([0, 1, 2]))  # 0: Negative, 1: Neutral, 2: Positive

# ----------------- 3️⃣ Fine-tune MuRIL for Sentiment Analysis -----------------
MODEL_NAME = "google/muril-base-cased"

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME, num_labels=3)  # 3 labels: Negative, Neutral, Positive

# Convert DataFrame to Hugging Face Dataset
dataset = Dataset.from_pandas(df)

# Split into train and validation sets
train_test = dataset.train_test_split(test_size=0.2)
dataset_dict = DatasetDict({
    "train": train_test["train"],
    "validation": train_test["test"]
})

# Tokenization function
def tokenize_function(examples):
    return tokenizer(examples["cleaned_title"], padding="max_length", truncation=True, max_length=128)

tokenized_datasets = dataset_dict.map(tokenize_function, batched=True)

# Data collator for padding
data_collator = DataCollatorWithPadding(tokenizer=tokenizer)

# Training arguments
training_args = TrainingArguments(
    output_dir="./muril_results",
    eval_strategy="epoch",
    save_strategy="epoch",
    logging_dir="./muril_logs",
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    save_total_limit=2,
    load_best_model_at_end=True
)

# Trainer setup
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["validation"],
    tokenizer=tokenizer,
    data_collator=data_collator
)

# Train the model
trainer.train()

# Save the fine-tuned model
model.save_pretrained("./muril_sentiment_model")
tokenizer.save_pretrained("./muril_sentiment_model")
print("✅ MuRIL fine-tuning completed!")

# ----------------- 4️⃣ Apply Sentiment Analysis -----------------
LABELS = {0: "Negative", 1: "Neutral", 2: "Positive"}

def get_sentiment(text):
    """Predicts sentiment label for given text"""
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
    prediction = torch.argmax(outputs.logits, dim=1).item()
    return LABELS[prediction]

# Apply sentiment analysis
df["sentiment"] = df["cleaned_title"].apply(get_sentiment)

# Save the labeled dataset
df.to_csv("labeled_news_dataset.csv", index=False)
print(f"✅ Sentiment Labels Added & Saved! Total articles labeled: {len(df)}")

import numpy as np
import torch
from sklearn.metrics import (accuracy_score, classification_report,
                             confusion_matrix)


# ----------------- Evaluate Model Performance -----------------
def evaluate_model(model, dataset):
    """Evaluates the model on the validation dataset"""
    all_predictions, all_labels = [], []
    
    for example in dataset:
        text = example["cleaned_title"]
        label = example["label"]
        
        # Tokenize the input text
        inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True, max_length=128)
        
        # Predict
        with torch.no_grad():
            outputs = model(**inputs)
        predicted_label = torch.argmax(outputs.logits, dim=1).item()
        
        # Store predictions & actual labels
        all_predictions.append(predicted_label)
        all_labels.append(label)

    return np.array(all_predictions), np.array(all_labels)

# Get model predictions
y_pred, y_true = evaluate_model(model, tokenized_datasets["validation"])

# ----------------- Calculate Metrics -----------------
# Accuracy
accuracy = accuracy_score(y_true, y_pred)
print(f"✅ Accuracy: {accuracy:.4f}")

# Precision, Recall, F1-score
print("\n📊 Classification Report:")
print(classification_report(y_true, y_pred, target_names=["Negative", "Neutral", "Positive"]))

# Confusion Matrix
conf_matrix = confusion_matrix(y_true, y_pred)
print("\n🌀 Confusion Matrix:")
print(conf_matrix)
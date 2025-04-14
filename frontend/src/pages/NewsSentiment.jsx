import React from "react";
import "../styles/NewsSentiment.css";
import { FaCheckCircle } from "react-icons/fa";

const NewsSentiment = () => {
  return (
    <div className="news-container">
      <header className="news-header">
        <h1>SentiNews</h1>
      </header>

      <main className="news-content ">
        <section className="news-article">
          <h2 className="news-title">
            Global Economic Recovery Shows Promising Signs Despite Challenges
          </h2>
          <p className="news-body">
            The global economy is showing signs of recovery in early 2025, with
            major economies reporting better-than-expected growth figures.
            Financial markets have responded positively to these developments,
            with major indices reaching new highs.
          </p>
          <p className="news-body">
            However, challenges remain as inflation concerns persist in several
            regions. Central banks are maintaining a cautious approach to
            monetary policy, balancing growth objectives with price stability.
          </p>
          <p className="news-body">
            Emerging markets are experiencing varied outcomes, with some
            showing robust recovery while others face continued headwinds from
            currency pressures and supply chain disruptions.
          </p>
        </section>

        <section className="sentence-analysis">
          <h3>Sentence-wise Sentiment Analysis</h3>
          <div className="sentence-item positive">
            <span>"The global economy is showing signs of recovery in early 2025..."</span>
            <span className="tag">Positive</span>
          </div>
          <div className="sentence-item negative">
            <span>"However, challenges remain as inflation concerns persist..."</span>
            <span className="tag">Negative</span>
          </div>
          <div className="sentence-item neutral">
            <span>"Central banks are maintaining a cautious approach..."</span>
            <span className="tag">Neutral</span>
          </div>
        </section>

        <section className="metrics-distribution">
          <div className="sentiment-distribution">
            <h3>Sentiment Distribution</h3>
            <div className="chart-placeholder">[Pie Chart Placeholder]</div>
          </div>

          <div className="key-metrics">
            <h3>Key Metrics</h3>
            <div className="metric-box">
              <p>Positive Sentences</p>
              <span>45%</span>
            </div>
            <div className="metric-box">
              <p>Negative Sentences</p>
              <span>30%</span>
            </div>
            <div className="metric-box">
              <p>Neutral Sentences</p>
              <span>25%</span>
            </div>
            <div className="metric-box">
              <p>Confidence Score</p>
              <span>85%</span>
            </div>
          </div>
        </section>

        <section className="overall-sentiment">
          <h3>Overall Sentiment</h3>
          <div className="overall-box">
            <FaCheckCircle className="check-icon" />
            <div>
              <strong>Predominantly Positive</strong>
              <p>
                The article maintains an overall positive tone, with 45%
                positive sentiments despite acknowledging some challenges.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">&copy; 2025 SentiNews. All rights reserved.</footer>
    </div>
  );
};

export default NewsSentiment;

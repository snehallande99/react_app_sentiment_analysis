import React, { useState } from "react";
import { FaCheckCircle, FaGlobe } from "react-icons/fa";

const NewsSentiment = () => {
  const [category, setCategory] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [language, setLanguage] = useState("en"); // Default to English
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [articles, setArticles] = useState([]);

  const handleFetchNews = async () => {
    if (!category || !fromDate || !toDate) {
      setError("Please fill in all fields: Category, From Date, and To Date.");
      return;
    }

    setLoading(true);
    setError("");
    setArticles([]);

    try {
      const params = new URLSearchParams({
        category,
        from: fromDate,
        to: toDate,
        language,
      }).toString();

      const response = await fetch(`http://localhost:8000/api/fetch-news-with-sentiment?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to fetch news.");
      }

      if (data.length === 0) {
        setError("No articles found for the selected criteria.");
      } else {
        setArticles(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format date for input fields
  const getFormattedDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1A202C", // Deep blue background
        color: "white",
        padding: "50px 20px",
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <h1
        style={{
          fontSize: "3.2rem",
          marginBottom: "25px",
          color: "#63B3ED", // Brighter blue accent
          textShadow: "3px 3px 6px rgba(0,0,0,0.5)",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Global News Sentiment Analysis
      </h1>
      <p
        style={{
          fontSize: "1.3rem",
          maxWidth: "950px",
          textAlign: "center",
          marginBottom: "50px",
          lineHeight: "1.7",
          color: "#E2E8F0",
          textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        Explore real-time news sentiment across various categories and languages.
        Our tool analyzes articles to provide insights into public opinion,
        emotional tones, and potential fake news indicators.
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginBottom: "40px",
          alignItems: "center",
          width: "100%",
          maxWidth: "700px",
          padding: "30px",
          backgroundColor: "#2D3748", // Darker background for inputs
          borderRadius: "12px",
          boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(45, 55, 72, 0.3)",
        }}
      >
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter news category (e.g., technology, finance)"
          style={{
            padding: "12px 15px",
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #4A5568",
            backgroundColor: "#1A202C", // Darker background for input
            color: "#E2E8F0",
            fontSize: "1rem",
            boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.4)",
          }}
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={{
            padding: "12px 15px",
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #4A5568",
            backgroundColor: "#1A202C",
            color: "#E2E8F0",
            fontSize: "1rem",
            boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.4)",
          }}
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={{
            padding: "12px 15px",
            width: "100%",
            borderRadius: "8px",
            border: "1px solid #4A5568",
            backgroundColor: "#1A202C",
            color: "#E2E8F0",
            fontSize: "1rem",
            boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.4)",
          }}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "#1A202C",
            borderRadius: "8px",
            border: "1px solid #4A5568",
            boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.4)",
            padding: "12px 15px",
          }}
        >
          <FaGlobe color="#63B3ED" size={20} />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "none",
              color: "#E2E8F0",
              fontSize: "1rem",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="en" style={{ backgroundColor: "#2D3748", color: "#E2E8F0" }}>
              English
            </option>
            <option value="hi" style={{ backgroundColor: "#2D3748", color: "#E2E8F0" }}>
              Hindi
            </option>
          </select>
        </div>
        <button
          onClick={handleFetchNews}
          disabled={loading}
          style={{
            padding: "12px 25px",
            backgroundColor: "#4299E1",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            fontSize: "1.1rem",
            fontWeight: "bold",
            transition: "all 0.3s ease",
            boxShadow: "2px 2px 5px rgba(0,0,0,0.3)",
            width: "100%",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3182CE")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4299E1")}
        >
          {loading ? "Fetching News..." : "Fetch News and Analyze Sentiment"}
        </button>
      </div>

      {error && (
        <div style={{ color: "#FC8181", marginBottom: "20px", fontSize: "1.1rem" }}>
          {error}
        </div>
      )}

      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          marginTop: "30px",
        }}
      >
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#2D3748",
                borderRadius: "12px",
                padding: "30px",
                marginBottom: "20px",
                boxShadow: "8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(45, 55, 72, 0.3)",
                border: "1px solid #4A5568",
              }}
            >
              <h2 style={{ color: "#90CDF4", marginBottom: "10px", fontSize: "1.8rem" }}>
                {article.title}
              </h2>
              <p style={{ color: "#E2E8F0", marginBottom: "15px", lineHeight: "1.6" }}>
                {article.description}
              </p>
              <p style={{ color: "#A0AEC0", fontSize: "0.9rem", marginBottom: "5px" }}>
                <FaCheckCircle
                  style={{
                    marginRight: "8px",
                    color: article.title_sentiment === "Positive 😊" ? "#2E9CCA" : 
                             article.title_sentiment === "Negative ☹️" ? "#464866" : "#AAABB8",
                  }}
                />
                Sentiment: {article.title_sentiment} (Score: {article.title_score?.toFixed(2)}) {/* Handle missing score gracefully */}
              </p>
              <p style={{ color: "#A0AEC0", fontSize: "0.9rem", marginBottom: "5px" }}>
                <FaCheckCircle
                  style={{
                    marginRight: "8px",
                    color: article.emoji_sentiment === "Positive 😊" ? "#2E9CCA" :
                             article.emoji_sentiment === "Negative ☹️" ? "#464866" : "#AAABB8",
                  }}
                />
                Emoji Sentiment: {article.emoji_sentiment}
              </p>
              <p style={{ color: "#A0AEC0", fontSize: "0.9rem", marginBottom: "15px" }}>
                <FaCheckCircle
                  style={{
                    marginRight: "8px",
                    color: article.fake_news === "Real" ? "#2E9CCA" : "#464866",
                  }}
                />
                Fake News Check: {article.fake_news}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#63B3ED",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#4299E1")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#63B3ED")}
              >
                Read More
              </a>
              <p style={{ color: "#A0AEC0", fontSize: "0.8rem", marginTop: "10px" }}>
                Published: {new Date(article.published_at).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", color: "#E2E8F0", fontSize: "1.2rem" }}>
            Use the fields above to fetch and analyze news sentiment.
          </p>
        )}
      </div>
    </div>
  );
};

export default NewsSentiment;

// File: src/pages/FakeNewsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FakeNews.css';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
import { BiNews } from 'react-icons/bi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const categories = ['Finance', 'Education', 'Healthcare'];

const FakeNewsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [articles, setArticles] = useState([]);

  const handleAnalyze = async () => {
    if (!selectedCategory || !startDate || !endDate) {
      alert('Please select a category and date range');
      return;
    }
  
    // Format the date strings as 'yyyy-mm-dd'
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
  
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/fetch-news-with-sentiment?category=${encodeURIComponent(
          selectedCategory
        )}&from=${formattedStartDate}&to=${formattedEndDate}`
      );
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Failed to fetch news articles. Please try again later.');
    }
  };

  const getSentimentCounts = () => {
    const counts = { 'Positive 😊': 0, 'Negative ☹️': 0, 'Neutral 😐': 0 };
    const mapping = {
      'सकारात्मक 😊': 'Positive 😊',
      'नकारात्मक ☹️': 'Negative ☹️',
      'तटस्थ 😐': 'Neutral 😐',
    };
  
    articles.forEach(article => {
      const sentiment = mapping[article.title_sentiment] || article.title_sentiment;
      if (counts[sentiment] !== undefined) {
        counts[sentiment]++;
      }
    });
  
    return counts;
  };
  
  const getPieChartData = () => {
    const counts = getSentimentCounts();
    return {
      labels: Object.keys(counts),
      datasets: [
        {
          label: 'Sentiment Distribution',
          data: Object.values(counts),
          backgroundColor: ['#100a37',  '#87a1c4','#3c4e8f'],
          borderWidth: 1,
        },
      ],
    };
  };
  

  return (
    <div className="fake-news-page">
      <header className="header">
        <div className="logo">SentiGuard</div>
        <nav className="nav">
          <a href="/">Home</a>
          {/* <a href="#">Documentation</a>
          <a href="#">API</a> */}
        </nav>
      </header>

      <main className="main">
        {/* <h1 className="title" color='white'>Sentiment Analysis & Fake News Detection</h1>
        <p className="subtitle">Select a category and date range to begin analysis</p> */}

        <div className="analysis-section">
          <div className="card">
            <BiNews className="icon" />
            <h2>Sentiment Analysis & Fake News Detection</h2>
            <p>Select news category and date range to begin analysis</p>
          </div>
        </div>

        <div className="category-section">
          <h3>Select News Sector</h3>
          <div className="categories">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="date-picker">
            <label>From:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={new Date()}
              placeholderText="Select start date"
            />
            <label>To:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={new Date()}
              placeholderText="Select end date"
            />
          </div>

          <button className="analyze-btn" onClick={handleAnalyze}>
            Analyze 
          </button>
        </div>

        {articles.length > 0 && (
          <div className="articles-section">
            <h3>Fetched News Articles</h3>
            {articles.length > 0 && (
  <div className="chart-container">
    <h3>Sentiment Overview</h3>
    <Pie data={getPieChartData()} />
  </div>
)}

            <ul className="articles-list">
            {articles.map((article, index) => (
                <li key={index} className="article-item">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <h4>{article.title}</h4>
                  </a>
                  <p>{article.description}</p>
                  <p><strong>Language:</strong> {article.language}</p>
                  <p><strong>Title Sentiment:</strong> {article.title_sentiment}</p>
                  {/* <p><strong>Sentiment Score:</strong> {article.title_score}</p> */}
                  <p><strong>Emoji Sentiment:</strong> {article.emoji_sentiment}</p>
                  <p><strong>Fake News Check:</strong> {article.fake_news}</p>
                  <span className="published-date">
                    Published at: {new Date(article.published_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default FakeNewsPage;

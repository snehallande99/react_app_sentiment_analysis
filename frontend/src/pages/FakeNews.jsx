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
        `http://127.0.0.1:8000/api/fetch-news-with-sentiment?category=${encodeURIComponent(
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
    <div className="fake-news-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div className="logo" style={{ fontSize: '24px', fontWeight: 'bold' }}>SentiGuard</div>
        <nav className="nav">
          <a href="/" style={{ marginLeft: '20px', textDecoration: 'none', color: '#333' }}>Home</a>
        </nav>
      </header>

      <main className="main">
        <div className="analysis-section" style={{ marginBottom: '30px' }}>
          <div className="card" style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <BiNews className="icon" style={{ fontSize: '32px', marginBottom: '10px' }} />
            <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>Sentiment Analysis & Fake News Detection</h2>
            <p style={{ margin: '0', color: '#666' }}>Select news category and date range to begin analysis</p>
          </div>
        </div>

        <div className="category-section" style={{ marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>Select News Sector</h3>
          <div className="categories" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={{ padding: '10px 15px', border: 'none', borderRadius: '5px', backgroundColor: selectedCategory === cat ? '#100a37' : '#87a1c4', color: '#fff', cursor: 'pointer' }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="date-picker" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>From:</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={new Date()}
                placeholderText="Select start date"
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>To:</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                maxDate={new Date()}
                placeholderText="Select end date"
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
          </div>

          <button className="analyze-btn" onClick={handleAnalyze} style={{ padding: '10px 20px', backgroundColor: '#100a37', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Analyze
          </button>
        </div>

        {articles.length > 0 && (
          <div className="articles-section" style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>Fetched News Articles</h3>
            {articles.length > 0 && (
              <div className="chart-container" style={{ marginBottom: '30px' }}>
                <h3 style={{ marginBottom: '15px', fontSize: '20px' }}>Sentiment Overview</h3>
                <Pie data={getPieChartData()} />
              </div>
            )}

            <ul className="articles-list" style={{ listStyle: 'none', padding: 0 }}>
              {articles.map((article, index) => (
                <li key={index} className="article-item" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#100a37' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{article.title}</h4>
                  </a>
                  <p style={{ margin: '0 0 10px 0', color: '#666' }}>{article.description}</p>
                  <p style={{ margin: '0 0 5px 0' }}><strong>Language:</strong> {article.language}</p>
                  <p style={{ margin: '0 0 5px 0' }}><strong>Title Sentiment:</strong> {article.title_sentiment}</p>
                  <p style={{ margin: '0 0 5px 0' }}><strong>Emoji Sentiment:</strong> {article.emoji_sentiment}</p>
                  <p style={{ margin: '0 0 5px 0' }}><strong>Fake News Check:</strong> {article.fake_news}</p>
                  <span className="published-date" style={{ display: 'block', marginTop: '10px', color: '#999' }}>
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

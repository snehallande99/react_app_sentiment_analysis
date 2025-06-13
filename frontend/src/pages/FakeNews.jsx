// File: src/pages/FakeNewsPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
import { BiNews } from 'react-icons/bi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaGlobe, FaCheckCircle } from 'react-icons/fa';

const categories = ['Finance', 'Education', 'Healthcare'];

const FakeNewsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [language, setLanguage] = useState("en");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!selectedCategory || !startDate || !endDate) {
      setError('Please select a category, date range, and language.');
      return;
    }
  
    setLoading(true);
    setError("");
    setArticles([]);

    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
  
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        from: formattedStartDate,
        to: formattedEndDate,
        language: language,
      }).toString();

      const response = await fetch(`http://127.0.0.1:8000/api/fetch-news-with-sentiment?${params}`);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      if (data.length === 0) {
        setError("No articles found for the selected criteria.");
      } else {
        setArticles(data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news articles. Please try again later.');
    } finally {
      setLoading(false);
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
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: [
        {
          label: 'Sentiment Distribution',
          data: [counts['Positive 😊'], counts['Negative ☹️'], counts['Neutral 😐']],
          backgroundColor: ['#2E9CCA', '#464866', '#AAABB8'],
          borderColor: '#1A202C',
          borderWidth: 2,
        },
      ],
    };
  };
  

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A202C',
      color: 'white',
      padding: '50px 20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>
      <h1 style={{
        fontSize: '3.2rem',
        marginBottom: '25px',
        color: '#63B3ED',
        textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
        fontWeight: 'bold',
        textAlign: 'center',
      }}>
        Fake News Detection & Sentiment Analysis
      </h1>
      <p style={{
        fontSize: '1.3rem',
        maxWidth: '950px',
        textAlign: 'center',
        marginBottom: '50px',
        lineHeight: '1.7',
        color: '#E2E8F0',
        textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
      }}>
        Analyze news articles to detect potential fake news and understand their sentiment.
        Select a category, date range, and language to begin your analysis.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginBottom: '40px',
        alignItems: 'center',
        width: '100%',
        maxWidth: '700px',
        padding: '30px',
        backgroundColor: '#2D3748',
        borderRadius: '12px',
        boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(45, 55, 72, 0.3)',
      }}>
        <h3 style={{ marginBottom: '15px', fontSize: '20px', color: '#90CDF4' }}>Select News Sector</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                backgroundColor: selectedCategory === cat ? '#4299E1' : '#4A5568',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'background-color 0.3s ease',
                boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = selectedCategory === cat ? '#3182CE' : '#636F80'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedCategory === cat ? '#4299E1' : '#4A5568'}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#E2E8F0' }}>From Date:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              maxDate={new Date()}
              placeholderText="Select start date"
              calendarClassName="dark-theme-calendar"
              wrapperClassName="date-picker-wrapper"
              customInput={
                <input style={{
                  padding: '12px 15px',
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #4A5568',
                  backgroundColor: '#1A202C',
                  color: '#E2E8F0',
                  fontSize: '1rem',
                  boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.4)',
                }} />
              }
            />
          </div>
          <div style={{ flex: 1, minWidth: '250px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#E2E8F0' }}>To Date:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              maxDate={new Date()}
              placeholderText="Select end date"
              calendarClassName="dark-theme-calendar"
              wrapperClassName="date-picker-wrapper"
              customInput={
                <input style={{
                  padding: '12px 15px',
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #4A5568',
                  backgroundColor: '#1A202C',
                  color: '#E2E8F0',
                  fontSize: '1rem',
                  boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.4)',
                }} />
              }
            />
          </div>
        </div>

        <div style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "#1A202C",
          borderRadius: "8px",
          border: "1px solid #4A5568",
          boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.4)",
          padding: "12px 15px",
          marginBottom: '20px',
        }}>
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
          onClick={handleAnalyze}
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
          {loading ? "Analyzing..." : "Analyze News"}
        </button>

        {error && (
          <div style={{ color: "#FC8181", marginBottom: "20px", fontSize: "1.1rem", textAlign: "center" }}>
            {error}
          </div>
        )}
      </div>

      {articles.length > 0 && (
        <div style={{ marginTop: '30px', width: '100%', maxWidth: '1200px' }}>
          <h3 style={{ marginBottom: '15px', fontSize: '20px', color: '#90CDF4' }}>Sentiment Overview</h3>
          <div style={{
            backgroundColor: '#2D3748',
            borderRadius: '12px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(45, 55, 72, 0.3)',
            textAlign: 'center',
            border: '1px solid #4A5568',
          }}>
            <div style={{ height: '250px', width: '250px', margin: '0 auto' }}>
              <Pie data={getPieChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>

          <h3 style={{ marginBottom: '15px', fontSize: '20px', color: '#90CDF4' }}>Fetched News Articles</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {articles.map((article, index) => (
              <li key={index} style={{
                marginBottom: '20px',
                padding: '20px',
                backgroundColor: '#2D3748',
                borderRadius: '12px',
                boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(45, 55, 72, 0.3)',
                border: '1px solid #4A5568',
              }}>
                <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#63B3ED' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '1.5rem' }}>{article.title}</h4>
                </a>
                <p style={{ margin: '0 0 15px 0', color: '#E2E8F0', lineHeight: '1.6' }}>{article.description}</p>
                <p style={{ margin: '0 0 5px 0', color: '#A0AEC0' }}>
                  <strong>Language:</strong> <span style={{ color: '#63B3ED' }}>{article.language?.toUpperCase()}</span>
                </p>
                <p style={{ margin: '0 0 5px 0', color: '#A0AEC0' }}>
                  <strong>Title Sentiment:</strong>
                  <span style={{ marginLeft: '8px',
                                 fontWeight: 'bold',
                                 color: article.title_sentiment === "Positive 😊" ? "#2E9CCA" : 
                                        article.title_sentiment === "Negative ☹️" ? "#464866" : "#AAABB8" }}>
                    {article.title_sentiment} (Score: {article.title_score?.toFixed(2)})
                  </span>
                </p>
                <p style={{ margin: '0 0 5px 0', color: '#A0AEC0' }}>
                  <strong>Emoji Sentiment:</strong>
                  <span style={{ marginLeft: '8px',
                                 fontWeight: 'bold',
                                 color: article.emoji_sentiment === "Positive 😊" ? "#2E9CCA" :
                                        article.emoji_sentiment === "Negative ☹️" ? "#464866" : "#AAABB8" }}>
                    {article.emoji_sentiment}
                  </span>
                </p>
                <p style={{ margin: '0 0 15px 0', color: '#A0AEC0' }}>
                  <strong>Fake News Check:</strong>
                  <span style={{ marginLeft: '8px',
                                 fontWeight: 'bold',
                                 color: article.fake_news === "Real" ? "#2E9CCA" : "#464866" }}>
                    {article.fake_news}
                  </span>
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
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FakeNewsPage;

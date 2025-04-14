import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FakeNews.css';
import { FaYoutube, FaRedditAlien, FaTwitter } from 'react-icons/fa';
import { BiNews } from 'react-icons/bi';
import { BsShareFill } from 'react-icons/bs';

const FakeNewsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="fake-news-page">
      <header className="header">
        <div className="logo">SentiGuard</div>
        <nav className="nav">
          <a href="#">Dashboard</a>
          <a href="#">Documentation</a>
          <a href="#">API</a>
        </nav>
      </header>

      <main className="main">
        <h1 className="title">Advanced Sentiment Analysis & Fake News Detection</h1>
        <p className="subtitle">
          Powerful tool for news articles and social media content verification
        </p>

        <div className="analysis-options">
          <div className="card">
            <BiNews className="icon" />
            <h2>News Article Analysis</h2>
            <p>Analyze sentiment and verify authenticity of news articles</p>
            <button className="select-btn">Select</button>
          </div>

          <div className="card">
            <BsShareFill className="icon" />
            <h2>Social Media Analysis</h2>
            <p>Analyze content from major social media platforms</p>
            <button className="select-btn">Select</button>
          </div>
        </div>

        <h3 className="platform-label">Select Platform</h3>
        <div className="platforms">
          <div className="platform">
            <FaYoutube className="platform-icon" /> YouTube
          </div>
          <div className="platform">
            <FaRedditAlien className="platform-icon" /> Reddit
          </div>
          <div className="platform">
            <FaTwitter className="platform-icon" /> Twitter
          </div>
        </div>

        <div className="content-analysis">
          <h3>Content Analysis</h3>
          <input type="text" placeholder="https://..." className="url-input" />
          <button className="analyze-btn" onClick={() => navigate('/news_sentiment')}>Analyze Content</button>
        </div>
      </main>
    </div>
  );
};

export default FakeNewsPage;

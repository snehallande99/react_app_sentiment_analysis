import { useNavigate } from 'react-router-dom';
import '../styles/homepage.css'; // Importing external CSS

function HomePage() {
  const navigate = useNavigate();

  return (
    <div id="home-container">
      <div className="home-content">
        <h1 className="home-title">SentimentScope</h1>

        <p className="home-description">
          Unlock powerful insights from news and social media platforms with <strong>SentimentScope</strong>. Analyze sentiment across 
          <span> Twitter, Reddit, YouTube</span>, and news articles. Detect fake news with smart AI and visualize trends in real-time.
          Empower your research, decisions, and awareness with data-driven sentiment analysis.
        </p>

        <button className="get-started-btn" onClick={() => navigate('/dashboard')}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default HomePage;

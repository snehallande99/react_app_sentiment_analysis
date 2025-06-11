import React from 'react';
import { FaYoutube, FaReddit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SocialMedia = () => {
  const navigate = useNavigate();

  const sectionStyle: React.CSSProperties = {
    background: 'linear-gradient(145deg, #2D3748, #1A202C)',
    borderRadius: '15px',
    padding: '35px',
    boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(45, 55, 72, 0.3)',
    flex: 1,
    margin: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'all 0.3s ease-in-out',
    minWidth: '300px',
    maxWidth: '450px',
    justifyContent: 'space-between',
    border: '1px solid #4A5568', // Subtle border
  };

  const buttonStyle: React.CSSProperties = {
    padding: '18px 30px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, transform 0.2s ease-in-out',
    marginTop: '25px',
    color: '#fff',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
  };

  const iconContainerStyle: React.CSSProperties = {
    backgroundColor: '#4A5568',
    borderRadius: '50%',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5), inset -2px -2px 5px rgba(255,255,255,0.1)',
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
      }}>
        Social Media Sentiment Insights
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
        Uncover the pulse of public opinion across leading social platforms. Our cutting-edge AI-powered analysis provides deep insights into the emotional tone of YouTube comments and Reddit discussions, enabling you to track trends, understand audience reactions, and make data-driven decisions.
      </p>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '1300px',
        width: '100%',
        gap: '30px',
      }}>
        <div 
          style={sectionStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0px) scale(1)')}
        >
          <div style={iconContainerStyle}>
            <FaYoutube size={50} color='#90CDF4' /> {/* Blue shade for YouTube icon */}
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '15px', color: '#90CDF4' }}>YouTube Comment Analysis</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#CBD5E0', flexGrow: 1 }}>
            Gain a nuanced understanding of audience sentiment on any YouTube video. From viral sensations to niche content, analyze comments to identify positive, negative, and neutral reactions, track engagement, and monitor brand perception. Perfect for content creators and marketers.
          </p>
          <button
            onClick={() => navigate('/youtube-analysis')}
            style={{ ...buttonStyle, backgroundColor: 'rgb(66, 153, 225)' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <FaYoutube size={26} style={{ marginRight: '12px' }} />
            Analyze YouTube Comments
          </button>
        </div>

        <div 
          style={sectionStyle}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0px) scale(1)')}
        >
          <div style={iconContainerStyle}>
            <FaReddit size={50} color='#63B3ED' /> {/* Blue shade for Reddit icon */}
          </div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '15px', color: '#90CDF4' }}>Reddit Post & Comment Analysis</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#CBD5E0', flexGrow: 1 }}>
            Explore the diverse opinions and discussions within Reddit communities. Our tool helps you extract sentiments from posts and comments, providing insights into public discourse, trending topics, and community reactions. Ideal for social research and competitive analysis.
          </p>
          <button
            onClick={() => navigate('/reddit-analysis')}
            style={{ ...buttonStyle, backgroundColor: 'rgb(74, 144, 226)' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <FaReddit size={26} style={{ marginRight: '12px' }} />
            Analyze Reddit Discussions
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialMedia; 
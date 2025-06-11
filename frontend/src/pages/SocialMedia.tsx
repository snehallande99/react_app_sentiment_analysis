import React from 'react';
import { FaYoutube, FaReddit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SocialMedia = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '20px', color: '#000' }}>Social Media Sentiment Analysis</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px' }}>
        <button
          onClick={() => navigate('/youtube-analysis')}
          style={{
            padding: '20px',
            backgroundColor: '#ff0000',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <FaYoutube size={40} />
          <span style={{ marginTop: '10px' }}>YouTube Analysis</span>
        </button>
        <button
          onClick={() => navigate('/reddit-analysis')}
          style={{
            padding: '20px',
            backgroundColor: '#ff4500',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <FaReddit size={40} />
          <span style={{ marginTop: '10px' }}>Reddit Analysis</span>
        </button>
      </div>
    </div>
  );
};

export default SocialMedia; 
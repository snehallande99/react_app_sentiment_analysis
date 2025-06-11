import React, { useState } from 'react';
import { FaYoutube } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Comment {
  text: string;
  sentiment: string;
  author: string;
  publishedAt: string;
}

interface Analysis {
  comments: Comment[];
  sentimentDistribution: {
    Positive: number;
    Negative: number;
    Neutral: number;
  };
  totalComments: number;
}

const YouTubeAnalysis = () => {
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  const handleAnalyze = async () => {
    if (!videoId) {
      setError('Please enter a video ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/youtube/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze comments');
      }

      setAnalysis(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = (): ChartData<'pie'> | null => {
    if (!analysis) return null;

    return {
      labels: ['Positive', 'Negative', 'Neutral'], // Ensure consistent order
      datasets: [
        {
          data: [analysis.sentimentDistribution.Positive, analysis.sentimentDistribution.Negative, analysis.sentimentDistribution.Neutral],
          backgroundColor: ['#2E9CCA', '#464866', '#AAABB8'], // Consistent with the new dark blue theme
          borderColor: '#1A202C',
          borderWidth: 2,
        },
      ],
    };
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1A202C', // Deep blue background
      color: 'white', // Default text color
      padding: '50px 20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    }}>
      <div style={{
        textAlign: 'center',
        marginBottom: '40px',
        width: '100%',
        maxWidth: '800px',
      }}>
        <FaYoutube size={60} color="#63B3ED" style={{ marginBottom: '20px', filter: 'drop-shadow(0px 0px 8px rgba(99, 179, 237, 0.7))' }} />
        <h1 style={{
          fontSize: '2.8rem',
          marginBottom: '15px',
          color: '#63B3ED',
          textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
        }}>
          YouTube Comment Sentiment Analysis
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#CBD5E0',
          marginBottom: '30px',
          lineHeight: '1.6',
        }}>
          Enter a YouTube video ID below to analyze the sentiment of its comments. Our system will process the comments and provide a detailed sentiment distribution, helping you understand public opinion on the video content.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginBottom: '40px',
          alignItems: 'center',
        }}>
          <input
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            placeholder="e.g., dQw4w9WgXcQ (Video ID)"
            style={{
              padding: '12px 15px',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '8px',
              border: '1px solid #4A5568',
              backgroundColor: '#2D3748',
              color: '#E2E8F0',
              fontSize: '1rem',
              boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.4)',
            }}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              padding: '12px 25px',
              backgroundColor: '#4299E1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3182CE'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4299E1'}
          >
            {loading ? 'Analyzing...' : 'Analyze Comments'}
          </button>
        </div>

        {error && (
          <div style={{ color: '#FC8181', marginBottom: '20px', fontSize: '1.1rem' }}>{error}</div>
        )}
      </div>

      {analysis && (
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '30px',
          marginTop: '20px',
        }}>
          <div style={{
            flex: 1,
            minWidth: '300px',
            maxWidth: '450px',
            padding: '30px',
            backgroundColor: '#2D3748',
            borderRadius: '12px',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(45, 55, 72, 0.3)',
            textAlign: 'center',
          }}>
            <h2 style={{ marginBottom: '20px', color: '#90CDF4', fontSize: '1.8rem' }}>Sentiment Distribution</h2>
            <div style={{ height: '250px', width: '250px', margin: '0 auto' }}>
              {getChartData() && <Pie data={getChartData()!} options={{ responsive: true, maintainAspectRatio: false }} />}
            </div>
          </div>
          <div style={{
            flex: 1,
            minWidth: '300px',
            maxWidth: '450px',
            padding: '30px',
            backgroundColor: '#2D3748',
            borderRadius: '12px',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(45, 55, 72, 0.3)',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}>
            <h2 style={{ marginBottom: '20px', color: '#90CDF4', fontSize: '1.8rem' }}>Analysis Summary</h2>
            <p style={{ color: '#E2E8F0', fontSize: '1.1rem', marginBottom: '10px' }}>
              Total Comments Analyzed: <strong style={{ color: '#63B3ED' }}>{analysis.totalComments}</strong>
            </p>
            {Object.entries(analysis.sentimentDistribution).map(([sentiment, count]) => (
              <p key={sentiment} style={{ color: '#E2E8F0', fontSize: '1.1rem', marginBottom: '5px' }}>
                <strong style={{ color: sentiment === 'Positive' ? '#48BB78' : 
                                  sentiment === 'Negative' ? '#F56565' : '#ECC94B' }}>
                  {sentiment}
                </strong>: {count} comments
              </p>
            ))}
          </div>

          <div style={{
            width: '100%',
            marginTop: '30px',
            backgroundColor: '#2D3748',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.6), -8px -8px 16px rgba(45, 55, 72, 0.3)',
          }}>
            <h2 style={{ marginBottom: '20px', color: '#90CDF4', fontSize: '1.8rem' }}>Detailed Comments Breakdown</h2>
            <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
              {analysis.comments.map((comment, index) => (
                <div
                  key={index}
                  style={{
                    padding: '15px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    backgroundColor: '#1A202C', // Darker background for individual comments
                    boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.4)',
                    border: '1px solid #4A5568',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ color: '#63B3ED', fontSize: '1.1rem' }}>{comment.author}</strong>
                    <span style={{
                      padding: '5px 12px',
                      borderRadius: '15px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      backgroundColor: comment.sentiment === 'Positive' ? '#2E9CCA' :
                                     comment.sentiment === 'Negative' ? '#464866' : '#AAABB8',
                      color: 'white',
                    }}>
                      {comment.sentiment}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 8px 0', color: '#E2E8F0', fontSize: '1rem' }}>{comment.text}</p>
                  <small style={{ color: '#A0AEC0', fontSize: '0.85rem' }}>
                    Published: {new Date(comment.publishedAt).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeAnalysis; 
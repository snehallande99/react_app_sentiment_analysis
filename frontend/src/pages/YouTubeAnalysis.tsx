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
      labels: Object.keys(analysis.sentimentDistribution),
      datasets: [
        {
          data: Object.values(analysis.sentimentDistribution),
          backgroundColor: ['#100a37', '#3c4e8f', '#87a1c4'], // Blue/Violet theme for chart
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', backgroundColor: '#f8f8f8', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px', color: '#000000' }}>
        <FaYoutube size={50} color="#FF0000" style={{ marginBottom: '20px' }} />
        <h1 style={{ marginBottom: '20px', color: '#100a37' }}>YouTube Comment Analysis</h1>
        <p style={{ color: '#333333', marginBottom: '30px' }}>
          Enter a YouTube video ID to analyze the sentiment of its comments
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
          <input
            type="text"
            value={videoId}
            onChange={(e) => setVideoId(e.target.value)}
            placeholder="Enter YouTube Video ID"
            style={{
              padding: '10px',
              width: '300px',
              borderRadius: '5px',
              border: '1px solid #87a1c4',
              color: '#000000',
            }}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#100a37',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze Comments'}
          </button>
        </div>

        {error && (
          <div style={{ color: '#f44336', marginBottom: '20px' }}>{error}</div>
        )}
      </div>

      {analysis && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div style={{ flex: 1, padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h2 style={{ marginBottom: '20px', color: '#100a37' }}>Sentiment Distribution</h2>
              <div style={{ height: '200px' }}>
                {getChartData() && <Pie data={getChartData()!} />}
              </div>
            </div>
            <div style={{ flex: 1, padding: '20px', marginLeft: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h2 style={{ marginBottom: '20px', color: '#100a37' }}>Summary</h2>
              <p style={{ color: '#000000' }}>Total Comments Analyzed: {analysis.totalComments}</p>
              {Object.entries(analysis.sentimentDistribution).map(([sentiment, count]) => (
                <p key={sentiment} style={{ color: '#000000' }}>
                  {sentiment}: {count} comments
                </p>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '20px', color: '#100a37' }}>Comments</h2>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {analysis.comments.map((comment, index) => (
                <div
                  key={index}
                  style={{
                    padding: '15px',
                    borderBottom: '1px solid #eee',
                    backgroundColor: comment.sentiment === 'Positive' ? '#e8f5e9' : 
                                   comment.sentiment === 'Negative' ? '#ffebee' : '#e3f2fd',
                    color: '#000000',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong style={{ color: '#000000' }}>{comment.author}</strong>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      backgroundColor: comment.sentiment === 'Positive' ? '#4CAF50' :
                                     comment.sentiment === 'Negative' ? '#f44336' : '#2196F3',
                      color: 'white',
                    }}>
                      {comment.sentiment}
                    </span>
                  </div>
                  <p style={{ margin: '0', color: '#000000' }}>{comment.text}</p>
                  <small style={{ color: '#000000' }}>
                    {new Date(comment.publishedAt).toLocaleString()}
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
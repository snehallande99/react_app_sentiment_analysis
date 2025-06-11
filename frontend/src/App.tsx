import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FakeNewsPage from './pages/FakeNews';
import SocialMedia from './pages/SocialMedia';
import YouTubeAnalysis from './pages/YouTubeAnalysis';
import RedditAnalysis from './pages/RedditAnalysis';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<FakeNewsPage />} />
        <Route path="/socialmedia" element={<SocialMedia />} />
        <Route path="/youtube-analysis" element={<YouTubeAnalysis />} />
        <Route path="/reddit-analysis" element={<RedditAnalysis />} />
      </Routes>
    </Router>
  );
}

export default App;
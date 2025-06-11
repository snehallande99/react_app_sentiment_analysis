import {  Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FakeNews from './pages/FakeNews';
import NewsSentiment from './pages/NewsSentiment'
import SocialMedial from './pages/SocialMedia'
import YouTubeAnalysis from './pages/YouTubeAnalysis';
import RedditAnalysis from './pages/RedditAnalysis';
// import Dashboard from './components/Dashboard';

function App() {
  return (
  
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<FakeNews />} />
        <Route path="/news_sentiment" element={<NewsSentiment></NewsSentiment>} />
        <Route path="/socialmedia" element={<SocialMedial></SocialMedial>} />
        <Route path="/youtube-analysis" element={<YouTubeAnalysis></YouTubeAnalysis>} />
        <Route path="/reddit-analysis" element={<RedditAnalysis></RedditAnalysis>} />
      </Routes>
    
  );
}

export default App;
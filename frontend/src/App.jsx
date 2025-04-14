import {  Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import FakeNews from './pages/FakeNews';
import NewsSentiment from './pages/NewsSentiment'
// import Dashboard from './components/Dashboard';

function App() {
  return (
  
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<FakeNews />} />
        <Route path="/news_sentiment" element={<NewsSentiment></NewsSentiment>} />
      </Routes>
    
  );
}

export default App;
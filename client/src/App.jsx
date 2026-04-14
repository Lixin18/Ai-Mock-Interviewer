import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SetupPage from './pages/SetupPage';
import InterviewPage from './pages/InterviewPage';
import ReportPage from './pages/ReportPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        {/* Simple Top Nav could go here, but prompt specifies specific pages */}
        <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-darker/80 backdrop-blur top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              AI
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Mock Interviewer
            </span>
          </div>
          <a href="/history" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Session History
          </a>
        </nav>

        <main className="flex-1 flex flex-col relative w-full h-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Layers, Calendar, Target, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = 'http://localhost:5000/api/interview';

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE}/history`);
        setSessions(response.data);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleViewSession = (session) => {
    navigate('/report', { state: { session } });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Layers className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold text-white">Session History</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="glass-panel p-10 text-center flex flex-col items-center">
          <Target className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-xl font-medium text-slate-300 mb-2">No Interviews Completed</h3>
          <p className="text-slate-500 mb-6">Complete a mock interview to start tracking your progress.</p>
          <button onClick={() => navigate('/setup')} className="btn-primary">
            Start First Session
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {sessions.map((session, i) => (
            <motion.div 
              key={session._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleViewSession(session)}
              className="glass-panel p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-primary/50 hover:bg-slate-800/80 transition-all group"
            >
              <div>
                <h3 className="text-lg font-bold text-slate-200 mb-1 group-hover:text-primary transition-colors">
                  {session.role} ({session.difficulty})
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {formatDate(session.createdAt)}
                  </span>
                  <span>{session.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-0.5">Score</span>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl font-bold ${
                      session.overallScore >= 8 ? 'text-emerald-400' : session.overallScore >= 5 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {session.overallScore}
                    </span>
                    <span className="text-sm font-medium text-slate-600">/10</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-primary group-hover:text-white text-slate-400 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

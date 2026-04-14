import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Target, Trophy, Clock, RefreshCcw, Layers, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state?.session;

  useEffect(() => {
    if (!session) {
      navigate('/');
    }
  }, [session, navigate]);

  if (!session) return null;

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 5) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getScoreBg = (score) => {
    if (score >= 8) return 'bg-emerald-400/10 border-emerald-400/20';
    if (score >= 5) return 'bg-amber-400/10 border-amber-400/20';
    return 'bg-rose-400/10 border-rose-400/20';
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto py-10 px-4">
      
      {/* Header Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Interview Completed</h1>
            <p className="text-slate-400 flex items-center gap-2">
              <Target className="w-4 h-4" />
              {session.role} ({session.difficulty})
            </p>
          </div>
          
          <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center min-w-[160px] ${getScoreBg(session.overallScore)}`}>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">Overall Score</span>
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-extrabold ${getScoreColor(session.overallScore)}`}>
                {session.overallScore}
              </span>
              <span className="text-xl text-slate-500 font-medium">/10</span>
            </div>
          </div>
        </div>

        {session.summary && (
          <div className="mt-6 pt-6 border-t border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wide">Performance Summary</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              {session.summary}
            </p>
          </div>
        )}
      </motion.div>

      {/* Breakdown */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">Question Breakdown</h3>
        
        {session.questions.map((question, index) => {
          const answer = session.answers[index];
          const feedback = session.feedbacks[index];
          if (!answer || !feedback) return null;

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel overflow-hidden"
            >
              <div className="p-5 border-b border-slate-700 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center shrink-0 text-sm border border-slate-700">
                    {index + 1}
                  </div>
                  <p className="text-slate-200 mt-1.5 font-medium leading-normal">{question}</p>
                </div>
                <div className={`px-3 py-1 rounded-full border text-xs font-bold flex shrink-0 h-fit ${getScoreBg(feedback.score)} ${getScoreColor(feedback.score)}`}>
                  Score: {feedback.score}/10
                </div>
              </div>

              <div className="p-5 bg-slate-900/50 space-y-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <span className="text-xs uppercase text-slate-500 font-bold mb-2 block">Your Answer</span>
                  <p className="text-slate-300 text-sm leading-relaxed">{answer}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-emerald-400 mb-2 font-medium text-sm">
                      <CheckCircle className="w-4 h-4" /> Good Points
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{feedback.goodPoints}</p>
                  </div>
                  <div className="bg-rose-900/10 border border-rose-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-rose-400 mb-2 font-medium text-sm">
                      <XCircle className="w-4 h-4" /> Missing Points
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{feedback.missingPoints}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center gap-4">
        <Link to="/setup" className="btn-primary flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" /> Try Another Session
        </Link>
        <Link to="/history" className="btn-secondary flex items-center gap-2">
          <Layers className="w-4 h-4" /> View History
        </Link>
      </div>

    </div>
  );
}

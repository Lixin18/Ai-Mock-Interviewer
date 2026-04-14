import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bot, User, Send, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = 'https://ai-mock-interviewer-8w1o.onrender.com/api/interview';

export default function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [role, setRole] = useState('');

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  
  // Stores history of all messages (interviewer question -> user answer -> feedback)
  const [answers, setAnswers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    if (!location.state || !location.state.sessionId) {
      navigate('/setup');
      return;
    }
    setSessionId(location.state.sessionId);
    setQuestions(location.state.questions || []);
    setRole(location.state.role || 'Role');
  }, [location, navigate]);

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Temporarily store the answer
      const updatedAnswers = [...answers];
      updatedAnswers[currentIndex] = currentAnswer;
      setAnswers(updatedAnswers);

      const response = await axios.post(`${API_BASE}/evaluate`, {
        sessionId,
        questionIndex: currentIndex,
        question: questions[currentIndex],
        answer: currentAnswer
      });
      
      const newFeedback = response.data;
      const updatedFeedbacks = [...feedbacks];
      updatedFeedbacks[currentIndex] = newFeedback;
      setFeedbacks(updatedFeedbacks);
      
      setShowFeedback(true);
    } catch (error) {
      console.error("Evaluation error:", error);
      alert("Failed to evaluate answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentAnswer('');
      setShowFeedback(false);
    } else {
      handleCompleteInterview();
    }
  };

  const handleCompleteInterview = async () => {
    setIsFinishing(true);
    try {
      const response = await axios.post(`${API_BASE}/complete`, {
        sessionId,
        answers,
        feedbacks
      });
      navigate('/report', { state: { session: response.data.session } });
    } catch (error) {
      console.error("Error completing interview:", error);
      alert("Failed to finalize the interview.");
    } finally {
      setIsFinishing(false);
    }
  };

  if (!questions.length) return null;

  const currentQuestion = questions[currentIndex];
  const currentFeedback = showFeedback ? feedbacks[currentIndex] : null;

  return (
    <div className="flex-1 flex flex-col items-center py-8 px-4 relative w-full h-full max-w-4xl mx-auto">
      
      {/* Progress Bar */}
      <div className="w-full mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{role} Interview</span>
          <span className="text-sm font-medium text-slate-300">Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: `${(currentIndex / questions.length) * 100}%` }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="flex-1 w-full flex flex-col gap-6 overflow-y-auto pb-4 hide-scrollbar">
        
        {/* INTERVIEWER QUESTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 items-start pr-12 w-full"
        >
          <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div className="glass-panel p-5 rounded-2xl rounded-tl-none border-blue-500/20">
            <p className="text-slate-100 text-[15px] leading-relaxed">{currentQuestion}</p>
          </div>
        </motion.div>

        {/* CANDIDATE ANSWER OR TEXTAREA */}
        <AnimatePresence mode="wait">
          {!showFeedback ? (
            <motion.div 
              key="input"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="flex gap-4 items-end justify-end pl-12 mt-4"
            >
              <div className="w-full max-w-2xl bg-slate-800 rounded-2xl rounded-br-none border border-slate-700 overflow-hidden shadow-sm flex flex-col">
                <textarea
                  className="w-full h-40 bg-transparent p-5 text-slate-200 resize-none focus:outline-none placeholder-slate-500"
                  placeholder="Type your response here..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  disabled={isSubmitting}
                />
                <div className="bg-slate-900/50 p-3 flex justify-between items-center border-t border-slate-700/50">
                  <span className="text-xs text-slate-500 px-2">Press Submit when ready.</span>
                  <button 
                    onClick={handleSubmitAnswer}
                    disabled={isSubmitting || !currentAnswer.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-blue-600 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Submit Answer</span>
                  </button>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-slate-600">
                <User className="w-5 h-5 text-slate-300" />
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="answer"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex gap-4 items-start pl-12 justify-end w-full"
            >
              <div className="glass-panel p-5 rounded-2xl rounded-tr-none bg-slate-800 border-slate-700 max-w-2xl text-slate-300 text-[15px] leading-relaxed whitespace-pre-wrap">
                {currentAnswer}
              </div>
               <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0 border border-slate-600 mt-2">
                <User className="w-5 h-5 text-slate-300" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FEEDBACK */}
        <AnimatePresence>
          {showFeedback && currentFeedback && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 items-start pr-12 w-full mt-4"
            >
               <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1 border border-slate-700 rounded-2xl overflow-hidden bg-slate-900/50 shadow-md">
                
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
                  <h4 className="font-semibold text-slate-200 flex items-center gap-2">
                    <span className="text-purple-400">AI Evaluation</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Score</span>
                    <span className={`text-lg font-bold ${currentFeedback.score >= 8 ? 'text-emerald-400' : currentFeedback.score >= 5 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {currentFeedback.score}/10
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-emerald-400 mb-2 font-medium">
                      <CheckCircle className="w-4 h-4" /> <span>What went well</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{currentFeedback.goodPoints}</p>
                  </div>
                  <div className="h-px w-full bg-slate-800" />
                  <div>
                    <div className="flex items-center gap-2 text-rose-400 mb-2 font-medium">
                      <XCircle className="w-4 h-4" /> <span>Areas for improvement</span>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{currentFeedback.missingPoints}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 flex justify-end">
                  <button 
                    onClick={handleNextQuestion}
                    disabled={isFinishing}
                    className="btn-primary py-2.5 flex items-center gap-2 text-sm"
                  >
                    {isFinishing ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Finalizing...</>
                    ) : (
                      currentIndex < questions.length - 1 ? "Next Question" : "View Final Report"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

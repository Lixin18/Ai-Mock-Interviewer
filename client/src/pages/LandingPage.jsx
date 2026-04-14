import { Link } from 'react-router-dom';
import { Bot, Sparkles, Code2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-darker">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] opacity-50 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[128px] opacity-50 mix-blend-screen pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary mb-8 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Interviews</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 tracking-tight">
            Master your next <br className="hidden md:block" /> tech interview.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Experience realistic mock interviews powered by advanced AI. Get instant, 
            actionable feedback and build the confidence you need to land your dream job.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/setup" className="btn-primary flex items-center gap-2 group w-full sm:w-auto">
              <span>Start Interview</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          <div className="glass-panel p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Smart AI Interviewer</h3>
            <p className="text-slate-400 text-sm">Claude API generates highly relevant questions tailored to your target role and skill level.</p>
          </div>
          
          <div className="glass-panel p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Feedback</h3>
            <p className="text-slate-400 text-sm">Get real-time evaluation on your answers, highlighting strengths and missing points.</p>
          </div>

          <div className="glass-panel p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Detailed Reports</h3>
            <p className="text-slate-400 text-sm">Review your full session report to track progress and identify areas for improvement.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

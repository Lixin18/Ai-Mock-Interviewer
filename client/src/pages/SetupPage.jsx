import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Briefcase, User, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://ai-mock-interviewer-8w1o.onrender.com/api/interview';

export default function SetupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Frontend Developer',
    difficulty: 'Easy'
  });

  const roles = [
    'Frontend Developer', 'Backend Developer', 'Fullstack Developer', 
    'Data Analyst', 'UI/UX Designer', 'Product Manager', 'DevOps Engineer'
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/start`, formData);
      const { sessionId, questions } = response.data;
      
      // Pass session data via state to the interview page
      navigate('/interview', { 
        state: { 
          sessionId, 
          questions, 
          role: formData.role 
        } 
      });
    } catch (error) {
      console.error("Error starting interview:", error);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || "Failed to start the interview. Is the backend running?";
      // Surface specific backend error if available, else fallback
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 w-full">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel w-full max-w-lg p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Configure Session</h2>
          <p className="text-slate-400">Set up your mock interview parameters.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Your Name
            </label>
            <input 
              type="text" 
              required
              placeholder="Enter your name"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-purple-400" />
              Target Role
            </label>
            <div className="relative">
              <select 
                className="input-field appearance-none cursor-pointer"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                {roles.map(r => (
                  <option key={r} value={r} className="bg-slate-800">{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-emerald-400" />
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {difficulties.map(d => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setFormData({...formData, difficulty: d})}
                  className={`py-3 rounded-lg text-sm font-semibold border transition-all ${
                    formData.difficulty === d 
                      ? 'bg-primary/20 border-primary text-primary' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading || !formData.name}
            className="btn-primary w-full flex justify-center mt-8 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Initializing AI Session...
              </span>
            ) : (
              "Begin Interview"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

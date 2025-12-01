
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { FileText, User, Play } from 'lucide-react';
import Logo from './Logo';

interface SetupScreenProps {
  onStart: (profile: UserProfile) => void;
  isLoading: boolean;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading }) => {
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('Junior');
  const [resumeText, setResumeText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ name, experience, resumeText });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
      <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 text-indigo-400">
            <Logo className="w-full h-full" />
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-2">Nexus Interviewer</h1>
          <p className="text-slate-400 text-lg">AI-powered mock interviews with real-time feedback.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <User size={16} /> Full Name
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Experience Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['Entry Level', 'Mid-Level', 'Senior'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setExperience(level)}
                  className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                    experience === level
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <FileText size={16} /> Resume Summary / Key Skills
            </label>
            <textarea
              required
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume summary, bio, or key skills here..."
              rows={4}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full group relative flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-lg transition-all ${
              isLoading
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <span className="animate-pulse">Initializing Session...</span>
            ) : (
              <>
                Start Interview <Play size={20} className="fill-current" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupScreen;

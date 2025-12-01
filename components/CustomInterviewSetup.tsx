import React, { useState } from 'react';
import { Play, Building2, Briefcase, Sparkles, Code, Users } from 'lucide-react';

interface CustomInterviewSetupProps {
  onStart: (company: string, role: string) => void;
}

const CustomInterviewSetup: React.FC<CustomInterviewSetupProps> = ({ onStart }) => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [interviewType, setInterviewType] = useState<'Technical' | 'HR'>('Technical');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company && role) {
      // Append the interview type to the role to guide the AI and Report Service
      const effectiveRole = `${role} (${interviewType} Interview)`;
      onStart(company, effectiveRole);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Custom Interview</h1>
            <p className="text-slate-400">Design your own interview scenario by specifying the target.</p>
        </div>

         {/* Type Toggle */}
         <div className="bg-slate-900 p-1 rounded-xl flex items-center border border-slate-800 self-start md:self-auto">
            <button 
                type="button"
                onClick={() => setInterviewType('Technical')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    interviewType === 'Technical' 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
            >
                <Code size={16} /> Technical
            </button>
            <button 
                type="button"
                onClick={() => setInterviewType('HR')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    interviewType === 'HR' 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
            >
                <Users size={16} /> HR / Behavioral
            </button>
        </div>
      </header>

      <div className="max-w-2xl bg-slate-900/50 border border-slate-800 rounded-3xl p-8 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 p-32 bg-indigo-600/10 rounded-full blur-3xl -translate-y-16 translate-x-16 pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Building2 size={16} className="text-indigo-400" /> Target Company
                    </label>
                    <input
                        required
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. OpenAI, Stripe, or 'A generic startup'"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
                    />
                    <p className="text-xs text-slate-500">The AI interviewer will adopt the persona and culture of this company.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <Briefcase size={16} className="text-indigo-400" /> Job Role / Title
                    </label>
                    <input
                        required
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="e.g. Senior Product Designer"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-lg"
                    />
                    <p className="text-xs text-slate-500">The questions will be tailored to the requirements of this role ({interviewType}).</p>
                </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    disabled={!company || !role}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5"
                >
                    <Sparkles size={20} className={company && role ? "animate-pulse" : ""} />
                    Start {interviewType} Interview
                </button>
            </div>
        </form>
      </div>
      
      {/* Tips Section */}
      <div className="max-w-2xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-4">
              <h4 className="text-white font-medium mb-1">Be Specific</h4>
              <p className="text-sm text-slate-400">"Frontend Engineer at Google" yields better results than just "Developer".</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-4">
              <h4 className="text-white font-medium mb-1">Challenge Yourself</h4>
              <p className="text-sm text-slate-400">Try roles slightly above your current level to push your limits.</p>
          </div>
      </div>
    </div>
  );
};

export default CustomInterviewSetup;
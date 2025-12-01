
import React from 'react';
import { Mail, Linkedin, Github, Instagram, Twitter, Mic, Activity, FileText, TrendingUp } from 'lucide-react';
import Logo from './Logo';

interface LandingPageProps {
  onLogin: () => void;
  onSignup: () => void;
  isAuthenticated?: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSignup, isAuthenticated }) => {
  return (
    <div className="h-full w-full bg-slate-950 text-white flex flex-col overflow-y-auto overflow-x-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 w-full z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 text-indigo-500">
            <Logo className="w-full h-full" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Intervu.AI</span>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button 
                onClick={onLogin}
                className="bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-lg hover:shadow-white/10"
            >
                Go to Dashboard
            </button>
          ) : (
            <>
                <button 
                    onClick={onLogin}
                    className="text-slate-300 hover:text-white font-medium transition-colors"
                >
                    Log In
                </button>
                <button 
                    onClick={onSignup}
                    className="bg-white text-slate-900 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                    Sign Up
                </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col justify-center shrink-0 min-h-[calc(100vh-200px)]">
        {/* Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl -z-10 opacity-50"></div>
             <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-3xl -z-10 opacity-30"></div>
        </div>

        <div className="max-w-6xl mx-auto px-8 py-12 text-center relative z-10">
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Master Your Interview.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Land the Job.
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience realistic, real-time interviews with AI that adapts to your responses. Get instant feedback on your confidence, technical accuracy, and soft skills.
          </p>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { 
                title: "AI-Powered Interviews", 
                desc: "Realistic interactions with adaptive AI.",
                icon: Mic,
                color: "from-blue-500 to-indigo-500"
              },
              { 
                title: "Real-time Analysis", 
                desc: "Instant feedback on tone, pace, and clarity.",
                icon: Activity,
                color: "from-indigo-500 to-purple-500"
              },
              { 
                title: "Detailed Feedback Reports", 
                desc: "Comprehensive analysis of strengths and areas for improvement.",
                icon: FileText,
                color: "from-purple-500 to-pink-500"
              },
              { 
                title: "Skill-Building Insights", 
                desc: "Boost your confidence and soft skills.",
                icon: TrendingUp,
                color: "from-pink-500 to-rose-500"
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
                 {/* Bottom Gradient Line */}
                 <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${item.color} opacity-80 group-hover:h-1.5 transition-all`}></div>
                 
                 <div className="mb-4 text-slate-300 group-hover:text-white transition-colors p-3 rounded-full bg-slate-800/50">
                   <item.icon size={28} strokeWidth={1.5} />
                 </div>
                 <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                 <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                 
                 {/* Subtle glow effect on hover */}
                 <div className={`absolute -bottom-10 left-0 right-0 h-20 bg-gradient-to-t ${item.color} opacity-0 group-hover:opacity-10 transition-opacity blur-xl pointer-events-none`}></div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900/50 bg-slate-950 py-4 shrink-0 relative z-50">
  <div className="max-w-7xl mx-auto px-8 flex flex-col items-center justify-center gap-2">

    {/* Social Icons */}
    <div className="flex items-center gap-3">
      <a 
        href="mailto:adarshpandat100@gmail.com"
        className="text-slate-400 hover:text-white transition-all hover:scale-110 duration-200 p-1 cursor-pointer"
      >
        <Mail size={16} />
      </a>

      <a 
        href="https://linkedin.com/in/adarsh-tiwari-9141a2275"
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-400 hover:text-white transition-all hover:scale-110 duration-200 p-1 cursor-pointer"
      >
        <Linkedin size={16} />
      </a>

      <a 
        href="https://github.com/adarsh112209"
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-400 hover:text-white transition-all hover:scale-110 duration-200 p-1 cursor-pointer"
      >
        <Github size={16} />
      </a>

      <a 
        href="https://instagram.com/ash.t__01_/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-400 hover:text-white transition-all hover:scale-110 duration-200 p-1 cursor-pointer"
      >
        <Instagram size={16} />
      </a>

      <a 
        href="https://x.com/Pandat999__"
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-400 hover:text-white transition-all hover:scale-110 duration-200 p-1 cursor-pointer"
      >
        <Twitter size={16} />
      </a>
    </div>

    {/* Copyright */}
    <p className="text-slate-300 text-xs text-center">
      &copy; {new Date().getFullYear()} Adarsh Tiwari. All Rights Reserved.
    </p>

  </div>
</footer>

    </div>
  );
};

export default LandingPage;

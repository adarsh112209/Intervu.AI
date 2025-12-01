
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import Logo from './Logo';
import { api } from '../services/api';

interface AuthScreenProps {
  initialMode: 'login' | 'signup';
  onAuthSuccess: (user: any) => void; // Pass full user object
  onNavigateToLogin: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ initialMode, onAuthSuccess, onNavigateToLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  React.useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        if (mode === 'signup') {
            // --- SIGNUP LOGIC ---
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match.");
            }
            if (password.length < 6) {
                throw new Error("Password must be at least 6 characters.");
            }
            
            const response = await api.signup(fullName, email, password);
            
            if (response.user) {
                onAuthSuccess(response.user);
            } else {
                setMode('login');
                onNavigateToLogin();
            }
        } else {
            // --- LOGIN LOGIC ---
            if (!email || !password) {
                throw new Error("Please enter all fields.");
            }
            
            const response = await api.login(email, password);
            onAuthSuccess(response.user);
        }
    } catch (err: any) {
        console.error(err);
        setError(err.message || "Authentication failed. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
             <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative z-10 animate-fade-in-up">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-600/30">
                    <Logo className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-slate-400">
                    {mode === 'login' ? 'Enter your credentials to access your dashboard.' : 'Start your journey to interview mastery.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                     <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="text"
                                required 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {mode === 'signup' && (
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input 
                                type="password" 
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg animate-fade-in">
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                        <>
                            {mode === 'login' ? 'Sign In' : 'Create Account'}
                            <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-slate-400 text-sm">
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        onClick={() => {
                            setMode(mode === 'login' ? 'signup' : 'login');
                            setError(null);
                        }}
                        className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
                    >
                        {mode === 'login' ? 'Sign up' : 'Log in'}
                    </button>
                </p>
            </div>
        </div>
    </div>
  );
};

export default AuthScreen;


import React from 'react';
import { InterviewReport, ViewState } from '../types';
import { CheckCircle, XCircle, ChevronRight, Award, Zap, AlertCircle, Home, RotateCcw } from 'lucide-react';

interface ReportScreenProps {
  report: InterviewReport;
  onNavigate: (view: ViewState) => void;
}

const ScoreRing: React.FC<{ score: number; label: string; color: string }> = ({ score, label, color }) => {
    // SVG Config to prevent clipping
    const stroke = 8;
    const radius = 40; // Reduced from 42 to prevent edge clipping
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center">
             <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                <svg 
                    className="transform -rotate-90 w-full h-full overflow-visible" 
                    viewBox="0 0 100 100"
                >
                    {/* Background Circle */}
                    <circle 
                        cx="50" 
                        cy="50" 
                        r={radius} 
                        stroke="currentColor" 
                        strokeWidth={stroke} 
                        fill="transparent" 
                        className="text-slate-800" 
                    />
                    {/* Progress Circle */}
                    <circle 
                        cx="50" 
                        cy="50" 
                        r={radius} 
                        stroke="currentColor" 
                        strokeWidth={stroke} 
                        fill="transparent" 
                        className={`${color} transition-all duration-1000 ease-out`}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round" 
                    />
                </svg>
                <span className="absolute text-3xl font-bold text-white">{score}</span>
            </div>
            <span className="text-slate-400 font-medium text-lg">{label}</span>
        </div>
    )
}

const ReportScreen: React.FC<ReportScreenProps> = ({ report, onNavigate }) => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-950">
        <div className="max-w-5xl mx-auto">
            {/* Header Result */}
            <div className="text-center mb-12 animate-fade-in-up">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${report.selected ? 'bg-green-500/20 text-green-400 shadow-[0_0_30px_rgba(74,222,128,0.2)]' : 'bg-red-500/20 text-red-400 shadow-[0_0_30px_rgba(248,113,113,0.2)]'}`}>
                    {report.selected ? <CheckCircle size={40} /> : <XCircle size={40} />}
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">{report.selected ? 'Candidate Selected' : 'Not Selected'}</h1>
                <p className="text-slate-400 text-lg">Interview Result for <span className="text-white font-semibold">{report.role}</span> at <span className="text-white font-semibold">{report.company}</span></p>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 bg-slate-900/50 border border-slate-800 rounded-3xl p-10 shadow-xl">
                <ScoreRing score={report.technicalScore} label="Technical" color="text-blue-500" />
                <ScoreRing score={report.behaviorScore} label="Behavioral" color="text-purple-500" />
                <ScoreRing score={report.confidenceScore} label="Confidence" color="text-pink-500" />
            </div>

            {/* Feedback Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-green-500/20 transition-all">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                             <Award className="text-indigo-400" size={24} /> 
                        </div>
                        Key Strengths
                    </h3>
                    <ul className="space-y-4">
                        {report.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-300">
                                <div className="mt-1 w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle size={12} />
                                </div>
                                <span className="leading-relaxed">{s}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-lg hover:border-orange-500/20 transition-all">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <AlertCircle className="text-orange-400" size={24} />
                        </div>
                         Areas for Improvement
                    </h3>
                    <ul className="space-y-4">
                        {report.weaknesses.map((w, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-300">
                                <div className="mt-1 w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                                    <Zap size={12} />
                                </div>
                                <span className="leading-relaxed">{w}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Detailed Feedback */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 mb-12 shadow-lg">
                <h3 className="text-xl font-bold text-white mb-4">Detailed Feedback</h3>
                <div className="text-slate-300 leading-relaxed text-lg bg-black/20 p-6 rounded-xl border border-white/5">
                    {report.feedback}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-12">
                <button 
                    onClick={() => onNavigate(ViewState.DASHBOARD)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors font-semibold"
                >
                    <Home size={20} /> Back to Dashboard
                </button>
                <button 
                    onClick={() => onNavigate(ViewState.SELECTION)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-1 font-bold"
                >
                    <RotateCcw size={20} /> Try Another Interview
                </button>
            </div>
        </div>
    </div>
  );
};

export default ReportScreen;

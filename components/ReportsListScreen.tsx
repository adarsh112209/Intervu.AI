
import React from 'react';
import { InterviewReport } from '../types';
import { Calendar, Building2, CheckCircle, XCircle, ArrowRight, FileQuestion } from 'lucide-react';

interface ReportsListScreenProps {
  reports: InterviewReport[];
  onSelectReport: (report: InterviewReport) => void;
}

const MiniScoreRing: React.FC<{ score: number }> = ({ score }) => {
    const stroke = 5;
    const radius = 20;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500';

    return (
        <div className="relative w-14 h-14 flex items-center justify-center">
             <svg className="transform -rotate-90 w-full h-full overflow-visible" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r={radius} stroke="currentColor" strokeWidth={stroke} fill="transparent" className="text-slate-700" />
                <circle cx="25" cy="25" r={radius} stroke="currentColor" strokeWidth={stroke} fill="transparent" 
                    className={`${color} transition-all duration-1000 ease-out`}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                />
            </svg>
            <span className="absolute text-sm font-bold text-white">{score}</span>
        </div>
    )
}

const ReportsListScreen: React.FC<ReportsListScreenProps> = ({ reports, onSelectReport }) => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Reports</h1>
        <p className="text-slate-400">Review your past interview performance and feedback.</p>
      </header>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
             <FileQuestion size={32} />
          </div>
          <p className="text-lg font-medium">No reports available yet.</p>
          <p className="text-sm">Complete an interview to see your results here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
          {reports.map((report, index) => {
             // Calculate average score for display
             const avgScore = Math.round((report.technicalScore + report.behaviorScore + report.confidenceScore) / 3);
             
             return (
              <div 
                key={index}
                onClick={() => onSelectReport(report)}
                className="group cursor-pointer bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/30 rounded-2xl p-6 transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-lg hover:shadow-indigo-900/10"
              >
                <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold shadow-lg ${report.selected ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                         {report.selected ? <CheckCircle size={28} /> : <XCircle size={28} />}
                    </div>
                    
                    <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-1">{report.role}</h3>
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 text-sm text-slate-400">
                             <div className="flex items-center gap-1">
                                <Building2 size={14} className="text-indigo-400" /> {report.company}
                             </div>
                             <div className="hidden md:block w-1 h-1 rounded-full bg-slate-600"></div>
                             <div className="flex items-center gap-1">
                                <Calendar size={14} /> {report.date}
                             </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    <div className="flex flex-col items-center">
                         <span className="text-xs text-slate-500 mb-1 hidden md:block uppercase tracking-wider font-semibold">Score</span>
                         <MiniScoreRing score={avgScore} />
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-slate-700 group-hover:bg-indigo-600 flex items-center justify-center transition-colors">
                        <ArrowRight size={20} className="text-slate-300 group-hover:text-white" />
                    </div>
                </div>
              </div>
             );
          })}
        </div>
      )}
    </div>
  );
};

export default ReportsListScreen;

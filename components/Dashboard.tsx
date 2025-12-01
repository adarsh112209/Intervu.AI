
import React, { useEffect, useState, useMemo } from 'react';
import { ViewState, UserProfile, InterviewReport } from '../types';
import { Play, TrendingUp, TrendingDown, Activity, Briefcase, Sparkles, Loader2, FileText, CheckCircle, Code, Users, Zap, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { getJobRecommendations } from '../services/reportService';
import { API_KEY } from '../config';

interface DashboardProps {
  onNavigate: (view: ViewState) => void;
  userProfile: UserProfile | null;
  reports: InterviewReport[];
}

const StatCard: React.FC<{ title: string; score: number | string; icon: any; color: string; subtext?: string; delay?: number }> = ({ title, score, icon: Icon, color, subtext, delay = 0 }) => {
    // Calculate circle stroke only if score is a number
    const numScore = typeof score === 'number' ? score : 0;
    const isNum = typeof score === 'number';
    
    // SVG Config to prevent clipping
    const radius = 38; // Reduced radius
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const offset = circumference - (numScore / 100) * circumference;

    return (
        <div 
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group hover:border-slate-600 transition-all animate-fade-in-up flex flex-col items-center justify-center text-center"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`absolute top-0 right-0 p-32 opacity-5 rounded-full blur-3xl ${color}`}></div>
            
            <div className="relative mb-4 w-full flex justify-center">
                {isNum ? (
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg 
                            height="100%" 
                            width="100%" 
                            viewBox="0 0 100 100" 
                            className="transform -rotate-90 overflow-visible"
                        >
                            <circle
                                stroke="currentColor"
                                className="text-slate-700"
                                strokeWidth={stroke}
                                fill="transparent"
                                r={normalizedRadius}
                                cx="50"
                                cy="50"
                            />
                            <circle
                                stroke="currentColor"
                                className={`${color.replace('bg-', 'text-')} transition-all duration-1000 ease-out`}
                                strokeWidth={stroke}
                                strokeDasharray={circumference + ' ' + circumference}
                                style={{ strokeDashoffset: offset }}
                                strokeLinecap="round"
                                fill="transparent"
                                r={normalizedRadius}
                                cx="50"
                                cy="50"
                            />
                        </svg>
                        <span className="absolute text-xl font-bold text-white">{score}</span>
                    </div>
                ) : (
                    <div className="h-24 w-24 flex items-center justify-center bg-slate-800 rounded-full border-4 border-slate-700">
                         <span className="text-3xl font-bold text-white">{score}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 mb-1 justify-center relative z-10">
                <div className={`p-1.5 rounded-lg ${color} bg-opacity-20 text-white`}>
                    <Icon size={16} />
                </div>
                <h3 className="text-slate-300 text-sm font-bold">{title}</h3>
            </div>
            
            {subtext && <div className="text-xs text-slate-500 relative z-10">{subtext}</div>}
        </div>
    )
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userProfile, reports }) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // --- Calculations ---
  const totalInterviews = reports.length;
  const resumeScore = userProfile?.resumeScore || 0;

  const avgTechnical = totalInterviews > 0 
    ? Math.round(reports.reduce((acc, r) => acc + r.technicalScore, 0) / totalInterviews) 
    : 0;
  
  const avgBehavioral = totalInterviews > 0 
    ? Math.round(reports.reduce((acc, r) => acc + r.behaviorScore, 0) / totalInterviews) 
    : 0;
    
  const avgConfidence = totalInterviews > 0 
    ? Math.round(reports.reduce((acc, r) => acc + r.confidenceScore, 0) / totalInterviews) 
    : 0;

  // Extract unique areas of improvement from last 5 reports
  const recentImprovements = reports.length > 0
    ? Array.from(new Set(reports.slice(0, 5).flatMap(r => r.weaknesses))).slice(0, 4)
    : [];

  useEffect(() => {
    const fetchRecommendations = async () => {
        // 1. Check local cache first
        const cached = localStorage.getItem('nexus_recommendations');
        if (cached) {
            setRecommendations(JSON.parse(cached));
            return;
        }

        // 2. If no cache and profile exists, fetch from AI
        if (userProfile && userProfile.resumeText) {
            setIsLoadingRecs(true);
            try {
                const recs = await getJobRecommendations(API_KEY, userProfile.resumeText);
                setRecommendations(recs);
                localStorage.setItem('nexus_recommendations', JSON.stringify(recs));
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoadingRecs(false);
            }
        }
    };

    fetchRecommendations();
  }, [userProfile]);

  // --- Graph Data Prep ---
  const graphData = useMemo(() => {
    // Take last 10 reports, reverse to get chronological order (oldest -> newest)
    const data = [...reports].reverse().slice(-10).map(r => ({
        ...r,
        avgScore: Math.round((r.technicalScore + r.behaviorScore + r.confidenceScore) / 3)
    }));
    return data;
  }, [reports]);

  // SVG Dimension Constants
  const VIEWBOX_WIDTH = 800;
  const VIEWBOX_HEIGHT = 250;
  const PADDING_X = 20;
  const PADDING_Y = 30;
  
  // Calculate SVG Points
  const points = useMemo(() => {
      if (graphData.length === 0) return [];
      
      const width = VIEWBOX_WIDTH - (PADDING_X * 2);
      const height = VIEWBOX_HEIGHT - (PADDING_Y * 2);

      return graphData.map((d, i) => {
          // X: Distribute points evenly
          const x = PADDING_X + (graphData.length > 1 ? (i / (graphData.length - 1)) * width : width / 2);
          // Y: Scale 0-100 score to height (0 at bottom)
          const y = (VIEWBOX_HEIGHT - PADDING_Y) - (d.avgScore / 100) * height;
          return { x, y, data: d };
      });
  }, [graphData]);

  // Path Strings
  const linePath = useMemo(() => {
      if (points.length < 2) return "";
      return "M" + points.map(p => `${p.x},${p.y}`).join(" L");
  }, [points]);

  const areaPath = useMemo(() => {
      if (points.length < 2) return "";
      const first = points[0];
      const last = points[points.length - 1];
      return `${linePath} L${last.x},${VIEWBOX_HEIGHT - PADDING_Y} L${first.x},${VIEWBOX_HEIGHT - PADDING_Y} Z`;
  }, [linePath, points]);

  // Trend Calc
  const trend = useMemo(() => {
      if (graphData.length < 2) return null;
      const last = graphData[graphData.length - 1].avgScore;
      const prev = graphData[graphData.length - 2].avgScore;
      const diff = last - prev;
      return { val: diff, percent: Math.round((diff / prev) * 100) || 0 };
  }, [graphData]);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {userProfile?.name?.split(' ')[0] || 'Candidate'}</h1>
            <p className="text-slate-400">Track your progress and improve your interview skills.</p>
        </div>
        <button 
            onClick={() => onNavigate(ViewState.SELECTION)}
            className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
        >
            <Play size={18} fill="currentColor" /> Start New Session
        </button>
      </header>

      {/* --- Key Metrics Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
         <StatCard 
            title="Resume Score" 
            score={resumeScore} 
            icon={FileText} 
            color="bg-blue-500" 
            subtext="ATS Analysis"
            delay={0}
        />
        <StatCard 
            title="Technical Score" 
            score={avgTechnical} 
            icon={Code} 
            color="bg-emerald-500" 
            subtext="Average"
            delay={100}
        />
        <StatCard 
            title="Behavioral Score" 
            score={avgBehavioral} 
            icon={Users} 
            color="bg-purple-500" 
            subtext="Average"
            delay={200}
        />
        <StatCard 
            title="Confidence Score" 
            score={avgConfidence} 
            icon={Zap} 
            color="bg-amber-500" 
            subtext="Average"
            delay={300}
        />
        <StatCard 
            title="Interviews Completed" 
            score={totalInterviews} 
            icon={CheckCircle} 
            color="bg-indigo-500"
            subtext="Total Sessions" 
            delay={400}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        
        {/* --- Line Graph Performance Trend --- */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 relative overflow-hidden flex flex-col">
             <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity size={20} className="text-indigo-400"/> Performance Trend
                    </h3>
                    <p className="text-slate-400 text-sm">Overall score progression over recent sessions.</p>
                </div>
                
                {/* Trend Indicator */}
                {trend && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${trend.val >= 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                        {trend.val >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span className="text-sm font-bold">
                            {trend.val >= 0 ? '+' : ''}{trend.val} pts
                        </span>
                    </div>
                )}
            </div>
            
            <div className="flex-1 w-full min-h-[250px] relative mt-4">
                {points.length > 0 ? (
                    <div className="w-full h-full">
                         <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            
                            {/* Grid Lines */}
                            {[0, 25, 50, 75, 100].map(val => {
                                const y = (VIEWBOX_HEIGHT - PADDING_Y) - (val / 100) * (VIEWBOX_HEIGHT - PADDING_Y * 2);
                                return (
                                    <line key={val} x1={PADDING_X} y1={y} x2={VIEWBOX_WIDTH - PADDING_X} y2={y} stroke="#334155" strokeDasharray="4 4" strokeWidth="1" />
                                )
                            })}

                            {/* Area Fill */}
                            {points.length > 1 && (
                                <path d={areaPath} fill="url(#gradientArea)" className="animate-fade-in" />
                            )}

                            {/* Line Stroke */}
                            {points.length > 1 && (
                                <path 
                                    d={linePath} 
                                    fill="none" 
                                    stroke="#6366f1" 
                                    strokeWidth="4" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    filter="url(#glow)"
                                    className="drop-shadow-lg"
                                />
                            )}
                            
                            {/* Data Points */}
                            {points.map((p, i) => (
                                <g key={i} 
                                   onMouseEnter={() => setHoveredPoint(i)}
                                   onMouseLeave={() => setHoveredPoint(null)}
                                   className="cursor-pointer group"
                                >
                                    {/* Invisible hit area */}
                                    <circle cx={p.x} cy={p.y} r="15" fill="transparent" />
                                    
                                    {/* Visible Dot */}
                                    <circle 
                                        cx={p.x} 
                                        cy={p.y} 
                                        r={hoveredPoint === i ? 6 : 4} 
                                        fill="#0f172a" 
                                        stroke={hoveredPoint === i ? "#ffffff" : "#6366f1"} 
                                        strokeWidth="3" 
                                        className="transition-all duration-300"
                                    />
                                    
                                    {/* Tooltip */}
                                    <g 
                                        opacity={hoveredPoint === i ? 1 : 0} 
                                        className="transition-opacity duration-200 pointer-events-none"
                                        transform={`translate(${p.x}, ${p.y - 15})`}
                                    >
                                        <foreignObject x="-75" y="-70" width="150" height="60">
                                            <div className="bg-slate-900 border border-slate-700 text-white text-xs p-2 rounded-lg shadow-xl text-center">
                                                <div className="font-bold text-indigo-300">{p.data.avgScore}% Score</div>
                                                <div className="text-slate-400 truncate">{p.data.company}</div>
                                            </div>
                                        </foreignObject>
                                    </g>
                                </g>
                            ))}
                         </svg>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-700/50 rounded-xl">
                        <Activity size={32} className="mb-2 opacity-50"/>
                        <p>No interview data available yet.</p>
                        <button onClick={() => onNavigate(ViewState.SELECTION)} className="text-indigo-400 text-sm hover:underline mt-2">Start your first interview</button>
                    </div>
                )}
            </div>
        </div>

        {/* --- Areas of Improvement --- */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <AlertTriangle size={20} className="text-orange-400"/> Areas for Improvement
            </h3>
            
            {recentImprovements.length > 0 ? (
                <div className="space-y-4">
                    {recentImprovements.map((item, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 hover:border-orange-500/30 transition-colors">
                            <div className="mt-0.5 min-w-[20px] text-orange-400">
                                <ArrowUpRight size={18} />
                            </div>
                            <p className="text-slate-300 text-sm leading-snug">{item}</p>
                        </div>
                    ))}
                    <div className="pt-2 text-center">
                        <button onClick={() => onNavigate(ViewState.REPORTS_LIST)} className="text-xs text-slate-500 hover:text-white transition-colors">View full reports &rarr;</button>
                    </div>
                </div>
            ) : (
                 <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-center">
                    <CheckCircle size={32} className="mb-2 opacity-30 text-green-500"/>
                    <p className="text-sm">No weaknesses detected yet.</p>
                    <p className="text-xs mt-1 opacity-70">Complete interviews to get AI feedback.</p>
                </div>
            )}
        </div>
      </div>

      {/* --- Recommendations --- */}
      <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                Recommended Roles for You
            </h3>
            
            {isLoadingRecs ? (
                <div className="flex items-center gap-3 text-slate-500 py-4">
                    <Loader2 size={20} className="animate-spin text-indigo-500" />
                    <span className="text-sm">Analyzing your profile matches...</span>
                </div>
            ) : recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations.map((role, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-xl cursor-pointer transition-all group hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10">
                            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                <Briefcase size={18} />
                            </div>
                            <div>
                                <div className="text-slate-200 text-sm font-bold group-hover:text-white">{role}</div>
                                <div className="text-slate-500 text-xs group-hover:text-slate-400">95% Match</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-6">
                        <p className="text-slate-500 text-sm mb-3">Complete your profile to get AI job recommendations.</p>
                        <button 
                        onClick={() => onNavigate(ViewState.PROFILE)}
                        className="text-indigo-400 text-xs font-medium hover:text-indigo-300"
                    >
                        Update Profile &rarr;
                        </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default Dashboard;

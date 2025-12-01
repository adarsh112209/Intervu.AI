
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import InterviewSelection from './components/InterviewSelection';
import InterviewSession from './components/InterviewSession';
import ReportScreen from './components/ReportScreen';
import ProfileScreen from './components/ProfileScreen';
import ReportsListScreen from './components/ReportsListScreen';
import CustomInterviewSetup from './components/CustomInterviewSetup';
import LandingPage from './components/LandingPage';
import AuthScreen from './components/AuthScreen';
import { ViewState, UserProfile, InterviewReport, TranscriptItem } from './types';
import { generateInterviewReport } from './services/reportService';
import { api } from './services/api';
import { Loader2, AlertCircle } from 'lucide-react';
import { API_KEY } from './config';

const App: React.FC = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string>('mock-id-123'); // Store MongoDB ID
  
  // Current Interview Context
  const [interviewContext, setInterviewContext] = useState<{ company: string, role: string } | null>(null);
  
  // State for current active report (detailed view)
  const [reportData, setReportData] = useState<InterviewReport | null>(null);
  
  // State for list of all reports
  const [reportsHistory, setReportsHistory] = useState<InterviewReport[]>([]);
  
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showProfileAlert, setShowProfileAlert] = useState(false);

  // Load initial data
  useEffect(() => {
    const init = async () => {
        const sessionActive = localStorage.getItem('nexus_auth_session') === 'true';
        
        if (sessionActive) {
            // Try to recover user profile from local cache for speed, then sync
            const cachedProfile = localStorage.getItem('nexus_user_profile');
            if (cachedProfile) {
                const parsed = JSON.parse(cachedProfile);
                setUserProfile(parsed);
                if (parsed._id) setUserId(parsed._id);
            }
            setIsAuthenticated(true);
            
            // Initial View for Authed User
            setCurrentView(ViewState.DASHBOARD);
            // Replace initial history entry so back gesture works correctly from deeper pages
            window.history.replaceState({ view: ViewState.DASHBOARD }, '');
            
            // Background fetch for reports
            if (userId) {
                try {
                    const history = await api.getReports(userId);
                    setReportsHistory(history);
                } catch (e) {
                    console.error("Failed to load history", e);
                }
            }
        } else {
            setCurrentView(ViewState.LANDING);
            window.history.replaceState({ view: ViewState.LANDING }, '');
        }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Browser History Integration (Back Gestures) ---
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If state exists, use it. 
      // If null (e.g. user manually typed url or initial load), fall back based on auth
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        // Fallback safety
        setCurrentView(isAuthenticated ? ViewState.DASHBOARD : ViewState.LANDING);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  // --- Navigation System ---

  const handleNavigate = (view: ViewState) => {
      if (view === currentView) return;
      // Push new state to browser history
      window.history.pushState({ view }, '');
      setCurrentView(view);
  };

  const handleReplaceView = (view: ViewState) => {
      // Replaces the current history entry (e.g. preventing back to a loading screen)
      window.history.replaceState({ view }, '');
      setCurrentView(view);
  };

  // --- Auth Handlers ---

  const handleLogin = async (user: any) => {
      setIsAuthenticated(true);
      setUserProfile(user);
      if (user._id) setUserId(user._id);
      
      localStorage.setItem('nexus_auth_session', 'true');
      localStorage.setItem('nexus_user_profile', JSON.stringify(user));
      
      // Fetch reports for this user
      if (user._id) {
        const reports = await api.getReports(user._id);
        setReportsHistory(reports);
      }
      
      // Reset history on login: Replace Landing with Dashboard
      setCurrentView(ViewState.DASHBOARD);
      window.history.replaceState({ view: ViewState.DASHBOARD }, '');
  };

  const handleSignOut = () => {
      setIsAuthenticated(false);
      localStorage.removeItem('nexus_auth_session');
      localStorage.removeItem('nexus_user_profile'); 
      setUserProfile(null);
      
      setCurrentView(ViewState.LANDING);
      window.history.pushState({ view: ViewState.LANDING }, '');
  };

  // --- Feature Handlers ---

  const handleSelectContext = (company: string, role?: string) => {
    // 1. Check if user profile exists (Name and Resume are mandatory)
    if (!userProfile || !userProfile.name || !userProfile.resumeText) {
        setShowProfileAlert(true);
        handleNavigate(ViewState.PROFILE);
        return;
    }

    // 2. Role is now MANDATORY from the selection screen (via Modal or Card)
    if (!role) {
        console.error("Role is missing for interview context");
        return;
    }
    
    setInterviewContext({ company, role });
    handleNavigate(ViewState.INTERVIEW);
  };

  const handleSaveProfile = async (profile: UserProfile) => {
    setIsLoadingData(true);
    try {
        // Optimistic update
        setUserProfile(profile);
        localStorage.setItem('nexus_user_profile', JSON.stringify(profile));
        
        // API Call
        await api.updateProfile(userId, profile);
        
        // Clear cached recommendations
        localStorage.removeItem('nexus_recommendations');
        setShowProfileAlert(false);
    } catch (e) {
        console.error("Failed to save profile", e);
    } finally {
        setIsLoadingData(false);
    }
  };

  const handleInterviewEnd = async (transcript: TranscriptItem[], generateReport: boolean) => {
    if (!interviewContext) return;

    // If user chose NOT to generate a report, go back to Dashboard
    if (!generateReport) {
        handleReplaceView(ViewState.DASHBOARD);
        return;
    }

    // Show loading state while generating report
    setIsGeneratingReport(true);
    
    // Replace Interview with Report in history so Back doesn't restart interview
    // Note: We use replace here so the interview URL/state is gone
    handleReplaceView(ViewState.REPORT); 
    
    try {
        // 1. Generate via AI
        const report = await generateInterviewReport(API_KEY, transcript, interviewContext.company, interviewContext.role);
        setReportData(report);
        
        // 2. Save to DB
        await api.saveReport(userId, report);
        
        // 3. Update local history
        setReportsHistory(prev => [report, ...prev]);

    } catch (e) {
        console.error("Report generation failed", e);
    } finally {
        setIsGeneratingReport(false);
    }
  };

  const handleSelectReportFromList = (report: InterviewReport) => {
      setReportData(report);
      handleNavigate(ViewState.REPORT);
  };

  // --- Render Layout ---

  const renderContent = () => {
    // 1. Unauthenticated Views
    if (!isAuthenticated) {
        if (currentView === ViewState.AUTH) {
            return (
                <AuthScreen 
                    initialMode="login" 
                    onAuthSuccess={handleLogin}
                    onNavigateToLogin={() => {/* Internal switch managed by AuthScreen */}} 
                />
            );
        }
        if (currentView === 'SIGNUP_MODE' as any) {
             return (
                <AuthScreen 
                    initialMode="signup" 
                    onAuthSuccess={handleLogin}
                    onNavigateToLogin={() => handleNavigate(ViewState.AUTH)} 
                />
            );
        }

        return (
            <LandingPage 
                onLogin={() => handleNavigate(ViewState.AUTH)} 
                onSignup={() => handleNavigate('SIGNUP_MODE' as any)} 
            />
        );
    }

    // 2. Loading State
    if (isGeneratingReport) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-white">
                <Loader2 size={48} className="animate-spin text-indigo-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Analyzing Interview...</h2>
                <p className="text-slate-400">Our AI is compiling your feedback report.</p>
            </div>
        );
    }

    // 3. Authenticated Views
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onNavigate={handleNavigate} userProfile={userProfile} reports={reportsHistory} />;
      
      case ViewState.PROFILE:
        return (
            <div className="relative h-full">
                {showProfileAlert && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-xl animate-bounce">
                        <AlertCircle size={20} />
                        Please complete your profile to start an interview.
                    </div>
                )}
                <ProfileScreen 
                    currentProfile={userProfile} 
                    onSave={handleSaveProfile} 
                />
                {isLoadingData && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40 backdrop-blur-sm">
                        <Loader2 size={32} className="animate-spin text-white" />
                    </div>
                )}
            </div>
        );
    
      case ViewState.REPORTS_LIST:
        return <ReportsListScreen reports={reportsHistory} onSelectReport={handleSelectReportFromList} />;

      case ViewState.SELECTION:
        return <InterviewSelection onSelectContext={handleSelectContext} />;

      case ViewState.CUSTOM_SETUP:
        return <CustomInterviewSetup onStart={handleSelectContext} />;
      
      case ViewState.INTERVIEW:
        if (!userProfile || !interviewContext) return null;
        
        return (
            <div className="h-full p-4">
                <InterviewSession 
                    profile={userProfile} 
                    companyName={interviewContext.company}
                    role={interviewContext.role}
                    onEnd={handleInterviewEnd}
                />
            </div>
        );

      case ViewState.REPORT:
        if (!reportData) return null;
        return <ReportScreen report={reportData} onNavigate={handleNavigate} />;
        
      default:
        return <Dashboard onNavigate={handleNavigate} userProfile={userProfile} reports={reportsHistory} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
        {isAuthenticated && currentView !== ViewState.INTERVIEW && (
            <Sidebar 
                currentView={currentView} 
                onChangeView={handleNavigate} 
                onSignOut={handleSignOut}
            />
        )}
        
        <main className={`flex-1 relative ${currentView === ViewState.INTERVIEW || !isAuthenticated ? 'bg-slate-950' : 'bg-slate-950'}`}>
             {/* Main Content Render */}
             {renderContent()}
        </main>
    </div>
  );
};

export default App;

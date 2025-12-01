
import React, { useEffect, useRef, useState } from 'react';
import { UserProfile, TranscriptItem } from '../types';
import { GeminiLiveClient } from '../services/geminiLiveClient';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Settings2, User, FileText, Home, ArrowRight } from 'lucide-react';
import AudioPulse from './AudioPulse';
import { API_KEY } from '../config';

interface InterviewSessionProps {
  profile: UserProfile;
  companyName: string;
  role: string;
  onEnd: (transcript: TranscriptItem[], generateReport: boolean) => void;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({ profile, companyName, role, onEnd }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Track the stream directly so we can kill it even if the video element is null/changed
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  const [client, setClient] = useState<GeminiLiveClient | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [aiVolume, setAiVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  
  // Post Interview Logic
  const [showPostInterviewModal, setShowPostInterviewModal] = useState(false);
  const transcriptRef = useRef<TranscriptItem[]>([]);

  useEffect(() => {
    // Timer
    const timer = setInterval(() => {
        if (isConnected) setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isConnected]);

  // Clean up and switch UI state without leaving component
  const handleCleanupAndShowModal = async (finalClient: GeminiLiveClient) => {
    // 1. Save transcript locally
    transcriptRef.current = [...finalClient.transcriptHistory];
    
    // 2. Disconnect AI (Stops Audio Stream from Client side)
    if (finalClient) {
        await finalClient.disconnect();
    }
    
    // 3. FORCE STOP Camera Stream (The robust way)
    // First, stop the stream we tracked in the ref
    if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => {
            track.stop();
            track.enabled = false;
        });
        mediaStreamRef.current = null;
    }

    // Second, double check the video element just in case
    if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => {
            track.stop();
        });
        videoRef.current.srcObject = null;
    }
    
    // 4. Update UI State to reflect "OFF" immediately
    setIsMicOn(false);
    setIsCamOn(false);
    setIsConnected(false);
    
    // 5. Show Modal
    setShowPostInterviewModal(true);
  };

  useEffect(() => {
    let isMounted = true;
    let newClient: GeminiLiveClient | null = null;

    // 1. Initialize Camera immediately
    const initSession = async () => {
      // --- Camera Setup ---
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        
        // Guard: If component unmounted while waiting for camera, stop immediately
        if (!isMounted) {
            stream.getTracks().forEach(t => t.stop());
            return;
        }

        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.error("Camera access denied or failed", e);
        if (isMounted) setError("Could not access camera. Please check permissions.");
      }

      // --- AI Client Setup ---
      if (!API_KEY || API_KEY.includes('YOUR_GEMINI')) {
        if (isMounted) setError("Invalid API Key. Please update config.ts");
        return;
      }

      newClient = new GeminiLiveClient(API_KEY);
      if (isMounted) setClient(newClient);

      const onCompleteCallback = async () => {
         if (newClient) await handleCleanupAndShowModal(newClient);
      };
      
      try {
        await newClient.connect(
            profile,
            companyName,
            role,
            (vol) => { if (isMounted) setAiVolume(vol); },
            (err) => { if (isMounted) setError(err.message); },
            onCompleteCallback
        );
        
        if (isMounted) {
            setIsConnected(true);
            // Start sending video frames if camera is active
            if (videoRef.current) {
                 newClient.startVideoStream(videoRef.current);
            }
        } else {
            // If unmounted during connection, disconnect immediately
            newClient.disconnect();
        }
      } catch (err) {
          console.error("Failed to connect client", err);
      }
    };

    initSession();

    // Cleanup function when component unmounts (e.g. navigating back)
    return () => {
      isMounted = false;
      
      // Stop Camera
      if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null;
      }
      
      // Stop AI Client
      if (newClient) {
          newClient.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const manualEndCall = async () => {
    if (client) {
        await handleCleanupAndShowModal(client);
    }
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    // Note: In a real app, we'd mute the stream track here
  };

  const toggleCam = () => {
    setIsCamOn(!isCamOn);
    if (videoRef.current && videoRef.current.srcObject) {
       const stream = videoRef.current.srcObject as MediaStream;
       stream.getVideoTracks().forEach(t => t.enabled = !isCamOn);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
        <div className="flex items-center justify-center h-full bg-slate-900 text-white p-4">
            <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-2xl max-w-md text-center shadow-xl">
                <h2 className="text-2xl font-bold text-red-400 mb-4">Connection Error</h2>
                <p className="text-slate-300 mb-6">{error}</p>
                <button onClick={() => onEnd([], false)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors font-medium">Return to Dashboard</button>
            </div>
        </div>
    )
  }

  return (
    <div className="relative h-full w-full bg-black rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-slate-800">
      
      {/* --- Main Visual Area --- */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden">
        
        {/* User Video (Background) */}
        <div className="absolute inset-0">
            {isCamOn && !showPostInterviewModal ? (
                 <video 
                 ref={videoRef}
                 autoPlay 
                 playsInline 
                 muted 
                 className="w-full h-full object-cover opacity-60"
             />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    <User size={64} className="text-slate-700" />
                </div>
            )}
           
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50"></div>
        </div>

        {/* AI Avatar Centerpiece (Hidden if modal is up) */}
        {!showPostInterviewModal && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                
                {/* Connection Status Label */}
                {!isConnected && (
                    <div className="mb-8 px-6 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white flex items-center gap-3 animate-pulse">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-sm font-medium">Establishing Secure Connection...</span>
                    </div>
                )}

                {/* The Orb */}
                <div className={`transition-all duration-700 transform ${isConnected ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4'}`}>
                    <div className="relative">
                        <div className="bg-slate-950/40 backdrop-blur-3xl p-10 rounded-full border border-white/5 shadow-2xl">
                            <AudioPulse active={isConnected} volume={aiVolume} />
                        </div>
                    </div>
                    <div className="text-center mt-6">
                        <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">Alex</h2>
                        <p className="text-indigo-200/80 text-sm font-medium tracking-wide uppercase">{companyName} Interviewer</p>
                    </div>
                </div>
            </div>
        )}

        {/* --- POST INTERVIEW CONFIRMATION MODAL --- */}
        {showPostInterviewModal && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md animate-fade-in">
                <div className="bg-slate-900 border border-slate-700 rounded-3xl p-10 max-w-lg w-full shadow-2xl text-center relative overflow-hidden">
                    
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-10 translate-x-10 pointer-events-none"></div>

                    <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Interview Complete</h2>
                    <p className="text-slate-400 mb-8 relative z-10">
                        Great job finishing the session! Would you like to generate a detailed AI analysis report?
                    </p>

                    <div className="space-y-4 relative z-10">
                        <button 
                            onClick={() => onEnd(transcriptRef.current, true)}
                            className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
                        >
                            <FileText size={20} />
                            Yes, Generate Report
                            <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                        </button>
                        
                        <button 
                            onClick={() => onEnd(transcriptRef.current, false)}
                            className="w-full flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-4 rounded-xl transition-colors border border-slate-700"
                        >
                            <Home size={20} />
                            No, Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Top Info Bar */}
        {!showPostInterviewModal && (
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-20">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-white flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-red-500 animate-pulse' : 'bg-slate-500'}`}></div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Live Session</span>
                        <span className="text-sm font-bold font-mono">{formatTime(sessionTime)}</span>
                    </div>
                </div>
                
                <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-white">
                    <span className="text-xs text-slate-400 block">Role</span>
                    <span className="text-sm font-semibold">{role}</span>
                </div>
            </div>
        )}
      </div>

      {/* --- Control Bar --- */}
      {!showPostInterviewModal && (
        <div className="h-24 bg-slate-950 border-t border-slate-800 px-8 flex items-center justify-center relative z-30">
            <div className="flex items-center gap-6">
                <button 
                    onClick={toggleMic} 
                    className={`p-4 rounded-full transition-all duration-200 hover:scale-105 ${isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}
                    title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                >
                    {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                </button>
                
                <button 
                    onClick={toggleCam} 
                    className={`p-4 rounded-full transition-all duration-200 hover:scale-105 ${isCamOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500/20 text-red-500 border border-red-500/30'}`}
                    title={isCamOn ? "Turn Camera Off" : "Turn Camera On"}
                >
                    {isCamOn ? <Video size={24} /> : <VideoOff size={24} />}
                </button>
                
                <button className="p-4 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200">
                    <Settings2 size={24} />
                </button>

                <div className="w-px h-10 bg-slate-800 mx-2"></div>

                <button 
                    onClick={manualEndCall} 
                    className="px-8 py-4 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/20 hover:shadow-red-500/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2"
                >
                    <PhoneOff size={20} />
                    <span>End Interview</span>
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSession;

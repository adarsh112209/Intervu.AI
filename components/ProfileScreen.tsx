
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { User, FileText, Save, Check, Upload, Loader2, AlertCircle, FileCheck } from 'lucide-react';
import { analyzeResume } from '../services/reportService';
import { API_KEY } from '../config';

interface ProfileScreenProps {
  currentProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ currentProfile, onSave }) => {
  const [name, setName] = useState('');
  const [experience, setExperience] = useState('Junior');
  const [resumeText, setResumeText] = useState('');
  const [resumeScore, setResumeScore] = useState<number>(0);
  const [saved, setSaved] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentProfile) {
      setName(currentProfile.name);
      setExperience(currentProfile.experience);
      setResumeText(currentProfile.resumeText);
      if (currentProfile.resumeScore) {
          setResumeScore(currentProfile.resumeScore);
      }
    }
  }, [currentProfile]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file.');
        return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
        const reader = new FileReader();
        reader.onload = async () => {
            const base64String = (reader.result as string).split(',')[1];
            
            const result = await analyzeResume(API_KEY, base64String);
            setResumeText(result.text);
            setResumeScore(result.score);
            setIsAnalyzing(false);
        };
        reader.onerror = () => {
            setError('Error reading file.');
            setIsAnalyzing(false);
        };
        reader.readAsDataURL(file);
    } catch (err) {
        console.error(err);
        setError('Failed to analyze resume. Please try again.');
        setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, experience, resumeText, resumeScore });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">User Profile</h1>
        <p className="text-slate-400">Manage your details for a personalized interview experience.</p>
      </header>

      <div className="max-w-3xl bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <User size={16} className="text-indigo-400" /> Full Name
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
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
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <FileText size={16} className="text-indigo-400" /> Resume Upload (PDF)
            </label>
            
            <div 
                onClick={() => !isAnalyzing && fileInputRef.current?.click()}
                className={`border-2 border-dashed border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${isAnalyzing ? 'bg-slate-800/50 opacity-50 cursor-wait' : 'hover:bg-slate-800 hover:border-indigo-500'}`}
            >
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="application/pdf"
                    onChange={handleFileChange}
                />
                
                {isAnalyzing ? (
                    <div className="flex flex-col items-center text-indigo-400">
                        <Loader2 size={32} className="animate-spin mb-2" />
                        <span className="text-sm font-medium">Analyzing Resume...</span>
                    </div>
                ) : resumeScore > 0 ? (
                    <div className="flex flex-col items-center text-green-400">
                         <div className="w-16 h-16 rounded-full bg-slate-800 border-4 border-green-500/30 flex items-center justify-center mb-2">
                            <span className="text-2xl font-bold text-white">{resumeScore}</span>
                         </div>
                         <div className="flex items-center gap-2 text-sm font-medium">
                            <FileCheck size={16} /> Resume Analyzed
                         </div>
                         <span className="text-xs text-slate-500 mt-1">Click to upload a new version</span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-slate-400">
                        <Upload size={32} className="mb-2" />
                        <span className="text-sm font-medium">Click to upload PDF resume</span>
                        <span className="text-xs text-slate-500 mt-1">We'll extract text and score it automatically</span>
                    </div>
                )}
            </div>
            {error && <div className="text-red-400 text-xs flex items-center gap-1 mt-1"><AlertCircle size={12}/> {error}</div>}
          </div>

          {/* Hidden text area for fallback/viewing if needed, or we can show it */}
          {resumeText && (
             <div className="space-y-2 opacity-50 hover:opacity-100 transition-opacity">
                 <label className="text-xs font-medium text-slate-500">Extracted Text (Editable)</label>
                 <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 text-xs focus:outline-none focus:border-slate-600 resize-none"
                 />
             </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={isAnalyzing || !resumeText}
              className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                saved ? 'bg-green-600 hover:bg-green-500' : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {saved ? (
                <>
                  <Check size={20} /> Saved Successfully
                </>
              ) : (
                <>
                  <Save size={20} /> Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileScreen;

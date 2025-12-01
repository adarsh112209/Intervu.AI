
export interface UserProfile {
  name: string;
  experience: string;
  resumeText: string;
  resumeScore?: number;
}

export interface TranscriptItem {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface InterviewReport {
  technicalScore: number;
  behaviorScore: number;
  confidenceScore: number;
  selected: boolean;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  transcript: TranscriptItem[];
  date: string;
  company: string;
  role: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string; // URL or Lucide Icon Name
  color: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export enum ViewState {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  SELECTION = 'SELECTION',
  SETUP = 'SETUP',
  INTERVIEW = 'INTERVIEW',
  REPORT = 'REPORT',
  PROFILE = 'PROFILE',
  REPORTS_LIST = 'REPORTS_LIST',
  CUSTOM_SETUP = 'CUSTOM_SETUP',
}

export interface AudioVisualizerData {
  volume: number; // 0 to 1
}

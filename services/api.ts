
import { UserProfile, InterviewReport } from '../types';

// --- CONFIGURATION ---
// Set this to false to use the real MongoDB backend (server/server.js)
const USE_MOCK_DB = false; 

const API_URL = 'http://localhost:5000/api';

// --- Types ---
interface AuthResponse {
    user: UserProfile & { _id?: string; email?: string };
    token?: string;
    msg?: string;
}

// --- Helper for Network Errors ---
const handleFetch = async (url: string, options?: RequestInit) => {
    try {
        const res = await fetch(url, options);
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || 'Request failed');
        return data;
    } catch (error: any) {
        if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
            throw new Error("Cannot connect to server. Please ensure you are running 'node server/server.js' in a separate terminal.");
        }
        throw error;
    }
};

// --- API Service ---

const MockService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));
        
        // Mock simple validation
        if (!email.includes('@')) throw new Error('Invalid email format');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');

        // Check local storage for mock user
        const storedUser = localStorage.getItem('nexus_user_profile');
        if (storedUser) {
             const user = JSON.parse(storedUser);
             return { user: { ...user, email, _id: 'mock-id-123' }, msg: 'Login successful' };
        }

        // Return a dummy user if none exists
        return {
            user: { 
                name: 'Demo User', 
                experience: 'Entry Level', 
                resumeText: 'Mock Resume', 
                resumeScore: 85,
                _id: 'mock-id-123'
            },
            msg: 'Login successful'
        };
    },

    signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
        await new Promise(r => setTimeout(r, 800));
        const newUser = { name, experience: 'Entry Level', resumeText: '', resumeScore: 0, _id: 'mock-id-123' };
        localStorage.setItem('nexus_user_profile', JSON.stringify(newUser));
        return { user: newUser, msg: 'Signup successful' };
    },

    updateProfile: async (id: string, profile: UserProfile): Promise<UserProfile> => {
        await new Promise(r => setTimeout(r, 500));
        localStorage.setItem('nexus_user_profile', JSON.stringify(profile));
        return profile;
    },

    saveReport: async (id: string, report: InterviewReport): Promise<InterviewReport> => {
        await new Promise(r => setTimeout(r, 500));
        const history = JSON.parse(localStorage.getItem('nexus_reports_history') || '[]');
        const newHistory = [report, ...history];
        localStorage.setItem('nexus_reports_history', JSON.stringify(newHistory));
        return report;
    },

    getReports: async (id: string): Promise<InterviewReport[]> => {
        await new Promise(r => setTimeout(r, 500));
        return JSON.parse(localStorage.getItem('nexus_reports_history') || '[]');
    }
};

const MongoService = {
    login: async (email: string, password: string): Promise<AuthResponse> => {
        return handleFetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
    },

    signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
        return handleFetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
    },

    updateProfile: async (id: string, profile: UserProfile): Promise<UserProfile> => {
        return handleFetch(`${API_URL}/user/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profile)
        });
    },

    saveReport: async (id: string, report: InterviewReport): Promise<InterviewReport> => {
        return handleFetch(`${API_URL}/reports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: id, ...report })
        });
    },

    getReports: async (id: string): Promise<InterviewReport[]> => {
        return handleFetch(`${API_URL}/reports/${id}`);
    }
};

export const api = USE_MOCK_DB ? MockService : MongoService;

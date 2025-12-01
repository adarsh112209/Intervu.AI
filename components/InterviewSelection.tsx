import React, { useState } from 'react';
import { CompanyProfile } from '../types';
import { 
  Briefcase, Building2, ChevronRight, Code, Server, Database, LineChart, Users, Globe, ArrowLeft, 
  Cpu, Smartphone, ShoppingBag, Tv, UserCheck, Heart, MessageSquare, Shield, Terminal, PenTool, 
  TrendingUp, Layout, Box, Cloud, Zap, Lock, DollarSign, Activity, Layers, Repeat,
  Sparkles, Check, Brain, Eye, Link
} from 'lucide-react';

interface InterviewSelectionProps {
  onSelectContext: (company: string, role?: string) => void;
}

const companies: CompanyProfile[] = [
  // MAANG & Big Tech
  { id: 'google', name: 'Google', logo: 'G', color: 'from-red-500 to-yellow-500', description: 'Algorithms, System Design, and "Googliness".', difficulty: 'Hard' },
  { id: 'meta', name: 'Meta', logo: 'M', color: 'from-blue-600 to-cyan-500', description: 'Fast-paced coding and product design.', difficulty: 'Hard' },
  { id: 'amazon', name: 'Amazon', logo: 'A', color: 'from-orange-500 to-yellow-500', description: 'Leadership Principles and scalable systems.', difficulty: 'Medium' },
  { id: 'microsoft', name: 'Microsoft', logo: 'MS', color: 'from-blue-500 to-cyan-500', description: 'OOP, Azure, and legacy vs modern stack.', difficulty: 'Medium' },
  { id: 'apple', name: 'Apple', logo: '', color: 'from-slate-400 to-slate-600', description: 'Hardware/Software integration and perfectionism.', difficulty: 'Hard' },
  { id: 'netflix', name: 'Netflix', logo: 'N', color: 'from-red-600 to-pink-600', description: 'Culture memo, freedom & responsibility.', difficulty: 'Hard' },
  
  // New Tech & AI
  { id: 'nvidia', name: 'Nvidia', logo: 'Nv', color: 'from-green-500 to-lime-400', description: 'GPU arch, CUDA, and Deep Learning.', difficulty: 'Hard' },
  { id: 'openai', name: 'OpenAI', logo: 'O', color: 'from-emerald-600 to-teal-500', description: 'LLMs, AI safety, and research.', difficulty: 'Hard' },
  { id: 'uber', name: 'Uber', logo: 'U', color: 'from-slate-900 to-black', description: 'Real-time data, logistics, and scalability.', difficulty: 'Hard' },
  { id: 'airbnb', name: 'Airbnb', logo: 'Ab', color: 'from-rose-500 to-pink-500', description: 'Frontend, design systems, and culture.', difficulty: 'Medium' },
  { id: 'stripe', name: 'Stripe', logo: 'S', color: 'from-indigo-600 to-violet-500', description: 'Fintech, API design, and reliability.', difficulty: 'Hard' },
  { id: 'coinbase', name: 'Coinbase', logo: 'C', color: 'from-blue-600 to-indigo-600', description: 'Crypto, blockchain, and security.', difficulty: 'Medium' },
  { id: 'tesla', name: 'Tesla', logo: 'T', color: 'from-red-700 to-red-500', description: 'Autopilot, embedded systems, and manufacturing.', difficulty: 'Hard' },
  { id: 'spacex', name: 'SpaceX', logo: 'X', color: 'from-slate-700 to-slate-900', description: 'Avionics, C++, and mission-critical software.', difficulty: 'Hard' },

  // Enterprise & Hardware
  { id: 'salesforce', name: 'Salesforce', logo: 'Sf', color: 'from-blue-400 to-cyan-300', description: 'Cloud computing, CRM, and Java.', difficulty: 'Medium' },
  { id: 'adobe', name: 'Adobe', logo: 'Ad', color: 'from-red-600 to-orange-500', description: 'Creative software, cloud services, and C++.', difficulty: 'Medium' },
  { id: 'oracle', name: 'Oracle', logo: 'Or', color: 'from-red-700 to-orange-700', description: 'Databases, Cloud infrastructure, and Java.', difficulty: 'Medium' },
  { id: 'intel', name: 'Intel', logo: 'I', color: 'from-blue-600 to-cyan-600', description: 'Semiconductors, firmware, and low-level code.', difficulty: 'Medium' },

  // Finance
  { id: 'goldman', name: 'Goldman Sachs', logo: 'GS', color: 'from-blue-800 to-indigo-900', description: 'Algorithms, math, and financial modelling.', difficulty: 'Hard' },
  { id: 'jpmorgan', name: 'JPMorgan', logo: 'JP', color: 'from-blue-900 to-slate-800', description: 'Banking systems, security, and enterprise Java.', difficulty: 'Medium' },
  { id: 'morganstanley', name: 'Morgan Stanley', logo: 'MS', color: 'from-slate-700 to-slate-500', description: 'Low latency systems and financial risk.', difficulty: 'Hard' },
  { id: 'citadel', name: 'Citadel', logo: 'Ci', color: 'from-slate-600 to-blue-900', description: 'High-frequency trading, C++, and math.', difficulty: 'Hard' },

  // Consulting & Services
  { id: 'mckinsey', name: 'McKinsey', logo: 'McK', color: 'from-slate-700 to-black', description: 'Case studies, strategy, and market sizing.', difficulty: 'Hard' },
  { id: 'accenture', name: 'Accenture', logo: 'Ac', color: 'from-purple-600 to-indigo-600', description: 'Digital transformation and enterprise tech.', difficulty: 'Medium' },
  { id: 'deloitte', name: 'Deloitte', logo: 'D', color: 'from-green-700 to-green-500', description: 'Tech consulting, auditing, and strategy.', difficulty: 'Medium' },
  { id: 'tcs', name: 'TCS', logo: 'T', color: 'from-pink-600 to-orange-400', description: 'Core technical concepts and aptitude.', difficulty: 'Easy' },
  { id: 'infosys', name: 'Infosys', logo: 'In', color: 'from-blue-600 to-blue-400', description: 'Service projects, Java/Python stack.', difficulty: 'Easy' },
  { id: 'wipro', name: 'Wipro', logo: 'W', color: 'from-green-600 to-cyan-500', description: 'IT services, testing, and support.', difficulty: 'Easy' },
  { id: 'walmart', name: 'Walmart', logo: 'Wa', color: 'from-blue-500 to-yellow-400', description: 'E-commerce, supply chain, and big data.', difficulty: 'Medium' },
];

type InterviewType = 'Technical' | 'HR';

interface RoleOption {
    title: string;
    desc: string;
    icon: any;
    type: InterviewType;
}

// Helper to generate generic roles for companies with similar structures
const getStandardRoles = (): RoleOption[] => [
    { title: 'Software Engineer', desc: 'Full stack development and problem solving.', icon: Code, type: 'Technical' },
    { title: 'Senior Developer', desc: 'System design and team leadership.', icon: Server, type: 'Technical' },
    { title: 'Managerial Round', desc: 'Project management and team fit.', icon: Briefcase, type: 'HR' },
    { title: 'HR Screening', desc: 'Background check and culture fit.', icon: UserCheck, type: 'HR' },
];

const companySpecificRoles: Record<string, RoleOption[]> = {
  google: [
    { title: 'Software Engineer (L3/L4)', desc: 'Generalist SWE, Algorithms & Data Structures.', icon: Code, type: 'Technical' },
    { title: 'Site Reliability Engineer', desc: 'Linux systems, scalability, and automation.', icon: Server, type: 'Technical' },
    { title: 'Product Manager', desc: 'Product strategy, execution, and technical insights.', icon: Users, type: 'Technical' },
    { title: 'Googliness & Leadership', desc: 'Behavioral, culture fit, and hypothetical scenarios.', icon: Heart, type: 'HR' },
    { title: 'Recruiter Screen', desc: 'Resume walkthrough and background check.', icon: UserCheck, type: 'HR' },
  ],
  meta: [
    { title: 'Front End Engineer', desc: 'React architecture, performance, and UI implementation.', icon: Globe, type: 'Technical' },
    { title: 'Production Engineer', desc: 'Hybrid Software/Systems engineering role.', icon: Server, type: 'Technical' },
    { title: 'Data Engineer', desc: 'Big data pipelines and analytics infrastructure.', icon: Database, type: 'Technical' },
    { title: 'Behavioral & Culture', desc: 'Conflict resolution, impact, and collaboration.', icon: MessageSquare, type: 'HR' },
  ],
  nvidia: [
    { title: 'Deep Learning Engineer', desc: 'Neural networks, PyTorch/TensorFlow, optimization.', icon: Cpu, type: 'Technical' },
    { title: 'System Software Engineer', desc: 'OS internals, driver development, C/C++.', icon: Code, type: 'Technical' },
    { title: 'Hardware Engineer', desc: 'Verilog, ASIC design, and computer architecture.', icon: Cpu, type: 'Technical' },
    { title: 'Core Values', desc: 'Innovation, intellectual honesty, and speed.', icon: Heart, type: 'HR' },
  ],
  openai: [
    { title: 'Research Engineer', desc: 'Training LLMs, distributed systems, Python.', icon: Sparkles, type: 'Technical' },
    { title: 'Member of Technical Staff', desc: 'Full-stack AI application development.', icon: Code, type: 'Technical' },
    { title: 'AI Safety Researcher', desc: 'Alignment, robustness, and policy.', icon: Shield, type: 'Technical' },
    { title: 'Culture Fit', desc: 'Mission alignment (AGI benefit) and collaboration.', icon: Heart, type: 'HR' },
  ],
  amazon: [
    { title: 'SDE I / II', desc: 'Core Java/C++, distributed systems, AWS services.', icon: ShoppingBag, type: 'Technical' },
    { title: 'AWS Solutions Architect', desc: 'Cloud architecture and customer guidance.', icon: Server, type: 'Technical' },
    { title: 'Leadership Principles (LP)', desc: 'Customer obsession, ownership, and deep dive.', icon: Heart, type: 'HR' },
    { title: 'Bar Raiser Round', desc: 'High-pressure behavioral and cultural assessment.', icon: Users, type: 'HR' },
  ],
  netflix: [
    { title: 'Senior Software Engineer', desc: 'High autonomy, system design, streaming tech.', icon: Tv, type: 'Technical' },
    { title: 'UI Engineer', desc: 'TV/Web/Mobile interfaces and A/B testing platforms.', icon: Globe, type: 'Technical' },
    { title: 'Culture Memo Fit', desc: 'Freedom and Responsibility, candor, and context.', icon: Heart, type: 'HR' },
  ],
  stripe: [
    { title: 'Backend Engineer', desc: 'API design, Ruby/Go, database consistency.', icon: Server, type: 'Technical' },
    { title: 'Infrastructure Engineer', desc: 'Reliability, observability, and cloud infra.', icon: Cloud, type: 'Technical' },
    { title: 'Integration Engineer', desc: 'Helping customers integrate Stripe APIs.', icon: Code, type: 'Technical' },
    { title: 'Operating Principles', desc: 'Users first, move fast, meticulousness.', icon: Heart, type: 'HR' },
  ],
  uber: [
    { title: 'Backend Engineer', desc: 'Go/Java, high concurrency, microservices.', icon: Server, type: 'Technical' },
    { title: 'Mobile Engineer', desc: 'iOS/Android, app performance, geolocation.', icon: Smartphone, type: 'Technical' },
    { title: 'Data Scientist', desc: 'Marketplace matching, pricing algos, SQL.', icon: LineChart, type: 'Technical' },
    { title: 'Uber Values', desc: 'Go get it, trip obsessed, build with heart.', icon: Heart, type: 'HR' },
  ],
  citadel: [
    { title: 'Quantitative Researcher', desc: 'Statistics, probability, Python/R modeling.', icon: TrendingUp, type: 'Technical' },
    { title: 'Software Engineer (C++)', desc: 'Low latency, memory management, algorithms.', icon: Code, type: 'Technical' },
    { title: 'Trader', desc: 'Market dynamics, risk management, quick math.', icon: DollarSign, type: 'Technical' },
    { title: 'Behavioral', desc: 'Competitive drive, resilience, and teamwork.', icon: Users, type: 'HR' },
  ],
  jpmorgan: [
      { title: 'Software Engineer', desc: 'Java Spring Boot, Microservices, React.', icon: Code, type: 'Technical' },
      { title: 'Business Analyst', desc: 'Requirements gathering, SQL, JIRA.', icon: Briefcase, type: 'Technical' },
      { title: 'Corporate Culture', desc: 'Integrity, client service, and partnership.', icon: Heart, type: 'HR' },
  ],
  salesforce: [
      { title: 'MTS (Member of Tech Staff)', desc: 'Java, Apex, LWC, Distributed Systems.', icon: Cloud, type: 'Technical' },
      { title: 'Solution Engineer', desc: 'Demoing products, technical sales.', icon: Users, type: 'Technical' },
      { title: 'Ohana Culture', desc: 'Trust, customer success, innovation.', icon: Heart, type: 'HR' },
  ],
  tesla: [
      { title: 'Embedded Software Engineer', desc: 'C/C++, RTOS, microcontroller interfacing.', icon: Cpu, type: 'Technical' },
      { title: 'Autopilot Engineer', desc: 'Computer vision, path planning, C++.', icon: Activity, type: 'Technical' },
      { title: 'Mechanical Engineer', desc: 'CAD, materials, thermal systems.', icon: Box, type: 'Technical' },
      { title: 'Hardcore Culture', desc: 'First principles thinking, intensity.', icon: Zap, type: 'HR' },
  ],
  spacex: [
      { title: 'Flight Software Engineer', desc: 'C++, Linux, real-time safety critical systems.', icon: Repeat, type: 'Technical' },
      { title: 'Avionics Engineer', desc: 'Circuit design, sensors, FPGA.', icon: Cpu, type: 'Technical' },
      { title: 'Mission Success', desc: 'Extreme ownership, passion for Mars.', icon: Heart, type: 'HR' },
  ],
  // Fallbacks for others
  infosys: getStandardRoles(),
  tcs: getStandardRoles(),
  wipro: getStandardRoles(),
  accenture: getStandardRoles(),
  deloitte: getStandardRoles(),
  adobe: getStandardRoles(),
  oracle: getStandardRoles(),
  intel: getStandardRoles(),
  walmart: getStandardRoles(),
  coinbase: getStandardRoles(),
  morganstanley: getStandardRoles(),
  airbnb: getStandardRoles(),
};

// Significantly expanded general job profiles
const generalJobProfiles: (RoleOption & { id: string, color: string })[] = [
    // Engineering - Software
    { id: 'sde1', title: 'SDE I (Entry Level)', icon: Code, desc: 'DSA, basic system design, clean code', color: 'bg-blue-500', type: 'Technical' },
    { id: 'sde2', title: 'SDE II (Mid Level)', icon: Server, desc: 'System design, scalability, mentorship', color: 'bg-indigo-500', type: 'Technical' },
    { id: 'sde3', title: 'Senior SDE', icon: Layers, desc: 'Architecture, distributed systems, trade-offs', color: 'bg-purple-600', type: 'Technical' },
    { id: 'staff', title: 'Staff Engineer', icon: Activity, desc: 'Technical strategy, cross-team impact', color: 'bg-fuchsia-600', type: 'Technical' },
    { id: 'em', title: 'Engineering Manager', icon: Users, desc: 'People management, delivery, hiring', color: 'bg-slate-600', type: 'HR' },
    
    // Engineering - Specialized
    { id: 'mobile_ios', title: 'iOS Developer', icon: Smartphone, desc: 'Swift, UIKit, SwiftUI, lifecycle', color: 'bg-sky-500', type: 'Technical' },
    { id: 'mobile_android', title: 'Android Developer', icon: Smartphone, desc: 'Kotlin, Jetpack, Coroutines', color: 'bg-green-500', type: 'Technical' },
    { id: 'game', title: 'Game Developer', icon: Zap, desc: 'Unity/Unreal, C++, 3D Math, Physics', color: 'bg-orange-600', type: 'Technical' },
    { id: 'embedded', title: 'Embedded Engineer', icon: Cpu, desc: 'C/C++, RTOS, Microcontrollers', color: 'bg-teal-600', type: 'Technical' },
    { id: 'qa', title: 'QA Automation', icon: Check, desc: 'Selenium, Cypress, CI/CD pipelines', color: 'bg-lime-500', type: 'Technical' },
    
    // Data & AI
    { id: 'ai_eng', title: 'AI Engineer', icon: Sparkles, desc: 'LLMs, RAG, LangChain, Python', color: 'bg-emerald-500', type: 'Technical' },
    { id: 'ml_eng', title: 'ML Engineer', icon: Brain, desc: 'Model training, deployment, MLOps', color: 'bg-teal-500', type: 'Technical' },
    { id: 'nlp', title: 'NLP Specialist', icon: MessageSquare, desc: 'Transformers, Tokenization, BERT/GPT', color: 'bg-cyan-600', type: 'Technical' },
    { id: 'cv', title: 'Computer Vision Eng', icon: Eye, desc: 'OpenCV, CNNs, Image Processing', color: 'bg-violet-500', type: 'Technical' },
    { id: 'data_eng', title: 'Data Engineer', icon: Database, desc: 'ETL, Spark, Kafka, Warehousing', color: 'bg-blue-700', type: 'Technical' },
    
    // Infrastructure & Security
    { id: 'devops', title: 'DevOps Engineer', icon: Cloud, desc: 'Kubernetes, Terraform, AWS/GCP', color: 'bg-slate-500', type: 'Technical' },
    { id: 'sre', title: 'Site Reliability Eng', icon: Activity, desc: 'Observability, incident response, SLIs', color: 'bg-red-500', type: 'Technical' },
    { id: 'cyber', title: 'Security Engineer', icon: Lock, desc: 'Pen-testing, AppSec, Cryptography', color: 'bg-rose-600', type: 'Technical' },
    { id: 'blockchain', title: 'Blockchain Dev', icon: Link, desc: 'Solidity, Smart Contracts, Web3', color: 'bg-indigo-400', type: 'Technical' },
    
    // Product & Design
    { id: 'pm', title: 'Product Manager', icon: Briefcase, desc: 'Strategy, roadmap, user metrics', color: 'bg-amber-500', type: 'Technical' },
    { id: 'design', title: 'Product Designer', icon: PenTool, desc: 'Figma, UX Research, Prototyping', color: 'bg-pink-500', type: 'Technical' },
    
    // Business & Finance
    { id: 'ba', title: 'Business Analyst', icon: LineChart, desc: 'SQL, Tableau, Requirements', color: 'bg-blue-400', type: 'Technical' },
    { id: 'quant', title: 'Quantitative Analyst', icon: TrendingUp, desc: 'Stochastic calculus, modeling, Python', color: 'bg-slate-700', type: 'Technical' },
    { id: 'sales_eng', title: 'Sales Engineer', icon: DollarSign, desc: 'Technical demos, client relations', color: 'bg-green-600', type: 'Technical' },
    
    // HR
    { id: 'hr_screen', title: 'Recruiter Screen', icon: UserCheck, desc: 'Resume review, background check', color: 'bg-pink-500', type: 'HR' },
    { id: 'behavioral', title: 'Behavioral Round', icon: Heart, desc: 'STAR method, conflict, teamwork', color: 'bg-orange-500', type: 'HR' },
];

const InterviewSelection: React.FC<InterviewSelectionProps> = ({ onSelectContext }) => {
  const [activeTab, setActiveTab] = useState<'company' | 'role'>('company');
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical');
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);

  // --- Views ---

  // 1. Company List View
  const renderCompanyList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in pb-8">
        {companies.map((company) => (
            <div 
                key={company.id}
                onClick={() => setSelectedCompany(company)}
                className="group cursor-pointer bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
            >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${company.color} opacity-10 blur-2xl rounded-full -translate-y-10 translate-x-10 group-hover:opacity-20 transition-opacity`}></div>
                
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-xl font-bold text-white shadow-lg overflow-hidden relative">
                         <div className={`absolute inset-0 bg-gradient-to-br ${company.color} opacity-20`}></div>
                         <span className="relative z-10">{company.logo}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        company.difficulty === 'Hard' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 
                        company.difficulty === 'Medium' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10' :
                        'border-green-500/30 text-green-400 bg-green-500/10'
                    }`}>
                        {company.difficulty}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{company.name}</h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2">{company.description}</p>

                <div className="flex items-center text-indigo-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    View Options <ChevronRight size={16} className="ml-1" />
                </div>
            </div>
        ))}
    </div>
  );

  // 2. Company Detail (Roles) View
  const renderCompanyRoles = () => {
    if (!selectedCompany) return null;
    // Fallback for companies without specific roles defined
    const roles = companySpecificRoles[selectedCompany.id] || getStandardRoles();
    
    // Filter roles based on selected type
    const filteredRoles = roles.filter(r => r.type === interviewType);

    return (
        <div className="animate-fade-in-up pb-8">
            <button 
                onClick={() => setSelectedCompany(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Companies
            </button>
            
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-3xl font-bold text-white shadow-lg overflow-hidden relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${selectedCompany.color} opacity-20`}></div>
                    <span className="relative z-10">{selectedCompany.logo}</span>
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">{selectedCompany.name}</h2>
                    <p className="text-slate-400 flex items-center gap-2">
                        {interviewType} Interviews 
                        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                             {filteredRoles.length} Available
                        </span>
                    </p>
                </div>
            </div>

            {filteredRoles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRoles.map((role, idx) => (
                        <div 
                            key={idx}
                            onClick={() => onSelectContext(selectedCompany.name, role.title)}
                            className="group cursor-pointer bg-slate-800/40 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-xl p-5 transition-all duration-300 flex items-center gap-4"
                        >
                            <div className={`p-3 rounded-lg ${role.type === 'HR' ? 'bg-pink-500/10 text-pink-400 group-hover:bg-pink-500' : 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500'} group-hover:text-white transition-colors`}>
                                <role.icon size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{role.title}</h3>
                                <p className="text-slate-400 text-sm">{role.desc}</p>
                            </div>
                            <ChevronRight size={20} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                    <UserCheck size={32} className="mb-2 opacity-50"/>
                    <p>No {interviewType} roles found for {selectedCompany.name}.</p>
                    <button onClick={() => setInterviewType(interviewType === 'HR' ? 'Technical' : 'HR')} className="text-indigo-400 text-sm mt-2 hover:underline">
                        Switch to {interviewType === 'HR' ? 'Technical' : 'HR'}
                    </button>
                </div>
            )}
        </div>
    );
  };

  // 3. General Job Profiles View
  const renderGeneralProfiles = () => {
    const filteredProfiles = generalJobProfiles.filter(p => p.type === interviewType);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in pb-8">
            {filteredProfiles.map((job) => (
            <div 
                key={job.id}
                onClick={() => onSelectContext('Top Tech Company', job.title)}
                className="group cursor-pointer bg-slate-800/40 hover:bg-slate-800 border border-slate-700 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
            >
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${job.color} bg-opacity-10 text-white`}>
                        <job.icon size={24} className={job.color.replace('bg-', 'text-')} />
                    </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                <p className="text-slate-400 text-sm mb-6">{job.desc}</p>

                <div className="flex items-center text-indigo-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                    Start {interviewType === 'HR' ? 'Screening' : 'Interview'} <ChevronRight size={16} className="ml-1" />
                </div>
            </div>
            ))}
        </div>
    );
  };

  return (
    <div className="p-8 h-full overflow-y-auto relative">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Choose your Interview</h1>
            <p className="text-slate-400">Select a specific job role or a target company.</p>
        </div>
        
        {/* Type Toggle */}
        <div className="bg-slate-900 p-1 rounded-xl flex items-center border border-slate-800">
            <button 
                onClick={() => setInterviewType('Technical')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    interviewType === 'Technical' 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
            >
                <Code size={16} /> Technical
            </button>
            <button 
                onClick={() => setInterviewType('HR')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    interviewType === 'HR' 
                    ? 'bg-slate-800 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
            >
                <Users size={16} /> HR / Behavioral
            </button>
        </div>
      </header>

      {/* Tabs - Only show if not drilling down into a company */}
      {!selectedCompany && (
        <div className="flex space-x-4 mb-8 border-b border-slate-800 pb-1">
            <button 
                onClick={() => setActiveTab('company')}
                className={`pb-3 px-4 text-sm font-semibold transition-all relative ${activeTab === 'company' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
                By Target Company
                {activeTab === 'company' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('role')}
                className={`pb-3 px-4 text-sm font-semibold transition-all relative ${activeTab === 'role' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'}`}
            >
                By Job Profile
                {activeTab === 'role' && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>}
            </button>
        </div>
      )}

      {/* Content Area */}
      {selectedCompany ? (
          renderCompanyRoles()
      ) : activeTab === 'company' ? (
          renderCompanyList()
      ) : (
          renderGeneralProfiles()
      )}
    </div>
  );
};

export default InterviewSelection;
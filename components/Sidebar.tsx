
import React from 'react';
import { ViewState } from '../types';
import { LayoutDashboard, Users, User, LogOut, FileText, Sliders } from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onSignOut?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onSignOut }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.PROFILE, label: 'User Profile', icon: User },
    { id: ViewState.SELECTION, label: 'Mock Interview', icon: Users },
    { id: ViewState.CUSTOM_SETUP, label: 'Custom Interview', icon: Sliders },
    { id: ViewState.REPORTS_LIST, label: 'My Reports', icon: FileText },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div 
        className="p-6 flex items-center gap-3 cursor-pointer group"
        onClick={() => onChangeView(ViewState.DASHBOARD)}
      >
        <div className="w-9 h-9 text-indigo-500 group-hover:text-indigo-400 transition-colors">
            <Logo className="w-full h-full" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight group-hover:text-slate-200 transition-colors">Intervu.AI</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentView === item.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
            onClick={onSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState } from 'react';
import { Terminal, Play, Save, Settings, X } from 'lucide-react';

interface CodeEditorProps {
  problemTitle: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ problemTitle }) => {
  const [code, setCode] = useState(`// Solve: ${problemTitle}\n\nfunction solution(input) {\n  // Write your code here\n  \n  return input;\n}`);

  // Simple line number generation
  const lines = code.split('\n').length;
  
  return (
    <div className="w-full h-full bg-slate-900 flex flex-col rounded-xl overflow-hidden shadow-2xl border border-slate-700 font-mono text-sm">
      {/* Editor Header */}
      <div className="bg-slate-950 border-b border-slate-800 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <div className="flex gap-1.5 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex items-center gap-2 text-slate-400 bg-slate-800/50 px-3 py-1 rounded-md text-xs">
                <Terminal size={12} />
                <span>main.js</span>
            </div>
             <div className="text-slate-500 text-xs ml-2">
                Problem: <span className="text-indigo-400 font-semibold">{problemTitle}</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors">
                <Save size={14} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors">
                <Settings size={14} />
            </button>
            <button className="flex items-center gap-1.5 bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-all">
                <Play size={12} fill="currentColor" /> Run
            </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex overflow-hidden">
         {/* Line Numbers */}
        <div className="w-12 bg-slate-950 text-slate-600 text-right pr-3 pt-4 select-none border-r border-slate-800/50">
            {Array.from({ length: Math.max(lines, 15) }).map((_, i) => (
                <div key={i} className="leading-6">{i + 1}</div>
            ))}
        </div>

        {/* Text Area */}
        <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-[#0d1117] text-slate-300 p-4 outline-none resize-none leading-6 selection:bg-indigo-500/30"
            spellCheck={false}
        />
      </div>

      {/* Terminal / Output (Mock) */}
      <div className="h-32 bg-slate-950 border-t border-slate-800 p-3">
        <div className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Console Output</div>
        <div className="font-mono text-xs text-slate-400">
            <span className="text-green-500">➜</span> Ready to compile...<br/>
            <span className="opacity-50">Waiting for user input...</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
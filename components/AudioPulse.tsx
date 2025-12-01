
import React from 'react';

interface AudioPulseProps {
  active: boolean;
  volume: number; // 0 to 1
}

const AudioPulse: React.FC<AudioPulseProps> = ({ active, volume }) => {
  // Volume usually comes in small, scale it up for visual impact
  // Clamp volume between 0 and 1 for safety, then scale
  const visualVol = Math.min(1, Math.max(0, volume));
  
  // Base size + dynamic size
  const scale = 1 + (visualVol * 1.5); 
  
  return (
    <div className="relative flex items-center justify-center w-40 h-40">
        {/* Ambient Glow */}
        <div className={`absolute inset-0 bg-indigo-500/30 blur-3xl rounded-full transition-all duration-300 ${active ? 'opacity-100' : 'opacity-0'}`} />

        {/* Outer Ring - reacting to volume */}
        <div 
          className={`absolute border-2 border-indigo-400/30 rounded-full transition-all duration-75 ease-out`}
          style={{
            width: active ? `${100 * (1 + visualVol)}%` : '60%',
            height: active ? `${100 * (1 + visualVol)}%` : '60%',
            opacity: active ? 0.5 - (visualVol * 0.3) : 0
          }}
        />

        {/* Middle Ring */}
        <div 
          className={`absolute border border-indigo-300/40 rounded-full transition-all duration-100 ease-out`}
          style={{
            width: active ? `${80 * (1 + visualVol * 0.8)}%` : '50%',
            height: active ? `${80 * (1 + visualVol * 0.8)}%` : '50%',
            opacity: active ? 0.6 : 0
          }}
        />

        {/* Core Circle */}
        <div 
          className={`relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center transition-all duration-200 ${active ? 'shadow-indigo-500/50' : 'shadow-none bg-slate-700'}`}
          style={{
            transform: `scale(${active ? 1 + (visualVol * 0.2) : 1})`
          }}
        >
             {/* Inner Highlight */}
             <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm border border-white/20" />
        </div>
        
        {/* Orbiting Particles (Tailwind Arbitrary Values) */}
        {active && (
            <>
                <div className="absolute w-full h-full animate-[spin_3s_linear_infinite] opacity-40 pointer-events-none">
                    <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]" />
                </div>
                 <div className="absolute w-[80%] h-[80%] animate-[spin_4s_linear_infinite_reverse] opacity-40 pointer-events-none">
                    <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-indigo-300 rounded-full shadow-[0_0_10px_indigo]" />
                </div>
            </>
        )}
    </div>
  );
};

export default AudioPulse;


import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Mic Body Background */}
      <rect x="28" y="15" width="44" height="60" rx="22" fill="currentColor" fillOpacity="0.15" />
      
      {/* Mic Outline */}
      <rect x="28" y="15" width="44" height="60" rx="22" stroke="currentColor" strokeWidth="5" />
      
      {/* Stand */}
      <path d="M50 80 V 95 M 30 95 H 70" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      
      {/* Circuit Nodes */}
      <circle cx="50" cy="35" r="4" fill="currentColor" />
      <circle cx="36" cy="55" r="4" fill="currentColor" />
      <circle cx="64" cy="55" r="4" fill="currentColor" />
      
      {/* Circuit Lines */}
      <path d="M50 35 L 36 55" stroke="currentColor" strokeWidth="3" />
      <path d="M50 35 L 64 55" stroke="currentColor" strokeWidth="3" />
      <path d="M50 25 V 35" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
};

export default Logo;

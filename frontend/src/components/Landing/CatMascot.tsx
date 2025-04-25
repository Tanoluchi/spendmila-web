
import React from 'react';

interface CatMascotProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

const CatMascot: React.FC<CatMascotProps> = ({ 
  size = 'md', 
  className = '',
  animate = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20'
  };
  
  return (
    <div className={`${sizeClasses[size]} ${animate ? 'animate-float' : ''} ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Cat face */}
        <circle cx="50" cy="50" r="40" fill="#9b87f5" />
        
        {/* Eyes */}
        <circle cx="35" cy="40" r="5" fill="white" />
        <circle cx="65" cy="40" r="5" fill="white" />
        <circle cx="35" cy="40" r="2.5" fill="#000" />
        <circle cx="65" cy="40" r="2.5" fill="#000" />
        
        {/* Nose */}
        <path d="M50 55 L46 50 H54 Z" fill="#ff9eb7" />
        
        {/* Mouth */}
        <path d="M45 58 Q50 62 55 58" stroke="#000" strokeWidth="1.5" fill="none" />
        
        {/* Whiskers */}
        <line x1="25" y1="55" x2="40" y2="52" stroke="#000" strokeWidth="1" />
        <line x1="25" y1="58" x2="40" y2="58" stroke="#000" strokeWidth="1" />
        <line x1="25" y1="61" x2="40" y2="64" stroke="#000" strokeWidth="1" />
        
        <line x1="75" y1="55" x2="60" y2="52" stroke="#000" strokeWidth="1" />
        <line x1="75" y1="58" x2="60" y2="58" stroke="#000" strokeWidth="1" />
        <line x1="75" y1="61" x2="60" y2="64" stroke="#000" strokeWidth="1" />
        
        {/* Ears */}
        <path d="M30 20 L25 35 L40 30 Z" fill="#9b87f5" />
        <path d="M70 20 L75 35 L60 30 Z" fill="#9b87f5" />
        <path d="M32 22 L29 32 L38 29 Z" fill="#7E69AB" />
        <path d="M68 22 L71 32 L62 29 Z" fill="#7E69AB" />
      </svg>
    </div>
  );
};

export default CatMascot;

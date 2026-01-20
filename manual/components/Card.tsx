
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', glow = true }) => {
  return (
    <div className={`bg-[#0f0f0f] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all hover:border-white/20 ${className}`}>
      {glow && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
      )}
      {title && <h3 className="text-white text-xl font-bold mb-6 tracking-wide">{title}</h3>}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default Card;

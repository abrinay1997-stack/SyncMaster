
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  // Ajustes de escala basados en el prop 'size'
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-12 h-12' : 'w-16 h-16';
  const titleSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-xl' : 'text-2xl';
  const subSize = size === 'sm' ? 'text-[8px]' : size === 'md' ? 'text-[10px]' : 'text-[12px]';
  const spacing = size === 'sm' ? 'mb-2' : 'mb-4';

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Ícono (Imagen externa con efecto de resplandor de la guía) */}
      <div className={`relative ${iconSize} ${spacing} group`}>
        {/* Resplandor (Glow) */}
        <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
        
        {/* Imagen del Logo actuando como ícono */}
        <img 
          src="https://hostedimages-cdn.aweber-static.com/MjM0MTQ0NQ==/optimized/20657f92efa544489526caee3beef9d2.png" 
          alt="Icon" 
          className="relative w-full h-full object-contain opacity-90"
        />
      </div>

      {/* Texto Principal: LIVESYNC en blanco, PRO con gradiente */}
      <h1 className={`${titleSize} font-bold tracking-[0.2em] leading-none flex items-center`}>
        <span className="text-white">LIVESYNC&nbsp;</span>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          PRO
        </span>
      </h1>

      {/* Subtítulo con estilo Muted y Tracking ancho */}
      <p className={`text-[#666] ${subSize} uppercase tracking-widest mt-1 font-medium`}>
        System Engineering Suite
      </p>
    </div>
  );
};

export default Logo;

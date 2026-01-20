
import React, { useState, useEffect } from 'react';
import { MANUAL_DATA } from '../constants';
import { ChevronDown, ChevronRight, BookOpen, Layers } from 'lucide-react';

interface NavigationProps {
  activeId: string;
  onSelect: (id: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeId, onSelect }) => {
  // Estado para rastrear qué partes están expandidas
  const [expandedParts, setExpandedParts] = useState<Record<string, boolean>>({});

  // Efecto para asegurar que la parte activa siempre esté expandida
  useEffect(() => {
    const activePart = MANUAL_DATA.find(part => 
      part.sections.some(section => section.id === activeId)
    );
    if (activePart) {
      setExpandedParts(prev => ({
        ...prev,
        [activePart.id]: true
      }));
    }
  }, [activeId]);

  const togglePart = (partId: string) => {
    setExpandedParts(prev => ({
      ...prev,
      [partId]: !prev[partId]
    }));
  };

  return (
    <nav className="space-y-3 pb-8">
      {MANUAL_DATA.map((part) => {
        const isExpanded = expandedParts[part.id];
        const hasActiveSection = part.sections.some(s => s.id === activeId);

        return (
          <div key={part.id} className="border-b border-white/5 last:border-0 pb-2">
            <button
              onClick={() => togglePart(part.id)}
              className={`w-full flex items-center justify-between py-4 px-3 rounded-xl transition-all group ${
                hasActiveSection ? 'bg-cyan-500/5' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg transition-colors ${
                  hasActiveSection ? 'bg-cyan-500 text-black' : 'bg-white/5 text-slate-500 group-hover:text-white'
                }`}>
                  <Layers size={14} />
                </div>
                <h4 className={`text-xs uppercase tracking-wider font-extrabold text-left transition-colors ${
                  hasActiveSection ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}>
                  {part.title}
                </h4>
              </div>
              {isExpanded ? (
                <ChevronDown size={14} className={hasActiveSection ? 'text-cyan-400' : 'text-slate-600'} />
              ) : (
                <ChevronRight size={14} className="text-slate-600" />
              )}
            </button>

            {/* Contenedor animado de secciones */}
            <div className={`mt-1 ml-4 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}>
              <div className="pl-4 border-l border-white/10 py-1">
                {part.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => onSelect(section.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-xs transition-all flex items-center justify-between group/item ${
                      activeId === section.id
                        ? 'text-white font-bold bg-white/5'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span className="truncate pr-2">
                      {section.title.split('. ')[1] || section.title}
                    </span>
                    {activeId === section.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default Navigation;

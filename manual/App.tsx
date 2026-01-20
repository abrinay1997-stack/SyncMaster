import React, { useState, useMemo, useEffect } from 'react';
import Logo from './components/Logo';
import Card from './components/Card';
import Navigation from './components/Navigation';
import { MANUAL_DATA } from './constants';
import { SearchResult } from './types';
import { Search, Download, Menu, X, ArrowUpCircle, ChevronRight, ChevronLeft, BookOpen } from 'lucide-react';

const App: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState('welcome');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPrintMode, setIsPrintMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const allSections = useMemo(() => MANUAL_DATA.flatMap(part => part.sections), []);
  const currentSectionIndex = useMemo(() => allSections.findIndex(s => s.id === activeSectionId), [activeSectionId, allSections]);
  const activeSection = useMemo(() => allSections[currentSectionIndex] || allSections[0], [currentSectionIndex, allSections]);

  const navigate = (direction: 'next' | 'prev') => {
    const nextIdx = direction === 'next' ? currentSectionIndex + 1 : currentSectionIndex - 1;
    if (nextIdx >= 0 && nextIdx < allSections.length) {
      handleSectionSelect(allSections[nextIdx].id);
    }
  };

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return null;
    const q = searchQuery.toLowerCase();
    const results: SearchResult[] = [];
    MANUAL_DATA.forEach(part => {
      part.sections.forEach(section => {
        if (section.title.toLowerCase().includes(q) || section.content.some(c => c.toLowerCase().includes(q))) {
          results.push({ partTitle: part.title, section, matchType: 'content' });
        }
      });
    });
    return results;
  }, [searchQuery]);

  const handleSectionSelect = (id: string) => {
    setActiveSectionId(id);
    setIsSidebarOpen(false);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Solución corregida: Renderiza todo oculto para impresión sin afectar la vista normal
  const handleDownloadPDF = () => {
    setIsSidebarOpen(false);
    setIsPrintMode(true);
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Pequeño delay para asegurar que el DOM se actualice
    setTimeout(() => {
      window.print();

      // Desactivar modo impresión cuando se cierra el diálogo
      setIsPrintMode(false);
    }, 300);
  };

  const renderUiLine = (line: string, idx: number) => {
    if (line.startsWith('TABLE:')) {
      const rows = line.replace('TABLE:', '').split('\n').filter(r => r.trim());
      const data = rows.map(r => r.split('|').map(c => c.trim()));
      return (
        <div key={idx} className="my-6 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/5 text-white uppercase text-xs">
              <tr>{data[0].map((cell, i) => <th key={i} className="px-4 py-3 font-bold border-b border-white/10">{cell}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.slice(1).map((row, ri) => (
                <tr key={ri} className="hover:bg-white/[0.02]">
                  {row.map((cell, ci) => <td key={ci} className="px-4 py-3 text-slate-400">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (line.startsWith('CODE:')) {
      return (
        <div key={idx} className="my-4 font-mono text-xs bg-black p-4 rounded-lg border border-cyan-500/20 text-cyan-400 overflow-x-auto">
          {line.replace('CODE:', '')}
        </div>
      );
    }
    const parts = line.split('**');
    return (
      <p key={idx} className="my-2 leading-relaxed">
        {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part)}
      </p>
    );
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 flex flex-col md:flex-row font-sans">
      <aside className={`fixed inset-y-0 left-0 z-[60] w-80 bg-[#06010f] border-r border-white/5 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <Logo size="md" className="mb-8" />
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Navigation activeId={activeSectionId} onSelect={handleSectionSelect} />
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 bg-[#050505] flex flex-col h-screen overflow-y-auto relative">
        <header className="hidden md:flex items-center justify-between px-12 py-6 bg-[#050505]/80 backdrop-blur-xl sticky top-0 z-40 border-b border-white/5">
          <div>
            <h2 className="text-white font-bold text-lg">Manual del Ingeniero</h2>
            <p className="text-cyan-400 text-[10px] uppercase tracking-widest font-bold">LiveSync Pro Engineering</p>
          </div>
          <button
            onClick={handleDownloadPDF}
            disabled={isPrintMode}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xl ${
              isPrintMode ? 'bg-slate-700 text-slate-400 cursor-wait' : 'bg-white text-black hover:bg-slate-200'
            }`}
          >
            {isPrintMode ? (
              <><div className="animate-spin h-3.5 w-3.5 border-2 border-slate-400 border-t-transparent rounded-full"></div> Preparando...</>
            ) : (
              <><Download size={14} /> Descargar PDF</>
            )}
          </button>
        </header>

        <div className="flex-1 p-6 md:p-12 lg:px-24 max-w-5xl mx-auto w-full pb-32">
          {/* Contenido de impresión: Oculto en pantalla, visible solo al imprimir */}
          {isPrintMode && (
            <div className="print-only space-y-16" style={{ display: 'none' }}>
              {MANUAL_DATA.map((part, partIdx) => (
                <div key={partIdx} className="space-y-8">
                  <div className="border-b border-gray-300 pb-4">
                    <h1 className="text-4xl font-extrabold text-black tracking-tight">
                      {part.title}
                    </h1>
                  </div>

                  {part.sections.map((section, secIdx) => (
                    <div key={secIdx} className="space-y-6 no-break">
                      <div className="space-y-3">
                        <span className="text-xs uppercase font-bold text-gray-600 tracking-wider">
                          Sección {section.id.toUpperCase()}
                        </span>
                        <h2 className="text-3xl font-bold text-black tracking-tight">
                          {section.title}
                        </h2>
                      </div>

                      <div className="space-y-4 text-black leading-relaxed">
                        {section.content.map((line, idx) => renderUiLine(line, idx + secIdx * 1000))}
                      </div>

                      {section.subsections && section.subsections.length > 0 && (
                        <div className="mt-8 space-y-8">
                          {section.subsections.map((sub, sidx) => (
                            <div key={sidx} className="space-y-4">
                              <h3 className="text-2xl font-bold text-black">{sub.title}</h3>
                              <div className="space-y-3 pl-4">
                                {sub.content.map((line, lidx) => renderUiLine(line, lidx + sidx * 10000))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Vista normal: Siempre visible en pantalla, oculta al imprimir */}
          <div className={`animate-fade-in space-y-12 ${isPrintMode ? 'screen-only' : ''}`}>
              <div className="space-y-4">
                <span className="text-cyan-400 text-[10px] uppercase font-bold tracking-[0.4em]">Sección {activeSection.id.toUpperCase()}</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tighter leading-tight">
                  {activeSection.title}
                </h1>
              </div>

              <Card className="animate-slide-up">
                <div className="space-y-4 text-slate-400 leading-relaxed text-lg font-light">
                  {activeSection.content.map((line, idx) => renderUiLine(line, idx))}
                </div>

                {activeSection.subsections?.map((sub, sidx) => (
                  <div key={sidx} className="mt-12 space-y-6 border-t border-white/5 pt-12">
                    <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                      {sub.title}
                    </h3>
                    <div className="space-y-4 pl-0 md:pl-5">
                      {sub.content.map((line, lidx) => renderUiLine(line, lidx + 1000))}
                    </div>
                  </div>
                ))}
              </Card>

              <div className="pt-24 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 no-print">
                <button
                  onClick={() => navigate('prev')}
                  disabled={currentSectionIndex === 0}
                  className={`flex flex-col items-start gap-1 group transition-all ${currentSectionIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:-translate-x-2'}`}
                >
                  <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Anterior</span>
                  <div className="flex items-center gap-2 text-white font-bold text-xl"><ChevronLeft size={20} className="text-cyan-500" /> Atrás</div>
                </button>
                <button
                  onClick={() => navigate('next')}
                  disabled={currentSectionIndex === allSections.length - 1}
                  className={`flex flex-col items-end gap-1 group transition-all ${currentSectionIndex === allSections.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:translate-x-2'}`}
                >
                  <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Siguiente</span>
                  <div className="flex items-center gap-2 text-white font-bold text-xl text-right">Continuar <ChevronRight size={20} className="text-purple-500" /></div>
                </button>
              </div>
            </div>
          )}
        </div>

        {showScrollTop && (
          <button onClick={scrollToTop} className="fixed bottom-24 right-8 w-12 h-12 bg-[#1a1a1a]/80 border border-white/10 text-white rounded-full flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-all z-40">
            <ArrowUpCircle size={24} />
          </button>
        )}
      </main>

      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="fixed bottom-8 right-8 w-14 h-14 bg-cyan-500 text-black rounded-2xl shadow-lg flex items-center justify-center z-50 md:hidden">
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );
};

export default App;
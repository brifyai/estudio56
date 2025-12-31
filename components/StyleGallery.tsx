import React, { useState, useMemo } from 'react';
import { FlyerStyleKey, StyleCategory } from '../types';
import { FLYER_STYLES } from '../constants';

interface StyleGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (key: FlyerStyleKey) => void;
}

export const StyleGallery: React.FC<StyleGalleryProps> = ({ isOpen, onClose, onSelect }) => {
  const [activeCategory, setActiveCategory] = useState<StyleCategory>('TODOS');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract categories dynamically to ensure order
  const categories: StyleCategory[] = ['TODOS', 'VENTAS', 'CORPORATIVO', 'LIFESTYLE', 'NOCHE', 'EVENTOS'];

  // Filter Logic
  const filteredStyles = useMemo(() => {
    return (Object.entries(FLYER_STYLES) as [FlyerStyleKey, typeof FLYER_STYLES[FlyerStyleKey]][])
      .filter(([key, config]) => {
        // 1. Category Filter
        const matchesCategory = activeCategory === 'TODOS' || config.category === activeCategory;
        
        // 2. Search Filter
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
            config.label.toLowerCase().includes(query) || 
            config.tags.some(tag => tag.toLowerCase().includes(query)) ||
            config.visualDescription.toLowerCase().includes(query) ||
            config.example.toLowerCase().includes(query);

        // Hide "Identity" as it's a special auto-detected style
        const isPublic = key !== 'brand_identity';

        return matchesCategory && matchesSearch && isPublic;
      });
  }, [activeCategory, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-[#030303] animate-fade-in flex flex-col md:flex-row overflow-hidden">
        
      {/* CLOSE BUTTON */}
      <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors border border-white/5 hover:border-white/20"
      >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      {/* SIDEBAR (Categories) */}
      <aside className="w-full md:w-72 flex-shrink-0 bg-[#0A0A0A] border-b md:border-b-0 md:border-r border-white/5 flex flex-col relative z-20">
          <div className="p-8">
              <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
                  <span className="text-blue-500">❖</span> MATRIZ
              </h2>
              <p className="text-xs text-white/40 font-mono mt-2 pl-1">v2.1.0_FULLSCREEN</p>
          </div>

          <nav className="flex-1 overflow-x-auto md:overflow-y-auto px-6 pb-6 space-x-2 md:space-x-0 md:space-y-1 flex md:block scrollbar-hide">
              {categories.map((cat) => (
                  <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-5 py-4 rounded-xl text-xs font-bold tracking-wider text-left transition-all w-full md:w-auto whitespace-nowrap md:whitespace-normal flex items-center gap-3
                      ${activeCategory === cat 
                          ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.02]' 
                          : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                  >
                      <span className={`w-1.5 h-1.5 rounded-full ${activeCategory === cat ? 'bg-black' : 'bg-white/20'}`}></span>
                      {cat}
                  </button>
              ))}
          </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#030303] relative z-10">
          
          {/* HEADER / SEARCH */}
          <header className="h-24 flex items-center px-8 md:px-12 border-b border-white/5 gap-8 bg-[#030303]/80 backdrop-blur-md sticky top-0 z-30">
              <div className="relative flex-1 max-w-2xl">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-lg">🔍</span>
                  <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Explorar sistema visual (ej. neón, comida, minimalista)..." 
                      className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-base text-white focus:outline-none focus:border-blue-500/50 transition-colors placeholder-white/20"
                      autoFocus
                  />
              </div>
              <div className="text-xs text-white/30 font-mono hidden md:block border border-white/5 px-3 py-1 rounded-md">
                  {filteredStyles.length} RESULTADOS
              </div>
          </header>

          {/* GRID */}
          <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 pb-20">
                  {filteredStyles.map(([key, config]) => (
                      <button
                          key={key}
                          onClick={() => onSelect(key)}
                          className="group relative flex flex-col bg-[#0A0A0A] rounded-[2rem] overflow-hidden aspect-[9/16] border border-white/10 hover:border-blue-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] transition-all duration-500 hover:scale-[1.02] text-left hover:z-20"
                      >
                          {/* Image Background */}
                          <div className="absolute inset-0 w-full h-full">
                              <img 
                                  src={config.previewUrl} 
                                  alt={config.label}
                                  className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-700 grayscale group-hover:grayscale-0"
                                  loading="lazy"
                              />
                              {/* Dark gradient overlay for text readability */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90 transition-opacity duration-500"></div>
                          </div>

                          {/* Top Tags */}
                          <div className="relative z-10 p-5 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-y-4 group-hover:translate-y-0 delay-100">
                              {config.tags.map(tag => (
                                  <span key={tag} className="text-[10px] font-bold bg-black/60 backdrop-blur-md border border-white/10 text-white px-2.5 py-1 rounded-full uppercase tracking-wide">
                                      {tag}
                                  </span>
                              ))}
                          </div>

                          {/* Bottom Content */}
                          <div className="relative z-10 mt-auto p-5 pb-8 transform transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
                              <div className="w-10 h-0.5 bg-blue-500 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              
                              <h3 className="font-black text-white text-2xl leading-none mb-3 drop-shadow-2xl">
                                  {config.label.split('/')[0].trim()}
                              </h3>
                              
                              {/* EXAMPLE CARD - THIS IS NEW */}
                              <div className="bg-white/10 border-l-2 border-green-500 pl-3 py-2 rounded-r-lg backdrop-blur-md mb-2">
                                  <p className="text-[9px] text-green-400 font-bold uppercase mb-1 tracking-wider opacity-80">Caso de Uso:</p>
                                  <p className="text-[10px] text-white italic leading-tight">
                                      "{config.example}"
                                  </p>
                              </div>

                              <p className="text-[10px] text-white/40 font-mono leading-relaxed line-clamp-2 mt-2 group-hover:text-white/60 transition-colors">
                                  {config.visualDescription}
                              </p>
                          </div>
                      </button>
                  ))}
              </div>
              
              {filteredStyles.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-white/20 pb-20">
                      <span className="text-6xl mb-4 opacity-50">🔭</span>
                      <p className="font-mono text-lg">Sin resultados para "{searchQuery}"</p>
                      <button onClick={() => setSearchQuery('')} className="mt-4 text-blue-500 hover:underline">Limpiar búsqueda</button>
                  </div>
              )}
          </div>

      </main>
    </div>
  );
};
import { useRef, useState } from 'react';
import { Upload, Check, Sparkles, Hexagon, Link, Loader2, Globe } from 'lucide-react';
import { Instagram, Facebook } from 'lucide-react';
import { BrandData, ICON_CATEGORIES, ALL_ICONS, IconKey, CategoryKey } from './BrandTypes';

interface BrandSidebarProps {
  brand: BrandData;
  setBrand: React.Dispatch<React.SetStateAction<BrandData>>;
  activeTab: 'identity' | 'colors' | 'typography';
  setActiveTab: (tab: 'identity' | 'colors' | 'typography') => void;
}

export default function BrandSidebar({ brand, setBrand, activeTab, setActiveTab }: BrandSidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);

  // Detectar tipo de URL
  const detectUrlType = (url: string): 'instagram' | 'facebook' | 'tiktok' | 'web' | null => {
    const lower = url.toLowerCase();
    if (lower.includes('instagram.com') || lower.includes('instagr.am')) return 'instagram';
    if (lower.includes('facebook.com') || lower.includes('fb.com')) return 'facebook';
    if (lower.includes('tiktok.com')) return 'tiktok';
    if (lower.startsWith('http://') || lower.startsWith('https://')) return 'web';
    return null;
  };

  // Analizar URL y generar contenido usando IA
  const handleAnalyzeUrl = async () => {
    if (!urlInput.trim()) {
      setUrlError('Ingresa una URL válida');
      return;
    }

    // Asegurar que la URL tenga protocolo
    let normalizedUrl = urlInput.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    const urlType = detectUrlType(normalizedUrl);
    if (!urlType) {
      setUrlError('URL no válida. Usa Instagram, Facebook, TikTok o una página web');
      return;
    }

    setIsAnalyzing(true);
    setUrlError(null);

    try {
      // Llamar a la API Express para analizar la URL con IA
      const response = await fetch('/api/analyze-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al analizar la URL');
      }

      const analysis = await response.json();
      console.log('📊 Análisis de marca recibido:', analysis);

      // Actualizar datos de marca con la información analizada por IA
      setBrand(prev => ({
        ...prev,
        name: analysis.name || prev.name,
        tagline: analysis.tagline || prev.tagline,
        description: analysis.description || prev.description,
        mission: analysis.mission || prev.mission,
        vision: analysis.vision || prev.vision,
        // Si hay logo extraído, usarlo
        ...(analysis.logoUrl ? { 
          logoUrl: analysis.logoUrl, 
          logoMode: 'upload' as const 
        } : {}),
        // Actualizar colores sugeridos
        colors: {
          primary: analysis.colors?.primary || prev.colors.primary,
          secondary: analysis.colors?.secondary || prev.colors.secondary,
          accent: analysis.colors?.accent || prev.colors.accent,
          neutral: analysis.colors?.neutral || prev.colors.neutral,
        },
      }));

      setUrlInput('');
    } catch (error) {
      console.error('Error analizando URL:', error);
      setUrlError(error instanceof Error ? error.message : 'Error al analizar la URL. Intenta de nuevo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getUrlIcon = () => {
    const type = detectUrlType(urlInput);
    if (type === 'instagram') return <Instagram size={14} className="text-pink-400" />;
    if (type === 'facebook') return <Facebook size={14} className="text-blue-400" />;
    if (type === 'tiktok') return <span className="text-xs">🎵</span>;
    if (type === 'web') return <Globe size={14} className="text-green-400" />;
    return <Link size={14} className="text-white/40" />;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBrand(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (key: keyof BrandData['colors'], value: string) => {
    setBrand(prev => ({ ...prev, colors: { ...prev.colors, [key]: value } }));
  };

  const handleFontChange = (type: 'headingFont' | 'bodyFont', value: string) => {
    setBrand(prev => ({ ...prev, typography: { ...prev.typography, [type]: value } }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBrand(prev => ({ ...prev, logoUrl: url, logoMode: 'upload' }));
    }
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/);
    if (words.length === 0) return "B";
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const infiniteDesignRemix = () => {
    const currentCatIcons = Object.keys(ICON_CATEGORIES[brand.genLogoCategory].icons);
    const randomIcon = currentCatIcons[Math.floor(Math.random() * currentCatIcons.length)] as IconKey;
    const layouts = ['vertical', 'horizontal', 'horizontal', 'stacked'] as const;
    const shapes = ['circle', 'square', 'rounded', 'hexagon', 'none', 'none'] as const;
    const styles = ['filled', 'outline', 'duotone', 'soft'] as const;
    const rotations = [0, 0, 0, 45, -15, 180] as const;
    const cases = ['uppercase', 'capitalize', 'lowercase'] as const;
    const trackings = ['tracking-tighter', 'tracking-normal', 'tracking-widest'] as const;
    const scales = [0.9, 1, 1, 1.1] as const;
    setBrand(prev => ({
      ...prev,
      genLogoIcon: randomIcon,
      genLogoLayout: layouts[Math.floor(Math.random() * layouts.length)],
      genLogoShape: shapes[Math.floor(Math.random() * shapes.length)],
      genLogoStyle: styles[Math.floor(Math.random() * styles.length)],
      genLogoRotation: rotations[Math.floor(Math.random() * rotations.length)],
      genLogoTextCase: cases[Math.floor(Math.random() * cases.length)],
      genLogoTracking: trackings[Math.floor(Math.random() * trackings.length)],
      genLogoScale: scales[Math.floor(Math.random() * scales.length)],
    }));
  };

  const fontOptions = [
    { label: "Moderna Sans", value: "ui-sans-serif, system-ui, sans-serif" },
    { label: "Clásica Serif", value: "ui-serif, Georgia, serif" },
    { label: "Técnica Mono", value: "ui-monospace, monospace" },
  ];

  // Mini logo preview
  const MiniLogo = () => {
    const IconComponent = ALL_ICONS[brand.genLogoIcon] || Hexagon;
    const isHorizontal = brand.genLogoLayout === 'horizontal';
    const iconSize = 24;

    let containerStyle: React.CSSProperties = {
      width: 48, height: 48,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transform: `rotate(${brand.genLogoRotation}deg) scale(${brand.genLogoScale})`
    };

    let iconColor = brand.colors.primary;
    if (brand.genLogoShape !== 'none') {
      if (brand.genLogoShape === 'circle') containerStyle.borderRadius = '9999px';
      if (brand.genLogoShape === 'square') containerStyle.borderRadius = '0px';
      if (brand.genLogoShape === 'rounded') containerStyle.borderRadius = '8px';
      if (brand.genLogoShape === 'hexagon') containerStyle.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
      
      if (brand.genLogoStyle === 'filled') {
        containerStyle.backgroundColor = brand.colors.primary;
        iconColor = '#ffffff';
      } else if (brand.genLogoStyle === 'outline') {
        containerStyle.border = `2px solid ${brand.colors.primary}`;
      } else if (brand.genLogoStyle === 'duotone') {
        containerStyle.backgroundColor = brand.colors.secondary;
        iconColor = brand.colors.accent;
      } else if (brand.genLogoStyle === 'soft') {
        containerStyle.backgroundColor = `${brand.colors.primary}20`;
      }
    }

    return (
      <div className={`flex items-center gap-2 ${isHorizontal ? 'flex-row' : 'flex-col'}`}>
        <div style={containerStyle}>
          {brand.genLogoType === 'initials' ? (
            <span className="font-bold text-sm" style={{ color: iconColor }}>{getInitials(brand.name)}</span>
          ) : (
            <IconComponent size={iconSize} color={iconColor} strokeWidth={1.5} />
          )}
        </div>
        <span className={`text-xs font-bold ${brand.genLogoTracking}`} style={{ color: brand.colors.secondary, textTransform: brand.genLogoTextCase as any }}>
          {brand.name.substring(0, 10)}{brand.name.length > 10 ? '...' : ''}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {(['identity', 'colors', 'typography'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/50 hover:text-white/70'}`}>
            {tab === 'identity' ? 'Identidad' : tab === 'colors' ? 'Colores' : 'Fuentes'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {activeTab === 'identity' && (
          <>
            {/* Sección URL para generar contenido */}
            <div className="space-y-3 p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
              <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={12} /> Generar desde URL
              </label>
              <p className="text-[10px] text-white/50">Analiza tu Instagram, Facebook, TikTok o página web para generar el contenido automáticamente</p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {getUrlIcon()}
                  </div>
                  <input
                    type="url"
                    placeholder="https://instagram.com/tumarca"
                    value={urlInput}
                    onChange={(e) => { setUrlInput(e.target.value); setUrlError(null); }}
                    className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-white/30"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAnalyzeUrl}
                  disabled={isAnalyzing || !urlInput.trim()}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-white/30 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {isAnalyzing ? 'Analizando...' : 'Analizar'}
                </button>
              </div>
              {urlError && <p className="text-[10px] text-red-400">{urlError}</p>}
              <div className="flex gap-1 flex-wrap">
                <span className="text-[9px] px-2 py-0.5 bg-pink-500/20 text-pink-300 rounded-full">Instagram</span>
                <span className="text-[9px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full">Facebook</span>
                <span className="text-[9px] px-2 py-0.5 bg-white/10 text-white/50 rounded-full">TikTok</span>
                <span className="text-[9px] px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full">Web</span>
              </div>
            </div>

            <hr className="border-white/10" />

            <div className="space-y-3">
              <label className="block text-[10px] font-bold text-white uppercase tracking-widest">Datos Básicos</label>
              <input type="text" name="name" placeholder="Nombre de la marca" value={brand.name} onChange={handleTextChange} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="text" name="tagline" placeholder="Eslogan" value={brand.tagline} onChange={handleTextChange} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            <hr className="border-white/10" />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-white uppercase tracking-widest">Logo</label>
                <div className="flex bg-white/10 p-0.5 rounded">
                  <button onClick={() => setBrand(p => ({...p, logoMode: 'generated'}))} className={`px-2 py-1 text-[10px] rounded transition-colors ${brand.logoMode === 'generated' ? 'bg-blue-600 text-white' : 'text-white/50'}`}>Generar</button>
                  <button onClick={() => setBrand(p => ({...p, logoMode: 'upload'}))} className={`px-2 py-1 text-[10px] rounded transition-colors ${brand.logoMode === 'upload' ? 'bg-blue-600 text-white' : 'text-white/50'}`}>Subir</button>
                </div>
              </div>

              {brand.logoMode === 'upload' ? (
                <div className="border-2 border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => fileInputRef.current?.click()}>
                  {brand.logoUrl ? <img src={brand.logoUrl} alt="Logo" className="h-12 object-contain mb-2" /> : <Upload className="text-white/30 mb-2" size={20} />}
                  <span className="text-xs text-white/40">{brand.logoUrl ? 'Cambiar' : 'Click para subir'}</span>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl p-4 flex justify-center border border-white/10">
                    <MiniLogo />
                  </div>
                  <button onClick={infiniteDesignRemix} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-3 rounded-xl text-sm font-medium hover:from-indigo-500 hover:to-purple-500 flex items-center justify-center gap-2 transition-all cursor-pointer">
                    <Sparkles size={14} /> Remix Aleatorio
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => setBrand(p => ({...p, genLogoType: 'icon'}))} className={`flex-1 py-1.5 text-xs border rounded-lg transition-colors ${brand.genLogoType === 'icon' ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/10 text-white/50'}`}>Icono</button>
                    <button onClick={() => setBrand(p => ({...p, genLogoType: 'initials'}))} className={`flex-1 py-1.5 text-xs border rounded-lg transition-colors ${brand.genLogoType === 'initials' ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-white/10 text-white/50'}`}>Letras</button>
                  </div>
                  {brand.genLogoType === 'icon' && (
                    <select className="w-full text-xs bg-black/40 border border-white/10 text-white rounded-lg px-3 py-2" value={brand.genLogoCategory} onChange={(e) => setBrand(p => ({...p, genLogoCategory: e.target.value as CategoryKey}))}>
                      {Object.entries(ICON_CATEGORIES).map(([key, cat]) => <option key={key} value={key}>{cat.label}</option>)}
                    </select>
                  )}
                </div>
              )}
            </div>

            <hr className="border-white/10" />

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white uppercase tracking-widest">Filosofía</label>
              <textarea name="description" placeholder="Descripción de la empresa" value={brand.description} onChange={handleTextChange} rows={2} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              <textarea name="mission" placeholder="Misión" value={brand.mission} onChange={handleTextChange} rows={2} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              <textarea name="vision" placeholder="Visión" value={brand.vision} onChange={handleTextChange} rows={2} className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </div>
          </>
        )}

        {activeTab === 'colors' && (
          <div className="space-y-3">
            <p className="text-xs text-white/40">Ajusta los colores de tu marca</p>
            {[
              { label: "Primario", key: "primary" as const, desc: "Color principal" },
              { label: "Secundario", key: "secondary" as const, desc: "Textos y contrastes" },
              { label: "Acento", key: "accent" as const, desc: "Detalles y CTAs" },
              { label: "Neutro", key: "neutral" as const, desc: "Fondos" }
            ].map((color) => (
              <div key={color.key} className="flex gap-3 items-center p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="relative">
                  <input type="color" value={brand.colors[color.key]} onChange={(e) => handleColorChange(color.key, e.target.value)} className="h-10 w-10 rounded-lg cursor-pointer opacity-0 absolute inset-0" />
                  <div className="h-10 w-10 rounded-lg border border-white/20 shadow-inner" style={{backgroundColor: brand.colors[color.key]}} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium text-white block">{color.label}</label>
                  <code className="text-[10px] text-white/40">{brand.colors[color.key]}</code>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-white uppercase tracking-widest mb-2">Títulos</label>
              <div className="space-y-2">
                {fontOptions.map((font) => (
                  <div key={`h-${font.value}`} onClick={() => handleFontChange('headingFont', font.value)} className={`p-3 border rounded-xl cursor-pointer flex justify-between items-center transition-colors ${brand.typography.headingFont === font.value ? 'border-blue-500 bg-blue-500/20' : 'border-white/10 hover:bg-white/5'}`}>
                    <span style={{ fontFamily: font.value }} className="text-white">{font.label}</span>
                    {brand.typography.headingFont === font.value && <Check size={14} className="text-blue-400" />}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white uppercase tracking-widest mb-2">Cuerpo</label>
              <div className="space-y-2">
                {fontOptions.map((font) => (
                  <div key={`b-${font.value}`} onClick={() => handleFontChange('bodyFont', font.value)} className={`p-3 border rounded-xl cursor-pointer flex justify-between items-center transition-colors ${brand.typography.bodyFont === font.value ? 'border-blue-500 bg-blue-500/20' : 'border-white/10 hover:bg-white/5'}`}>
                    <span style={{ fontFamily: font.value }} className="text-white text-sm">{font.label}</span>
                    {brand.typography.bodyFont === font.value && <Check size={14} className="text-blue-400" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export button - Nota informativa */}
      <div className="pt-4">
        <div className="text-center text-xs text-white/40 p-3 bg-white/5 rounded-xl border border-white/10">
          <p>Usa el botón <span className="text-green-400 font-medium">"Exportar PDF"</span> en la barra superior de la vista previa para descargar tu manual.</p>
        </div>
      </div>
    </div>
  );
}
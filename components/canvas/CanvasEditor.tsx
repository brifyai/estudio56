import { useState, useEffect, useRef } from 'react';
import { Download, AlertCircle, LayoutTemplate, Zap, Briefcase, Star, MonitorPlay, Type, Move, Edit3, Sun, Moon, Aperture, Coffee, Box, Leaf, Camera, Building2, Feather } from 'lucide-react';
import Swal from 'sweetalert2';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, options: RequestInit, retries = 2, backoff = 1000) {
  try {
    const response = await fetch(url, options);
    if (response.status === 401 || response.status === 403) {
      throw new Error(`API Key invalida (${response.status}).`);
    }
    if (!response.ok && (response.status === 429 || response.status === 503)) {
      throw new Error(`Server returned ${response.status}`);
    }
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API Error ${response.status}: ${errorBody}`);
    }
    return response;
  } catch (error) {
    if (retries > 0 && !(error instanceof Error && error.message.includes("API Key"))) {
      console.log(`Reintentando... (${retries} intentos restantes)`);
      await wait(backoff);
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    throw error;
  }
}

type BrandData = {
  colors: string[];
  basePrompt: string;
  copy: { headline: string; subhead: string; cta: string; };
  fontCategory: 'serif' | 'sans-serif' | 'display' | 'handwriting';
};

type BrandImages = {
  landscape: string | null;
  portrait: string | null;
  square: string | null;
};

const BANNER_STYLES = [
  { id: 'modern', label: 'Moderno', icon: LayoutTemplate, promptMod: 'EXTREME MINIMALISM. High-key lighting. White background.' },
  { id: 'bold', label: 'Pop', icon: Zap, promptMod: 'POP ART STYLE. Hard flash. High contrast.' },
  { id: 'corporate', label: 'Corporativo', icon: Briefcase, promptMod: 'ARCHITECTURAL & BUSINESS. Modern glass office.' },
  { id: 'luxury', label: 'Lujo', icon: Star, promptMod: 'ULTRA LUXURY DARK MODE. Matte black textures.' },
  { id: 'tech', label: 'Futurista', icon: MonitorPlay, promptMod: 'CYBERPUNK & FUTURE. Dark mode. Neon rim lighting.' },
  { id: 'natural', label: 'Natural', icon: Leaf, promptMod: 'ORGANIC & NATURAL. Soft sunlight. Earthy tones.' },
  { id: 'vintage', label: 'Vintage', icon: Camera, promptMod: 'RETRO FILM PHOTOGRAPHY. Kodak Portra style.' },
  { id: 'industrial', label: 'Industrial', icon: Building2, promptMod: 'URBAN INDUSTRIAL. Concrete textures.' },
  { id: 'pastel', label: 'Pastel', icon: Feather, promptMod: 'SOFT PASTEL DREAM. Ethereal lighting.' },
  { id: 'golden', label: 'Golden Hour', icon: Sun, promptMod: 'GOLDEN HOUR SUNSET. Warm, glowing natural sunlight.' },
  { id: 'editorial', label: 'Editorial', icon: Aperture, promptMod: 'HIGH FASHION EDITORIAL. Vogue magazine style.' },
  { id: 'monochrome', label: 'B&W', icon: Moon, promptMod: 'FINE ART BLACK AND WHITE. High contrast monochrome.' },
  { id: 'rustic', label: 'Rustico', icon: Coffee, promptMod: 'RUSTIC WARMTH. Aged wood textures.' },
  { id: 'isometric', label: '3D Isometrico', icon: Box, promptMod: '3D ISOMETRIC RENDER. Miniature effect.' }
];

// Mapeo de formato a aspect ratio
const FORMAT_TO_AR: Record<string, string> = {
  landscape: '16:9',
  portrait: '9:16',
  square: '1:1'
};

interface CanvasEditorProps {
  aspectRatio?: string;
  onExport?: (imageDataUrl: string) => void;
  onSave?: (canvasData: string) => void;
  urlInput?: string;
  analyzeTrigger?: number;
  activeFormat?: 'landscape' | 'portrait' | 'square';
  selectedStyle?: string;
  onFormatChange?: (format: 'landscape' | 'portrait' | 'square') => void;
  onStyleChange?: (styleId: string) => void;
  onImagesGenerated?: (hasImages: boolean, colors: string[]) => void;
}

export default function CanvasEditor({ 
  onExport, 
  urlInput: externalUrlInput,
  analyzeTrigger,
  activeFormat: externalActiveFormat,
  selectedStyle: externalSelectedStyle,
  onImagesGenerated
}: CanvasEditorProps) {
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [brandImages, setBrandImages] = useState<BrandImages>({ landscape: null, portrait: null, square: null });
  const [activeFormat, setActiveFormat] = useState<'landscape' | 'portrait' | 'square'>('landscape');
  const [selectedStyle, setSelectedStyle] = useState<string>('modern');
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showText, setShowText] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [editableCopy, setEditableCopy] = useState({ headline: '', subhead: '', cta: '' });
  
  // Refs para evitar bucles
  const lastExternalStyle = useRef<string | undefined>(undefined);
  const lastExternalFormat = useRef<string | undefined>(undefined);
  const isRegenerating = useRef(false);
  const isAnalyzing = useRef(false);
  const lastAnalyzeTrigger = useRef<number>(0);

  const generateImage = async (prompt: string, ar = "1:1") => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error("API Key no configurada.");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${key}`;
    const payload = { instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio: ar } };
    const response = await fetchWithRetry(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (data.predictions?.[0]?.bytesBase64Encoded) return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
    throw new Error("No se pudo generar la imagen.");
  };

  // OPTIMIZADO: Genera solo UNA imagen para el formato especificado
  const generateSingleImage = async (data: BrandData, styleId: string, format: 'landscape' | 'portrait' | 'square') => {
    console.log('[CanvasEditor] Generando imagen para formato:', format);
    
    const style = BANNER_STYLES.find(s => s.id === styleId) || BANNER_STYLES[0];
    const finalPrompt = `PURE GRAPHIC/PHOTO ONLY. NO TEXT. SUBJECT: ${data.basePrompt}. STYLE: ${style.promptMod} COLORS: ${data.colors.join(', ')}. 8k resolution.`;
    const ar = FORMAT_TO_AR[format];
    
    const img = await generateImage(finalPrompt, ar);
    return img;
  };

  // Genera imagen inicial (solo 1) al analizar URL
  const generateInitialImage = async (data: BrandData, styleId: string, format: 'landscape' | 'portrait' | 'square') => {
    console.log('[CanvasEditor] Generando imagen inicial para:', format);
    setLoadingStep('generating');
    
    try {
      const img = await generateSingleImage(data, styleId, format);
      
      // Guardar solo la imagen del formato actual
      setBrandImages(prev => ({ ...prev, [format]: img }));
      console.log('[CanvasEditor] Imagen generada - QUITANDO LOADING');
      
      setLoadingStep(null);
      
      if (onImagesGenerated) {
        onImagesGenerated(true, data.colors);
      }
      
    } catch (err: any) {
      console.error('[CanvasEditor] Error generando imagen:', err.message);
      setError(err.message);
      setLoadingStep(null);
    }
  };

  // Genera imagen bajo demanda cuando el usuario cambia de formato
  const generateOnDemand = async (format: 'landscape' | 'portrait' | 'square') => {
    if (!brandData || brandImages[format]) {
      console.log('[CanvasEditor] Imagen ya existe o no hay brandData');
      return;
    }
    
    console.log('[CanvasEditor] Generando imagen bajo demanda para:', format);
    setLoadingStep('generating');
    
    try {
      const img = await generateSingleImage(brandData, selectedStyle, format);
      setBrandImages(prev => ({ ...prev, [format]: img }));
      console.log('[CanvasEditor] Imagen bajo demanda generada');
      setLoadingStep(null);
    } catch (err: any) {
      console.error('[CanvasEditor] Error:', err.message);
      setError(err.message);
      setLoadingStep(null);
    }
  };

  const handleUrlAnalysis = async () => {
    if (isAnalyzing.current) {
      console.log('Ya analizando, ignorando');
      return;
    }
    
    if (!externalUrlInput) {
      Swal.fire({ title: 'Error', text: 'Ingresa una URL', icon: 'warning', background: '#1a1a1a', color: '#fff' });
      return;
    }
    
    console.log('[CanvasEditor] Iniciando analisis de:', externalUrlInput);
    isAnalyzing.current = true;
    setError(null);
    setBrandData(null);
    setBrandImages({ landscape: null, portrait: null, square: null });
    setLoadingStep('analyzing');
    
    const safetyTimeout = setTimeout(() => {
      console.warn('[CanvasEditor] TIMEOUT DE SEGURIDAD');
      setLoadingStep(null);
      setError('El proceso tomo demasiado tiempo. Intenta de nuevo.');
      isAnalyzing.current = false;
    }, 120000);
    
    try {
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      if (!key) throw new Error("API Key no configurada.");
      
      const analysisUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
      const analysisPrompt = `Investiga "${externalUrlInput}". Responde SOLO JSON: {"colors":["#hex1","#hex2"],"basePrompt":"descripcion visual","fontCategory":"sans-serif","copy":{"headline":"Titulo","subhead":"Subtitulo","cta":"Boton"}}`;
      const payload = { contents: [{ parts: [{ text: analysisPrompt }] }], tools: [{ google_search: {} }] };
      
      console.log('[CanvasEditor] Enviando request a Gemini...');
      const resp = await fetchWithRetry(analysisUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await resp.json();
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Sin respuesta de IA.");
      
      let jsonStr = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      
      const branding: BrandData = JSON.parse(jsonStr);
      console.log('[CanvasEditor] Branding:', branding);
      
      setBrandData(branding);
      setEditableCopy(branding.copy);
      
      // OPTIMIZADO: Solo genera 1 imagen (formato actual)
      await generateInitialImage(branding, selectedStyle, activeFormat);
      
      clearTimeout(safetyTimeout);
      
    } catch (err: any) {
      console.error('[CanvasEditor] Error:', err.message);
      setError(err.message);
      setLoadingStep(null);
      clearTimeout(safetyTimeout);
      Swal.fire({ title: 'Error', text: err.message, icon: 'error', background: '#1a1a1a', color: '#fff' });
    } finally {
      isAnalyzing.current = false;
    }
  };

  // Sincronizar formato externo Y generar bajo demanda si no existe
  useEffect(() => {
    if (externalActiveFormat && externalActiveFormat !== lastExternalFormat.current) {
      lastExternalFormat.current = externalActiveFormat;
      setActiveFormat(externalActiveFormat);
      
      // Si hay brandData pero no hay imagen para este formato, generarla
      if (brandData && !brandImages[externalActiveFormat] && !loadingStep) {
        generateOnDemand(externalActiveFormat);
      }
    }
  }, [externalActiveFormat, brandData, brandImages, loadingStep]);

  // Sincronizar estilo externo - al cambiar estilo, regenerar imagen actual
  useEffect(() => {
    if (externalSelectedStyle && externalSelectedStyle !== lastExternalStyle.current) {
      lastExternalStyle.current = externalSelectedStyle;
      setSelectedStyle(externalSelectedStyle);
      
      // Al cambiar estilo, limpiar todas las imagenes y regenerar solo la actual
      if (brandData && !loadingStep && !isRegenerating.current) {
        console.log('[CanvasEditor] Estilo cambiado, regenerando imagen actual');
        isRegenerating.current = true;
        setBrandImages({ landscape: null, portrait: null, square: null });
        generateInitialImage(brandData, externalSelectedStyle, activeFormat).finally(() => {
          isRegenerating.current = false;
        });
      }
    }
  }, [externalSelectedStyle, brandData, loadingStep, activeFormat]);

  // Trigger de analisis
  useEffect(() => {
    if (analyzeTrigger && analyzeTrigger > 0 && analyzeTrigger !== lastAnalyzeTrigger.current && externalUrlInput) {
      console.log('[CanvasEditor] Trigger:', analyzeTrigger);
      lastAnalyzeTrigger.current = analyzeTrigger;
      handleUrlAnalysis();
    }
  }, [analyzeTrigger, externalUrlInput]);

  const handleDownload = () => {
    const img = brandImages[activeFormat];
    if (!img) return;
    if (onExport) onExport(img);
    const link = document.createElement('a');
    link.href = img;
    link.download = `banner-${activeFormat}.png`;
    link.click();
  };

  const getFontStack = (cat: string) => {
    if (cat === 'serif') return 'font-serif';
    if (cat === 'display') return 'font-bold tracking-tighter';
    if (cat === 'handwriting') return 'font-mono italic';
    return 'font-sans';
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const t = e.target as HTMLElement;
    if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    const move = (e: MouseEvent) => { if (isDragging) setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
    const up = () => setIsDragging(false);
    if (isDragging) { window.addEventListener('mousemove', move); window.addEventListener('mouseup', up); }
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [isDragging, dragStart]);

  // Imagen actual a mostrar
  const currentImage = brandImages[activeFormat];

  return (
    <div className="min-h-screen text-white font-sans flex flex-col items-center justify-center relative overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      {error && (
        <div className="absolute top-8 z-40 w-full max-w-3xl px-6">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl text-center flex items-center justify-center gap-2 text-sm border border-red-500/20">
            <AlertCircle className="w-4 h-4"/>{error}
          </div>
        </div>
      )}
      
      <div className="flex-1 w-full h-full flex items-center justify-center p-4 md:p-12 relative z-20">
        {!currentImage && !loadingStep && !brandData && (
          <div className="flex flex-col items-center justify-center h-full text-white w-full">
            <p className="text-sm font-mono text-center">Bienvenido a Estudio 56</p>
            <p className="text-xs text-white/40 mt-2 text-center">Ingresa una URL en el panel lateral</p>
          </div>
        )}
        
        {loadingStep && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 text-lg">{loadingStep === 'analyzing' ? 'Investigando marca...' : 'Generando banner...'}</p>
          </div>
        )}
        
        {currentImage && !loadingStep && (
          <div className={`relative transition-all duration-500 shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10 group ${activeFormat === 'landscape' ? 'w-full max-w-5xl aspect-video' : ''} ${activeFormat === 'portrait' ? 'h-[80vh] aspect-[9/16]' : ''} ${activeFormat === 'square' ? 'h-[80vh] aspect-square' : ''}`}>
            <img src={currentImage} alt="Banner" className="w-full h-full object-cover select-none pointer-events-none"/>
            {brandData && showText && (
              <div className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center cursor-move z-20" style={{ transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))` }} onMouseDown={handleMouseDown}>
                <div className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 ${isDragging ? 'opacity-100' : 'opacity-0'}`}><Move className="w-3 h-3"/> Arrastrar</div>
                <div className="flex flex-col items-center text-center max-w-lg bg-black/20 hover:bg-black/40 backdrop-blur-[2px] p-6 rounded-2xl border border-white/0 hover:border-white/20 transition-all">
                  <div contentEditable suppressContentEditableWarning onBlur={(e) => setEditableCopy({...editableCopy, headline: e.currentTarget.innerText})} className={`text-4xl md:text-5xl font-black text-white mb-3 drop-shadow-xl outline-none min-w-[200px] cursor-text ${getFontStack(brandData.fontCategory)}`} style={{ textShadow: '0 4px 10px rgba(0,0,0,0.6)' }}>{editableCopy.headline}</div>
                  <div contentEditable suppressContentEditableWarning onBlur={(e) => setEditableCopy({...editableCopy, subhead: e.currentTarget.innerText})} className="text-lg text-white/95 font-medium mb-6 drop-shadow-md outline-none min-w-[150px] cursor-text">{editableCopy.subhead}</div>
                  <button className="px-8 py-3 rounded-full font-bold text-lg shadow-xl" style={{ backgroundColor: brandData.colors[0] || '#fff', color: brandData.colors[1] || '#000' }}>
                    <span contentEditable suppressContentEditableWarning onBlur={(e) => setEditableCopy({...editableCopy, cta: e.currentTarget.innerText})} className="outline-none cursor-text">{editableCopy.cta}</span>
                  </button>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-50 text-[10px] text-white flex gap-1"><Edit3 className="w-3 h-3"/> Click para editar</div>
                </div>
              </div>
            )}
            <div className="absolute top-4 left-4 z-30">
              <button onClick={() => setShowText(!showText)} className={`bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur ${!showText ? 'opacity-50' : ''}`}><Type className="w-4 h-4"/></button>
            </div>
            <button onClick={handleDownload} className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur opacity-0 group-hover:opacity-100 z-30"><Download className="w-5 h-5"/></button>
          </div>
        )}
      </div>
    </div>
  );
}

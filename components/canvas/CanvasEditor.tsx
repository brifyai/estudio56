import { useState, useEffect, useRef } from 'react';
import { Download, AlertCircle, LayoutTemplate, Zap, Briefcase, Star, MonitorPlay, Type, Move, Edit3, Sun, Moon, Aperture, Coffee, Box, Leaf, Camera, Building2, Feather } from 'lucide-react';
import Swal from 'sweetalert2';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, options: RequestInit, retries = 2, backoff = 1000) {
  try {
    const response = await fetch(url, options);
    if (response.status === 401 || response.status === 403) {
      throw new Error('API Key invalida (' + response.status + ').');
    }
    if (!response.ok && (response.status === 429 || response.status === 503)) {
      throw new Error('Server returned ' + response.status);
    }
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error('API Error ' + response.status + ': ' + errorBody);
    }
    return response;
  } catch (error) {
    if (retries > 0 && !(error instanceof Error && error.message.includes("API Key"))) {
      console.log('Reintentando... (' + retries + ' intentos restantes)');
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
  { id: 'modern', label: 'Moderno', icon: LayoutTemplate, promptMod: 'minimalist high-key lighting white background' },
  { id: 'bold', label: 'Pop', icon: Zap, promptMod: 'pop art style hard flash high contrast' },
  { id: 'corporate', label: 'Corporativo', icon: Briefcase, promptMod: 'modern glass office architectural' },
  { id: 'luxury', label: 'Lujo', icon: Star, promptMod: 'luxury dark mode matte black textures' },
  { id: 'tech', label: 'Futurista', icon: MonitorPlay, promptMod: 'cyberpunk neon rim lighting dark mode' },
  { id: 'natural', label: 'Natural', icon: Leaf, promptMod: 'organic natural soft sunlight earthy tones' },
  { id: 'vintage', label: 'Vintage', icon: Camera, promptMod: 'retro film photography kodak portra style' },
  { id: 'industrial', label: 'Industrial', icon: Building2, promptMod: 'urban industrial concrete textures' },
  { id: 'pastel', label: 'Pastel', icon: Feather, promptMod: 'soft pastel dream ethereal lighting' },
  { id: 'golden', label: 'Golden Hour', icon: Sun, promptMod: 'golden hour sunset warm glowing sunlight' },
  { id: 'editorial', label: 'Editorial', icon: Aperture, promptMod: 'high fashion editorial vogue style' },
  { id: 'monochrome', label: 'B&W', icon: Moon, promptMod: 'fine art black and white high contrast' },
  { id: 'rustic', label: 'Rustico', icon: Coffee, promptMod: 'rustic warmth aged wood textures' },
  { id: 'isometric', label: '3D Isometrico', icon: Box, promptMod: '3d isometric render miniature effect' }
];

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
  
  const lastExternalStyle = useRef<string | undefined>(undefined);
  const lastExternalFormat = useRef<string | undefined>(undefined);
  const isRegenerating = useRef(false);
  const isAnalyzing = useRef(false);
  const lastAnalyzeTrigger = useRef<number>(0);

  const generateImage = async (prompt: string, ar = "1:1") => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error("API Key no configurada.");
    
    console.log('[generateImage] Generando ' + ar + '...');
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=' + key;
    const payload = { instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio: ar } };
    
    try {
      const response = await fetchWithRetry(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await response.json();
      
      if (data.predictions?.[0]?.bytesBase64Encoded) {
        console.log('[generateImage] ' + ar + ' generada OK');
        return 'data:image/png;base64,' + data.predictions[0].bytesBase64Encoded;
      }
      
      console.error('[generateImage] ' + ar + ' - Sin imagen:', JSON.stringify(data).substring(0, 500));
      throw new Error('Sin imagen (' + ar + '): ' + (data.error?.message || 'respuesta vacia'));
    } catch (err: any) {
      console.error('[generateImage] ' + ar + ' - Error:', err.message);
      throw err;
    }
  };

  const generateAssetsForStyle = async (data: BrandData, styleId: string) => {
    console.log('[CanvasEditor] GENERANDO con estilo:', styleId);
    setLoadingStep('generating');
    
    try {
      const style = BANNER_STYLES.find(s => s.id === styleId) || BANNER_STYLES[0];
      const baseSubject = data.basePrompt.replace(/[^\w\s,.-]/g, ' ').trim();
      const colorHints = data.colors.slice(0, 2).join(' and ');
      const finalPrompt = 'Professional studio photography of ' + baseSubject + ', ' + style.promptMod + ', color palette ' + colorHints + ', no text no words no letters no watermarks, 8k quality, anatomically correct humans';
      
      console.log('[CanvasEditor] Prompt:', finalPrompt);
      
      const results = await Promise.all([
        generateImage(finalPrompt, "16:9").catch(e => { console.error('Landscape:', e.message); return null; }),
        generateImage(finalPrompt, "9:16").catch(e => { console.error('Portrait:', e.message); return null; }),
        generateImage(finalPrompt, "1:1").catch(e => { console.error('Square:', e.message); return null; })
      ]);
      
      const [landscapeImg, portraitImg, squareImg] = results;
      console.log('Resultados:', { landscape: !!landscapeImg, portrait: !!portraitImg, square: !!squareImg });
      
      if (!landscapeImg && !portraitImg && !squareImg) {
        throw new Error('No se pudo generar ninguna imagen. Verifica tu API Key.');
      }
      
      setBrandImages({ landscape: landscapeImg, portrait: portraitImg, square: squareImg });
      setLoadingStep(null);
      
      if (onImagesGenerated) onImagesGenerated(true, data.colors);
      
    } catch (err: any) {
      console.error('Error:', err.message);
      setError(err.message);
      setLoadingStep(null);
    }
  };

  const handleUrlAnalysis = async () => {
    if (isAnalyzing.current || !externalUrlInput) return;
    
    console.log('Analizando:', externalUrlInput);
    isAnalyzing.current = true;
    setError(null);
    setBrandData(null);
    setBrandImages({ landscape: null, portrait: null, square: null });
    setLoadingStep('analyzing');
    
    const safetyTimeout = setTimeout(() => {
      setLoadingStep(null);
      setError('Timeout. Intenta de nuevo.');
      isAnalyzing.current = false;
    }, 120000);
    
    try {
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      if (!key) throw new Error("API Key no configurada.");
      
      const analysisUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + key;
      
      // Prompt mejorado para detectar colores reales de la marca
      const analysisPrompt = 'Analiza la marca en "' + externalUrlInput + '" usando Google Search. EXTRAE LOS COLORES REALES del logo y sitio web de la marca. INSTRUCCIONES: 1) Busca el sitio web real y encuentra los colores del logo, header, botones. 2) Para PILATES/YOGA/SPA usa colores calidos como coral #E8967A, salmon #FA8072, sage #9DC183. 3) Para TECH usa azules #3B82F6, morados #8B5CF6. 4) Para RESTAURANTES usa rojos #DC2626, naranjas #F97316. 5) NUNCA uses negro #000000 o blanco #FFFFFF como primario. RESPONDE SOLO JSON: {"colors":["#colorPrimarioReal","#colorSecundarioReal"],"basePrompt":"escena visual profesional en ingles","fontCategory":"sans-serif","copy":{"headline":"Titulo en espanol","subhead":"Subtitulo en espanol","cta":"Boton en espanol"}}';
      
      const payload = { 
        contents: [{ parts: [{ text: analysisPrompt }] }], 
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.2, topP: 0.9 }
      };
      
      const resp = await fetchWithRetry(analysisUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const data = await resp.json();
      
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Sin respuesta de IA.");
      
      console.log('Respuesta raw de Gemini:', text.substring(0, 300));
      
      let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("La IA no devolvio JSON valido. Intenta de nuevo.");
      }
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      
      const branding: BrandData = JSON.parse(jsonStr);
      console.log('Branding detectado:', branding);
      console.log('Colores detectados:', branding.colors);
      
      setBrandData(branding);
      setEditableCopy(branding.copy);
      
      await generateAssetsForStyle(branding, selectedStyle);
      clearTimeout(safetyTimeout);
      
    } catch (err: any) {
      console.error('Error:', err.message);
      setError(err.message);
      setLoadingStep(null);
      clearTimeout(safetyTimeout);
      Swal.fire({ title: 'Error', text: err.message, icon: 'error', background: '#1a1a1a', color: '#fff' });
    } finally {
      isAnalyzing.current = false;
    }
  };

  useEffect(() => {
    if (externalActiveFormat && externalActiveFormat !== lastExternalFormat.current) {
      lastExternalFormat.current = externalActiveFormat;
      setActiveFormat(externalActiveFormat);
    }
  }, [externalActiveFormat]);

  useEffect(() => {
    if (externalSelectedStyle && externalSelectedStyle !== lastExternalStyle.current) {
      lastExternalStyle.current = externalSelectedStyle;
      setSelectedStyle(externalSelectedStyle);
      
      if (brandData && !loadingStep && !isRegenerating.current) {
        isRegenerating.current = true;
        generateAssetsForStyle(brandData, externalSelectedStyle).finally(() => {
          isRegenerating.current = false;
        });
      }
    }
  }, [externalSelectedStyle, brandData, loadingStep]);

  useEffect(() => {
    if (analyzeTrigger && analyzeTrigger > 0 && analyzeTrigger !== lastAnalyzeTrigger.current && externalUrlInput) {
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
    link.download = 'banner-' + activeFormat + '.png';
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

  return (
    <div className="min-h-screen text-white font-sans flex flex-col items-center justify-center relative overflow-hidden bg-[#030303] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      
      {error && (
        <div className="absolute top-8 z-40 w-full max-w-3xl px-6">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-xl text-center flex items-center justify-center gap-2 text-sm border border-red-500/20">
            <AlertCircle className="w-4 h-4"/>{error}
          </div>
        </div>
      )}
      
      <div className="flex-1 w-full h-full flex items-center justify-center p-4 md:p-12 relative z-20">
        {!brandImages.landscape && !loadingStep && (
          <div className="flex flex-col items-center justify-center h-full text-white w-full">
            <p className="text-sm font-mono text-center">Bienvenido a Estudio 56</p>
            <p className="text-xs text-white/40 mt-2 text-center">Ingresa una URL en el panel lateral</p>
          </div>
        )}
        
        {loadingStep && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 text-lg">{loadingStep === 'analyzing' ? 'Investigando marca...' : 'Diseñando banners...'}</p>
          </div>
        )}
        
        {brandImages.landscape && !loadingStep && (
          <div className={`relative transition-all duration-500 shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10 group ${activeFormat === 'landscape' ? 'w-full max-w-5xl aspect-video' : ''} ${activeFormat === 'portrait' ? 'h-[80vh] aspect-[9/16]' : ''} ${activeFormat === 'square' ? 'h-[80vh] aspect-square' : ''}`}>
            {brandImages[activeFormat] ? <img src={brandImages[activeFormat]!} alt="Banner" className="w-full h-full object-cover select-none pointer-events-none"/> : <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center text-gray-500">Cargando...</div>}
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

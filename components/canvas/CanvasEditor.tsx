import { useState, useEffect, useRef } from 'react';
import { Monitor, Smartphone, Square, Download, AlertCircle, Palette, LayoutTemplate, Zap, Briefcase, Star, MonitorPlay, Type, Move, Edit3, Sun, Moon, Aperture, Coffee, Box, Leaf, Camera, Building2, Feather } from 'lucide-react';
import Swal from 'sweetalert2';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, options: RequestInit, retries = 5, backoff = 1000) {
  try {
    const response = await fetch(url, options);
    if (response.status === 401 || response.status === 403) {
      throw new Error(`API Key inválida o no autorizada (${response.status}). Por favor configura tu API Key.`);
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
  { id: 'modern', label: 'Moderno / Minimal', icon: LayoutTemplate, promptMod: 'EXTREME MINIMALISM. High-key lighting (very bright). White background studio photography. Soft shadows. Apple-style aesthetics. Objects floating in white space. Clean lines. Pastel tones.' },
  { id: 'bold', label: 'Pop / Vibrante', icon: Zap, promptMod: 'POP ART STYLE. Hard flash photography. High contrast. Hyper-saturated colors. Color blocking. Dramatic hard shadows. Experimental camera angles (Dutch angle). Memphis design elements. Energetic and loud.' },
  { id: 'corporate', label: 'Corporativo / Pro', icon: Briefcase, promptMod: 'ARCHITECTURAL & BUSINESS. Modern glass office environment background. Bokeh depth of field. Cold blue and grey tones. Symmetrical composition. Trustworthy, clean, stock photo quality. Steel and glass textures.' },
  { id: 'luxury', label: 'Lujo / Dark', icon: Star, promptMod: 'ULTRA LUXURY DARK MODE. Matte black textures (obsidian, slate, velvet). Cinematic rim lighting (gold or silver glints). Deep shadows and high contrast. Sophisticated, mysterious atmosphere. High-end jewelry or perfume commercial aesthetic. Sharp focus on premium materials.' },
  { id: 'tech', label: 'Futurista / Neon', icon: MonitorPlay, promptMod: 'CYBERPUNK & FUTURE. Dark mode background. Neon rim lighting (cyan and magenta). Glowing grid lines. 3D Render style (Octane render). Glossy reflective surfaces. Abstract data streams. High-tech aesthetics.' },
  { id: 'natural', label: 'Natural / Eco', icon: Leaf, promptMod: 'ORGANIC & NATURAL. Soft sunlight dappled through leaves (gobo lighting). Earthy tones and textures (wood, stone, linen). Fresh, airy atmosphere. Botanical elements. Wellness and eco-friendly aesthetic.' },
  { id: 'vintage', label: 'Vintage / Film', icon: Camera, promptMod: 'RETRO FILM PHOTOGRAPHY. Kodak Portra style. 35mm film grain. Light leaks. Warm, nostalgic color palette. 1980s aesthetic. Soft focus. Analog textures.' },
  { id: 'industrial', label: 'Industrial / Urbano', icon: Building2, promptMod: 'URBAN INDUSTRIAL. Concrete textures. Brushed metal. Street photography vibe. Harsh sunlight or city night lights. Raw, edgy atmosphere. Streetwear brand aesthetic.' },
  { id: 'pastel', label: 'Pastel / Soft', icon: Feather, promptMod: 'SOFT PASTEL DREAM. Ethereal lighting. Low contrast. Cotton candy colors. Very soft focus. Delicate textures. Airy and light. Skincare or confectionery aesthetic.' },
  { id: 'golden', label: 'Golden Hour', icon: Sun, promptMod: 'GOLDEN HOUR SUNSET. Warm, glowing natural sunlight. Lens flare. Backlit subjects. Romantic and optimistic atmosphere. Outdoor setting. Orange and gold tones. Soft long shadows.' },
  { id: 'editorial', label: 'Editorial / Moda', icon: Aperture, promptMod: 'HIGH FASHION EDITORIAL. Vogue magazine style. Sharp, crisp focus. Dramatic posing. Studio lighting with softbox. Clean background but with personality. Sophisticated and trendy.' },
  { id: 'monochrome', label: 'B&W / Artístico', icon: Moon, promptMod: 'FINE ART BLACK AND WHITE. Ansel Adams style. High contrast monochrome. Rich blacks and bright whites. Artistic grain. Dramatic composition. Timeless and classic.' },
  { id: 'rustic', label: 'Rústico / Hogar', icon: Coffee, promptMod: 'RUSTIC WARMTH. Aged wood textures. Woven textiles. Warm indoor lighting (incandescent). Cozy atmosphere (Hygge). Handcrafted vibes. Brown and beige tones.' },
  { id: 'isometric', label: '3D Isométrico', icon: Box, promptMod: '3D ISOMETRIC RENDER. Miniature effect. Clean, matte materials (clay render style). Uniform studio lighting. Orthographic view. Playful but professional. Tech startup illustration style.' }
];

interface CanvasEditorProps {
  aspectRatio?: string;
  onExport?: (imageDataUrl: string) => void;
  onSave?: (canvasData: string) => void;
  urlInput?: string;
  onUrlInputChange?: (url: string) => void;
  analyzeTrigger?: number;
  loadingStep?: string | null;
  error?: string | null;
}

export default function CanvasEditor({ 
  aspectRatio: aspectRatioProp, 
  onExport, 
  onSave,
  urlInput: externalUrlInput,
  onUrlInputChange,
  analyzeTrigger,
  loadingStep: externalLoadingStep,
  error: externalError
}: CanvasEditorProps = {}) {
  const [internalUrlInput, setInternalUrlInput] = useState('');
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [brandImages, setBrandImages] = useState<BrandImages>({ landscape: null, portrait: null, square: null });
  
  const urlInput = externalUrlInput !== undefined ? externalUrlInput : internalUrlInput;
  
  const getInitialFormat = (): 'landscape' | 'portrait' | 'square' => {
    if (aspectRatioProp === '9:16') return 'portrait';
    if (aspectRatioProp === '1:1') return 'square';
    return 'landscape';
  };
  
  const [activeFormat, setActiveFormat] = useState<'landscape' | 'portrait' | 'square'>(getInitialFormat());
  const [selectedStyle, setSelectedStyle] = useState<string>('modern');
  const [internalLoadingStep, setInternalLoadingStep] = useState<string | null>(null);
  const [internalError, setInternalError] = useState<string | null>(null);
  
  const loadingStep = externalLoadingStep !== undefined ? externalLoadingStep : internalLoadingStep;
  const setLoadingStep = externalLoadingStep !== undefined ? (() => {}) : setInternalLoadingStep;
  const error = externalError !== undefined ? externalError : internalError;
  const setError = externalError !== undefined ? (() => {}) : setInternalError;
  
  const [showText, setShowText] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [editableCopy, setEditableCopy] = useState({ headline: '', subhead: '', cta: '' });
  const textContainerRef = useRef<HTMLDivElement>(null);

  const generateImage = async (prompt: string, aspectRatio = "1:1") => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error("API Key no configurada. Contacta al administrador.");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${key}`;
    const payload = { instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio } };
    const response = await fetchWithRetry(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (data.predictions?.[0]?.bytesBase64Encoded) return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
    throw new Error("No se pudo generar la imagen.");
  };

  const generateAssetsForStyle = async (data: BrandData, styleId: string) => {
    setLoadingStep('generating');
    setBrandImages({ landscape: null, portrait: null, square: null });
    setPosition({ x: 0, y: 0 });
    try {
      const style = BANNER_STYLES.find(s => s.id === styleId) || BANNER_STYLES[0];
      const finalPrompt = `IMPORTANT: PURE GRAPHIC/PHOTO ONLY. NO TEXT. NO NUMBERS. NO HEX CODES. NO ALPHANUMERIC CHARACTERS.
Create a high-quality image.
SUBJECT: ${data.basePrompt}.
>>> VISUAL STYLE (STRICT): ${style.promptMod} <<<
COLORS: Incorporate nuances of ${data.colors.join(', ')} into the style described above.
COMPOSITION: Rule of Thirds. Off-center subject to leave negative space for text.
Technical: 8k resolution, photorealistic or 3D render depending on style.`;
      const [landscapeImg, portraitImg, squareImg] = await Promise.all([
        generateImage(finalPrompt, "16:9"),
        generateImage(finalPrompt, "9:16"),
        generateImage(finalPrompt, "1:1")
      ]);
      setBrandImages({ landscape: landscapeImg, portrait: portraitImg, square: squareImg });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingStep(null);
    }
  };

  const handleUrlAnalysis = async () => {
    console.log('🔍 [CanvasEditor] handleUrlAnalysis iniciado con URL:', urlInput);
    if (!urlInput) {
      console.log('❌ [CanvasEditor] No hay URL para analizar');
      return;
    }
    setError(null);
    setBrandData(null);
    setBrandImages({ landscape: null, portrait: null, square: null });
    setActiveFormat('landscape');
    setLoadingStep('analyzing');
    try {
      const key = import.meta.env.VITE_GEMINI_API_KEY;
      console.log('🔑 [CanvasEditor] API Key disponible:', !!key);
      if (!key) throw new Error("API Key no configurada. Contacta al administrador.");
      const analysisUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
      const analysisPrompt = `Investiga en profundidad el sitio web o marca: "${urlInput}" usando Google Search.
Busca su identidad visual, colores, logotipos y qué venden.
Luego, actúa como un Copywriter y Director de Arte Experto y genera un plan de diseño.
Responde EXCLUSIVAMENTE con un objeto JSON válido.
Estructura requerida:
{
  "colors": ["#hex1", "#hex2", "#hex3", "#hex4"],
  "basePrompt": "Descripción visual FÍSICA para una foto de stock basada en lo que vende la marca. NO uses palabras abstractas.",
  "fontCategory": "sans-serif" (o "serif", "display", "handwriting"),
  "copy": {
    "headline": "Titular Publicitario Corto e Impactante (Máx 5 palabras)",
    "subhead": "Subtítulo persuasivo breve (Máx 8 palabras)",
    "cta": "Texto del Botón (ej: Compra Ahora)"
  }
}`;
      const payload = {
        contents: [{ parts: [{ text: analysisPrompt }] }],
        tools: [{ google_search: {} }]
      };
      console.log('�� [CanvasEditor] Enviando request a Gemini...');
      const analysisResp = await fetchWithRetry(analysisUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log('📥 [CanvasEditor] Respuesta recibida, parseando...');
      const analysisData = await analysisResp.json();
      console.log('📊 [CanvasEditor] Datos de análisis:', analysisData);
      const text = analysisData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No se pudo analizar la URL (sin respuesta de IA).");
      console.log('📝 [CanvasEditor] Texto de respuesta:', text.substring(0, 200) + '...');
      let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      }
      let branding: BrandData;
      try {
        branding = JSON.parse(jsonStr);
        console.log('✅ [CanvasEditor] Branding parseado:', branding);
      } catch (e) {
        console.error("Error parsing JSON:", e, jsonStr);
        throw new Error("La IA no devolvió un formato válido. Intenta de nuevo.");
      }
      setBrandData(branding);
      setEditableCopy(branding.copy);
      console.log('🎨 [CanvasEditor] Generando imágenes con estilo:', selectedStyle);
      await generateAssetsForStyle(branding, selectedStyle);
      
      console.log('✅ [CanvasEditor] Análisis completado, cerrando alerta');
      if (typeof Swal !== 'undefined') {
        Swal.close();
      }
    } catch (err: any) {
      console.error('❌ [CanvasEditor] Error en análisis:', err);
      setError(err.message);
      setLoadingStep(null);
      
      if (typeof Swal !== 'undefined') {
        Swal.close();
        setTimeout(() => {
          Swal.fire({
            title: '⚠️ Error',
            text: err.message || 'Error analizando la URL',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#ef4444',
            background: '#1a1a1a',
            color: '#ffffff'
          });
        }, 100);
      }
    } finally {
      setLoadingStep(null);
    }
  };

  const handleStyleChange = (newStyleId: string) => {
    if (!brandData || loadingStep) return;
    setSelectedStyle(newStyleId);
    generateAssetsForStyle(brandData, newStyleId);
  };

  const handleDownload = async () => {
    try {
      const currentImage = brandImages[activeFormat];
      if (!currentImage) return;
      
      if (onExport) {
        onExport(currentImage);
      }
      
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = `banner-${activeFormat}.png`;
      link.click();
      
      if (onSave && brandData) {
        const canvasData = JSON.stringify({
          brandData,
          brandImages,
          activeFormat,
          selectedStyle,
          editableCopy,
          position,
          showText,
          timestamp: new Date().toISOString()
        });
        onSave(canvasData);
      }
    } catch (error) {
      console.error('Error al descargar:', error);
    }
  };

  const getFontStack = (category: string) => {
    switch(category) {
      case 'serif': return 'font-serif';
      case 'display': return 'font-bold tracking-tighter';
      case 'handwriting': return 'font-mono italic';
      default: return 'font-sans';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    };
    const handleMouseUp = () => { setIsDragging(false); };
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Efecto para ejecutar análisis cuando cambia el trigger (mayor que 0)
  useEffect(() => {
    if (analyzeTrigger && analyzeTrigger > 0 && externalUrlInput && externalUrlInput.trim()) {
      console.log('🔍 [CanvasEditor] Trigger detectado, ejecutando análisis:', externalUrlInput, 'Trigger:', analyzeTrigger);
      handleUrlAnalysis();
    }
  }, [analyzeTrigger]);

  return (
    <div className="min-h-screen text-white font-sans flex flex-col items-center justify-center relative overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100">
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
            <p className="text-sm md:text-base font-mono tracking-wider text-center px-4">
              Bienvenido a Estudio 56
            </p>
            <p className="text-xs text-white/40 mt-2 text-center px-4">
              Ingresa una URL en el panel lateral para comenzar
            </p>
          </div>
        )}
        
        {loadingStep && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 text-lg font-light tracking-wide">{loadingStep === 'analyzing' ? 'Investigando marca en Google...' : 'Diseñando banners publicitarios...'}</p>
          </div>
        )}
        {brandImages.landscape && !loadingStep && (
          <div className={`relative transition-all duration-500 shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10 group ${activeFormat === 'landscape' ? 'w-full max-w-5xl aspect-video' : ''} ${activeFormat === 'portrait' ? 'h-[80vh] aspect-[9/16]' : ''} ${activeFormat === 'square' ? 'h-[80vh] aspect-square' : ''}`}>
            {brandImages[activeFormat] ? (<img src={brandImages[activeFormat]!} alt="Generated Banner" className="w-full h-full object-cover select-none pointer-events-none"/>) : (<div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center text-gray-500">Cargando...</div>)}
            {brandData && showText && (
              <div ref={textContainerRef} className="absolute top-1/2 left-1/2 flex flex-col items-center justify-center cursor-move z-20" style={{ transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`, touchAction: 'none' }} onMouseDown={handleMouseDown}>
                <div className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 transition-opacity duration-200 pointer-events-none ${isDragging ? 'opacity-100' : 'opacity-0 group-hover/text:opacity-100'}`}><Move className="w-3 h-3" /> Arrastrar</div>
                <div className="group/text flex flex-col items-center justify-center text-center max-w-lg bg-black/20 hover:bg-black/40 backdrop-blur-[2px] p-6 rounded-2xl border border-white/0 hover:border-white/20 transition-all">
                  <div contentEditable suppressContentEditableWarning onBlur={(e) => setEditableCopy({...editableCopy, headline: e.currentTarget.innerText})} className={`text-4xl md:text-5xl font-black text-white mb-3 leading-tight tracking-tight drop-shadow-xl outline-none min-w-[200px] cursor-text focus:border-b focus:border-white/50 ${getFontStack(brandData.fontCategory)}`} style={{ textShadow: '0 4px 10px rgba(0,0,0,0.6)' }}>{editableCopy.headline}</div>
                  <div contentEditable suppressContentEditableWarning onBlur={(e) => setEditableCopy({...editableCopy, subhead: e.currentTarget.innerText})} className="text-lg text-white/95 font-medium mb-6 drop-shadow-md outline-none min-w-[150px] cursor-text focus:border-b focus:border-white/50">{editableCopy.subhead}</div>
                  <div className="relative group/btn">
                    <button className="px-8 py-3 rounded-full font-bold text-lg shadow-xl" style={{ backgroundColor: brandData.colors[0] || '#ffffff', color: brandData.colors[1] || '#000000' }}>
                      <span contentEditable suppressContentEditableWarning onBlur={(e) => setEditableCopy({...editableCopy, cta: e.currentTarget.innerText})} className="outline-none cursor-text min-w-[50px] inline-block">{editableCopy.cta}</span>
                    </button>
                  </div>
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover/text:opacity-50 text-[10px] text-white flex gap-1 pointer-events-none"><Edit3 className="w-3 h-3" /> Click texto para editar</div>
                </div>
              </div>
            )}
            <div className="absolute top-4 left-4 z-30">
              <button onClick={() => setShowText(!showText)} className={`bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur transition-all ${!showText ? 'opacity-50' : ''}`} title={showText ? "Ocultar Texto" : "Mostrar Texto"}><Type className="w-4 h-4" /></button>
            </div>
            <button onClick={handleDownload} className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur transition-all opacity-0 group-hover:opacity-100 z-30" title="Descargar Imagen"><Download className="w-5 h-5" /></button>
          </div>
        )}
      </div>
    </div>
  );
}

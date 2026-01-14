import { useState, useRef } from 'react';
import { Download, RefreshCw, Check, Sparkles, Globe, Instagram, Facebook, Music2, Loader2, ChevronRight, Monitor, Smartphone, Square } from 'lucide-react';
import Swal from 'sweetalert2';

// ============================================
// BRAND INTELLIGENCE - Generador de Kit de Marca
// ============================================

interface BrandAnalysis {
  name: string;
  industry: string;
  tone: string;
  audience: string;
  colors: { primary: string; secondary: string; accent: string };
  description: string;
  tagline: string;
  cta: string;
}

interface GeneratedAssets {
  preview: string | null;
  landscape: string | null;
  portrait: string | null;
  square: string | null;
}

type Step = 'input' | 'analyzing' | 'preview' | 'generating' | 'complete';
type Format = 'landscape' | 'portrait' | 'square';

// Detectar tipo de URL
const detectUrlType = (url: string): 'website' | 'instagram' | 'facebook' | 'tiktok' | 'unknown' => {
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('facebook.com') || url.includes('fb.com')) return 'facebook';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('.')) return 'website';
  return 'unknown';
};

const URL_ICONS = {
  website: Globe,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music2,
  unknown: Globe
};

// Estilos visuales para las piezas
const VISUAL_STYLES = [
  { id: 'modern', name: 'Moderno', prompt: 'Clean minimalist design, white space, modern typography, subtle gradients' },
  { id: 'bold', name: 'Impactante', prompt: 'Bold colors, strong contrast, dynamic composition, eye-catching' },
  { id: 'elegant', name: 'Elegante', prompt: 'Luxury aesthetic, refined typography, sophisticated color palette, premium feel' },
  { id: 'tech', name: 'Tech', prompt: 'Futuristic design, neon accents, dark mode, glassmorphism effects' },
  { id: 'organic', name: 'Natural', prompt: 'Organic shapes, earthy tones, natural textures, eco-friendly vibe' }
];

export default function CanvasEditor() {
  // Estados principales
  const [url, setUrl] = useState('');
  const [step, setStep] = useState<Step>('input');
  const [brand, setBrand] = useState<BrandAnalysis | null>(null);
  const [assets, setAssets] = useState<GeneratedAssets>({ preview: null, landscape: null, portrait: null, square: null });
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [activeFormat, setActiveFormat] = useState<Format>('landscape');
  const [error, setError] = useState<string | null>(null);
  
  const abortController = useRef<AbortController | null>(null);

  // ============================================
  // API CALLS
  // ============================================
  
  const analyzeUrl = async (inputUrl: string): Promise<BrandAnalysis> => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error('API Key no configurada');
    
    const urlType = detectUrlType(inputUrl);
    const prompt = `Analiza esta ${urlType === 'website' ? 'pagina web' : 'red social'}: "${inputUrl}"

IMPORTANTE: Todo el texto debe estar en ESPAÑOL (Chile).

Investiga y responde SOLO con este JSON (sin markdown):
{
  "name": "nombre del negocio",
  "industry": "industria/rubro (ej: tecnologia, retail, salud, gastronomia, servicios)",
  "tone": "tono de comunicacion (formal, casual, premium, juvenil, profesional)",
  "audience": "audiencia objetivo",
  "colors": {
    "primary": "#hexcolor principal de la marca",
    "secondary": "#hexcolor secundario",
    "accent": "#hexcolor de acento"
  },
  "description": "descripcion corta del negocio en 1 linea EN ESPAÑOL",
  "tagline": "slogan o frase principal de la marca EN ESPAÑOL",
  "cta": "texto para boton de accion EN ESPAÑOL (ej: Comenzar, Cotizar, Ver mas)"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          tools: [{ google_search: {} }]
        })
      }
    );
    
    if (!response.ok) throw new Error('Error analizando URL');
    
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Sin respuesta de IA');
    
    // Extraer JSON
    let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const start = jsonStr.indexOf('{');
    const end = jsonStr.lastIndexOf('}');
    if (start !== -1 && end !== -1) jsonStr = jsonStr.substring(start, end + 1);
    
    return JSON.parse(jsonStr);
  };

  const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) throw new Error('API Key no configurada');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1, aspectRatio }
        })
      }
    );
    
    if (!response.ok) throw new Error('Error generando imagen');
    
    const data = await response.json();
    if (!data.predictions?.[0]?.bytesBase64Encoded) throw new Error('No se genero imagen');
    
    return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
  };

  // ============================================
  // HANDLERS
  // ============================================

  const handleAnalyze = async () => {
    if (!url.trim()) {
      Swal.fire({ title: 'Error', text: 'Ingresa una URL', icon: 'warning', background: '#1a1a1a', color: '#fff' });
      return;
    }
    
    setStep('analyzing');
    setError(null);
    
    try {
      // Paso 1: Analizar marca
      const analysis = await analyzeUrl(url);
      setBrand(analysis);
      
      // Paso 2: Generar preview (solo 1 imagen)
      const style = VISUAL_STYLES.find(s => s.id === selectedStyle) || VISUAL_STYLES[0];
      const imagePrompt = `Professional marketing banner for ${analysis.industry} business.
Brand: ${analysis.name}. ${analysis.description}.
Style: ${style.prompt}
Colors: Use ${analysis.colors.primary} as primary, ${analysis.colors.secondary} as secondary.
NO TEXT IN IMAGE. Pure visual design. 8K quality. Modern UX aesthetic.`;
      
      const preview = await generateImage(imagePrompt, '16:9');
      setAssets({ preview, landscape: preview, portrait: null, square: null });
      
      setStep('preview');
      
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
      setStep('input');
      Swal.fire({ title: 'Error', text: err.message, icon: 'error', background: '#1a1a1a', color: '#fff' });
    }
  };

  const handleApprove = async () => {
    if (!brand) return;
    
    setStep('generating');
    
    try {
      const style = VISUAL_STYLES.find(s => s.id === selectedStyle) || VISUAL_STYLES[0];
      const basePrompt = `Professional marketing content for ${brand.industry} business.
Brand: ${brand.name}. ${brand.description}.
Style: ${style.prompt}
Colors: ${brand.colors.primary}, ${brand.colors.secondary}, ${brand.colors.accent}.
NO TEXT. Pure visual. 8K quality.`;
      
      // Generar los otros formatos
      const [portrait, square] = await Promise.all([
        generateImage(basePrompt + ' Vertical composition for social media stories.', '9:16'),
        generateImage(basePrompt + ' Square composition for social media feed.', '1:1')
      ]);
      
      setAssets(prev => ({ ...prev, portrait, square }));
      setStep('complete');
      
      Swal.fire({
        title: 'Kit de Marca Listo!',
        text: '3 piezas graficas generadas',
        icon: 'success',
        background: '#1a1a1a',
        color: '#fff',
        timer: 2000,
        showConfirmButton: false
      });
      
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
      Swal.fire({ title: 'Error', text: err.message, icon: 'error', background: '#1a1a1a', color: '#fff' });
    }
  };

  const handleRegenerate = async () => {
    if (!brand) return;
    setStep('analyzing');
    
    try {
      const style = VISUAL_STYLES.find(s => s.id === selectedStyle) || VISUAL_STYLES[0];
      const imagePrompt = `Professional marketing banner for ${brand.industry} business.
Brand: ${brand.name}. ${brand.description}.
Style: ${style.prompt}
Colors: Use ${brand.colors.primary} as primary, ${brand.colors.secondary} as secondary.
NO TEXT IN IMAGE. Pure visual design. 8K quality. Modern UX aesthetic.`;
      
      const preview = await generateImage(imagePrompt, '16:9');
      setAssets({ preview, landscape: preview, portrait: null, square: null });
      setStep('preview');
      
    } catch (err: any) {
      setError(err.message);
      setStep('preview');
    }
  };

  const handleDownload = (format: Format) => {
    const img = assets[format];
    if (!img) return;
    
    const link = document.createElement('a');
    link.href = img;
    link.download = `${brand?.name || 'brand'}-${format}.png`;
    link.click();
  };

  const handleReset = () => {
    setUrl('');
    setStep('input');
    setBrand(null);
    setAssets({ preview: null, landscape: null, portrait: null, square: null });
    setError(null);
  };

  // ============================================
  // RENDER
  // ============================================

  const urlType = detectUrlType(url);
  const UrlIcon = URL_ICONS[urlType];
  const currentImage = assets[activeFormat] || assets.preview;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">Brand Intelligence</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Kit de Marca Automatico</h1>
          <p className="text-gray-400">Pega tu URL y genera piezas graficas profesionales al instante</p>
        </div>

        {/* Input Step */}
        {step === 'input' && (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* URL Input */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <UrlIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Pega tu URL (web, Instagram, Facebook, TikTok)"
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
            </div>

            {/* Style Selector */}
            <div>
              <label className="block text-sm text-gray-400 mb-3">Estilo Visual</label>
              <div className="grid grid-cols-5 gap-2">
                {VISUAL_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedStyle === style.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!url.trim()}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              Analizar y Generar Preview
            </button>
          </div>
        )}

        {/* Analyzing Step */}
        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-lg text-gray-400">Analizando tu marca...</p>
            <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
          </div>
        )}

        {/* Preview Step */}
        {(step === 'preview' || step === 'generating' || step === 'complete') && brand && (
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Left: Brand Info */}
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.colors.primary }} />
                  {brand.name}
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Industria:</span> {brand.industry}</p>
                  <p><span className="text-gray-500">Tono:</span> {brand.tone}</p>
                  <p><span className="text-gray-500">Audiencia:</span> {brand.audience}</p>
                </div>
                
                {/* Colors */}
                <div className="flex gap-2 mt-4">
                  {Object.entries(brand.colors).map(([key, color]) => (
                    <div key={key} className="flex-1 text-center">
                      <div className="w-full h-8 rounded-lg mb-1" style={{ backgroundColor: color }} />
                      <span className="text-xs text-gray-500">{color}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tagline */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Tagline</p>
                <p className="font-medium">{brand.tagline}</p>
              </div>

              {/* Actions */}
              {step === 'preview' && (
                <div className="space-y-2">
                  <button
                    onClick={handleApprove}
                    className="w-full py-3 bg-green-600 hover:bg-green-500 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Aprobar y Generar Pack
                  </button>
                  <button
                    onClick={handleRegenerate}
                    className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerar Preview
                  </button>
                </div>
              )}

              {step === 'complete' && (
                <button
                  onClick={handleReset}
                  className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium"
                >
                  Nueva Marca
                </button>
              )}
            </div>

            {/* Center: Image Preview */}
            <div className="md:col-span-2">
              {step === 'generating' ? (
                <div className="aspect-video bg-gray-800/50 rounded-xl flex flex-col items-center justify-center border border-gray-700">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-3" />
                  <p className="text-gray-400">Generando pack completo...</p>
                </div>
              ) : currentImage ? (
                <div className="space-y-4">
                  {/* Format Tabs */}
                  {step === 'complete' && (
                    <div className="flex gap-2">
                      {[
                        { id: 'landscape', icon: Monitor, label: 'Banner' },
                        { id: 'portrait', icon: Smartphone, label: 'Story' },
                        { id: 'square', icon: Square, label: 'Post' }
                      ].map(fmt => (
                        <button
                          key={fmt.id}
                          onClick={() => setActiveFormat(fmt.id as Format)}
                          disabled={!assets[fmt.id as Format]}
                          className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                            activeFormat === fmt.id
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-30'
                          }`}
                        >
                          <fmt.icon className="w-4 h-4" />
                          {fmt.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Image */}
                  <div className={`relative rounded-xl overflow-hidden border border-gray-700 ${
                    activeFormat === 'portrait' ? 'max-w-xs mx-auto' : ''
                  }`}>
                    <img
                      src={currentImage}
                      alt="Preview"
                      className={`w-full ${
                        activeFormat === 'landscape' ? 'aspect-video' :
                        activeFormat === 'portrait' ? 'aspect-[9/16]' : 'aspect-square'
                      } object-cover`}
                    />
                    
                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(activeFormat)}
                      className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

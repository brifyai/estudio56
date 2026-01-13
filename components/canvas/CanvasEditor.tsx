import { useState, useEffect, useRef } from 'react';
import { Monitor, Smartphone, Square, Download, RefreshCw, AlertCircle, Palette, LayoutTemplate, Zap, Briefcase, Star, MonitorPlay, Type, Move, Edit3, Sun, Moon, Aperture, Coffee, Box, Search, Settings, Key, Leaf, Camera, Building2, Feather } from 'lucide-react';

const apiKey = "";
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, options: RequestInit, retries = 5, backoff = 1000) {
  try {
    const response = await fetch(url, options);
    if (response.status === 401 || response.status === 403) {
      throw new Error(\`API Key inválida o no autorizada (\${response.status}). Por favor configura tu API Key.\`);
    }
    if (!response.ok && (response.status === 429 || response.status === 503)) {
      throw new Error(\`Server returned \${response.status}\`);
    }
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(\`API Error \${response.status}: \${errorBody}\`);
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

export default function CanvasEditor() {
  const [urlInput, setUrlInput] = useState('');
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
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [userApiKey, setUserApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const getEffectiveKey = () => userApiKey || apiKey;

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">AI Creative Studio</h1>
        <p className="text-gray-400">Generador de banners con análisis de URL - En desarrollo</p>
        <p className="text-sm text-gray-500 mt-2">Próximamente: 14 estilos visuales, análisis con Gemini, generación con Imagen 4.0</p>
      </div>
    </div>
  );
}

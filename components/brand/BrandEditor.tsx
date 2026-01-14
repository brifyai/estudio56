import { useState, useRef } from 'react';
import {
  Palette, Type, Layout, Upload, Printer, Check, Sparkles,
  ZoomIn, ZoomOut, Monitor,
  Hexagon, Zap, Layers, Command, Globe, Box, Triangle, Cpu, Anchor, Activity,
  Circle, Square, Leaf, Briefcase, TrendingUp, Wifi, Database, Sun, Aperture,
  Target, Feather, LayoutTemplate, Crown, Gem, Shield, Rocket, Flame, Heart,
  Star, Award, PenTool, Music, Camera, Video, Mic, Speaker, Headphones,
  Monitor as MonitorIcon, Cloud, Server, Code, Terminal, Hash, Percent,
  DollarSign, CreditCard, Wallet, Landmark, Building, Home, TreeDeciduous,
  Mountain, Wind, Moon, Umbrella, Coffee, Utensils, Scissors, Glasses, Watch,
  Compass, Map, Flag, Lightbulb, Puzzle, Fingerprint, Atom, Infinity, Shuffle,
  Stethoscope, HeartPulse, Pill, Thermometer, Plus, Hammer, Wrench, HardHat,
  BrickWall, PaintBucket, GraduationCap, BookOpen, Library, Microscope, Beaker,
  Telescope, Dumbbell, Medal, Bike, Swords, Plane, Train, Ship, MapPin, Tent,
  Shirt, ShoppingBag, Tag, Gamepad2, Ghost, Skull, Dices, Clapperboard, Ticket,
  Play, Car, Truck, Key, Navigation, Fuel, Dog, Cat, Bone, Fish, PawPrint,
  Gavel, Scale, Scroll, ShieldCheck, FileText, Lock, Eye, Siren, FileLock,
  Megaphone, Radio, Tv, Share2, Cast, Presentation, PartyPopper, Gift, Cake,
  GlassWater, Calendar, Tractor, Wheat, Sprout, CloudRain, Flower, SprayCan,
  Trash2, Droplets, Sparkle, Church, Cross, Baby, RockingChair, Smile, Brain,
  Dna, FlaskConical, TestTube, Smartphone, Image as ImageIcon, Shirt as ShirtIcon,
  Ban, Ruler, Maximize, Soup, Carrot, Apple, ChefHat
} from 'lucide-react';

// Tipos de iconos por categoría
const ICON_CATEGORIES = {
  tech: {
    label: "Tecnología",
    icons: { cpu: Cpu, zap: Zap, command: Command, wifi: Wifi, database: Database, smartphone: Smartphone, monitor: MonitorIcon, server: Server, cloud: Cloud, code: Code, terminal: Terminal, fingerprint: Fingerprint, rocket: Rocket }
  },
  creative: {
    label: "Creatividad",
    icons: { penTool: PenTool, layers: Layers, aperture: Aperture, palette: Palette, music: Music, camera: Camera, video: Video, mic: Mic, feather: Feather, lightbulb: Lightbulb, puzzle: Puzzle, clapperboard: Clapperboard, sparkle: Sparkle }
  },
  business: {
    label: "Negocios",
    icons: { briefcase: Briefcase, trendingUp: TrendingUp, globe: Globe, target: Target, anchor: Anchor, dollarSign: DollarSign, creditCard: CreditCard, wallet: Wallet, landmark: Landmark, building: Building, award: Award, presentation: Presentation }
  },
  health: {
    label: "Salud",
    icons: { stethoscope: Stethoscope, heartPulse: HeartPulse, activity: Activity, pill: Pill, thermometer: Thermometer, plus: Plus, heart: Heart, brain: Brain, dna: Dna }
  },
  food: {
    label: "Gastronomía",
    icons: { utensils: Utensils, coffee: Coffee, soup: Soup, carrot: Carrot, apple: Apple, chefHat: ChefHat, flame: Flame, cake: Cake, glass: GlassWater }
  },
  sports: {
    label: "Deportes",
    icons: { dumbbell: Dumbbell, trophy: Award, medal: Medal, bike: Bike, swords: Swords, timer: Watch, flame: Flame, activity: Activity }
  },
  travel: {
    label: "Viajes",
    icons: { plane: Plane, train: Train, ship: Ship, mapPin: MapPin, map: Map, compass: Compass, tent: Tent, globe: Globe, flag: Flag }
  },
  pets: {
    label: "Mascotas",
    icons: { dog: Dog, cat: Cat, bone: Bone, fish: Fish, paw: PawPrint, heart: Heart }
  },
  nature: {
    label: "Naturaleza",
    icons: { leaf: Leaf, sun: Sun, tree: TreeDeciduous, mountain: Mountain, wind: Wind, moon: Moon, droplet: Activity, flower: Flower }
  },
  abstract: {
    label: "Abstracto",
    icons: { hexagon: Hexagon, box: Box, triangle: Triangle, circle: Circle, square: Square, star: Star, shield: Shield, hash: Hash, percent: Percent, infinity: Infinity, shuffle: Shuffle }
  }
};

const ALL_ICONS = Object.values(ICON_CATEGORIES).reduce((acc, cat) => ({...acc, ...cat.icons}), {}) as Record<string, any>;
type IconKey = keyof typeof ALL_ICONS;
type CategoryKey = keyof typeof ICON_CATEGORIES;

interface BrandData {
  name: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  logoMode: 'upload' | 'generated';
  logoUrl: string | null;
  genLogoType: 'icon' | 'initials';
  genLogoIcon: IconKey;
  genLogoCategory: CategoryKey;
  genLogoLayout: 'vertical' | 'horizontal' | 'stacked';
  genLogoShape: 'circle' | 'square' | 'rounded' | 'hexagon' | 'none';
  genLogoStyle: 'filled' | 'outline' | 'duotone' | 'soft';
  genLogoRotation: number;
  genLogoScale: number;
  genLogoTextCase: 'uppercase' | 'capitalize' | 'lowercase';
  genLogoTracking: string;
  colors: { primary: string; secondary: string; accent: string; neutral: string; };
  typography: { headingFont: string; bodyFont: string; };
}

const defaultBrandData: BrandData = {
  name: "Mi Marca",
  tagline: "Tu eslogan aquí",
  description: "Descripción de tu empresa o proyecto.",
  mission: "Nuestra misión es...",
  vision: "Nuestra visión es...",
  logoMode: 'generated',
  logoUrl: null,
  genLogoType: 'icon',
  genLogoIcon: 'rocket',
  genLogoCategory: 'business',
  genLogoLayout: 'horizontal',
  genLogoShape: 'rounded',
  genLogoStyle: 'filled',
  genLogoRotation: 0,
  genLogoScale: 1,
  genLogoTextCase: 'uppercase',
  genLogoTracking: 'tracking-widest',
  colors: { primary: "#2563EB", secondary: "#1E293B", accent: "#F59E0B", neutral: "#F3F4F6" },
  typography: { headingFont: "ui-sans-serif, system-ui, sans-serif", bodyFont: "ui-sans-serif, system-ui, sans-serif" }
};

interface BrandEditorProps {
  onExport?: (pdfData: string) => void;
}

export default function BrandEditor({ onExport }: BrandEditorProps) {
  const [brand, setBrand] = useState<BrandData>(defaultBrandData);
  const [activeTab, setActiveTab] = useState<'identity' | 'colors' | 'typography'>('identity');
  const [zoom, setZoom] = useState(0.5);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePrint = () => window.print();

  const fontOptions = [
    { label: "Moderna Sans", value: "ui-sans-serif, system-ui, sans-serif" },
    { label: "Clásica Serif", value: "ui-serif, Georgia, serif" },
    { label: "Técnica Mono", value: "ui-monospace, monospace" },
  ];

  // Componente GeneratedLogo
  const GeneratedLogo = ({ className = "h-32", showText = true, forceWhiteText = true, forceMonochrome = false }: { className?: string, showText?: boolean, forceWhiteText?: boolean, forceMonochrome?: boolean }) => {
    const IconComponent = ALL_ICONS[brand.genLogoIcon] || Hexagon;
    const isHorizontal = brand.genLogoLayout === 'horizontal';
    
    let baseSize = 32;
    if (className?.includes('h-6')) baseSize = 6;
    if (className?.includes('h-8')) baseSize = 8;
    if (className?.includes('h-10')) baseSize = 10;
    if (className?.includes('h-12')) baseSize = 12;
    if (className?.includes('h-16')) baseSize = 16;
    if (className?.includes('h-20')) baseSize = 20;
    if (className?.includes('h-24')) baseSize = 24;
    const iconSize = baseSize * 2;

    let containerStyle: React.CSSProperties = {
      width: `${iconSize*2}px`, height: `${iconSize*2}px`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 0.3s ease',
      transform: `rotate(${brand.genLogoRotation}deg) scale(${brand.genLogoScale})`
    };

    let primaryColor = brand.colors.primary;
    let secondaryColor = brand.colors.secondary;
    if (forceMonochrome) { primaryColor = 'currentColor'; secondaryColor = 'currentColor'; }
    let iconColor = primaryColor;

    if (brand.genLogoShape === 'none') {
      containerStyle.backgroundColor = 'transparent';
    } else {
      if (brand.genLogoShape === 'circle') containerStyle.borderRadius = '9999px';
      if (brand.genLogoShape === 'square') containerStyle.borderRadius = '0px';
      if (brand.genLogoShape === 'rounded') containerStyle.borderRadius = '16px';
      if (brand.genLogoShape === 'hexagon') containerStyle.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
      
      if (brand.genLogoStyle === 'filled') {
        containerStyle.backgroundColor = primaryColor;
        iconColor = forceWhiteText ? primaryColor : '#ffffff';
        if (forceMonochrome && !forceWhiteText) iconColor = 'white';
      } else if (brand.genLogoStyle === 'outline') {
        containerStyle.border = `2px solid ${primaryColor}`;
        containerStyle.backgroundColor = 'transparent';
        iconColor = primaryColor;
      } else if (brand.genLogoStyle === 'duotone') {
        containerStyle.backgroundColor = secondaryColor;
        iconColor = brand.colors.accent;
      } else if (brand.genLogoStyle === 'soft') {
        containerStyle.backgroundColor = forceMonochrome ? 'rgba(0,0,0,0.1)' : `${brand.colors.primary}20`;
        iconColor = primaryColor;
      }
    }

    // Siempre usar blanco para el texto del logo
    const textStyle = { fontFamily: brand.typography.headingFont, color: 'white', textTransform: brand.genLogoTextCase as any };

    return (
      <div className={`flex items-center justify-center ${isHorizontal ? 'flex-row gap-4 text-left' : 'flex-col gap-3 text-center'}`}>
        <div style={containerStyle}>
          {brand.genLogoType === 'initials' ? (
            <span className="font-bold leading-none" style={{ fontSize: `${iconSize}px`, color: iconColor, fontFamily: brand.typography.headingFont }}>{getInitials(brand.name)}</span>
          ) : (
            <IconComponent size={iconSize} color={iconColor} strokeWidth={1.5} />
          )}
        </div>
        {showText && (
          <div className={brand.genLogoLayout === 'stacked' ? 'border-t pt-2 mt-1 border-gray-200' : ''}>
            <span className={`block font-bold leading-none ${brand.genLogoTracking}`} style={{ ...textStyle, fontSize: isHorizontal ? `${iconSize * 0.7}px` : `${iconSize * 0.6}px` }}>{brand.name}</span>
            {brand.tagline && !isHorizontal && (<span className="block text-xs mt-1 opacity-70" style={{ color: forceWhiteText ? 'white' : secondaryColor }}>{brand.tagline}</span>)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full bg-gray-900 overflow-hidden">
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; }
          .no-print { display: none !important; }
          .preview-container { box-shadow: none !important; border: none !important; width: 210mm !important; }
        }
      `}</style>

      {/* SIDEBAR */}
      <aside className="no-print w-80 bg-gray-800 border-r border-gray-700 h-full overflow-y-auto flex flex-col">
        <div className="p-4 bg-gray-900 border-b border-gray-700">
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <Layout size={18} /> BrandForge
          </h1>
          <p className="text-xs text-gray-400 mt-1">Generador de Identidad</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 bg-gray-800">
          {(['identity', 'colors', 'typography'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-2 text-xs font-medium ${activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-700' : 'text-gray-400 hover:bg-gray-700'}`}>
              {tab === 'identity' ? 'Identidad' : tab === 'colors' ? 'Colores' : 'Fuentes'}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
          {activeTab === 'identity' && (
            <>
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-300">Datos Básicos</label>
                <input type="text" name="name" placeholder="Nombre" value={brand.name} onChange={handleTextChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                <input type="text" name="tagline" placeholder="Eslogan" value={brand.tagline} onChange={handleTextChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <hr className="border-gray-700" />

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-300">Logo</label>
                  <div className="flex bg-gray-700 p-0.5 rounded">
                    <button onClick={() => setBrand(p => ({...p, logoMode: 'generated'}))} className={`px-2 py-1 text-[10px] rounded ${brand.logoMode === 'generated' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Generar</button>
                    <button onClick={() => setBrand(p => ({...p, logoMode: 'upload'}))} className={`px-2 py-1 text-[10px] rounded ${brand.logoMode === 'upload' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Subir</button>
                  </div>
                </div>

                {brand.logoMode === 'upload' ? (
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center cursor-pointer hover:bg-gray-700/50" onClick={() => fileInputRef.current?.click()}>
                    {brand.logoUrl ? <img src={brand.logoUrl} alt="Logo" className="h-16 object-contain mb-2" /> : <Upload className="text-gray-500 mb-2" size={24} />}
                    <span className="text-xs text-gray-400">{brand.logoUrl ? 'Cambiar' : 'Click para subir'}</span>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-gray-700 rounded-lg p-4 flex justify-center">
                      <GeneratedLogo className="h-16" />
                    </div>
                    <button onClick={infiniteDesignRemix} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 flex items-center justify-center gap-2 cursor-pointer">
                      <Sparkles size={16} /> Remix
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => setBrand(p => ({...p, genLogoType: 'icon'}))} className={`flex-1 py-1.5 text-xs border rounded ${brand.genLogoType === 'icon' ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-gray-600 text-gray-400'}`}>Icono</button>
                      <button onClick={() => setBrand(p => ({...p, genLogoType: 'initials'}))} className={`flex-1 py-1.5 text-xs border rounded ${brand.genLogoType === 'initials' ? 'border-blue-500 bg-blue-500/20 text-blue-400' : 'border-gray-600 text-gray-400'}`}>Letras</button>
                    </div>
                    {brand.genLogoType === 'icon' && (
                      <select className="w-full text-xs bg-gray-700 border border-gray-600 text-white rounded px-2 py-1.5" value={brand.genLogoCategory} onChange={(e) => setBrand(p => ({...p, genLogoCategory: e.target.value as CategoryKey}))}>
                        {Object.entries(ICON_CATEGORIES).map(([key, cat]) => <option key={key} value={key}>{cat.label}</option>)}
                      </select>
                    )}
                  </div>
                )}
              </div>

              <hr className="border-gray-700" />

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-300">Filosofía</label>
                <textarea name="description" placeholder="Descripción" value={brand.description} onChange={handleTextChange} rows={2} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
                <textarea name="mission" placeholder="Misión" value={brand.mission} onChange={handleTextChange} rows={2} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
                <textarea name="vision" placeholder="Visión" value={brand.vision} onChange={handleTextChange} rows={2} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400">Ajusta los colores de tu marca</p>
              {[
                { label: "Primario", key: "primary" as const },
                { label: "Secundario", key: "secondary" as const },
                { label: "Acento", key: "accent" as const },
                { label: "Neutro", key: "neutral" as const }
              ].map((color) => (
                <div key={color.key} className="flex gap-3 items-center p-2 bg-gray-700 rounded-lg">
                  <div className="relative">
                    <input type="color" value={brand.colors[color.key]} onChange={(e) => handleColorChange(color.key, e.target.value)} className="h-8 w-8 rounded cursor-pointer opacity-0 absolute inset-0" />
                    <div className="h-8 w-8 rounded border border-gray-600" style={{backgroundColor: brand.colors[color.key]}} />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-medium text-white block">{color.label}</label>
                    <code className="text-[10px] text-gray-400">{brand.colors[color.key]}</code>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'typography' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">Títulos</label>
                <div className="space-y-2">
                  {fontOptions.map((font) => (
                    <div key={`h-${font.value}`} onClick={() => handleFontChange('headingFont', font.value)} className={`p-2 border rounded cursor-pointer flex justify-between items-center ${brand.typography.headingFont === font.value ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:bg-gray-700'}`}>
                      <span style={{ fontFamily: font.value }} className="text-white">{font.label}</span>
                      {brand.typography.headingFont === font.value && <Check size={14} className="text-blue-400" />}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">Cuerpo</label>
                <div className="space-y-2">
                  {fontOptions.map((font) => (
                    <div key={`b-${font.value}`} onClick={() => handleFontChange('bodyFont', font.value)} className={`p-2 border rounded cursor-pointer flex justify-between items-center ${brand.typography.bodyFont === font.value ? 'border-blue-500 bg-blue-500/20' : 'border-gray-600 hover:bg-gray-700'}`}>
                      <span style={{ fontFamily: font.value }} className="text-white text-sm">{font.label}</span>
                      {brand.typography.bodyFont === font.value && <Check size={14} className="text-blue-400" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700">
          <button onClick={handlePrint} className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-2 cursor-pointer">
            <Printer size={16} /> Exportar PDF
          </button>
        </div>
      </aside>

      {/* PREVIEW AREA */}
      <main className="flex-1 bg-gray-950 relative flex flex-col h-full overflow-hidden">
        {/* Zoom toolbar */}
        <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 no-print shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Monitor size={14} />
            <span>Vista Previa</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-700 rounded p-1">
            <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="p-1 hover:bg-gray-600 rounded text-gray-300"><ZoomOut size={14}/></button>
            <span className="text-xs font-mono text-gray-300 w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(z => Math.min(1, z + 0.1))} className="p-1 hover:bg-gray-600 rounded text-gray-300"><ZoomIn size={14}/></button>
          </div>
        </div>

        {/* Document preview */}
        <div className="flex-1 overflow-auto p-8 flex justify-center items-start">
          <div className="transition-transform duration-200 origin-top" style={{ transform: `scale(${zoom})` }}>
            <div className="preview-container bg-white w-[210mm] min-h-[297mm] shadow-2xl">
              
              {/* PORTADA */}
              <section className="relative h-[297mm] flex flex-col justify-between p-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 pointer-events-none transform skew-x-12 translate-x-32" style={{ backgroundColor: brand.colors.primary }} />
                <div className="relative z-10 pt-20">
                  <div className="mb-12">
                    {brand.logoMode === 'upload' && brand.logoUrl ? (
                      <img src={brand.logoUrl} alt="Logo" className="h-24 object-contain" />
                    ) : (
                      <GeneratedLogo className="h-24" />
                    )}
                  </div>
                  <h1 className="text-6xl font-bold leading-tight mb-4" style={{ fontFamily: brand.typography.headingFont, color: brand.colors.secondary }}>
                    Manual de<br />Identidad
                  </h1>
                  <div className="h-2 w-32 mb-8" style={{ backgroundColor: brand.colors.accent }} />
                </div>
                <div className="relative z-10 pb-10">
                  <p className="text-sm text-slate-400 uppercase tracking-widest mb-1">Versión 1.0</p>
                  <p className="text-sm text-slate-400">{new Date().getFullYear()}</p>
                </div>
              </section>

              {/* ESENCIA */}
              <section className="min-h-[297mm] p-16 flex flex-col border-t">
                <div className="mb-12 flex items-center gap-4">
                  <span className="text-4xl font-bold opacity-20">01</span>
                  <h3 className="text-2xl font-bold uppercase tracking-wide" style={{ fontFamily: brand.typography.headingFont, color: brand.colors.secondary }}>Esencia</h3>
                </div>
                <div className="grid gap-12">
                  <div>
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: brand.colors.primary }}>
                      <Layout size={20} /> Introducción
                    </h4>
                    <p className="text-lg leading-relaxed text-slate-600" style={{ fontFamily: brand.typography.bodyFont }}>{brand.description}</p>
                  </div>
                  <div className="p-8 bg-gray-50 rounded-xl border-l-4" style={{ borderColor: brand.colors.accent }}>
                    <h4 className="text-xl font-bold mb-2" style={{ fontFamily: brand.typography.headingFont }}>Nuestro Eslogan</h4>
                    <p className="text-3xl italic font-light text-slate-800" style={{ fontFamily: brand.typography.headingFont }}>"{brand.tagline}"</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-lg border border-gray-100 shadow-sm">
                      <h5 className="uppercase tracking-wider text-xs font-bold text-slate-400 mb-3">Misión</h5>
                      <p className="text-lg font-medium text-slate-800" style={{ fontFamily: brand.typography.bodyFont }}>{brand.mission}</p>
                    </div>
                    <div className="p-6 rounded-lg border border-gray-100 shadow-sm">
                      <h5 className="uppercase tracking-wider text-xs font-bold text-slate-400 mb-3">Visión</h5>
                      <p className="text-lg font-medium text-slate-800" style={{ fontFamily: brand.typography.bodyFont }}>{brand.vision}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* SISTEMA VISUAL */}
              <section className="min-h-[297mm] p-16 flex flex-col border-t">
                <div className="mb-12 flex items-center gap-4">
                  <span className="text-4xl font-bold opacity-20">02</span>
                  <h3 className="text-2xl font-bold uppercase tracking-wide" style={{ fontFamily: brand.typography.headingFont, color: brand.colors.secondary }}>Sistema Visual</h3>
                </div>

                {/* Logo */}
                <div className="mb-16">
                  <h4 className="text-lg font-bold mb-8 flex items-center gap-2 border-b pb-2" style={{ color: brand.colors.primary, borderColor: brand.colors.primary }}>
                    <LayoutTemplate size={20} /> Logotipo
                  </h4>
                  <div className="grid grid-cols-2 gap-8 items-center bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300">
                    <div className="flex justify-center border-r border-gray-200 pr-8">
                      {brand.logoMode === 'upload' && brand.logoUrl ? (
                        <img src={brand.logoUrl} alt="Logo" className="h-32 object-contain" />
                      ) : (
                        <GeneratedLogo className="h-32" />
                      )}
                    </div>
                    <div className="pl-4">
                      <p className="text-sm text-gray-500 mb-2">Variante en negativo</p>
                      <div className="bg-slate-800 p-6 rounded-lg flex justify-center">
                        {brand.logoMode === 'upload' && brand.logoUrl ? (
                          <img src={brand.logoUrl} alt="Logo" className="h-16 object-contain brightness-200 grayscale" />
                        ) : (
                          <GeneratedLogo className="h-16" forceWhiteText={true} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colores */}
                <div className="mb-16">
                  <h4 className="text-lg font-bold mb-8 flex items-center gap-2 border-b pb-2" style={{ color: brand.colors.primary, borderColor: brand.colors.primary }}>
                    <Palette size={20} /> Paleta de Colores
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      {name: 'Primario', c: brand.colors.primary},
                      {name: 'Secundario', c: brand.colors.secondary},
                      {name: 'Acento', c: brand.colors.accent},
                      {name: 'Neutro', c: brand.colors.neutral}
                    ].map((col) => (
                      <div key={col.name} className="space-y-2">
                        <div className="aspect-video rounded-lg shadow-sm" style={{backgroundColor: col.c}}></div>
                        <div>
                          <p className="font-bold text-sm text-gray-800">{col.name}</p>
                          <p className="font-mono text-xs text-gray-500 uppercase">{col.c}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tipografía */}
                <div>
                  <h4 className="text-lg font-bold mb-8 flex items-center gap-2 border-b pb-2" style={{ color: brand.colors.primary, borderColor: brand.colors.primary }}>
                    <Type size={20} /> Tipografía
                  </h4>
                  <div className="grid gap-8">
                    <div className="flex items-start gap-8">
                      <div className="w-24 shrink-0 text-center">
                        <p className="text-4xl font-bold mb-1">Aa</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Títulos</p>
                      </div>
                      <div>
                        <h1 className="text-2xl mb-2" style={{ fontFamily: brand.typography.headingFont }}>The quick brown fox jumps over the lazy dog.</h1>
                        <p className="text-xs text-slate-400 font-mono">Font: {brand.typography.headingFont.split(',')[0]}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-8 border-t pt-6">
                      <div className="w-24 shrink-0 text-center">
                        <p className="text-4xl font-normal mb-1">Aa</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Cuerpo</p>
                      </div>
                      <div>
                        <p className="text-base leading-relaxed mb-2 text-slate-600" style={{ fontFamily: brand.typography.bodyFont }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        <p className="text-xs text-slate-400 font-mono">Font: {brand.typography.bodyFont.split(',')[0]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="p-8 border-t flex justify-between text-xs text-slate-300">
                <span>{brand.name} | Manual de Marca</span>
                <span>Generado con Estudio 56</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
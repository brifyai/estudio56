import React, { useRef } from 'react';
import { TextStyleOptions } from './FlyerDisplay';

interface LogoFilters {
  grayscale: number;
  brightness: number;
  contrast: number;
  opacity: number;
}

interface TextEditorPanelProps {
  overlayText: string;
  setOverlayText: (text: string) => void;
  textStyles: TextStyleOptions;
  setTextStyles: (styles: TextStyleOptions) => void;
  onResetPosition?: () => void;
  logoUrl?: string | null;
  setLogoUrl?: (url: string | null) => void;
  logoColor?: string | null;
  setLogoColor?: (color: string | null) => void;
  logoFilters?: LogoFilters;
  setLogoFilters?: (filters: LogoFilters) => void;
  productUrl?: string | null;
  setProductUrl?: (url: string | null) => void;
}

const FONT_OPTIONS = [
  // Moderno
  { value: 'Inter, sans-serif', label: 'Inter', category: 'Moderno' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat', category: 'Moderno' },
  { value: 'Poppins, sans-serif', label: 'Poppins', category: 'Moderno' },
  { value: 'Roboto, sans-serif', label: 'Roboto', category: 'Moderno' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans', category: 'Moderno' },
  { value: 'Lato, sans-serif', label: 'Lato', category: 'Moderno' },
  // Elegante/Serifado
  { value: 'Georgia, serif', label: 'Georgia', category: 'Elegante' },
  { value: 'Playfair Display, serif', label: 'Playfair', category: 'Elegante' },
  { value: 'Merriweather, serif', label: 'Merriweather', category: 'Elegante' },
  { value: 'Lora, serif', label: 'Lora', category: 'Elegante' },
  { value: 'PT Serif, serif', label: 'PT Serif', category: 'Elegante' },
  // Clásico
  { value: 'Arial, sans-serif', label: 'Arial', category: 'Clásico' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica', category: 'Clásico' },
  { value: 'Verdana, sans-serif', label: 'Verdana', category: 'Clásico' },
  // Destacado
  { value: 'Impact, sans-serif', label: 'Impact', category: 'Destacado' },
  { value: 'Oswald, sans-serif', label: 'Oswald', category: 'Destacado' },
  { value: 'Bebas Neue, sans-serif', label: 'Bebas Neue', category: 'Destacado' },
  { value: 'Anton, sans-serif', label: 'Anton', category: 'Destacado' },
  // Monospace
  { value: 'Courier New, monospace', label: 'Courier', category: 'Monospace' },
  { value: 'Fira Code, monospace', label: 'Fira Code', category: 'Monospace' },
  { value: 'Source Code Pro, monospace', label: 'Source Code', category: 'Monospace' },
  // Informal
  { value: 'Comic Sans MS, cursive', label: 'Comic', category: 'Informal' },
  { value: 'Pacifico, cursive', label: 'Pacifico', category: 'Informal' },
  { value: 'Dancing Script, cursive', label: 'Dancing', category: 'Informal' },
  // Futurista
  { value: 'Orbitron, monospace', label: 'Orbitron', category: 'Futurista' },
  { value: 'Rajdhani, sans-serif', label: 'Rajdhani', category: 'Futurista' },
  { value: 'Exo 2, sans-serif', label: 'Exo 2', category: 'Futurista' },
];

const COLOR_PRESETS = [
  // Blancos
  '#FFFFFF', '#F0F0F0', '#E0E0E0', '#C0C0C0', '#A0A0A0',
  // Negros
  '#000000', '#1A1A1A', '#333333', '#4D4D4D', '#666666',
  // Rojos
  '#FF0000', '#FF3333', '#FF6666', '#CC0000', '#990000',
  // Verdes
  '#00FF00', '#33FF33', '#66FF66', '#00CC00', '#009900',
  // Azules
  '#0000FF', '#3333FF', '#6666FF', '#0000CC', '#000099',
  // Amarillos
  '#FFFF00', '#FFFF33', '#FFFF66', '#CCCC00', '#999900',
  // Magentas
  '#FF00FF', '#FF33FF', '#FF66FF', '#CC00CC', '#990099',
  // Cian
  '#00FFFF', '#33FFFF', '#66FFFF', '#00CCCC', '#009999',
  // Naranjas
  '#FF6B35', '#FF8C42', '#FFA500', '#FF7F50', '#FF6347',
  // Pasteles
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  // Vibrantes
  '#FF1493', '#00CED1', '#7FFF00', '#FFD700', '#9370DB',
];

export const TextEditorPanel: React.FC<TextEditorPanelProps> = ({
  overlayText,
  setOverlayText,
  textStyles,
  setTextStyles,
  onResetPosition,
  logoUrl,
  setLogoUrl,
  logoColor,
  setLogoColor,
  logoFilters = { grayscale: 0, brightness: 100, contrast: 100, opacity: 100 },
  setLogoFilters,
  productUrl,
  setProductUrl
}) => {
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const productInputRef = useRef<HTMLInputElement>(null);
  
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const updateStyle = (key: keyof TextStyleOptions, value: any) => {
    setTextStyles({
      ...textStyles,
      [key]: value
    });
  };
  
  const updateEffect = (effect: string, value: boolean) => {
    setTextStyles({
      ...textStyles,
      effects: {
        ...textStyles.effects,
        [effect]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-white/10">
        <span className="text-lg">✏️</span>
        <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono">Editor de Texto</h3>
      </div>
      
      {/* Texto Input */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Texto</label>
        <textarea
          value={overlayText}
          onChange={(e) => setOverlayText(e.target.value)}
          placeholder="Escribe tu texto aquí..."
          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-blue-500/50 outline-none resize-none h-20 placeholder-white/20 transition-all"
        />
      </div>
      
      {/* Tamaño de fuente */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Tamaño</label>
          <span className="text-[10px] text-white/50">{textStyles.fontSize}px</span>
        </div>
        <input
          type="range"
          min="12"
          max="72"
          value={textStyles.fontSize}
          onChange={(e) => updateStyle('fontSize', parseInt(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
        />
      </div>
      
      {/* Familia de fuente */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Fuente</label>
        <select
          value={textStyles.fontFamily}
          onChange={(e) => updateStyle('fontFamily', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-blue-500/50 outline-none"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font.value} value={font.value}>
              {font.label} ({font.category})
            </option>
          ))}
        </select>
      </div>
      
      {/* Peso de fuente */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Peso</label>
        <div className="grid grid-cols-4 gap-2">
          {['300', '400', '600', '900'].map((weight) => (
            <button
              key={weight}
              onClick={() => updateStyle('fontWeight', weight)}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                textStyles.fontWeight === weight
                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              {weight}
            </button>
          ))}
        </div>
      </div>
      
      {/* Transformación de texto */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Transformación</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'none', label: 'Normal' },
            { value: 'uppercase', label: 'MAYÚS' },
            { value: 'capitalize', label: 'Capital' }
          ].map((transform) => (
            <button
              key={transform.value}
              onClick={() => updateStyle('textTransform', transform.value)}
              className={`p-2 rounded-lg text-xs font-medium transition-all ${
                textStyles.textTransform === transform.value
                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                  : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
              }`}
            >
              {transform.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Color del texto */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Color del Texto</label>
        <div className="flex gap-1 flex-wrap">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              onClick={() => updateStyle('textColor', color)}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                textStyles.textColor === color
                  ? 'border-blue-500 scale-110'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <input
          type="color"
          value={textStyles.textColor}
          onChange={(e) => updateStyle('textColor', e.target.value)}
          className="w-full h-8 rounded-lg cursor-pointer"
        />
      </div>
      
      {/* Color de fondo */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Color de Fondo</label>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => updateStyle('backgroundColor', 'transparent')}
            className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${
              textStyles.backgroundColor === 'transparent'
                ? 'border-blue-500 scale-110'
                : 'border-white/20 hover:scale-105'
            }`}
            title="Sin fondo"
          >
              <span className="text-[8px] text-white/50">✕</span>
          </button>
          {COLOR_PRESETS.slice(0, 8).map((color) => (
            <button
              key={color}
              onClick={() => updateStyle('backgroundColor', color)}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                textStyles.backgroundColor === color
                  ? 'border-blue-500 scale-110'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
      
      {/* Espaciado */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Espaciado</label>
          <span className="text-[10px] text-white/50">{textStyles.letterSpacing}px</span>
        </div>
        <input
          type="range"
          min="-5"
          max="20"
          value={textStyles.letterSpacing}
          onChange={(e) => updateStyle('letterSpacing', parseInt(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
        />
      </div>
      
      {/* Efectos */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Efectos</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => updateEffect('shadow', !textStyles.effects.shadow)}
            className={`p-3 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1 ${
              textStyles.effects.shadow
                ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
            }`}
          >
            <span>💫</span>
            <span>Sombra</span>
          </button>
          <button
            onClick={() => updateEffect('stroke', !textStyles.effects.stroke)}
            className={`p-3 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1 ${
              textStyles.effects.stroke
                ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
            }`}
          >
            <span>🔲</span>
            <span>Contorno</span>
          </button>
          <button
            onClick={() => updateEffect('glow', !textStyles.effects.glow)}
            className={`p-3 rounded-lg text-xs font-medium transition-all flex flex-col items-center gap-1 ${
              textStyles.effects.glow
                ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
            }`}
          >
            <span>✨</span>
            <span>Brillo</span>
          </button>
        </div>
      </div>
      
      {/* Posición */}
      <div className="space-y-2 pt-4 border-t border-white/10">
        <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Posición</label>
        <button
          onClick={onResetPosition}
          className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all text-xs font-medium"
        >
          🔄 Reiniciar posición
        </button>
      </div>
      
      {/* Extras (Logo) */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Logo (Opcional)</label>
        
        <div className="grid grid-cols-1 gap-3">
          {/* Logo */}
          <div className="relative group">
            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFile(e, setLogoUrl || (() => {}))} />
            <div
              onClick={() => logoInputRef.current?.click()}
              className={`h-20 rounded-xl border border-dashed transition-all flex flex-col items-center justify-center cursor-pointer relative overflow-hidden
              ${logoUrl ? 'border-blue-500/50 bg-blue-500/10' : 'border-white/10 hover:border-white/30 bg-white/5'}`}
            >
              {logoUrl ? (
                <img src={logoUrl} className="h-full w-full object-contain p-2 opacity-80" />
              ) : (
                <>
                  <span className="text-xl mb-1 opacity-50">⚡</span>
                  <span className="text-xs text-white/70 font-medium">Logo</span>
                </>
              )}
            </div>
            {logoUrl && <button onClick={(e) => { e.stopPropagation(); setLogoUrl?.(null); setLogoColor?.(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">×</button>}
          </div>

          {/* Color del Logo */}
          {logoUrl && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Color del Logo</label>
              <div className="flex gap-1 flex-wrap">
                <button
                  onClick={() => setLogoColor?.(null)}
                  className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${
                    logoColor === null
                      ? 'border-blue-500 scale-110'
                      : 'border-white/20 hover:scale-105'
                  }`}
                  title="Sin color (original)"
                >
                  <span className="text-[8px] text-white/50">✕</span>
                </button>
                {['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setLogoColor?.(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      logoColor === color
                        ? 'border-blue-500 scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <input
                type="color"
                value={logoColor || '#FFFFFF'}
                onChange={(e) => setLogoColor?.(e.target.value)}
                className="w-full h-8 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {/* Filtros del Logo */}
          {logoUrl && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Filtros del Logo</label>
              
              {/* Escala de grises */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/70">Grises</span>
                <span className="text-[10px] text-white/50">{logoFilters.grayscale}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={logoFilters.grayscale}
                onChange={(e) => setLogoFilters?.({ ...logoFilters, grayscale: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              
              {/* Brillo */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/70">Brillo</span>
                <span className="text-[10px] text-white/50">{logoFilters.brightness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={logoFilters.brightness}
                onChange={(e) => setLogoFilters?.({ ...logoFilters, brightness: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              
              {/* Contraste */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/70">Contraste</span>
                <span className="text-[10px] text-white/50">{logoFilters.contrast}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={logoFilters.contrast}
                onChange={(e) => setLogoFilters?.({ ...logoFilters, contrast: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
              
              {/* Opacidad */}
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-white/70">Opacidad</span>
                <span className="text-[10px] text-white/50">{logoFilters.opacity}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={logoFilters.opacity}
                onChange={(e) => setLogoFilters?.({ ...logoFilters, opacity: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Vista previa rápida */}
      <div className="space-y-2 pt-4 border-t border-white/10">
        <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Vista Previa</label>
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10">
          <div
            style={{
              fontFamily: textStyles.fontFamily,
              fontSize: Math.min(textStyles.fontSize, 24),
              fontWeight: textStyles.fontWeight,
              color: textStyles.textColor,
              backgroundColor: textStyles.backgroundColor !== 'transparent' ? textStyles.backgroundColor : undefined,
              padding: textStyles.backgroundColor !== 'transparent' ? '8px 16px' : undefined,
              borderRadius: textStyles.backgroundColor !== 'transparent' ? '8px' : undefined,
              letterSpacing: `${textStyles.letterSpacing}px`,
              textTransform: textStyles.textTransform,
              // Sombra igual que canvas: blur 8px, offset 4px
              textShadow: textStyles.effects.shadow
                ? '4px 4px 8px rgba(0,0,0,0.8)'
                : undefined,
              // Contorno igual que canvas: 3px
              WebkitTextStroke: textStyles.effects.stroke
                ? `3px ${textStyles.textColor}`
                : undefined,
              // Brillo igual que canvas: blur 20px
              filter: textStyles.effects.glow
                ? `drop-shadow(0 0 20px ${textStyles.textColor})`
                : undefined,
            }}
          >
            {overlayText || 'Tu texto aquí'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditorPanel;
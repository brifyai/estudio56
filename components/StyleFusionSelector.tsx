import React from 'react';
import { SurfaceType, SURFACE_CONFIGS } from '../hooks/useSurfaceDetection';

interface StyleFusionSelectorProps {
  selectedStyle: SurfaceType;
  onStyleChange: (style: SurfaceType) => void;
  autoDetectedStyle?: SurfaceType | null;
  disabled?: boolean;
}

/**
 * 🎨 StyleFusionSelector - Menú de Estilos de Integración Visual
 * Permite al usuario elegir cómo el texto se funde con la imagen
 */
export const StyleFusionSelector: React.FC<StyleFusionSelectorProps> = ({
  selectedStyle,
  onStyleChange,
  autoDetectedStyle = null,
  disabled = false
}) => {
  const styles = [
    { 
      id: 'wall' as SurfaceType, 
      name: 'Pared Pintada', 
      icon: '🎨', 
      description: 'Efecto mate sobre superficie',
      config: SURFACE_CONFIGS.wall
    },
    { 
      id: 'wood' as SurfaceType, 
      name: 'Grabado Madera', 
      icon: '🪵', 
      description: 'Se funde con la veta natural',
      config: SURFACE_CONFIGS.wood
    },
    { 
      id: 'glass' as SurfaceType, 
      name: 'Reflejo Cristal', 
      icon: '🪟', 
      description: 'Transparencia y brillo suave',
      config: SURFACE_CONFIGS.glass
    },
    { 
      id: 'default' as SurfaceType, 
      name: 'Clásico', 
      icon: '✍️', 
      description: 'Texto nítido de alta visibilidad',
      config: SURFACE_CONFIGS.default
    }
  ];

  return (
    <div className="mt-4 p-4 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white text-xs font-bold uppercase tracking-widest">
          🎨 Estilo de Integración Visual
        </h4>
        {/* Indicador de modo activo */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-[10px] text-green-400 font-mono">
            {SURFACE_CONFIGS[selectedStyle].name.toUpperCase()}
          </span>
        </div>
      </div>
      
      {/* Info de detección automática */}
      {autoDetectedStyle && autoDetectedStyle !== selectedStyle && (
        <div className="mb-3 p-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg flex items-center gap-2">
          <span className="text-xs">🤖</span>
          <span className="text-[10px] text-yellow-300">
            IA detectó: <strong>{SURFACE_CONFIGS[autoDetectedStyle].name}</strong>
          </span>
          <button
            onClick={() => onStyleChange(autoDetectedStyle)}
            className="ml-auto text-[10px] text-yellow-400 hover:text-yellow-300 underline"
          >
            Aplicar
          </button>
        </div>
      )}

      {/* Estilo activo destacado */}
      <div className="mb-3 px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-lg">
        <span className="text-green-400 font-bold text-sm tracking-wider">
          {SURFACE_CONFIGS[selectedStyle].name.toUpperCase()}
        </span>
      </div>

      {/* Lista vertical de opciones */}
      <div className="space-y-1">
        {styles.map((style) => {
          const isSelected = selectedStyle === style.id;
          const isAutoDetected = autoDetectedStyle === style.id;
          
          return (
            <button
              key={style.id}
              onClick={() => !disabled && onStyleChange(style.id)}
              disabled={disabled}
              className={`
                w-full flex items-start gap-3 p-2 rounded-lg transition-all text-left
                ${isSelected
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'hover:bg-gray-800/50 border border-transparent'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Icono grande */}
              <span className="text-2xl mt-0.5">{style.icon}</span>
              
              {/* Info del estilo */}
              <div className="flex-1 min-w-0">
                {/* Nombre del estilo */}
                <span className={`block text-sm font-semibold ${
                  isSelected ? 'text-green-400' : 'text-white'
                }`}>
                  {style.name}
                </span>
                
                {/* Descripción */}
                <span className="block text-[10px] text-gray-400 mt-0.5">
                  {style.description}
                </span>
              </div>
              
              {/* Indicador de selección */}
              {isSelected && (
                <span className="w-2 h-2 rounded-full bg-green-500 mt-2 animate-pulse" />
              )}
              
              {/* Indicador de detección automática */}
              {isAutoDetected && !isSelected && (
                <span className="text-[9px] text-blue-400 mt-1 flex items-center gap-1">
                  <span>✨</span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Info del estilo actual */}
      <div className="mt-3 p-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="text-gray-400">Mezcla:</span>
          <span className="text-cyan-400 font-mono">
            {SURFACE_CONFIGS[selectedStyle].blendMode}
          </span>
          <span className="text-gray-500 mx-1">•</span>
          <span className="text-gray-400">Opacidad:</span>
          <span className="text-cyan-400 font-mono">
            {Math.round(SURFACE_CONFIGS[selectedStyle].opacity * 100)}%
          </span>
          {SURFACE_CONFIGS[selectedStyle].shadowType !== 'none' && (
            <>
              <span className="text-gray-500 mx-1">•</span>
              <span className="text-gray-400">Sombra:</span>
              <span className="text-cyan-400 font-mono">
                {SURFACE_CONFIGS[selectedStyle].shadowType}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Tip */}
      <p className="text-[10px] text-gray-500 mt-2 text-center">
        💡 El estilo "Clásico" siempre está disponible para máxima legibilidad
      </p>

      {/* Opciones de generación */}
      <div className="mt-4 pt-3 border-t border-gray-700/50">
        <div className="grid grid-cols-4 gap-1">
          <button className="flex flex-col items-center p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-colors cursor-pointer">
            <span className="text-lg">✨</span>
            <span className="text-[9px] text-purple-300 mt-1">Imágenes</span>
          </button>
          <button className="flex flex-col items-center p-2 rounded-lg bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 transition-colors cursor-pointer">
            <span className="text-lg">🎬</span>
            <span className="text-[9px] text-pink-300 mt-1">Video</span>
          </button>
          <button className="flex flex-col items-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 transition-colors cursor-pointer">
            <span className="text-lg">📸</span>
            <span className="text-[9px] text-blue-300 mt-1">Estudio</span>
          </button>
          <button className="flex flex-col items-center p-2 rounded-lg bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 transition-colors cursor-pointer">
            <span className="text-lg">🎨</span>
            <span className="text-[9px] text-orange-300 mt-1">Story Art</span>
          </button>
        </div>

        {/* Botones principales de generación */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold text-sm transition-all shadow-lg shadow-green-500/25 cursor-pointer">
            <span>🎨</span>
            <span>Generar diseño</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-500/25 cursor-pointer">
            <span>🎬</span>
            <span>Motion graphics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StyleFusionSelector;
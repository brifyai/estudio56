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
        {autoDetectedStyle && autoDetectedStyle !== selectedStyle && (
          <span className="text-[10px] text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
            🤖 IA sugiere: {SURFACE_CONFIGS[autoDetectedStyle].description}
          </span>
        )}
      </div>

      {/* Grid de opciones */}
      <div className="grid grid-cols-2 gap-2">
        {styles.map((style) => {
          const isSelected = selectedStyle === style.id;
          const isAutoDetected = autoDetectedStyle === style.id;
          
          return (
            <button
              key={style.id}
              onClick={() => !disabled && onStyleChange(style.id)}
              disabled={disabled}
              className={`
                flex flex-col items-start p-3 rounded-lg transition-all border
                ${isSelected 
                  ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20' 
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Indicador de selección */}
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-lg">{style.icon}</span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                )}
              </div>
              
              {/* Nombre del estilo */}
              <span className={`text-sm font-semibold ${
                isSelected ? 'text-green-400' : 'text-white'
              }`}>
                {style.name}
              </span>
              
              {/* Descripción */}
              <span className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                {style.description}
              </span>
              
              {/* Indicador de detección automática */}
              {isAutoDetected && !isSelected && (
                <span className="text-[9px] text-blue-400 mt-1 flex items-center gap-1">
                  <span>✨</span> Detectado
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Info del estilo actual */}
      <div className="mt-3 p-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div className="flex items-center gap-2 text-xs">
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
    </div>
  );
};

export default StyleFusionSelector;
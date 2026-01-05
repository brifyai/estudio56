import React, { useState, useCallback, useEffect } from 'react';
import { RealityLevel } from '../types';
import { 
  REALITY_CONFIGS, 
  getRealityLabel, 
  getRealityDescription, 
  getRealityIcon,
  getAvailableRealityLevels,
  isRealisticLevel,
  isAspirationalLevel,
  getRealityCategory 
} from '../services/realityMapper';

interface RealitySliderProps {
  /** Nivel actual de estrellas */
  value: RealityLevel;
  /** Callback cuando cambia el valor */
  onChange: (value: RealityLevel) => void;
  /** Callback cuando se necesita generar una nueva variación */
  onGenerateVariation?: (stars: RealityLevel) => Promise<void>;
  /** Si está cargando/generando */
  isLoading?: boolean;
  /** ID de la scene para el caché */
  sceneId?: string;
  /** URL de la imagen actual */
  currentImageUrl?: string | null;
  /** Seed para consistencia visual */
  seed?: number;
  /** Callback cuando cambia el nivel (alias de onChange) */
  onLevelChange?: (value: RealityLevel) => void;
  /** Si el slider está deshabilitado */
  disabled?: boolean;
  /** Mostrar ayuda contextual */
  showHelp?: boolean;
  /** Modo compacto (para espacios reducidos) */
  compact?: boolean;
  /** Callback cuando se genera exitosamente */
  onGenerationComplete?: (stars: RealityLevel, imageUrl: string) => void;
  /** Variaciones cacheadas para mostrar puntos verdes */
  cachedVariations?: Record<number, string>;
  /** Callback para abrir el comparador */
  onOpenComparator?: () => void;
}

const RealitySlider: React.FC<RealitySliderProps> = ({
  value,
  onChange,
  onGenerateVariation,
  isLoading = false,
  sceneId,
  currentImageUrl,
  seed,
  onLevelChange,
  disabled = false,
  showHelp = true,
  compact = false,
  onGenerationComplete,
  cachedVariations = {},
  onOpenComparator
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [localValue, setLocalValue] = useState<RealityLevel>(value);

  // Sincronizar valor local cuando cambia la prop
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Obtener configuración actual
  const currentConfig = REALITY_CONFIGS[localValue];
  const category = getRealityCategory(localValue);
  
  // Colores por categoría
  const categoryColors = {
    crudo: 'from-red-500 to-orange-500',
    autentico: 'from-green-400 to-emerald-500',
    profesional: 'from-blue-400 to-indigo-500',
    aspiracional: 'from-purple-400 to-violet-500',
    lujo: 'from-amber-400 to-yellow-500'
  };

  const gradientColor = categoryColors[category];

  // Manejar cambio del slider - solo actualiza valor local
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled || isGenerating) return;
    
    const newValue = parseFloat(e.target.value) as RealityLevel;
    setLocalValue(newValue);
  }, [disabled, isGenerating]);

  // Manejar cuando el usuario suelta el slider - llama a onLevelChange
  const handleMouseUp = useCallback(() => {
    if (localValue !== value && !disabled && !isGenerating) {
      onLevelChange?.(localValue);
    }
  }, [localValue, value, disabled, isGenerating, onLevelChange]);

  // Manejar touch end para mobile
  const handleTouchEnd = useCallback(() => {
    if (localValue !== value && !disabled && !isGenerating) {
      onLevelChange?.(localValue);
    }
  }, [localValue, value, disabled, isGenerating, onLevelChange]);

  // Niveles disponibles
  const levels = getAvailableRealityLevels();
  
  // Verificar qué niveles están cacheados
  const cachedLevels = Object.keys(cachedVariations).map(Number);

  if (compact) {
    // Modo compacto para espacios reducidos
    return (
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎚️</span>
            <span className="text-white text-xs font-medium">Realismo</span>
          </div>
          <div className={`px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r ${gradientColor} text-white`}>
            {localValue} ★
          </div>
        </div>
        
        {/* Slider compacto */}
        <div className="relative">
          <input
            type="range"
            min="1"
            max="5"
            step="0.5"
            value={localValue}
            onChange={handleChange}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleTouchEnd}
            disabled={disabled || isGenerating}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          
          {/* Indicadores de nivel con puntos de caché */}
          <div className="flex justify-between mt-1 px-0.5">
            {levels.map((level) => {
              const isCached = cachedLevels.includes(level);
              return (
                <button
                  key={level}
                  onClick={() => {
                    setLocalValue(level);
                    // Solo cambiar si es diferente y llamar a onLevelChange
                    if (level !== value) {
                      onLevelChange?.(level);
                    }
                  }}
                  disabled={disabled || isGenerating}
                  className={`relative w-4 h-4 rounded-full text-[8px] flex items-center justify-center transition-all
                    ${level === localValue
                      ? `bg-gradient-to-r ${gradientColor} scale-125`
                      : 'bg-gray-600 hover:bg-gray-500'
                    }
                    ${disabled || isGenerating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {level}
                  {/* Punto verde si está cacheado */}
                  {isCached && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_4px_#22c55e]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Label actual */}
        <div className="text-center mt-1">
          <span className="text-white/70 text-[10px]">
            {getRealityIcon(localValue)} {getRealityLabel(localValue)}
          </span>
        </div>
      </div>
    );
  }

  // Modo completo
  return (
    <div className="p-4 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎚️</span>
          <div>
            <label className="text-white text-sm font-medium block">
              Nivel de Realismo
            </label>
            <p className="text-white/50 text-[10px]">
              {getRealityCategory(localValue).toUpperCase()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${gradientColor} text-white shadow-lg`}>
            {localValue} ★
          </div>
          {isGenerating && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
        </div>
      </div>
      
      {/* Slider principal */}
      <div className="relative mb-4">
        <input
          type="range"
          min="1"
          max="5"
          step="0.5"
          value={localValue}
          onChange={handleChange}
          disabled={disabled || isGenerating}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          style={{
            background: `linear-gradient(to right,
              #ef4444 0%,
              #f97316 22%,
              #22c55e 44%,
              #3b82f6 66%,
              #8b5cf6 88%,
              #eab308 100%)`
          }}
        />
        
        {/* Indicador de posición actual */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-none transition-all"
          style={{
            left: `${((localValue - 1) / 4) * 100}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${gradientColor}`} />
        </div>
      </div>
      
      {/* Labels de los extremos */}
      <div className="flex justify-between text-[10px] text-white/50 mb-4">
        <div className="text-center">
          <span className="block text-lg mb-0.5">📸</span>
          <span>Crudo</span>
        </div>
        <div className="text-center">
          <span className="block text-lg mb-0.5">🏪</span>
          <span>Auténtico</span>
        </div>
        <div className="text-center">
          <span className="block text-lg mb-0.5">✨</span>
          <span>Profesional</span>
        </div>
        <div className="text-center">
          <span className="block text-lg mb-0.5">🏆</span>
          <span>Lujo</span>
        </div>
      </div>
      
      {/* 🎯 BOTONES SEPARADOS: Actualizar vs Comparar */}
      <div className="flex gap-2 mb-3">
        {/* Botón Actualizar - Solo cambia la imagen principal */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (localValue !== value && !disabled && !isGenerating) {
              onLevelChange?.(localValue);
            }
          }}
          disabled={disabled || isGenerating || localValue === value}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2
            ${localValue === value || disabled || isGenerating
              ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
              : 'bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30 hover:border-blue-500/70'
            }
          `}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {localValue === value ? 'Sin cambios' : 'Actualizar'}
        </button>
        
        {/* Botón Comparar - Abre el comparador */}
        <button
          onClick={onOpenComparator}
          disabled={disabled || cachedLevels.length < 2}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2
            ${cachedLevels.length < 2
              ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
              : 'bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30 hover:border-purple-500/70'
            }
          `}
          title={cachedLevels.length < 2 ? 'Genera al menos 2 variaciones para comparar' : 'Comparar con original'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Comparar
        </button>
      </div>
      
      {/* Ayuda contextual */}
      {showHelp && (
        <div className="mt-3 flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg p-2">
          <span className="text-blue-400 text-xs">💡</span>
          <p className="text-blue-300/80 text-[10px] leading-tight">
            {isRealisticLevel(localValue)
              ? 'Nivel recomendado para generar confianza en clientes locales. Se ve auténtico y cercano.'
              : isAspirationalLevel(localValue)
              ? 'Nivel aspiracional ideal para branding premium. Puede verse "demasiado perfecto".'
              : 'El punto dulce entre autenticidad y profesionalismo. Ideal para la mayoría de negocios.'
            }
          </p>
        </div>
      )}
      
      {/* 🎯 INDICADORES DE CACHÉ */}
      {sceneId && (
        <div className="mt-3 flex items-center justify-between text-[10px] text-white/40">
          <span>ID: {sceneId.substring(0, 12)}...</span>
          <div className="flex items-center gap-2">
            {/* Puntos verdes para niveles cacheados */}
            <div className="flex gap-1">
              {levels.slice(0, 5).map((level) => {
                const isCached = cachedLevels.includes(level);
                return (
                  <span
                    key={level}
                    className={`w-1.5 h-1.5 rounded-full ${isCached ? 'bg-green-500 shadow-[0_0_4px_#22c55e]' : 'bg-gray-700'}`}
                    title={`Nivel ${level}★: ${isCached ? 'Generado' : 'No generado'}`}
                  />
                );
              })}
            </div>
            <span>{isGenerating ? 'Generando...' : `${cachedLevels.length} variaciones`}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealitySlider;
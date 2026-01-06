import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { RealityLevel } from '../types';
import Swal from 'sweetalert2';
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
  /** Callback cuando inicia la generación (para cerrar alertas de loading) */
  onGenerationStart?: () => void;
  /** Si la generación actual es una variación de realidad (evita reseteo del slider) */
  isRealityVariation?: boolean;
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
  onOpenComparator,
  onGenerationStart,
  isRealityVariation = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [localValue, setLocalValue] = useState<RealityLevel>(value);
  
  // Refs para tracking de cambios
  const loadingSwalRef = useRef<any>(null);
  const previousImageRef = useRef<string | null>(null);
  const previousValueRef = useRef<RealityLevel>(value);
  const isFromVariationRef = useRef(false);

  // ✅ CORRECCIÓN COMPLETA: Solo resetear a 2.5 cuando se genera una NUEVA IMAGEN BASE
  // Las variaciones de realidad NO deben resetear el slider
  useEffect(() => {
    // Si currentImageUrl cambió
    if (currentImageUrl && currentImageUrl !== previousImageRef.current) {
      // Si viene de una variación, NO resetear
      if (isFromVariationRef.current) {
        console.log('🎚️ [Slider] Variación generada, manteniendo slider en:', localValue);
        isFromVariationRef.current = false; // Resetear el ref
      } else {
        // Es una nueva imagen base, resetear a 2.5
        console.log('🎚️ [Slider] Nueva imagen base, reseteando a 2.5★');
        setLocalValue(2.5);
      }
    }
    
    // Actualizar referencia
    previousImageRef.current = currentImageUrl;
  }, [currentImageUrl, localValue]);

  // Cuando isRealityVariation se setea a true, marcar el ref
  useEffect(() => {
    if (isRealityVariation) {
      isFromVariationRef.current = true;
      console.log('🎚️ [Slider] Marcando como variación de realidad');
    }
  }, [isRealityVariation]);

  // ✅ NOTA: cachedLevels se calcula directamente de cachedVariations (línea 137)
  // No necesitamos useEffect porque React actualiza automáticamente la variable calculada

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

  // Manejar cuando el usuario suelta el slider - NO llama a onLevelChange (solo actualiza visualmente)
  // La actualización real solo ocurre cuando el usuario hace clic en "Actualizar"
  const handleMouseUp = useCallback(() => {
    // Solo actualiza el valor local, no llama a onLevelChange
    console.log('🎚️ [Slider] Usuario soltó el slider en nivel:', localValue);
  }, [localValue]);

  // Manejar touch end para mobile - igual, solo actualiza visualmente
  const handleTouchEnd = useCallback(() => {
    console.log('🎚️ [Slider] Usuario terminó touch en nivel:', localValue);
  }, [localValue]);

  // Niveles disponibles
  const levels = getAvailableRealityLevels();
  
  // ✅ USEMEMO: Verificar qué niveles están cacheados (se actualiza cuando cachedVariations cambia)
  const cachedLevels = useMemo(() => {
    const cached = Object.keys(cachedVariations).map(Number).sort((a, b) => a - b);
    console.log('🎚️ [Slider] cachedLevels calculado:', cached);
    return cached;
  }, [cachedVariations]);

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
                    // Solo actualiza el valor local, la actualización real requiere clic en "Actualizar"
                    setLocalValue(level);
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
    <div
      className="p-4 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-md"
      onClick={(e) => {
        console.log('🖱️ [RealitySlider] onClick capturado');
        e.stopPropagation();
      }}
    >
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
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
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
          type="button"
          onMouseDown={(e) => {
            console.log('🖱️ [Actualizar] onMouseDown');
            e.stopPropagation();
          }}
          onClick={(e) => {
            console.log('🖱️ [Actualizar] onClick - Abriendo comparador:', !!onOpenComparator);
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            if (localValue !== value && !disabled && !isGenerating) {
              console.log('🖱️ [Actualizar] Mostrando confirmación...');
              
              // Mostrar alerta SweetAlert antes de actualizar
              const config = REALITY_CONFIGS[localValue];
              Swal.fire({
                icon: 'question',
                title: '¿Actualizar nivel de realismo?',
                html: `
                  <div style="text-align: left; padding: 10px;">
                    <p style="margin-bottom: 8px;">
                      <strong style="color: #3b82f6;">Nivel actual:</strong> ${value}★ - ${getRealityLabel(value)}
                    </p>
                    <p style="margin-bottom: 8px;">
                      <strong style="color: #22c55e;">Nuevo nivel:</strong> ${localValue}★ - ${getRealityLabel(localValue)}
                    </p>
                  </div>
                `,
                background: '#1a1a1a',
                color: '#ffffff',
                showCancelButton: true,
                confirmButtonColor: '#3b82f6',
                cancelButtonColor: '#6b7280',
                confirmButtonText: '✨ Actualizar',
                cancelButtonText: 'Cancelar',
                customClass: {
                  popup: 'rounded-2xl',
                  confirmButton: 'rounded-xl px-4 py-2',
                  cancelButton: 'rounded-xl px-4 py-2'
                }
              }).then((result) => {
                if (result.isConfirmed) {
                  console.log('🖱️ [Actualizar] Usuario confirmó, iniciando generación...');
                  
                  // Notificar al padre que inicie la generación (mostrará la alerta de loading)
                  onGenerationStart?.();
                  
                  // Llamar al callback para generar la nueva imagen
                  onLevelChange?.(localValue);
                } else {
                  console.log('🖱️ [Actualizar] Usuario canceló');
                }
              });
            } else {
              console.log('🖱️ [Actualizar] No se llama onLevelChange - localValue:', localValue, 'value:', value, 'disabled:', disabled, 'isGenerating:', isGenerating);
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
        
        {/* Botón Comparar - Habilitado con 1+ variación (la imagen base siempre está disponible) */}
        <button
          onClick={onOpenComparator}
          disabled={disabled || cachedLevels.length < 1}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2
            ${cachedLevels.length < 1
              ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
              : 'bg-purple-500/20 border border-purple-500/50 text-purple-300 hover:bg-purple-500/30 hover:border-purple-500/70'
            }
          `}
          title={cachedLevels.length < 1 ? 'Genera una imagen primero' : 'Comparar realismos'}
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
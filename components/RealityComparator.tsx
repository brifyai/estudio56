import React, { useState, useCallback, useEffect, useRef } from 'react';
import { RealityVariation, RealityLevel } from '../types';
import { getRealityCategory } from '../services/realityMapper';

interface RealityComparatorProps {
  /** ID de la scene para cargar variaciones */
  sceneId?: string | null;
  /** Variaciones cacheadas (nivel -> URL) */
  variations?: Record<number, string>;
  /** Nivel actual seleccionado */
  currentLevel?: RealityLevel;
  /** Nivel original (ancla) - típicamente 2.5 */
  originalLevel?: RealityLevel;
  /** Seed para generar variaciones */
  seed?: number;
  /** Callback cuando se selecciona un nivel */
  onSelect?: (level: RealityLevel) => void;
  /** Callback cuando se cierra el comparador */
  onClose?: () => void;
  /** Formato de aspect ratio para el tamaño */
  aspectRatio?: '1:1' | '9:16' | '4:5' | '16:9';
  /** Si el comparador está activo */
  isActive?: boolean;
  /** Imagen original (ancla) para comparación directa */
  originalImage?: string;
}

const RealityComparator: React.FC<RealityComparatorProps> = ({
  sceneId,
  variations = {},
  currentLevel = 2.5,
  originalLevel = 2.5,
  seed = 0,
  onSelect,
  onClose,
  aspectRatio = '1:1',
  isActive = true,
  originalImage
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Obtener las dos variaciones para comparar
  // LÓGICA CORREGIDA: Comparar imagen ACTUAL vs imagen ORIGINAL (ancla)
  // Esto garantiza que siempre haya 2 imágenes para comparar
  const currentLevelNum = parseFloat(currentLevel.toString());
  const originalLevelNum = parseFloat(originalLevel.toString());
  
  // La imagen de la izquierda es la ORIGINAL (ancla de Estudio 56)
  // Prioridad: 1) originalImage prop, 2) variations[originalLevel]
  const leftVariationUrl = originalImage || variations[originalLevelNum] || null;
  
  // La imagen de la derecha es la ACTUAL (cualquier nivel que el usuario haya seleccionado)
  const rightVariationUrl = variations[currentLevelNum] || null;
  
  // Crear objetos RealityVariation simulados para las funciones helper
  // leftVariation = ORIGINAL (ancla), rightVariation = ACTUAL (currentLevel)
  const leftVariation: RealityVariation | null = leftVariationUrl ? {
    id: `var_original_${Date.now()}`,
    parent_scene_id: sceneId || '',
    seed: seed,
    stars: originalLevelNum as RealityLevel,
    image_url: leftVariationUrl,
    prompt_used: '',
    created_at: new Date(),
    cached: true
  } : null;
  
  const rightVariation: RealityVariation | null = rightVariationUrl ? {
    id: `var_current_${Date.now()}`,
    parent_scene_id: sceneId || '',
    seed: seed,
    stars: currentLevelNum as RealityLevel,
    image_url: rightVariationUrl,
    prompt_used: '',
    created_at: new Date(),
    cached: true
  } : null;

  // Colores por categoría
  const getCategoryColor = (stars: RealityLevel): string => {
    const category = getRealityCategory(stars);
    const colors: Record<string, string> = {
      crudo: 'border-red-500 shadow-red-500/30',
      autentico: 'border-green-500 shadow-green-500/30',
      profesional: 'border-blue-500 shadow-blue-500/30',
      aspiracional: 'border-purple-500 shadow-purple-500/30',
      lujo: 'border-amber-500 shadow-amber-500/30'
    };
    return colors[category] || 'border-white/20';
  };

  // Obtener dimensiones según aspect ratio
  const getDimensions = () => {
    switch (aspectRatio) {
      case '9:16':
        return { width: 'w-[200px]', height: 'h-[356px]' };
      case '4:5':
        return { width: 'w-[200px]', height: 'h-[250px]' };
      case '16:9':
        return { width: 'w-[356px]', height: 'h-[200px]' };
      default:
        return { width: 'w-[280px]', height: 'h-[280px]' };
    }
  };

  const dimensions = getDimensions();

  // Manejar arrastre del slider
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Event listeners globales para el arrastre
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Renderizar una imagen con soporte para generación bajo demanda
  const renderImage = (variation: RealityVariation | null, isLeft: boolean, onGenerate?: () => void) => {
    if (!variation) {
      return (
        <div className={`${dimensions.width} ${dimensions.height} bg-gray-800/50 rounded-[1.5rem] flex flex-col items-center justify-center border-2 border-dashed border-white/20 relative overflow-hidden`}>
          {/* Skeleton Loader Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" style={{ transform: 'skewX(-20deg)' }} />
          </div>
          
          <div className="text-center relative z-10">
            <span className="text-3xl mb-2 block">🎨</span>
            <span className="text-white/50 text-xs block mb-3">Variación no generada</span>
            
            {onGenerate && (
              <button
                onClick={onGenerate}
                className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 text-blue-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 mx-auto"
              >
                <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Generar
              </button>
            )}
          </div>
        </div>
      );
    }

    const borderColor = getCategoryColor(variation.stars);

    return (
      <div className="relative">
        <div
          className={`
            ${dimensions.width} ${dimensions.height} rounded-[1.5rem] overflow-hidden relative
            transition-all duration-300
          `}
        >
          <img
            src={variation.image_url}
            alt={`${variation.stars}★`}
            className="w-full h-full object-cover"
            draggable={false}
          />
          
          {/* Overlay con info - Solo estrellas */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <span className="text-white/60 text-xs">({variation.stars}★)</span>
            </div>
          </div>
        </div>
        
        {/* Botón seleccionar - Solo estrellas */}
        {onSelect && isLeft && leftVariation && (
          <button
            onClick={() => onSelect(leftVariation.stars)}
            className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium rounded-lg transition-colors"
          >
            {leftVariation.stars}★
          </button>
        )}
        {onSelect && !isLeft && rightVariation && (
          <button
            onClick={() => onSelect(rightVariation.stars)}
            className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium rounded-lg transition-colors"
          >
            {rightVariation.stars}★
          </button>
        )}
      </div>
    );
  };

  // Si no hay variaciones, mostrar estado vacío
  if (!leftVariation && !rightVariation) {
    return (
      <div className="p-6 bg-black/40 rounded-[1.5rem] border border-white/10 text-center">
        <span className="text-3xl mb-3 block">🔍</span>
        <p className="text-white/60 text-sm">
          Genera variaciones primero para comparar
        </p>
      </div>
    );
  }

  // 🎯 NUEVO: Si solo hay una variación (izquierda), mostrar en modo "solo vista"
  // Esto ocurre cuando el usuario no ha generado variaciones adicionales
  if (leftVariation && !rightVariation) {
    return (
      <div className="relative flex flex-col items-center">
        {/* Header con solo botón cerrar */}
        <div className="flex items-center justify-end w-full mb-4">
          {/* Botón cerrar */}
          {onClose && (
            <button
              onClick={onClose}
              className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <p className="text-white/50 text-xs text-center">
          Genera más variaciones para comparar
        </p>

        {/* Indicador de modo único - Solo estrellas */}
        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300/80 text-xs text-center">
            📷 ({originalLevelNum}★)
          </p>
        </div>

        {/* Mostrar solo la imagen izquierda */}
        {renderImage(leftVariation, true, undefined)}

        {/* Info adicional */}
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-300/80 text-[10px] text-center">
            💡 Genera variaciones en el slider para comparar diferentes niveles de realismo
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Header con solo botón cerrar */}
      <div className="flex items-center justify-end w-full mb-4">
        {/* Botón cerrar */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] transition-colors"
          >
            ✕
          </button>
        )}
      </div>
      <p className="text-white/50 text-xs text-center">
        Arrastra para comparar las diferencias
      </p>

      {/* Modo slider de comparación */}
      {leftVariation && rightVariation && (
        <div
          ref={containerRef}
          className={`
            relative ${dimensions.width} ${dimensions.height} rounded-[1.5rem] overflow-hidden cursor-ew-resize
            border-2 ${getCategoryColor(leftVariation.stars)}
            shadow-[0_0_30px_rgba(0,0,0,0.5)]
            mx-auto
          `}
          onMouseDown={handleMouseDown}
          onTouchMove={(e) => {
            if (!containerRef.current) return;
            const touch = e.touches[0];
            const rect = containerRef.current.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setSliderPosition(percentage);
          }}
        >
          {/* Imagen derecha (fondo) */}
          <img
            src={rightVariation.image_url}
            alt="Derecha"
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />

          {/* Imagen izquierda (superior, recortada) */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={leftVariation.image_url}
              alt="Izquierda"
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          </div>

          {/* Línea divisora */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)]"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>

          {/* Labels en las esquinas - Eliminados para evitar duplicación */}
        </div>
      )}

      {/* Labels de las versiones - Solo estrellas */}
      <div className="flex justify-between items-center mt-4 gap-4">
        {leftVariation && (
          <div className="flex-1 text-center">
            <span className="text-white/40 text-xs">
              {leftVariation.stars}★
            </span>
          </div>
        )}
        
        <div className="text-white/30 text-sm font-mono">VS</div>
        
        {rightVariation && (
          <div className="flex-1 text-center">
            <span className="text-white/40 text-xs">
              {rightVariation.stars}★
            </span>
          </div>
        )}
      </div>

      {/* Botones de acción - Solo estrellas */}
      {onSelect && (leftVariation || rightVariation) && (
        <div className="flex gap-2 mt-4">
          {leftVariation && (
            <button
              onClick={() => onSelect(leftVariation.stars)}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              {leftVariation.stars}★
            </button>
          )}
          {rightVariation && (
            <button
              onClick={() => onSelect(rightVariation.stars)}
              className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              {rightVariation.stars}★
            </button>
          )}
        </div>
      )}

      {/* Info adicional - Eliminado */}
    </div>
  );
};

export default RealityComparator;
import React, { useState, useEffect, useMemo } from 'react';
import { VisualMimicryPreview } from './VisualMimicryPreview';
import { StyleFusionSelector } from './StyleFusionSelector';
import { SurfaceType, SurfaceConfig, useSurfaceDetection, generateSurfaceCSS, generateDisplacementFilter, SURFACE_CONFIGS } from '../hooks/useSurfaceDetection';
import { VisualMimicryResult } from '../services/visualMimicryService';

interface MimicryTextEditorProps {
  imageUrl: string;
  initialText?: string;
  visualMimicryResult?: VisualMimicryResult;
  onTextChange?: (text: string) => void;
  onStyleChange?: (surfaceType: SurfaceType) => void;
  fontFamily?: string;
  fontSize?: number;
}

/**
 * 🎨 MimicryTextEditor - Editor Completo de Texto con Mimetismo Visual
 * 
 * Características:
 * - Preview en tiempo real con efectos de mimetismo
 * - Selector de estilos de fusión (Pared, Madera, Cristal, Clásico)
 * - Detección automática de superficie con Gemini 2.0
 * - CSS dinámico basado en el estilo seleccionado
 */
export const MimicryTextEditor: React.FC<MimicryTextEditorProps> = ({
  imageUrl,
  initialText = 'Tu Texto Aquí',
  visualMimicryResult,
  onTextChange,
  onStyleChange,
  fontFamily = 'Inter',
  fontSize = 48
}) => {
  const [text, setText] = useState(initialText);
  const [surfaceType, setSurfaceType] = useState<SurfaceType>('default');
  const [autoDetectedSurface, setAutoDetectedSurface] = useState<SurfaceType | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  
  const { detectSurface, getSurfaceCSS } = useSurfaceDetection();

  // Detectar superficie automáticamente al cargar
  useEffect(() => {
    const detect = async () => {
      setIsDetecting(true);
      try {
        const detected = await detectSurface(imageUrl);
        setAutoDetectedSurface(detected);
        // Auto-seleccionar el detectado
        setSurfaceType(detected);
        onStyleChange?.(detected);
        console.log(`🎯 [MimicryTextEditor] Superficie auto-detectada: ${detected}`);
      } catch (error) {
        console.warn("⚠️ Error en detección automática:", error);
      } finally {
        setIsDetecting(false);
      }
    };

    if (imageUrl) {
      detect();
    }
  }, [imageUrl]);

  // Generar CSS combinado (Visual Mimicry + Surface Fusion)
  const combinedStyles = useMemo(() => {
    // CSS base del Visual Mimicry
    const baseStyles = visualMimicryResult ? {
      color: visualMimicryResult.extractedColors.accentColor,
      textShadow: visualMimicryResult.generatedCSS.textShadow,
      mixBlendMode: visualMimicryResult.blendMode.mode,
      filter: visualMimicryResult.generatedCSS.filter,
      backdropFilter: visualMimicryResult.generatedCSS.backdropFilter,
    } : {
      color: '#FFFFFF',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
      mixBlendMode: 'normal' as const,
      filter: 'none',
      backdropFilter: 'none',
    };

    // CSS del Surface Fusion (sobrescribe blend y opacity)
    const surfaceCSS = getSurfaceCSS(surfaceType);
    
    return {
      ...baseStyles,
      // Aplicar propiedades del surface CSS
      opacity: surfaceType === 'default' ? 1 : 0.85,
    };
  }, [visualMimicryResult, surfaceType, getSurfaceCSS]);

  // Generar clases CSS dinámicas
  const dynamicClasses = useMemo(() => {
    const classes: string[] = [];
    
    if (surfaceType !== 'default') {
      classes.push(`mix-blend-${SURFACE_CONFIGS[surfaceType].blendMode}`);
    }
    
    if (SURFACE_CONFIGS[surfaceType].blurAmount > 0) {
      classes.push(`backdrop-blur-${SURFACE_CONFIGS[surfaceType].blurAmount}`);
    }
    
    return classes.join(' ');
  }, [surfaceType]);

  // Generar filtro de desplazamiento para rugosidad
  const displacementFilter = useMemo(() => {
    return generateDisplacementFilter(SURFACE_CONFIGS[surfaceType].displacementScale);
  }, [surfaceType]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    onTextChange?.(newText);
  };

  const handleStyleChange = (newSurfaceType: SurfaceType) => {
    setSurfaceType(newSurfaceType);
    onStyleChange?.(newSurfaceType);
    console.log(`🎨 [MimicryTextEditor] Estilo cambiado a: ${newSurfaceType}`);
  };

  return (
    <div className="space-y-4">
      {/* Preview con efectos */}
      <div className="relative overflow-hidden rounded-xl border border-gray-700">
        <VisualMimicryPreview
          imageUrl={imageUrl}
          text={text}
          visualMimicryResult={visualMimicryResult}
          fontFamily={fontFamily}
          fontSize={fontSize}
          position="center"
        />
        
        {/* Filtro de desplazamiento SVG */}
        {displacementFilter && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'url(#surface-displacement)' }}>
            <defs>
              <filter id="surface-displacement">
                <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
                <feDisplacementMap 
                  in2="turbulence" 
                  in="SourceGraphic" 
                  scale={SURFACE_CONFIGS[surfaceType].displacementScale * 10} 
                  xChannelSelector="R" 
                  yChannelSelector="G" 
                />
              </filter>
            </defs>
          </svg>
        )}

        {/* Indicador de estado */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          {isDetecting ? (
            <span className="bg-blue-500/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              Detectando...
            </span>
          ) : (
            <span className="bg-green-500/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-white flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              🦋 {SURFACE_CONFIGS[surfaceType].name}
            </span>
          )}
        </div>
      </div>

      {/* Editor de texto */}
      <div className="p-4 bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50">
        <label className="text-white text-xs font-bold uppercase tracking-widest block mb-2">
          ✏️ Texto del Negocio
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-lg font-semibold focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all"
          placeholder="Escribe el nombre de tu negocio..."
        />
      </div>

      {/* Selector de estilo de fusión */}
      <StyleFusionSelector
        selectedStyle={surfaceType}
        onStyleChange={handleStyleChange}
        autoDetectedStyle={autoDetectedSurface}
      />

      {/* CSS generado (para debugging) */}
      <details className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
        <summary className="text-gray-400 text-xs cursor-pointer hover:text-white">
          🔍 Ver CSS Generado
        </summary>
        <pre className="mt-3 p-3 bg-gray-800 rounded text-[10px] text-green-400 overflow-x-auto">
          {`/* Surface: ${surfaceType} */
.${surfaceType}-style {
  mix-blend-mode: ${SURFACE_CONFIGS[surfaceType].blendMode};
  opacity: ${SURFACE_CONFIGS[surfaceType].opacity};
  text-shadow: ${SURFACE_CONFIGS[surfaceType].shadowType === 'outer' ? '2px 2px 4px rgba(0,0,0,0.5)' : SURFACE_CONFIGS[surfaceType].shadowType === 'inner' ? 'inset 2px 2px 4px rgba(0,0,0,0.4)' : 'none'};
  backdrop-filter: ${SURFACE_CONFIGS[surfaceType].blurAmount > 0 ? `blur(${SURFACE_CONFIGS[surfaceType].blurAmount}px)` : 'none'};
  filter: ${SURFACE_CONFIGS[surfaceType].blendMode === 'overlay' ? 'contrast(1.2)' : 'none'};
}`}
        </pre>
      </details>
    </div>
  );
};

// Re-exportar tipos para uso externo
export type { MimicryTextEditorProps };
export type { SurfaceType, SurfaceConfig };
export { SURFACE_CONFIGS };

export default MimicryTextEditor;
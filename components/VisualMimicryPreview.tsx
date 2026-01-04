import React, { useMemo } from 'react';
import { VisualMimicryResult } from '../services/visualMimicryService';

interface VisualMimicryPreviewProps {
  imageUrl: string;
  text: string;
  visualMimicryResult?: VisualMimicryResult;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  position?: 'top' | 'center' | 'bottom' | 'custom';
  customPosition?: { x: number; y: number };
}

/**
 * 🎨 COMPONENTE DE PREVIEW CON MIMETISMO VISUAL
 * Aplica los efectos de mimetismo visual al texto para que parezca
 * integrado naturalmente en la fotografía.
 */
export const VisualMimicryPreview: React.FC<VisualMimicryPreviewProps> = ({
  imageUrl,
  text,
  visualMimicryResult,
  fontFamily = 'Inter',
  fontSize = 48,
  fontWeight = '700',
  position = 'center',
  customPosition
}) => {
  
  // Generar estilos CSS basados en el resultado de Visual Mimicry
  const textStyles = useMemo(() => {
    if (!visualMimicryResult) {
      // Estilos por defecto si no hay análisis
      return {
        color: '#FFFFFF',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        mixBlendMode: 'normal' as const,
        filter: 'none',
        backdropFilter: 'none',
      };
    }

    const { extractedColors, blendMode, depthOfField, lighting, generatedCSS } = visualMimicryResult;

    return {
      color: extractedColors.accentColor,
      textShadow: generatedCSS.textShadow,
      mixBlendMode: blendMode.mode,
      filter: generatedCSS.filter,
      backdropFilter: generatedCSS.backdropFilter,
    };
  }, [visualMimicryResult]);

  // Generar clases CSS dinámicas
  const cssClasses = useMemo(() => {
    if (!visualMimicryResult) return '';

    const { blendMode, depthOfField, lighting } = visualMimicryResult;
    const classes: string[] = [];

    // Modo de fusión
    if (blendMode.mode !== 'normal') {
      classes.push(`mix-blend-${blendMode.mode}`);
    }

    // Profundidad de campo
    if (depthOfField.blurAmount > 0) {
      classes.push(`backdrop-blur-${Math.round(depthOfField.blurAmount)}`);
    }

    // Filtros de temperatura
    if (lighting.temperature === 'warm') {
      classes.push('sepia-[0.15]');
    } else if (lighting.temperature === 'cool') {
      classes.push('hue-rotate-15');
    }

    return classes.join(' ');
  }, [visualMimicryResult]);

  // Calcular posición del texto
  const positionStyles = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      whiteSpace: 'nowrap',
    };

    switch (position) {
      case 'top':
        return { ...baseStyles, top: '15%' };
      case 'bottom':
        return { ...baseStyles, bottom: '15%' };
      case 'custom':
        return {
          ...baseStyles,
          top: customPosition?.y ?? '50%',
          left: customPosition?.x ?? '50%',
          transform: 'translate(-50%, -50%)',
        };
      case 'center':
      default:
        return { ...baseStyles, top: '50%', transform: 'translate(-50%, -50%)' };
    }
  }, [position, customPosition]);

  // Generar filtro SVG de ruido si la imagen tiene grano
  const noiseFilterId = useMemo(() => {
    if (!visualMimicryResult?.noise?.hasNoise) return null;
    return 'film-grain-overlay';
  }, [visualMimicryResult]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      {/* Imagen de fondo */}
      <img
        src={imageUrl}
        alt="Preview"
        className="w-full h-full object-cover"
      />

      {/* Filtro de ruido SVG (si aplica) */}
      {noiseFilterId && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'url(#film-grain)' }}>
          <defs>
            <filter id="film-grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feComponentTransfer>
                <feFuncA type="linear" slope={visualMimicryResult?.noise?.noiseOpacity ?? 0.15} />
              </feComponentTransfer>
              <feBlend mode="overlay" in2="SourceGraphic" />
            </filter>
          </defs>
        </svg>
      )}

      {/* Texto con efectos de mimetismo visual */}
      <div
        className={`absolute ${cssClasses}`}
        style={{
          ...positionStyles,
          ...textStyles,
          fontFamily,
          fontSize: `${fontSize}px`,
          fontWeight,
          // Aplicar variables CSS personalizadas
          ['--extracted-accent-color' as any]: visualMimicryResult?.extractedColors.accentColor,
          ['--extracted-shadow-color' as any]: visualMimicryResult?.extractedColors.shadowColor,
          ['--extracted-highlight-color' as any]: visualMimicryResult?.extractedColors.highlightColor,
          ['--blend-mode' as any]: visualMimicryResult?.blendMode.mode,
        }}
      >
        {text}
      </div>

      {/* Indicador visual de que el mimetismo está activo */}
      {visualMimicryResult && (
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span>🦋 Visual Mimicry</span>
        </div>
      )}
    </div>
  );
};

export default VisualMimicryPreview;
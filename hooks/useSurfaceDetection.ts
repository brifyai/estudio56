import { GoogleGenAI } from "@google/genai";

/**
 * 🎯 TIPOS DE SUPERFICIE PARA MIMETISMO VISUAL
 */
export type SurfaceType = 'wall' | 'wood' | 'glass' | 'metal' | 'fabric' | 'concrete' | 'default';

export interface SurfaceConfig {
  name: string;
  label: string;
  icon: string;
  blendMode: 'multiply' | 'overlay' | 'screen' | 'soft-light' | 'normal';
  opacity: number;
  shadowType: 'outer' | 'inner' | 'none';
  blurAmount: number;
  displacementScale: number;
  noiseIntensity: number;
  description: string;
  previewColor: string;
  textColor: string;
}

/**
 * Configuracion CSS para cada tipo de superficie
 */
export const SURFACE_CONFIGS: Record<SurfaceType, SurfaceConfig> = {
  wall: {
    name: 'Pared Pintada',
    label: 'Pared Blanca',
    icon: '🏪',
    blendMode: 'multiply',
    opacity: 0.85,
    shadowType: 'outer',
    blurAmount: 0,
    displacementScale: 0.5,
    noiseIntensity: 0.2,
    description: 'Efecto mate sobre superficie rugosa',
    previewColor: '#f5f5f5',
    textColor: '#333333'
  },
  wood: {
    name: 'Grabado Madera',
    label: 'Madera',
    icon: '🪵',
    blendMode: 'overlay',
    opacity: 0.9,
    shadowType: 'inner',
    blurAmount: 0,
    displacementScale: 0.3,
    noiseIntensity: 0.1,
    description: 'Se funde con la veta natural de la madera',
    previewColor: '#8B4513',
    textColor: '#FFE4C4'
  },
  glass: {
    name: 'Reflejo Cristal',
    label: 'Cristal',
    icon: '✨',
    blendMode: 'screen',
    opacity: 0.6,
    shadowType: 'outer',
    blurAmount: 2,
    displacementScale: 0,
    noiseIntensity: 0.05,
    description: 'Transparencia y brillo suave',
    previewColor: '#87CEEB',
    textColor: '#1E90FF'
  },
  metal: {
    name: 'Metal',
    label: 'Metal',
    icon: '🏢',
    blendMode: 'soft-light',
    opacity: 0.8,
    shadowType: 'inner',
    blurAmount: 1,
    displacementScale: 0.1,
    noiseIntensity: 0.15,
    description: 'Reflejo metalico sutil',
    previewColor: '#C0C0C0',
    textColor: '#2F4F4F'
  },
  fabric: {
    name: 'Textil',
    label: 'Textil',
    icon: '🧵',
    blendMode: 'multiply',
    opacity: 0.75,
    shadowType: 'none',
    blurAmount: 0.5,
    displacementScale: 0.4,
    noiseIntensity: 0.25,
    description: 'Integracion suave con textiles',
    previewColor: '#DDA0DD',
    textColor: '#4B0082'
  },
  concrete: {
    name: 'Hormigon',
    label: 'Concreto',
    icon: '🏗️',
    blendMode: 'overlay',
    opacity: 0.85,
    shadowType: 'outer',
    blurAmount: 0,
    displacementScale: 0.6,
    noiseIntensity: 0.3,
    description: 'Textura rugosa del hormigon',
    previewColor: '#696969',
    textColor: '#D3D3D3'
  },
  default: {
    name: 'Clasico',
    label: 'Clasico',
    icon: '📝',
    blendMode: 'normal',
    opacity: 1,
    shadowType: 'outer',
    blurAmount: 0,
    displacementScale: 0,
    noiseIntensity: 0,
    description: 'Texto nitido de alta visibilidad',
    previewColor: '#3B82F6',
    textColor: '#FFFFFF'
  }
};

/**
 * Detecta el tipo de superficie en la imagen usando Gemini 2.0
 */
export const detectSurfaceType = async (
  imageDataUrl: string
): Promise<SurfaceType> => {
  try {
    const ai = new GoogleGenAI({
      apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
    });
    
    const prompt = `Analiza esta imagen y detecta el tipo de superficie principal donde aparecería el texto.
    
    Responde SOLO con una palabra en minusculas:
    - "wall" si es una pared pintada, enlucida o con papel tapiz
    - "wood" si es madera, muebles de madera, o superficies de madera
    - "glass" si es vidrio, ventanas, o superficies reflectantes
    - "metal" si es metal, acero, o superficies metalicas
    - "fabric" si es tela, cortinas, tapizados o textiles
    - "concrete" si es hormigon, cemento o superficies industriales
    - "default" si no puedes determinarlo con certeza
    
    La superficie donde el texto se superpondria es:`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageDataUrl.split(',')[1]
            }
          }
        ]
      }
    });

    const surfaceType = response.text?.trim().toLowerCase() as SurfaceType;
    
    // Validar que sea un tipo valido
    if (SURFACE_CONFIGS[surfaceType]) {
      console.log(`🎯 [SurfaceDetection] Superficie detectada: ${surfaceType}`);
      return surfaceType;
    }
    
    console.warn(`⚠️ [SurfaceDetection] Superficie no reconocida: ${surfaceType}, usando default`);
    return 'default';
    
  } catch (error) {
    console.warn("⚠️ [SurfaceDetection] Error detectando superficie:", error);
    return 'default';
  }
};

/**
 * Genera el CSS completo para una superficie especifica
 */
export const generateSurfaceCSS = (
  surfaceType: SurfaceType,
  options?: {
    customColor?: string;
    customOpacity?: number;
  }
): string => {
  const config = SURFACE_CONFIGS[surfaceType];
  const opacity = options?.customOpacity ?? config.opacity;
  
  // Generar sombra segun el tipo
  let textShadow = '';
  if (config.shadowType === 'outer') {
    textShadow = '2px 2px 4px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.3)';
  } else if (config.shadowType === 'inner') {
    textShadow = 'inset 2px 2px 4px rgba(0,0,0,0.4), inset -1px -1px 2px rgba(255,255,255,0.2)';
  }
  
  // Generar backdrop-filter si hay blur
  const backdropFilter = config.blurAmount > 0 
    ? `blur(${config.blurAmount}px)` 
    : 'none';
  
  return `
    mix-blend-mode: ${config.blendMode};
    opacity: ${opacity};
    text-shadow: ${textShadow};
    backdrop-filter: ${backdropFilter};
    filter: contrast(${config.blendMode === 'overlay' ? '1.2' : '1'});
  `.trim();
};

/**
 * Genera el filtro SVG de desplazamiento para rugosidad
 */
export const generateDisplacementFilter = (scale: number = 0.5): string => {
  if (scale === 0) return '';
  
  return `
    <filter id="surface-displacement">
      <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
      <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="${scale * 10}" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  `.trim();
};

/**
 * Hook personalizado para usar deteccion de superficies
 */
export const useSurfaceDetection = () => {
  const detectSurface = async (imageUrl: string): Promise<SurfaceType> => {
    return detectSurfaceType(imageUrl);
  };
  
  const getSurfaceConfig = (surfaceType: SurfaceType): SurfaceConfig => {
    return SURFACE_CONFIGS[surfaceType];
  };
  
  const getSurfaceCSS = (surfaceType: SurfaceType, options?: { customOpacity?: number }): string => {
    return generateSurfaceCSS(surfaceType, options);
  };
  
  return {
    detectSurface,
    getSurfaceConfig,
    getSurfaceCSS,
    SURFACE_CONFIGS
  };
};

export default useSurfaceDetection;
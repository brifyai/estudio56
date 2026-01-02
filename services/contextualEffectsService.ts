import { GoogleGenAI } from "@google/genai";
import { ImageAnalysisResult } from "./imageAnalysisService";

export interface ContextualEffects {
  lighting: {
    direction: 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';
    intensity: number; // 0-1
    color: string;
    temperature: 'warm' | 'cool' | 'neutral';
  };
  shadows: {
    style: 'soft' | 'medium' | 'hard' | 'dramatic';
    offset: { x: number; y: number };
    blur: number;
    spread: number;
    color: string;
    opacity: number;
    direction: 'top-left' | 'top' | 'top-right' | 'left' | 'center' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';
  };
  highlights: {
    style: 'subtle' | 'medium' | 'strong' | 'metallic';
    color: string;
    opacity: number;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  };
  glow: {
    style: 'none' | 'subtle' | 'medium' | 'strong' | 'neon';
    color: string;
    intensity: number;
    distance: number;
  };
  material: {
    type: 'paper' | 'glass' | 'metal' | 'plastic' | 'fabric' | 'wood' | 'stone' | 'liquid';
    reflectivity: number; // 0-1
    roughness: number; // 0-1
    transparency: number; // 0-1
  };
}

const getAiClient = () => new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
});

/**
 * Analiza la iluminación y efectos de una imagen para generar efectos contextuales
 */
export const analyzeContextualEffects = async (
  imageDataUrl: string,
  existingAnalysis?: ImageAnalysisResult
): Promise<ContextualEffects> => {
  try {
    console.log("💡 Analizando efectos contextuales de imagen...");
    
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";

    const analysisPrompt = `Analiza esta imagen para determinar efectos de iluminación, sombras y materiales que se pueden aplicar al texto para que se integre naturalmente.

CONTEXTO A ANALIZAR:
1. ILUMINACIÓN:
   - Dirección de la luz (top-left, top, top-right, left, center, right, bottom-left, bottom, bottom-right)
   - Intensidad (0-1)
   - Color de la luz (hex)
   - Temperatura (warm, cool, neutral)

2. SOMBRAS:
   - Estilo (soft, medium, hard, dramatic)
   - Offset (x, y en píxeles)
   - Blur (0-50)
   - Spread (0-20)
   - Color (rgba)
   - Opacidad (0-1)
   - Dirección

3. HIGHLIGHTS:
   - Estilo (subtle, medium, strong, metallic)
   - Color
   - Opacidad (0-1)
   - Posición

4. GLOW:
   - Estilo (none, subtle, medium, strong, neon)
   - Color
   - Intensidad (0-1)
   - Distancia (0-50)

5. MATERIAL:
   - Tipo (paper, glass, metal, plastic, fabric, wood, stone, liquid)
   - Reflectividad (0-1)
   - Rugosidad (0-1)
   - Transparencia (0-1)

Responde en formato JSON:
{
  "lighting": {
    "direction": "direccion_luz",
    "intensity": 0.7,
    "color": "#ffffff",
    "temperature": "neutral"
  },
  "shadows": {
    "style": "medium",
    "offset": {"x": 2, "y": 4},
    "blur": 8,
    "spread": 0,
    "color": "rgba(0,0,0,0.3)",
    "opacity": 0.3,
    "direction": "bottom-right"
  },
  "highlights": {
    "style": "subtle",
    "color": "#ffffff",
    "opacity": 0.2,
    "position": "top"
  },
  "glow": {
    "style": "none",
    "color": "#ffffff",
    "intensity": 0,
    "distance": 0
  },
  "material": {
    "type": "paper",
    "reflectivity": 0.1,
    "roughness": 0.8,
    "transparency": 0
  }
}`;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: analysisPrompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageDataUrl.split(',')[1]
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error("Respuesta vacía del análisis de efectos");
    }

    console.log("🎭 Análisis de efectos recibido:", responseText);

    const effectsResult = JSON.parse(responseText);
    
    // Validar y completar con valores por defecto
    const validatedResult: ContextualEffects = {
      lighting: {
        direction: effectsResult.lighting?.direction || 'center',
        intensity: effectsResult.lighting?.intensity || 0.5,
        color: effectsResult.lighting?.color || '#ffffff',
        temperature: effectsResult.lighting?.temperature || 'neutral'
      },
      shadows: {
        style: effectsResult.shadows?.style || 'medium',
        offset: {
          x: effectsResult.shadows?.offset?.x || 2,
          y: effectsResult.shadows?.offset?.y || 4
        },
        blur: effectsResult.shadows?.blur || 8,
        spread: effectsResult.shadows?.spread || 0,
        color: effectsResult.shadows?.color || 'rgba(0,0,0,0.3)',
        opacity: effectsResult.shadows?.opacity || 0.3,
        direction: effectsResult.shadows?.direction || 'bottom-right'
      },
      highlights: {
        style: effectsResult.highlights?.style || 'subtle',
        color: effectsResult.highlights?.color || '#ffffff',
        opacity: effectsResult.highlights?.opacity || 0.2,
        position: effectsResult.highlights?.position || 'top'
      },
      glow: {
        style: effectsResult.glow?.style || 'none',
        color: effectsResult.glow?.color || '#ffffff',
        intensity: effectsResult.glow?.intensity || 0,
        distance: effectsResult.glow?.distance || 0
      },
      material: {
        type: effectsResult.material?.type || 'paper',
        reflectivity: effectsResult.material?.reflectivity || 0.1,
        roughness: effectsResult.material?.roughness || 0.8,
        transparency: effectsResult.material?.transparency || 0
      }
    };

    console.log("✅ Análisis de efectos completado:", validatedResult);
    return validatedResult;

  } catch (error: any) {
    console.error("❌ Error en análisis de efectos:", error);
    
    // Fallback inteligente basado en análisis existente
    const fallbackEffects = generateFallbackEffects(existingAnalysis);
    return fallbackEffects;
  }
};

/**
 * Genera efectos de fallback basados en el análisis de imagen existente
 */
const generateFallbackEffects = (existingAnalysis?: ImageAnalysisResult): ContextualEffects => {
  const mood = existingAnalysis?.mood || 'neutral';
  const lighting = existingAnalysis?.lighting || 'bright';
  
  // Efectos base según mood
  let baseEffects: ContextualEffects = {
    lighting: {
      direction: 'center',
      intensity: 0.5,
      color: '#ffffff',
      temperature: 'neutral'
    },
    shadows: {
      style: 'medium',
      offset: { x: 2, y: 4 },
      blur: 8,
      spread: 0,
      color: 'rgba(0,0,0,0.3)',
      opacity: 0.3,
      direction: 'bottom-right'
    },
    highlights: {
      style: 'subtle',
      color: '#ffffff',
      opacity: 0.2,
      position: 'top'
    },
    glow: {
      style: 'none',
      color: '#ffffff',
      intensity: 0,
      distance: 0
    },
    material: {
      type: 'paper',
      reflectivity: 0.1,
      roughness: 0.8,
      transparency: 0
    }
  };

  // Ajustar según mood
  switch (mood) {
    case 'elegant':
      baseEffects.shadows = {
        ...baseEffects.shadows,
        style: 'soft',
        blur: 12,
        opacity: 0.2,
        color: 'rgba(0,0,0,0.2)'
      };
      baseEffects.highlights = {
        ...baseEffects.highlights,
        style: 'medium',
        opacity: 0.3,
        color: '#f8f8f8'
      };
      baseEffects.material.type = 'glass';
      baseEffects.material.reflectivity = 0.3;
      break;
      
    case 'modern':
      baseEffects.shadows = {
        ...baseEffects.shadows,
        style: 'hard',
        blur: 4,
        opacity: 0.4,
        color: 'rgba(0,0,0,0.4)'
      };
      baseEffects.material.type = 'metal';
      baseEffects.material.reflectivity = 0.6;
      break;
      
    case 'playful':
      baseEffects.shadows = {
        ...baseEffects.shadows,
        style: 'soft',
        blur: 6,
        opacity: 0.25,
        color: 'rgba(255,105,180,0.3)'
      };
      baseEffects.glow = {
        ...baseEffects.glow,
        style: 'subtle',
        intensity: 0.2,
        distance: 8
      };
      break;
      
    case 'luxury':
      baseEffects.shadows = {
        ...baseEffects.shadows,
        style: 'medium',
        blur: 10,
        opacity: 0.35,
        color: 'rgba(255,215,0,0.4)'
      };
      baseEffects.highlights = {
        ...baseEffects.highlights,
        style: 'metallic',
        opacity: 0.4,
        color: '#ffd700'
      };
      baseEffects.material.type = 'metal';
      baseEffects.material.reflectivity = 0.8;
      break;
  }

  // Ajustar según iluminación
  if (lighting === 'dramatic') {
    baseEffects.shadows = {
      ...baseEffects.shadows,
      style: 'dramatic',
      blur: 16,
      opacity: 0.6,
      color: 'rgba(0,0,0,0.6)',
      offset: { x: 4, y: 8 }
    };
    baseEffects.glow = {
      ...baseEffects.glow,
      style: 'medium',
      intensity: 0.3,
      distance: 15
    };
  } else if (lighting === 'bright') {
    baseEffects.lighting.intensity = 0.8;
    baseEffects.shadows.opacity = 0.2;
    baseEffects.highlights.opacity = 0.3;
  }

  return baseEffects;
};

/**
 * Genera estilos CSS basados en los efectos contextuales
 */
export const generateContextualEffectStyles = (effects: ContextualEffects) => {
  const { shadows, highlights, glow, material, lighting } = effects;
  
  // Estilos base de sombra
  let textShadow = '';
  let boxShadow = '';
  let filter = '';
  
  // Generar sombra de texto
  if (shadows.style) {
    const shadowColor = shadows.color.replace('rgba', 'rgba').replace(')', `, ${shadows.opacity})`);
    const blurRadius = shadows.blur;
    const offsetX = shadows.offset.x;
    const offsetY = shadows.offset.y;
    
    textShadow = `${offsetX}px ${offsetY}px ${blurRadius}px ${shadowColor}`;
  }
  
  // Generar glow
  if (glow.style !== 'none') {
    const glowIntensity = glow.intensity;
    const glowDistance = glow.distance;
    const glowColor = glow.color;
    
    filter = `drop-shadow(0 0 ${glowDistance}px ${glowColor}) drop-shadow(0 0 ${glowDistance * 1.5}px ${glowColor})`;
  }
  
  // Generar efectos de material
  if (material.type === 'glass') {
    boxShadow = `inset 0 1px 0 rgba(255,255,255,${material.reflectivity}), ${textShadow}`;
  } else if (material.type === 'metal') {
    const metalHighlight = `inset 0 1px 0 rgba(255,255,255,${material.reflectivity}), inset 0 -1px 0 rgba(0,0,0,${material.reflectivity * 0.5})`;
    boxShadow = `${metalHighlight}, ${textShadow}`;
  }
  
  // Ajustar según temperatura de luz
  let colorFilter = '';
  if (lighting.temperature === 'warm') {
    colorFilter = 'sepia(0.1) saturate(1.1)';
  } else if (lighting.temperature === 'cool') {
    colorFilter = 'hue-rotate(180deg) saturate(1.1)';
  }
  
  return {
    textShadow,
    boxShadow,
    filter: [filter, colorFilter].filter(Boolean).join(' '),
    // Efectos adicionales
    textDecoration: material.type === 'glass' ? 'none' : 'none',
    fontSmooth: 'always' as any,
    WebkitFontSmoothing: 'antialiased' as any,
    MozOsxFontSmoothing: 'grayscale' as any
  };
};

/**
 * Genera clases CSS dinámicas para efectos contextuales
 */
export const generateContextualEffectClasses = (effects: ContextualEffects): string => {
  const { shadows, glow, material } = effects;
  
  let classes = 'drop-shadow-lg';
  
  // Sombras
  switch (shadows.style) {
    case 'soft':
      classes += ' drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]';
      break;
    case 'medium':
      classes += ' drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]';
      break;
    case 'hard':
      classes += ' drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]';
      break;
    case 'dramatic':
      classes += ' drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]';
      break;
  }
  
  // Glow
  switch (glow.style) {
    case 'subtle':
      classes += ' drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]';
      break;
    case 'medium':
      classes += ' drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]';
      break;
    case 'strong':
      classes += ' drop-shadow-[0_0_25px_rgba(255,255,255,0.7)]';
      break;
    case 'neon':
      classes += ' drop-shadow-[0_0_20px_rgba(0,255,255,0.8)] drop-shadow-[0_0_40px_rgba(0,255,255,0.4)]';
      break;
  }
  
  // Materiales
  switch (material.type) {
    case 'glass':
      classes += ' backdrop-blur-sm';
      break;
    case 'metal':
      classes += ' brightness-110 contrast-125';
      break;
    case 'plastic':
      classes += ' brightness-105';
      break;
    case 'fabric':
      classes += ' saturate-110';
      break;
  }
  
  return classes;
};

/**
 * Calcula la dirección opuesta de la luz para las sombras
 */
export const getOppositeLightDirection = (lightDirection: string): string => {
  const opposite: Record<string, string> = {
    'top-left': 'bottom-right',
    'top': 'bottom',
    'top-right': 'bottom-left',
    'left': 'right',
    'center': 'center',
    'right': 'left',
    'bottom-left': 'top-right',
    'bottom': 'top',
    'bottom-right': 'top-left'
  };
  
  return opposite[lightDirection] || 'bottom-right';
};

/**
 * Aplica efectos contextuales a un elemento DOM
 */
export const applyContextualEffects = (
  element: HTMLElement,
  effects: ContextualEffects,
  textColor: string = '#ffffff'
) => {
  const styles = generateContextualEffectStyles(effects);
  
  // Aplicar estilos
  Object.assign(element.style, {
    color: textColor,
    textShadow: styles.textShadow,
    filter: styles.filter,
    fontSmooth: styles.fontSmooth,
    WebkitFontSmoothing: styles.WebkitFontSmoothing,
    MozOsxFontSmoothing: styles.MozOsxFontSmoothing
  });
  
  // Aplicar clases CSS
  const classes = generateContextualEffectClasses(effects);
  element.className = element.className.split(' ').filter(c => !c.startsWith('drop-shadow')).join(' ') + ' ' + classes;
};
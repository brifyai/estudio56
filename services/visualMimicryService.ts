import { GoogleGenAI } from "@google/genai";

/**
 * ============================================
 * 🦋 SERVICIO DE MIMETISMO VISUAL
 * Sistema de post-procesamiento dinámico para
 * que el texto combine perfectamente con imágenes
 * ============================================
 */

// ============================================
// 🔤 INTERFACES DEL SERVICIO
// ============================================

export interface VisualMimicryResult {
  // ADN Cromático
  extractedColors: {
    accentColor: string;        // Color principal extraído de la imagen
    shadowColor: string;        // Color de sombras para texto oscuro
    midtoneColor: string;       // Color de medios tonos
    highlightColor: string;     // Color de brillos
    complementaryColor: string; // Color complementario para contraste
  };
  
  // Modos de Fusión
  blendMode: {
    mode: 'multiply' | 'overlay' | 'screen' | 'soft-light' | 'normal';
    opacity: number;
    reason: string;  // Explicación de por qué se eligió este modo
  };
  
  // Profundidad de Campo
  depthOfField: {
    blurAmount: number;         // px de blur (0 si está enfocado)
    saturationReduction: number; // % de reducción de saturación (0-100)
    isBackgroundBlurred: boolean; // Si el fondo está desenfocado
  };
  
  // Grano Fotográfico
  noise: {
    hasNoise: boolean;          // Si la imagen tiene grano visible
    noiseOpacity: number;       // Opacidad del filtro de ruido (0-1)
    noiseType: 'film' | ' ' | 'digital' | 'none';
  };
  
  // Simulación de Luz
  lighting: {
    temperature: 'warm' | 'cool' | 'neutral';
    temperatureIntensity: number; // 0-100%
    direction: 'top' | 'bottom' | 'left' | 'right' | 'center';
    intensity: number; // 0-100%
  };
  
  // CSS Generado
  generatedCSS: {
    textColor: string;
    textShadow: string;
    mixBlendMode: string;
    filter: string;
    backdropFilter: string;
    customProperties: Record<string, string>; // CSS custom properties
  };
}

export interface ImagePixelData {
  width: number;
  height: number;
  dominantColor: string;
  brightness: number;
  contrast: number;
  hasGrain: boolean;
  hasBokeh: boolean;
  bokehIntensity: number;
}

// ============================================
// 🔧 UTILIDADES DE ANÁLISIS DE IMAGEN
// ============================================

const getAiClient = () => new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
});

/**
 * Analiza los píxeles de la imagen para extraer datos básicos
 */
const analyzeImagePixels = (imageDataUrl: string): Promise<ImagePixelData> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo crear contexto de canvas'));
          return;
        }
        
        // Reducir tamaño para análisis rápido (máximo 200px)
        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        let totalBrightness = 0;
        let totalContrast = 0;
        let darkPixels = 0;
        let lightPixels = 0;
        let varianceSum = 0;
        
        // Análisis de brillo y contraste
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          
          // Brillo promedio (luminancia)
          const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
          totalBrightness += brightness;
          
          // Detectar píxeles oscuros (sombras)
          if (brightness < 50) darkPixels++;
          
          // Detectar píxeles claros (brillos)
          if (brightness > 200) lightPixels++;
          
          // Calcular varianza para contraste
          const avg = totalBrightness / (pixels.length / 4);
          varianceSum += Math.pow(brightness - avg, 2);
        }
        
        const avgBrightness = totalBrightness / (pixels.length / 4);
        const contrast = Math.sqrt(varianceSum / (pixels.length / 4));
        
        // Detectar grano (variación rápida entre píxeles adyacentes)
        let grainScore = 0;
        for (let i = 0; i < pixels.length - 16; i += 4) {
          const diff = Math.abs(pixels[i] - pixels[i + 4]) + 
                       Math.abs(pixels[i + 1] - pixels[i + 5]) +
                       Math.abs(pixels[i + 2] - pixels[i + 6]);
          grainScore += diff;
        }
        const hasGrain = (grainScore / (pixels.length / 4)) > 10;
        
        // Detectar bokeh (bordes suaves, áreas desenfocadas)
        // Simplificado: detectar grandes áreas de color similar
        const hasBokeh = false; // Requiere análisis más complejo
        
        // Color dominante (simplificado)
        const dominantColor = `rgb(${Math.round(pixels[0])}, ${Math.round(pixels[1])}, ${Math.round(pixels[2])})`;
        
        resolve({
          width: canvas.width,
          height: canvas.height,
          dominantColor,
          brightness: avgBrightness,
          contrast,
          hasGrain,
          hasBokeh,
          bokehIntensity: 0
        });
      };
      
      img.onerror = () => reject(new Error('Error cargando imagen'));
      img.src = imageDataUrl;
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Extrae el color de un área específica de la imagen
 */
const extractColorFromArea = (
  imageData: ImageData, 
  x: number, 
  y: number, 
  width: number, 
  height: number
): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '#FFFFFF';
  
  canvas.width = width;
  canvas.height = height;
  ctx.putImageData(imageData, 0, 0);
  
  const data = ctx.getImageData(x, y, width, height).data;
  
  let r = 0, g = 0, b = 0, count = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  
  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Convierte RGB a Hex
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Ajusta la luminosidad de un color
 */
const adjustBrightness = (hex: string, percent: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = (num >> 16) + percent;
  const g = ((num >> 8) & 0x00FF) + percent;
  const b = (num & 0x0000FF) + percent;
  return rgbToHex(r, g, b);
};

/**
 * Obtiene el color complementario
 */
const getComplementary = (hex: string): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = 255 - (num >> 16);
  const g = 255 - ((num >> 8) & 0x00FF);
  const b = 255 - (num & 0x0000FF);
  return rgbToHex(r, g, b);
};

// ============================================
// 🎨 ANÁLISIS DE COLOR CON GEMINI
// ============================================

const analyzeColorsWithGemini = async (
  imageDataUrl: string
): Promise<VisualMimicryResult['extractedColors']> => {
  try {
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";
    
    const prompt = `Analiza esta imagen y extrae los colores para crear un texto que parezca pintado/grabado en la superficie.

Responde en formato JSON exacto:
{
  "accentColor": "#HEX del color principal que el texto debería usar para combinarse con la imagen",
  "shadowColor": "#HEX de un color más oscuro para sombras/sombras del texto",
  "midtoneColor": "#HEX del color de medios tonos",
  "highlightColor": "#HEX del color de brillos",
  "complementaryColor": "#HEX de un color complementario para contraste"
}

Reglas:
- accentColor: Debe ser un color que exista en la imagen, idealmente de las sombras o superficies donde aparecería el texto
- shadowColor: 20-30% más oscuro que accentColor
- highlightColor: 20-30% más claro que accentColor
- complementaryColor: Oposto en el círculo cromático para contraste

Ejemplo: Si la imagen tiene paredes de ladrillo rojo, el texto debería usar un tono extraído de las sombras de esos ladrillos.

Responde SOLO con el JSON, sin texto adicional.`;
    
    const response = await ai.models.generateContent({
      model,
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
      },
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error("Respuesta vacía");
    }
    
    const colors = JSON.parse(responseText);
    
    return {
      accentColor: colors.accentColor || '#FFFFFF',
      shadowColor: colors.shadowColor || '#000000',
      midtoneColor: colors.midtoneColor || '#808080',
      highlightColor: colors.highlightColor || '#FFFFFF',
      complementaryColor: colors.complementaryColor || '#000000'
    };
    
  } catch (error) {
    console.warn("⚠️ Error analizando colores con Gemini, usando fallback:", error);
    
    // Fallback: extraer colores del análisis de píxeles
    return {
      accentColor: '#FFFFFF',
      shadowColor: '#000000',
      midtoneColor: '#808080',
      highlightColor: '#FFFFFF',
      complementaryColor: '#000000'
    };
  }
};

// ============================================
// 🔆 ANÁLISIS DE ILUMINACIÓN
// ============================================

const analyzeLightingWithGemini = async (
  imageDataUrl: string
): Promise<VisualMimicryResult['lighting']> => {
  try {
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";
    
    const prompt = `Analiza la iluminación de esta imagen para sincronizar el texto con ella.

Responde en formato JSON exacto:
{
  "temperature": "warm|cool|neutral",
  "temperatureIntensity": 0-100,
  "direction": "top|bottom|left|right|center",
  "intensity": 0-100
}

Reglas:
- temperature: 'warm' si hay tonos naranja/amarillo (amanecer/atardecer, bombillas), 'cool' si hay tonos azules (luz día, sombra), 'neutral' si está balanceada
- temperatureIntensity: Qué tan intensa es la temperatura de color (0 = neutral, 100 = muy cálida/fría)
- direction: De dónde viene la luz principal
- intensity: Intensidad general de la iluminación

Responde SOLO con el JSON, sin texto adicional.`;
    
    const response = await ai.models.generateContent({
      model,
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
      },
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error("Respuesta vacía");
    }
    
    const lighting = JSON.parse(responseText);
    
    return {
      temperature: lighting.temperature || 'neutral',
      temperatureIntensity: lighting.temperatureIntensity || 0,
      direction: lighting.direction || 'center',
      intensity: lighting.intensity || 50
    };
    
  } catch (error) {
    console.warn("⚠️ Error analizando iluminación, usando fallback:", error);
    return {
      temperature: 'neutral',
      temperatureIntensity: 0,
      direction: 'center',
      intensity: 50
    };
  }
};

// ============================================
// 🦋 FUNCIÓN PRINCIPAL: ANÁLISIS COMPLETO DE MIMETISMO
// ============================================

/**
 * Analiza una imagen y genera todos los parámetros de mimetismo visual
 * para que el texto parezca integrado naturalmente en la fotografía.
 */
export const analyzeVisualMimicry = async (
  imageDataUrl: string,
  options?: {
    textPosition?: 'foreground' | 'background';
    textColor?: string; // Color preferido por el usuario
  }
): Promise<VisualMimicryResult> => {
  console.log("🦋 [VisualMimicry] Iniciando análisis de mimetismo visual...");
  
  try {
    // 1. Análisis rápido de píxeles
    const pixelData = await analyzeImagePixels(imageDataUrl);
    console.log("📊 [VisualMimicry] Datos de píxeles:", pixelData);
    
    // 2. Análisis de colores con Gemini (ADN Cromático)
    const extractedColors = await analyzeColorsWithGemini(imageDataUrl);
    console.log("🎨 [VisualMimicry] Colores extraídos:", extractedColors);
    
    // 3. Análisis de iluminación
    const lighting = await analyzeLightingWithGemini(imageDataUrl);
    console.log("💡 [VisualMimicry] Iluminación:", lighting);
    
    // 4. Determinar modo de fusión
    // Si el fondo es claro → multiply (texto oscuro)
    // Si el fondo es oscuro → overlay/screen (texto claro)
    const isDarkBackground = pixelData.brightness < 128;
    const blendMode = isDarkBackground 
      ? { mode: 'overlay' as const, opacity: 0.9, reason: "Fondo oscuro: overlay permite que los brillos del fondo se vean a través del texto" }
      : { mode: 'multiply' as const, opacity: 0.85, reason: "Fondo claro: multiply hace que el texto parezca impreso/teñido en la superficie" };
    
    // 5. Determinar profundidad de campo
    // Si el fondo está desenfocado (bokeh), el texto en el fondo también debería estarlo
    const depthOfField = pixelData.hasBokeh
      ? {
          blurAmount: 1.5,
          saturationReduction: 10,
          isBackgroundBlurred: true
        }
      : {
          blurAmount: 0,
          saturationReduction: 0,
          isBackgroundBlurred: false
        };
    
    // 6. Determinar grano fotográfico
    const noise = pixelData.hasGrain
      ? {
          hasNoise: true,
          noiseOpacity: 0.15, // Grano sutil para no distraer
          noiseType: 'film' as const
        }
      : {
          hasNoise: false,
          noiseOpacity: 0,
          noiseType: 'none' as const
        };
    
    // 7. Generar CSS personalizado
    const customProperties: Record<string, string> = {
      '--extracted-accent-color': extractedColors.accentColor,
      '--extracted-shadow-color': extractedColors.shadowColor,
      '--extracted-highlight-color': extractedColors.highlightColor,
      '--blend-mode': blendMode.mode,
      '--noise-opacity': noise.noiseOpacity.toString()
    };
    
    // Generar filtros de temperatura
    let filterString = '';
    if (lighting.temperature === 'warm' && lighting.temperatureIntensity > 20) {
      const sepia = Math.min(lighting.temperatureIntensity / 100, 0.3);
      const saturate = 1 + (lighting.temperatureIntensity / 200);
      filterString = `sepia(${sepia}) saturate(${saturate})`;
    } else if (lighting.temperature === 'cool' && lighting.temperatureIntensity > 20) {
      const hueRotate = Math.min(lighting.temperatureIntensity / 10, 30);
      filterString = `hue-rotate(${hueRotate}deg)`;
    }
    
    const generatedCSS = {
      textColor: extractedColors.accentColor,
      textShadow: `2px 2px 4px rgba(0,0,0,0.5), 0 0 2px rgba(0,0,0,0.3)`,
      mixBlendMode: blendMode.mode,
      filter: filterString || 'none',
      backdropFilter: depthOfField.blurAmount > 0 
        ? `blur(${depthOfField.blurAmount}px) saturate(${1 - depthOfField.saturationReduction / 100})`
        : 'none',
      customProperties
    };
    
    const result: VisualMimicryResult = {
      extractedColors,
      blendMode,
      depthOfField,
      noise,
      lighting,
      generatedCSS
    };
    
    console.log("✅ [VisualMimicry] Análisis completado:", result);
    return result;
    
  } catch (error) {
    console.error("❌ [VisualMimicry] Error en análisis:", error);
    
    // Fallback con valores seguros
    return {
      extractedColors: {
        accentColor: '#FFFFFF',
        shadowColor: '#000000',
        midtoneColor: '#808080',
        highlightColor: '#FFFFFF',
        complementaryColor: '#000000'
      },
      blendMode: {
        mode: 'normal',
        opacity: 1,
        reason: "Fondo de luminosidad media: modo normal para máxima legibilidad"
      },
      depthOfField: {
        blurAmount: 0,
        saturationReduction: 0,
        isBackgroundBlurred: false
      },
      noise: {
        hasNoise: false,
        noiseOpacity: 0,
        noiseType: 'none'
      },
      lighting: {
        temperature: 'neutral',
        temperatureIntensity: 0,
        direction: 'center',
        intensity: 50
      },
      generatedCSS: {
        textColor: '#FFFFFF',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        mixBlendMode: 'normal',
        filter: 'none',
        backdropFilter: 'none',
        customProperties: {}
      }
    };
  }
};

// ============================================
// 🎯 GENERADOR DE CSS DINÁMICO
// ============================================

/**
 * Genera el CSS completo para aplicar el mimetismo visual al texto
 */
export const generateMimicryCSS = (result: VisualMimicryResult): string => {
  const { extractedColors, blendMode, depthOfField, noise, lighting, generatedCSS } = result;
  
  // Generar filtro de ruido SVG
  const noiseFilter = noise.hasNoise 
    ? `
      <filter id="film-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="${noise.noiseOpacity}" />
        </feComponentTransfer>
        <feBlend mode="overlay" in2="SourceGraphic" />
      </filter>
    `
    : '';
  
  // CSS del texto con todos los efectos
  const textCSS = `
    /* 🦋 MIMETISMO VISUAL - Texto integrado en la imagen */
    color: ${generatedCSS.textColor};
    text-shadow: ${generatedCSS.textShadow};
    mix-blend-mode: ${generatedCSS.mixBlendMode};
    filter: ${generatedCSS.filter};
    backdrop-filter: ${generatedCSS.backdropFilter};
    
    /* Variables CSS personalizadas */
    --extracted-accent-color: ${extractedColors.accentColor};
    --extracted-shadow-color: ${extractedColors.shadowColor};
    --extracted-highlight-color: ${extractedColors.highlightColor};
    --blend-mode: ${blendMode.mode};
  `.trim();
  
  return textCSS;
};

/**
 * Genera las clases CSS (Tailwind + custom)
 */
export const generateMimicryClasses = (result: VisualMimicryResult): string => {
  const { blendMode, depthOfField, lighting } = result;
  
  let classes = [];
  
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
    classes.push('sepia-[0.2]');
  } else if (lighting.temperature === 'cool') {
    classes.push('hue-rotate-15');
  }
  
  return classes.join(' ');
};

// ============================================
// 🎨 GENERADOR DE ESTILOS PARA TEXTO
// ============================================

export interface TextStyleOptions {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  textColor: string;
  backgroundColor: string;
  letterSpacing: number;
  textTransform: 'none' | 'uppercase' | 'capitalize';
  effects: {
    shadow: boolean;
    stroke: boolean;
    glow: boolean;
  };
}

/**
 * Aplica los efectos de mimetismo visual a las opciones de estilo del texto
 */
export const applyMimicryToTextStyles = (
  baseStyles: TextStyleOptions,
  mimicryResult: VisualMimicryResult
): TextStyleOptions => {
  const { extractedColors, blendMode, depthOfField, lighting } = mimicryResult;
  
  return {
    ...baseStyles,
    // Usar el color extraído de la imagen
    textColor: extractedColors.accentColor,
    
    // Efectos adicionales
    effects: {
      ...baseStyles.effects,
      // Sombra más pronunciada para mejor integración
      shadow: true,
      // Glow sutil si la iluminación lo requiere
      glow: lighting.intensity > 70
    }
  };
};

// ============================================
// 📦 EXPORTAR TODO EL SERVICIO
// ============================================

export const visualMimicryService = {
  analyzeVisualMimicry,
  generateMimicryCSS,
  generateMimicryClasses,
  applyMimicryToTextStyles,
  
  // Utilidades
  extractColorFromArea,
  adjustBrightness,
  getComplementary,
  analyzeImagePixels
};

export default visualMimicryService;
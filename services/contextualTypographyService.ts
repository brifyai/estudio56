import { GoogleGenAI } from "@google/genai";
import { ImageAnalysisResult } from "./imageAnalysisService";

export interface ContextualTypographyResult {
  context: 'food' | 'fashion' | 'technology' | 'business' | 'health' | 'travel' | 'education' | 'entertainment' | 'sports' | 'luxury' | 'art' | 'automotive' | 'real_estate' | 'general';
  typography: {
    fontFamily: string;
    fontWeight: string;
    fontStyle: 'normal' | 'italic';
    letterSpacing: string;
    textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    recommendedSize: string;
  };
  colorStrategy: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    contrastRatio: number;
    accessibility: 'excellent' | 'good' | 'fair' | 'poor';
  };
  effects: {
    shadowStyle: string;
    glowEffect: string;
    gradientOverlay: string;
    materialEffect: 'none' | 'glass' | 'metal' | 'neon' | 'paper' | 'leather' | 'wood';
  };
}

const getAiClient = () => new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "AIzaSyCMXM-e632BNF3IwnKDX1qKXpj6qrpsYfM"
});

/**
 * Analiza el contexto de la imagen para determinar tipografía y estilos apropiados
 */
export const analyzeContextualTypography = async (
  imageDataUrl: string, 
  existingAnalysis?: ImageAnalysisResult
): Promise<ContextualTypographyResult> => {
  try {
    console.log("🎨 Analizando contexto para tipografía adaptativa...");
    
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";

    const analysisPrompt = `Analiza esta imagen y determina el contexto de negocio/contenido para aplicar tipografía apropiada. 

CONTEXTO A DETECTAR:
- food: Restaurantes, comida, bebidas, cocina
- fashion: Ropa, accesorios, belleza, estilo
- technology: Software, apps, gadgets, innovación
- business: Corporativo, servicios, consultoría
- health: Médico, fitness, wellness, belleza
- travel: Turismo, hoteles, destinos, aventuras
- education: Cursos, libros, academia, aprendizaje
- entertainment: Cine, música, juegos, diversión
- sports: Deportes, fitness, competencia
- luxury: Lujo, premium, exclusivo, elegante
- art: Creativo, artístico, diseño, cultura
- automotive: Autos, vehículos, mecánica
- real_estate: Bienes raíces, propiedades, construcción
- general: Otros contextos

Responde en formato JSON:
{
  "context": "contexto_detectado",
  "typography": {
    "fontFamily": "nombre_fuente_especifica",
    "fontWeight": "normal|bold|black",
    "fontStyle": "normal|italic",
    "letterSpacing": "normal|tight|wide",
    "textTransform": "none|uppercase|lowercase|capitalize",
    "recommendedSize": "small|medium|large|xl"
  },
  "colorStrategy": {
    "primaryColor": "#hex_color",
    "secondaryColor": "#hex_color", 
    "backgroundColor": "#hex_color",
    "contrastRatio": 4.5,
    "accessibility": "excellent|good|fair|poor"
  },
  "effects": {
    "shadowStyle": "descripcion_sombra",
    "glowEffect": "efecto_brillo",
    "gradientOverlay": "gradiente_especifico",
    "materialEffect": "none|glass|metal|neon|paper|leather|wood"
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
      throw new Error("Respuesta vacía del análisis contextual");
    }

    console.log("📊 Análisis contextual recibido:", responseText);

    const contextualResult = JSON.parse(responseText);
    
    // Validar y completar con valores por defecto
    const validatedResult: ContextualTypographyResult = {
      context: contextualResult.context || 'general',
      typography: {
        fontFamily: contextualResult.typography?.fontFamily || 'Inter, sans-serif',
        fontWeight: contextualResult.typography?.fontWeight || 'bold',
        fontStyle: contextualResult.typography?.fontStyle || 'normal',
        letterSpacing: contextualResult.typography?.letterSpacing || 'normal',
        textTransform: contextualResult.typography?.textTransform || 'none',
        recommendedSize: contextualResult.typography?.recommendedSize || 'medium'
      },
      colorStrategy: {
        primaryColor: contextualResult.colorStrategy?.primaryColor || '#FFFFFF',
        secondaryColor: contextualResult.colorStrategy?.secondaryColor || '#000000',
        backgroundColor: contextualResult.colorStrategy?.backgroundColor || 'transparent',
        contrastRatio: contextualResult.colorStrategy?.contrastRatio || 4.5,
        accessibility: contextualResult.colorStrategy?.accessibility || 'good'
      },
      effects: {
        shadowStyle: contextualResult.effects?.shadowStyle || '0 2px 4px rgba(0,0,0,0.3)',
        glowEffect: contextualResult.effects?.glowEffect || 'none',
        gradientOverlay: contextualResult.effects?.gradientOverlay || 'none',
        materialEffect: contextualResult.effects?.materialEffect || 'none'
      }
    };

    console.log("✅ Análisis contextual completado:", validatedResult);
    return validatedResult;

  } catch (error: any) {
    console.error("❌ Error en análisis contextual:", error);
    
    // Fallback con valores inteligentes basados en análisis existente
    const fallbackContext = existingAnalysis?.mood === 'elegant' ? 'luxury' : 
                           existingAnalysis?.mood === 'modern' ? 'technology' : 'general';
    
    return {
      context: fallbackContext,
      typography: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        fontStyle: 'normal',
        letterSpacing: 'normal',
        textTransform: 'none',
        recommendedSize: 'medium'
      },
      colorStrategy: {
        primaryColor: '#FFFFFF',
        secondaryColor: '#000000',
        backgroundColor: 'transparent',
        contrastRatio: 4.5,
        accessibility: 'good'
      },
      effects: {
        shadowStyle: '0 2px 4px rgba(0,0,0,0.3)',
        glowEffect: 'none',
        gradientOverlay: 'none',
        materialEffect: 'none'
      }
    };
  }
};

/**
 * Genera estilos CSS basados en el análisis contextual
 */
export const generateContextualStyles = (contextualResult: ContextualTypographyResult) => {
  const { typography, colorStrategy, effects, context } = contextualResult;
  
  // Base styles from typography
  let baseStyles = {
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight,
    fontStyle: typography.fontStyle,
    letterSpacing: typography.letterSpacing === 'tight' ? '-0.02em' : 
                   typography.letterSpacing === 'wide' ? '0.05em' : 'normal',
    textTransform: typography.textTransform,
    color: colorStrategy.primaryColor,
    textShadow: effects.shadowStyle
  };

  // Context-specific adjustments
  switch (context) {
    case 'food':
      baseStyles = {
        ...baseStyles,
        fontFamily: 'Playfair Display, serif',
        fontWeight: 'normal',
        color: '#8B4513', // Brown for food
        textShadow: '0 1px 3px rgba(139, 69, 19, 0.5)'
      };
      break;
      
    case 'fashion':
      baseStyles = {
        ...baseStyles,
        fontFamily: 'Cormorant Garamond, serif',
        fontWeight: '300',
        fontStyle: 'italic',
        color: '#D4AF37', // Gold for fashion
        textShadow: '0 2px 8px rgba(212, 175, 55, 0.4)'
      };
      break;
      
    case 'technology':
      baseStyles = {
        ...baseStyles,
        fontFamily: 'Orbitron, monospace',
        fontWeight: 'bold',
        color: '#00FFFF', // Cyan for tech
        textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
      };
      break;
      
    case 'luxury':
      baseStyles = {
        ...baseStyles,
        fontFamily: 'Cormorant Garamond, serif',
        fontWeight: 'bold',
        color: '#FFD700', // Gold for luxury
        textShadow: '0 3px 10px rgba(255, 215, 0, 0.6)'
      };
      break;
      
    case 'health':
      baseStyles = {
        ...baseStyles,
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: '600',
        color: '#228B22', // Green for health
        textShadow: '0 1px 3px rgba(34, 139, 34, 0.4)'
      };
      break;
      
    case 'sports':
      baseStyles = {
        ...baseStyles,
        fontFamily: 'Oswald, sans-serif',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#FF4500', // Orange for sports
        textShadow: '0 2px 6px rgba(255, 69, 0, 0.5)'
      };
      break;
  }

  // Material effects
  if (effects.materialEffect === 'glass') {
    baseStyles.textShadow = '0 8px 32px rgba(255, 255, 255, 0.3)';
  } else if (effects.materialEffect === 'metal') {
    baseStyles.textShadow = '0 4px 12px rgba(192, 192, 192, 0.6)';
  } else if (effects.materialEffect === 'neon') {
    baseStyles.textShadow = '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)';
  }

  return baseStyles;
};

/**
 * Genera clases CSS dinámicas para el contexto específico
 */
export const generateContextualClasses = (contextualResult: ContextualTypographyResult): string => {
  const { context, typography } = contextualResult;
  
  let classes = 'font-bold text-white drop-shadow-lg';
  
  switch (context) {
    case 'food':
      classes = 'font-serif italic font-light text-amber-800 drop-shadow-md tracking-wide';
      break;
    case 'fashion':
      classes = 'font-serif italic font-extralight text-yellow-400 drop-shadow-xl tracking-widest';
      break;
    case 'technology':
      classes = 'font-mono font-bold text-cyan-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)] tracking-wider';
      break;
    case 'luxury':
      classes = 'font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 drop-shadow-[0_4px_15px_rgba(255,215,0,0.6)] tracking-wide';
      break;
    case 'health':
      classes = 'font-sans font-semibold text-green-400 drop-shadow-md tracking-normal';
      break;
    case 'sports':
      classes = 'font-sans font-black text-orange-500 uppercase drop-shadow-[0_3px_10px_rgba(255,69,0,0.6)] tracking-wider';
      break;
    case 'business':
      classes = 'font-sans font-bold text-blue-400 drop-shadow-md tracking-tight';
      break;
    case 'art':
      classes = 'font-script text-purple-300 drop-shadow-xl tracking-widest';
      break;
  }
  
  // Size adjustments
  if (typography.recommendedSize === 'large') {
    classes += ' text-5xl';
  } else if (typography.recommendedSize === 'xl') {
    classes += ' text-6xl';
  } else if (typography.recommendedSize === 'small') {
    classes += ' text-2xl';
  } else {
    classes += ' text-4xl';
  }
  
  return classes;
};
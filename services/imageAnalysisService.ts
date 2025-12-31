import { GoogleGenAI } from "@google/genai";

export interface ImageAnalysisResult {
  dominantColors: string[];
  mood: 'elegant' | 'modern' | 'corporate' | 'artistic' | 'playful' | 'luxury' | 'minimalist';
  lighting: 'bright' | 'soft' | 'dramatic' | 'warm' | 'cool';
  style: 'clean' | 'vibrant' | 'muted' | 'neon' | 'metallic' | 'organic';
  recommendedTextStyle: {
    fontFamily: string;
    fontWeight: string;
    color: string;
    textShadow: string;
    backgroundColor?: string;
    borderColor?: string;
    gradient?: string;
  };
}

const getAiClient = () => new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "AIzaSyCMXM-e632BNF3IwnKDX1qKXpj6qrpsYfM"
});

/**
 * Analiza una imagen para extraer información visual y recomendar estilos de texto
 */
export const analyzeImageForTextStyle = async (imageDataUrl: string): Promise<ImageAnalysisResult> => {
  try {
    console.log("🔍 Analizando imagen para estilos de texto...");
    
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";

    const analysisPrompt = `Analiza esta imagen y extrae la siguiente información en formato JSON:

{
  "dominantColors": ["#color1", "#color2", "#color3"],
  "mood": "elegant|modern|corporate|artistic|playful|luxury|minimalist",
  "lighting": "bright|soft|dramatic|warm|cool",
  "style": "clean|vibrant|muted|neon|metallic|organic",
  "recommendedTextStyle": {
    "fontFamily": "font-family-name",
    "fontWeight": "normal|bold|black",
    "color": "#hex-color",
    "textShadow": "shadow-description",
    "backgroundColor": "#hex-color (optional)",
    "borderColor": "#hex-color (optional)",
    "gradient": "gradient-description (optional)"
  }
}

Enfócate en:
1. Colores dominantes que se ven en la imagen
2. Mood general (elegante, moderno, corporativo, artístico, etc.)
3. Tipo de iluminación (brillante, suave, dramática, etc.)
4. Estilo visual (limpio, vibrante, muted, etc.)
5. Recomendaciones específicas para texto que combine con la imagen

Responde SOLO con el JSON, sin texto adicional.`;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: analysisPrompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageDataUrl.split(',')[1] // Remove data:image/jpeg;base64, prefix
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
      throw new Error("Respuesta vacía del análisis");
    }

    console.log("📊 Análisis recibido:", responseText);

    const analysisResult = JSON.parse(responseText);
    
    // Validar y completar con valores por defecto si es necesario
    const validatedResult: ImageAnalysisResult = {
      dominantColors: analysisResult.dominantColors || ['#FFFFFF', '#000000', '#808080'],
      mood: analysisResult.mood || 'modern',
      lighting: analysisResult.lighting || 'soft',
      style: analysisResult.style || 'clean',
      recommendedTextStyle: {
        fontFamily: analysisResult.recommendedTextStyle?.fontFamily || 'Inter, sans-serif',
        fontWeight: analysisResult.recommendedTextStyle?.fontWeight || 'bold',
        color: analysisResult.recommendedTextStyle?.color || '#FFFFFF',
        textShadow: analysisResult.recommendedTextStyle?.textShadow || '0 2px 4px rgba(0,0,0,0.5)',
        backgroundColor: analysisResult.recommendedTextStyle?.backgroundColor,
        borderColor: analysisResult.recommendedTextStyle?.borderColor,
        gradient: analysisResult.recommendedTextStyle?.gradient
      }
    };

    console.log("✅ Análisis completado:", validatedResult);
    return validatedResult;

  } catch (error: any) {
    console.error("❌ Error analizando imagen:", error);
    
    // Fallback con valores por defecto inteligentes
    return {
      dominantColors: ['#FFFFFF', '#000000', '#808080'],
      mood: 'modern',
      lighting: 'soft',
      style: 'clean',
      recommendedTextStyle: {
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        color: '#FFFFFF',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
      }
    };
  }
};

/**
 * Genera estilos de texto CSS basados en el análisis de la imagen
 */
export const generateTextStylesFromAnalysis = (analysis: ImageAnalysisResult) => {
  const { mood, lighting, style, recommendedTextStyle } = analysis;
  
  // Base styles from analysis
  let baseStyles = {
    fontFamily: recommendedTextStyle.fontFamily,
    fontWeight: recommendedTextStyle.fontWeight,
    color: recommendedTextStyle.color,
    textShadow: recommendedTextStyle.textShadow
  };

  // Adjust based on mood
  switch (mood) {
    case 'elegant':
      baseStyles = {
        ...baseStyles,
        fontFamily: 'Playfair Display, serif',
        fontWeight: 'normal',
        textShadow: '0 1px 3px rgba(0,0,0,0.3)'
      };
      break;
    case 'luxury':
      baseStyles = {
        ...baseStyles,
        fontFamily: 'Cormorant Garamond, serif',
        fontWeight: 'bold',
        textShadow: '0 2px 8px rgba(0,0,0,0.6)'
      };
      break;
    case 'modern':
      baseStyles = {
        ...baseStyles,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'black',
        textShadow: '0 3px 6px rgba(0,0,0,0.4)'
      };
      break;
    case 'corporate':
      baseStyles = {
        ...baseStyles,
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 'bold',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
      };
      break;
    case 'artistic':
      baseStyles = {
        ...baseStyles,
        fontFamily: 'Dancing Script, cursive',
        fontWeight: 'normal',
        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
      };
      break;
  }

  // Adjust based on lighting
  if (lighting === 'dramatic') {
    baseStyles.textShadow = '0 4px 12px rgba(0,0,0,0.8)';
  } else if (lighting === 'soft') {
    baseStyles.textShadow = '0 1px 3px rgba(0,0,0,0.2)';
  }

  // Adjust based on style
  if (style === 'neon') {
    baseStyles.color = '#00FFFF';
    baseStyles.textShadow = '0 0 10px #00FFFF, 0 0 20px #00FFFF';
  } else if (style === 'metallic') {
    baseStyles.color = '#C0C0C0';
    baseStyles.textShadow = '0 2px 4px rgba(192,192,192,0.5)';
  }

  return baseStyles;
};

/**
 * Genera clases CSS dinámicas para el texto superpuesto
 */
export const generateDynamicTextClasses = (analysis: ImageAnalysisResult): string => {
  const { mood, style } = analysis;
  
  let classes = 'font-bold text-white drop-shadow-lg';
  
  switch (mood) {
    case 'elegant':
      classes = 'font-serif italic font-light text-white drop-shadow-md tracking-wide';
      break;
    case 'luxury':
      classes = 'font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-xl';
      break;
    case 'modern':
      classes = 'font-black text-white uppercase tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]';
      break;
    case 'corporate':
      classes = 'font-sans font-bold text-white drop-shadow-md';
      break;
    case 'artistic':
      classes = 'font-script text-white drop-shadow-xl';
      break;
  }
  
  if (style === 'neon') {
    classes = 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 drop-shadow-[0_0_20px_rgba(100,200,255,0.8)]';
  } else if (style === 'metallic') {
    classes = 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500 drop-shadow-[0_2px_8px_rgba(192,192,192,0.6)]';
  }
  
  return classes;
};
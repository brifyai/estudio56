import { GoogleGenAI } from "@google/genai";
import { FlyerStyleKey, AspectRatio } from "../types";
import { FLYER_STYLES } from "../constants";
import { diagnoseAndFixBlackImage } from "./geminiService";

// Helper to get client instance
const getAiClient = () => new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
});

// Modelos disponibles para mejora de imagen (ordenados por preferencia)
const IMAGE_MODELS = [
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash',
  'gemini-1.5-flash'
];

export interface ImageImprovementResult {
  success: boolean;
  improvedImageUrl?: string;
  error?: string;
}

/**
 * Mejora una imagen subida por el usuario usando Gemini 2.5 Flash Image
 * Mantiene la composición pero mejora iluminación, calidad y detalles
 */
export const improveUploadedImage = async (
  uploadedImageDataUrl: string,
  styleKey: FlyerStyleKey,
  aspectRatio: AspectRatio,
  improvementLevel: 'light' | 'medium' | 'strong' = 'medium'
): Promise<ImageImprovementResult> => {
  try {
    console.log('🎨 [ImageImprovement] Mejorando imagen subida por usuario...');
    
    const ai = getAiClient();
    const styleConfig = FLYER_STYLES[styleKey] || { label: 'Professional', english_prompt: 'Professional commercial style' };
    
    // Convertir data URL a base64
    const base64Data = uploadedImageDataUrl.split(',')[1];
    
    // Determinar nivel de mejora
    const improvementPrompts = {
      light: "Light enhancement: slightly better lighting, subtle color adjustment, minor detail improvement. Keep everything almost identical.",
      medium: "Medium enhancement: significantly better lighting, improved colors, more vibrant and professional look, better contrast, enhanced details while maintaining original composition.",
      strong: "Strong enhancement: dramatic improvement in quality, professional studio lighting, vibrant colors, high-end commercial look, maximum detail enhancement."
    };
    
    const improvementPrompt = improvementPrompts[improvementLevel];
    
    // Prompt para mejorar la imagen manteniendo composición
    const prompt = `
      ENHANCE THIS IMAGE:
      
      ${improvementPrompt}
      
      CRITICAL RULES:
      1. Maintain EXACTLY the same composition, subject placement, and layout
      2. Do NOT add, remove, or move any elements
      3. Do NOT add any text to the image
      4. Keep the same aspect ratio: ${aspectRatio}
      5. Only improve quality, lighting, colors, and details
      
      Style reference: ${styleConfig.label}
      Style description: ${styleConfig.english_prompt}
      
      Output: The improved image with better quality while preserving everything else.
    `.replace(/\n/g, ' ').trim();
    
    console.log('📝 [ImageImprovement] Prompt:', prompt.substring(0, 100) + '...');
    
    // Intentar con el primer modelo disponible
    let lastError: Error | null = null;
    
    for (const model of IMAGE_MODELS) {
      try {
        console.log(`🎨 [ImageImprovement] Intentando con modelo: ${model}`);
        
        const response = await ai.models.generateContent({
          model,
          contents: {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: base64Data
                }
              }
            ]
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio
            }
          }
        });
        
        // Si llegamos aquí, el modelo funcionó
        const candidates = response.candidates;
        if (!candidates || candidates.length === 0) {
          throw new Error("API retornó 0 candidatos");
        }
        
        const parts = candidates[0].content?.parts;
        if (!parts || parts.length === 0) {
          throw new Error("Respuesta vacía");
        }
        
        // Buscar la imagen generada
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (part.inlineData && part.inlineData.data) {
            let base64Result = part.inlineData.data.replace(/\s/g, '');
            const imageDataUrl = `data:image/jpeg;base64,${base64Result}`;
            
            console.log('✅ [ImageImprovement] Imagen mejorada exitosamente con:', model);
            
            // Aplicar diagnóstico y corrección
            const correctedImageUrl = await diagnoseAndFixBlackImage(imageDataUrl);
            
            return {
              success: true,
              improvedImageUrl: correctedImageUrl
            };
          }
        }
        
        throw new Error("No se encontraron datos de imagen en la respuesta");
        
      } catch (error: any) {
        console.warn(`⚠️ [ImageImprovement] Error con modelo ${model}:`, error.message);
        lastError = error;
        // Continuar con el siguiente modelo
        continue;
      }
    }
    
    // Si todos los modelos fallaron
    throw lastError || new Error("Todos los modelos de imagen fallaron");
    
  } catch (error: any) {
    console.error('❌ [ImageImprovement] Error:', error);
    return {
      success: false,
      error: error.message || 'Error al mejorar la imagen'
    };
  }
};

/**
 * Versión alternativa: Regenerar imagen subida con estilo específico
 * Útil cuando se quiere aplicar un estilo visual completamente diferente
 */
export const regenerateWithStyle = async (
  uploadedImageDataUrl: string,
  styleKey: FlyerStyleKey,
  aspectRatio: AspectRatio
): Promise<ImageImprovementResult> => {
  try {
    console.log('🎨 [RegenerateWithStyle] Regenerando imagen con nuevo estilo...');
    
    const ai = getAiClient();
    const styleConfig = FLYER_STYLES[styleKey] || { label: 'Professional', english_prompt: 'Professional commercial style' };
    
    // Convertir data URL a base64
    const base64Data = uploadedImageDataUrl.split(',')[1];
    
    const prompt = `
      TRANSFORM THIS IMAGE to match this style:
      
      Style: ${styleConfig.label}
      Description: ${styleConfig.english_prompt}
      
      CRITICAL RULES:
      1. Keep the SAME subject/products shown in the image
      2. Transform the BACKGROUND, lighting, colors, and atmosphere to match the style
      3. Do NOT remove or change the main subject
      4. Do NOT add any text
      5. Maintain the same aspect ratio: ${aspectRatio}
      
      Transform the visual style while preserving the main subject.
    `.replace(/\n/g, ' ').trim();
    
    const model = 'gemini-2.0-flash-exp';
    
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio
        }
      }
    });
    
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("API retornó 0 candidatos");
    }
    
    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error("Respuesta vacía");
    }
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.inlineData && part.inlineData.data) {
        let base64Result = part.inlineData.data.replace(/\s/g, '');
        const imageDataUrl = `data:image/jpeg;base64,${base64Result}`;
        
        console.log('✅ [RegenerateWithStyle] Imagen regenerada exitosamente');
        
        const correctedImageUrl = await diagnoseAndFixBlackImage(imageDataUrl);
        
        return {
          success: true,
          improvedImageUrl: correctedImageUrl
        };
      }
    }
    
    throw new Error("No se encontraron datos de imagen en la respuesta");
    
  } catch (error: any) {
    console.error('❌ [RegenerateWithStyle] Error:', error);
    return {
      success: false,
      error: error.message || 'Error al regenerar la imagen'
    };
  }
};

export default {
  improveUploadedImage,
  regenerateWithStyle
};
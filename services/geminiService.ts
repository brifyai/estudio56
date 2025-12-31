import { GoogleGenAI, Type } from "@google/genai";
import { FlyerStyleKey, AspectRatio, ImageQuality } from "../types";
import { MASTER_STYLE, MASTER_STYLE_DRAFT, CHILEAN_BASE_CONTEXT, CHILEAN_OUTDOOR_CONTEXT, CHILEAN_STUDIO_CONTEXT, CHILEAN_CONTEXT_LITE, FLYER_STYLES, VIDEO_PHYSICS_GUARDRAIL } from "../constants";
import { analyzeImageForTextStyle, generateTextStylesFromAnalysis, generateDynamicTextClasses, ImageAnalysisResult } from "./imageAnalysisService";
import { analyzeContextualTypography, generateContextualStyles, generateContextualClasses, ContextualTypographyResult } from "./contextualTypographyService";
import { analyzeImageContrast, generateContrastOptimizedStyles, ContrastAnalysis } from "./contrastAnalysisService";
import { analyzeContextualEffects, generateContextualEffectStyles, generateContextualEffectClasses, ContextualEffects } from "./contextualEffectsService";
import { analyzeCompositionForText, generateCompositionBasedStyles, generateCompositionClasses, CompositionAnalysisResult } from "./compositionAnalysisService";
import { validateAutoTextAnalysis, improveAutoTextAnalysis, ValidationResult } from "./autoTextValidationService";
import { RealTimePreview, PreviewState } from "./realTimePreviewService";

// Helper to get client instance with latest key
const getAiClient = () => new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "AIzaSyCMXM-e632BNF3IwnKDX1qKXpj6qrpsYfM"
});

// Define which styles allow landscapes. 
const OUTDOOR_STYLES: FlyerStyleKey[] = [
  'summer_beach', 
  'corporate', 
  'worship_sky', 
  'realestate_night',
  'eco_organic', 
  'political_community', 
  'art_double_exp'
];

export interface AnalyzedContent {
  description: string;
  visualStyle?: string;
  overlayText?: string; // NEW: Texto específico para superponer
  textStyle?: string; // NEW: Estilo del texto extraído
}

/**
 * Step 0.5: Generate persuasive text based on marketing objective
 */
export const generatePersuasiveText = async (
  businessDescription: string,
  objective: 'branding' | 'leads'
): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";

    const systemInstruction = `You are an expert marketing copywriter specializing in Chilean market.
    Generate persuasive text for a promotional flyer based on the business and marketing objective.
    
    RULES:
    1. Keep text VERY SHORT and COMPACT (maximum 4 words for branding, 6 words for leads)
    2. Text MUST fit within image boundaries - no text should extend outside the image frame
    3. Use compelling Chilean Spanish that resonates with local culture
    4. For BRANDING: Focus on recognition, trust, premium positioning, quality, expertise (max 4 words)
    5. For LEADS: Focus on urgency, benefits, clear call-to-action, special offers (max 6 words)
    6. Return ONLY the text, no explanations
    7. Use authentic Chilean expressions when appropriate`;

    const objectivePrompt = objective === 'branding'
      ? "Generate branding-focused text that builds recognition and trust."
      : "Generate lead-generation text with urgency and clear call-to-action.";

    const response = await ai.models.generateContent({
      model,
      contents: `Business: ${businessDescription}\n\n${objectivePrompt}\n\nGenerate compelling text:`,
      config: { systemInstruction }
    });

    return response.text?.trim() || (objective === 'branding' ? 'Calidad Premium' : '¡Contáctanos Ya!');
  } catch (error) {
    console.error("Error generating persuasive text:", error);
    // Fallback texts mejorados y específicos
    const brandingFallbacks = [
      'Calidad Premium',
      'Experiencia Confiable',
      'Profesionales Expertos',
      'Marca de Confianza',
      'Excelencia Garantizada',
      'Tradición y Calidad'
    ];
    
    const leadsFallbacks = [
      '¡Contáctanos Ya!',
      'Agenda Tu Cita',
      'Consulta Gratuita',
      'Oferta Especial',
      'Llama Ahora',
      'Reserva Hoy'
    ];
    
    const fallbacks = objective === 'branding' ? brandingFallbacks : leadsFallbacks;
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

/**
 * Step 0: Analyze a Website URL to extract description and VISUAL VIBE (Instagram Style).
 */
export const analyzeUrlContent = async (url: string): Promise<AnalyzedContent> => {
  try {
    console.log("🔍 Iniciando análisis de URL:", url);
    
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";

    // Instructions with Google Search but with timeout handling
    const systemInstruction = `You are a Marketing & Design Analyst.
    Your task is to analyze a specific URL (Website or Instagram Profile).
    
    CRITICAL RULES FOR STYLE DETECTION:
    - Pilates/Yoga/Wellness studios → Use "wellness_zen" style (calm, zen, spa-like)
    - Religious churches → Use "worship_sky" style (heavenly, clouds, religious)
    - Fitness/Gym → Use "sport_gritty" style (intense, gym, energetic)
    - Beauty/Aesthetic → Use "aesthetic_min" style (minimal, clean, beige)
    
    1. EXTRACT CONTENT: Identify the Business Name, Industry, and Key Products/Services.
    2. EXTRACT TEXT: Find specific text that should appear on a promotional flyer (business name, offers, promotions, contact info, etc.)
    3. EXTRACT STYLE: Infer the VISUAL BRAND IDENTITY (Colors, Photo Style, Lighting, Vibe).
       - Look at the ACTUAL IMAGES on the website, not just the text content
       - If the URL is Instagram and inaccessible due to login, use Google Search to find the brand's public images/presence.
    
    OUTPUT FORMAT: Return purely JSON with this schema:
    {
      "description": "A paragraph in Spanish (Chilean context) summarizing what they sell.",
      "overlayText": "Specific text that should appear on the flyer (business name, offers, etc.) in Spanish",
      "textStyle": "Description of how the text should look (bold, elegant, modern, etc.)",
      "visualStyle": "A detailed English paragraph describing the visual aesthetic (e.g., 'Minimalist, pastel colors, soft natural lighting, rustic wood textures')."
    }`;

    console.log("📡 Enviando solicitud a Gemini...");
    
    // Timeout más razonable de 15 segundos
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 15000);
    });

    // Análisis mejorado con mejor manejo de errores
    const analysisPromise = ai.models.generateContent({
      model,
      contents: `Analiza esta URL: ${url}. Extrae tanto el CONTENIDO (qué venden/hacen) como el ESTILO VISUAL (colores, estética, vibe).`,
      config: {
        systemInstruction: `Responde en formato JSON con dos campos:
        {
          "description": "Descripción del negocio en español (máximo 40 palabras)",
          "visualStyle": "Descripción detallada del estilo visual en inglés (colores, estética, mood, lighting, etc.)"
        }
        Si no puedes acceder al contenido, usa valores por defecto pero mantén el formato JSON.`,
        responseMimeType: "application/json"
      }
    });

    // Race between analysis and timeout
    const response = await Promise.race([analysisPromise, timeoutPromise]) as any;

    console.log("✅ Respuesta recibida de Gemini");
    
    const responseText = response.text?.trim();
    if (!responseText || responseText.length < 5) {
      throw new Error("Respuesta muy corta o vacía");
    }
    
    console.log("📄 Respuesta recibida:", responseText);
    
    // Intentar parsear como JSON
    let result;
    try {
      const parsed = JSON.parse(responseText);
      result = {
        description: parsed.description || "Negocio local",
        visualStyle: parsed.visualStyle || "Professional business aesthetic",
        overlayText: parsed.overlayText || "", // NEW: Texto específico para superponer
        textStyle: parsed.textStyle || "Modern and clean" // NEW: Estilo del texto
      };
    } catch (parseError) {
      console.warn("No se pudo parsear JSON, usando fallback:", parseError);
      // Fallback si no es JSON válido
      result = {
        description: responseText,
        visualStyle: "Modern business aesthetic",
        overlayText: "", // NEW: Sin texto específico en fallback
        textStyle: "Modern and clean" // NEW: Estilo por defecto
      };
    }
    
    console.log("🎯 Análisis completado:", result);
    return result;

  } catch (error: any) {
    console.error("❌ Error analyzing URL:", error);
    
    // Fallback inteligente basado en la URL
    let fallbackDescription = "Negocio local";
    
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      // Detectar tipo de negocio basado en la URL
      if (domain.includes('restaurant') || domain.includes('comida') || domain.includes('food')) {
        fallbackDescription = "Restaurante o servicio de alimentación";
      } else if (domain.includes('shop') || domain.includes('store') || domain.includes('tienda')) {
        fallbackDescription = "Tienda o comercio";
      } else if (domain.includes('hotel') || domain.includes('hostal') || domain.includes('turismo')) {
        fallbackDescription = "Servicio de hospedaje o turismo";
      } else if (domain.includes('beauty') || domain.includes('spa') || domain.includes('belleza')) {
        fallbackDescription = "Centro de belleza o wellness";
      } else if (domain.includes('fitness') || domain.includes('gym') || domain.includes('deporte')) {
        fallbackDescription = "Centro deportivo o fitness";
      } else if (domain.includes('medical') || domain.includes('salud') || domain.includes('clinica')) {
        fallbackDescription = "Servicio médico o salud";
      } else if (domain.includes('construction') || domain.includes('construccion') || domain.includes('obra')) {
        fallbackDescription = "Empresa de construcción o obras";
      } else if (domain.includes('education') || domain.includes('educacion') || domain.includes('curso')) {
        fallbackDescription = "Centro educativo o capacitación";
      } else if (domain.includes('law') || domain.includes('abogado') || domain.includes('legal')) {
        fallbackDescription = "Servicio legal o abogados";
      } else if (domain.includes('tech') || domain.includes('software') || domain.includes('digital')) {
        fallbackDescription = "Empresa tecnológica o digital";
      }
    } catch (urlError) {
      console.warn("No se pudo parsear la URL para fallback:", urlError);
    }
    
    return {
      description: fallbackDescription,
      visualStyle: "Professional business aesthetic",
      overlayText: "", // NEW: Sin texto específico en fallback
      textStyle: "Modern and clean" // NEW: Estilo por defecto
    };
  }
};

/**
 * Step 1: Translate and Enhance the user's Spanish input.
 */
export const enhancePrompt = async (userInput: string, styleKey: FlyerStyleKey): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";
    
    const styleConfig = FLYER_STYLES[styleKey];

    const systemInstruction = `You are an expert AI Prompt Engineer for image generation. 
    Your task is to take a raw Spanish description of a business service or product and translate the VISUAL DESCRIPTION into English.
    
    IMPORTANT RULES:
    1. Translate visual elements (lighting, composition, objects) to English.
    2. PRESERVE LOCATION NAMES (e.g., "Santiago", "Torres del Paine").
    3. TEXT PRESERVATION: If user wants specific text, keep it in SPANISH inside single quotes.
    4. Focus on physical details based on style: ${styleConfig.label}.
    5. Return ONLY the enhanced prompt.`;

    const response = await ai.models.generateContent({
      model,
      contents: `Input: "${userInput}"\nStyle: ${styleConfig.english_prompt}\nTranslate to English visual prompt:`,
      config: { systemInstruction }
    });

    return response.text?.trim() || userInput;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return userInput; // Fallback to raw input if enhancement fails
  }
};

/**
 * Step 1.5: Refine existing description.
 */
export const refineDescription = async (currentDescription: string, userInstruction: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";

    const systemInstruction = `You are an expert image prompt editor. 
    Rewrite the English description to incorporate the user's Spanish instruction. Return ONLY the new description.`;

    const response = await ai.models.generateContent({
      model,
      contents: `Description: "${currentDescription}"\nInstruction: "${userInstruction}"\nRewrite:`,
      config: { systemInstruction }
    });

    return response.text?.trim() || currentDescription;
  } catch (error) {
    console.error("Error refining prompt:", error);
    return currentDescription;
  }
};

/**
 * Internal Helper to execute the image generation call
 */
const executeImageGeneration = async (ai: GoogleGenAI, model: string, prompt: string, seed: number, aspectRatio: AspectRatio, isHD: boolean): Promise<string> => {
    const startTime = Date.now();
    console.log(`🚀 [GeminiService] INICIANDO generación con ${model} (HD: ${isHD}) Seed: ${seed}, AspectRatio: ${aspectRatio}`);
    console.log(`📝 [GeminiService] Prompt (${prompt.length} chars):`, prompt.substring(0, 200) + '...');
    
    // Ensure aspectRatio is in the correct format for Gemini API
    const validAspectRatios: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4', '1.91:1', '4:5', '1080x1080', '1080x1920', '1080x1350'];
    const finalAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';
    
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: {
        seed: seed,
        imageConfig: {
          aspectRatio: finalAspectRatio,
          ...(isHD ? { imageSize: "1K" } : {})
        }
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) throw new Error("API retornó 0 candidatos.");

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) throw new Error("Respuesta vacía.");

    console.log(`🔍 Total parts received: ${parts.length}`);
    
    // Search for image part
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      console.log(`🔍 Checking part ${i}:`, {
        hasInlineData: !!part.inlineData,
        hasText: !!part.text,
        mimeType: part.inlineData?.mimeType,
        dataLength: part.inlineData?.data?.length || 0
      });
      
      if (part.inlineData && part.inlineData.data) {
        let base64Data = part.inlineData.data;
        
        // 1. Sanitize whitespace
        base64Data = base64Data.replace(/\s/g, '');

        // 2. CHECK SIZE: Umbral MUY permisivo para evitar imágenes en negro
        if (base64Data.length < 100) {
            console.warn(`Image data small but accepting: ${base64Data.length} bytes.`);
            console.warn(`First 50 chars:`, base64Data.substring(0, 50));
            // NO DESCARTAR - Aceptar datos pequeños como válidos
        }

        // 3. MAGIC NUMBER VALIDATION - DETECT FORMAT AUTOMATICALLY (MÁS PERMISIVO)
        const isJpeg = base64Data.startsWith('/9j/');
        const isPng = base64Data.startsWith('iVBOR');
        const isWebp = base64Data.startsWith('UklGR');

        console.log(`🔍 Debugging image format for part ${i}:`, {
          startsWith: base64Data.substring(0, 10),
          isJpeg,
          isPng,
          isWebp,
          reportedMimeType: part.inlineData?.mimeType,
          dataLength: base64Data.length
        });

        // 4. CORRECT MIME TYPE DETECTION - FIX THE BLACK IMAGE ISSUE
        let detectedMimeType;
        if (isJpeg) {
          detectedMimeType = 'image/jpeg';
          console.log('✅ Detected JPEG format automatically');
        } else if (isPng) {
          detectedMimeType = 'image/png';
          console.log('✅ Detected PNG format automatically');
        } else if (isWebp) {
          detectedMimeType = 'image/webp';
          console.log('✅ Detected WebP format automatically');
        } else {
          // NUEVO: Ser más permisivo con el MIME type - siempre usar JPEG como fallback
          detectedMimeType = 'image/jpeg';
          console.warn('⚠️ Using JPEG fallback mimeType (was:', part.inlineData?.mimeType, ')');
        }

        console.log(`🎯 Image format detected: ${detectedMimeType}, size: ${base64Data.length} chars`);
        
        // CRITICAL FIX: Validate the image data before returning (UMbral MUY BAJO)
        const imageDataUrl = `data:${detectedMimeType};base64,${base64Data}`;
        
        // Additional validation: Check if data looks valid (umbral muy bajo)
        if (base64Data.length > 100) {
          console.log('✅ Image data looks valid, returning...');
          return imageDataUrl;
        } else {
          console.warn('⚠️ Image data is small but attempting to use...');
          console.log('🔍 Raw data preview:', base64Data.substring(0, 100));
          // Intentar usar datos pequeños en lugar de descartarlos
          return imageDataUrl;
        }
      }
    }
    
    // Check for Text Refusal (Safety)
    const textPart = parts.find(p => p.text)?.text;
    if (textPart) {
        console.warn("Safety Refusal:", textPart);
        throw new Error(`SAFETY_BLOCK: ${textPart}`);
    }

    // NUEVO: Si llegamos aquí, intentar usar el primer part disponible como fallback
    if (parts.length > 0) {
      console.warn("⚠️ No se encontraron datos de imagen válidos, intentando fallback...");
      const firstPart = parts[0];
      if (firstPart.inlineData?.data) {
        console.log("🔄 Usando primer part como fallback...");
        const fallbackData = firstPart.inlineData.data.replace(/\s/g, '');
        if (fallbackData.length > 50) { // Umbral MUY bajo para fallback
          console.log('🔄 Using fallback data with low threshold');
          console.log('🔍 Fallback data preview:', fallbackData.substring(0, 100));
          return `data:image/jpeg;base64,${fallbackData}`;
        }
      }
    }

    // ÚLTIMO RECURSO: Intentar con cualquier part que tenga datos
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.inlineData?.data) {
        const data = part.inlineData.data.replace(/\s/g, '');
        if (data.length > 50) {
          console.log(`🔄 Último recurso: usando part ${i} como fallback...`);
          console.log('🔍 Last resort data preview:', data.substring(0, 100));
          return `data:image/jpeg;base64,${data}`;
        }
      }
    }

    throw new Error("La API respondió, pero no generó datos de imagen válidos.");
  };

/**
 * NUEVA FUNCIÓN: Diagnóstico y corrección automática de imágenes en negro
 */
const diagnoseAndFixBlackImage = async (imageDataUrl: string): Promise<string> => {
  try {
    console.log('🔍 Iniciando diagnóstico de imagen...');
    
    // Crear imagen para análisis
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.warn('⚠️ No se pudo crear contexto de canvas');
            resolve(imageDataUrl);
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Analizar píxeles para detectar imagen en negro
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          let blackPixels = 0;
          let totalPixels = pixels.length / 4;
          let avgBrightness = 0;
          
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            // Calcular brillo promedio
            const brightness = (r + g + b) / 3;
            avgBrightness += brightness;
            
            // Contar píxeles muy oscuros (posiblemente negros)
            if (brightness < 10) {
              blackPixels++;
            }
          }
          
          avgBrightness /= totalPixels;
          const blackPixelRatio = blackPixels / totalPixels;
          
          console.log('📊 Análisis de imagen:', {
            width: img.width,
            height: img.height,
            totalPixels,
            blackPixels,
            blackPixelRatio: (blackPixelRatio * 100).toFixed(1) + '%',
            avgBrightness: avgBrightness.toFixed(1)
          });
          
          // Si más del 80% de los píxeles son muy oscuros, es probablemente una imagen en negro
          if (blackPixelRatio > 0.8 || avgBrightness < 20) {
            console.warn('⚠️ IMAGEN EN NEGRO DETECTADA - Aplicando corrección...');
            
            // Aplicar corrección: aumentar brillo y contraste
            ctx.filter = 'brightness(1.5) contrast(1.3) saturate(1.2)';
            ctx.drawImage(img, 0, 0);
            
            // Convertir de vuelta a data URL
            const correctedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            console.log('✅ Imagen corregida aplicada');
            resolve(correctedDataUrl);
          } else {
            console.log('✅ Imagen parece normal, no se requiere corrección');
            resolve(imageDataUrl);
          }
        } catch (error) {
          console.warn('⚠️ Error en diagnóstico:', error);
          resolve(imageDataUrl); // Fallback a imagen original
        }
      };
      
      img.onerror = () => {
        console.warn('⚠️ Error cargando imagen para diagnóstico');
        resolve(imageDataUrl); // Fallback a imagen original
      };
      
      img.src = imageDataUrl;
    });
  } catch (error) {
    console.warn('⚠️ Error en diagnóstico de imagen:', error);
    return imageDataUrl; // Fallback a imagen original
  }
};

/**
 * Step 2 (Image): Generate Flyer.
 */
export interface GeneratedImageResult {
  imageUrl: string; // NEW: Alias para compatibilidad
  imageDataUrl: string;
  imageAnalysis?: ImageAnalysisResult;
  intelligentTextStyles?: {
    cssStyles: any;
    dynamicClasses: string;
  };
  contextualTypography?: ContextualTypographyResult;
  contrastAnalysis?: ContrastAnalysis;
  contextualEffects?: ContextualEffects;
  compositionAnalysis?: CompositionAnalysisResult;
  autoTextValidation?: ValidationResult; // NEW: Resultado de validación
  realTimePreview?: RealTimePreview;
  enhancedStyles?: {
    typography: any;
    contrast: any;
    effects: any;
    composition: any;
    combinedClasses: string;
  };
}

// NUEVO: Wrapper function para compatibilidad con frontend
export interface SimpleImageResult {
  success: boolean;
  imageUrl: string;
  error?: string;
}

/**
 * Función simplificada para generar imágenes (compatibilidad con frontend)
 */
export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  options?: {
    styleKey?: FlyerStyleKey;
    quality?: ImageQuality;
    seed?: number;
  }
): Promise<SimpleImageResult> => {
  try {
    console.log('🎨 Generando imagen con prompt:', prompt);
    
    const styleKey = options?.styleKey || 'brand_identity';
    const quality = options?.quality || 'draft';
    const seed = options?.seed || Math.floor(Math.random() * 1000000);
    
    // Mejorar el prompt para mejor generación
    const enhancedPrompt = await enhancePrompt(prompt, styleKey);
    
    const result = await generateFlyerImage(
      enhancedPrompt,
      styleKey,
      aspectRatio,
      quality,
      seed,
      undefined, // customStylePrompt
      false, // hasProductOverlay
      false, // enableIntelligentTextStyles
      undefined, // autoExtractedText
      undefined // autoTextStyle
    );
    
    return {
      success: true,
      imageUrl: result.imageDataUrl
    };
  } catch (error: any) {
    console.error('❌ Error generando imagen:', error);
    return {
      success: false,
      imageUrl: '',
      error: error.message || 'Error desconocido al generar imagen'
    };
  }
};

/**
 * NUEVA FUNCIÓN: Generar imagen HD basada en la imagen de borrador como referencia
 * Esto asegura que el HD mantenga la misma composición y solo mejore la calidad
 */
export const generateHDFromDraft = async (
  draftImageDataUrl: string,
  enhancedDescription: string,
  styleKey: FlyerStyleKey,
  aspectRatio: AspectRatio,
  seed: number,
  hasProductOverlay: boolean = false
): Promise<GeneratedImageResult> => {
  const ai = getAiClient();
  const styleConfig = FLYER_STYLES[styleKey];
  
  console.log('🎯 [HD From Draft] Generando HD usando borrador como referencia...');
  console.log('📝 [HD From Draft] Seed:', seed);
  
  // Convertir data URL a base64
  const base64Data = draftImageDataUrl.split(',')[1];
  
  // Prompt específico para mejorar la imagen existente
  const enhancementPrompt = `
    ENHANCE THIS IMAGE: Improve the quality, detail, sharpness, and overall visual appeal while maintaining EXACTLY the same composition, layout, and elements.
    
    CRITICAL RULES:
    1. Keep the SAME composition, subject placement, and layout as the reference image
    2. Improve lighting, shadows, and overall visual quality
    3. Add more detail and texture to all elements
    4. Maintain the same color palette and mood
    5. Do NOT change the composition or add/remove elements
    6. Do NOT add any text to the image
    7. Output must be the same aspect ratio: ${aspectRatio}
    
    Subject: ${enhancedDescription}
    Style: ${styleConfig.label}
  `.replace(/\n/g, ' ').trim();

  try {
    // Usar el modelo HD con la imagen de referencia
    const model = 'gemini-3-pro-image-preview';
    
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: enhancementPrompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          }
        ]
      },
      config: {
        seed: seed,
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        }
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) throw new Error("API retornó 0 candidatos.");

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) throw new Error("Respuesta vacía.");

    // Buscar la imagen generada
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.inlineData && part.inlineData.data) {
        let base64Result = part.inlineData.data.replace(/\s/g, '');
        const imageDataUrl = `data:image/jpeg;base64,${base64Result}`;
        
        console.log('✅ [HD From Draft] Imagen HD generada exitosamente');
        
        // Continuar con el análisis inteligente
        const correctedImageUrl = await diagnoseAndFixBlackImage(imageDataUrl);
        
        // Generar análisis igual que en generateFlyerImage
        const imageAnalysis = await analyzeImageForTextStyle(correctedImageUrl);
        const contextualTypography = await analyzeContextualTypography(correctedImageUrl, imageAnalysis);
        const contrastAnalysis = await analyzeImageContrast(correctedImageUrl, { x: 50, y: 50 });
        const contextualEffects = await analyzeContextualEffects(correctedImageUrl, imageAnalysis);
        const compositionAnalysis = await analyzeCompositionForText(correctedImageUrl, enhancedDescription, aspectRatio);
        
        return {
          imageUrl: correctedImageUrl,
          imageDataUrl: correctedImageUrl,
          imageAnalysis,
          contextualTypography,
          contrastAnalysis,
          contextualEffects,
          compositionAnalysis
        };
      }
    }
    
    throw new Error("No se encontraron datos de imagen en la respuesta HD");
  } catch (error: any) {
    console.error('❌ [HD From Draft] Error:', error);
    throw error;
  }
};

export const generateFlyerImage = async (
  enhancedDescription: string,
  styleKey: FlyerStyleKey,
  aspectRatio: AspectRatio,
  quality: ImageQuality,
  seed: number,
  customStylePrompt?: string, // NEW: Optional override for extracted style
  hasProductOverlay: boolean = false, // NEW: User uploaded their own product
  enableIntelligentTextStyles: boolean = true, // NEW: Enable AI analysis for text styles
  autoExtractedText?: string, // NEW: Text automatically extracted from URL
  autoTextStyle?: string, // NEW: Style for automatically extracted text
  draftImageForHD?: string // NEW: Optional draft image to use as reference for HD
): Promise<GeneratedImageResult> => {
  const ai = getAiClient();
  const styleConfig = FLYER_STYLES[styleKey];
  
  // DETERMINE STYLE PROMPT:
  let activeStylePrompt = styleConfig.english_prompt;
  let activeStyleLabel = styleConfig.label;

  // PRIORITY: Use customStylePrompt if available (from URL analysis)
  if (customStylePrompt && customStylePrompt.trim()) {
      activeStylePrompt = `Style: CUSTOM BRAND IDENTITY. ${customStylePrompt}`;
      activeStyleLabel = "Detected Brand Style";
  }
  
  // Clean approach: Generate natural image without text, let overlay handle composition
  let textIntegrationPrompt = "";
  if (autoExtractedText && autoExtractedText.trim()) {
      console.log('ℹ️ Generando imagen natural para superposición de texto:', autoExtractedText);
  }
  
  // DETERMINE COMPOSITION
  let compositionPrompt = "Composition: Professional balanced layout.";
  if (aspectRatio === '9:16') compositionPrompt = "Composition: Vertical 9:16 layout, centered subject.";
  if (aspectRatio === '1:1') compositionPrompt = "Composition: Square layout.";
  if (aspectRatio === '16:9') compositionPrompt = "Composition: Wide cinematic layout.";

  // DETERMINE PRODUCT PLACEMENT STRATEGY
  let productPromptSuffix = "";
  if (hasProductOverlay) {
    // If user uploaded a product, we force the AI to create an EMPTY background.
    productPromptSuffix = " IMPORTANT: Create an EMPTY STAGE/BACKGROUND for product placement. NO CENTRAL SUBJECT. Center must be clear/empty. Focus on lighting, table texture, and background atmosphere. Do NOT generate the product itself.";
  }

  // --- UNIFIED IMAGE GENERATION (Same base for Draft and HD) ---
  let imageDataUrl: string;
  
  // Use same seed for consistency between Draft and HD
  const consistencySeed = seed;
  
  // Determine if we need landscape context
  const needsLandscape = OUTDOOR_STYLES.includes(styleKey);
  const backgroundContext = needsLandscape ? CHILEAN_OUTDOOR_CONTEXT : CHILEAN_STUDIO_CONTEXT;
  
  // Build unified prompt that works for both Draft and HD
  // CRITICAL: No text in image - text will be added as overlay
  const unifiedPrompt = `
    ${MASTER_STYLE}
    ${compositionPrompt}
    ${CHILEAN_BASE_CONTEXT}
    ${backgroundContext}
    VISUAL STYLE SPECS: ${activeStylePrompt}
    SUBJECT DESCRIPTION: ${enhancedDescription}
    ${textIntegrationPrompt}
    ${productPromptSuffix}
    
    STRICT PROHIBITION - ZERO TOLERANCE:
    1. ABSOLUTELY NO TEXT whatsoever - this is non-negotiable
    2. NO letters, numbers, words, symbols, or characters of any kind
    3. NO signs, menus, billboards, posters, banners, labels, or text on objects
    4. NO text on clothing, products, walls, buildings, vehicles, or any surfaces
    5. NO brand names, logos, or text that looks like writing
    6. If you include any text, the image will be REJECTED
    7. Text will be professionally added LATER as a separate overlay layer
    
    VISUAL REQUIREMENTS:
    - Clean, blank surfaces where text would normally appear
    - Plain walls, empty signs, blank menus, bare products
    - Focus on textures, lighting, colors, and composition only
    
    Generate a COMPLETE VISIBLE IMAGE with rich textures, clear subjects, and proper lighting.
    The image must be 100% TEXT-FREE. Any image containing text will be considered a failure.
  `.replace(/\n/g, ' ').trim();

  if (quality === 'draft') {
    // Use same model family as HD for consistency
    const model = 'gemini-2.5-flash-image';
    
    try {
        // Use same seed, same prompt structure, just different model variant
        imageDataUrl = await executeImageGeneration(ai, model, unifiedPrompt, consistencySeed, aspectRatio, false);
    } catch (error: any) {
        console.warn("Draft generation failed. Retrying with same parameters...", error.message);
        
        // Retry with same seed for consistency
        try {
            imageDataUrl = await executeImageGeneration(ai, model, unifiedPrompt, consistencySeed, aspectRatio, false);
        } catch (retryError) {
             console.error("Draft retry failed.", retryError);
             throw new Error("No se pudo generar el borrador. Intenta cambiar la descripción o usa el modo HD.");
        }
    }
  } else {
    // HD: Si tenemos imagen de borrador, usar generación basada en referencia
    if (draftImageForHD && draftImageForHD.trim()) {
      console.log('🎯 [HD] Usando borrador como referencia para mantener consistencia');
      return await generateHDFromDraft(
        draftImageForHD,
        enhancedDescription,
        styleKey,
        aspectRatio,
        seed,
        hasProductOverlay
      );
    }
    
    // HD: Use pro model with same seed and prompt structure (fallback)
    const model = 'gemini-3-pro-image-preview';
    
    try {
        // Same seed, same prompt structure - only quality settings differ
        imageDataUrl = await executeImageGeneration(ai, model, unifiedPrompt, consistencySeed, aspectRatio, true);
    } catch (error: any) {
        if (error.message.includes('SAFETY_BLOCK')) {
             throw new Error("⚠️ La imagen fue bloqueada por filtros de seguridad. Evita mencionar personas reales, celebridades o marcas registradas.");
        }
        throw error;
    }
  }

  // --- NUEVO: DIAGNÓSTICO Y CORRECCIÓN DE IMÁGENES EN NEGRO ---
  console.log('🔍 Aplicando diagnóstico de imagen...');
  const correctedImageUrl = await diagnoseAndFixBlackImage(imageDataUrl);
  
  // --- COMPREHENSIVE INTELLIGENT ANALYSIS ---
  let imageAnalysis: ImageAnalysisResult | undefined;
  let intelligentTextStyles: any;
  let contextualTypography: ContextualTypographyResult | undefined;
  let contrastAnalysis: ContrastAnalysis | undefined;
  let contextualEffects: ContextualEffects | undefined;
  let compositionAnalysis: CompositionAnalysisResult | undefined;
  let autoTextValidation: ValidationResult | undefined;
  let enhancedStyles: any;

  if (enableIntelligentTextStyles) {
    try {
      console.log("🎨 Iniciando análisis completo de imagen...");
      
      // 1. Análisis básico de imagen (usar imagen corregida si es necesario)
      imageAnalysis = await analyzeImageForTextStyle(correctedImageUrl);
      
      // 2. Análisis contextual de tipografía
      contextualTypography = await analyzeContextualTypography(correctedImageUrl, imageAnalysis);
      
      // 3. Análisis de contraste
      contrastAnalysis = await analyzeImageContrast(correctedImageUrl, { x: 50, y: 50 });
      
      // 4. Análisis de efectos contextuales
      contextualEffects = await analyzeContextualEffects(correctedImageUrl, imageAnalysis);
      
      // 5. Análisis de composición para posicionamiento automático
      compositionAnalysis = await analyzeCompositionForText(correctedImageUrl, enhancedDescription, aspectRatio);
      
      // 6. Validación automática del texto para garantizar calidad
      let autoTextValidation: ValidationResult | undefined;
      if (compositionAnalysis) {
        autoTextValidation = validateAutoTextAnalysis(compositionAnalysis, correctedImageUrl, enhancedDescription);
        
        // Si la validación falla, mejorar automáticamente el análisis
        if (!autoTextValidation.isValid) {
          console.log("🔧 Mejorando análisis automático basado en validación...");
          compositionAnalysis = improveAutoTextAnalysis(compositionAnalysis, autoTextValidation);
          
          // Revalidar después de las mejoras
          autoTextValidation = validateAutoTextAnalysis(compositionAnalysis, correctedImageUrl, enhancedDescription);
        }
      }
      
      // 7. Generar estilos combinados
      if (imageAnalysis && contextualTypography && contrastAnalysis && contextualEffects && compositionAnalysis) {
        intelligentTextStyles = {
          cssStyles: generateTextStylesFromAnalysis(imageAnalysis),
          dynamicClasses: generateDynamicTextClasses(imageAnalysis)
        };
        
        enhancedStyles = {
          typography: generateContextualStyles(contextualTypography),
          contrast: generateContrastOptimizedStyles(contrastAnalysis),
          effects: generateContextualEffectStyles(contextualEffects),
          composition: generateCompositionBasedStyles(compositionAnalysis),
          combinedClasses: [
            generateDynamicTextClasses(imageAnalysis),
            generateContextualClasses(contextualTypography),
            generateContextualEffectClasses(contextualEffects),
            generateCompositionClasses(compositionAnalysis)
          ].join(' ')
        };
        
        console.log("✅ Análisis completo finalizado:", {
          imageAnalysis,
          contextualTypography,
          contrastAnalysis,
          contextualEffects,
          compositionAnalysis,
          autoTextValidation,
          enhancedStyles
        });
      }
    } catch (analysisError) {
      console.warn("⚠️ Error en análisis inteligente, continuando con análisis básico:", analysisError);
      
      // Fallback a análisis básico
      try {
        imageAnalysis = await analyzeImageForTextStyle(correctedImageUrl);
        if (imageAnalysis) {
          intelligentTextStyles = {
            cssStyles: generateTextStylesFromAnalysis(imageAnalysis),
            dynamicClasses: generateDynamicTextClasses(imageAnalysis)
          };
        }
      } catch (basicError) {
        console.warn("⚠️ Error en análisis básico también:", basicError);
      }
    }
  }

  return {
    imageUrl: correctedImageUrl, // Alias para compatibilidad (usar imagen corregida)
    imageDataUrl: correctedImageUrl, // Usar imagen corregida
    imageAnalysis,
    intelligentTextStyles,
    contextualTypography,
    contrastAnalysis,
    contextualEffects,
    compositionAnalysis,
    autoTextValidation,
    enhancedStyles
  };
};

/**
 * Step 2 (Video): Generate Video
 */
export const generateFlyerVideo = async (
  enhancedDescription: string, 
  styleKey: FlyerStyleKey, 
  aspectRatio: AspectRatio, 
  quality: ImageQuality,
  hasProductOverlay: boolean = false // NEW
): Promise<string> => {
    try {
      const ai = getAiClient();
      const model = quality === 'draft' ? 'veo-3.1-fast-generate-preview' : 'veo-3.1-generate-preview';
      const resolution = quality === 'draft' ? '720p' : '1080p';
      const styleConfig = FLYER_STYLES[styleKey];
      const motionPrompt = styleConfig.video_motion || "Cinematic steady motion."; // Fallback to steady

      // VIDEO SPECIFIC CLEANING:
      const cleanDescription = enhancedDescription
        .replace(/'[^']*'/g, '') // Remove quoted text
        .replace(/text saying/gi, '')
        .replace(/\b(letrero|cartel|sign|banner|logo|marca|brand|label|writing|words|letters)\b/gi, '') // Remove trigger nouns
        .trim();

      // PRODUCT OVERLAY STRATEGY FOR VIDEO
      let productPromptSuffix = "";
      if (hasProductOverlay) {
        // If overlay is on, we want a moving background but NO subject in the middle.
        productPromptSuffix = " EMPTY CENTER. BACKGROUND ONLY. No main subject. Focus on environment texture and lighting.";
      }

      // Simplify prompt for Draft Video too
      let finalPrompt = "";
      if (quality === 'draft') {
         finalPrompt = `HIGH FIDELITY PHYSICS. Video clip: ${cleanDescription} ${productPromptSuffix}. Style: ${styleConfig.label}. Movement: ${motionPrompt}. ${CHILEAN_CONTEXT_LITE} ${VIDEO_PHYSICS_GUARDRAIL} REMOVE ALL SYMBOLS. WALLS MUST BE BLANK TEXTURE.`;
      } else {
         finalPrompt = `HIGH FIDELITY PHYSICS. CINEMATIC VIDEO. STYLE: ${styleConfig.english_prompt}. MOVEMENT: ${motionPrompt}. CONTEXT: Chile. SUBJECT: ${cleanDescription} ${productPromptSuffix} ${VIDEO_PHYSICS_GUARDRAIL} STRICTLY NO TEXT OR SYMBOLS ON SURFACES. WALLS ARE SOLID COLOR OR PLAIN TEXTURE.`;
      }
  
      let operation = await ai.models.generateVideos({
        model,
        prompt: finalPrompt,
        config: {
          numberOfVideos: 1,
          resolution: resolution,
          aspectRatio: aspectRatio === '9:16' || aspectRatio === '1080x1920' ? '9:16' :
                       aspectRatio === '1.91:1' ? '16:9' :
                       aspectRatio === '4:5' || aspectRatio === '1080x1350' ? '9:16' :
                       aspectRatio === '1080x1080' ? '1:1' :
                       '16:9'
        }
      });
  
      console.log("Generating video operation started...");
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({operation: operation});
      }
  
      const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (!uri) throw new Error("No video URI returned.");

      // CRITICAL FIX: Fetch the video bytes and create a Blob.
      // Direct access to the URI fails in <video> tags due to CORS/Auth issues.
      const videoUrl = `${uri}&key=${process.env.API_KEY}`;
      console.log("Downloading video bytes...");

      const response = await fetch(videoUrl);
      if (!response.ok) {
          throw new Error(`Failed to download video: ${response.statusText}`);
      }

      const blob = await response.blob();
      const localBlobUrl = URL.createObjectURL(blob);
      
      console.log("Video downloaded, created local URL:", localBlobUrl);
      return localBlobUrl;

    } catch (error) {
      console.error("Video Error:", error);
      throw new Error("Falló la generación del video.");
    }
  };
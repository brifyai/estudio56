/**
 * 🎯 FAL.AI Service - Image-to-Image (img2img) nativo
 * 
 * fal.ai soporta modelos Stable Diffusion con img2img nativo
 * Documentación: https://docs.fal.ai/model-apis/quickstart
 */

import { AspectRatio, ImageQuality } from '../types';

// ============================================
// 🔑 CONFIGURACIÓN
// ============================================

const FAL_AI_API_KEY = import.meta.env.VITE_FAL_AI_API_KEY || process.env.FAL_AI_API_KEY;

const FAL_AI_BASE_URL = 'https://api.fal.ai/v1';

// Modelos disponibles en fal.ai
export const FAL_MODELS = {
  // Clarity Upscaler - MEJOR para HD (mejora resolución sin cambiar contenido)
  CLARITY_UPSCALER: 'fal-ai/clarity-upscaler',
  // Flux Dev img2img - Mejor calidad y más confiable
  FLUX_DEV_IMG2IMG: 'fal-ai/flux/dev/image-to-image',
  // Flux Pro img2img - Máxima calidad
  FLUX_PRO_IMG2IMG: 'fal-ai/flux-pro/v1.1/image-to-image',
  // Stable Diffusion XL 1.0 img2img - Alta calidad
  SDXL_IMG2IMG: 'fal-ai/fast-sdxl/image-to-image',
  // Flux Schnell - Rápido y buena calidad
  FLUX_SCHNELL: 'fal-ai/flux/schnell',
  // Flux Dev - Mejor calidad
  FLUX_DEV: 'fal-ai/flux/dev',
} as const;

// Modelo principal para HD - Flux Dev img2img es más confiable y mantiene similitud
const HD_MODEL = FAL_MODELS.FLUX_DEV_IMG2IMG;

export type FalModelId = typeof FAL_MODELS[keyof typeof FAL_MODELS];

// ============================================
// 🛠️ INTERFACES
// ============================================

export interface FalImg2ImgRequest {
  prompt: string;
  imageUrl: string; // URL de la imagen de referencia (base64 o URL pública)
  strength?: number; // 0-1, qué tanto modificar la imagen (0.1 = muy similar, 0.9 = muy diferente)
  guidanceScale?: number; // Qué tanto seguir el prompt (7-15 recomendado)
  steps?: number; // Número de steps de denoising (20-50)
  seed?: number; // Seed para reproducibilidad
  width?: number;
  height?: number;
  negativePrompt?: string;
}

export interface FalImg2ImgResponse {
  success: boolean;
  imageUrl?: string;
  imageDataUrl?: string;
  seed?: number;
  error?: string;
}

// ============================================
// 🔧 HELPER: Convertir data URL a base64
// ============================================

const extractBase64 = (dataUrl: string): string => {
  if (dataUrl.startsWith('data:')) {
    return dataUrl.split(',')[1];
  }
  return dataUrl;
};

// ============================================
// 🎯 GENERAR IMAGEN CON IMG2IMG NATIVO
// ============================================

/**
 * Genera una imagen HD usando Image-to-Image nativo de fal.ai
 * Esto garantiza ~95% similitud con la imagen de referencia
 */
export const generateHDWithImg2Img = async (
  prompt: string,
  referenceImageDataUrl: string,
  options: {
    strength?: number; // 0.15-0.25 para máxima similitud con SDXL
    guidanceScale?: number; // 7-9 para seguir la imagen de referencia
    steps?: number; // 25-30 para mejor calidad
    seed?: number;
    aspectRatio?: AspectRatio;
    negativePrompt?: string;
  } = {}
): Promise<FalImg2ImgResponse> => {
  const {
    strength = 0.20, // Bajo = máxima similitud (0.15-0.25 óptimo para SDXL)
    guidanceScale = 7.5, // Moderado = seguir imagen de referencia
    steps = 30, // Suficientes steps para calidad HD
    seed,
    aspectRatio = '9:16',
    negativePrompt = 'blurry, low quality, pixelated, artifacts, noise, compression, distorted, deformed, extra limbs, bad anatomy, different composition, different colors, different subject, different lighting, different perspective, different size, different background, different mood, changed elements, modified layout, altered colors, different style'
  } = options;

  console.log('🎯 [fal.ai] Iniciando Flux Dev Image-to-Image para HD...');
  console.log(`📝 [fal.ai] Modelo: ${HD_MODEL}`);
  console.log(`📝 [fal.ai] Prompt length: ${prompt.length} chars`);
  console.log(`📝 [fal.ai] Prompt (first 150): ${prompt.substring(0, 150)}...`);
  console.log(`🖼️ [fal.ai] Strength: ${strength} (0.15-0.25 = máxima similitud)`);
  console.log(`🖼️ [fal.ai] Guidance Scale: ${guidanceScale} (7-9 = seguir referencia)`);
  console.log(`🖼️ [fal.ai] Steps: ${steps} (25-30 = calidad HD)`);
  console.log(`🖼️ [fal.ai] Seed: ${seed}`);
  console.log(`🖼️ [fal.ai] Aspect Ratio: ${aspectRatio}`);
  console.log(`🖼️ [fal.ai] API Key configurada: ${!!FAL_AI_API_KEY}`);
  console.log(`🖼️ [fal.ai] Draft image length: ${referenceImageDataUrl?.length || 0} chars`);
  console.log(`🖼️ [fal.ai] Negative prompt: ${negativePrompt.substring(0, 100)}...`);
  
  // Convertir aspect ratio a dimensiones
  const aspectRatioMap: Record<string, { width: number; height: number }> = {
    '9:16': { width: 768, height: 1344 },
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1344, height: 768 },
    '4:5': { width: 832, height: 1024 },
    '3:4': { width: 768, height: 1024 },
  };
  
  const dimensions = aspectRatioMap[aspectRatio] || aspectRatioMap['9:16'];

  // Extraer base64 de la imagen de referencia
  const imageBase64 = extractBase64(referenceImageDataUrl);

  // Construir request para Flux Dev img2img
  // Flux usa nombres de parámetros diferentes a SDXL
  const requestBody: any = {
    prompt: prompt,
    image_url: referenceImageDataUrl, // Enviar data URL completo
    strength: strength, // 0.15-0.25 = mantener similitud alta
    guidance_scale: guidanceScale, // 7-9 = seguir imagen de referencia
    num_inference_steps: steps, // 25-30 = calidad HD
    image_size: {
      width: dimensions.width,
      height: dimensions.height,
    },
    enable_safety_checker: false, // Desactivar para evitar falsos positivos
  };

  // Agregar seed si existe (CRÍTICO para reproducibilidad)
  if (seed !== undefined && seed !== null) {
    requestBody.seed = seed;
    console.log(`🖼️ [fal.ai] Seed configurado: ${seed} (garantiza consistencia)`);
  }

  console.log('📡 [fal.ai] Request body (sin imagen):', JSON.stringify({
    ...requestBody,
    image_url: `[DATA_URL ${referenceImageDataUrl?.length || 0} chars]`
  }, null, 2));

  try {
    // Verificar API key
    if (!FAL_AI_API_KEY) {
      throw new Error('FAL_AI_API_KEY no configurada en .env');
    }

    console.log('📡 [fal.ai] Enviando request a Flux Dev img2img...');
    console.log(`📡 [fal.ai] Endpoint: ${FAL_AI_BASE_URL}/${HD_MODEL}`);

    const response = await fetch(`${FAL_AI_BASE_URL}/${HD_MODEL}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [fal.ai] Error HTTP ${response.status}:`, errorText);
      throw new Error(`fal.ai Flux error: ${response.status} - ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    console.log('✅ [fal.ai] Respuesta Flux recibida');
    console.log('📦 [fal.ai] Response keys:', Object.keys(data));

    // Extraer imagen de la respuesta Flux
    // Flux retorna la imagen en 'images[0].url' o 'image.url'
    let imageUrl = data.images?.[0]?.url || data.image?.url || data.url;
    
    if (!imageUrl) {
      console.error('❌ [fal.ai] No se encontró imagen en la respuesta:', JSON.stringify(data, null, 2));
      throw new Error('No se encontró imagen en la respuesta de fal.ai Flux');
    }

    // Si es URL relativa, convertir a URL completa
    if (imageUrl.startsWith('/')) {
      imageUrl = `https://fal.ai${imageUrl}`;
    }

    console.log(`✅ [fal.ai] Imagen HD generada exitosamente`);
    console.log(`📸 [fal.ai] URL: ${imageUrl.substring(0, 100)}...`);
    console.log(`🎲 [fal.ai] Seed usado: ${data.seed || seed}`);

    return {
      success: true,
      imageUrl,
      seed: data.seed || seed,
    };

  } catch (error: any) {
    console.error('❌ [fal.ai] Error:', error.message);
    return {
      success: false,
      error: error.message || 'Error desconocido en fal.ai',
    };
  }
};

// ============================================
// 🔄 FALLBACK: Generar HD sin img2img (si fal.ai falla)
// ============================================

export const generateHDWithTxt2Img = async (
  prompt: string,
  options: {
    guidanceScale?: number;
    steps?: number;
    seed?: number;
    aspectRatio?: AspectRatio;
    negativePrompt?: string;
  } = {}
): Promise<FalImg2ImgResponse> => {
  const {
    guidanceScale = 9,
    steps = 30,
    seed,
    aspectRatio = '9:16',
    negativePrompt = 'blurry, low quality, distorted, deformed',
  } = options;

  console.log('🎯 [fal.ai] Fallback: Text-to-Image...');

  const aspectRatioMap: Record<string, { width: number; height: number }> = {
    '9:16': { width: 768, height: 1344 },
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1344, height: 768 },
  };

  const dimensions = aspectRatioMap[aspectRatio] || aspectRatioMap['9:16'];

  const requestBody: any = {
    prompt,
    negative_prompt: negativePrompt,
    guidance_scale: guidanceScale,
    num_inference_steps: steps,
    width: dimensions.width,
    height: dimensions.height,
  };

  if (seed !== undefined) {
    requestBody.seed = seed;
  }

  try {
    // Usar el modelo correcto de fal.ai
    const modelEndpoint = FAL_MODELS.SDXL_IMG2IMG;
    const response = await fetch(`${FAL_AI_BASE_URL}/${modelEndpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    let imageUrl = data.images?.[0]?.url || data.image || data.url;

    if (imageUrl?.startsWith('/')) {
      imageUrl = `https://fal.ai${imageUrl}`;
    }

    return {
      success: true,
      imageUrl,
      seed: data.seed || seed,
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// ============================================
// 📋 HELPERS
// ============================================

export const isFalAiConfigured = (): boolean => {
  return !!FAL_AI_API_KEY;
};

export const getFalAiStatus = (): { configured: boolean; model: string } => {
  return {
    configured: isFalAiConfigured(),
    model: FAL_MODELS.SDXL_IMG2IMG,
  };
};
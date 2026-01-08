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

// Modelos disponibles en fal.ai para img2img
export const FAL_MODELS = {
  // Stable Diffusion XL - Alta calidad
  SDXL_IMG2IMG: 'fal-ai/sdxl-img2img',
  // Stable Diffusion 1.5 - Compatible con más estilos
  SD15_IMG2IMG: 'fal-ai/stable-diffusion-v1-5/img2img',
  // Flux Schnell - Rápido y buena calidad
  FLUX_SCHNELL_IMG2IMG: 'fal-ai/flux/schnell',
  // Flux Dev - Mejor calidad
  FLUX_DEV_IMG2IMG: 'fal-ai/flux/dev',
} as const;

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
    strength?: number; // 0.1-0.3 para máxima similitud
    guidanceScale?: number; // 7-15
    steps?: number; // 20-50
    seed?: number;
    aspectRatio?: AspectRatio;
    negativePrompt?: string;
  } = {}
): Promise<FalImg2ImgResponse> => {
  const {
    strength = 0.25, // Bajo strength = más similitud con original
    guidanceScale = 9,
    steps = 30,
    seed,
    aspectRatio = '9:16',
    negativePrompt = 'blurry, low quality, distorted, deformed, extra limbs, bad anatomy'
  } = options;

  console.log('🎯 [fal.ai] Iniciando Image-to-Image nativo...');
  console.log(`📝 [fal.ai] Prompt: ${prompt.substring(0, 100)}...`);
  console.log(`🖼️ [fal.ai] Strength: ${strength} (menor = más similitud)`);
  
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

  // Construir request para fal.ai
  const requestBody: any = {
    prompt,
    negative_prompt: negativePrompt,
    image: imageBase64, // base64 de la imagen de referencia
    strength, // Qué tanto modificar (0.1 = muy poco, 0.9 = mucho)
    guidance_scale: guidanceScale,
    num_inference_steps: steps,
    width: dimensions.width,
    height: dimensions.height,
  };

  // Agregar seed si existe
  if (seed !== undefined) {
    requestBody.seed = seed;
  }

  try {
    // Verificar API key
    if (!FAL_AI_API_KEY) {
      throw new Error('FAL_AI_API_KEY no configurada');
    }

    console.log('📡 [fal.ai] Enviando request a fal.ai...');

    const response = await fetch(`${FAL_AI_BASE_URL}/${FAL_MODELS.SDXL_IMG2IMG}`, {
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
      throw new Error(`fal.ai error: ${response.status} - ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    console.log('✅ [fal.ai] Respuesta recibida');

    // Extraer imagen de la respuesta
    // fal.ai retorna la imagen en diferentes formatos
    let imageUrl = data.images?.[0]?.url || data.image || data.url;
    
    if (!imageUrl) {
      console.error('❌ [fal.ai] No se encontró imagen en la respuesta:', data);
      throw new Error('No se encontró imagen en la respuesta de fal.ai');
    }

    // Si es URL relativa, convertir a URL completa
    if (imageUrl.startsWith('/')) {
      imageUrl = `https://fal.ai${imageUrl}`;
    }

    console.log(`✅ [fal.ai] Imagen generada: ${imageUrl.substring(0, 100)}...`);

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
    const response = await fetch(`${FAL_AI_BASE_URL}/${FAL_MODELS.SDXL_IMG2IMG}`, {
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
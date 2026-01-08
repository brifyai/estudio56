/**
 * 🎯 FAL.AI Service - Image-to-Image (img2img) nativo
 * 
 * IMPORTANTE: Todas las llamadas a fal.ai van a través de Netlify Functions
 * La API key está en el backend por seguridad
 * 
 * Documentación: https://docs.fal.ai/model-apis/quickstart
 */

import { AspectRatio, ImageQuality } from '../types';

// ============================================
// 🔑 CONFIGURACIÓN
// ============================================

// Base URL - solo para referencia, las llamadas van vía Netlify Function
const FAL_AI_BASE_URL = 'https://queue.fal.run';

// Modelos disponibles en fal.ai
export const FAL_MODELS = {
  // Flux Schnell - RÁPIDO para borradores y variaciones de realidad (2-3 segundos)
  FLUX_SCHNELL: 'fal-ai/flux/schnell',
  // Flux Dev - Mejor calidad para HD
  FLUX_DEV: 'fal-ai/flux/dev',
  // Flux Dev img2img - Mejor calidad y más confiable para HD con referencia
  FLUX_DEV_IMG2IMG: 'fal-ai/flux/dev/image-to-image',
  // Stable Diffusion XL 1.0 img2img - Alta calidad alternativa
  SDXL_IMG2IMG: 'fal-ai/fast-sdxl/image-to-image',
  // Clarity Upscaler - Para mejorar resolución sin cambiar contenido
  CLARITY_UPSCALER: 'fal-ai/clarity-upscaler',
} as const;

// Modelo para borradores y variaciones de realidad - Flux Schnell es más rápido (2-3s)
const DRAFT_MODEL = FAL_MODELS.FLUX_SCHNELL;
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
// 🔧 HELPER: Comprimir imagen antes de enviar
// ============================================

const compressImageDataUrl = async (dataUrl: string, maxWidth: number = 768, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      // Crear canvas y comprimir
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('No se pudo obtener contexto 2D'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convertir a JPEG con calidad reducida
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      
      console.log(`🗜️ [Compression] Original: ${dataUrl.length} bytes → Compressed: ${compressedDataUrl.length} bytes (${Math.round((1 - compressedDataUrl.length / dataUrl.length) * 100)}% reduction)`);
      
      resolve(compressedDataUrl);
    };
    
    img.onerror = () => {
      reject(new Error('Error cargando imagen para comprimir'));
    };
    
    img.src = dataUrl;
  });
};

// ============================================
// 🚀 GENERAR BORRADOR CON FLUX SCHNELL (TEXT-TO-IMAGE)
// ============================================

/**
 * Genera un borrador rápido usando Flux Schnell (text-to-image)
 * Ideal para borradores iniciales sin imagen de referencia
 */
export const generateDraftWithFluxSchnell = async (
  prompt: string,
  options: {
    seed?: number;
    aspectRatio?: AspectRatio;
  } = {}
): Promise<FalImg2ImgResponse> => {
  const {
    seed,
    aspectRatio = '9:16',
  } = options;

  console.log('🚀 [fal.ai] Iniciando Flux Schnell para borrador...');
  console.log(`📝 [fal.ai] Modelo: ${FAL_MODELS.FLUX_SCHNELL}`);
  console.log(`📝 [fal.ai] Prompt length: ${prompt.length} chars`);
  console.log(`🖼️ [fal.ai] Aspect Ratio: ${aspectRatio}`);
  console.log(`🎲 [fal.ai] Seed: ${seed}`);

  try {
    console.log('📡 [fal.ai] Enviando request via Netlify Function...');
    
    // Llamar a Netlify Function (API key en backend)
    const response = await fetch('/.netlify/functions/generate-with-fal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: FAL_MODELS.FLUX_SCHNELL,
        prompt,
        seed,
        aspectRatio,
        // Flux Schnell no usa imagen de referencia (text-to-image)
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ [fal.ai] Error HTTP ${response.status}:`, errorData);
      throw new Error(`fal.ai error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('✅ [fal.ai] Respuesta recibida');

    if (!data.success) {
      throw new Error(data.error || 'Error en generación');
    }

    if (!data.imageUrl) {
      throw new Error('No se encontró imageUrl en respuesta');
    }

    console.log(`✅ [fal.ai] Borrador generado exitosamente con Flux Schnell`);
    return {
      success: true,
      imageUrl: data.imageUrl,
      seed: data.seed || seed,
    };

  } catch (error: any) {
    console.error('❌ [fal.ai] Error:', error.message);
    return {
      success: false,
      error: error.message || 'Error desconocido',
    };
  }
};

// ============================================
// 🚀 GENERAR VARIACIÓN DE REALIDAD CON FLUX DEV IMG2IMG
// ============================================

/**
 * Genera una variación de realidad usando Flux Dev Image-to-Image
 * Mantiene la composición exacta y solo ajusta la calidad fotográfica
 */
export const generateRealityVariation = async (
  prompt: string,
  referenceImageDataUrl: string,
  options: {
    strength?: number; // 0.30-0.40 para cambios visibles en variaciones de realidad
    guidanceScale?: number;
    steps?: number;
    seed?: number;
    aspectRatio?: AspectRatio;
    negativePrompt?: string;
  } = {}
): Promise<FalImg2ImgResponse> => {
  const {
    strength = 0.35, // ✅ AUMENTADO: 0.35 para cambios más visibles (antes 0.20)
    guidanceScale = 7.5,
    steps = 28, // Flux Dev usa 28 steps por defecto
    seed,
    aspectRatio = '9:16',
    negativePrompt = 'blurry, low quality, pixelated, artifacts, noise, compression, distorted, deformed, extra limbs, bad anatomy, different composition, different person, different pose, different background, different scene, changed elements'
  } = options;

  console.log('🚀 [fal.ai] Iniciando Flux Dev Image-to-Image para variación de realidad...');
  console.log(`📝 [fal.ai] Modelo: ${FAL_MODELS.FLUX_DEV_IMG2IMG}`);
  console.log(`📝 [fal.ai] Prompt length: ${prompt.length} chars`);
  console.log(`🖼️ [fal.ai] Tiene imagen de referencia: ${!!referenceImageDataUrl}`);
  console.log(`🖼️ [fal.ai] Strength: ${strength} (cambios más visibles)`);
  console.log(`🖼️ [fal.ai] Steps: ${steps}`);
  console.log(`🖼️ [fal.ai] Seed: ${seed}`);
  
  // Convertir aspect ratio a dimensiones
  const aspectRatioMap: Record<string, { width: number; height: number }> = {
    '9:16': { width: 768, height: 1344 },
    '1:1': { width: 1024, height: 1024 },
    '16:9': { width: 1344, height: 768 },
    '4:5': { width: 832, height: 1024 },
    '3:4': { width: 768, height: 1024 },
  };
  
  const dimensions = aspectRatioMap[aspectRatio] || aspectRatioMap['9:16'];

  try {
    if (!FAL_AI_API_KEY) {
      console.warn('⚠️ [fal.ai] API Key no configurada en frontend, usando Netlify Function');
    }

    // 🗜️ COMPRIMIR IMAGEN ANTES DE ENVIAR (Solución para payloads grandes)
    console.log('🗜️ [fal.ai] Comprimiendo imagen de referencia antes de enviar...');
    console.log('📏 [fal.ai] Tamaño original:', referenceImageDataUrl.length, 'bytes');
    
    let compressedImage: string;
    try {
      compressedImage = await compressImageDataUrl(referenceImageDataUrl, 768, 0.75);
      console.log('✅ [fal.ai] Imagen comprimida exitosamente');
      console.log('📏 [fal.ai] Tamaño comprimido:', compressedImage.length, 'bytes');
      console.log('📊 [fal.ai] Reducción:', Math.round((1 - compressedImage.length / referenceImageDataUrl.length) * 100), '%');
    } catch (compressionError: any) {
      console.warn('⚠️ [fal.ai] Error comprimiendo imagen, usando original:', compressionError.message);
      compressedImage = referenceImageDataUrl;
    }

    console.log('📡 [fal.ai] Enviando request a Flux Dev Image-to-Image via Netlify Function...');
    
    // Llamar a Netlify Function
    const response = await fetch('/.netlify/functions/generate-with-fal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: FAL_MODELS.FLUX_DEV_IMG2IMG,
        prompt,
        imageUrl: compressedImage, // ✅ Usar imagen comprimida
        strength,
        guidanceScale,
        steps,
        seed,
        aspectRatio,
        negativePrompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ [fal.ai] Error HTTP ${response.status}:`, errorData);
      throw new Error(`fal.ai error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('✅ [fal.ai] Respuesta Flux Dev recibida');
    console.log('📦 [fal.ai] Response:', data);

    if (!data.success) {
      throw new Error(data.error || 'Error en generación');
    }

    if (!data.imageUrl) {
      throw new Error('No se encontró imageUrl en respuesta');
    }

    console.log(`✅ [fal.ai] Variación de realidad generada exitosamente`);
    return {
      success: true,
      imageUrl: data.imageUrl,
      seed: data.seed || seed,
    };

  } catch (error: any) {
    console.error('❌ [fal.ai] Error:', error.message);
    return {
      success: false,
      error: error.message || 'Error desconocido',
    };
  }
};

// ============================================
// 🎯 GENERAR IMAGEN CON IMG2IMG NATIVO
// ============================================

/**
 * Genera una imagen HD usando Image-to-Image nativo de fal.ai
 * IMPORTANTE: Usa Netlify Function para seguridad (API key en backend)
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
  console.log(`🖼️ [fal.ai] Strength: ${strength} (0.15-0.25 = máxima similitud)`);
  console.log(`🖼️ [fal.ai] Guidance Scale: ${guidanceScale}`);
  console.log(`🖼️ [fal.ai] Steps: ${steps}`);
  console.log(`🖼️ [fal.ai] Seed: ${seed}`);
  console.log(`🖼️ [fal.ai] Aspect Ratio: ${aspectRatio}`);

  try {
    // 🗜️ COMPRIMIR IMAGEN ANTES DE ENVIAR (Solución para payloads grandes)
    console.log('🗜️ [fal.ai] Comprimiendo imagen de referencia antes de enviar...');
    console.log('📏 [fal.ai] Tamaño original:', referenceImageDataUrl.length, 'bytes');
    
    let compressedImage: string;
    try {
      compressedImage = await compressImageDataUrl(referenceImageDataUrl, 768, 0.75);
      console.log('✅ [fal.ai] Imagen comprimida exitosamente');
      console.log('📏 [fal.ai] Tamaño comprimido:', compressedImage.length, 'bytes');
      console.log('📊 [fal.ai] Reducción:', Math.round((1 - compressedImage.length / referenceImageDataUrl.length) * 100), '%');
    } catch (compressionError: any) {
      console.warn('⚠️ [fal.ai] Error comprimiendo imagen, usando original:', compressionError.message);
      compressedImage = referenceImageDataUrl;
    }
    
    console.log('📡 [fal.ai] Enviando request via Netlify Function...');
    
    // Llamar a Netlify Function (API key en backend)
    const response = await fetch('/.netlify/functions/generate-with-fal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: HD_MODEL,
        prompt,
        imageUrl: compressedImage, // ✅ Usar imagen comprimida
        strength,
        guidanceScale,
        steps,
        seed,
        aspectRatio,
        negativePrompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ [fal.ai] Error HTTP ${response.status}:`, errorData);
      throw new Error(`fal.ai error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('✅ [fal.ai] Respuesta recibida');

    if (!data.success) {
      throw new Error(data.error || 'Error en generación');
    }

    if (!data.imageUrl) {
      throw new Error('No se encontró imageUrl en respuesta');
    }

    console.log(`✅ [fal.ai] Imagen HD generada exitosamente`);
    return {
      success: true,
      imageUrl: data.imageUrl,
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
  // Siempre retornar true porque la Netlify Function maneja la API key
  return true;
};

export const getFalAiStatus = (): { configured: boolean; model: string } => {
  return {
    configured: isFalAiConfigured(),
    model: FAL_MODELS.SDXL_IMG2IMG,
  };
};
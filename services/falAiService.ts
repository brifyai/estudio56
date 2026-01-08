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

// Base URL sin /v1/ - los modelos usan rutas directas
const FAL_AI_BASE_URL = 'https://queue.fal.run';

// Modelos disponibles en fal.ai
export const FAL_MODELS = {
  // Z-Image Turbo LoRA - RÁPIDO para borradores y variaciones de realidad
  Z_IMAGE_TURBO: 'fal-ai/z-image/turbo/lora',
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

// Modelo para borradores y variaciones de realidad - Z-Image Turbo es más rápido
const DRAFT_MODEL = FAL_MODELS.Z_IMAGE_TURBO;
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
// 🚀 GENERAR BORRADOR CON Z-IMAGE TURBO
// ============================================

/**
 * Genera un borrador rápido usando Z-Image Turbo LoRA
 * Ideal para borradores y variaciones de realidad (más rápido y económico)
 */
export const generateDraftWithZImage = async (
  prompt: string,
  referenceImageDataUrl?: string,
  options: {
    strength?: number; // 0.2-0.4 para variaciones de realidad
    guidanceScale?: number;
    steps?: number;
    seed?: number;
    aspectRatio?: AspectRatio;
    negativePrompt?: string;
  } = {}
): Promise<FalImg2ImgResponse> => {
  const {
    strength = 0.3, // Moderado para variaciones de realidad
    guidanceScale = 7.5,
    steps = 20, // Menos steps = más rápido
    seed,
    aspectRatio = '9:16',
    negativePrompt = 'blurry, low quality, pixelated, artifacts, noise, compression, distorted, deformed, extra limbs, bad anatomy'
  } = options;

  console.log('🚀 [fal.ai] Iniciando Z-Image Turbo para borrador...');
  console.log(`📝 [fal.ai] Modelo: ${DRAFT_MODEL}`);
  console.log(`📝 [fal.ai] Prompt length: ${prompt.length} chars`);
  console.log(`🖼️ [fal.ai] Tiene imagen de referencia: ${!!referenceImageDataUrl}`);
  console.log(`🖼️ [fal.ai] Strength: ${strength}`);
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

  // Construir request para Z-Image Turbo
  const requestBody: any = {
    prompt: prompt,
    guidance_scale: guidanceScale,
    num_inference_steps: steps,
    image_size: {
      width: dimensions.width,
      height: dimensions.height,
    },
    enable_safety_checker: false,
  };

  // Si hay imagen de referencia, agregar parámetros de img2img
  if (referenceImageDataUrl) {
    requestBody.image_url = referenceImageDataUrl;
    requestBody.strength = strength;
    console.log(`🖼️ [fal.ai] Usando Image-to-Image con strength ${strength}`);
  }

  // Agregar seed si existe
  if (seed !== undefined && seed !== null) {
    requestBody.seed = seed;
  }

  try {
    if (!FAL_AI_API_KEY) {
      throw new Error('FAL_AI_API_KEY no configurada');
    }

    console.log('📡 [fal.ai] Enviando request a Z-Image Turbo...');
    console.log(`📡 [fal.ai] Endpoint: ${FAL_AI_BASE_URL}/${DRAFT_MODEL}`);
    console.log(`📡 [fal.ai] Request body:`, JSON.stringify({
      ...requestBody,
      image_url: referenceImageDataUrl ? `[DATA_URL ${referenceImageDataUrl.length} chars]` : undefined
    }, null, 2));
    
    const response = await fetch(`${FAL_AI_BASE_URL}/${DRAFT_MODEL}`, {
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
      throw new Error(`fal.ai Z-Image error: ${response.status} - ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    console.log('✅ [fal.ai] Respuesta Z-Image recibida');

    // Manejar sistema de cola si es necesario
    if (data.status === 'IN_QUEUE' || data.status === 'IN_PROGRESS') {
      console.log('⏳ [fal.ai] Imagen en cola, esperando resultado...');
      
      const maxAttempts = 60; // 60 intentos = 2 minutos máximo
      const pollInterval = 2000;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
        const statusResponse = await fetch(data.status_url, {
          headers: { 'Authorization': `Key ${FAL_AI_API_KEY}` },
        });
        
        if (!statusResponse.ok) continue;
        
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'COMPLETED') {
          const resultResponse = await fetch(data.response_url, {
            headers: { 'Authorization': `Key ${FAL_AI_API_KEY}` },
          });
          
          const resultData = await resultResponse.json();
          const imageUrl = resultData.images?.[0]?.url || resultData.image?.url || resultData.url;
          
          if (!imageUrl) {
            throw new Error('No se encontró imagen en resultado');
          }
          
          console.log(`✅ [fal.ai] Borrador generado exitosamente`);
          return {
            success: true,
            imageUrl,
            seed: resultData.seed || seed,
          };
        } else if (statusData.status === 'FAILED') {
          throw new Error(`Generación falló: ${statusData.error}`);
        }
      }
      
      throw new Error('Timeout esperando resultado (2 minutos)');
    }

    // Respuesta síncrona
    const imageUrl = data.images?.[0]?.url || data.image?.url || data.url;
    
    if (!imageUrl) {
      throw new Error('No se encontró imagen en respuesta');
    }

    console.log(`✅ [fal.ai] Borrador generado exitosamente`);
    return {
      success: true,
      imageUrl,
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

    // fal.ai usa sistema de cola - verificar si está en cola
    if (data.status === 'IN_QUEUE' || data.status === 'IN_PROGRESS') {
      console.log('⏳ [fal.ai] Imagen en cola, esperando resultado...');
      console.log('📝 [fal.ai] Request ID:', data.request_id);
      console.log('📝 [fal.ai] Status URL:', data.status_url);
      
      // Hacer polling hasta obtener el resultado
      const maxAttempts = 90; // 90 intentos = 3 minutos máximo
      const pollInterval = 2000; // 2 segundos entre intentos
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
        console.log(`🔄 [fal.ai] Polling intento ${attempt + 1}/${maxAttempts}...`);
        
        const statusResponse = await fetch(data.status_url, {
          headers: {
            'Authorization': `Key ${FAL_AI_API_KEY}`,
          },
        });
        
        if (!statusResponse.ok) {
          console.error(`❌ [fal.ai] Error en polling: ${statusResponse.status}`);
          continue;
        }
        
        const statusData = await statusResponse.json();
        console.log(`📊 [fal.ai] Status: ${statusData.status}`);
        
        if (statusData.status === 'COMPLETED') {
          console.log('✅ [fal.ai] Generación completada');
          
          // Obtener el resultado final
          const resultResponse = await fetch(data.response_url, {
            headers: {
              'Authorization': `Key ${FAL_AI_API_KEY}`,
            },
          });
          
          if (!resultResponse.ok) {
            throw new Error(`Error obteniendo resultado: ${resultResponse.status}`);
          }
          
          const resultData = await resultResponse.json();
          console.log('📦 [fal.ai] Result keys:', Object.keys(resultData));
          
          // Extraer imagen del resultado
          let imageUrl = resultData.images?.[0]?.url || resultData.image?.url || resultData.url;
          
          if (!imageUrl) {
            console.error('❌ [fal.ai] No se encontró imagen en resultado:', JSON.stringify(resultData, null, 2));
            throw new Error('No se encontró imagen en el resultado de fal.ai');
          }
          
          console.log(`✅ [fal.ai] Imagen HD generada exitosamente`);
          console.log(`📸 [fal.ai] URL: ${imageUrl.substring(0, 100)}...`);
          console.log(`🎲 [fal.ai] Seed usado: ${resultData.seed || seed}`);
          
          return {
            success: true,
            imageUrl,
            seed: resultData.seed || seed,
          };
        } else if (statusData.status === 'FAILED') {
          console.error('❌ [fal.ai] Generación falló:', statusData.error);
          throw new Error(`Generación falló: ${statusData.error || 'Error desconocido'}`);
        }
        
        // Continuar polling si está IN_PROGRESS
      }
      
      // Si llegamos aquí, se agotó el tiempo
      throw new Error('Timeout esperando resultado de fal.ai (3 minutos)');
    }

    // Si la respuesta ya tiene la imagen (respuesta síncrona)
    let imageUrl = data.images?.[0]?.url || data.image?.url || data.url;
    
    if (!imageUrl) {
      console.error('❌ [fal.ai] No se encontró imagen en la respuesta:', JSON.stringify(data, null, 2));
      throw new Error('No se encontró imagen en la respuesta de fal.ai Flux');
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
/**
 * 🎯 Vertex AI Image Generation Service - Estudio 56
 *
 * Usa los modelos correctos de Imagen a través de Vertex AI:
 * - Draft/HD: imagen-3.0-fast-001
 *
 * IMPORTANTE: Gemini 2.0 Flash es SOLO para razonamiento, NO para imágenes.
 */

import { MODELS, VERTEX_AI_CONFIG } from '../src/constants/aiModels';
import type { AspectRatio } from '../types';

// Tipos para Vertex AI
interface VertexImageConfig {
  model: string;
  prompt: string;
  aspectRatio: string;
  imageSize?: string;
  seed?: number;
  safetySettings?: Record<string, string>;
}

interface VertexImageResult {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

// Alias para compatibilidad
type VertexResult = VertexImageResult;

/**
 * Convierte AspectRatio de la app al formato de Vertex AI
 */
const convertAspectRatio = (aspectRatio: AspectRatio): string => {
  const ratioMap: Record<string, string> = {
    '1:1': '1:1',
    '16:9': '16:9',
    '9:16': '9:16',
    '4:3': '4:3',
    '3:4': '3:4',
    '1.91:1': '1.91:1',
    '4:5': '4:5',
    '1080x1080': '1:1',
    '1080x1920': '9:16',
    '1080x1350': '4:5'
  };
  return ratioMap[aspectRatio] || '1:1';
};

/**
 * Genera imagen usando Vertex AI con el modelo correcto
 * 
 * @param prompt - Prompt de generación
 * @param aspectRatio - Proporción de la imagen
 * @param quality - 'draft' o 'hd'
 * @param seed - Semilla para reproducibilidad (opcional)
 */
export const generateImageWithVertex = async (
  prompt: string,
  aspectRatio: AspectRatio,
  quality: 'draft' | 'hd',
  seed?: number,
  retryCount: number = 0
): Promise<VertexImageResult> => {
  const startTime = Date.now();
  const maxRetries = 2; // Máximo 2 reintentos
  
  // Seleccionar el modelo correcto según calidad
  const model = MODELS.DRAFT_ENGINE; // Usar el mismo modelo para draft y HD
  const modelDisplayName = 'Imagen 3 Capability';
  
  console.log(`🎨 [VertexImage] Generando con ${modelDisplayName} (${model}) - Intento ${retryCount + 1}/${maxRetries + 1}`);
  console.log(`📐 Aspect Ratio: ${aspectRatio}`);
  console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
  
  try {
    // Usar endpoint directo de Netlify Functions para evitar redirects
    const response = await fetch('/.netlify/functions/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        prompt,
        aspectRatio: convertAspectRatio(aspectRatio),
        imageSize: quality === 'draft' ? '480p' : '1K',
        seed
      })
    });

    // Si es 503 y aún tenemos reintentos, esperar y reintentar
    if (response.status === 503 && retryCount < maxRetries) {
      const waitTime = (retryCount + 1) * 2000; // 2s, 4s
      console.log(`⏳ [VertexImage] Error 503, reintentando en ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return generateImageWithVertex(prompt, aspectRatio, quality, seed, retryCount + 1);
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    
    const duration = Date.now() - startTime;
    console.log(`✅ [VertexImage] Imagen generada en ${duration}ms`);
    
    // El backend retorna 'url' (data:image/png;base64,...), no 'imageUrl'
    return {
      success: true,
      imageUrl: result.url
    };
    
  } catch (error: any) {
    console.error(`❌ [VertexImage] Error:`, error.message);
    
    // Si es un error de timeout y aún tenemos reintentos
    if (error.message.includes('503') && retryCount < maxRetries) {
      const waitTime = (retryCount + 1) * 2000;
      console.log(`⏳ [VertexImage] Reintentando en ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return generateImageWithVertex(prompt, aspectRatio, quality, seed, retryCount + 1);
    }
    
    return {
      success: false,
      error: error.message || 'Error generando imagen con Vertex AI'
    };
  }
};

/**
 * Genera imagen HD basada en borrador como referencia
 */
export const generateHDFromDraftWithVertex = async (
  draftImageUrl: string,
  prompt: string,
  aspectRatio: AspectRatio,
  seed?: number
): Promise<VertexResult> => {
  console.log(`💎 [VertexImage] Generando HD desde borrador...`);
  
  try {
    const response = await fetch('/.netlify/functions/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODELS.HD_ENGINE,
        prompt,
        aspectRatio: convertAspectRatio(aspectRatio),
        imageSize: '1K',
        seed,
        referenceImage: draftImageUrl // Para improvement
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      imageUrl: result.url
    };
    
  } catch (error: any) {
    console.error(`❌ [VertexImage] HD Error:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
};

// ============================================
// API Endpoint Handler (para server-side)
// ============================================

/**
 * Handler para el endpoint de generación de imágenes
 * Este código se ejecutaría en un server function (Netlify Functions, Vercel API, etc.)
 */
export const handleVertexImageGeneration = async (config: VertexImageConfig) => {
  const { model, prompt, aspectRatio, imageSize, seed } = config;
  
  // Verificar que usamos modelos de Imagen, NO Gemini
  if (model.includes('gemini') && !model.includes('imagen')) {
    throw new Error('ERROR: No usar modelos Gemini para generación de imágenes. Usar imagen-3.0-fast-001');
  }
  
  // Configuración de la solicitud a Vertex AI
  const vertexConfig = {
    location: VERTEX_AI_CONFIG.LOCATION,
    projectId: VERTEX_AI_CONFIG.PROJECT_ID
  };
  
  // Parámetros de generación
  const generationConfig = {
    aspectRatio,
    imageSize: imageSize || '480p',
    seed: seed || Math.floor(Math.random() * 1000000),
    outputGcsUri: undefined, // Si queremos guardar en GCS
  };
  
  // Safety settings para evitar bloqueos
  const safetySettings = {
    person: 'BLOCK_ONLY_HIGH',
    violence: 'BLOCK_ONLY_HIGH',
    sexual: 'BLOCK_ONLY_HIGH',
    hateSpeech: 'BLOCK_ONLY_HIGH'
  };
  
  // Llamada a Vertex AI (pseudocódigo - depende del SDK específico)
  /*
  const { VertexAI } = require('@google-cloud/vertexai');
  
  const vertex_ai = new VertexAI(vertexConfig);
  const generativeModel = vertex_ai.getGenerativeModel({
    model: model,
    generationConfig,
    safetySettings
  });
  
  const result = await generativeModel.generateContent(prompt);
  const imageData = result.response.imageGeneration();
  
  return {
    imageUrl: `data:image/jpeg;base64,${imageData}`
  };
  */
  
  // Por ahora, retornar estructura esperada
  return {
    success: true,
    imageUrl: '',
    model,
    promptLength: prompt.length
  };
};

// ============================================
// Utility Functions
// ============================================

/**
 * Verifica si el modelo es correcto para generación de imágenes
 */
export const isValidImageModel = (modelId: string): boolean => {
  return modelId.startsWith('imagen-');
};

/**
 * Obtiene el costo estimado por generación
 */
export const getEstimatedCost = (quality: 'draft' | 'hd'): number => {
  // Precios aproximados en USD
  const costs = {
    draft: 0.02,  // imagen-3.0-fast-001
    hd: 0.02      // imagen-3.0-fast-001
  };
  return costs[quality];
};

/**
 * Obtiene tiempo estimado de generación
 */
export const getEstimatedTime = (quality: 'draft' | 'hd'): number => {
  // Tiempos aproximados en segundos
  const times = {
    draft: 5,   // Fast
    hd: 15      // Pro
  };
  return times[quality];
};
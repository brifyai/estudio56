/**
 * 🚀 fal.ai Video Service via Cloudflare Worker
 * 
 * Arquitectura:
 * React App → Cloudflare Worker → fal.ai API
 * 
 * Ventajas:
 * - Menor latencia
 * - API Key segura en Worker
 * - Caché automático
 */

import { AspectRatio } from '../types';

// ============================================
// CONFIGURACIÓN
// ============================================

// URL del Cloudflare Worker
const WORKER_URL = process.env.REACT_APP_VIDEO_WORKER_URL || 'https://estudio56-video-worker.brifyaimaster.workers.dev';

// ============================================
// INTERFACES
// ============================================

export interface VideoRequest {
  prompt: string;
  aspectRatio?: AspectRatio;
}

export interface VideoResponse {
  success: boolean;
  taskId?: string;
  statusUrl?: string;
  status?: string;
  videoUrl?: string;
  seed?: number;
  error?: string;
}

// ============================================
// GENERAR BORRADOR (480p)
// ============================================

/**
 * Genera un video borrador en 480p
 */
export const generateDraftVideo = async (
  prompt: string,
  options: {
    aspectRatio?: AspectRatio;
  } = {}
): Promise<VideoResponse> => {
  const { aspectRatio = '9:16' } = options;

  console.log('🚀 [Worker] Generando borrador via Cloudflare Worker...');
  console.log(`📝 [Worker] Prompt: ${prompt.substring(0, 100)}...`);
  console.log(`📐 [Worker] Aspect Ratio: ${aspectRatio}`);

  try {
    const response = await fetch(`${WORKER_URL}/generate-draft`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        aspectRatio,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ [Worker] Error HTTP ${response.status}:`, errorData);
      throw new Error(`Worker error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('✅ [Worker] Respuesta recibida:', data);

    return {
      success: true,
      taskId: data.taskId,
      statusUrl: data.statusUrl,
      status: data.status,
    };

  } catch (error: any) {
    console.error('❌ [Worker] Error:', error.message);
    return {
      success: false,
      error: error.message || 'Error desconocido',
    };
  }
};

// ============================================
// GENERAR HD (1080p)
// ============================================

/**
 * Upscale un video borrador a 1080p
 */
export const upscaleVideoToHD = async (
  videoUrl: string
): Promise<VideoResponse> => {
  console.log('🚀 [Worker] Upscaling a HD via Cloudflare Worker...');
  console.log(`📹 [Worker] Video URL: ${videoUrl.substring(0, 100)}...`);

  try {
    const response = await fetch(`${WORKER_URL}/generate-hd`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        videoUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ [Worker] Error HTTP ${response.status}:`, errorData);
      throw new Error(`Worker error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('✅ [Worker] Respuesta recibida:', data);

    return {
      success: true,
      taskId: data.taskId,
      statusUrl: data.statusUrl,
      status: data.status,
    };

  } catch (error: any) {
    console.error('❌ [Worker] Error:', error.message);
    return {
      success: false,
      error: error.message || 'Error desconocido',
    };
  }
};

// ============================================
// CONSULTAR ESTADO
// ============================================

/**
 * Consulta el estado de una tarea de video
 */
export const checkVideoStatus = async (
  taskId: string,
  model: 'draft' | 'hd' = 'draft'
): Promise<VideoResponse> => {
  console.log('🔄 [Worker] Consultando estado via Worker:', taskId);

  try {
    const response = await fetch(`${WORKER_URL}/check-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskId, model }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`❌ [Worker] Error HTTP ${response.status}:`, errorData);
      throw new Error(`Worker error: ${response.status} - ${errorData.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('📊 [Worker] Estado:', data.status);

    if (data.status === 'COMPLETED') {
      console.log('✅ [Worker] Video completado:', data.videoUrl);
      return {
        success: true,
        status: 'COMPLETED',
        videoUrl: data.videoUrl,
        seed: data.seed,
      };
    }

    if (data.status === 'FAILED') {
      console.error('❌ [Worker] Video falló:', data.error);
      return {
        success: false,
        status: 'FAILED',
        error: data.error || 'Error desconocido',
      };
    }

    // IN_PROGRESS o IN_QUEUE
    return {
      success: true,
      status: data.status,
    };

  } catch (error: any) {
    console.error('❌ [Worker] Error:', error.message);
    return {
      success: false,
      error: error.message || 'Error desconocido',
    };
  }
};

// ============================================
// HEALTH CHECK
// ============================================

/**
 * Verifica que el Worker esté funcionando
 */
export const checkWorkerHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${WORKER_URL}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('❌ [Worker] Health check failed:', error);
    return false;
  }
};

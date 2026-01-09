/**
 * Servicio para generación de videos usando Fal.ai Pika v2 Turbo
 * 
 * Modelo TEXT-TO-VIDEO (T2V):
 * - fal-ai/pika/v2/turbo/text-to-video
 * 
 * Resoluciones:
 * - Draft: 720p (1280x720)
 * - HD: 1080p (1920x1080)
 * 
 * NOTA: T2V genera video directamente desde prompt, sin necesidad de imagen base
 */

export interface VideoGenerationOptions {
  prompt: string;
  quality: 'draft' | 'hd';
  aspectRatio?: '9:16' | '16:9' | '1:1';
  duration?: number; // 5 o 10 segundos (wan2.5-t2v-preview)
}

export interface VideoGenerationResult {
  videoUrl?: string;
  taskId?: string;
  statusUrl?: string;
  status: 'processing' | 'complete' | 'error' | 'failed' | 'expired';
  error?: string;
  requestId?: string;
  submitTime?: string;
  endTime?: string;
  originalPrompt?: string;
  actualPrompt?: string;
}

/**
 * Genera un video usando Fal.ai Pika v2 Turbo
 */
export const generateVideo = async (
  options: VideoGenerationOptions
): Promise<VideoGenerationResult> => {
  console.log('🎬 [Fal.ai Video] Iniciando generación de video TEXT-TO-VIDEO...');
  console.log('🎬 [Fal.ai Video] Prompt:', options.prompt.substring(0, 100));
  console.log('🎬 [Fal.ai Video] Quality:', options.quality);
  
  try {
    const response = await fetch('/.netlify/functions/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: options.prompt,
        quality: options.quality,
        aspectRatio: options.aspectRatio || '9:16',
        duration: options.duration || 5
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ [Fal.ai Video] Error en generación:', data);
      throw new Error(data.error || 'Error al generar video');
    }

    // Si es 202, la tarea está en proceso
    if (response.status === 202) {
      console.log('🔄 [Fal.ai Video] Video en proceso. Task ID:', data.taskId);
      console.log('📊 [Fal.ai Video] Status URL recibida:', data.statusUrl);
      return {
        taskId: data.taskId,
        statusUrl: data.statusUrl,
        status: 'processing',
        requestId: data.requestId
      };
    }

    // Si es 200, el video está completo (poco probable con Fal.ai)
    if (data.videoUrl) {
      console.log('✅ [Fal.ai Video] Video generado inmediatamente');
      return {
        videoUrl: data.videoUrl,
        status: 'complete'
      };
    }

    throw new Error('Respuesta inesperada del servidor');

  } catch (error: any) {
    console.error('❌ [Fal.ai Video] Error fatal:', error);
    return {
      status: 'error',
      error: error.message
    };
  }
};

/**
 * Verifica el estado de una tarea de video
 */
export const checkVideoTask = async (
  taskId: string,
  statusUrl?: string
): Promise<VideoGenerationResult> => {
  try {
    const response = await fetch('/.netlify/functions/check-video-operation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskId,
        statusUrl // Pasar la URL completa proporcionada por Fal.ai
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ [Fal.ai Video] Error al verificar tarea:', data);
      throw new Error(data.error || 'Error al verificar tarea');
    }

    return data;

  } catch (error: any) {
    console.error('❌ [Fal.ai Video] Error fatal:', error);
    return {
      status: 'error',
      error: error.message
    };
  }
};

/**
 * Genera un video y espera hasta que esté completo (con polling)
 */
export const generateVideoAndWait = async (
  options: VideoGenerationOptions,
  onProgress?: (progress: number, message?: string) => void
): Promise<string> => {
  console.log('🎬 [Fal.ai Video] Generando video y esperando...');
  
  // Iniciar generación
  const result = await generateVideo(options);
  
  if (result.status === 'error') {
    throw new Error(result.error || 'Error al generar video');
  }

  if (result.status === 'complete' && result.videoUrl) {
    return result.videoUrl;
  }

  if (!result.taskId) {
    throw new Error('No se recibió taskId');
  }

  // Guardar statusUrl para usarlo en el polling
  const statusUrl = result.statusUrl;
  console.log('📊 [Fal.ai Video] Status URL para polling:', statusUrl);
  
  if (!statusUrl) {
    console.warn('⚠️ [Fal.ai Video] statusUrl no está disponible, se usará fallback');
  }

  // Polling hasta que esté completo
  console.log('🔄 [Fal.ai Video] Iniciando polling...');
  
  // Fal.ai: videos típicamente toman 1-3 minutos
  // Polling cada 5 segundos durante máximo 10 minutos
  const maxAttempts = 120; // 10 minutos máximo (5 segundos * 120)
  const pollInterval = 5000; // 5 segundos
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));
    attempts++;

    const progress = Math.min((attempts / maxAttempts) * 100, 95); // Máximo 95% hasta que complete
    console.log(`🔄 [Fal.ai Video] Verificando estado (intento ${attempts}/${maxAttempts})... ${progress.toFixed(0)}%`);
    
    if (onProgress) {
      onProgress(progress, `Generando video... ${progress.toFixed(0)}%`);
    }
    
    const status = await checkVideoTask(result.taskId, statusUrl);

    if (status.status === 'error') {
      throw new Error(status.error || 'Error al generar video');
    }

    if (status.status === 'failed') {
      throw new Error(status.error || 'La generación del video falló');
    }

    if (status.status === 'expired') {
      throw new Error('La tarea expiró. Por favor, intenta nuevamente.');
    }

    if (status.status === 'complete' && status.videoUrl) {
      console.log('✅ [Fal.ai Video] Video completado!');
      console.log('🎬 [Fal.ai Video] Video URL:', status.videoUrl.substring(0, 100) + '...');
      
      if (onProgress) {
        onProgress(100, 'Video generado exitosamente');
      }
      
      return status.videoUrl;
    }

    // Si aún está procesando, continuar polling
    if (status.status === 'processing') {
      console.log('⏳ [Fal.ai Video] Video aún en proceso...');
    }
  }

  throw new Error('Timeout: El video tardó más de 10 minutos en generarse');
};

// Alias para compatibilidad con código existente
export const checkVideoOperation = checkVideoTask;

export default {
  generateVideo,
  checkVideoTask,
  checkVideoOperation,
  generateVideoAndWait
};

/**
 * Servicio para generación de videos usando Alibaba Cloud Model Studio (Wanx)
 * 
 * Modelos TEXT-TO-VIDEO (T2V):
 * - wan2.1-t2v-turbo (480P - ultra rápido, draft)
 * - wan2.5-t2v-preview (720P - alta calidad, HD)
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
  status: 'processing' | 'complete' | 'error' | 'failed' | 'expired';
  error?: string;
  requestId?: string;
  submitTime?: string;
  endTime?: string;
  originalPrompt?: string;
  actualPrompt?: string;
}

/**
 * Genera un video usando Alibaba Cloud Model Studio
 */
export const generateVideo = async (
  options: VideoGenerationOptions
): Promise<VideoGenerationResult> => {
  console.log('🎬 [AlibabaVideo] Iniciando generación de video TEXT-TO-VIDEO...');
  console.log('🎬 [AlibabaVideo] Prompt:', options.prompt.substring(0, 100));
  console.log('🎬 [AlibabaVideo] Quality:', options.quality);
  
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
      console.error('❌ [AlibabaVideo] Error en generación:', data);
      throw new Error(data.error || 'Error al generar video');
    }

    // Si es 202, la tarea está en proceso
    if (response.status === 202) {
      console.log('🔄 [AlibabaVideo] Video en proceso. Task ID:', data.taskId);
      return {
        taskId: data.taskId,
        status: 'processing',
        requestId: data.requestId
      };
    }

    // Si es 200, el video está completo (poco probable con Alibaba Cloud)
    if (data.videoUrl) {
      console.log('✅ [AlibabaVideo] Video generado inmediatamente');
      return {
        videoUrl: data.videoUrl,
        status: 'complete'
      };
    }

    throw new Error('Respuesta inesperada del servidor');

  } catch (error: any) {
    console.error('❌ [AlibabaVideo] Error fatal:', error);
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
  taskId: string
): Promise<VideoGenerationResult> => {
  try {
    const response = await fetch('/.netlify/functions/check-video-operation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskId
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ [AlibabaVideo] Error al verificar tarea:', data);
      throw new Error(data.error || 'Error al verificar tarea');
    }

    return data;

  } catch (error: any) {
    console.error('❌ [AlibabaVideo] Error fatal:', error);
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
  console.log('🎬 [AlibabaVideo] Generando video y esperando...');
  
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

  // Polling hasta que esté completo
  console.log('🔄 [AlibabaVideo] Iniciando polling...');
  
  // Alibaba Cloud: videos típicamente toman 1-5 minutos
  // Polling cada 5 segundos durante máximo 10 minutos
  const maxAttempts = 120; // 10 minutos máximo (5 segundos * 120)
  const pollInterval = 5000; // 5 segundos
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, pollInterval));
    attempts++;

    const progress = Math.min((attempts / maxAttempts) * 100, 95); // Máximo 95% hasta que complete
    console.log(`🔄 [AlibabaVideo] Verificando estado (intento ${attempts}/${maxAttempts})... ${progress.toFixed(0)}%`);
    
    if (onProgress) {
      onProgress(progress, `Generando video... ${progress.toFixed(0)}%`);
    }
    
    const status = await checkVideoTask(result.taskId);

    if (status.status === 'error') {
      throw new Error(status.error || 'Error al generar video');
    }

    if (status.status === 'failed') {
      throw new Error(status.error || 'La generación del video falló');
    }

    if (status.status === 'expired') {
      throw new Error('La tarea expiró (>24 horas). Por favor, intenta nuevamente.');
    }

    if (status.status === 'complete' && status.videoUrl) {
      console.log('✅ [AlibabaVideo] Video completado!');
      console.log('🎬 [AlibabaVideo] Video URL:', status.videoUrl.substring(0, 100) + '...');
      
      // SOLUCIÓN: Usar URL directa de Alibaba Cloud OSS
      // OSS tiene CORS habilitado por defecto para videos
      // No necesitamos proxy que causa errores 502
      
      if (onProgress) {
        onProgress(100, 'Video generado exitosamente');
      }
      
      return status.videoUrl;
    }

    // Si aún está procesando, continuar polling
    if (status.status === 'processing') {
      console.log('⏳ [AlibabaVideo] Video aún en proceso...');
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

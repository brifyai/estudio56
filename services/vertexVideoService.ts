/**
 * Servicio para generación de videos usando Vertex AI (Veo)
 * 
 * Modelos disponibles:
 * - veo-2.0-flash-generate-preview (rápido, draft)
 * - veo-2.0-generate-preview (alta calidad, HD)
 */

export interface VideoGenerationOptions {
  prompt: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  model?: 'veo-3.1-fast-generate-preview' | 'veo-2.0-generate-preview' | 'veo-2.0-flash-generate-preview';
  duration?: '6s' | '8s';
}

export interface VideoGenerationResult {
  videoUrl?: string;
  operationName?: string;
  status: 'processing' | 'complete' | 'error';
  error?: string;
}

/**
 * Genera un video usando Vertex AI
 */
export const generateVideo = async (
  options: VideoGenerationOptions
): Promise<VideoGenerationResult> => {
  console.log('🎬 [VertexVideo] Iniciando generación de video...');
  console.log('🎬 [VertexVideo] Prompt:', options.prompt.substring(0, 100));
  console.log('🎬 [VertexVideo] Modelo:', options.model || 'veo-3.1-fast-generate-preview');
  
  try {
    const response = await fetch('/.netlify/functions/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: options.prompt,
        aspectRatio: options.aspectRatio,
        model: options.model || 'veo-3.1-fast-generate-preview',
        duration: options.duration || '6s'
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ [VertexVideo] Error en generación:', data);
      throw new Error(data.error || 'Error al generar video');
    }

    // Si es 202, la operación está en proceso
    if (response.status === 202) {
      console.log('🔄 [VertexVideo] Video en proceso:', data.operationName);
      return {
        operationName: data.operationName,
        status: 'processing'
      };
    }

    // Si es 200, el video está completo (poco probable)
    if (data.videoUrl) {
      console.log('✅ [VertexVideo] Video generado inmediatamente');
      return {
        videoUrl: data.videoUrl,
        status: 'complete'
      };
    }

    throw new Error('Respuesta inesperada del servidor');

  } catch (error: any) {
    console.error('❌ [VertexVideo] Error fatal:', error);
    return {
      status: 'error',
      error: error.message
    };
  }
};

/**
 * Verifica el estado de una operación de video
 */
export const checkVideoOperation = async (
  operationName: string
): Promise<VideoGenerationResult> => {
  try {
    const response = await fetch('/.netlify/functions/check-video-operation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operationName
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ [VertexVideo] Error al verificar operación:', data);
      throw new Error(data.error || 'Error al verificar operación');
    }

    return data;

  } catch (error: any) {
    console.error('❌ [VertexVideo] Error fatal:', error);
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
  onProgress?: (progress: number) => void
): Promise<string> => {
  console.log('🎬 [VertexVideo] Generando video y esperando...');
  
  // Iniciar generación
  const result = await generateVideo(options);
  
  if (result.status === 'error') {
    throw new Error(result.error || 'Error al generar video');
  }

  if (result.status === 'complete' && result.videoUrl) {
    return result.videoUrl;
  }

  if (!result.operationName) {
    throw new Error('No se recibió operationName');
  }

  // Polling hasta que esté completo
  console.log('🔄 [VertexVideo] Iniciando polling...');
  const maxAttempts = 60; // 5 minutos máximo (5 segundos * 60)
  let attempts = 0;

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar 5 segundos
    attempts++;

    console.log(`🔄 [VertexVideo] Verificando estado (intento ${attempts}/${maxAttempts})...`);
    
    const status = await checkVideoOperation(result.operationName);

    if (status.status === 'error') {
      throw new Error(status.error || 'Error al generar video');
    }

    if (status.status === 'complete' && status.videoUrl) {
      console.log('✅ [VertexVideo] Video completado!');
      return status.videoUrl;
    }

    // Reportar progreso si hay callback
    if (onProgress && 'progress' in status) {
      onProgress((status as any).progress || (attempts / maxAttempts) * 100);
    }
  }

  throw new Error('Timeout: El video tardó más de 5 minutos en generarse');
};

export default {
  generateVideo,
  checkVideoOperation,
  generateVideoAndWait
};

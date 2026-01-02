/**
 * Servicio de Generación de Video con Chutes API
 * Modelos: Wan-2.2-I2V-14B-Fast (image-to-video) y text-to-video
 * https://chutes-wan-2-2-i2v-14b-fast.chutes.ai/
 */

import { CHUTES_VIDEO_CONFIG } from '../constants';

// Obtener API key de Chutes desde variables de entorno
const getChutesApiKey = (): string => {
  return import.meta.env.VITE_CHUTES_API_KEY || '';
};

// Obtener URL base del endpoint de Chutes
const getChutesBaseUrl = (): string => {
  return import.meta.env.VITE_CHUTES_API_URL || 'https://chutes-wan-2-2-i2v-14b-fast.chutes.ai';
};

// Obtener URL del endpoint de Chutes (image-to-video)
// Prueba múltiples endpoints posibles
const getChutesApiUrl = (): string => {
  const baseUrl = getChutesBaseUrl();
  const envEndpoint = import.meta.env.VITE_CHUTES_I2V_ENDPOINT;
  
  if (envEndpoint) {
    return envEndpoint.startsWith('http') ? envEndpoint : `${baseUrl}${envEndpoint}`;
  }
  
  // Probar endpoints comunes de Chutes
  return `${baseUrl}/generate`;
};

// Obtener URL para text-to-video
const getChutesText2VideoUrl = (): string => {
  const baseUrl = getChutesBaseUrl();
  const envEndpoint = import.meta.env.VITE_CHUTES_T2V_ENDPOINT;
  if (envEndpoint) return envEndpoint.startsWith('http') ? envEndpoint : `${baseUrl}${envEndpoint}`;
  return `${baseUrl}/generate`;
};

// Verificar disponibilidad de la API
export async function checkChutesApiHealth(): Promise<{available: boolean; endpoints: string[]}> {
  const baseUrl = getChutesBaseUrl();
  const endpoints = ['/image2video', '/text2video', '/health', '/'];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, { method: 'HEAD' });
      if (response.ok) {
        return { available: true, endpoints: [endpoint] };
      }
    } catch {
      // Continuar con el siguiente endpoint
    }
  }
  
  return { available: false, endpoints };
}

/**
 * Convierte una URL de imagen a base64
 */
export async function urlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Interface para los parámetros de generación de video
export interface ChutesVideoParams {
  prompt: string;
  imageBase64: string;
  steps?: number;
  fps?: number;
  seed?: number;
  guidanceScale?: number;
  sampleShift?: number;
  singleFrame?: boolean;
}

// Interface para la respuesta
export interface ChutesVideoResponse {
  success: boolean;
  videoUrl?: string;
  videoBlob?: Blob;
  error?: string;
  duration?: number;
}

// Interface para parámetros de text-to-video
export interface ChutesText2VideoParams {
  prompt: string;
  resolution?: string;
  steps?: number;
  frames?: number;
  fps?: number;
  seed?: number;
}

/**
 * Genera un video a partir de una imagen usando Chutes API (Wan-2.2-I2V-14B-Fast)
 * Duración: 6 segundos (96 frames × 16 fps)
 */
export async function generateVideoFromImage(
  imageUrl: string,
  prompt: string,
  options: {
    steps?: number;
    fps?: number;
    frames?: number;
    seed?: number;
    guidanceScale?: number;
    onProgress?: (status: string) => void;
  } = {}
): Promise<ChutesVideoResponse> {
  const {
    steps = CHUTES_VIDEO_CONFIG.defaultParams.steps,
    fps = CHUTES_VIDEO_CONFIG.defaultParams.fps,
    frames = CHUTES_VIDEO_CONFIG.defaultParams.frames,
    seed = Math.floor(Math.random() * 1000000),
    guidanceScale = CHUTES_VIDEO_CONFIG.defaultParams.guidanceScale,
    onProgress
  } = options;

  try {
    onProgress?.('Descargando imagen...');
    
    // Convertir imagen a base64
    const imageBase64 = await urlToBase64(imageUrl);
    
    onProgress?.('Generando video con Chutes API (Wan-2.2-I2V-14B-Fast)...');
    
    // Construir payload según la documentación oficial de Chutes
    // Endpoint: /generate con parámetros específicos
    const payload = {
      prompt: prompt,
      image: imageBase64,  // 'image' no 'image_b64'
      steps: steps,
      fps: fps,
      frames: frames,
      seed: seed,
      guidance_scale: guidanceScale,
      fast: true,  // Parámetro requerido
      resolution: fps === 24 ? '720p' : '480p'  // Resolución según fps
    };

    // Obtener configuración de API
    const apiUrl = getChutesApiUrl();
    const apiKey = getChutesApiKey();
    
    // Construir headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Agregar Authorization header si hay API key
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Realizar la petición a Chutes API
    console.log(`[Chutes API] Endpoint: ${apiUrl}`);
    console.log(`[Chutes API] Payload:`, { ...payload, image_b64: '[IMAGEN_BASE64]' });
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Chutes API] Error ${response.status}:`, errorText);
      
      // Error específico para "No matching cord found"
      if (errorText.includes('No matching cord') || response.status === 404) {
        throw new Error(`Chutes API Error: 404 - "No matching cord found". Verifica que el chute esté configurado correctamente en https://chutes.ai`);
      }
      
      throw new Error(`Chutes API Error: ${response.status} - ${errorText}`);
    }

    onProgress?.('Video generado, descargando...');
    
    // Obtener el video como blob
    const videoBlob = await response.blob();
    
    if (videoBlob.size === 0) {
      throw new Error('El video generado está vacío');
    }

    // Crear URL del blob
    const videoUrl = URL.createObjectURL(videoBlob);

    return {
      success: true,
      videoUrl: videoUrl,
      videoBlob: videoBlob,
      duration: frames / fps // 6 segundos (96 frames / 16 fps)
    };

  } catch (error) {
    console.error('Error generando video con Chutes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al generar video'
    };
  }
}

/**
 * Genera video con parámetros optimizados para diferentes estilos
 */
export async function generateStyledVideo(
  imageUrl: string,
  stylePrompt: string,
  style: 'cinematic' | 'dramatic' | 'subtle' | 'energetic' = 'cinematic',
  onProgress?: (status: string) => void
): Promise<ChutesVideoResponse> {
  // Ajustar parámetros según el estilo
  const styleConfigs = {
    cinematic: { steps: 25, fps: 24, guidanceScale: 5.0 },
    dramatic: { steps: 30, fps: 20, guidanceScale: 6.0 },
    subtle: { steps: 20, fps: 16, guidanceScale: 4.0 },
    energetic: { steps: 30, fps: 30, guidanceScale: 5.5 }
  };

  const config = styleConfigs[style];
  
  return generateVideoFromImage(imageUrl, stylePrompt, {
    ...config,
    onProgress
  });
}

/**
 * Descarga el video generado
 */
export function downloadVideo(videoUrl: string, filename: string = 'video-generado.mp4'): void {
  const link = document.createElement('a');
  link.href = videoUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Guarda el video en el almacenamiento local
 */
export async function saveVideoToStorage(videoBlob: Blob, flyerId: string): Promise<string> {
  // Crear nombre de archivo único
  const timestamp = Date.now();
  const filename = `videos/${flyerId}/${timestamp}.mp4`;
  
  // Convertir blob a array buffer para subir a Supabase Storage
  const arrayBuffer = await videoBlob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // Aquí se integraría con el servicio de Supabase para subir el archivo
  // Por ahora retornamos una URL local temporal
  const blobUrl = URL.createObjectURL(videoBlob);
  
  return blobUrl;
}

/**
 * Genera un video directamente desde un texto (text-to-video)
 * Usa el endpoint /text2video de Chutes API
 * Duración: 6 segundos (96 frames × 16 fps)
 */
export async function generateVideoFromText(
  prompt: string,
  options: {
    resolution?: string;
    steps?: number;
    frames?: number;
    fps?: number;
    seed?: number;
    onProgress?: (status: string) => void;
  } = {}
): Promise<ChutesVideoResponse> {
  const {
    resolution = '1280*720',
    steps = CHUTES_VIDEO_CONFIG.defaultParams.steps,
    frames = CHUTES_VIDEO_CONFIG.defaultParams.frames,
    fps = CHUTES_VIDEO_CONFIG.defaultParams.fps,
    seed = Math.floor(Math.random() * 1000000),
    onProgress
  } = options;

  try {
    onProgress?.('Generando video desde texto con Chutes API...');

    // Construir payload para text2video
    const payload = {
      prompt: prompt,
      resolution: resolution,
      steps: steps,
      frames: frames,
      fps: fps,
      single_frame: false,
      seed: seed
    };

    // Obtener configuración de API
    const apiUrl = getChutesText2VideoUrl();
    const apiKey = getChutesApiKey();

    // Construir headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Realizar la petición a Chutes API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Chutes API Error: ${response.status} - ${errorText}`);
    }

    onProgress?.('Video generado, descargando...');

    // Obtener el video como blob
    const videoBlob = await response.blob();

    if (videoBlob.size === 0) {
      throw new Error('El video generado está vacío');
    }

    // Crear URL del blob
    const videoUrl = URL.createObjectURL(videoBlob);

    return {
      success: true,
      videoUrl: videoUrl,
      videoBlob: videoBlob,
      duration: frames / fps
    };

  } catch (error) {
    console.error('Error generando video desde texto con Chutes:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al generar video'
    };
  }
}

export default {
  generateVideoFromImage,
  generateStyledVideo,
  generateVideoFromText,
  downloadVideo,
  saveVideoToStorage
};
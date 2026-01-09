import { Handler } from '@netlify/functions';

// ============================================
// FAL.AI - VIDEO GENERATION
// BORRADOR: fal-ai/ltx-2-19b/text-to-video/lora (480p rápido)
// HD: fal-ai/seedvr/upscale/video (upscale a 1080p)
// ============================================

const FAL_API_KEY = process.env.FAL_AI_API_KEY;

// Modelos
const DRAFT_MODEL = 'fal-ai/ltx-2-19b/text-to-video/lora';
const UPSCALE_MODEL = 'fal-ai/seedvr/upscale/video';

if (!FAL_API_KEY) {
  throw new Error('FAL_AI_API_KEY no está configurada en las variables de entorno');
}

interface VideoGenerationRequest {
  prompt: string;
  quality: 'draft' | 'hd';
  aspectRatio?: string;
  duration?: number;
  videoUrl?: string; // Para upscale HD
}

export const handler: Handler = async (event) => {
  console.log('🎬 [Fal.ai Video] ===========================================');
  console.log('🎬 [Fal.ai Video] FUNCIÓN DE VIDEO INICIADA');
  console.log('🎬 [Fal.ai Video] HTTP Method:', event.httpMethod);
  console.log('🎬 [Fal.ai Video] Body length:', event.body?.length);
  console.log('🎬 [Fal.ai Video] ===========================================');
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body: VideoGenerationRequest = JSON.parse(event.body || '{}');
    console.log('🎯 [Fal.ai Video] Quality:', body.quality);
    
    // FLUJO 1: BORRADOR (480p rápido)
    if (body.quality === 'draft') {
      return await generateDraftVideo(body);
    }
    
    // FLUJO 2: HD (upscale a 1080p)
    if (body.quality === 'hd') {
      return await upscaleVideoToHD(body);
    }
    
    throw new Error('Quality debe ser "draft" o "hd"');

  } catch (error: any) {
    console.error('❌ [Fal.ai Video] Error fatal:', error.message);
    console.error('❌ [Fal.ai Video] Stack:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Error: ${error.message}`,
        type: error.name || 'Unknown'
      }),
    };
  }
};

// ============================================
// FLUJO 1: GENERAR BORRADOR (480p)
// ============================================
async function generateDraftVideo(body: VideoGenerationRequest) {
  console.log('📝 [Draft] Generando borrador 480p...');
  console.log('📝 [Draft] Prompt:', body.prompt?.substring(0, 100));
  
  if (!body.prompt) {
    throw new Error("Falta parámetro requerido: prompt");
  }

  // Limpiar prompt
  const maxPromptLength = 2000;
  const cleanPrompt = body.prompt.slice(0, maxPromptLength).trim();
  
  // Convertir aspect ratio a dimensiones 480p
  const aspectRatioMap: Record<string, { width: number; height: number }> = {
    '9:16': { width: 480, height: 854 },  // 480p vertical
    '16:9': { width: 854, height: 480 },  // 480p horizontal
    '1:1': { width: 480, height: 480 },   // 480p cuadrado
  };
  
  const aspectRatio = body.aspectRatio || '9:16';
  const dimensions = aspectRatioMap[aspectRatio] || aspectRatioMap['9:16'];
  
  console.log('📐 [Draft] Dimensiones:', dimensions);
  console.log('🎯 [Draft] Modelo:', DRAFT_MODEL);

  // Request body para LTX-2-19B
  const requestBody = {
    prompt: cleanPrompt,
    video_size: {
      width: dimensions.width,
      height: dimensions.height
    },
    num_frames: 121,  // 5 segundos @ 25fps (121 frames)
    video_quality: 'low',  // Calidad baja para velocidad
    acceleration: 'full',  // Máxima aceleración
    num_inference_steps: 30,  // Menos pasos = más rápido
    use_multiscale: false,  // Desactivar para velocidad
    guidance_scale: 3,
    fps: 25,
    generate_audio: false,  // Sin audio para velocidad
    enable_safety_checker: true,
    video_output_type: 'X264 (.mp4)',
    video_write_mode: 'fast',  // Escritura rápida
    loras: []
  };

  console.log('📤 [Draft] Request body:', JSON.stringify(requestBody, null, 2));
  
  const url = `https://queue.fal.run/${DRAFT_MODEL}`;
  console.log('🌐 [Draft] URL:', url);
  console.log('⏳ [Draft] Enviando petición...');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);
  
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
  } catch (fetchError: any) {
    clearTimeout(timeoutId);
    if (fetchError.name === 'AbortError') {
      throw new Error("Timeout: Fal.ai tardó más de 120 segundos");
    }
    throw fetchError;
  }

  console.log('✅ [Draft] Respuesta recibida. Status:', response.status);
  
  const responseText = await response.text();
  console.log('📄 [Draft] Respuesta (primeros 500 chars):', responseText.substring(0, 500));
  
  let data: any;
  try {
    data = JSON.parse(responseText);
  } catch (parseError) {
    throw new Error(`Error parseando respuesta: ${responseText.substring(0, 200)}`);
  }

  if (!response.ok) {
    console.error('❌ [Draft] Error HTTP:', response.status, data);
    const errorMessage = data.message || data.error || JSON.stringify(data);
    
    if (response.status === 401) throw new Error('API Key de Fal.ai inválida');
    if (response.status === 429) throw new Error('Límite de cuota excedido');
    if (errorMessage.includes('inappropriate')) {
      throw new Error('Contenido rechazado por filtros de seguridad');
    }
    
    return { 
      statusCode: response.status, 
      body: JSON.stringify({ error: errorMessage, details: data })
    };
  }

  if (data.request_id) {
    console.log('🔄 [Draft] Tarea iniciada:', data.request_id);
    return {
      statusCode: 202,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: data.request_id,
        statusUrl: data.status_url,
        status: 'IN_QUEUE',
        quality: 'draft'
      }),
    };
  }

  throw new Error("No se encontró request_id en respuesta");
}

// ============================================
// FLUJO 2: UPSCALE A HD (1080p)
// ============================================
async function upscaleVideoToHD(body: VideoGenerationRequest) {
  console.log('🎨 [HD] Upscaling video a 1080p...');
  console.log('📹 [HD] Video URL:', body.videoUrl?.substring(0, 100));
  
  if (!body.videoUrl) {
    throw new Error("Falta parámetro requerido: videoUrl (URL del video borrador)");
  }

  console.log('🎯 [HD] Modelo:', UPSCALE_MODEL);

  // Request body para SeedVR Upscaler
  const requestBody = {
    video_url: body.videoUrl,
    upscale_mode: 'target',  // Usar resolución objetivo
    target_resolution: '1080p',  // Objetivo: 1080p
    noise_scale: 0.1,  // Bajo = más conservador
    output_format: 'X264 (.mp4)',
    output_quality: 'high',
    output_write_mode: 'balanced'
  };

  console.log('📤 [HD] Request body:', JSON.stringify(requestBody, null, 2));
  
  const url = `https://queue.fal.run/${UPSCALE_MODEL}`;
  console.log('🌐 [HD] URL:', url);
  console.log('⏳ [HD] Enviando petición...');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minutos para upscale
  
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
  } catch (fetchError: any) {
    clearTimeout(timeoutId);
    if (fetchError.name === 'AbortError') {
      throw new Error("Timeout: Upscale tardó más de 3 minutos");
    }
    throw fetchError;
  }

  console.log('✅ [HD] Respuesta recibida. Status:', response.status);
  
  const responseText = await response.text();
  console.log('📄 [HD] Respuesta (primeros 500 chars):', responseText.substring(0, 500));
  
  let data: any;
  try {
    data = JSON.parse(responseText);
  } catch (parseError) {
    throw new Error(`Error parseando respuesta: ${responseText.substring(0, 200)}`);
  }

  if (!response.ok) {
    console.error('❌ [HD] Error HTTP:', response.status, data);
    const errorMessage = data.message || data.error || JSON.stringify(data);
    
    if (response.status === 401) throw new Error('API Key de Fal.ai inválida');
    if (response.status === 429) throw new Error('Límite de cuota excedido');
    
    return { 
      statusCode: response.status, 
      body: JSON.stringify({ error: errorMessage, details: data })
    };
  }

  if (data.request_id) {
    console.log('🔄 [HD] Tarea de upscale iniciada:', data.request_id);
    return {
      statusCode: 202,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: data.request_id,
        statusUrl: data.status_url,
        status: 'IN_QUEUE',
        quality: 'hd'
      }),
    };
  }

  throw new Error("No se encontró request_id en respuesta");
}

import { Handler } from '@netlify/functions';

// ============================================
// FAL.AI - PIKA V2 TURBO TEXT-TO-VIDEO
// TEXT-TO-VIDEO (T2V) - Genera video directamente desde prompt
// ============================================

// API Key de Fal.ai (desde variable de entorno)
const FAL_API_KEY = process.env.FAL_API_KEY;
const FAL_MODEL = 'fal-ai/pika/v2/turbo/text-to-video';

if (!FAL_API_KEY) {
  throw new Error('FAL_API_KEY no está configurada en las variables de entorno');
}

interface VideoGenerationRequest {
  prompt: string;
  quality: 'draft' | 'hd';
  aspectRatio?: string;
  duration?: number;
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
    console.log('📝 [Fal.ai Video] Prompt recibido (primeros 100 chars):', (body.prompt || 'SIN PROMPT').substring(0, 100));
    console.log('🎯 [Fal.ai Video] Quality:', body.quality);
    console.log('📐 [Fal.ai Video] AspectRatio:', body.aspectRatio);
    
    if (!body.prompt) {
      throw new Error("Falta parámetro requerido: prompt");
    }

    // Obtener resolución según calidad (string enum)
    const resolution = body.quality === 'hd' ? '1080p' : '720p';
    const duration = body.duration || 5; // 5 segundos por defecto
    
    console.log('🎯 [Fal.ai Video] Modelo:', FAL_MODEL);
    console.log('📐 [Fal.ai Video] Resolución:', resolution);
    console.log('⏱️ [Fal.ai Video] Duración:', duration, 'segundos');

    // Limpiar y sanitizar prompt
    const maxPromptLength = 2000;
    let cleanPrompt = body.prompt.slice(0, maxPromptLength).trim();
    
    console.log('📝 [Fal.ai Video] Prompt length:', cleanPrompt.length);
    console.log('📝 [Fal.ai Video] Prompt:', cleanPrompt.substring(0, 200));

    // URL para generación de video con Fal.ai
    const url = `https://queue.fal.run/${FAL_MODEL}`;
    console.log('🌐 [Fal.ai Video] URL:', url);

    // Estructura del request para Pika v2 Turbo
    // Documentación: https://fal.ai/models/fal-ai/pika/v2/turbo/text-to-video
    const requestBody = {
      prompt: cleanPrompt,
      aspect_ratio: body.aspectRatio || '9:16',
      resolution: resolution,  // "720p" o "1080p"
      duration: duration
    };

    console.log('📤 [Fal.ai Video] Request body:', JSON.stringify(requestBody, null, 2));
    console.log('⏳ [Fal.ai Video] Enviando petición a Fal.ai...');
    
    // Timeout de 120 segundos para la creación de la tarea
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
        console.error('❌ [Fal.ai Video] Timeout: Fal.ai tardó más de 120 segundos');
        throw new Error("Timeout: Fal.ai tardó más de 120 segundos");
      }
      throw fetchError;
    }

    console.log('✅ [Fal.ai Video] Respuesta de Fal.ai recibida. Status:', response.status);
    
    // Leer el texto de la respuesta primero
    const responseText = await response.text();
    console.log('📄 [Fal.ai Video] Respuesta raw (primeros 500 chars):', responseText.substring(0, 500));
    
    let data: any;
    try {
      data = JSON.parse(responseText);
      console.log('📊 [Fal.ai Video] Respuesta keys:', Object.keys(data));
    } catch (parseError) {
      console.error('❌ [Fal.ai Video] Error parseando JSON:', parseError);
      console.error('❌ [Fal.ai Video] Respuesta completa:', responseText);
      throw new Error(`Error parseando respuesta de Fal.ai: ${responseText.substring(0, 200)}`);
    }

    if (!response.ok) {
      console.error('❌ [Fal.ai Video] Error HTTP de Fal.ai:', response.status);
      console.error('❌ [Fal.ai Video] Error details:', JSON.stringify(data, null, 2));
      
      const errorMessage = data.message || data.error || JSON.stringify(data);
      
      // Manejar errores específicos de Fal.ai
      if (response.status === 401) {
        throw new Error('API Key de Fal.ai inválida');
      }
      if (response.status === 429) {
        throw new Error('Límite de cuota excedido en Fal.ai');
      }
      if (errorMessage.includes('inappropriate') || errorMessage.includes('content policy')) {
        throw new Error('El contenido del prompt fue rechazado por filtros de seguridad. Intenta con una descripción más simple y profesional.');
      }
      
      return { 
        statusCode: response.status, 
        body: JSON.stringify({
          error: errorMessage,
          details: data
        })
      };
    }

    // Fal.ai devuelve un request_id para polling
    if (data.request_id) {
      console.log('🔄 [Fal.ai Video] Tarea de video iniciada:', data.request_id);
      console.log('📊 [Fal.ai Video] Status URL:', data.status_url);
      
      // Retornar el request_id para polling
      return {
        statusCode: 202,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: data.request_id,
          statusUrl: data.status_url,
          status: 'IN_QUEUE'
        }),
      };
    }

    console.error('❌ [Fal.ai Video] Estructura de respuesta inesperada:', JSON.stringify(data, null, 2));
    throw new Error("Respuesta inesperada de Fal.ai - no se encontró request_id");

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

import { Handler } from '@netlify/functions';

// ============================================
// ALIBABA CLOUD MODEL STUDIO - WANX VIDEO API
// TEXT-TO-VIDEO (T2V) - Genera video directamente desde prompt
// ============================================

// API Key de Alibaba Cloud Model Studio (desde variable de entorno)
const ALIBABA_API_KEY = process.env.ALIBABA_API_KEY;
const ALIBABA_BASE_URL = 'https://dashscope-intl.aliyuncs.com/api/v1';

if (!ALIBABA_API_KEY) {
  throw new Error('ALIBABA_API_KEY no está configurada en las variables de entorno');
}

// Modelos TEXT-TO-VIDEO de Alibaba Cloud Wanx
const VIDEO_MODELS = {
  draft: 'wan2.5-t2v-preview',  // 480P - Rápido y económico para borradores
  hd: 'wan2.5-t2v-preview'      // 720P - Alta calidad para HD (mismo modelo, diferente resolución)
};

interface VideoGenerationRequest {
  prompt: string;
  quality: 'draft' | 'hd';
  aspectRatio?: string;
  duration?: number;
}

export const handler: Handler = async (event) => {
  console.log('🎬 [Alibaba Video] ===========================================');
  console.log('🎬 [Alibaba Video] FUNCIÓN DE VIDEO INICIADA');
  console.log('🎬 [Alibaba Video] HTTP Method:', event.httpMethod);
  console.log('🎬 [Alibaba Video] Body length:', event.body?.length);
  console.log('🎬 [Alibaba Video] ===========================================');
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body: VideoGenerationRequest = JSON.parse(event.body || '{}');
    console.log('📝 [Alibaba Video] Prompt recibido (primeros 100 chars):', (body.prompt || 'SIN PROMPT').substring(0, 100));
    console.log('🎯 [Alibaba Video] Quality:', body.quality);
    console.log('📐 [Alibaba Video] AspectRatio:', body.aspectRatio);
    
    if (!body.prompt) {
      throw new Error("Falta parámetro requerido: prompt");
    }

    // Seleccionar modelo y resolución según calidad
    const model = VIDEO_MODELS[body.quality]; // Mismo modelo para ambos
    const size = body.quality === 'hd' ? '1280*720' : '832*480'; // 720P para HD, 480P para draft
    const duration = body.duration || 5; // 5 segundos por defecto
    
    console.log('🎯 [Alibaba Video] Modelo seleccionado:', model);
    console.log('📐 [Alibaba Video] Resolución (size):', size);
    console.log('⏱️ [Alibaba Video] Duración:', duration, 'segundos');

    // Limpiar prompt (máximo 1500 caracteres para wan2.5-t2v-preview)
    const maxPromptLength = 1500;
    const cleanPrompt = body.prompt.slice(0, maxPromptLength);
    console.log('📝 [Alibaba Video] Prompt limpio length:', cleanPrompt.length);

    // URL para generación de video con Alibaba Cloud
    const url = `${ALIBABA_BASE_URL}/services/aigc/video-generation/video-synthesis`;
    console.log('🌐 [Alibaba Video] URL de Alibaba Cloud:', url);

    // Estructura del request para TEXT-TO-VIDEO (T2V)
    // Documentación: https://www.alibabacloud.com/help/en/model-studio/text-to-video-api-reference/
    const requestBody = {
      model: model,
      input: {
        prompt: cleanPrompt
        // ← NO incluir img_url (T2V no requiere imagen)
      },
      parameters: {
        size: size,  // Formato: "ancho*alto" (ej: "832*480", "1280*720")
        prompt_extend: true,  // Habilitar reescritura de prompt con LLM
        duration: duration,
        watermark: false,
        seed: Math.floor(Math.random() * 2147483647)
      }
    };

    console.log('📤 [Alibaba Video] Request body:', JSON.stringify(requestBody, null, 2));
    console.log('⏳ [Alibaba Video] Enviando petición a Alibaba Cloud...');
    
    // Timeout de 120 segundos para la creación de la tarea
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);
    
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ALIBABA_API_KEY}`,
          'Content-Type': 'application/json',
          'X-DashScope-Async': 'enable'  // Habilitar procesamiento asíncrono
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('❌ [Alibaba Video] Timeout: Alibaba Cloud tardó más de 120 segundos');
        throw new Error("Timeout: Alibaba Cloud tardó más de 120 segundos");
      }
      throw fetchError;
    }

    console.log('✅ [Alibaba Video] Respuesta de Alibaba Cloud recibida. Status:', response.status);
    
    // Leer el texto de la respuesta primero
    const responseText = await response.text();
    console.log('📄 [Alibaba Video] Respuesta raw (primeros 500 chars):', responseText.substring(0, 500));
    
    let data: any;
    try {
      data = JSON.parse(responseText);
      console.log('📊 [Alibaba Video] Respuesta keys:', Object.keys(data));
    } catch (parseError) {
      console.error('❌ [Alibaba Video] Error parseando JSON:', parseError);
      console.error('❌ [Alibaba Video] Respuesta completa:', responseText);
      throw new Error(`Error parseando respuesta de Alibaba Cloud: ${responseText.substring(0, 200)}`);
    }

    if (!response.ok) {
      console.error('❌ [Alibaba Video] Error HTTP de Alibaba Cloud:', response.status);
      console.error('❌ [Alibaba Video] Error details:', JSON.stringify(data, null, 2));
      
      const errorMessage = data.message || data.code || JSON.stringify(data);
      
      // Manejar errores específicos de Alibaba Cloud
      if (data.code === 'InvalidApiKey') {
        throw new Error('API Key de Alibaba Cloud inválida');
      }
      if (data.code === 'Throttling.RateQuota') {
        throw new Error('Límite de cuota excedido en Alibaba Cloud');
      }
      
      return { 
        statusCode: response.status, 
        body: JSON.stringify({
          error: errorMessage,
          code: data.code
        })
      };
    }

    // Alibaba Cloud devuelve un task_id para polling
    if (data.output && data.output.task_id) {
      console.log('🔄 [Alibaba Video] Tarea de video iniciada:', data.output.task_id);
      console.log('📊 [Alibaba Video] Task status:', data.output.task_status);
      
      // Retornar el task_id para polling
      return {
        statusCode: 202,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId: data.output.task_id,
          status: data.output.task_status,
          requestId: data.request_id
        }),
      };
    }

    console.error('❌ [Alibaba Video] Estructura de respuesta inesperada:', JSON.stringify(data, null, 2));
    throw new Error("Respuesta inesperada de Alibaba Cloud - no se encontró task_id");

  } catch (error: any) {
    console.error('❌ [Alibaba Video] Error fatal:', error.message);
    console.error('❌ [Alibaba Video] Stack:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Error: ${error.message}`,
        type: error.name || 'Unknown'
      }),
    };
  }
};

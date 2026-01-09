import { Handler } from '@netlify/functions';

// ============================================
// FAL.AI - TASK POLLING
// ============================================

// API Key de Fal.ai (desde variable de entorno)
const FAL_API_KEY = process.env.FAL_API_KEY;

if (!FAL_API_KEY) {
  throw new Error('FAL_API_KEY no está configurada en las variables de entorno');
}

export const handler: Handler = async (event) => {
  console.log('🔍 [Fal.ai Poll] ===========================================');
  console.log('🔍 [Fal.ai Poll] POLLING DE TAREA INICIADO');
  console.log('🔍 [Fal.ai Poll] HTTP Method:', event.httpMethod);
  console.log('🔍 [Fal.ai Poll] ===========================================');
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const taskId = body.taskId;
    
    console.log('🆔 [Fal.ai Poll] Request ID:', taskId);
    
    if (!taskId) {
      throw new Error("Falta el parámetro taskId");
    }

    // URL para consultar el estado de la tarea en Fal.ai
    const url = `https://queue.fal.run/fal-ai/pika/v2/turbo/text-to-video/requests/${taskId}/status`;
    console.log('🌐 [Fal.ai Poll] URL de consulta:', url);

    console.log('⏳ [Fal.ai Poll] Consultando estado de la tarea...');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ [Fal.ai Poll] Respuesta recibida. Status:', response.status);
    
    const responseText = await response.text();
    console.log('📄 [Fal.ai Poll] Respuesta raw (primeros 500 chars):', responseText.substring(0, 500));
    
    let data: any;
    try {
      data = JSON.parse(responseText);
      console.log('📊 [Fal.ai Poll] Respuesta keys:', Object.keys(data));
    } catch (parseError) {
      console.error('❌ [Fal.ai Poll] Error parseando JSON:', parseError);
      throw new Error(`Error parseando respuesta: ${responseText.substring(0, 200)}`);
    }

    if (!response.ok) {
      console.error('❌ [Fal.ai Poll] Error HTTP:', response.status);
      console.error('❌ [Fal.ai Poll] Error details:', JSON.stringify(data, null, 2));
      
      return { 
        statusCode: response.status, 
        body: JSON.stringify({
          error: data.message || data.error || 'Error desconocido'
        })
      };
    }

    // Estructura de respuesta de Fal.ai
    const status = data.status;
    console.log('📊 [Fal.ai Poll] Status:', status);
    
    // Estados posibles: IN_QUEUE, IN_PROGRESS, COMPLETED, FAILED
    if (status === 'COMPLETED') {
      console.log('✅ [Fal.ai Poll] Video generado exitosamente');
      
      // Obtener la URL del video del resultado
      const videoUrl = data.video?.url;
      
      if (!videoUrl) {
        console.error('❌ [Fal.ai Poll] No se encontró URL del video en la respuesta');
        throw new Error('No se encontró URL del video en la respuesta');
      }
      
      console.log('🎬 [Fal.ai Poll] Video URL:', videoUrl.substring(0, 100) + '...');
      
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: 'complete',
          videoUrl: videoUrl,
          taskId: taskId,
          duration: data.video?.duration,
          width: data.video?.width,
          height: data.video?.height
        }),
      };
    } else if (status === 'FAILED') {
      console.error('❌ [Fal.ai Poll] Tarea falló');
      console.error('❌ [Fal.ai Poll] Error:', data.error);
      
      let errorMessage = data.error || 'Error desconocido';
      if (errorMessage.includes('inappropriate') || errorMessage.includes('content policy')) {
        errorMessage = 'El contenido fue rechazado por filtros de seguridad. Intenta con una descripción más simple y profesional.';
      }
      
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: 'failed',
          error: errorMessage,
          taskId: taskId
        }),
      };
    } else if (status === 'IN_QUEUE' || status === 'IN_PROGRESS') {
      console.log('⏳ [Fal.ai Poll] Tarea en progreso:', status);
      
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: 'processing',
          taskStatus: status,
          taskId: taskId,
          queue_position: data.queue_position
        }),
      };
    } else {
      console.warn('⚠️ [Fal.ai Poll] Estado desconocido:', status);
      
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: 'unknown',
          taskStatus: status,
          taskId: taskId
        }),
      };
    }

  } catch (error: any) {
    console.error('❌ [Fal.ai Poll] Error fatal:', error.message);
    console.error('❌ [Fal.ai Poll] Stack:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Error: ${error.message}`,
        type: error.name || 'Unknown'
      }),
    };
  }
};

import { Handler } from '@netlify/functions';

// ============================================
// FAL.AI - VIDEO TASK POLLING
// Polling para tareas de video (borrador y HD)
// ============================================

const FAL_API_KEY = process.env.FAL_AI_API_KEY;

if (!FAL_API_KEY) {
  throw new Error('FAL_AI_API_KEY no está configurada en las variables de entorno');
}

export const handler: Handler = async (event) => {
  console.log('🔍 [Video Poll] ===========================================');
  console.log('🔍 [Video Poll] POLLING DE VIDEO INICIADO');
  console.log('🔍 [Video Poll] HTTP Method:', event.httpMethod);
  console.log('🔍 [Video Poll] ===========================================');
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const taskId = body.taskId;
    
    console.log('🆔 [Video Poll] Task ID:', taskId);
    
    if (!taskId) {
      throw new Error("Falta el parámetro taskId");
    }

    // Construir URL de status
    // Fal.ai usa: https://queue.fal.run/fal-ai/{model}/requests/{request_id}/status
    // Pero el request_id ya incluye el path completo en algunos casos
    let url: string;
    if (taskId.includes('/')) {
      // Ya es una URL completa o path completo
      url = taskId.startsWith('http') ? taskId : `https://queue.fal.run${taskId}`;
    } else {
      // Es solo el ID, necesitamos construir la URL
      // Por defecto asumimos que es del modelo de video
      url = `https://queue.fal.run/fal-ai/ltx-2-19b/text-to-video/lora/requests/${taskId}/status`;
    }
    
    console.log('🌐 [Video Poll] URL de consulta:', url);
    console.log('⏳ [Video Poll] Consultando estado...');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Key ${FAL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ [Video Poll] Respuesta recibida. Status:', response.status);
    
    const responseText = await response.text();
    console.log('📄 [Video Poll] Respuesta (primeros 500 chars):', responseText.substring(0, 500));
    
    let data: any;
    try {
      data = JSON.parse(responseText);
      console.log('📊 [Video Poll] Respuesta keys:', Object.keys(data));
    } catch (parseError) {
      console.error('❌ [Video Poll] Error parseando JSON:', parseError);
      throw new Error(`Error parseando respuesta: ${responseText.substring(0, 200)}`);
    }

    if (!response.ok) {
      console.error('❌ [Video Poll] Error HTTP:', response.status);
      console.error('❌ [Video Poll] Error details:', JSON.stringify(data, null, 2));
      
      return { 
        statusCode: response.status, 
        body: JSON.stringify({
          error: data.message || data.error || 'Error desconocido'
        })
      };
    }

    const status = data.status;
    console.log('📊 [Video Poll] Status:', status);
    
    // Estados: IN_QUEUE, IN_PROGRESS, COMPLETED, FAILED
    if (status === 'COMPLETED') {
      console.log('✅ [Video Poll] Video completado');
      
      // Obtener URL del video
      const videoUrl = data.video?.url || data.data?.video?.url;
      const seed = data.seed || data.data?.seed;
      
      if (!videoUrl) {
        console.error('❌ [Video Poll] No se encontró URL del video');
        console.error('❌ [Video Poll] Data:', JSON.stringify(data, null, 2));
        throw new Error('No se encontró URL del video en la respuesta');
      }
      
      console.log('🎬 [Video Poll] Video URL:', videoUrl.substring(0, 100) + '...');
      
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: 'COMPLETED',
          videoUrl: videoUrl,
          seed: seed,
          taskId: taskId
        }),
      };
    } 
    
    if (status === 'FAILED') {
      console.error('❌ [Video Poll] Tarea falló');
      console.error('❌ [Video Poll] Error:', data.error);
      
      let errorMessage = data.error || 'Error desconocido';
      if (errorMessage.includes('inappropriate') || errorMessage.includes('content policy')) {
        errorMessage = 'Contenido rechazado por filtros de seguridad';
      }
      
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: 'FAILED',
          error: errorMessage,
          taskId: taskId
        }),
      };
    } 
    
    if (status === 'IN_QUEUE' || status === 'IN_PROGRESS') {
      console.log('⏳ [Video Poll] En progreso:', status);
      
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status,
          taskId: taskId,
          queue_position: data.queue_position
        }),
      };
    }
    
    // Estado desconocido
    console.warn('⚠️ [Video Poll] Estado desconocido:', status);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: status || 'UNKNOWN',
        taskId: taskId
      }),
    };

  } catch (error: any) {
    console.error('❌ [Video Poll] Error fatal:', error.message);
    console.error('❌ [Video Poll] Stack:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Error: ${error.message}`,
        type: error.name || 'Unknown'
      }),
    };
  }
};

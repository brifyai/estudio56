import { Handler } from '@netlify/functions';

// ============================================
// ALIBABA CLOUD MODEL STUDIO - TASK POLLING
// ============================================

// API Key de Alibaba Cloud Model Studio (desde variable de entorno)
const ALIBABA_API_KEY = process.env.ALIBABA_API_KEY;
const ALIBABA_BASE_URL = 'https://dashscope-intl.aliyuncs.com/api/v1';

if (!ALIBABA_API_KEY) {
  throw new Error('ALIBABA_API_KEY no está configurada en las variables de entorno');
}

export const handler: Handler = async (event) => {
  console.log('🔍 [Alibaba Poll] ===========================================');
  console.log('🔍 [Alibaba Poll] POLLING DE TAREA INICIADO');
  console.log('🔍 [Alibaba Poll] HTTP Method:', event.httpMethod);
  console.log('🔍 [Alibaba Poll] ===========================================');
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const taskId = body.taskId;
    
    console.log('🆔 [Alibaba Poll] Task ID:', taskId);
    
    if (!taskId) {
      throw new Error("Falta el parámetro taskId");
    }

    // URL para consultar el estado de la tarea
    const url = `${ALIBABA_BASE_URL}/tasks/${taskId}`;
    console.log('🌐 [Alibaba Poll] URL de consulta:', url);

    console.log('⏳ [Alibaba Poll] Consultando estado de la tarea...');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ALIBABA_API_KEY}`
      }
    });

    console.log('✅ [Alibaba Poll] Respuesta recibida. Status:', response.status);
    
    const responseText = await response.text();
    console.log('📄 [Alibaba Poll] Respuesta raw (primeros 500 chars):', responseText.substring(0, 500));
    
    let data: any;
    try {
      data = JSON.parse(responseText);
      console.log('📊 [Alibaba Poll] Respuesta keys:', Object.keys(data));
    } catch (parseError) {
      console.error('❌ [Alibaba Poll] Error parseando JSON:', parseError);
      throw new Error(`Error parseando respuesta: ${responseText.substring(0, 200)}`);
    }

    if (!response.ok) {
      console.error('❌ [Alibaba Poll] Error HTTP:', response.status);
      console.error('❌ [Alibaba Poll] Error details:', JSON.stringify(data, null, 2));
      
      return { 
        statusCode: response.status, 
        body: JSON.stringify({
          error: data.message || data.code || 'Error desconocido',
          code: data.code
        })
      };
    }

    // Estructura de respuesta de Alibaba Cloud
    if (data.output) {
      const output = data.output;
      console.log('📊 [Alibaba Poll] Task status:', output.task_status);
      
      // Estados posibles: PENDING, RUNNING, SUCCEEDED, FAILED, CANCELED, UNKNOWN
      const status = output.task_status;
      
      if (status === 'SUCCEEDED') {
        console.log('✅ [Alibaba Poll] Video generado exitosamente');
        console.log('🎬 [Alibaba Poll] Video URL:', output.video_url?.substring(0, 100) + '...');
        
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: 'complete',
            videoUrl: output.video_url,
            taskId: output.task_id,
            submitTime: output.submit_time,
            endTime: output.end_time,
            originalPrompt: output.orig_prompt,
            actualPrompt: output.actual_prompt,
            usage: data.usage
          }),
        };
      } else if (status === 'FAILED') {
        console.error('❌ [Alibaba Poll] Tarea falló');
        console.error('❌ [Alibaba Poll] Error code:', output.code);
        console.error('❌ [Alibaba Poll] Error message:', output.message);
        
        // Detectar error de contenido inapropiado
        let errorMessage = output.message || 'Error desconocido';
        if (output.code === 'DataInspectionFailed' || 
            errorMessage.includes('inappropriate content') ||
            errorMessage.includes('inappropriate') ||
            errorMessage.includes('content safety')) {
          errorMessage = 'El contenido fue rechazado por filtros de seguridad de Alibaba Cloud. Intenta con una descripción más simple y profesional, evitando términos que puedan ser ambiguos.';
        }
        
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: 'failed',
            error: errorMessage,
            code: output.code,
            taskId: output.task_id,
            originalMessage: output.message
          }),
        };
      } else if (status === 'PENDING' || status === 'RUNNING') {
        console.log('⏳ [Alibaba Poll] Tarea en progreso:', status);
        
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: 'processing',
            taskStatus: status,
            taskId: output.task_id,
            submitTime: output.submit_time,
            scheduledTime: output.scheduled_time
          }),
        };
      } else if (status === 'UNKNOWN') {
        console.warn('⚠️ [Alibaba Poll] Tarea desconocida o expirada (>24h)');
        
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: 'expired',
            message: 'La tarea no existe o ha expirado (>24 horas)',
            taskId: output.task_id
          }),
        };
      } else {
        console.warn('⚠️ [Alibaba Poll] Estado desconocido:', status);
        
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: 'unknown',
            taskStatus: status,
            taskId: output.task_id
          }),
        };
      }
    }

    console.error('❌ [Alibaba Poll] Estructura de respuesta inesperada:', JSON.stringify(data, null, 2));
    throw new Error("Respuesta inesperada - no se encontró output");

  } catch (error: any) {
    console.error('❌ [Alibaba Poll] Error fatal:', error.message);
    console.error('❌ [Alibaba Poll] Stack:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Error: ${error.message}`,
        type: error.name || 'Unknown'
      }),
    };
  }
};

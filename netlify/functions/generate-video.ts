import { Handler } from '@netlify/functions';
import { GoogleAuth } from 'google-auth-library';

export const handler: Handler = async (event) => {
  console.log('🎬 [DEBUG] ===========================================');
  console.log('🎬 [DEBUG] FUNCIÓN DE VIDEO INICIADA');
  console.log('🎬 [DEBUG] HTTP Method:', event.httpMethod);
  console.log('🎬 [DEBUG] Body length:', event.body?.length);
  console.log('🎬 [DEBUG] ===========================================');
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('📝 [DEBUG] Prompt recibido (primeros 100 chars):', (body.prompt || 'SIN PROMPT').substring(0, 100));
    console.log('🎯 [DEBUG] Modelo:', body.model);
    console.log('📐 [DEBUG] AspectRatio:', body.aspectRatio);
    
    const keyData = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    console.log('🔑 [DEBUG] GOOGLE_SERVICE_ACCOUNT_KEY existe:', !!keyData);
    
    if (!keyData) {
      console.error('❌ [DEBUG] FALTA GOOGLE_SERVICE_ACCOUNT_KEY');
      throw new Error("Falta la variable GOOGLE_SERVICE_ACCOUNT_KEY");
    }

    const serviceAccount = JSON.parse(keyData);
    console.log('📧 [DEBUG] Service account email:', serviceAccount.client_email);
    
    const privateKey = serviceAccount.private_key
      .replace(/\\n/g, '\n')
      .trim();
    console.log('🔐 [DEBUG] Private key parseada correctamente');

    const auth = new GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: privateKey,
      },
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });

    console.log('⏳ [DEBUG] Obteniendo token de acceso...');
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    
    if (!token.token) {
      console.error('❌ [DEBUG] No se pudo obtener token de acceso');
      throw new Error("No se pudo obtener token de acceso para Vertex AI");
    }
    
    console.log('✅ [DEBUG] Token obtenido:', token.token?.substring(0, 20) + '...');

    const projectId = serviceAccount.project_id;
    console.log('🏢 [DEBUG] Project ID:', projectId);
    
    // Mapear modelos de video a sus endpoints correctos
    // Basado en la documentación de Vertex AI Model Garden
    const modelMap: Record<string, string> = {
      'veo-3-fast-001': 'veo-3-fast-001',
      'veo-2.0-generate-preview': 'veo-2.0-generate-preview',
      'veo-2.0-flash-generate-preview': 'veo-2.0-flash-generate-preview',
      'veo-1.0-preview-001': 'veo-1.0-preview-001'
    };
    
    const vertexModel = modelMap[body.model] || 'veo-3-fast-001';
    
    console.log('🎯 [DEBUG] Vertex Model:', vertexModel);
    
    const cleanPrompt = (body.prompt || '').slice(0, 1000);
    console.log('📝 [DEBUG] Prompt limpio (primeros 100 chars):', cleanPrompt.substring(0, 100));

    // URL para generación de video con Veo
    // Nota: Veo 3.1 usa el método :generateVideos (no :predict)
    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/${vertexModel}:generateVideos`;
    console.log('🌐 [DEBUG] URL de Vertex AI:', url);

    console.log('⏳ [DEBUG] Enviando petición a Vertex AI...');
    
    // Timeout de 60 segundos para videos (toman más tiempo)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    
    // Estructura del request para Veo 3.1
    // Documentación: https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/video-generation
    const requestBody = {
      prompt: cleanPrompt,
      aspectRatio: body.aspectRatio || '9:16',
      duration: body.duration || '6s',
      // Parámetros opcionales para Veo 3.1
      personGeneration: 'allow_adult',
      safetySetting: 'block_only_high'
    };
    
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error('❌ [DEBUG] Timeout: Vertex AI tardó más de 60 segundos');
        throw new Error("Timeout: Vertex AI tardó más de 60 segundos");
      }
      throw fetchError;
    }

    console.log('✅ [DEBUG] Respuesta de Vertex AI recibida. Status:', response.status);
    
    // Leer el texto de la respuesta primero
    const responseText = await response.text();
    console.log('📄 [DEBUG] Respuesta raw (primeros 500 chars):', responseText.substring(0, 500));
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('📊 [DEBUG] Respuesta keys:', Object.keys(data));
    } catch (parseError) {
      console.error('❌ [DEBUG] Error parseando JSON:', parseError);
      console.error('❌ [DEBUG] Respuesta completa:', responseText);
      throw new Error(`Error parseando respuesta de Vertex AI: ${responseText.substring(0, 200)}`);
    }

    if (!response.ok) {
      console.error('❌ [DEBUG] Error HTTP de Google:', response.status);
      console.error('❌ [DEBUG] Error details:', JSON.stringify(data, null, 2));
      
      const errorMessage = data.error?.message || data.message || JSON.stringify(data);
      if (errorMessage.includes('not available') || errorMessage.includes('not supported')) {
        console.error('❌ [DEBUG] El modelo no está disponible:', body.model);
        throw new Error(`El modelo ${body.model} no está habilitado en Google Cloud Console. Error: ${errorMessage.substring(0, 200)}`);
      }
      
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    // Veo devuelve una operación de larga duración
    if (data.name) {
      console.log('🔄 [DEBUG] Operación de video iniciada:', data.name);
      
      // Retornar el nombre de la operación para polling
      return {
        statusCode: 202,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationName: data.name,
          status: 'processing'
        }),
      };
    }

    // Si ya está completo (poco probable)
    if (data.video) {
      console.log('✅ [DEBUG] Video generado inmediatamente');
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: data.video,
          status: 'complete'
        }),
      };
    }

    throw new Error("Respuesta inesperada de Vertex AI");

  } catch (error: any) {
    console.error('❌ [DEBUG] Error fatal:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Error: ${error.message}`,
        type: error.name || 'Unknown'
      }),
    };
  }
};

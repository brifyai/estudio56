import { Handler } from '@netlify/functions';
import { GoogleAuth } from 'google-auth-library';

export const handler: Handler = async (event) => {
  console.log('🚨 [DEBUG] ===========================================');
  console.log('🚨 [DEBUG] FUNCIÓN INICIADA');
  console.log('🚨 [DEBUG] HTTP Method:', event.httpMethod);
  console.log('🚨 [DEBUG] Body length:', event.body?.length);
  console.log('🚨 [DEBUG] ===========================================');
  
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
    
    // Mapear modelos a sus endpoints correctos
    const modelMap: Record<string, { endpoint: string; version: string }> = {
      'imagen-3.0-fast-001': {
        endpoint: 'imagen-3-0-fast-generate',
        version: 'v1beta1'
      },
      'imagen-3.0-pro-001': {
        endpoint: 'imagen-3-0-pro-generate',
        version: 'v1beta1'
      },
      'imagen-3.0-capability-001': {
        endpoint: 'imagen-3-0-capability-generate',
        version: 'v1'
      }
    };
    
    const modelConfig = modelMap[body.model] || modelMap['imagen-3.0-capability-001'];
    const vertexModel = modelConfig.endpoint;
    const apiVersion = modelConfig.version;
    
    console.log('🎯 [DEBUG] Vertex Model:', vertexModel);
    console.log('🌐 [DEBUG] API Version:', apiVersion);
    
    const cleanPrompt = (body.prompt || '').slice(0, 500);
    console.log('📝 [DEBUG] Prompt limpio (primeros 100 chars):', cleanPrompt.substring(0, 100));

    const url = `https://us-central1-aiplatform.googleapis.com/${apiVersion}/projects/${projectId}/locations/us-central1/publishers/google/models/${vertexModel}:predict`;
    console.log('🌐 [DEBUG] URL de Vertex AI:', url);

    console.log('⏳ [DEBUG] Enviando petición a Vertex AI...');
    
    // Timeout de 20 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);
    
    // Estructura del request según la versión del modelo
    const requestBody = apiVersion === 'v1'
      ? {
          instances: [{ prompt: cleanPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: body.aspectRatio || '9:16',
            outputOptions: { mimeType: "image/jpeg", compressionQuality: 75 }
          }
        }
      : {
          instances: [{ prompt: cleanPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: body.aspectRatio || '9:16',
            outputOptions: { mimeType: "image/jpeg", compressionQuality: 75 },
            safetySetting: "BLOCK_ONLY_HIGH"
          }
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
        console.error('❌ [DEBUG] Timeout: Vertex AI tardó más de 20 segundos');
        throw new Error("Timeout: Vertex AI tardó más de 20 segundos");
      }
      throw fetchError;
    }

    console.log('✅ [DEBUG] Respuesta de Vertex AI recibida. Status:', response.status);
    
    const data = await response.json();
    console.log('📊 [DEBUG] Respuesta keys:', Object.keys(data));

    if (!response.ok) {
      console.error('❌ [DEBUG] Error HTTP de Google:', response.status);
      console.error('❌ [DEBUG] Error details:', JSON.stringify(data, null, 2));
      
      // Detectar error específico "not available"
      const errorMessage = data.error?.message || data.message || JSON.stringify(data);
      if (errorMessage.includes('not available') || errorMessage.includes('not supported')) {
        console.error('❌ [DEBUG] El modelo no está disponible:', body.model);
        throw new Error(`El modelo ${body.model} no está habilitado en Google Cloud Console. Error: ${errorMessage.substring(0, 200)}`);
      }
      
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    if (!data.predictions || data.predictions.length === 0) {
      console.error('❌ [DEBUG] Google no devolvió predicciones');
      throw new Error("Google no devolvió ninguna imagen en las predicciones");
    }

    const prediction = data.predictions[0];
    console.log('🔍 [DEBUG] Predicción keys:', Object.keys(prediction || {}));
    
    let base64Image = prediction.bytesBase64Encoded || prediction.bytes || prediction.base64 || prediction.image;
    
    if (!base64Image) {
      console.error('❌ [DEBUG] No se encontró imagen en la predicción');
      throw new Error("No se encontró imagen en la respuesta de Google");
    }
    
    console.log('✅ [DEBUG] Imagen generada. Tamaño Base64:', base64Image.length);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: `data:image/png;base64,${base64Image}`
      }),
    };

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

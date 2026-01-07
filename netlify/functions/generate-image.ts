import { Handler } from '@netlify/functions';
import { GoogleAuth } from 'google-auth-library';

export const handler: Handler = async (event) => {
  // 🚨 LOG INICIAL - Este debe aparecer SIEMPRE
  console.log('🚨 [DEBUG] ===========================================');
  console.log('🚨 [DEBUG] FUNCIÓN INICIADA');
  console.log('🚨 [DEBUG] HTTP Method:', event.httpMethod);
  console.log('🚨 [DEBUG] Body length:', event.body?.length);
  console.log('🚨 [DEBUG] ===========================================');
  
  if (event.httpMethod !== 'POST') {
    console.log('🚨 [DEBUG] Error: Método no permitido, retornando 405');
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    console.log('📝 [DEBUG] Prompt recibido (primeros 50 chars):', (body.prompt || 'SIN PROMPT').substring(0, 50));
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
    console.log('✅ [DEBUG] Token obtenido:', token.token?.substring(0, 20) + '...');

    const projectId = serviceAccount.project_id;
    console.log('🏢 [DEBUG] Project ID:', projectId);
    
    const modelMap: Record<string, string> = {
      'imagen-3.0-fast-001': 'imagen-3.0-fast-generate-001',
      'imagen-3.0-pro-001': 'imagen-3.0-pro-generate-001'
    };
    
    const vertexModel = modelMap[body.model] || 'imagen-3.0-fast-generate-001';
    console.log('🎯 [DEBUG] Vertex Model:', vertexModel);
    
    const cleanPrompt = (body.prompt || '').slice(0, 500);
    console.log('📝 [DEBUG] Prompt limpio (primeros 100 chars):', cleanPrompt.substring(0, 100));

    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/${vertexModel}:predict`;
    console.log('🌐 [DEBUG] URL de Vertex AI:', url.substring(0, 80) + '...');

    console.log('⏳ [DEBUG] Enviando petición a Vertex AI...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ prompt: cleanPrompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: body.aspectRatio || '9:16',
          outputOptions: { mimeType: "image/jpeg", compressionQuality: 75 },
          safetySetting: "BLOCK_ONLY_HIGH"
        }
      }),
    });

    console.log('✅ [DEBUG] Respuesta de Vertex AI recibida. Status:', response.status);
    
    const data = await response.json();
    console.log('📊 [DEBUG] Respuesta completa de Google:', JSON.stringify(data, null, 2).substring(0, 500));

    if (!response.ok) {
      console.error('❌ [DEBUG] Error HTTP de Google:', response.status, data);
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
    console.error('❌ [DEBUG] Stack:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Error: ${error.message}`,
        type: error.name || 'Unknown'
      }),
    };
  }
};
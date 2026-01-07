import { Handler } from '@netlify/functions';
import { GoogleAuth } from 'google-auth-library';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      prompt,
      model = 'imagen-3.0-fast-001',
      aspectRatio = '9:16',
      imageSize = '480p',
      seed
    } = body;

    console.log('🎯 [Netlify Function] Parámetros recibidos:', { model, aspectRatio, imageSize, seed });
    
    // 🛡️ LIMPIEZA DE PROMPT: Limitar a 500 caracteres para evitar bloqueos de seguridad
    const cleanPrompt = (prompt || '').slice(0, 500);
    console.log('📝 [Netlify Function] Prompt limpio:', cleanPrompt.substring(0, 100) + '...');

    const keyData = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!keyData) throw new Error("Falta la variable GOOGLE_SERVICE_ACCOUNT_KEY");

    // Parseamos el JSON
    const serviceAccount = JSON.parse(keyData);
    
    // LIMPIEZA PROFUNDA: Esta es la solución al error DECODER
    const privateKey = serviceAccount.private_key
      .replace(/\\n/g, '\n') // Convierte \n de texto a saltos de línea reales
      .trim();              // Quita espacios accidentales al inicio/final

    const auth = new GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: privateKey,
      },
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    const projectId = serviceAccount.project_id;
    
    // Seleccionar modelo según el parámetro recibido
    const modelMap: Record<string, string> = {
      'imagen-3.0-fast-001': 'imagen-3.0-fast-generate-001',
      'imagen-3.0-pro-001': 'imagen-3.0-pro-generate-001'
    };
    
    const vertexModel = modelMap[model] || 'imagen-3.0-fast-generate-001';
    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/${vertexModel}:predict`;

    console.log('🎯 [Netlify Function] Usando modelo Vertex AI:', vertexModel);

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
          aspectRatio: aspectRatio,
          outputOptions: { mimeType: "image/jpeg", compressionQuality: 75 },
          // 🛡️ Safety settings reducidos para evitar bloqueos falsos positivos
          safetySetting: "BLOCK_ONLY_HIGH"
        }
      }),
    });

    const data = await response.json();

    // 📊 LOG DETALLADO para debuggear el error de retry
    console.log('📊 [Netlify Function] Respuesta completa de Google:', JSON.stringify(data, null, 2));
    console.log('🔍 [Netlify Function] Tipo de data:', typeof data);
    console.log('🔍 [Netlify Function] Keys de data:', Object.keys(data || {}));
    
    // Verificar si hay error en la respuesta
    if (data.error) {
      console.error('❌ [Netlify Function] Error en respuesta de Google:', data.error);
    }
    if (data.predictions && data.predictions.length > 0) {
      console.log('✅ [Netlify Function] Predicciones encontradas:', data.predictions.length);
      const pred = data.predictions[0];
      console.log('🔍 [Netlify Function] Keys de predicción:', Object.keys(pred || {}));
    }

    if (!response.ok) {
      console.error('❌ Error de Google (HTTP):', response.status, data);
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    // VERIFICACIÓN CLAVE: Google devuelve un array "predictions"
    if (!data.predictions || data.predictions.length === 0) {
      console.error('❌ Google no devolvió predicciones. Estructura de respuesta:', Object.keys(data));
      throw new Error("Google no devolvió ninguna imagen en las predicciones");
    }

    // Extraemos el Base64 (Google usa la propiedad 'bytesBase64Encoded')
    const prediction = data.predictions[0];
    console.log('🔍 [Netlify Function] Predicción completa:', JSON.stringify(prediction, null, 2));
    
    // Manejar diferentes formatos de respuesta de Google
    let base64Image = prediction.bytesBase64Encoded || prediction.bytes || prediction.base64 || prediction.image;
    
    if (!base64Image) {
      console.error('❌ No se encontró imagen en la predicción. Keys disponibles:', Object.keys(prediction));
      throw new Error("No se encontró imagen en la respuesta de Google");
    }
    
    console.log('✅ [Netlify Function] Imagen generada, tamaño Base64:', base64Image.length);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // Enviamos el Base64 formateado para que el navegador lo entienda
        url: `data:image/png;base64,${base64Image}`
      }),
    };

  } catch (error: any) {
    console.error('❌ Error Crítico en generate-image:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Error: ${error.message}`,
        type: error.name || 'Unknown'
      }),
    };
  }
};
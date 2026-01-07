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
    console.log('📝 [Netlify Function] Prompt:', prompt?.substring(0, 100) + '...');

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
        instances: [{ prompt }],
        parameters: {
          sampleCount: 1,
          aspectRatio: aspectRatio
        }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Error de Google:', data);
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    // VERIFICACIÓN CLAVE: Google devuelve un array "predictions"
    if (!data.predictions || data.predictions.length === 0) {
      console.error('❌ Google no devolvió predicciones:', data);
      throw new Error("Google no devolvió ninguna imagen en las predicciones");
    }

    // Extraemos el Base64 (Google usa la propiedad 'bytesBase64Encoded')
    const base64Image = data.predictions[0].bytesBase64Encoded;
    
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
    console.error('❌ Error Crítico:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Error: ${error.message}` }),
    };
  }
};
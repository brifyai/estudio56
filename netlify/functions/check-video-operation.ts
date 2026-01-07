import { Handler } from '@netlify/functions';
import { GoogleAuth } from 'google-auth-library';

export const handler: Handler = async (event) => {
  console.log('🔍 [DEBUG] ===========================================');
  console.log('🔍 [DEBUG] FUNCIÓN DE CHECK VIDEO INICIADA');
  console.log('🔍 [DEBUG] HTTP Method:', event.httpMethod);
  console.log('🔍 [DEBUG] ===========================================');
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const operationName = body.operationName;
    
    if (!operationName) {
      throw new Error("Falta operationName");
    }
    
    console.log('🔍 [DEBUG] Operation Name:', operationName);
    
    const keyData = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    
    if (!keyData) {
      throw new Error("Falta la variable GOOGLE_SERVICE_ACCOUNT_KEY");
    }

    const serviceAccount = JSON.parse(keyData);
    
    const privateKey = serviceAccount.private_key
      .replace(/\\n/g, '\n')
      .trim();

    const auth = new GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: privateKey,
      },
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();
    
    if (!token.token) {
      throw new Error("No se pudo obtener token de acceso para Vertex AI");
    }

    // URL para verificar el estado de la operación
    const url = `https://us-central1-aiplatform.googleapis.com/v1/${operationName}`;
    console.log('🌐 [DEBUG] URL de operación:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    console.log('📊 [DEBUG] Estado de operación:', data.done ? 'COMPLETO' : 'EN PROCESO');

    if (!response.ok) {
      console.error('❌ [DEBUG] Error HTTP:', response.status);
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    // Si la operación está completa
    if (data.done) {
      if (data.error) {
        console.error('❌ [DEBUG] Error en generación:', data.error);
        return {
          statusCode: 500,
          body: JSON.stringify({
            status: 'error',
            error: data.error
          })
        };
      }

      // Extraer el video de la respuesta
      const videoData = data.response?.generatedSamples?.[0];
      
      if (videoData?.video) {
        console.log('✅ [DEBUG] Video generado exitosamente');
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: 'complete',
            videoUrl: videoData.video
          }),
        };
      }

      throw new Error("No se encontró video en la respuesta");
    }

    // Operación aún en proceso
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: 'processing',
        progress: data.metadata?.progressPercent || 0
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

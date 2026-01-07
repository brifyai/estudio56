import { Handler } from '@netlify/functions';
import { GoogleAuth } from 'google-auth-library';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const { prompt, seed } = JSON.parse(event.body || '{}');

    // 1. Carga segura de la cuenta de servicio
    const keyData = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!keyData) throw new Error("Falta la variable GOOGLE_SERVICE_ACCOUNT_KEY");

    const serviceAccount = JSON.parse(keyData);
    
    // REPARACIÓN DE EMERGENCIA: Forzar saltos de línea reales en la clave
    const privateKey = serviceAccount.private_key
      .replace(/\\n/g, '\n')
      .replace(/"/g, ''); // Eliminar comillas accidentales

    // 2. Autenticación
    const auth = new GoogleAuth({
      credentials: {
        client_email: serviceAccount.client_email,
        private_key: privateKey,
      },
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();

    if (!token.token) throw new Error("Google rechazó la clave privada. Revisa el formato.");

    // 3. Llamada a Vertex AI (Imagen 3 Fast)
    const projectId = serviceAccount.project_id;
    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-fast-generate-001:predict`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{ prompt }],
        parameters: { sampleCount: 1, aspectRatio: "9:16" }
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        statusCode: response.status, 
        body: JSON.stringify({ error: data.error?.message || "Error en Vertex AI" }) 
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`
      }),
    };

  } catch (error: any) {
    console.error('❌ Error Crítico:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Error de configuración: ${error.message}` }),
    };
  }
};
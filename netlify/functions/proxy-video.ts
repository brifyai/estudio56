import { Handler } from '@netlify/functions';

// ============================================
// PROXY PARA VIDEOS DE ALIBABA CLOUD
// Usa redirect 302 para evitar límites de payload
// ============================================

export const handler: Handler = async (event) => {
  console.log('🎥 [Video Proxy] ===========================================');
  console.log('🎥 [Video Proxy] PROXY DE VIDEO INICIADO');
  console.log('🎥 [Video Proxy] HTTP Method:', event.httpMethod);
  console.log('🎥 [Video Proxy] ===========================================');
  
  // Manejar CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }
  
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Obtener URL del video desde query params
    const videoUrl = event.queryStringParameters?.url;
    
    if (!videoUrl) {
      throw new Error("Falta el parámetro 'url'");
    }

    console.log('🔗 [Video Proxy] URL del video:', videoUrl.substring(0, 100) + '...');
    
    // Validar que la URL sea de Alibaba Cloud
    if (!videoUrl.includes('dashscope-result') && !videoUrl.includes('aliyuncs.com')) {
      throw new Error('URL no válida: solo se permiten URLs de Alibaba Cloud');
    }

    console.log('✅ [Video Proxy] Redirigiendo a URL de Alibaba Cloud...');
    
    // SOLUCIÓN: Hacer redirect 302 en lugar de proxy completo
    // Esto evita límites de payload y timeout de Netlify Functions
    return {
      statusCode: 302,
      headers: {
        'Location': videoUrl,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
      },
      body: '',
    };

  } catch (error: any) {
    console.error('❌ [Video Proxy] Error fatal:', error.message);
    console.error('❌ [Video Proxy] Stack:', error.stack);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: `Error: ${error.message}`,
        type: error.name || 'Unknown'
      }),
    };
  }
};

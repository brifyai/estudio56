import { Handler } from '@netlify/functions';

// ============================================
// PROXY PARA VIDEOS DE ALIBABA CLOUD
// Soluciona problema de CORS al servir videos
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

    console.log('⏳ [Video Proxy] Descargando video desde Alibaba Cloud...');
    
    // Descargar el video desde Alibaba Cloud
    const response = await fetch(videoUrl);
    
    if (!response.ok) {
      console.error('❌ [Video Proxy] Error descargando video:', response.status);
      throw new Error(`Error descargando video: ${response.status} ${response.statusText}`);
    }

    console.log('✅ [Video Proxy] Video descargado exitosamente');
    console.log('📊 [Video Proxy] Content-Type:', response.headers.get('content-type'));
    console.log('📊 [Video Proxy] Content-Length:', response.headers.get('content-length'));
    
    const contentLength = response.headers.get('content-length');
    const sizeInMB = contentLength ? (parseInt(contentLength) / 1024 / 1024).toFixed(2) : 'unknown';
    console.log('📊 [Video Proxy] Tamaño del video:', sizeInMB, 'MB');
    
    // Obtener el video como buffer
    const videoBuffer = await response.arrayBuffer();
    const videoBase64 = Buffer.from(videoBuffer).toString('base64');
    
    console.log('✅ [Video Proxy] Video convertido a base64');
    console.log('📊 [Video Proxy] Tamaño base64:', (videoBase64.length / 1024 / 1024).toFixed(2), 'MB');

    // Retornar el video con headers CORS correctos
    return {
      statusCode: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'video/mp4',
        'Content-Length': contentLength || videoBuffer.byteLength.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=86400', // Cache por 24 horas
        'Accept-Ranges': 'bytes',
      },
      body: videoBase64,
      isBase64Encoded: true,
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

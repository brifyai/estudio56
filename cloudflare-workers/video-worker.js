/**
 * 🚀 Cloudflare Worker para fal.ai Video API
 * 
 * Arquitectura:
 * React App → Cloudflare Worker → fal.ai API
 * 
 * Ventajas:
 * - Menor latencia (Worker más cerca de fal.ai)
 * - Caché de respuestas
 * - Rate limiting
 * - API Key segura (no expuesta al cliente)
 */

// ============================================
// CONFIGURACIÓN
// ============================================

const FAL_AI_BASE_URL = 'https://queue.fal.run';

// Modelos
const MODELS = {
  DRAFT: 'fal-ai/ltx-2-19b/text-to-video/lora',
  UPSCALE: 'fal-ai/seedvr/upscale/video'
};

// ============================================
// CORS HEADERS
// ============================================

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// ============================================
// MAIN HANDLER
// ============================================

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Rutas
      if (path === '/generate-draft' && request.method === 'POST') {
        return await handleGenerateDraft(request, env);
      }
      
      if (path === '/generate-hd' && request.method === 'POST') {
        return await handleGenerateHD(request, env);
      }
      
      if (path === '/check-status' && request.method === 'POST') {
        return await handleCheckStatus(request, env);
      }
      
      // Health check
      if (path === '/health') {
        return jsonResponse({ status: 'ok', timestamp: Date.now() });
      }

      return jsonResponse({ error: 'Not found' }, 404);

    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse({ 
        error: error.message || 'Internal server error' 
      }, 500);
    }
  }
};

// ============================================
// GENERAR BORRADOR (480p)
// ============================================

async function handleGenerateDraft(request, env) {
  const body = await request.json();
  const { prompt, aspectRatio = '9:16' } = body;

  if (!prompt) {
    return jsonResponse({ error: 'Prompt is required' }, 400);
  }

  // Mapear aspect ratio a dimensiones
  const dimensions = getVideoDimensions(aspectRatio, '480p');

  // Request body para fal.ai
  const requestBody = {
    prompt: prompt,
    video_size: {
      width: dimensions.width,
      height: dimensions.height
    },
    num_frames: 121,  // 5 segundos @ 25fps
    video_quality: 'low',
    acceleration: 'full',
    num_inference_steps: 30,
    use_multiscale: false,
    guidance_scale: 3,
    fps: 25,
    generate_audio: false,
    enable_safety_checker: true,
    video_output_type: 'X264 (.mp4)',
    video_write_mode: 'fast',
    loras: []
  };

  // Llamar a fal.ai
  const response = await fetch(`${FAL_AI_BASE_URL}/${MODELS.DRAFT}`, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${env.FAL_AI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();

  if (!response.ok) {
    return jsonResponse({ 
      error: data.message || data.error || 'Error from fal.ai',
      details: data
    }, response.status);
  }

  return jsonResponse({
    success: true,
    taskId: data.request_id,
    statusUrl: data.status_url,
    status: 'IN_QUEUE'
  });
}

// ============================================
// GENERAR HD (1080p)
// ============================================

async function handleGenerateHD(request, env) {
  const body = await request.json();
  const { videoUrl } = body;

  if (!videoUrl) {
    return jsonResponse({ error: 'videoUrl is required' }, 400);
  }

  // Request body para upscaler
  const requestBody = {
    video_url: videoUrl,
    upscale_mode: 'target',
    target_resolution: '1080p',
    noise_scale: 0.1,
    output_format: 'X264 (.mp4)',
    output_quality: 'high',
    output_write_mode: 'balanced'
  };

  // Llamar a fal.ai
  const response = await fetch(`${FAL_AI_BASE_URL}/${MODELS.UPSCALE}`, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${env.FAL_AI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();

  if (!response.ok) {
    return jsonResponse({ 
      error: data.message || data.error || 'Error from fal.ai',
      details: data
    }, response.status);
  }

  return jsonResponse({
    success: true,
    taskId: data.request_id,
    statusUrl: data.status_url,
    status: 'IN_QUEUE'
  });
}

// ============================================
// CONSULTAR ESTADO
// ============================================

async function handleCheckStatus(request, env) {
  const body = await request.json();
  const { taskId, model = 'draft', statusUrl } = body;

  if (!taskId && !statusUrl) {
    return jsonResponse({ error: 'taskId or statusUrl is required' }, 400);
  }

  // Usar statusUrl si se proporciona, sino construir la URL
  let url;
  if (statusUrl) {
    url = statusUrl;
  } else {
    // Construir URL de status
    const modelPath = model === 'hd' ? MODELS.UPSCALE : MODELS.DRAFT;
    url = `${FAL_AI_BASE_URL}/${modelPath}/requests/${taskId}/status`;
  }
  
  console.log('[Worker] Consultando estado:', {
    taskId,
    model,
    statusUrl: url
  });

  // Consultar estado
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Key ${env.FAL_AI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  console.log('[Worker] Respuesta de fal.ai:', {
    status: response.status,
    statusText: response.statusText
  });

  // Leer el body una sola vez como texto
  const responseText = await response.text();
  
  // Intentar parsear como JSON
  let data;
  try {
    data = JSON.parse(responseText);
  } catch (parseError) {
    // Si no es JSON, probablemente es HTML (error de fal.ai)
    console.error('Error parseando respuesta de fal.ai:', responseText.substring(0, 200));
    return jsonResponse({ 
      error: `Error parseando respuesta de fal.ai: ${response.status}`,
      details: responseText.substring(0, 200)
    }, 500);
  }

  if (!response.ok) {
    return jsonResponse({ 
      error: data.message || data.error || 'Error from fal.ai'
    }, response.status);
  }

  // Parsear respuesta
  const status = data.status;
  
  if (status === 'COMPLETED') {
    const videoUrl = data.video?.url || data.data?.video?.url;
    const seed = data.seed || data.data?.seed;
    
    return jsonResponse({
      success: true,
      status: 'COMPLETED',
      videoUrl: videoUrl,
      seed: seed
    });
  }
  
  if (status === 'FAILED') {
    return jsonResponse({
      success: false,
      status: 'FAILED',
      error: data.error || 'Video generation failed'
    });
  }
  
  // IN_QUEUE o IN_PROGRESS
  return jsonResponse({
    success: true,
    status: status,
    queue_position: data.queue_position
  });
}

// ============================================
// HELPERS
// ============================================

function getVideoDimensions(aspectRatio, resolution) {
  const dimensions = {
    '480p': {
      '9:16': { width: 480, height: 854 },
      '16:9': { width: 854, height: 480 },
      '1:1': { width: 480, height: 480 }
    },
    '1080p': {
      '9:16': { width: 1080, height: 1920 },
      '16:9': { width: 1920, height: 1080 },
      '1:1': { width: 1080, height: 1080 }
    }
  };
  
  return dimensions[resolution][aspectRatio] || dimensions[resolution]['9:16'];
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders
    }
  });
}

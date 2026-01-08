const FAL_AI_API_KEY = process.env.FAL_AI_API_KEY;
const FAL_AI_BASE_URL = 'https://queue.fal.run';

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!FAL_AI_API_KEY) {
      throw new Error('FAL_AI_API_KEY no configurada');
    }

    const body = JSON.parse(event.body || '{}');
    const { model, prompt, imageUrl, strength, guidanceScale, steps, seed, aspectRatio, negativePrompt } = body;

    // Validación: model siempre requerido
    // prompt requerido SOLO si NO hay imagen de referencia
    if (!model) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'model es requerido' }),
      };
    }
    
    // Si no hay imagen de referencia, el prompt es obligatorio
    if (!imageUrl && !prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'prompt es requerido cuando no hay imagen de referencia' }),
      };
    }

    console.log('🚀 [fal.ai Function] Iniciando generación...');
    console.log('📝 [fal.ai Function] Modelo:', model);
    console.log('📝 [fal.ai Function] Prompt length:', prompt.length);
    console.log('🖼️ [fal.ai Function] Tiene imagen de referencia:', !!imageUrl);

    // Convertir aspect ratio a dimensiones
    const aspectRatioMap = {
      '9:16': { width: 768, height: 1344 },
      '1:1': { width: 1024, height: 1024 },
      '16:9': { width: 1344, height: 768 },
      '4:5': { width: 832, height: 1024 },
      '3:4': { width: 768, height: 1024 },
    };

    const dimensions = aspectRatioMap[aspectRatio || '9:16'] || aspectRatioMap['9:16'];

    // Construir request para fal.ai
    const requestBody = {
      prompt,
      guidance_scale: guidanceScale || 7.5,
      num_inference_steps: steps || 20,
      image_size: dimensions,
      enable_safety_checker: false,
    };

    // Si hay imagen de referencia, agregar parámetros de img2img
    if (imageUrl) {
      requestBody.image_url = imageUrl;
      requestBody.strength = strength || 0.3;
    }

    // Agregar seed si existe
    if (seed !== undefined && seed !== null) {
      requestBody.seed = seed;
    }

    // Agregar negative prompt si existe
    if (negativePrompt) {
      requestBody.negative_prompt = negativePrompt;
    }

    console.log('📡 [fal.ai Function] Enviando request...');

    // Llamar a fal.ai
    const response = await fetch(`${FAL_AI_BASE_URL}/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [fal.ai Function] Error HTTP ${response.status}:`, errorText);
      throw new Error(`fal.ai error: ${response.status} - ${errorText.substring(0, 200)}`);
    }

    const data = await response.json();
    console.log('✅ [fal.ai Function] Respuesta recibida');

    // Manejar sistema de cola
    if (data.status === 'IN_QUEUE' || data.status === 'IN_PROGRESS') {
      console.log('⏳ [fal.ai Function] Imagen en cola...');

      const maxAttempts = 60;
      const pollInterval = 2000;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));

        const statusResponse = await fetch(data.status_url, {
          headers: { 'Authorization': `Key ${FAL_AI_API_KEY}` },
        });

        if (!statusResponse.ok) continue;

        const statusData = await statusResponse.json();

        if (statusData.status === 'COMPLETED') {
          const resultResponse = await fetch(data.response_url, {
            headers: { 'Authorization': `Key ${FAL_AI_API_KEY}` },
          });

          const resultData = await resultResponse.json();
          const generatedImageUrl = resultData.images?.[0]?.url || resultData.image?.url || resultData.url;

          if (!generatedImageUrl) {
            throw new Error('No se encontró imagen en resultado');
          }

          console.log('✅ [fal.ai Function] Imagen generada exitosamente');

          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              imageUrl: generatedImageUrl,
              seed: resultData.seed || seed,
            }),
          };
        } else if (statusData.status === 'FAILED') {
          throw new Error(`Generación falló: ${statusData.error}`);
        }
      }

      throw new Error('Timeout esperando resultado (2 minutos)');
    }

    // Respuesta síncrona
    const generatedImageUrl = data.images?.[0]?.url || data.image?.url || data.url;

    if (!generatedImageUrl) {
      throw new Error('No se encontró imagen en respuesta');
    }

    console.log('✅ [fal.ai Function] Imagen generada exitosamente');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        imageUrl: generatedImageUrl,
        seed: data.seed || seed,
      }),
    };

  } catch (error) {
    console.error('❌ [fal.ai Function] Error:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Error desconocido',
      }),
    };
  }
};

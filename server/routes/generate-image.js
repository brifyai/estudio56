import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { prompt, model = 'flux-pro' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('🎨 [Generate Image] Generando imagen con prompt:', prompt.substring(0, 100));

    const FAL_AI_API_KEY = process.env.FAL_AI_API_KEY;
    if (!FAL_AI_API_KEY) {
      throw new Error('FAL_AI_API_KEY no configurada');
    }

    // Usar FAL AI para generar imagen
    const response = await fetch('https://api.fal.ai/v1/flux-pro/text-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${FAL_AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        image_size: 'landscape_4_3',
        num_inference_steps: 28,
        enable_safety_checker: true
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [FAL AI] Error:', errorText);
      throw new Error(`FAL AI error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ [Generate Image] Imagen generada:', data.images?.[0]?.url?.substring(0, 50));

    res.json({
      success: true,
      image: data.images?.[0]?.url,
      data
    });

  } catch (error) {
    console.error('❌ [Generate Image] Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error al generar imagen' 
    });
  }
});

export default router;

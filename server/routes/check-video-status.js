import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { requestId } = req.body;
    
    if (!requestId) {
      return res.status(400).json({ error: 'requestId is required' });
    }

    console.log('🎬 [Check Video Status] Verificando estado:', requestId);

    const FAL_AI_API_KEY = process.env.FAL_AI_API_KEY;
    if (!FAL_AI_API_KEY) {
      throw new Error('FAL_AI_API_KEY no configurada');
    }

    // Verificar estado en FAL AI
    const response = await fetch(`https://api.fal.ai/v1/requests/${requestId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Key ${FAL_AI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [FAL AI] Error:', errorText);
      throw new Error(`FAL AI error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ [Check Video Status] Estado:', data.status);

    res.json({
      success: true,
      status: data.status,
      result: data.result,
      data
    });

  } catch (error) {
    console.error('❌ [Check Video Status] Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error al verificar estado' 
    });
  }
});

export default router;

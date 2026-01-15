import express from 'express';
import { GoogleAuth } from 'google-auth-library';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log('🔍 [Analyze Brand Vertex] Analizando URL:', url);

    const projectId = process.env.VITE_GOOGLE_VERTEX_PROJECT || 'stratega-ai-x';
    const location = process.env.VITE_GOOGLE_VERTEX_LOCATION || 'us-central1';
    const model = 'gemini-2.0-flash-exp';

    const analysisPrompt = `VISITA Y ANALIZA el sitio web: ${url}

TAREA PRINCIPAL: Extraer los COLORES CORPORATIVOS REALES de esta marca.

CÓMO ENCONTRAR LOS COLORES:
1. LOGO: El color dominante del logo es el color primario
2. BOTONES: Los botones de acción (Comprar, Reservar, etc) usan el color de acento
3. HEADER: El color de fondo o texto del menú de navegación
4. LINKS: El color de los enlaces suele ser el color secundario

EJEMPLOS DE COLORES REALES POR TIPO DE NEGOCIO:
- Estudios de Pilates/Yoga: suelen usar rosa dusty (#D4A5A5), verde sage (#9CAF88), terracota (#C4A484)
- Restaurantes: rojo (#C41E3A), naranja (#E85D04), dorado (#DAA520)
- Tech/Startups: azul (#2563EB), morado (#7C3AED), verde (#10B981)
- Salud/Clínicas: azul confianza (#1E40AF), verde médico (#059669)
- Moda: negro elegante (#1A1A1A), dorado (#B8860B), beige (#D4C4B5)

RESPONDE SOLO CON ESTE JSON (sin explicaciones):
{
  "colors": ["#colorPrimarioReal", "#colorSecundarioReal"],
  "basePrompt": "professional photo of [producto/servicio del negocio]",
  "fontCategory": "sans-serif",
  "copy": {
    "headline": "Frase impactante en español",
    "subhead": "Descripción breve en español",
    "cta": "Acción en español"
  }
}

IMPORTANTE:
- Los colores DEBEN ser extraídos del sitio web real, NO inventados
- NO uses #000000 (negro) ni #FFFFFF (blanco) como primario
- El basePrompt debe describir lo que VENDE el negocio
- Todo el copy en ESPAÑOL chileno`;

    const vertexUrl = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;

    // Obtener token de acceso
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });
    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    if (!accessToken.token) {
      throw new Error('No se pudo obtener token de acceso');
    }

    const response = await fetch(vertexUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: analysisPrompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          topP: 0.8,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [Vertex AI] Error:', errorText);
      throw new Error(`Vertex AI error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('Sin respuesta de Vertex AI');
    }

    console.log('📝 [Vertex AI] Respuesta:', text.substring(0, 200));

    // Extraer JSON de la respuesta
    let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('La IA no devolvió JSON válido');
    }
    
    jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    const branding = JSON.parse(jsonStr);

    console.log('✅ [Analyze Brand Vertex] Branding extraído:', branding);

    res.json({
      success: true,
      branding
    });

  } catch (error) {
    console.error('❌ [Analyze Brand Vertex] Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Error al analizar URL' 
    });
  }
});

export default router;

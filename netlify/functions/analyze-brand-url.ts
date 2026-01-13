import { Handler } from '@netlify/functions';

interface BrandAnalysis {
  name: string;
  tagline: string;
  description: string;
  mission: string;
  vision: string;
  industry: string;
  logoUrl: string | null;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
  };
  socialType: 'instagram' | 'facebook' | 'tiktok' | 'web';
}

// Llamar a Gemini API directamente con fetch
async function callGeminiAPI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('🔑 GEMINI_API_KEY exists:', !!apiKey);
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in environment');
    throw new Error('GEMINI_API_KEY not configured');
  }

  console.log('📤 Calling Gemini API...');
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  console.log('📥 Gemini response status:', response.status);

  if (!response.ok) {
    const error = await response.text();
    console.error('❌ Gemini API error:', error);
    throw new Error(`Gemini API error: ${response.status} - ${error.substring(0, 200)}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log('✅ Gemini response length:', text.length);
  return text;
}

// Extraer contenido de URL
async function fetchUrlContent(url: string) {
  console.log('🌐 Fetching URL:', url);
  
  try {
    // Usar https nativo de Node.js para mejor compatibilidad con Netlify
    const https = await import('https');
    const http = await import('http');
    
    const fetchWithNode = (targetUrl: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const protocol = targetUrl.startsWith('https') ? https : http;
        const options = {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
          },
          timeout: 10000,
        };
        
        const req = protocol.get(targetUrl, options, (res: any) => {
          // Seguir redirects
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const redirectUrl = res.headers.location.startsWith('http') 
              ? res.headers.location 
              : new URL(res.headers.location, targetUrl).href;
            console.log('↪️ Redirect to:', redirectUrl);
            fetchWithNode(redirectUrl).then(resolve).catch(reject);
            return;
          }
          
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}`));
            return;
          }
          
          let data = '';
          res.on('data', (chunk: any) => { data += chunk; });
          res.on('end', () => resolve(data));
        });
        
        req.on('error', reject);
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Timeout'));
        });
      });
    };

    const html = await fetchWithNode(url);
    console.log('📄 HTML length:', html.length);

    // Extraer título
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extraer meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
    const description = descMatch ? descMatch[1].trim() : '';

    const logoImages: string[] = [];
    
    // og:image
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    if (ogMatch) logoImages.push(ogMatch[1]);

    // apple-touch-icon
    const appleMatches = html.matchAll(/<link[^>]*rel=["']apple-touch-icon[^"']*["'][^>]*href=["']([^"']+)["']/gi);
    for (const m of appleMatches) logoImages.push(m[1]);

    // favicon
    const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i);
    if (faviconMatch) logoImages.push(faviconMatch[1]);

    // imágenes con "logo"
    const logoMatches = html.matchAll(/<img[^>]*src=["']([^"']*logo[^"']*)["'][^>]*>/gi);
    for (const m of logoMatches) if (m[1] && !logoImages.includes(m[1])) logoImages.push(m[1]);

    // header images
    const headerMatch = html.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
    if (headerMatch) {
      const headerImgs = headerMatch[1].matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi);
      for (const m of headerImgs) if (m[1] && !logoImages.includes(m[1])) logoImages.push(m[1]);
    }

    // Limpiar HTML
    const cleanHtml = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .substring(0, 4000);

    console.log('✅ Extracted:', { title, descLength: description.length, logos: logoImages.length });
    return { html: cleanHtml, title, description, logoImages };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown';
    console.error('❌ Error fetching URL:', errorMsg);
    // Devolver datos mínimos para que Gemini genere contenido basado en la URL
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '');
    return { html: '', title: domain, description: '', logoImages: [] };
  }
}

function detectUrlType(url: string): 'instagram' | 'facebook' | 'tiktok' | 'web' {
  const lower = url.toLowerCase();
  if (lower.includes('instagram.com')) return 'instagram';
  if (lower.includes('facebook.com')) return 'facebook';
  if (lower.includes('tiktok.com')) return 'tiktok';
  return 'web';
}

function extractUsername(url: string, type: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    if (type !== 'web') return pathParts[0]?.replace('@', '') || '';
    return urlObj.hostname.replace('www.', '').split('.')[0] || '';
  } catch {
    return '';
  }
}

function resolveUrl(base: string, relative: string): string {
  try {
    return new URL(relative, base).href;
  } catch {
    return relative;
  }
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { url } = JSON.parse(event.body || '{}');

    if (!url) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'URL is required' }) };
    }

    console.log('🔍 Analizando URL:', url);

    const urlType = detectUrlType(url);
    const username = extractUsername(url, urlType);
    const { html, title, description, logoImages } = await fetchUrlContent(url);

    console.log('📄 Contenido:', { title, description, logos: logoImages.length });

    // Prompt para Gemini
    const prompt = `Eres un experto en branding. Analiza este contenido y genera información para un manual de marca.

URL: ${url}
Título: ${title}
Descripción: ${description}
Contenido: ${html.substring(0, 3000)}

Genera un JSON con esta estructura exacta (sin markdown, solo JSON puro):
{
  "name": "Nombre de la marca",
  "tagline": "Eslogan memorable (máximo 8 palabras)",
  "description": "Descripción completa de la empresa en 3-4 oraciones. Qué hace, a quién sirve, qué la hace única.",
  "mission": "Misión de la empresa en 2-3 oraciones. Propósito fundamental.",
  "vision": "Visión de la empresa en 2-3 oraciones. Aspiraciones a largo plazo.",
  "industry": "Sector (tecnología, retail, servicios, etc)",
  "suggestedColors": {
    "primary": "#hexcolor",
    "secondary": "#hexcolor",
    "accent": "#hexcolor",
    "neutral": "#hexcolor"
  }
}

IMPORTANTE: Responde SOLO con el JSON, sin explicaciones ni markdown. Todo en español.`;

    // Llamar a Gemini
    const responseText = await callGeminiAPI(prompt);
    console.log('🤖 Gemini response:', responseText.substring(0, 200));

    // Parsear respuesta
    let analysis: any;
    try {
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanJson);
    } catch {
      console.log('⚠️ Error parsing, usando fallback');
      analysis = {
        name: username || title.split('|')[0].trim() || 'Mi Marca',
        tagline: 'Innovación y calidad',
        description: description || 'Una marca comprometida con la excelencia.',
        mission: 'Ofrecer productos y servicios de la más alta calidad.',
        vision: 'Ser líderes en nuestro sector.',
        industry: 'general',
        suggestedColors: { primary: '#3B82F6', secondary: '#1E293B', accent: '#F59E0B', neutral: '#F1F5F9' }
      };
    }

    // Resolver logos
    const resolvedLogos = logoImages.map(img => resolveUrl(url, img)).filter(img => img.startsWith('http'));
    let logoUrl: string | null = null;
    if (resolvedLogos.length > 0) {
      const withLogo = resolvedLogos.find(img => img.toLowerCase().includes('logo'));
      const pngSvg = resolvedLogos.find(img => img.endsWith('.png') || img.endsWith('.svg'));
      logoUrl = withLogo || pngSvg || resolvedLogos[0];
    }

    const brandAnalysis: BrandAnalysis = {
      name: analysis.name || username || 'Mi Marca',
      tagline: analysis.tagline || '',
      description: analysis.description || '',
      mission: analysis.mission || '',
      vision: analysis.vision || '',
      industry: analysis.industry || 'general',
      logoUrl,
      colors: {
        primary: analysis.suggestedColors?.primary || '#3B82F6',
        secondary: analysis.suggestedColors?.secondary || '#1E293B',
        accent: analysis.suggestedColors?.accent || '#F59E0B',
        neutral: analysis.suggestedColors?.neutral || '#F1F5F9',
      },
      socialType: urlType,
    };

    console.log('✅ Análisis completado:', brandAnalysis.name);

    return { statusCode: 200, headers, body: JSON.stringify(brandAnalysis) };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('❌ Error:', errorMessage);
    console.error('📋 Stack:', errorStack);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error analyzing URL', 
        details: errorMessage,
        hint: errorMessage.includes('GEMINI_API_KEY') 
          ? 'Verifica que GEMINI_API_KEY esté configurada en Netlify' 
          : 'Revisa los logs de Netlify para más detalles'
      }),
    };
  }
};

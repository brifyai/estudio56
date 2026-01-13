import { Handler } from '@netlify/functions';
import https from 'https';
import http from 'http';

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

// ============================================
// FETCH HTML CON NODE.JS NATIVO
// ============================================
async function fetchHtml(targetUrl: string, maxRedirects = 5): Promise<string> {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      reject(new Error('Too many redirects'));
      return;
    }

    const protocol = targetUrl.startsWith('https') ? https : http;
    const urlObj = new URL(targetUrl);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (targetUrl.startsWith('https') ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Accept-Encoding': 'identity',
        'Connection': 'keep-alive',
      },
      timeout: 15000,
    };

    const req = protocol.request(options, (res) => {
      // Manejar redirects
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, targetUrl).href;
        console.log(`↪️ Redirect ${res.statusCode} to:`, redirectUrl);
        fetchHtml(redirectUrl, maxRedirects - 1).then(resolve).catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(data));
      res.on('error', reject);
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// ============================================
// EXTRACCIÓN AVANZADA DE LOGOS
// ============================================
interface LogoCandidate {
  url: string;
  score: number;
  source: string;
}

function extractLogoCandidates(html: string, baseUrl: string): LogoCandidate[] {
  const candidates: LogoCandidate[] = [];
  const seen = new Set<string>();

  const addCandidate = (url: string, score: number, source: string) => {
    if (!url || seen.has(url)) return;
    
    // Resolver URL relativa
    let resolvedUrl: string;
    try {
      resolvedUrl = new URL(url, baseUrl).href;
    } catch {
      return;
    }
    
    // Filtrar URLs inválidas
    if (!resolvedUrl.startsWith('http')) return;
    if (resolvedUrl.includes('data:')) return;
    if (resolvedUrl.includes('tracking') || resolvedUrl.includes('pixel') || resolvedUrl.includes('analytics')) return;
    
    seen.add(resolvedUrl);
    
    // Bonus por extensión de imagen
    const ext = resolvedUrl.toLowerCase();
    let extBonus = 0;
    if (ext.endsWith('.svg')) extBonus = 30;
    else if (ext.endsWith('.png')) extBonus = 20;
    else if (ext.endsWith('.webp')) extBonus = 15;
    else if (ext.endsWith('.jpg') || ext.endsWith('.jpeg')) extBonus = 5;
    
    // Bonus por nombre de archivo
    const urlLower = resolvedUrl.toLowerCase();
    let nameBonus = 0;
    if (urlLower.includes('logo')) nameBonus += 50;
    if (urlLower.includes('brand')) nameBonus += 30;
    if (urlLower.includes('icon')) nameBonus += 10;
    if (urlLower.includes('favicon')) nameBonus += 5;
    
    // Penalización por tamaños pequeños típicos de iconos
    if (urlLower.includes('16x16') || urlLower.includes('32x32')) nameBonus -= 20;
    if (urlLower.includes('favicon')) nameBonus -= 10;
    
    candidates.push({
      url: resolvedUrl,
      score: score + extBonus + nameBonus,
      source
    });
  };

  // 1. Open Graph image (muy confiable para logos/branding)
  const ogImagePatterns = [
    /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/gi,
    /<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/gi,
  ];
  for (const pattern of ogImagePatterns) {
    const matches = html.matchAll(pattern);
    for (const m of matches) addCandidate(m[1], 80, 'og:image');
  }

  // 2. Twitter card image
  const twitterPatterns = [
    /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/gi,
    /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/gi,
  ];
  for (const pattern of twitterPatterns) {
    const matches = html.matchAll(pattern);
    for (const m of matches) addCandidate(m[1], 75, 'twitter:image');
  }

  // 3. Apple touch icons (alta calidad, cuadrados)
  const applePatterns = [
    /<link[^>]*rel=["']apple-touch-icon[^"']*["'][^>]*href=["']([^"']+)["']/gi,
    /<link[^>]*href=["']([^"']+)["'][^>]*rel=["']apple-touch-icon[^"']*["']/gi,
  ];
  for (const pattern of applePatterns) {
    const matches = html.matchAll(pattern);
    for (const m of matches) addCandidate(m[1], 70, 'apple-touch-icon');
  }

  // 4. Imágenes dentro de <header> o <nav> con clase/id que contenga "logo"
  const headerNavMatch = html.match(/<(?:header|nav)[^>]*>[\s\S]*?<\/(?:header|nav)>/gi);
  if (headerNavMatch) {
    for (const section of headerNavMatch) {
      // Buscar imágenes con atributos relacionados a logo
      const logoImgPatterns = [
        /<img[^>]*(?:class|id)=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/gi,
        /<img[^>]*src=["']([^"']+)["'][^>]*(?:class|id)=["'][^"']*logo[^"']*["']/gi,
        /<img[^>]*src=["']([^"']*logo[^"']*)["']/gi,
      ];
      for (const pattern of logoImgPatterns) {
        const matches = section.matchAll(pattern);
        for (const m of matches) addCandidate(m[1], 90, 'header/nav logo');
      }
      
      // Cualquier imagen en header/nav
      const anyImgMatches = section.matchAll(/<img[^>]*src=["']([^"']+)["']/gi);
      for (const m of anyImgMatches) addCandidate(m[1], 60, 'header/nav img');
    }
  }

  // 5. Elementos con clase/id "logo" que contengan imágenes
  const logoContainerPatterns = [
    /<[^>]*(?:class|id)=["'][^"']*logo[^"']*["'][^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["']/gi,
    /<a[^>]*(?:class|id)=["'][^"']*(?:logo|brand|navbar-brand)[^"']*["'][^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["']/gi,
  ];
  for (const pattern of logoContainerPatterns) {
    const matches = html.matchAll(pattern);
    for (const m of matches) addCandidate(m[1], 85, 'logo container');
  }

  // 6. Imágenes con "logo" en src o alt
  const logoSrcPatterns = [
    /<img[^>]*src=["']([^"']*logo[^"']*)["']/gi,
    /<img[^>]*alt=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/gi,
  ];
  for (const pattern of logoSrcPatterns) {
    const matches = html.matchAll(pattern);
    for (const m of matches) addCandidate(m[1], 75, 'logo in src/alt');
  }

  // 7. SVG inline con clase logo
  const svgLogoMatch = html.match(/<svg[^>]*(?:class|id)=["'][^"']*logo[^"']*["'][^>]*>[\s\S]*?<\/svg>/gi);
  if (svgLogoMatch) {
    // No podemos usar SVG inline directamente, pero indica que hay logo
    console.log('📌 Found inline SVG logo');
  }

  // 8. Favicon como último recurso
  const faviconPatterns = [
    /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/gi,
    /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/gi,
  ];
  for (const pattern of faviconPatterns) {
    const matches = html.matchAll(pattern);
    for (const m of matches) addCandidate(m[1], 30, 'favicon');
  }

  // 9. Manifest icon
  const manifestMatch = html.match(/<link[^>]*rel=["']manifest["'][^>]*href=["']([^"']+)["']/i);
  if (manifestMatch) {
    // El manifest puede tener iconos de alta calidad
    addCandidate(manifestMatch[1].replace('manifest.json', 'icon-512.png'), 40, 'manifest guess');
    addCandidate(manifestMatch[1].replace('manifest.json', 'icon-192.png'), 35, 'manifest guess');
  }

  // Ordenar por score
  candidates.sort((a, b) => b.score - a.score);
  
  console.log('🖼️ Logo candidates:', candidates.slice(0, 5).map(c => ({ url: c.url.substring(0, 60), score: c.score, source: c.source })));
  
  return candidates;
}

// ============================================
// EXTRACCIÓN DE METADATOS
// ============================================
function extractMetadata(html: string) {
  // Título
  let title = '';
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) title = titleMatch[1].trim();
  
  // og:title como alternativa
  if (!title) {
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    if (ogTitleMatch) title = ogTitleMatch[1].trim();
  }

  // Descripción
  let description = '';
  const descPatterns = [
    /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i,
    /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i,
  ];
  for (const pattern of descPatterns) {
    const match = html.match(pattern);
    if (match) {
      description = match[1].trim();
      break;
    }
  }

  // Limpiar HTML para contenido
  const cleanHtml = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 5000);

  return { title, description, cleanHtml };
}

// ============================================
// LLAMADA A GEMINI API
// ============================================
async function callGeminiAPI(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('🔑 GEMINI_API_KEY exists:', !!apiKey);
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

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
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

// ============================================
// UTILIDADES
// ============================================
function detectUrlType(url: string): 'instagram' | 'facebook' | 'tiktok' | 'web' {
  const lower = url.toLowerCase();
  if (lower.includes('instagram.com')) return 'instagram';
  if (lower.includes('facebook.com')) return 'facebook';
  if (lower.includes('tiktok.com')) return 'tiktok';
  return 'web';
}

function extractBrandName(url: string, title: string): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace('www.', '').split('.')[0];
    
    // Limpiar título
    if (title) {
      // Remover sufijos comunes
      const cleanTitle = title
        .split(/[|\-–—]/)[0]
        .replace(/home|inicio|bienvenido/gi, '')
        .trim();
      if (cleanTitle.length > 2 && cleanTitle.length < 50) {
        return cleanTitle;
      }
    }
    
    // Capitalizar dominio
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return 'Mi Marca';
  }
}

// ============================================
// HANDLER PRINCIPAL
// ============================================
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
    
    // Intentar obtener HTML
    let html = '';
    let fetchSuccess = false;
    
    try {
      html = await fetchHtml(url);
      fetchSuccess = true;
      console.log('✅ HTML obtenido:', html.length, 'caracteres');
    } catch (fetchError) {
      console.error('⚠️ Error fetching HTML:', fetchError instanceof Error ? fetchError.message : 'Unknown');
    }

    // Extraer metadatos
    const { title, description, cleanHtml } = extractMetadata(html);
    console.log('📄 Metadata:', { title: title.substring(0, 50), descLength: description.length });

    // Extraer candidatos de logo
    const logoCandidates = extractLogoCandidates(html, url);
    const bestLogo = logoCandidates.length > 0 ? logoCandidates[0].url : null;
    console.log('🖼️ Best logo:', bestLogo);

    // Construir prompt para Gemini
    const brandName = extractBrandName(url, title);
    
    const prompt = `Eres un experto en branding y marketing. Analiza la siguiente información de una página web y genera contenido profesional para un manual de identidad de marca.

URL: ${url}
Nombre detectado: ${brandName}
Título de la página: ${title}
Descripción meta: ${description}
${fetchSuccess ? `Contenido de la página: ${cleanHtml.substring(0, 3000)}` : 'No se pudo obtener el contenido de la página.'}

Basándote en esta información, genera un JSON con la siguiente estructura exacta (sin markdown, solo JSON puro):

{
  "name": "Nombre oficial de la marca (usa el nombre detectado si no encuentras otro)",
  "tagline": "Un eslogan memorable y profesional de máximo 8 palabras que capture la esencia de la marca",
  "description": "Descripción profesional de la empresa en 3-4 oraciones. Explica qué hace, a quién sirve y qué la hace única. Si no hay información, crea una descripción coherente basada en el nombre y sector.",
  "mission": "Declaración de misión profesional en 2-3 oraciones. El propósito fundamental de la empresa.",
  "vision": "Declaración de visión profesional en 2-3 oraciones. Las aspiraciones a largo plazo.",
  "industry": "Sector o industria (ej: salud, tecnología, retail, servicios, fitness, gastronomía, etc)",
  "suggestedColors": {
    "primary": "#hexcolor (color principal que represente la marca)",
    "secondary": "#hexcolor (color secundario para textos y contrastes)",
    "accent": "#hexcolor (color de acento para CTAs y destacados)",
    "neutral": "#hexcolor (color neutro para fondos)"
  }
}

IMPORTANTE:
- Responde SOLO con el JSON, sin explicaciones ni markdown
- Todo el contenido debe estar en español
- Los colores deben ser coherentes entre sí y apropiados para el sector
- Si la marca parece ser de fitness/salud, usa colores energéticos
- Si es tecnología, usa colores modernos y profesionales
- Si es gastronomía, usa colores cálidos y apetitosos`;

    // Llamar a Gemini
    console.log('📤 Llamando a Gemini...');
    const responseText = await callGeminiAPI(prompt);
    console.log('🤖 Gemini response length:', responseText.length);

    // Parsear respuesta
    let analysis: any;
    try {
      const cleanJson = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      analysis = JSON.parse(cleanJson);
      console.log('✅ JSON parseado correctamente');
    } catch (parseError) {
      console.error('⚠️ Error parsing JSON, usando fallback');
      analysis = {
        name: brandName,
        tagline: 'Excelencia y compromiso',
        description: description || `${brandName} es una empresa comprometida con ofrecer productos y servicios de la más alta calidad a sus clientes.`,
        mission: `Nuestra misión es proporcionar soluciones excepcionales que superen las expectativas de nuestros clientes.`,
        vision: `Ser reconocidos como líderes en nuestro sector, destacando por la innovación y la excelencia en el servicio.`,
        industry: 'general',
        suggestedColors: {
          primary: '#3B82F6',
          secondary: '#1E293B',
          accent: '#F59E0B',
          neutral: '#F3F4F6'
        }
      };
    }

    // Construir respuesta final
    const brandAnalysis: BrandAnalysis = {
      name: analysis.name || brandName,
      tagline: analysis.tagline || '',
      description: analysis.description || '',
      mission: analysis.mission || '',
      vision: analysis.vision || '',
      industry: analysis.industry || 'general',
      logoUrl: bestLogo,
      colors: {
        primary: analysis.suggestedColors?.primary || '#3B82F6',
        secondary: analysis.suggestedColors?.secondary || '#1E293B',
        accent: analysis.suggestedColors?.accent || '#F59E0B',
        neutral: analysis.suggestedColors?.neutral || '#F3F4F6',
      },
      socialType: urlType,
    };

    console.log('✅ Análisis completado:', {
      name: brandAnalysis.name,
      hasLogo: !!brandAnalysis.logoUrl,
      colors: brandAnalysis.colors
    });

    return { statusCode: 200, headers, body: JSON.stringify(brandAnalysis) };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error:', errorMessage);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error analyzing URL', 
        details: errorMessage,
      }),
    };
  }
};

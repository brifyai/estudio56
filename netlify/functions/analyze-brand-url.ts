import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

// Función para extraer contenido de una URL
async function fetchUrlContent(url: string): Promise<{ html: string; title: string; description: string; images: string[]; logoImages: string[] }> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Extraer título
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extraer meta description
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i);
    const description = descMatch ? descMatch[1].trim() : '';

    // Arrays separados para logos e imágenes generales
    const logoImages: string[] = [];
    const images: string[] = [];
    
    // 1. PRIORIDAD ALTA: Buscar og:image (suele ser el logo o imagen principal)
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                         html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (ogImageMatch) {
      logoImages.push(ogImageMatch[1]);
    }

    // 2. PRIORIDAD ALTA: Buscar apple-touch-icon (suele ser el logo de alta calidad)
    const appleTouchMatches = html.matchAll(/<link[^>]*rel=["']apple-touch-icon[^"']*["'][^>]*href=["']([^"']+)["']/gi);
    for (const match of appleTouchMatches) {
      logoImages.push(match[1]);
    }

    // 3. PRIORIDAD ALTA: Buscar imágenes con "logo" en src, class, id o alt
    const logoPatterns = [
      /<img[^>]*src=["']([^"']*logo[^"']*)["'][^>]*>/gi,
      /<img[^>]*class=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/gi,
      /<img[^>]*id=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/gi,
      /<img[^>]*alt=["'][^"']*logo[^"']*["'][^>]*src=["']([^"']+)["']/gi,
    ];
    
    for (const pattern of logoPatterns) {
      const matches = html.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && !logoImages.includes(match[1])) {
          logoImages.push(match[1]);
        }
      }
    }

    // 4. Buscar imágenes dentro de header o nav (suelen contener el logo)
    const headerMatch = html.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
    const navMatch = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/i);
    const headerNavContent = (headerMatch?.[1] || '') + (navMatch?.[1] || '');
    
    const headerImgMatches = headerNavContent.matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi);
    for (const match of headerImgMatches) {
      if (match[1] && !logoImages.includes(match[1])) {
        logoImages.push(match[1]);
      }
    }

    // 5. Buscar SVG con logo en el nombre o clase
    const svgLogoMatches = html.matchAll(/<(?:img|object|embed)[^>]*(?:src|data)=["']([^"']*\.svg[^"']*)["'][^>]*>/gi);
    for (const match of svgLogoMatches) {
      if (match[1] && match[1].toLowerCase().includes('logo')) {
        logoImages.push(match[1]);
      }
    }

    // 6. Favicon como último recurso
    const faviconMatches = html.matchAll(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/gi);
    for (const match of faviconMatches) {
      images.push(match[1]); // Agregar a images generales, no a logoImages
    }

    // Limpiar texto HTML para análisis
    const cleanHtml = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .substring(0, 5000);

    console.log('🖼️ Logos encontrados:', logoImages.length, logoImages);
    console.log('🖼️ Imágenes generales:', images.length);

    return { html: cleanHtml, title, description, images, logoImages };
  } catch (error) {
    console.error('Error fetching URL:', error);
    return { html: '', title: '', description: '', images: [], logoImages: [] };
  }
}

// Detectar tipo de URL
function detectUrlType(url: string): 'instagram' | 'facebook' | 'tiktok' | 'web' {
  const lower = url.toLowerCase();
  if (lower.includes('instagram.com') || lower.includes('instagr.am')) return 'instagram';
  if (lower.includes('facebook.com') || lower.includes('fb.com')) return 'facebook';
  if (lower.includes('tiktok.com')) return 'tiktok';
  return 'web';
}

// Extraer nombre de usuario de redes sociales
function extractUsername(url: string, type: string): string {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    if (type === 'instagram' || type === 'tiktok' || type === 'facebook') {
      return pathParts[0]?.replace('@', '') || '';
    }
    
    return urlObj.hostname.replace('www.', '').split('.')[0] || '';
  } catch {
    return '';
  }
}

// Resolver URL relativa a absoluta
function resolveUrl(base: string, relative: string): string {
  try {
    return new URL(relative, base).href;
  } catch {
    return relative;
  }
}

export const handler: Handler = async (event) => {
  // CORS headers
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
    const { html, title, description, images, logoImages } = await fetchUrlContent(url);

    console.log('📄 Contenido extraído:', { title, description, logoImagesCount: logoImages.length, imagesCount: images.length });

    // Usar Gemini para analizar el contenido
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analiza el siguiente contenido de una ${urlType === 'web' ? 'página web' : `cuenta de ${urlType}`} y genera información para un manual de identidad de marca.

URL: ${url}
Tipo: ${urlType}
Usuario/Dominio: ${username}
Título: ${title}
Descripción meta: ${description}

Contenido de la página (extracto):
${html.substring(0, 3000)}

Basándote en esta información, genera un JSON con la siguiente estructura. Sé creativo pero coherente con el contenido real de la página. Si no hay suficiente información, infiere basándote en el tipo de negocio/cuenta:

{
  "name": "Nombre de la marca (extraído o inferido)",
  "tagline": "Un eslogan atractivo y memorable (máximo 10 palabras)",
  "description": "Descripción de la empresa/marca en 2-3 oraciones. Qué hacen, a quién sirven.",
  "mission": "Declaración de misión en 1-2 oraciones. El propósito de la marca.",
  "vision": "Declaración de visión en 1-2 oraciones. Hacia dónde se dirige la marca.",
  "industry": "Industria o sector (ej: tecnología, moda, gastronomía, servicios)",
  "suggestedColors": {
    "primary": "#hexcolor - color principal que represente la marca",
    "secondary": "#hexcolor - color secundario para contraste",
    "accent": "#hexcolor - color de acento para CTAs",
    "neutral": "#hexcolor - color neutro para fondos"
  }
}

IMPORTANTE: 
- Responde SOLO con el JSON, sin markdown ni explicaciones.
- Los colores deben ser códigos hexadecimales válidos.
- El contenido debe estar en español.
- Sé profesional y coherente con la identidad visual que percibes.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log('🤖 Respuesta Gemini:', responseText);

    // Parsear respuesta JSON
    let analysis: any;
    try {
      // Limpiar posibles caracteres extra
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // Fallback con datos básicos
      analysis = {
        name: username || title.split('|')[0].split('-')[0].trim() || 'Mi Marca',
        tagline: description.substring(0, 50) || 'Innovación y calidad',
        description: description || 'Una marca comprometida con la excelencia.',
        mission: 'Ofrecer productos y servicios de la más alta calidad.',
        vision: 'Ser líderes en nuestro sector.',
        industry: 'general',
        suggestedColors: {
          primary: '#3B82F6',
          secondary: '#1E293B',
          accent: '#F59E0B',
          neutral: '#F1F5F9'
        }
      };
    }

    // Resolver URLs de imágenes - priorizar logoImages
    const resolvedLogoImages = logoImages.map(img => resolveUrl(url, img)).filter(img => img.startsWith('http'));
    const resolvedImages = images.map(img => resolveUrl(url, img)).filter(img => img.startsWith('http'));
    
    // Buscar el mejor logo candidato con prioridad mejorada
    let logoUrl: string | null = null;
    
    if (resolvedLogoImages.length > 0) {
      // Priorizar: 1) imágenes con "logo" explícito, 2) PNG/SVG sobre otros formatos, 3) primera imagen
      const withLogoInName = resolvedLogoImages.find(img => img.toLowerCase().includes('logo'));
      const pngOrSvg = resolvedLogoImages.find(img => img.toLowerCase().endsWith('.png') || img.toLowerCase().endsWith('.svg'));
      logoUrl = withLogoInName || pngOrSvg || resolvedLogoImages[0];
    } else if (resolvedImages.length > 0) {
      // Fallback a imágenes generales
      const logoCandidate = resolvedImages.find(img => img.toLowerCase().includes('logo'));
      logoUrl = logoCandidate || resolvedImages[0];
    }

    console.log('🎯 Logo seleccionado:', logoUrl);

    const brandAnalysis: BrandAnalysis = {
      name: analysis.name || username || 'Mi Marca',
      tagline: analysis.tagline || '',
      description: analysis.description || '',
      mission: analysis.mission || '',
      vision: analysis.vision || '',
      industry: analysis.industry || 'general',
      logoUrl: logoUrl,
      colors: {
        primary: analysis.suggestedColors?.primary || '#3B82F6',
        secondary: analysis.suggestedColors?.secondary || '#1E293B',
        accent: analysis.suggestedColors?.accent || '#F59E0B',
        neutral: analysis.suggestedColors?.neutral || '#F1F5F9',
      },
      socialType: urlType,
    };

    console.log('✅ Análisis completado:', brandAnalysis);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(brandAnalysis),
    };

  } catch (error) {
    console.error('❌ Error en analyze-brand-url:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error analyzing URL',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};

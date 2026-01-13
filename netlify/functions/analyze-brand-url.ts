import { Handler } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
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

    const logoImages: string[] = [];
    const images: string[] = [];
    
    // Buscar og:image
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i);
    if (ogImageMatch) logoImages.push(ogImageMatch[1]);

    // Buscar apple-touch-icon
    const appleTouchMatches = html.matchAll(/<link[^>]*rel=["']apple-touch-icon[^"']*["'][^>]*href=["']([^"']+)["']/gi);
    for (const match of appleTouchMatches) logoImages.push(match[1]);

    // Buscar imágenes con "logo"
    const logoImgMatches = html.matchAll(/<img[^>]*src=["']([^"']*logo[^"']*)["'][^>]*>/gi);
    for (const match of logoImgMatches) {
      if (match[1] && !logoImages.includes(match[1])) logoImages.push(match[1]);
    }

    // Buscar en header/nav
    const headerMatch = html.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
    if (headerMatch) {
      const headerImgs = headerMatch[1].matchAll(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi);
      for (const match of headerImgs) {
        if (match[1] && !logoImages.includes(match[1])) logoImages.push(match[1]);
      }
    }

    // Favicon
    const faviconMatches = html.matchAll(/<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']+)["']/gi);
    for (const match of faviconMatches) images.push(match[1]);

    // Limpiar HTML
    const cleanHtml = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .substring(0, 5000);

    return { html: cleanHtml, title, description, images, logoImages };
  } catch (error) {
    console.error('Error fetching URL:', error);
    return { html: '', title: '', description: '', images: [], logoImages: [] };
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
    const { html, title, description, images, logoImages } = await fetchUrlContent(url);

    console.log('📄 Contenido extraído:', { title, description, logoImagesCount: logoImages.length });

    // Construir prompt
    const prompt = `Eres un experto en branding. Analiza este contenido y genera información para un manual de marca.

URL: ${url}
Título: ${title}
Descripción: ${description}
Contenido: ${html.substring(0, 3000)}

Genera un JSON con esta estructura exacta (sin markdown, solo JSON):
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

IMPORTANTE: Responde SOLO con el JSON, sin explicaciones. Contenido en español.`;

    // Llamar a Gemini
    const response = await genAI.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    const responseText = response.text || '';
    console.log('🤖 Respuesta Gemini:', responseText);

    // Parsear respuesta
    let analysis: any;
    try {
      const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanJson);
    } catch {
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
    const resolvedImages = images.map(img => resolveUrl(url, img)).filter(img => img.startsWith('http'));
    
    let logoUrl: string | null = null;
    if (resolvedLogos.length > 0) {
      const withLogo = resolvedLogos.find(img => img.toLowerCase().includes('logo'));
      const pngSvg = resolvedLogos.find(img => img.endsWith('.png') || img.endsWith('.svg'));
      logoUrl = withLogo || pngSvg || resolvedLogos[0];
    } else if (resolvedImages.length > 0) {
      logoUrl = resolvedImages[0];
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

    console.log('✅ Análisis completado:', brandAnalysis);

    return { statusCode: 200, headers, body: JSON.stringify(brandAnalysis) };

  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Error analyzing URL', details: error instanceof Error ? error.message : 'Unknown' }),
    };
  }
};

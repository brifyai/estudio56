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
  isWhiteVersion: boolean;
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
    
    const urlLower = resolvedUrl.toLowerCase();
    
    // Detectar si es versión blanca/white del logo
    const isWhiteVersion = urlLower.includes('white') || urlLower.includes('blanco') || 
                          urlLower.includes('_w.') || urlLower.includes('-w.') ||
                          urlLower.includes('light') || urlLower.includes('negative');
    
    // Bonus por extensión de imagen
    let extBonus = 0;
    if (urlLower.endsWith('.svg')) extBonus = 30;
    else if (urlLower.endsWith('.png')) extBonus = 20;
    else if (urlLower.endsWith('.webp')) extBonus = 15;
    else if (urlLower.endsWith('.jpg') || urlLower.endsWith('.jpeg')) extBonus = 5;
    
    // Bonus por nombre de archivo
    let nameBonus = 0;
    if (urlLower.includes('logo')) nameBonus += 50;
    if (urlLower.includes('brand')) nameBonus += 30;
    if (urlLower.includes('icon')) nameBonus += 10;
    if (urlLower.includes('favicon')) nameBonus += 5;
    
    // Penalización por versión blanca (preferir versión de color)
    if (isWhiteVersion) nameBonus -= 40;
    
    // Penalización por tamaños pequeños típicos de iconos
    if (urlLower.includes('16x16') || urlLower.includes('32x32')) nameBonus -= 20;
    if (urlLower.includes('favicon')) nameBonus -= 10;
    
    candidates.push({
      url: resolvedUrl,
      score: score + extBonus + nameBonus,
      source,
      isWhiteVersion
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
// EXTRACCIÓN DE COLORES DEL CSS/HTML
// ============================================
interface ExtractedColors {
  colors: string[];
  cssVariables: Record<string, string>;
  themeColor: string | null;
}

function extractColorsFromHtml(html: string): ExtractedColors {
  const colors: string[] = [];
  const cssVariables: Record<string, string> = {};
  let themeColor: string | null = null;

  // 1. Meta theme-color (muy confiable - color principal de la marca)
  const themeColorPatterns = [
    /<meta[^>]*name=["']theme-color["'][^>]*content=["']([^"']+)["']/i,
    /<meta[^>]*content=["']([^"']+)["'][^>]*name=["']theme-color["']/i,
  ];
  for (const pattern of themeColorPatterns) {
    const match = html.match(pattern);
    if (match) {
      themeColor = match[1];
      colors.push(match[1]);
      console.log('🎨 Theme color found:', themeColor);
      break;
    }
  }

  // 2. msapplication-TileColor (otro indicador de color de marca)
  const tileColorMatch = html.match(/<meta[^>]*name=["']msapplication-TileColor["'][^>]*content=["']([^"']+)["']/i);
  if (tileColorMatch && !colors.includes(tileColorMatch[1])) {
    colors.push(tileColorMatch[1]);
    console.log('🎨 Tile color found:', tileColorMatch[1]);
  }

  // 3. Variables CSS en bloques <style> y estilos inline
  const styleBlocks = html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
  const inlineStyles = html.match(/style=["'][^"']+["']/gi) || [];
  const allStyles = [...styleBlocks, ...inlineStyles].join(' ');

  // Buscar variables CSS con nombres relacionados a marca/colores
  const cssVarPatterns = [
    /--(?:primary|brand|main|accent|secondary|theme|color-primary|color-brand|color-accent)[-\w]*:\s*(#[0-9a-fA-F]{3,8}|rgb[a]?\([^)]+\))/gi,
    /--(?:bg|background|text|heading|link)[-\w]*:\s*(#[0-9a-fA-F]{3,8})/gi,
  ];
  
  for (const pattern of cssVarPatterns) {
    const matches = allStyles.matchAll(pattern);
    for (const m of matches) {
      const varName = m[0].split(':')[0].trim();
      const color = m[1].trim();
      // Ignorar colores muy claros o muy oscuros
      if (!isGenericColor(color)) {
        cssVariables[varName] = color;
        if (!colors.includes(color)) colors.push(color);
      }
    }
  }

  // 4. Colores hex directos en estilos (priorizando los que aparecen primero/más frecuentes)
  const hexPattern = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;
  const hexMatches = allStyles.match(hexPattern) || [];
  
  // Contar frecuencia de colores
  const colorFrequency: Record<string, number> = {};
  for (const hex of hexMatches) {
    const normalized = normalizeHexColor(hex);
    if (!isGenericColor(normalized)) {
      colorFrequency[normalized] = (colorFrequency[normalized] || 0) + 1;
    }
  }

  // Ordenar por frecuencia y agregar los más comunes
  const sortedColors = Object.entries(colorFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([color]) => color);
  
  for (const color of sortedColors) {
    if (!colors.includes(color)) colors.push(color);
  }

  // 5. Colores RGB
  const rgbPattern = /rgb[a]?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/gi;
  const rgbMatches = allStyles.matchAll(rgbPattern);
  for (const m of rgbMatches) {
    const hex = rgbToHex(parseInt(m[1]), parseInt(m[2]), parseInt(m[3]));
    if (!colors.includes(hex) && !isGenericColor(hex)) {
      colors.push(hex);
    }
  }

  // 6. Buscar colores en atributos de elementos (background, color en style inline)
  const inlineColorPatterns = [
    /background(?:-color)?:\s*(#[0-9a-fA-F]{3,6})/gi,
    /(?:^|;)\s*color:\s*(#[0-9a-fA-F]{3,6})/gi,
    /border(?:-color)?:\s*(#[0-9a-fA-F]{3,6})/gi,
  ];
  
  for (const pattern of inlineColorPatterns) {
    const matches = html.matchAll(pattern);
    for (const m of matches) {
      const color = normalizeHexColor(m[1]);
      if (!colors.includes(color) && !isGenericColor(color)) {
        colors.push(color);
      }
    }
  }

  console.log('🎨 Extracted colors:', colors.slice(0, 8));
  console.log('🎨 CSS variables:', Object.keys(cssVariables).length);

  return { colors: colors.slice(0, 15), cssVariables, themeColor };
}

function normalizeHexColor(hex: string): string {
  hex = hex.toLowerCase();
  // Expandir colores de 3 dígitos a 6
  if (hex.length === 4) {
    return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return hex;
}

function isGenericColor(color: string): boolean {
  const generic = [
    '#fff', '#ffffff', '#000', '#000000', 
    '#333', '#333333', '#666', '#666666', '#999', '#999999',
    '#ccc', '#cccccc', '#ddd', '#dddddd', '#eee', '#eeeeee',
    '#f5f5f5', '#f0f0f0', '#fafafa', '#f8f8f8', '#e5e5e5',
    '#111', '#111111', '#222', '#222222', '#444', '#444444',
    '#555', '#555555', '#777', '#777777', '#888', '#888888',
    '#aaa', '#aaaaaa', '#bbb', '#bbbbbb',
  ];
  return generic.includes(color.toLowerCase());
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

// ============================================
// ANÁLISIS DE LOGO CON GEMINI VISION
// ============================================
async function fetchImageAsBase64(imageUrl: string): Promise<{ base64: string; mimeType: string } | null> {
  console.log('📥 Fetching image:', imageUrl);
  
  return new Promise((resolve) => {
    try {
      const protocol = imageUrl.startsWith('https') ? https : http;
      const urlObj = new URL(imageUrl);
      
      const options = {
        hostname: urlObj.hostname,
        port: urlObj.port || (imageUrl.startsWith('https') ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'image/*',
        },
        timeout: 10000,
      };

      const req = protocol.request(options, (res) => {
        if (res.statusCode !== 200) {
          console.log('⚠️ Image fetch failed:', res.statusCode);
          resolve(null);
          return;
        }

        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const base64 = buffer.toString('base64');
          
          // Determinar MIME type
          const contentType = res.headers['content-type'] || '';
          let mimeType = 'image/png';
          if (contentType.includes('jpeg') || contentType.includes('jpg')) mimeType = 'image/jpeg';
          else if (contentType.includes('png')) mimeType = 'image/png';
          else if (contentType.includes('webp')) mimeType = 'image/webp';
          else if (contentType.includes('gif')) mimeType = 'image/gif';
          else if (imageUrl.toLowerCase().includes('.jpg') || imageUrl.toLowerCase().includes('.jpeg')) mimeType = 'image/jpeg';
          else if (imageUrl.toLowerCase().includes('.webp')) mimeType = 'image/webp';
          
          console.log('✅ Image fetched:', Math.round(buffer.length / 1024), 'KB,', mimeType);
          resolve({ base64, mimeType });
        });
        res.on('error', () => resolve(null));
      });

      req.on('error', () => resolve(null));
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });
      
      req.end();
    } catch {
      resolve(null);
    }
  });
}

async function analyzeLogoColors(logoUrl: string, apiKey: string, isWhiteVersion: boolean): Promise<string[] | null> {
  console.log('🔍 Analyzing logo colors with Gemini Vision:', logoUrl.substring(0, 60), 'isWhite:', isWhiteVersion);
  
  try {
    // Primero descargar la imagen y convertir a base64
    const imageData = await fetchImageAsBase64(logoUrl);
    if (!imageData) {
      console.log('⚠️ Could not fetch logo image');
      return null;
    }

    // Limitar tamaño de imagen (max ~1MB en base64)
    if (imageData.base64.length > 1400000) {
      console.log('⚠️ Image too large for analysis');
      return null;
    }

    // Prompt adaptado según si es versión blanca o no
    const prompt = isWhiteVersion 
      ? `Esta imagen es un logo en versión blanca/negativa (probablemente blanco sobre fondo transparente).
Aunque el logo sea blanco, analiza la FORMA y ESTILO del logo para sugerir colores apropiados para la marca.
Basándote en el estilo del logo (moderno, clásico, minimalista, etc.) y el tipo de negocio que parece representar, sugiere una paleta de colores profesional.
Responde ÚNICAMENTE con un JSON array de 3-4 colores hexadecimales que serían apropiados para esta marca.
Formato: ["#RRGGBB", "#RRGGBB", "#RRGGBB"]
Solo el array JSON, sin explicaciones.`
      : `Analiza esta imagen de logo/marca y extrae los colores principales visibles.
Identifica los colores dominantes del diseño, ignorando el fondo transparente si lo hay.
Responde ÚNICAMENTE con un JSON array de colores hexadecimales, máximo 4 colores, ordenados por dominancia visual.
Formato: ["#RRGGBB", "#RRGGBB"]
NO incluyas blanco puro (#FFFFFF) ni negro puro (#000000) a menos que sean colores distintivos del diseño.
Solo el array JSON, sin texto adicional.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: imageData.mimeType,
                  data: imageData.base64
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 128,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log('⚠️ Gemini Vision error:', response.status, errorText.substring(0, 100));
      return null;
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('🎨 Gemini Vision response:', text);
    
    // Parsear el array de colores
    const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const logoColors = JSON.parse(cleanJson);
    
    if (Array.isArray(logoColors) && logoColors.length > 0) {
      // Validar que son colores hex válidos
      const validColors = logoColors.filter((c: string) => /^#[0-9A-Fa-f]{6}$/.test(c));
      if (validColors.length > 0) {
        console.log('✅ Logo colors extracted:', validColors);
        return validColors;
      }
    }
  } catch (error) {
    console.log('⚠️ Error analyzing logo:', error instanceof Error ? error.message : 'Unknown');
  }
  
  return null;
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

    // Extraer colores del CSS/HTML
    const extractedColors = extractColorsFromHtml(html);
    console.log('🎨 Colors from CSS:', extractedColors.colors.length, 'Theme:', extractedColors.themeColor);

    // Extraer candidatos de logo
    const logoCandidates = extractLogoCandidates(html, url);
    
    // Buscar el mejor logo (preferir versión de color sobre blanca)
    let bestLogo: string | null = null;
    let isWhiteVersion = false;
    
    if (logoCandidates.length > 0) {
      // Primero intentar encontrar una versión de color
      const colorVersion = logoCandidates.find(c => !c.isWhiteVersion && c.url.toLowerCase().includes('logo'));
      if (colorVersion) {
        bestLogo = colorVersion.url;
        isWhiteVersion = false;
      } else {
        // Si no hay versión de color, usar la mejor disponible
        bestLogo = logoCandidates[0].url;
        isWhiteVersion = logoCandidates[0].isWhiteVersion;
      }
    }
    
    console.log('🖼️ Best logo:', bestLogo, 'isWhite:', isWhiteVersion);

    // Intentar analizar colores del logo con Gemini Vision
    let logoColors: string[] | null = null;
    const apiKey = process.env.GEMINI_API_KEY;
    if (bestLogo && apiKey && !bestLogo.endsWith('.svg')) {
      // Solo intentar con imágenes rasterizadas (no SVG)
      logoColors = await analyzeLogoColors(bestLogo, apiKey, isWhiteVersion);
    }

    // Construir prompt para Gemini con información de colores
    const brandName = extractBrandName(url, title);
    
    // Preparar información de colores para el prompt
    let colorContext = '';
    if (logoColors && logoColors.length > 0) {
      colorContext = `\nColores extraídos del logo: ${logoColors.join(', ')}`;
    }
    if (extractedColors.themeColor) {
      colorContext += `\nColor tema del sitio: ${extractedColors.themeColor}`;
    }
    if (extractedColors.colors.length > 0) {
      colorContext += `\nColores encontrados en el CSS: ${extractedColors.colors.slice(0, 6).join(', ')}`;
    }
    
    const prompt = `Eres un experto en branding y marketing. Analiza la siguiente información de una página web y genera contenido profesional para un manual de identidad de marca.

URL: ${url}
Nombre detectado: ${brandName}
Título de la página: ${title}
Descripción meta: ${description}
${fetchSuccess ? `Contenido de la página: ${cleanHtml.substring(0, 2500)}` : 'No se pudo obtener el contenido de la página.'}
${colorContext}

Basándote en esta información, genera un JSON con la siguiente estructura exacta (sin markdown, solo JSON puro):

{
  "name": "Nombre oficial de la marca (usa el nombre detectado si no encuentras otro)",
  "tagline": "Un eslogan memorable y profesional de máximo 8 palabras que capture la esencia de la marca",
  "description": "Descripción profesional de la empresa en 3-4 oraciones. Explica qué hace, a quién sirve y qué la hace única. Si no hay información, crea una descripción coherente basada en el nombre y sector.",
  "mission": "Declaración de misión profesional en 2-3 oraciones. El propósito fundamental de la empresa.",
  "vision": "Declaración de visión profesional en 2-3 oraciones. Las aspiraciones a largo plazo.",
  "industry": "Sector o industria (ej: salud, tecnología, retail, servicios, fitness, gastronomía, etc)",
  "suggestedColors": {
    "primary": "#hexcolor (IMPORTANTE: usa el color principal del logo o theme-color si está disponible)",
    "secondary": "#hexcolor (color secundario que complemente al primario)",
    "accent": "#hexcolor (color de acento para CTAs y destacados)",
    "neutral": "#hexcolor (color neutro para fondos, generalmente claro)"
  }
}

IMPORTANTE:
- Responde SOLO con el JSON, sin explicaciones ni markdown
- Todo el contenido debe estar en español
- PRIORIZA los colores extraídos del logo y del sitio web si están disponibles
- Si hay colores del logo, el color primario DEBE ser uno de ellos
- Los colores deben ser coherentes entre sí`;

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
    // Determinar colores finales (prioridad: Gemini con contexto > logo colors > CSS colors > fallback)
    let finalColors = {
      primary: analysis.suggestedColors?.primary || '#3B82F6',
      secondary: analysis.suggestedColors?.secondary || '#1E293B',
      accent: analysis.suggestedColors?.accent || '#F59E0B',
      neutral: analysis.suggestedColors?.neutral || '#F3F4F6',
    };

    // Si Gemini no usó los colores del logo/CSS, intentar usar los extraídos directamente
    if (logoColors && logoColors.length > 0) {
      // Verificar si Gemini usó alguno de los colores del logo
      const geminiUsedLogoColor = logoColors.some(c => 
        c.toLowerCase() === finalColors.primary.toLowerCase() ||
        c.toLowerCase() === finalColors.secondary.toLowerCase()
      );
      
      if (!geminiUsedLogoColor) {
        console.log('🎨 Overriding with logo colors');
        finalColors.primary = logoColors[0];
        if (logoColors[1]) finalColors.accent = logoColors[1];
      }
    } else if (extractedColors.themeColor) {
      // Usar theme-color si no hay colores del logo
      const themeUsed = finalColors.primary.toLowerCase() === extractedColors.themeColor.toLowerCase();
      if (!themeUsed) {
        console.log('🎨 Using theme-color as primary');
        finalColors.primary = extractedColors.themeColor;
      }
    } else if (extractedColors.colors.length > 0) {
      // Usar colores del CSS como último recurso
      const cssColorUsed = extractedColors.colors.some(c => 
        c.toLowerCase() === finalColors.primary.toLowerCase()
      );
      if (!cssColorUsed && extractedColors.colors[0]) {
        console.log('🎨 Using CSS color as primary');
        finalColors.primary = extractedColors.colors[0];
      }
    }

    const brandAnalysis: BrandAnalysis = {
      name: analysis.name || brandName,
      tagline: analysis.tagline || '',
      description: analysis.description || '',
      mission: analysis.mission || '',
      vision: analysis.vision || '',
      industry: analysis.industry || 'general',
      logoUrl: bestLogo,
      colors: finalColors,
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

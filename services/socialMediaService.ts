import { supabase } from './supabaseService';
import { analyzeUrlContent } from './geminiService';

// ============================================
// INTERFACES PARA SOCIAL MEDIA SCRAPING
// ============================================

export interface SocialMediaProfile {
  platform: 'instagram' | 'facebook' | 'website';
  username: string;
  displayName: string;
  bio: string;
  category?: string;
  profileImageUrl?: string;
  website?: string;
  followers?: number;
  isVerified?: boolean;
}

export interface ScrapedBrandInfo {
  brandName: string;
  description: string;
  industry: string;
  colors: string[];
  styleKey: string;
  socialHandle: string;
  profileImageUrl?: string;
}

// ============================================
// SCRAPING DE INSTAGRAM
// ============================================

/**
 * Extraer username de URL de Instagram
 */
const extractInstagramUsername = (url: string): string | null => {
  const patterns = [
    /instagram\.com\/([^\/\?]+)/,
    /instagram\.com\/p\/([^\/\?]+)/,
    /instagram\.com\/stories\/[^\/]+\/([^\/\?]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1] && !match[1].includes('p/') && !match[1].includes('stories')) {
      return match[1];
    }
  }
  return null;
};

/**
 * Scraping básico de perfil de Instagram
 * Nota: En frontend limitado, usamos meta tags y estructura básica
 */
export const scrapeInstagramProfile = async (
  instagramUrl: string
): Promise<SocialMediaProfile | null> => {
  try {
    const username = extractInstagramUsername(instagramUrl);
    if (!username) {
      console.log('⚠️ No se pudo extraer username de Instagram');
      return null;
    }

    console.log(`🔍 Scraping Instagram: @${username}`);

    // Hacemos fetch del perfil público
    const response = await fetch(`https://instagram.com/${username}?__a=1&__d=dis`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
      }
    });

    if (!response.ok) {
      // Si falla la API, intentamos scraping HTML básico
      return await scrapeInstagramHtml(username, instagramUrl);
    }

    const data = await response.json();
    
    if (data.graphql?.user) {
      const user = data.graphql.user;
      return {
        platform: 'instagram',
        username: user.username,
        displayName: user.full_name || user.username,
        bio: user.biography || '',
        category: user.category_enum || undefined,
        profileImageUrl: user.profile_pic_url_hd || user.profile_pic_url,
        website: user.external_url || undefined,
        followers: user.edge_followed_by?.count,
        isVerified: user.is_verified
      };
    }

    return await scrapeInstagramHtml(username, instagramUrl);
  } catch (error) {
    console.error('❌ Error scraping Instagram:', error);
    return null;
  }
};

/**
 * Scraping HTML básico de Instagram como fallback
 */
const scrapeInstagramHtml = async (
  username: string,
  originalUrl: string
): Promise<SocialMediaProfile | null> => {
  try {
    const response = await fetch(originalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();

    // Extraer bio del HTML
    const bioMatch = html.match(/"biography":"([^"]*)"/);
    const fullNameMatch = html.match(/"full_name":"([^"]*)"/);
    const profilePicMatch = html.match(/"profile_pic_url":"([^"]*)"/);
    const categoryMatch = html.match(/"category":"([^"]*)"/);

    return {
      platform: 'instagram',
      username,
      displayName: fullNameMatch ? decodeUnicode(fullNameMatch[1]) : username,
      bio: bioMatch ? decodeUnicode(bioMatch[1]) : '',
      category: categoryMatch ? decodeUnicode(categoryMatch[1]) : undefined,
      profileImageUrl: profilePicMatch ? decodeUnicode(profilePicMatch[1]) : undefined
    };
  } catch (error) {
    console.error('❌ Error en scrapeInstagramHtml:', error);
    return null;
  }
};

// ============================================
// SCRAPING DE FACEBOOK
// ============================================

/**
 * Extraer username/page_id de URL de Facebook
 */
const extractFacebookPageId = (url: string): string | null => {
  const patterns = [
    /facebook\.com\/([^\/\?]+)/,
    /facebook\.com\/pages\/[^\/]+\/([^\/\?]+)/,
    /fb\.com\/([^\/\?]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1] && !match[1].includes('pages') && match[1] !== 'profile.php') {
      return match[1];
    }
  }
  
  // Para URLs con profile.php?id=123
  const idMatch = url.match(/profile\.php\?id=(\d+)/);
  if (idMatch) {
    return idMatch[1];
  }
  
  return null;
};

/**
 * Scraping básico de página de Facebook
 */
export const scrapeFacebookPage = async (
  facebookUrl: string
): Promise<SocialMediaProfile | null> => {
  try {
    const pageId = extractFacebookPageId(facebookUrl);
    if (!pageId) {
      console.log('⚠️ No se pudo extraer page ID de Facebook');
      return null;
    }

    console.log(`🔍 Scraping Facebook: ${pageId}`);

    // Intentar obtener datos de la página pública
    const response = await fetch(
      `https://www.facebook.com/${pageId}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    if (!response.ok) {
      console.log('⚠️ No se pudo acceder a la página de Facebook');
      return null;
    }

    const html = await response.text();

    // Extraer información del HTML
    const titleMatch = html.match(/<title>([^<]*)<\/title>/);
    const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
    const imgMatch = html.match(/"profilePic[^"]*"[^>]*src="([^"]*)"/);
    
    // Intentar extraer más datos del JSON embebido
    const pageInfoMatch = html.match(/"page":{"id":"([^"]*)","name":"([^"]*)"/);
    const categoryMatch = html.match(/"category":"([^"]*)"/);

    const displayName = pageInfoMatch ? decodeUnicode(pageInfoMatch[2]) : (titleMatch ? titleMatch[1] : pageId);
    const bio = descMatch ? decodeUnicode(descMatch[1]) : '';

    return {
      platform: 'facebook',
      username: pageId,
      displayName,
      bio,
      category: categoryMatch ? decodeUnicode(categoryMatch[1]) : undefined,
      profileImageUrl: imgMatch ? decodeUnicode(imgMatch[1]) : undefined
    };
  } catch (error) {
    console.error('❌ Error scraping Facebook:', error);
    return null;
  }
};

// ============================================
// UTILIDADES
// ============================================

/**
 * Decodificar caracteres Unicode escapados
 */
const decodeUnicode = (str: string): string => {
  return str
    .replace(/\\u([\dA-F]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"');
};

/**
 * Detectar tipo de URL y llamar al scraper apropiado
 */
export const detectAndScrapeSocialMedia = async (
  url: string
): Promise<SocialMediaProfile | null> => {
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('instagram.com')) {
    return await scrapeInstagramProfile(url);
  } else if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.com')) {
    return await scrapeFacebookPage(url);
  }
  
  return null;
};

// ============================================
// ANÁLISIS DE REDES SOCIALES MEJORADO
// ============================================

/**
 * Analizar URLs de redes sociales y extraer información del negocio
 */
export const analyzeSocialMediaUrls = async (
  websiteUrl?: string,
  instagramUrl?: string,
  facebookUrl?: string
): Promise<{
  description: string;
  industry: string;
  brandColors: string[];
  styleKey: string;
  brandName: string;
  socialHandle: string;
}> => {
  try {
    // Prioridad: Website > Instagram > Facebook
    const urls = [
      { url: websiteUrl, type: 'website' as const },
      { url: instagramUrl, type: 'instagram' as const },
      { url: facebookUrl, type: 'facebook' as const }
    ];

    let bestResult: ScrapedBrandInfo | null = null;
    let socialHandle = '';
    let profileImageUrl: string | undefined;

    // Primero intentar scraping de redes sociales
    for (const { url, type } of urls) {
      if (!url) continue;

      if (type === 'instagram' || type === 'facebook') {
        const profile = await detectAndScrapeSocialMedia(url);
        if (profile) {
          socialHandle = `@${profile.username}`;
          profileImageUrl = profile.profileImageUrl;

          // Analizar con Gemini para obtener industria y colores
          const analysis = await analyzeSocialMediaProfile(profile);
          bestResult = analysis;
          console.log(`✅ ${type.toUpperCase()} scrappeado:`, analysis.brandName);
          break;
        }
      }
    }

    // Si no hay resultado de redes sociales, usar website
    if (!bestResult && websiteUrl) {
      console.log('🔍 Analizando website:', websiteUrl);
      const analysis = await analyzeUrlContent(websiteUrl);
      
      return {
        description: analysis.description || '',
        industry: '',
        brandColors: [],
        styleKey: analysis.visualStyle || 'retail_sale',
        brandName: analysis.description?.split(' ').slice(0, 3).join(' ') || '',
        socialHandle: ''
      };
    }

    if (bestResult) {
      return {
        description: bestResult.description,
        industry: bestResult.industry,
        brandColors: bestResult.colors,
        styleKey: bestResult.styleKey,
        brandName: bestResult.brandName,
        socialHandle: bestResult.socialHandle
      };
    }

    // Resultado por defecto
    return {
      description: '',
      industry: '',
      brandColors: [],
      styleKey: 'retail_sale',
      brandName: '',
      socialHandle: ''
    };
  } catch (error) {
    console.error('❌ Error analizando URLs de redes sociales:', error);
    return {
      description: '',
      industry: '',
      brandColors: [],
      styleKey: 'retail_sale',
      brandName: '',
      socialHandle: ''
    };
  }
};

/**
 * Analizar perfil de red social con Gemini para obtener contexto
 */
const analyzeSocialMediaProfile = async (
  profile: SocialMediaProfile
): Promise<ScrapedBrandInfo> => {
  const prompt = `Analiza este perfil de ${profile.platform} y extrae información para crear un flyer publicitario:

Username: @${profile.username}
Nombre: ${profile.displayName}
Bio: ${profile.bio}
Categoría: ${profile.category || 'No especificada'}

Responde SOLO con un JSON en este formato (sin markdown, sin comentarios):
{
  "brandName": "Nombre del negocio",
  "description": "Descripción del negocio en 1-2 oraciones",
  "industry": "Industria (ej: Gastronomía, Retail, Belleza, etc.)",
  "colors": ["#color1", "#color2"],
  "styleKey": "retail_sale | summer_beach | gastronomy | luxury_gold | corporate | aesthetic_min",
  "socialHandle": "@${profile.username}"
}`;

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY || ''
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error('Error en API de Gemini');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Limpiar markdown y parsear JSON
    const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonText);

    return {
      brandName: parsed.brandName || profile.displayName,
      description: parsed.description || profile.bio,
      industry: parsed.industry || 'Retail',
      colors: parsed.colors || ['#333333', '#ffffff'],
      styleKey: parsed.styleKey || 'retail_sale',
      socialHandle: `@${profile.username}`,
      profileImageUrl: profile.profileImageUrl
    };
  } catch (error) {
    console.error('❌ Error analizando perfil con Gemini:', error);
    
    // Fallback: usar información directa del perfil
    return {
      brandName: profile.displayName,
      description: profile.bio,
      industry: profile.category || 'Retail',
      colors: ['#333333', '#ffffff'],
      styleKey: 'retail_sale',
      socialHandle: `@${profile.username}`,
      profileImageUrl: profile.profileImageUrl
    };
  }
};

export interface UserSocialMedia {
  id: string;
  user_id: string;
  website_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  pinterest_url?: string;
  other_url?: string;
  business_description?: string;
  industry?: string;
  brand_colors?: string[];
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ScheduledGeneration {
  id: string;
  user_id: string;
  commercial_event_id?: string;
  event_name: string;
  event_date: string;
  event_category?: string;
  content_type: 'image' | 'video' | 'both';
  aspect_ratio: string;
  style_key?: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  generated_flyer_id?: string;
  notes?: string;
  scheduled_date?: string;
  created_at?: string;
  updated_at?: string;
}

// Obtener redes sociales del usuario
export const getUserSocialMedia = async (userId: string): Promise<UserSocialMedia | null> => {
  try {
    const { data, error } = await supabase
      .from('user_social_media')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.log('⚠️ Error cargando redes sociales:', error.message);
      return null;
    }

    return data as UserSocialMedia;
  } catch (error) {
    console.log('⚠️ Excepción cargando redes sociales:', error);
    return null;
  }
};

// Guardar/actualizar redes sociales del usuario
export const saveUserSocialMedia = async (
  userId: string,
  socialMedia: Partial<UserSocialMedia>
): Promise<UserSocialMedia | null> => {
  try {
    const { data, error } = await supabase
      .from('user_social_media')
      .upsert({
        user_id: userId,
        ...socialMedia
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) {
      console.error('❌ Error guardando redes sociales:', error);
      return null;
    }

    console.log('✅ Redes sociales guardadas');
    return data as UserSocialMedia;
  } catch (error) {
    console.error('❌ Excepción guardando redes sociales:', error);
    return null;
  }
};

// (La función analyzeSocialMediaUrls mejorada está definida arriba en la línea 271)

// Obtener generaciones programadas del usuario
export const getScheduledGenerations = async (
  userId: string,
  status?: 'pending' | 'generating' | 'completed' | 'failed'
): Promise<ScheduledGeneration[]> => {
  try {
    let query = supabase
      .from('scheduled_generations')
      .select('*')
      .eq('user_id', userId)
      .order('event_date', { ascending: true });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('❌ Error cargando generaciones programadas:', error);
      return [];
    }

    return data as ScheduledGeneration[];
  } catch (error) {
    console.error('❌ Excepción cargando generaciones programadas:', error);
    return [];
  }
};

// Crear generación programada
export const createScheduledGeneration = async (
  userId: string,
  generation: Partial<ScheduledGeneration>
): Promise<ScheduledGeneration | null> => {
  try {
    const { data, error } = await supabase
      .from('scheduled_generations')
      .insert({
        user_id: userId,
        ...generation
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Error creando generación programada:', error);
      return null;
    }

    console.log('✅ Generación programada creada');
    return data as ScheduledGeneration;
  } catch (error) {
    console.error('❌ Excepción creando generación programada:', error);
    return null;
  }
};

// Actualizar estado de generación programada
export const updateScheduledGenerationStatus = async (
  generationId: string,
  status: ScheduledGeneration['status'],
  flyerId?: string
): Promise<boolean> => {
  try {
    const updates: Partial<ScheduledGeneration> = { status };
    if (flyerId) {
      updates.generated_flyer_id = flyerId;
    }

    const { error } = await supabase
      .from('scheduled_generations')
      .update(updates)
      .eq('id', generationId);

    if (error) {
      console.error('❌ Error actualizando estado:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Excepción actualizando estado:', error);
    return false;
  }
};

// Eliminar generación programada
export const deleteScheduledGeneration = async (generationId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('scheduled_generations')
      .delete()
      .eq('id', generationId);

    if (error) {
      console.error('❌ Error eliminando generación programada:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('❌ Excepción eliminando generación programada:', error);
    return false;
  }
};

// Obtener eventos próximos con generaciones programadas
export const getUpcomingScheduledEvents = async (
  userId: string,
  days: number = 30
): Promise<ScheduledGeneration[]> => {
  try {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('scheduled_generations')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .gte('event_date', today.toISOString().split('T')[0])
      .lte('event_date', futureDate.toISOString().split('T')[0])
      .order('event_date', { ascending: true });

    if (error) {
      console.error('❌ Error cargando eventos próximos:', error);
      return [];
    }

    return data as ScheduledGeneration[];
  } catch (error) {
    console.error('❌ Excepción cargando eventos próximos:', error);
    return [];
  }
};

// Generar prompt contextual para un evento
export const generateEventPrompt = async (
  eventName: string,
  eventDate: string,
  eventCategory: string,
  userSocialMedia?: UserSocialMedia
): Promise<string> => {
  const daysUntil = Math.ceil(
    (new Date(eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const urgencyText = daysUntil <= 7 
    ? 'URGENTE - ¡Solo quedan unos días!' 
    : daysUntil <= 14 
      ? 'Próximo evento - Planifica con anticipación' 
      : 'Evento futuro - Preparación anticipada';

  let prompt = `Diseño de contenido marketing para "${eventName}" (${eventCategory}).
${urgencyText}
Fecha del evento: ${eventDate}`;

  if (userSocialMedia) {
    if (userSocialMedia.business_description) {
      prompt += `\nNegocio: ${userSocialMedia.business_description}`;
    }
    if (userSocialMedia.industry) {
      prompt += `\nIndustria: ${userSocialMedia.industry}`;
    }
    if (userSocialMedia.brand_colors && userSocialMedia.brand_colors.length > 0) {
      prompt += `\nColores de marca: ${userSocialMedia.brand_colors.join(', ')}`;
    }
  }

  prompt += `\n\nGenera un diseño profesional y atractivo que capture la esencia del evento.
Considera las mejores prácticas de diseño para redes sociales y marketing digital.
El diseño debe ser visualmente impactante y apropiado para la fecha señalada.`;

  return prompt;
};
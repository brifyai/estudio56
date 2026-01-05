/**
 * 🎨 ESTILOS DE STORY ART - Catálogo de Estilos Visuales
 * 
 * Estos estilos proporcionan diferenciación visual real para Story Art,
 * permitiendo que cada generación sea única y con identidad visual propia.
 * 
 * Cada estilo incluye:
 * - id: Identificador único
 * - name: Nombre legible del estilo
 * - description: Descripción para el usuario
 * - prompt: Prompt técnico para Gemini
 * - negativePrompt: Negative prompt específico
 * - icon: Icono representativo (emoji)
 * - category: Categoría para agrupar estilos
 */

export type StoryArtStyleId = 
  | 'vogue_negative'
  | 'neon_kinetic'
  | 'macro_essence'
  | 'cinematic_frame'
  | 'collage_dynamic'
  | 'marble_sculpture'
  | 'anime_to_real';

export interface StoryArtStyle {
  id: StoryArtStyleId;
  name: string;
  description: string;
  prompt: string;
  negativePrompt: string;
  icon: string;
  category: 'editorial' | 'digital' | 'product' | 'documental' | 'montage' | 'classic' | 'cosplay';
  color: string; // Color hex para UI
}

// ============================================
// CATÁLOGO DE ESTILOS STORY ART
// ============================================

export const STORY_ART_STYLES: Record<StoryArtStyleId, StoryArtStyle> = {
  /**
   * 1. Estilo: "Vogue Negative" (Minimalismo Editorial)
   * Descripción: Crea un espacio vacío elegante para insertar texto o logos sin tapar al sujeto.
   */
  vogue_negative: {
    id: 'vogue_negative',
    name: 'Vogue Negative',
    description: 'Minimalismo editorial con espacio negativo elegante',
    prompt: `High-end fashion editorial layout. Subject is anchored in the extreme lower third. 70% of the upper frame is intentional negative space with a soft studio gradient. Focus on 'Power Scaling': monumental verticality. High-end lighting with micro-contrasts. Clean, sophisticated composition optimized for text overlay.`,
    negativePrompt: 'cluttered background, busy composition, low quality, blurry, amateur lighting, harsh shadows, oversaturated colors, cheap aesthetic, watermark, text visible, logo visible',
    icon: '◻️',
    category: 'editorial',
    color: '#2D2D2D'
  },

  /**
   * 2. Estilo: "Neon Kinetic" (Energía Digital)
   * Descripción: Iluminación vibrante que parece saltar de la pantalla, ideal para llamar la atención en el scroll.
   */
  neon_kinetic: {
    id: 'neon_kinetic',
    name: 'Neon Kinetic',
    description: 'Energía digital con iluminación vibrante',
    prompt: `Cyber-Pop aesthetic. Volumetric neon lighting (cyan and magenta). Dynamic motion blur on the edges. The subject feels like it's lunging out of the screen. Extreme vertical depth with floating particles. Vibrant, high-energy 9:16 composition. Glowing edges, chromatic aberration, digital art style.`,
    negativePrompt: 'dull colors, flat lighting, static composition, low energy, amateur, blurry, low quality, oversaturated skin, distorted anatomy, watermark, text visible',
    icon: '💜',
    category: 'digital',
    color: '#FF00FF'
  },

  /**
   * 3. Estilo: "Macro Essence" (Detalle de Producto)
   * Descripción: Se enfoca en texturas y detalles cercanos, convirtiendo un producto común en un objeto de deseo.
   */
  macro_essence: {
    id: 'macro_essence',
    name: 'Macro Essence',
    description: 'Detalle extremo de producto con texturas',
    prompt: `Editorial product photography. Extreme close-up (Macro) focused on textures. Hard, dramatic shadows with 45-degree studio lighting. 9:16 vertical magazine style. Intense detail on materials (glass, skin, fabric). Cinematic depth of field. The subject fills 80% of the frame with intricate texture details visible.`,
    negativePrompt: 'wide shot, small subject, blurry details, flat lighting, amateur photography, low resolution, oversharpened, watermark, text visible, logo visible, busy background',
    icon: '🔍',
    category: 'product',
    color: '#FFD700'
  },

  /**
   * 4. Estilo: "Cinematic Frame" (Cine Documental)
   * Descripción: Estética de película real, eliminando el "look artificial" de la IA para generar confianza.
   */
  cinematic_frame: {
    id: 'cinematic_frame',
    name: 'Cinematic Frame',
    description: 'Estética documental cinematográfica',
    prompt: `Cinematic Raw documentary style. Anamorphic lens distortion at the edges. Natural dramatic lighting with deep blacks. 35mm film grain texture. Desaturated, professional color grading. The subject is captured in an unposed, authentic vertical frame. Film emulation, organic feel, real photography aesthetic.`,
    negativePrompt: 'artificial looking, plastic textures, oversaturated, perfect skin, posed, studio lighting, low quality, blurry, watermark, text visible, logo visible, 3d render look',
    icon: '🎬',
    category: 'documental',
    color: '#1A1A2E'
  },

  /**
   * 5. Estilo: "Collage Dynamic" (Montaje de Impacto)
   * Descripción: Divide la pantalla en paneles con diferentes ángulos del mismo sujeto, ideal para mostrar versatilidad.
   */
  collage_dynamic: {
    id: 'collage_dynamic',
    name: 'Collage Dynamic',
    description: 'Montaje dinámico en múltiples paneles',
    prompt: `Professional 4-panel split montage. Each panel shows a different angle or moment of the same subject. Cohesive color grading across all panels. Clean, thin white dividers. Dynamic sports or action-oriented composition in 9:16. Each panel is a complete shot with consistent lighting and color.`,
    negativePrompt: 'single panel, static pose, inconsistent lighting, color mismatch, thick dividers, amateur layout, low quality, blurry, watermark, text visible, mismatched subjects',
    icon: '▦',
    category: 'montage',
    color: '#FF6B35'
  },

  /**
   * 6. Estilo: "Marble Sculpture" (Elegancia Clásica)
   * Descripción: Transforma cualquier sujeto en una escultura de mármol realista, ideal para conceptos de "perfección" o "legado".
   */
  marble_sculpture: {
    id: 'marble_sculpture',
    name: 'Marble Sculpture',
    description: 'Elegancia clásica en mármol realista',
    prompt: `Photorealistic ultra-detailed sculpture made of polished, glowing marble. Smooth reflective surface, emphasizing craftsmanship and artistic depth. Elegant lighting to enhance contours and textures. Fascinating visual effect of carved stone in a vertical gallery setting. Classical art aesthetic with modern photorealistic rendering.`,
    negativePrompt: 'flat surface, non-reflective, cheap material, plastic look, low detail, amateur sculpture, low quality, blurry, watermark, text visible, modern art style, abstract',
    icon: '🗿',
    category: 'classic',
    color: '#F5F5DC'
  },

  /**
   * 7. Estilo: "Anime-to-Real" (Cosplay Pro)
   * Descripción: Convierte ilustraciones en fotos fotorrealistas con una precisión 1:1 en pose y vestuario.
   */
  anime_to_real: {
    id: 'anime_to_real',
    name: 'Anime-to-Real',
    description: 'Conversión fotorrealista de ilustraciones',
    prompt: `Highly detailed photorealistic cosplay version of the reference illustration. Replicate exact pose, body posture, hand gestures, and facial expression. Maintain the same camera angle and composition. Zero deviation from the original character design but with human textures. Cinematic lighting, film grain, authentic skin texture.`,
    negativePrompt: 'cartoon style, illustration, anime style, deviation from reference, different pose, different outfit, plastic skin, oversmoothed, low quality, blurry, watermark, text visible',
    icon: '🎭',
    category: 'cosplay',
    color: '#FF69B4'
  }
};

// ============================================
// AGRUPACIÓN POR CATEGORÍAS
// ============================================

export const STORY_ART_CATEGORIES = {
  editorial: {
    label: 'Editorial',
    description: 'Estilos minimalistas y sofisticados',
    styles: ['vogue_negative'] as StoryArtStyleId[]
  },
  digital: {
    label: 'Digital',
    description: 'Estilos vibrantes y modernos',
    styles: ['neon_kinetic'] as StoryArtStyleId[]
  },
  product: {
    label: 'Producto',
    description: 'Enfoque en detalles y texturas',
    styles: ['macro_essence'] as StoryArtStyleId[]
  },
  documental: {
    label: 'Documental',
    description: 'Estética cinematográfica real',
    styles: ['cinematic_frame'] as StoryArtStyleId[]
  },
  montage: {
    label: 'Montaje',
    description: 'Composiciones múltiples',
    styles: ['collage_dynamic'] as StoryArtStyleId[]
  },
  classic: {
    label: 'Clásico',
    description: 'Elegancia atemporal',
    styles: ['marble_sculpture'] as StoryArtStyleId[]
  },
  cosplay: {
    label: 'Cosplay',
    description: 'Transformación de personajes',
    styles: ['anime_to_real'] as StoryArtStyleId[]
  }
};

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Obtiene un estilo Story Art por ID
 */
export function getStoryArtStyle(id: StoryArtStyleId): StoryArtStyle | null {
  return STORY_ART_STYLES[id] || null;
}

/**
 * Obtiene todos los estilos disponibles
 */
export function getAllStoryArtStyles(): StoryArtStyle[] {
  return Object.values(STORY_ART_STYLES);
}

/**
 * Obtiene estilos por categoría
 */
export function getStoryArtStylesByCategory(category: string): StoryArtStyle[] {
  const categoryConfig = STORY_ART_CATEGORIES[category as keyof typeof STORY_ART_CATEGORIES];
  if (!categoryConfig) return [];
  
  return categoryConfig.styles.map(id => STORY_ART_STYLES[id]).filter(Boolean);
}

/**
 * Construye el prompt completo para Story Art con estilo específico
 */
export function buildStoryArtPrompt(
  subject: string,
  styleId: StoryArtStyleId,
  artDirectionPrompt?: string
): string {
  const style = getStoryArtStyle(styleId);
  if (!style) {
    return `${subject}. Professional commercial photography, high quality, clean design.`;
  }

  // Combinar estilo + sujeto + dirección de arte opcional
  const parts: string[] = [];
  
  parts.push(style.prompt);
  parts.push(`SUBJECT: ${subject}`);
  
  // Agregar dirección de arte del rubro si existe
  if (artDirectionPrompt) {
    parts.push(`ART_DIRECTION: ${artDirectionPrompt}`);
  }
  
  // Agregar negative prompt
  parts.push(`NEGATIVE_PROMPT: ${style.negativePrompt}, low quality, blurry, amateur, watermark, text visible, logo visible`);
  
  return parts.join('\n\n');
}

/**
 * Verifica si un ID de estilo es válido
 */
export function isValidStoryArtStyle(id: string): id is StoryArtStyleId {
  return id in STORY_ART_STYLES;
}

// ============================================
// EXPORTACIÓN POR DEFECTO
// ============================================

export default {
  styles: STORY_ART_STYLES,
  categories: STORY_ART_CATEGORIES,
  getStyle: getStoryArtStyle,
  getAllStyles: getAllStoryArtStyles,
  getByCategory: getStoryArtStylesByCategory,
  buildPrompt: buildStoryArtPrompt,
  isValid: isValidStoryArtStyle
};
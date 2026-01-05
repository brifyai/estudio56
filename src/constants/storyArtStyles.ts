/**
 * Story Art Visual Styles - 7 estilos únicos para diferenciación visual
 * Estos estilos se aplican en ADICIÓN a la Dirección de Arte por industria
 * para crear resultados visualmente distintos en formato Story (9:16)
 */

export type StoryArtStyleId =
  | 'vogue_negative'
  | 'neon_kinetic'
  | 'macro_essence'
  | 'cinematic_frame'
  | 'collage_dynamic'
  | 'marble_sculpture'
  | 'anime_to_real';

export type StoryArtCategory =
  | 'fashion'
  | 'urban'
  | 'product'
  | 'cinematic'
  | 'artistic'
  | 'classic'
  | 'anime';

export interface StoryArtStyle {
  id: StoryArtStyleId;
  name: string;
  description: string;
  category: StoryArtCategory;
  // Prompt técnico que se concatena al prompt principal
  prompt: string;
  // Prompt técnico (alias para compatibilidad)
  technicalPrompt?: string;
  // Prompt visual para mostrar en UI
  visualPrompt: string;
  // Colores característicos
  colors: string[];
  // Keywords para búsqueda
  keywords: string[];
  // Icono emoji para mostrar en UI
  icon: string;
}

export const STORY_ART_VISUAL_STYLES: StoryArtStyle[] = [
  {
    id: 'vogue_negative',
    name: 'Vogue Negative',
    description: 'Espacio negativo bold + tipografía editorial de moda',
    category: 'fashion',
    prompt: `, VOGUE EDITORIAL STYLE, bold negative space composition, minimalist fashion typography overlay, high-contrast black and white with selective color, magazine cover aesthetic, clean white space dominating frame, fashion model silhouette, editorial typography, grahphic design elements, supermodel pose, fashion week atmosphere, 9:16 vertical format optimized`,
    technicalPrompt: `, VOGUE EDITORIAL STYLE, bold negative space composition, minimalist fashion typography overlay, high-contrast black and white with selective color, magazine cover aesthetic, clean white space dominating frame, fashion model silhouette, editorial typography, grahphic design elements, supermodel pose, fashion week atmosphere, 9:16 vertical format optimized`,
    visualPrompt: 'Espacio negativo bold + tipografía editorial',
    colors: ['#000000', '#FFFFFF', '#FF0000'],
    keywords: ['moda', 'vogue', 'editorial', 'minimalista', 'negativo', 'tipografía'],
    icon: '✨'
  },
  {
    id: 'neon_kinetic',
    name: 'Neon Kinetic',
    description: 'Movimiento cinético + neón saturado + energía urbana',
    category: 'urban',
    prompt: `, KINETIC NEON STYLE, saturated neon lighting, kinetic motion blur effects, urban energy, vibrant color gradients, light trails, cyberpunk aesthetic, dynamic movement, glowing neon signs, night city atmosphere, high energy composition, motion blur, 9:16 vertical format optimized`,
    technicalPrompt: `, KINETIC NEON STYLE, saturated neon lighting, kinetic motion blur effects, urban energy, vibrant color gradients, light trails, cyberpunk aesthetic, dynamic movement, glowing neon signs, night city atmosphere, high energy composition, motion blur, 9:16 vertical format optimized`,
    visualPrompt: 'Neón saturado + movimiento cinético',
    colors: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0080'],
    keywords: ['neón', 'cinético', 'urbano', 'cyberpunk', 'movimiento', 'saturado'],
    icon: '🌈'
  },
  {
    id: 'macro_essence',
    name: 'Macro Essence',
    description: 'Detalle extremo + texturas + enfoque macro',
    category: 'product',
    prompt: `, MACRO ESSENCE STYLE, extreme close-up detail, texture-focused, shallow depth of field, bokeh background, product showcase, intricate details, tactile surfaces, professional product photography, studio lighting, macro lens aesthetic, 9:16 vertical format optimized`,
    technicalPrompt: `, MACRO ESSENCE STYLE, extreme close-up detail, texture-focused, shallow depth of field, bokeh background, product showcase, intricate details, tactile surfaces, professional product photography, studio lighting, macro lens aesthetic, 9:16 vertical format optimized`,
    visualPrompt: 'Detalle extremo + texturas macro',
    colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0'],
    keywords: ['macro', 'detalle', 'textura', 'producto', 'proximidad', 'textura'],
    icon: '🔍'
  },
  {
    id: 'cinematic_frame',
    name: 'Cinematic Frame',
    description: 'Aspect ratio cinematográfico + lighting de película',
    category: 'cinematic',
    prompt: `, CINEMATIC FRAME STYLE, anamorphic lens flare, cinematic lighting, film grain, movie scene composition, dramatic shadows, cinematic color grading, shallow depth of field, character-focused, movie poster aesthetic, film photography, 9:16 vertical format optimized`,
    technicalPrompt: `, CINEMATIC FRAME STYLE, anamorphic lens flare, cinematic lighting, film grain, movie scene composition, dramatic shadows, cinematic color grading, shallow depth of field, character-focused, movie poster aesthetic, film photography, 9:16 vertical format optimized`,
    visualPrompt: 'Cinematic frame + lighting de película',
    colors: ['#1A1A2E', '#16213E', '#E94560', '#0F3460'],
    keywords: ['cinemático', 'película', 'anamorphic', 'drama', 'cine', 'flare'],
    icon: '🎬'
  },
  {
    id: 'collage_dynamic',
    name: 'Collage Dynamic',
    description: 'Collage artístico + superposición +剪纸 (papel cortado)',
    category: 'artistic',
    prompt: `, DYNAMIC COLLAGE STYLE, paper cutout aesthetic, layered composition, mixed media, artistic collage, overlapping elements, hand-cut paper texture, bold graphic shapes, artistic composition, contemporary art style, 9:16 vertical format optimized`,
    technicalPrompt: `, DYNAMIC COLLAGE STYLE, paper cutout aesthetic, layered composition, mixed media, artistic collage, overlapping elements, hand-cut paper texture, bold graphic shapes, artistic composition, contemporary art style, 9:16 vertical format optimized`,
    visualPrompt: 'Collage artístico + superposición',
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C'],
    keywords: ['collage', 'arte', 'papel', 'capas', 'superposición', '剪纸'],
    icon: '🎨'
  },
  {
    id: 'marble_sculpture',
    name: 'Marble Sculpture',
    description: 'Escultura en mármol + textura clásica + elegancia',
    category: 'classic',
    prompt: `, MARBLE SCULPTURE STYLE, classical sculpture aesthetic, marble texture, white marble surfaces, classical beauty, sculptural lighting, museum quality, timeless elegance, neoclassical composition, 9:16 vertical format optimized`,
    technicalPrompt: `, MARBLE SCULPTURE STYLE, classical sculpture aesthetic, marble texture, white marble surfaces, classical beauty, sculptural lighting, museum quality, timeless elegance, neoclassical composition, 9:16 vertical format optimized`,
    visualPrompt: 'Escultura en mármol + elegancia clásica',
    colors: ['#FFFFFF', '#F8F8FF', '#E8E8E8', '#D3D3D3'],
    keywords: ['mármol', 'escultura', 'clásico', 'elegante', 'blanco', 'museum'],
    icon: '🗿'
  },
  {
    id: 'anime_to_real',
    name: 'Anime to Real',
    description: 'Estilo anime transformado a fotografía real',
    category: 'anime',
    prompt: `, ANIME TO REAL STYLE, anime-inspired composition transformed to photorealistic, Japanese animation aesthetic, vibrant colors, character-focused, anime screenshot style, cel shading influence, anime photography, 9:16 vertical format optimized`,
    technicalPrompt: `, ANIME TO REAL STYLE, anime-inspired composition transformed to photorealistic, Japanese animation aesthetic, vibrant colors, character-focused, anime screenshot style, cel shading influence, anime photography, 9:16 vertical format optimized`,
    visualPrompt: 'Anime transformado a fotografía real',
    colors: ['#FF69B4', '#00BFFF', '#FFD700', '#FF4500'],
    keywords: ['anime', 'japonés', 'animación', 'cel shading', 'manga', 'otaku'],
    icon: '🎭'
  }
];

// Alias para compatibilidad
export const STORY_ART_STYLES = STORY_ART_VISUAL_STYLES;

// Categorías organizadas
export const STORY_ART_CATEGORIES: Record<string, { label: string; styles: StoryArtStyleId[] }> = {
  editorial: {
    label: '✨ Editorial & Moda',
    styles: ['vogue_negative']
  },
  digital: {
    label: '🌈 Digital & Urbano',
    styles: ['neon_kinetic']
  },
  product: {
    label: '🔍 Producto & Detalle',
    styles: ['macro_essence']
  },
  cinematic: {
    label: '🎬 Cinematográfico',
    styles: ['cinematic_frame']
  },
  artistic: {
    label: '🎨 Artístico',
    styles: ['collage_dynamic']
  },
  classic: {
    label: '🗿 Clásico & Elegante',
    styles: ['marble_sculpture']
  },
  anime: {
    label: '🎭 Anime & Cosplay',
    styles: ['anime_to_real']
  }
};

// Función para obtener un estilo por ID
export function getStoryArtStyleById(styleId: StoryArtStyleId): StoryArtStyle | undefined {
  return STORY_ART_VISUAL_STYLES.find(style => style.id === styleId);
}

// Función para obtener estilos por categoría
export function getStoryArtStylesByCategory(category: StoryArtCategory): StoryArtStyle[] {
  return STORY_ART_VISUAL_STYLES.filter(style => style.category === category);
}

// Función para buscar estilos por keyword
export function searchStoryArtStyles(query: string): StoryArtStyle[] {
  const lowerQuery = query.toLowerCase();
  return STORY_ART_VISUAL_STYLES.filter(style => 
    style.name.toLowerCase().includes(lowerQuery) ||
    style.description.toLowerCase().includes(lowerQuery) ||
    style.keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery))
  );
}

// Función para obtener el prompt técnico completo
export function getStoryArtTechnicalPrompt(styleId: StoryArtStyleId | null): string {
  if (!styleId) return '';
  const style = getStoryArtStyleById(styleId);
  return style ? style.prompt : '';
}

// Función para obtener todos los estilos
export function getAllStoryArtStyles(): StoryArtStyle[] {
  return STORY_ART_VISUAL_STYLES;
}

// Función para construir prompt con estilo Story Art
export function buildStoryArtPrompt(basePrompt: string, styleId: StoryArtStyleId | null): string {
  if (!styleId) return basePrompt;
  const style = getStoryArtStyleById(styleId);
  if (!style) return basePrompt;
  return `${basePrompt}${style.prompt}`;
}
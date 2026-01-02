/**
 * Modificadores de prompt para controlar el "nivel de realismo" de las imágenes generadas.
 * Esto解决 el problema del "spa de lujo" donde la IA generaba imágenes demasiado aspiracionales
 * para negocios locales en Chile.
 */

export const REALITY_MODES = {
  /**
   * MODO 1: Para Pymes reales (evita el look "fake luxury")
   * Genera imágenes con luz natural de día, fondos blancos limpios,
   * texturas realistas. Ideal para gimnasios de barrio, salons de belleza locales, etc.
   */
  realist: `STYLE_INSTRUCTION: Authentic commercial photography. Bright natural daylight (morning light), clean white walls, realistic textures. The image should look trustworthy, approachable, and achievable for a local business in Chile. Avoid: hyper-luxury elements, dark moody lighting, cinematic fog, candles, 8k unreal render aesthetics.`,

  /**
   * MODO 2: El modo actual (para quien quiere vender un sueño)
   * Genera imágenes de alta gama con iluminación cinematográfica,
   * atmósferas lujosas y materiales premium. Para negocios que quieren transmitir exclusividad.
   */
  aspirational: `STYLE_INSTRUCTION: High-end editorial photography. Cinematic lighting with dramatic shadows, luxurious atmosphere, premium materials. Evoke desire and exclusivity.`,

  /**
   * MODO 3: Para la Opción B (Producto limpio)
   * Fotografía de producto profesional con iluminación de estudio,
   * sombras suaves y enfoque nítido en el sujeto principal.
   * Usado por el flujo "Estudio de Producto".
   */
  studio: `STYLE_INSTRUCTION: Professional product photography. High-quality studio lighting, soft shadows, sharp focus on the main subject. Clean, uncluttered composition that highlights the product details.`
};

/**
 * Tipos TypeScript para los modos de realismo disponibles
 */
export type RealityMode = keyof typeof REALITY_MODES;

/**
 * Mapeo legible para la UI
 */
export const REALITY_MODE_LABELS: Record<RealityMode, string> = {
  realist: 'Local / Realista',
  aspirational: 'Premium / Lujo',
  studio: 'Estudio de Producto'
};

/**
 * Palabras prohibidas para prevenir inyecciones de prompt y contenido inapropiado
 */
export const FORBIDDEN_KEYWORDS = [
  'nsfw', 'nude', 'naked', 'violence', 'blood', 'weapon',
  'drugs', 'alcohol', 'tobacco', 'gambling', 'scam',
  'hate', 'discrimination', 'harassment'
];
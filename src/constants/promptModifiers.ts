/**
 * Modificadores de prompt para controlar el "nivel de realismo" de las imágenes generadas.
 * Esto解决 el problema del "spa de lujo" donde la IA generaba imágenes demasiado aspiracionales
 * para negocios locales en Chile.
 */

export const REALITY_MODES = {
  /**
   * MODO 1: Para Pymes reales (evita el look "fake luxury")
   * Genera imágenes con luz natural suave, texturas auténticas,
   * look de fotografía local chilena. Ideal para gimnasios de barrio,
   * salons de belleza locales, restaurants familiares, etc.
   */
  realist: `STYLE_INSTRUCTION: Natural commercial photography.
  Soft organic daylight, overcast sky lighting, authentic textures without artificial shine.
  Handheld photography aesthetic, slight natural motion blur, realistic skin tones.
  The scene must look like a real photo taken in a local Chilean business by a professional photographer.
  AVOID: neon glows, cinematic fog, plastic skin, hyper-saturated colors, dramatic shadows, 8k render aesthetics, masterpiece, ultra-detailed, cinematic lighting.`,

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
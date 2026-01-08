import { RealityLevel, RealityPromptConfig } from '../types';

/**
 * 🎚️ SISTEMA DE REGULADOR DE REALIDAD - MATRIZ EVOLUTIVA
 *
 * Este servicio mapea el valor del slider (1.0 a 5.0) con variables específicas del prompt
 * para controlar el nivel de realismo de las imágenes generadas.
 *
 * Cada nivel tiene un "salto" perceptible pero suave, permitiendo al usuario
 * controlar exactamente qué nivel de calidad visual quiere para su negocio.
 */

// ============================================
// 🎨 MODIFICADORES DE COMPORTAMIENTO POR CATEGORÍA
// ============================================

// Categoría "Cruda" (1.0 - 2.0): Inyecta artifacts de cámara baja
const CRUDA_MODIFIERS = {
  chromaticAberration: true,
  digitalNoise: true,
  lowLightArtifacts: true,
  compressionArtifacts: true
};

// Categoría "Auténtica" (2.5): El ancla de Estudio 56
const AUTENTICA_MODIFIERS = {
  noBokeh: true,
  overheadLED: true,
  realisticClutter: true,
  noLuxuryElements: true
};

// Categoría "Profesional" (3.0 - 3.5): Limpio y ordenado
const PROFESIONAL_MODIFIERS = {
  softNaturalLighting: true,
  depthOfField: true,
  cleanEnvironment: true,
  professionalLook: true
};

// Categoría "Aspiracional" (4.0 - 5.0): Elimina imperfecciones
const ASPIRACIONAL_MODIFIERS = {
  noDust: true,
  noScuffMarks: true,
  noSweat: true,
  perfectSkin: true,
  luxuryElements: true
};

// ============================================
// 🛡️ NEGATIVE PROMPTS ESPECIALIZADOS POR CATEGORÍA
// ============================================

// 1. Crudo (1.0 - 1.5): Queremos que se vea "mal" a propósito
export const NEGATIVE_CRUDA = "professional lighting, studio, sharp focus, clean lens, high dynamic range, artistic bokeh, balanced colors, 4k, high quality, perfect exposure, professional camera";

// 2. Auténtico (2.0 - 2.5): Bloqueamos la "fantasía de catálogo"
export const NEGATIVE_AUTENTICA = "luxury, marble, cinematic, dramatic shadows, fashion model look, airbrushed skin, perfect symmetry, expensive decor, studio flash, hotel lobby, candles, smoke, steam, fog, luxury resort";

// 3. Profesional (3.0 - 3.5): Empezamos a exigir limpieza
export const NEGATIVE_PROFESIONAL = "digital noise, blurry, messy, dirty floor, trash, poor lighting, low resolution, cheap furniture, shaky camera, amateur photography, grainy, compression artifacts";

// 4. Aspiracional (4.0 - 4.5): Eliminamos lo "común"
export const NEGATIVE_ASPIRACIONAL = "scuffed walls, sweat, realistic clutter, average body type, raw textures, everyday look, flat lighting, amateur photography, basic equipment, cheap materials, natural imperfections";

// 5. Lujo (5.0): Perfection absoluta e irreal
export const NEGATIVE_LUJO = "poverty, real life, basic equipment, cheap materials, natural skin imperfections, handheld camera, natural mess, everyday objects, average people, poor lighting, amateur";

// ============================================
// 📊 CONFIGURACIÓN DE NIVELES DE REALIDAD - MATRIZ EVOLUTIVA
// ============================================

export const REALITY_CONFIGS: Record<RealityLevel, RealityPromptConfig> = {
  // ============================================
  // 1.0 - 2.0: CRUDO / DIY
  // ============================================
  1.0: {
    stars: 1.0,
    label: "Hostal",
    description: "Blanco y negro o color lavado, ruido extremo, ángulo alto, 480p",
    technicalProfile: "Celular 2010 / Muy pixelado",
    lighting: "Poor overhead lighting, harsh fluorescent, uneven exposure, some areas completely dark",
    atmosphere: "Grainy, low resolution, compressed video quality, security camera aesthetic",
    camera: "Old security camera, 480p, visible compression artifacts, motion blur, wide angle distortion",
    human: "Unrecognizable faces, low detail, no professional posing, candid and unpolished",
    negative: NEGATIVE_CRUDA,
    categoryModifiers: CRUDA_MODIFIERS,
    icon: "🏠"
  },
  1.5: {
    stars: 1.5,
    label: "Motel",
    description: "Granulado, saturación baja, óptica deficiente, 720p",
    technicalProfile: "Celular 2015 / Granulado",
    lighting: "Basic LED ceiling light, slight yellow tint, shadows on one side, mixed color temperature",
    atmosphere: "Authentic everyday local, minor clutter visible, functional business space, natural mess",
    camera: "Old smartphone or basic camera, 720p, visible noise, slight blur, natural imperfections",
    human: "Average people, common clothing brands, natural expressions, no professional styling, candid moments",
    negative: NEGATIVE_CRUDA,
    categoryModifiers: CRUDA_MODIFIERS,
    icon: "🛏️"
  },

  // ============================================
  // 2.0 - 2.5: AUTÉNTICO LOCAL (El punto dulce)
  // ============================================
  2.0: {
    stars: 2.0,
    label: "2★",
    description: "Rango dinámico limitado, balance de blancos automático (errático)",
    technicalProfile: "Post rápido / Espontáneo",
    lighting: "Standard overhead LED, slightly harsh shadows, natural indoor lighting, mixed sources",
    atmosphere: "Real local business, everyday clutter, authentic environment, functional space",
    camera: "Budget smartphone, 1080p, visible but acceptable noise, deep focus, natural look",
    human: "Real customers, common sportswear, natural sweat, authentic effort visible, relatable subjects",
    negative: NEGATIVE_AUTENTICA,
    categoryModifiers: { ...CRUDA_MODIFIERS, ...AUTENTICA_MODIFIERS },
    icon: "🏨"
  },
  2.5: {
    stars: 2.5,
    label: "3★",
    description: "Punto Dulce. Smartphone moderno, luz de techo, sin filtros",
    technicalProfile: "Generar Confianza - El ancla de Estudio 56",
    lighting: "Standard overhead LED or natural window light, slight shadows, authentic, no dramatic lighting, mixed color temperature from different light sources",
    atmosphere: "Functional local business, realistic clutter - visible power outlet on wall, wear mark on floor, fire extinguisher on wall, minor everyday mess, relatable setting",
    camera: "Modern smartphone, 12-48MP, natural noise, deep focus, authentic look, auto white balance artifacts, visible skin pores and natural texture",
    human: "Average person, natural sweat visible, non-branded gym wear, authentic expressions, relatable, natural skin texture with visible pores, no airbrushing",
    negative: NEGATIVE_AUTENTICA,
    categoryModifiers: AUTENTICA_MODIFIERS,
    icon: "⭐⭐⭐"
  },
  3.0: {
    stars: 3.0,
    label: "4★",
    description: "DSLR con lente de kit, enfoque nítido, luz natural balanceada",
    technicalProfile: "Perfil de Negocio Google",
    lighting: "Balanced natural light, soft shadows, professional but natural, window light",
    atmosphere: "Clean and organized local business, professional environment, tidy but not sterile",
    camera: "Entry-level DSLR or mirrorless, 1080p-4k, shallow bokeh possible, sharp focus",
    human: "Fit but relatable subjects, natural expressions, common activewear brands, genuine smiles",
    negative: NEGATIVE_PROFESIONAL,
    categoryModifiers: PROFESIONAL_MODIFIERS,
    icon: "⭐⭐⭐⭐"
  },

  // ============================================
  // 3.5 - 4.0: PROFESIONAL ESTÁNDAR
  // ============================================
  3.5: {
    stars: 3.5,
    label: "4★+",
    description: "Fotografía comercial profesional, iluminación de estudio",
    technicalProfile: "Web / Landing Page",
    lighting: "Professional softbox lighting, balanced exposure, subtle rim light, controlled environment",
    atmosphere: "Clean and polished business setting, professional aesthetic, inviting atmosphere",
    camera: "Professional DSLR or mirrorless, 4k, controlled bokeh, sharp details, smooth tones",
    human: "Athletic but natural subjects, genuine expressions, quality activewear, approachable look",
    negative: NEGATIVE_PROFESIONAL,
    categoryModifiers: PROFESIONAL_MODIFIERS,
    icon: "✨"
  },
  4.0: {
    stars: 4.0,
    label: "5★",
    description: "Formato medio, iluminación de estudio, retoque de piel sutil",
    technicalProfile: "Catálogo / Revista",
    lighting: "Studio lighting with modifiers, perfect highlights and shadows, professional setup",
    atmosphere: "Highly polished commercial space, aspirational but believable, magazine quality",
    camera: "High-end camera, 8k capable, cinematic bokeh, magazine quality, perfect composition",
    human: "Fit models, professional posing, quality branded clothing, subtle makeup, polished look",
    negative: NEGATIVE_ASPIRACIONAL,
    categoryModifiers: ASPIRACIONAL_MODIFIERS,
    icon: "🌟"
  },

  // ============================================
  // 4.5 - 5.0: ASPIRACIONAL / LUJO
  // ============================================
  4.5: {
    stars: 4.5,
    label: "5★+",
    description: "Look publicitario de alta gama, alto contraste, paleta controlada",
    technicalProfile: "Campañas de Pago (Ads)",
    lighting: "Cinematic lighting, softboxes, reflectors, perfect light control, dramatic but beautiful",
    atmosphere: "Luxury aesthetic, premium materials visible, aspirational environment, polished to perfection",
    camera: "Cinema camera quality, shallow depth of field, perfect sharpness, high-end commercial",
    human: "Supermodel quality, perfect skin, designer activewear, flawless posing, aspirational figures",
    negative: NEGATIVE_ASPIRACIONAL,
    categoryModifiers: ASPIRACIONAL_MODIFIERS,
    icon: "💎"
  },
  5.0: {
    stars: 5.0,
    label: "Resort",
    description: "Formato anamórfico, luces teatrales, atmósfera estilizada (humo/mármol)",
    technicalProfile: "Branding Aspiracional",
    lighting: "Cinematic sunset lighting, studio softboxes, dramatic highlights, theatrical setup",
    atmosphere: "Luxury resort, marble surfaces, fog machines, candle-lit ambiance, impossible perfection",
    camera: "Arri Alexa or RED cinema camera, 8k raw, heavy cinematic bokeh, film grain aesthetic",
    human: "Supermodel, perfect skin, designer luxury wear, impossible perfection, movie star quality",
    negative: NEGATIVE_LUJO,
    categoryModifiers: ASPIRACIONAL_MODIFIERS,
    icon: "🏆"
  }
};

// ============================================
// 🔄 SISTEMA DE HERENCIA DE PROMPTS (CAPAS)
// ============================================

/**
 * Capas que se añaden o quitan según el nivel de realidad
 * Útil para transiciones suaves entre niveles
 */
export const REALITY_LAYERS: Record<RealityLevel, { add: string; remove: string }> = {
  1.0: {
    add: "security camera footage, grainy, low quality, timestamp overlay, motion blur, surveillance aesthetic, auto white balance failure, mixed color temperature, harsh fluorescent lighting",
    remove: "professional, high quality, sharp, 4k, studio lighting, beautiful models, perfect color grading"
  },
  1.5: {
    add: "amateur photo, smartphone camera, natural but imperfect, authentic everyday look, auto white balance artifacts, mixed lighting sources, slight color cast",
    remove: "professional photography, studio, perfect lighting, magazine quality, perfect color harmony"
  },
  2.0: {
    add: "modern smartphone photo, standard room lighting, visible details, everyday authenticity, auto white balance, mixed color temperature from window and artificial light",
    remove: "cinematic, professional studio, artificial perfection, luxury aesthetic, perfect color grading"
  },
  2.5: {
    add: "shot on iPhone 15, standard room lighting, visible skin pores, natural movements, authentic local, realistic clutter - power outlet visible, wear mark on floor, fire extinguisher on wall, mixed color temperature",
    remove: "cinematic, professional studio, artificial fog, marble floors, luxury resort, airbrushed skin, perfect color grading"
  },
  3.0: {
    add: "DSLR quality, natural light photography, clean and professional, Google Business Profile aesthetic, balanced color temperature, slight bokeh possible",
    remove: "grainy, noisy, amateur, low resolution, messy environment, auto white balance artifacts"
  },
  3.5: {
    add: "commercial photography, softbox lighting, slight bokeh, professional retouch, clean aesthetic, balanced color grading",
    remove: "digital noise, blurry, poor lighting, amateur photography, visible wear marks, power outlets"
  },
  4.0: {
    add: "fashion editorial, studio lighting, magazine cover quality, polished and aspirational, perfect color grading and harmony, subtle skin retouching",
    remove: "scuffed walls, sweat, realistic clutter, everyday look, visible pores, auto white balance"
  },
  4.5: {
    add: "high-end commercial, luxury advertising, cinematic quality, premium aesthetic, perfect color harmony, airbrushed skin, pristine environment",
    remove: "average, basic, everyday, amateur, low budget, visible imperfections, realistic clutter"
  },
  5.0: {
    add: "Arri Alexa, 85mm lens, high-end luxury aesthetics, volumetric lighting, pristine environment, cinematic masterpiece, perfect color grading, airbrushed high-end retouching",
    remove: "smartphone, grainy, noisy, cluttered, basic, real life, visible pores, wear marks, power outlets, auto white balance"
  }
};

// ============================================
// 🛠️ FUNCIONES DE MAPEO
// ============================================

/**
 * Obtiene la configuración completa para un nivel de estrellas
 */
export const getRealityConfig = (stars: RealityLevel): RealityPromptConfig => {
  return REALITY_CONFIGS[stars];
};

/**
 * Obtiene el label para un nivel de estrellas
 */
export const getRealityLabel = (stars: RealityLevel): string => {
  return REALITY_CONFIGS[stars].label;
};

/**
 * Obtiene la descripción para un nivel de estrellas
 */
export const getRealityDescription = (stars: RealityLevel): string => {
  return REALITY_CONFIGS[stars].description;
};

/**
 * Genera el bloque de prompt completo para un nivel de estrellas
 */
export const getRealityPromptBlock = (stars: RealityLevel): string => {
  const config = REALITY_CONFIGS[stars];
  
  return `
REALITY_LEVEL: ${stars} Stars - ${config.label}
${config.description}

LIGHTING: ${config.lighting}

ATMOSPHERE: ${config.atmosphere}

CAMERA: ${config.camera}

HUMAN_SUBJECTS: ${config.human}

NEGATIVE_PROMPT: ${config.negative}
`.trim();
};

/**
 * Genera el prompt negativo combinado para un nivel de estrellas
 */
export const getRealityNegativePrompt = (stars: RealityLevel): string => {
  const config = REALITY_CONFIGS[stars];
  return config.negative;
};

/**
 * Genera el prompt de iluminación para un nivel de estrellas
 */
export const getRealityLightingPrompt = (stars: RealityLevel): string => {
  return REALITY_CONFIGS[stars].lighting;
};

/**
 * Genera el prompt de atmósfera para un nivel de estrellas
 */
export const getRealityAtmospherePrompt = (stars: RealityLevel): string => {
  return REALITY_CONFIGS[stars].atmosphere;
};

/**
 * Genera el prompt de cámara para un nivel de estrellas
 */
export const getRealityCameraPrompt = (stars: RealityLevel): string => {
  return REALITY_CONFIGS[stars].camera;
};

/**
 * Genera el prompt de sujetos humanos para un nivel de estrellas
 */
export const getRealityHumanPrompt = (stars: RealityLevel): string => {
  return REALITY_CONFIGS[stars].human;
};

/**
 * Obtiene todos los niveles de estrellas disponibles
 */
export const getAvailableRealityLevels = (): RealityLevel[] => {
  return [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
};

/**
 * Obtiene el icono para un nivel de estrellas
 */
export const getRealityIcon = (stars: RealityLevel): string => {
  return REALITY_CONFIGS[stars].icon;
};

/**
 * Determina si un nivel de estrellas es "realista" (2.5 o menos)
 */
export const isRealisticLevel = (stars: RealityLevel): boolean => {
  return stars <= 2.5;
};

/**
 * Determina si un nivel de estrellas es "aspiracional" (4.0 o más)
 */
export const isAspirationalLevel = (stars: RealityLevel): boolean => {
  return stars >= 4.0;
};

/**
 * Obtiene la categoría de un nivel de estrellas
 */
export const getRealityCategory = (stars: RealityLevel): 'crudo' | 'autentico' | 'profesional' | 'aspiracional' | 'lujo' => {
  if (stars <= 1.5) return 'crudo';
  if (stars <= 2.5) return 'autentico';
  if (stars <= 3.5) return 'profesional';
  if (stars <= 4.5) return 'aspiracional';
  return 'lujo';
};

/**
 * Genera un prompt completo combinando todos los elementos de realidad
 */
export const buildRealityPrompt = (
  basePrompt: string,
  stars: RealityLevel,
  includeNegative: boolean = true
): string => {
  const config = REALITY_CONFIGS[stars];
  
  let prompt = `
${basePrompt}

REALITY_SETTINGS_${stars}:
${config.lighting}

ATMOSPHERE:
${config.atmosphere}

CAMERA_SPECS:
${config.camera}

SUBJECT_STYLE:
${config.human}
`.trim();

  if (includeNegative) {
    prompt += `\n\nAVOID:\n${config.negative}`;
  }

  return prompt;
};

/**
 * Interpolación simple entre dos niveles de estrellas
 * Útil para transiciones suaves
 */
export const interpolateRealityLevel = (
  fromStars: RealityLevel,
  toStars: RealityLevel,
  progress: number // 0 a 1
): RealityLevel => {
  if (progress <= 0) return fromStars;
  if (progress >= 1) return toStars;
  
  const fromValue = getRealityLevelValue(fromStars);
  const toValue = getRealityLevelValue(toStars);
  const interpolatedValue = fromValue + (toValue - fromValue) * progress;
  
  // Redondear al nivel más cercano
  const levels = getAvailableRealityLevels();
  let closest = levels[0];
  let minDiff = Math.abs(interpolatedValue - fromValue);
  
  for (const level of levels) {
    const diff = Math.abs(interpolatedValue - level);
    if (diff < minDiff) {
      minDiff = diff;
      closest = level;
    }
  }
  
  return closest;
};

/**
 * Convierte el nivel de estrellas a valor numérico para cálculos
 */
export const getRealityLevelValue = (stars: RealityLevel): number => {
  return parseFloat(stars.toString());
};

/**
 * Obtiene el nivel de estrellas recomendado para un tipo de negocio
 */
export const getRecommendedRealityLevel = (
  businessType: 'local' | 'pyme' | 'startup' | 'premium' | 'luxury'
): RealityLevel => {
  const recommendations: Record<typeof businessType, RealityLevel> = {
    local: 2.0,
    pyme: 2.5,
    startup: 3.0,
    premium: 3.5,
    luxury: 4.0
  };
  
  return recommendations[businessType];
};

// ============================================
// 🎨 EXPORTAR CONFIGURACIÓN PARA DEBUG
// ============================================

export const debugRealityConfig = (stars: RealityLevel): void => {
  const config = REALITY_CONFIGS[stars];
  console.log(`═══════════════════════════════════════════`);
  console.log(`🎚️ REALITY CONFIG: ${stars} ESTRELLAS`);
  console.log(`═══════════════════════════════════════════`);
  console.log(`Label: ${config.label}`);
  console.log(`Description: ${config.description}`);
  console.log(`Icon: ${config.icon}`);
  console.log(`───────────────────────────────────────────`);
  console.log(`LIGHTING: ${config.lighting}`);
  console.log(`ATMOSPHERE: ${config.atmosphere}`);
  console.log(`CAMERA: ${config.camera}`);
  console.log(`HUMAN: ${config.human}`);
  console.log(`NEGATIVE: ${config.negative}`);
  console.log(`═══════════════════════════════════════════`);
};
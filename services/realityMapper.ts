import { RealityLevel, RealityPromptConfig } from '../types';

/**
 * 🎚️ SISTEMA DE REGULADOR DE REALIDAD
 * 
 * Este servicio mapea el valor del slider (0.5 a 5.0) con variables específicas del prompt
 * para controlar el nivel de realismo de las imágenes generadas.
 */

// ============================================
// 📊 CONFIGURACIÓN DE NIVELES DE REALIDAD
// ============================================

export const REALITY_CONFIGS: Record<RealityLevel, RealityPromptConfig> = {
  // ============================================
  // 1.0 - 2.0: CRUDO / DIY (Cámara de seguridad / Celular viejo)
  // ============================================
  1.0: {
    stars: 1.0,
    label: "CCTV / Seguridad",
    description: "Cámara de seguridad de baja calidad",
    lighting: "Poor overhead lighting, harsh fluorescent, uneven exposure, some areas completely dark",
    atmosphere: "Grainy, low resolution, compressed video quality, security camera aesthetic",
    camera: "Old security camera, 480p, visible compression artifacts, motion blur",
    human: "Unrecognizable faces, low detail, no professional posing, candid and unpolished",
    negative: "high quality, professional, studio lighting, sharp, clear, 4k, beautiful models",
    icon: "📸"
  },
  1.5: {
    stars: 1.5,
    label: "Celular Antiguo",
    description: "Smartphone básico de hace años",
    lighting: "Basic LED ceiling light, slight yellow tint, shadows on one side",
    atmosphere: "Authentic everyday local, minor clutter visible, functional business space",
    camera: "Old smartphone photo, 720p, visible noise, slight blur, natural imperfections",
    human: "Average people, common clothing brands, natural expressions, no professional styling",
    negative: "professional photography, studio lighting, perfect skin, models, high-end",
    icon: "📱"
  },

  // ============================================
  // 2.5: AUTÉNTICO LOCAL (El punto dulce -默认值)
  // ============================================
  2.0: {
    stars: 2.0,
    label: "Smartphone Básico",
    description: "Celular moderno pero sin cámara premium",
    lighting: "Standard overhead LED, slightly harsh shadows, natural indoor lighting",
    atmosphere: "Real local business, everyday clutter, authentic environment, functional space",
    camera: "Budget smartphone, 1080p, visible but acceptable noise, deep focus",
    human: "Real customers, common sportswear, natural sweat, authentic effort visible",
    negative: "professional studio, softbox lighting, bokeh, airbrushed, perfect skin",
    icon: "📱"
  },
  2.5: {
    stars: 2.5,
    label: "Auténtico Local",
    description: "El punto dulce - foto de smartphone moderno",
    lighting: "Standard overhead LED or natural window light, slight shadows, authentic",
    atmosphere: "Functional local business, minor clutter, real everyday environment",
    camera: "Modern smartphone, 12-48MP, natural noise, deep focus, authentic look",
    human: "Average person, natural sweat, non-branded gym wear, authentic expressions",
    negative: "hotel lobby, luxury resort, marble, candles, smoke, steam, fog, perfect symmetry",
    icon: "🏪"
  },
  3.0: {
    stars: 3.0,
    label: "Semi-Profesional",
    description: "Cámara básica DSLR/sin espejo",
    lighting: "Balanced natural light, soft shadows, professional but natural",
    atmosphere: "Clean and organized local business, professional environment",
    camera: "Entry-level DSLR or mirrorless, 1080p-4k, shallow bokeh possible",
    human: "Fit but relatable subjects, natural expressions, common activewear brands",
    negative: "supermodel, heavy makeup, plastic skin, luxury resort, hotel aesthetics",
    icon: "📷"
  },

  // ============================================
  // 3.5 - 4.0: PROFESIONAL ESTÁNDAR
  // ============================================
  3.5: {
    stars: 3.5,
    label: "Profesional",
    description: "Fotografía comercial profesional",
    lighting: "Professional softbox lighting, balanced exposure, subtle rim light",
    atmosphere: "Clean and polished business setting, professional aesthetic",
    camera: "Professional DSLR or mirrorless, 4k, controlled bokeh, sharp details",
    human: "Athletic but natural subjects, genuine expressions, quality activewear",
    negative: "candles, smoke, steam, fog, water reflections, floating objects, plastic textures",
    icon: "🏢"
  },
  4.0: {
    stars: 4.0,
    label: "Editorial",
    description: "Revista de moda/publicidad",
    lighting: "Studio lighting with modifiers, perfect highlights and shadows",
    atmosphere: "Highly polished commercial space, aspirational but believable",
    camera: "High-end camera, 8k capable, cinematic bokeh, magazine quality",
    human: "Fit models, professional posing, quality branded clothing, subtle makeup",
    negative: "candles, excessive smoke, water on floor, neon, impossible physics",
    icon: "✨"
  },

  // ============================================
  // 4.5 - 5.0: ASPIRACIONAL / LUJO
  // ============================================
  4.5: {
    stars: 4.5,
    label: "Premium",
    description: "Alta gama publicitaria",
    lighting: "Cinematic lighting, softboxes, reflectors, perfect light control",
    atmosphere: "Luxury aesthetic, premium materials visible, aspirational environment",
    camera: "Cinema camera quality, shallow depth of field, perfect sharpness",
    human: "Supermodel quality, perfect skin, designer activewear, flawless posing",
    negative: "security camera aesthetic, grain, noise, amateur photography, CCTV",
    icon: "💎"
  },
  5.0: {
    stars: 5.0,
    label: "Cine / Fantasía",
    description: "Render de hotel 5 estrellas",
    lighting: "Cinematic sunset lighting, studio softboxes, dramatic highlights",
    atmosphere: "Luxury resort, marble surfaces, fog machines, candle-lit ambiance",
    camera: "Arri Alexa or RED cinema camera, 8k raw, heavy cinematic bokeh",
    human: "Supermodel, perfect skin, designer luxury wear, impossible perfection",
    negative: "grain, noise, amateur, CCTV, security camera, realistic imperfections",
    icon: "🏆"
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
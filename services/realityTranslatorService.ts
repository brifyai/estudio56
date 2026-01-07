/**
 * 🎚️ SERVICIO DE TRADUCCIÓN DE REALIDAD
 *
 * Este servicio traduce el valor numérico de estrellas (1-5) a términos
 * técnicos de fotografía que Gemini e Imagen 3 pueden interpretar directamente.
 *
 * Cada nivel tiene descriptores específicos para lograr cambios visuales drásticos.
 */

import { RealityLevel } from '../types';
import { REALITY_CONFIGS, getRealityCategory as getRealityCat } from './realityMapper';

/**
 * Descriptores técnicos por nivel de realidad
 * Estos términos están diseñados para que Imagen 3 ajuste su algoritmo de renderizado
 */
export const REALITY_TECHNICAL_PROMPTS: Record<number, string> = {
  // === CRUDO (1.0 - 1.5) ===
  1.0: `
    PHOTOGRAPHY_STYLE: Security camera footage aesthetic
    CAMERA_SPECS: 480p, visible compression artifacts, motion blur, wide angle distortion
    LIGHTING: Poor overhead fluorescent, harsh shadows, uneven exposure, some areas completely dark
    LENS: Built-in webcam quality, no autofocus, fixed aperture
    QUALITY: Low bitrate, grainy, timestamp overlay visible, security camera aesthetic
    SKIN: Visible skin imperfections, natural texture, no retouching
    MOOD: Documentary, unposed, authentic, "caught on camera" feel
  `,
  1.5: `
    PHOTOGRAPHY_STYLE: Smartphone snapshot, casual mobile photography
    CAMERA_SPECS: 720p-1080p, visible but acceptable noise, slight blur, natural imperfections
    LIGHTING: Standard LED ceiling light, slight yellow tint, mixed color temperature, window light
    LENS: Smartphone camera, wide angle, digital zoom artifacts possible
    QUALITY: Amateur photo, unedited, authentic everyday look, auto white balance artifacts
    SKIN: Natural skin texture, visible pores, no airbrushing, real sweat visible
    MOOD: Candid, spontaneous, relatable, "taken by a friend" feel
  `,

  // === AUTÉNTICO (2.0 - 2.5) ===
  2.0: `
    PHOTOGRAPHY_STYLE: Street photography, documentary style
    CAMERA_SPECS: Budget smartphone or entry-level DSLR, 1080p, deep focus, natural look
    LIGHTING: Natural daylight from window, mixed artificial and natural light, slight shadows
    LENS: 35mm equivalent, sharp throughout, no bokeh
    QUALITY: Clean but not polished, authentic local business atmosphere
    SKIN: Real skin texture, visible pores, natural expressions, relatable subjects
    MOOD: Genuine, trustworthy, local business aesthetic
  `,
  2.5: `
    PHOTOGRAPHY_STYLE: Modern smartphone photography, "shot on iPhone" aesthetic
    CAMERA_SPECS: 12-48MP smartphone camera, natural noise, deep focus, authentic look
    LIGHTING: Standard overhead LED or natural window light, slight shadows, authentic, no dramatic lighting
    LENS: Smartphone lens, wide to normal focal length
    QUALITY: High quality but authentic, auto white balance artifacts, visible skin pores
    SKIN: Natural texture, visible pores, no airbrushing, real sweat visible
    MOOD: Trustworthy, relatable, "this is a real local business" feel
  `,

  // === PROFESIONAL (3.0 - 3.5) ===
  3.0: `
    PHOTOGRAPHY_STYLE: Commercial photography, Google Business Profile aesthetic
    CAMERA_SPECS: Entry-level DSLR or mirrorless, 1080p-4k, shallow bokeh possible, sharp focus
    LIGHTING: Balanced natural light, soft shadows, professional but natural, window light
    LENS: 50mm-85mm portrait lens, smooth bokeh
    QUALITY: Professional finish, clean, well-composed
    SKIN: Clean skin, minor retouching, natural but polished
    MOOD: Professional, established business, quality service
  `,
  3.5: `
    PHOTOGRAPHY_STYLE: Commercial product photography, softbox lighting
    CAMERA_SPECS: Professional DSLR or mirrorless, 4k, controlled bokeh, sharp details
    LIGHTING: Professional softbox lighting, balanced exposure, subtle rim light, controlled environment
    LENS: 85mm portrait lens, smooth background blur
    QUALITY: Commercial grade, polished, professional retouch
    SKIN: Clean skin, subtle makeup, polished but natural
    MOOD: Premium service, professional establishment, quality products
  `,

  // === ASPIRACIONAL (4.0 - 4.5) ===
  4.0: `
    PHOTOGRAPHY_STYLE: Fashion editorial, magazine cover quality
    CAMERA_SPECS: High-end camera, 8k capable, cinematic bokeh, magazine quality
    LIGHTING: Studio lighting with modifiers, perfect highlights and shadows, professional setup
    LENS: 85mm-135mm portrait lens, beautiful bokeh
    QUALITY: Editorial grade, polished, magazine quality
    SKIN: Airbrushed but natural-looking, subtle retouching, perfect skin
    MOOD: Aspirational, premium brand, luxury experience
  `,
  4.5: `
    PHOTOGRAPHY_STYLE: High-end commercial advertising, luxury brand campaign
    CAMERA_SPECS: Cinema camera quality, shallow depth of field, perfect sharpness, high-end commercial
    LIGHTING: Cinematic lighting, softboxes, reflectors, perfect light control, dramatic but beautiful
    LENS: 85mm prime, anamorphic possible, creamy bokeh
    QUALITY: Advertising campaign grade, flawless, luxury aesthetic
    SKIN: Perfect skin, airbrushed, model-quality complexion
    MOOD: Luxury lifestyle, exclusive experience, premium brand
  `,

  // === LUJO (5.0) ===
  5.0: `
    PHOTOGRAPHY_STYLE: Unreal engine 5 render, 8k resolution, raytracing
    CAMERA_SPECS: Arri Alexa or RED cinema camera, 8k raw, heavy cinematic bokeh, film grain aesthetic
    LIGHTING: Cinematic sunset lighting, studio softboxes, dramatic highlights, theatrical setup
    LENS: Anamorphic lens, cinematic character, dreamlike bokeh
    QUALITY: Impossible perfection, masterpiece quality, hyper-realistic
    SKIN: Supermodel quality, flawless, perfect skin, movie star quality
    MOOD: Unattainable luxury, aspirational perfection, dream lifestyle
  `
};

/**
 * System prompt para Gemini 2.0 Flash
 * Este es el "filtro" que garantiza el contexto chileno y el nivel de realidad
 */
export const REALITY_SYSTEM_PROMPT = `
Eres un Director de Arte experto en fotografía publicitaria chilena. 
Tu tarea es mejorar el prompt del usuario basándote en un NIVEL DE REALIDAD (1-5 estrellas).

INSTRUCCIONES CRÍTICAS:
1. Si Nivel < 2: Evita la perfección. Añade texturas de piel real, iluminación natural de casa o calle, ruido digital.
2. Si Nivel > 4: Añade términos de post-producción de lujo, iluminación de estudio y acabados pulidos.
3. CONTEXTO CHILE: Asegura que las personas se vean como chilenos reales (fenotipos mixtos: mapuche-european, spanish, indigenous).
4. TRADUCCIÓN TÉCNICA: Convierte el nivel de estrellas en parámetros fotográficos específicos (lente, iluminación, calidad).

FORMATO DE SALIDA:
Devuelve ÚNICAMENTE el prompt técnico en inglés optimizado para Imagen 3.
No añadas explicaciones ni comentarios adicionales.
`;

/**
 * Genera el prompt técnico completo para un nivel de realidad específico
 */
export const getTechnicalRealityPrompt = (stars: number, basePrompt: string): string => {
  const levelKey = Math.round(stars * 2) / 2; // Redondear a 0.5
  const technicalDescriptors = REALITY_TECHNICAL_PROMPTS[levelKey] || REALITY_TECHNICAL_PROMPTS[2.5];
  
  return `
${basePrompt}

REALITY_LEVEL: ${levelKey} Stars
${technicalDescriptors}

NEGATIVE_PROMPT: ${getNegativePromptForLevel(levelKey)}
  `.trim();
};

/**
 * Prompt negativo específico por nivel - CON BLOQUEO DE TEXTO INAMOVIBLE
 * El bloqueo de texto siempre va primero y se repite para máxima efectividad
 */
export const getNegativePromptForLevel = (stars: number): string => {
  // BLOQUEO INAMOVIBLE DE TEXTO - Prioridad absoluta
  const textBlock = 'text, letters, words, typography, signature, watermark, text overlay, captions, titles, menu boards, price tags, signs, billboards, posters, written characters';
  
  if (stars <= 1.5) {
    // Nivel CRUDO: Forzamos look "bajo" pero SIN texto
    return `${textBlock}, professional lighting, studio setup, softbox, bokeh, 4k, 8k, cinematic, retouched, perfect skin, clean, high quality, high quality, high quality`;
  } else if (stars <= 2.5) {
    // Nivel AUTÉNTICO: Bloqueamos fantasía de catálogo
    return `${textBlock}, luxury, marble, cinematic, dramatic shadows, fashion model look, airbrushed skin, perfect symmetry, expensive decor, studio flash, hotel lobby, candles, smoke, steam, fog, luxury resort, professional retouch`;
  } else if (stars <= 3.5) {
    // Nivel PROFESIONAL: Bloqueamos imperfecciones
    return `${textBlock}, digital noise, blurry, messy, dirty floor, trash, poor lighting, low resolution, cheap furniture, shaky camera, amateur photography, grainy, compression artifacts, smartphone photo, casual snapshot`;
  } else if (stars <= 4.5) {
    // Nivel ASPIRACIONAL: Bloqueamos lo "común"
    return `${textBlock}, scuffed walls, sweat, realistic clutter, average body type, raw textures, everyday look, flat lighting, amateur photography, basic equipment, cheap materials, natural imperfections, visible pores, unretouched`;
  } else {
    // Nivel LUJO: Perfection absoluta
    return `${textBlock}, poverty, real life, basic equipment, cheap materials, natural skin imperfections, handheld camera, natural mess, everyday objects, average people, poor lighting, amateur, smartphone photo, casual snapshot`;
  }
};

/**
 * Genera el prefijo de fuerza para el prompt - El orden es clave: Realidad > Sujeto > Escudo Anti-Texto
 */
export const getRealityPrefix = (stars: number): string => {
  const levelKey = Math.round(stars * 2) / 2;
  const config = REALITY_CONFIGS[levelKey];
  
  return `[MODE: ${config.label.toUpperCase()} PHOTO]`;
};

/**
 * Genera el prompt final con prefijo de fuerza y bloqueo de texto al inicio
 */
export const buildPowerPrompt = (basePrompt: string, stars: number): string => {
  const prefix = getRealityPrefix(stars);
  const negative = getNegativePromptForLevel(stars);
  const levelKey = Math.round(stars * 2) / 2;
  const config = REALITY_CONFIGS[levelKey];
  
  return `
    ${prefix} A raw, authentic photography of ${basePrompt}.
    STERN RULES: NO TEXT, NO LETTERS, NO TYPOGRAPHY.
    ${config.lighting}
    ${config.atmosphere}
    ${config.camera}
    ${config.human}
    AVOID: ${negative}
  `.trim();
};

/**
 * Obtiene el label descriptivo para un nivel
 */
export const getRealityLabel = (stars: number): string => {
  const labels: Record<number, string> = {
    1.0: 'CCTV / Seguridad',
    1.5: 'Cámara Espía',
    2.0: 'Celular Básico',
    2.5: 'Auténtico Local',
    3.0: 'Semi-Pro',
    3.5: 'Comercial',
    4.0: 'Editorial',
    4.5: 'Premium Ad',
    5.0: 'Cinematográfico'
  };
  return labels[Math.round(stars * 2) / 2] || 'Auténtico Local';
};

/**
 * Genera el prompt final combinando base + realidad
 * Este es el prompt que se envía a Gemini/Imagen 3
 */
export const buildRealityPrompt = (
  basePrompt: string,
  stars: RealityLevel,
  includeNegative: boolean = true
): string => {
  const technicalPrompt = getTechnicalRealityPrompt(stars, basePrompt);
  
  if (includeNegative) {
    const negativePrompt = getNegativePromptForLevel(stars);
    return `${technicalPrompt}\n\nSTRICTLY AVOID:\n${negativePrompt}`;
  }
  
  return technicalPrompt;
};

/**
 * Obtiene parámetros de generación específicos por nivel
 */
export const getGenerationParams = (stars: number): {
  strength: number;
  guidanceScale: number;
  steps: number;
} => {
  // Niveles bajos = menos strength (más cerca de la imagen original)
  // Niveles altos = más strength (más libertad para la IA)
  if (stars <= 1.5) {
    return { strength: 0.2, guidanceScale: 15, steps: 4 };
  } else if (stars <= 2.5) {
    return { strength: 0.35, guidanceScale: 12, steps: 5 };
  } else if (stars <= 3.5) {
    return { strength: 0.5, guidanceScale: 10, steps: 6 };
  } else if (stars <= 4.5) {
    return { strength: 0.65, guidanceScale: 8, steps: 7 };
  } else {
    return { strength: 0.8, guidanceScale: 7, steps: 8 };
  }
};
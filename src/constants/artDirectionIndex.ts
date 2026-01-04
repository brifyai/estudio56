import { ArtDirectionConfig, ART_DIRECTION_PROMPTS } from './artDirection';
import { ART_DIRECTION_PHASE2 } from './artDirectionPhase2';
import { ART_DIRECTION_PHASE3 } from './artDirectionPhase3';

// ============================================
// ÍNDICE MAESTRO DE DIRECCIÓN DE ARTE
// Rubros 1-60: Sistema Completo de Agencia
// ============================================

/** Catálogo completo de todos los rubros de dirección de arte */
export const ART_DIRECTION_CATALOG: Record<number, ArtDirectionConfig> = {};

// Inicializar con rubros 1-20
Object.entries(ART_DIRECTION_PROMPTS).forEach(([key, value]) => {
  ART_DIRECTION_CATALOG[Number(key)] = value;
});

// Agregar rubros 21-40 (convertir de ArtDirectionPrompt a ArtDirectionConfig)
Object.entries(ART_DIRECTION_PHASE2).forEach(([key, value]) => {
  const id = Number(key);
  ART_DIRECTION_CATALOG[id] = {
    id,
    rubro: value.rubro,
    prompt: value.artDirection,
    negativePrompt: value.negativePrompt,
    aspectRatio: '9:16',
    style: `phase2-${id}`
  };
});

// Agregar rubros 41-60 (convertir de ArtDirectionPrompt a ArtDirectionConfig)
Object.entries(ART_DIRECTION_PHASE3).forEach(([key, value]) => {
  const id = Number(key);
  ART_DIRECTION_CATALOG[id] = {
    id,
    rubro: value.rubro,
    prompt: value.artDirection,
    negativePrompt: value.negativePrompt,
    aspectRatio: '9:16',
    style: `phase3-${id}`
  };
});

/** Total de rubros disponibles */
export const TOTAL_RUBROS = 60;

/** Lista de todos los rubros por ID */
export const RUBROS_LIST = Object.entries(ART_DIRECTION_CATALOG).map(([id, data]) => ({
  id: Number(id),
  rubro: data.rubro,
  phase: Number(id) <= 20 ? 1 : Number(id) <= 40 ? 2 : 3
}));

// ============================================
// FUNCIONES DE BÚSQUEDA
// ============================================

/**
 * Obtiene el prompt de dirección de arte por ID de rubro
 * @param id - ID del rubro (1-60)
 * @returns ArtDirectionConfig o null si no existe
 */
export function getArtDirectionById(id: number): ArtDirectionConfig | null {
  if (id >= 1 && id <= 60) {
    return ART_DIRECTION_CATALOG[id] || null;
  }
  return null;
}

/**
 * Obtiene el prompt de dirección de arte por nombre del rubro
 * @param name - Nombre del rubro a buscar
 * @returns ArtDirectionConfig o null si no existe
 */
export function getArtDirectionByName(name: string): ArtDirectionConfig | null {
  const normalizedName = name.toLowerCase().trim();
  
  for (const id in ART_DIRECTION_CATALOG) {
    const config = ART_DIRECTION_CATALOG[Number(id)];
    if (config.rubro.toLowerCase().includes(normalizedName)) {
      return config;
    }
  }
  
  return null;
}

/**
 * Busca rubros por término de búsqueda
 * @param query - Término de búsqueda
 * @returns Array de rubros que coinciden con la búsqueda
 */
export function searchRubros(query: string): Array<{ id: number; rubro: string; phase: number }> {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) return RUBROS_LIST;
  
  return RUBROS_LIST.filter(item => 
    item.rubro.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Obtiene los rubros de una fase específica
 * @param phase - Fase (1, 2 o 3)
 * @returns Array de rubros de la fase especificada
 */
export function getRubrosByPhase(phase: 1 | 2 | 3): Array<{ id: number; rubro: string }> {
  const phaseStart = (phase - 1) * 20 + 1;
  const phaseEnd = phase * 20;
  
  return RUBROS_LIST
    .filter(item => item.id >= phaseStart && item.id <= phaseEnd)
    .map(item => ({ id: item.id, rubro: item.rubro }));
}

// ============================================
// CONSTRUCTORES DE PROMPTS
// ============================================

/**
 * Construye un prompt completo de dirección de arte
 * Estructura: [DIRECCIÓN_DE_ARTE] + [SUJETO] + [COMPOSICIÓN_SOCIAL_MEDIA] + [NEGATIVE_PROMPT]
 * 
 * @param subject - Descripción del producto/servicio
 * @param rubroId - ID del rubro (1-60)
 * @returns Prompt completo para generación de imagen
 */
export function buildArtDirectionPrompt(
  subject: string,
  rubroId: number
): string {
  const config = getArtDirectionById(rubroId);
  
  if (!config) {
    return `${subject}, professional commercial photography, high quality, clean design`;
  }
  
  return `${config.prompt} ${subject}. ${config.negativePrompt}`;
}

/**
 * Construye un prompt simple de dirección de arte (solo dirección de arte + sujeto)
 * 
 * @param subject - Descripción del producto/servicio
 * @param rubroId - ID del rubro (1-60)
 * @returns Prompt simplificado
 */
export function buildArtDirectionPromptSimple(
  subject: string,
  rubroId: number
): string {
  const config = getArtDirectionById(rubroId);
  
  if (!config) {
    return `${subject}, professional commercial photography`;
  }
  
  return `${config.prompt} ${subject}`;
}

/**
 * 🚀 MASTER PROMPT DE REESTRUCTURACIÓN - STORY ART REAL
 *
 * Este prompt implementa las 3 reglas fundamentales de Story Art de Agencia:
 * 1. Regla de Composición Vertical (Full-height 9:16 edge-to-edge)
 * 2. Jerarquía del Sujeto (60-70% del eje vertical)
 * 3. Zonas Seguras de Diseño (Safe Zones para texto)
 *
 * @param subject - Descripción del producto/servicio
 * @param rubroId - ID del rubro (1-60)
 * @returns Prompt completo con guardrails de agencia y Story Art Real
 */
export function buildAgencyPrompt(
  subject: string,
  rubroId: number
): string {
  const config = getArtDirectionById(rubroId);
  
  // ============================================
  // 🎯 REGLAS DE STORY ART REAL - AGENCIA LEVEL
  // ============================================
  
  // 1. REGLA DE COMPOSICIÓN VERTICAL (Obligatoria)
  const VERTICAL_COMPOSITION_PROMPT = "Full-height 9:16 vertical composition, edge-to-edge framing, cinematic mobile-optimized layout";
  
  // 2. JERARQUÍA DEL SUJETO (60-70% del eje vertical)
  const SUBJECT_SIZE_PROMPT = "SUBJECT SIZE: The main subject must occupy 60% to 70% of the vertical axis. Use medium shots or close-ups. AVOID wide shots where the subject looks small. The subject should be LARGE and PROMINENT, filling the frame for maximum visual impact";
  
  // 3. ZONAS SEGURAS DE DISEÑO (Safe Zones)
  const SAFE_ZONE_PROMPT = "SAFE ZONES: Leave the top 20% and bottom 20% of the image with clean, non-busy backgrounds (negative space) to allow for text overlay. Do not place faces or important details in these margins. Keep critical elements in the center vertical band";
  
  // Negative prompt de agencia hardcoded
  const AGENCY_NEGATIVE_PROMPT = "(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, distorted products, messy fingers, clip art style, watermark visible, low resolution, poor composition, uneven lighting, color banding, pixelated, dithered, oversaturated, undersaturated, harsh shadows, blown highlights)";
  
  // ============================================
  // 📊 LOG DE AUDITORÍA PARA VALIDACIÓN
  // ============================================
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🎨 [STORY ART PRO] Construyendo prompt de agencia');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📋 Rubro ID: ${rubroId}`);
  console.log(`🏷️ Rubro: ${config?.rubro || 'No encontrado'}`);
  console.log(`📝 Subject original: ${subject.substring(0, 100)}...`);
  console.log('───────────────────────────────────────────────────────────────');
  console.log('✅ Verificando reglas de Story Art Real:');
  console.log(`   ✓ VERTICAL_COMPOSITION: ${VERTICAL_COMPOSITION_PROMPT.substring(0, 50)}...`);
  console.log(`   ✓ SUBJECT_SIZE: ${SUBJECT_SIZE_PROMPT.substring(0, 50)}...`);
  console.log(`   ✓ SAFE_ZONE: ${SAFE_ZONE_PROMPT.substring(0, 50)}...`);
  console.log('═══════════════════════════════════════════════════════════════');
  
  if (!config) {
    const fallbackPrompt = `${VERTICAL_COMPOSITION_PROMPT}. ${SUBJECT_SIZE_PROMPT}. ${SAFE_ZONE_PROMPT}. ${subject}, professional commercial photography, high quality, clean design. ${AGENCY_NEGATIVE_PROMPT}`;
    console.warn('⚠️ [STORY ART PRO] No se encontró config, usando fallback');
    return fallbackPrompt;
  }
  
  // Construir prompt completo: [DIRECCIÓN DE ARTE] + [SUJETO] + [REGLAS STORY ART] + [NEGATIVE]
  const fullPrompt = `${config.prompt} ${subject}. ${VERTICAL_COMPOSITION_PROMPT}. ${SUBJECT_SIZE_PROMPT}. ${SAFE_ZONE_PROMPT}. ${config.negativePrompt} ${AGENCY_NEGATIVE_PROMPT}`;
  
  // Log del prompt final para auditoría
  console.log('🎯 [STORY ART PRO] Prompt final construido:', {
    length: fullPrompt.length,
    preview: fullPrompt.substring(0, 200) + '...',
    hasSubjectSize: fullPrompt.includes('60% to 70%'),
    hasSafeZone: fullPrompt.includes('SAFE ZONES'),
    hasVerticalComposition: fullPrompt.includes('Full-height 9:16')
  });
  console.log('═══════════════════════════════════════════════════════════════');
  
  return fullPrompt;
}

// ============================================
// EXPORT PARA CONSUMO EXTERNO
// ============================================

export const ART_DIRECTION_SYSTEM = {
  /** Catálogo completo */
  catalog: ART_DIRECTION_CATALOG,
  /** Total de rubros */
  totalRubros: TOTAL_RUBROS,
  /** Lista de rubros */
  rubrosList: RUBROS_LIST,
  /** Versión del sistema */
  version: "2.0.0",
  /** Fecha de última actualización */
  updated: new Date().toISOString(),
  
  // Funciones
  getById: getArtDirectionById,
  getByName: getArtDirectionByName,
  search: searchRubros,
  getByPhase: getRubrosByPhase,
  buildPrompt: buildArtDirectionPrompt,
  buildSimplePrompt: buildArtDirectionPromptSimple,
  buildAgencyPrompt: buildAgencyPrompt
};

// ============================================
// CATEGORÍAS AGRUPADAS
// ============================================

export const ART_DIRECTION_CATEGORIES = {
  retail: {
    label: "Retail y Comercio",
    rubros: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  },
  food: {
    label: "Alimentación y Restaurantes",
    rubros: [22, 40, 46, 47, 48, 49, 50, 51, 52]
  },
  health: {
    label: "Salud y Bienestar",
    rubros: [24, 28, 41, 42, 43, 56]
  },
  services: {
    label: "Servicios Profesionales",
    rubros: [25, 31, 32, 33, 39]
  },
  lifestyle: {
    label: "Lifestyle y Entretención",
    rubros: [21, 29, 30, 34, 35, 36, 37, 38]
  },
  specialty: {
    label: "Tiendas Especializadas",
    rubros: [53, 54, 55, 57, 58, 59, 60]
  }
};

// ============================================
// MAPEO DE ESTILOS A DIRECCIÓN DE ARTE (Story Art)
// ============================================
// Este mapeo conecta los estilos de FLYER_STYLES con los IDs de Dirección de Arte
// para que Story Art use la configuración correcta según el estilo seleccionado
//
// CRÍTICO: Los mapeos deben mantener coherencia visual para evitar "estética cruzada"
// donde elementos de un rubro aparezcan inapropiadamente en otro.

export const STYLE_TO_ART_DIRECTION_MAP: Record<string, number> = {
  // Estilos huérfanos mapeados a rubros con coherencia visual
  'summer_beach': 39,      // Verano/Turismo → Inmobiliaria/Turismo (luz solar, espacios abiertos aspiracionales)
  'art_double_exp': 45,    // Artístico/Teatro → Tattoo Studio (alta creatividad, composición visual artística)
  'retro_vintage': 52,     // Retro/Vintage → Ferretería (ambiente rústico/industrial, texturas vintage)
  'seasonal_holiday': 30,  // Festivo → Panadería (celebraciones y festividades, ambiente cálido)
  
  // Mapeos adicionales para completar la cobertura (coherencia visual verificada)
  'indie_grunge': 33,      // Rock/Música → Barbería (texturas urbanas, madera, metal, contrastes fuertes)
  'retail_sale': 1,        // Retail/Ofertas → Retail General
  'gastronomy': 46,        // Gastronomía → Sushi Nikkei
  'urban_night': 21,       // Noche/Discoteca → Entretención
  'corporate': 25,         // Corporativo → Servicios Profesionales
  'worship_sky': 23,       // Espiritual → Salud y Bienestar
  'kids_fun': 47,          // Infantil → Heladería (ambiente festivo y colorido)
  'tech_saas': 57,         // Tecnología → Servicio Técnico
  'medical_clean': 42,     // Médico → Centro Dental
  'sport_gritty': 37,      // Deporte → Kinesiología
  'luxury_gold': 20,       // Lujo → Retail Premium
  'aesthetic_min': 35,     // Belleza → Yoga Studio
  'wellness_zen': 24,      // Wellness → Salud y Bienestar
  'eco_organic': 39,       // Ecológico → Jardinería
  'realestate_night': 16,  // Inmobiliaria → Retail Inmobiliario
  'auto_metallic': 26,     // Automotriz → Taller Mecánico
  'edu_sketch': 43,        // Educación → Óptica
  'podcast_mic': 44,       // Podcast → Librería
  'gamer_stream': 45,      // Gaming → Tattoo Studio (estilo urbano/alternativo)
  'political_community': 17, // Política → Retail Comunitario
  'market_handwritten': 51, // Feria Libre → Florería
  'pilates': 36,           // Pilates → Kinesiología
  'typo_bold': 2,          // Tipografía → Retail Especializado
};

/**
 * Obtiene el ID de Dirección de Arte correspondiente a un estilo
 * @param styleKey - Clave del estilo de FLYER_STYLES
 * @returns ID del rubro de Dirección de Arte (1-60) o null si no existe mapeo
 */
export function getArtDirectionIdFromStyle(styleKey: string): number | null {
  return STYLE_TO_ART_DIRECTION_MAP[styleKey] || null;
}

/**
 * Verifica si un estilo tiene mapeo de Dirección de Arte
 * @param styleKey - Clave del estilo
 * @returns true si tiene mapeo, false otherwise
 */
export function hasArtDirectionMapping(styleKey: string): boolean {
  return styleKey in STYLE_TO_ART_DIRECTION_MAP;
}
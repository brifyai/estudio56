import { RealityLevel } from '../types';

/**
 * 🎨 SISTEMA DE ELEMENTOS PROGRESIVOS POR INDUSTRIA
 * 
 * Este sistema define qué elementos decorativos/atmosféricos se agregan o quitan
 * según el nivel de realidad (1.0-5.0) para cada uno de los 60 rubros.
 * 
 * REGLA FUNDAMENTAL:
 * - Niveles bajos (1.0-2.5): SIN elementos de lujo, ambiente funcional
 * - Niveles altos (4.0-5.0): CON elementos de lujo, ambiente aspiracional
 * - La composición base (persona, pose, ángulo) se mantiene constante
 */

// ============================================
// TIPOS DE ELEMENTOS POR CATEGORÍA
// ============================================

interface IndustryElements {
  // Elementos que NUNCA deben aparecer en niveles bajos
  luxuryForbidden: string[];
  // Elementos que SOLO aparecen en niveles altos
  luxuryAllowed: string[];
  // Elementos básicos siempre presentes
  basicElements: string[];
}

// ============================================
// CONFIGURACIÓN POR RUBRO (1-60)
// ============================================

export const INDUSTRY_PROGRESSIVE_ELEMENTS: Record<number, IndustryElements> = {
  // ============================================
  // FASE 1: RUBROS 1-20 (Retail y Comercio)
  // ============================================
  
  1: { // Retail General
    basicElements: ['product displays', 'shelving', 'price tags', 'shopping baskets'],
    luxuryForbidden: ['candles', 'fog', 'marble floors', 'crystal chandeliers', 'gold fixtures'],
    luxuryAllowed: ['ambient lighting', 'decorative plants', 'artwork', 'premium displays']
  },
  
  2: { // Moda
    basicElements: ['clothing racks', 'mannequins', 'mirrors', 'fitting rooms'],
    luxuryForbidden: ['candles', 'fog', 'marble', 'excessive gold', 'crystal'],
    luxuryAllowed: ['soft ambient lighting', 'fashion photography', 'designer displays', 'elegant mirrors']
  },
  
  3: { // Joyas
    basicElements: ['display cases', 'jewelry stands', 'clean lighting'],
    luxuryForbidden: ['fog', 'floating objects', 'excessive smoke'],
    luxuryAllowed: ['soft spotlights', 'velvet displays', 'crystal cases', 'gold accents', 'subtle candles']
  },
  
  4: { // Gaming
    basicElements: ['gaming setups', 'RGB lighting', 'monitors', 'gaming chairs'],
    luxuryForbidden: ['candles', 'classical decor', 'marble', 'gold'],
    luxuryAllowed: ['neon lights', 'LED strips', 'fog machines', 'dramatic lighting', 'gaming posters']
  },
  
  5: { // Gastronomía
    basicElements: ['plates', 'cutlery', 'tables', 'kitchen equipment'],
    luxuryForbidden: ['excessive candles', 'fog', 'marble tables', 'gold cutlery'],
    luxuryAllowed: ['ambient candles', 'wine glasses', 'elegant plating', 'soft lighting', 'fresh flowers']
  },
  
  // ============================================
  // WELLNESS & FITNESS (Rubros 21-30)
  // ============================================
  
  21: { // Fitness / Gimnasio
    basicElements: ['gym equipment', 'weights', 'mats', 'water bottles'],
    luxuryForbidden: ['candles', 'fog', 'marble', 'crystal', 'silk fabrics'],
    luxuryAllowed: ['ambient lighting', 'motivational posters', 'plants', 'premium equipment']
  },
  
  24: { // Wellness / Spa
    basicElements: ['treatment beds', 'towels', 'basic lighting'],
    luxuryForbidden: ['excessive candles', 'fog machines', 'floating objects'],
    luxuryAllowed: ['aromatherapy candles', 'essential oil diffusers', 'soft ambient lighting', 'tropical plants', 'water features']
  },
  
  28: { // Pilates / Yoga
    basicElements: ['reformer machines', 'mats', 'blocks', 'straps'],
    luxuryForbidden: ['candles', 'fog', 'smoke', 'marble', 'gold'],
    luxuryAllowed: ['soft ambient lighting', 'plants', 'natural wood', 'minimal decor']
  },
  
  // ============================================
  // SERVICIOS PROFESIONALES (Rubros 31-40)
  // ============================================
  
  32: { // Corporativo / Oficinas
    basicElements: ['desks', 'computers', 'office chairs', 'filing cabinets'],
    luxuryForbidden: ['candles', 'fog', 'excessive gold', 'crystal chandeliers'],
    luxuryAllowed: ['modern art', 'plants', 'ambient lighting', 'premium furniture']
  },
  
  39: { // Inmobiliaria
    basicElements: ['property views', 'keys', 'documents', 'floor plans'],
    luxuryForbidden: ['fog', 'floating objects', 'excessive candles'],
    luxuryAllowed: ['ambient lighting', 'modern furniture', 'plants', 'artwork', 'luxury finishes']
  },
  
  // ============================================
  // SALUD & BELLEZA (Rubros 41-50)
  // ============================================
  
  41: { // Salón de Belleza
    basicElements: ['salon chairs', 'mirrors', 'hair products', 'styling tools'],
    luxuryForbidden: ['fog', 'excessive candles', 'marble floors'],
    luxuryAllowed: ['soft ambient lighting', 'decorative mirrors', 'plants', 'elegant decor', 'subtle candles']
  },
  
  42: { // Barbería
    basicElements: ['barber chairs', 'mirrors', 'grooming tools', 'towels'],
    luxuryForbidden: ['candles', 'fog', 'marble', 'gold fixtures'],
    luxuryAllowed: ['vintage lighting', 'leather chairs', 'wood paneling', 'classic decor']
  },
  
  43: { // Gimnasio / Crossfit
    basicElements: ['crossfit equipment', 'barbells', 'boxes', 'ropes'],
    luxuryForbidden: ['candles', 'fog', 'marble', 'silk', 'crystal'],
    luxuryAllowed: ['industrial lighting', 'motivational art', 'rubber flooring', 'premium equipment']
  },
  
  44: { // Piscina / Acuático
    basicElements: ['pool water', 'tiles', 'ladders', 'pool equipment'],
    luxuryForbidden: ['fog machines', 'floating candles', 'excessive gold'],
    luxuryAllowed: ['underwater lighting', 'tropical plants', 'lounge chairs', 'water features', 'ambient lighting']
  },
  
  45: { // Hotel / Hospedaje
    basicElements: ['beds', 'furniture', 'lamps', 'curtains'],
    luxuryForbidden: ['fog', 'floating objects', 'excessive candles'],
    luxuryAllowed: ['ambient lighting', 'artwork', 'plants', 'luxury bedding', 'decorative candles', 'marble accents']
  },
  
  46: { // Restaurante Vegetariano
    basicElements: ['fresh vegetables', 'plates', 'wooden tables', 'natural light'],
    luxuryForbidden: ['excessive candles', 'fog', 'marble', 'gold'],
    luxuryAllowed: ['plants', 'natural wood', 'ambient lighting', 'fresh flowers', 'rustic decor']
  },
  
  47: { // Cafetería / Coffee Shop
    basicElements: ['coffee machines', 'cups', 'tables', 'chairs'],
    luxuryForbidden: ['fog', 'marble floors', 'crystal', 'excessive gold'],
    luxuryAllowed: ['ambient lighting', 'plants', 'artwork', 'cozy decor', 'candles on tables']
  },
  
  48: { // Heladería Artesanal
    basicElements: ['ice cream displays', 'cones', 'scoops', 'freezers'],
    luxuryForbidden: ['fog', 'candles', 'marble', 'gold'],
    luxuryAllowed: ['colorful lighting', 'playful decor', 'neon signs', 'fun artwork']
  },
  
  49: { // Panadería Artesanal
    basicElements: ['bread displays', 'ovens', 'flour', 'baking tools'],
    luxuryForbidden: ['fog', 'excessive candles', 'marble', 'crystal'],
    luxuryAllowed: ['warm lighting', 'rustic wood', 'vintage decor', 'fresh flowers']
  },
  
  50: { // Pastelería / Tortas
    basicElements: ['cake displays', 'pastries', 'display cases', 'decorating tools'],
    luxuryForbidden: ['fog', 'floating objects', 'excessive gold'],
    luxuryAllowed: ['soft lighting', 'elegant displays', 'fresh flowers', 'decorative elements', 'subtle candles']
  },
  
  // ============================================
  // TIENDAS ESPECIALIZADAS (Rubros 51-60)
  // ============================================
  
  51: { // Carnicería
    basicElements: ['meat displays', 'cutting boards', 'knives', 'refrigeration'],
    luxuryForbidden: ['candles', 'fog', 'marble', 'gold', 'silk'],
    luxuryAllowed: ['clean lighting', 'stainless steel', 'professional equipment']
  },
  
  52: { // Verdulería
    basicElements: ['produce displays', 'crates', 'scales', 'fresh vegetables'],
    luxuryForbidden: ['candles', 'fog', 'marble', 'crystal'],
    luxuryAllowed: ['natural lighting', 'wooden crates', 'fresh flowers', 'rustic decor']
  },
  
  53: { // Tienda de Ropa
    basicElements: ['clothing racks', 'mannequins', 'mirrors', 'hangers'],
    luxuryForbidden: ['fog', 'excessive candles', 'marble floors'],
    luxuryAllowed: ['ambient lighting', 'fashion photography', 'plants', 'elegant displays']
  },
  
  54: { // Zapatería
    basicElements: ['shoe displays', 'boxes', 'mirrors', 'seating'],
    luxuryForbidden: ['fog', 'candles', 'marble', 'excessive gold'],
    luxuryAllowed: ['spotlights', 'elegant displays', 'leather accents', 'modern decor']
  },
  
  55: { // Joyería
    basicElements: ['jewelry displays', 'cases', 'lighting', 'security'],
    luxuryForbidden: ['fog', 'floating objects', 'excessive smoke'],
    luxuryAllowed: ['spotlights', 'velvet displays', 'crystal cases', 'gold accents', 'elegant candles']
  },
  
  56: { // Óptica
    basicElements: ['eyewear displays', 'testing equipment', 'mirrors', 'cases'],
    luxuryForbidden: ['candles', 'fog', 'marble', 'gold'],
    luxuryAllowed: ['clean lighting', 'modern displays', 'minimal decor', 'professional equipment']
  },
  
  57: { // Perfumería
    basicElements: ['perfume bottles', 'testers', 'displays', 'mirrors'],
    luxuryForbidden: ['fog machines', 'floating objects', 'excessive smoke'],
    luxuryAllowed: ['ambient lighting', 'elegant displays', 'gold accents', 'crystal', 'subtle fog effects']
  },
  
  58: { // Regalería
    basicElements: ['gift displays', 'wrapping paper', 'ribbons', 'cards'],
    luxuryForbidden: ['fog', 'excessive candles', 'marble'],
    luxuryAllowed: ['colorful lighting', 'decorative elements', 'festive decor', 'plants']
  },
  
  59: { // Florería
    basicElements: ['flower displays', 'vases', 'buckets', 'fresh flowers'],
    luxuryForbidden: ['fog machines', 'marble floors', 'excessive gold'],
    luxuryAllowed: ['natural lighting', 'elegant vases', 'decorative elements', 'candles', 'romantic decor']
  },
  
  60: { // Mueblería
    basicElements: ['furniture displays', 'room settings', 'fabric samples'],
    luxuryForbidden: ['fog', 'floating objects', 'excessive candles'],
    luxuryAllowed: ['ambient lighting', 'plants', 'artwork', 'luxury fabrics', 'elegant decor']
  }
};

// Agregar configuración por defecto para rubros no especificados (1-20 restantes)
for (let i = 6; i <= 20; i++) {
  if (!INDUSTRY_PROGRESSIVE_ELEMENTS[i]) {
    INDUSTRY_PROGRESSIVE_ELEMENTS[i] = {
      basicElements: ['standard equipment', 'functional furniture', 'basic lighting'],
      luxuryForbidden: ['candles', 'fog', 'smoke', 'marble', 'gold', 'crystal'],
      luxuryAllowed: ['ambient lighting', 'plants', 'artwork', 'modern decor']
    };
  }
}

// Agregar configuración por defecto para rubros 22-40 no especificados
for (let i = 22; i <= 40; i++) {
  if (!INDUSTRY_PROGRESSIVE_ELEMENTS[i]) {
    INDUSTRY_PROGRESSIVE_ELEMENTS[i] = {
      basicElements: ['professional equipment', 'functional space', 'standard lighting'],
      luxuryForbidden: ['candles', 'fog', 'smoke', 'marble', 'excessive gold'],
      luxuryAllowed: ['ambient lighting', 'plants', 'professional decor']
    };
  }
}

// ============================================
// FUNCIÓN PRINCIPAL: OBTENER ELEMENTOS POR NIVEL
// ============================================

/**
 * Genera el prompt de elementos permitidos/prohibidos según el nivel de realidad y el rubro
 * @param stars - Nivel de realidad (1.0-5.0)
 * @param industryId - ID del rubro (1-60)
 * @returns Prompt con elementos permitidos y prohibidos
 */
export const getProgressiveElementsForIndustry = (
  stars: RealityLevel,
  industryId?: number
): string => {
  // Si no hay industryId, usar configuración genérica
  if (!industryId || industryId < 1 || industryId > 60) {
    return getGenericProgressiveElements(stars);
  }
  
  const config = INDUSTRY_PROGRESSIVE_ELEMENTS[industryId];
  
  // Niveles bajos (1.0-2.5): Solo elementos básicos, prohibir lujo
  if (stars <= 2.5) {
    return `
ALLOWED ELEMENTS: ${config.basicElements.join(', ')}
STRICTLY FORBIDDEN: ${config.luxuryForbidden.join(', ')}
ATMOSPHERE: Functional, authentic, everyday business environment
    `.trim();
  }
  
  // Niveles medios (3.0-3.5): Elementos básicos + algunos decorativos
  if (stars <= 3.5) {
    const limitedLuxury = config.luxuryAllowed.slice(0, 2); // Solo primeros 2 elementos
    return `
ALLOWED ELEMENTS: ${config.basicElements.join(', ')}, ${limitedLuxury.join(', ')}
FORBIDDEN: ${config.luxuryForbidden.slice(0, 3).join(', ')}
ATMOSPHERE: Clean, professional, organized business environment
    `.trim();
  }
  
  // Niveles altos (4.0-4.5): Elementos básicos + decorativos + algunos de lujo
  if (stars <= 4.5) {
    return `
ALLOWED ELEMENTS: ${config.basicElements.join(', ')}, ${config.luxuryAllowed.join(', ')}
FORBIDDEN: floating objects, impossible physics
ATMOSPHERE: Polished, aspirational, premium business environment
    `.trim();
  }
  
  // Nivel máximo (5.0): Todos los elementos permitidos
  return `
ALLOWED ELEMENTS: ${config.basicElements.join(', ')}, ${config.luxuryAllowed.join(', ')}
FORBIDDEN: floating objects, impossible physics, distorted anatomy
ATMOSPHERE: Luxury, aspirational, high-end business environment with cinematic quality
  `.trim();
};

/**
 * Configuración genérica cuando no se especifica industria
 */
const getGenericProgressiveElements = (stars: RealityLevel): string => {
  if (stars <= 2.5) {
    return `
ALLOWED ELEMENTS: basic equipment, functional furniture, standard lighting
STRICTLY FORBIDDEN: candles, fog, smoke, steam, marble, gold, crystal, luxury materials
ATMOSPHERE: Functional, authentic, everyday environment
    `.trim();
  }
  
  if (stars <= 3.5) {
    return `
ALLOWED ELEMENTS: professional equipment, quality furniture, plants, balanced lighting
FORBIDDEN: candles, fog, smoke, marble, excessive gold
ATMOSPHERE: Clean, professional, organized environment
    `.trim();
  }
  
  if (stars <= 4.5) {
    return `
ALLOWED ELEMENTS: premium equipment, designer furniture, plants, ambient lighting, artwork
FORBIDDEN: floating objects, impossible physics
ATMOSPHERE: Polished, aspirational, premium environment
    `.trim();
  }
  
  return `
ALLOWED ELEMENTS: luxury equipment, bespoke furniture, plants, dramatic lighting, artwork, candles, atmospheric effects
FORBIDDEN: floating objects, impossible physics, distorted anatomy
ATMOSPHERE: Luxury, aspirational, high-end environment with cinematic quality
  `.trim();
};

/**
 * Obtiene solo los elementos prohibidos para un nivel e industria
 * Útil para negative prompts
 */
export const getForbiddenElementsForIndustry = (
  stars: RealityLevel,
  industryId?: number
): string[] => {
  if (!industryId || industryId < 1 || industryId > 60) {
    if (stars <= 2.5) {
      return ['candles', 'fog', 'smoke', 'steam', 'marble', 'gold', 'crystal'];
    }
    return ['floating objects', 'impossible physics'];
  }
  
  const config = INDUSTRY_PROGRESSIVE_ELEMENTS[industryId];
  
  if (stars <= 2.5) {
    return config.luxuryForbidden;
  }
  
  if (stars <= 3.5) {
    return config.luxuryForbidden.slice(0, 3);
  }
  
  return ['floating objects', 'impossible physics', 'distorted anatomy'];
};

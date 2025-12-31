/**
 * SERVICIO MODO MAGIA - DETECCIÓN AUTOMÁTICA Y GENERACIÓN INTELIGENTE
 * Solución lean para automatización completa del flujo de diseño
 */

import { FlyerStyleKey } from '../types';

/**
 * MAPEO DE ESTILOS A NOMBRES EN ESPAÑOL
 */
export const STYLE_NAMES_ES: Record<FlyerStyleKey, string> = {
  brand_identity: 'Identidad de Marca',
  retail_sale: 'Ofertas / Liquidación',
  auto_metallic: 'Automotriz / Taller',
  gastronomy: 'Gastronomía / Comida',
  corporate: 'Corporativo / Inmobiliaria',
  medical_clean: 'Médico / Salud',
  tech_saas: 'Tecnología / Digital',
  edu_sketch: 'Educación / Clases',
  political_community: 'Política / Comunidad',
  aesthetic_min: 'Aesthetic / Belleza',
  wellness_zen: 'Spa / Yoga / Wellness',
  summer_beach: 'Verano / Playa',
  eco_organic: 'Ecológico / Natural',
  sport_gritty: 'Deporte / Gym',
  urban_night: 'Discoteca / Neón',
  luxury_gold: 'Lujo / VIP',
  realestate_night: 'Inmobiliaria Premium',
  gamer_stream: 'Gamer / Streaming',
  indie_grunge: 'Rock / Música',
  kids_fun: 'Infantil / Cumpleaños',
  worship_sky: 'Espiritual / Iglesia',
  seasonal_holiday: 'Navidad / Festivo',
  art_double_exp: 'Artístico / Teatro',
  retro_vintage: 'Retro / Vintage',
  podcast_mic: 'Podcast / Audio',
  typo_bold: 'Tipografía Pura'
};

/**
 * DETECCIÓN AUTOMÁTICA DE INDUSTRIA DESDE URL
 */
export interface IndustryDetection {
  industry: string;
  styleKey: FlyerStyleKey;
  confidence: number;
  keywords: string[];
}

/**
 * MAPEO DE INDUSTRIAS A ESTILOS CSS
 */
const INDUSTRY_STYLE_MAPPING: Record<string, FlyerStyleKey> = {
  // VENTAS & RETAIL
  'tienda': 'retail_sale',
  'shop': 'retail_sale',
  'store': 'retail_sale',
  'oferta': 'retail_sale',
  'sale': 'retail_sale',
  'descuento': 'retail_sale',
  'promocion': 'retail_sale',
  
  // AUTOMOTRIZ
  'auto': 'auto_metallic',
  'car': 'auto_metallic',
  'vehiculo': 'auto_metallic',
  'concesionario': 'auto_metallic',
  'mecanico': 'auto_metallic',
  'taller': 'auto_metallic',
  
  // GASTRONOMÍA
  'restaurant': 'gastronomy',
  'restaurante': 'gastronomy',
  'comida': 'gastronomy',
  'food': 'gastronomy',
  'cafe': 'gastronomy',
  'pizza': 'gastronomy',
  'hamburguesa': 'gastronomy',
  'bebida': 'gastronomy',
  
  // CORPORATIVO
  'empresa': 'corporate',
  'company': 'corporate',
  'business': 'corporate',
  'servicios': 'corporate',
  'consultoria': 'corporate',
  'abogado': 'corporate',
  'contador': 'corporate',
  
  // MÉDICO
  'medico': 'medical_clean',
  'doctor': 'medical_clean',
  'clinica': 'medical_clean',
  'hospital': 'medical_clean',
  'dentista': 'medical_clean',
  'farmacia': 'medical_clean',
  'salud': 'medical_clean',
  
  // TECNOLOGÍA
  'tech': 'tech_saas',
  'software': 'tech_saas',
  'app': 'tech_saas',
  'digital': 'tech_saas',
  'web': 'tech_saas',
  'programacion': 'tech_saas',
  'desarrollo': 'tech_saas',
  
  // EDUCACIÓN
  'educacion': 'edu_sketch',
  'education': 'edu_sketch',
  'escuela': 'edu_sketch',
  'colegio': 'edu_sketch',
  'universidad': 'edu_sketch',
  'curso': 'edu_sketch',
  'academia': 'edu_sketch',
  
  // POLÍTICA
  'politica': 'political_community',
  'politico': 'political_community',
  'gobierno': 'political_community',
  'eleccion': 'political_community',
  'voto': 'political_community',
  
  // LIFESTYLE
  'fitness': 'sport_gritty',
  'gym': 'sport_gritty',
  'gimnasio': 'sport_gritty',
  'deporte': 'sport_gritty',
  'yoga': 'wellness_zen',
  'pilates': 'wellness_zen',
  'spa': 'wellness_zen',
  'belleza': 'aesthetic_min',
  'estetica': 'aesthetic_min',
  
  // NOCHE & ENTRETENIMIENTO
  'discoteca': 'urban_night',
  'club': 'urban_night',
  'fiesta': 'urban_night',
  'evento': 'seasonal_holiday',
  'noche': 'urban_night',
  
  // LUJO
  'lujo': 'luxury_gold',
  'luxury': 'luxury_gold',
  'joyeria': 'luxury_gold',
  'relojes': 'luxury_gold',
  'inmobiliaria': 'realestate_night',
  
  // GAMING
  'gaming': 'gamer_stream',
  'game': 'gamer_stream',
  'stream': 'gamer_stream',
  'esports': 'gamer_stream',
  
  // MÚSICA
  'musica': 'podcast_mic',
  'music': 'podcast_mic',
  'podcast': 'podcast_mic',
  'radio': 'podcast_mic',
  
  // INFANTIL
  'niños': 'kids_fun',
  'kids': 'kids_fun',
  'infantil': 'kids_fun',
  'juguetes': 'kids_fun',
  
  // RELIGIOSO
  'iglesia': 'worship_sky',
  'religion': 'worship_sky',
  'espiritual': 'worship_sky',
  'fe': 'worship_sky',
  
  // ARTÍSTICO
  'arte': 'art_double_exp',
  'artist': 'art_double_exp',
  'galeria': 'art_double_exp',
  'diseno': 'art_double_exp',
  
  // RETRO/VINTAGE
  'retro': 'retro_vintage',
  'vintage': 'retro_vintage',
  'antiguo': 'retro_vintage',
  
  // ECOLÓGICO
  'eco': 'eco_organic',
  'organic': 'eco_organic',
  'natural': 'eco_organic',
  'verde': 'eco_organic',
  
  // VERANO
  'verano': 'summer_beach',
  'summer': 'summer_beach',
  'playa': 'summer_beach',
  'vacaciones': 'summer_beach'
};

/**
 * GENERACIÓN DE TEXTO PERSUASIVO POR INDUSTRIA
 */
const INDUSTRY_TEXT_TEMPLATES: Record<string, string[]> = {
  retail_sale: [
    '¡OFERTA EXPLOSIVA!',
    'DESCUENTO IMPERDIBLE',
    'LIQUIDACIÓN TOTAL',
    'PROMOCIÓN ESPECIAL',
    'ÚLTIMOS DÍAS'
  ],
  
  auto_metallic: [
    'TU PRÓXIMO AUTO TE ESPERA',
    'CALIDAD AUTOMOTRIZ',
    'CONCESIONARIO OFICIAL',
    'SERVICIO PREMIUM',
    'CONFIANZA TOTAL'
  ],
  
  gastronomy: [
    'SABORES ÚNICOS',
    'EXPERIENCIA GASTRONÓMICA',
    'COMIDA CASERA',
    'DELICIAS AL HORNO',
    'VEN Y DISFRUTA'
  ],
  
  corporate: [
    'SOLUCIONES PROFESIONALES',
    'EXCELENCIA GARANTIZADA',
    'SERVICIO DE CALIDAD',
    'CONFIANZA EMPRESARIAL',
    'RESULTADOS ASEGURADOS'
  ],
  
  medical_clean: [
    'TU SALUD ES PRIORIDAD',
    'ATENCIÓN MÉDICA',
    'CUIDADO PROFESIONAL',
    'SALUD INTEGRAL',
    'CONFIANZA MÉDICA'
  ],
  
  tech_saas: [
    'INNOVACIÓN DIGITAL',
    'TECNOLOGÍA AVANZADA',
    'SOLUCIONES TECH',
    'FUTURO DIGITAL',
    'SOFTWARE PROFESIONAL'
  ],
  
  edu_sketch: [
    'APRENDE HOY',
    'EDUCACIÓN DE CALIDAD',
    'CONOCIMIENTO FUTURO',
    'CLASES PERSONALIZADAS',
    'ÉXITO ACADÉMICO'
  ],
  
  sport_gritty: [
    'FUERZA Y DETERMINACIÓN',
    'ENTRENAMIENTO INTENSO',
    'SUPERA TUS LÍMITES',
    'DISCIPLINA TOTAL',
    'RESULTADOS GARANTIZADOS'
  ],
  
  urban_night: [
    'NOCHE ÉPICA',
    'DIVERSIÓN GARANTIZADA',
    'EXPERIENCIA ÚNICA',
    'LA MEJOR FIESTA',
    'RECUERDOS INOLVIDABLES'
  ],
  
  luxury_gold: [
    'LUJO EXCLUSIVO',
    'ELEGANCIA SUPREMA',
    'EXPERIENCIA PREMIUM',
    'CALIDAD SUPERIOR',
    'EXCLUSIVIDAD TOTAL'
  ],
  
  gamer_stream: [
    'GAME ON',
    'NIVEL ÉPICO',
    'SKILLS INCREÍBLES',
    'STREAMING LIVE',
    'VICTORIA GARANTIZADA'
  ],
  
  kids_fun: [
    'DIVERSIÓN TOTAL',
    'AVENTURA GARANTIZADA',
    'MOMENTOS MÁGICOS',
    'ALEGRÍA INFINITA',
    'JUEGO Y APRENDIZAJE'
  ],
  
  wellness_zen: [
    'PAZ INTERIOR',
    'BIENESTAR TOTAL',
    'ARMONÍA Y SALUD',
    'TRANQUILIDAD',
    'VIDA EQUILIBRADA'
  ],
  
  podcast_mic: [
    'VOZ DEL PUEBLO',
    'CONVERSACIONES REALES',
    'HISTORIAS ÚNICAS',
    'AUDIO PREMIUM',
    'CONTENIDO AUTÉNTICO'
  ]
};

/**
 * NUEVO: TEXTOS ESPECÍFICOS POR OBJETIVO DE MARKETING
 */
const BRANDING_TEXTS = [
  'CALIDAD PREMIUM',
  'EXCELENCIA GARANTIZADA',
  'CONFIANZA TOTAL',
  'MARCA LÍDER',
  'TRADICIÓN Y CALIDAD'
];

const LEADS_TEXTS = [
  '¡CONTÁCTANOS YA!',
  'SOLICITA TU COTIZACIÓN',
  'LLAMA AHORA',
  'RESERVA HOY',
  '¡NO TE LO PIERDAS!'
];

/**
 * DETECTA LA INDUSTRIA DESDE UNA URL O TEXTO
 */
export const detectIndustryFromInput = (input: string): IndustryDetection => {
  const inputLower = input.toLowerCase();
  const words = inputLower.split(/[\s\-_]+/);
  
  let bestMatch = {
    industry: 'brand_identity',
    styleKey: 'brand_identity' as FlyerStyleKey,
    confidence: 0.3,
    keywords: []
  };
  
  // Buscar coincidencias en palabras clave - MEJORADO para mayor confianza
  for (const [keyword, styleKey] of Object.entries(INDUSTRY_STYLE_MAPPING)) {
    if (inputLower.includes(keyword)) {
      // Aumentar confianza basada en la longitud de la palabra clave
      const baseConfidence = keyword.length >= 4 ? 0.7 : 0.5;
      const confidence = Math.min(0.95, baseConfidence + (keyword.length * 0.05));
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          industry: keyword,
          styleKey,
          confidence,
          keywords: [keyword]
        };
      }
    }
  }
  
  // Detección por contexto mejorada
  const contextPatterns: Record<string, { patterns: string[]; baseConfidence: number }> = {
    'retail_sale': { patterns: ['compra', 'venta', 'precio', 'costo', 'barato', 'tienda', 'shop', 'oferta', 'descuento'], baseConfidence: 0.6 },
    'gastronomy': { patterns: ['comer', 'beber', 'sabor', 'plato', 'menú', 'restaurante', 'comida', 'food', 'cafe'], baseConfidence: 0.6 },
    'corporate': { patterns: ['servicio', 'profesional', 'empresa', 'negocio', 'consultoria'], baseConfidence: 0.55 },
    'tech_saas': { patterns: ['digital', 'online', 'web', 'app', 'tech', 'software', 'programación'], baseConfidence: 0.6 },
    'medical_clean': { patterns: ['salud', 'doctor', 'medico', 'tratamiento', 'clínica', 'bienestar'], baseConfidence: 0.6 },
    'sport_gritty': { patterns: ['ejercicio', 'entrenamiento', 'gym', 'deporte', 'fitness', 'entrenar'], baseConfidence: 0.6 },
    'wellness_zen': { patterns: ['yoga', 'pilates', 'spa', 'relajación', 'masaje', 'meditación', 'paz', 'bienestar'], baseConfidence: 0.7 },
    'aesthetic_min': { patterns: ['belleza', 'estética', 'moda', 'look', 'estilo'], baseConfidence: 0.6 },
    'luxury_gold': { patterns: ['lujo', 'premium', 'exclusivo', 'vip', 'elegante'], baseConfidence: 0.65 },
    'urban_night': { patterns: ['fiesta', 'noche', 'club', 'discoteca', 'entretención'], baseConfidence: 0.6 },
    'worship_sky': { patterns: ['iglesia', 'templo', 'congregación', 'fe', 'religión', 'cristo', 'evangelio'], baseConfidence: 0.7 },
    'kids_fun': { patterns: ['niños', 'infantil', 'cumpleaños', 'juguetes', 'niño'], baseConfidence: 0.65 },
    'edu_sketch': { patterns: ['educación', 'estudiar', 'curso', 'clase', 'aprendizaje'], baseConfidence: 0.6 },
    'auto_metallic': { patterns: ['auto', 'carro', 'vehículo', 'taller', 'mecánico', 'automotriz'], baseConfidence: 0.65 },
    'gamer_stream': { patterns: ['game', 'gaming', 'stream', 'videojuego', 'esports'], baseConfidence: 0.65 },
    'realestate_night': { patterns: ['casa', 'departamento', 'inmueble', 'propiedad', 'venta'], baseConfidence: 0.55 },
    'eco_organic': { patterns: ['eco', 'natural', 'orgánico', 'verde', 'sustentable'], baseConfidence: 0.6 },
    'summer_beach': { patterns: ['verano', 'playa', 'vacaciones', 'sol', 'calor'], baseConfidence: 0.6 }
  };
  
  for (const [styleKey, { patterns, baseConfidence }] of Object.entries(contextPatterns)) {
    const matches = patterns.filter(pattern => inputLower.includes(pattern));
    if (matches.length > 0) {
      const confidence = Math.min(0.9, baseConfidence + (matches.length * 0.08));
      if (confidence > bestMatch.confidence) {
        bestMatch = {
          industry: styleKey,
          styleKey: styleKey as FlyerStyleKey,
          confidence,
          keywords: matches
        };
      }
    }
  }
  
  // Si aún no hay buena coincidencia, buscar patrones más amplios
  if (bestMatch.confidence < 0.5) {
    const broadPatterns: Record<string, string[]> = {
      'corporate': ['chile', 'santiago', 'oficina', 'empresarial'],
      'retail_sale': ['promoción', 'liquidación', 'oferta especial'],
      'gastronomy': ['restaurant', 'bar', 'pub', 'food'],
      'worship_sky': ['iglesia', 'templo', 'congregación', 'cristiano']
    };
    
    for (const [styleKey, patterns] of Object.entries(broadPatterns)) {
      const matches = patterns.filter(pattern => inputLower.includes(pattern));
      if (matches.length > 0) {
        const confidence = Math.min(0.6, 0.4 + (matches.length * 0.1));
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            industry: styleKey,
            styleKey: styleKey as FlyerStyleKey,
            confidence,
            keywords: matches
          };
        }
      }
    }
  }
  
  return bestMatch;
};

/**
 * NUEVO: GENERA MÚLTIPLES OPCIONES DE TEXTO PERSUASIVO
 */
export interface TextOptions {
  branding: string[];
  leads: string[];
}

export const generateTextOptions = (styleKey: FlyerStyleKey, customWords?: string[]): TextOptions => {
  const industryTemplates = INDUSTRY_TEXT_TEMPLATES[styleKey] || [];
  
  // Combinar textos de industria con textos genéricos
  const combinedBranding = [
    ...industryTemplates.slice(0, 3), // Primeros 3 de la industria
    ...BRANDING_TEXTS.slice(0, 2)     // Últimos 2 genéricos
  ];
  
  const combinedLeads = [
    ...industryTemplates.slice(2, 5).map(text => text.replace(/!/g, ' ¡YA!')), // Modificar para urgencia
    ...LEADS_TEXTS
  ];
  
  // Si hay palabras personalizadas, incorporarlas
  if (customWords && customWords.length > 0) {
    const mainWord = customWords[0].toUpperCase();
    combinedBranding[0] = `${combinedBranding[0]} ${mainWord}`;
    combinedLeads[0] = `${combinedLeads[0]} ${mainWord}`;
  }
  
  return {
    branding: combinedBranding,
    leads: combinedLeads
  };
};

/**
 * GENERA TEXTO PERSUASIVO AUTOMÁTICAMENTE (FUNCIÓN LEGACY)
 */
export const generatePersuasiveText = (
  industry: string,
  styleKey: FlyerStyleKey,
  customWords?: string[]
): string => {
  const options = generateTextOptions(styleKey, customWords);
  
  // Seleccionar aleatoriamente entre branding y leads
  const allTexts = [...options.branding, ...options.leads];
  return allTexts[Math.floor(Math.random() * allTexts.length)];
};

/**
 * PROCESAMIENTO COMPLETO DEL MODO MAGIA
 */
export interface MagicModeResult {
  styleKey: FlyerStyleKey;
  persuasiveText: string;
  confidence: number;
  detectedIndustry: string;
  recommendations: string[];
}

export const processMagicMode = (input: string): MagicModeResult => {
  console.log('🔮 Modo Magia activado:', input);
  
  // Detectar industria
  const detection = detectIndustryFromInput(input);
  
  // Extraer palabras clave del input
  const words = input.toLowerCase()
    .replace(/https?:\/\/[^\s]+/g, '') // Remover URLs
    .replace(/[^\w\s]/g, ' ') // Remover puntuación
    .split(/\s+/)
    .filter(word => word.length > 2)
    .slice(0, 5); // Máximo 5 palabras
  
  // Generar texto persuasivo
  const persuasiveText = generatePersuasiveText(
    detection.industry, 
    detection.styleKey, 
    words
  );
  
  // Generar recomendaciones
  const recommendations = [
    `Estilo recomendado: ${detection.styleKey}`,
    `Confianza de detección: ${(detection.confidence * 100).toFixed(0)}%`,
    detection.confidence > 0.7 ? '✅ Detección muy precisa' : 
    detection.confidence > 0.5 ? '⚠️ Detección moderada' : '❓ Detección genérica'
  ];
  
  return {
    styleKey: detection.styleKey,
    persuasiveText,
    confidence: detection.confidence,
    detectedIndustry: detection.industry,
    recommendations
  };
};

/**
 * VALIDACIÓN DE URL PARA DETECCIÓN MEJORADA
 */
export const extractBusinessInfoFromUrl = (url: string): {
  domain: string;
  pathSegments: string[];
  queryParams: Record<string, string>;
} => {
  try {
    const urlObj = new URL(url);
    return {
      domain: urlObj.hostname.replace('www.', ''),
      pathSegments: urlObj.pathname.split('/').filter(segment => segment.length > 0),
      queryParams: Object.fromEntries(urlObj.searchParams.entries())
    };
  } catch {
    return {
      domain: '',
      pathSegments: [],
      queryParams: {}
    };
  }
};

/**
 * ANÁLISIS AVANZADO DE URL PARA MEJOR DETECCIÓN
 */
export const enhancedUrlAnalysis = (url: string): IndustryDetection => {
  const urlInfo = extractBusinessInfoFromUrl(url);
  const combinedInput = [
    urlInfo.domain,
    ...urlInfo.pathSegments,
    ...Object.values(urlInfo.queryParams)
  ].join(' ');
  
  return detectIndustryFromInput(combinedInput);
};
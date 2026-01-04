/**
 * SERVICIO MODO MAGIA - DETECCIÓN AUTOMÁTICA Y GENERACIÓN INTELIGENTE
 * Solución lean para automatización completa del flujo de diseño
 */

import { FlyerStyleKey, FlyerStyleKeyVideo } from '../types';

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
  pilates: 'Pilates / Core',
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
  typo_bold: 'Tipografía Pura',
  market_handwritten: 'Feria / Mercado'
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
  'pilates': 'pilates',
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
  
  pilates: [
    'VIVE PILATES',
    'CUERPO CONSCIENTE',
    'TU EQUILIBRIO INTERIOR',
    'FLEXIBILIDAD Y FUERZA',
    'MOVIMIENTO CON PROPÓSITO'
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
 * Lógica SIMPLE y DETERMINÍSTICA sin conflictos
 */
export const detectIndustryFromInput = (input: string): IndustryDetection => {
  const inputLower = input.toLowerCase();
  
  // 🔥 ORDEN DE PRIORIDAD (primera coincidencia gana)
  // Esto evita conflictos entre industrias similares
  
  // 1. WELLNESS & PILATES (prioridad alta para evitar conflictos con iglesia)
  if (inputLower.includes('pilates')) {
    return { industry: 'pilates', styleKey: 'pilates', confidence: 0.95, keywords: ['pilates'] };
  }
  if (inputLower.includes('yoga')) {
    return { industry: 'wellness_zen', styleKey: 'wellness_zen', confidence: 0.9, keywords: ['yoga'] };
  }
  if (inputLower.includes('spa') || inputLower.includes('masaje')) {
    return { industry: 'wellness_zen', styleKey: 'wellness_zen', confidence: 0.85, keywords: ['spa', 'masaje'] };
  }
  
  // 2. RELIGIOSO / IGLESIA (después de wellness para evitar conflicto con "espiritual")
  if (inputLower.includes('iglesia') || inputLower.includes('templo') || inputLower.includes('congregación')) {
    return { industry: 'worship_sky', styleKey: 'worship_sky', confidence: 0.9, keywords: ['iglesia', 'templo', 'congregación'] };
  }
  if (inputLower.includes('religión') || inputLower.includes('cristo') || inputLower.includes('evangelio')) {
    return { industry: 'worship_sky', styleKey: 'worship_sky', confidence: 0.85, keywords: ['religión', 'cristo', 'evangelio'] };
  }
  
  // 3. GASTRONOMÍA
  if (inputLower.includes('restaurant') || inputLower.includes('restaurante')) {
    return { industry: 'gastronomy', styleKey: 'gastronomy', confidence: 0.9, keywords: ['restaurant', 'restaurante'] };
  }
  if (inputLower.includes('comida') || inputLower.includes('food') || inputLower.includes('cafe') || inputLower.includes('pizza') || inputLower.includes('hamburguesa')) {
    return { industry: 'gastronomy', styleKey: 'gastronomy', confidence: 0.85, keywords: ['comida', 'food', 'cafe', 'pizza', 'hamburguesa'] };
  }
  
  // 4. RETAIL & VENTAS
  if (inputLower.includes('tienda') || inputLower.includes('shop') || inputLower.includes('store')) {
    return { industry: 'retail_sale', styleKey: 'retail_sale', confidence: 0.9, keywords: ['tienda', 'shop', 'store'] };
  }
  if (inputLower.includes('oferta') || inputLower.includes('sale') || inputLower.includes('descuento') || inputLower.includes('promoción') || inputLower.includes('liquidación')) {
    return { industry: 'retail_sale', styleKey: 'retail_sale', confidence: 0.85, keywords: ['oferta', 'sale', 'descuento', 'promoción', 'liquidación'] };
  }
  
  // 5. DEPORTE & FITNESS
  if (inputLower.includes('gym') || inputLower.includes('gimnasio')) {
    return { industry: 'sport_gritty', styleKey: 'sport_gritty', confidence: 0.9, keywords: ['gym', 'gimnasio'] };
  }
  if (inputLower.includes('fitness') || inputLower.includes('deporte') || inputLower.includes('entrenamiento') || inputLower.includes('ejercicio')) {
    return { industry: 'sport_gritty', styleKey: 'sport_gritty', confidence: 0.85, keywords: ['fitness', 'deporte', 'entrenamiento', 'ejercicio'] };
  }
  
  // 6. BELLEZA & AESTHETIC
  if (inputLower.includes('belleza') || inputLower.includes('estética') || inputLower.includes('estetica')) {
    return { industry: 'aesthetic_min', styleKey: 'aesthetic_min', confidence: 0.9, keywords: ['belleza', 'estética', 'estetica'] };
  }
  if (inputLower.includes('skincare') || inputLower.includes('aesthetic')) {
    return { industry: 'aesthetic_min', styleKey: 'aesthetic_min', confidence: 0.85, keywords: ['skincare', 'aesthetic'] };
  }
  
  // 7. MÉDICO & SALUD
  if (inputLower.includes('médico') || inputLower.includes('medico') || inputLower.includes('doctor')) {
    return { industry: 'medical_clean', styleKey: 'medical_clean', confidence: 0.9, keywords: ['médico', 'medico', 'doctor'] };
  }
  if (inputLower.includes('clínica') || inputLower.includes('clinica') || inputLower.includes('hospital') || inputLower.includes('dentista') || inputLower.includes('farmacia')) {
    return { industry: 'medical_clean', styleKey: 'medical_clean', confidence: 0.85, keywords: ['clínica', 'clinica', 'hospital', 'dentista', 'farmacia'] };
  }
  
  // 8. TECNOLOGÍA
  if (inputLower.includes('tech') || inputLower.includes('software') || inputLower.includes('app')) {
    return { industry: 'tech_saas', styleKey: 'tech_saas', confidence: 0.9, keywords: ['tech', 'software', 'app'] };
  }
  if (inputLower.includes('digital') || inputLower.includes('web') || inputLower.includes('programación') || inputLower.includes('desarrollo')) {
    return { industry: 'tech_saas', styleKey: 'tech_saas', confidence: 0.85, keywords: ['digital', 'web', 'programación', 'desarrollo'] };
  }
  
  // 9. EDUCACIÓN
  if (inputLower.includes('educación') || inputLower.includes('education') || inputLower.includes('escuela') || inputLower.includes('colegio') || inputLower.includes('universidad')) {
    return { industry: 'edu_sketch', styleKey: 'edu_sketch', confidence: 0.9, keywords: ['educación', 'education', 'escuela', 'colegio', 'universidad'] };
  }
  if (inputLower.includes('curso') || inputLower.includes('academia') || inputLower.includes('clase')) {
    return { industry: 'edu_sketch', styleKey: 'edu_sketch', confidence: 0.85, keywords: ['curso', 'academia', 'clase'] };
  }
  
  // 10. CORPORATIVO & NEGOCIOS
  if (inputLower.includes('empresa') || inputLower.includes('company') || inputLower.includes('business')) {
    return { industry: 'corporate', styleKey: 'corporate', confidence: 0.9, keywords: ['empresa', 'company', 'business'] };
  }
  if (inputLower.includes('servicios') || inputLower.includes('consultoría') || inputLower.includes('consultoria') || inputLower.includes('abogado') || inputLower.includes('contador')) {
    return { industry: 'corporate', styleKey: 'corporate', confidence: 0.85, keywords: ['servicios', 'consultoría', 'consultoria', 'abogado', 'contador'] };
  }
  
  // 11. INMOBILIARIA
  if (inputLower.includes('inmobiliaria') || inputLower.includes('inmueble') || inputLower.includes('propiedad')) {
    return { industry: 'realestate_night', styleKey: 'realestate_night', confidence: 0.9, keywords: ['inmobiliaria', 'inmueble', 'propiedad'] };
  }
  if (inputLower.includes('casa') || inputLower.includes('departamento') || inputLower.includes('venta')) {
    return { industry: 'realestate_night', styleKey: 'realestate_night', confidence: 0.85, keywords: ['casa', 'departamento', 'venta'] };
  }
  
  // 12. LUJO & PREMIUM
  if (inputLower.includes('lujo') || inputLower.includes('luxury') || inputLower.includes('premium')) {
    return { industry: 'luxury_gold', styleKey: 'luxury_gold', confidence: 0.9, keywords: ['lujo', 'luxury', 'premium'] };
  }
  if (inputLower.includes('vip') || inputLower.includes('elegante') || inputLower.includes('joyería') || inputLower.includes('joyeria') || inputLower.includes('relojes')) {
    return { industry: 'luxury_gold', styleKey: 'luxury_gold', confidence: 0.85, keywords: ['vip', 'elegante', 'joyería', 'joyeria', 'relojes'] };
  }
  
  // 13. AUTOMOTRIZ
  if (inputLower.includes('auto') || inputLower.includes('carro') || inputLower.includes('vehiculo') || inputLower.includes('concesionario')) {
    return { industry: 'auto_metallic', styleKey: 'auto_metallic', confidence: 0.9, keywords: ['auto', 'carro', 'vehiculo', 'concesionario'] };
  }
  if (inputLower.includes('mecánico') || inputLower.includes('mecanico') || inputLower.includes('taller')) {
    return { industry: 'auto_metallic', styleKey: 'auto_metallic', confidence: 0.85, keywords: ['mecánico', 'mecanico', 'taller'] };
  }
  
  // 14. NOCHE & ENTRETENIMIENTO
  if (inputLower.includes('discoteca') || inputLower.includes('club')) {
    return { industry: 'urban_night', styleKey: 'urban_night', confidence: 0.9, keywords: ['discoteca', 'club'] };
  }
  if (inputLower.includes('fiesta') || inputLower.includes('noche') || inputLower.includes('entretención') || inputLower.includes('evento')) {
    return { industry: 'urban_night', styleKey: 'urban_night', confidence: 0.85, keywords: ['fiesta', 'noche', 'entretención', 'evento'] };
  }
  
  // 15. GAMING & STREAMING
  if (inputLower.includes('gaming') || inputLower.includes('game') || inputLower.includes('esports')) {
    return { industry: 'gamer_stream', styleKey: 'gamer_stream', confidence: 0.9, keywords: ['gaming', 'game', 'esports'] };
  }
  if (inputLower.includes('stream') || inputLower.includes('twitch') || inputLower.includes('videojuego')) {
    return { industry: 'gamer_stream', styleKey: 'gamer_stream', confidence: 0.85, keywords: ['stream', 'twitch', 'videojuego'] };
  }
  
  // 16. MÚSICA & PODCAST
  if (inputLower.includes('podcast') || inputLower.includes('radio')) {
    return { industry: 'podcast_mic', styleKey: 'podcast_mic', confidence: 0.9, keywords: ['podcast', 'radio'] };
  }
  if (inputLower.includes('música') || inputLower.includes('musica') || inputLower.includes('audio') || inputLower.includes('entrevista')) {
    return { industry: 'podcast_mic', styleKey: 'podcast_mic', confidence: 0.85, keywords: ['música', 'musica', 'audio', 'entrevista'] };
  }
  
  // 17. INFANTIL
  if (inputLower.includes('niños') || inputLower.includes('ninos') || inputLower.includes('infantil')) {
    return { industry: 'kids_fun', styleKey: 'kids_fun', confidence: 0.9, keywords: ['niños', 'ninos', 'infantil'] };
  }
  if (inputLower.includes('cumpleaños') || inputLower.includes('juguetes') || inputLower.includes('kids') || inputLower.includes('birthday')) {
    return { industry: 'kids_fun', styleKey: 'kids_fun', confidence: 0.85, keywords: ['cumpleaños', 'juguetes', 'kids', 'birthday'] };
  }
  
  // 18. ECOLÓGICO & NATURAL
  if (inputLower.includes('eco') || inputLower.includes('organic') || inputLower.includes('orgánico')) {
    return { industry: 'eco_organic', styleKey: 'eco_organic', confidence: 0.9, keywords: ['eco', 'organic', 'orgánico'] };
  }
  if (inputLower.includes('natural') || inputLower.includes('verde') || inputLower.includes('sustentable') || inputLower.includes('frutas')) {
    return { industry: 'eco_organic', styleKey: 'eco_organic', confidence: 0.85, keywords: ['natural', 'verde', 'sustentable', 'frutas'] };
  }
  
  // 18.5 FERIA LIBRE / MERCADO CHILENO (NUEVO)
  if (inputLower.includes('feria') || inputLower.includes('vega') || inputLower.includes('mercado')) {
    return { industry: 'market_handwritten', styleKey: 'market_handwritten', confidence: 0.95, keywords: ['feria', 'vega', 'mercado'] };
  }
  if (inputLower.includes('fruta') || inputLower.includes('verdura') || inputLower.includes('frutería') || inputLower.includes('verdulería') || inputLower.includes('puesto')) {
    return { industry: 'market_handwritten', styleKey: 'market_handwritten', confidence: 0.9, keywords: ['fruta', 'verdura', 'frutería', 'verdulería', 'puesto'] };
  }
  if (inputLower.includes('almacén') || inputLower.includes('almacen') || inputLower.includes('kiosko') || inputLower.includes('amasandería') || inputLower.includes('panadería')) {
    return { industry: 'market_handwritten', styleKey: 'market_handwritten', confidence: 0.85, keywords: ['almacén', 'kiosko', 'amasandería', 'panadería'] };
  }
  
  // 19. VERANO & PLAYA
  if (inputLower.includes('verano') || inputLower.includes('summer') || inputLower.includes('playa')) {
    return { industry: 'summer_beach', styleKey: 'summer_beach', confidence: 0.9, keywords: ['verano', 'summer', 'playa'] };
  }
  if (inputLower.includes('vacaciones') || inputLower.includes('turismo') || inputLower.includes('hotel') || inputLower.includes('piscina') || inputLower.includes('pool')) {
    return { industry: 'summer_beach', styleKey: 'summer_beach', confidence: 0.85, keywords: ['vacaciones', 'turismo', 'hotel', 'piscina', 'pool'] };
  }
  
  // 20. POLÍTICA
  if (inputLower.includes('política') || inputLower.includes('politica') || inputLower.includes('político') || inputLower.includes('politico')) {
    return { industry: 'political_community', styleKey: 'political_community', confidence: 0.9, keywords: ['política', 'politica', 'político', 'politico'] };
  }
  if (inputLower.includes('gobierno') || inputLower.includes('elección') || inputLower.includes('eleccion') || inputLower.includes('voto')) {
    return { industry: 'political_community', styleKey: 'political_community', confidence: 0.85, keywords: ['gobierno', 'elección', 'eleccion', 'voto'] };
  }
  
  // 21. ARTE & CREATIVO
  if (inputLower.includes('arte') || inputLower.includes('artist') || inputLower.includes('galería') || inputLower.includes('galeria')) {
    return { industry: 'art_double_exp', styleKey: 'art_double_exp', confidence: 0.9, keywords: ['arte', 'artist', 'galería', 'galeria'] };
  }
  if (inputLower.includes('diseño') || inputLower.includes('diseno') || inputLower.includes('teatro') || inputLower.includes('creativo')) {
    return { industry: 'art_double_exp', styleKey: 'art_double_exp', confidence: 0.85, keywords: ['diseño', 'diseno', 'teatro', 'creativo'] };
  }
  
  // 22. RETRO & VINTAGE
  if (inputLower.includes('retro') || inputLower.includes('vintage') || inputLower.includes('antiguo')) {
    return { industry: 'retro_vintage', styleKey: 'retro_vintage', confidence: 0.9, keywords: ['retro', 'vintage', 'antiguo'] };
  }
  
  // 23. ROCK & MÚSICA INDIE
  if (inputLower.includes('rock') || inputLower.includes('música') || inputLower.includes('musica') || inputLower.includes('concierto') || inputLower.includes('guitarra')) {
    return { industry: 'indie_grunge', styleKey: 'indie_grunge', confidence: 0.9, keywords: ['rock', 'música', 'musica', 'concierto', 'guitarra'] };
  }
  if (inputLower.includes('indie') || inputLower.includes('band')) {
    return { industry: 'indie_grunge', styleKey: 'indie_grunge', confidence: 0.85, keywords: ['indie', 'band'] };
  }
  
  // 24. NAVIDAD & FESTIVIDADES
  if (inputLower.includes('navidad') || inputLower.includes('christmas') || inputLower.includes('año nuevo')) {
    return { industry: 'seasonal_holiday', styleKey: 'seasonal_holiday', confidence: 0.9, keywords: ['navidad', 'christmas', 'año nuevo'] };
  }
  if (inputLower.includes('valentín') || inputLower.includes('valentin') || inputLower.includes('festividades') || inputLower.includes('regalos')) {
    return { industry: 'seasonal_holiday', styleKey: 'seasonal_holiday', confidence: 0.85, keywords: ['valentín', 'valentin', 'festividades', 'regalos'] };
  }
  
  // 🔒 FALLBACK FINAL: brand_identity
  console.log(`🔍 [Detección] No se reconoció la industria, usando brand_identity como fallback`);
  return {
    industry: 'brand_identity',
    styleKey: 'brand_identity',
    confidence: 0.3,
    keywords: []
  };
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

// ============================================
// DETECCIÓN AUTOMÁTICA PARA VIDEOS (60 ESTILOS)
// ============================================

/**
 * MAPEO DE ESTILOS DE VIDEO A NOMBRES EN ESPAÑOL (60 Estilos v2.0)
 */
export const VIDEO_STYLE_NAMES_ES: Record<FlyerStyleKeyVideo, string> = {
  // BLOQUE 1: RETAIL Y ESTÉTICA (1-20)
  video_retail_gen: 'Retail General',
  video_fashion_women: 'Moda Mujer',
  video_fashion_men: 'Moda Hombre',
  video_footwear: 'Calzado',
  video_jewelry: 'Joyas',
  video_optics: 'Óptica',
  video_beauty: 'Belleza/Cosmética',
  video_perfume: 'Perfumería',
  video_bags: 'Bolsos/Carteras',
  video_tech_acc: 'Accesorios Tech',
  video_smartphone: 'Smartphones',
  video_computing: 'Computación',
  video_gaming: 'Gaming',
  video_photography: 'Fotografía',
  video_audio: 'Audio/Sonido',
  video_watches: 'Relojes',
  video_decor: 'Decoración',
  video_furniture: 'Muebles',
  video_lighting: 'Iluminación',
  video_appliances: 'Electrodomésticos',
  
  // BLOQUE 2: SALUD Y DEPORTE (21-30)
  video_gym: 'Gimnasio/Deporte',
  video_gastronomy: 'Gastronomía',
  video_wellness_zen: 'Spa/Wellness',
  video_medical: 'Médico/Clínico',
  video_corporate: 'Corporativo',
  video_real_estate: 'Inmobiliaria',
  video_automotive: 'Automotriz',
  video_pets: 'Mascotas',
  video_travel: 'Viajes',
  video_construction: 'Construcción',
  
  // BLOQUE 3: SERVICIOS ESPECIALIZADOS (31-40)
  video_mechanic: 'Taller Mecánico',
  video_tire_service: 'Vulcanización',
  video_barber: 'Barbería',
  video_veterinary: 'Veterinaria',
  video_yoga: 'Yoga',
  video_pilates: 'Pilates',
  video_physiotherapy: 'Kinesiología',
  video_legal: 'Estudio Jurídico',
  video_gardening: 'Jardinería',
  video_security: 'Seguridad',
  
  // BLOQUE 4: GASTRONOMÍA ESPECIALIZADA (41-50)
  video_sushi: 'Sushi/Nikkei',
  video_fast_food: 'Comida Rápida',
  video_ice_cream: 'Heladería',
  video_nail_studio: 'Nail Studio',
  video_tattoo: 'Tattoo Studio',
  video_pizza: 'Pizzería',
  video_veggie: 'Veggie/Vegetariano',
  video_coffee: 'Café',
  video_bakery: 'Panadería',
  video_pastry: 'Pastelería',
  
  // BLOQUE 5: COMERCIO ESPECIALIZADO (51-60)
  video_butcher: 'Carnicería',
  video_hardware: 'Ferretería',
  video_bookstore: 'Librería',
  video_florist: 'Florería',
  video_cleaning: 'Limpieza',
  video_laundry: 'Lavandería',
  video_shoe_store: 'Zapatería',
  video_optician: 'Óptica',
  video_tech_repair: 'Servicio Técnico',
  video_liquor_store: 'Botillería'
};

/**
 * MAPEO DE INDUSTRIAS A ESTILOS DE VIDEO (60 Estilos v2.0)
 */
const VIDEO_INDUSTRY_STYLE_MAPPING: Record<string, FlyerStyleKeyVideo> = {
  // === BLOQUE 1: RETAIL Y MODA ===
  'tienda': 'video_retail_gen',
  'shop': 'video_retail_gen',
  'store': 'video_retail_gen',
  'comercio': 'video_retail_gen',
  'minorista': 'video_retail_gen',
  
  'moda mujer': 'video_fashion_women',
  'ropa mujer': 'video_fashion_women',
  'fashion women': 'video_fashion_women',
  
  'moda hombre': 'video_fashion_men',
  'ropa hombre': 'video_fashion_men',
  'fashion men': 'video_fashion_men',
  'urbano': 'video_fashion_men',
  
  'zapato': 'video_footwear',
  'zapatilla': 'video_footwear',
  'calzado': 'video_footwear',
  'tenis': 'video_footwear',
  
  'joya': 'video_jewelry',
  'anillo': 'video_jewelry',
  'diamante': 'video_jewelry',
  'joyería': 'video_jewelry',
  
  'lente': 'video_optics',
  'óptica': 'video_optics',
  'gafa': 'video_optics',
  'vista': 'video_optics',
  
  'belleza': 'video_beauty',
  'cosmético': 'video_beauty',
  'makeup': 'video_beauty',
  
  'perfume': 'video_perfume',
  'fragancia': 'video_perfume',
  
  'bolso': 'video_bags',
  'cartera': 'video_bags',
  'mochila': 'video_bags',
  
  'accesorio tech': 'video_tech_acc',
  'gadget': 'video_tech_acc',
  'cargador': 'video_tech_acc',
  
  'celular': 'video_smartphone',
  'smartphone': 'video_smartphone',
  'móvil': 'video_smartphone',
  'iphone': 'video_smartphone',
  
  'computadora': 'video_computing',
  'pc': 'video_computing',
  'laptop': 'video_computing',
  
  'gaming': 'video_gaming',
  'videojuego': 'video_gaming',
  'esports': 'video_gaming',
  
  'fotografía': 'video_photography',
  
  'audio': 'video_audio',
  'sonido': 'video_audio',
  'parlante': 'video_audio',
  
  'reloj': 'video_watches',
  'watch': 'video_watches',
  
  'decoración': 'video_decor',
  'adorno': 'video_decor',
  
  'mueble': 'video_furniture',
  'silla': 'video_furniture',
  'mesa': 'video_furniture',
  
  'iluminación': 'video_lighting',
  'lámpara': 'video_lighting',
  
  'electrodoméstico': 'video_appliances',
  'cocina': 'video_appliances',
  
  // === BLOQUE 2: SALUD Y DEPORTE ===
  'gym': 'video_gym',
  'gimnasio': 'video_gym',
  'fitness': 'video_gym',
  'deporte': 'video_gym',
  'entrenamiento': 'video_gym',
  
  'restaurante': 'video_gastronomy',
  'comida': 'video_gastronomy',
  'gastronomía': 'video_gastronomy',
  'food': 'video_gastronomy',
  
  'spa': 'video_wellness_zen',
  'wellness': 'video_wellness_zen',
  'masaje': 'video_wellness_zen',
  'relajación': 'video_wellness_zen',
  
  'médico': 'video_medical',
  'doctor': 'video_medical',
  'clínica': 'video_medical',
  'salud': 'video_medical',
  'dental': 'video_medical',
  
  'empresa': 'video_corporate',
  'corporativo': 'video_corporate',
  'oficina': 'video_corporate',
  'business': 'video_corporate',
  
  'inmobiliaria': 'video_real_estate',
  'inmueble': 'video_real_estate',
  'casa': 'video_real_estate',
  'departamento': 'video_real_estate',
  
  'auto': 'video_automotive',
  'vehículo': 'video_automotive',
  'carro': 'video_automotive',
  'automotriz': 'video_automotive',
  
  'mascota': 'video_pets',
  'perro': 'video_pets',
  'gato': 'video_pets',
  'veterinaria': 'video_pets',
  
  'viaje': 'video_travel',
  'vacaciones': 'video_travel',
  'turismo': 'video_travel',
  'hotel': 'video_travel',
  
  'construcción': 'video_construction',
  'obra': 'video_construction',
  'edificio': 'video_construction',
  
  // === BLOQUE 3: SERVICIOS ESPECIALIZADOS ===
  'mecánico': 'video_mechanic',
  'taller': 'video_mechanic',
  'reparación': 'video_mechanic',
  
  'neumático': 'video_tire_service',
  'llanta': 'video_tire_service',
  'vulcanización': 'video_tire_service',
  
  'barbería': 'video_barber',
  'barba': 'video_barber',
  
  'veterinario': 'video_veterinary',
  
  'yoga': 'video_yoga',
  'meditación': 'video_yoga',
  
  'pilates': 'video_pilates',
  'reformer': 'video_pilates',
  'core': 'video_pilates',
  
  'kinesiología': 'video_physiotherapy',
  'fisioterapia': 'video_physiotherapy',
  'rehabilitación': 'video_physiotherapy',
  
  'abogado': 'video_legal',
  'jurídico': 'video_legal',
  'legal': 'video_legal',
  
  'jardinería': 'video_gardening',
  'paisajismo': 'video_gardening',
  'planta': 'video_gardening',
  
  'seguridad': 'video_security',
  'vigilancia': 'video_security',
  
  // === BLOQUE 4: GASTRONOMÍA ESPECIALIZADA ===
  'sushi': 'video_sushi',
  'japonés': 'video_sushi',
  'nikkei': 'video_sushi',
  
  'comida rápida': 'video_fast_food',
  'hamburguesa': 'video_fast_food',
  'fast food': 'video_fast_food',
  
  'helado': 'video_ice_cream',
  'heladería': 'video_ice_cream',
  
  'uñas': 'video_nail_studio',
  'manicure': 'video_nail_studio',
  'nail art': 'video_nail_studio',
  
  'tattoo': 'video_tattoo',
  'tatuaje': 'video_tattoo',
  
  'pizza': 'video_pizza',
  'italiano': 'video_pizza',
  
  'vegetariano': 'video_veggie',
  'vegano': 'video_veggie',
  'saludable': 'video_veggie',
  
  'café': 'video_coffee',
  'espresso': 'video_coffee',
  'barista': 'video_coffee',
  
  'pan': 'video_bakery',
  'panadería': 'video_bakery',
  'horno': 'video_bakery',
  
  'pastel': 'video_pastry',
  'torta': 'video_pastry',
  'pastelería': 'video_pastry',
  
  // === BLOQUE 5: COMERCIO ESPECIALIZADO ===
  'carne': 'video_butcher',
  'carnicería': 'video_butcher',
  
  'herramienta': 'video_hardware',
  'taladro': 'video_hardware',
  'ferretería': 'video_hardware',
  
  'libro': 'video_bookstore',
  'librería': 'video_bookstore',
  'lectura': 'video_bookstore',
  
  'flor': 'video_florist',
  'florería': 'video_florist',
  'ramo': 'video_florist',
  
  'limpieza': 'video_cleaning',
  'aseo': 'video_cleaning',
  'servicio': 'video_cleaning',
  
  'lavandería': 'video_laundry',
  'ropa': 'video_laundry',
  'lavado': 'video_laundry',
  
  'zapatería': 'video_shoe_store',
  
  'técnico': 'video_tech_repair',
  
  'botillería': 'video_liquor_store',
  'vino': 'video_liquor_store',
  'licor': 'video_liquor_store'
};

/**
 * INTERFAZ PARA DETECCIÓN DE VIDEO
 */
export interface VideoIndustryDetection {
  industry: string;
  styleKey: FlyerStyleKeyVideo;
  confidence: number;
  keywords: string[];
}

/**
 * DETECTA EL ESTILO DE VIDEO DESDE URL O TEXTO (60 Estilos v2.0)
 * Lógica SIMPLE y DETERMINÍSTICA sin conflictos
 *
 * 🎯 SISTEMA DE PALABRAS ANCLA:
 * - Sustantivos Técnicos (Anclas): Peso 3x
 * - Adjetivos Genéricos: Peso 1x
 * - Anti-Anclas: Penalización -5x
 */
export const detectVideoStyleFromInput = (input: string): VideoIndustryDetection => {
  const inputLower = input.toLowerCase();
  
  // ============================================
  // 🔥 ORDEN DE PRIORIDAD (primera coincidencia gana)
  // ============================================
  
  // === PILATES (CRÍTICO - Evitar confusión con SPA) ===
  // Pilates tiene equipamiento específico (Reformer) y es entrenamiento activo
  if (inputLower.includes('pilates') || inputLower.includes('reformer') || inputLower.includes('core') || inputLower.includes('máquina')) {
    // Verificar que NO sea SPA/Masaje (Anti-Anclas de Pilates)
    if (!inputLower.includes('spa') && !inputLower.includes('masaje') && !inputLower.includes('velas') && !inputLower.includes('sauna')) {
      return {
        industry: 'pilates',
        styleKey: 'video_pilates',
        confidence: 0.95,
        keywords: ['pilates', 'reformer', 'core', 'máquina']
      };
    }
  }
  
  // === WELLNESS / SPA (pasivo - relajación) ===
  if (inputLower.includes('spa') || inputLower.includes('masaje') || inputLower.includes('velas') || inputLower.includes('sauna') || inputLower.includes('jacuzzi')) {
    return {
      industry: 'wellness_zen',
      styleKey: 'video_wellness_zen',
      confidence: 0.9,
      keywords: ['spa', 'masaje', 'velas', 'sauna', 'jacuzzi']
    };
  }
  
  // === YOGA (flexibilidad, respiración) ===
  if (inputLower.includes('yoga') || inputLower.includes('meditación') || inputLower.includes('respiración') || inputLower.includes('postura')) {
    return {
      industry: 'yoga',
      styleKey: 'video_yoga',
      confidence: 0.9,
      keywords: ['yoga', 'meditación', 'respiración', 'postura']
    };
  }
  
  // === GIMNASIO / DEPORTE ===
  if (inputLower.includes('gym') || inputLower.includes('gimnasio') || inputLower.includes('fitness') || inputLower.includes('deporte') || inputLower.includes('entrenamiento') || inputLower.includes('atleta') || inputLower.includes('crossfit')) {
    return {
      industry: 'gym',
      styleKey: 'video_gym',
      confidence: 0.9,
      keywords: ['gym', 'gimnasio', 'fitness', 'deporte', 'entrenamiento', 'atleta', 'crossfit']
    };
  }
  
  // === MÉDICO / CLÍNICO ===
  if (inputLower.includes('médico') || inputLower.includes('medico') || inputLower.includes('doctor') || inputLower.includes('clínica') || inputLower.includes('clinica') || inputLower.includes('hospital') || inputLower.includes('dental') || inputLower.includes('dentista')) {
    return {
      industry: 'medical',
      styleKey: 'video_medical',
      confidence: 0.9,
      keywords: ['médico', 'medico', 'doctor', 'clínica', 'clinica', 'hospital', 'dental', 'dentista']
    };
  }
  
  // === KINESIOLOGÍA / FISIOTERAPIA ===
  if (inputLower.includes('kinesiología') || inputLower.includes('fisioterapia') || inputLower.includes('rehabilitación') || inputLower.includes('terapia') || inputLower.includes('rehab')) {
    return {
      industry: 'physiotherapy',
      styleKey: 'video_physiotherapy',
      confidence: 0.9,
      keywords: ['kinesiología', 'fisioterapia', 'rehabilitación', 'terapia', 'rehab']
    };
  }
  
  // === VETERINARIA ===
  if (inputLower.includes('veterinaria') || inputLower.includes('veterinario') || inputLower.includes('mascota') || inputLower.includes('perro') || inputLower.includes('gato') || inputLower.includes('animal')) {
    return {
      industry: 'veterinary',
      styleKey: 'video_veterinary',
      confidence: 0.9,
      keywords: ['veterinaria', 'veterinario', 'mascota', 'perro', 'gato', 'animal']
    };
  }
  
  // === BARBERÍA ===
  if (inputLower.includes('barbería') || inputLower.includes('barbero') || inputLower.includes('barba') || inputLower.includes('navaja') || inputLower.includes('corte masculino')) {
    return {
      industry: 'barber',
      styleKey: 'video_barber',
      confidence: 0.9,
      keywords: ['barbería', 'barbero', 'barba', 'navaja', 'corte masculino']
    };
  }
  
  // === GASTRONOMÍA GENERAL ===
  if (inputLower.includes('restaurante') || inputLower.includes('restaurant') || inputLower.includes('comida') || inputLower.includes('gastronomía') || inputLower.includes('chef') || inputLower.includes('plato')) {
    return {
      industry: 'gastronomy',
      styleKey: 'video_gastronomy',
      confidence: 0.9,
      keywords: ['restaurante', 'restaurant', 'comida', 'gastronomía', 'chef', 'plato']
    };
  }
  
  // === SUSHI / NIKKEI ===
  if (inputLower.includes('sushi') || inputLower.includes('japonés') || inputLower.includes('nikkei') || inputLower.includes('sashimi') || inputLower.includes('roll')) {
    return {
      industry: 'sushi',
      styleKey: 'video_sushi',
      confidence: 0.9,
      keywords: ['sushi', 'japonés', 'nikkei', 'sashimi', 'roll']
    };
  }
  
  // === PIZZERÍA ===
  if (inputLower.includes('pizza') || inputLower.includes('pizzería') || inputLower.includes('italiano') || inputLower.includes('horno de leña')) {
    return {
      industry: 'pizza',
      styleKey: 'video_pizza',
      confidence: 0.9,
      keywords: ['pizza', 'pizzería', 'italiano', 'horno de leña']
    };
  }
  
  // === COMIDA RÁPIDA ===
  if (inputLower.includes('hamburguesa') || inputLower.includes('fast food') || inputLower.includes('comida rápida') || inputLower.includes('burger') || inputLower.includes('fritura')) {
    return {
      industry: 'fast_food',
      styleKey: 'video_fast_food',
      confidence: 0.9,
      keywords: ['hamburguesa', 'fast food', 'comida rápida', 'burger', 'fritura']
    };
  }
  
  // === HELADERÍA ===
  if (inputLower.includes('helado') || inputLower.includes('heladería') || inputLower.includes('ice cream') || inputLower.includes('postre frío')) {
    return {
      industry: 'ice_cream',
      styleKey: 'video_ice_cream',
      confidence: 0.9,
      keywords: ['helado', 'heladería', 'ice cream', 'postre frío']
    };
  }
  
  // === CAFÉ ===
  if (inputLower.includes('café') || inputLower.includes('espresso') || inputLower.includes('barista') || inputLower.includes('coffee') || inputLower.includes('cappuccino')) {
    return {
      industry: 'coffee',
      styleKey: 'video_coffee',
      confidence: 0.9,
      keywords: ['café', 'espresso', 'barista', 'coffee', 'cappuccino']
    };
  }
  
  // === PANADERÍA ===
  if (inputLower.includes('pan') || inputLower.includes('panadería') || inputLower.includes('horno') || inputLower.includes('masa') || inputLower.includes('crujiente') || inputLower.includes('harina')) {
    return {
      industry: 'bakery',
      styleKey: 'video_bakery',
      confidence: 0.9,
      keywords: ['pan', 'panadería', 'horno', 'masa', 'crujiente', 'harina']
    };
  }
  
  // === PASTELERÍA ===
  if (inputLower.includes('pastel') || inputLower.includes('torta') || inputLower.includes('pastelería') || inputLower.includes('glaseado') || inputLower.includes('postre')) {
    return {
      industry: 'pastry',
      styleKey: 'video_pastry',
      confidence: 0.9,
      keywords: ['pastel', 'torta', 'pastelería', 'glaseado', 'postre']
    };
  }
  
  // === VEGETARIANO / VEGANO ===
  if (inputLower.includes('vegetariano') || inputLower.includes('vegano') || inputLower.includes('verdura') || inputLower.includes('saludable') || inputLower.includes('organic') || inputLower.includes('plant-based')) {
    return {
      industry: 'veggie',
      styleKey: 'video_veggie',
      confidence: 0.9,
      keywords: ['vegetariano', 'vegano', 'verdura', 'saludable', 'organic', 'plant-based']
    };
  }
  
  // === CARNICERÍA ===
  if (inputLower.includes('carne') || inputLower.includes('carnicería') || inputLower.includes('corte') || inputLower.includes('vacuno') || inputLower.includes('cerdo') || inputLower.includes('pollo')) {
    return {
      industry: 'butcher',
      styleKey: 'video_butcher',
      confidence: 0.9,
      keywords: ['carne', 'carnicería', 'corte', 'vacuno', 'cerdo', 'pollo']
    };
  }
  
  // === FERRETERÍA ===
  if (inputLower.includes('herramienta') || inputLower.includes('ferretería') || inputLower.includes('taladro') || inputLower.includes('martillo') || inputLower.includes('tuerca') || inputLower.includes('tornillo')) {
    return {
      industry: 'hardware',
      styleKey: 'video_hardware',
      confidence: 0.9,
      keywords: ['herramienta', 'ferretería', 'taladro', 'martillo', 'tuerca', 'tornillo']
    };
  }
  
  // === LIBRERÍA ===
  if (inputLower.includes('libro') || inputLower.includes('librería') || inputLower.includes('lectura') || inputLower.includes('novela') || inputLower.includes('editorial')) {
    return {
      industry: 'bookstore',
      styleKey: 'video_bookstore',
      confidence: 0.9,
      keywords: ['libro', 'librería', 'lectura', 'novela', 'editorial']
    };
  }
  
  // === FLORERÍA ===
  if (inputLower.includes('flor') || inputLower.includes('florería') || inputLower.includes('ramo') || inputLower.includes('pétalo') || inputLower.includes('arreglo floral')) {
    return {
      industry: 'florist',
      styleKey: 'video_florist',
      confidence: 0.9,
      keywords: ['flor', 'florería', 'ramo', 'pétalo', 'arreglo floral']
    };
  }
  
  // === LIMPIEZA ===
  if (inputLower.includes('limpieza') || inputLower.includes('aseo') || inputLower.includes('servicio de limpieza') || inputLower.includes('mantenimiento') || inputLower.includes('higiene')) {
    return {
      industry: 'cleaning',
      styleKey: 'video_cleaning',
      confidence: 0.9,
      keywords: ['limpieza', 'aseo', 'servicio de limpieza', 'mantenimiento', 'higiene']
    };
  }
  
  // === LAVANDERÍA ===
  if (inputLower.includes('lavandería') || inputLower.includes('lavado') || inputLower.includes('ropa') || inputLower.includes('secado') || inputLower.includes('plancha')) {
    return {
      industry: 'laundry',
      styleKey: 'video_laundry',
      confidence: 0.9,
      keywords: ['lavandería', 'lavado', 'ropa', 'secado', 'plancha']
    };
  }
  
  // === ZAPATERÍA ===
  if (inputLower.includes('zapato') || inputLower.includes('zapatería') || inputLower.includes('calzado') || inputLower.includes('talla') || inputLower.includes('suela')) {
    return {
      industry: 'shoe_store',
      styleKey: 'video_shoe_store',
      confidence: 0.9,
      keywords: ['zapato', 'zapatería', 'calzado', 'talla', 'suela']
    };
  }
  
  // === SERVICIO TÉCNICO ===
  if (inputLower.includes('reparación') || inputLower.includes('técnico') || inputLower.includes('servicio técnico') || inputLower.includes('celular') || inputLower.includes('computadora') || inputLower.includes('pantalla')) {
    return {
      industry: 'tech_repair',
      styleKey: 'video_tech_repair',
      confidence: 0.9,
      keywords: ['reparación', 'técnico', 'servicio técnico', 'celular', 'computadora', 'pantalla']
    };
  }
  
  // === BOTILLERÍA ===
  if (inputLower.includes('botillería') || inputLower.includes('vino') || inputLower.includes('cerveza') || inputLower.includes('licor') || inputLower.includes('whisky') || inputLower.includes('bebida')) {
    return {
      industry: 'liquor_store',
      styleKey: 'video_liquor_store',
      confidence: 0.9,
      keywords: ['botillería', 'vino', 'cerveza', 'licor', 'whisky', 'bebida']
    };
  }
  
  // === TALLER MECÁNICO ===
  if (inputLower.includes('mecánico') || inputLower.includes('taller') || inputLower.includes('motor') || inputLower.includes('reparación auto') || inputLower.includes('auto')) {
    return {
      industry: 'mechanic',
      styleKey: 'video_mechanic',
      confidence: 0.9,
      keywords: ['mecánico', 'taller', 'motor', 'reparación auto', 'auto']
    };
  }
  
  // === VULCANIZACIÓN ===
  if (inputLower.includes('neumático') || inputLower.includes('llanta') || inputLower.includes('rueda') || inputLower.includes('vulcanización') || inputLower.includes('goma')) {
    return {
      industry: 'tire_service',
      styleKey: 'video_tire_service',
      confidence: 0.9,
      keywords: ['neumático', 'llanta', 'rueda', 'vulcanización', 'goma']
    };
  }
  
  // === ESTUDIO JURÍDICO ===
  if (inputLower.includes('abogado') || inputLower.includes('jurídico') || inputLower.includes('legal') || inputLower.includes('derecho') || inputLower.includes('estudio')) {
    return {
      industry: 'legal',
      styleKey: 'video_legal',
      confidence: 0.9,
      keywords: ['abogado', 'jurídico', 'legal', 'derecho', 'estudio']
    };
  }
  
  // === JARDINERÍA ===
  if (inputLower.includes('jardinería') || inputLower.includes('paisajismo') || inputLower.includes('planta') || inputLower.includes('césped') || inputLower.includes('jardín')) {
    return {
      industry: 'gardening',
      styleKey: 'video_gardening',
      confidence: 0.9,
      keywords: ['jardinería', 'paisajismo', 'planta', 'césped', 'jardín']
    };
  }
  
  // === SEGURIDAD ===
  if (inputLower.includes('seguridad') || inputLower.includes('vigilancia') || inputLower.includes('cámara') || inputLower.includes('alarma') || inputLower.includes('protección')) {
    return {
      industry: 'security',
      styleKey: 'video_security',
      confidence: 0.9,
      keywords: ['seguridad', 'vigilancia', 'cámara', 'alarma', 'protección']
    };
  }
  
  // === NAIL STUDIO ===
  if (inputLower.includes('uñas') || inputLower.includes('manicure') || inputLower.includes('pedicure') || inputLower.includes('nail art') || inputLower.includes('esmalte')) {
    return {
      industry: 'nail_studio',
      styleKey: 'video_nail_studio',
      confidence: 0.9,
      keywords: ['uñas', 'manicure', 'pedicure', 'nail art', 'esmalte']
    };
  }
  
  // === TATTOO STUDIO ===
  if (inputLower.includes('tattoo') || inputLower.includes('tatuaje') || inputLower.includes('ink') || inputLower.includes('arte corporal')) {
    return {
      industry: 'tattoo',
      styleKey: 'video_tattoo',
      confidence: 0.9,
      keywords: ['tattoo', 'tatuaje', 'ink', 'arte corporal']
    };
  }
  
  // === INMOBILIARIA ===
  if (inputLower.includes('inmobiliaria') || inputLower.includes('inmueble') || inputLower.includes('casa') || inputLower.includes('departamento') || inputLower.includes('propiedad') || inputLower.includes('venta')) {
    return {
      industry: 'real_estate',
      styleKey: 'video_real_estate',
      confidence: 0.9,
      keywords: ['inmobiliaria', 'inmueble', 'casa', 'departamento', 'propiedad', 'venta']
    };
  }
  
  // === AUTOMOTRIZ ===
  if (inputLower.includes('auto') || inputLower.includes('vehículo') || inputLower.includes('carro') || inputLower.includes('automotriz') || inputLower.includes('concesionario')) {
    return {
      industry: 'automotive',
      styleKey: 'video_automotive',
      confidence: 0.9,
      keywords: ['auto', 'vehículo', 'carro', 'automotriz', 'concesionario']
    };
  }
  
  // === VIAJES ===
  if (inputLower.includes('viaje') || inputLower.includes('vacaciones') || inputLower.includes('turismo') || inputLower.includes('hotel') || inputLower.includes('destino') || inputLower.includes('resort')) {
    return {
      industry: 'travel',
      styleKey: 'video_travel',
      confidence: 0.9,
      keywords: ['viaje', 'vacaciones', 'turismo', 'hotel', 'destino', 'resort']
    };
  }
  
  // === CONSTRUCCIÓN ===
  if (inputLower.includes('construcción') || inputLower.includes('obra') || inputLower.includes('edificio') || inputLower.includes('cemento') || inputLower.includes('arquitectura')) {
    return {
      industry: 'construction',
      styleKey: 'video_construction',
      confidence: 0.9,
      keywords: ['construcción', 'obra', 'edificio', 'cemento', 'arquitectura']
    };
  }
  
  // === CORPORATIVO ===
  if (inputLower.includes('empresa') || inputLower.includes('company') || inputLower.includes('business') || inputLower.includes('oficina') || inputLower.includes('corporativo') || inputLower.includes('profesional')) {
    return {
      industry: 'corporate',
      styleKey: 'video_corporate',
      confidence: 0.9,
      keywords: ['empresa', 'company', 'business', 'oficina', 'corporativo', 'profesional']
    };
  }
  
  // === RETAIL GENERAL ===
  if (inputLower.includes('tienda') || inputLower.includes('shop') || inputLower.includes('store') || inputLower.includes('comercio') || inputLower.includes('minorista')) {
    return {
      industry: 'retail_gen',
      styleKey: 'video_retail_gen',
      confidence: 0.9,
      keywords: ['tienda', 'shop', 'store', 'comercio', 'minorista']
    };
  }
  
  // === MODA ===
  if (inputLower.includes('moda') || inputLower.includes('ropa') || inputLower.includes('fashion') || inputLower.includes('prenda') || inputLower.includes('vestido')) {
    return {
      industry: 'fashion',
      styleKey: 'video_fashion_women',
      confidence: 0.85,
      keywords: ['moda', 'ropa', 'fashion', 'prenda', 'vestido']
    };
  }
  
  // === JOYAS ===
  if (inputLower.includes('joya') || inputLower.includes('anillo') || inputLower.includes('diamante') || inputLower.includes('oro') || inputLower.includes('joyería')) {
    return {
      industry: 'jewelry',
      styleKey: 'video_jewelry',
      confidence: 0.9,
      keywords: ['joya', 'anillo', 'diamante', 'oro', 'joyería']
    };
  }
  
  // === PERFUMERÍA ===
  if (inputLower.includes('perfume') || inputLower.includes('fragancia') || inputLower.includes('colonia') || inputLower.includes('aroma')) {
    return {
      industry: 'perfume',
      styleKey: 'video_perfume',
      confidence: 0.9,
      keywords: ['perfume', 'fragancia', 'colonia', 'aroma']
    };
  }
  
  // === OPTICA ===
  if (inputLower.includes('óptica') || inputLower.includes('lente') || inputLower.includes('gafa') || inputLower.includes('vista') || inputLower.includes('armazón')) {
    return {
      industry: 'optics',
      styleKey: 'video_optics',
      confidence: 0.9,
      keywords: ['óptica', 'lente', 'gafa', 'vista', 'armazón']
    };
  }
  
  // === MASCOTAS (segunda mención para cobertura) ===
  if (inputLower.includes('mascota') || inputLower.includes('pet') || inputLower.includes('perro') || inputLower.includes('gato')) {
    return {
      industry: 'pets',
      styleKey: 'video_pets',
      confidence: 0.9,
      keywords: ['mascota', 'pet', 'perro', 'gato']
    };
  }
  
  // === 🔒 FALLBACK FINAL: video_retail_gen ===
  return {
    industry: 'general',
    styleKey: 'video_retail_gen',
    confidence: 0.3,
    keywords: []
  };
};

/**
 * MAPEO DE ESTILO IMAGEN A ESTILO VIDEO CORRESPONDIENTE (60 Estilos v2.0)
 */
export const imageToVideoStyle: Record<FlyerStyleKey, FlyerStyleKeyVideo> = {
  // Estilos existentes mapeados a nuevos estilos de video
  brand_identity: 'video_corporate',
  retail_sale: 'video_retail_gen',
  summer_beach: 'video_travel',
  worship_sky: 'video_wellness_zen', // Espiritual → Wellness (luz suave)
  corporate: 'video_corporate',
  urban_night: 'video_gym', // Noche → Gym (energía)
  gastronomy: 'video_gastronomy',
  sport_gritty: 'video_gym',
  luxury_gold: 'video_jewelry',
  aesthetic_min: 'video_beauty',
  retro_vintage: 'video_bakery',
  gamer_stream: 'video_gaming',
  eco_organic: 'video_veggie',
  indie_grunge: 'video_barber',
  political_community: 'video_corporate',
  kids_fun: 'video_ice_cream',
  art_double_exp: 'video_tattoo',
  medical_clean: 'video_medical',
  tech_saas: 'video_smartphone',
  typo_bold: 'video_retail_gen',
  realestate_night: 'video_real_estate',
  auto_metallic: 'video_automotive',
  edu_sketch: 'video_corporate',
  wellness_zen: 'video_wellness_zen',
  pilates: 'video_pilates', // Pilates → video_pilates (movimiento específico)
  podcast_mic: 'video_corporate',
  seasonal_holiday: 'video_bakery',
  market_handwritten: 'video_retail_gen',
  
  // Nuevos estilos 26-40
  mechanic_workshop: 'video_mechanic',
  tire_service: 'video_tire_service',
  construction_site: 'video_construction',
  logistics_delivery: 'video_corporate',
  bakery_bread: 'video_bakery',
  liquor_store: 'video_liquor_store',
  fast_food_street: 'video_fast_food',
  barber_shop: 'video_barber',
  veterinary_clinic: 'video_veterinary',
  hvac_plumbing: 'video_tech_repair',
  dental_clinic: 'video_medical',
  physiotherapy: 'video_physiotherapy',
  law_accounting: 'video_legal',
  gardening_landscaping: 'video_gardening',
  security_systems: 'video_security',
  
  // Nuevos estilos 41-60
  sushi_nikkei: 'video_sushi',
  pizzeria: 'video_pizza',
  ice_cream: 'video_ice_cream',
  nail_studio: 'video_nail_studio',
  tattoo_studio: 'video_tattoo',
  yoga_studio: 'video_yoga',
  car_detailing: 'video_automotive',
  optical: 'video_optics',
  bookstore: 'video_bookstore',
  flower_shop: 'video_florist',
  transport_school: 'video_corporate',
  hardware_store: 'video_hardware',
  cleaning_service: 'video_cleaning',
  travel_agency: 'video_travel',
  laundry: 'video_laundry',
  shoe_store: 'video_shoe_store',
  tech_repair: 'video_tech_repair',
  pastry_shop: 'video_pastry'
};

/**
 * OBTIENE EL ESTILO DE VIDEO CORRESPONDIENTE A UN ESTILO DE IMAGEN
 */
export const getVideoStyleFromImageStyle = (imageStyleKey: FlyerStyleKey): FlyerStyleKeyVideo => {
  return imageToVideoStyle[imageStyleKey] || 'video_retail_gen';
};
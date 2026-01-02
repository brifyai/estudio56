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
// DETECCIÓN AUTOMÁTICA PARA VIDEOS
// ============================================

/**
 * MAPEO DE ESTILOS DE VIDEO A NOMBRES EN ESPAÑOL
 */
export const VIDEO_STYLE_NAMES_ES: Record<FlyerStyleKeyVideo, string> = {
  video_retail_sale: 'Retail / Ofertas',
  video_summer_beach: 'Verano / Turismo',
  video_worship_sky: 'Iglesia / Espiritual',
  video_corporate: 'Corporativo / Oficina',
  video_urban_night: 'Discoteca / Neón',
  video_gastronomy: 'Gastronomía / Comida',
  video_sport_gritty: 'Deporte / Gym',
  video_luxury_gold: 'Lujo / Gala VIP',
  video_aesthetic_min: 'Aesthetic / Belleza',
  video_retro_vintage: 'Retro / Vintage 90s',
  video_gamer_stream: 'Gamer / Esports',
  video_eco_organic: 'Ecológico / Natural',
  video_indie_grunge: 'Rock / Indie',
  video_political: 'Política / Comunidad',
  video_kids_fun: 'Infantil / Cumpleaños',
  video_art_double_exp: 'Artístico / Doble Exposición',
  video_medical_clean: 'Médico / Clínico',
  video_tech_saas: 'Tech / AI / Digital',
  video_typo_bold: 'Tipografía Pura',
  video_realestate_night: 'Inmobiliaria Nocturna',
  video_auto_metallic: 'Automotriz / Coche',
  video_edu_sketch: 'Educación / Clases',
  video_wellness_zen: 'Spa / Zen',
  video_podcast_mic: 'Podcast / Media',
  video_seasonal_holiday: 'Festividades / Navidad'
};

/**
 * MAPEO DE INDUSTRIAS A ESTILOS DE VIDEO
 */
const VIDEO_INDUSTRY_STYLE_MAPPING: Record<string, FlyerStyleKeyVideo> = {
  // VENTAS & RETAIL
  'tienda': 'video_retail_sale',
  'shop': 'video_retail_sale',
  'store': 'video_retail_sale',
  'oferta': 'video_retail_sale',
  'sale': 'video_retail_sale',
  'descuento': 'video_retail_sale',
  'promocion': 'video_retail_sale',
  'liquidacion': 'video_retail_sale',
  
  // VERANO / TURISMO
  'verano': 'video_summer_beach',
  'summer': 'video_summer_beach',
  'playa': 'video_summer_beach',
  'vacaciones': 'video_summer_beach',
  'turismo': 'video_summer_beach',
  'hotel': 'video_summer_beach',
  'resort': 'video_summer_beach',
  'pool': 'video_summer_beach',
  'piscina': 'video_summer_beach',
  
  // IGLESIA / ESPIRITUAL
  'iglesia': 'video_worship_sky',
  'religion': 'video_worship_sky',
  'espiritual': 'video_worship_sky',
  'fe': 'video_worship_sky',
  'templo': 'video_worship_sky',
  'congregacion': 'video_worship_sky',
  
  // CORPORATIVO
  'empresa': 'video_corporate',
  'company': 'video_corporate',
  'business': 'video_corporate',
  'oficina': 'video_corporate',
  'corporativo': 'video_corporate',
  'profesional': 'video_corporate',
  
  // NOCHE & ENTRETENCIÓN
  'discoteca': 'video_urban_night',
  'club': 'video_urban_night',
  'fiesta': 'video_urban_night',
  'noche': 'video_urban_night',
  'dj': 'video_urban_night',
  'nightlife': 'video_urban_night',
  
  // GASTRONOMÍA
  'restaurant': 'video_gastronomy',
  'restaurante': 'video_gastronomy',
  'comida': 'video_gastronomy',
  'food': 'video_gastronomy',
  'cafe': 'video_gastronomy',
  'burger': 'video_gastronomy',
  'pizza': 'video_gastronomy',
  'gourmet': 'video_gastronomy',
  
  // DEPORTE / GYM
  'fitness': 'video_sport_gritty',
  'gym': 'video_sport_gritty',
  'gimnasio': 'video_sport_gritty',
  'deporte': 'video_sport_gritty',
  'entrenamiento': 'video_sport_gritty',
  'atleta': 'video_sport_gritty',
  
  // LUJO / GALA
  'lujo': 'video_luxury_gold',
  'luxury': 'video_luxury_gold',
  'gala': 'video_luxury_gold',
  'vip': 'video_luxury_gold',
  'champagne': 'video_luxury_gold',
  'evento_premium': 'video_luxury_gold',
  
  // AESTHETIC / BELLEZA
  'belleza': 'video_aesthetic_min',
  'estetica': 'video_aesthetic_min',
  'skincare': 'video_aesthetic_min',
  'aesthetic': 'video_aesthetic_min',
  'minimal': 'video_aesthetic_min',
  
  // RETRO / VINTAGE
  'retro': 'video_retro_vintage',
  'vintage': 'video_retro_vintage',
  '90s': 'video_retro_vintage',
  'grunge': 'video_retro_vintage',
  'nostalgia': 'video_retro_vintage',
  
  // GAMING / ESPORTS
  'gaming': 'video_gamer_stream',
  'game': 'video_gamer_stream',
  'stream': 'video_gamer_stream',
  'esports': 'video_gamer_stream',
  'twitch': 'video_gamer_stream',
  'videojuego': 'video_gamer_stream',
  
  // ECOLÓGICO / NATURAL
  'eco': 'video_eco_organic',
  'organic': 'video_eco_organic',
  'natural': 'video_eco_organic',
  'verde': 'video_eco_organic',
  'frutas': 'video_eco_organic',
  'organico': 'video_eco_organic',
  
  // ROCK / INDIE
  'rock': 'video_indie_grunge',
  'musica': 'video_indie_grunge',
  'concierto': 'video_indie_grunge',
  'guitarra': 'video_indie_grunge',
  'indie': 'video_indie_grunge',
  
  // POLÍTICA
  'politica': 'video_political',
  'politico': 'video_political',
  'candidato': 'video_political',
  'eleccion': 'video_political',
  'gobierno': 'video_political',
  
  // INFANTIL
  'ninos': 'video_kids_fun',
  'kids': 'video_kids_fun',
  'infantil': 'video_kids_fun',
  'cumpleanos': 'video_kids_fun',
  'juguetes': 'video_kids_fun',
  'birthday': 'video_kids_fun',
  
  // ARTÍSTICO
  'arte': 'video_art_double_exp',
  'artist': 'video_art_double_exp',
  'teatro': 'video_art_double_exp',
  'surreal': 'video_art_double_exp',
  'creativo': 'video_art_double_exp',
  
  // MÉDICO
  'medico': 'video_medical_clean',
  'doctor': 'video_medical_clean',
  'clinica': 'video_medical_clean',
  'salud': 'video_medical_clean',
  'hospital': 'video_medical_clean',
  'dental': 'video_medical_clean',
  
  // TECH / AI
  'tech': 'video_tech_saas',
  'software': 'video_tech_saas',
  'app': 'video_tech_saas',
  'digital': 'video_tech_saas',
  'ai': 'video_tech_saas',
  'inteligencia': 'video_tech_saas',
  'data': 'video_tech_saas',
  
  // TIPOGRÁFICO
  'tipografia': 'video_typo_bold',
  'texto': 'video_typo_bold',
  'letras': 'video_typo_bold',
  'design': 'video_typo_bold',
  
  // INMOBILIARIA
  'inmobiliaria': 'video_realestate_night',
  'inmueble': 'video_realestate_night',
  'casa': 'video_realestate_night',
  'departamento': 'video_realestate_night',
  'propiedad': 'video_realestate_night',
  'luxury_home': 'video_realestate_night',
  
  // AUTOMOTRIZ
  'auto': 'video_auto_metallic',
  'carro': 'video_auto_metallic',
  'vehiculo': 'video_auto_metallic',
  'automotriz': 'video_auto_metallic',
  'taller': 'video_auto_metallic',
  
  // EDUCACIÓN
  'educacion': 'video_edu_sketch',
  'education': 'video_edu_sketch',
  'curso': 'video_edu_sketch',
  'clase': 'video_edu_sketch',
  'estudiar': 'video_edu_sketch',
  'universidad': 'video_edu_sketch',
  
  // WELLNESS / SPA
  'wellness': 'video_wellness_zen',
  'spa': 'video_wellness_zen',
  'yoga': 'video_wellness_zen',
  'pilates': 'video_wellness_zen',
  'masaje': 'video_wellness_zen',
  'relajacion': 'video_wellness_zen',
  'meditacion': 'video_wellness_zen',
  
  // PODCAST / MEDIA
  'podcast': 'video_podcast_mic',
  'radio': 'video_podcast_mic',
  'audio': 'video_podcast_mic',
  'entrevista': 'video_podcast_mic',
  'media': 'video_podcast_mic',
  'estudio': 'video_podcast_mic',
  
  // FESTIVIDADES
  'navidad': 'video_seasonal_holiday',
  'christmas': 'video_seasonal_holiday',
  'valentine': 'video_seasonal_holiday',
  'san_valentin': 'video_seasonal_holiday',
  'festividades': 'video_seasonal_holiday',
  'regalos': 'video_seasonal_holiday'
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
 * DETECTA EL ESTILO DE VIDEO DESDE URL O TEXTO
 * Lógica SIMPLE y DETERMINÍSTICA sin conflictos
 */
export const detectVideoStyleFromInput = (input: string): VideoIndustryDetection => {
  const inputLower = input.toLowerCase();
  
  // 🔥 ORDEN DE PRIORIDAD (primera coincidencia gana)
  
  // 1. WELLNESS & PILATES
  if (inputLower.includes('pilates')) {
    return { industry: 'pilates', styleKey: 'video_wellness_zen', confidence: 0.95, keywords: ['pilates'] };
  }
  if (inputLower.includes('yoga') || inputLower.includes('spa') || inputLower.includes('masaje') || inputLower.includes('wellness')) {
    return { industry: 'wellness_zen', styleKey: 'video_wellness_zen', confidence: 0.9, keywords: ['yoga', 'spa', 'masaje', 'wellness'] };
  }
  
  // 2. IGLESIA / ESPIRITUAL
  if (inputLower.includes('iglesia') || inputLower.includes('templo') || inputLower.includes('congregación') || inputLower.includes('religion') || inputLower.includes('espiritual') || inputLower.includes('fe')) {
    return { industry: 'worship_sky', styleKey: 'video_worship_sky', confidence: 0.9, keywords: ['iglesia', 'templo', 'congregación', 'religion', 'espiritual', 'fe'] };
  }
  
  // 3. GASTRONOMÍA
  if (inputLower.includes('restaurant') || inputLower.includes('restaurante') || inputLower.includes('comida') || inputLower.includes('food') || inputLower.includes('cafe')) {
    return { industry: 'gastronomy', styleKey: 'video_gastronomy', confidence: 0.9, keywords: ['restaurant', 'restaurante', 'comida', 'food', 'cafe'] };
  }
  if (inputLower.includes('pizza') || inputLower.includes('hamburguesa') || inputLower.includes('burger') || inputLower.includes('gourmet')) {
    return { industry: 'gastronomy', styleKey: 'video_gastronomy', confidence: 0.85, keywords: ['pizza', 'hamburguesa', 'burger', 'gourmet'] };
  }
  
  // 4. RETAIL / OFERTAS
  if (inputLower.includes('tienda') || inputLower.includes('shop') || inputLower.includes('store') || inputLower.includes('oferta') || inputLower.includes('sale') || inputLower.includes('descuento') || inputLower.includes('promoción') || inputLower.includes('liquidación')) {
    return { industry: 'retail_sale', styleKey: 'video_retail_sale', confidence: 0.9, keywords: ['tienda', 'shop', 'store', 'oferta', 'sale', 'descuento', 'promoción', 'liquidación'] };
  }
  
  // 5. DEPORTE / GYM
  if (inputLower.includes('gym') || inputLower.includes('gimnasio') || inputLower.includes('fitness') || inputLower.includes('deporte') || inputLower.includes('entrenamiento') || inputLower.includes('atleta')) {
    return { industry: 'sport_gritty', styleKey: 'video_sport_gritty', confidence: 0.9, keywords: ['gym', 'gimnasio', 'fitness', 'deporte', 'entrenamiento', 'atleta'] };
  }
  
  // 6. BELLEZA
  if (inputLower.includes('belleza') || inputLower.includes('estética') || inputLower.includes('estetica') || inputLower.includes('skincare') || inputLower.includes('aesthetic') || inputLower.includes('minimal')) {
    return { industry: 'aesthetic_min', styleKey: 'video_aesthetic_min', confidence: 0.9, keywords: ['belleza', 'estética', 'estetica', 'skincare', 'aesthetic', 'minimal'] };
  }
  
  // 7. MÉDICO
  if (inputLower.includes('médico') || inputLower.includes('medico') || inputLower.includes('doctor') || inputLower.includes('clínica') || inputLower.includes('clinica') || inputLower.includes('hospital') || inputLower.includes('dental')) {
    return { industry: 'medical_clean', styleKey: 'video_medical_clean', confidence: 0.9, keywords: ['médico', 'medico', 'doctor', 'clínica', 'clinica', 'hospital', 'dental'] };
  }
  
  // 8. TECNOLOGÍA
  if (inputLower.includes('tech') || inputLower.includes('software') || inputLower.includes('app') || inputLower.includes('digital') || inputLower.includes('ai') || inputLower.includes('data')) {
    return { industry: 'tech_saas', styleKey: 'video_tech_saas', confidence: 0.9, keywords: ['tech', 'software', 'app', 'digital', 'ai', 'data'] };
  }
  
  // 9. EDUCACIÓN
  if (inputLower.includes('educación') || inputLower.includes('education') || inputLower.includes('curso') || inputLower.includes('clase') || inputLower.includes('estudiar') || inputLower.includes('universidad')) {
    return { industry: 'edu_sketch', styleKey: 'video_edu_sketch', confidence: 0.9, keywords: ['educación', 'education', 'curso', 'clase', 'estudiar', 'universidad'] };
  }
  
  // 10. CORPORATIVO
  if (inputLower.includes('empresa') || inputLower.includes('company') || inputLower.includes('business') || inputLower.includes('oficina') || inputLower.includes('corporativo') || inputLower.includes('profesional')) {
    return { industry: 'corporate', styleKey: 'video_corporate', confidence: 0.9, keywords: ['empresa', 'company', 'business', 'oficina', 'corporativo', 'profesional'] };
  }
  
  // 11. VERANO / PLAYA
  if (inputLower.includes('verano') || inputLower.includes('summer') || inputLower.includes('playa') || inputLower.includes('vacaciones') || inputLower.includes('turismo') || inputLower.includes('hotel') || inputLower.includes('piscina') || inputLower.includes('pool')) {
    return { industry: 'summer_beach', styleKey: 'video_summer_beach', confidence: 0.9, keywords: ['verano', 'summer', 'playa', 'vacaciones', 'turismo', 'hotel', 'piscina', 'pool'] };
  }
  
  // 12. NOCHE / DISCOTECA
  if (inputLower.includes('discoteca') || inputLower.includes('club') || inputLower.includes('fiesta') || inputLower.includes('noche') || inputLower.includes('dj') || inputLower.includes('nightlife')) {
    return { industry: 'urban_night', styleKey: 'video_urban_night', confidence: 0.9, keywords: ['discoteca', 'club', 'fiesta', 'noche', 'dj', 'nightlife'] };
  }
  
  // 13. LUJO
  if (inputLower.includes('lujo') || inputLower.includes('luxury') || inputLower.includes('gala') || inputLower.includes('vip') || inputLower.includes('champagne') || inputLower.includes('premium')) {
    return { industry: 'luxury_gold', styleKey: 'video_luxury_gold', confidence: 0.9, keywords: ['lujo', 'luxury', 'gala', 'vip', 'champagne', 'premium'] };
  }
  
  // 14. ECOLÓGICO
  if (inputLower.includes('eco') || inputLower.includes('organic') || inputLower.includes('natural') || inputLower.includes('verde') || inputLower.includes('frutas') || inputLower.includes('orgánico')) {
    return { industry: 'eco_organic', styleKey: 'video_eco_organic', confidence: 0.9, keywords: ['eco', 'organic', 'natural', 'verde', 'frutas', 'orgánico'] };
  }
  
  // 15. GAMING
  if (inputLower.includes('gaming') || inputLower.includes('game') || inputLower.includes('esports') || inputLower.includes('stream') || inputLower.includes('twitch') || inputLower.includes('videojuego')) {
    return { industry: 'gamer_stream', styleKey: 'video_gamer_stream', confidence: 0.9, keywords: ['gaming', 'game', 'esports', 'stream', 'twitch', 'videojuego'] };
  }
  
  // 16. ROCK / MÚSICA
  if (inputLower.includes('rock') || inputLower.includes('música') || inputLower.includes('musica') || inputLower.includes('concierto') || inputLower.includes('guitarra') || inputLower.includes('indie') || inputLower.includes('band')) {
    return { industry: 'indie_grunge', styleKey: 'video_indie_grunge', confidence: 0.9, keywords: ['rock', 'música', 'musica', 'concierto', 'guitarra', 'indie', 'band'] };
  }
  
  // 17. POLÍTICA
  if (inputLower.includes('política') || inputLower.includes('politica') || inputLower.includes('candidato') || inputLower.includes('elección') || inputLower.includes('eleccion') || inputLower.includes('gobierno')) {
    return { industry: 'political_community', styleKey: 'video_political', confidence: 0.9, keywords: ['política', 'politica', 'candidato', 'elección', 'eleccion', 'gobierno'] };
  }
  
  // 18. INFANTIL
  if (inputLower.includes('niños') || inputLower.includes('ninos') || inputLower.includes('infantil') || inputLower.includes('cumpleaños') || inputLower.includes('juguetes') || inputLower.includes('kids') || inputLower.includes('birthday')) {
    return { industry: 'kids_fun', styleKey: 'video_kids_fun', confidence: 0.9, keywords: ['niños', 'ninos', 'infantil', 'cumpleaños', 'juguetes', 'kids', 'birthday'] };
  }
  
  // 19. ARTE
  if (inputLower.includes('arte') || inputLower.includes('artist') || inputLower.includes('teatro') || inputLower.includes('surreal') || inputLower.includes('creativo') || inputLower.includes('galeria')) {
    return { industry: 'art_double_exp', styleKey: 'video_art_double_exp', confidence: 0.9, keywords: ['arte', 'artist', 'teatro', 'surreal', 'creativo', 'galeria'] };
  }
  
  // 20. INMOBILIARIA
  if (inputLower.includes('inmobiliaria') || inputLower.includes('inmueble') || inputLower.includes('casa') || inputLower.includes('departamento') || inputLower.includes('propiedad') || inputLower.includes('luxury_home')) {
    return { industry: 'realestate_night', styleKey: 'video_realestate_night', confidence: 0.9, keywords: ['inmobiliaria', 'inmueble', 'casa', 'departamento', 'propiedad', 'luxury_home'] };
  }
  
  // 21. AUTOMOTRIZ
  if (inputLower.includes('auto') || inputLower.includes('carro') || inputLower.includes('vehiculo') || inputLower.includes('automotriz') || inputLower.includes('taller')) {
    return { industry: 'auto_metallic', styleKey: 'video_auto_metallic', confidence: 0.9, keywords: ['auto', 'carro', 'vehiculo', 'automotriz', 'taller'] };
  }
  
  // 22. RETRO / VINTAGE
  if (inputLower.includes('retro') || inputLower.includes('vintage') || inputLower.includes('90s') || inputLower.includes('grunge') || inputLower.includes('nostalgia')) {
    return { industry: 'retro_vintage', styleKey: 'video_retro_vintage', confidence: 0.9, keywords: ['retro', 'vintage', '90s', 'grunge', 'nostalgia'] };
  }
  
  // 23. PODCAST / MEDIA
  if (inputLower.includes('podcast') || inputLower.includes('radio') || inputLower.includes('audio') || inputLower.includes('entrevista') || inputLower.includes('media') || inputLower.includes('estudio')) {
    return { industry: 'podcast_mic', styleKey: 'video_podcast_mic', confidence: 0.9, keywords: ['podcast', 'radio', 'audio', 'entrevista', 'media', 'estudio'] };
  }
  
  // 24. NAVIDAD / FESTIVIDADES
  if (inputLower.includes('navidad') || inputLower.includes('christmas') || inputLower.includes('valentín') || inputLower.includes('valentin') || inputLower.includes('festividades') || inputLower.includes('regalos') || inputLower.includes('año nuevo')) {
    return { industry: 'seasonal_holiday', styleKey: 'video_seasonal_holiday', confidence: 0.9, keywords: ['navidad', 'christmas', 'valentín', 'valentin', 'festividades', 'regalos', 'año nuevo'] };
  }
  
  // 25. TIPOGRAFÍA
  if (inputLower.includes('tipografia') || inputLower.includes('texto') || inputLower.includes('letras') || inputLower.includes('design') || inputLower.includes('gráfico')) {
    return { industry: 'typo_bold', styleKey: 'video_typo_bold', confidence: 0.85, keywords: ['tipografia', 'texto', 'letras', 'design', 'gráfico'] };
  }
  
  // 🔒 FALLBACK FINAL: video_corporate
  return {
    industry: 'general',
    styleKey: 'video_corporate',
    confidence: 0.3,
    keywords: []
  };
};

/**
 * MAPEO DE ESTILO IMAGEN A ESTILO VIDEO CORRESPONDIENTE
 */
export const imageToVideoStyle: Record<FlyerStyleKey, FlyerStyleKeyVideo> = {
  brand_identity: 'video_corporate',
  retail_sale: 'video_retail_sale',
  auto_metallic: 'video_auto_metallic',
  gastronomy: 'video_gastronomy',
  corporate: 'video_corporate',
  medical_clean: 'video_medical_clean',
  tech_saas: 'video_tech_saas',
  edu_sketch: 'video_edu_sketch',
  political_community: 'video_political',
  aesthetic_min: 'video_aesthetic_min',
  wellness_zen: 'video_wellness_zen',
  pilates: 'video_wellness_zen',
  summer_beach: 'video_summer_beach',
  eco_organic: 'video_eco_organic',
  sport_gritty: 'video_sport_gritty',
  urban_night: 'video_urban_night',
  luxury_gold: 'video_luxury_gold',
  realestate_night: 'video_realestate_night',
  gamer_stream: 'video_gamer_stream',
  indie_grunge: 'video_indie_grunge',
  kids_fun: 'video_kids_fun',
  worship_sky: 'video_worship_sky',
  seasonal_holiday: 'video_seasonal_holiday',
  art_double_exp: 'video_art_double_exp',
  retro_vintage: 'video_retro_vintage',
  podcast_mic: 'video_podcast_mic',
  typo_bold: 'video_typo_bold',
  market_handwritten: 'video_retail_sale' // Mapeo a retail para video
};

/**
 * OBTIENE EL ESTILO DE VIDEO CORRESPONDIENTE A UN ESTILO DE IMAGEN
 */
export const getVideoStyleFromImageStyle = (imageStyleKey: FlyerStyleKey): FlyerStyleKeyVideo => {
  return imageToVideoStyle[imageStyleKey] || 'video_corporate';
};
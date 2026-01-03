import { CONSISTENCY_CONFLICTS, CONFLICT_DETECTION_RULES, INDUSTRY_SUGGESTIONS } from '../constants';

/**
 * Servicio de Detección de Consistencia
 * Detecta conflictos entre la descripción del usuario y el rubro seleccionado
 * Genera advertencias "Chileno Premium" para evitar errores semánticos
 */

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictCode?: string;
  conflictData?: typeof CONSISTENCY_CONFLICTS[string];
  suggestedStyles?: string[];
  sanitizedDescription?: string;
  powerSuggestions?: string[];
}

export interface ConflictCheckInput {
  description: string;
  selectedStyle: string;
  styleCategory?: string;
}

export interface SanitizeResult {
  sanitizedDescription: string;
  removedWords: string[];
  addedSuggestions: string[];
}

/**
 * Detecta si hay un conflicto semántico entre la descripción y el estilo
 */
export function checkConsistency(input: ConflictCheckInput): ConflictCheckResult {
  const { description, selectedStyle } = input;
  
  // Normalizar descripción a minúsculas para búsqueda
  const normalizedDescription = description.toLowerCase();
  
  // Buscar conflictos
  for (const rule of CONFLICT_DETECTION_RULES) {
    // Verificar si el estilo seleccionado está en los estilos objetivo del rule
    const styleMatches = rule.styleKeys.some(
      styleKey => styleKey === selectedStyle || 
                  selectedStyle.toLowerCase().includes(styleKey.toLowerCase())
    );
    
    if (styleMatches) {
      // Verificar si la descripción contiene palabras clave problemáticas
      const keywordFound = rule.keywords.some(keyword => 
        normalizedDescription.includes(keyword.toLowerCase())
      );
      
      if (keywordFound) {
        const conflictData = CONSISTENCY_CONFLICTS[rule.conflictCode];
        
        if (conflictData) {
          return {
            hasConflict: true,
            conflictCode: rule.conflictCode,
            conflictData,
            suggestedStyles: getSuggestedStyles(selectedStyle, rule.conflictCode)
          };
        }
      }
    }
  }
  
  return { hasConflict: false };
}

/**
 * Obtiene estilos sugeridos alternativos
 */
function getSuggestedStyles(currentStyle: string, conflictCode: string): string[] {
  const suggestions: Record<string, string[]> = {
    'PILATES_SPA': ['sport_gritty', 'wellness_zen'],
    'YOGA_INTENSE': ['yoga_studio', 'wellness_zen'],
    'KINE_GYM': ['physiotherapy', 'medical_clean'],
    'DENTAL_HOSPITAL': ['dental_clinic', 'medical_clean'],
    'VET_STYLING': ['veterinary_clinic'],
    'NAIL_HAIR': ['nail_studio'],
    'TALLER_LUXURY': ['mechanic_workshop', 'auto_metallic'],
    'FERRE_BOUTIQUE': ['hardware_store'],
    'CONSTR_DECO': ['construction_site'],
    'LOGISTICA_RETAIL': ['logistics_delivery'],
    'DETA_WASH': ['car_detailing'],
    'TECH_REPAIR_MESS': ['tech_repair'],
    'PAN_GOURMET': ['bakery_bread', 'market_handwritten'],
    'SUSHI_FASTFOOD': ['sushi_nikkei'],
    'PIZZA_ITALIAN': ['pizzeria'],
    'PASTEL_BAJON': ['pastry_shop'],
    'FERIA_SUPER': ['flower_shop', 'market_handwritten'],
    'BOTI_DISCO': ['liquor_store'],
    'BARBER_SPA': ['barber_shop'],
    'FURGON_RACING': ['transport_school'],
    'TRAVEL_CLINIC': ['travel_agency'],
    'SEGURIDAD_WAR': ['security_systems'],
    'TATTOO_CLINIC': ['tattoo_studio']
  };
  
  return suggestions[conflictCode] || [];
}

/**
 * Limpia la descripción eliminando palabras conflictivas
 * e inyecta sugerencias de poder del INDUSTRY_SUGGESTIONS
 */
export function sanitizeAndSuggest(
  description: string,
  selectedStyle: string,
  conflictCode?: string
): SanitizeResult {
  const normalizedStyle = selectedStyle.toLowerCase();
  const removedWords: string[] = [];
  let sanitizedDescription = description;
  
  // Palabras problemáticas a eliminar
  const problematicWords: Record<string, string[]> = {
    'PILATES_SPA': ['vela', 'masaje', 'spa', 'aromaterapia', 'relajante', 'zen', 'esencias', 'sahumerios'],
    'YOGA_INTENSE': ['crossfit', 'pesas', 'levantamiento', 'intenso', 'cardio', 'sudor', 'entrenamiento pesado'],
    'KINE_GYM': ['gimnasio', 'maquina', 'pesa', 'entrenamiento', 'musculo', 'bodybuilding'],
    'DENTAL_HOSPITAL': ['quirófano', 'quirurgico', 'sangre', 'operatorio', 'hospital', 'cirugia'],
    'VET_STYLING': ['corte de pelo', 'peluqueria', 'peinado', 'coloracion', 'tratamiento capilar'],
    'NAIL_HAIR': ['corte de pelo', 'peluqueria', 'barberia', 'afeitado'],
    'TALLER_LUXURY': ['lujo', 'elegante', 'vitrina', 'cristal', 'alfombra', 'oficina', 'ejecutivo'],
    'FERRE_BOUTIQUE': ['boutique', 'tienda', 'vitrine', 'cristal', 'lujoso', 'exhibicion'],
    'CONSTR_DECO': ['mueble', 'cortina', 'decoracion', 'interior', 'diseño'],
    'LOGISTICA_RETAIL': ['tienda', 'mall', 'retail', 'cliente', 'compra', 'carrito'],
    'DETA_WASH': ['lavado', 'manguera', 'calle', 'exterior', 'barrio'],
    'TECH_REPAIR_MESS': ['desorden', 'cable', 'piezas', 'suelto', 'roto'],
    'PAN_GOURMET': ['plato gourmet', 'restaurant', 'fino', 'elegante', 'cena'],
    'SUSHI_FASTFOOD': ['fritura', 'completos', 'churrasco', 'carne', 'asado'],
    'PIZZA_ITALIAN': ['mantel', 'vela', 'cena', 'elegante', 'formal'],
    'PASTEL_BAJON': ['bajón', 'rapido', 'economico', 'carrito', 'calle'],
    'FERIA_SUPER': ['supermercado', 'empaquetado', 'industrial', 'congelado'],
    'BOTI_DISCO': ['disco', 'fiesta', 'baile', 'vip', 'noche'],
    'BARBER_SPA': ['vela', 'spa', 'relajante', 'masaje', 'aroma'],
    'FURGON_RACING': ['velocidad', 'carrera', 'rapido', 'deportivo', 'ruido'],
    'TRAVEL_CLINIC': ['frio', 'administrativo', 'oficina', 'papeleo'],
    'SEGURIDAD_WAR': ['arma', 'pistola', 'bala', 'guerra', 'ataque', 'combate'],
    'TATTOO_CLINIC': ['clinico', 'esteril', 'blanco', 'medico', 'sangre']
  };
  
  // Eliminar palabras problemáticas
  const wordsToRemove = conflictCode ? problematicWords[conflictCode] || [] : [];
  
  for (const word of wordsToRemove) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(sanitizedDescription)) {
      removedWords.push(word);
      sanitizedDescription = sanitizedDescription.replace(regex, '').replace(/\s+/g, ' ').trim();
    }
  }
  
  // Obtener sugerencias de poder del INDUSTRY_SUGGESTIONS
  const addedSuggestions: string[] = [];
  
  // Mapear estilos a keys de INDUSTRY_SUGGESTIONS
  const styleToSuggestionKey: Record<string, string> = {
    'sushi_nikkei': '41_sushi_nikkei',
    'pizzeria': '42_pizzeria',
    'ice_cream': '43_heladeria',
    'pastry_shop': '60_pasteleria',
    'nail_studio': '44_nail_studio',
    'tattoo_studio': '45_tattoo_studio',
    'yoga_studio': '46_yoga_studio',
    'car_detailing': '47_car_detailing',
    'optical': '48_optica',
    'bookstore': '49_libreria',
    'flower_shop': '50_floreria',
    'liquor_store': '51_botilleria',
    'transport_school': '52_furgon_escolar',
    'market_handwritten': '54_feria_fruteria',
    'travel_agency': '56_agencia_viajes',
    'laundry': '57_lavanderia',
    'shoe_store': '58_zapateria',
    'tech_repair': '59_tech_repair',
    'hardware_store': '53_ferreteria',
    'cleaning_service': '55_limpieza'
  };
  
  const suggestionKey = styleToSuggestionKey[normalizedStyle] ||
                        styleToSuggestionKey[selectedStyle.toLowerCase()];
  
  if (suggestionKey && INDUSTRY_SUGGESTIONS[suggestionKey]) {
    addedSuggestions.push(...INDUSTRY_SUGGESTIONS[suggestionKey].slice(0, 3));
  }
  
  return {
    sanitizedDescription: sanitizedDescription || description, // Si quedó vacía, usar original
    removedWords,
    addedSuggestions
  };
}

/**
 * Genera un resumen de conflictos para debugging
 */
export function getConflictSummary(result: ConflictCheckResult): string {
  if (!result.hasConflict || !result.conflictData) {
    return 'Sin conflictos detectados';
  }
  
  return `[${result.conflictCode}] ${result.conflictData.title}: ${result.conflictData.message.substring(0, 100)}...`;
}

/**
 * Valida si un estilo es apropiado para una categoría
 */
export function validateStyleForCategory(styleKey: string, category: string): boolean {
  const categoryStyles: Record<string, string[]> = {
    'SALUD': ['medical_clean', 'physiotherapy', 'dental_clinic', 'veterinary_clinic', 'optical', 'nail_studio'],
    'LIFESTYLE': ['wellness_zen', 'pilates', 'yoga_studio', 'aesthetic_min', 'sport_gritty'],
    'SERVICIOS': ['mechanic_workshop', 'tire_service', 'construction_site', 'logistics_delivery',
                  'barber_shop', 'hvac_plumbing', 'gardening_landscaping', 'security_systems',
                  'car_detailing', 'tech_repair', 'cleaning_service', 'laundry', 'transport_school'],
    'COMERCIO': ['retail_sale', 'gastronomy', 'bakery_bread', 'liquor_store', 'fast_food_street',
                 'sushi_nikkei', 'pizzeria', 'ice_cream', 'bookstore', 'flower_shop',
                 'hardware_store', 'travel_agency', 'shoe_store', 'pastry_shop', 'market_handwritten'],
    'CORPORATIVO': ['corporate', 'tech_saas', 'edu_sketch', 'political_community', 'law_accounting'],
    'NOCHE': ['urban_night', 'luxury_gold', 'realestate_night', 'gamer_stream', 'indie_grunge'],
    'EVENTOS': ['kids_fun', 'worship_sky', 'seasonal_holiday', 'art_double_exp', 'retro_vintage', 'podcast_mic']
  };
  
  const allowedStyles = categoryStyles[category] || [];
  return allowedStyles.includes(styleKey);
}

export default {
  checkConsistency,
  getConflictSummary,
  validateStyleForCategory,
  sanitizeAndSuggest
};
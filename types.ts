
export type FlyerStyleKey =
  | 'brand_identity' // NEW: For styles extracted from Instagram/URL
  | 'retail_sale'
  | 'summer_beach'
  | 'worship_sky'
  | 'corporate'
  | 'urban_night'
  | 'gastronomy'
  | 'sport_gritty'
  | 'luxury_gold'
  | 'aesthetic_min'
  | 'retro_vintage'
  | 'gamer_stream'
  | 'eco_organic'
  | 'indie_grunge'
  | 'political_community'
  | 'kids_fun'
  | 'art_double_exp'
  | 'medical_clean'
  | 'tech_saas'
  | 'typo_bold'
  | 'realestate_night'
  | 'auto_metallic'
  | 'edu_sketch'
  | 'wellness_zen'
  | 'pilates'
  | 'podcast_mic'
  | 'seasonal_holiday'
  | 'market_handwritten' // NEW: Feria Libre / Mercado Chileno
  // --- NUEVOS ESTILOS 26-40 (2026) ---
  | 'mechanic_workshop'        // 26. Taller Mecánico
  | 'tire_service'             // 27. Vulcanización
  | 'construction_site'        // 28. Construcción
  | 'logistics_delivery'       // 29. Logística
  | 'bakery_bread'             // 30. Panadería
  | 'liquor_store'             // 31. Botillería
  | 'fast_food_street'         // 32. Comida Rápida
  | 'barber_shop'              // 33. Peluquería/Barbería
  | 'veterinary_clinic'        // 34. Veterinaria
  | 'hvac_plumbing'            // 35. Gasfitería/Climatización
  | 'dental_clinic'            // 36. Centro Dental
  | 'physiotherapy'            // 37. Kinesiología
  | 'law_accounting'           // 38. Estudio Jurídico
  | 'gardening_landscaping'    // 39. Jardinería
  | 'security_systems'         // 40. Seguridad
  // --- NUEVOS ESTILOS 41-60 (2026) ---
  | 'sushi_nikkei'             // 41. Sushi & Nikkei
  | 'pizzeria'                 // 42. Pizzería
  | 'ice_cream'                // 43. Heladería
  | 'nail_studio'              // 44. Nail Studio
  | 'tattoo_studio'            // 45. Tattoo Studio
  | 'yoga_studio'              // 46. Yoga Studio
  | 'car_detailing'            // 47. Car Detailing
  | 'optical'                  // 48. Óptica
  | 'bookstore'                // 49. Librería
  | 'flower_shop'              // 50. Florería
  | 'transport_school'         // 52. Transporte Escolar
  | 'hardware_store'           // 53. Ferretería
  | 'cleaning_service'         // 55. Servicios de Limpieza
  | 'travel_agency'            // 56. Agencia de Viajes
  | 'laundry'                  // 57. Lavandería
  | 'shoe_store'               // 58. Zapatería
  | 'tech_repair'              // 59. Servicio Técnico
  | 'pastry_shop';             // 60. Pastelería

// ============================================
// 🎬 SISTEMA MAESTRO DE VIDEO (60 estilos)
// Expansión v2.0: Mapeo 1:1 con rubros de Dirección de Arte
// Estructura: [DESCRIPCIÓN VISUAL] + [MOVIMIENTO DE CÁMARA] + [ACCIÓN] + High resolution, cinematic 4k.
// ============================================
export type FlyerStyleKeyVideo =
  // --- BLOQUE 1: RETAIL Y ESTÉTICA (IDs 1-20) ---
  | 'video_retail_gen'         // 1. Retail General
  | 'video_fashion_women'      // 2. Moda Mujer
  | 'video_fashion_men'        // 3. Moda Hombre
  | 'video_footwear'           // 4. Calzado
  | 'video_jewelry'            // 5. Joyas
  | 'video_optics'             // 6. Óptica
  | 'video_beauty'             // 7. Belleza/Cosmética
  | 'video_perfume'            // 8. Perfumería
  | 'video_bags'               // 9. Bolsos/Carteras
  | 'video_tech_acc'           // 10. Accesorios Tech
  | 'video_smartphone'         // 11. Smartphones
  | 'video_computing'          // 12. Computación
  | 'video_gaming'             // 13. Gaming
  | 'video_photography'        // 14. Fotografía
  | 'video_audio'              // 15. Audio/Sonido
  | 'video_watches'            // 16. Relojes
  | 'video_decor'              // 17. Decoración
  | 'video_furniture'          // 18. Muebles
  | 'video_lighting'           // 19. Iluminación
  | 'video_appliances'         // 20. Electrodomésticos
  // --- BLOQUE 2: SALUD Y DEPORTE (IDs 21-30) ---
  | 'video_gym'                // 21. Gimnasio/Deporte
  | 'video_gastronomy'         // 22. Gastronomía
  | 'video_wellness_zen'       // 23. Spa/Wellness
  | 'video_medical'            // 24. Médico/Clínico
  | 'video_corporate'          // 25. Corporativo
  | 'video_real_estate'        // 26. Inmobiliaria
  | 'video_automotive'         // 27. Automotriz
  | 'video_pets'               // 28. Mascotas
  | 'video_travel'             // 29. Viajes
  | 'video_construction'       // 30. Construcción
  // --- BLOQUE 3: SERVICIOS ESPECIALIZADOS (IDs 31-40) ---
  | 'video_mechanic'           // 31. Taller Mecánico
  | 'video_tire_service'       // 32. Vulcanización
  | 'video_barber'             // 33. Barbería
  | 'video_veterinary'         // 34. Veterinaria
  | 'video_yoga'               // 35. Yoga
  | 'video_pilates'            // 36. Pilates
  | 'video_physiotherapy'      // 37. Kinesiología
  | 'video_legal'              // 38. Estudio Jurídico
  | 'video_gardening'          // 39. Jardinería
  | 'video_security'           // 40. Seguridad
  // --- BLOQUE 4: GASTRONOMÍA ESPECIALIZADA (IDs 41-50) ---
  | 'video_sushi'              // 41. Sushi/Nikkei
  | 'video_fast_food'          // 42. Comida Rápida
  | 'video_ice_cream'          // 43. Heladería
  | 'video_nail_studio'        // 44. Nail Studio
  | 'video_tattoo'             // 45. Tattoo Studio
  | 'video_pizza'              // 46. Pizzería
  | 'video_veggie'             // 47. Veggie/Vegetariano
  | 'video_coffee'             // 48. Café
  | 'video_bakery'             // 49. Panadería
  | 'video_pastry'             // 50. Pastelería
  // --- BLOQUE 5: COMERCIO ESPECIALIZADO (IDs 51-60) ---
  | 'video_butcher'            // 51. Carnicería
  | 'video_hardware'           // 52. Ferretería
  | 'video_bookstore'          // 53. Librería
  | 'video_florist'            // 54. Florería
  | 'video_cleaning'           // 55. Limpieza
  | 'video_laundry'            // 56. Lavandería
  | 'video_shoe_store'         // 57. Zapatería
  | 'video_optician'           // 58. Óptica
  | 'video_tech_repair'        // 59. Servicio Técnico
  | 'video_liquor_store';      // 60. Botillería

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '1.91:1' | '4:5' | '1080x1080' | '1080x1920' | '1080x1350' | '1:1.41'; // 1:1.41 = Formato A3/A4 para posters

export type MediaType = 'image' | 'video' | 'product_study' | 'story_art';

// ============================================
// TIPOS PARA POSTER PRO
// ============================================
export type PosterStyle = 'promotional' | 'informative' | 'branding';

export interface PosterStyleConfig {
  label: string;
  description: string;
  context: string;
  visualLogic: string;
  hierarchy: string;
  videoMotion: string;
  example: string;
  previewUrl: string;
}

export type ImageQuality = 'draft' | 'hd';

// New Shared Types for Text Overlay
export type OverlayStyle = 'modern' | 'sale' | 'neon' | 'elegant';
export type OverlayPosition = 'top' | 'middle' | 'bottom';

export type StyleCategory = 'TODOS' | 'VENTAS' | 'CORPORATIVO' | 'LIFESTYLE' | 'NOCHE' | 'EVENTOS' | 'SERVICIOS' | 'COMERCIO' | 'SALUD' | 'PROFESIONAL';

export interface FlyerStyleConfig {
  label: string;
  category: StyleCategory; // NEW
  tags: string[]; // NEW
  english_prompt: string;
  visualDescription: string;
  video_motion: string;
  example: string;
  previewUrl: string;
}

// Configuración específica para estilos de VIDEO
export interface VideoStyleConfig {
  label: string;
  category: string;
  tags: string[];
  prompt: string;
  motionStyle: string;
  duration: string;
  aspectRatio: AspectRatio[];
  example: string;
  previewUrl: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface GenerationStatus {
  isLoading: boolean;
  step: 'idle' | 'translating' | 'rendering' | 'complete' | 'error';
  message: string;
}

// ============================================
// CONFIGURACIÓN DE PLANES DE GOOGLE VEO
// ============================================
export interface VideoPlanConfig {
  draft: {
    model: string;
    resolution: string;
    speed: string;
    costMultiplier: number;
    description: string;
    quality: string;
  };
  production: {
    model: string;
    resolution: string;
    speed: string;
    costMultiplier: number;
    description: string;
    quality: string;
  };
}

// ============================================
// TIPOS PARA DIRECCIÓN DE ARTE PROFESIONAL
// ============================================

export type ContentType =
  | 'flyer'           // Flyer tradicional (1:1 o 4:5)
  | 'story_art'       // STORY ART (9:16) - Nueva opción con Dirección de Arte
  | 'reel_cover'      // Cover para Reels/Shorts
  | 'poster';         // Poster/A3

export interface ArtDirectionState {
  /** Tipo de contenido seleccionado */
  contentType: ContentType;
  /** ID del rubro seleccionado para dirección de arte */
  artDirectionId: number | null;
  /** Si la dirección de arte fue aplicada automáticamente */
  artDirectionApplied: boolean;
  /** Mensaje de feedback para el usuario */
  feedbackMessage: string | null;
}

export interface ArtDirectionResult {
  /** Prompt completo de dirección de arte */
  prompt: string;
  /** Configuración del rubro */
  config: {
    id: number;
    rubro: string;
    style: string;
    aspectRatio: string;
  };
  /** Si fue exitoso */
  success: boolean;
  /** Error si falló */
  error?: string;
}

// ============================================
// INTERFAZ PARA DIRECCIÓN DE ARTE POR RUBRO
// ============================================

export interface ArtDirectionPrompt {
  /** Nombre del rubro */
  rubro: string;
  /** Prompt principal de dirección de arte */
  artDirection: string;
  /** Configuración de composición para Social Media 9:16 */
  socialMediaComposition: string;
  /** Negative prompt para evitar resultados no deseados */
  negativePrompt: string;
}

// ============================================
// INTERFAZ PARA CATÁLOGO COMPLETO DE DIRECCIÓN DE ARTE
// ============================================

export interface ArtDirectionCatalog {
  /** Versión de la fase del catálogo */
  phase: number;
  /** Total de rubros en el catálogo */
  totalPrompts: number;
  /** Rubros disponibles */
  rubros: string[];
  /** Prompts por ID */
  prompts: Record<number, ArtDirectionPrompt>;
}

// ============================================
// 🎚️ SISTEMA DE REGULADOR DE REALIDAD (Reality Slider)
// ============================================

export type RealityLevel = 1.0 | 1.5 | 2.0 | 2.5 | 3.0 | 3.5 | 4.0 | 4.5 | 5.0;

export interface RealityPromptConfig {
  /** Nivel de estrellas */
  stars: RealityLevel;
  /** Etiqueta descriptiva */
  label: string;
  /** Descripción corta */
  description: string;
  /** Perfil técnico de marketing */
  technicalProfile: string;
  /** Prompt de iluminación */
  lighting: string;
  /** Prompt de atmósfera */
  atmosphere: string;
  /** Prompt de cámara */
  camera: string;
  /** Prompt de sujetos humanos */
  human: string;
  /** Prompt negativo (lo que evitar) */
  negative: string;
  /** Modificadores de comportamiento por categoría */
  categoryModifiers?: {
    chromaticAberration?: boolean;
    digitalNoise?: boolean;
    lowLightArtifacts?: boolean;
    compressionArtifacts?: boolean;
    noBokeh?: boolean;
    overheadLED?: boolean;
    realisticClutter?: boolean;
    noLuxuryElements?: boolean;
    softNaturalLighting?: boolean;
    depthOfField?: boolean;
    cleanEnvironment?: boolean;
    professionalLook?: boolean;
    noDust?: boolean;
    noScuffMarks?: boolean;
    noSweat?: boolean;
    perfectSkin?: boolean;
    luxuryElements?: boolean;
  };
  /** Icono emoji */
  icon: string;
}

export interface RealityVariation {
  /** ID único de la variación */
  id: string;
  /** ID del borrador/scena original */
  parent_scene_id: string;
  /** Seed usado para consistencia visual */
  seed: number;
  /** Nivel de estrellas */
  stars: RealityLevel;
  /** URL de la imagen generada */
  image_url: string;
  /** Prompt usado para generar */
  prompt_used: string;
  /** Timestamp de creación */
  created_at: Date;
  /** Si ya está en caché local */
  cached: boolean;
}

export interface RealitySliderState {
  /** Nivel actual de estrellas */
  currentStars: RealityLevel;
  /** Seed actual (fijado para consistencia) */
  currentSeed: number;
  /** ID del scene padre */
  sceneId: string;
  /** Variaciones cacheadas */
  variations: RealityVariation[];
  /** Si está cargando una variación */
  isLoadingVariation: boolean;
  /** Variación actualmente cargándose */
  loadingVariationId: string | null;
}

export interface RealitySliderCallbacks {
  /** Llamado cuando cambia el nivel de estrellas */
  onStarsChange: (stars: RealityLevel) => void;
  /** Llamado cuando se necesita generar una nueva variación */
  onGenerateVariation: (stars: RealityLevel) => Promise<string>;
  /** Llamado cuando se selecciona una variación del caché */
  onSelectCachedVariation: (variation: RealityVariation) => void;
}

// ============================================
// 🎨 COMPARADOR DE REALIDAD (Reality Comparator)
// ============================================

export interface ComparisonItem {
  /** Variación a comparar */
  variation: RealityVariation;
  /** Label personalizado (ej: "Auténtico", "Editorial") */
  label: string;
  /** Si es la versión seleccionada */
  isSelected: boolean;
}

export interface RealityComparisonState {
  /** Items a comparar */
  items: ComparisonItem[];
  /** Modo de comparación: 'side-by-side' | 'slider' */
  mode: 'side-by-side' | 'slider';
  /** Si el comparador está activo */
  isActive: boolean;
}
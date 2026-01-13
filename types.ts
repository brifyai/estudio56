
// ============================================
// 🎫 SISTEMA DE PLANES Y CRÉDITOS
// ============================================

export type PlanId = 'GRATIS' | 'ESTOY PARTIENDO' | 'JEFE PYME' | 'AGENCIA';

export type RechargeId = 'INDIVIDUAL' | 'SALVATORE' | 'IMPULSO';

// ============================================
// 🎨 MODOS DE CREACIÓN
// ============================================

export type CreationMode = 'design' | 'canva' | 'free' | 'brand';

export interface CreationModeConfig {
  id: CreationMode;
  name: string;
  description: string;
  icon: string;
  features: string[];
  showPrompt: boolean;
  showStyleSelector: boolean;
  showCanvas: boolean;
  allowManualEditing: boolean;
}

export const CREATION_MODES: Record<CreationMode, CreationModeConfig> = {
  design: {
    id: 'design',
    name: 'Diseño',
    description: 'IA genera el diseño completo',
    icon: '🎨',
    features: ['Prompt de texto', 'Estilos predefinidos', 'IA automática'],
    showPrompt: true,
    showStyleSelector: true,
    showCanvas: false,
    allowManualEditing: false
  },
  canva: {
    id: 'canva',
    name: 'Canva',
    description: 'Editor visual drag & drop',
    icon: '✏️',
    features: ['Editor drag & drop', 'Plantillas', 'Elementos visuales'],
    showPrompt: false,
    showStyleSelector: false,
    showCanvas: true,
    allowManualEditing: true
  },
  free: {
    id: 'free',
    name: 'Libre',
    description: 'Prompt libre sin restricciones',
    icon: '🚀',
    features: ['Prompt sin límites', 'Sin estilos', 'Control total'],
    showPrompt: true,
    showStyleSelector: false,
    showCanvas: false,
    allowManualEditing: false
  },
  brand: {
    id: 'brand',
    name: 'Marca',
    description: 'Manual de identidad de marca',
    icon: '🏷️',
    features: ['Logo generator', 'Paleta de colores', 'Manual PDF'],
    showPrompt: false,
    showStyleSelector: false,
    showCanvas: false,
    allowManualEditing: true
  }
};

// ============================================
// 🎨 CANVAS EDITOR TYPES
// ============================================

export type CanvasElementType = 'text' | 'shape' | 'image' | 'icon';
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line' | 'star';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type FontStyle = 'normal' | 'italic';

export interface BaseCanvasElement {
  id: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  zIndex: number;
  name?: string;
}

export interface TextCanvasElement extends BaseCanvasElement {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: FontWeight;
  fontStyle: FontStyle;
  textAlign: TextAlign;
  color: string;
  backgroundColor?: string;
  lineHeight: number;
  letterSpacing?: number;
  textDecoration?: 'none' | 'underline' | 'line-through';
}

export interface ShapeCanvasElement extends BaseCanvasElement {
  type: 'shape';
  shapeType: ShapeType;
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius?: number;
}

export interface ImageCanvasElement extends BaseCanvasElement {
  type: 'image';
  src: string;
  filters?: string[];
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
}

export interface IconCanvasElement extends BaseCanvasElement {
  type: 'icon';
  iconName: string;
  color: string;
}

export type CanvasElement = TextCanvasElement | ShapeCanvasElement | ImageCanvasElement | IconCanvasElement;

export interface CanvasDesign {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  backgroundImage?: string;
  elements: CanvasElement[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CanvasTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  design: Omit<CanvasDesign, 'id' | 'createdAt' | 'updatedAt'>;
}

export interface CanvasHistory {
  past: CanvasDesign[];
  present: CanvasDesign;
  future: CanvasDesign[];
}

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: number; // Precio mensual con IVA
  creditsHD: number; // Créditos para fotos/videos HD
  drafts: number; // Borradores de imagen incluidos
  features: string[];
  popular?: boolean;
  color: string;
}

export interface RechargeConfig {
  id: RechargeId;
  name: string;
  price: number; // Precio con IVA incluido
  creditsHD: number;
  drafts: number;
  description: string;
  color: string;
}

// Constantes de equivalencias
export const CREDIT_EQUIVALENCES = {
  PHOTO_HD: 1, // 1 foto HD = 1 crédito
  VIDEO_HD: 10, // 1 video HD = 10 créditos
};

export const PLAN_CONFIG: PlanConfig[] = [
  {
    id: 'GRATIS',
    name: 'Gratis',
    price: 0,
    creditsHD: 0,
    drafts: 3,
    features: [
      '3 Borradores/día (Imagen)',
      'Solo Visualización (Sin descarga)',
      'Sin Créditos HD',
      'Sin Generación de Video'
    ],
    color: 'gray'
  },
  {
    id: 'ESTOY PARTIENDO',
    name: 'Estoy Partiendo',
    price: 14990,
    creditsHD: 40,
    drafts: 200,
    features: [
      '40 Créditos HD (40 fotos o 4 videos)',
      '200 Borradores de Imagen',
      'Videos HD (Requiere 10 créditos c/u)',
      'Sin Carga de Productos'
    ],
    popular: true,
    color: 'blue'
  },
  {
    id: 'JEFE PYME',
    name: 'Jefe PYME',
    price: 44990,
    creditsHD: 150,
    drafts: 750,
    features: [
      '150 Créditos HD (150 fotos o 15 videos)',
      '750 Borradores de Imagen',
      'Videos HD (Costo: 10 créditos)',
      'Carga de Productos (PNG)'
    ],
    color: 'purple'
  },
  {
    id: 'AGENCIA',
    name: 'Agencia',
    price: 139990,
    creditsHD: 500,
    drafts: 2500,
    features: [
      '500 Créditos HD (500 fotos o 50 videos)',
      '2.500 Borradores de Imagen',
      'Licencia Comercial',
      'Soporte Humano'
    ],
    color: 'yellow'
  }
];

export const RECHARGE_CONFIG: RechargeConfig[] = [
  {
    id: 'INDIVIDUAL',
    name: 'Individual',
    price: 2990,
    creditsHD: 10,
    drafts: 5,
    description: "Pa' la emergencia del día",
    color: 'green'
  },
  {
    id: 'SALVATORE',
    name: 'Salvatore',
    price: 9990,
    creditsHD: 50,
    drafts: 25,
    description: "Pa' salvar la semana",
    color: 'blue'
  },
  {
    id: 'IMPULSO',
    name: 'Impulso',
    price: 24990,
    creditsHD: 150,
    drafts: 750,
    description: "Pa' meterle con todo",
    color: 'purple'
  }
];

// ============================================
// 💰 TIPO PARA RECARGAS DE CRÉDITOS
// ============================================

export type RechargeStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface CreditRecharge {
  id: string;
  user_id: string;
  recharge_type: RechargeId;
  credits_hd: number;
  drafts: number;
  amount: number;
  status: RechargeStatus;
  payment_method?: string;
  mercadopago_preference_id?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// 📊 EQUIVALENCIAS DE CRÉDITOS (Base de datos)
// ============================================

export interface CreditEquivalence {
  id: string;
  media_type: string;
  credits_required: number;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Constantes por defecto (fallback si no hay BD)
export const DEFAULT_EQUIVALENCES: Record<string, number> = {
  photo_hd: 1,
  video_hd: 10
};

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

// ============================================
// 🎨 TIPOS PARA STORY ART STYLES
// ============================================

export type StoryArtStyleId =
  | 'vogue_negative'
  | 'neon_kinetic'
  | 'macro_essence'
  | 'cinematic_frame'
  | 'collage_dynamic'
  | 'marble_sculpture'
  | 'anime_to_real';

export interface StoryArtStyle {
  id: StoryArtStyleId;
  name: string;
  description: string;
  category: 'fashion' | 'urban' | 'product' | 'cinematic' | 'artistic' | 'classic' | 'anime';
  prompt: string;
  technicalPrompt?: string;
  visualPrompt: string;
  colors: string[];
  keywords: string[];
  icon: string;
}

export interface StoryArtCategory {
  label: string;
  description: string;
  styles: StoryArtStyleId[];
}

export interface StoryArtState {
  /** Si Story Art está activo */
  isActive: boolean;
  /** Estilo visual seleccionado */
  selectedStyle: StoryArtStyleId | null;
  /** ID del rubro de dirección de arte */
  artDirectionId: number | null;
  /** Si la dirección de arte fue aplicada */
  artDirectionApplied: boolean;
  /** Feedback message */
  feedbackMessage: string | null;
}

export interface StoryArtResult {
  success: boolean;
  prompt: string;
  style: StoryArtStyle | null;
  artDirectionConfig: {
    id: number;
    rubro: string;
    prompt: string;
  } | null;
  error?: string;
}
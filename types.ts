
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
  | 'security_systems';        // 40. Seguridad

// ============================================
// FÓRMULA MAESTRA PARA VIDEO (25 estilos)
// Estructura: [DESCRIPCIÓN VISUAL] + [MOVIMIENTO DE CÁMARA] + [ACCIÓN] + High resolution, cinematic 4k.
// ============================================
export type FlyerStyleKeyVideo =
  | 'video_retail_sale'        // 1. RETAIL / OFERTAS (Explosión 3D)
  | 'video_summer_beach'       // 2. VERANO / TURISMO (Agua en Movimiento)
  | 'video_worship_sky'        // 3. WORSHIP / IGLESIA (Rayos de Luz)
  | 'video_corporate'          // 4. CORPORATIVO (Timelapse / Oficina)
  | 'video_urban_night'        // 5. URBANO / NIGHTLIFE (Luces Estroboscópicas)
  | 'video_gastronomy'         // 6. GASTRONOMÍA (Food Porn / Slow Mo)
  | 'video_sport_gritty'       // 7. DEPORTE / GYM (Sudor y Esfuerzo)
  | 'video_luxury_gold'        // 8. LUJO / GALA (Brillos y Burbujas)
  | 'video_aesthetic_min'      // 9. MINIMALISTA / AESTHETIC (Sombras Suaves)
  | 'video_retro_vintage'      // 10. RETRO / VINTAGE (Ruido de Celuloide)
  | 'video_gamer_stream'       // 11. GAMER / ESPORTS (Glitch Digital)
  | 'video_eco_organic'        // 12. ECO / NATURAL (Viento en las Hojas)
  | 'video_indie_grunge'       // 13. INDIE / GRUNGE (Humo y Mano Alzada)
  | 'video_political'          // 14. POLÍTICA / COMUNIDAD (Caminar y Hablar)
  | 'video_kids_fun'           // 15. INFANTIL / KIDS (Globos Flotando)
  | 'video_art_double_exp'     // 16. DOBLE EXPOSICIÓN (Niebla Interna)
  | 'video_medical_clean'      // 17. MÉDICO / CLÍNICO (Escaneo Tech)
  | 'video_tech_saas'          // 18. TECH / SAAS / AI (Flujo de Datos)
  | 'video_typo_bold'          // 19. TIPOGRÁFICO (Fondo en Movimiento)
  | 'video_realestate_night'   // 20. REAL ESTATE NIGHT (Time-lapse Cielo)
  | 'video_auto_metallic'      // 21. AUTOMOTRIZ (Rueda Girando)
  | 'video_edu_sketch'         // 22. EDUCACIÓN / SKETCH (Dibujo Animado)
  | 'video_wellness_zen'       // 23. SPA / ZEN (Gota de Agua)
  | 'video_podcast_mic'        // 24. PODCAST / MEDIA (Ondas de Audio)
  | 'video_seasonal_holiday'   // 25. FESTIVIDADES (Nieve/Confetti)
  // --- NUEVOS VIDEO STYLES 26-40 (2026) ---
  | 'video_mechanic_action'    // 26. Taller Mecánico / Acción
  | 'video_tire_spin'          // 27. Vulcanización / Neumático
  | 'video_construction_drone' // 28. Construcción / Dron
  | 'video_logistic_flow'      // 29. Logística / Flujo
  | 'video_baking_rise'        // 30. Panadería / Horneado
  | 'video_cooler_refresh'     // 31. Botillería / Cooler
  | 'video_griddle_sizzle'     // 32. Comida Rápida / Plancha
  | 'video_barber_precision'   // 33. Barbería / Precisión
  | 'video_pet_interaction'    // 34. Veterinaria / Mascota
  | 'video_technical_fix'      // 35. Gasfitería / Técnica
  | 'video_dental_tech'        // 36. Dental / Tecnología
  | 'video_rehab_movement'     // 37. Kinesiología / Rehab
  | 'video_corporate_handshake' // 38. Estudio Jurídico / Corporativo
  | 'video_lawn_transformation' // 39. Jardinería / Pasto
  | 'video_surveillance_scan'; // 40. Seguridad / Vigilancia

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '1.91:1' | '4:5' | '1080x1080' | '1080x1920' | '1080x1350';

export type MediaType = 'image' | 'video' | 'product_study';

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
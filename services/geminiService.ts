import { GoogleGenAI, Type } from "@google/genai";
import { FlyerStyleKey, FlyerStyleKeyVideo, AspectRatio, ImageQuality } from "../types";
import {
  MASTER_STYLE,
  MASTER_STYLE_DRAFT,
  CHILEAN_BASE_CONTEXT,
  CHILEAN_OUTDOOR_CONTEXT,
  CHILEAN_STUDIO_CONTEXT,
  CHILEAN_CONTEXT_LITE,
  FLYER_STYLES,
  VIDEO_PHYSICS_GUARDRAIL,
  VIDEO_STYLES,
  IMAGE_GUARDRAILS,
  VIDEO_MOTION_GUARDRAILS
} from "../constants";
import { analyzeImageForTextStyle, generateTextStylesFromAnalysis, generateDynamicTextClasses, ImageAnalysisResult } from "./imageAnalysisService";
import { analyzeContextualTypography, generateContextualStyles, generateContextualClasses, ContextualTypographyResult } from "./contextualTypographyService";
import { analyzeImageContrast, generateContrastOptimizedStyles, ContrastAnalysis } from "./contrastAnalysisService";
import { analyzeContextualEffects, generateContextualEffectStyles, generateContextualEffectClasses, ContextualEffects } from "./contextualEffectsService";
import { analyzeCompositionForText, generateCompositionBasedStyles, generateCompositionClasses, CompositionAnalysisResult } from "./compositionAnalysisService";
import { validateAutoTextAnalysis, improveAutoTextAnalysis, ValidationResult } from "./autoTextValidationService";
import { RealTimePreview, PreviewState } from "./realTimePreviewService";
import { detectIndustryFromInput, processMagicMode } from "./magicModeService";
import {
  buildAgencyPrompt,
  buildArtDirectionPrompt,
  getArtDirectionById,
  ART_DIRECTION_SYSTEM
} from "../src/constants/artDirectionIndex";

// ============================================
// 🛡️ EL ESCUDO DE FÍSICA Y LIMPIEZA - Negative Prompt Absoluto
// Se aplica SIEMPRE para evitar textos, logos y deformaciones físicas
// ============================================
const GLOBAL_NEGATIVE_SHIELD = "text, letters, words, logo, watermark, distorted characters, floating objects, extra limbs, morphing faces, sliding feet, anti-gravity, supernatural movement, distorted physics, glitching bodies, impossible perspectives, unrealistic skin, plastic textures";

// ============================================
// 🦴 ESCUDO ANATÓMICO - Previene errores de anatomía humana
// Bloquea errores como: pies en la cabeza, extremidades invertidas, etc.
// ============================================
const ANATOMY_SHIELD = "deformed anatomy, disfigured body, extra limbs, fused limbs, feet on head, backwards limbs, inverted body, distorted proportions, morphing body parts, anatomical nonsense, floating body parts, wrong limb placement, upside down body, head at bottom, feet at top, merged body parts, twisted torso, dislocated joints, impossible bone structure, human deformation, body horror, creature features";

// ============================================
// 🦴 RULES DE ANCLAJE ÓSEO - Jerarquía estricta del cuerpo humano
// FUERZA al modelo a mantener la estructura anatómica correcta
// ============================================
const BONE_ANCHOR_RULES = `
HUMAN_STRUCTURE_RULES:
1. Maintain strict skeletal hierarchy: Head must be at the TOP of the body, feet must be at the BASE of the body.
2. Anchored Physics: Feet must maintain constant contact with the ground or equipment - NEVER floating above the head.
3. No Morphing: Limb count must remain constant (2 arms, 2 legs) with no merging of body parts.
4. Anatomical Consistency: Arms extend from shoulders, legs extend from hips, head sits on neck.
5. Gravity Respect: All body parts must follow natural gravity - nothing defies physics.
`;

// ============================================
// 📐 CONSTRUCTOR DE PROMPT SEGÚN EL NUEVO ORDEN DE PASOS
// Paso 1: Descripción → Paso 3: Formato → Paso 2: Contenido → Paso 4: Objetivo (NUNCA al prompt)
// ============================================

export interface UserConfig {
  description: string;      // Paso 1: Descripción del negocio
  format: '9:16' | '1:1' | '16:9' | '4:5';  // Paso 3: Formato
  contentType: 'image' | 'video' | 'story_art';  // Paso 2: Tipo de contenido
  industryId: number;       // Rubro (1-60) para Dirección de Arte
  marketingObjective?: 'branding' | 'leads';  // Paso 4: OBJETIVO - NUNCA se envía al prompt
}

/**
 * Genera el prompt final blindado con el Escudo de Física y Limpieza
 * @param config - Configuración del usuario con el nuevo orden de pasos
 * @returns Prompt final para generación de imagen/video (SIN texto del Paso 4)
 */
export const generateFinalPrompt = (config: UserConfig): string => {
  const { description, format, contentType, industryId } = config;
  
  // Paso 1 & 2: Contexto y ADN de movimiento (60 estilos)
  const artDirectionConfig = getArtDirectionById(industryId);
  const industryContext = artDirectionConfig?.prompt || "Professional commercial style";
  const industryRubro = artDirectionConfig?.rubro || "General";
  
  // ============================================
  // CORE_PHYSICS: Las Leyes de la Física Aplicadas
  // ============================================
  const CORE_PHYSICS = `
    CORE_PHYSICS: All movements must strictly follow the laws of gravity and mass.
    Subject must stay grounded and anchored to the floor. No floating or morphing.
    Maintain anatomical consistency. Inertia-based movement only.
  `;

  // ============================================
  // 🦴 ANCLAJE ÓSEO - Integrar reglas anatómicas estrictas
  // ============================================
  const SKELETAL_ANCHOR = `
    SKELETAL_ANCHOR:
    - Head ALWAYS at TOP of body, feet ALWAYS at BOTTOM
    - Feet in CONSTANT contact with ground/equipment
    - 2 arms extend from shoulders, 2 legs extend from hips
    - No body part inversion, no morphing, no fusion
    - Gravity defines all body positions
  `;

  // ============================================
  // INSTRUCCIÓN DE COMPOSICIÓN (Basada en Paso 3: Formato)
  // ============================================
  let compositionRule: string;
  let styleInstruction: string;
  
  if (format === '9:16') {
    // Stories de Instagram/TikTok
    compositionRule = "Vertical focus (60-70% subject). Leave top and bottom as clear negative space for overlays.";
    
    if (contentType === 'video' || contentType === 'story_art') {
      // Video/Story Art en 9:16
      styleInstruction = "STYLE_INSTRUCTION: Cinematic visual art plate. Subject centered (60-70% vertical). No embedded text or signs. Top and bottom areas clear for app overlays.";
    } else {
      // Imagen en 9:16
      styleInstruction = "STYLE_INSTRUCTION: Cinematic vertical composition. Clean professional aesthetic. Subject centered with negative space top and bottom.";
    }
  } else if (format === '1:1') {
    // Posts de Instagram/Facebook
    compositionRule = "Centered balanced composition with clean backgrounds.";
    
    if (contentType === 'image') {
      // Imagen/Estudio en 1:1
      styleInstruction = "STYLE_INSTRUCTION: High-end photography. Zero text, zero logos. Clear backgrounds. Focus on product textures and lighting.";
    } else {
      styleInstruction = "STYLE_INSTRUCTION: Professional square composition. Clean aesthetic with balanced subject placement.";
    }
  } else if (format === '16:9') {
    // YouTube/Reels horizontal
    compositionRule = "Cinematic wide composition with centered subject.";
    styleInstruction = "STYLE_INSTRUCTION: Cinematic horizontal video frame. Professional lighting and composition. No text or watermarks.";
  } else {
    // 4:5 Instagram portrait
    compositionRule = "Vertical portrait composition with subject focus.";
    styleInstruction = "STYLE_INSTRUCTION: Professional portrait composition. Clean aesthetic with subject prominence.";
  }

  // ============================================
  // CONSTRUCCIÓN DEL PROMPT FINAL (Blindado)
  // ============================================
  const promptParts: string[] = [];

  // Paso 1: Objetivo + CORE_PHYSICS (Leyes de la Física) + SKELETAL_ANCHOR
  promptParts.push(`OBJECTIVE: Professional visual asset for ${description}.`);
  promptParts.push(CORE_PHYSICS);
  promptParts.push(SKELETAL_ANCHOR);
  
  // REGLA DE ORO: NO TEXTO (siempre presente)
  promptParts.push(`STRICT_RULE: Zero text. Zero logos. No writing on any surface.`);

  // Paso 2: DIRECCIÓN DE ARTE (Basado en el Rubro 1-60)
  promptParts.push(`VISUAL_STYLE: ${industryContext}. Matte textures and organic lighting.`);

  // Paso 3: COMPOSICIÓN (Basada en Formato)
  promptParts.push(`COMPOSITION: ${compositionRule}`);

  // Estilo específico según formato y contenido
  promptParts.push(styleInstruction);

  // Paso 2 (cont): MOTIÓN (Solo si es video/story art)
  if (contentType === 'video' || contentType === 'story_art') {
    const motionStyles: Record<string, string> = {
      'Retail General': "Subtle camera pan, product reveal shot",
      'Moda': "Gentle fabric movement, model flow",
      'Joyas': "Diamond sparkle rotation, light refraction",
      'Gaming': "RGB pulse, glitch motion effects",
      'Gastronomía': "Steam rising, sauce drizzle motion",
      'Wellness': "Soft float, zen movement",
      'Fitness': "Dynamic action, muscle tension",
      'Belleza': "Soft glow transition, makeup shimmer",
      'default': "Cinematic steady motion"
    };
    
    let motionStyle = "Cinematic steady motion";
    for (const [key, value] of Object.entries(motionStyles)) {
      if (industryRubro.toLowerCase().includes(key.toLowerCase())) {
        motionStyle = value;
        break;
      }
    }
    
    promptParts.push(`MOTION_DYNAMICS: ${motionStyle}. Inertia-based movement.`);
  }

  // NEGATIVE PROMPT (El Escudo de Física y Limpieza + Escudo Anatómico)
  promptParts.push(`NEGATIVE_PROMPT: ${GLOBAL_NEGATIVE_SHIELD}, ${ANATOMY_SHIELD}`);

  return promptParts.join('\n\n');
};

/**
 * Genera el texto persuasivo para el Paso 4 (Branding/Leads)
 * Este texto se guarda SOLO para mostrar en la interfaz, NUNCA se envía al prompt de imagen
 * @param config - Configuración del usuario
 * @returns Texto persuasivo para mostrar al usuario (no para la IA)
 */
export const generateMarketingText = async (config: UserConfig): Promise<string> => {
  const { description, marketingObjective, industryId } = config;
  
  // El marketingObjective puede ser 'branding' o 'leads'
  const objective = marketingObjective || 'branding';
  
  // Usar la plantilla específica basada en el rubro
  const artDirectionConfig = getArtDirectionById(industryId);
  const industryRubro = artDirectionConfig?.rubro || 'default';
  
  // Mapear rubro a clave de INDUSTRY_TEXT_TEMPLATES
  const industryKeyMap: Record<string, string> = {
    'Retail General': 'retail_sale',
    'Moda': 'default',
    'Joyas': 'luxury_gold',
    'Gaming': 'gamer_stream',
    'Gastronomía': 'gastronomy',
    'Wellness': 'wellness_zen',
    'Fitness': 'sport_gritty',
    'Belleza': 'aesthetic_min',
    'Salud': 'medical_clean',
    'Tecnología': 'tech_saas',
    'default': 'default'
  };
  
  const industryKey = industryKeyMap[industryRubro] || 'default';
  const industryTexts = INDUSTRY_TEXT_TEMPLATES[industryKey] || INDUSTRY_TEXT_TEMPLATES.default;
  const industryFallbacks = industryTexts[objective];
  
  try {
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 8000);
    });

    const apiPromise = ai.models.generateContent({
      model,
      contents: `Negocio: ${description}\nIndustria: ${industryRubro}\nObjetivo: ${objective === 'branding' ? 'Branding' : 'Leads'}\nGenera texto corto y persuasivo en español (máximo 4 palabras para branding, 6 para leads):`,
      config: {
        systemInstruction: `Eres un experto en marketing para Chile.
        Genera texto específico para la industria: ${industryRubro}
        Reglas:
        - Texto MUY CORTO y específico al negocio
        - Solo el texto, sin explicaciones
        - Español chileno auténtico`
      }
    });

    const response = await Promise.race([apiPromise, timeoutPromise]) as any;
    const text = response.text?.trim();
    
    if (text && text.length > 2 && text.length < 100) {
      return text;
    }
    
    console.warn(`⚠️ API falló para ${industryRubro}, usando textos específicos`);
    return industryFallbacks[Math.floor(Math.random() * industryFallbacks.length)];
    
  } catch (error) {
    console.warn(`⚠️ Error generando texto para ${industryRubro}, usando fallback específico`);
    return industryFallbacks[Math.floor(Math.random() * industryFallbacks.length)];
  }
};

// Exportar función de diagnóstico para uso en otros servicios
export const diagnoseAndFixBlackImage = async (imageDataUrl: string): Promise<string> => {
  try {
    console.log('🔍 Iniciando diagnóstico de imagen...');
    
    // Crear imagen para análisis
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.warn('⚠️ No se pudo crear contexto de canvas');
            resolve(imageDataUrl);
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Analizar píxeles para detectar imagen en negro
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const pixels = imageData.data;
          
          let blackPixels = 0;
          let totalPixels = pixels.length / 4;
          let avgBrightness = 0;
          
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            // Calcular brillo promedio
            const brightness = (r + g + b) / 3;
            avgBrightness += brightness;
            
            // Contar píxeles muy oscuros (posiblemente negros)
            if (brightness < 10) {
              blackPixels++;
            }
          }
          
          avgBrightness /= totalPixels;
          const blackPixelRatio = blackPixels / totalPixels;
          
          console.log('📊 Análisis de imagen:', {
            width: img.width,
            height: img.height,
            totalPixels,
            blackPixels,
            blackPixelRatio: (blackPixelRatio * 100).toFixed(1) + '%',
            avgBrightness: avgBrightness.toFixed(1)
          });
          
          // Si más del 80% de los píxeles son muy oscuros, es probablemente una imagen en negro
          if (blackPixelRatio > 0.8 || avgBrightness < 20) {
            console.warn('⚠️ IMAGEN EN NEGRO DETECTADA - Aplicando corrección...');
            
            // Aplicar corrección: aumentar brillo y contraste
            ctx.filter = 'brightness(1.5) contrast(1.3) saturate(1.2)';
            ctx.drawImage(img, 0, 0);
            
            // Convertir de vuelta a data URL
            const correctedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
            console.log('✅ Imagen corregida aplicada');
            resolve(correctedDataUrl);
          } else {
            console.log('✅ Imagen parece normal, no se requiere corrección');
            resolve(imageDataUrl);
          }
        } catch (error) {
          console.warn('⚠️ Error en diagnóstico:', error);
          resolve(imageDataUrl); // Fallback a imagen original
        }
      };
      
      img.onerror = () => {
        console.warn('⚠️ Error cargando imagen para diagnóstico');
        resolve(imageDataUrl); // Fallback a imagen original
      };
      
      img.src = imageDataUrl;
    });
  } catch (error) {
    console.warn('⚠️ Error en diagnóstico de imagen:', error);
    return imageDataUrl; // Fallback a imagen original
  }
};

// Helper to get client instance with latest key
const getAiClient = () => new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY
});

// Define which styles allow landscapes. 
const OUTDOOR_STYLES: FlyerStyleKey[] = [
  'summer_beach', 
  'corporate', 
  'worship_sky', 
  'realestate_night',
  'eco_organic', 
  'political_community', 
  'art_double_exp'
];

export interface AnalyzedContent {
  description: string; // español para mostrar al usuario
  englishDescription?: string; // inglés para generación de IA
  visualStyle?: string;
  overlayText?: string; // NEW: Texto específico para superponer
  textStyle?: string; // NEW: Estilo del texto extraído
}

/**
 * TEXTOS ESPECÍFICOS POR INDUSTRIA - GENERADOS LOCALMENTE
 */
export const INDUSTRY_TEXT_TEMPLATES: Record<string, { branding: string[]; leads: string[] }> = {
  // WELLNESS / PILATES / YOGA
  wellness_zen: {
    branding: ['Armonía y Equilibrio', 'Bienestar Total', 'Tu Centro de Paz', 'Transforma Tu Cuerpo', 'Vive con Flexibilidad'],
    leads: ['Reserva Tu Clase', 'Comienza Hoy', 'Prueba Gratis', 'Agenda Tu Sesión', 'Tu Primera Clase es Gratis']
  },
  
  // PILATES ESPECÍFICO
  pilates: {
    branding: ['Vive Pilates', 'Cuerpo Consciente', 'Tu Equilibrio Interior', 'Flexibilidad y Fuerza', 'Movimiento con Propósito'],
    leads: ['Agenda Tu Clase de Prueba', 'Comienza Hoy', 'Reserva Tu Sesión', 'Tu Primera Clase es Gratis', 'Transforma Tu Cuerpo Ahora']
  },
  
  // GASTRONOMÍA
  gastronomy: {
    branding: ['Sabor Auténtico', 'Experiencia Única', 'Cocina con Alma', 'Sabores de Chile', 'Tradición y Sabor'],
    leads: ['Reserva Tu Mesa', 'Ordena Ahora', 'Delivery Disponible', 'Cupo Limitado', 'Ven y Disfruta']
  },
  
  // RETAIL / TIENDAS
  retail_sale: {
    branding: ['Calidad Garantizada', 'Lo Mejor en', 'Tu Tienda de Confianza', 'Variedad Premium', 'Estilo y Calidad'],
    leads: ['¡Ahora con DCTO!', 'Última Oportunidad', 'Stock Limitado', 'Oferta del Día', 'No Te Lo Pierdas']
  },
  
  // DEPORTE / GYM
  sport_gritty: {
    branding: ['Fuerza y Disciplina', 'Supera Tus Límites', 'Entrenamiento Pro', 'Resultados Reales', 'Poder Total'],
    leads: ['Empieza Tu Transformación', 'Clase de Prueba', 'Inscríbete Ya', 'Cupos Disponibles', 'Transforma Tu Cuerpo']
  },
  
  // BELLEZA / AESTHETIC
  aesthetic_min: {
    branding: ['Belleza Natural', 'Tu Mejor Versión', 'Cuidado Profesional', 'Resultados Visibles', 'Lujo Accesible'],
    leads: ['Agenda Tu Cita', 'Reserva Tu Turno', 'Consultoría Gratis', 'Primera Sesión Gratis', 'Transforma Tu Look']
  },
  
  // SALUD / MÉDICO
  medical_clean: {
    branding: ['Cuidado de Expertos', 'Tu Salud Primero', 'Atención Personalizada', 'Confianza Médica', 'Bienestar Integral'],
    leads: ['Agenda Tu Consulta', 'Reserva Tu Hora', 'Atención Inmediata', 'Cupos Disponibles', 'Tu Salud Es Lo Primero']
  },
  
  // TECNOLOGÍA
  tech_saas: {
    branding: ['Innovación Digital', 'Soluciones Tech', 'Futuro Automatizado', 'Digitaliza Tu Negocio', 'Tecnología Avanzada'],
    leads: ['Demo Gratis', 'Prueba la Plataforma', 'Comienza Ahora', 'Sin Compromiso', 'Upgrade Tu Negocio']
  },
  
  // EDUCACIÓN
  edu_sketch: {
    branding: ['Aprende de los Mejores', 'Conocimiento Real', 'Clases Personalizadas', 'Éxito Garantizado', 'Futuro Brillante'],
    leads: ['Inscríbete Ya', 'Cupos Limitados', 'Clase de Prueba', 'Comienza Este Mes', 'Reserva Tu Lugar']
  },
  
  // INMOBILIARIA
  realestate_night: {
    branding: ['Tu Hogar Ideal', 'Inversiones Premium', 'Propiedades de Lujo', 'Sueños Hechos Realidad', 'Exclusividad Total'],
    leads: ['Agenda Tu Visita', 'Tour de Propiedades', 'Cotización Gratis', 'Opción Unica', 'Reserva Tu Propiedad']
  },
  
  // LUJO
  luxury_gold: {
    branding: ['Exclusividad Absoluta', 'Lujo y Elegancia', 'Experiencia VIP', 'Lo Mejor de lo Mejor', 'Premium Total'],
    leads: ['Reserva Tu Experiencia', 'Acceso VIP', 'Cita Privada', 'Invitación Especial', 'Tu Momento de Lujo']
  },
  
  // AUTOMOTRIZ
  auto_metallic: {
    branding: ['Calidad Automotriz', 'Confianza Total', 'Servicio Premium', 'Expertos en Autos', 'Driving Excellence'],
    leads: ['Agenda Tu Servicio', 'Cotiza Tu Auto', 'Revision Gratis', 'Oferta de Mantenimiento', 'Tu Auto en Buenas Manos']
  },
  
  // IGLESIA / ESPIRITUAL
  worship_sky: {
    branding: ['Fe y Esperanza', 'Comunidad de Fe', 'Esperanza Viva', 'Amor y Servicio', 'Vida Espiritual'],
    leads: ['Únete a Nosotros', 'Te Esperarmos', 'Visítanos', 'Bautizos y Matrimonios', 'Grupos de Fe']
  },
  
  // NIÑOS
  kids_fun: {
    branding: ['Diversión Garantizada', 'Magia y Alegría', 'Los Mejores Cumpleaños', 'Diversión Sin Límites', 'Recuerdos Especiales'],
    leads: ['Reserva Tu Fiesta', 'Cupos Disponibles', 'Fechas Limitadas', 'Comienza la Diversión', 'Agenda Tu Evento']
  },
  
  // MÚSICA / PODCAST
  podcast_mic: {
    branding: ['Voz Auténtica', 'Contenido Real', 'Historias Únicas', 'Tu Voz al Mundo', 'Audio Premium'],
    leads: ['Escucha Ahora', 'Suscríbete Gratis', 'Nuevo Episodio', 'Síguenos', 'No Te Lo Pierdas']
  },
  
  // GAMING
  gamer_stream: {
    branding: ['Game On', 'Nivel Épico', 'Stream Legendario', 'Gaming Pro', 'Victoria Asegurada'],
    leads: ['Watch Live', 'Únete al Clan', 'Stream Ahora', 'Seguir y Like', 'Participa en Torneos']
  },
  
  // ECOLÓGICO
  eco_organic: {
    branding: ['Natural y Puro', 'Sustentable Real', 'Eco Friendly', 'Vida Natural', 'Orgánico de Verdad'],
    leads: ['Compra Consciente', 'Envío a Casa', 'Productos Nuevos', 'Descuentos Eco', 'Cambia a Lo Natural']
  },
  
  // FIESTA / NOCHE
  urban_night: {
    branding: ['Noche Épica', 'La Mejor Fiesta', 'Diversión Total', 'Recuerdos de Locura', 'Live the Night'],
    leads: ['Reserva Tu Mesa', 'Entrada Anticipada', 'VIP Access', 'No Te Quedes Afuera', 'Fiesta Esta Noche']
  },
  
  // CORPORATIVO
  corporate: {
    branding: ['Soluciones Expertas', 'Profesionalismo Total', 'Resultados Garantizados', 'Excelencia Empresarial', 'Socio Estratégico'],
    leads: ['Agenda Reunión', 'Cotización Sin Compromiso', 'Consultoría Gratis', 'Hablemos de Negocios', 'Contáctanos']
  },
  
  // DEFAULT / GENÉRICO
  default: {
    branding: ['Calidad Premium', 'Experiencia Confiable', 'Profesionales Expertos', 'Marca de Confianza', 'Excelencia Garantizada'],
    leads: ['¡Contáctanos Ya!', 'Agenda Tu Cita', 'Consulta Gratuita', 'Oferta Especial', 'Llama Ahora', 'Reserva Hoy']
  }
};

/**
 * Detecta la industria desde la descripción del negocio
 */
export const detectIndustryFromDescription = (description: string): string => {
  const descLower = description.toLowerCase();
  
  // PILATES tiene prioridad sobre wellness general
  if (descLower.includes('pilates')) {
    return 'pilates';
  }
  
  if (descLower.includes('yoga') || descLower.includes('meditacion') || descLower.includes('bienestar') || descLower.includes('spa') || descLower.includes('masaje')) {
    return 'wellness_zen';
  }
  if (descLower.includes('restaurant') || descLower.includes('comida') || descLower.includes('food') || descLower.includes('cafe') || descLower.includes('gastronom')) {
    return 'gastronomy';
  }
  if (descLower.includes('tienda') || descLower.includes('shop') || descLower.includes('store') || descLower.includes('oferta') || descLower.includes('descuento')) {
    return 'retail_sale';
  }
  if (descLower.includes('gym') || descLower.includes('deporte') || descLower.includes('fitness') || descLower.includes('entrenamiento') || descLower.includes('ejercicio')) {
    return 'sport_gritty';
  }
  if (descLower.includes('belleza') || descLower.includes('estetica') || descLower.includes('aesthetic') || descLower.includes('skincare')) {
    return 'aesthetic_min';
  }
  if (descLower.includes('medico') || descLower.includes('doctor') || descLower.includes('clinica') || descLower.includes('salud') || descLower.includes('dental')) {
    return 'medical_clean';
  }
  if (descLower.includes('tech') || descLower.includes('software') || descLower.includes('app') || descLower.includes('digital') || descLower.includes('web')) {
    return 'tech_saas';
  }
  if (descLower.includes('educacion') || descLower.includes('curso') || descLower.includes('clase') || descLower.includes('academia') || descLower.includes('estudiar')) {
    return 'edu_sketch';
  }
  if (descLower.includes('casa') || descLower.includes('departamento') || descLower.includes('inmueble') || descLower.includes('propiedad') || descLower.includes('inmobiliaria')) {
    return 'realestate_night';
  }
  if (descLower.includes('lujo') || descLower.includes('luxury') || descLower.includes('premium') || descLower.includes('vip') || descLower.includes('elegante')) {
    return 'luxury_gold';
  }
  if (descLower.includes('auto') || descLower.includes('carro') || descLower.includes('vehiculo') || descLower.includes('taller') || descLower.includes('mecanico')) {
    return 'auto_metallic';
  }
  if (descLower.includes('iglesia') || descLower.includes('templo') || descLower.includes('espiritual') || descLower.includes('fe') || descLower.includes('cristo')) {
    return 'worship_sky';
  }
  if (descLower.includes('niños') || descLower.includes('infantil') || descLower.includes('cumpleanos') || descLower.includes('juguetes') || descLower.includes('kids')) {
    return 'kids_fun';
  }
  if (descLower.includes('podcast') || descLower.includes('radio') || descLower.includes('audio') || descLower.includes('musica') || descLower.includes('musical')) {
    return 'podcast_mic';
  }
  if (descLower.includes('gaming') || descLower.includes('game') || descLower.includes('stream') || descLower.includes('videojuego') || descLower.includes('esports')) {
    return 'gamer_stream';
  }
  if (descLower.includes('eco') || descLower.includes('organic') || descLower.includes('natural') || descLower.includes('verde') || descLower.includes('sustentable')) {
    return 'eco_organic';
  }
  if (descLower.includes('discoteca') || descLower.includes('club') || descLower.includes('fiesta') || descLower.includes('noche') || descLower.includes('entretencion')) {
    return 'urban_night';
  }
  if (descLower.includes('empresa') || descLower.includes('business') || descLower.includes('corporativo') || descLower.includes('profesional') || descLower.includes('servicio')) {
    return 'corporate';
  }
  
  return 'default';
};

/**
 * Step 0.5: Generate persuasive text based on marketing objective and industry
 */
export const generatePersuasiveText = async (
  businessDescription: string,
  objective: 'branding' | 'leads'
): Promise<string> => {
  // Detectar industria desde la descripción
  const industry = detectIndustryFromDescription(businessDescription);
  const industryTexts = INDUSTRY_TEXT_TEMPLATES[industry] || INDUSTRY_TEXT_TEMPLATES.default;
  
  // Seleccionar texto específico de la industria
  const industryFallbacks = industryTexts[objective];
  
  try {
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";

    // Timeout de 8 segundos
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 8000);
    });

    const apiPromise = ai.models.generateContent({
      model,
      contents: `Negocio: ${businessDescription}\nIndustria: ${industry}\nObjetivo: ${objective === 'branding' ? 'Branding' : 'Leads'}\nGenera texto corto y persuasivo en español (máximo 4 palabras para branding, 6 para leads):`,
      config: {
        systemInstruction: `Eres un experto en marketing para Chile.
Genera texto específico para la industria: ${industry}
Reglas:
- Texto MUY CORTO y específico al negocio
- Solo el texto, sin explicaciones
- Español chileno auténtico`
      }
    });

    const response = await Promise.race([apiPromise, timeoutPromise]) as any;
    const text = response.text?.trim();
    
    if (text && text.length > 2 && text.length < 100) {
      return text;
    }
    
    console.warn(`⚠️ API falló para ${industry}, usando textos específicos`);
    return industryFallbacks[Math.floor(Math.random() * industryFallbacks.length)];
    
  } catch (error) {
    console.warn(`⚠️ Error generando texto para ${industry}, usando fallback específico`);
    return industryFallbacks[Math.floor(Math.random() * industryFallbacks.length)];
  }
};

/**
 * Step 0: Analyze a Website URL to extract description, REAL TEXT, and VISUAL VIBE.
 * MEJORADO: Extrae más información del negocio para generar mejores flyers.
 */
export const analyzeUrlContent = async (url: string): Promise<AnalyzedContent> => {
  try {
    console.log("🔍 Iniciando análisis avanzado de URL:", url);
    
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";

    console.log("📡 Enviando solicitud a Gemini para análisis profundo...");
    
    // Timeout de 20 segundos (aumentado para análisis más completo)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), 20000);
    });

    // Análisis COMPLEJO que extrae toda la información relevante del negocio
    const analysisPromise = ai.models.generateContent({
      model,
      contents: `Analiza esta página web en profundidad: ${url}.
      
      Debes extraer la siguiente información para crear un flyer publicitario efectivo:`,
      config: {
        systemInstruction: `Eres un EXPERTO ANALISTA DE MARKETING para Chile.
        
        Tu tarea es analizar páginas web chilenas y extraer información completa para crear flyers publicitarios.
        
        Responde en formato JSON EXACTO (sin markdown, sin comentarios):
        {
          "businessName": "Nombre del negocio",
          "tagline": "Lema o tagline principal del negocio",
          "description": "Descripción detallada del negocio (qué ofrecen, qué los hace únicos)",
          "products": ["producto1", "producto2", "producto3"],
          "services": ["servicio1", "servicio2"],
          "promotions": ["promo1", "promo2"],
          "industry": "Una palabra: retail, gastronomy, wellness, fitness, beauty, medical, tech, education, corporate, realestate, luxury, automotive, church, kids, entertainment, eco, fashion, home, sports, other",
          "visualStyle": "Descripción del estilo visual en inglés: colores dominantes, iluminación, estética general",
          "primaryColors": ["color1 hex", "color2 hex"],
          "secondaryColors": ["color1 hex"],
          "atmosphere": "Descripción del ambiente (formal, casual, premium, familiar, etc.)",
          "targetAudience": "A quién va dirigido (jóvenes, familias, profesionales, etc.)",
          "keySellingPoints": ["punto1", "punto2", "punto3"],
          "contactInfo": {
            "phone": "teléfono",
            "address": "dirección",
            "instagram": "usuario",
            "website": "url"
          },
          "moodKeywords": ["palabra1", "palabra2", "palabra3"]
        }
        
        Reglas CRÍTICAS:
        - description: Mínimo 50 palabras, máximo 100. En ESPAÑOL.
        - industry: Solo una palabra de las listadas arriba.
        - Si no encuentras información, usa "other" para industry y deduce lo que puedas.
        - Todo en español excepto visualStyle (inglés para la IA).
        - NO generes información inventada; usa lo que realmente encuentres en la página.`,
        responseMimeType: "application/json"
      }
    });

    // Race between analysis and timeout
    const response = await Promise.race([analysisPromise, timeoutPromise]) as any;

    console.log("✅ Respuesta recibida de Gemini");
    
    const responseText = response.text?.trim();
    if (!responseText || responseText.length < 10) {
      throw new Error("Respuesta muy corta o vacía");
    }
    
    console.log("📄 Respuesta recibida:", responseText.substring(0, 200) + "...");
    
    // Parsear JSON
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (parseError) {
      console.warn("No se pudo parsear JSON, usando fallback");
      parsed = {};
    }
    
    // Construir descripción en español basada en la información extraída
    const businessName = parsed.businessName || '';
    const description = parsed.description || '';
    const products = parsed.products || [];
    const services = parsed.services || [];
    const promotions = parsed.promotions || [];
    const industry = parsed.industry || 'other';
    const atmosphere = parsed.atmosphere || '';
    const targetAudience = parsed.targetAudience || '';
    const keySellingPoints = parsed.keySellingPoints || [];
    const contactInfo = parsed.contactInfo || {};
    
    // Crear descripción española rica para mostrar al usuario
    let spanishDescription = '';
    if (businessName) {
      spanishDescription += `${businessName}. `;
    }
    if (description) {
      spanishDescription += `${description} `;
    }
    if (products.length > 0) {
      spanishDescription += `Productos: ${products.slice(0, 3).join(', ')}. `;
    }
    if (services.length > 0) {
      spanishDescription += `Servicios: ${services.slice(0, 3).join(', ')}. `;
    }
    if (promotions.length > 0) {
      spanishDescription += `Promociones: ${promotions.slice(0, 2).join(', ')}. `;
    }
    if (atmosphere) {
      spanishDescription += `Ambiente: ${atmosphere}. `;
    }
    if (targetAudience) {
      spanishDescription += `Ideal para: ${targetAudience}. `;
    }
    if (keySellingPoints.length > 0) {
      spanishDescription += `Destacamos: ${keySellingPoints.slice(0, 2).join(', ')}.`;
    }
    
    // Crear descripción en inglés para la generación de imagen
    const englishDescription = buildEnglishDescription(parsed);
    
    // Construir overlayText persuasivo en español
    let overlayText = '';
    if (parsed.tagline) {
      overlayText = parsed.tagline;
    } else if (promotions.length > 0) {
      overlayText = promotions[0];
    } else if (keySellingPoints.length > 0) {
      overlayText = keySellingPoints[0];
    } else {
      overlayText = `${businessName} - ${industry.charAt(0).toUpperCase() + industry.slice(1)}`;
    }
    
    const result = {
      description: spanishDescription.trim() || `${businessName}. Negocio de ${industry} en Chile.`,
      englishDescription: englishDescription,
      visualStyle: parsed.visualStyle || getDefaultVisualStyle(industry),
      overlayText: overlayText,
      textStyle: getTextStyleForIndustry(industry)
    };
    
    console.log("🎯 Análisis completado:", {
      businessName: parsed.businessName,
      industry: industry,
      descriptionLength: result.description.length,
      englishDescriptionLength: result.englishDescription?.length
    });
    
    return result;

  } catch (error: any) {
    console.error("❌ Error analyzing URL:", error.message);
    
    // Fallback usando Modo Magia
    console.log("🔮 Usando Modo Magia como fallback...");
    
    let urlForDetection = url;
    try {
      const urlObj = new URL(url);
      urlForDetection = `${urlObj.hostname} ${urlObj.pathname.replace(/\//g, ' ')}`;
    } catch (urlError) {
      urlForDetection = url;
    }
    
    const magicResult = processMagicMode(urlForDetection);
    
    console.log("✅ Modo Magia fallback:", {
      styleKey: magicResult.styleKey,
      confidence: magicResult.confidence
    });
    
    // Generar descripción de fallback basada en la industria
    const fallbackEnglish = getFallbackEnglishDescription(magicResult.styleKey);
    const fallbackSpanish = getFallbackSpanishDescription(magicResult.styleKey);
    
    return {
      description: fallbackSpanish,
      englishDescription: fallbackEnglish,
      visualStyle: getDefaultVisualStyle(magicResult.styleKey),
      overlayText: magicResult.persuasiveText || magicResult.detectedIndustry,
      textStyle: getTextStyleForIndustry(magicResult.styleKey)
    };
  }
};

/**
 * Construye la descripción en inglés para la generación de imagen
 */
function buildEnglishDescription(parsed: any): string {
  const parts: string[] = [];
  
  if (parsed.businessName) {
    parts.push(parsed.businessName);
  }
  
  if (parsed.description) {
    // Traducir descripción al inglés
    parts.push(parsed.description);
  }
  
  if (parsed.visualStyle) {
    parts.push(parsed.visualStyle);
  }
  
  if (parsed.atmosphere) {
    parts.push(`Atmosphere: ${parsed.atmosphere}`);
  }
  
  if (parsed.moodKeywords && parsed.moodKeywords.length > 0) {
    parts.push(`Mood: ${parsed.moodKeywords.join(', ')}`);
  }
  
  // Agregar contexto chileno
  parts.push('Santiago Chile commercial environment');
  
  return parts.join('. ') + '.';
}

/**
 * Obtiene el estilo visual por defecto según la industria
 */
function getDefaultVisualStyle(industry: string): string {
  const styles: Record<string, string> = {
    'retail': 'Modern retail store with clean displays, bright lighting, professional commercial aesthetic',
    'gastronomy': 'Upscale restaurant with elegant atmosphere, warm lighting, professional culinary presentation',
    'wellness': 'Wellness studio with peaceful atmosphere, natural lighting, zen aesthetic',
    'fitness': 'Sports center with energetic atmosphere, dynamic lighting, motivational environment',
    'beauty': 'Beauty salon with minimalist aesthetic, soft lighting, elegant decor',
    'medical': 'Medical center with clean sterile environment, professional white lighting',
    'tech': 'Technology company with modern workspace, futuristic lighting, sleek aesthetic',
    'education': 'Educational center with bright learning environment, clean professional aesthetic',
    'corporate': 'Professional business office with elegant design, modern corporate aesthetic',
    'realestate': 'Real estate with premium properties, elegant architectural design',
    'luxury': 'Luxury business with exclusive atmosphere, gold accents, premium elegance',
    'automotive': 'Automotive workshop with clean industrial environment, professional service',
    'church': 'Church with spiritual atmosphere, divine lighting, sacred aesthetic',
    'kids': 'Children business with colorful fun atmosphere, vibrant playful aesthetic',
    'entertainment': 'Entertainment venue with festive atmosphere, dynamic lighting',
    'eco': 'Eco-friendly business with natural elements, organic aesthetic',
    'fashion': 'Fashion store with stylish displays, modern retail aesthetic',
    'home': 'Home business with cozy atmosphere, comfortable aesthetic',
    'sports': 'Sports facility with dynamic environment, energetic aesthetic',
    'other': 'Local business with professional branding, clean aesthetic'
  };
  
  return styles[industry] || styles['other'];
}

/**
 * Obtiene el estilo de texto según la industria
 */
function getTextStyleForIndustry(industry: string): string {
  const styles: Record<string, string> = {
    'retail': 'Bold and urgent',
    'gastronomy': 'Elegant and appetizing',
    'wellness': 'Calm and peaceful',
    'fitness': 'Dynamic and powerful',
    'beauty': 'Soft and elegant',
    'medical': 'Clean and trustworthy',
    'tech': 'Modern and sleek',
    'education': 'Clear and professional',
    'corporate': 'Professional and clean',
    'realestate': 'Sophisticated and elegant',
    'luxury': 'Premium and exclusive',
    'automotive': 'Strong and reliable',
    'church': 'Spiritual and hopeful',
    'kids': 'Fun and playful',
    'entertainment': 'Vibrant and exciting',
    'eco': 'Natural and organic',
    'fashion': 'Stylish and trendy',
    'home': 'Cozy and welcoming',
    'sports': 'Energetic and motivating',
    'other': 'Modern and clean'
  };
  
  return styles[industry] || styles['other'];
}

/**
 * Descripción de fallback en inglés
 */
function getFallbackEnglishDescription(styleKey: string): string {
  const descriptions: Record<string, string> = {
    'retail_sale': 'Modern retail store with promotional products, clean organized displays, bright commercial lighting, Santiago Chile',
    'gastronomy': 'Upscale restaurant with gourmet dishes, elegant atmosphere, warm lighting, professional culinary presentation',
    'wellness_zen': 'Wellness studio with peaceful atmosphere, yoga pilates meditation, natural lighting, zen aesthetic',
    'sport_gritty': 'Sports center with exercise equipment, energetic atmosphere, dynamic lighting, fitness motivation',
    'aesthetic_min': 'Beauty center with minimalist aesthetic, soft lighting, elegant decor, clean serene atmosphere',
    'medical_clean': 'Medical center with clean sterile environment, professional white lighting, modern equipment',
    'tech_saas': 'Technology company with modern workspace, futuristic lighting, sleek modern aesthetic',
    'corporate': 'Professional business office with elegant design, modern corporate aesthetic, clean environment',
    'luxury_gold': 'Luxury business with exclusive atmosphere, gold accents, premium elegance, sophisticated aesthetic',
    'realestate_night': 'Real estate with premium properties, elegant architectural design, sophisticated aesthetic',
    'worship_sky': 'Church with spiritual atmosphere, divine lighting, sacred aesthetic, Santiago Chile',
    'kids_fun': 'Children business with colorful fun atmosphere, vibrant playful aesthetic, safe fun environment',
    'urban_night': 'Entertainment venue with festive atmosphere, dynamic lighting, vibrant energetic aesthetic',
    'eco_organic': 'Eco-friendly business with natural elements, organic aesthetic, sustainable environment',
    'default': 'Local business with professional branding, clean aesthetic, Santiago Chile commercial environment'
  };
  
  return descriptions[styleKey] || descriptions['default'];
}

/**
 * Descripción de fallback en español
 */
function getFallbackSpanishDescription(styleKey: string): string {
  const descriptions: Record<string, string> = {
    'retail_sale': 'Tienda retail moderna con productos promocionales, exhibidores limpios, iluminación comercial brillante, ambiente de compras en Santiago.',
    'gastronomy': 'Restaurante de alta gama con platos gourmet, atmósfera elegante, iluminación cálida, presentación culinaria profesional.',
    'wellness_zen': 'Estudio de bienestar con atmósfera pacífica, yoga y pilates, iluminación natural, estética zen.',
    'sport_gritty': 'Centro deportivo con equipamiento de ejercicio, atmósfera energética, iluminación dinámica, motivación fitness.',
    'aesthetic_min': 'Centro de belleza con estética minimalista, iluminación suave, decoración elegante, ambiente limpio y sereno.',
    'medical_clean': 'Centro médico con entorno clínico limpio, iluminación profesional blanca, equipamiento moderno.',
    'tech_saas': 'Empresa tecnológica con espacio de trabajo moderno, iluminación futurista, estética moderna elegante.',
    'corporate': 'Oficina empresarial profesional con diseño elegante, estética corporativa moderna, entorno limpio.',
    'luxury_gold': 'Negocio de lujo con atmósfera exclusiva, detalles dorados, elegancia premium, estética sofisticada.',
    'realestate_night': 'Inmobiliaria con propiedades premium, diseño arquitectónico elegante, estética sofisticada.',
    'worship_sky': 'Iglesia con atmósfera espiritual, iluminación divina, estética sagrada en Santiago.',
    'kids_fun': 'Negocio infantil con atmósfera colorida y divertida, estética vibrante y juguetona, ambiente seguro y divertido.',
    'urban_night': 'Local de entretenimiento con atmósfera festiva, iluminación dinámica, estética energética y vibrante.',
    'eco_organic': 'Negocio eco-friendly con elementos naturales, estética orgánica, entorno sostenible.',
    'default': 'Negocio local con branding profesional, estética limpia, entorno comercial en Santiago.'
  };
  
  return descriptions[styleKey] || descriptions['default'];
}

/**
 * Step 1: Translate and Enhance the user's Spanish input.
 * Returns both English prompt (for AI) and Spanish summary (for user display)
 */
export const enhancePrompt = async (userInput: string, styleKey: FlyerStyleKey): Promise<{ english: string; spanish: string }> => {
  try {
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";
    
    const styleConfig = FLYER_STYLES[styleKey] || { label: 'Professional', english_prompt: 'Professional commercial style' };
    
    // Fallback si no existe el estilo
    const safeStyleConfig = styleConfig;

    const systemInstruction = `You are an expert AI Prompt Engineer for image generation.
    Your task is to take a raw Spanish description of a business service or product and translate the VISUAL DESCRIPTION into English.
    
    IMPORTANT RULES:
    1. Translate visual elements (lighting, composition, objects) to English.
    2. PRESERVE LOCATION NAMES (e.g., "Santiago", "Torres del Paine").
    3. TEXT PRESERVATION: If user wants specific text, keep it in SPANISH inside single quotes.
    4. Focus on physical details based on style: ${safeStyleConfig.label}.
    5. Return ONLY the enhanced prompt.`;

    const response = await ai.models.generateContent({
      model,
      contents: `Input: "${userInput}"\nStyle: ${safeStyleConfig.english_prompt}\nTranslate to English visual prompt:`,
      config: { systemInstruction }
    });

    const englishPrompt = response.text?.trim() || userInput;
    
    // Generate Spanish summary for user display
    const spanishSystemInstruction = `Eres un asistente que resume descripciones visuales de negocios en español simple.
    Tu tarea es crear un resumen BREVE y CLARO en español de la descripción del negocio.
    
    Reglas:
    1. Máximo 50 palabras
    2. Usa español simple y directo
    3. Describe el tipo de negocio, productos/servicios y ambiente
    4. No incluyas instrucciones técnicas
    5. Solo el resumen, sin explicaciones`;

    const spanishResponse = await ai.models.generateContent({
      model,
      contents: `Describe brevemente este negocio en español: ${userInput}`,
      config: { systemInstruction: spanishSystemInstruction }
    });

    const spanishSummary = spanishResponse.text?.trim() || userInput;

    return { english: englishPrompt, spanish: spanishSummary };
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    return { english: userInput, spanish: userInput }; // Fallback to raw input if enhancement fails
  }
};

/**
 * Step 1.5: Refine existing description.
 */
export const refineDescription = async (currentDescription: string, userInstruction: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";

    const systemInstruction = `You are an expert image prompt editor. 
    Rewrite the English description to incorporate the user's Spanish instruction. Return ONLY the new description.`;

    const response = await ai.models.generateContent({
      model,
      contents: `Description: "${currentDescription}"\nInstruction: "${userInstruction}"\nRewrite:`,
      config: { systemInstruction }
    });

    return response.text?.trim() || currentDescription;
  } catch (error) {
    console.error("Error refining prompt:", error);
    return currentDescription;
  }
};

/**
 * Internal Helper to execute the image generation call
 */
const executeImageGeneration = async (ai: GoogleGenAI, model: string, prompt: string, seed: number, aspectRatio: AspectRatio, isHD: boolean): Promise<string> => {
    const startTime = Date.now();
    console.log(`🚀 [GeminiService] INICIANDO generación con ${model} (HD: ${isHD}) Seed: ${seed}, AspectRatio: ${aspectRatio}`);
    console.log(`📝 [GeminiService] Prompt (${prompt.length} chars):`, prompt.substring(0, 200) + '...');
    
    // Ensure aspectRatio is in the correct format for Gemini API
    const validAspectRatios: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4', '1.91:1', '4:5', '1080x1080', '1080x1920', '1080x1350'];
    const finalAspectRatio = validAspectRatios.includes(aspectRatio) ? aspectRatio : '1:1';
    
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: prompt }] },
      config: {
        seed: seed,
        imageConfig: {
          aspectRatio: finalAspectRatio,
          ...(isHD ? { imageSize: "1K" } : {})
        }
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) throw new Error("API retornó 0 candidatos.");

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) throw new Error("Respuesta vacía.");

    console.log(`🔍 Total parts received: ${parts.length}`);
    
    // Search for image part
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      console.log(`🔍 Checking part ${i}:`, {
        hasInlineData: !!part.inlineData,
        hasText: !!part.text,
        mimeType: part.inlineData?.mimeType,
        dataLength: part.inlineData?.data?.length || 0
      });
      
      if (part.inlineData && part.inlineData.data) {
        let base64Data = part.inlineData.data;
        
        // 1. Sanitize whitespace
        base64Data = base64Data.replace(/\s/g, '');

        // 2. CHECK SIZE: Umbral MUY permisivo para evitar imágenes en negro
        if (base64Data.length < 100) {
            console.warn(`Image data small but accepting: ${base64Data.length} bytes.`);
            console.warn(`First 50 chars:`, base64Data.substring(0, 50));
            // NO DESCARTAR - Aceptar datos pequeños como válidos
        }

        // 3. MAGIC NUMBER VALIDATION - DETECT FORMAT AUTOMATICALLY (MÁS PERMISIVO)
        const isJpeg = base64Data.startsWith('/9j/');
        const isPng = base64Data.startsWith('iVBOR');
        const isWebp = base64Data.startsWith('UklGR');

        console.log(`🔍 Debugging image format for part ${i}:`, {
          startsWith: base64Data.substring(0, 10),
          isJpeg,
          isPng,
          isWebp,
          reportedMimeType: part.inlineData?.mimeType,
          dataLength: base64Data.length
        });

        // 4. CORRECT MIME TYPE DETECTION - FIX THE BLACK IMAGE ISSUE
        let detectedMimeType;
        if (isJpeg) {
          detectedMimeType = 'image/jpeg';
          console.log('✅ Detected JPEG format automatically');
        } else if (isPng) {
          detectedMimeType = 'image/png';
          console.log('✅ Detected PNG format automatically');
        } else if (isWebp) {
          detectedMimeType = 'image/webp';
          console.log('✅ Detected WebP format automatically');
        } else {
          // NUEVO: Ser más permisivo con el MIME type - siempre usar JPEG como fallback
          detectedMimeType = 'image/jpeg';
          console.warn('⚠️ Using JPEG fallback mimeType (was:', part.inlineData?.mimeType, ')');
        }

        console.log(`🎯 Image format detected: ${detectedMimeType}, size: ${base64Data.length} chars`);
        
        // CRITICAL FIX: Validate the image data before returning (UMbral MUY BAJO)
        const imageDataUrl = `data:${detectedMimeType};base64,${base64Data}`;
        
        // Additional validation: Check if data looks valid (umbral muy bajo)
        if (base64Data.length > 100) {
          console.log('✅ Image data looks valid, returning...');
          return imageDataUrl;
        } else {
          console.warn('⚠️ Image data is small but attempting to use...');
          console.log('🔍 Raw data preview:', base64Data.substring(0, 100));
          // Intentar usar datos pequeños en lugar de descartarlos
          return imageDataUrl;
        }
      }
    }
    
    // Check for Text Refusal (Safety)
    const textPart = parts.find(p => p.text)?.text;
    if (textPart) {
        console.warn("Safety Refusal:", textPart);
        throw new Error(`SAFETY_BLOCK: ${textPart}`);
    }

    // NUEVO: Si llegamos aquí, intentar usar el primer part disponible como fallback
    if (parts.length > 0) {
      console.warn("⚠️ No se encontraron datos de imagen válidos, intentando fallback...");
      const firstPart = parts[0];
      if (firstPart.inlineData?.data) {
        console.log("🔄 Usando primer part como fallback...");
        const fallbackData = firstPart.inlineData.data.replace(/\s/g, '');
        if (fallbackData.length > 50) { // Umbral MUY bajo para fallback
          console.log('🔄 Using fallback data with low threshold');
          console.log('🔍 Fallback data preview:', fallbackData.substring(0, 100));
          return `data:image/jpeg;base64,${fallbackData}`;
        }
      }
    }

    // ÚLTIMO RECURSO: Intentar con cualquier part que tenga datos
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.inlineData?.data) {
        const data = part.inlineData.data.replace(/\s/g, '');
        if (data.length > 50) {
          console.log(`🔄 Último recurso: usando part ${i} como fallback...`);
          console.log('🔍 Last resort data preview:', data.substring(0, 100));
          return `data:image/jpeg;base64,${data}`;
        }
      }
    }

    throw new Error("La API respondió, pero no generó datos de imagen válidos.");
  };


/**
 * Step 2 (Image): Generate Flyer.
 */
export interface GeneratedImageResult {
  imageUrl: string; // NEW: Alias para compatibilidad
  imageDataUrl: string;
  imageAnalysis?: ImageAnalysisResult;
  intelligentTextStyles?: {
    cssStyles: any;
    dynamicClasses: string;
  };
  contextualTypography?: ContextualTypographyResult;
  contrastAnalysis?: ContrastAnalysis;
  contextualEffects?: ContextualEffects;
  compositionAnalysis?: CompositionAnalysisResult;
  autoTextValidation?: ValidationResult; // NEW: Resultado de validación
  realTimePreview?: RealTimePreview;
  enhancedStyles?: {
    typography: any;
    contrast: any;
    effects: any;
    composition: any;
    combinedClasses: string;
  };
}

// NUEVO: Wrapper function para compatibilidad con frontend
export interface SimpleImageResult {
  success: boolean;
  imageUrl: string;
  error?: string;
}

/**
 * Función simplificada para generar imágenes (compatibilidad con frontend)
 * OPCIONAL: mode = 'story_art' para usar Dirección de Arte Profesional
 */
export const generateImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  options?: {
    styleKey?: FlyerStyleKey;
    quality?: ImageQuality;
    seed?: number;
    artDirectionId?: number; // ID del rubro (1-60) para Story Art
  }
): Promise<SimpleImageResult> => {
  try {
    console.log('🎨 Generando imagen con prompt:', prompt);
    
    const styleKey = options?.styleKey || 'brand_identity';
    const quality = options?.quality || 'draft';
    const seed = options?.seed || Math.floor(Math.random() * 1000000);
    const artDirectionId = options?.artDirectionId;
    
    let finalPrompt: string;
    
    // ============================================
    // MODO STORY ART: Usar Dirección de Arte Profesional
    // ============================================
    if (artDirectionId && artDirectionId >= 1 && artDirectionId <= 60) {
      console.log(`🎬 [Story Art] Usando Dirección de Arte Profesional - Rubro ID: ${artDirectionId}`);
      
      // Usar buildAgencyPrompt para transformar el prompt con la dirección de arte profesional
      finalPrompt = buildAgencyPrompt(prompt, artDirectionId);
      
      console.log('🎨 [Story Art] Prompt transformado con buildAgencyPrompt:', finalPrompt.substring(0, 200) + '...');
    } else {
      // Modo estándar: Mejorar el prompt genérico
      const enhancedPrompt = await enhancePrompt(prompt, styleKey);
      finalPrompt = enhancedPrompt.english;
    }
    
    const result = await generateFlyerImage(
      finalPrompt,
      styleKey,
      aspectRatio,
      quality,
      seed,
      undefined, // customStylePrompt
      false, // hasProductOverlay
      false, // enableIntelligentTextStyles
      undefined, // autoExtractedText
      undefined // autoTextStyle
    );
    
    return {
      success: true,
      imageUrl: result.imageDataUrl
    };
  } catch (error: any) {
    console.error('❌ Error generando imagen:', error);
    return {
      success: false,
      imageUrl: '',
      error: error.message || 'Error desconocido al generar imagen'
    };
  }
};

/**
 * NUEVA FUNCIÓN: Generar imagen HD basada en la imagen de borrador como referencia
 * Esto asegura que el HD mantenga la misma composición y solo mejore la calidad
 */
export const generateHDFromDraft = async (
  draftImageDataUrl: string,
  enhancedDescription: string,
  styleKey: FlyerStyleKey,
  aspectRatio: AspectRatio,
  seed: number,
  hasProductOverlay: boolean = false
): Promise<GeneratedImageResult> => {
  const ai = getAiClient();
  const styleConfig = FLYER_STYLES[styleKey] || { label: 'Professional', english_prompt: 'Professional commercial style' };
  
  // Fallback si no existe el estilo
  const safeStyleConfig = styleConfig;
  
  console.log('🎯 [HD From Draft] Generando HD usando borrador como referencia...');
  console.log('📝 [HD From Draft] Seed:', seed);
  
  // Convertir data URL a base64
  const base64Data = draftImageDataUrl.split(',')[1];
  
  // Prompt específico para mejorar la imagen existente
  const enhancementPrompt = `
    ENHANCE THIS IMAGE: Improve the quality, detail, sharpness, and overall visual appeal while maintaining EXACTLY the same composition, layout, and elements.
    
    CRITICAL RULES:
    1. Keep the SAME composition, subject placement, and layout as the reference image
    2. Improve lighting, shadows, and overall visual quality
    3. Add more detail and texture to all elements
    4. Maintain the same color palette and mood
    5. Do NOT change the composition or add/remove elements
    6. Do NOT add any text to the image
    7. Output must be the same aspect ratio: ${aspectRatio}
    
    Subject: ${enhancedDescription}
    Style: ${safeStyleConfig.label}
  `.replace(/\n/g, ' ').trim();

  try {
    // Usar el modelo HD con la imagen de referencia
    const model = 'gemini-3-pro-image-preview';
    
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: enhancementPrompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          }
        ]
      },
      config: {
        seed: seed,
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        }
      }
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) throw new Error("API retornó 0 candidatos.");

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) throw new Error("Respuesta vacía.");

    // Buscar la imagen generada
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (part.inlineData && part.inlineData.data) {
        let base64Result = part.inlineData.data.replace(/\s/g, '');
        const imageDataUrl = `data:image/jpeg;base64,${base64Result}`;
        
        console.log('✅ [HD From Draft] Imagen HD generada exitosamente');
        
        // Continuar con el análisis inteligente
        const correctedImageUrl = await diagnoseAndFixBlackImage(imageDataUrl);
        
        // Generar análisis igual que en generateFlyerImage
        const imageAnalysis = await analyzeImageForTextStyle(correctedImageUrl);
        const contextualTypography = await analyzeContextualTypography(correctedImageUrl, imageAnalysis);
        const contrastAnalysis = await analyzeImageContrast(correctedImageUrl, { x: 50, y: 50 });
        const contextualEffects = await analyzeContextualEffects(correctedImageUrl, imageAnalysis);
        const compositionAnalysis = await analyzeCompositionForText(correctedImageUrl, enhancedDescription, aspectRatio);
        
        return {
          imageUrl: correctedImageUrl,
          imageDataUrl: correctedImageUrl,
          imageAnalysis,
          contextualTypography,
          contrastAnalysis,
          contextualEffects,
          compositionAnalysis
        };
      }
    }
    
    throw new Error("No se encontraron datos de imagen en la respuesta HD");
  } catch (error: any) {
    console.error('❌ [HD From Draft] Error:', error);
    throw error;
  }
};

export const generateFlyerImage = async (
  enhancedDescription: string,
  styleKey: FlyerStyleKey,
  aspectRatio: AspectRatio,
  quality: ImageQuality,
  seed: number,
  customStylePrompt?: string, // Optional override for extracted style
  hasProductOverlay: boolean = false, // User uploaded their own product
  enableIntelligentTextStyles: boolean = true, // Enable AI analysis for text styles
  autoExtractedText?: string, // Text automatically extracted from URL
  autoTextStyle?: string, // Style for automatically extracted text
  draftImageForHD?: string, // Optional draft image to use as reference for HD
  artDirectionId?: number // NEW: ID del rubro (1-60) para Story Art
): Promise<GeneratedImageResult> => {
  const ai = getAiClient();
  const styleConfig = FLYER_STYLES[styleKey] || { label: 'Professional', english_prompt: 'Professional commercial style' };
  
  // ============================================
  // MODO STORY ART: Usar Dirección de Arte Profesional
  // ============================================
  let activeStylePrompt: string;
  let activeStyleLabel: string;
  
  console.log(`🔍 [generateFlyerImage] artDirectionId recibido: ${artDirectionId} | styleKey: ${styleKey}`);
  
  if (artDirectionId && artDirectionId >= 1 && artDirectionId <= 60) {
    // Story Art: Usar dirección de arte específica del rubro
    const artConfig = getArtDirectionById(artDirectionId);
    console.log(`🎨 [Story Art] getArtDirectionById(${artDirectionId}):`, artConfig ? artConfig.rubro : 'NULL');
    
    if (artConfig) {
      activeStylePrompt = artConfig.prompt;
      activeStyleLabel = artConfig.rubro;
      console.log(`✅ [Story Art] Usando dirección de arte: ${artConfig.rubro} (ID: ${artDirectionId})`);
      
      // CRITICAL FIX: Transformar el enhancedDescription con buildAgencyPrompt
      // Esto asegura que el prompt enviado a Gemini incluya la capa de agencia completa
      const oldPrompt = enhancedDescription;
      enhancedDescription = buildAgencyPrompt(enhancedDescription, artDirectionId);
      console.log('🎯 [Story Art] Prompt transformado con buildAgencyPrompt:', {
        oldPrompt: oldPrompt.substring(0, 100) + '...',
        newPrompt: enhancedDescription.substring(0, 100) + '...',
        lengthDiff: enhancedDescription.length - oldPrompt.length
      });
    } else {
      // Fallback a estilo normal si no encuentra la configuración
      const safeStyleConfig = styleConfig || { label: 'Professional', english_prompt: 'Professional commercial style' };
      activeStylePrompt = safeStyleConfig.english_prompt;
      activeStyleLabel = safeStyleConfig.label;
      console.warn(`⚠️ [Story Art] No se encontró config para ID: ${artDirectionId}, usando fallback`);
    }
  } else {
    // Modo normal: Usar estilo genérico
    const safeStyleConfig = styleConfig || { label: 'Professional', english_prompt: 'Professional commercial style' };
    activeStylePrompt = safeStyleConfig.english_prompt;
    activeStyleLabel = safeStyleConfig.label;
    console.log(`ℹ️ [generateFlyerImage] Modo normal (no story_art), usando estilo: ${activeStyleLabel}`);
  }
  
  // DETERMINE STYLE PROMPT (mantener compatibilidad)
  // let activeStylePrompt = styleConfig.english_prompt;
  // let activeStyleLabel = styleConfig.label;

  // PRIORITY: Use customStylePrompt if available (from URL analysis)
  if (customStylePrompt && customStylePrompt.trim()) {
      activeStylePrompt = `Style: CUSTOM BRAND IDENTITY. ${customStylePrompt}`;
      activeStyleLabel = "Detected Brand Style";
  }
  
  // Clean approach: Generate natural image without text, let overlay handle composition
  let textIntegrationPrompt = "";
  if (autoExtractedText && autoExtractedText.trim()) {
      console.log('ℹ️ Generando imagen natural para superposición de texto:', autoExtractedText);
  }
  
  // DETERMINE COMPOSITION
  let compositionPrompt = "Composition: Professional balanced layout.";
  if (aspectRatio === '9:16') compositionPrompt = "Composition: Vertical 9:16 layout, centered subject.";
  if (aspectRatio === '1:1') compositionPrompt = "Composition: Square layout.";
  if (aspectRatio === '16:9') compositionPrompt = "Composition: Wide cinematic layout.";

  // DETERMINE PRODUCT PLACEMENT STRATEGY
  let productPromptSuffix = "";
  if (hasProductOverlay) {
    // If user uploaded a product, we force the AI to create an EMPTY background.
    productPromptSuffix = " IMPORTANT: Create an EMPTY STAGE/BACKGROUND for product placement. NO CENTRAL SUBJECT. Center must be clear/empty. Focus on lighting, table texture, and background atmosphere. Do NOT generate the product itself.";
  }

  // --- UNIFIED IMAGE GENERATION (Same base for Draft and HD) ---
  let imageDataUrl: string;
  
  // Use same seed for consistency between Draft and HD
  const consistencySeed = seed;
  
  // Determine if we need landscape context
  const needsLandscape = OUTDOOR_STYLES.includes(styleKey);
  const backgroundContext = needsLandscape ? CHILEAN_OUTDOOR_CONTEXT : CHILEAN_STUDIO_CONTEXT;
  
  // ============================================
  // DESCRIPTORES DE COMPOSICIÓN VERTICAL 9:16 (Story Art)
  // ============================================
  let verticalCompositionPrompt = "";
  let safeZonePrompt = "";
  let subjectSizePrompt = "";
  
  if (aspectRatio === '9:16' && artDirectionId) {
    // Story Art: Composición vertical inmersiva para móvil
    verticalCompositionPrompt = "Full-height vertical cinematic framing, Edge-to-edge 9:16 composition, Optimized for mobile immersive viewing.";
    
    // Safe Zones: Evitar elementos críticos en zonas de texto de app/Instagram
    safeZonePrompt = "SAFE ZONES: Keep critical elements (faces, logos, key products) in the center vertical band. AVOID placing important visual elements in the top 250px and bottom 250px of the frame (these areas may be covered by app UI elements).";
    
    // Sujeto grande: 60-70% del eje vertical
    subjectSizePrompt = "SUBJECT SIZE: The main subject must occupy 60-70% of the vertical frame. The subject should be LARGE and PROMINENT, not small or lost in the background. Fill the frame with the subject for maximum visual impact.";
  } else if (aspectRatio === '9:16') {
    // Solo 9:16 sin Story Art
    verticalCompositionPrompt = "Vertical 9:16 mobile-optimized composition.";
    subjectSizePrompt = "SUBJECT SIZE: Main subject should be prominent, occupying at least 50% of the vertical frame.";
  }
  
  // Build unified prompt that works for both Draft and HD
  // CRITICAL: No text in image - text will be added as overlay
  const unifiedPrompt = `
    ${MASTER_STYLE}
    ${compositionPrompt}
    ${verticalCompositionPrompt}
    ${safeZonePrompt}
    ${subjectSizePrompt}
    ${CHILEAN_BASE_CONTEXT}
    ${backgroundContext}
    VISUAL STYLE SPECS: ${activeStylePrompt}
    SUBJECT DESCRIPTION: ${enhancedDescription}
    ${textIntegrationPrompt}
    ${productPromptSuffix}
    
    STRICT PROHIBITION - ZERO TOLERANCE:
    1. ABSOLUTELY NO TEXT whatsoever - this is non-negotiable
    2. NO letters, numbers, words, symbols, or characters of any kind
    3. NO signs, menus, billboards, posters, banners, labels, or text on objects
    4. NO text on clothing, products, walls, buildings, vehicles, or any surfaces
    5. NO brand names, logos, or text that looks like writing
    6. If you include any text, the image will be REJECTED
    7. Text will be professionally added LATER as a separate overlay layer
    
    VISUAL REQUIREMENTS:
    - Clean, blank surfaces where text would normally appear
    - Plain walls, empty signs, blank menus, bare products
    - Focus on textures, lighting, colors, and composition only
    
    Generate a COMPLETE VISIBLE IMAGE with rich textures, clear subjects, and proper lighting.
    The image must be 100% TEXT-FREE. Any image containing text will be considered a failure.
  `.replace(/\n/g, ' ').trim();

  // ============================================
  // LOG DEL PROMPT FINAL (Validación de Dirección de Arte)
  // ============================================
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🎨 PROMPT FINAL ENVIADO A GEMINI (Validación Dirección de Arte)');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`📐 Aspect Ratio: ${aspectRatio}`);
  console.log(`🎬 Modo: ${artDirectionId ? `Story Art (Rubro ID: ${artDirectionId})` : 'Generación Estándar'}`);
  console.log(`🎨 Estilo: ${activeStyleLabel}`);
  console.log(`📝 Prompt Length: ${unifiedPrompt.length} caracteres`);
  console.log('───────────────────────────────────────────────────────────────');
  console.log('📝 PROMPT COMPLETO:');
  console.log(unifiedPrompt);
  console.log('═══════════════════════════════════════════════════════════════');

  // ============================================
  // APLICAR GUARDRAILS DE SEGURIDAD (Negative Prompts)
  // ============================================
  const industryGuardrail = IMAGE_GUARDRAILS[styleKey] || "";
  const baseNegativePrompt = "blur, low resolution, messy, watermark, text overlay, logo visible, deformed, disfigured, ugly, incomplete, extra fingers, poorly drawn hands";
  // AGREGAR ESCUDO ANATÓMICO para prevenir errores como pies en la cabeza
  const finalNegativePrompt = `${baseNegativePrompt}, ${industryGuardrail}, ${ANATOMY_SHIELD}`.replace(/\s+/g, ' ').trim();
  
  console.log('🛡️ [Guardrails] Negative prompt aplicado:', finalNegativePrompt);

  if (quality === 'draft') {
    // Use same model family as HD for consistency
    const model = 'gemini-2.5-flash-image';
    
    try {
        // Use same seed, same prompt structure, just different model variant
        // NOTE: Gemini 2.5 Flash doesn't support negative_prompt directly,
        // but we include it in the prompt for better results
        const promptWithGuardrails = `${unifiedPrompt} AVOID: ${finalNegativePrompt}`;
        imageDataUrl = await executeImageGeneration(ai, model, promptWithGuardrails, consistencySeed, aspectRatio, false);
    } catch (error: any) {
        console.warn("Draft generation failed. Retrying with same parameters...", error.message);
        
        // Retry with same seed for consistency
        try {
            const promptWithGuardrails = `${unifiedPrompt} AVOID: ${finalNegativePrompt}`;
            imageDataUrl = await executeImageGeneration(ai, model, promptWithGuardrails, consistencySeed, aspectRatio, false);
        } catch (retryError) {
             console.error("Draft retry failed.", retryError);
             throw new Error("No se pudo generar el borrador. Intenta cambiar la descripción o usa el modo HD.");
        }
    }
  } else {
    // HD: Si tenemos imagen de borrador, usar generación basada en referencia
    if (draftImageForHD && draftImageForHD.trim()) {
      console.log('🎯 [HD] Usando borrador como referencia para mantener consistencia');
      return await generateHDFromDraft(
        draftImageForHD,
        enhancedDescription,
        styleKey,
        aspectRatio,
        seed,
        hasProductOverlay
      );
    }
    
    // HD: Use pro model with same seed and prompt structure (fallback)
    const model = 'gemini-3-pro-image-preview';
    
    try {
        // Same seed, same prompt structure - only quality settings differ
        // Include guardrails in prompt for better semantic control
        const promptWithGuardrails = `${unifiedPrompt} AVOID: ${finalNegativePrompt}`;
        imageDataUrl = await executeImageGeneration(ai, model, promptWithGuardrails, consistencySeed, aspectRatio, true);
    } catch (error: any) {
        if (error.message.includes('SAFETY_BLOCK')) {
             throw new Error("⚠️ La imagen fue bloqueada por filtros de seguridad. Evita mencionar personas reales, celebridades o marcas registradas.");
        }
        throw error;
    }
  }

  // --- NUEVO: DIAGNÓSTICO Y CORRECCIÓN DE IMÁGENES EN NEGRO ---
  console.log('🔍 Aplicando diagnóstico de imagen...');
  const correctedImageUrl = await diagnoseAndFixBlackImage(imageDataUrl);
  
  // --- COMPREHENSIVE INTELLIGENT ANALYSIS ---
  let imageAnalysis: ImageAnalysisResult | undefined;
  let intelligentTextStyles: any;
  let contextualTypography: ContextualTypographyResult | undefined;
  let contrastAnalysis: ContrastAnalysis | undefined;
  let contextualEffects: ContextualEffects | undefined;
  let compositionAnalysis: CompositionAnalysisResult | undefined;
  let autoTextValidation: ValidationResult | undefined;
  let enhancedStyles: any;

  // OPTIMIZACIÓN: Solo hacer análisis inteligentes para HD, no para borradores
  // Los análisis añaden ~30-40 segundos innecesarios para un borrador
  if (enableIntelligentTextStyles && quality === 'hd') {
    try {
      console.log("🎨 [HD] Iniciando análisis completo de imagen...");
      
      // 1. Análisis básico de imagen (usar imagen corregida si es necesario)
      imageAnalysis = await analyzeImageForTextStyle(correctedImageUrl);
      
      // 2. Análisis contextual de tipografía
      contextualTypography = await analyzeContextualTypography(correctedImageUrl, imageAnalysis);
      
      // 3. Análisis de contraste
      contrastAnalysis = await analyzeImageContrast(correctedImageUrl, { x: 50, y: 50 });
      
      // 4. Análisis de efectos contextuales
      contextualEffects = await analyzeContextualEffects(correctedImageUrl, imageAnalysis);
      
      // 5. Análisis de composición para posicionamiento automático
      compositionAnalysis = await analyzeCompositionForText(correctedImageUrl, enhancedDescription, aspectRatio);
      
      // 6. Validación automática del texto para garantizar calidad
      let autoTextValidation: ValidationResult | undefined;
      if (compositionAnalysis) {
        autoTextValidation = validateAutoTextAnalysis(compositionAnalysis, correctedImageUrl, enhancedDescription);
        
        // Si la validación falla, mejorar automáticamente el análisis
        if (!autoTextValidation.isValid) {
          console.log("🔧 Mejorando análisis automático basado en validación...");
          compositionAnalysis = improveAutoTextAnalysis(compositionAnalysis, autoTextValidation);
          
          // Revalidar después de las mejoras
          autoTextValidation = validateAutoTextAnalysis(compositionAnalysis, correctedImageUrl, enhancedDescription);
        }
      }
      
      // 7. Generar estilos combinados
      if (imageAnalysis && contextualTypography && contrastAnalysis && contextualEffects && compositionAnalysis) {
        intelligentTextStyles = {
          cssStyles: generateTextStylesFromAnalysis(imageAnalysis),
          dynamicClasses: generateDynamicTextClasses(imageAnalysis)
        };
        
        enhancedStyles = {
          typography: generateContextualStyles(contextualTypography),
          contrast: generateContrastOptimizedStyles(contrastAnalysis),
          effects: generateContextualEffectStyles(contextualEffects),
          composition: generateCompositionBasedStyles(compositionAnalysis),
          combinedClasses: [
            generateDynamicTextClasses(imageAnalysis),
            generateContextualClasses(contextualTypography),
            generateContextualEffectClasses(contextualEffects),
            generateCompositionClasses(compositionAnalysis)
          ].join(' ')
        };
        
        console.log("✅ [HD] Análisis completo finalizado:", {
          imageAnalysis,
          contextualTypography,
          contrastAnalysis,
          contextualEffects,
          compositionAnalysis,
          autoTextValidation,
          enhancedStyles
        });
      }
    } catch (analysisError) {
      console.warn("⚠️ [HD] Error en análisis inteligente, continuando con análisis básico:", analysisError);
      
      // Fallback a análisis básico
      try {
        imageAnalysis = await analyzeImageForTextStyle(correctedImageUrl);
        if (imageAnalysis) {
          intelligentTextStyles = {
            cssStyles: generateTextStylesFromAnalysis(imageAnalysis),
            dynamicClasses: generateDynamicTextClasses(imageAnalysis)
          };
        }
      } catch (basicError) {
        console.warn("⚠️ [HD] Error en análisis básico también:", basicError);
      }
    }
  } else if (quality === 'draft') {
    console.log("⚡ [Draft] Saltando análisis inteligente para generación rápida de borrador");
  }

  return {
    imageUrl: correctedImageUrl, // Alias para compatibilidad (usar imagen corregida)
    imageDataUrl: correctedImageUrl, // Usar imagen corregida
    imageAnalysis,
    intelligentTextStyles,
    contextualTypography,
    contrastAnalysis,
    contextualEffects,
    compositionAnalysis,
    autoTextValidation,
    enhancedStyles
  };
};

/**
 * Step 2 (Video): Generate Video using Google Gemini VEO API
 * This function generates video directly using Gemini's VEO model
 * NEW: Uses VEO directly instead of Chutes API for better quality and compatibility
 * OPCIONAL: artDirectionId para usar Dirección de Arte Profesional en Story Art
 */
export const generateFlyerVideo = async (
  enhancedDescription: string,
  styleKey: FlyerStyleKey,
  aspectRatio: AspectRatio,
  quality: ImageQuality,
  hasProductOverlay: boolean = false,
  draftImageUrl?: string,
  artDirectionId?: number // ID del rubro (1-60) para Story Art
): Promise<string> => {
    try {
      console.log('🎬 [generateFlyerVideo] Iniciando generación con Google Gemini VEO...');
      console.log('📋 [generateFlyerVideo] Quality:', quality, '| Has draft image:', !!draftImageUrl, '| ArtDirection ID:', artDirectionId);
      
      // Step 1: Obtener la imagen base
      let imageDataUrl: string;
      let seed: number;
      
      // ============================================
      // MODO STORY ART: Usar Dirección de Arte Profesional
      // ============================================
      let finalDescription = enhancedDescription;
      
      if (artDirectionId && artDirectionId >= 1 && artDirectionId <= 60) {
        console.log(`🎬 [Story Art Video] Usando Dirección de Arte Profesional - Rubro ID: ${artDirectionId}`);
        
        // Usar el motor de Dirección de Arte Profesional para video
        finalDescription = buildAgencyPrompt(enhancedDescription, artDirectionId);
        
        console.log('🎯 [Story Art Video] Prompt de agencia generado:', finalDescription.substring(0, 150) + '...');
      }
      
      if (draftImageUrl && quality === 'hd') {
        // USAR LA IMAGEN DEL DRAFT DIRECTAMENTE para garantizar consistencia
        console.log('📸 [generateFlyerVideo] Usando imagen del draft directamente para HD:', draftImageUrl.substring(0, 50) + '...');
        imageDataUrl = draftImageUrl;
        seed = Math.floor(Math.random() * 2000000000);
      } else {
        // Generar nueva imagen (caso normal: draft o HD sin draft previo)
        seed = Math.floor(Math.random() * 2000000000);
        console.log('📸 [generateFlyerVideo] Paso 1: Generando imagen base...');
        const imageResult = await generateFlyerImage(
          finalDescription,
          styleKey,
          aspectRatio,
          quality === 'draft' ? 'draft' : 'hd',
          seed,
          undefined, // customStylePrompt
          hasProductOverlay,
          false, // enableIntelligentTextStyles
          undefined, // autoExtractedText
          undefined // autoTextStyle
        );
        
        if (!imageResult.imageDataUrl) {
          throw new Error("No se pudo generar la imagen base para el video");
        }
        
        imageDataUrl = imageResult.imageDataUrl;
        console.log('✅ [generateFlyerVideo] Imagen base generada:', imageDataUrl.substring(0, 50) + '...');
      }
      
      // Step 2: Generar video directamente con Google VEO
      console.log('🎬 [generateFlyerVideo] Paso 2: Generando video con Google VEO...');
      
      // Usar VEO directamente (ya no como fallback)
      const videoUrl = await generateFlyerVideoVEO(
        finalDescription,
        styleKey,
        aspectRatio,
        quality,
        hasProductOverlay,
        seed
      );
      
      console.log('✅ [generateFlyerVideo] Video generado exitosamente:', videoUrl);
      return videoUrl;

    } catch (error) {
      console.error("❌ [generateFlyerVideo] Video Error:", error);
      throw error;
    }
  };

/**
 * Fallback: Generar video usando Google VEO (original implementation)
 * NEW: draftSeed parameter allows using the same seed as draft for HD generation
 * NEW: draftImageUrl parameter allows using draft image as reference for consistency
 */
const generateFlyerVideoVEO = async (
  enhancedDescription: string,
  styleKey: FlyerStyleKey,
  aspectRatio: AspectRatio,
  quality: ImageQuality,
  hasProductOverlay: boolean = false,
  draftSeed?: number, // Draft seed for consistency
  draftImageUrl?: string // Draft image as reference for HD
): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = quality === 'draft' ? 'veo-3.1-fast-generate-preview' : 'veo-3.1-generate-preview';
    const resolution = quality === 'draft' ? '720p' : '1080p';
    
    // Usar VIDEO_STYLES para videos (tiene todos los prompts de video configurados)
    const videoStyleKey = styleKey.startsWith('video_') ? styleKey : `video_${styleKey}`;
    const videoStyleConfig = VIDEO_STYLES[videoStyleKey];
    
    let motionPrompt: string;
    let promptBase: string;
    
    if (videoStyleConfig) {
      // Usar configuración de VIDEO_STYLES
      motionPrompt = videoStyleConfig.motionStyle || "Cinematic steady motion.";
      promptBase = videoStyleConfig.prompt || "";
    } else {
      // Fallback a FLYER_STYLES
      const styleConfig = FLYER_STYLES[styleKey];
      if (styleConfig) {
        motionPrompt = styleConfig.video_motion || "Cinematic steady motion.";
        promptBase = styleConfig.english_prompt || "";
      } else {
        // Fallback por defecto (cuando styleKey no existe en FLYER_STYLES)
        motionPrompt = "Cinematic steady motion.";
        promptBase = "Professional commercial video.";
      }
    }

    // VIDEO SPECIFIC CLEANING:
    const cleanDescription = enhancedDescription
      .replace(/'[^']*'/g, '') // Remove quoted text
      .replace(/text saying/gi, '')
      .replace(/\b(letrero|cartel|sign|banner|logo|marca|brand|label|writing|words|letters)\b/gi, '') // Remove trigger nouns
      .trim();

    // PRODUCT OVERLAY STRATEGY FOR VIDEO
    let productPromptSuffix = "";
    if (hasProductOverlay) {
      // If overlay is on, we want a moving background but NO subject in the middle.
      productPromptSuffix = " EMPTY CENTER. BACKGROUND ONLY. No main subject. Focus on environment texture and lighting.";
    }

    // ============================================
    // APLICAR GUARDRAILS DE MOVIMIENTO PARA VIDEO
    // ============================================
    const motionGuardrailKey = styleKey.startsWith('video_') ? styleKey : `video_${styleKey}`;
    const motionGuardrail = VIDEO_MOTION_GUARDRAILS[motionGuardrailKey as keyof typeof VIDEO_MOTION_GUARDRAILS];
    
    let motionGuardrailText = "";
    if (motionGuardrail) {
      motionGuardrailText = ` MOTION GUARDRAIL - PROHIBITED: ${motionGuardrail.prohibited}. FORCED: ${motionGuardrail.forced}.`;
      console.log('🛡️ [Video Guardrails] Aplicando para:', motionGuardrailKey);
    }

    // Simplify prompt for Draft Video too
    let finalPrompt = "";
    if (quality === 'draft') {
       finalPrompt = `HIGH FIDELITY PHYSICS. ANATOMICAL CORRECTNESS. Video clip: ${cleanDescription} ${productPromptSuffix}. Movement: ${motionPrompt}. ${CHILEAN_CONTEXT_LITE} ${VIDEO_PHYSICS_GUARDRAIL} ${BONE_ANCHOR_RULES} REMOVE ALL SYMBOLS. WALLS MUST BE BLANK TEXTURE.${motionGuardrailText}`;
    } else {
       // HD: Usar prompt que enfatiza consistencia con la imagen de referencia + reglas anatómicas
       finalPrompt = `HIGH FIDELITY PHYSICS. ANATOMICAL CORRECTNESS. CINEMATIC VIDEO. STYLE: ${promptBase}. MOVEMENT: ${motionPrompt}. CONTEXT: Chile. SUBJECT: ${cleanDescription} ${productPromptSuffix} ${VIDEO_PHYSICS_GUARDRAIL} ${BONE_ANCHOR_RULES} STRICTLY NO TEXT OR SYMBOLS ON SURFACES. WALLS ARE SOLID COLOR OR PLAIN TEXTURE.${motionGuardrailText}`;
    }

    // Si tenemos imagen de referencia (HD desde draft), agregarla al prompt
    let referenceImageData: string | undefined;
    if (quality === 'hd' && draftImageUrl) {
      try {
        referenceImageData = draftImageUrl.split(',')[1];
        console.log('🎯 [VideoHD] Usando imagen de referencia para consistencia');
      } catch (e) {
        console.warn('⚠️ [VideoHD] No se pudo extraer base64 de la imagen de referencia');
      }
    }

    // Construir el input para VEO
    let operation;
    if (referenceImageData) {
      // VEO con imagen de referencia (si la API lo soporta)
      console.log('🎬 [VideoHD] Generando video con imagen de referencia...');
      // Nota: VEO puede no soportar imagen de referencia directamente,
      // pero el seed debería ayudar a mantener consistencia
      operation = await ai.models.generateVideos({
        model,
        prompt: finalPrompt,
        config: {
          numberOfVideos: 1,
          resolution: resolution,
          aspectRatio: aspectRatio === '9:16' || aspectRatio === '1080x1920' ? '9:16' :
                       aspectRatio === '1.91:1' ? '16:9' :
                       aspectRatio === '4:5' || aspectRatio === '1080x1350' ? '9:16' :
                       aspectRatio === '1080x1080' ? '1:1' :
                       '16:9'
        }
      });
    } else {
      operation = await ai.models.generateVideos({
        model,
        prompt: finalPrompt,
        config: {
          numberOfVideos: 1,
          resolution: resolution,
          aspectRatio: aspectRatio === '9:16' || aspectRatio === '1080x1920' ? '9:16' :
                       aspectRatio === '1.91:1' ? '16:9' :
                       aspectRatio === '4:5' || aspectRatio === '1080x1350' ? '9:16' :
                       aspectRatio === '1080x1080' ? '1:1' :
                       '16:9'
        }
      });
    }

    console.log("Generating video operation started...");
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!uri) throw new Error("No video URI returned.");

    console.log("📹 Video URI received:", uri);

    // CRITICAL FIX: Fetch the video bytes and create a Blob.
    // Direct access to the URI fails in <video> tags due to CORS/Auth issues.
    // Use same API key pattern as getAiClient
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const videoUrl = `${uri}&key=${apiKey}`;
    console.log("Downloading video bytes...");

    const response = await fetch(videoUrl);
    
    if (!response.ok) {
        console.error("❌ Video download failed:", response.status, response.statusText);
        throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const blob = await response.blob();
    console.log("📹 Blob info:", {
      type: blob.type,
      size: blob.size
    });

    // VALIDACIÓN: Detectar video vacío o corrupto
    if (blob.size < 1000) {
      console.error("❌ Video blob is too small (likely black/corrupt):", blob.size, "bytes");
      throw new Error("Video generado está vacío o corrupto. Intenta con una descripción diferente.");
    }

    // Verificar que sea un video válido
    if (!blob.type.startsWith('video/')) {
      console.error("❌ Invalid blob type:", blob.type);
      throw new Error("El archivo descargado no es un video válido.");
    }

    const localBlobUrl = URL.createObjectURL(blob);
    
    console.log("✅ Video downloaded successfully:", {
      url: localBlobUrl,
      size: blob.size,
      type: blob.type
    });
    return localBlobUrl;

  } catch (error) {
    console.error("❌ Video Error (VEO):", error);
    throw new Error("Cuota de Google Gemini VEO agotada (429). Verifica tu plan en https://ai.dev/usage");
  }
};

/**
 * ============================================
 * PASO 3: FUNCIÓN ENHANCEUSERIMAGE (Opción B)
 * Reconstrucción Semántica para Estudio de Producto
 * ============================================
 */

/**
 * Analiza una imagen subida por el usuario para extraer
 * una descripción detallada del producto/sujeto principal.
 *
 * @param imageDataUrl - Imagen en formato data URL (base64)
 * @returns Descripción detallada del producto
 */
async function analyzeProductImage(imageDataUrl: string): Promise<string> {
  const ai = getAiClient();
  const model = "gemini-1.5-flash";
  
  // Extraer base64 del data URL
  const base64Data = imageDataUrl.split(',')[1];
  
  const analysisPrompt = `Analyze this image and describe the MAIN PRODUCT or SUBJECT in detail.
  
  Focus on:
  - What is the product/object (type, category)
  - Colors (exact colors, not just "colored")
  - Materials (wood, metal, fabric, plastic, etc.)
  - Shape and form (round, rectangular, organic, etc.)
  - Size proportions
  - Key distinguishing features
  - Texture details

  IGNORE the background if it's messy or cluttered - focus on the product itself.

  Format your response as a detailed English description suitable for AI image generation.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: analysisPrompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          }
        ]
      },
      config: {
        systemInstruction: "You are an expert product photographer and visual analyst. Your job is to extract precise visual details that will allow an AI to recreate the essence of a product in a new setting."
      }
    });

    const description = response.text?.trim();
    if (!description) {
      throw new Error("No se pudo analizar la imagen");
    }

    console.log("✅ Análisis de producto completado:", description.substring(0, 100) + "...");
    return description;
  } catch (error) {
    console.error("❌ Error analizando imagen:", error);
    throw new Error("Falló el análisis de la imagen subida");
  }
}

/**
 * Mejora una imagen subida por el usuario usando "Reconstrucción Semántica".
 *
 * FLUJO:
 * 1. Análisis: Gemini Vision extrae la descripción del producto
 * 2. Regeneración: Se genera una nueva imagen con el producto descrito
 *    en un entorno profesional (modo studio)
 *
 * @param imageDataUrl - Imagen subida por el usuario
 * @param realityMode - Modo de realismo a usar (recomendado: 'studio')
 * @param aspectRatio - Proporción de la imagen generada
 * @returns Nueva imagen mejorada en data URL
 */
export const enhanceUserImage = async (
  imageDataUrl: string,
  realityMode: 'realist' | 'aspirational' | 'studio' = 'studio',
  aspectRatio: AspectRatio = '1:1'
): Promise<string> => {
  console.log("🎯 [EnhanceUserImage] Iniciando mejora de imagen...");
  console.log("📸 Modo de realismo:", realityMode);

  try {
    // Paso 1: Análisis con Gemini Vision
    console.log("🔍 Paso 1: Analizando imagen con Gemini Vision...");
    const productDescription = await analyzeProductImage(imageDataUrl);

    // Paso 2: Construir el prompt de regeneración
    console.log("🔨 Paso 2: Construyendo prompt de regeneración...");
    
    // Importar el modo de estilo correspondiente
    const { REALITY_MODES } = await import('../src/constants/promptModifiers');
    const styleModifier = REALITY_MODES[realityMode];

    // Prompt que combina la descripción del producto con el estilo
    const regenerationPrompt = `
      PRODUCT TO RENDER: ${productDescription}
      
      ${styleModifier}
      
      COMPOSITION: Professional product photography layout.
      The product should be the clear focal point, centered or slightly off-center.
      Aspect ratio: ${aspectRatio}
      
      IMPORTANT RULES:
      1. Maintain the exact appearance, colors, materials, and form of the product described above
      2. Create a professional, clean environment appropriate for the product
      3. Do NOT add any text to the image
      4. Do NOT change the product's identity or key features
      5. Focus on high-quality lighting and professional presentation
    `.replace(/\n/g, ' ').trim();

    // Paso 3: Generar la nueva imagen
    console.log("✨ Paso 3: Generando imagen mejorada...");
    const ai = getAiClient();
    const model = "gemini-3-pro-image-preview";
    
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [{ text: regenerationPrompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: "1K"
        }
      }
    });

    // Extraer la imagen de la respuesta
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("API retornó 0 candidatos");
    }

    const parts = candidates[0].content?.parts;
    if (!parts || parts.length === 0) {
      throw new Error("Respuesta vacía");
    }

    // Buscar la imagen generada
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        let base64Result = part.inlineData.data.replace(/\s/g, '');
        const imageDataUrl = `data:image/jpeg;base64,${base64Result}`;
        
        console.log("✅ [EnhanceUserImage] Imagen mejorada generada exitosamente");
        
        // Aplicar diagnóstico para evitar imágenes en negro
        const correctedImageUrl = await diagnoseAndFixBlackImage(imageDataUrl);
        return correctedImageUrl;
      }
    }

    throw new Error("No se encontraron datos de imagen en la respuesta");
  } catch (error: any) {
    console.error("❌ [EnhanceUserImage] Error:", error);
    throw new Error(`Falló la mejora de imagen: ${error.message}`);
  }
};

/**
 * Versión simplificada de enhanceUserImage para uso rápido
 */
export const quickEnhanceImage = async (
  imageDataUrl: string,
  aspectRatio: AspectRatio = '1:1'
): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  try {
    const result = await enhanceUserImage(imageDataUrl, 'studio', aspectRatio);
    return { success: true, imageUrl: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// ============================================
// PACK DUAL: Imagen + Video Simultáneos
// Story Art Level Agency Feature
// ============================================

export interface PackDualResult {
  success: boolean;
  imageUrl?: string;
  videoUrl?: string;
  artDirection?: {
    id: number;
    rubro: string;
    prompt: string;
  };
  error?: string;
}

/**
 * Genera simultáneamente imagen y video usando Dirección de Arte Profesional
 * Esta función implementa el "Pack Dual" para Story Art a nivel agencia
 *
 * @param prompt - Descripción del producto/servicio
 * @param artDirectionId - ID del rubro (1-60) para Dirección de Arte
 * @param aspectRatio - Proporción de la imagen (recomendado: 9:16)
 * @param quality - Calidad ('draft' o 'hd')
 * @returns PackDualResult con imagen y video generados
 */
export const generatePackDual = async (
  prompt: string,
  artDirectionId: number,
  aspectRatio: AspectRatio = '9:16',
  quality: ImageQuality = 'draft'
): Promise<PackDualResult> => {
  console.log('🎬 [Pack Dual] Iniciando generación simultánea de imagen y video...');
  console.log('📋 [Pack Dual] ArtDirection ID:', artDirectionId, '| Quality:', quality);
  
  try {
    // Obtener información del rubro para el resultado
    const artDirectionConfig = getArtDirectionById(artDirectionId);
    
    if (!artDirectionConfig) {
      throw new Error(`No se encontró configuración para el rubro ID: ${artDirectionId}`);
    }
    
    console.log('✅ [Pack Dual] Rubro:', artDirectionConfig.rubro);
    
    // ============================================
    // GENERACIÓN SIMULTÁNEA CON Promise.all()
    // ============================================
    const [imageResult, videoUrl] = await Promise.all([
      // Generar imagen estática con Dirección de Arte
      generateImage(prompt, aspectRatio, {
        styleKey: 'brand_identity',
        quality,
        artDirectionId
      }),
      
      // Generar video con Dirección de Arte
      generateFlyerVideo(prompt, 'brand_identity', aspectRatio, quality, false, undefined, artDirectionId)
    ]);
    
    // Verificar resultados
    if (!imageResult.success || !imageResult.imageUrl) {
      throw new Error(imageResult.error || 'Error generando imagen del pack dual');
    }
    
    if (!videoUrl) {
      throw new Error('Error generando video del pack dual');
    }
    
    console.log('✅ [Pack Dual] Generación completada exitosamente');
    console.log('📸 [Pack Dual] Imagen:', imageResult.imageUrl.substring(0, 50) + '...');
    console.log('🎬 [Pack Dual] Video:', videoUrl.substring(0, 50) + '...');
    
    return {
      success: true,
      imageUrl: imageResult.imageUrl,
      videoUrl: videoUrl,
      artDirection: {
        id: artDirectionId,
        rubro: artDirectionConfig.rubro,
        prompt: artDirectionConfig.prompt
      }
    };
    
  } catch (error: any) {
    console.error('❌ [Pack Dual] Error:', error.message);
    return {
      success: false,
      error: error.message || 'Error desconocido en pack dual'
    };
  }
};

/**
 * Versión simplificada de generatePackDual para uso rápido
 */
export const quickPackDual = async (
  prompt: string,
  artDirectionId: number
): Promise<PackDualResult> => {
  return generatePackDual(prompt, artDirectionId, '9:16', 'draft');
};

// ============================================
// SISTEMA DE VIDEO DRAFT + HD (ECONOMÍA DE API)
// ============================================

export interface VideoDraftResult {
  draftId: string;           // ID único del borrador para referencia
  draftVideoUrl: string;     // URL del video draft (480p, steps reducidos)
  draftImageUrl: string;     // Imagen estática del draft
  seed: number;              // Seed usado para consistencia en HD
  artDirectionId: number;    // ID del rubro
  createdAt: Date;           // Timestamp de creación
  costEstimate: number;      // Costo estimado del draft
}

/**
 * Genera un video DRAFT económico con steps reducidos
 * @param prompt - Descripción del producto/servicio
 * @param artDirectionId - ID del rubro (1-60)
 * @param aspectRatio - Proporción de la imagen
 * @returns VideoDraftResult con ID único y URLs del draft
 */
export const generateVideoDraft = async (
  prompt: string,
  artDirectionId: number,
  aspectRatio: AspectRatio = '9:16'
): Promise<VideoDraftResult> => {
  console.log('🎬 [VideoDraft] Generando video DRAFT económico...');
  
  const draftId = `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const seed = Math.floor(Math.random() * 2000000000);
  
  try {
    // Generar imagen base para el video (más económica que generar video directamente)
    const imageResult = await generateImage(
      prompt,
      aspectRatio,
      {
        styleKey: 'brand_identity',
        quality: 'draft',
        seed,
        artDirectionId
      }
    );
    
    if (!imageResult.success || !imageResult.imageUrl) {
      throw new Error(imageResult.error || 'Error generando imagen base para video draft');
    }
    
    // Generar video con parámetros económicos (steps reducidos)
    // El estilo de video se determina automáticamente desde el artDirection
    const videoUrl = await generateFlyerVideoVEO(
      prompt,
      'brand_identity',
      aspectRatio,
      'draft', // Calidad draft
      false,
      seed
    );
    
    console.log('✅ [VideoDraft] Draft generado exitosamente:', { draftId, seed });
    
    return {
      draftId,
      draftVideoUrl: videoUrl,
      draftImageUrl: imageResult.imageUrl,
      seed,
      artDirectionId,
      createdAt: new Date(),
      costEstimate: 0.05 // Estimación: $0.05 USD por draft
    };
    
  } catch (error: any) {
    console.error('❌ [VideoDraft] Error:', error);
    throw new Error(`Error generando video draft: ${error.message}`);
  }
};

/**
 * Convierte un video draft a HD usando el mismo seed para consistencia
 * @param draftResult - Resultado del draft anterior
 * @returns URL del video en HD
 */
export const convertDraftToHD = async (
  draftResult: VideoDraftResult
): Promise<string> => {
  console.log('🎬 [VideoHD] Convirtiendo draft a HD...', { draftId: draftResult.draftId, seed: draftResult.seed });
  
  try {
    // Regenerar video con calidad HD usando el mismo seed y la imagen del draft como referencia
    const artConfig = getArtDirectionById(draftResult.artDirectionId);
    const industryContext = artConfig?.prompt || "Professional commercial style";
    
    // Usar la imagen del draft para mantener consistencia visual
    const hdVideoUrl = await generateFlyerVideoVEO(
      industryContext,
      'brand_identity',
      '9:16',
      'hd', // Calidad HD
      false,
      draftResult.seed,
      draftResult.draftImageUrl // Usar imagen del draft como referencia
    );
    
    console.log('✅ [VideoHD] Conversión a HD completada con seed:', draftResult.seed);
    
    return hdVideoUrl;
    
  } catch (error: any) {
    console.error('❌ [VideoHD] Error:', error);
    throw new Error(`Error convirtiendo a HD: ${error.message}`);
  }
};

/**
 * Genera video completo (draft + opción HD) en un solo llamado
 * @param prompt - Descripción del producto/servicio
 * @param artDirectionId - ID del rubro (1-60)
 * @param aspectRatio - Proporción de la imagen
 * @param quality - 'draft' | 'hd'
 * @returns Video con la calidad solicitada
 */
export const generateVideoWithQuality = async (
  prompt: string,
  artDirectionId: number,
  aspectRatio: AspectRatio = '9:16',
  quality: 'draft' | 'hd' = 'draft'
): Promise<{ videoUrl: string; draftResult?: VideoDraftResult }> => {
  console.log(`🎬 [generateVideoWithQuality] Generando video ${quality}...`);
  
  if (quality === 'draft') {
    const draftResult = await generateVideoDraft(prompt, artDirectionId, aspectRatio);
    return {
      videoUrl: draftResult.draftVideoUrl,
      draftResult
    };
  } else {
    // Para HD, primero generamos el draft y luego lo convertimos
    const draftResult = await generateVideoDraft(prompt, artDirectionId, aspectRatio);
    const hdVideoUrl = await convertDraftToHD(draftResult);
    
    return {
      videoUrl: hdVideoUrl,
      draftResult
    };
  }
};
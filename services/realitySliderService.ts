import { 
  RealityLevel, 
  RealityVariation, 
  RealitySliderState,
  RealityPromptConfig 
} from '../types';
import { 
  REALITY_CONFIGS, 
  getRealityConfig, 
  buildRealityPrompt,
  getRealityLevelValue 
} from './realityMapper';
import { 
  getProgressiveElementsForIndustry, 
  getForbiddenElementsForIndustry 
} from './progressiveElementsByIndustry';

/**
 * 🎚️ SERVICIO DE GESTIÓN DEL REGULADOR DE REALIDAD
 * 
 * Este servicio maneja:
 * - Caché local de variaciones generadas
 * - Persistencia en base de datos (cuando esté disponible)
 * - Generación bajo demanda con optimización de créditos
 * - Control de seed para consistencia visual
 */

// ============================================
// 💾 CACHÉ LOCAL (En memoria)
// ============================================

// Caché en memoria para variaciones (se pierde al recargar)
const localCache = new Map<string, RealityVariation[]>();

// Clave para localStorage - Usar la misma que cacheCleanerService
export const CACHE_KEY = 'reality_variations_cache';

/**
 * Genera una clave única para el caché basada en sceneId
 */
const getCacheKey = (sceneId: string): string => {
  return `scene_${sceneId}`;
};

/**
 * Obtiene las variaciones cacheadas para una scene
 * Valida que el sceneId coincida para evitar contaminación entre sesiones
 */
export const getCachedVariations = (sceneId: string): RealityVariation[] => {
  // ✅ CORRECCIÓN: Validar sceneId antes de procesar
  if (!sceneId || typeof sceneId !== 'string') {
    console.warn('⚠️ [Reality] sceneId inválido:', sceneId);
    return [];
  }
  
  const cacheKey = getCacheKey(sceneId);
  
  // Primero intentar localStorage
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const allVariations = JSON.parse(stored);
      const sceneVariations = allVariations[cacheKey] || [];
      
      // Filtrar solo variaciones del sceneId actual (validación extra de seguridad)
      const validVariations = sceneVariations.filter(
        (v: RealityVariation) => v.parent_scene_id === sceneId
      );
      
      // También mantener en memoria
      localCache.set(cacheKey, validVariations);
      
      return validVariations;
    }
  } catch (e) {
    console.warn('⚠️ Error leyendo caché de localStorage:', e);
  }
  
  // Fallback a memoria
  return localCache.get(cacheKey) || [];
};

/**
 * Guarda una variación en el caché con validación de sceneId
 * Cada generación vive en su propio "compartimento" estanco
 */
export const saveVariationToCache = (sceneId: string, variation: RealityVariation): void => {
  const cacheKey = getCacheKey(sceneId);
  
  // Actualizar memoria
  const existing = localCache.get(cacheKey) || [];
  
  // Filtrar: solo variaciones del mismo sceneId y mismo nivel de estrellas
  const filtered = existing.filter(
    (v: RealityVariation) => v.stars !== variation.stars || v.parent_scene_id !== sceneId
  );
  
  // Crear variación con sceneId explícito
  const newVariation = {
    ...variation,
    parent_scene_id: sceneId
  };
  
  const updated = [...filtered, newVariation];
  localCache.set(cacheKey, updated);
  
  // Persistir en localStorage
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    const allVariations = stored ? JSON.parse(stored) : {};
    allVariations[cacheKey] = updated;
    localStorage.setItem(CACHE_KEY, JSON.stringify(allVariations));
  } catch (e) {
    console.warn('⚠️ Error guardando caché en localStorage:', e);
  }
};

/**
 * Obtiene una variación específica del caché
 */
export const getCachedVariation = (
  sceneId: string, 
  stars: RealityLevel
): RealityVariation | null => {
  const variations = getCachedVariations(sceneId);
  return variations.find(v => v.stars === stars) || null;
};

/**
 * Verifica si una variación existe en caché
 */
export const hasCachedVariation = (
  sceneId: string, 
  stars: RealityLevel
): boolean => {
  return getCachedVariation(sceneId, stars) !== null;
};

/**
 * Limpia el caché para una scene específica
 */
export const clearSceneCache = (sceneId: string): void => {
  const cacheKey = getCacheKey(sceneId);
  localCache.delete(cacheKey);
  
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const allVariations = JSON.parse(stored);
      delete allVariations[cacheKey];
      localStorage.setItem(CACHE_KEY, JSON.stringify(allVariations));
    }
  } catch (e) {
    console.warn('⚠️ Error limpiando caché:', e);
  }
};

/**
 * Limpia todo el caché de realidad (útil para reset completo)
 */
export const clearAllRealityCache = (): void => {
  localCache.clear();
  localStorage.removeItem(CACHE_KEY);
  console.log('🧹 Todo el caché de realidad ha sido limpiado');
};

/**
 * Limpia todo el caché de variaciones en memoria
 */
export const clearMemoryCache = (): void => {
  localCache.clear();
};

// ============================================
// 🎲 CONTROL DE SEED (Consistencia visual)
// ============================================

/**
 * Genera un seed aleatorio para nuevas escenas
 */
export const generateNewSeed = (): number => {
  return Math.floor(Math.random() * 2000000000);
};

/**
 * Genera un ID único para una scene
 */
export const generateSceneId = (): string => {
  return `scene_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================
// 🔄 LÓGICA DE SLIDER INTELIGENTE
// ============================================

/**
 * Estado inicial del slider
 */
export const createInitialSliderState = (
  initialStars: RealityLevel = 2.5,
  sceneId?: string
): RealitySliderState => {
  const id = sceneId || generateSceneId();
  const seed = generateNewSeed();
  
  return {
    currentStars: initialStars,
    currentSeed: seed,
    sceneId: id,
    variations: [],
    isLoadingVariation: false,
    loadingVariationId: null
  };
};

/**
 * Maneja el cambio de estrellas con caché inteligente
 */
export const handleStarsChange = async (
  currentState: RealitySliderState,
  newStars: RealityLevel,
  generateCallback: (stars: RealityLevel, seed: number) => Promise<string>
): Promise<{
  newState: RealitySliderState;
  imageUrl: string;
  fromCache: boolean;
}> => {
  const { sceneId, currentSeed, variations } = currentState;
  
  // 1. Verificar si ya existe en caché
  const cached = getCachedVariation(sceneId, newStars);
  
  if (cached) {
    console.log(`✅ [RealitySlider] Variación ${newStars} encontrada en caché`);
    
    // Actualizar estado
    const newState: RealitySliderState = {
      ...currentState,
      currentStars: newStars,
      variations: [...variations, cached]
    };
    
    return {
      newState,
      imageUrl: cached.image_url,
      fromCache: true
    };
  }
  
  // 2. Si no está en caché, generar nueva variación
  console.log(`🎨 [RealitySlider] Generando nueva variación ${newStars} (seed: ${currentSeed})`);
  
  try {
    const imageUrl = await generateCallback(newStars, currentSeed);
    
    // Crear nueva variación
    const newVariation: RealityVariation = {
      id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      parent_scene_id: sceneId,
      seed: currentSeed,
      stars: newStars,
      image_url: imageUrl,
      prompt_used: getRealityConfig(newStars).description,
      created_at: new Date(),
      cached: false
    };
    
    // Guardar en caché con sceneId explícito
    saveVariationToCache(sceneId, newVariation);
    
    // Actualizar estado
    const newState: RealitySliderState = {
      ...currentState,
      currentStars: newStars,
      variations: [...variations, newVariation]
    };
    
    return {
      newState,
      imageUrl,
      fromCache: false
    };
  } catch (error) {
    console.error('❌ [RealitySlider] Error generando variación:', error);
    throw error;
  }
};

/**
 * Genera todas las variaciones posibles para una scene
 * Útil para pre-cargar el caché
 */
export const generateAllVariations = async (
  sceneId: string,
  seed: number,
  generateCallback: (stars: RealityLevel, seed: number) => Promise<string>,
  levels: RealityLevel[] = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]
): Promise<RealityVariation[]> => {
  const variations: RealityVariation[] = [];
  
  for (const stars of levels) {
    if (hasCachedVariation(sceneId, stars)) {
      const cached = getCachedVariation(sceneId, stars);
      if (cached) variations.push(cached);
      continue;
    }
    
    try {
      const imageUrl = await generateCallback(stars, seed);
      
      const variation: RealityVariation = {
        id: `var_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        parent_scene_id: sceneId,
        seed,
        stars,
        image_url: imageUrl,
        prompt_used: getRealityConfig(stars).description,
        created_at: new Date(),
        cached: false
      };
      
      saveVariationToCache(sceneId, variation);
      variations.push(variation);
      
      // Pequeño delay entre generaciones para no saturar
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`❌ Error generando variación ${stars}:`, error);
    }
  }
  
  return variations;
};

// ============================================
// 📊 UTILIDADES DE ANÁLISIS
// ============================================

/**
 * Obtiene el porcentaje de variaciones cacheadas
 */
export const getCachePercentage = (sceneId: string): number => {
  const cached = getCachedVariations(sceneId);
  const totalLevels = 9; // 1.0 a 5.0 en pasos de 0.5
  return (cached.length / totalLevels) * 100;
};

/**
 * Obtiene las variaciones faltantes (no cacheadas)
 */
export const getMissingVariations = (
  sceneId: string,
  levels: RealityLevel[] = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]
): RealityLevel[] => {
  const cached = getCachedVariations(sceneId);
  const cachedStars = new Set(cached.map(v => v.stars));
  
  return levels.filter(stars => !cachedStars.has(stars));
};

/**
 * Obtiene la variación con mejor relación cache/calidad
 * (recomienda generar las que faltan en orden de utilidad)
 */
export const getOptimalGenerationOrder = (
  sceneId: string
): RealityLevel[] => {
  // Orden recomendado: 2.5 (default), 3.0, 2.0, 3.5, 1.5, 4.0, 1.0, 4.5, 5.0
  const recommendedOrder: RealityLevel[] = [2.5, 3.0, 2.0, 3.5, 1.5, 4.0, 1.0, 4.5, 5.0];
  const missing = getMissingVariations(sceneId, recommendedOrder);
  
  return missing;
};

// ============================================
// 🎯 INTEGRACIÓN CON GEMINI
// ============================================

/**
 * Determina si se debe usar la imagen de referencia
 * CRÍTICO: SIEMPRE usar imagen de referencia para mantener composición consistente
 * Solo el prompt cambia para ajustar el nivel de realismo fotográfico
 */
export const shouldUseReferenceImage = (stars: RealityLevel): boolean => {
  // SIEMPRE usar referencia para mantener la misma composición, pose, y escena
  // El nivel de realismo se controla solo con el prompt
  return true;
};

/**
 * Construye el prompt final para Gemini con el nivel de realidad
 */
export const buildGeminiPromptWithReality = (
  basePrompt: string,
  stars: RealityLevel,
  additionalNegative?: string
): string => {
  const realityBlock = buildRealityPrompt(basePrompt, stars, false);
  const negativePrompt = getRealityConfig(stars).negative;
  
  let fullPrompt = realityBlock;
  
  if (additionalNegative) {
    fullPrompt += `\n\nADDITIONAL_NEGATIVE: ${additionalNegative}`;
  }
  
  fullPrompt += `\n\nSTRICT_AVOID: ${negativePrompt}`;
  
  return fullPrompt;
};

/**
 * Genera el prompt de "fuerza" con prefijo MODE al inicio
 * El orden es clave: Realidad > Sujeto > Elementos Progresivos por Industria > Escudo Anti-Texto
 */
export const buildPowerPromptWithReality = (
  basePrompt: string,
  stars: RealityLevel,
  industryId?: number // 🎨 NUEVO: ID del rubro (1-60) para elementos específicos
): string => {
  const levelKey: RealityLevel = Math.round(stars * 2) / 2 as RealityLevel;
  const config = getRealityConfig(levelKey);
  const negativePrompt = getRealityConfig(stars).negative;
  
  // 🎨 Obtener elementos progresivos por industria
  const progressiveElements = getProgressiveElementsForIndustry(levelKey, industryId);
  const forbiddenElements = getForbiddenElementsForIndustry(levelKey, industryId);
  
  // El bloqueo de texto siempre va primero en las reglas negativas
  const textBlock = 'text, letters, words, typography, signature, watermark, text overlay, captions, titles, menu boards, price tags, signs, billboards, posters, written characters';
  
  // Combinar elementos prohibidos específicos de la industria con el negative prompt general
  const combinedNegative = `${textBlock}, ${forbiddenElements.join(', ')}, ${negativePrompt}`;
  
  return `
    [MODE: ${config.label.toUpperCase()} PHOTO]
    A raw, authentic photography of ${basePrompt}.
    STERN RULES: NO TEXT, NO LETTERS, NO TYPOGRAPHY.
    ${config.lighting}
    ${config.atmosphere}
    ${config.camera}
    ${config.human}
    
    ${progressiveElements}
    
    AVOID: ${combinedNegative}
  `.trim();
};

/**
 * Genera una imagen con nivel de realidad específico
 * Wrapper para la función de generación de Gemini
 */
export const generateWithReality = async (
  basePrompt: string,
  stars: RealityLevel,
  generateFn: (prompt: string) => Promise<string>,
  additionalNegative?: string
): Promise<string> => {
  const fullPrompt = buildGeminiPromptWithReality(basePrompt, stars, additionalNegative);
  return generateFn(fullPrompt);
};

// ============================================
// 💾 PERSISTENCIA EN BASE DE DATOS (FUTURO)
// ============================================

/**
 * Guarda variaciones en Supabase (cuando esté implementado)
 */
export const saveVariationsToDatabase = async (
  variations: RealityVariation[],
  userId: string
): Promise<void> => {
  // TODO: Implementar cuando esté disponible el servicio de Supabase
  console.log('💾 [RealitySlider] Guardando variaciones en BD:', variations.length);
  
  // Estructura esperada para la tabla:
  // INSERT INTO reality_variations (id, parent_scene_id, seed, stars, image_url, prompt_used, created_at, user_id)
  // VALUES (...)
};

/**
 * Carga variaciones desde Supabase
 */
export const loadVariationsFromDatabase = async (
  sceneId: string,
  userId: string
): Promise<RealityVariation[]> => {
  // TODO: Implementar cuando esté disponible el servicio de Supabase
  console.log('📂 [RealitySlider] Cargando variaciones desde BD para scene:', sceneId);
  
  // SELECT * FROM reality_variations WHERE parent_scene_id = ? AND user_id = ?
  return [];
};

// ============================================
// 📈 ESTADÍSTICAS Y DEBUG
// ============================================

/**
 * Obtiene estadísticas del caché
 */
export const getCacheStats = (): {
  totalScenes: number;
  totalVariations: number;
  oldestVariation: Date | null;
  newestVariation: Date | null;
} => {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) {
      return { totalScenes: 0, totalVariations: 0, oldestVariation: null, newestVariation: null };
    }
    
    const allVariations = JSON.parse(stored) as Record<string, RealityVariation[]>;
    const allValues = Object.values(allVariations);
    const all: RealityVariation[] = allValues.flat() as RealityVariation[];
    
    if (all.length === 0) {
      return { totalScenes: 0, totalVariations: 0, oldestVariation: null, newestVariation: null };
    }
    
    const dates = all.map(v => new Date(v.created_at).getTime());
    
    return {
      totalScenes: Object.keys(allVariations).length,
      totalVariations: all.length,
      oldestVariation: new Date(Math.min(...dates)),
      newestVariation: new Date(Math.max(...dates))
    };
  } catch (e) {
    return { totalScenes: 0, totalVariations: 0, oldestVariation: null, newestVariation: null };
  }
};

/**
 * Limpia caché antiguo (más de 24 horas)
 */
export const cleanOldCache = (): number => {
  const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
  let cleaned = 0;
  
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) return 0;
    
    const allVariations = JSON.parse(stored) as Record<string, RealityVariation[]>;
    const keysToDelete: string[] = [];
    
    for (const [key, variations] of Object.entries(allVariations)) {
      const recentVariations = variations.filter(v => {
        const createdAt = new Date(v.created_at).getTime();
        const isRecent = createdAt > oneDayAgo;
        if (!isRecent) cleaned++;
        return isRecent;
      });
      
      if (recentVariations.length === 0) {
        keysToDelete.push(key);
      } else {
        allVariations[key] = recentVariations;
      }
    }
    
    keysToDelete.forEach(key => delete allVariations[key]);
    localStorage.setItem(CACHE_KEY, JSON.stringify(allVariations));
    
    // Limpiar memoria también
    keysToDelete.forEach(key => localCache.delete(key));
    
  } catch (e) {
    console.warn('⚠️ Error limpiando caché antiguo:', e);
  }
  
  return cleaned;
};
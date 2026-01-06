/**
 * 🎚️ SERVICIO DE LIMPIEZA DE CACHÉ - GARBAGE COLLECTOR
 *
 * Este servicio limpia automáticamente el localStorage para evitar saturación
 * del almacenamiento del navegador (límite ~5MB-10MB).
 *
 * Las imágenes en Base64 son pesadas, por lo que necesitamos:
 * - Eliminar variaciones expiradas (>24 horas)
 * - Eliminar sesiones antiguas
 * - Mantener solo datos relevantes
 */

import { CACHE_KEY } from './realitySliderService';
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 Horas

/**
 * Limpia variaciones antiguas del caché de realidad
 * @returns Número de claves eliminadas
 */
export const cleanOldVariations = (): number => {
  const now = Date.now();
  let keysDeleted = 0;
  let totalSpaceSaved = 0;

  try {
    const stored = localStorage.getItem(CACHE_KEY);
    
    if (!stored) {
      console.log('🧹 Cache Cleaner: No hay caché que limpiar');
      return 0;
    }

    const allVariations = JSON.parse(stored) as Record<string, any[]>;
    const keysToDelete: string[] = [];

    for (const [key, variations] of Object.entries(allVariations)) {
      // Verificar si es una clave de scene
      if (key.startsWith('scene_')) {
        try {
          // Si el caché está vacío o es inválido, marcar para borrar
          if (!Array.isArray(variations) || variations.length === 0) {
            keysToDelete.push(key);
            continue;
          }

          // Verificar la fecha de la última variación
          const lastUpdate = new Date(variations[variations.length - 1].created_at).getTime();
          const ageMs = now - lastUpdate;

          // Calcular tamaño aproximado
          const sizeBytes = JSON.stringify(variations).length * 2; // UTF-16

          if (ageMs > MAX_AGE_MS) {
            keysToDelete.push(key);
            totalSpaceSaved += sizeBytes;
            console.log(`🧹 Cache Cleaner: Sesión ${key.substring(0, 20)}... eliminada (${Math.round(ageMs / 3600000)}h vieja)`);
          }
        } catch (e) {
          // Si el JSON está corrupto, limpiar esa llave
          keysToDelete.push(key);
          console.warn(`🧹 Cache Cleaner: Datos corruptos en ${key}, eliminando`);
        }
      }
    }

    // Eliminar claves marcadas
    if (keysToDelete.length > 0) {
      keysToDelete.forEach(key => {
        delete allVariations[key];
        keysDeleted++;
      });

      // Guardar el caché limpio
      localStorage.setItem(CACHE_KEY, JSON.stringify(allVariations));
      
      // Mostrar resumen
      const spaceSavedKB = Math.round(totalSpaceSaved / 1024);
      console.log(`✅ Cache Cleaner: Se eliminaron ${keysDeleted} sesiones antiguas. Espacio liberado: ~${spaceSavedKB}KB`);
    } else {
      console.log('✅ Cache Cleaner: Caché limpio, no hay datos expirados');
    }

  } catch (e) {
    console.error('❌ Cache Cleaner: Error al limpiar caché:', e);
  }

  return keysDeleted;
};

/**
 * Obtiene estadísticas del caché actual
 */
export const getCacheStats = (): {
  totalSessions: number;
  totalVariations: number;
  oldestVariation: Date | null;
  newestVariation: Date | null;
  estimatedSizeKB: number;
} => {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    
    if (!stored) {
      return { totalSessions: 0, totalVariations: 0, oldestVariation: null, newestVariation: null, estimatedSizeKB: 0 };
    }

    const allVariations = JSON.parse(stored) as Record<string, any[]>;
    const allItems = Object.values(allVariations).flat();
    
    if (allItems.length === 0) {
      return { totalSessions: 0, totalVariations: 0, oldestVariation: null, newestVariation: null, estimatedSizeKB: 0 };
    }

    const dates = allItems.map((v: any) => new Date(v.created_at).getTime());
    const estimatedSizeKB = Math.round(JSON.stringify(allVariations).length / 1024);

    return {
      totalSessions: Object.keys(allVariations).length,
      totalVariations: allItems.length,
      oldestVariation: new Date(Math.min(...dates)),
      newestVariation: new Date(Math.max(...dates)),
      estimatedSizeKB
    };
  } catch (e) {
    console.error('❌ Error obteniendo estadísticas de caché:', e);
    return { totalSessions: 0, totalVariations: 0, oldestVariation: null, newestVariation: null, estimatedSizeKB: 0 };
  }
};

/**
 * Limpia TODO el caché de realidad (para reset completo)
 */
export const clearAllRealityCache = (): void => {
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('🧹 Todo el caché de realidad ha sido eliminado');
  } catch (e) {
    console.error('❌ Error al limpiar todo el caché:', e);
  }
};

/**
 * Ejecuta la limpieza automática al inicio de la app
 * Llama esta función en el useEffect principal de App.tsx
 */
export const runAutoCleanup = (): void => {
  const stats = getCacheStats();
  
  if (stats.estimatedSizeKB > 500) {
    // Si el caché supera 500KB, forzar limpieza
    console.log('⚠️ Caché de realidad excede 500KB, ejecutando limpieza...');
    cleanOldVariations();
  } else {
    // Limpiar solo datos expirados
    cleanOldVariations();
  }
  
  // Log del estado actual
  const newStats = getCacheStats();
  console.log('📊 Estado del caché de realidad:', {
    sesiones: newStats.totalSessions,
    variaciones: newStats.totalVariations,
    tamaño: `${newStats.estimatedSizeKB}KB`
  });
};
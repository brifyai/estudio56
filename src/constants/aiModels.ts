/**
 * 📊 Constantes de Modelos AI - Estudio 56
 * 
 * IDs técnicos para Google Vertex AI.
 * IMPORTANTE: Usar sufijos -001 para evitar actualizaciones automáticas
 * que puedan incrementar costos.
 */

// ============================================
// 🎯 MODELOS DE BAJO COSTO (Flash / Fast)
// ============================================

export const MODELS = {
  // Gemini 2.0 Flash - Multimodal (Razonamiento + Visión)
  // Usado para: Análisis de imágenes, orquestación de lógica
  ORCHESTRATOR: 'gemini-2.0-flash-001',
  ANALYZER: 'gemini-2.0-flash-001',
  
  // Imagen 3 Capability - Generación de imágenes (modelo actualizado)
  // Costo: ~$0.02 USD por imagen
  // Usado para: Borradores y HD (mismo modelo para ambas calidades)
  DRAFT_ENGINE: 'imagen-3.0-capability-001',

  // ============================================
  // 💎 MODELOS PREMIUM (Pro / Veo)
  // ============================================

  // Imagen 3 Capability - Alta fidelidad HD
  // Usado para: Versiones finales, exportación HD/4K
  HD_ENGINE: 'imagen-3.0-capability-001',

  // Veo 1.0 - Generación de video
  // Usado para: Motion graphics, video ads
  VIDEO_ENGINE: 'veo-1.0-preview-001'
} as const;

// ============================================
// 🏷️ ALIAS PARA COMPATIBILIDAD
// ============================================

export const MODEL_ALIASES = {
  FAST: MODELS.DRAFT_ENGINE,
  PRO: MODELS.HD_ENGINE,
  VIDEO: MODELS.VIDEO_ENGINE,
  GEMINI: MODELS.ORCHESTRATOR
} as const;

// ============================================
// ⚙️ CONFIGURACIÓN DE REGIONES
// ============================================

export const VERTEX_AI_CONFIG = {
  // Región recomendada para estos modelos
  LOCATION: 'us-central1',
  // Proyecto de GCP
  PROJECT_ID: import.meta.env.VITE_GCP_PROJECT_ID || 'estudio-56-prod',
  // Timeout para generaciones (ms)
  TIMEOUT: 60000,
  // Número máximo de reintentos
  MAX_RETRIES: 3
} as const;

// ============================================
// 📋 HELPERS
// ============================================

export const isDraftModel = (modelId: string): boolean => {
  return modelId === MODELS.DRAFT_ENGINE;
};

export const isProModel = (modelId: string): boolean => {
  return modelId === MODELS.HD_ENGINE;
};

export const getModelDisplayName = (modelId: string): string => {
  const names: Record<string, string> = {
    [MODELS.ORCHESTRATOR]: 'Gemini 2.0 Flash',
    'imagen-3.0-capability-001': 'Imagen 3 Capability',
    [MODELS.VIDEO_ENGINE]: 'Veo 1.0'
  };
  return names[modelId] || modelId;
};
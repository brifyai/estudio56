/**
 * Servicio para construir prompts estructurados para Gemini.
 * Separa el "sujeto" (qué) del "estilo" (cómo) para tener control
 * sobre el nivel de realismo de las imágenes generadas.
 *
 * MÓDULO DE DIRECCIÓN DE ARTE PROFESIONAL (Rubros 1-20):
 * Implementa la estructura: Asset Procesado + Dirección de Arte Específica
 * + Composición Social Media (9:16) + Guardrail Negativo
 */

import {
  REALITY_MODES,
  REALITY_MODE_LABELS,
  FORBIDDEN_KEYWORDS,
  type RealityMode
} from '../constants/promptModifiers';
import {
  ART_DIRECTION_PROMPTS,
  AGENCY_NEGATIVE_PROMPT,
  SOCIAL_MEDIA_SAFE_ZONE,
  type ArtDirectionConfig,
  getArtDirectionById,
  findArtDirectionByName,
  isValidArtDirectionId,
  type ArtDirectionInput
} from '../constants/artDirection';

/**
 * Input para construir un prompt
 */
export interface PromptInput {
  /** Descripción del rubro/negocio limpia, sin adjetivos de estilo */
  industryBase: string;
  /** Detalles adicionales del usuario (nombre, promoción, etc.) */
  userDetails: string;
  /** Modo de realismo seleccionado */
  realityMode: RealityMode;
}

/**
 * Sanitiza el input del usuario para prevenir inyecciones de prompt
 * y contenido inapropiado.
 */
function sanitizeInput(text: string): string {
  if (!text) return '';
  
  let sanitized = text
    // Eliminar caracteres especiales que podrían romper el prompt
    .replace(/[{}[\]()#%^&=|\\]/g, '')
    // Normalizar espacios múltiples
    .replace(/\s+/g, ' ')
    .trim();

  // Verificar palabras prohibidas (case insensitive)
  const lowerText = sanitized.toLowerCase();
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      console.warn(`Prompt bloqueado por palabra prohibida: ${keyword}`);
      return '[CONTENIDO_BLOQUEADO]';
    }
  }

  return sanitized;
}

/**
 * Construye un prompt estructurado para Gemini.
 * Garantiza que el estilo se respete correctamente separándolo del sujeto.
 * 
 * @param input - Objeto con industryBase, userDetails y realityMode
 * @returns Prompt estructurado listo para enviar a Gemini
 */
export function buildPrompt(input: PromptInput): string {
  const { industryBase, userDetails, realityMode } = input;

  // Sanitizar inputs
  const cleanIndustry = sanitizeInput(industryBase);
  const cleanDetails = sanitizeInput(userDetails);

  if (cleanIndustry === '[CONTENIDO_BLOQUEADO]' || cleanDetails === '[CONTENIDO_BLOQUEADO]') {
    throw new Error('El contenido fue bloqueado por políticas de seguridad');
  }

  // Obtener el modificador de estilo correspondiente
  const styleModifier = REALITY_MODES[realityMode];

  // Construir el prompt de forma estructurada
  const promptParts: string[] = [];

  // Parte 1: Sujeto principal (qué es el negocio)
  promptParts.push(`SUBJECT: ${cleanIndustry}`);
  
  // Parte 2: Detalles adicionales
  if (cleanDetails) {
    promptParts.push(`DETAILS: ${cleanDetails}`);
  }

  // Parte 3: Instrucciones de estilo (cómo debe verse)
  promptParts.push(styleModifier);

  // Parte 4: Formato de salida esperado
  promptParts.push(`OUTPUT_FORMAT: Professional flyer/advertisement image suitable for social media marketing in Chile.`);

  return promptParts.join('\n\n');
}

/**
 * Genera un prompt simplificado para modos rápidos
 * @param subject - El sujeto principal
 * @param realityMode - El modo de realismo
 * @returns Prompt simplificado
 */
export function buildSimplePrompt(subject: string, realityMode: RealityMode): string {
  const styleModifier = REALITY_MODES[realityMode];
  return `${subject}\n\n${styleModifier}`;
}

/**
 * Valida que el modo de realismo sea válido
 */
export function isValidRealityMode(mode: string): mode is RealityMode {
  return mode in REALITY_MODES;
}

/**
 * Obtiene la etiqueta legible para un modo de realismo
 */
export function getRealityModeLabel(mode: RealityMode): string {
  return REALITY_MODE_LABELS[mode];
}

// ============================================
// DIRECCIÓN DE ARTE PROFESIONAL (Rubros 1-20)
// ============================================

/**
 * Construye un prompt de Dirección de Arte profesional para un rubro específico.
 * Estructura: Asset Procesado + Dirección de Arte Específica + Composición Social Media + Guardrail Negativo
 *
 * @param input - Objeto con industryId, userSubject y userDetails
 * @returns Prompt estructurado listo para enviar a Gemini
 */
export function buildArtDirectionPrompt(input: ArtDirectionInput): string {
  const { industryId, userSubject, userDetails } = input;
  
  // Obtener configuración de dirección de arte
  const artConfig = getArtDirectionById(industryId);
  
  if (!artConfig) {
    throw new Error(`No se encontró dirección de arte para el rubro ID: ${industryId}`);
  }
  
  // Sanitizar inputs
  const cleanSubject = sanitizeInput(userSubject);
  const cleanDetails = userDetails ? sanitizeInput(userDetails) : '';
  
  if (cleanSubject === '[CONTENIDO_BLOQUEADO]') {
    throw new Error('El contenido fue bloqueado por políticas de seguridad');
  }
  
  // Construir el prompt de dirección de arte
  const promptParts: string[] = [];
  
  // Parte 1: Asset Procesado (Estudio de Producto)
  promptParts.push(`ASSET: ${cleanSubject}`);
  
  // Parte 2: Detalles adicionales del usuario
  if (cleanDetails) {
    promptParts.push(`PRODUCT_DETAILS: ${cleanDetails}`);
  }
  
  // Parte 3: Dirección de Arte Específica del rubro
  promptParts.push(`ART_DIRECTION: ${artConfig.prompt}`);
  
  // Parte 4: Composición Social Media (9:16)
  promptParts.push(SOCIAL_MEDIA_SAFE_ZONE);
  
  // Parte 5: Guardrail Negativo (Agency Standard + Rubro específico)
  promptParts.push(`NEGATIVE_PROMPT: ${AGENCY_NEGATIVE_PROMPT} ${artConfig.negativePrompt}`);
  
  // Parte 6: Formato de salida esperado
  promptParts.push(`OUTPUT_FORMAT: Professional flyer/advertisement image, 9:16 aspect ratio, optimized for Instagram Stories and TikTok. High-quality commercial photography with agency-level art direction.`);
  
  return promptParts.join('\n\n');
}

/**
 * Genera un prompt de dirección de arte buscando por nombre de rubro
 * Útil cuando el usuario describe su negocio verbalmente
 *
 * @param rubroName - Nombre del rubro (ej: "zapatillas", "perfume", "moda mujer")
 * @param userSubject - Descripción del producto/servicio
 * @param userDetails - Detalles adicionales opcionales
 * @returns Prompt estructurado o null si no encuentra coincidencia
 */
export function buildArtDirectionPromptByName(
  rubroName: string,
  userSubject: string,
  userDetails?: string
): string | null {
  const artConfig = findArtDirectionByName(rubroName);
  
  if (!artConfig) {
    return null;
  }
  
  return buildArtDirectionPrompt({
    industryId: artConfig.id,
    userSubject,
    userDetails
  });
}

/**
 * Obtiene la configuración de dirección de arte por ID
 */
export function getArtDirectionConfig(industryId: number): ArtDirectionConfig | null {
  return getArtDirectionById(industryId);
}

/**
 * Verifica si un ID de rubro tiene dirección de arte disponible
 */
export function hasArtDirection(industryId: number): boolean {
  return isValidArtDirectionId(industryId);
}

/**
 * Obtiene todos los rubros disponibles con dirección de arte
 */
export function getAvailableArtDirections(): ArtDirectionConfig[] {
  return Object.values(ART_DIRECTION_PROMPTS);
}

/**
 * Construye un prompt simplificado de dirección de arte (para flujos rápidos)
 */
export function buildSimpleArtDirectionPrompt(industryId: number, subject: string): string {
  const artConfig = getArtDirectionById(industryId);
  
  if (!artConfig) {
    throw new Error(`No se encontró dirección de arte para el rubro ID: ${industryId}`);
  }
  
  return `${subject}\n\nART_DIRECTION: ${artConfig.prompt}\n\nNEGATIVE_PROMPT: ${AGENCY_NEGATIVE_PROMPT} ${artConfig.negativePrompt}`;
}
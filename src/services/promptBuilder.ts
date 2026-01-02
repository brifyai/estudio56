/**
 * Servicio para construir prompts estructurados para Gemini.
 * Separa el "sujeto" (qué) del "estilo" (cómo) para tener control
 * sobre el nivel de realismo de las imágenes generadas.
 */

import { REALITY_MODES, REALITY_MODE_LABELS, FORBIDDEN_KEYWORDS, type RealityMode } from '../constants/promptModifiers';

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
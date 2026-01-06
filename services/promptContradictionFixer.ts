/**
 * Servicio de Corrección de Contradicciones en Prompts
 * Detecta y resuelve conflictos entre diferentes componentes del sistema
 * antes de enviar el prompt a Gemini.
 * 
 * PROBLEMA RESUELTO:
 * - Contradicción steam/smoke: Incluido en negative prompt pero requerido en motion dynamics
 * - Contradicción realist vs profesional: "Amateur smartphone" vs "glossy finish 8k"
 * - Términos problemáticos: "GraphicRiver bestseller", "Unreal Engine 5" que activan filtros de seguridad
 */

import type { StoryArtStyleId } from '../types';

// ============================================
// TÉRMINOS PROBLEMÁTICOS (Activan filtros de seguridad de Gemini)
// ============================================
const PROBLEMATIC_TERMS = [
  'graphicriver',
  'bestseller',
  'unreal engine',
  'ue5',
  '8k resolution',
  'photorealistic',
  'masterpiece',
  'ultra-detailed',
  'cinematic lighting',
  'epic shot',
  'award winning',
  'professional photography',
  'studio lighting',
  'high-end',
  'luxury resort',
  'marble palace'
];

// ============================================
// ELEMENTOS EN NEGATIVE PERO REQUERIDOS EN CONTEXTO
// ============================================
const STEAM_ELEMENTS = ['steam', 'smoke', 'fog', 'candles', 'water ripples', 'bamboo'];

// ============================================
// CONTRADICCIONES CONOCIDAS
// ============================================
interface ContradictionRule {
  pattern: RegExp;
  resolution: 'remove' | 'replace' | 'warn';
  replacement?: string;
  message: string;
}

const CONTRADICTION_RULES: ContradictionRule[] = [
  // Términos que activan filtros de seguridad
  {
    pattern: /graphicriver|bestseller/gi,
    resolution: 'remove',
    message: 'Término "GraphicRiver/bestseller" removido por activar filtros de seguridad'
  },
  {
    pattern: /unreal engine\s*5?|ue5/gi,
    resolution: 'remove',
    message: 'Referencia a "Unreal Engine" removida por activar filtros de seguridad'
  },
  {
    pattern: /8k\s*resolution|8k/gi,
    resolution: 'replace',
    replacement: 'high quality',
    message: '"8k resolution" reemplazado por "high quality"'
  },
  {
    pattern: /ultra-detailed|ultra detailed/gi,
    resolution: 'replace',
    replacement: 'detailed',
    message: '"ultra-detailed" reemplazado por "detailed"'
  },
  {
    pattern: /cinematic lighting/gi,
    resolution: 'replace',
    replacement: 'natural lighting',
    message: '"cinematic lighting" reemplazado por "natural lighting"'
  },
  {
    pattern: /glossy finish/gi,
    resolution: 'replace',
    replacement: 'clean finish',
    message: '"glossy finish" reemplazado por "clean finish"'
  },
  {
    pattern: /epic shot|award winning/gi,
    resolution: 'remove',
    message: 'Términos de valoración removidos'
  },
  {
    pattern: /professional commercial photography/gi,
    resolution: 'replace',
    replacement: 'clean commercial photography',
    message: '"professional commercial" suavizado a "clean commercial"'
  },
  {
    pattern: /studio lighting/gi,
    resolution: 'replace',
    replacement: 'soft lighting',
    message: '"studio lighting" reemplazado por "soft lighting"'
  },
  {
    pattern: /high-end|luxury/gi,
    resolution: 'replace',
    replacement: 'quality',
    message: 'Términos de lujo suavizados'
  }
];

// ============================================
// INTERFAZ DE RESULTADO
// ============================================

export interface PromptFixResult {
  success: boolean;
  originalPrompt: string;
  fixedPrompt: string;
  issues: PromptIssue[];
  warnings: string[];
}

export interface PromptIssue {
  type: 'safety' | 'contradiction' | 'incompatibility';
  severity: 'error' | 'warning' | 'info';
  element: string;
  originalText: string;
  resolvedText?: string;
  message: string;
}

// ============================================
// FUNCIÓN PRINCIPAL DE CORRECCIÓN
// ============================================

/**
 * Corrige un prompt eliminando contradicciones y términos problemáticos
 * antes de enviarlo a Gemini.
 * 
 * @param prompt - Prompt original a corregir
 * @param context - Contexto adicional (industryId, realityMode, etc.)
 * @returns Prompt corregido con reporte de cambios
 */
export function fixPromptContradictions(
  prompt: string,
  context?: {
    industryId?: number;
    realityMode?: 'realist' | 'aspirational' | 'studio';
    isStoryArt?: boolean;
    artDirectionPrompt?: string;
  }
): PromptFixResult {
  const issues: PromptIssue[] = [];
  const warnings: string[] = [];
  let fixedPrompt = prompt;

  console.log('🔍 [PromptFixer] Analizando prompt para contradicciones...');
  console.log(`📝 Prompt original (${prompt.length} chars):`, prompt.substring(0, 200) + '...');

  // 1. Detectar y remover términos problemáticos
  for (const term of PROBLEMATIC_TERMS) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    if (regex.test(fixedPrompt)) {
      const match = fixedPrompt.match(regex);
      if (match) {
        issues.push({
          type: 'safety',
          severity: 'error',
          element: term,
          originalText: match[0],
          message: `Término problemático "${term}" detectado y removido`
        });
        fixedPrompt = fixedPrompt.replace(regex, '');
      }
    }
  }

  // 2. Aplicar reglas de contradicción
  for (const rule of CONTRADICTION_RULES) {
    if (rule.pattern.test(fixedPrompt)) {
      const match = fixedPrompt.match(rule.pattern);
      if (match) {
        const originalText = match[0];
        
        issues.push({
          type: 'contradiction',
          severity: 'warning',
          element: 'contradiction',
          originalText: originalText,
          resolvedText: rule.replacement,
          message: rule.message
        });

        if (rule.resolution === 'remove') {
          fixedPrompt = fixedPrompt.replace(rule.pattern, '');
        } else if (rule.resolution === 'replace' && rule.replacement) {
          fixedPrompt = fixedPrompt.replace(rule.pattern, rule.replacement);
        }
      }
    }
  }

  // 3. Si estamos en modo "realist", remover términos profesionales
  if (context?.realityMode === 'realist') {
    const realistConflictingTerms = [
      'glossy finish',
      'studio lighting',
      'professional photography',
      'high-end',
      'cinematic',
      'bokeh',
      'softbox'
    ];

    for (const term of realistConflictingTerms) {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      if (regex.test(fixedPrompt)) {
        fixedPrompt = fixedPrompt.replace(regex, '');
        warnings.push(`Término "${term}" removido por ser incompatible con modo "realist"`);
      }
    }
  }

  // 4. Manejar elementos de steam/smoke que aparecen en positivo y negativo
  for (const element of STEAM_ELEMENTS) {
    const inPositive = prompt.toLowerCase().includes(element);
    const inNegative = prompt.toLowerCase().includes(`no ${element}`) || 
                       prompt.toLowerCase().includes(`not ${element}`) ||
                       prompt.toLowerCase().includes(`avoid ${element}`);

    if (inPositive && inNegative) {
      issues.push({
        type: 'incompatibility',
        severity: 'warning',
        element: element,
        originalText: `Elemento "${element}" en positivo y negativo`,
        message: `Conflicto detectado: "${element}" está tanto en el prompt positivo como en el negativo`
      });
    }
  }

  // 5. Limpiar espacios múltiples y normalizar
  fixedPrompt = fixedPrompt
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();

  // 6. Verificar que el prompt no quedó vacío
  if (fixedPrompt.length < 10) {
    issues.push({
      type: 'safety',
      severity: 'error',
      element: 'empty_prompt',
      originalText: prompt,
      message: 'El prompt quedó vacío después de la limpieza'
    });
  }

  // Log del resultado
  console.log('✅ [PromptFixer] Corrección completada:');
  console.log(`   - Problemas detectados: ${issues.length}`);
  console.log(`   - Advertencias: ${warnings.length}`);
  console.log(`   - Prompt corregido (${fixedPrompt.length} chars):`, fixedPrompt.substring(0, 200) + '...');

  return {
    success: issues.filter(i => i.severity === 'error').length === 0,
    originalPrompt: prompt,
    fixedPrompt,
    issues,
    warnings
  };
}

// ============================================
// FUNCIÓN PARA GENERAR PROMPT SEGURO
// ============================================

// Estilos válidos de Story Art (definidos localmente para evitar problemas de importación)
const VALID_STORY_ART_STYLES: StoryArtStyleId[] = [
  'vogue_negative',
  'neon_kinetic',
  'macro_essence',
  'cinematic_frame',
  'collage_dynamic',
  'marble_sculpture',
  'anime_to_real'
];

/**
 * Genera un prompt seguro para un estilo visual específico
 * @param subject - Sujeto principal
 * @param styleId - ID del estilo visual
 * @param industryId - ID del rubro
 * @returns Prompt seguro para Gemini
 */
export function generateSafePrompt(
  subject: string,
  styleId: StoryArtStyleId,
  industryId: number
): string {
  // Verificar que el estilo sea válido
  if (!VALID_STORY_ART_STYLES.includes(styleId)) {
    console.warn(`⚠️ [PromptFixer] Estilo inválido: ${styleId}, usando prompt genérico`);
    styleId = 'marble_sculpture'; // Estilo seguro por defecto
  }

  // Base prompt simple
  const basePrompt = `Professional image of ${subject}`;

  // Aplicar corrección
  const fixResult = fixPromptContradictions(basePrompt, {
    industryId,
    realityMode: 'studio',
    isStoryArt: true
  });

  return fixResult.fixedPrompt;
}

// ============================================
// EXPORT
// ============================================

export const PROMPT_CONTRADICTION_FIXER = {
  fix: fixPromptContradictions,
  generateSafe: generateSafePrompt,
  PROBLEMATIC_TERMS,
  STEAM_ELEMENTS,
  CONTRADICTION_RULES
};
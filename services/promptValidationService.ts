/**
 * Servicio de Validación de Prompts
 * Detecta y resuelve contradicciones entre modos de realidad y direcciones de arte
 */

export interface PromptValidationResult {
  isValid: boolean;
  issues: PromptIssue[];
  resolvedPrompt?: string;
  suggestions: string[];
}

export interface PromptIssue {
  type: 'contradiction' | 'incompatibility' | 'warning';
  severity: 'error' | 'warning' | 'info';
  message: string;
  element: string;
  conflictingWith?: string;
}

// ============================================
// CONTRADICCIONES CONOCIDAS
// ============================================

const CONTRADICTIONS = {
  // El negative prompt menciona "candles, smoke, steam" pero el art direction los incluye
  steamElements: {
    conflicting: ['steam', 'smoke', 'fog', 'candles', 'water ripples', 'bamboo'],
    resolution: 'remove_from_negative'
  },
  
  // Modo realist contradice estilos ultra-profesionales
  realistVsProfessional: {
    modes: ['realist'],
    conflictingStyles: ['glossy finish', 'ultra-detailed', '8k resolution', 'Unreal Engine', 'cinematic lighting'],
    resolution: 'prioritize_reality_mode'
  },
  
  // Estilo amateur contradice dirección de arte profesional
  amateurVsProfessional: {
    conflicting: ['amateur', 'smartphone photography', 'unpolished', '2.5-star'],
    conflictingWith: ['professional', 'editorial', 'commercial photography', 'studio lighting'],
    resolution: 'choose_one'
  }
};

// ============================================
// DETECTOR DE CONTRADICCIONES
// ============================================

/**
 * Valida un prompt completo y detecta contradicciones
 */
export function validatePrompt(
  prompt: string,
  negativePrompt: string,
  realityMode: string
): PromptValidationResult {
  const issues: PromptIssue[] = [];
  const combinedText = `${prompt} ${negativePrompt}`.toLowerCase();
  
  // Detectar contradicciones steam/smoke
  for (const element of CONTRADICTIONS.steamElements.conflicting) {
    const inPrompt = prompt.toLowerCase().includes(element);
    const inNegative = negativePrompt.toLowerCase().includes(element);
    
    if (inPrompt && inNegative) {
      issues.push({
        type: 'contradiction',
        severity: 'error',
        message: `El elemento "${element}" aparece tanto en el prompt positivo como en el negativo`,
        element: element,
        conflictingWith: 'negative prompt'
      });
    }
  }
  
  // Detectar contradicciones modo realist vs profesional
  if (realityMode === 'realist') {
    for (const style of CONTRADICTIONS.realistVsProfessional.conflictingStyles) {
      if (prompt.toLowerCase().includes(style)) {
        issues.push({
          type: 'contradiction',
          severity: 'warning',
          message: `El estilo "${style}" contradice el modo de realidad "realist"`,
          element: style,
          conflictingWith: 'realityMode: realist'
        });
      }
    }
  }
  
  // Detectar contradicciones amateur vs profesional
  const hasAmateur = CONTRADICTIONS.amateurVsProfessional.conflicting.some(
    word => prompt.toLowerCase().includes(word)
  );
  const hasProfessional = CONTRADICTIONS.amateurVsProfessional.conflictingWith?.some(
    word => prompt.toLowerCase().includes(word)
  );
  
  if (hasAmateur && hasProfessional) {
    issues.push({
      type: 'contradiction',
      severity: 'error',
      message: 'El prompt contiene instrucciones contradictorias: amateur vs profesional',
      element: 'mixed aesthetic',
      conflictingWith: 'amateur + professional'
    });
  }
  
  // Detectar "GraphicRiver bestseller" que causa problemas
  if (prompt.toLowerCase().includes('graphicriver') || 
      prompt.toLowerCase().includes('bestseller')) {
    issues.push({
      type: 'incompatibility',
      severity: 'warning',
      message: 'Términos como "GraphicRiver bestseller" pueden causar errores de generación',
      element: 'graphicriver/bestseller',
      conflictingWith: 'Gemini safety filters'
    });
  }
  
  // Detectar "Unreal Engine 5" que puede causar problemas
  if (prompt.toLowerCase().includes('unreal engine') || 
      prompt.toLowerCase().includes('ue5')) {
    issues.push({
      type: 'incompatibility',
      severity: 'warning',
      message: 'Referencias a Unreal Engine pueden activar filtros de seguridad',
      element: 'Unreal Engine',
      conflictingWith: 'Gemini safety filters'
    });
  }
  
  return {
    isValid: issues.filter(i => i.severity === 'error').length === 0,
    issues,
    suggestions: generateSuggestions(issues, realityMode)
  };
}

// ============================================
// GENERADOR DE SUGERENCIAS
// ============================================

function generateSuggestions(issues: PromptIssue[], realityMode: string): string[] {
  const suggestions: string[] = [];
  
  // Sugerencias para contradicciones steam
  if (issues.some(i => i.element === 'steam')) {
    suggestions.push('Considera usar solo uno de los dos: o efectos de vapor en el prompt positivo, o eliminarlos del negativo.');
  }
  
  // Sugerencias para modo realist
  if (realityMode === 'realist') {
    suggestions.push('El modo "Local / Realista" funciona mejor con descripciones simples del producto/servicio.');
    suggestions.push('Evita términos como "glossy finish", "8k resolution" o "cinematic lighting" en modo realist.');
  }
  
  // Sugerencias para términos problemáticos
  if (issues.some(i => i.type === 'incompatibility')) {
    suggestions.push('Remueve términos como "GraphicRiver bestseller" o "Unreal Engine 5" que pueden activar filtros de seguridad.');
  }
  
  return suggestions;
}

// ============================================
// RESOLUCIÓN DE PROMPTS
// ============================================

/**
 * Resuelve un prompt conflictivo simplificándolo
 */
export function resolvePrompt(
  prompt: string,
  negativePrompt: string,
  realityMode: string
): string {
  let resolvedPrompt = prompt;
  
  // Si hay contradicciones steam, priorizar el art direction sobre el negative
  const hasSteamConflict = CONTRADICTIONS.steamElements.conflicting.some(
    element => prompt.toLowerCase().includes(element) && 
              negativePrompt.toLowerCase().includes(element)
  );
  
  if (hasSteamConflict) {
    // Mantener el prompt positivo, limpiar el negative de elementos conflictivos
    let cleanedNegative = negativePrompt;
    for (const element of CONTRADICTIONS.steamElements.conflicting) {
      const regex = new RegExp(`\\b${element}\\b`, 'gi');
      cleanedNegative = cleanedNegative.replace(regex, '');
    }
    negativePrompt = cleanedNegative;
  }
  
  // Si estamos en modo realist, remover términos contradictorios
  if (realityMode === 'realist') {
    for (const style of CONTRADICTIONS.realistVsProfessional.conflictingStyles) {
      const regex = new RegExp(`\\b${style.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      resolvedPrompt = resolvedPrompt.replace(regex, '');
    }
  }
  
  // Remover términos problemáticos
  const problematicTerms = ['GraphicRiver bestseller', 'Unreal Engine 5', 'UE5', '8k resolution'];
  for (const term of problematicTerms) {
    const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    resolvedPrompt = resolvedPrompt.replace(regex, '');
  }
  
  // Construir prompt final limpio
  const finalParts: string[] = [];
  
  // Extraer solo el sujeto (lo que viene después de "ASSET:" o es el texto principal)
  const assetMatch = resolvedPrompt.match(/ASSET:\s*([^\n]+)/i);
  const subject = assetMatch ? assetMatch[1].trim() : resolvedPrompt.split('\n')[0];
  
  // Extraer dirección de arte (lo que viene después de "ART_DIRECTION:")
  const artDirectionMatch = resolvedPrompt.match(/ART_DIRECTION:\s*([^\n]+)/i);
  const artDirection = artDirectionMatch ? artDirectionMatch[1].trim() : '';
  
  // Combinar de forma limpia
  if (subject) {
    finalParts.push(subject);
  }
  
  if (artDirection) {
    finalParts.push(artDirection);
  }
  
  // Agregar instrucción de modo de realidad
  if (realityMode === 'realist') {
    finalParts.push('Natural photography, authentic local business aesthetic, soft daylight, realistic textures.');
  } else if (realityMode === 'aspirational') {
    finalParts.push('Professional commercial photography, high quality, clean design.');
  } else if (realityMode === 'studio') {
    finalParts.push('Studio product photography, clean background, professional lighting.');
  }
  
  // Agregar negative prompt limpio
  if (negativePrompt) {
    finalParts.push(`NEGATIVE: ${negativePrompt}`);
  }
  
  return finalParts.join('\n\n');
}

// ============================================
// EXPORT PARA CONSUMO EXTERNO
// ============================================

export const PROMPT_VALIDATION_SERVICE = {
  validate: validatePrompt,
  resolve: resolvePrompt
};
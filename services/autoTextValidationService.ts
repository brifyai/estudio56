import { CompositionAnalysisResult } from './compositionAnalysisService';

export interface ValidationResult {
  isValid: boolean;
  confidence: number; // 0-1
  issues: string[];
  suggestions: string[];
  safeFallbackPosition: { x: number; y: number };
  recommendedAdjustments: {
    fontSize?: number;
    color?: string;
    position?: { x: number; y: number };
  };
}

export interface ImageSafetyCheck {
  hasClearAreas: boolean;
  dominantColors: string[];
  contrastRatio: number;
  complexity: 'low' | 'medium' | 'high';
  recommendedPosition: { x: number; y: number };
}

/**
 * Valida si el análisis automático es seguro y confiable
 */
export const validateAutoTextAnalysis = (
  compositionAnalysis: CompositionAnalysisResult,
  imageDataUrl: string,
  textContent: string = "Texto de ejemplo"
): ValidationResult => {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let confidence = compositionAnalysis.optimalTextPosition?.confidence || 0.7;
  
  // 1. Validar confianza del análisis
  if (confidence < 0.5) {
    issues.push('Confianza baja en el análisis de posición');
    suggestions.push('Considera ajustar manualmente la posición');
  }
  
  // 2. Validar posición en safe areas
  const position = compositionAnalysis.optimalTextPosition;
  if (position) {
    const safeAreas = compositionAnalysis.safeAreas;
    
    if (position.x < safeAreas.left || position.x > (100 - safeAreas.right)) {
      issues.push('Posición muy cerca del borde izquierdo o derecho');
      suggestions.push('Mover texto hacia el centro');
    }
    
    if (position.y < safeAreas.top || position.y > (100 - safeAreas.bottom)) {
      issues.push('Posición muy cerca del borde superior o inferior');
      suggestions.push('Mover texto hacia el centro');
    }
  }
  
  // 3. Validar contraste
  const contrast = compositionAnalysis.contrastOptimization;
  if (contrast && contrast.contrastRatio < 3.0) {
    issues.push('Contraste insuficiente para legibilidad');
    suggestions.push('Ajustar color del texto o agregar fondo');
    confidence *= 0.7; // Reducir confianza
  }
  
  // 4. Validar tamaño de fuente
  const fontSize = compositionAnalysis.recommendedFontSize?.base;
  if (fontSize && fontSize < 16) {
    issues.push('Tamaño de fuente muy pequeño');
    suggestions.push('Aumentar tamaño de fuente para mejor legibilidad');
    confidence *= 0.8;
  }
  
  // 5. Validar balance visual
  const balance = compositionAnalysis.compositionOptimization?.balanceScore;
  if (balance && balance < 0.5) {
    issues.push('Balance visual subóptimo');
    suggestions.push('Reposicionar texto para mejor equilibrio');
    confidence *= 0.9;
  }
  
  // Determinar si es válido
  const isValid = confidence >= 0.6 && issues.length <= 2;
  
  // Generar fallback seguro
  const safeFallbackPosition = generateSafeFallbackPosition(compositionAnalysis);
  
  // Recomendaciones de ajuste
  const recommendedAdjustments = generateAdjustmentRecommendations(
    compositionAnalysis,
    issues
  );
  
  return {
    isValid,
    confidence: Math.round(confidence * 100) / 100,
    issues,
    suggestions,
    safeFallbackPosition,
    recommendedAdjustments
  };
};

/**
 * Genera una posición segura como fallback
 */
const generateSafeFallbackPosition = (
  compositionAnalysis: CompositionAnalysisResult
): { x: number; y: number } => {
  const safeAreas = compositionAnalysis.safeAreas;
  
  // Posición central segura
  const safeX = Math.max(safeAreas.left + 10, Math.min(90 - safeAreas.right, 50));
  const safeY = Math.max(safeAreas.top + 10, Math.min(90 - safeAreas.bottom, 50));
  
  return { x: safeX, y: safeY };
};

/**
 * Genera recomendaciones de ajuste
 */
const generateAdjustmentRecommendations = (
  compositionAnalysis: CompositionAnalysisResult,
  issues: string[]
) => {
  const adjustments: any = {};
  
  // Ajustar tamaño si hay problemas de legibilidad
  if (issues.some(issue => issue.includes('pequeño'))) {
    adjustments.fontSize = Math.max(
      compositionAnalysis.recommendedFontSize?.base || 32,
      24
    );
  }
  
  // Ajustar color si hay problemas de contraste
  if (issues.some(issue => issue.includes('Contraste'))) {
    adjustments.color = compositionAnalysis.contrastOptimization?.recommendedTextColor === '#FFFFFF' 
      ? '#000000' 
      : '#FFFFFF';
  }
  
  // Ajustar posición si está muy cerca de bordes
  if (issues.some(issue => issue.includes('cerca del borde'))) {
    adjustments.position = generateSafeFallbackPosition(compositionAnalysis);
  }
  
  return adjustments;
};

/**
 * Realiza una verificación rápida de seguridad de la imagen
 */
export const performImageSafetyCheck = async (
  imageDataUrl: string
): Promise<ImageSafetyCheck> => {
  try {
    // Crear imagen para análisis
    const img = new Image();
    img.src = imageDataUrl;
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    // Análisis básico de canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    // Obtener datos de píxeles
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Analizar colores dominantes
    const colorMap = new Map<string, number>();
    const step = 10; // Sample cada 10 píxeles para performance
    
    for (let i = 0; i < pixels.length; i += 4 * step) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      
      // Simplificar colores a categorías
      const colorCategory = categorizeColor(r, g, b);
      colorMap.set(colorCategory, (colorMap.get(colorCategory) || 0) + 1);
    }
    
    // Encontrar colores dominantes
    const dominantColors = Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([color]) => color);
    
    // Calcular complejidad (basado en variación de colores)
    const complexity = calculateImageComplexity(colorMap);
    
    // Determinar si hay áreas claras
    const hasClearAreas = dominantColors.some(color => 
      ['white', 'light-gray', 'very-light'].includes(color)
    );
    
    // Posición recomendada basada en análisis
    const recommendedPosition = hasClearAreas 
      ? { x: 50, y: 30 } // Arriba si hay áreas claras
      : { x: 50, y: 70 }; // Abajo si no las hay
    
    return {
      hasClearAreas,
      dominantColors,
      contrastRatio: calculateContrastRatio(dominantColors[0], dominantColors[1] || '#000000'),
      complexity,
      recommendedPosition
    };
    
  } catch (error) {
    console.warn('Error en verificación de seguridad:', error);
    
    // Fallback seguro
    return {
      hasClearAreas: false,
      dominantColors: ['unknown'],
      contrastRatio: 3.0,
      complexity: 'medium',
      recommendedPosition: { x: 50, y: 50 }
    };
  }
};

/**
 * Categoriza un color RGB en una categoría simple
 */
const categorizeColor = (r: number, g: number, b: number): string => {
  const brightness = (r + g + b) / 3;
  
  if (brightness > 200) return 'white';
  if (brightness > 150) return 'light-gray';
  if (brightness > 100) return 'very-light';
  if (brightness > 50) return 'medium';
  return 'dark';
};

/**
 * Calcula la complejidad de la imagen
 */
const calculateImageComplexity = (colorMap: Map<string, number>): 'low' | 'medium' | 'high' => {
  const uniqueColors = colorMap.size;
  const totalPixels = Array.from(colorMap.values()).reduce((sum, count) => sum + count, 0);
  
  // Calcular diversidad
  const diversity = uniqueColors / totalPixels;
  
  if (diversity < 0.1) return 'low';
  if (diversity < 0.3) return 'medium';
  return 'high';
};

/**
 * Calcula ratio de contraste entre dos colores
 */
const calculateContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    // Simplificación: mapear categorías a valores de luminancia
    const luminanceMap: { [key: string]: number } = {
      'white': 1.0,
      'light-gray': 0.8,
      'very-light': 0.6,
      'medium': 0.4,
      'dark': 0.2
    };
    
    return luminanceMap[color] || 0.5;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Mejora automática el análisis si hay problemas
 */
export const improveAutoTextAnalysis = (
  originalAnalysis: CompositionAnalysisResult,
  validationResult: ValidationResult
): CompositionAnalysisResult => {
  if (validationResult.isValid) {
    return originalAnalysis; // No necesita mejoras
  }
  
  // Crear análisis mejorado
  const improvedAnalysis = { ...originalAnalysis };
  
  // Aplicar ajustes recomendados
  if (validationResult.recommendedAdjustments.fontSize) {
    improvedAnalysis.recommendedFontSize = {
      ...improvedAnalysis.recommendedFontSize,
      base: validationResult.recommendedAdjustments.fontSize
    };
  }
  
  if (validationResult.recommendedAdjustments.color) {
    improvedAnalysis.contrastOptimization = {
      ...improvedAnalysis.contrastOptimization,
      recommendedTextColor: validationResult.recommendedAdjustments.color
    };
  }
  
  if (validationResult.recommendedAdjustments.position) {
    improvedAnalysis.optimalTextPosition = {
      ...improvedAnalysis.optimalTextPosition,
      x: validationResult.recommendedAdjustments.position.x,
      y: validationResult.recommendedAdjustments.position.y
    };
  }
  
  // Aumentar confianza si aplicamos mejoras
  if (improvedAnalysis.optimalTextPosition) {
    improvedAnalysis.optimalTextPosition.confidence = Math.min(
      (improvedAnalysis.optimalTextPosition.confidence || 0.7) + 0.2,
      1.0
    );
  }
  
  return improvedAnalysis;
};
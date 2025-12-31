import { GoogleGenAI } from "@google/genai";

export interface CompositionAnalysisResult {
  optimalTextPosition: {
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
    alignment: 'left' | 'center' | 'right';
    verticalAlignment: 'top' | 'center' | 'bottom';
    confidence: number; // 0-1
  };
  recommendedFontSize: {
    base: number; // pixels
    responsive: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
    confidence: number;
  };
  contrastOptimization: {
    recommendedTextColor: string;
    recommendedBackgroundColor?: string;
    contrastRatio: number;
    isWCAGCompliant: boolean;
    confidence: number;
  };
  compositionOptimization: {
    balanceScore: number; // 0-1
    visualWeight: number; // 0-1
    recommendedSpacing: {
      margin: number;
      padding: number;
      lineHeight: number;
    };
    confidence: number;
  };
  safeAreas: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const getAiClient = () => new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "AIzaSyCMXM-e632BNF3IwnKDX1qKXpj6qrpsYfM"
});

/**
 * Analiza la composición de una imagen para determinar la posición óptima del texto
 */
export const analyzeCompositionForText = async (
  imageDataUrl: string,
  textContent: string = "Texto de ejemplo",
  aspectRatio: string = "1:1"
): Promise<CompositionAnalysisResult> => {
  try {
    console.log("🎨 Analizando composición para posicionamiento de texto...");
    
    const ai = getAiClient();
    const model = "gemini-3-flash-preview";

    const analysisPrompt = `Analiza esta imagen para determinar la posición óptima del texto. Considera:

1. ESPACIOS VACÍOS: Identifica áreas con menos elementos visuales
2. COMPOSICIÓN: Regla de tercios, balance visual, flujo visual
3. LEGIBILIDAD: Asegura que el texto sea claramente visible
4. JERARQUÍA VISUAL: Donde el ojo se enfoca primero
5. CONTRASTE: Fondos claros vs oscuros para el texto

Responde SOLO con JSON válido:

{
  "optimalTextPosition": {
    "x": 50,
    "y": 50,
    "alignment": "center",
    "verticalAlignment": "center",
    "confidence": 0.9
  },
  "recommendedFontSize": {
    "base": 20,
    "responsive": {
      "mobile": 16,
      "tablet": 18,
      "desktop": 20
    },
    "confidence": 0.85
  },
  "contrastOptimization": {
    "recommendedTextColor": "#FFFFFF",
    "recommendedBackgroundColor": "#000000",
    "contrastRatio": 4.5,
    "isWCAGCompliant": true,
    "confidence": 0.9
  },
  "compositionOptimization": {
    "balanceScore": 0.8,
    "visualWeight": 0.7,
    "recommendedSpacing": {
      "margin": 20,
      "padding": 16,
      "lineHeight": 1.4
    },
    "confidence": 0.85
  },
  "safeAreas": {
    "top": 10,
    "right": 5,
    "bottom": 15,
    "left": 5
  }
}

INSTRUCCIONES ESPECÍFICAS:
- x, y: Porcentajes (0-100) donde posicionar el texto
- alignment: left|center|right
- verticalAlignment: top|center|bottom
- fontSize: Tamaño en píxeles apropiado para la imagen
- contrastRatio: Mínimo 4.5 para WCAG AA
- safeAreas: Porcentajes de margen seguro desde los bordes`;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: analysisPrompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: imageDataUrl.split(',')[1]
            }
          }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const responseText = response.text?.trim();
    if (!responseText) {
      throw new Error("Respuesta vacía del análisis de composición");
    }

    console.log("📐 Análisis de composición recibido:", responseText);

    const analysisResult = JSON.parse(responseText);
    
    // Validar y completar con valores por defecto
    const validatedResult: CompositionAnalysisResult = {
      optimalTextPosition: {
        x: analysisResult.optimalTextPosition?.x ?? 50,
        y: analysisResult.optimalTextPosition?.y ?? 50,
        alignment: analysisResult.optimalTextPosition?.alignment ?? 'center',
        verticalAlignment: analysisResult.optimalTextPosition?.verticalAlignment ?? 'center',
        confidence: analysisResult.optimalTextPosition?.confidence ?? 0.7
      },
      recommendedFontSize: {
        base: analysisResult.recommendedFontSize?.base ?? 20,
        responsive: {
          mobile: analysisResult.recommendedFontSize?.responsive?.mobile ?? 16,
          tablet: analysisResult.recommendedFontSize?.responsive?.tablet ?? 18,
          desktop: analysisResult.recommendedFontSize?.responsive?.desktop ?? 20
        },
        confidence: analysisResult.recommendedFontSize?.confidence ?? 0.7
      },
      contrastOptimization: {
        recommendedTextColor: analysisResult.contrastOptimization?.recommendedTextColor ?? '#FFFFFF',
        recommendedBackgroundColor: analysisResult.contrastOptimization?.recommendedBackgroundColor,
        contrastRatio: analysisResult.contrastOptimization?.contrastRatio ?? 4.5,
        isWCAGCompliant: analysisResult.contrastOptimization?.isWCAGCompliant ?? true,
        confidence: analysisResult.contrastOptimization?.confidence ?? 0.7
      },
      compositionOptimization: {
        balanceScore: analysisResult.compositionOptimization?.balanceScore ?? 0.7,
        visualWeight: analysisResult.compositionOptimization?.visualWeight ?? 0.7,
        recommendedSpacing: {
          margin: analysisResult.compositionOptimization?.recommendedSpacing?.margin ?? 20,
          padding: analysisResult.compositionOptimization?.recommendedSpacing?.padding ?? 16,
          lineHeight: analysisResult.compositionOptimization?.recommendedSpacing?.lineHeight ?? 1.4
        },
        confidence: analysisResult.compositionOptimization?.confidence ?? 0.7
      },
      safeAreas: {
        top: analysisResult.safeAreas?.top ?? 10,
        right: analysisResult.safeAreas?.right ?? 5,
        bottom: analysisResult.safeAreas?.bottom ?? 15,
        left: analysisResult.safeAreas?.left ?? 5
      }
    };

    console.log("✅ Análisis de composición completado:", validatedResult);
    return validatedResult;

  } catch (error: any) {
    console.error("❌ Error analizando composición:", error);
    
    // Fallback con valores seguros
    return {
      optimalTextPosition: {
        x: 50,
        y: 50,
        alignment: 'center',
        verticalAlignment: 'center',
        confidence: 0.5
      },
      recommendedFontSize: {
        base: 20,
        responsive: {
          mobile: 16,
          tablet: 18,
          desktop: 20
        },
        confidence: 0.5
      },
      contrastOptimization: {
        recommendedTextColor: '#FFFFFF',
        contrastRatio: 4.5,
        isWCAGCompliant: true,
        confidence: 0.5
      },
      compositionOptimization: {
        balanceScore: 0.7,
        visualWeight: 0.7,
        recommendedSpacing: {
          margin: 20,
          padding: 16,
          lineHeight: 1.4
        },
        confidence: 0.5
      },
      safeAreas: {
        top: 10,
        right: 5,
        bottom: 15,
        left: 5
      }
    };
  }
};

/**
 * Genera estilos CSS basados en el análisis de composición
 */
export const generateCompositionBasedStyles = (analysis: CompositionAnalysisResult) => {
  const { optimalTextPosition, recommendedFontSize, contrastOptimization, compositionOptimization } = analysis;
  
  // Mejorar contraste con fondo semitransparente
  const needsBackground = analysis.contrastOptimization.contrastRatio < 3;
  const backgroundColor = needsBackground ?
    'rgba(0,0,0,0.7)' :
    (contrastOptimization.recommendedBackgroundColor || 'transparent');
  
  return {
    // Posicionamiento
    position: 'absolute' as const,
    left: `${optimalTextPosition.x}%`,
    top: `${optimalTextPosition.y}%`,
    transform: 'translate(-50%, -50%)',
    textAlign: optimalTextPosition.alignment,
    
    // Tipografía mejorada
    fontSize: `${recommendedFontSize.base}px`,
    fontWeight: 'bold',
    lineHeight: compositionOptimization.recommendedSpacing.lineHeight,
    letterSpacing: '0.5px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    
    // Contraste optimizado
    color: contrastOptimization.recommendedTextColor,
    backgroundColor: backgroundColor,
    padding: needsBackground ? '8px 16px' : '0',
    borderRadius: needsBackground ? '8px' : '0',
    
    // Espaciado
    margin: `${compositionOptimization.recommendedSpacing.margin}px`,
    
    // Efectos visuales profesionales
    textShadow: needsBackground ?
      '0 2px 8px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.5)' :
      '0 2px 4px rgba(0,0,0,0.6), 0 1px 1px rgba(0,0,0,0.3)',
    
    // Borde sutil para mayor definición
    ...(needsBackground && {
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)'
    }),
    
    // Transiciones suaves
    transition: 'all 0.3s ease',
    
    // Responsive mejorado
    '@media (max-width: 768px)': {
      fontSize: `${recommendedFontSize.responsive.mobile}px`,
      padding: needsBackground ? '6px 12px' : '0'
    },
    '@media (min-width: 769px) and (max-width: 1024px)': {
      fontSize: `${recommendedFontSize.responsive.tablet}px`,
      padding: needsBackground ? '7px 14px' : '0'
    },
    '@media (min-width: 1025px)': {
      fontSize: `${recommendedFontSize.responsive.desktop}px`,
      padding: needsBackground ? '8px 16px' : '0'
    }
  };
};

/**
 * Genera clases CSS dinámicas para composición
 */
export const generateCompositionClasses = (analysis: CompositionAnalysisResult): string => {
  const { optimalTextPosition, contrastOptimization, compositionOptimization } = analysis;
  
  let classes = [
    'absolute',
    'transform',
    '-translate-x-1/2',
    '-translate-y-1/2'
  ];
  
  // Alineación
  if (optimalTextPosition.alignment === 'center') {
    classes.push('text-center');
  } else if (optimalTextPosition.alignment === 'left') {
    classes.push('text-left');
  } else {
    classes.push('text-right');
  }
  
  // Contraste
  if (contrastOptimization.isWCAGCompliant) {
    classes.push('contrast-good');
  } else {
    classes.push('contrast-warning');
  }
  
  // Balance visual
  if (compositionOptimization.balanceScore > 0.8) {
    classes.push('balanced');
  } else if (compositionOptimization.balanceScore > 0.6) {
    classes.push('moderately-balanced');
  } else {
    classes.push('needs-improvement');
  }
  
  // Peso visual
  if (compositionOptimization.visualWeight > 0.7) {
    classes.push('high-visual-weight');
  } else if (compositionOptimization.visualWeight > 0.4) {
    classes.push('medium-visual-weight');
  } else {
    classes.push('low-visual-weight');
  }
  
  return classes.join(' ');
};

/**
 * Calcula el contraste entre dos colores
 */
export const calculateContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Encuentra el color de texto óptimo para un fondo dado
 */
export const findOptimalTextColor = (backgroundColor: string, preferredColors: string[] = ['#FFFFFF', '#000000']): {
  color: string;
  contrastRatio: number;
  isWCAGCompliant: boolean;
} => {
  let bestColor = preferredColors[0];
  let bestContrast = 0;
  let isCompliant = false;
  
  for (const color of preferredColors) {
    const contrast = calculateContrastRatio(backgroundColor, color);
    if (contrast > bestContrast) {
      bestContrast = contrast;
      bestColor = color;
      isCompliant = contrast >= 4.5; // WCAG AA standard
    }
  }
  
  return {
    color: bestColor,
    contrastRatio: bestContrast,
    isWCAGCompliant: isCompliant
  };
};
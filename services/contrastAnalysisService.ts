export interface ContrastAnalysis {
  backgroundColor: string;
  textColor: string;
  contrastRatio: number;
  accessibility: 'excellent' | 'good' | 'fair' | 'poor';
  recommendedTextColor: string;
  recommendedBackgroundColor: string;
  adjustments: {
    textOpacity: number;
    backgroundOpacity: number;
    shadowIntensity: number;
    glowIntensity: number;
  };
}

/**
 * Convierte color hex a RGB
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Convierte RGB a hex
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/**
 * Calcula la luminancia relativa de un color
 */
const getLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Calcula el ratio de contraste entre dos colores
 */
const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Ajusta un color para mejorar el contraste
 */
const adjustColorForContrast = (backgroundColor: string, targetContrast: number = 4.5): string => {
  const bgRgb = hexToRgb(backgroundColor);
  if (!bgRgb) return '#FFFFFF';
  
  // Intentar con blanco y negro primero
  const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  
  if (whiteContrast >= targetContrast) return '#FFFFFF';
  if (blackContrast >= targetContrast) return '#000000';
  
  // Si ninguno funciona, calcular color óptimo
  const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  
  if (bgLuminance > 0.5) {
    // Fondo claro, usar color oscuro
    return '#1a1a1a';
  } else {
    // Fondo oscuro, usar color claro
    return '#ffffff';
  }
};

/**
 * Analiza el contraste de una imagen y recomienda colores optimizados
 */
export const analyzeImageContrast = async (
  imageDataUrl: string,
  textPosition: { x: number; y: number },
  textSize: number = 64
): Promise<ContrastAnalysis> => {
  try {
    console.log("🔍 Analizando contraste de imagen...");
    
    // Simular análisis de la imagen en la posición del texto
    // En una implementación real, aquí se analizaría la imagen real
    const imageColors = await extractImageColors(imageDataUrl);
    
    // Determinar color de fondo basado en la posición
    const backgroundColor = imageColors[Math.floor((textPosition.y / 100) * imageColors.length)] || '#333333';
    
    // Calcular contraste con colores comunes
    const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF');
    const blackContrast = getContrastRatio(backgroundColor, '#000000');
    
    // Determinar mejor color de texto
    const bestTextColor = whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
    const contrastRatio = Math.max(whiteContrast, blackContrast);
    
    // Determinar nivel de accesibilidad
    let accessibility: 'excellent' | 'good' | 'fair' | 'poor';
    if (contrastRatio >= 7) {
      accessibility = 'excellent';
    } else if (contrastRatio >= 4.5) {
      accessibility = 'good';
    } else if (contrastRatio >= 3) {
      accessibility = 'fair';
    } else {
      accessibility = 'poor';
    }
    
    // Calcular ajustes necesarios
    const adjustments = {
      textOpacity: contrastRatio >= 4.5 ? 1 : Math.min(1, 4.5 / contrastRatio * 0.8),
      backgroundOpacity: 0,
      shadowIntensity: contrastRatio < 3 ? 0.8 : contrastRatio < 4.5 ? 0.5 : 0.2,
      glowIntensity: contrastRatio < 2.5 ? 0.6 : 0
    };
    
    const result: ContrastAnalysis = {
      backgroundColor,
      textColor: bestTextColor,
      contrastRatio,
      accessibility,
      recommendedTextColor: bestTextColor,
      recommendedBackgroundColor: backgroundColor,
      adjustments
    };
    
    console.log("✅ Análisis de contraste completado:", result);
    return result;
    
  } catch (error) {
    console.error("❌ Error en análisis de contraste:", error);
    
    // Fallback con valores seguros
    return {
      backgroundColor: '#333333',
      textColor: '#FFFFFF',
      contrastRatio: 5.2,
      accessibility: 'good',
      recommendedTextColor: '#FFFFFF',
      recommendedBackgroundColor: '#333333',
      adjustments: {
        textOpacity: 1,
        backgroundOpacity: 0,
        shadowIntensity: 0.3,
        glowIntensity: 0
      }
    };
  }
};

/**
 * Extrae colores dominantes de una imagen
 */
const extractImageColors = async (imageDataUrl: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(['#333333', '#666666', '#999999']);
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      const colorMap = new Map<string, number>();
      
      // Muestrear cada 10 píxeles para eficiencia
      for (let i = 0; i < data.length; i += 40) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const alpha = data[i + 3];
        
        if (alpha > 128) { // Solo píxeles visibles
          const hex = rgbToHex(r, g, b);
          colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }
      }
      
      // Obtener los colores más frecuentes
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([color]) => color);
      
      resolve(sortedColors.length > 0 ? sortedColors : ['#333333', '#666666', '#999999']);
    };
    
    img.onerror = () => {
      resolve(['#333333', '#666666', '#999999']);
    };
    
    img.src = imageDataUrl;
  });
};

/**
 * Genera estilos CSS optimizados para contraste
 */
export const generateContrastOptimizedStyles = (contrastAnalysis: ContrastAnalysis) => {
  const { textColor, adjustments } = contrastAnalysis;
  
  const styles = {
    color: textColor,
    opacity: adjustments.textOpacity,
    textShadow: adjustments.shadowIntensity > 0.5 
      ? `0 2px 4px rgba(0,0,0,${adjustments.shadowIntensity})`
      : adjustments.shadowIntensity > 0.2
      ? `0 1px 2px rgba(0,0,0,${adjustments.shadowIntensity})`
      : 'none',
    filter: adjustments.glowIntensity > 0 
      ? `drop-shadow(0 0 ${adjustments.glowIntensity * 10}px ${textColor})`
      : 'none'
  };
  
  return styles;
};

/**
 * Verifica si un contraste es accesible
 */
export const isAccessibleContrast = (contrastRatio: number): boolean => {
  return contrastRatio >= 4.5; // WCAG AA standard
};

/**
 * Mejora automáticamente el contraste de un texto
 */
export const enhanceTextContrast = (
  backgroundColor: string,
  textColor: string,
  targetContrast: number = 4.5
): {
  optimizedTextColor: string;
  optimizedBackgroundColor: string;
  contrastRatio: number;
  adjustments: {
    textOpacity: number;
    backgroundOpacity: number;
    shadowIntensity: number;
  };
} => {
  let currentContrast = getContrastRatio(backgroundColor, textColor);
  
  if (currentContrast >= targetContrast) {
    return {
      optimizedTextColor: textColor,
      optimizedBackgroundColor: backgroundColor,
      contrastRatio: currentContrast,
      adjustments: {
        textOpacity: 1,
        backgroundOpacity: 0,
        shadowIntensity: 0.2
      }
    };
  }
  
  // Probar con colores optimizados
  const optimizedTextColor = adjustColorForContrast(backgroundColor, targetContrast);
  currentContrast = getContrastRatio(backgroundColor, optimizedTextColor);
  
  const adjustments = {
    textOpacity: currentContrast >= targetContrast ? 1 : Math.min(1, targetContrast / currentContrast * 0.9),
    backgroundOpacity: 0,
    shadowIntensity: currentContrast < 3 ? 0.7 : currentContrast < 4.5 ? 0.4 : 0.2
  };
  
  return {
    optimizedTextColor,
    optimizedBackgroundColor: backgroundColor,
    contrastRatio: currentContrast,
    adjustments
  };
};
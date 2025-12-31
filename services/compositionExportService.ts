import { AspectRatio } from '../types';

export interface CompositionOptions {
  imageUrl: string;
  logoUrl?: string | null;
  productUrl?: string | null;
  overlayText?: string;
  textPosition: { x: number; y: number };
  textStyles: {
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    textColor: string;
    backgroundColor: string;
    letterSpacing: number;
    textTransform: 'none' | 'uppercase' | 'capitalize';
    lineWidth: number;
    effects: {
      shadow: boolean;
      stroke: boolean;
      glow: boolean;
    };
  };
  logoPosition?: { x: number; y: number; width: number };
  productPosition?: { x: number; y: number; width: number; height: number };
  aspectRatio: AspectRatio;
  quality: 'draft' | 'hd';
  // Nuevos parámetros para dimensiones exactas
  containerWidth?: number;
  containerHeight?: number;
}

/**
 * Obtiene las dimensiones en píxeles según el aspect ratio y calidad
 */
export function getDimensionsForAspectRatio(aspectRatio: AspectRatio, quality: 'draft' | 'hd'): { width: number; height: number } {
  const isHD = quality === 'hd';
  
  switch (aspectRatio) {
    case '9:16':
      return isHD ? { width: 1080, height: 1920 } : { width: 540, height: 960 };
    case '1:1':
      return isHD ? { width: 1080, height: 1080 } : { width: 540, height: 540 };
    case '4:5':
      return isHD ? { width: 1080, height: 1350 } : { width: 540, height: 675 };
    default:
      return isHD ? { width: 1080, height: 1920 } : { width: 540, height: 960 };
  }
}

/**
 * Carga una imagen desde una URL y devuelve un objeto Image
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Componer todos los elementos en un canvas y exportar como imagen
 */
export async function composeAndExport(options: CompositionOptions): Promise<string> {
  // Usar dimensiones del contenedor si se proporcionan, sino usar las dimensiones estándar
  const useCustomDimensions = options.containerWidth && options.containerHeight;
  const canvasWidth = useCustomDimensions ? options.containerWidth! : getDimensionsForAspectRatio(options.aspectRatio, options.quality).width;
  const canvasHeight = useCustomDimensions ? options.containerHeight! : getDimensionsForAspectRatio(options.aspectRatio, options.quality).height;
  
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto del canvas');
  }
  
  // Cargar imagen base
  const baseImage = await loadImage(options.imageUrl);
  ctx.drawImage(baseImage, 0, 0, canvasWidth, canvasHeight);
  
  // Función para convertir posición porcentual a píxeles
  const toPixels = (pos: number) => (pos / 100) * (pos === 0 ? 1 : 100);
  
  // Dibujar producto si existe
  if (options.productUrl && options.productPosition) {
    try {
      const productImage = await loadImage(options.productUrl);
      
      // Escalar producto proporcionalmente al tamaño de la imagen
      // Si hay dimensiones personalizadas, usar escala 1:1 (tamaño real)
      const draftWidth = getDimensionsForAspectRatio(options.aspectRatio, 'draft').width;
      const scaleFactor = useCustomDimensions ? (canvasWidth / draftWidth) : (canvasWidth / draftWidth);
      
      // Usar tamaño escalado proporcionalmente
      const prodWidth = options.productPosition.width * scaleFactor;
      const prodHeight = options.productPosition.height * scaleFactor;
      const prodX = (options.productPosition.x / 100) * canvasWidth - (prodWidth / 2);
      const prodY = (options.productPosition.y / 100) * canvasHeight - (prodHeight / 2);
      
      ctx.save();
      ctx.globalAlpha = 0.9;
      // Redondear esquinas con clip
      ctx.beginPath();
      ctx.roundRect(prodX, prodY, prodWidth, prodHeight, 12);
      ctx.clip();
      ctx.drawImage(productImage, prodX, prodY, prodWidth, prodHeight);
      ctx.restore();
    } catch (error) {
      console.warn('No se pudo cargar el producto:', error);
    }
  }
  
  // Dibujar logo si existe
  if (options.logoUrl && options.logoPosition) {
    try {
      const logoImage = await loadImage(options.logoUrl);
      
      // Escalar logo proporcionalmente al tamaño de la imagen
      const draftWidth = getDimensionsForAspectRatio(options.aspectRatio, 'draft').width;
      const scaleFactor = useCustomDimensions ? (canvasWidth / draftWidth) : (canvasWidth / draftWidth);
      
      // Usar el ancho del logo escalado proporcionalmente
      const logoWidth = options.logoPosition.width * scaleFactor;
      const logoX = (options.logoPosition.x / 100) * canvasWidth - (logoWidth / 2);
      const logoY = (options.logoPosition.y / 100) * canvasHeight - (logoWidth / 2);
      
      ctx.save();
      ctx.globalAlpha = 0.9;
      // Calcular altura proporcional
      const aspectRatio = logoImage.width / logoImage.height;
      const logoHeight = logoWidth / aspectRatio;
      ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);
      ctx.restore();
    } catch (error) {
      console.warn('No se pudo cargar el logo:', error);
    }
  }
  
  // Dibujar texto si existe
  if (options.overlayText && options.overlayText.trim()) {
    const { textStyles, aspectRatio } = options;
    const textX = (options.textPosition.x / 100) * canvasWidth;
    const textY = (options.textPosition.y / 100) * canvasHeight;
    
    ctx.save();
    
    // Escalar texto proporcionalmente al tamaño de la imagen
    // Esto asegura que el texto se vea del mismo tamaño relativo en Draft y HD
    const draftWidth = getDimensionsForAspectRatio(options.aspectRatio, 'draft').width;
    const scaleFactor = canvasWidth / draftWidth; // 2x para HD (1080/540 = 2)
    
    // Usar tamaño de fuente escalado proporcionalmente
    const fontSize = textStyles.fontSize * scaleFactor;
    ctx.font = `${textStyles.fontWeight} ${fontSize}px ${textStyles.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Aplicar transformación de texto
    let textToDraw = options.overlayText;
    if (textStyles.textTransform === 'uppercase') {
      textToDraw = textToDraw.toUpperCase();
    } else if (textStyles.textTransform === 'capitalize') {
      textToDraw = textToDraw.replace(/\b\w/g, l => l.toUpperCase());
    }
    
    // Aplicar letterSpacing
    if (textStyles.letterSpacing) {
      ctx.letterSpacing = `${textStyles.letterSpacing}px`;
    }
    
    // Color y efectos
    ctx.fillStyle = textStyles.textColor;
    
    // Fondo del texto si existe
    if (textStyles.backgroundColor && textStyles.backgroundColor !== 'transparent') {
      const metrics = ctx.measureText(textToDraw);
      const padding = 16 * scaleFactor;
      ctx.fillStyle = textStyles.backgroundColor;
      ctx.fillRect(
        textX - metrics.width / 2 - padding,
        textY - fontSize / 2 - padding / 2,
        metrics.width + padding * 2,
        fontSize + padding
      );
      ctx.fillStyle = textStyles.textColor;
    }
    
    // Aplicar efectos
    if (textStyles.effects.shadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 8 * scaleFactor;
      ctx.shadowOffsetX = 4 * scaleFactor;
      ctx.shadowOffsetY = 4 * scaleFactor;
    }
    
    if (textStyles.effects.stroke) {
      ctx.strokeStyle = textStyles.textColor;
      ctx.lineWidth = 3 * scaleFactor;
      ctx.strokeText(textToDraw, textX, textY);
    }
    
    if (textStyles.effects.glow) {
      ctx.shadowColor = textStyles.textColor;
      ctx.shadowBlur = 20 * scaleFactor;
    }
    
    // Dibujar texto con wrap si es necesario
    const maxWidth = textStyles.lineWidth * scaleFactor;
    wrapText(ctx, textToDraw, textX, textY, maxWidth, fontSize * 1.4);
    
    ctx.restore();
  }
  
  // Convertir a blob y devolver URL
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          reject(new Error('Error al generar la imagen'));
        }
      },
      'image/png',
      1.0
    );
  });
}

/**
 * Función auxiliar para envolver texto en múltiples líneas
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  const lines: string[] = [];
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  
  // Dibujar todas las líneas centradas verticalmente
  const totalHeight = lines.length * lineHeight;
  let startY = y - totalHeight / 2 + lineHeight / 2;
  
  lines.forEach((lineText, index) => {
    ctx.fillText(lineText.trim(), x, startY + index * lineHeight);
  });
}

/**
 * Descargar imagen compuesta
 */
export async function downloadComposedImage(options: CompositionOptions, filename?: string): Promise<void> {
  try {
    const imageUrl = await composeAndExport(options);
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || `estudio56-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Limpiar URL temporal
    setTimeout(() => URL.revokeObjectURL(imageUrl), 1000);
    
    console.log('✅ Imagen compuesta descargada exitosamente');
  } catch (error) {
    console.error('❌ Error al descargar imagen compuesta:', error);
    throw error;
  }
}

export default { composeAndExport, downloadComposedImage, getDimensionsForAspectRatio };
/**
 * SERVICIO DE CAPTURA DE DOM - USA HTML2CANVAS
 * Esto asegura que el texto se vea exactamente igual al navegador
 */

import html2canvas from 'html2canvas';

/**
 * Captura un elemento del DOM y lo convierte en imagen
 * Usa las dimensiones reales del elemento
 */
export async function captureElementToImage(
  element: HTMLElement,
  options?: {
    backgroundColor?: string;
    scale?: number;
  }
): Promise<string> {
  if (!element) {
    throw new Error('Elemento no encontrado');
  }

  const canvas = await html2canvas(element, {
    backgroundColor: options?.backgroundColor || '#000000',
    scale: options?.scale || 2, // Calidad 2x para mejor resolución
    useCORS: true, // Permitir imágenes de otros dominios
    allowTaint: true,
    logging: false,
    // Ignorar elementos que no queremos
    ignoreElements: (el) => {
      // Ignorar handles de resize y otros elementos de UI
      return el.classList?.contains('resize-handle') ||
             el.classList?.contains('no-export') ||
             el.tagName === 'BUTTON';
    }
  });

  return canvas.toDataURL('image/png');
}

/**
 * Descarga un elemento del DOM como imagen
 */
export async function downloadElementAsImage(
  element: HTMLElement,
  filename?: string,
  options?: {
    backgroundColor?: string;
    scale?: number;
  }
): Promise<void> {
  const dataUrl = await captureElementToImage(element, options);
  
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename || `estudio56-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Obtiene las dimensiones reales de un elemento
 */
export function getElementDimensions(element: HTMLElement): {
  width: number;
  height: number;
  aspectRatio: string;
} {
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  
  // Calcular aspect ratio aproximado
  const ratio = width / height;
  let aspectRatio = '9:16';
  
  if (ratio > 0.9 && ratio < 1.1) {
    aspectRatio = '1:1';
  } else if (ratio > 0.75 && ratio < 0.85) {
    aspectRatio = '4:5';
  } else if (ratio > 0.55 && ratio < 0.65) {
    aspectRatio = '9:16';
  }
  
  return { width, height, aspectRatio };
}

export default {
  captureElementToImage,
  downloadElementAsImage,
  getElementDimensions
};
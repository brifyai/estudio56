/**
 * Servicio de Post-Procesamiento de Video con FFmpeg.wasm
 * Añade marca de agua (logo) y texto dinámico a videos generados
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Instancia global de FFmpeg
let ffmpeg: FFmpeg | null = null;
let isLoading = false;
let loadPromise: Promise<void> | null = null;

/**
 * Verifica si SharedArrayBuffer está disponible (requerido para FFmpeg.wasm)
 */
export function isSharedArrayBufferSupported(): boolean {
  return typeof SharedArrayBuffer !== 'undefined';
}

/**
 * Obtiene el número de hilos disponibles del procesador
 */
export function getHardwareConcurrency(): number {
  return navigator.hardwareConcurrency || 4;
}

/**
 * Inicializa el motor FFmpeg.wasm
 */
export async function loadFFmpeg(
  onProgress?: (progress: number, message: string) => void
): Promise<void> {
  // Si ya está cargado, retornar
  if (ffmpeg && ffmpeg.loaded) {
    return;
  }

  // Si ya está en proceso de carga, esperar
  if (isLoading && loadPromise) {
    await loadPromise;
    return;
  }

  isLoading = true;

  loadPromise = (async () => {
    try {
      onProgress?.(0, 'Inicializando motor FFmpeg...');
      
      // Verificar soporte de SharedArrayBuffer
      if (!isSharedArrayBufferSupported()) {
        throw new Error('Tu navegador no soporta SharedArrayBuffer. Actualiza a Chrome/Edge最新版.');
      }

      ffmpeg = new FFmpeg();

      // Configurar logger
      ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message);
      });

      // Configurar progreso
      ffmpeg.on('progress', ({ progress, time }) => {
        const percent = Math.round(progress * 100);
        onProgress?.(percent, `Procesando video... ${percent}%`);
      });

      onProgress?.(10, 'Descargando motor FFmpeg...');

      // Cargar el core desde CDN
      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      onProgress?.(100, 'Motor FFmpeg listo');
      console.log('✅ FFmpeg.wasm cargado exitosamente');

    } catch (error) {
      console.error('❌ Error cargando FFmpeg:', error);
      throw error;
    } finally {
      isLoading = false;
    }
  })();

  await loadPromise;
}

/**
 * Descarga un archivo desde una URL
 */
async function downloadFile(url: string): Promise<Uint8Array> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error descargando archivo: ${response.statusText}`);
  }
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/**
 * Procesa un video añadiendo logo y texto
 */
export async function processVideoWithOverlays(
  videoUrl: string,
  options: {
    logoUrl?: string;
    overlayText?: string;
    textPosition?: { x: number; y: number };
    textStyles?: {
      fontSize?: number;
      textColor?: string;
      backgroundColor?: string;
    };
    videoWidth?: number;
    videoHeight?: number;
    onProgress?: (progress: number, message: string) => void;
  }
): Promise<{ success: boolean; videoUrl?: string; error?: string; fallbackUrl?: string }> {
  const {
    logoUrl,
    overlayText,
    textPosition = { x: 50, y: 90 },
    textStyles = {},
    videoWidth = 1280,
    videoHeight = 720,
    onProgress
  } = options;

  try {
    // Verificar soporte
    if (!isSharedArrayBufferSupported()) {
      return {
        success: false,
        error: 'Tu navegador no soporta la edición de video HD. Actualiza Chrome o Edge.',
        fallbackUrl: videoUrl
      };
    }

    // Cargar FFmpeg si no está cargado
    await loadFFmpeg(onProgress);

    onProgress?.(5, 'Preparando archivos...');

    // Escribir video al sistema de archivos virtual
    onProgress?.(15, 'Cargando video...');
    const videoData = await downloadFile(videoUrl);
    await ffmpeg!.writeFile('input.mp4', videoData);

    // Escribir logo si existe
    let hasLogo = false;
    if (logoUrl) {
      onProgress?.(25, 'Cargando logo...');
      try {
        const logoData = await downloadFile(logoUrl);
        await ffmpeg!.writeFile('logo.png', logoData);
        hasLogo = true;
      } catch (logoError) {
        console.warn('No se pudo cargar el logo, continuando sin él:', logoError);
      }
    }

    // Construir filter_complex para texto
    let textDrawFilter = '';
    if (overlayText) {
      onProgress?.(35, 'Preparando texto...');
      
      const fontSize = textStyles.fontSize || 44;
      const textColor = textStyles.textColor || 'white';
      const bgColor = textStyles.backgroundColor || 'black@0.5';
      
      // Escapar texto para FFmpeg
      const escapedText = overlayText.replace(/'/g, "\\'").replace(/:/g, "\\:");
      
      // Posición basada en porcentajes
      const xPos = `${textPosition.x}%`;
      const yPos = `${textPosition.y}%`;
      
      // Añadir texto centrado
      textDrawFilter = `drawtext=text='${escapedText}':fontsize=${fontSize}:fontcolor=${textColor}:x=${xPos}:y=${yPos}:box=1:boxcolor=${bgColor}:boxborderw=10`;
    }

    // Construir comando FFmpeg
    onProgress?.(45, 'Configurando procesamiento...');
    
    const threads = getHardwareConcurrency();
    
    // Filter complex: superponer logo y texto correctamente
    let filterComplex = '';
    
    if (hasLogo && overlayText) {
      // Logo + Texto: overlay del logo, luego drawtext
      // Logo redimensionado a 180px, posicionado en esquina superior derecha (main_w - 180 - 30, 30)
      filterComplex = `[1:v]scale=180:-1[logo];[0:v][logo]overlay=main_w-180-30:30,${textDrawFilter}[out]`;
    } else if (hasLogo) {
      // Solo logo
      filterComplex = `[1:v]scale=180:-1[logo];[0:v][logo]overlay=main_w-180-30:30[out]`;
    } else if (overlayText) {
      // Solo texto
      filterComplex = `[0:v]${textDrawFilter}[out]`;
    }

    const args = [
      '-i', 'input.mp4',
      ...(hasLogo ? ['-i', 'logo.png'] : []),
      ...(filterComplex ? ['-filter_complex', filterComplex] : []),
      ...(filterComplex ? ['-map', '[out]'] : []),
      '-map', '0:a?',
      '-c:v', 'libx264',
      '-preset', 'superfast',
      '-crf', '23',
      '-threads', threads.toString(),
      '-c:a', 'copy',
      'output.mp4'
    ];

    // Si no hay overlays, usar comando simple
    if (!hasLogo && !overlayText) {
      args.splice(2); // Remover filtros
      args.push('output.mp4');
    }

    onProgress?.(50, 'Procesando video...');

    // Ejecutar FFmpeg
    await ffmpeg!.exec(args);

    onProgress?.(95, 'Finalizando...');

    // Leer resultado
    const data = await ffmpeg!.readFile('output.mp4');
    const blob = new Blob([data], { type: 'video/mp4' });
    const resultUrl = URL.createObjectURL(blob);

    onProgress?.(100, '¡Video procesado exitosamente!');

    // Limpiar archivos temporales
    try {
      await ffmpeg!.deleteFile('input.mp4');
      await ffmpeg!.deleteFile('output.mp4');
      if (hasLogo) {
        await ffmpeg!.deleteFile('logo.png');
      }
    } catch (cleanupError) {
      console.warn('Error limpiando archivos temporales:', cleanupError);
    }

    return {
      success: true,
      videoUrl: resultUrl
    };

  } catch (error) {
    console.error('❌ Error procesando video:', error);
    
    // Verificar si es error de memoria
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    const isMemoryError = errorMessage.includes('memory') || errorMessage.includes('Memory');
    
    if (isMemoryError) {
      return {
        success: false,
        error: 'Tu dispositivo se ha quedado sin memoria para procesar el video en 1080p.',
        fallbackUrl: videoUrl
      };
    }

    return {
      success: false,
      error: `Error procesando video: ${errorMessage}`,
      fallbackUrl: videoUrl
    };
  }
}

/**
 * Descarga un video con manejo de errores
 */
export function downloadProcessedVideo(
  videoUrl: string,
  filename: string = 'estudio56-video-procesado.mp4'
): void {
  const link = document.createElement('a');
  link.href = videoUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Descarga el video original como fallback
 */
export function downloadOriginalVideo(
  videoUrl: string,
  filename: string = 'estudio56-video-original.mp4'
): void {
  const link = document.createElement('a');
  link.href = videoUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default {
  isSharedArrayBufferSupported,
  getHardwareConcurrency,
  loadFFmpeg,
  processVideoWithOverlays,
  downloadProcessedVideo,
  downloadOriginalVideo
};
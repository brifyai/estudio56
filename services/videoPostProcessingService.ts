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

// URL de fuente Arial para drawtext
const FONT_URL = 'https://raw.githubusercontent.com/ffmpegwasm/testdata/master/arial.ttf';

/**
 * Verifica si SharedArrayBuffer está disponible (requerido para FFmpeg.wasm)
 */
export function isSharedArrayBufferSupported(): boolean {
  if (typeof SharedArrayBuffer === 'undefined') {
    console.warn('⚠️ SharedArrayBuffer no está definido');
    return false;
  }
  try {
    const sab = new SharedArrayBuffer(8);
    console.log('✅ SharedArrayBuffer disponible');
    return true;
  } catch (error) {
    console.warn('⚠️ SharedArrayBuffer no operativo:', error);
    return false;
  }
}

export function getHardwareConcurrency(): number {
  return navigator.hardwareConcurrency || 4;
}

/**
 * Escapar texto para FFmpeg drawtext
 */
function escapeTextForFFmpeg(text: string): string {
  return text
    .replace(/'/g, "\\'")
    .replace(/:/g, "\\:")
    .replace(/,/g, "\\,")
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/%/g, "\\%");
}

/**
 * Verifica que un archivo existe en el sistema virtual de FFmpeg
 */
async function verifyFileExists(ffmpeg: FFmpeg, filename: string): Promise<boolean> {
  try {
    const data = await ffmpeg.readFile(filename);
    const isValid = data && data.length > 0;
    console.log(`📁 Archivo verificado: ${filename} (${isValid ? data.length + ' bytes' : 'VACÍO'})`);
    return isValid;
  } catch (e) {
    console.error(`❌ Archivo no existe: ${filename}`);
    return false;
  }
}

/**
 * Inicializa el motor FFmpeg.wasm
 */
export async function loadFFmpeg(
  onProgress?: (progress: number, message: string) => void
): Promise<void> {
  if (ffmpeg && ffmpeg.loaded) {
    return;
  }

  if (isLoading && loadPromise) {
    await loadPromise;
    return;
  }

  isLoading = true;

  loadPromise = (async () => {
    try {
      onProgress?.(0, 'Inicializando FFmpeg...');
      
      if (!isSharedArrayBufferSupported()) {
        throw new Error('SharedArrayBuffer no disponible');
      }

      ffmpeg = new FFmpeg();

      // Logger detallado
      ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message);
        if (message.toLowerCase().includes('error') || message.toLowerCase().includes('failed')) {
          (ffmpeg as any).lastError = message;
        }
      });

      // Progreso
      ffmpeg.on('progress', ({ progress }) => {
        const percent = Math.round(progress * 100);
        onProgress?.(percent, `Procesando... ${percent}%`);
      });

      onProgress?.(10, 'Descargando core FFmpeg...');

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
      
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      onProgress?.(60, 'Cargando fuente Arial...');
      
      // Cargar fuente Arial
      try {
        const fontData = await downloadFile(FONT_URL);
        await ffmpeg.writeFile('arial.ttf', fontData);
        console.log('✅ Fuente Arial cargada');
      } catch (fontError) {
        console.warn('⚠️ No se pudo cargar fuente Arial:', fontError);
      }

      onProgress?.(100, 'Motor FFmpeg listo');
      console.log('✅ FFmpeg.wasm cargado');

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
 * Descarga un archivo desde una URL con soporte CORS
 */
async function downloadFile(url: string): Promise<Uint8Array> {
  const response = await fetch(url, {
    mode: 'cors',
    credentials: 'omit',
  });
  if (!response.ok) {
    throw new Error(`Error descargando: ${response.statusText}`);
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
    onProgress?: (progress: number, message: string) => void;
  }
): Promise<{ success: boolean; videoUrl?: string; error?: string; fallbackUrl?: string }> {
  const {
    logoUrl,
    overlayText,
    textPosition = { x: 50, y: 90 },
    textStyles = {},
    onProgress
  } = options;

  try {
    // Verificar SharedArrayBuffer
    if (!isSharedArrayBufferSupported()) {
      return {
        success: false,
        error: 'Tu navegador no soporta SharedArrayBuffer. Actualiza Chrome/Edge.',
        fallbackUrl: videoUrl
      };
    }

    // Cargar FFmpeg
    await loadFFmpeg(onProgress);

    onProgress?.(5, 'Preparando archivos...');

    // Descargar y escribir video
    onProgress?.(15, 'Cargando video...');
    console.log('📥 Descargando video de:', videoUrl);
    const videoData = await downloadFile(videoUrl);
    console.log(`📥 Video descargado: ${videoData.length} bytes`);
    await ffmpeg!.writeFile('input.mp4', videoData);

    // Descargar logo si existe
    let hasLogo = false;
    if (logoUrl) {
      onProgress?.(25, 'Cargando logo...');
      try {
        console.log('📥 Descargando logo de:', logoUrl);
        const logoData = await downloadFile(logoUrl);
        console.log(`📥 Logo descargado: ${logoData.length} bytes`);
        await ffmpeg!.writeFile('logo.png', logoData);
        hasLogo = true;
      } catch (logoError) {
        console.warn('⚠️ No se pudo cargar el logo:', logoError);
        hasLogo = false;
      }
    }

    // Verificar archivos en el sistema virtual
    onProgress?.(30, 'Verificando archivos...');
    const videoOk = await verifyFileExists(ffmpeg!, 'input.mp4');
    const fontOk = await verifyFileExists(ffmpeg!, 'arial.ttf');
    
    if (!videoOk) {
      throw new Error('El video no se descargó correctamente');
    }
    
    if (!fontOk) {
      console.warn('⚠️ Fuente no disponible, el texto podría no aparecer');
    }

    // Construir filter_complex para texto
    let textDrawFilter = '';
    if (overlayText) {
      onProgress?.(35, 'Preparando texto...');
      
      const fontSize = textStyles.fontSize || 44;
      const textColor = textStyles.textColor || 'white';
      const bgColor = textStyles.backgroundColor || 'black@0.5';
      
      // Escapar texto
      const escapedText = escapeTextForFFmpeg(overlayText);
      
      // Posición dinámica basada en el tamaño del video
      const xPos = `(${textPosition.x}*iw/100)`;
      const yPos = `(${textPosition.y}*ih/100)`;
      
      // Añadir texto con fuente
      textDrawFilter = `drawtext=fontfile=arial.ttf:text='${escapedText}':fontsize=${fontSize}:fontcolor=${textColor}:x=${xPos}:y=${yPos}:box=1:boxcolor=${bgColor}:boxborderw=10`;
      
      console.log('📝 Filter de texto:', textDrawFilter);
    }

    // Construir filter_complex dinámicamente
    onProgress?.(45, 'Configurando filtros...');
    
    const threads = getHardwareConcurrency();
    let filterComplex = '';
    let hasOverlays = false;
    
    if (hasLogo && overlayText) {
      // Logo + Texto
      const logoX = '(main_w-180-30)';
      const logoY = '30';
      filterComplex = `[1:v]scale=180:-1[logo];[0:v][logo]overlay=${logoX}:${logoY},${textDrawFilter}[out]`;
      hasOverlays = true;
      console.log('🔧 Filter complejo: Logo + Texto');
    } else if (hasLogo) {
      // Solo logo
      const logoX = '(main_w-180-30)';
      const logoY = '30';
      filterComplex = `[1:v]scale=180:-1[logo];[0:v][logo]overlay=${logoX}:${logoY}[out]`;
      hasOverlays = true;
      console.log('🔧 Filter complejo: Solo Logo');
    } else if (overlayText) {
      // Solo texto
      filterComplex = `[0:v]${textDrawFilter}[out]`;
      hasOverlays = true;
      console.log('🔧 Filter complejo: Solo Texto');
    }

    // Construir argumentos de FFmpeg
    const args = [
      '-i', 'input.mp4',
      ...(hasLogo ? ['-i', 'logo.png'] : []),
      ...(hasOverlays ? ['-filter_complex', filterComplex] : []),
      ...(hasOverlays ? ['-map', '[out]'] : []),
      '-map', '0:a?',
      '-c:v', 'libx264',
      '-preset', 'superfast',
      '-crf', '23',
      '-threads', threads.toString(),
      '-c:a', 'copy',
      'output.mp4'
    ];

    // Sin overlays = copia directa
    if (!hasOverlays) {
      args.splice(2);
      args.push('output.mp4');
    }

    console.log('🎬 Ejecutando FFmpeg con', args.length, 'argumentos');

    onProgress?.(50, 'Procesando video...');

    // Ejecutar FFmpeg
    await ffmpeg!.exec(args);

    onProgress?.(95, 'Finalizando...');

    // Leer resultado
    const data = await ffmpeg!.readFile('output.mp4');
    const blob = new Blob([data], { type: 'video/mp4' });
    const resultUrl = URL.createObjectURL(blob);

    onProgress?.(100, '¡Video procesado exitosamente!');

    // Limpiar
    try {
      await ffmpeg!.deleteFile('input.mp4');
      await ffmpeg!.deleteFile('output.mp4');
      if (hasLogo) await ffmpeg!.deleteFile('logo.png');
    } catch (cleanupError) {
      console.warn('⚠️ Error limpiando:', cleanupError);
    }

    return { success: true, videoUrl: resultUrl };

  } catch (error) {
    console.error('❌ Error procesando video:', error);
    
    const ffmpegError = (ffmpeg as any).lastError || '';
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Errores específicos
    if (errorMessage.includes('FS error') || ffmpegError.includes('complex filter')) {
      console.error('🔍 Error de sistema de archivos o filtros complejos');
      return {
        success: false,
        error: 'Error al procesar el video. Verifica que el video y logo se descargaron correctamente.',
        fallbackUrl: videoUrl
      };
    }
    
    if (errorMessage.includes('memory') || ffmpegError.includes('memory')) {
      return {
        success: false,
        error: 'Memoria insuficiente. Cierra otras pestañas e intenta de nuevo.',
        fallbackUrl: videoUrl
      };
    }

    return {
      success: false,
      error: `Error: ${ffmpegError || errorMessage.substring(0, 100)}`,
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
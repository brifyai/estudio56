/**
 * 🎬 Video Progress Alert
 * SweetAlert para mostrar progreso de generación de videos
 */

import Swal from 'sweetalert2';
import { checkVideoStatus } from './falAiService';
import { checkVideoStatus as checkVideoStatusViaWorker } from './falAiVideoWorkerService';

// Configuración: usar Worker o Netlify Functions
const USE_CLOUDFLARE_WORKER = process.env.REACT_APP_USE_VIDEO_WORKER === 'true';

// ============================================
// TIPOS
// ============================================

type VideoQuality = 'draft' | 'hd';

interface ProgressConfig {
  taskId: string;
  quality: VideoQuality;
  onComplete: (videoUrl: string) => void;
  onError?: (error: string) => void;
}

// ============================================
// MENSAJES POR CALIDAD
// ============================================

const MESSAGES = {
  draft: {
    title: '🎬 Generando Borrador',
    preparing: 'Preparando generación...',
    inQueue: 'En cola de procesamiento...',
    processing: 'Generando video en 480p...',
    almostDone: '¡Casi listo! Finalizando...',
    success: '✅ Borrador Completado',
    successText: 'Tu video borrador está listo',
  },
  hd: {
    title: '✨ Generando HD',
    preparing: 'Preparando upscale a 1080p...',
    inQueue: 'En cola de procesamiento...',
    processing: 'Mejorando calidad a HD...',
    almostDone: '¡Casi listo! Finalizando HD...',
    success: '✅ HD Completado',
    successText: 'Tu video en alta calidad está listo',
  },
};

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

/**
 * Muestra alerta de progreso y hace polling hasta completar
 */
export const showVideoProgressAlert = async (config: ProgressConfig): Promise<void> => {
  const { taskId, quality, onComplete, onError } = config;
  const messages = MESSAGES[quality];

  // Mostrar alerta inicial
  Swal.fire({
    title: messages.title,
    html: `
      <div style="text-align: center;">
        <div class="video-progress-spinner" style="margin: 20px auto;">
          <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        <p id="progress-message" style="margin-top: 20px; font-size: 1.1em; color: #333;">
          ${messages.preparing}
        </p>
        <div style="margin: 20px auto; max-width: 300px;">
          <div style="background: #e0e0e0; border-radius: 10px; height: 8px; overflow: hidden;">
            <div id="progress-bar" style="background: linear-gradient(90deg, #4CAF50, #8BC34A); height: 100%; width: 0%; transition: width 0.5s ease;"></div>
          </div>
        </div>
        <p id="progress-time" style="margin-top: 10px; font-size: 0.95em; color: #666;">
          <strong>0%</strong> completado
        </p>
        <p style="margin-top: 5px; font-size: 0.85em; color: #999;">
          Tiempo estimado: ${quality === 'draft' ? '1-2 minutos' : '3-6 minutos'}
        </p>
      </div>
    `,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      // Iniciar polling
      startPolling(taskId, quality, messages, onComplete, onError);
    },
  });
};

// ============================================
// POLLING
// ============================================

let pollingInterval: NodeJS.Timeout | null = null;
let attemptCount = 0;

const startPolling = async (
  taskId: string,
  quality: VideoQuality,
  messages: typeof MESSAGES.draft,
  onComplete: (videoUrl: string) => void,
  onError?: (error: string) => void
) => {
  attemptCount = 0;
  const maxAttempts = quality === 'draft' ? 24 : 72; // 2 min draft, 6 min HD
  const pollInterval = 5000; // 5 segundos

  const poll = async () => {
    attemptCount++;

    try {
      // Consultar estado (Worker o Netlify)
      const status = USE_CLOUDFLARE_WORKER
        ? await checkVideoStatusViaWorker(taskId, quality)
        : await checkVideoStatus(taskId);

      // Actualizar mensaje según estado
      updateProgressMessage(status.status || 'IN_QUEUE', attemptCount, maxAttempts, messages);

      // Completado
      if (status.status === 'COMPLETED' && status.videoUrl) {
        stopPolling();
        showSuccessAndClose(messages, status.videoUrl, onComplete);
        return;
      }

      // Error
      if (status.status === 'FAILED') {
        stopPolling();
        showErrorAndClose(status.error || 'Error desconocido', onError);
        return;
      }

      // Timeout
      if (attemptCount >= maxAttempts) {
        stopPolling();
        showErrorAndClose('Timeout: El video tardó más de lo esperado', onError);
        return;
      }

    } catch (error: any) {
      console.error('Error en polling:', error);
      // Continuar intentando en caso de error de red
    }
  };

  // Primera consulta inmediata
  await poll();

  // Continuar polling cada 5 segundos
  pollingInterval = setInterval(poll, pollInterval);
};

const stopPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

// ============================================
// ACTUALIZAR MENSAJE
// ============================================

const updateProgressMessage = (
  status: string,
  attempt: number,
  maxAttempts: number,
  messages: typeof MESSAGES.draft
) => {
  const messageEl = document.getElementById('progress-message');
  const timeEl = document.getElementById('progress-time');
  const progressBar = document.getElementById('progress-bar');
  
  if (!messageEl || !timeEl) return;

  // Calcular progreso más realista
  let progress = 0;
  
  if (status === 'IN_QUEUE') {
    // En cola: 0-20%
    progress = Math.min(Math.round((attempt / maxAttempts) * 20), 20);
  } else if (status === 'IN_PROGRESS') {
    // En progreso: 20-90% (crece más lento)
    const progressAttempts = attempt - (maxAttempts * 0.2);
    const maxProgressAttempts = maxAttempts * 0.8;
    progress = 20 + Math.min(Math.round((progressAttempts / maxProgressAttempts) * 70), 70);
  } else {
    // Otros estados: progreso lineal hasta 95%
    progress = Math.min(Math.round((attempt / maxAttempts) * 95), 95);
  }

  // Mensaje según estado
  let message = messages.preparing;
  let icon = '⏳';
  
  if (status === 'IN_QUEUE') {
    message = messages.inQueue;
    icon = '⏳';
  } else if (status === 'IN_PROGRESS') {
    message = messages.processing;
    icon = '🎬';
    
    // Si está en progreso avanzado
    if (progress > 70) {
      message = messages.almostDone;
      icon = '✨';
    }
  }

  messageEl.innerHTML = `${icon} ${message}`;
  timeEl.innerHTML = `<strong>${progress}%</strong> completado`;
  
  // Actualizar barra de progreso visual
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }
};

// ============================================
// MOSTRAR ÉXITO
// ============================================

const showSuccessAndClose = (
  messages: typeof MESSAGES.draft,
  videoUrl: string,
  onComplete: (videoUrl: string) => void
) => {
  // Mostrar éxito brevemente
  Swal.fire({
    icon: 'success',
    title: messages.success,
    text: messages.successText,
    timer: 1500,
    showConfirmButton: false,
    willClose: () => {
      // Llamar callback con URL del video
      onComplete(videoUrl);
    },
  });
};

// ============================================
// MOSTRAR ERROR
// ============================================

const showErrorAndClose = (
  error: string,
  onError?: (error: string) => void
) => {
  Swal.fire({
    icon: 'error',
    title: '❌ Error',
    text: error,
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#d33',
  }).then(() => {
    if (onError) {
      onError(error);
    }
  });
};

// ============================================
// HELPER: CANCELAR POLLING
// ============================================

/**
 * Cancela el polling actual (útil si usuario cierra la app)
 */
export const cancelVideoPolling = () => {
  stopPolling();
  Swal.close();
};

// ============================================
// EJEMPLO DE USO
// ============================================

/*
import { showVideoProgressAlert } from './services/videoProgressAlert';
import { generateDraftVideo, upscaleVideoToHD } from './services/falAiService';

// Generar borrador
const handleGenerateDraft = async () => {
  try {
    // Iniciar generación
    const result = await generateDraftVideo(prompt, { aspectRatio: '9:16' });
    
    if (!result.success || !result.taskId) {
      throw new Error(result.error || 'Error iniciando generación');
    }

    // Mostrar progreso con SweetAlert
    await showVideoProgressAlert({
      taskId: result.taskId,
      quality: 'draft',
      onComplete: (videoUrl) => {
        console.log('Borrador listo:', videoUrl);
        setDraftVideoUrl(videoUrl);
        // El video ya está listo para reproducir
      },
      onError: (error) => {
        console.error('Error:', error);
      },
    });

  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message,
    });
  }
};

// Generar HD
const handleGenerateHD = async () => {
  try {
    // Iniciar upscale
    const result = await upscaleVideoToHD(draftVideoUrl);
    
    if (!result.success || !result.taskId) {
      throw new Error(result.error || 'Error iniciando upscale');
    }

    // Mostrar progreso con SweetAlert
    await showVideoProgressAlert({
      taskId: result.taskId,
      quality: 'hd',
      onComplete: (videoUrl) => {
        console.log('HD listo:', videoUrl);
        setHdVideoUrl(videoUrl);
        // El video ya está listo para reproducir
      },
      onError: (error) => {
        console.error('Error:', error);
      },
    });

  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message,
    });
  }
};
*/

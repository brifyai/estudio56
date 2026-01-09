/**
 * 🎬 Ejemplo de Componente con SweetAlert de Progreso
 */

import React, { useState } from 'react';
import { showVideoProgressAlert } from '../services/videoProgressAlert';
import { generateDraftVideo, upscaleVideoToHD } from '../services/falAiService';
import Swal from 'sweetalert2';

export const VideoGeneratorExample: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [draftVideoUrl, setDraftVideoUrl] = useState<string | null>(null);
  const [hdVideoUrl, setHdVideoUrl] = useState<string | null>(null);

  // ============================================
  // GENERAR BORRADOR
  // ============================================
  const handleGenerateDraft = async () => {
    if (!prompt.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Prompt requerido',
        text: 'Por favor escribe una descripción para tu video',
      });
      return;
    }

    try {
      // 1. Iniciar generación
      const result = await generateDraftVideo(prompt, {
        aspectRatio: '9:16',
      });

      if (!result.success || !result.taskId) {
        throw new Error(result.error || 'Error iniciando generación');
      }

      // 2. Mostrar SweetAlert con progreso
      await showVideoProgressAlert({
        taskId: result.taskId,
        quality: 'draft',
        onComplete: (videoUrl) => {
          // 3. Video listo - guardar URL y mostrar
          console.log('✅ Borrador completado:', videoUrl);
          setDraftVideoUrl(videoUrl);
          // El SweetAlert se cierra automáticamente
        },
        onError: (error) => {
          console.error('❌ Error:', error);
        },
      });

    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error generando video',
      });
    }
  };

  // ============================================
  // GENERAR HD
  // ============================================
  const handleGenerateHD = async () => {
    if (!draftVideoUrl) {
      Swal.fire({
        icon: 'warning',
        title: 'Borrador requerido',
        text: 'Primero genera un borrador',
      });
      return;
    }

    try {
      // 1. Iniciar upscale
      const result = await upscaleVideoToHD(draftVideoUrl);

      if (!result.success || !result.taskId) {
        throw new Error(result.error || 'Error iniciando upscale');
      }

      // 2. Mostrar SweetAlert con progreso
      await showVideoProgressAlert({
        taskId: result.taskId,
        quality: 'hd',
        onComplete: (videoUrl) => {
          // 3. Video HD listo - guardar URL y mostrar
          console.log('✅ HD completado:', videoUrl);
          setHdVideoUrl(videoUrl);
          // El SweetAlert se cierra automáticamente
        },
        onError: (error) => {
          console.error('❌ Error:', error);
        },
      });

    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Error generando HD',
      });
    }
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="video-generator">
      <h2>Generador de Videos</h2>

      {/* Input de prompt */}
      <div className="mb-3">
        <label className="form-label">Describe tu video:</label>
        <textarea
          className="form-control"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ej: A cowboy walking through a dusty town..."
          rows={4}
        />
      </div>

      {/* Botón generar borrador */}
      <button
        className="btn btn-primary"
        onClick={handleGenerateDraft}
        disabled={!prompt.trim()}
      >
        🎬 Generar Borrador (480p)
      </button>

      {/* Video borrador */}
      {draftVideoUrl && (
        <div className="mt-4">
          <h3>Borrador (480p)</h3>
          <video
            src={draftVideoUrl}
            controls
            className="w-100"
            style={{ maxWidth: '600px' }}
          />

          <button
            className="btn btn-success mt-3"
            onClick={handleGenerateHD}
          >
            ✨ Generar HD (1080p)
          </button>
        </div>
      )}

      {/* Video HD */}
      {hdVideoUrl && (
        <div className="mt-4">
          <h3>HD (1080p)</h3>
          <video
            src={hdVideoUrl}
            controls
            className="w-100"
            style={{ maxWidth: '600px' }}
          />
        </div>
      )}
    </div>
  );
};

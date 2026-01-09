import React, { useState } from 'react';
import Swal from 'sweetalert2';

interface VideoPreviewProps {
  /** URL del video draft */
  draftVideoUrl?: string | null;
  /** URL de la imagen estática del draft */
  draftImageUrl?: string | null;
  /** ID único del draft */
  draftId?: string | null;
  /** Seed usado para consistencia */
  seed?: number | null;
  /** Rubro del negocio */
  artDirectionRubro?: string | null;
  /** Callback para convertir a HD */
  onConvertToHD?: () => Promise<string>;
  /** Estado de carga durante conversión HD */
  isConvertingHD?: boolean;
  /** Video en HD (cuando está disponible) */
  hdVideoUrl?: string | null;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  draftVideoUrl,
  draftImageUrl,
  draftId,
  seed,
  artDirectionRubro,
  onConvertToHD,
  isConvertingHD = false,
  hdVideoUrl
}) => {
  const [isComparing, setIsComparing] = useState(false);
  const [activeCompareTab, setActiveCompareTab] = useState<'draft' | 'hd'>('draft');

  const handleConvertToHD = async () => {
    if (!onConvertToHD) return;
    
    try {
      await onConvertToHD();
      setIsComparing(true);
      setActiveCompareTab('hd');
      
      await Swal.fire({
        title: '✨ Video HD Listo',
        text: 'Tu video ha sido convertido a alta definición',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.error('Error converting to HD:', error);
      await Swal.fire({
        title: '❌ Error',
        text: error.message || 'No se pudo convertir a HD',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    }
  };

  const handleDownload = (url: string, suffix: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = `story-art-${artDirectionRubro || 'video'}-${suffix}.mp4`;
    link.click();
  };

  const isHDReady = !!hdVideoUrl;

  // Modo comparador: muestra ambos videos lado a lado
  if (isComparing && hdVideoUrl) {
    return (
      <div className="video-preview-container space-y-4">
        {/* Header del comparador */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              COMPARADOR
            </div>
            <span className="text-xs text-white/50 font-mono">
              ID: {draftId}
            </span>
          </div>
          <button
            onClick={() => setIsComparing(false)}
            className="text-xs text-white/50 hover:text-white transition-colors"
          >
            ✕ Cerrar comparador
          </button>
        </div>

        {/* Tabs de comparación */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveCompareTab('draft')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeCompareTab === 'draft'
                ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            📹 Draft 480p
          </button>
          <button
            onClick={() => setActiveCompareTab('hd')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              activeCompareTab === 'hd'
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            ✨ HD 1080p+
          </button>
        </div>

        {/* Videos lado a lado */}
        <div className="grid grid-cols-2 gap-4">
          {/* Draft */}
          <div className={`relative rounded-xl overflow-hidden ${activeCompareTab === 'draft' ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-blue-500/90 text-white text-xs font-bold rounded">
              DRAFT
            </div>
            <video
              src={draftVideoUrl || ''}
              controls
              className="w-full aspect-[9/16]"
              poster={draftImageUrl || undefined}
            />
          </div>

          {/* HD */}
          <div className={`relative rounded-xl overflow-hidden ${activeCompareTab === 'hd' ? 'ring-2 ring-amber-500' : ''}`}>
            <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-amber-500/90 text-white text-xs font-bold rounded">
              HD
            </div>
            <video
              src={hdVideoUrl}
              controls
              className="w-full aspect-[9/16]"
            />
          </div>
        </div>

        {/* Info de costos */}
        <div className="bg-white/5 rounded-lg p-3 text-xs text-white/60">
          <div className="flex justify-between">
            <span>Draft: $0.05 USD</span>
            <span>HD: $0.55 USD</span>
            <span>Ahorro: $0.50 USD (generando draft primero)</span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          <button
            onClick={() => handleDownload(draftVideoUrl!, 'draft')}
            className="flex-1 py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>⬇️</span>
            <span>Descargar Draft</span>
          </button>
          <button
            onClick={() => handleDownload(hdVideoUrl, 'hd')}
            className="flex-1 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>⬇️</span>
            <span>Descargar HD</span>
          </button>
        </div>

        <style>{`
          .video-preview-container {
            padding: 1rem;
            background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%);
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.1);
          }
        `}</style>
      </div>
    );
  }

  // Modo simple: solo video draft con botón para convertir
  return (
    <div className="video-preview-container space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
            DRAFT 480p
          </div>
          {draftId && (
            <span className="text-xs text-white/50 font-mono">
              ID: {draftId}
            </span>
          )}
        </div>
      </div>

      {/* Video Player */}
      {draftVideoUrl ? (
        <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/10">
          <video
            src={draftVideoUrl}
            controls
            className="w-full aspect-[9/16] max-h-[60vh]"
            poster={draftImageUrl || undefined}
          />
          <div className="absolute top-3 right-3">
            <div className="px-2 py-1 rounded text-xs font-bold bg-blue-500/90 text-white">
              DRAFT
            </div>
          </div>
        </div>
      ) : (
        <div className="aspect-[9/16] max-h-[60vh] bg-black/40 border border-white/10 rounded-xl flex items-center justify-center">
          <div className="text-center text-white/50">
            <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <div className="text-sm">Generando preview...</div>
          </div>
        </div>
      )}

      {/* Info del video */}
      {draftId && (
        <div className="bg-white/5 rounded-lg p-3 text-xs text-white/60">
          <div className="flex justify-between">
            <span>Calidad: 480p (Económica)</span>
            <span>Costo: $0.05 USD</span>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3">
        {draftVideoUrl && (
          <button
            onClick={() => handleDownload(draftVideoUrl, 'draft')}
            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>⬇️</span>
            <span>Descargar Draft</span>
          </button>
        )}

        {/* Botón Generar Video HD */}
        <button
          onClick={handleConvertToHD}
          disabled={isConvertingHD || !onConvertToHD}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConvertingHD ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Convirtiendo...</span>
            </>
          ) : (
            <>
              <span>✨</span>
              <span>Generar Video HD</span>
            </>
          )}
        </button>
      </div>

      {/* Sugerencia */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <svg className="w-8 h-8 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div>
            <div className="text-amber-300 font-medium text-sm mb-1">
              ¿Quieres mejor calidad?
            </div>
            <div className="text-white/60 text-xs">
              Genera Video HD para obtener 1080p+ con más detalles y mejor iluminación.
              <br />
              <span className="text-amber-400">Costo adicional: ~$0.50 USD</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .video-preview-container {
          padding: 1rem;
          background: linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%);
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

export default VideoPreview;
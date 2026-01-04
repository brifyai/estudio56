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
  const [showHD, setShowHD] = useState(false);

  const handleConvertToHD = async () => {
    if (!onConvertToHD) return;
    
    try {
      const hdUrl = await onConvertToHD();
      setShowHD(true);
      
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

  const currentVideoUrl = showHD ? hdVideoUrl : draftVideoUrl;
  const isHDReady = !!hdVideoUrl;

  return (
    <div className="video-preview-container space-y-4">
      {/* Header con estado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${
            showHD 
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' 
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
          }`}>
            {showHD ? 'HD 1080p+' : 'DRAFT 480p'}
          </div>
          
          {draftId && (
            <span className="text-xs text-white/50 font-mono">
              ID: {draftId}
            </span>
          )}
          
          {seed && (
            <span className="text-xs text-white/30 font-mono">
              Seed: {seed}
            </span>
          )}
        </div>

        {/* Indicador de calidad */}
        {isHDReady && !showHD && (
          <div className="text-xs text-amber-400">
            ✓ HD disponible
          </div>
        )}
      </div>

      {/* Video Player */}
      {currentVideoUrl ? (
        <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/10">
          <video
            src={currentVideoUrl}
            controls
            className="w-full aspect-[9/16] max-h-[60vh]"
            poster={draftImageUrl || undefined}
          />
          
          {/* Badge de calidad en el video */}
          <div className="absolute top-3 right-3">
            <div className={`px-2 py-1 rounded text-xs font-bold ${
              showHD 
                ? 'bg-amber-500/90 text-white' 
                : 'bg-blue-500/90 text-white'
            }`}>
              {showHD ? 'HD' : 'DRAFT'}
            </div>
          </div>
        </div>
      ) : (
        /* Placeholder cuando no hay video */
        <div className="aspect-[9/16] max-h-[60vh] bg-black/40 border border-white/10 rounded-xl flex items-center justify-center">
          <div className="text-center text-white/50">
            <div className="text-4xl mb-2">🎬</div>
            <div className="text-sm">Generando preview...</div>
          </div>
        </div>
      )}

      {/* Info del video */}
      {draftId && (
        <div className="bg-white/5 rounded-lg p-3 text-xs text-white/60">
          <div className="flex justify-between">
            <span>Calidad: {showHD ? '1080p+ (Alta)' : '480p (Económica)'}</span>
            <span>Costo: {showHD ? '$$$' : '$0.05 USD'}</span>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3">
        {/* Botón Descargar */}
        {currentVideoUrl && (
          <button
            onClick={() => handleDownload(currentVideoUrl!, showHD ? 'hd' : 'draft')}
            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>⬇️</span>
            <span>Descargar {showHD ? 'HD' : 'Draft'}</span>
          </button>
        )}

        {/* Botón Convertir a HD */}
        {!showHD && isHDReady && onConvertToHD && (
          <button
            onClick={handleConvertToHD}
            disabled={isConvertingHD}
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
                <span>Convertir a HD</span>
              </>
            )}
          </button>
        )}

        {/* Botón Ver Draft (si está en HD) */}
        {showHD && draftVideoUrl && (
          <button
            onClick={() => setShowHD(false)}
            className="flex-1 py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium transition-all flex items-center justify-center gap-2"
          >
            <span>👀</span>
            <span>Ver Draft</span>
          </button>
        )}
      </div>

      {/* Comparación de calidad */}
      {!showHD && isHDReady && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <div className="text-amber-300 font-medium text-sm mb-1">
                ¿Quieres mejor calidad?
              </div>
              <div className="text-white/60 text-xs">
                Convierte a HD para obtener video en 1080p+ con más detalles y mejor iluminación.
                <br />
                <span className="text-amber-400">Costo adicional: ~$0.50 USD</span>
              </div>
            </div>
          </div>
        </div>
      )}

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
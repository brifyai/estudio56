import React, { useState, useEffect, useCallback } from 'react';
import {
  buildArtDirectionPrompt,
  buildArtDirectionPromptByName,
  getArtDirectionConfig,
  hasArtDirection,
  getAvailableArtDirections
} from '../src/services/promptBuilder';
import { getAllArtDirections, type ArtDirectionInput } from '../src/constants/artDirection';
import type { ArtDirectionResult, ContentType } from '../types';
import {
  generatePackDual,
  quickPackDual,
  generateVideoDraft,
  convertDraftToHD,
  type PackDualResult,
  type VideoDraftResult
} from '../services/geminiService';
import { AgencyPackReveal } from './AgencyPackReveal';
import { VideoPreview } from './VideoPreview';

interface StoryArtButtonProps {
  /** Rubro del negocio (ID numérico) */
  industryId: number;
  /** Descripción del sujeto/producto */
  subject: string;
  /** Detalles adicionales opcionales */
  details?: string;
  /** Callback cuando se genera el prompt */
  onPromptGenerated: (result: ArtDirectionResult) => void;
  /** Callback cuando cambia el tipo de contenido */
  onContentTypeChange?: (type: ContentType) => void;
  /** Estado inicial del tipo de contenido */
  initialContentType?: ContentType;
  /** Clases CSS adicionales */
  className?: string;
  /** Deshabilitar el botón */
  disabled?: boolean;
}

export function StoryArtButton({
  industryId,
  subject,
  details,
  onPromptGenerated,
  onContentTypeChange,
  initialContentType = 'flyer',
  className = '',
  disabled = false
}: StoryArtButtonProps) {
  const [contentType, setContentType] = useState<ContentType>(initialContentType);
  const [artDirectionApplied, setArtDirectionApplied] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showRubros, setShowRubros] = useState(false);
  const [showAgencyPack, setShowAgencyPack] = useState(false);
  const [packDualResult, setPackDualResult] = useState<PackDualResult | null>(null);
  const [isGeneratingPack, setIsGeneratingPack] = useState(false);
  
  // ============================================
  // ESTADOS PARA VIDEO DRAFT + HD
  // ============================================
  const [videoDraftResult, setVideoDraftResult] = useState<VideoDraftResult | null>(null);
  const [hdVideoUrl, setHdVideoUrl] = useState<string | null>(null);
  const [isConvertingToHD, setIsConvertingToHD] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);

  // Verificar si el rubro tiene dirección de arte disponible
  const hasArtDirectionForIndustry = hasArtDirection(industryId);

  // Obtener configuración del rubro
  const artConfig = getArtDirectionConfig(industryId);

  const handleContentTypeChange = (newType: ContentType) => {
    setContentType(newType);
    setArtDirectionApplied(false);
    setFeedbackMessage(null);
    
    if (onContentTypeChange) {
      onContentTypeChange(newType);
    }

    // Si selecciona STORY ART, aplicar dirección de arte automáticamente
    if (newType === 'story_art' && hasArtDirectionForIndustry) {
      applyArtDirection();
    }
  };

  const applyArtDirection = () => {
    if (!hasArtDirectionForIndustry) {
      setFeedbackMessage('Este rubro aún no tiene dirección de arte configurada');
      onPromptGenerated({
        prompt: '',
        config: { id: 0, rubro: '', style: '', aspectRatio: '' },
        success: false,
        error: 'Rubro sin dirección de arte'
      });
      return;
    }

    setIsGenerating(true);

    try {
      const input: ArtDirectionInput = {
        industryId,
        userSubject: subject,
        userDetails: details
      };

      const prompt = buildArtDirectionPrompt(input);
      
      setArtDirectionApplied(true);
      setFeedbackMessage('✓ Dirección de arte automática aplicada');

      onPromptGenerated({
        prompt,
        config: {
          id: artConfig!.id,
          rubro: artConfig!.rubro,
          style: artConfig!.style,
          aspectRatio: artConfig!.aspectRatio
        },
        success: true
      });
    } catch (error) {
      setFeedbackMessage('Error al aplicar dirección de arte');
      onPromptGenerated({
        prompt: '',
        config: { id: 0, rubro: '', style: '', aspectRatio: '' },
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Mostrar feedback cuando se selecciona STORY ART
  useEffect(() => {
    if (contentType === 'story_art' && hasArtDirectionForIndustry && !artDirectionApplied) {
      applyArtDirection();
    }
  }, [contentType]);

  // Auto-limpiar feedback después de 3 segundos
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // ============================================
  // GENERACIÓN DE PACK DUAL (Imagen + Video)
  // ============================================
  
  const handleGeneratePackDual = async () => {
    if (!subject.trim()) {
      setFeedbackMessage('Ingresa una descripción del producto/servicio');
      return;
    }

    setIsGeneratingPack(true);
    setFeedbackMessage('🎬 Generando tu Kit de Agencia...');

    try {
      // Usar quickPackDual para generación rápida
      const result = await quickPackDual(
        `${subject} ${details || ''}`.trim(),
        industryId
      );

      if (result.success && result.imageUrl && result.videoUrl) {
        setPackDualResult(result);
        setShowAgencyPack(true);
        setFeedbackMessage('✅ Kit de Agencia generado exitosamente');
      } else {
        setFeedbackMessage(`❌ ${result.error || 'Error generando pack dual'}`);
      }
    } catch (error) {
      console.error('Error generando pack dual:', error);
      setFeedbackMessage('❌ Error al generar imagen y video');
    } finally {
      setIsGeneratingPack(false);
    }
  };

  // ============================================
  // GENERACIÓN DE VIDEO DRAFT (ECONÓMICO)
  // ============================================
  
  const handleGenerateVideoDraft = async () => {
    if (!subject.trim()) {
      setFeedbackMessage('Ingresa una descripción del producto/servicio');
      return;
    }

    setIsGeneratingPack(true);
    setFeedbackMessage('🎬 Generando video draft económico...');
    setShowVideoPreview(true);

    try {
      const prompt = `${subject} ${details || ''}`.trim();
      const result = await generateVideoDraft(prompt, industryId, '9:16');
      
      setVideoDraftResult(result);
      setHdVideoUrl(null); // Reset HD
      setFeedbackMessage('✅ Video draft generado (480p) - Costo: ~$0.05 USD');
      
    } catch (error: any) {
      console.error('Error generando video draft:', error);
      setFeedbackMessage(`❌ ${error.message || 'Error generando video draft'}`);
    } finally {
      setIsGeneratingPack(false);
    }
  };

  // ============================================
  // CONVERSIÓN A HD (USANDO EL MISMO SEED)
  // ============================================
  
  const handleConvertToHD = useCallback(async (): Promise<string> => {
    if (!videoDraftResult) {
      throw new Error('No hay video draft para convertir');
    }

    setIsConvertingToHD(true);
    setFeedbackMessage('✨ Convirtiendo a HD...');

    try {
      const hdUrl = await convertDraftToHD(videoDraftResult);
      setHdVideoUrl(hdUrl);
      setFeedbackMessage('✅ Video convertido a HD (1080p+)');
      return hdUrl;
    } catch (error: any) {
      console.error('Error convirtiendo a HD:', error);
      setFeedbackMessage(`❌ ${error.message || 'Error convirtiendo a HD'}`);
      throw error;
    } finally {
      setIsConvertingToHD(false);
    }
  }, [videoDraftResult]);

  // ============================================
  // GENERACIÓN DIRECTA EN HD (SIN DRAFT)
  // ============================================
  
  const handleGenerateVideoHD = async () => {
    if (!subject.trim()) {
      setFeedbackMessage('Ingresa una descripción del producto/servicio');
      return;
    }

    setIsGeneratingPack(true);
    setFeedbackMessage('🎬 Generando video HD directamente...');
    setShowVideoPreview(true);

    try {
      const prompt = `${subject} ${details || ''}`.trim();
      const draftResult = await generateVideoDraft(prompt, industryId, '9:16');
      
      // Convertir inmediatamente a HD
      const hdUrl = await handleConvertToHD();
      
      // Guardar como draft también para referencia
      setVideoDraftResult({
        ...draftResult,
        draftId: `hd_direct_${Date.now()}`,
        costEstimate: 0.55
      });
      
      setFeedbackMessage('✅ Video HD generado directamente - Costo: ~$0.55 USD');
      
    } catch (error: any) {
      console.error('Error generando video HD:', error);
      setFeedbackMessage(`❌ ${error.message || 'Error generando video HD'}`);
    } finally {
      setIsGeneratingPack(false);
    }
  };

  const handleDownloadImage = () => {
    if (packDualResult?.imageUrl) {
      const link = document.createElement('a');
      link.href = packDualResult.imageUrl;
      link.download = `story-art-${packDualResult.artDirection?.rubro || 'agency'}-image.jpg`;
      link.click();
    }
  };

  const handleDownloadVideo = () => {
    if (packDualResult?.videoUrl) {
      const link = document.createElement('a');
      link.href = packDualResult.videoUrl;
      link.download = `story-art-${packDualResult.artDirection?.rubro || 'agency'}-video.mp4`;
      link.click();
    }
  };

  return (
    <div className={`story-art-button-container ${className}`}>
      
      {/* Video Preview Modal */}
      {showVideoPreview && videoDraftResult && (
        <VideoPreview
          draftVideoUrl={videoDraftResult.draftVideoUrl}
          draftImageUrl={videoDraftResult.draftImageUrl}
          draftId={videoDraftResult.draftId}
          seed={videoDraftResult.seed}
          artDirectionRubro={artConfig?.rubro || null}
          onConvertToHD={handleConvertToHD}
          isConvertingHD={isConvertingToHD}
          hdVideoUrl={hdVideoUrl}
        />
      )}

      {/* Agency Pack Reveal Modal */}
      {showAgencyPack && packDualResult && (
        <AgencyPackReveal
          result={packDualResult}
          onClose={() => setShowAgencyPack(false)}
          onDownloadImage={handleDownloadImage}
          onDownloadVideo={handleDownloadVideo}
        />
      )}
      {/* Selector de Tipo de Contenido */}
      <div className="content-type-selector">
        <label className="content-type-label">
          TIPO DE CONTENIDO
        </label>
        
        <div className="content-type-buttons">
          {/* Botón Flyer Tradicional */}
          <button
            type="button"
            className={`content-type-btn ${contentType === 'flyer' ? 'active' : ''}`}
            onClick={() => handleContentTypeChange('flyer')}
            disabled={disabled}
          >
            <span className="btn-icon">📄</span>
            <span className="btn-text">Flyer</span>
            <span className="btn-ratio">1:1 / 4:5</span>
          </button>

          {/* Botón STORY ART (9:16) - NUEVO */}
          <button
            type="button"
            className={`content-type-btn story-art-btn ${contentType === 'story_art' ? 'active' : ''}`}
            onClick={() => handleContentTypeChange('story_art')}
            disabled={disabled || !hasArtDirectionForIndustry}
          >
            <span className="btn-icon">📱</span>
            <span className="btn-text">Story Art</span>
            <span className="btn-ratio">9:16</span>
            {!hasArtDirectionForIndustry && (
              <span className="btn-badge">Próximo</span>
            )}
          </button>

          {/* Botón Generar Pack Dual (NUEVO) */}
          <button
            type="button"
            className={`content-type-btn pack-dual-btn ${isGeneratingPack ? 'generating' : ''}`}
            onClick={handleGeneratePackDual}
            disabled={disabled || isGeneratingPack || !hasArtDirectionForIndustry}
          >
            <span className="btn-icon">✨</span>
            <span className="btn-text">Pack Dual</span>
            <span className="btn-ratio">Img + Video</span>
            {isGeneratingPack && (
              <span className="btn-loading">
                <span className="spinner"></span>
              </span>
            )}
          </button>

          {/* Botón Video Draft (ECONÓMICO) */}
          <button
            type="button"
            className={`content-type-btn video-draft-btn ${isGeneratingPack ? 'generating' : ''}`}
            onClick={handleGenerateVideoDraft}
            disabled={disabled || isGeneratingPack || !hasArtDirectionForIndustry}
          >
            <span className="btn-icon">📹</span>
            <span className="btn-text">Video Draft</span>
            <span className="btn-ratio">480p - $0.05</span>
            {isGeneratingPack && (
              <span className="btn-loading">
                <span className="spinner"></span>
              </span>
            )}
          </button>

          {/* Botón Video HD (ALTA CALIDAD) */}
          <button
            type="button"
            className={`content-type-btn video-hd-btn ${isGeneratingPack ? 'generating' : ''}`}
            onClick={handleGenerateVideoHD}
            disabled={disabled || isGeneratingPack || !hasArtDirectionForIndustry}
          >
            <span className="btn-icon">🎬</span>
            <span className="btn-text">Video HD</span>
            <span className="btn-ratio">1080p+ - $0.55</span>
            {isGeneratingPack && (
              <span className="btn-loading">
                <span className="spinner"></span>
              </span>
            )}
          </button>

          {/* Botón Reel Cover */}
          <button
            type="button"
            className={`content-type-btn ${contentType === 'reel_cover' ? 'active' : ''}`}
            onClick={() => handleContentTypeChange('reel_cover')}
            disabled={disabled}
          >
            <span className="btn-icon">🎬</span>
            <span className="btn-text">Reel Cover</span>
            <span className="btn-ratio">9:16</span>
          </button>
        </div>
      </div>

      {/* Feedback de Dirección de Arte */}
      {contentType === 'story_art' && (
        <div className={`art-direction-feedback ${artDirectionApplied ? 'success' : 'pending'}`}>
          {isGenerating ? (
            <span className="feedback-loading">
              <span className="spinner"></span>
              Aplicando dirección de arte...
            </span>
          ) : artDirectionApplied ? (
            <span className="feedback-success">
              <span className="check-icon">✓</span>
              {feedbackMessage || `Dirección de arte aplicada: ${artConfig?.rubro || 'Profesional'}`}
            </span>
          ) : hasArtDirectionForIndustry ? (
            <span className="feedback-info">
              <span className="info-icon">ℹ</span>
              Se aplicará dirección de arte automáticamente
            </span>
          ) : (
            <span className="feedback-warning">
              <span className="warning-icon">⚠</span>
              {feedbackMessage || 'Dirección de arte no disponible para este rubro'}
            </span>
          )}
        </div>
      )}

      {/* Info del Rubro Aplicado */}
      {contentType === 'story_art' && artDirectionApplied && artConfig && (
        <div className="art-direction-info">
          <div className="info-header">
            <span className="info-title">🎨 {artConfig.rubro}</span>
            <span className="info-style">{artConfig.style}</span>
          </div>
          <div className="info-details">
            <span className="info-ratio">📐 Formato: {artConfig.aspectRatio}</span>
            <button 
              type="button"
              className="info-toggle"
              onClick={() => setShowRubros(!showRubros)}
            >
              {showRubros ? 'Ocultar' : 'Ver otros rubros'}
            </button>
          </div>
          
          {/* Lista de rubros disponibles */}
          {showRubros && (
            <div className="rubros-list">
              <h4>Dirección de Arte Disponible:</h4>
              <div className="rubros-grid">
                {getAllArtDirections().map((rubro) => (
                  <button
                    key={rubro.id}
                    type="button"
                    className={`rubro-item ${rubro.id === industryId ? 'active' : ''}`}
                    onClick={() => {
                      // Aquí se podría implementar cambio de rubro
                      setShowRubros(false);
                    }}
                  >
                    <span className="rubro-id">{rubro.id}</span>
                    <span className="rubro-name">{rubro.rubro}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .story-art-button-container {
          margin: 1rem 0;
        }

        .content-type-selector {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .content-type-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .content-type-buttons {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .content-type-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem 1.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 100px;
          position: relative;
        }

        .content-type-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .content-type-btn.active {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        }

        .content-type-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .story-art-btn.active {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
        }

        .pack-dual-btn {
          border-color: #f59e0b;
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        }

        .pack-dual-btn:hover:not(:disabled) {
          border-color: #d97706;
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
        }

        .pack-dual-btn.generating {
          border-color: #f59e0b;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        }

        .pack-dual-btn.active {
          border-color: #f59e0b;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
        }

        .video-draft-btn {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        }

        .video-draft-btn:hover:not(:disabled) {
          border-color: #2563eb;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }

        .video-draft-btn.generating {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        }

        .video-hd-btn {
          border-color: #8b5cf6;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
        }

        .video-hd-btn:hover:not(:disabled) {
          border-color: #7c3aed;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
        }

        .video-hd-btn.generating {
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
        }

        .btn-loading {
          position: absolute;
          top: 8px;
          right: 8px;
        }

        .btn-icon {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .btn-text {
          font-weight: 600;
          font-size: 0.875rem;
          color: #1e293b;
        }

        .btn-ratio {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        .btn-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: #f59e0b;
          color: white;
          font-size: 0.625rem;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: 600;
        }

        .art-direction-feedback {
          margin-top: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .art-direction-feedback.success {
          background: #dcfce7;
          color: #166534;
          border: 1px solid #86efac;
        }

        .art-direction-feedback.pending {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
        }

        .art-direction-feedback.warning {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .feedback-loading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #e2e8f0;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .check-icon,
        .info-icon,
        .warning-icon {
          font-size: 1rem;
        }

        .art-direction-info {
          margin-top: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          border-radius: 12px;
          border: 1px solid #c4b5fd;
        }

        .info-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .info-title {
          font-weight: 600;
          color: #5b21b6;
        }

        .info-style {
          font-size: 0.75rem;
          color: #7c3aed;
          background: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
        }

        .info-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .info-toggle {
          background: none;
          border: none;
          color: #7c3aed;
          cursor: pointer;
          font-size: 0.875rem;
          text-decoration: underline;
        }

        .rubros-list {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #ddd6fe;
        }

        .rubros-list h4 {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .rubros-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 0.5rem;
        }

        .rubro-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.75rem;
        }

        .rubro-item:hover {
          border-color: #8b5cf6;
        }

        .rubro-item.active {
          border-color: #8b5cf6;
          background: #f5f3ff;
        }

        .rubro-id {
          background: #ede9fe;
          color: #7c3aed;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.625rem;
        }

        .rubro-name {
          color: #374151;
          text-align: left;
        }

        @media (max-width: 640px) {
          .content-type-buttons {
            flex-direction: column;
          }

          .content-type-btn {
            flex-direction: row;
            justify-content: flex-start;
            gap: 1rem;
          }

          .btn-icon {
            margin-bottom: 0;
          }

          .btn-text {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default StoryArtButton;
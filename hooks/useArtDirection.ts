import { useState, useCallback, useMemo } from 'react';
import {
  buildArtDirectionPrompt,
  getArtDirectionConfig,
  hasArtDirection,
  type ArtDirectionInput
} from '../services/promptBuilder';
import { getAllArtDirections, type ArtDirectionConfig } from '../src/constants/artDirection';
import type { ArtDirectionState, ArtDirectionResult, ContentType } from '../types';

interface UseArtDirectionOptions {
  /** ID inicial del rubro */
  initialIndustryId?: number;
  /** Sujeto inicial */
  initialSubject?: string;
  /** Detalles iniciales */
  initialDetails?: string;
}

/**
 * Hook personalizado para gestionar la Dirección de Arte profesional
 * Maneja el estado del tipo de contenido, generación de prompts y feedback
 */
export function useArtDirection(options: UseArtDirectionOptions = {}) {
  const { initialIndustryId = 1, initialSubject = '', initialDetails = '' } = options;

  // Estado principal
  const [state, setState] = useState<ArtDirectionState>({
    contentType: 'flyer',
    artDirectionId: null,
    artDirectionApplied: false,
    feedbackMessage: null
  });

  // Estado del prompt generado
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [artDirectionConfig, setArtDirectionConfig] = useState<ArtDirectionConfig | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todos los rubros disponibles
  const availableDirections = useMemo(() => getAllArtDirections(), []);

  // Verificar si un rubro tiene dirección de arte
  const isAvailable = useCallback((industryId: number) => {
    return hasArtDirection(industryId);
  }, []);

  // Obtener configuración de un rubro
  const getConfig = useCallback((industryId: number) => {
    return getArtDirectionConfig(industryId);
  }, []);

  // Cambiar el tipo de contenido
  const setContentType = useCallback((type: ContentType) => {
    setState(prev => ({
      ...prev,
      contentType: type,
      artDirectionApplied: type !== 'story_art',
      feedbackMessage: type === 'story_art' ? 'Selecciona STORY ART para aplicar dirección de arte' : null
    }));
    setError(null);
  }, []);

  // Aplicar dirección de arte
  const applyArtDirection = useCallback(async (
    industryId: number,
    subject: string,
    details?: string
  ): Promise<ArtDirectionResult> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Verificar si el rubro tiene dirección de arte
      if (!hasArtDirection(industryId)) {
        const result: ArtDirectionResult = {
          prompt: '',
          config: { id: 0, rubro: '', style: '', aspectRatio: '' },
          success: false,
          error: `El rubro ID ${industryId} no tiene dirección de arte configurada`
        };
        setState(prev => ({
          ...prev,
          artDirectionId: null,
          artDirectionApplied: false,
          feedbackMessage: 'Dirección de arte no disponible para este rubro'
        }));
        setError(result.error);
        setIsGenerating(false);
        return result;
      }

      // Generar el prompt
      const input: ArtDirectionInput = {
        industryId,
        userSubject: subject,
        userDetails: details
      };

      const prompt = buildArtDirectionPrompt(input);
      const config = getArtDirectionConfig(industryId);

      // Actualizar estado
      setGeneratedPrompt(prompt);
      setArtDirectionConfig(config);
      setState(prev => ({
        ...prev,
        contentType: 'story_art',
        artDirectionId: industryId,
        artDirectionApplied: true,
        feedbackMessage: '✓ Dirección de arte automática aplicada'
      }));

      const result: ArtDirectionResult = {
        prompt,
        config: {
          id: config!.id,
          rubro: config!.rubro,
          style: config!.style,
          aspectRatio: config!.aspectRatio
        },
        success: true
      };

      setIsGenerating(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      
      const result: ArtDirectionResult = {
        prompt: '',
        config: { id: 0, rubro: '', style: '', aspectRatio: '' },
        success: false,
        error: errorMessage
      };

      setError(errorMessage);
      setState(prev => ({
        ...prev,
        artDirectionApplied: false,
        feedbackMessage: 'Error al aplicar dirección de arte'
      }));
      setIsGenerating(false);
      return result;
    }
  }, []);

  // Resetear el estado
  const reset = useCallback(() => {
    setState({
      contentType: 'flyer',
      artDirectionId: null,
      artDirectionApplied: false,
      feedbackMessage: null
    });
    setGeneratedPrompt('');
    setArtDirectionConfig(null);
    setError(null);
    setIsGenerating(false);
  }, []);

  // Obtener el prompt actual (para enviar a generación)
  const getCurrentPrompt = useCallback(() => {
    if (state.contentType === 'story_art' && state.artDirectionApplied && generatedPrompt) {
      return generatedPrompt;
    }
    return null; // El prompt se generará de forma estándar
  }, [state.contentType, state.artDirectionApplied, generatedPrompt]);

  // Verificar si está activo STORY ART
  const isStoryArtActive = state.contentType === 'story_art' && state.artDirectionApplied;

  return {
    // Estado
    contentType: state.contentType,
    artDirectionApplied: state.artDirectionApplied,
    feedbackMessage: state.feedbackMessage,
    isGenerating,
    error,
    generatedPrompt,
    artDirectionConfig,
    isStoryArtActive,
    availableDirections,
    
    // Acciones
    setContentType,
    applyArtDirection,
    reset,
    getCurrentPrompt,
    isAvailable,
    getConfig
  };
}

export default useArtDirection;
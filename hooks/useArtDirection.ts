import { useState, useCallback, useMemo } from 'react';
import {
  buildArtDirectionPrompt,
  getArtDirectionConfig,
  hasArtDirection
} from '../src/services/promptBuilder';
import { getAllArtDirections, type ArtDirectionConfig, type ArtDirectionInput } from '../src/constants/artDirection';
import {
  STORY_ART_VISUAL_STYLES,
  getStoryArtStyleById as getStoryArtStyle,
  getAllStoryArtStyles,
  buildStoryArtPrompt,
  type StoryArtStyle,
  type StoryArtStyleId
} from '../src/constants/storyArtStyles';
import type { ArtDirectionState, ArtDirectionResult, ContentType, StoryArtResult } from '../types';

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
 * INCLUYE: Sistema de Estilos Story Art (7 estilos visuales únicos)
 */
export function useArtDirection(options: UseArtDirectionOptions = {}) {
  const { initialIndustryId = 1, initialSubject = '', initialDetails = '' } = options;

  // Estado principal de Dirección de Arte
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

  // ============================================
  // 🎨 ESTADO DE STORY ART STYLES
  // ============================================
  const [storyArtStyle, setStoryArtStyle] = useState<StoryArtStyle | null>(null);
  const [storyArtStyleId, setStoryArtStyleId] = useState<StoryArtStyleId | null>(null);

  // Obtener todos los rubros disponibles
  const availableDirections = useMemo(() => getAllArtDirections(), []);

  // Obtener todos los estilos Story Art disponibles
  const availableStoryArtStyles = useMemo(() => getAllStoryArtStyles(), []);

  // Verificar si un rubro tiene dirección de arte
  const isAvailable = useCallback((industryId: number) => {
    return hasArtDirection(industryId);
  }, []);

  // Obtener configuración de un rubro
  const getConfig = useCallback((industryId: number) => {
    return getArtDirectionConfig(industryId);
  }, []);

  // ============================================
  // 🎨 SELECCIÓN DE ESTILO STORY ART
  // ============================================

  /**
   * Selecciona un estilo visual para Story Art
   */
  const selectStoryArtStyle = useCallback((styleId: StoryArtStyleId): void => {
    const style = getStoryArtStyle(styleId);
    if (style) {
      setStoryArtStyle(style);
      setStoryArtStyleId(styleId);
      console.log(`🎨 [Story Art] Estilo seleccionado: ${style.name} (${style.category})`);
    }
  }, []);

  /**
   * Obtiene el estilo Story Art actualmente seleccionado
   */
  const getSelectedStoryArtStyle = useCallback((): StoryArtStyle | null => {
    return storyArtStyle;
  }, [storyArtStyle]);

  /**
   * Verifica si hay un estilo Story Art seleccionado
   */
  const hasStoryArtStyle = useCallback((): boolean => {
    return storyArtStyleId !== null;
  }, [storyArtStyleId]);

  // Cambiar el tipo de contenido
  const setContentType = useCallback((type: ContentType) => {
    setState(prev => ({
      ...prev,
      contentType: type,
      artDirectionApplied: type !== 'story_art',
      feedbackMessage: type === 'story_art' ? 'Selecciona un estilo visual para tu Story Art' : null
    }));
    setError(null);
  }, []);

  // Aplicar dirección de arte CON estilo Story Art
  const applyArtDirection = useCallback(async (
    industryId: number,
    subject: string,
    details?: string,
    styleId?: StoryArtStyleId
  ): Promise<StoryArtResult> => {
    setIsGenerating(true);
    setError(null);

    try {
      // Verificar si el rubro tiene dirección de arte
      if (!hasArtDirection(industryId)) {
        const result: StoryArtResult = {
          success: false,
          prompt: '',
          style: null,
          artDirectionConfig: null,
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

      // Obtener configuración del rubro
      const config = getArtDirectionConfig(industryId);
      if (!config) {
        throw new Error(`No se encontró configuración para el rubro ID: ${industryId}`);
      }

      // Determinar el prompt final
      let finalPrompt: string;

      // Si hay un estilo Story Art seleccionado, usar buildStoryArtPrompt
      if (styleId) {
        const style = getStoryArtStyle(styleId);
        if (style) {
          setStoryArtStyle(style);
          setStoryArtStyleId(styleId);
          
          // Construir prompt con estilo visual (la dirección de arte se aplica en generateFlyerImage)
          finalPrompt = buildStoryArtPrompt(
            `${subject}${details ? `. ${details}` : ''}`,
            styleId
          );
          
          console.log(`🎨 [Story Art] Prompt construido con estilo: ${style.name}`);
          console.log(`📝 [Story Art] Preview: ${finalPrompt.substring(0, 150)}...`);
        } else {
          finalPrompt = buildArtDirectionPrompt({
            industryId,
            userSubject: subject,
            userDetails: details
          });
        }
      } else {
        // Usar prompt de dirección de arte estándar
        finalPrompt = buildArtDirectionPrompt({
          industryId,
          userSubject: subject,
          userDetails: details
        });
      }

      // Actualizar estado
      setGeneratedPrompt(finalPrompt);
      setArtDirectionConfig(config);
      setState(prev => ({
        ...prev,
        contentType: 'story_art',
        artDirectionId: industryId,
        artDirectionApplied: true,
        feedbackMessage: storyArtStyle
          ? `✓ ${storyArtStyle.name} aplicado`
          : '✓ Dirección de arte aplicada'
      }));

      const result: StoryArtResult = {
        success: true,
        prompt: finalPrompt,
        style: storyArtStyle,
        artDirectionConfig: {
          id: config.id,
          rubro: config.rubro,
          prompt: config.prompt
        }
      };

      setIsGenerating(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      
      const result: StoryArtResult = {
        success: false,
        prompt: '',
        style: null,
        artDirectionConfig: null,
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
  }, [storyArtStyle]);

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
    setStoryArtStyle(null);
    setStoryArtStyleId(null);
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
    // Estado principal
    contentType: state.contentType,
    artDirectionApplied: state.artDirectionApplied,
    feedbackMessage: state.feedbackMessage,
    isGenerating,
    error,
    generatedPrompt,
    artDirectionConfig,
    isStoryArtActive,
    availableDirections,
    
    // 🎨 Estado de Story Art Styles
    storyArtStyle,
    storyArtStyleId,
    availableStoryArtStyles,
    
    // Acciones principales
    setContentType,
    applyArtDirection,
    reset,
    getCurrentPrompt,
    isAvailable,
    getConfig,
    
    // 🎨 Acciones de Story Art Styles
    selectStoryArtStyle,
    getSelectedStoryArtStyle,
    hasStoryArtStyle
  };
}

export default useArtDirection;
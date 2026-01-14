import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Swal from 'sweetalert2';
import { Monitor, Smartphone, Square, Palette, LayoutTemplate, Zap, Briefcase, Star, MonitorPlay, Leaf, Camera, Building2, Feather, Sun, Aperture, Moon, Coffee, Box } from 'lucide-react';
import { estudioAlerts } from '../src/lib/alerts';
import { FlyerStyleKey, FlyerStyleKeyVideo, AspectRatio, MediaType, ImageQuality, OverlayStyle, PosterStyle, CreationMode, CREATION_MODES } from '../types';
import { FLYER_STYLES, VIDEO_STYLES, ASPECT_RATIO_LABELS, POSTER_STYLES } from '../constants';
import { analyzeUrlContent, generatePersuasiveText, INDUSTRY_TEXT_TEMPLATES, detectIndustryFromDescription, enhanceUserImage } from '../services/geminiService';
import { REALITY_MODE_LABELS, type RealityMode } from '../src/constants/promptModifiers';
import { ImageAnalysisResult } from '../services/imageAnalysisService';
import { processMagicMode, MagicModeResult, STYLE_NAMES_ES, detectVideoStyleFromInput, VIDEO_STYLE_NAMES_ES, getVideoStyleFromImageStyle } from '../services/magicModeService';
import { SurfaceType } from '../hooks/useSurfaceDetection';
// 🎨 STORY ART STYLES - Importar estilos visuales únicos
import {
  STORY_ART_VISUAL_STYLES,
  getStoryArtStyleById as getStoryArtStyle,
  getAllStoryArtStyles,
  type StoryArtStyle,
  type StoryArtStyleId
} from '../src/constants/storyArtStyles';
// 🎨 CANVAS EDITOR - Editor visual tipo Canva
import CanvasEditor from './canvas/CanvasEditor';
// 🎨 CREATION MODE SELECTOR - Selector de modos de creación
import CreationModeSelector from './CreationModeSelector';
// 🏷️ BRAND SIDEBAR - Controles del editor de marca
import BrandSidebar from './brand/BrandSidebar';
import { BrandData, defaultBrandData } from './brand/BrandTypes';

interface FlyerFormProps {
  creationMode: CreationMode; // NEW: Modo de creación (Diseño, Canva, Libre)
  onCreationModeChange: (mode: CreationMode) => void; // NEW: Callback para cambiar modo
  // Brand mode props
  brandData?: BrandData;
  setBrandData?: React.Dispatch<React.SetStateAction<BrandData>>;
  brandActiveTab?: 'identity' | 'colors' | 'typography';
  setBrandActiveTab?: (tab: 'identity' | 'colors' | 'typography') => void;
  onBrandPrint?: () => void;
  styleKey: FlyerStyleKey;
  videoStyleKey?: FlyerStyleKeyVideo; // NEW: Estado separado para estilos de video
  aspectRatio: AspectRatio;
  mediaType: MediaType;
  description: string;
  logoUrl: string | null;
  productUrl: string | null;
  overlayText: string;
  overlayStyle: OverlayStyle;
  workMode: 'auto' | 'manual'; // NEW: Modo de trabajo
  setOverlayText: (t: string) => void;
  setOverlayStyle: (s: OverlayStyle) => void;
  setStyleKey: (s: FlyerStyleKey) => void;
  setVideoStyleKey?: (s: FlyerStyleKeyVideo) => void; // NEW: Setter para estilo de video
  setAspectRatio: (r: AspectRatio) => void;
  setMediaType: (m: MediaType) => void;
  setDescription: (s: string) => void;
  setLogoUrl: (url: string | null) => void;
  setProductUrl: (url: string | null) => void;
  setWorkMode: (mode: 'auto' | 'manual') => void; // NEW: Setter para modo de trabajo
  onSubmit: () => void;
  isLoading: boolean;
  status?: { message: string }; // NEW: Status del padre para progreso
  imageUrl?: string | null; // NEW: URL de imagen para detectar cuando termina
  draftImageUrl?: string | null; // NEW: URL de imagen draft para cierre de alerta
  imageQuality: ImageQuality;
  setImageQuality: (q: ImageQuality) => void;
  onStyleDetected: (styleDescription: string, detectedText?: string, textStyle?: string) => void; // UPDATED: Include detected text
  onOpenGallery: () => void; // NEW PROP
  imageAnalysis?: ImageAnalysisResult | null; // NEW: Análisis de imagen
  onImprovedImageChange?: (url: string | null) => void; // NEW: Callback para imagen mejorada en modo estudio
  onUploadedImageChange?: (url: string | null) => void; // NEW: Callback para imagen original subida
  studioRealityLevel?: number; // NEW: Nivel de transformación en modo estudio
  onStudioRealityLevelChange?: (level: number) => void; // NEW: Callback para cambiar nivel
  triggerStudioImprove?: number; // NEW: Trigger para mejorar imagen
  intelligentTextStyles?: any; // NEW: Estilos de texto inteligentes
  contextualTypography?: any; // NEW: Tipografía contextual
  contrastAnalysis?: any; // NEW: Análisis de contraste
  contextualEffects?: any; // NEW: Efectos contextuales
  compositionAnalysis?: any; // NEW: Análisis de composición
  autoTextValidation?: any; // NEW: Validación automática del texto
  enhancedStyles?: any; // NEW: Estilos combinados
  textMode?: 'auto' | 'manual'; // NEW: Modo de texto (Opción B)
  setTextMode?: (mode: 'auto' | 'manual') => void; // NEW: Setter para modo de texto
  textPosition?: { x: number; y: number }; // NEW: Posición actual del texto
  setTextPosition?: (pos: { x: number; y: number }) => void; // NEW: Setter para posición
  resetTextPosition?: () => void; // NEW: Función para resetear posición
  manualTextStyles?: any; // NEW: Estilos manuales actuales
  onManualTextStylesChange?: (styles: any) => void; // NEW: Callback para estilos manuales
  onClearInput?: () => void; // NEW: Callback para limpiar entrada y análisis
  currentSpanishPrompt?: string; // NEW: Prompt en español para mostrar al usuario
  onSpanishPromptUpdate?: (prompt: string) => void; // NEW: Callback para actualizar prompt en español desde análisis de URL
  posterStyle?: PosterStyle; // NEW: Estilo de poster seleccionado (desde padre)
  setPosterStyle?: (style: PosterStyle) => void; // NEW: Setter para estilo de poster
  // Surface Detection props
  selectedSurface?: SurfaceType;
  setSelectedSurface?: (surface: SurfaceType) => void;
  autoDetectedSurface?: SurfaceType | null;
  
  // 🎨 Story Art Visual Style props
  storyArtVisualStyleId?: StoryArtStyleId | null;
  onStoryArtStyleSelected?: (id: StoryArtStyleId | null) => void;
  
  // NEW: Props para modo Canva
  canvaUrlInput?: string;
  setCanvaUrlInput?: (url: string) => void;
  canvaAnalyzeTrigger?: number;
  setCanvaAnalyzeTrigger?: (trigger: number) => void;
  // NEW: Props para controles de Canva (formato y estilos)
  canvaHasImages?: boolean;
  canvaActiveFormat?: 'landscape' | 'portrait' | 'square';
  canvaSelectedStyle?: string;
  canvaBrandColors?: string[];
  onCanvaFormatChange?: (format: 'landscape' | 'portrait' | 'square') => void;
  onCanvaStyleChange?: (styleId: string) => void;
}

export const FlyerForm: React.FC<FlyerFormProps> = ({
  creationMode, // NEW: Modo de creación
  onCreationModeChange, // NEW: Callback para cambiar modo
  // Brand mode props
  brandData,
  setBrandData,
  brandActiveTab = 'identity',
  setBrandActiveTab,
  onBrandPrint,
  styleKey,
  videoStyleKey, // NEW: Estado separado para video
  aspectRatio,
  mediaType,
  description,
  logoUrl,
  productUrl,
  overlayText,
  overlayStyle,
  workMode, // NEW: Modo de trabajo
  setOverlayText,
  setOverlayStyle,
  setStyleKey,
  setVideoStyleKey, // NEW: Setter para video
  setAspectRatio,
  setMediaType,
  setDescription,
  setLogoUrl,
  setProductUrl,
  setWorkMode, // NEW: Setter para modo de trabajo
  onSubmit,
  isLoading,
  status = { message: '' },
  imageUrl = null,
  draftImageUrl = null,
  imageQuality,
  setImageQuality,
  onStyleDetected,
  onOpenGallery,
  imageAnalysis,
  onImprovedImageChange, // NEW: Callback para imagen mejorada
  onUploadedImageChange, // NEW: Callback para imagen original
  studioRealityLevel: studioRealityLevelProp = 1.5, // NEW: Nivel de transformación (default 1.5★ - conservador)
  onStudioRealityLevelChange, // NEW: Callback para cambiar nivel
  triggerStudioImprove = 0, // NEW: Trigger para mejorar
  intelligentTextStyles,
  compositionAnalysis,
  autoTextValidation,
  textMode = 'auto',
  setTextMode,
  textPosition,
  setTextPosition,
  resetTextPosition,
  manualTextStyles,
  onManualTextStylesChange,
  onClearInput,
  currentSpanishPrompt = '',
  onSpanishPromptUpdate, // NEW: Callback para actualizar prompt en español desde análisis de URL
  posterStyle: posterStyleProp = 'promotional', // NEW: Estilo de poster desde padre
  setPosterStyle, // NEW: Setter para estilo de poster
  // Surface Detection defaults
  selectedSurface = 'default',
  setSelectedSurface = () => {},
  autoDetectedSurface = null,
  // 🎨 Story Art Visual Style defaults
  storyArtVisualStyleId: storyArtVisualStyleIdProp = null,
  onStoryArtStyleSelected = (_id: StoryArtStyleId | null) => {},
  // NEW: Props para modo Canva
  canvaUrlInput: canvaUrlInputProp = '',
  setCanvaUrlInput: setCanvaUrlInputProp,
  canvaAnalyzeTrigger: canvaAnalyzeTriggerProp = 0,
  setCanvaAnalyzeTrigger: setCanvaAnalyzeTriggerProp,
  // NEW: Props para controles de Canva
  canvaHasImages = false,
  canvaActiveFormat = 'landscape',
  canvaSelectedStyle = 'modern',
  canvaBrandColors = [],
  onCanvaFormatChange,
  onCanvaStyleChange
}) => {
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // NEW: Usar props externas para URL de Canva si están disponibles
  const [internalCanvaUrlInput, setInternalCanvaUrlInput] = useState('');
  const canvaUrlInput = canvaUrlInputProp !== undefined ? canvaUrlInputProp : internalCanvaUrlInput;
  const setCanvaUrlInput = setCanvaUrlInputProp || setInternalCanvaUrlInput;
  const [isCanvaAnalyzing, setIsCanvaAnalyzing] = useState(false);
  
  // NEW: Ref para mantener la instancia de la alerta de progreso
  const progressAlertRef = useRef<{
    updateProgress: (percent: number, message: string) => void;
    close: () => void;
  } | null>(null);
  
  // NEW: Estados para objetivo de marketing
  const [marketingObjective, setMarketingObjective] = useState<'branding' | 'leads' | null>(null);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  
  // NUEVO: Estados para alternativas de texto
  const [textOptions, setTextOptions] = useState<{branding: string[], leads: string[]} | null>(null);
  const [selectedTextOption, setSelectedTextOption] = useState<string>('');
  
  // Validación para habilitar botón GENERAR CAMPAÑA
  const canGenerate = useMemo(() => {
    const hasMediaType = mediaType && mediaType !== '';
    const hasDescription = description && description.trim() !== '';
    
    // Para image y product_study, también necesita marketing objective y texto seleccionado
    if (mediaType === 'image' || mediaType === 'product_study') {
      const hasMarketingObjective = marketingObjective && marketingObjective !== '';
      const hasTextOption = selectedTextOption && selectedTextOption !== '';
      return hasMediaType && hasDescription && hasMarketingObjective && hasTextOption;
    }
    
    // Para video y story_art, solo necesita mediaType y description
    return hasMediaType && hasDescription;
  }, [mediaType, description, marketingObjective, selectedTextOption]);
  
  // NUEVO: Estados para Modo Magia
  const [magicModeResult, setMagicModeResult] = useState<MagicModeResult | null>(null);
  const [isMagicModeActive, setIsMagicModeActive] = useState(false);
  
  // NUEVO: Estados para detección de video
  const [videoMagicModeResult, setVideoMagicModeResult] = useState<{styleKey: FlyerStyleKeyVideo, confidence: number, detectedIndustry: string} | null>(null);
  
  // NUEVO: Estados para imagen subida por usuario
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isImprovingImage, setIsImprovingImage] = useState(false);
  const [improvedImageUrl, setImprovedImageUrl] = useState<string | null>(null);
  
  // NUEVO: Estados para el switch de modo de realismo
  const [realityMode, setRealityMode] = useState<RealityMode>('realist');
  
  // NUEVO: Usar el nivel de transformación del prop (eliminado estado local)
  const studioRealityLevel = studioRealityLevelProp;
  const setStudioRealityLevel = onStudioRealityLevelChange || (() => {});
  
  // NUEVO: Estados para STORY ART - DIRECCIÓN DE ARTE PROFESIONAL
  const [isStoryArtModeActive, setIsStoryArtModeActive] = useState(false);
  const [artDirectionApplied, setArtDirectionApplied] = useState(false);
  const [artDirectionFeedback, setArtDirectionFeedback] = useState<string | null>(null);
  
  // 🎨 ESTADOS PARA ESTILOS VISUALES STORY ART (7 estilos únicos)
  // Sincronizar con props del padre
  const [storyArtVisualStyle, setStoryArtVisualStyle] = useState<StoryArtStyle | null>(() =>
    storyArtVisualStyleIdProp ? getStoryArtStyle(storyArtVisualStyleIdProp) : null
  );
  const [storyArtVisualStyleId, setStoryArtVisualStyleIdLocal] = useState<StoryArtStyleId | null>(() =>
    storyArtVisualStyleIdProp || null
  );
  
  // Sincronizar estado local con props del padre
  useEffect(() => {
    if (storyArtVisualStyleIdProp !== undefined && storyArtVisualStyleIdProp !== null) {
      setStoryArtVisualStyleIdLocal(storyArtVisualStyleIdProp);
      setStoryArtVisualStyle(getStoryArtStyle(storyArtVisualStyleIdProp));
    }
  }, [storyArtVisualStyleIdProp]);
  
  // Handler unificado que actualiza estado local Y notifica al padre
  const handleStoryArtVisualStyleChange = (newStyleId: StoryArtStyleId | null) => {
    setStoryArtVisualStyleIdLocal(newStyleId);
    setStoryArtVisualStyle(newStyleId ? getStoryArtStyle(newStyleId) : null);
    const callback = onStoryArtStyleSelected as ((id: StoryArtStyleId | null) => void) | undefined;
    if (callback) {
      callback(newStyleId);
    }
  };
  
  // Obtener todos los estilos visuales Story Art disponibles
  const availableStoryArtVisualStyles = getAllStoryArtStyles();
  
  // Estados para Estilo de Integración Visual (Surface Detection) - Ahora vienen del padre
  
  // Editor de texto states - TAMAÑO REDUCIDO POR DEFECTO
  const [fontSize, setFontSize] = useState(24); // Reducido de 48px a 24px
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
  const [fontWeight, setFontWeight] = useState('bold');
  const [fontStyle, setFontStyle] = useState('normal');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textEffects, setTextEffects] = useState({
    glow: false,
    shadow: true,
    stroke: false
  });
  
  const selectedStyle = FLYER_STYLES[styleKey];

  // NUEVO: Activar Modo Magia automáticamente
  const activateMagicMode = async (input: string) => {
    if (input.length < 3) return; // No activar si el input es muy corto
    
    console.log('🔮 Activando Modo Magia para:', input);
    setIsMagicModeActive(true);
    
    try {
      // Procesar con Modo Magia
      const result = processMagicMode(input);
      setMagicModeResult(result);
      
      console.log('✅ Modo Magia completado:', result);
      
      // Si estamos en modo manual, aplicar el estilo detectado
      if (workMode === 'manual' && result.styleKey !== styleKey) {
        setStyleKey(result.styleKey);
      }
      
    } catch (error) {
      console.error('❌ Error en Modo Magia:', error);
    } finally {
      setIsMagicModeActive(false);
    }
  };
  
  // Función para actualizar estilos y notificar al componente padre
  const updateManualTextStyles = (updates: Partial<typeof manualTextStyles>) => {
    const newStyles = {
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      textColor,
      letterSpacing,
      effects: textEffects,
      ...updates
    };
    console.log('🔄 Actualizando estilos manuales:', newStyles);
    onManualTextStylesChange && onManualTextStylesChange(newStyles);
  };
  
  // ELIMINADO: useEffect problemático que causaba bucle infinito
  // Los estilos se actualizarán manualmente cuando el usuario cambie los controles

  // Sincronizar estados locales con props
  useEffect(() => {
    if (manualTextStyles) {
      setFontSize(manualTextStyles.fontSize || 48);
      setFontFamily(manualTextStyles.fontFamily || 'Inter, sans-serif');
      setFontWeight(manualTextStyles.fontWeight || 'bold');
      setFontStyle(manualTextStyles.fontStyle || 'normal');
      setTextColor(manualTextStyles.textColor || '#FFFFFF');
      setLetterSpacing(manualTextStyles.letterSpacing || 0);
      setTextEffects(manualTextStyles.effects || { glow: false, shadow: true, stroke: false });
    }
  }, [manualTextStyles]);

  useEffect(() => {
    const neonVibes = ['urban_night', 'gamer_stream', 'tech_saas', 'auto_metallic'];
    const saleVibes = ['retail_sale', 'sport_gritty', 'typo_bold'];
    const elegantVibes = ['luxury_gold', 'realestate_night', 'worship_sky', 'wellness_zen', 'aesthetic_min'];
    
    if (neonVibes.includes(styleKey)) setOverlayStyle('neon');
    else if (saleVibes.includes(styleKey)) setOverlayStyle('sale');
    else if (elegantVibes.includes(styleKey)) setOverlayStyle('elegant');
    else setOverlayStyle('modern');
  }, [styleKey, setOverlayStyle]);
  
  // NUEVO: Activar Modo Magia cuando cambie la descripción (IMÁGENES)
  // EXCLUIMOS product_study ya que ese modo es para subir fotos propias, no generar con IA
  useEffect(() => {
    if (description.length >= 3 && mediaType === 'image') {
      const timeoutId = setTimeout(() => {
        activateMagicMode(description);
      }, 800); // Esperar 800ms después del último cambio
      
      return () => clearTimeout(timeoutId);
    } else if (mediaType === 'image') {
      setMagicModeResult(null);
    }
  }, [description, mediaType]);

  // NUEVO: Observar trigger para mejorar imagen en modo estudio
  useEffect(() => {
    if (triggerStudioImprove > 0 && uploadedImage && mediaType === 'product_study') {
      console.log('🎯 [TRIGGER] Mejorando imagen con nuevo nivel:', studioRealityLevel);
      handleImproveUploadedImage();
    }
  }, [triggerStudioImprove]);

  // NUEVO: Activar Modo Magia para VIDEOS cuando cambie la descripción
  useEffect(() => {
    if (description.length >= 3 && mediaType === 'video') {
      const timeoutId = setTimeout(() => {
        console.log('🎬 Activando Modo Magia para VIDEO:', description);
        const videoDetection = detectVideoStyleFromInput(description);
        setVideoMagicModeResult({
          styleKey: videoDetection.styleKey,
          confidence: videoDetection.confidence,
          detectedIndustry: videoDetection.industry
        });
        
        // ✅ CORREGIDO: Usar estado separado para video sin casteo incorrecto
        setVideoStyleKey?.(videoDetection.styleKey);
        console.log('✅ Estilo de video detectado:', videoDetection.styleKey, 'Confianza:', videoDetection.confidence);
      }, 800);
      
      return () => clearTimeout(timeoutId);
    } else if (mediaType === 'video') {
      setVideoMagicModeResult(null);
    }
  }, [description, mediaType, setVideoStyleKey]);

  // NUEVO: Convertir estilo de imagen a video cuando se cambia de imagen a video
  useEffect(() => {
    if (mediaType === 'video' && description.length < 3) {
      // Si hay un estilo de imagen seleccionado, convertirlo a video
      const videoStyle = getVideoStyleFromImageStyle(styleKey as FlyerStyleKey);
      setStyleKey(videoStyle as FlyerStyleKey);
      console.log('🎬 Estilo convertido de imagen a video:', videoStyle);
    }
  }, [mediaType, styleKey, setStyleKey]);

  // NEW: Actualizar progreso basado en status.message del padre
  // Este efecto detecta cambios en el mensaje de estado y actualiza la alerta
  useEffect(() => {
    // Si no hay referencia a la alerta, no hacer nada
    if (!progressAlertRef.current) return;
    
    // Verificar si la alerta aún está visible antes de intentar actualizar
    if (!progressAlertRef.current.isVisible()) {
      console.log('📊 Alerta ya cerrada, omitiendo actualización');
      return;
    }
    
    // Mapeo de mensajes a progreso
    const messageProgress: Record<string, { percent: number; message: string }> = {
      'Analizando...': { percent: 10, message: 'Analizando contexto...' },
      'Traduciendo prompt...': { percent: 20, message: 'Traduciendo prompt...' },
      'Generando diseño...': { percent: 30, message: 'Generando diseño...' },
      'Generando imagen en borrador': { percent: 40, message: 'Generando pixels...' },
      'Renderizando HD...': { percent: 50, message: 'Renderizando HD...' },
      'Mejorando calidad...': { percent: 70, message: 'Mejorando calidad...' },
      'Generando poster...': { percent: 30, message: 'Generando poster...' },
      'Renderizando poster HD...': { percent: 60, message: 'Renderizando poster HD...' },
      'LISTO': { percent: 100, message: '¡Completado!' },
      'COMPLETADO': { percent: 100, message: '¡Completado!' },
      'ACTUALIZADO': { percent: 100, message: '¡Actualizado!' },
      'Refinando...': { percent: 20, message: 'Refinando diseño...' },
      'Regenerando...': { percent: 30, message: 'Regenerando...' },
      'Generando video...': { percent: 30, message: 'Generando video...' },
      'Generando pixels...': { percent: 50, message: 'Renderizando...' },
      'Renderizando...': { percent: 60, message: 'Finalizando...' },
    };
    
    // Buscar coincidencia con el mensaje actual
    let found = false;
    for (const [key, value] of Object.entries(messageProgress)) {
      if (status.message.includes(key)) {
        progressAlertRef.current.updateProgress(value.percent, value.message);
        found = true;
        console.log('📊 Progreso actualizado:', value.message, value.percent + '%');
        break;
      }
    }
    
    // Si no se encontró ningún mensaje conocido y isLoading es true, avanzar progresivamente
    if (!found && isLoading && status.message) {
      // El intervalo de respaldo ya avanza automáticamente en studioAlerts
      console.log('📊 Esperando mensajes de estado...');
    }
    
    // Si hay imagen Y no está cargando, cerrar inmediatamente
    // Esto es más robusto que depender solo del mensaje de estado
    const hasImage = imageUrl || draftImageUrl;
    const isCompleteMessage = status.message.includes('LISTO') ||
                               status.message.includes('COMPLETADO') ||
                               status.message.includes('ACTUALIZADO');
    
    if (hasImage && (!isLoading || isCompleteMessage)) {
      // Verificar nuevamente que la alerta esté visible antes de cerrar
      if (progressAlertRef.current?.isVisible()) {
        progressAlertRef.current.updateProgress(100, '¡Completado!');
        console.log('📊 Generación completada, cerrando alerta...');
        // Cerrar inmediatamente sin delay
        progressAlertRef.current.close();
        progressAlertRef.current = null;
      } else {
        console.log('📊 Generación completada pero alerta ya estaba cerrada');
        progressAlertRef.current = null;
      }
    }
  }, [status.message, isLoading, imageUrl, draftImageUrl]);

  // NEW: Fallback de seguridad - cerrar alerta inmediatamente cuando imageUrl aparece
  useEffect(() => {
    // Cerrar alerta cuando cualquiera de las URLs de imagen esté disponible
    const hasImage = imageUrl || draftImageUrl;
    
    if (hasImage && progressAlertRef.current?.isVisible()) {
      console.log('📊 Fallback: cerrando alerta por imagen disponible');
      // Actualizar a 100% y cerrar inmediatamente
      progressAlertRef.current.updateProgress(100, '¡Completado!');
      progressAlertRef.current.close();
      progressAlertRef.current = null;
    } else if (hasImage) {
      // Si ya estaba cerrada pero hay imagen, limpiar la referencia
      progressAlertRef.current = null;
    }
  }, [imageUrl, draftImageUrl]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  // NUEVO: Manejar carga de imagen del usuario para mejorar
  const handleUploadUserImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setUploadedImage(result);
        setImprovedImageUrl(null);
        
        // Notificar al padre sobre la imagen subida
        if (onUploadedImageChange) {
          onUploadedImageChange(result);
        }
        
        // Limpiar descripción si el usuario sube su imagen
        setDescription('');
      };
      reader.readAsDataURL(file);
    }
  };
  
  // NUEVO: Mejorar imagen subida con IA (usando enhanceUserImage del Paso 3)
  const handleImproveUploadedImage = async () => {
    if (!uploadedImage) return;
    
    setIsImprovingImage(true);
    try {
      console.log('🔍 [DEBUG] Iniciando mejora de imagen...');
      console.log('🔍 [DEBUG] uploadedImage length:', uploadedImage.length);
      console.log('🔍 [DEBUG] realityMode:', realityMode);
      console.log('🔍 [DEBUG] aspectRatio:', aspectRatio);
      
      // Usar la nueva función enhanceUserImage con reconstrucción semántica
      const result = await enhanceUserImage(
        uploadedImage,
        realityMode,
        aspectRatio,
        studioRealityLevel // Pasar nivel de realidad
      );
      
      console.log('🔍 [DEBUG] Resultado recibido:', result ? `${result.substring(0, 50)}...` : 'null');
      console.log('🔍 [DEBUG] Tipo de resultado:', typeof result);
      console.log('🔍 [DEBUG] Es data URL?', result?.startsWith('data:'));
      console.log('🔍 [DEBUG] Tamaño del resultado:', result?.length, 'bytes');
      console.log('🔍 [DEBUG] Tamaño en MB:', (result?.length / 1024 / 1024).toFixed(2), 'MB');
      
      // Validar que no sea demasiado grande
      if (result && result.length > 10 * 1024 * 1024) { // 10MB
        console.warn('⚠️ [DEBUG] Imagen muy grande, puede causar problemas de renderizado');
      }
      
      setImprovedImageUrl(result);
      
      // Notificar al padre sobre la imagen mejorada
      if (onImprovedImageChange) {
        onImprovedImageChange(result);
      }
      
      console.log('🔍 [DEBUG] Estado actualizado, improvedImageUrl debería tener valor');
      
      await Swal.fire({
        title: '¡Imagen mejorada!',
        text: `Tu imagen ha sido mejorada con el modo: ${REALITY_MODE_LABELS[realityMode]}`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.error('Error mejorando imagen:', error);
      await Swal.fire({
        title: 'Error',
        text: error.message || 'Error al mejorar la imagen. Verifica tu conexión a internet.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
    } finally {
      setIsImprovingImage(false);
    }
  };
  
  // NUEVO: Limpiar imagen subida
  const clearUploadedImage = () => {
    setUploadedImage(null);
    setImprovedImageUrl(null);
    
    // Notificar al padre
    if (onUploadedImageChange) {
      onUploadedImageChange(null);
    }
    if (onImprovedImageChange) {
      onImprovedImageChange(null);
    }
  };

  const handleAnalyzeUrl = async () => {
    if (!urlInput.trim()) return;
    setIsAnalyzing(true);
    
    // ✅ NUEVO: Mostrar alerta de loading que permanece durante todo el análisis
    const loadingAlert = Swal.fire({
      title: 'Analizando URL...',
      html: `
        <div style="text-align: center; padding: 10px;">
          <p style="color: #9ca3af; font-size: 14px;">Extrayendo información de tu negocio</p>
          <div style="margin-top: 20px;">
            <div class="swal2-loading"></div>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">Esto puede tomar unos segundos...</p>
        </div>
      `,
      background: '#111827',
      color: '#ffffff',
      confirmButtonColor: '#3b82f6',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    let timeoutHandle: NodeJS.Timeout;
    
    // Timeout de 15 segundos
    timeoutHandle = setTimeout(() => {
      console.log("⏰ Timeout alcanzado, cerrando análisis");
      Swal.close();
      setIsAnalyzing(false);
      Swal.fire({
        title: '⏱️ Análisis lento',
        text: 'El análisis de la URL está tomando mucho tiempo. Te recomendamos describir tu negocio manualmente para una experiencia más rápida.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#3b82f6',
        background: '#1a1a1a',
        color: '#ffffff'
      });
    }, 15000);
    
    try {
      console.log("🔍 Iniciando análisis de URL...");
      
      const analysis = await analyzeUrlContent(urlInput);
      
      // Limpiar timeout
      clearTimeout(timeoutHandle);
      
      // ✅ CERRAR ALERTA DE LOADING ANTES DE MOSTRAR ÉXITO
      Swal.close();
      
      // Mostrar éxito con SweetAlert2 simple
      await Swal.fire({
        title: '✅ ¡Completado!',
        text: 'URL analizada exitosamente',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#1a1a1a',
        color: '#ffffff'
      });
      
      // Si hay englishDescription (para IA), usarla para la generación
      // La description (español) se muestra al usuario
      if ((analysis as any).englishDescription) {
        // Guardar la descripción en español para mostrar al usuario
        setDescription(analysis.description);
        // El englishDescription se pasa al padre para que lo use en la generación
        // Esto se hace a través de onStyleDetected con un flag especial
        onStyleDetected(analysis.visualStyle || '', analysis.overlayText, analysis.textStyle);
        
        // IMPORTANTE: Generar el prompt en español para mostrar
        // Usar la descripción completa en español del análisis
        const spanishPrompt = analysis.description || analysis.overlayText || '';
        if (onSpanishPromptUpdate) {
          onSpanishPromptUpdate(spanishPrompt);
        }
      } else {
        // Fallback normal
        setDescription(analysis.description);
        if (analysis.visualStyle) {
          onStyleDetected(analysis.visualStyle, analysis.overlayText, analysis.textStyle);
        }
        // También pasar el prompt en español en fallback
        const spanishPrompt = analysis.description || analysis.overlayText || '';
        if (onSpanishPromptUpdate) {
          onSpanishPromptUpdate(spanishPrompt);
        }
      }
      setInputMode('text');
      
    } catch (error: any) {
      console.error("❌ Error en análisis:", error);
      clearTimeout(timeoutHandle);
      
      // ✅ CERRAR ALERTA DE LOADING ANTES DE MOSTRAR ERROR
      Swal.close();
      
      let errorMessage = 'Error analizando URL. Verifica que la URL sea válida.';
      
      if (urlInput.includes('instagram.com')) {
        errorMessage = 'Instagram puede requerir análisis manual. Por favor, describe el negocio manualmente.';
      }
      
      // Usar SweetAlert2 para errores
      Swal.fire({
        title: '⚠️ Error en análisis',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#ef4444',
        background: '#1a1a1a',
        color: '#ffffff'
      });
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  // NEW: Función para analizar URL en modo Canva
  const handleCanvaAnalyzeUrl = async () => {
    if (!canvaUrlInput.trim()) return;
    setIsCanvaAnalyzing(true);
    
    // Mostrar alerta de loading con SweetAlert
    Swal.fire({
      title: 'Analizando marca...',
      html: `
        <div style="text-align: center; padding: 10px;">
          <p style="color: #9ca3af; font-size: 14px;">Investigando identidad visual en Google</p>
          <div style="margin-top: 20px;">
            <div class="swal2-loading"></div>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">Generando banners publicitarios...</p>
        </div>
      `,
      background: '#111827',
      color: '#ffffff',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Incrementar el trigger para forzar el análisis en CanvasEditor
    // Esto funciona incluso si la URL no cambió (re-análisis de la misma URL)
    if (setCanvaAnalyzeTriggerProp) {
      setCanvaAnalyzeTriggerProp(canvaAnalyzeTriggerProp + 1);
    }
    
    console.log('🔍 [Canva] Enviando URL al CanvasEditor:', canvaUrlInput, 'Trigger:', canvaAnalyzeTriggerProp + 1);
    
    // El CanvasEditor cerrará la alerta cuando termine
    // Pero agregamos un timeout de seguridad por si algo falla
    setTimeout(() => {
      if (isCanvaAnalyzing) {
        setIsCanvaAnalyzing(false);
      }
    }, 120000); // 2 minutos de timeout máximo
  };

  // NEW: Función OPTIMIZADA para generar múltiples opciones de texto
  // SOLO genera opciones para el objetivo seleccionado (branding O leads, nunca ambos)
  const handleGenerateTextOptions = async (objective: 'branding' | 'leads') => {
    if (!description.trim()) return;
    
    setIsGeneratingText(true);
    try {
      console.log(`🎯 Generando opciones de texto SOLO para objetivo: ${objective}`);
      
      // Generar array vacío SOLO para el objetivo seleccionado
      const options = {
        branding: objective === 'branding' ? [] as string[] : [],
        leads: objective === 'leads' ? [] as string[] : []
      };
      
      // Generar 3 opciones para el objetivo seleccionado
      const promises = [];
      for (let i = 0; i < 3; i++) {
        promises.push(
          generatePersuasiveText(description, objective)
            .then(text => {
              // Limpiar el texto antes de guardarlo (quitar prefijos como "Leads:", "Branding:", etc.)
              const cleanedText = cleanText(text);
              if (cleanedText && !options[objective].includes(cleanedText)) {
                options[objective].push(cleanedText);
              }
            })
            .catch(error => console.warn(`Error generando opción ${i}:`, error))
        );
      }
      
      // Ejecutar todas las llamadas en paralelo
      await Promise.all(promises);
      
      // Fallbacks específicos SOLO para el objetivo seleccionado
      const industryKey = detectIndustryFromDescription(description);
      const industryTexts = INDUSTRY_TEXT_TEMPLATES[industryKey] || INDUSTRY_TEXT_TEMPLATES.default;
      const fallbackTexts = objective === 'branding' ? industryTexts.branding : industryTexts.leads;
      
      // Rellenar solo el objetivo seleccionado (limpiar fallbacks también)
      while (options[objective].length < 3) {
        const fallback = cleanText(fallbackTexts[options[objective].length % fallbackTexts.length]);
        if (fallback && !options[objective].includes(fallback)) {
          options[objective].push(fallback);
        }
      }
      
      setTextOptions(options);
      
      // Establecer automáticamente la primera opción como overlayText
      if (options[objective].length > 0) {
        const firstOption = options[objective][0];
        setOverlayText(firstOption);
        setSelectedTextOption(firstOption);
        console.log('✅ Primera opción establecida automáticamente:', firstOption);
      }
      
      console.log('✅ Opciones de texto generadas:', options);
      
    } catch (error) {
      console.error('❌ Error generando opciones de texto:', error);
      // Fallback texts específicos SOLO para el objetivo seleccionado
      const industryKey = detectIndustryFromDescription(description);
      const industryTexts = INDUSTRY_TEXT_TEMPLATES[industryKey] || INDUSTRY_TEXT_TEMPLATES.default;
      
      // Inicializar ambos arrays pero con fallbacks SOLO del objetivo seleccionado (limpios)
      const fallbackTexts = objective === 'branding' ? industryTexts.branding : industryTexts.leads;
      const cleanedFallbacks = fallbackTexts.map(text => cleanText(text));
      
      setTextOptions({
        branding: objective === 'branding' ? cleanedFallbacks : [],
        leads: objective === 'leads' ? cleanedFallbacks : []
      });
      
      // Establecer fallback como overlayText (limpios)
      setOverlayText(cleanedFallbacks[0]);
      setSelectedTextOption(cleanedFallbacks[0]);
    } finally {
      setIsGeneratingText(false);
    }
  };
  
  // Función para limpiar texto - elimina prefijos como "Branding:", "Leads:", etc.
  const cleanText = (text: string): string => {
    return text
      .replace(/^(Branding|Leads|Texto|Opción|Opcion|Option|Text)[:\s]*/i, '')
      .replace(/\s*(Leads|Branding)[:]\s*/gi, '. ')
      .replace(/\s*\.\s*\./g, '.')
      .replace(/^(•|-|\*|\d+\.)\s*/g, '')
      .replace(/\s*(•|-|\*|\d+\.)\s*/g, '. ')
      .replace(/\s+\./g, '.')
      .trim();
  };

  // Función para seleccionar una opción de texto
  const handleSelectTextOption = (text: string) => {
    const cleanedText = cleanText(text);
    setSelectedTextOption(cleanedText);
    setOverlayText(cleanedText);
  };
  return (
    <>
      <div className="p-3 md:p-6 space-y-4 md:space-y-6 pb-8 lg:pb-4">
      
      {/* 1. ENTRADA UNIFICADA - MODO MAGIA */}
      <div className="space-y-4">
         <div className="text-center">
             <h2 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
               <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
               </svg>
               Crea tu Diseño
             </h2>
             <p className="text-sm text-white/70">
               {creationMode === 'design' && 'Pega una URL o describe tu negocio'}
               {creationMode === 'free' && 'Describe tu diseño sin restricciones'}
               {creationMode === 'canva' && 'Editor visual drag & drop'}
               {creationMode === 'brand' && 'Desarrollo manual de marca'}
             </p>
         </div>
         
         {/* Selector de Modo de Creación */}
         <CreationModeSelector
           selectedMode={creationMode}
           onModeChange={(mode) => {
             console.log('🎨 [FlyerForm] Cambiando modo a:', mode);
             onCreationModeChange(mode);
           }}
         />
         
         {/* MODO DISEÑO Y LIBRE: Mostrar textarea */}
         {(creationMode === 'design' || creationMode === 'free') && (
         <div className="relative group">
             <textarea
               value={description}
               onChange={(e) => {
                 const value = e.target.value;
                 // Detectar si es URL y sincronizar con urlInput (solo en modo Diseño)
                 if (creationMode === 'design' && value.includes('http')) {
                   setUrlInput(value);
                 } else if (urlInput) {
                   setUrlInput('');
                 }
                 // Actualizar description (el estado del padre)
                 setDescription(value);
               }}
               disabled={isLoading}
               placeholder={
                 creationMode === 'design' 
                   ? "https://instagram.com/mi-negocio... o describe tu negocio aquí..."
                   : "Describe tu diseño con total libertad. Ejemplo: 'Una imagen futurista con neones azules y texto en el centro que diga OFERTA'..."
               }
               className={`w-full bg-black/40 border border-white/10 text-white text-sm rounded-xl p-4 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:outline-none resize-none placeholder-white/20 transition-all font-light leading-relaxed ${
                 creationMode === 'free' ? 'h-32' : 'h-24'
               }`}
             />
             {description && (
               <button
                 onClick={() => {
                   // Limpiar description (el estado del padre)
                   setDescription('');
                   // Limpiar urlInput (estado local)
                   setUrlInput('');
                   // Limpiar overlayText
                   setOverlayText('');
                   // Limpiar magic mode result
                   setMagicModeResult(null);
                   // Usar el handler del padre para limpiar análisis automático
                   onClearInput?.();
                 }}
                 className="absolute top-3 right-3 text-[10px] text-white/30 hover:text-white/50 transition-colors bg-black/40 rounded px-2 py-1 cursor-pointer"
               >
                 ✕ Limpiar
               </button>
             )}
         </div>
         )}
         
         {/* MODO BRAND: Mostrar controles del editor de marca */}
         {creationMode === 'brand' && brandData && setBrandData && setBrandActiveTab && (
           <BrandSidebar
             brand={brandData}
             setBrand={setBrandData}
             activeTab={brandActiveTab as 'identity' | 'colors' | 'typography'}
             setActiveTab={setBrandActiveTab}
           />
         )}
         
         {/* MODO CANVA: El editor Brand Intelligence es autónomo */}
         {creationMode === 'canva' && (
           <div className="space-y-4">
             <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                   <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="text-sm font-semibold text-white">Brand Intelligence</h3>
                   <p className="text-xs text-white/60">Kit de Marca Automático</p>
                 </div>
               </div>
               <p className="text-xs text-white/50 leading-relaxed">
                 Pega la URL de tu negocio en el panel central y genera piezas gráficas profesionales al instante.
               </p>
             </div>
           </div>
         )}
         
         {/* OCULTO: Indicador de Modo Magia - ahora solo se muestra en consola, no en UI */}
         {/* El análisis de URL ya no muestra este indicador para evitar duplicados */}
         
         {/* CONTENEDOR DE ANÁLISIS DE URL - OCULTO PARA EVITAR DUPLICADOS */}
         {/* El análisis ya se muestra en el panel central, no necesitamos duplicarlo aquí */}
         
         {/* BOTÓN ANALIZAR URL - OCULTO cuando hay análisis completado - SOLO EN MODO DISEÑO */}
         {creationMode === 'design' && (urlInput.includes('http') || description.includes('http')) && !currentSpanishPrompt?.trim() && (
           <div className="flex justify-center">
             <button
               onClick={handleAnalyzeUrl}
               disabled={isAnalyzing}
               className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-blue-500/30 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
             >
               {isAnalyzing ? (
                 <>
                   <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                   Analizando...
                 </>
               ) : (
                 <>
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                   Analizar URL
                 </>
               )}
             </button>
           </div>
         )}
         
      </div>

        {/* OCULTAR TODO LO SIGUIENTE EN MODO LIBRE Y CANVA */}
        {creationMode !== 'free' && creationMode !== 'canva' && (
        <>
        {/* 4. STYLE CARD - SOLO EN MODO MANUAL Y MODO DISEÑO */}
        {workMode === 'manual' && creationMode === 'design' && (
          <div className="space-y-3">
            <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Estilo</label>
                <button onClick={onOpenGallery} className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">Cambiar</button>
            </div>
            
            <div
               onClick={onOpenGallery}
               className="group relative h-16 rounded-xl overflow-hidden cursor-pointer border border-white/10 hover:border-blue-500/50 transition-all"
            >
                <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity" style={{ backgroundImage: `url(${selectedStyle.previewUrl})`}}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent flex items-center p-3">
                    <div>
                        <div className="text-[10px] font-mono text-blue-400 mb-0.5">ESTILO</div>
                        <div className="font-bold text-white text-sm leading-none">{selectedStyle.label.split('/')[0]}</div>
                        {/* NUEVO: Indicador de Modo Magia aplicado */}
                        {magicModeResult && (
                          <div className="text-[8px] text-green-400 mt-1">🔮 Auto-detectado</div>
                        )}
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* 5. FORMATO SIMPLIFICADO - Oculto en modo brand */}
        {creationMode !== 'brand' && (
        <div className="space-y-3">
              <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">2. Formato</label>
              <div className="grid grid-cols-2 gap-3">
                  {/* 1:1 - Universal */}
                  <button
                      onClick={() => setAspectRatio('1:1')}
                      className={`p-3 rounded-xl border-2 transition-all relative overflow-hidden cursor-pointer
                      ${aspectRatio === '1:1'
                          ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/50 text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                  >
                      <div className="flex items-center justify-center mb-2">
                          <div className="w-6 h-6 border-2 border-current rounded-sm flex items-center justify-center">
                              <div className="w-4 h-4 bg-current rounded-sm"></div>
                          </div>
                      </div>
                      <div className="text-sm font-bold mb-1">1:1</div>
                      <div className="text-[10px] text-white/80">Instagram/Facebook</div>
                  </button>

                  {/* 9:16 - Stories */}
                  <button
                      onClick={() => setAspectRatio('9:16')}
                      className={`p-3 rounded-xl border-2 transition-all relative overflow-hidden cursor-pointer
                      ${aspectRatio === '9:16'
                          ? 'bg-gradient-to-br from-pink-500/20 to-red-500/20 border-pink-400/50 text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
                  >
                      <div className="flex items-center justify-center mb-2">
                          <div className="w-4 h-7 border-2 border-current rounded-sm flex items-center justify-center">
                              <div className="w-2 h-5 bg-current rounded-sm"></div>
                          </div>
                      </div>
                      <div className="text-sm font-bold mb-1">9:16</div>
                      <div className="text-[10px] text-white/80">Stories/Reels</div>
                  </button>
              </div>
            </div>
        )}

        {/* 2. TIPO DE CONTENIDO - IMAGEN, VIDEO, ESTUDIO, STORY ART - Oculto en modo brand */}
        {creationMode !== 'brand' && (
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">3. ¿Qué quieres generar?</label>
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            {/* IMAGEN IA */}
            <button
              onClick={() => {
                setMediaType('image');
                clearUploadedImage();
                setIsStoryArtModeActive(false);
              }}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all relative overflow-hidden cursor-pointer
                ${mediaType === 'image' && !uploadedImage && mediaType !== 'product_study' && !isStoryArtModeActive
                  ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/50 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
            >
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-xs md:text-sm font-bold">Imágenes</div>
                <div className="text-[8px] md:text-[10px] text-white/60">Generar diseño</div>
              </div>
              {mediaType === 'image' && !uploadedImage && !isStoryArtModeActive && (
                <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full animate-pulse"></div>
              )}
            </button>

            {/* VIDEO */}
            <button
              onClick={() => {
                setMediaType('video');
                clearUploadedImage();
                setIsStoryArtModeActive(false);
              }}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all relative overflow-hidden cursor-pointer
                ${mediaType === 'video' && !isStoryArtModeActive
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
            >
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <div className="text-xs md:text-sm font-bold">Video</div>
                <div className="text-[8px] md:text-[10px] text-white/60">Motion graphics</div>
              </div>
              {mediaType === 'video' && !isStoryArtModeActive && (
                <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-pulse"></div>
              )}
            </button>

            {/* ESTUDIO DE PRODUCTO */}
            <button
              onClick={() => {
                console.log('🎯 [ESTUDIO] Activando modo estudio...');
                console.log('🎯 [ESTUDIO] uploadedImage antes:', uploadedImage ? 'EXISTE' : 'NULL');
                console.log('🎯 [ESTUDIO] improvedImageUrl antes:', improvedImageUrl ? 'EXISTE' : 'NULL');
                
                setMediaType('product_study');
                setUploadedImage(null);
                setImprovedImageUrl(null);
                setIsStoryArtModeActive(false);
                
                console.log('🎯 [ESTUDIO] Modo estudio activado');
                console.log('🎯 [ESTUDIO] mediaType ahora:', 'product_study');
              }}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all relative overflow-hidden cursor-pointer
                ${mediaType === 'product_study' && !isStoryArtModeActive
                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
            >
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="text-xs md:text-sm font-bold">Estudio</div>
                <div className="text-[8px] md:text-[10px] text-white/60">Mejora tu foto</div>
              </div>
              {mediaType === 'product_study' && !isStoryArtModeActive && (
                <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </button>

            {/* STORY ART (9:16) - 7 ESTILOS VISUALES ÚNICOS */}
            <button
              onClick={() => {
                setMediaType('story_art');
                setIsStoryArtModeActive(true);
                setAspectRatio('9:16'); // Forzar 9:16
                clearUploadedImage();
              }}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all relative overflow-hidden cursor-pointer
                ${isStoryArtModeActive
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
            >
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <div className="text-xs md:text-sm font-bold">Story Art</div>
                <div className="text-[8px] md:text-[10px] text-white/60">7 Estilos Únicos</div>
              </div>
              {isStoryArtModeActive && (
                <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-pulse"></div>
              )}
            </button>
          </div>
        </div>
        )}

        {/* 6.1 ESTUDIO DE PRODUCTO - MEJORAR CON IA */}
        {console.log('🔍 [RENDER ESTUDIO] mediaType:', mediaType, 'uploadedImage:', uploadedImage ? 'EXISTE' : 'NULL')}
        {console.log('🔍 [RENDER ESTUDIO] Condición:', mediaType === 'product_study' && !uploadedImage)}
        {mediaType === 'product_study' && !uploadedImage && (
          <div className="space-y-3">
            {/* Área de carga de imagen */}
            <div className="border-2 border-dashed border-green-400/40 rounded-xl p-6 text-center hover:border-green-400/60 transition-colors bg-green-500/5">
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadUserImage}
                className="hidden"
                id="upload-image-input"
              />
              <label
                htmlFor="upload-image-input"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="text-4xl">📷</div>
                <div className="text-white text-sm">Sube tu imagen de producto</div>
                <div className="text-white/50 text-xs">JPG, PNG - Máx 10MB</div>
                <div className="text-green-400 text-xs mt-2 flex items-center justify-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  La mejoraremos con IA
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Vista previa de imagen subida y botón mejorar */}
        {uploadedImage && (
          <div className="space-y-3">
            {/* DEBUG: Mostrar estado actual */}
            {console.log('🔍 [RENDER] uploadedImage:', uploadedImage ? `${uploadedImage.substring(0, 50)}...` : 'null')}
            {console.log('🔍 [RENDER] improvedImageUrl:', improvedImageUrl ? `${improvedImageUrl.substring(0, 50)}...` : 'null')}
            
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">📸 Tu Foto</label>
              <button
                onClick={clearUploadedImage}
                className="text-[10px] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                ✕ Eliminar
              </button>
            </div>
            
            {/* Vista previa de imagen subida */}
            <div className="relative rounded-xl overflow-hidden border border-white/20">
              {console.log('🖼️ [CONTAINER] Renderizando contenedor de imagen')}
              {console.log('🖼️ [CONTAINER] src que se usará:', improvedImageUrl ? 'MEJORADA' : 'ORIGINAL')}
              <img
                src={improvedImageUrl || uploadedImage}
                alt="Imagen subida"
                className="w-full h-48 object-contain bg-black/40"
                onLoad={() => {
                  console.log('✅ [IMG] Imagen cargada exitosamente');
                  console.log('🔍 [IMG] Mostrando:', improvedImageUrl ? 'MEJORADA' : 'ORIGINAL');
                }}
                onError={(e) => {
                  console.error('❌ [IMG] Error cargando imagen:', e);
                  console.error('🔍 [IMG] src:', (e.target as HTMLImageElement).src?.substring(0, 100));
                }}
                key={improvedImageUrl || uploadedImage}
              />
              {improvedImageUrl && (
                <>
                  {console.log('🎨 [BADGE] Mostrando badge "Mejorada"')}
                  <div className="absolute top-2 right-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded z-10">
                    ✓ Mejorada
                  </div>
                </>
              )}
            </div>
            
            {/* Botón para mejorar */}
            <button
              onClick={handleImproveUploadedImage}
              disabled={isImprovingImage}
              className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed
                ${isImprovingImage
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-400 hover:to-emerald-400'}`}
            >
              {isImprovingImage ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Mejorando...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Mejorar con IA</span>
                </>
              )}
            </button>
          </div>
        )}


        {/* 6.5 ESTILO DE VIDEO - AUTOMÁTICO (Solo indicador, sin selección) */}
        {mediaType === 'video' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Estilo de Video</label>
              <span className="text-[10px] text-purple-400">✨ Auto-detectado</span>
            </div>
            
            {/* Indicador simple del estilo detectado */}
            {videoMagicModeResult ? (
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎬</div>
                  <div>
                    <div className="text-white font-medium text-sm">
                      {VIDEO_STYLE_NAMES_ES[videoMagicModeResult.styleKey] || videoMagicModeResult.styleKey}
                    </div>
                    <div className="text-purple-300 text-xs">
                      Confianza: {(videoMagicModeResult.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            ) : description.length >= 3 ? (
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎬</div>
                  <div className="text-white/60 text-sm">
                    Escribe una descripción para detectar el estilo automáticamente
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}


        {/* 🎨 SELECTOR DE ESTILOS VISUALES STORY ART - 7 ESTILOS ÚNICOS */}
        {mediaType === 'story_art' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">
                🎨 Estilo Visual
              </label>
              <button
                onClick={() => {
                  handleStoryArtVisualStyleChange(null);
                }}
                className="text-[10px] text-white/50 hover:text-white/70 transition-colors"
              >
                Reiniciar
              </button>
            </div>
            
            {/* Grid de 7 estilos visuales Story Art */}
            <div className="grid grid-cols-2 gap-2">
              {availableStoryArtVisualStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    handleStoryArtVisualStyleChange(style.id);
                  }}
                  className={`p-3 rounded-xl border-2 transition-all relative overflow-hidden text-left
                    ${storyArtVisualStyleId === style.id
                      ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/30'
                    }`}
                >
                  {/* Indicador de categoría */}
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-sm">{style.icon}</span>
                    <span className="text-[8px] font-mono text-white/50 uppercase">{style.category}</span>
                  </div>
                  
                  {/* Nombre del estilo */}
                  <div className="font-bold text-xs mb-1">{style.name}</div>
                  
                  {/* Descripción breve */}
                  <div className="text-[9px] text-white/60 leading-tight">
                    {style.description.substring(0, 60)}...
                  </div>
                  
                  {/* Indicador de selección */}
                  {storyArtVisualStyleId === style.id && (
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
            
            {/* Mensaje de feedback */}
            {artDirectionFeedback && (
              <div className="text-[10px] text-green-400 text-center">
                {artDirectionFeedback}
              </div>
            )}
          </div>
        )}

        {/* 4. OBJETIVO DEL DISEÑO - BRANDING O LEADS (OCULTO PARA VIDEO, STORY ART, ESTUDIO Y BRAND) */}
        {mediaType !== 'video' && mediaType !== 'story_art' && mediaType !== 'product_study' && creationMode !== 'brand' && (
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">4. ¿Qué quieres lograr?</label>
            
            {/* AUTO MODE - MARKETING OBJECTIVE SELECTION */}
            {workMode === 'auto' && !marketingObjective && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={async () => {
                    setOverlayText('');
                    setSelectedTextOption('');
                    setMarketingObjective('branding');
                    await handleGenerateTextOptions('branding');
                  }}
                  className="p-4 rounded-xl border-2 border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-400/50 transition-all"
                >
                  <div className="font-bold text-white text-sm mb-1">BRANDING</div>
                  <div className="text-[10px] text-white/70">Reconocimiento de marca</div>
                </button>
                <button
                  onClick={async () => {
                    setOverlayText('');
                    setSelectedTextOption('');
                    setMarketingObjective('leads');
                    await handleGenerateTextOptions('leads');
                  }}
                  className="p-4 rounded-xl border-2 border-white/10 bg-white/5 hover:bg-white/10 hover:border-green-400/50 transition-all"
                >
                  <div className="font-bold text-white text-sm mb-1">LEADS</div>
                  <div className="text-[10px] text-white/70">Generar conversiones</div>
                </button>
              </div>
            )}

            {/* AUTO MODE - TEXT OPTIONS SELECTION */}
            {workMode === 'auto' && marketingObjective && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">
                    Selecciona tu texto ({marketingObjective === 'branding' ? 'Branding' : 'Leads'})
                  </label>
                  <button
                    onClick={() => {
                      setMarketingObjective(null);
                      setOverlayText('');
                      setTextOptions(null);
                      setSelectedTextOption('');
                    }}
                    className="text-[10px] text-white/50 hover:text-white/70 transition-colors"
                  >
                    Cambiar objetivo
                  </button>
                </div>
                
                {isGeneratingText ? (
                  <div className="h-16 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-white text-sm">Generando opciones de texto...</span>
                    </div>
                  </div>
                ) : textOptions ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-2">
                      {textOptions[marketingObjective].map((text, index) => {
                        const cleanedText = cleanText(text);
                        return (
                          <button
                            key={index}
                            onClick={() => handleSelectTextOption(text)}
                            className={`p-3 rounded-lg border text-left transition-all ${
                              selectedTextOption === cleanedText
                                ? 'border-green-500 bg-green-500/20 text-green-300'
                                : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                            }`}
                          >
                            <div className="font-medium text-sm">{cleanedText}</div>
                          </button>
                        );
                      })}
                    </div>
                    
                    {selectedTextOption && (
                      <div className="mt-3 p-3 rounded-lg border border-white/30 bg-white/10">
                        <div className="text-[10px] font-mono text-green-400 mb-1">TEXTO SELECCIONADO</div>
                        <div className="font-bold text-white">{selectedTextOption}</div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {/* MANUAL MODE - TEXTO SIMPLE */}
            {workMode === 'manual' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Texto del Flyer</label>
                  {magicModeResult && (
                    <button
                      onClick={() => setOverlayText(magicModeResult.persuasiveText)}
                      className="text-[8px] text-green-400 hover:text-green-300 transition-colors"
                    >
                      Usar Modo Magia
                    </button>
                  )}
                </div>
                <input
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  placeholder="Ej. 50% DCTO o ¡Contáctanos!"
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-blue-500/50 outline-none"
                />
                <div className="text-[10px] text-white/50">
                  El texto se ajustará automáticamente al diseño
                  {magicModeResult && (
                    <span className="text-green-400 ml-2">• Modo Magia disponible</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FIN DE SECCIONES OCULTAS EN MODO LIBRE Y CANVA */}
        </>
        )}

        {/* GENERATE BUTTON - Oculto en modo estudio, canva y brand */}
        {mediaType !== 'product_study' && creationMode !== 'canva' && creationMode !== 'brand' && (
          <div className="pt-4 md:pt-6">
            <button
                onClick={async () => {
                  // Mostrar alerta de progreso si es imagen y calidad draft
                  if (mediaType === 'image' && imageQuality === 'draft' && !isLoading) {
                    // Abrir alerta de progreso con SweetAlert2
                    const alert = estudioAlerts.progress('Generando imagen en borrador');
                    progressAlertRef.current = alert;
                    console.log('📊 Alerta de progreso abierta');
                  }
                  // Ejecutar generación normal
                  onSubmit();
                }}
                disabled={isLoading || !canGenerate}
                className={`w-full py-3 md:py-4 rounded-xl font-bold text-sm tracking-wide shadow-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 relative overflow-hidden group cursor-pointer disabled:cursor-not-allowed
                ${!canGenerate 
                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    : isStoryArtModeActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-900/40'
                    : mediaType === 'video'
                    ? 'bg-indigo-600 text-white shadow-indigo-900/40'
                    : 'bg-white text-black shadow-white/20'}`}
            >
                {isLoading ? (
                    <>
                         <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                         <span>PROCESANDO...</span>
                    </>
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        <span>✨ GENERAR {isStoryArtModeActive ? 'STORY ART' : mediaType === 'video' ? 'VIDEO' : 'CAMPAÑA'}</span>
                    </>
                )}
            </button>
          </div>
        )}

      </div>
    </>
  );
};
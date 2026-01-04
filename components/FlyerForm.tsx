import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FlyerStyleKey, FlyerStyleKeyVideo, AspectRatio, MediaType, ImageQuality, OverlayStyle, PosterStyle } from '../types';
import { FLYER_STYLES, VIDEO_STYLES, ASPECT_RATIO_LABELS, POSTER_STYLES } from '../constants';
import { analyzeUrlContent, generatePersuasiveText, INDUSTRY_TEXT_TEMPLATES, detectIndustryFromDescription, enhanceUserImage } from '../services/geminiService';
import { REALITY_MODE_LABELS, type RealityMode } from '../src/constants/promptModifiers';
import { ImageAnalysisResult } from '../services/imageAnalysisService';
import { processMagicMode, MagicModeResult, STYLE_NAMES_ES, detectVideoStyleFromInput, VIDEO_STYLE_NAMES_ES, getVideoStyleFromImageStyle } from '../services/magicModeService';

interface FlyerFormProps {
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
  imageQuality: ImageQuality;
  setImageQuality: (q: ImageQuality) => void;
  onStyleDetected: (styleDescription: string, detectedText?: string, textStyle?: string) => void; // UPDATED: Include detected text
  onOpenGallery: () => void; // NEW PROP
  imageAnalysis?: ImageAnalysisResult | null; // NEW: Análisis de imagen
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
}

export const FlyerForm: React.FC<FlyerFormProps> = ({
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
  imageQuality,
  setImageQuality,
  onStyleDetected,
  onOpenGallery,
  imageAnalysis,
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
  setPosterStyle // NEW: Setter para estilo de poster
}) => {
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text');
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // NEW: Estados para objetivo de marketing
  const [marketingObjective, setMarketingObjective] = useState<'branding' | 'leads' | null>(null);
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  
  // NUEVO: Estados para alternativas de texto
  const [textOptions, setTextOptions] = useState<{branding: string[], leads: string[]} | null>(null);
  const [selectedTextOption, setSelectedTextOption] = useState<string>('');
  
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
  
  // NUEVO: Estados para STORY ART - DIRECCIÓN DE ARTE PROFESIONAL
  const [isStoryArtModeActive, setIsStoryArtModeActive] = useState(false);
  const [artDirectionApplied, setArtDirectionApplied] = useState(false);
  const [artDirectionFeedback, setArtDirectionFeedback] = useState<string | null>(null);
  
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
      // Usar la nueva función enhanceUserImage con reconstrucción semántica
      const result = await enhanceUserImage(
        uploadedImage,
        realityMode,
        aspectRatio
      );
      
      setImprovedImageUrl(result);
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
  };

  const handleAnalyzeUrl = async () => {
    if (!urlInput.trim()) return;
    setIsAnalyzing(true);
    
    let timeoutHandle: NodeJS.Timeout;
    
    // Timeout de 15 segundos
    timeoutHandle = setTimeout(() => {
        console.log("⏰ Timeout alcanzado, cerrando análisis");
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
        
        // Mostrar éxito con SweetAlert2 simple
        await Swal.fire({
            title: '¡Completado!',
            text: 'URL analizada exitosamente',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
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
             <h2 className="text-xl font-bold text-white mb-2">✨ Crea tu Diseño</h2>
             <p className="text-sm text-white/70">Pega una URL o describe tu negocio</p>
         </div>
         
         <div className="relative group">
             <textarea
               value={description}
               onChange={(e) => {
                 const value = e.target.value;
                 // Detectar si es URL y sincronizar con urlInput
                 if (value.includes('http')) {
                   setUrlInput(value);
                 } else if (urlInput) {
                   setUrlInput('');
                 }
                 // Actualizar description (el estado del padre)
                 setDescription(value);
               }}
               disabled={isLoading}
               placeholder="https://instagram.com/mi-negocio... o describe tu negocio aquí..."
               className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-xl p-4 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 focus:outline-none h-24 resize-none placeholder-white/20 transition-all font-light leading-relaxed"
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
                 className="absolute top-3 right-3 text-[10px] text-white/30 hover:text-white/50 transition-colors bg-black/40 rounded px-2 py-1"
               >
                 ✕ Limpiar
               </button>
             )}
         </div>
         
         {/* OCULTO: Indicador de Modo Magia - ahora solo se muestra en consola, no en UI */}
         {/* El análisis de URL ya no muestra este indicador para evitar duplicados */}
         
         {/* CONTENEDOR DE ANÁLISIS DE URL - OCULTO PARA EVITAR DUPLICADOS */}
         {/* El análisis ya se muestra en el panel central, no necesitamos duplicarlo aquí */}
         
         {/* BOTÓN ANALIZAR URL - OCULTO cuando hay análisis completado */}
         {(urlInput.includes('http') || description.includes('http')) && !currentSpanishPrompt?.trim() && (
           <div className="flex justify-center">
             <button
               onClick={handleAnalyzeUrl}
               disabled={isAnalyzing}
               className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-blue-500/30"
             >
               {isAnalyzing ? '🔄 Analizando...' : '🔍 Analizar URL'}
             </button>
           </div>
         )}
         
         {/* AUTO MODE - MARKETING OBJECTIVE SELECTION */}
         {workMode === 'auto' && !marketingObjective && (
           <div className="space-y-3">
             <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">2. ¿Qué quieres lograr?</label>
             <div className="grid grid-cols-2 gap-3">
               <button
                 onClick={async () => {
                   setOverlayText('');
                   setSelectedTextOption('');
                   setMarketingObjective('branding');
                   await handleGenerateTextOptions('branding');
                 }}
                 className="p-4 rounded-xl border-2 border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-pink-900/20 hover:border-purple-400/50 transition-all"
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
                 className="p-4 rounded-xl border-2 border-green-500/30 bg-gradient-to-r from-green-900/20 to-emerald-900/20 hover:border-green-400/50 transition-all"
               >
                 <div className="font-bold text-white text-sm mb-1">LEADS</div>
                 <div className="text-[10px] text-white/70">Generar conversiones</div>
               </button>
             </div>
           </div>
         )}

         {/* AUTO MODE - TEXT OPTIONS SELECTION */}
         {workMode === 'auto' && marketingObjective && (
           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">
                 2. Selecciona tu texto ({marketingObjective === 'branding' ? 'Branding' : 'Leads'})
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
      </div>

        {/* 4. STYLE CARD - SOLO EN MODO MANUAL */}
        {workMode === 'manual' && (
          <div className="space-y-3">
            <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Estilo</label>
                <button onClick={onOpenGallery} className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors">Cambiar</button>
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

        {/* 5. FORMATO SIMPLIFICADO */}
        <div className="space-y-3">
              <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">3. Formato</label>
              <div className="grid grid-cols-2 gap-3">
                  {/* 1:1 - Universal */}
                  <button
                      onClick={() => setAspectRatio('1:1')}
                      className={`p-3 rounded-xl border-2 transition-all relative overflow-hidden
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
                      className={`p-3 rounded-xl border-2 transition-all relative overflow-hidden
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

        {/* 6. TIPO DE MEDIO - IMAGEN, VIDEO, POSTER O IMAGEN PROPIA */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">4. Tipo de contenido</label>
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            {/* IMAGEN IA */}
            <button
              onClick={() => {
                setMediaType('image');
                clearUploadedImage();
                setIsStoryArtModeActive(false);
              }}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all relative overflow-hidden
                ${mediaType === 'image' && !uploadedImage && mediaType !== 'product_study' && !isStoryArtModeActive
                  ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-400/50 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
            >
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className="text-xl md:text-2xl">✨</div>
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
              className={`p-3 md:p-4 rounded-xl border-2 transition-all relative overflow-hidden
                ${mediaType === 'video' && !isStoryArtModeActive
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
            >
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className="text-xl md:text-2xl">🎬</div>
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
                setMediaType('product_study');
                setUploadedImage(null);
                setImprovedImageUrl(null);
                setIsStoryArtModeActive(false);
              }}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all relative overflow-hidden
                ${mediaType === 'product_study' && !isStoryArtModeActive
                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
            >
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className="text-xl md:text-2xl">📸</div>
                <div className="text-xs md:text-sm font-bold">Estudio</div>
                <div className="text-[8px] md:text-[10px] text-white/60">Mejora tu foto</div>
              </div>
              {mediaType === 'product_study' && !isStoryArtModeActive && (
                <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </button>

            {/* STORY ART (9:16) - NUEVA TARJETA: DIRECCIÓN DE ARTE PROFESIONAL */}
            <button
              onClick={() => {
                setMediaType('story_art');
                setIsStoryArtModeActive(true);
                setAspectRatio('9:16'); // Forzar 9:16
                clearUploadedImage();
              }}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all relative overflow-hidden
                ${isStoryArtModeActive
                  ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50 text-white shadow-lg'
                  : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'}`}
            >
              <div className="flex flex-col items-center gap-1 md:gap-2">
                <div className="text-xl md:text-2xl">🎨</div>
                <div className="text-xs md:text-sm font-bold">Story Art</div>
                <div className="text-[8px] md:text-[10px] text-white/60">Dirección de Arte</div>
              </div>
              {isStoryArtModeActive && (
                <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full animate-pulse"></div>
              )}
            </button>
          </div>
        </div>

        {/* 6.1 ESTUDIO DE PRODUCTO - MEJORAR CON IA */}
        {mediaType === 'product_study' && !uploadedImage && (
          <div className="space-y-3">
            {/* SWITCH DE MODO DE REALISMO */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Modo de Estilo</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRealityMode('realist')}
                  className={`p-2 rounded-lg border text-xs transition-all ${
                    realityMode === 'realist'
                      ? 'bg-blue-500/30 border-blue-400 text-white'
                      : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                  }`}
                >
                  🏪 Local / Realista
                </button>
                <button
                  onClick={() => setRealityMode('aspirational')}
                  className={`p-2 rounded-lg border text-xs transition-all ${
                    realityMode === 'aspirational'
                      ? 'bg-purple-500/30 border-purple-400 text-white'
                      : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                  }`}
                >
                  ✨ Premium / Lujo
                </button>
              </div>
              <div className="text-[10px] text-white/50">
                {realityMode === 'realist'
                  ? 'Imágenes con luz natural y fondos sencillos para tu negocio local'
                  : 'Imágenes de alta gama con iluminación dramática y atmósfera lujosa'}
              </div>
            </div>
            
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
                <div className="text-green-400 text-xs mt-2">✨ La mejoraremos con IA</div>
              </label>
            </div>
          </div>
        )}

        {/* Vista previa de imagen subida y botón mejorar */}
        {uploadedImage && (
          <div className="space-y-3">
            {/* SWITCH DE MODO DE REALISMO */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Modo de Estilo</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRealityMode('realist')}
                  className={`p-2 rounded-lg border text-xs transition-all ${
                    realityMode === 'realist'
                      ? 'bg-blue-500/30 border-blue-400 text-white'
                      : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                  }`}
                >
                  🏪 Local / Realista
                </button>
                <button
                  onClick={() => setRealityMode('aspirational')}
                  className={`p-2 rounded-lg border text-xs transition-all ${
                    realityMode === 'aspirational'
                      ? 'bg-purple-500/30 border-purple-400 text-white'
                      : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                  }`}
                >
                  ✨ Premium / Lujo
                </button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">📸 Tu Foto</label>
              <button
                onClick={clearUploadedImage}
                className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
              >
                ✕ Eliminar
              </button>
            </div>
            
            {/* Vista previa de imagen subida */}
            <div className="relative rounded-xl overflow-hidden border border-white/20">
              <img
                src={uploadedImage}
                alt="Imagen subida"
                className="w-full h-48 object-contain bg-black/40"
              />
              {improvedImageUrl && (
                <div className="absolute top-2 right-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded">
                  ✓ Mejorada
                </div>
              )}
            </div>
            
            {/* Botón para mejorar */}
            <button
              onClick={handleImproveUploadedImage}
              disabled={isImprovingImage}
              className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2
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
            
            {improvedImageUrl && (
              <div className="p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="text-green-300 text-sm text-center">
                  ✓ Tu imagen ha sido mejorada con IA
                </div>
              </div>
            )}
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


        {/* 7. TEXTO SIMPLE - SOLO EN MODO MANUAL Y PARA IMÁGENES (NO PARA VIDEOS NI STORY ART) */}
        {workMode === 'manual' && mediaType !== 'video' && mediaType !== 'story_art' && (
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

        {/* GENERATE BUTTON */}
        <div className="pt-4 md:pt-6">
          <button
              onClick={onSubmit}
              disabled={isLoading || !description.trim()}
              className={`w-full py-3 md:py-4 rounded-xl font-bold text-sm tracking-wide shadow-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 relative overflow-hidden group
              ${isStoryArtModeActive
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

      </div>
   </>
 );
};
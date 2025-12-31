import React, { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';
import { FlyerStyleKey, AspectRatio, MediaType, ImageQuality, OverlayStyle } from '../types';
import { FLYER_STYLES, ASPECT_RATIO_LABELS } from '../constants';
import { analyzeUrlContent, generatePersuasiveText } from '../services/geminiService';
import { ImageAnalysisResult } from '../services/imageAnalysisService';
import { processMagicMode, MagicModeResult, STYLE_NAMES_ES } from '../services/magicModeService';

interface FlyerFormProps {
  styleKey: FlyerStyleKey;
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
}

export const FlyerForm: React.FC<FlyerFormProps> = ({
  styleKey,
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
  onClearInput
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
  
  // NUEVO: Activar Modo Magia cuando cambie la descripción
  useEffect(() => {
    if (description.length >= 3) {
      const timeoutId = setTimeout(() => {
        activateMagicMode(description);
      }, 800); // Esperar 800ms después del último cambio
      
      return () => clearTimeout(timeoutId);
    } else {
      setMagicModeResult(null);
    }
  }, [description]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string) => void) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setter(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAnalyzeUrl = async () => {
    if (!urlInput.trim()) return;
    setIsAnalyzing(true);
    
    let timeoutHandle: NodeJS.Timeout;
    
    // Timeout de 15 segundos
    timeoutHandle = setTimeout(() => {
        console.log("⏰ Timeout alcanzado, cerrando análisis");
        setIsAnalyzing(false);
        alert('El análisis tomó demasiado tiempo. Por favor, intenta con una URL diferente o describe manualmente el negocio.');
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
        
        setDescription(analysis.description);
        // En modo AUTO, el estilo se detecta automáticamente, NO se usa la selección manual
        if (analysis.visualStyle) {
            // NEW: Pasar también el texto extraído automáticamente
            onStyleDetected(analysis.visualStyle, analysis.overlayText, analysis.textStyle);
            // IMPORTANTE: En modo auto, no interferir con la selección manual del usuario
            // El estilo detectado se usa solo para la generación, no cambia la UI
        }
        setInputMode('text');
        
    } catch (error: any) {
        console.error("❌ Error en análisis:", error);
        clearTimeout(timeoutHandle);
        
        let errorMessage = 'Error analizando URL. Verifica que la URL sea válida.';
        
        if (urlInput.includes('instagram.com')) {
            errorMessage = 'Instagram puede requerir análisis manual. Por favor, describe el negocio manualmente.';
        }
        
        // Usar alert simple en lugar de SweetAlert2 para errores
        alert(errorMessage);
        
    } finally {
        setIsAnalyzing(false);
    }
  };

  // NEW: Función OPTIMIZADA para generar múltiples opciones de texto
  // OPTIMIZACIÓN: Reducido de 10 llamadas API a solo 3 llamadas (una por objetivo)
  const handleGenerateTextOptions = async (objective: 'branding' | 'leads') => {
    if (!description.trim()) return;
    
    setIsGeneratingText(true);
    try {
      console.log(`🎯 Generando opciones de texto para objetivo: ${objective}`);
      
      // OPTIMIZACIÓN: Generar solo 3 opciones por objetivo en lugar de 5
      // Esto reduce el tiempo de 10 llamadas API a solo 3 llamadas
      const options = {
        branding: [] as string[],
        leads: [] as string[]
      };
      
      // Generar 3 opciones para el objetivo seleccionado (mucho más rápido)
      const promises = [];
      for (let i = 0; i < 3; i++) {
        promises.push(
          generatePersuasiveText(description, objective)
            .then(text => {
              if (text && !options[objective].includes(text)) {
                options[objective].push(text);
              }
            })
            .catch(error => console.warn(`Error generando opción ${i}:`, error))
        );
      }
      
      // Ejecutar todas las llamadas en paralelo en lugar de secuencial
      await Promise.all(promises);
      
      // Fallbacks para completar si no se generaron suficientes opciones
      const fallbackBranding = ['Calidad Premium', 'Experiencia Confiable', 'Profesionales Expertos', 'Marca de Confianza', 'Excelencia Garantizada'];
      const fallbackLeads = ['¡Contáctanos Ya!', 'Agenda Tu Cita', 'Consulta Gratuita', 'Oferta Especial', 'Llama Ahora'];
      
      while (options.branding.length < 3) {
        const fallback = fallbackBranding[options.branding.length % fallbackBranding.length];
        if (!options.branding.includes(fallback)) {
          options.branding.push(fallback);
        }
      }
      
      while (options.leads.length < 3) {
        const fallback = fallbackLeads[options.leads.length % fallbackLeads.length];
        if (!options.leads.includes(fallback)) {
          options.leads.push(fallback);
        }
      }
      
      setTextOptions(options);
      
      // IMPORTANTE: Establecer automáticamente la primera opción como overlayText
      // para que el texto se muestre inmediatamente en el flyer
      if (options[objective].length > 0) {
        const firstOption = options[objective][0];
        setOverlayText(firstOption);
        setSelectedTextOption(firstOption);
        console.log('✅ Primera opción establecida automáticamente:', firstOption);
      }
      
      console.log('✅ Opciones de texto generadas:', options);
      
    } catch (error) {
      console.error('❌ Error generando opciones de texto:', error);
      // Fallback texts mejorados
      const fallbackBranding = ['Calidad Premium', 'Experiencia Confiable', 'Profesionales Expertos', 'Marca de Confianza', 'Excelencia Garantizada'];
      const fallbackLeads = ['¡Contáctanos Ya!', 'Agenda Tu Cita', 'Consulta Gratuita', 'Oferta Especial', 'Llama Ahora'];
      
      setTextOptions({
        branding: fallbackBranding,
        leads: fallbackLeads
      });
      
      // También establecer fallback como overlayText
      const firstFallback = objective === 'branding' ? fallbackBranding[0] : fallbackLeads[0];
      setOverlayText(firstFallback);
      setSelectedTextOption(firstFallback);
    } finally {
      setIsGeneratingText(false);
    }
  };
  
  // Función para seleccionar una opción de texto
  const handleSelectTextOption = (text: string) => {
    setSelectedTextOption(text);
    setOverlayText(text);
  };
  return (
    <>
      <div className="p-6 space-y-6 pb-32">
      
      {/* 1. ENTRADA UNIFICADA - MODO MAGIA */}
      <div className="space-y-4">
         <div className="text-center">
             <h2 className="text-xl font-bold text-white mb-2">✨ Crea tu Flyer</h2>
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
         
         {/* BOTÓN ANALIZAR URL - FUERA DE LA CAJA */}
         {(urlInput.includes('http') || description.includes('http')) && (
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
         
         {/* NUEVO: Indicador de Modo Magia */}
         {isMagicModeActive && (
           <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3">
             <div className="flex items-center">
               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400 mr-2"></div>
               <span className="text-purple-300 text-sm">🔮 Analizando con Modo Magia...</span>
             </div>
           </div>
         )}
         
         {/* NUEVO: Resultado del Modo Magia */}
         {magicModeResult && (
           <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
             <div className="text-green-300 text-sm">
               <div className="font-medium mb-1">✅ Modo Magia Activado</div>
               <div>Estilo: <span className="font-mono">{STYLE_NAMES_ES[magicModeResult.styleKey] || magicModeResult.styleKey}</span></div>
               <div>Texto: <span className="font-medium">"{magicModeResult.persuasiveText}"</span></div>
               <div>Confianza: {(magicModeResult.confidence * 100).toFixed(0)}%</div>
               {workMode === 'manual' && (
                 <button
                   onClick={() => {
                     setOverlayText(magicModeResult.persuasiveText);
                   }}
                   className="mt-2 text-xs bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded transition-colors"
                 >
                   Usar texto generado
                 </button>
               )}
             </div>
           </div>
         )}
         
         {/* AUTO MODE - MARKETING OBJECTIVE SELECTION */}
         {workMode === 'auto' && !marketingObjective && (
           <div className="space-y-3">
             <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono text-center block">¿Qué quieres lograr?</label>
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
                   {textOptions[marketingObjective].map((text, index) => (
                     <button
                       key={index}
                       onClick={() => handleSelectTextOption(text)}
                       className={`p-3 rounded-lg border text-left transition-all ${
                         selectedTextOption === text
                           ? 'border-green-500 bg-green-500/20 text-green-300'
                           : 'border-white/20 bg-white/5 text-white hover:border-white/40'
                       }`}
                     >
                       <div className="font-medium text-sm">{text}</div>
                     </button>
                   ))}
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
            <label className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Formato</label>
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

        {/* 7. TEXTO SIMPLE - SOLO EN MODO MANUAL */}
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

        {/* GENERATE BUTTON */}
        <div className="pt-6">
          <button
              onClick={onSubmit}
              disabled={isLoading || !description.trim()}
              className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide shadow-2xl transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 relative overflow-hidden group
              ${mediaType === 'video'
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
                      <span>✨ GENERAR {mediaType === 'video' ? 'VIDEO' : 'IMAGEN'}</span>
                  </>
              )}
          </button>
        </div>

      </div>
   </>
 );
};
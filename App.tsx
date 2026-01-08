import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { FlyerStyleKey, FlyerStyleKeyVideo, AspectRatio, GenerationStatus, MediaType, ImageQuality, OverlayStyle, PosterStyle, RealityLevel } from './types';
import { estudioAlerts } from './src/lib/alerts';
import Swal from 'sweetalert2';
import RealitySlider from './components/RealitySlider';
import RealityComparator from './components/RealityComparator';
import {
  getCachedVariation,
  saveVariationToCache,
  buildGeminiPromptWithReality,
  buildPowerPromptWithReality,
  shouldUseReferenceImage
} from './services/realitySliderService';
import { runAutoCleanup } from './services/cacheCleanerService';
import {
  getRealityConfig,
  getRealityLabel,
  getRealityCategory
} from './services/realityMapper';
import { POSTER_STYLES, POSTER_INDUSTRY_PROMPTS } from './constants';
import { FlyerForm } from './components/FlyerForm';
import { FlyerDisplay, TextStyleOptions } from './components/FlyerDisplay';
import { TextEditorPanel } from './components/TextEditorPanel';
import { CollapsibleSection } from './components/CollapsibleSection';
import { PricingModal } from './components/PricingModal';
import { StyleGallery } from './components/StyleGallery';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { AuthCallback } from './components/AuthCallback';
import { DiagnosticPage } from './components/DiagnosticPage';
import { ProfilePage } from './components/ProfilePage';
import { PrivacyPage } from './components/PrivacyPage';
import { CookiesPage } from './components/CookiesPage';
import { TermsPage } from './components/TermsPage';
import { ServiceConditionsPage } from './components/ServiceConditionsPage';
import { CommercialCalendar } from './components/CommercialCalendar';
import { CalendarNotifications } from './components/CalendarNotifications';
import { BrandPanel } from './components/BrandPanel';
import { BrandNotifications } from './components/BrandNotifications';
import { MobileMenu } from './components/MobileMenu';
import { PaymentSuccessPage } from './components/PaymentSuccessPage';
import { PaymentFailurePage } from './components/PaymentFailurePage';
import { PaymentPendingPage } from './components/PaymentPendingPage';
import { RechargeSuccessPage } from './components/RechargeSuccessPage';
import { RechargeFailurePage } from './components/RechargeFailurePage';
import { RechargePendingPage } from './components/RechargePendingPage';
import { PaymentHistory } from './components/PaymentHistory';
import { supabase } from './services/supabaseService';
import { getUserBrands, getDefaultBrand, Brand, generateEventPrompt } from './services/brandService';
import { detectIndustryFromDescription } from './services/geminiService';
import { enhancePrompt, generateFlyerImage, refineDescription, generatePersuasiveText, GeneratedImageResult } from './services/geminiService';
import { createGeneration, updateGenerationToHD, getGenerationById, FlyerGeneration } from './services/flyerGenerationService';
import { isFalAiConfigured } from './services/falAiService';
import creditService from './services/creditService';
import { SurfaceType } from './hooks/useSurfaceDetection';
import { getStoryArtStyleById, type StoryArtStyleId } from './src/constants/storyArtStyles';

// Dashboard Component
const Dashboard: React.FC = () => {
  const [hasKey, setHasKey] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showBrandPanel, setShowBrandPanel] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [hasShownFreePlanModal, setHasShownFreePlanModal] = useState(false);
  
  // Block body scroll when calendar overlay is open on mobile
  useEffect(() => {
    if (showCalendar && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showCalendar]);
  
  // User Data State
  const [activePlan, setActivePlan] = useState<string>('GRATIS');
  
  // Helper function to format plan name
  const formatPlanName = (plan: string): string => {
    const planMap: Record<string, string> = {
      'GRATIS': 'Gratis',
      'AGENCIA': 'Agencia',
      'PRO': 'Pro',
      'BASICO': 'Básico',
      'EMPRESA': 'Empresa',
      'CORPORATIVO': 'Corporativo',
      'STARTUP': 'Startup',
      'UNIVERSITY': 'University'
    };
    return planMap[plan] || plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
  };
  
  // App State
  const [styleKey, setStyleKey] = useState<FlyerStyleKey>('retail_sale');
  const [videoStyleKey, setVideoStyleKey] = useState<FlyerStyleKeyVideo>('video_retail_sale'); // NEW: Estado separado para estilos de video
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [posterStyle, setPosterStyle] = useState<PosterStyle>('promotional');
  const [description, setDescription] = useState<string>('');
  const [workMode, setWorkMode] = useState<'auto' | 'manual'>('auto'); // NEW: Modo de trabajo (por defecto AUTO)
  const [textMode, setTextMode] = useState<'auto' | 'manual'>('auto'); // NEW: Modo de texto (Opción B)
  
  // NEW: Handler para cambio de modo de trabajo
  const handleWorkModeChange = (mode: 'auto' | 'manual') => {
    setWorkMode(mode);
    // Si cambiamos a modo MANUAL, limpiar customStylePrompt
    if (mode === 'manual' && customStylePrompt) {
      console.log('🔄 Cambiando a modo MANUAL - limpiando análisis automático');
      setCustomStylePrompt(undefined);
    }
  };
  
  // NEW: Handler para limpiar entrada y análisis automático
  const handleClearInput = () => {
    setDescription('');
    setCustomStylePrompt(undefined);
    setOverlayText('');
    setUserManuallyAddedText(false);
    setCurrentSpanishPrompt(''); // NEW: Limpiar también el prompt en español
    console.log('🧹 Entrada limpiada - análisis automático removido');
  };
  
  // NEW: Handler para actualizar el prompt en español desde análisis de URL
  const handleSpanishPromptUpdate = (prompt: string) => {
    setCurrentSpanishPrompt(prompt);
    console.log('📝 Prompt en español actualizado desde análisis de URL:', prompt.substring(0, 50) + '...');
  };
  
  const [imageQuality, setImageQuality] = useState<ImageQuality>('draft');
  const [isDraft, setIsDraft] = useState(false);
  const [seed, setSeed] = useState<number>(0);
  const [customStylePrompt, setCustomStylePrompt] = useState<string | undefined>(undefined);
  
  // URLs separadas para draft y HD (IMÁGENES)
  const [draftImageUrl, setDraftImageUrl] = useState<string | null>(null);
  const [hdImageUrl, setHdImageUrl] = useState<string | null>(null);
  
  // URLs separadas para draft y HD (VIDEOS)
  const [draftVideoUrl, setDraftVideoUrl] = useState<string | null>(null);
  const [hdVideoUrl, setHdVideoUrl] = useState<string | null>(null);
  const [draftVideoImageUrl, setDraftVideoImageUrl] = useState<string | null>(null); // Imagen draft usada para generar video
  
  // NEW: Estado para el ID de generación actual
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null);
  const [currentGeneration, setCurrentGeneration] = useState<FlyerGeneration | null>(null);

  // Estado para almacenar el estilo detectado automáticamente - DEBE ESTAR ANTES DEL USEEFFECT
  const [detectedStyleKey, setDetectedStyleKey] = useState<FlyerStyleKey | null>(null);

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoColor, setLogoColor] = useState<string | null>(null);
  const [logoFilters, setLogoFilters] = useState({
    grayscale: 0,
    brightness: 100,
    contrast: 100,
    opacity: 100,
  });
  const [productUrl, setProductUrl] = useState<string | null>(null);
  const [overlayText, setOverlayText] = useState<string>('');
  const [overlayStyle, setOverlayStyle] = useState<OverlayStyle>('modern');
  const [userManuallyAddedText, setUserManuallyAddedText] = useState<boolean>(false);
  
  // Handler para actualizar overlayText Y marcar como modificado por usuario
  const handleSetOverlayText = (text: string) => {
    setOverlayText(text);
    if (text.trim()) {
      setUserManuallyAddedText(true);
    }
  };

  // ELIMINADO: currentEnhancedPrompt ya no se muestra en UI, solo usamos spanishPrompt
  const [currentSpanishPrompt, setCurrentSpanishPrompt] = useState<string>(''); // Prompt en español para mostrar al usuario
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // NEW: Estados para análisis inteligente
  const [intelligentTextStyles, setIntelligentTextStyles] = useState<any>(null);
  const [imageAnalysis, setImageAnalysis] = useState<any>(null);
  
  // NEW: Estados para servicios avanzados
  const [contextualTypography, setContextualTypography] = useState<any>(null);
  const [contrastAnalysis, setContrastAnalysis] = useState<any>(null);
  const [contextualEffects, setContextualEffects] = useState<any>(null);
  const [compositionAnalysis, setCompositionAnalysis] = useState<any>(null);
  const [autoTextValidation, setAutoTextValidation] = useState<any>(null);
  const [enhancedStyles, setEnhancedStyles] = useState<any>(null);
  
  // NEW: Estados para posición del texto draggable
  const [textPosition, setTextPosition] = useState<{x: number, y: number}>({ x: 50, y: 85 }); // Porcentajes - posicionado en la parte inferior
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // NEW: Estados para Visual Mimicry
  const [surfaceType, setSurfaceType] = useState<SurfaceType>('default');
  const [autoDetectedSurface, setAutoDetectedSurface] = useState<SurfaceType | null>(null);
  
  // 🎨 STORY ART VISUAL STYLE STATE - 7 estilos visuales únicos
  const [storyArtVisualStyleId, setStoryArtVisualStyleId] = useState<StoryArtStyleId | null>(null);
  
  // Handler para cuando se selecciona un estilo visual Story Art
  const handleStoryArtStyleSelected = (id: StoryArtStyleId | null) => {
    setStoryArtVisualStyleId(id);
    console.log(`🎨 Estilo visual Story Art seleccionado: ${id}`);
  };
  
  // NEW: Estados para posición de logo y producto
  const [logoPosition, setLogoPosition] = useState<{x: number, y: number; width: number}>({ x: 10, y: 10, width: 80 });
  const [productPosition, setProductPosition] = useState<{x: number, y: number; width: number; height: number}>({ x: 50, y: 70, width: 120, height: 120 });
  
  // 🎚️ REALITY SLIDER STATES - Sistema de регулятор de realidad
  // DEFAULT: 1.5 (Cámara Espía) - Look más auténtico y cercano para locales chilenos
  const [realityLevel, setRealityLevel] = useState<number>(1.5);
  const [sceneId, setSceneId] = useState<string | null>(null);
  const [realityVariations, setRealityVariations] = useState<Record<number, string>>({});
  const [showRealityComparator, setShowRealityComparator] = useState(false);
  const [isGeneratingReality, setIsGeneratingReality] = useState(false);
  const [realityGenerationMessage, setRealityGenerationMessage] = useState<string | null>(null);
  const [isRealityVariation, setIsRealityVariation] = useState(false);
  
  // Refs para gestión de memoria y locks
  const realityLoadingSwalRef = useRef<any>(null);
  const generationLockRef = useRef(false); // ✅ CORRECCIÓN: Prevenir generaciones paralelas
  const previousDraftUrlRef = useRef<string | null>(null);
  
  // Callback para mostrar alerta de loading cuando inicia generación de realidad
  const handleRealityGenerationStart = useCallback(() => {
    console.log('🎚️ [App] Mostrando alerta de loading para generación de realidad...');
    
    // Cerrar cualquier alerta anterior
    if (realityLoadingSwalRef.current) {
      realityLoadingSwalRef.current.close();
      realityLoadingSwalRef.current = null;
    }
    
    // Mostrar nueva alerta de loading usando Swal estático
    const fire = () => {
      Swal.fire({
        background: '#111827',
        color: '#ffffff',
        confirmButtonColor: '#3b82f6',
        customClass: {
          popup: 'border border-gray-700 shadow-2xl rounded-3xl font-sans',
          title: 'text-2xl font-bold text-white tracking-tight',
          htmlContainer: 'text-gray-400 text-sm',
          confirmButton: 'rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95',
        },
        buttonsStyling: true,
        title: 'Generando nueva imagen con nivel de realismo seleccionado...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    };
    
    const close = () => {
      Swal.close();
    };
    
    realityLoadingSwalRef.current = { fire, close };
    fire();
  }, []);
  // NEW: Estado SEPARADO para variaciones de realidad - NO tocar hdImageUrl
  const [realityImageUrl, setRealityImageUrl] = useState<string | null>(null);
  
  // Cleanup de alertas y memoria al desmontar el componente
  useEffect(() => {
    return () => {
      // Cerrar cualquier alerta activa si el componente se destruye
      if (realityLoadingSwalRef.current) {
        realityLoadingSwalRef.current.close();
        realityLoadingSwalRef.current = null;
      }
      // Liberar URLs de blob para evitar fugas de memoria
      if (draftImageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(draftImageUrl);
      }
      if (hdImageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(hdImageUrl);
      }
      if (realityImageUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(realityImageUrl);
      }
    };
  }, [draftImageUrl, hdImageUrl, realityImageUrl]);

  // ✅ CORRECCIÓN: Cleanup de URLs de blob durante el uso (no solo al desmontar)
  useEffect(() => {
    // Limpiar URL anterior si era blob y cambió
    if (previousDraftUrlRef.current?.startsWith('blob:') &&
        previousDraftUrlRef.current !== draftImageUrl) {
      try {
        URL.revokeObjectURL(previousDraftUrlRef.current);
        console.log('🧹 [Memory] URL de blob liberada');
      } catch (e) {
        console.warn('⚠️ Error liberando URL de blob:', e);
      }
    }
    previousDraftUrlRef.current = draftImageUrl;
  }, [draftImageUrl]);
  
  // NEW: Estados para estilos manuales del editor de texto
  const [manualTextStyles, setManualTextStyles] = useState<TextStyleOptions>({
    fontSize: 16,
    fontFamily: 'Lato, sans-serif',
    fontWeight: 'bold',
    textColor: '#FFFFFF',
    backgroundColor: 'transparent',
    letterSpacing: 0,
    textTransform: 'none',
    lineWidth: 200, // Ancho del texto para controlar líneas
    effects: {
      shadow: true,
      stroke: false,
      glow: false
    }
  });
  
  const [status, setStatus] = useState<GenerationStatus>({
    isLoading: false,
    step: 'idle',
    message: ''
  });

  // Brand state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  // Load brands on mount
  useEffect(() => {
    const loadBrands = async () => {
      const userBrands = await getUserBrands();
      setBrands(userBrands);
      if (userBrands.length > 0) {
        // Try to get default brand, otherwise use first
        const defaultBrand = userBrands.find(b => b.is_default) || userBrands[0];
        setSelectedBrand(defaultBrand);
      }
    };
    loadBrands();
  }, []);

  // Generar texto persuasivo por defecto al montar el componente
  useEffect(() => {
    const generateDefaultText = async () => {
      try {
        const defaultText = await generatePersuasiveText(
          'Negocio local con productos y servicios de calidad',
          'branding'
        );
        if (defaultText && defaultText.trim()) {
          setOverlayText(defaultText);
          console.log('✅ Texto persuasivo por defecto generado:', defaultText);
        }
      } catch (error) {
        console.warn('⚠️ Error generando texto persuasivo por defecto, usando fallback');
        setOverlayText('Calidad Premium');
      }
    };
    
    generateDefaultText();
  }, []);

  // 🎚️ LIMPIEZA AUTOMÁTICA DE CACHÉ AL INICIAR LA APP
  useEffect(() => {
    runAutoCleanup();
  }, []);

  // 🎚️ INICIALIZAR sceneId CUANDO SE GENERA UNA IMAGEN
  // IMPORTANTE: El sceneId DEBE refrescarse cada vez que se genera una nueva imagen
  // para evitar contaminación del caché entre sesiones
  // ✅ CORRECCIÓN: Solo depender de seed para evitar condición de carrera con imageUrl asíncrono
  useEffect(() => {
    if (seed) {
      const newSceneId = `scene_${Date.now()}_${seed}`;
      setSceneId(newSceneId);
      console.log('🎚️ SceneId refrescado para nueva imagen:', newSceneId);
      
      // Limpiar variaciones en estado para evitar contaminación
      setRealityVariations({});
      // NOTA: El caché de localStorage ya está validado por sceneId, no es necesario limpiarlo completamente
    }
  }, [seed]);

  // 🎯 CERRAR ALERTA DE LOADING CUANDO SE GENERA NUEVO BORRADOR
  useEffect(() => {
    if (imageUrl && status.isLoading === false && status.step === 'complete') {
      // Cerrar cualquier alerta de Swal que esté abierta
      Swal.close();
      console.log('🔒 Alerta de loading cerrada - imagen generada');
    }
  }, [imageUrl, status.isLoading, status.step]);

  useEffect(() => {
    // Enhanced auth check with better error handling
    const checkAuth = async () => {
      try {
        console.log('🔍 Iniciando verificación de autenticación...');
        setIsCheckingAuth(true);
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error obteniendo sesión:', error);
          setHasKey(false);
          setIsCheckingAuth(false);
          // Redirect to login
          setTimeout(() => {
            window.location.href = '/iniciar-sesion';
          }, 1000);
          return;
        }
        
        if (session?.user) {
          console.log('✅ Usuario autenticado:', session.user.email);
          console.log('✅ Email confirmado:', !!session.user.email_confirmed_at);
          setHasKey(true);
          
          // Load user data with better error handling
          try {
            console.log('🔄 Cargando datos de usuario...');
            const { data: user, error: userError } = await supabase
              .from('users')
              .select('*, user_plans(*)')
              .eq('id', session.user.id)
              .single();
            
            if (userError) {
              console.log('⚠️ Error cargando datos de usuario:', userError.message);
              console.log('🔄 Usando plan por defecto...');
              setActivePlan('GRATIS');
            } else if (user?.user_plans?.name) {
              setActivePlan(user.user_plans.name);
              console.log('✅ Plan cargado:', user.user_plans.name);
              console.log('✅ Créditos:', user.credits);
              
              // Auto-abrir modal de planes si es plan gratuito y no se ha mostrado antes
              if (user.user_plans.name === 'GRATIS' && !hasShownFreePlanModal) {
                // Verificar si ya se mostró el modal en esta sesión
                const modalShown = localStorage.getItem('freePlanModalShown');
                if (!modalShown) {
                  setShowPricing(true);
                  setHasShownFreePlanModal(true);
                  localStorage.setItem('freePlanModalShown', 'true');
                }
              }
            } else {
              console.log('⚠️ Datos de usuario incompletos, usando plan por defecto');
              setActivePlan('GRATIS');
            }
          } catch (userLoadError) {
            console.log('⚠️ Excepción cargando datos de usuario:', userLoadError);
            setActivePlan('GRATIS');
          }
        } else {
          console.log('❌ No hay sesión activa');
          setHasKey(false);
          // Redirect to login
          setTimeout(() => {
            window.location.href = '/iniciar-sesion';
          }, 1000);
          return;
        }
      } catch (error) {
        console.error('❌ Error general en verificación de auth:', error);
        setHasKey(false);
        // Redirect to login
        setTimeout(() => {
          window.location.href = '/iniciar-sesion';
        }, 1000);
        return;
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    // Enhanced auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔔 Evento de autenticación:', event);
        if (session?.user) {
          console.log('✅ Sesión establecida:', session.user.email);
          setHasKey(true);
        } else {
          console.log('❌ Sesión cerrada');
          setHasKey(false);
          setActivePlan('GRATIS');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticación...</p>
          <p className="text-white/50 text-sm mt-2">Esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!hasKey) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🔒</div>
          <h1 className="text-white text-xl mb-4">Acceso Requerido</h1>
          <p className="text-white/70 mb-6">Redirigiendo al login...</p>
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  const handleConnect = async () => {
    try {
      // Redirect to login if not authenticated
      window.location.href = '/iniciar-sesion';
    } catch (e) {
      console.error("Error redirecting to login", e);
      alert("Error al redirigir al login.");
    }
  };

  const handleStyleDetected = (detectedStyle: string, detectedText?: string, textStyle?: string) => {
    // SOLO establecer customStylePrompt si estamos en modo AUTO
    if (workMode === 'auto') {
      // MEJORADO: Detectar si el detectedStyle indica un estilo específico de industria
      const styleLower = detectedStyle.toLowerCase();
      
      // Mapear descripciones visuales a estilos de flyer correctos
      let correctStyleKey: FlyerStyleKey | null = null;
      
      // Pilates/Yoga/Wellness → wellness_zen
      if (styleLower.includes('pilates') ||
          styleLower.includes('yoga') ||
          styleLower.includes('wellness') ||
          styleLower.includes('zen') ||
          styleLower.includes('spa') ||
          styleLower.includes('meditation') ||
          styleLower.includes('relax') ||
          styleLower.includes('massage') ||
          styleLower.includes('stretching') ||
          styleLower.includes('breathing') ||
          styleLower.includes('mindfulness') ||
          styleLower.includes('reiki') ||
          styleLower.includes('holistic')) {
        correctStyleKey = 'wellness_zen';
        console.log('🔮 WELLNESS DETECTADO → wellness_zen');
      }
      // Iglesia/Religioso → worship_sky
      else if (styleLower.includes('iglesia') ||
               styleLower.includes('church') ||
               styleLower.includes('religious') ||
               styleLower.includes('cristo') ||
               styleLower.includes('evangelio') ||
               styleLower.includes('fe') ||
               styleLower.includes('esperanza') ||
               styleLower.includes('dios') ||
               styleLower.includes('biblia')) {
        correctStyleKey = 'worship_sky';
        console.log('⛪ IGLESIA DETECTADO → worship_sky');
      }
      // Fitness/Gym → sport_gritty
      else if (styleLower.includes('gym') ||
               styleLower.includes('fitness') ||
               styleLower.includes('deporte') ||
               styleLower.includes('workout') ||
               styleLower.includes('entrenamiento') ||
               styleLower.includes('crossfit') ||
               styleLower.includes('musculacion') ||
               styleLower.includes('entrenar')) {
        correctStyleKey = 'sport_gritty';
        console.log('💪 GYM/FITNESS DETECTADO → sport_gritty');
      }
      // Belleza → aesthetic_min
      else if (styleLower.includes('belleza') ||
               styleLower.includes('beauty') ||
               styleLower.includes('aesthetic') ||
               styleLower.includes('estetica') ||
               styleLower.includes('uñas') ||
               styleLower.includes('peluqueria') ||
               styleLower.includes('barber') ||
               styleLower.includes('makeup') ||
               styleLower.includes('cosmetico')) {
        correctStyleKey = 'aesthetic_min';
        console.log('💅 BELLEZA DETECTADO → aesthetic_min');
      }
      // Ofertas/Liquidación → retail_sale
      else if (styleLower.includes('oferta') ||
               styleLower.includes('liquidacion') ||
               styleLower.includes('sale') ||
               styleLower.includes('descuento') ||
               styleLower.includes('promocion') ||
               styleLower.includes('rebaja') ||
               styleLower.includes('cyber') ||
               styleLower.includes('black friday')) {
        correctStyleKey = 'retail_sale';
        console.log('🏷️ OFERTAS DETECTADO → retail_sale');
      }
      // Gastronomía/Restaurante → gastronomy
      else if (styleLower.includes('restaurante') ||
               styleLower.includes('comida') ||
               styleLower.includes('food') ||
               styleLower.includes('sushi') ||
               styleLower.includes('cafe') ||
               styleLower.includes('coffee') ||
               styleLower.includes('bar') ||
               styleLower.includes('pub') ||
               styleLower.includes('cerveza') ||
               styleLower.includes('vino') ||
               styleLower.includes('menu') ||
               styleLower.includes('gastronomi') ||
               styleLower.includes('chef') ||
               styleLower.includes('cocina') ||
               styleLower.includes('empanada') ||
               styleLower.includes('asado') ||
               styleLower.includes('churrasco')) {
        correctStyleKey = 'gastronomy';
        console.log('🍽️ GASTRONOMÍA DETECTADO → gastronomy');
      }
      // Corporativo/Inmobiliaria → corporate
      else if (styleLower.includes('empresa') ||
               styleLower.includes('corporativo') ||
               styleLower.includes('oficina') ||
               styleLower.includes('inmobiliaria') ||
               styleLower.includes('inmueble') ||
               styleLower.includes('propiedad') ||
               styleLower.includes('departamento') ||
               styleLower.includes('casa') ||
               styleLower.includes('terreno') ||
               styleLower.includes('broker') ||
               styleLower.includes('business') ||
               styleLower.includes('consultoria')) {
        correctStyleKey = 'corporate';
        console.log('🏢 CORPORATIVO DETECTADO → corporate');
      }
      // Médico/Clínica/Salud → medical_clean
      else if (styleLower.includes('medico') ||
               styleLower.includes('doctor') ||
               styleLower.includes('clinica') ||
               styleLower.includes('salud') ||
               styleLower.includes('dental') ||
               styleLower.includes('dentista') ||
               styleLower.includes('odontologia') ||
               styleLower.includes('hospital') ||
               styleLower.includes('farmacia') ||
               styleLower.includes('veterinaria') ||
               styleLower.includes('veterinario') ||
               styleLower.includes('optica') ||
               styleLower.includes('psicologo') ||
               styleLower.includes('terapia') ||
               styleLower.includes('kinesiologia')) {
        correctStyleKey = 'medical_clean';
        console.log('🏥 MÉDICO/SALUD DETECTADO → medical_clean');
      }
      // Tecnología/Software → tech_saas
      else if (styleLower.includes('tecnologia') ||
               styleLower.includes('tech') ||
               styleLower.includes('software') ||
               styleLower.includes('computador') ||
               styleLower.includes('celular') ||
               styleLower.includes('iphone') ||
               styleLower.includes('digital') ||
               styleLower.includes('internet') ||
               styleLower.includes('web') ||
               styleLower.includes('app') ||
               styleLower.includes('programacion') ||
               styleLower.includes('coding') ||
               styleLower.includes('ia') ||
               styleLower.includes('ai') ||
               styleLower.includes('cripto') ||
               styleLower.includes('bitcoin') ||
               styleLower.includes('blockchain')) {
        correctStyleKey = 'tech_saas';
        console.log('💻 TECNOLOGÍA DETECTADO → tech_saas');
      }
      // Educación/Cursos → edu_sketch
      else if (styleLower.includes('educacion') ||
               styleLower.includes('escuela') ||
               styleLower.includes('colegio') ||
               styleLower.includes('universidad') ||
               styleLower.includes('curso') ||
               styleLower.includes('clase') ||
               styleLower.includes('estudiar') ||
               styleLower.includes('estudio') ||
               styleLower.includes('aprendizaje') ||
               styleLower.includes('academia') ||
               styleLower.includes('preuniversitario') ||
               styleLower.includes('idiomas') ||
               styleLower.includes('ingles') ||
               styleLower.includes('formacion')) {
        correctStyleKey = 'edu_sketch';
        console.log('📚 EDUCACIÓN DETECTADO → edu_sketch');
      }
      // Discoteca/Fiesta/Neón → urban_night
      else if (styleLower.includes('discoteca') ||
               styleLower.includes('club') ||
               styleLower.includes('fiesta') ||
               styleLower.includes('party') ||
               styleLower.includes('noche') ||
               styleLower.includes('nocturno') ||
               styleLower.includes('neon') ||
               styleLower.includes('nightlife') ||
               styleLower.includes('bar') ||
               styleLower.includes('pub') ||
               styleLower.includes('karaoke') ||
               styleLower.includes('entretencion')) {
        correctStyleKey = 'urban_night';
        console.log('🎉 FIESTA/DISCOTECA DETECTADO → urban_night');
      }
      // Lujo/VIP/Gala → luxury_gold
      else if (styleLower.includes('lujo') ||
               styleLower.includes('luxury') ||
               styleLower.includes('vip') ||
               styleLower.includes('gala') ||
               styleLower.includes('elegante') ||
               styleLower.includes('premium') ||
               styleLower.includes('exclusivo') ||
               styleLower.includes('oro') ||
               styleLower.includes('gold') ||
               styleLower.includes('ano nuevo') ||
               styleLower.includes('celebracion') ||
               styleLower.includes('evento especial')) {
        correctStyleKey = 'luxury_gold';
        console.log('👑 LUJO/VIP DETECTADO → luxury_gold');
      }
      // Verano/Piscina/Playa → summer_beach
      else if (styleLower.includes('verano') ||
               styleLower.includes('piscina') ||
               styleLower.includes('playa') ||
               styleLower.includes('beach') ||
               styleLower.includes('pool') ||
               styleLower.includes('mar') ||
               styleLower.includes('sol') ||
               styleLower.includes('vacaciones') ||
               styleLower.includes('turismo') ||
               styleLower.includes('hotel') ||
               styleLower.includes('hostal') ||
               styleLower.includes('resort')) {
        correctStyleKey = 'summer_beach';
        console.log('☀️ VERANO/PLAYA DETECTADO → summer_beach');
      }
      // Ecológico/Natural → eco_organic
      else if (styleLower.includes('ecologico') ||
               styleLower.includes('eco') ||
               styleLower.includes('organico') ||
               styleLower.includes('natural') ||
               styleLower.includes('bio') ||
               styleLower.includes('sustentable') ||
               styleLower.includes('reciclado') ||
               styleLower.includes('feria') ||
               styleLower.includes('agricultura') ||
               styleLower.includes('vegan') ||
               styleLower.includes('vegetariano') ||
               styleLower.includes('saludable')) {
        correctStyleKey = 'eco_organic';
        console.log('🌿 ECOLÓGICO DETECTADO → eco_organic');
      }
      // Inmuebles de lujo → realestate_night
      else if (styleLower.includes('venta') ||
               styleLower.includes('en venta') ||
               styleLower.includes('property') ||
               styleLower.includes('real estate') ||
               styleLower.includes('penthouse') ||
               styleLower.includes('villa') ||
               styleLower.includes('mansión') ||
               styleLower.includes('inmobiliario')) {
        correctStyleKey = 'realestate_night';
        console.log('🏠 INMOBILIARIO DETECTADO → realestate_night');
      }
      // Infantil/Cumpleaños → kids_fun
      else if (styleLower.includes('niños') ||
               styleLower.includes('ninos') ||
               styleLower.includes('infantil') ||
               styleLower.includes('cumpleaños') ||
               styleLower.includes('birthday') ||
               styleLower.includes('juguete') ||
               styleLower.includes('jugueteria') ||
               styleLower.includes('guarderia') ||
               styleLower.includes('kinder') ||
               styleLower.includes('fiesta infantil')) {
        correctStyleKey = 'kids_fun';
        console.log('🎈 INFANTIL DETECTADO → kids_fun');
      }
      // Navidad/Festividades → seasonal_holiday
      else if (styleLower.includes('navidad') ||
               styleLower.includes('christmas') ||
               styleLower.includes('año nuevo') ||
               styleLower.includes('new year') ||
               styleLower.includes('regalo') ||
               styleLower.includes('gifts') ||
               styleLower.includes('festividades') ||
               styleLower.includes('celebracion') ||
               styleLower.includes('feriado')) {
        correctStyleKey = 'seasonal_holiday';
        console.log('🎄 NAVIDAD DETECTADO → seasonal_holiday');
      }
      // Teatro/Arte/Arteístico → art_double_exp
      else if (styleLower.includes('teatro') ||
               styleLower.includes('arte') ||
               styleLower.includes('artist') ||
               styleLower.includes('cultural') ||
               styleLower.includes('museo') ||
               styleLower.includes('galeria') ||
               styleLower.includes('exposicion') ||
               styleLower.includes('espectaculo') ||
               styleLower.includes('performance')) {
        correctStyleKey = 'art_double_exp';
        console.log('🎭 ARTE/TEATRO DETECTADO → art_double_exp');
      }
      // Retro/Vintage → retro_vintage
      else if (styleLower.includes('retro') ||
               styleLower.includes('vintage') ||
               styleLower.includes('90s') ||
               styleLower.includes('80s') ||
               styleLower.includes('nostalgia') ||
               styleLower.includes('clásico') ||
               styleLower.includes('clasico') ||
               styleLower.includes('antiguo') ||
               styleLower.includes('coleccion')) {
        correctStyleKey = 'retro_vintage';
        console.log('📼 RETRO/VINTAGE DETECTADO → retro_vintage');
      }
      // Podcast/Radio → podcast_mic
      else if (styleLower.includes('podcast') ||
               styleLower.includes('radio') ||
               styleLower.includes('entrevista') ||
               styleLower.includes('audio') ||
               styleLower.includes('streaming') ||
               styleLower.includes('youtuber') ||
               styleLower.includes('influencer') ||
               styleLower.includes('contenido digital')) {
        correctStyleKey = 'podcast_mic';
        console.log('🎙️ PODCAST/RADIO DETECTADO → podcast_mic');
      }
      // Gamer/Twitch → gamer_stream
      else if (styleLower.includes('gamer') ||
               styleLower.includes('gaming') ||
               styleLower.includes('twitch') ||
               styleLower.includes('videojuego') ||
               styleLower.includes('video game') ||
               styleLower.includes('esports') ||
               styleLower.includes('playstation') ||
               styleLower.includes('xbox') ||
               styleLower.includes('nintendo') ||
               styleLower.includes('consola')) {
        correctStyleKey = 'gamer_stream';
        console.log('🎮 GAMER DETECTADO → gamer_stream');
      }
      // Rock/Música/Conciertos → indie_grunge
      else if (styleLower.includes('rock') ||
               styleLower.includes('musica') ||
               styleLower.includes('music') ||
               styleLower.includes('concierto') ||
               styleLower.includes('tocata') ||
               styleLower.includes('banda') ||
               styleLower.includes('grupo') ||
               styleLower.includes('indie') ||
               styleLower.includes('alternativo') ||
               styleLower.includes('metal') ||
               styleLower.includes('jazz') ||
               styleLower.includes('live')) {
        correctStyleKey = 'indie_grunge';
        console.log('🎸 ROCK/MÚSICA DETECTADO → indie_grunge');
      }
      // Automotriz/Taller → auto_metallic
      else if (styleLower.includes('auto') ||
               styleLower.includes('automotriz') ||
               styleLower.includes('carro') ||
               styleLower.includes('coche') ||
               styleLower.includes('vehiculo') ||
               styleLower.includes('taller') ||
               styleLower.includes('mecanico') ||
               styleLower.includes('mecanica') ||
               styleLower.includes('repuesto') ||
               styleLower.includes('lubricante') ||
               styleLower.includes('llanta') ||
               styleLower.includes('neumatico')) {
        correctStyleKey = 'auto_metallic';
        console.log('🚗 AUTOMOTRIZ DETECTADO → auto_metallic');
      }
      
      if (correctStyleKey) {
        // Si detectamos un estilo específico, guardarlo y usarlo directamente
        setDetectedStyleKey(correctStyleKey);
        setStyleKey(correctStyleKey);
        console.log('🤖 ESTILO CORREGIDO AUTOMÁTICAMENTE:', correctStyleKey);
        // NO usar customStylePrompt, usar el estilo predefinido
        setCustomStylePrompt(undefined);
      } else {
        // Usar el detectedStyle como customStylePrompt para brand_identity
        setCustomStylePrompt(detectedStyle);
        setDetectedStyleKey(null);
        console.log('🤖 ANÁLISIS AUTOMÁTICO GUARDADO (modo AUTO):', detectedStyle.substring(0, 50) + '...');
      }
    } else {
      // En modo MANUAL, no guardar el análisis automático
      console.log('🎨 MODO MANUAL - Ignorando análisis automático');
    }
    
    // NEW: Si hay texto detectado automáticamente, usarlo como overlayText
    if (detectedText && detectedText.trim()) {
      setOverlayText(detectedText);
      console.log('🤖 TEXTO AUTOMÁTICO DETECTADO:', detectedText);
    }
  };

const handleGenerate = async () => {
    if (!description.trim()) return;

    console.log('🚀 Starting generation with:', {
      description: description.substring(0, 50) + '...',
      workMode,
      styleKey,
      aspectRatio,
      mediaType,
      imageQuality,
      hasProductOverlay: !!productUrl,
      hasLogo: !!logoUrl,
      hasOverlay: !!overlayText,
      customStylePrompt: customStylePrompt ? 'present' : 'none',
      isPosterMode: mediaType === 'poster'
    });

    // Mostrar alerta de progreso
    const progressAlert = estudioAlerts.progress(
      mediaType === 'poster' ? 'Generando póster...' :
      mediaType === 'video' ? 'Generando video...' :
      imageQuality === 'draft' ? 'Generando borrador...' : 'Generando imagen HD...'
    );

    // NO borrar draftImageUrl si estamos en modo HD - lo necesitamos para comparar
    if (imageQuality === 'draft') {
      setDraftImageUrl(null);
    }
    setImageUrl(null);
    setHdImageUrl(null);
    // 🎯 LIMPIAR realityImageUrl al generar nueva imagen base
    setRealityImageUrl(null);
    // 🎯 RESETEAR realityLevel a 1.5 (Cámara Espía) y limpiar variaciones al generar nuevo borrador
    setRealityLevel(1.5);
    setIsRealityVariation(false); // Indicar que es una nueva imagen base
    setRealityVariations({});
    setCurrentSpanishPrompt(''); // Limpiar prompt en español
    const newSeed = Math.floor(Math.random() * 2000000000);
    setSeed(newSeed);
    const hasProductOverlay = !!productUrl;

    // ============================================
    // MODO POSTER PRO - GENERACIÓN ESPECIAL
    // ============================================
    if (mediaType === 'poster') {
      try {
        progressAlert.updateProgress(20, 'Generando póster profesional...');
        
        // Detectar industria basada en la descripción
        const industryKey = detectIndustryFromDescription(description);
        console.log('📄 Industria detectada para poster:', industryKey);
        
        // Obtener prompt específico para la industria y estilo de poster
        const industryPrompts = POSTER_INDUSTRY_PROMPTS[industryKey] || POSTER_INDUSTRY_PROMPTS['default'];
        const posterPrompt = industryPrompts[posterStyle];
        
        console.log('📄 Estilo de poster:', posterStyle);
        console.log('📄 Prompt generado:', posterPrompt.substring(0, 100) + '...');
        
        // Generar imagen de poster con formato 1:1.41
progressAlert.updateProgress(60, 'Renderizando...');
        
        // Usar el mismo servicio de generación pero con prompt de poster
        const result = await generateFlyerImage(
          posterPrompt,
          styleKey,
          '1:1.41', // Forzar formato poster A3/A4
          imageQuality,
          newSeed,
          undefined,
          hasProductOverlay,
          true,
          overlayText || undefined,
          'modern'
        );
        
        setImageUrl(result.imageDataUrl);
        setDraftImageUrl(result.imageDataUrl);
        
        // Guardar generación
        if (imageQuality === 'draft') {
          const generation = await createGeneration({
            userId: (await supabase.auth.getSession()).data.session?.user.id || '',
            draftImageUrl: result.imageDataUrl,
            prompt: posterPrompt,
            styleKey,
            aspectRatio: '1:1.41',
            seed: newSeed
          });
          
          if (generation) {
            setCurrentGenerationId(generation.id);
            setCurrentGeneration(generation);
            console.log('✅ Poster guardado con ID:', generation.id);
          }
        }
        
        progressAlert.updateProgress(100, '¡Completado!'); setTimeout(() => progressAlert.close(), 500);
        console.log('✅ Poster generado exitosamente');
        return;
        
      } catch (error: any) {
        console.error('❌ Error generando poster:', error);
        handleError(error);
        return;
      }
    }

    // DETERMINE STYLE KEY BASED ON WORK MODE - CAMINOS COMPLETAMENTE SEPARADOS
    let effectiveStyleKey = styleKey;
    let effectiveCustomPrompt = customStylePrompt;

    if (workMode === 'auto') {
      // CAMINO 1: ANÁLISIS AUTOMÁTICO (URL)
      // PRIORIDAD 1: Usar estilo detectado automáticamente (detectedStyleKey)
      if (detectedStyleKey) {
        effectiveStyleKey = detectedStyleKey;
        console.log('🤖 CAMINO 1 - ANÁLISIS AUTOMÁTICO: Using detectedStyleKey:', effectiveStyleKey);
      }
      // PRIORIDAD 2: Solo usar customStylePrompt si existe (viene de análisis de URL)
      else if (customStylePrompt) {
        effectiveStyleKey = 'brand_identity';
        console.log('🤖 CAMINO 1 - ANÁLISIS AUTOMÁTICO: Using customStylePrompt:', customStylePrompt.substring(0, 50) + '...');
      } else {
        // Si no hay customStylePrompt, usar el styleKey seleccionado normalmente
        console.log('🤖 CAMINO 1 - ANÁLISIS AUTOMÁTICO: Using styleKey:', styleKey);
      }
    } else {
      // CAMINO 2: SELECCIÓN MANUAL (Texto + Modelo)
      // En modo manual, SIEMPRE usar el styleKey seleccionado y limpiar customStylePrompt
      effectiveCustomPrompt = undefined;
      console.log('🎨 CAMINO 2 - SELECCIÓN MANUAL: Using styleKey:', styleKey);
    }

    try {
      // 💰 DEDUCIR CRÉDITOS ANTES DE GENERAR
      // NOTA: product_study NO descuenta créditos porque usa la imagen subida por el usuario
      let creditDeducted = false;
      if (mediaType === 'image' || mediaType === 'story_art') {
        const creditType = imageQuality === 'draft' ? 'draft' : 'final_image';
        creditDeducted = await creditService.deductCredit(
          creditType,
          1,
          `Generación de ${imageQuality === 'draft' ? 'borrador' : 'imagen HD'}`,
          null
        );
        console.log(`💰 Crédito ${creditType} ${creditDeducted ? 'descontado' : 'NO descontado (sin créditos o error)'}`);
      } else if (mediaType === 'video') {
        creditDeducted = await creditService.deductCredit(
          'video',
          1,
          'Generación de video',
          null
        );
        console.log(`💰 Crédito video ${creditDeducted ? 'descontado' : 'NO descontado (sin créditos o error)'}`);
      } else {
        console.log(`💰 product_study - No se descuenta crédito (usa imagen subida por usuario)`);
      }

      progressAlert.updateProgress(20, 'Analizando contexto...');
      // Obtenemos ambos prompts: inglés para la IA, español para mostrar al usuario
      const { english: enhancedPrompt, spanish: spanishPrompt } = await enhancePrompt(description, effectiveStyleKey);
      setCurrentSpanishPrompt(spanishPrompt);
      
      // Si es product_study, usar la imagen subida directamente (ya mejorada)
      if (mediaType === 'product_study') {
        // La imagen ya está en productUrl (mejorada con IA)
        progressAlert.close();
        console.log('📸 product_study - Usando imagen subida por el usuario');
        return;
      } else if (mediaType === 'image' || mediaType === 'story_art') {
progressAlert.updateProgress(60, 'Renderizando...');
       console.log('🎨 Generating image with aspectRatio:', aspectRatio, '| mediaType:', mediaType);
       
       // NEW: Determinar si hay texto extraído automáticamente
       // SOLO usar overlayText si el usuario lo agregó manualmente, nunca el texto por defecto
       const autoExtractedText = userManuallyAddedText && overlayText.trim() ? overlayText : undefined;
       const autoTextStyle = userManuallyAddedText ? "modern and clean" : undefined;
       
       if (autoExtractedText) {
         console.log('🤖 USANDO TEXTO MANUAL DEL USUARIO:', autoExtractedText);
       }
       
       // NEW: Determinar artDirectionId para Story Art
       // Mapeo de FlyerStyleKey a industryId de Dirección de Arte
       let artDirectionId: number | undefined = undefined;
       
       if (mediaType === 'story_art') {
         // Mapeo COMPLETO de todos los 61 estilos definidos en types.ts a rubros de Dirección de Arte (1-60)
         // Este mapeo asegura que cada estilo use su Direction de Arte específica, evitando el default ID 1
         const styleToIndustryMap: Record<string, number> = {
           // === ESTILOS VENTAS Y COMERCIO ===
           'retail_sale': 1,        // Retail General
           'typo_bold': 1,          // Solo Texto → Retail
           'auto_metallic': 27,     // Automotriz
           'gastronomy': 22,        // Restaurantes

           // === ESTILOS CORPORATIVO ===
           'corporate': 33,         // Corporativo
           'medical_clean': 56,     // Médico/Clínica
           'tech_saas': 39,         // Tecnología
           'edu_sketch': 25,        // Educación
           'political_community': 33, // Político → Corporativo

           // === ESTILOS LIFESTYLE ===
           'aesthetic_min': 41,     // Belleza
           'wellness_zen': 24,      // Wellness/Spa
           'pilates': 24,           // Pilates → Wellness
           'summer_beach': 29,      // Viajes/Turismo
           'eco_organic': 51,       // Orgánico/Feria
           'sport_gritty': 40,      // Gimnasio/Deporte

           // === ESTILOS NOCHE ===
           'urban_night': 29,       // Viajes (discoteca) - usar Viajes para estética nocturna
           'luxury_gold': 55,       // Lujo
           'realestate_night': 26,  // Inmobiliaria Nocturna
           'gamer_stream': 13,      // Gaming
           'indie_grunge': 35,      // Entretención/Música

           // === ESTILOS EVENTOS ===
           'kids_fun': 30,          // Eventos Infantiles
           'worship_sky': 33,       // Iglesia → Corporativo
           'seasonal_holiday': 30,  // Festividades → Eventos
           'art_double_exp': 37,    // Fotografía/Arte
           'retro_vintage': 18,     // Regalos/Vintage
           'podcast_mic': 35,       // Entretención/Media

           // === ESTILOS NUEVOS 26-40 (2026) ===
           'mechanic_workshop': 27, // Taller Mecánico → Automotriz
           'tire_service': 27,      // Vulcanización → Automotriz
           'construction_site': 20, // Construcción → Electrodomésticos (ambos industriales)
           'logistics_delivery': 1, // Logística → Retail (distribución)
           'bakery_bread': 47,      // Panadería
           'liquor_store': 11,      // Botillería
           'fast_food_street': 46,  // Comida Rápida
           'barber_shop': 34,       // Barbería
           'veterinary_clinic': 59, // Veterinaria
           'hvac_plumbing': 20,     // Gasfitería → Construcción (técnico)
           'dental_clinic': 57,     // Dental
           'physiotherapy': 40,     // Kinesiología → Gimnasio (deporte/salud)
           'law_accounting': 31,    // Estudio Jurídico → Servicios Profesionales
           'gardening_landscaping': 17, // Jardinería → Decoración (hogar)
           'security_systems': 39,  // Seguridad → Tecnología

           // === ESTILOS NUEVOS 41-60 (2026) ===
           'sushi_nikkei': 22,      // Sushi → Restaurantes
           'pizzeria': 22,          // Pizzería → Restaurantes
           'ice_cream': 48,         // Heladería
           'nail_studio': 42,       // Uñas
           'tattoo_studio': 35,     // Tattoo → Entretención (arte urbano)
           'yoga_studio': 24,       // Yoga → Wellness
           'car_detailing': 27,     // Car Detailing → Automotriz
           'optical': 6,            // Óptica
           'bookstore': 16,         // Librería
           'flower_shop': 17,       // Florería → Decoración
           'transport_school': 1,   // Transporte Escolar → Retail (servicio local)
           'hardware_store': 20,    // Ferretería → Construcción
           'cleaning_service': 19,  // Limpieza
           'travel_agency': 29,     // Agencia de Viajes
           'laundry': 19,           // Lavandería → Limpieza
           'shoe_store': 1,         // Zapatería → Retail
           'tech_repair': 39,       // Servicio Técnico → Tecnología
           'pastry_shop': 47,       // Pastelería → Panadería

           // === ESTILOS ESPECIALES ===
           'brand_identity': 1,     // Identidad Detectada → Retail (default)
           'market_handwritten': 1, // Feria Libre → Retail (comercio local)

           // === ESTILOS VIDEO (mapeados a rubros equivalentes) ===
           'video_retail_sale': 1,
           'video_summer_beach': 29,
           'video_worship_sky': 33,
           'video_corporate': 33,
           'video_urban_night': 29,
           'video_gastronomy': 22,
           'video_sport_gritty': 40,
           'video_luxury_gold': 55,
           'video_aesthetic_min': 41,
           'video_retro_vintage': 18,
           'video_gamer_stream': 13,
           'video_eco_organic': 51,
           'video_indie_grunge': 35,
           'video_political': 33,
           'video_kids_fun': 30,
           'video_art_double_exp': 37,
           'video_medical_clean': 56,
           'video_tech_saas': 39,
           'video_typo_bold': 1,
           'video_realestate_night': 26,
           'video_auto_metallic': 27,
           'video_edu_sketch': 25,
           'video_wellness_zen': 24,
           'video_podcast_mic': 35,
           'video_seasonal_holiday': 30,
           'video_mechanic_action': 27,
           'video_tire_spin': 27,
           'video_construction_drone': 20,
           'video_logistic_flow': 1,
           'video_baking_rise': 47,
           'video_cooler_refresh': 11,
           'video_griddle_sizzle': 46,
           'video_barber_precision': 34,
           'video_pet_interaction': 59,
           'video_technical_fix': 20,
           'video_dental_tech': 57,
           'video_rehab_movement': 40,
           'video_corporate_handshake': 31,
           'video_lawn_transformation': 17,
           'video_surveillance_scan': 39,
           'video_sushi_prep': 22,
           'video_pizza_heat': 22,
           'video_ice_cream_drip': 48,
           'video_nail_shine': 42,
           'video_tattoo_ink': 35,
           'video_yoga_flow': 24,
           'video_foam_reveal': 27,
           'video_optic_focus': 6,
           'video_book_pan': 16,
           'video_flower_mist': 17,
           'video_bottle_glow': 11,
           'video_van_drive': 1,
           'video_tool_pick': 20,
           'video_market_fresh': 1,
           'video_cleaning_shine': 19,
           'video_globe_spin': 29,
           'video_steam_iron': 19,
           'video_shoe_walk': 1,
           'video_tech_micro': 39,
           'video_cake_slicing': 47,
         };
         
         // Usar detectedStyleKey o effectiveStyleKey como fallback
         const styleKeyToMap = detectedStyleKey || effectiveStyleKey;
         artDirectionId = styleToIndustryMap[styleKeyToMap] || 1; // Default a Retail General
         
         console.log(`🎨 [Story Art] Mapeando styleKey "${styleKeyToMap}" a industryId: ${artDirectionId}`);
         console.log(`📋 [Story Art] Modo: ${mediaType} | artDirectionId: ${artDirectionId}`);
       }
       
       const result = await generateFlyerImage(
         enhancedPrompt,
         effectiveStyleKey,
         aspectRatio,
         imageQuality,
         newSeed,
         effectiveCustomPrompt,
         hasProductOverlay,
         true, // enableIntelligentTextStyles
         autoExtractedText,
         autoTextStyle,
         undefined, // draftImageForHD
         artDirectionId, // NEW: artDirectionId para Story Art (1-60)
         undefined, // storyArtStyleId
         realityLevel // 🎚️ Pasar nivel de realidad (1.5 por defecto)
       );
        console.log('✅ Image generated:', result.imageDataUrl?.substring(0, 50) + '...');
        console.log('🎨 Análisis completo:', {
          imageAnalysis: result.imageAnalysis ? 'Disponible' : 'No disponible',
          contextualTypography: result.contextualTypography ? 'Disponible' : 'No disponible',
          contrastAnalysis: result.contrastAnalysis ? 'Disponible' : 'No disponible',
          contextualEffects: result.contextualEffects ? 'Disponible' : 'No disponible',
          compositionAnalysis: result.compositionAnalysis ? 'Disponible' : 'No disponible',
          autoTextValidation: result.autoTextValidation ? 'Disponible' : 'No disponible',
          enhancedStyles: result.enhancedStyles ? 'Disponible' : 'No disponible'
        });
        setImageUrl(result.imageDataUrl);
        setDraftImageUrl(result.imageDataUrl);
        
        // 🎯 GUARDAR IMAGEN ORIGINAL EN CACHÉ DE REALITY para comparación
        // La imagen base (1.5★) siempre debe estar disponible para comparar
        const originalLevel: RealityLevel = 1.5;
        setRealityVariations(prev => ({
          ...prev,
          [originalLevel]: result.imageDataUrl
        }));
        
        // También guardar en localStorage con sceneId para persistencia entre sesiones
        if (sceneId) {
          saveVariationToCache(sceneId, {
            id: `var_original_${Date.now()}`,
            parent_scene_id: sceneId,
            seed: newSeed,
            stars: originalLevel,
            image_url: result.imageDataUrl,
            prompt_used: enhancedPrompt,
            created_at: new Date(),
            cached: true
          });
        }
        
        // NEW: Guardar generación en base de datos (image y story_art)
        if (imageQuality === 'draft' && (mediaType === 'image' || mediaType === 'story_art')) {
          const generation = await createGeneration({
            userId: (await supabase.auth.getSession()).data.session?.user.id || '',
            draftImageUrl: result.imageDataUrl,
            prompt: enhancedPrompt, // Guardar el prompt en inglés para la IA
            styleKey: effectiveStyleKey,
            aspectRatio,
            seed: newSeed
          });
          
          if (generation) {
            setCurrentGenerationId(generation.id);
            setCurrentGeneration(generation);
            console.log('✅ Generación guardada con ID:', generation.id);
          }
        }
        setIntelligentTextStyles(result.intelligentTextStyles);
        setImageAnalysis(result.imageAnalysis);
        setContextualTypography(result.contextualTypography);
        setContrastAnalysis(result.contrastAnalysis);
        setContextualEffects(result.contextualEffects);
        setCompositionAnalysis(result.compositionAnalysis);
        setAutoTextValidation(result.autoTextValidation);
        setEnhancedStyles(result.enhancedStyles);
        setIsDraft(imageQuality === 'draft');
        
        // 🎚️ INICIALIZAR sceneId PARA REALITY SLIDER - useEffect separado
        // Esto garantiza que sceneId se setee cada vez que se genera una imagen
      } else {
        // ✅ GENERACIÓN DE VIDEO CON ALIBABA CLOUD TEXT-TO-VIDEO (T2V)
        const effectiveVideoStyleKey = videoStyleKey || 'video_retail_sale';
progressAlert.updateProgress(60, 'Renderizando...');
        console.log('🎬 Generating video with aspectRatio:', aspectRatio, '| videoStyleKey:', effectiveVideoStyleKey);
        
        // Importar el servicio de video
        const { generateVideoAndWait } = await import('./services/vertexVideoService');
        
        try {
          // TEXT-TO-VIDEO: Generar video directamente desde prompt (sin imagen base)
          console.log('🎬 Generando video con Alibaba Cloud TEXT-TO-VIDEO...');
progressAlert.updateProgress(60, 'Renderizando...');
          
          // IMPORTANTE: Remover cualquier mención de texto del prompt para videos
          // Los videos NO deben tener texto superpuesto (se agrega después en la UI)
          const videoPrompt = enhancedPrompt
            .replace(/with text[^.]*\./gi, '.')
            .replace(/text overlay[^.]*\./gi, '.')
            .replace(/typography[^.]*\./gi, '.')
            .replace(/words[^.]*\./gi, '.')
            .replace(/letters[^.]*\./gi, '.')
            .replace(/font[^.]*\./gi, '.')
            .replace(/headline[^.]*\./gi, '.')
            .replace(/title[^.]*\./gi, '.')
            .replace(/caption[^.]*\./gi, '.')
            .replace(/\s+/g, ' ')
            .trim();
          
          console.log('📝 [Video] Prompt original length:', enhancedPrompt.length);
          console.log('📝 [Video] Prompt sin texto length:', videoPrompt.length);
          
          const videoUrl = await generateVideoAndWait(
            {
              prompt: videoPrompt, // ← Usar prompt sin texto
              // ← NO requiere imageUrl (T2V genera directamente desde prompt)
              quality: imageQuality === 'draft' ? 'draft' : 'hd', // ← 'draft' (480P) o 'hd' (720P)
              aspectRatio: aspectRatio as '9:16' | '16:9' | '1:1',
              duration: 5 // 5 segundos por defecto
            },
            (progress, message) => {
progressAlert.updateProgress(60, 'Renderizando...');
            }
          );
          
          console.log('✅ Video generado:', videoUrl.substring(0, 100) + '...');
          
          // Establecer el video generado
          setImageUrl(videoUrl);
          
          if (imageQuality === 'draft') {
            setDraftVideoUrl(videoUrl);
          } else {
            setHdVideoUrl(videoUrl);
          }
          
          setIsDraft(imageQuality === 'draft');
          
          // Mostrar mensaje de éxito
          estudioAlerts.success('Video generado', 'Video generado exitosamente. Nota: La URL expira en 24 horas.');
          
        } catch (videoError: any) {
          console.error('❌ Error generando video:', videoError);
          
          // Fallback: Generar imagen estática si falla el video
          console.log('⚠️ Fallback: Generando imagen estática');
          const videoSeed = Math.floor(Math.random() * 2000000000);
          const imageResult = await generateFlyerImage(
            enhancedPrompt,
            effectiveVideoStyleKey,
            aspectRatio,
            'draft',
            videoSeed,
            undefined,
            hasProductOverlay,
            false,
            undefined,
            undefined
          );
          
          setImageUrl(imageResult.imageDataUrl);
          if (imageQuality === 'draft') {
            setDraftVideoImageUrl(imageResult.imageDataUrl);
          }
          setIsDraft(imageQuality === 'draft');
          
          estudioAlerts.warning(`No se pudo generar el video: ${videoError.message}. Se generó una imagen estática.`);
        }
      }
      progressAlert.updateProgress(100, '¡Completado!');
      setTimeout(() => progressAlert.close(), 500);
      console.log('🎉 Generation completed successfully');
    } catch (error: any) {
      console.error('❌ Generation failed:', error);
      progressAlert.close();
      handleError(error);
    }
  };

  const handleUpgradeToHD = async () => {
    if (!currentSpanishPrompt) return;
    
    // ═══════════════════════════════════════════════════════════════
    // 🔍 DIAGNÓSTICO HD - Verificar estado antes de generar
    // ═══════════════════════════════════════════════════════════════
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🔍 DIAGNÓSTICO HD - Estado antes de generar');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📸 Draft URL disponible:', !!draftImageUrl);
    console.log('📸 Draft URL type:', typeof draftImageUrl);
    console.log('📸 Draft URL length:', draftImageUrl?.length || 0);
    console.log('📸 Draft URL prefix:', draftImageUrl?.substring(0, 100) || 'N/A');
    console.log('📸 Draft URL es data URL:', draftImageUrl?.startsWith('data:') || false);
    console.log('🔑 fal.ai configurado:', isFalAiConfigured());
    console.log('🎨 Style key:', styleKey);
    console.log('📐 Aspect ratio:', aspectRatio);
    console.log('🎲 Seed:', seed);
    console.log('🎬 Media type:', mediaType);
    console.log('📝 Prompt español:', currentSpanishPrompt.substring(0, 100) + '...');
    console.log('═══════════════════════════════════════════════════════════════');
    
    // Cerrar Comparador de Realismos si está abierto
    if (showRealityComparator) {
      setShowRealityComparator(false);
    }
    
    const hasProductOverlay = !!productUrl;
    
    // Mostrar alerta de progreso HD
    const progressAlert = estudioAlerts.progress('Iniciando generación HD...');
    try {
        // 💰 DEDUCIR CRÉDITO PARA HD
        const creditDeducted = await creditService.deductCredit(
          'final_image',
          1,
          'Mejora a imagen HD',
          currentGenerationId || null
        );
        console.log(`💰 Crédito final_image ${creditDeducted ? 'descontado' : 'NO descontado (sin créditos o error)'}`);

        progressAlert.updateProgress(20, 'Preparando prompt...');
        let url;
        // story_art se maneja igual que image para el upgrade HD
        if (mediaType === 'image' || mediaType === 'story_art') {
            // NEW: Determinar artDirectionId para Story Art (mismo mapeo que en handleGenerate)
            let upgradeArtDirectionId: number | undefined = undefined;
            if (mediaType === 'story_art') {
              // Mapeo completo (igual que en handleGenerate)
              // Mapeo COMPLETO de todos los 61 estilos (igual que en handleGenerate)
              const styleToIndustryMap: Record<string, number> = {
                // === ESTILOS VENTAS Y COMERCIO ===
                'retail_sale': 1, 'typo_bold': 1, 'auto_metallic': 27, 'gastronomy': 22,
                // === ESTILOS CORPORATIVO ===
                'corporate': 33, 'medical_clean': 56, 'tech_saas': 39, 'edu_sketch': 25, 'political_community': 33,
                // === ESTILOS LIFESTYLE ===
                'aesthetic_min': 41, 'wellness_zen': 24, 'pilates': 24, 'summer_beach': 29, 'eco_organic': 51, 'sport_gritty': 40,
                // === ESTILOS NOCHE ===
                'urban_night': 29, 'luxury_gold': 55, 'realestate_night': 26, 'gamer_stream': 13, 'indie_grunge': 35,
                // === ESTILOS EVENTOS ===
                'kids_fun': 30, 'worship_sky': 33, 'seasonal_holiday': 30, 'art_double_exp': 37, 'retro_vintage': 18, 'podcast_mic': 35,
                // === ESTILOS NUEVOS 26-40 (2026) ===
                'mechanic_workshop': 27, 'tire_service': 27, 'construction_site': 20, 'logistics_delivery': 1,
                'bakery_bread': 47, 'liquor_store': 11, 'fast_food_street': 46, 'barber_shop': 34, 'veterinary_clinic': 59,
                'hvac_plumbing': 20, 'dental_clinic': 57, 'physiotherapy': 40, 'law_accounting': 31, 'gardening_landscaping': 17,
                'security_systems': 39,
                // === ESTILOS NUEVOS 41-60 (2026) ===
                'sushi_nikkei': 22, 'pizzeria': 22, 'ice_cream': 48, 'nail_studio': 42, 'tattoo_studio': 35,
                'yoga_studio': 24, 'car_detailing': 27, 'optical': 6, 'bookstore': 16, 'flower_shop': 17,
                'transport_school': 1, 'hardware_store': 20, 'cleaning_service': 19, 'travel_agency': 29,
                'laundry': 19, 'shoe_store': 1, 'tech_repair': 39, 'pastry_shop': 47,
                // === ESTILOS ESPECIALES ===
                'brand_identity': 1, 'market_handwritten': 1,
                // === ESTILOS VIDEO (mapeados a rubros equivalentes) ===
                'video_retail_sale': 1, 'video_summer_beach': 29, 'video_worship_sky': 33, 'video_corporate': 33,
                'video_urban_night': 29, 'video_gastronomy': 22, 'video_sport_gritty': 40, 'video_luxury_gold': 55,
                'video_aesthetic_min': 41, 'video_retro_vintage': 18, 'video_gamer_stream': 13, 'video_eco_organic': 51,
                'video_indie_grunge': 35, 'video_political': 33, 'video_kids_fun': 30, 'video_art_double_exp': 37,
                'video_medical_clean': 56, 'video_tech_saas': 39, 'video_typo_bold': 1, 'video_realestate_night': 26,
                'video_auto_metallic': 27, 'video_edu_sketch': 25, 'video_wellness_zen': 24, 'video_podcast_mic': 35,
                'video_seasonal_holiday': 30, 'video_mechanic_action': 27, 'video_tire_spin': 27, 'video_construction_drone': 20,
                'video_logistic_flow': 1, 'video_baking_rise': 47, 'video_cooler_refresh': 11, 'video_griddle_sizzle': 46,
                'video_barber_precision': 34, 'video_pet_interaction': 59, 'video_technical_fix': 20, 'video_dental_tech': 57,
                'video_rehab_movement': 40, 'video_corporate_handshake': 31, 'video_lawn_transformation': 17,
                'video_surveillance_scan': 39, 'video_sushi_prep': 22, 'video_pizza_heat': 22, 'video_ice_cream_drip': 48,
                'video_nail_shine': 42, 'video_tattoo_ink': 35, 'video_yoga_flow': 24, 'video_foam_reveal': 27,
                'video_optic_focus': 6, 'video_book_pan': 16, 'video_flower_mist': 17, 'video_bottle_glow': 11,
                'video_van_drive': 1, 'video_tool_pick': 20, 'video_market_fresh': 1, 'video_cleaning_shine': 19,
                'video_globe_spin': 29, 'video_steam_iron': 19, 'video_shoe_walk': 1, 'video_tech_micro': 39,
                'video_cake_slicing': 47,
                // === ESTILOS ADICIONALES (fashion, etc.) ===
                'fashion_trendy': 2, 'fashion_elegant': 3, 'fashion_sport': 4, 'electronics': 5, 'home_deco': 6,
                'jewelry': 7, 'optics': 8, 'pharmacy': 9, 'supermarket': 10, 'pet_shop': 12, 'gaming': 13,
                'sports': 14, 'toys': 15, 'books': 16, 'florist': 17, 'gifts': 18, 'cleaning': 19,
                'construction': 20, 'coffee_shop': 23, 'education': 25, 'realestate': 26, 'automotive': 27,
                'health': 28, 'travel': 29, 'events': 30, 'professional': 31, 'financial': 32,
                'barbershop': 34, 'entertainment': 35, 'music': 36, 'photography': 37, 'creative': 38,
                'tech': 39, 'sports_gym': 40, 'beauty': 41, 'nails': 42, 'makeup': 43, 'barber': 44,
                'spa': 45, 'fastfood': 46, 'bakery': 47, 'icecream': 48, 'bbq': 49, 'seafood': 50,
                'organic': 51, 'grocery': 52, 'wine': 53, 'brewery': 54, 'luxury': 55,
                'medical': 56, 'dental': 57, 'optometrist': 58, 'veterinary': 59, 'holistic': 60
              };
              const styleKeyToMap = detectedStyleKey || styleKey;
              upgradeArtDirectionId = styleToIndustryMap[styleKeyToMap] || 1;
              console.log(`🎨 [Story Art HD] industryId: ${upgradeArtDirectionId}`);
            }
            
            // 🎯 CRÍTICO: Usar análisis detallado del borrador para mantener similitud
            // El prompt debe describir exactamente lo que hay en el borrador
            console.log('🔍 [HD] Analizando borrador antes de generar HD...');
            console.log('📸 [HD] Draft URL length:', draftImageUrl?.length || 0);
            console.log('📸 [HD] Draft URL disponible:', !!draftImageUrl);
            
            // Prompt que será enriquecido por geminiService con análisis del borrador
            const hdPrompt = `High quality professional photograph. Maintain exact composition, colors, lighting, and subject placement. Improve only: sharpness, detail, texture quality.`;
            
            console.log('📝 [HD] Enviando a generateFlyerImage con draftImageForHD');
            console.log('📝 [HD] Prompt HD:', hdPrompt);
            console.log('📝 [HD] Seed:', seed);
            console.log('📝 [HD] Draft image será analizado por Gemini Vision');
            
            // Usar el borrador como referencia para Image-to-Image
            // geminiService.ts se encargará de analizar el borrador con Gemini Vision
            const result = await generateFlyerImage(
              hdPrompt, // Prompt simple - será enriquecido con análisis del borrador
              styleKey,
              aspectRatio,
              'hd',
              seed,
              customStylePrompt,
              hasProductOverlay,
              true, // enableIntelligentTextStyles
              undefined, // No pasar texto automático para HD
              undefined, // No pasar estilo de texto
              draftImageUrl || undefined, // CRÍTICO: Pasar borrador para Image-to-Image
              upgradeArtDirectionId // NEW: artDirectionId para Story Art
            );
            url = result.imageDataUrl;
            progressAlert.updateProgress(70, 'Renderizando imagen HD...');
            setIntelligentTextStyles(result.intelligentTextStyles);
            setImageAnalysis(result.imageAnalysis);
            setContextualTypography(result.contextualTypography);
            setContrastAnalysis(result.contrastAnalysis);
            setContextualEffects(result.contextualEffects);
            setCompositionAnalysis(result.compositionAnalysis);
            setAutoTextValidation(result.autoTextValidation);
            setEnhancedStyles(result.enhancedStyles);
            
            // NEW: Actualizar generación con imagen HD
            if (currentGenerationId) {
              const userId = (await supabase.auth.getSession()).data.session?.user.id || '';
              const success = await updateGenerationToHD(currentGenerationId, url, userId);
              if (success) {
                // Recargar la generación actualizada
                const updated = await getGenerationById(currentGenerationId);
                if (updated) {
                  setCurrentGeneration(updated);
                }
                console.log('✅ Generación HD actualizada con ID:', currentGenerationId);
              }
            }
      } else {
          // ✅ CORREGIDO: Video generation disabled - usar imagen base
            console.log('⚠️ Generación de video HD deshabilitada, usando imagen base');
            const { english: enhancedPrompt } = await enhancePrompt(description, videoStyleKey);
            const hdImageResult = await generateFlyerImage(
              enhancedPrompt,
              videoStyleKey,
              aspectRatio,
              'hd',
              seed,
              undefined,
              hasProductOverlay,
              false
            );
            url = hdImageResult.imageDataUrl;
        }
        
        // 🎯 CERRAR ALERTA DE PROGRESO DESPUÉS DE SETEAR hdImageUrl
        // Esto permite que el comparador Draft vs HD se renderice primero
        setImageUrl(url);
        setHdImageUrl(url);
        setIsDraft(false);
        
        // 🔧 CERRAR ALERTA CON DELAY PARA QUE EL COMPARADOR SE RENDERICE PRIMERO
        // El comparador se abre automáticamente en FlyerDisplay cuando hdImageUrl cambia
        // Necesitamos dar tiempo a React para renderizar el comparador antes de cerrar la alerta
        setTimeout(() => {
          progressAlert.close();
          console.log('🔒 Alerta de loading cerrada - comparador HD visible');
        }, 100);
    } catch (error: any) {
        progressAlert.close();
        handleError(error);
    }
  };

  const handleRefine = async (instruction: string) => {
    if (!currentSpanishPrompt || !imageUrl) return;
    const hasProductOverlay = !!productUrl;
    
    // Mostrar alerta de progreso Refine (declarar fuera del try para que esté disponible en catch)
    const progressAlert = estudioAlerts.progress('Refinando imagen...');
    
    try {
      progressAlert.updateProgress(20, 'Analizando prompt...');
      // Para refinar necesitamos el prompt en inglés original, lo regeneramos
      const { english: enhancedPrompt } = await enhancePrompt(description, styleKey);
      const newPrompt = await refineDescription(enhancedPrompt, instruction);
      const qualityToUse = isDraft ? 'draft' : 'hd';
      
      progressAlert.updateProgress(60, 'Renderizando imagen...');

      let url;
      if (mediaType === 'image' || mediaType === 'story_art') {
         // NEW: Pasar texto automático también en refine
         const autoExtractedText = workMode === 'auto' && overlayText.trim() ? overlayText : undefined;
         const autoTextStyle = workMode === 'auto' ? "modern and clean" : undefined;
         
         // NEW: Determinar artDirectionId para Story Art (mismo mapeo que en handleGenerate)
         let refineArtDirectionId: number | undefined = undefined;
         if (mediaType === 'story_art') {
           // Mapeo COMPLETO de todos los 61 estilos (igual que en handleGenerate)
           const styleToIndustryMap: Record<string, number> = {
             // === ESTILOS VENTAS Y COMERCIO ===
             'retail_sale': 1, 'typo_bold': 1, 'auto_metallic': 27, 'gastronomy': 22,
             // === ESTILOS CORPORATIVO ===
             'corporate': 33, 'medical_clean': 56, 'tech_saas': 39, 'edu_sketch': 25, 'political_community': 33,
             // === ESTILOS LIFESTYLE ===
             'aesthetic_min': 41, 'wellness_zen': 24, 'pilates': 24, 'summer_beach': 29, 'eco_organic': 51, 'sport_gritty': 40,
             // === ESTILOS NOCHE ===
             'urban_night': 29, 'luxury_gold': 55, 'realestate_night': 26, 'gamer_stream': 13, 'indie_grunge': 35,
             // === ESTILOS EVENTOS ===
             'kids_fun': 30, 'worship_sky': 33, 'seasonal_holiday': 30, 'art_double_exp': 37, 'retro_vintage': 18, 'podcast_mic': 35,
             // === ESTILOS NUEVOS 26-40 (2026) ===
             'mechanic_workshop': 27, 'tire_service': 27, 'construction_site': 20, 'logistics_delivery': 1,
             'bakery_bread': 47, 'liquor_store': 11, 'fast_food_street': 46, 'barber_shop': 34, 'veterinary_clinic': 59,
             'hvac_plumbing': 20, 'dental_clinic': 57, 'physiotherapy': 40, 'law_accounting': 31, 'gardening_landscaping': 17,
             'security_systems': 39,
             // === ESTILOS NUEVOS 41-60 (2026) ===
             'sushi_nikkei': 22, 'pizzeria': 22, 'ice_cream': 48, 'nail_studio': 42, 'tattoo_studio': 35,
             'yoga_studio': 24, 'car_detailing': 27, 'optical': 6, 'bookstore': 16, 'flower_shop': 17,
             'transport_school': 1, 'hardware_store': 20, 'cleaning_service': 19, 'travel_agency': 29,
             'laundry': 19, 'shoe_store': 1, 'tech_repair': 39, 'pastry_shop': 47,
             // === ESTILOS ESPECIALES ===
             'brand_identity': 1, 'market_handwritten': 1,
             // === ESTILOS VIDEO (mapeados a rubros equivalentes) ===
             'video_retail_sale': 1, 'video_summer_beach': 29, 'video_worship_sky': 33, 'video_corporate': 33,
             'video_urban_night': 29, 'video_gastronomy': 22, 'video_sport_gritty': 40, 'video_luxury_gold': 55,
             'video_aesthetic_min': 41, 'video_retro_vintage': 18, 'video_gamer_stream': 13, 'video_eco_organic': 51,
             'video_indie_grunge': 35, 'video_political': 33, 'video_kids_fun': 30, 'video_art_double_exp': 37,
             'video_medical_clean': 56, 'video_tech_saas': 39, 'video_typo_bold': 1, 'video_realestate_night': 26,
             'video_auto_metallic': 27, 'video_edu_sketch': 25, 'video_wellness_zen': 24, 'video_podcast_mic': 35,
             'video_seasonal_holiday': 30, 'video_mechanic_action': 27, 'video_tire_spin': 27, 'video_construction_drone': 20,
             'video_logistic_flow': 1, 'video_baking_rise': 47, 'video_cooler_refresh': 11, 'video_griddle_sizzle': 46,
             'video_barber_precision': 34, 'video_pet_interaction': 59, 'video_technical_fix': 20, 'video_dental_tech': 57,
             'video_rehab_movement': 40, 'video_corporate_handshake': 31, 'video_lawn_transformation': 17,
             'video_surveillance_scan': 39, 'video_sushi_prep': 22, 'video_pizza_heat': 22, 'video_ice_cream_drip': 48,
             'video_nail_shine': 42, 'video_tattoo_ink': 35, 'video_yoga_flow': 24, 'video_foam_reveal': 27,
             'video_optic_focus': 6, 'video_book_pan': 16, 'video_flower_mist': 17, 'video_bottle_glow': 11,
             'video_van_drive': 1, 'video_tool_pick': 20, 'video_market_fresh': 1, 'video_cleaning_shine': 19,
             'video_globe_spin': 29, 'video_steam_iron': 19, 'video_shoe_walk': 1, 'video_tech_micro': 39,
             'video_cake_slicing': 47,
             // === ESTILOS ADICIONALES (fashion, etc.) ===
             'fashion_trendy': 2, 'fashion_elegant': 3, 'fashion_sport': 4, 'electronics': 5, 'home_deco': 6,
             'jewelry': 7, 'optics': 8, 'pharmacy': 9, 'supermarket': 10, 'pet_shop': 12, 'gaming': 13,
             'sports': 14, 'toys': 15, 'books': 16, 'florist': 17, 'gifts': 18, 'cleaning': 19,
             'construction': 20, 'coffee_shop': 23, 'education': 25, 'realestate': 26, 'automotive': 27,
             'health': 28, 'travel': 29, 'events': 30, 'professional': 31, 'financial': 32,
             'barbershop': 34, 'entertainment': 35, 'music': 36, 'photography': 37, 'creative': 38,
             'tech': 39, 'sports_gym': 40, 'beauty': 41, 'nails': 42, 'makeup': 43, 'barber': 44,
             'spa': 45, 'fastfood': 46, 'bakery': 47, 'icecream': 48, 'bbq': 49, 'seafood': 50,
             'organic': 51, 'grocery': 52, 'wine': 53, 'brewery': 54, 'luxury': 55,
             'medical': 56, 'dental': 57, 'optometrist': 58, 'veterinary': 59, 'holistic': 60
           };
           const styleKeyToMap = detectedStyleKey || styleKey;
           refineArtDirectionId = styleToIndustryMap[styleKeyToMap] || 1;
           console.log(`🎨 [Story Art Refine] industryId: ${refineArtDirectionId}`);
         }
         
         const result = await generateFlyerImage(
           newPrompt,
           styleKey,
           aspectRatio,
           qualityToUse,
           seed,
           customStylePrompt,
           hasProductOverlay,
           true, // enableIntelligentTextStyles
           autoExtractedText,
           autoTextStyle,
           undefined, // draftImageForHD
           refineArtDirectionId // NEW: artDirectionId para Story Art
         );
         url = result.imageDataUrl;
         setIntelligentTextStyles(result.intelligentTextStyles);
         setImageAnalysis(result.imageAnalysis);
         setContextualTypography(result.contextualTypography);
         setContrastAnalysis(result.contrastAnalysis);
         setContextualEffects(result.contextualEffects);
         setCompositionAnalysis(result.compositionAnalysis);
         setAutoTextValidation(result.autoTextValidation);
         setEnhancedStyles(result.enhancedStyles);
      } else {
         // ✅ CORREGIDO: Usar videoStyleKey para refine de video
         const refineSeed = Math.floor(Math.random() * 2000000000);
         const refineImageResult = await generateFlyerImage(
           newPrompt,
           videoStyleKey,
           aspectRatio,
           'draft',
           refineSeed,
           undefined,
           hasProductOverlay,
           false
         );
         url = refineImageResult.imageDataUrl;
      }
      setImageUrl(url);
      progressAlert.updateProgress(100, '¡Completado!');
      
      // Cerrar alerta automáticamente
      setTimeout(() => {
        progressAlert.close();
      }, 500);
    } catch (error: any) {
      progressAlert.close();
      handleError(error);
    }
  };

  const handleError = (error: any) => {
    if (error.message && (error.message.includes('permission denied') || error.message.includes('403'))) {
      setStatus({ isLoading: false, step: 'error', message: 'Error de autenticación' });
      setHasKey(false);
      alert('Tu sesión expiró. Conecta nuevamente.');
    } else {
      setStatus({ isLoading: false, step: 'error', message: 'Error del sistema' });
      alert('Error al generar. Intenta de nuevo.');
    }
  };

  // 🎚️ REALITY SLIDER HANDLER - Maneja cambios en el nivel de realidad
  // MEJORADO: Usa imagen de referencia + artDirectionId para consistencia visual al 100%
  // ARQUITECTURA: Las variaciones de realidad se guardan en realityImageUrl, NO en hdImageUrl
  const handleRealityChange = async (newLevel: number) => {
    console.log('🎚️ Reality Slider cambiado a:', newLevel);
    
    // ✅ CORRECCIÓN: Verificar lock de generación para evitar race conditions
    if (generationLockRef.current) {
      console.log('⏳ [Reality] Generación en progreso, ignorando cambio rápido');
      return;
    }
    
    // Si es el mismo nivel, no hacer nada
    if (newLevel === realityLevel) return;
    
    const levelKey = Math.round(newLevel * 2) / 2; // Redondear a 0.5
    
    // 1. VERIFICAR CACHÉ PRIMERO
    if (realityVariations[levelKey]) {
      console.log('✅ Variación encontrada en caché:', levelKey);
      setImageUrl(realityVariations[levelKey]);
      // 🎯 GUARDAR EN realityImageUrl - NO en hdImageUrl para evitar comparación automática
      setRealityImageUrl(realityVariations[levelKey]);
      setRealityLevel(levelKey);
      
      // 🔧 CERRAR ALERTA DE LOADING SI EXISTE (cuando viene de caché)
      // Esto es crítico: la alerta se mostró en handleRealityGenerationStart
      // antes de llamar a handleRealityChange, así que debemos cerrarla aquí
      if (realityLoadingSwalRef.current) {
        console.log('🔒 Cerrando alerta de loading (imagen en caché)');
        realityLoadingSwalRef.current.close();
        realityLoadingSwalRef.current = null;
      }
      return;
    }
    
    // 2. SIEMPRE ASEGURAR QUE LA IMAGEN ORIGINAL ESTÉ EN CACHÉ
    const originalLevel = 1.5;
    if (draftImageUrl) {
      // Guardar siempre, sobrescribiendo si es necesario para asegurar sincronización
      // ✅ CORRECCIÓN: Eliminar verificación de sceneId que causaba que no se guardara
      setRealityVariations(prev => ({
        ...prev,
        [originalLevel]: draftImageUrl
      }));
      console.log('💾 Imagen original (2.5★) guardada en caché de realidad');
    }
    
    // 2. SI NO ESTÁ EN CACHÉ, GENERAR NUEVA VARIACIÓN CON REFERENCIA
    console.log('🔄 Generando nueva variación para nivel:', levelKey);
    
    // ✅ CORRECCIÓN: Adquirir lock antes de generar
    generationLockRef.current = true;
    setIsGeneratingReality(true);
    setIsRealityVariation(true); // Indicar que es una variación de realidad
    setRealityGenerationMessage(`🎚️ Generando imagen con realismo ${levelKey}★...`);
    setRealityLevel(levelKey);
    
    try {
      // Obtener configuración de realidad para este nivel
      const realityLevelTyped = levelKey as any;
      const realityConfig = getRealityConfig(realityLevelTyped);
      const realityLabel = getRealityLabel(realityLevelTyped);
      const realityCategory = getRealityCategory(realityLevelTyped);
      
      console.log('🎨 Configuración de realidad:', { level: levelKey, label: realityLabel, category: realityCategory });
      
      // 🎯 NUEVA LÓGICA: Construir prompt de fuerza con prefijo MODE
      const { english: enhancedPrompt } = await enhancePrompt(description, styleKey);
      const realityPrompt = buildPowerPromptWithReality(enhancedPrompt, realityLevelTyped);
      
      // ✅ CORRECCIÓN CRÍTICA: Si nivel < 3.0, descartamos la imagen de referencia
      // para forzar Text-to-Image puro y evitar que la IA herede el "look profesional"
      const useReference = shouldUseReferenceImage(realityLevelTyped);
      const referenceImage = useReference ? (draftImageUrl || undefined) : undefined;
      
      if (!useReference) {
        console.log('🎚️ [Reality] Nivel < 3.0 - Descartando imagen de referencia para forzar Text-to-Image puro');
      }
      if (!referenceImage && useReference) {
        console.warn('⚠️ [Reality] No hay imagen de referencia, la calidad puede variar');
      }
      
      // Determinar artDirectionId para mantener la Dirección de Arte
      // Usamos el mismo mapeo que en handleGenerate para consistencia
      let artDirectionId: number | undefined = undefined;
      if (mediaType === 'story_art') {
        const styleToIndustryMap: Record<string, number> = {
          'retail_sale': 1, 'typo_bold': 1, 'auto_metallic': 27, 'gastronomy': 22,
          'corporate': 33, 'medical_clean': 56, 'tech_saas': 39, 'edu_sketch': 25, 'political_community': 33,
          'aesthetic_min': 41, 'wellness_zen': 24, 'pilates': 24, 'summer_beach': 29, 'eco_organic': 51, 'sport_gritty': 40,
          'urban_night': 29, 'luxury_gold': 55, 'realestate_night': 26, 'gamer_stream': 13, 'indie_grunge': 35,
          'kids_fun': 30, 'worship_sky': 33, 'seasonal_holiday': 30, 'art_double_exp': 37, 'retro_vintage': 18, 'podcast_mic': 35,
          'mechanic_workshop': 27, 'tire_service': 27, 'construction_site': 20, 'logistics_delivery': 1,
          'bakery_bread': 47, 'liquor_store': 11, 'fast_food_street': 46, 'barber_shop': 34, 'veterinary_clinic': 59,
          'hvac_plumbing': 20, 'dental_clinic': 57, 'physiotherapy': 40, 'law_accounting': 31, 'gardening_landscaping': 17,
          'security_systems': 39, 'sushi_nikkei': 22, 'pizzeria': 22, 'ice_cream': 48, 'nail_studio': 42, 'tattoo_studio': 35,
          'yoga_studio': 24, 'car_detailing': 27, 'optical': 6, 'bookstore': 16, 'flower_shop': 17,
          'transport_school': 1, 'hardware_store': 20, 'cleaning_service': 19, 'travel_agency': 29,
          'laundry': 19, 'shoe_store': 1, 'tech_repair': 39, 'pastry_shop': 47,
          'brand_identity': 1, 'market_handwritten': 1
        };
        const styleKeyToMap = detectedStyleKey || styleKey;
        artDirectionId = styleToIndustryMap[styleKeyToMap] || 1;
        console.log(`🎨 [Reality] ArtDirectionId preservado: ${artDirectionId}`);
      }
      
      const result = await generateFlyerImage(
        realityPrompt,
        styleKey,
        aspectRatio,
        'draft',
        seed, // 🔐 BLOQUEO DE SEMILLA para consistencia visual
        customStylePrompt,
        !!productUrl,
        true,
        workMode === 'auto' && overlayText.trim() ? overlayText : undefined,
        workMode === 'auto' ? "modern and clean" : undefined,
        referenceImage || undefined, // 🖼️ IMAGEN DE REFERENCIA para transformación controlada
        artDirectionId // 🎨 DIRECCIÓN DE ARTE preservada
      );
      
      if (result.imageDataUrl) {
        // Guardar en caché local y en localStorage
        const levelKeyTyped: RealityLevel = levelKey as RealityLevel;
        setRealityVariations(prev => ({
          ...prev,
          [levelKeyTyped]: result.imageDataUrl
        }));
        
        // Guardar en localStorage con sceneId explícito
        if (sceneId) {
          saveVariationToCache(sceneId, {
            id: `var_${levelKey}_${Date.now()}`,
            parent_scene_id: sceneId,
            seed: seed,
            stars: levelKeyTyped,
            image_url: result.imageDataUrl,
            prompt_used: realityPrompt,
            created_at: new Date(),
            cached: true
          });
        }
        
        // Actualizar imagen mostrada
        setImageUrl(result.imageDataUrl);
        // 🎯 GUARDAR EN realityImageUrl - NO en hdImageUrl para evitar comparación automática
        setRealityImageUrl(result.imageDataUrl);
        
        // SceneId ya fue inicializado en handleGenerate, no es necesario setearlo aquí
        
        console.log('✅ Nueva variación generada y guardada en caché:', levelKey);
        setRealityGenerationMessage(`✅ Imagen ${levelKey}★ generada exitosamente`);
        // Ocultar el mensaje después de 2 segundos
        setTimeout(() => setRealityGenerationMessage(null), 2000);
      }
    } catch (error: any) {
      console.error('❌ Error generando variación de realidad:', error);
      setRealityGenerationMessage('❌ Error al generar imagen');
      setTimeout(() => setRealityGenerationMessage(null), 3000);
      
      // Cerrar alerta de loading en caso de error
      if (realityLoadingSwalRef.current) {
        realityLoadingSwalRef.current.close();
        realityLoadingSwalRef.current = null;
      }
    } finally {
      // ✅ CORRECCIÓN: Liberar lock después de generar
      generationLockRef.current = false;
      setIsGeneratingReality(false);
      setIsRealityVariation(false); // Resetear flag después de generar
      
      // Cerrar alerta de loading cuando termina la generación
      if (realityLoadingSwalRef.current) {
        realityLoadingSwalRef.current.close();
        realityLoadingSwalRef.current = null;
      }
    }
  };

  const handleStyleSelect = (key: FlyerStyleKey) => {
    setStyleKey(key);
    // NEW: Si el usuario selecciona manualmente un estilo en modo AUTO,
    // limpiar el customStylePrompt para usar el estilo seleccionado
    if (workMode === 'auto' && customStylePrompt) {
      console.log('🎨 Usuario cambió estilo manualmente en modo AUTO - limpiando análisis automático');
      setCustomStylePrompt(undefined);
    }
    setShowGallery(false);
  };

  // Check authentication
  if (!hasKey) {
      return <Navigate to="/iniciar-sesion" replace />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[100dvh] w-full bg-[#030303] text-white font-sans selection:bg-blue-500/30 relative overflow-hidden">
       
       {/* BACKGROUND AMBIENCE */}
       <div className="fixed inset-0 pointer-events-none z-0">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full animate-pulse-slow"></div>
           <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[150px] rounded-full"></div>
       </div>

       {/* LEFT PANEL: CONTROLS - En mobile portrait: full width, en lg: sidebar izquierdo */}
       <aside className="w-full lg:w-[400px] flex-shrink-0 flex flex-col z-20 h-auto lg:h-screen p-1 lg:p-2 pr-0 lg:pr-0">
          <div className="glass-panel rounded-xl lg:rounded-[2rem] h-full flex flex-col shadow-2xl relative overflow-hidden">
            
            {/* Header */}
            <div className="h-14 flex-shrink-0 flex items-center justify-between px-4 border-b border-white/5 z-20 relative">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                    <span className="font-bold text-base tracking-tight">Estudio 56</span>
                </div>
                <div className="flex items-center gap-1">
                    {/* Brand Selector - Más compacto */}
                    <button
                      onClick={() => setShowBrandPanel(true)}
                      className="flex items-center gap-1.5 h-7 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all hover:border-white/30 group"
                    >
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center text-[10px]"
                        style={{
                          backgroundColor: selectedBrand?.primary_color || '#333',
                          color: selectedBrand?.primary_color === '#FFFFFF' ? '#000' : '#fff'
                        }}
                      >
                        {selectedBrand?.name ? selectedBrand.name.charAt(0).toUpperCase() : '🏪'}
                      </div>
                      <span className="max-w-[60px] truncate text-[10px] font-medium">
                        {selectedBrand?.name || 'Marca'}
                      </span>
                    </button>
                    
                    {/* Plan Button - Más compacto */}
                    <button
                      onClick={() => setShowPricing(true)}
                      className="flex items-center gap-1 h-7 px-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all hover:border-white/30"
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${activePlan === 'GRATIS' ? 'bg-gray-500' : 'bg-yellow-400 animate-pulse'}`}></span>
                        <span className="text-[10px]">{formatPlanName(activePlan)}</span>
                    </button>
                    
                    {/* Calendar Button - Solo visible en mobile */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCalendar(!showCalendar);
                      }}
                      className="flex lg:hidden items-center justify-center h-7 w-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all hover:border-white/30 active:scale-95 cursor-pointer touch-manipulation z-[60] relative"
                      title="Ver calendario"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                </div>
            </div>

            {/* Form Container - Scroll container con padding-bottom para footer */}
            <div className="flex-1 mobile-scroll-container custom-scrollbar min-h-0 overflow-y-auto overflow-x-hidden pb-32 lg:pb-6 scroll-smooth">
                <FlyerForm
                    styleKey={styleKey}
                    videoStyleKey={videoStyleKey} // NEW: Pasar estado de video
                    aspectRatio={aspectRatio}
                    mediaType={mediaType}
                    description={description}
                    logoUrl={logoUrl}
                    setLogoUrl={setLogoUrl}
                    productUrl={productUrl}
                    setProductUrl={setProductUrl}
                    setStyleKey={setStyleKey}
                    setVideoStyleKey={setVideoStyleKey} // NEW: Pasar setter de video
                    setAspectRatio={setAspectRatio}
                    setMediaType={setMediaType}
                    setDescription={setDescription}
                    workMode={workMode} // NEW: Modo de trabajo
                    setWorkMode={handleWorkModeChange} // NEW: Handler personalizado para modo de trabajo
                    onSubmit={handleGenerate}
                    isLoading={status.isLoading}
                    imageQuality={imageQuality}
                    setImageQuality={setImageQuality}
                    onStyleDetected={handleStyleDetected}
                    overlayText={overlayText}
                    overlayStyle={overlayStyle}
                    setOverlayText={handleSetOverlayText}
                    setOverlayStyle={setOverlayStyle}
                    onOpenGallery={() => setShowGallery(true)}
                    imageAnalysis={imageAnalysis}
                    intelligentTextStyles={intelligentTextStyles}
                    contextualTypography={contextualTypography}
                    contrastAnalysis={contrastAnalysis}
                    contextualEffects={contextualEffects}
                    compositionAnalysis={compositionAnalysis}
                    autoTextValidation={autoTextValidation}
                    enhancedStyles={enhancedStyles}
                    textMode={textMode}
                    setTextMode={setTextMode}
                    textPosition={textPosition}
                    setTextPosition={setTextPosition}
                    resetTextPosition={() => setTextPosition({ x: 50, y: 50 })}
                    manualTextStyles={manualTextStyles}
                    onManualTextStylesChange={setManualTextStyles}
                    onClearInput={handleClearInput}
                    // NEW: Pasar prompt en español para mostrar al usuario
                    currentSpanishPrompt={currentSpanishPrompt}
                    // NEW: Callback para actualizar prompt desde análisis de URL
                    onSpanishPromptUpdate={handleSpanishPromptUpdate}
                    // NEW: Props para Poster Pro
                    posterStyle={posterStyle}
                    setPosterStyle={setPosterStyle}
                    // Surface Detection props
                    selectedSurface={surfaceType}
                    setSelectedSurface={setSurfaceType}
                    autoDetectedSurface={autoDetectedSurface}
                    // 🎨 Story Art props - Already defined at top of Dashboard
                    storyArtVisualStyleId={storyArtVisualStyleId}
                    onStoryArtStyleSelected={handleStoryArtStyleSelected}
                    // NEW: URLs de imagen para cierre de alerta
                    imageUrl={imageUrl}
                    draftImageUrl={draftImageUrl}
                />
                
                {/* MOBILE PREVIEW - Debajo del formulario, antes del editor de texto */}
                {imageUrl && (
                  <div className="lg:hidden p-4 animate-in fade-in slide-in-from-bottom-2 duration-300 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-green-400">👁️ Vista Previa</span>
                    </div>
                    <div className={`
                      w-full rounded-[1.5rem] border border-white/5 bg-gradient-to-b from-[#0A0A0A] to-[#050505] flex flex-col overflow-hidden shadow-2xl relative
                    `}>
                      <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100 p-2">
                          {/* 🎯 PRIORIDAD DE VISUALIZACIÓN: realityImageUrl → hdImageUrl → draftImageUrl */}
                          {(() => {
                            const displayUrl = realityImageUrl || hdImageUrl || draftImageUrl || imageUrl;
                            return (
                              <FlyerDisplay
                                imageUrl={displayUrl}
                                draftImageUrl={draftImageUrl}
                                hdImageUrl={hdImageUrl}
                                draftVideoUrl={draftVideoUrl}
                                hdVideoUrl={hdVideoUrl}
                                status={status}
                                aspectRatio={aspectRatio}
                                logoUrl={logoUrl}
                                logoColor={logoColor}
                                logoFilters={logoFilters}
                                productUrl={productUrl}
                                onRefine={handleRefine}
                                isDraft={isDraft}
                                onUpgradeToHD={handleUpgradeToHD}
                                initialOverlayText={overlayText}
                                textPosition={textPosition}
                                setTextPosition={setTextPosition}
                                workMode={workMode}
                                styleKey={styleKey}
                                videoStyleKey={videoStyleKey}
                                overlayText={overlayText}
                                setOverlayText={handleSetOverlayText}
                                textStyles={manualTextStyles}
                                setTextStyles={setManualTextStyles}
                                logoPosition={logoPosition}
                                setLogoPosition={setLogoPosition}
                                productPosition={productPosition}
                                setProductPosition={setProductPosition}
                                mediaType={mediaType}
                                surfaceType={surfaceType}
                                onSurfaceTypeChange={setSurfaceType}
                                autoDetectedSurface={autoDetectedSurface}
                                isGeneratingReality={isGeneratingReality}
                              />
                            );
                          })()}
                       </div>
                    </div>
                  </div>
                )}
                
                
                {/* EDITOR DE REALIDAD - En el menú lateral izquierdo */}
                {imageUrl && mediaType !== 'video' && mediaType !== 'story_art' && (
                  <div className="p-4 border-t border-white/10 flex-shrink-0">
                    <CollapsibleSection
                      title="Editor de Realidad"
                      icon=""
                      defaultOpen={false}
                    >
                      <RealitySlider
                        value={realityLevel}
                        sceneId={sceneId}
                        currentImageUrl={imageUrl}
                        seed={seed}
                        aspectRatio={aspectRatio} // Pasar el aspectRatio actual para mostrar el formato correcto
                        onLevelChange={handleRealityChange}
                        disabled={isGeneratingReality}
                        cachedVariations={realityVariations}
                        onGenerationStart={handleRealityGenerationStart}
                        isRealityVariation={isRealityVariation}
                        onOpenComparator={() => {
                          // 🎯 ASEGURAR QUE LA IMAGEN ORIGINAL ESTÉ EN CACHÉ ANTES DE ABRIR
                          const originalLevel = 1.5;
                          if (!realityVariations[originalLevel] && draftImageUrl) {
                            setRealityVariations(prev => ({
                              ...prev,
                              [originalLevel]: draftImageUrl
                            }));
                          }
                          setShowRealityComparator(true);
                        }}
                      />
                    </CollapsibleSection>
                  </div>
                )}
                
                {/* Panel de Editor de Texto y Estilo de Integración Visual - OCULTAR PARA VIDEOS Y STORY ART */}
                {imageUrl && mediaType !== 'video' && mediaType !== 'story_art' && (
                  <div className="p-4 border-t border-white/10 flex-shrink-0">
                    {/* Botón desplegable del Editor de Texto */}
                    <CollapsibleSection
                      title="Editor de Texto"
                      icon=""
                      defaultOpen={false}
                    >
                      <TextEditorPanel
                        overlayText={overlayText}
                        setOverlayText={handleSetOverlayText}
                        textStyles={manualTextStyles}
                        setTextStyles={setManualTextStyles}
                        onResetPosition={() => setTextPosition({ x: 50, y: 50 })}
                        logoUrl={logoUrl}
                        setLogoUrl={setLogoUrl}
                        logoColor={logoColor}
                        setLogoColor={setLogoColor}
                        logoFilters={logoFilters}
                        setLogoFilters={setLogoFilters}
                        productUrl={productUrl}
                        setProductUrl={setProductUrl}
                      />
                    </CollapsibleSection>
                  </div>
                )}
            </div>
            
            {/* Minimal Footer - Con z-index apropiado y safe-area */}
            <div className="footer-legal flex-shrink-0 p-3 lg:p-4 border-t border-white/5 bg-black/20 text-[10px] text-white flex flex-col md:flex-row justify-between items-center gap-2 font-mono pb-safe">
                <div className="flex gap-2">
                    <span>V2.0.0_ESTABLE</span>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 max-w-full">
                    <a href="/privacidad" className="hover:text-green-400 transition-colors px-1">Privacidad</a>
                    <span className="text-white/40">|</span>
                    <a href="/cookies" className="hover:text-green-400 transition-colors px-1">Cookies</a>
                    <span className="text-white/40">|</span>
                    <a href="/terminos" className="hover:text-green-400 transition-colors px-1">Términos</a>
                    <span className="text-white/40">|</span>
                    <a href="/condiciones" className="hover:text-green-400 transition-colors px-1">Condiciones</a>
                    <span className="text-white/40">|</span>
                    <a href="/historial-pagos" className="hover:text-green-400 transition-colors px-1">Historial</a>
                    <span className="text-white/40">|</span>
                    <span
                      className="cursor-pointer hover:text-green-400 transition-colors px-1"
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setHasKey(false);
                        window.location.href = '/';
                      }}
                    >
                      DESCONECTAR
                    </span>
                </div>
            </div>
        </div>
    </aside>

      {/* CENTER: CANVAS - Solo visible en landscape (lg) */}
      <main className={`
        flex-1 flex-col relative z-10 p-1 lg:p-2 overflow-hidden w-full hidden lg:flex
        items-stretch /* Esto iguala las alturas con el sidebar */
        pr-2 /* Espacio derecho consistente con calendarios */
      `}>
          {/* DESKTOP/LANDSCAPE PREVIEW - Visible en landscape (lg) */}
          <div className={`
            hidden lg:flex w-full h-full min-h-0 rounded-[2rem] border border-white/5 bg-gradient-to-b from-[#0A0A0A] to-[#050505] flex-col overflow-hidden shadow-2xl relative
          `}>
              
              {/* Top Bar */}
              <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-white/5">
                  <div className="flex items-center gap-2">
                      {/* Mobile Menu Button */}
                      <button
                        onClick={() => setShowMobileMenu(true)}
                        className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                      
                      
                      <span className={`text-xs font-medium ${!imageUrl ? "text-white" : "text-white/50"}`}>Diseño</span>
                      <span className="text-white/30">/</span>
                      <span className={`text-xs font-medium ${imageUrl ? "text-white" : "text-white/50"}`}>Previsualización</span>
                  </div>
                  <div className="flex items-center gap-2">
                      <button
                          onClick={() => window.location.href = '/perfil'}
                          className="flex items-center gap-2 hover:bg-white/5 px-2 py-1 rounded transition-colors"
                          title="Ver perfil de cuenta"
                      >
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                      </button>
                  </div>
             </header>

            {/* Viewport */}
            <div className="flex-1 overflow-hidden relative flex items-start justify-start bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100 w-full pt-4">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                
                {/* Botón Genera nuevo borrador - Solo visible cuando hay borrador y NO está el comparador abierto */}
                {draftImageUrl && !showRealityComparator && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                    <button
                      onClick={() => {
                        // Mostrar alerta de loading
                        Swal.fire({
                          background: '#111827',
                          color: '#ffffff',
                          confirmButtonColor: '#3b82f6',
                          customClass: {
                            popup: 'border border-gray-700 shadow-2xl rounded-3xl font-sans',
                            title: 'text-2xl font-bold text-white tracking-tight',
                            htmlContainer: 'text-gray-400 text-sm',
                            confirmButton: 'rounded-xl px-6 py-2.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95',
                          },
                          buttonsStyling: true,
                          title: 'Generando nuevo borrador...',
                          html: '<div class="flex justify-center my-4"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div></div>',
                          allowOutsideClick: false,
                          showConfirmButton: false,
                        });
                        handleGenerate();
                      }}
                      disabled={status.isLoading}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium rounded-lg transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Genera nuevo borrador
                    </button>
                  </div>
                )}
                
                {/* 🎯 PRIORIDAD DE VISUALIZACIÓN: realityImageUrl → hdImageUrl → draftImageUrl */}
                {(() => {
                  const displayUrl = realityImageUrl || hdImageUrl || draftImageUrl || imageUrl;
                  return (
                    <FlyerDisplay
                      imageUrl={displayUrl}
                      draftImageUrl={draftImageUrl}
                      hdImageUrl={hdImageUrl}
                      draftVideoUrl={draftVideoUrl}
                      hdVideoUrl={hdVideoUrl}
                      status={status}
                      aspectRatio={aspectRatio}
                      logoUrl={logoUrl}
                      logoColor={logoColor}
                      logoFilters={logoFilters}
                      productUrl={productUrl}
                      onRefine={handleRefine}
                      isDraft={isDraft}
                      onUpgradeToHD={handleUpgradeToHD}
                      initialOverlayText={overlayText}
                      textPosition={textPosition}
                      setTextPosition={setTextPosition}
                      workMode={workMode}
                      styleKey={styleKey}
                      videoStyleKey={videoStyleKey}
                      overlayText={overlayText}
                      setOverlayText={handleSetOverlayText}
                      textStyles={manualTextStyles}
                      setTextStyles={setManualTextStyles}
                      logoPosition={logoPosition}
                      setLogoPosition={setLogoPosition}
                      productPosition={productPosition}
                      setProductPosition={setProductPosition}
                      mediaType={mediaType}
                      surfaceType={surfaceType}
                      onSurfaceTypeChange={setSurfaceType}
                      autoDetectedSurface={autoDetectedSurface}
                      isGeneratingReality={isGeneratingReality}
                    />
                  );
                })()}
           </div>
           
         </div>
    </main>

      {/* RIGHT PANEL: REALITY COMPARATOR - Solo visible cuando el usuario lo activa */}
      {showRealityComparator && (
        <aside className={`
          fixed inset-0 z-50 flex items-center justify-center p-2 transition-all duration-300
          lg:relative lg:inset-auto lg:z-40
          lg:w-[320px] lg:flex-shrink-0 lg:flex lg:flex-col lg:py-2 lg:pr-2 lg:pl-2
        `}>
          {/* Overlay background solo en mobile portrait */}
          <div
            className="absolute inset-0 bg-black/80 lg:hidden touch-none"
            onClick={() => setShowRealityComparator(false)}
          />
          <div className="glass-panel rounded-xl lg:rounded-[2rem] w-full max-w-[320px] max-h-[80vh] flex flex-col shadow-2xl overflow-hidden relative z-10 lg:max-h-full lg:h-full">
            {/* Botón cerrar centrado */}
            <div className="h-14 flex-shrink-0 flex items-center justify-center px-4 border-b border-white/5">
              <button
                onClick={() => setShowRealityComparator(false)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-xs font-medium">Cerrar comparación</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <RealityComparator
                sceneId={sceneId}
                variations={realityVariations}
                currentLevel={realityLevel}
                originalLevel={1.5}
                seed={seed}
                aspectRatio={aspectRatio}
                onSelect={(level) => {
                  setRealityLevel(level);
                  if (realityVariations[level]) {
                    setImageUrl(realityVariations[level]);
                    setRealityImageUrl(realityVariations[level]);
                  }
                  setShowRealityComparator(false);
                }}
                onClose={() => setShowRealityComparator(false)}
                originalImage={draftImageUrl || undefined}
              />
            </div>
          </div>
        </aside>
      )}

      {/* NOTIFICACIONES DEL CALENDARIO */}
      <CalendarNotifications
        selectedBrand={selectedBrand}
        onGenerateForEvent={(event, prompt) => {
          setDescription(prompt);
          console.log('🎯 Generando para evento:', event.name, 'con marca:', selectedBrand?.name);
        }}
      />

      {/* BRAND PANEL */}
      <BrandPanel
        isOpen={showBrandPanel}
        onClose={() => setShowBrandPanel(false)}
        onBrandSelect={(brand) => {
          setSelectedBrand(brand);
          setShowBrandPanel(false);
        }}
        onBrandSelectWithPrompt={(brand, prompt) => {
          setSelectedBrand(brand);
          setDescription(prompt);
          setShowBrandPanel(false);
          console.log('✅ Marca seleccionada con prompt:', prompt);
        }}
        selectedBrand={selectedBrand}
      />

     {/* MODALS */}
     <PricingModal
       isOpen={showPricing}
       onClose={() => setShowPricing(false)}
       onSelectPlan={setActivePlan}
     />
     <StyleGallery
       isOpen={showGallery}
       onClose={() => setShowGallery(false)}
       onSelect={handleStyleSelect}
     />
     
     {/* MOBILE MENU */}
     <MobileMenu
       isOpen={showMobileMenu}
       onClose={() => setShowMobileMenu(false)}
       onNavigate={(route) => {
         window.location.href = route;
       }}
       activePlan={activePlan}
       onOpenPricing={() => {
         setShowMobileMenu(false);
         setShowPricing(true);
       }}
       onOpenBrandPanel={() => {
         setShowMobileMenu(false);
         setShowBrandPanel(true);
       }}
       onToggleCalendar={() => {
         setShowMobileMenu(false);
         setShowCalendar(!showCalendar);
       }}
       isCalendarOpen={showCalendar}
       selectedBrandName={selectedBrand?.name}
       onLogout={async () => {
         await supabase.auth.signOut();
         setHasKey(false);
         window.location.href = '/';
       }}
     />
     

     {/* LEFT PANEL: CALENDAR - Donde estaba el Comparador de Realismo */}
     <aside className="w-full lg:w-[320px] flex-shrink-0 flex flex-col z-20 h-auto lg:h-screen p-1 lg:p-2 pl-0 lg:pl-2">
       <div className="glass-panel rounded-xl lg:rounded-[2rem] h-full flex flex-col shadow-2xl relative overflow-hidden">
         {/* Header */}
         <div className="h-14 flex-shrink-0 flex items-center justify-center px-4 border-b border-white/5">
           <span className="text-xs font-bold">Calendario Comercial</span>
         </div>
         <div className="flex-1 overflow-y-auto">
           <CommercialCalendar
             selectedBrand={selectedBrand}
             onGenerateForEvent={(event, prompt) => {
               setDescription(prompt);
               console.log('🎯 Generando para evento:', event.name, 'con marca:', selectedBrand?.name);
             }}
           />
         </div>
       </div>
     </aside>
   </div>
 );
};
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/iniciar-sesion" element={<LoginPage />} />
        <Route path="/registrarse" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/condiciones" element={<ServiceConditionsPage />} />
        <Route path="/panel" element={<Dashboard />} />
        
        {/* Payment Routes */}
        <Route path="/pago-exitoso" element={<PaymentSuccessPage />} />
        <Route path="/pago-fallido" element={<PaymentFailurePage />} />
        <Route path="/pago-pendiente" element={<PaymentPendingPage />} />
        
        {/* Recharge Routes */}
        <Route path="/recarga-exitosa" element={<RechargeSuccessPage />} />
        <Route path="/recarga-fallida" element={<RechargeFailurePage />} />
        <Route path="/recarga-pendiente" element={<RechargePendingPage />} />
        
        {/* Payment History Route */}
        <Route path="/historial-pagos" element={<PaymentHistory />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

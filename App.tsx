import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { FlyerStyleKey, AspectRatio, GenerationStatus, MediaType, ImageQuality, OverlayStyle, PosterStyle } from './types';
import { POSTER_STYLES, POSTER_INDUSTRY_PROMPTS } from './constants';
import { FlyerForm } from './components/FlyerForm';
import { FlyerDisplay, TextStyleOptions } from './components/FlyerDisplay';
import { TextEditorPanel } from './components/TextEditorPanel';
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
import { supabase } from './services/supabaseService';
import { getUserBrands, getDefaultBrand, Brand, generateEventPrompt } from './services/brandService';
import { detectIndustryFromDescription } from './services/geminiService';
import { enhancePrompt, generateFlyerImage, generateFlyerVideo, refineDescription, generatePersuasiveText, GeneratedImageResult } from './services/geminiService';
import { createGeneration, updateGenerationToHD, getGenerationById, FlyerGeneration } from './services/flyerGenerationService';
import creditService from './services/creditService';

// Dashboard Component
const Dashboard: React.FC = () => {
  const [hasKey, setHasKey] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showBrandPanel, setShowBrandPanel] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
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
  const [textPosition, setTextPosition] = useState<{x: number, y: number}>({ x: 50, y: 50 }); // Porcentajes
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // NEW: Estados para posición de logo y producto
  const [logoPosition, setLogoPosition] = useState<{x: number, y: number; width: number}>({ x: 10, y: 10, width: 80 });
  const [productPosition, setProductPosition] = useState<{x: number, y: number; width: number; height: number}>({ x: 50, y: 70, width: 120, height: 120 });
  
  // NEW: Estados para estilos manuales del editor de texto
  const [manualTextStyles, setManualTextStyles] = useState<TextStyleOptions>({
    fontSize: 24,
    fontFamily: 'Inter, sans-serif',
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

    // NO borrar draftImageUrl si estamos en modo HD - lo necesitamos para comparar
    if (imageQuality === 'draft') {
      setDraftImageUrl(null);
    }
    setImageUrl(null);
    setHdImageUrl(null);
    setCurrentSpanishPrompt(''); // Limpiar prompt en español
    const newSeed = Math.floor(Math.random() * 2000000000);
    setSeed(newSeed);
    const hasProductOverlay = !!productUrl;

    // ============================================
    // MODO POSTER PRO - GENERACIÓN ESPECIAL
    // ============================================
    if (mediaType === 'poster') {
      try {
        setStatus({ isLoading: true, step: 'translating', message: ':: GENERANDO_POSTER_PRO ::' });
        
        // Detectar industria basada en la descripción
        const industryKey = detectIndustryFromDescription(description);
        console.log('📄 Industria detectada para poster:', industryKey);
        
        // Obtener prompt específico para la industria y estilo de poster
        const industryPrompts = POSTER_INDUSTRY_PROMPTS[industryKey] || POSTER_INDUSTRY_PROMPTS['default'];
        const posterPrompt = industryPrompts[posterStyle];
        
        console.log('📄 Estilo de poster:', posterStyle);
        console.log('📄 Prompt generado:', posterPrompt.substring(0, 100) + '...');
        
        // Generar imagen de poster con formato 1:1.41
        setStatus({
          isLoading: true,
          step: 'rendering',
          message: ':: RENDERIZANDO_POSTER_ALTA_RESOLUCION ::'
        });
        
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
        
        setStatus({ isLoading: false, step: 'complete', message: 'POSTER GENERADO ✓' });
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

      setStatus({ isLoading: true, step: 'translating', message: ':: ANALIZANDO_CONTEXTO ::' });
      // Obtenemos ambos prompts: inglés para la IA, español para mostrar al usuario
      const { english: enhancedPrompt, spanish: spanishPrompt } = await enhancePrompt(description, effectiveStyleKey);
      setCurrentSpanishPrompt(spanishPrompt);
      
      // Si es product_study, usar la imagen subida directamente (ya mejorada)
      if (mediaType === 'product_study') {
        // La imagen ya está en productUrl (mejorada con IA)
        setStatus({ isLoading: false, step: 'complete', message: 'LISTO' });
        console.log('📸 product_study - Usando imagen subida por el usuario');
        return;
      } else if (mediaType === 'image' || mediaType === 'story_art') {
        setStatus({
          isLoading: true,
          step: 'rendering',
          message: imageQuality === 'draft' ? ':: GENERANDO_PIXELES_BORRADOR ::' : ':: RENDERIZANDO_TEXTURAS_HD ::'
        });
        console.log('🎨 Generating image with aspectRatio:', aspectRatio);
        
        // NEW: Determinar si hay texto extraído automáticamente
        const autoExtractedText = workMode === 'auto' && overlayText.trim() ? overlayText : undefined;
        const autoTextStyle = workMode === 'auto' ? "modern and clean" : undefined;
        
        if (autoExtractedText) {
          console.log('🤖 USANDO TEXTO AUTOMÁTICO EXTRAÍDO:', autoExtractedText);
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
          autoTextStyle
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
      } else {
        setStatus({
            isLoading: true,
            step: 'rendering',
            message: imageQuality === 'draft' ? ':: SIMULANDO_FISICAS_RAPIDAS ::' : ':: PRODUCIENDO_VIDEO_CINEMATICO ::'
          });
        console.log('🎬 Generating video with aspectRatio:', aspectRatio);
        // Generar imagen base para el video
        const videoSeed = Math.floor(Math.random() * 2000000000);
        const imageResult = await generateFlyerImage(
          enhancedPrompt,
          effectiveStyleKey,
          aspectRatio,
          'draft', // Siempre usar draft para la imagen base del video
          videoSeed,
          undefined, // customStylePrompt
          hasProductOverlay,
          false, // enableIntelligentTextStyles
          undefined, // autoExtractedText
          undefined // autoTextStyle
        );
        
        const url = await generateFlyerVideo(enhancedPrompt, effectiveStyleKey, aspectRatio, imageQuality, hasProductOverlay, imageResult.imageDataUrl);
        console.log('✅ Video generated:', url?.substring(0, 50) + '...');
        setImageUrl(url);
        
        // Guardar video e imagen en estados correspondientes
        if (imageQuality === 'draft') {
          setDraftVideoUrl(url);
          setDraftVideoImageUrl(imageResult.imageDataUrl); // Guardar imagen para usar en HD
          // Limpiar video HD anterior
          setHdVideoUrl(null);
        } else {
          setHdVideoUrl(url);
        }
        
        setIsDraft(imageQuality === 'draft');
      }
      setStatus({ isLoading: false, step: 'complete', message: 'LISTO' });
      console.log('🎉 Generation completed successfully');
    } catch (error: any) {
      console.error('❌ Generation failed:', error);
      handleError(error);
    }
  };

  const handleUpgradeToHD = async () => {
    if (!currentSpanishPrompt) return;
    const hasProductOverlay = !!productUrl;
    try {
        // 💰 DEDUCIR CRÉDITO PARA HD
        const creditDeducted = await creditService.deductCredit(
          'final_image',
          1,
          'Mejora a imagen HD',
          currentGenerationId || null
        );
        console.log(`💰 Crédito final_image ${creditDeducted ? 'descontado' : 'NO descontado (sin créditos o error)'}`);

        setStatus({ isLoading: true, step: 'rendering', message: ':: ESCALANDO_A_PRODUCCION ::' });
        let url;
        // story_art se maneja igual que image para el upgrade HD
        if (mediaType === 'image' || mediaType === 'story_art') {
            // Regenerar prompt en inglés para HD
            const { english: enhancedPrompt } = await enhancePrompt(description, styleKey);
            
            // NEW: Pasar texto automático también en upgrade
            const autoExtractedText = workMode === 'auto' && overlayText.trim() ? overlayText : undefined;
            const autoTextStyle = workMode === 'auto' ? "modern and clean" : undefined;
            
            // NEW: Pasar imagen de borrador como referencia para mantener consistencia
            const result = await generateFlyerImage(
              enhancedPrompt,
              styleKey,
              aspectRatio,
              'hd',
              seed,
              customStylePrompt,
              hasProductOverlay,
              true, // enableIntelligentTextStyles
              autoExtractedText,
              autoTextStyle,
              draftImageUrl || undefined // Usar borrador como referencia para HD
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
          // Regenerar prompt en inglés para video HD
            const { english: enhancedPrompt } = await enhancePrompt(description, styleKey);
            // Usar imagen draft como referencia para mantener consistencia
            url = await generateFlyerVideo(
              enhancedPrompt,
              styleKey,
              aspectRatio,
              'hd',
              hasProductOverlay,
              draftVideoImageUrl || undefined // Usar imagen draft para mantener consistencia
            );
      }
        setImageUrl(url);
        setHdImageUrl(url);
        setIsDraft(false);
        setStatus({ isLoading: false, step: 'complete', message: 'LISTO' });
    } catch (error: any) {
        handleError(error);
    }
  };

  const handleRefine = async (instruction: string) => {
    if (!currentSpanishPrompt || !imageUrl) return;
    const hasProductOverlay = !!productUrl;
    try {
      setStatus({ isLoading: true, step: 'translating', message: ':: REFINANDO_LOGICA_PROMPT ::' });
      // Para refinar necesitamos el prompt en inglés original, lo regeneramos
      const { english: enhancedPrompt } = await enhancePrompt(description, styleKey);
      const newPrompt = await refineDescription(enhancedPrompt, instruction);
      const qualityToUse = isDraft ? 'draft' : 'hd';
      
      setStatus({ 
        isLoading: true, 
        step: 'rendering', 
        message: ':: REGENERANDO_ASSET ::' 
      });

      let url;
      if (mediaType === 'image' || mediaType === 'story_art') {
         // NEW: Pasar texto automático también en refine
         const autoExtractedText = workMode === 'auto' && overlayText.trim() ? overlayText : undefined;
         const autoTextStyle = workMode === 'auto' ? "modern and clean" : undefined;
         
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
           autoTextStyle
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
         // Para refine de video, generar nueva imagen base
         const refineSeed = Math.floor(Math.random() * 2000000000);
         const refineImageResult = await generateFlyerImage(
           newPrompt,
           styleKey,
           aspectRatio,
           'draft',
           refineSeed,
           undefined,
           hasProductOverlay,
           false
         );
         url = await generateFlyerVideo(newPrompt, styleKey, aspectRatio, qualityToUse, hasProductOverlay, refineImageResult.imageDataUrl);
      }
      setImageUrl(url);
      setStatus({ isLoading: false, step: 'complete', message: 'ACTUALIZADO' });
    } catch (error: any) {
        handleError(error);
    }
  };

  const handleError = (error: any) => {
    if (error.message && (error.message.includes('permission denied') || error.message.includes('403'))) {
      setStatus({ isLoading: false, step: 'error', message: ':: ERROR_AUTENTICACION ::' });
      setHasKey(false); 
      alert('Tu sesión expiró. Conecta nuevamente.');
    } else {
      setStatus({ isLoading: false, step: 'error', message: ':: FALLO_DEL_SISTEMA ::' });
      alert('Error al generar. Intenta de nuevo.');
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
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#030303] text-white font-sans selection:bg-blue-500/30 relative">
       
       {/* BACKGROUND AMBIENCE */}
       <div className="fixed inset-0 pointer-events-none z-0">
           <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full animate-pulse-slow"></div>
           <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[150px] rounded-full"></div>
       </div>

       {/* LEFT PANEL: CONTROLS - En mobile portrait: full width, en lg: sidebar izquierdo */}
       <aside className="w-full lg:w-[400px] flex-shrink-0 flex flex-col z-20 h-auto lg:h-full p-2 lg:p-4">
         <div className="glass-panel rounded-xl lg:rounded-[2rem] h-full flex flex-col shadow-2xl relative">
            
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
                      className="flex items-center justify-center h-7 w-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 transition-all hover:border-white/30 active:scale-95 cursor-pointer touch-manipulation z-[60] relative"
                      title="Ver calendario"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                </div>
            </div>

            {/* Form Container - Scroll container con padding-bottom para footer */}
            <div className="flex-1 mobile-scroll-container custom-scrollbar min-h-0 overflow-y-auto pb-28 lg:pb-6">
                <FlyerForm
                    styleKey={styleKey}
                    aspectRatio={aspectRatio}
                    mediaType={mediaType}
                    description={description}
                    logoUrl={logoUrl}
                    setLogoUrl={setLogoUrl}
                    productUrl={productUrl}
                    setProductUrl={setProductUrl}
                    setStyleKey={setStyleKey}
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
                    setOverlayText={setOverlayText}
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
                />
                
                {/* MOBILE PREVIEW - Debajo del formulario, antes del editor de texto */}
                {imageUrl && (
                  <div className="lg:hidden p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-green-400">👁️ Vista Previa</span>
                    </div>
                    <div className={`
                      w-full rounded-[1.5rem] border border-white/5 bg-gradient-to-b from-[#0A0A0A] to-[#050505] flex flex-col overflow-hidden shadow-2xl relative
                    `}>
                      <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100 p-2">
                          <FlyerDisplay
                              imageUrl={imageUrl}
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
                              overlayText={overlayText}
                              setOverlayText={setOverlayText}
                              textStyles={manualTextStyles}
                              setTextStyles={setManualTextStyles}
                              logoPosition={logoPosition}
                              setLogoPosition={setLogoPosition}
                              productPosition={productPosition}
                              setProductPosition={setProductPosition}
                          />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Panel de Editor de Texto */}
                {imageUrl && (
                  <div className="p-4 border-t border-white/10">
                    <TextEditorPanel
                      overlayText={overlayText}
                      setOverlayText={setOverlayText}
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
                  </div>
                )}
            </div>
            
            {/* Minimal Footer - Con z-index apropiado y safe-area */}
            <div className="footer-legal flex-shrink-0 p-4 border-t border-white/5 bg-black/20 text-[10px] text-white flex flex-col md:flex-row justify-between items-center gap-2 font-mono pb-safe">
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
        flex-1 flex-col relative z-10 p-2 lg:p-4 pl-0 overflow-hidden
        w-full hidden lg:flex
      `}>
          {/* DESKTOP/LANDSCAPE PREVIEW - Visible en landscape (lg) */}
          <div className={`
            hidden lg:flex w-full h-full min-h-0 rounded-[2rem] border border-white/5 bg-gradient-to-b from-[#0A0A0A] to-[#050505] flex-col overflow-hidden shadow-2xl relative
          `}>
            {/* CONTENEDOR CON MÁS ESPACIO VERTICAL PARA LOS BOTONES DEBAJO */}
            <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-6 overflow-y-auto">
             
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
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </button>
                </div>
            </header>
            </div>

            {/* Viewport */}
            <div className="flex-1 overflow-hidden relative flex items-center justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-100 w-full">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                
                <FlyerDisplay
                    imageUrl={imageUrl}
                    draftImageUrl={draftImageUrl}
                    hdImageUrl={hdImageUrl}
                    // Videos
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
                    overlayText={overlayText}
                    setOverlayText={setOverlayText}
                    textStyles={manualTextStyles}
                    setTextStyles={setManualTextStyles}
                    logoPosition={logoPosition}
                    setLogoPosition={setLogoPosition}
                    productPosition={productPosition}
                    setProductPosition={setProductPosition}
                />
            </div>
         </div>
      </main>

      {/* RIGHT PANEL: CALENDAR - Overlay en mobile portrait, sidebar en landscape (lg) */}
      <aside className={`
        ${showCalendar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300
        lg:relative lg:inset-auto lg:opacity-100 lg:pointer-events-auto
        lg:w-[280px] lg:flex-shrink-0 lg:flex lg:flex-col lg:py-4 lg:pr-4
      `}>
        {/* Overlay background solo en mobile portrait */}
        <div
          className="absolute inset-0 bg-black/80 lg:hidden touch-none"
          onClick={() => setShowCalendar(false)}
        />
        <div className={`glass-panel rounded-xl w-full max-w-[320px] max-h-[80vh] flex flex-col shadow-2xl overflow-hidden relative z-10 ${showCalendar ? 'scale-100' : 'scale-95'} lg:scale-100 lg:max-h-full lg:h-full transition-transform duration-300`}>
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <span className="text-xs font-bold">Calendario</span>
            <button
              onClick={() => setShowCalendar(false)}
              className="w-6 h-6 flex items-center justify-center rounded bg-white/5 hover:bg-white/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <CommercialCalendar
              onGenerateForEvent={(event) => {
                // Pre-llenar la descripción con el evento comercial
                setDescription(`Oferta especial para ${event.name} - ${event.date}`);
                console.log('🎯 Generando para evento:', event.name);
                // Close calendar on mobile after selection
                if (window.innerWidth < 768) {
                  setShowCalendar(false);
                }
              }}
            />
          </div>
        </div>
      </aside>

      {/* NOTIFICACIONES DEL CALENDARIO */}
      <CalendarNotifications
        onGenerateForEvent={(event) => {
          // Pre-llenar la descripción con el evento comercial
          setDescription(`Oferta especial para ${event.name} - ${event.date}`);
          console.log('🎯 Generando para evento:', event.name);
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
   </div>
 );
};

// Main App Component with Routing
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
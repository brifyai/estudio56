import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GenerationStatus, AspectRatio, FlyerStyleKey } from '../types';
import { downloadComposedImage, getDimensionsForAspectRatio } from '../services/compositionExportService';
import { downloadElementAsImage, getElementDimensions } from '../services/domCaptureService';
import {
  processVideoWithOverlays,
  downloadProcessedVideo,
  downloadOriginalVideo,
  isSharedArrayBufferSupported,
  loadFFmpeg
} from '../services/videoPostProcessingService';
import Swal from 'sweetalert2';

interface LogoFilters {
  grayscale: number;
  brightness: number;
  contrast: number;
  opacity: number;
}

interface FlyerDisplayProps {
  imageUrl: string | null;
  draftImageUrl?: string | null;
  hdImageUrl?: string | null;
  // Videos draft/HD
  draftVideoUrl?: string | null;
  hdVideoUrl?: string | null;
  status: GenerationStatus;
  aspectRatio: AspectRatio;
  logoUrl: string | null;
  logoColor?: string | null;
  logoFilters?: LogoFilters;
  productUrl: string | null;
  onRefine: (instruction: string) => void;
  isDraft: boolean;
  onUpgradeToHD: () => void;
  initialOverlayText?: string;
  textPosition?: { x: number; y: number };
  setTextPosition?: (pos: { x: number; y: number }) => void;
  workMode?: 'auto' | 'manual';
  styleKey?: FlyerStyleKey;
  overlayText?: string;
  setOverlayText?: (text: string) => void;
  textStyles?: TextStyleOptions;
  setTextStyles?: (styles: TextStyleOptions) => void;
  // Posiciones de logo y producto
  logoPosition?: { x: number; y: number; width: number };
  setLogoPosition?: (pos: { x: number; y: number; width: number }) => void;
  productPosition?: { x: number; y: number; width: number; height: number };
  setProductPosition?: (pos: { x: number; y: number; width: number; height: number }) => void;
}

export interface TextStyleOptions {
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  textColor: string;
  backgroundColor: string;
  letterSpacing: number;
  textTransform: 'none' | 'uppercase' | 'capitalize';
  lineWidth: number;
  effects: {
    shadow: boolean;
    stroke: boolean;
    glow: boolean;
  };
}

export const FlyerDisplay: React.FC<FlyerDisplayProps> = ({
  imageUrl,
  draftImageUrl,
  hdImageUrl,
  // Videos
  draftVideoUrl,
  hdVideoUrl,
  status,
  aspectRatio,
  logoUrl,
  logoColor,
  logoFilters,
  productUrl,
  onRefine,
  isDraft,
  onUpgradeToHD,
  initialOverlayText,
  textPosition = { x: 50, y: 50 },
  setTextPosition,
  workMode = 'auto',
  styleKey = 'brand_identity',
  overlayText = '',
  setOverlayText,
  textStyles,
  setTextStyles,
  logoPosition = { x: 10, y: 10, width: 80 },
  setLogoPosition,
  productPosition = { x: 50, y: 70, width: 120, height: 120 },
  setProductPosition
}) => {
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop' | 'clean'>('mobile');
  const [refineText, setRefineText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado para mostrar/ocultar controles de texto en mobile
  const [showTextControls, setShowTextControls] = useState(false);
  const [isDraggingText, setIsDraggingText] = useState(false);
  
  // Estado para tracking de touch en texto (declarado a nivel del componente, no dentro de renderText)
  const [isTextTouching, setIsTextTouching] = useState(false);
  
  const flyerContainerRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  // Estado para tracking de arrastre
  const dragInfo = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    hasMoved: false,
    initialPosX: 0,
    initialPosY: 0
  });

  // Estado para gestos táctiles con 2 dedos (zoom y rotación)
  const [textScale, setTextScale] = useState(1);
  const [textRotation, setTextRotation] = useState(0);
  const [logoScale, setLogoScale] = useState(1);
  const [logoRotation, setLogoRotation] = useState(0);
  const [productScale, setProductScale] = useState(1);
  const [productRotation, setProductRotation] = useState(0);
  
  // Estado para tracking de gestos pinch/rotate
  const pinchInfo = useRef({
    isPinching: false,
    initialDistance: 0,
    initialRotation: 0,
    initialScale: 1,
    initialRotationAngle: 0
  });

  // Estado para resize
  const resizeInfo = useRef({
    isResizing: false,
    direction: '',
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startPosX: 0,
    startPosY: 0
  });

  // Estado local para el texto mientras se edita
  const [localText, setLocalText] = useState('');
  
  // Estado local para dimensiones del textarea
  const [textDimensions, setTextDimensions] = useState({ width: 200, height: 60 });
  
  // Estado local para edición de logo y producto
  const [editingLogo, setEditingLogo] = useState(false);
  const [editingProduct, setEditingProduct] = useState(false);
  
  // Estado para mostrar/ocultar handles de resize del logo
  const [showLogoHandles, setShowLogoHandles] = useState(false);
  
  // Estado para comparación draft vs HD (IMÁGENES)
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonMode, setComparisonMode] = useState<'side-by-side' | 'toggle'>('side-by-side');
  
  // Ref para rastrear si ya se mostró la comparación automáticamente (para evitar reopen automático)
  const hasShownComparison = useRef(false);
  
  // Estado para comparación draft vs HD (VIDEOS)
  const [showVideoComparison, setShowVideoComparison] = useState(false);
  
  // Ref para rastrear si ya se mostró la comparación de video automáticamente
  const hasShownVideoComparison = useRef(false);
  
  // Estado para almacenar el canvas recoloreado del logo (useState para forzar re-render)
  const [recoloredLogoUrl, setRecoloredLogoUrl] = useState<string | null>(null);
  
  // Estados para procesamiento de video con FFmpeg.wasm
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');
  const [videoProcessingError, setVideoProcessingError] = useState<string | null>(null);
  const [fallbackVideoUrl, setFallbackVideoUrl] = useState<string | null>(null);
  
  // Estados para manejo de errores de media (mobile fix)
  const [mediaError, setMediaError] = useState<{type: 'image' | 'video', url: string} | null>(null);
  
  // Sistema de retry para carga de imágenes en mobile
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  // Helper para detectar si es video por extensión de URL
  const isVideoUrl = (url: string): boolean => {
    return /\.(mp4|webm|mov|blob:)(?:\?.*)?$/i.test(url) || url.startsWith('blob:');
  };
  
  // Handler para errores de media con retry automático
  const handleMediaError = useCallback((e: React.SyntheticEvent<HTMLImageElement | HTMLVideoElement, Event>, type: 'image' | 'video') => {
    const target = e.target as HTMLImageElement | HTMLVideoElement;
    const url = target.src;
    console.error(`❌ Error cargando ${type}:`, url, 'Intento:', retryCount + 1);
    
    // Retry automático: hasta 3 intentos
    if (retryCount < 3) {
      console.log(`🔄 Reintentando carga (intento ${retryCount + 1}/3)...`);
      setIsRetrying(true);
      setRetryCount(prev => prev + 1);
      
      // Forzar re-render después de un delay corto
      setTimeout(() => {
        setIsRetrying(false);
      }, 500);
    } else {
      // Después de 3 intentos, mostrar error
      console.warn('⚠️ Máximo de reintentos alcanzado, mostrando error');
      setMediaError({ type, url });
      setRetryCount(0);
    }
  }, [retryCount]);
  
  // Resetear retry cuando cambia la URL
  useEffect(() => {
    setRetryCount(0);
    setIsRetrying(false);
    setMediaError(null);  // ← IMPORTANTE: Resetear también mediaError
  }, [imageUrl]);
  
  // Placeholder elegante cuando hay error de media
  const renderMediaPlaceholder = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
      <div className="text-4xl mb-2 opacity-50">🖼️</div>
      <div className="text-xs text-white/60 font-mono text-center px-4">
        Error al cargar imagen
        <br />
        <span className="text-white/40 text-[10px]">Intenta regenerar el diseño</span>
      </div>
      {/* Botón de reintentar manual */}
      <button
        onClick={() => {
          setRetryCount(0);
          setMediaError(null);
          // Forzar re-render cambiando la key del componente
          const flyerContainer = document.getElementById('flyer-container-mobile');
          if (flyerContainer) {
            flyerContainer.style.display = 'none';
            setTimeout(() => {
              flyerContainer.style.display = '';
            }, 50);
          }
        }}
        className="mt-4 px-4 py-2 bg-blue-500/30 hover:bg-blue-500/50 text-blue-300 text-xs font-mono rounded-lg border border-blue-500/30 transition-colors"
      >
        🔄 Reintentar
      </button>
    </div>
  );
  
  // Efecto para recolorar el logo cuando cambia el color
  useEffect(() => {
    if (!logoUrl || !logoColor) {
      setRecoloredLogoUrl(null);
      return;
    }

    const recolorLogo = async () => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = logoUrl;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;

        // Dibujar la imagen original
        ctx.drawImage(img, 0, 0);

        // Obtener los datos de la imagen
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Convertir hex a RGB
        const hex = logoColor.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Recorrer cada píxel y aplicar el color solo a los píxeles no transparentes
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          
          if (alpha > 0) {
            // Calcular la luminosidad del píxel original
            const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
            
            // Aplicar el color con la luminosidad como opacidad
            data[i] = r * lum;     // R
            data[i + 1] = g * lum; // G
            data[i + 2] = b * lum; // B
            // alpha permanece igual
          }
        }

        ctx.putImageData(imageData, 0, 0);
        setRecoloredLogoUrl(canvas.toDataURL('image/png'));
      };
    };

    recolorLogo();
  }, [logoUrl, logoColor]);
  
  // Auto-show comparison when HD image is generated - solo la primera vez
  useEffect(() => {
    if (draftImageUrl && hdImageUrl && !showComparison && !hasShownComparison.current) {
      console.log('🎯 Auto-mostrando comparación Draft vs HD (imagen)');
      hasShownComparison.current = true;
      setShowComparison(true);
    }
  }, [draftImageUrl, hdImageUrl, showComparison]);
  
  // Auto-show video comparison when HD video is generated - solo la primera vez
  useEffect(() => {
    if (draftVideoUrl && hdVideoUrl && !showVideoComparison && !hasShownVideoComparison.current) {
      console.log('🎯 Auto-mostrando comparación Draft vs HD (video)');
      hasShownVideoComparison.current = true;
      setShowVideoComparison(true);
    }
  }, [draftVideoUrl, hdVideoUrl, showVideoComparison]);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);

  const defaultStyles: TextStyleOptions = {
    fontSize: 24,
    fontFamily: 'Inter, sans-serif',
    fontWeight: 'bold',
    textColor: '#FFFFFF',
    backgroundColor: 'transparent',
    letterSpacing: 0,
    textTransform: 'none',
    lineWidth: 200,
    effects: {
      shadow: true,
      stroke: false,
      glow: false
    }
  };
  
  const displayStyles = textStyles || defaultStyles;

  // Sincronizar texto local cuando cambia overlayText (solo si no está editando)
  useEffect(() => {
    // Solo actualizar si no estamos editando Y el texto cambió significativamente
    if (!isEditing) {
      const newText = overlayText || initialOverlayText || '';
      if (newText !== localText) {
        setLocalText(newText);
      }
    }
  }, [overlayText, initialOverlayText, isEditing]);

  // Obtener contenedor del flyer
  const getFlyerContainer = (): HTMLElement | null => {
    if (viewMode === 'desktop') {
      return flyerContainerRef.current?.querySelector('.flyer-inner-container') as HTMLElement || flyerContainerRef.current;
    }
    return flyerContainerRef.current;
  };

  // Iniciar arrastre
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isEditing) return;
    
    // IMPORTANTE: Prevenir comportamiento por defecto y propagación
    e.preventDefault();
    e.stopPropagation();
    
    const container = getFlyerContainer();
    if (!container) return;

    dragInfo.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      hasMoved: false,
      initialPosX: textPosition.x,
      initialPosY: textPosition.y
    };
    
    console.log('🖱️ Texto drag started', dragInfo.current);
  }, [textPosition, isEditing]);

  // Mover texto
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Handle resize
    if (resizeInfo.current.isResizing) {
      const container = getFlyerContainer();
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const deltaX = e.clientX - resizeInfo.current.startX;
      const deltaY = e.clientY - resizeInfo.current.startY;
      
      let newWidth = resizeInfo.current.startWidth;
      let newHeight = resizeInfo.current.startHeight;
      let newPosX = resizeInfo.current.startPosX;
      let newPosY = resizeInfo.current.startPosY;
      
      const direction = resizeInfo.current.direction;
      
      // Calcular nuevos valores según la dirección
      if (direction.includes('e')) {
        newWidth = Math.max(100, resizeInfo.current.startWidth + deltaX);
      }
      if (direction.includes('w')) {
        const widthChange = Math.min(deltaX, resizeInfo.current.startWidth - 100);
        newWidth = resizeInfo.current.startWidth - widthChange;
        newPosX = resizeInfo.current.startPosX + (widthChange / rect.width) * 50;
      }
      if (direction.includes('s')) {
        newHeight = Math.max(60, resizeInfo.current.startHeight + deltaY);
      }
      if (direction.includes('n')) {
        const heightChange = Math.min(deltaY, resizeInfo.current.startHeight - 60);
        newHeight = resizeInfo.current.startHeight - heightChange;
        newPosY = resizeInfo.current.startPosY + (heightChange / rect.height) * 50;
      }
      
      // Limitar posición
      newPosX = Math.max(5, Math.min(95, newPosX));
      newPosY = Math.max(5, Math.min(95, newPosY));
      
      setTextDimensions({ width: newWidth, height: newHeight });
      if (setTextPosition) {
        setTextPosition({ x: newPosX, y: newPosY });
      }
      if (setTextStyles) {
        setTextStyles({ ...displayStyles, lineWidth: newWidth });
      }
      
      return;
    }
    
    // Handle drag
    if (!dragInfo.current.isDragging) return;

    const deltaX = e.clientX - dragInfo.current.startX;
    const deltaY = e.clientY - dragInfo.current.startY;
    
    // Detectar si es un arrastre (más de 3 pixels)
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      dragInfo.current.hasMoved = true;
    }

    if (dragInfo.current.hasMoved && setTextPosition) {
      const container = getFlyerContainer();
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;
      
      let newX = dragInfo.current.initialPosX + deltaXPercent;
      let newY = dragInfo.current.initialPosY + deltaYPercent;
      
      newX = Math.max(5, Math.min(95, newX));
      newY = Math.max(5, Math.min(95, newY));
      
      // Usar ref para evitar stale closures
      const newPosition = { x: newX, y: newY };
      setTextPosition(newPosition);
      console.log('📍 Texto movido a:', newPosition);
    }
  }, [displayStyles, setTextPosition, setTextStyles]);

  // Finalizar arrastre/resize
  const handleMouseUp = useCallback(() => {
    if (resizeInfo.current.isResizing) {
      resizeInfo.current.isResizing = false;
    }
    if (dragInfo.current.isDragging) {
      dragInfo.current.isDragging = false;
      
      // Si no hubo movimiento, activar edición
      if (!dragInfo.current.hasMoved && !isEditing) {
        setIsEditing(true);
        setTimeout(() => {
          textAreaRef.current?.focus();
        }, 10);
      }
    }
  }, [isEditing]);

  // ========== DRAG & DROP PARA LOGO (IGUAL QUE TEXTO) ==========
  const logoDragInfo = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    hasMoved: false,
    initialPosX: 0,
    initialPosY: 0
  });

  // Logo resize info
  const logoResizeInfo = useRef({
    isResizing: false,
    direction: '',
    startX: 0,
    startY: 0,
    startWidth: 80,
    startPosX: 0,
    startPosY: 0
  });

  const handleLogoMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const container = getFlyerContainer();
    if (!container) return;

    logoDragInfo.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      hasMoved: false,
      initialPosX: logoPosition.x,
      initialPosY: logoPosition.y
    };
    
    console.log('🖱️ Logo drag started', logoDragInfo.current);
  }, [logoPosition]);

  const handleLogoMouseMove = useCallback((e: MouseEvent) => {
    // Handle logo resize
    if (logoResizeInfo.current.isResizing) {
      const container = getFlyerContainer();
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const deltaX = e.clientX - logoResizeInfo.current.startX;
      const deltaY = e.clientY - logoResizeInfo.current.startY;
      
      let newWidth = logoResizeInfo.current.startWidth;
      
      // Solo redimensionar en dirección east (ancho)
      if (logoResizeInfo.current.direction.includes('e')) {
        newWidth = Math.max(40, Math.min(200, logoResizeInfo.current.startWidth + deltaX));
      }
      if (logoResizeInfo.current.direction.includes('w')) {
        newWidth = Math.max(40, Math.min(200, logoResizeInfo.current.startWidth - deltaX));
      }
      
      // Solo vertical (alto) si es necesario
      if (logoResizeInfo.current.direction.includes('s')) {
        // El alto se ajusta automáticamente con objectFit: contain
      }
      
      const newPosition = { ...logoPosition, width: newWidth };
      setLogoPosition(newPosition);
      return;
    }
    
    // Handle logo drag
    if (!logoDragInfo.current.isDragging) return;

    const deltaX = e.clientX - logoDragInfo.current.startX;
    const deltaY = e.clientY - logoDragInfo.current.startY;
    
    // Detectar si es un arrastre (más de 3 pixels)
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      logoDragInfo.current.hasMoved = true;
    }

    if (logoDragInfo.current.hasMoved && setLogoPosition) {
      const container = getFlyerContainer();
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;
      
      let newX = logoDragInfo.current.initialPosX + deltaXPercent;
      let newY = logoDragInfo.current.initialPosY + deltaYPercent;
      
      newX = Math.max(5, Math.min(95, newX));
      newY = Math.max(5, Math.min(95, newY));
      
      const newPosition = { ...logoPosition, x: newX, y: newY };
      setLogoPosition(newPosition);
    }
  }, [logoPosition, setLogoPosition]);

  const handleLogoMouseUp = useCallback(() => {
    if (logoResizeInfo.current.isResizing) {
      logoResizeInfo.current.isResizing = false;
    }
    if (logoDragInfo.current.isDragging) {
      logoDragInfo.current.isDragging = false;
    }
  }, []);

  // Logo resize start
  const handleLogoResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    logoResizeInfo.current = {
      isResizing: true,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: logoPosition.width,
      startPosX: logoPosition.x,
      startPosY: logoPosition.y
    };
  }, [logoPosition]);

  // ========== DRAG & DROP PARA PRODUCTO ==========
  const productDragInfo = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    hasMoved: false,
    initialPos: productPosition
  });

  const handleProductMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (editingProduct) return;

    const container = getFlyerContainer();
    if (!container) return;

    productDragInfo.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      hasMoved: false,
      initialPos: { ...productPosition }
    };
    
    console.log('🖱️ Product drag started', productDragInfo.current);
  }, [productPosition, editingProduct]);

  const handleProductMouseMove = useCallback((e: MouseEvent) => {
    if (!productDragInfo.current.isDragging) return;

    const deltaX = e.clientX - productDragInfo.current.startX;
    const deltaY = e.clientY - productDragInfo.current.startY;
    
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      productDragInfo.current.hasMoved = true;
    }

    if (productDragInfo.current.hasMoved && setProductPosition) {
      const container = getFlyerContainer();
      if (!container) return;

      const rect = container.getBoundingClientRect();
      // Movimiento 1:1 (100% del movimiento del mouse)
      const deltaXPercent = (deltaX / rect.width) * 100;
      const deltaYPercent = (deltaY / rect.height) * 100;
      
      let newX = productDragInfo.current.initialPos.x + deltaXPercent;
      let newY = productDragInfo.current.initialPos.y + deltaYPercent;
      
      newX = Math.max(0, Math.min(80, newX));
      newY = Math.max(0, Math.min(80, newY));
      
      const newPosition = { x: newX, y: newY, width: productDragInfo.current.initialPos.width, height: productDragInfo.current.initialPos.height };
      setProductPosition(newPosition);
      productDragInfo.current.initialPos = newPosition;
    }
  }, [setProductPosition]);

  const handleProductMouseUp = useCallback(() => {
    if (productDragInfo.current.isDragging) {
      productDragInfo.current.isDragging = false;
      
      if (!productDragInfo.current.hasMoved && !editingProduct) {
        setEditingProduct(true);
      }
    }
  }, [editingProduct]);

  // Iniciar resize
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    resizeInfo.current = {
      isResizing: true,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: textDimensions.width,
      startHeight: textDimensions.height,
      startPosX: textPosition.x,
      startPosY: textPosition.y
    };
  }, [textDimensions, textPosition]);

  // ========== GESTOS TÁCTILES CON 2 DEDOS ==========
  // Calcular distancia entre 2 puntos táctiles
  const getTouchDistance = (touches: TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Calcular ángulo de rotación entre 2 puntos táctiles
  const getTouchRotation = (touches: TouchList): number => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  // Manejar inicio de gesto pinch/rotate para TEXTO
  const handleTextTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      pinchInfo.current = {
        isPinching: true,
        initialDistance: getTouchDistance(e.touches),
        initialRotation: textRotation,
        initialScale: textScale,
        initialRotationAngle: getTouchRotation(e.touches)
      };
    }
  }, [textRotation, textScale]);

  // Manejar movimiento de gesto pinch/rotate para TEXTO
  const handleTextTouchMove = useCallback((e: React.TouchEvent) => {
    if (pinchInfo.current.isPinching && e.touches.length === 2) {
      e.preventDefault();
      
      // Calcular nuevo scale (zoom)
      const currentDistance = getTouchDistance(e.touches);
      const scaleFactor = currentDistance / pinchInfo.current.initialDistance;
      const newScale = Math.max(0.5, Math.min(3, pinchInfo.current.initialScale * scaleFactor));
      setTextScale(newScale);
      
      // Calcular nueva rotación
      const currentRotation = getTouchRotation(e.touches);
      const rotationDelta = currentRotation - pinchInfo.current.initialRotationAngle;
      setTextRotation(pinchInfo.current.initialRotation + rotationDelta);
    }
  }, []);

  // Manejar fin de gesto pinch/rotate para TEXTO
  const handleTextTouchEnd = useCallback(() => {
    pinchInfo.current.isPinching = false;
  }, []);

  // Manejar inicio de gesto pinch/rotate para LOGO
  const handleLogoTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      pinchInfo.current = {
        isPinching: true,
        initialDistance: getTouchDistance(e.touches),
        initialRotation: logoRotation,
        initialScale: logoScale,
        initialRotationAngle: getTouchRotation(e.touches)
      };
    }
  }, [logoRotation, logoScale]);

  // Manejar movimiento de gesto pinch/rotate para LOGO
  const handleLogoTouchMove = useCallback((e: React.TouchEvent) => {
    if (pinchInfo.current.isPinching && e.touches.length === 2) {
      e.preventDefault();
      
      const currentDistance = getTouchDistance(e.touches);
      const scaleFactor = currentDistance / pinchInfo.current.initialDistance;
      const newScale = Math.max(0.5, Math.min(3, pinchInfo.current.initialScale * scaleFactor));
      setLogoScale(newScale);
      
      const currentRotation = getTouchRotation(e.touches);
      const rotationDelta = currentRotation - pinchInfo.current.initialRotationAngle;
      setLogoRotation(pinchInfo.current.initialRotation + rotationDelta);
    }
  }, []);

  // Manejar fin de gesto pinch/rotate para LOGO
  const handleLogoTouchEnd = useCallback(() => {
    pinchInfo.current.isPinching = false;
  }, []);

  // Manejar inicio de gesto pinch/rotate para PRODUCTO
  const handleProductTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      pinchInfo.current = {
        isPinching: true,
        initialDistance: getTouchDistance(e.touches),
        initialRotation: productRotation,
        initialScale: productScale,
        initialRotationAngle: getTouchRotation(e.touches)
      };
    }
  }, [productRotation, productScale]);

  // Manejar movimiento de gesto pinch/rotate para PRODUCTO
  const handleProductTouchMove = useCallback((e: React.TouchEvent) => {
    if (pinchInfo.current.isPinching && e.touches.length === 2) {
      e.preventDefault();
      
      const currentDistance = getTouchDistance(e.touches);
      const scaleFactor = currentDistance / pinchInfo.current.initialDistance;
      const newScale = Math.max(0.5, Math.min(3, pinchInfo.current.initialScale * scaleFactor));
      setProductScale(newScale);
      
      const currentRotation = getTouchRotation(e.touches);
      const rotationDelta = currentRotation - pinchInfo.current.initialRotationAngle;
      setProductRotation(pinchInfo.current.initialRotation + rotationDelta);
    }
  }, []);

  // Manejar fin de gesto pinch/rotate para PRODUCTO
  const handleProductTouchEnd = useCallback(() => {
    pinchInfo.current.isPinching = false;
  }, []);

  // Double tap para editar texto
  const lastTapRef = useRef<number>(0);
  const handleTextDoubleTap = useCallback((e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapRef.current;
    
    if (tapLength < 300 && tapLength > 0) {
      // Double tap detectado - activar edición
      e.preventDefault();
      setIsEditing(true);
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 10);
    }
    lastTapRef.current = currentTime;
  }, []);

  // Event listener global para ocultar handles al hacer click fuera (solo una vez)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Verificar si el click fue en el logo o sus handles
      const target = e.target as HTMLElement;
      const isLogoClick = target.closest('.logo-container');
      const isLogoHandleClick = target.closest('.logo-handle');
      const isResizeHandleClick = target.closest('.resize-handle');
      
      if (!isLogoClick && !isLogoHandleClick && !isResizeHandleClick && !isDraggingLogo) {
        setShowLogoHandles(false);
        setEditingLogo(false);
      }
    };

    document.addEventListener('mousedown', handleGlobalClick);

    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
    };
  }, [isDraggingLogo]);

  // Event listeners globales - usar refs para evitar re-registros
  useEffect(() => {
    const handleAllMouseMove = (e: MouseEvent) => {
      handleMouseMove(e);
      handleLogoMouseMove(e);
      handleProductMouseMove(e);
    };
    
    const handleAllMouseUp = (e: MouseEvent) => {
      handleMouseUp();
      handleLogoMouseUp();
      handleProductMouseUp();
    };

    document.addEventListener('mousemove', handleAllMouseMove);
    document.addEventListener('mouseup', handleAllMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleAllMouseMove);
      document.removeEventListener('mouseup', handleAllMouseUp);
    };
  }, [handleMouseMove, handleLogoMouseMove, handleProductMouseMove, handleMouseUp, handleLogoMouseUp, handleProductMouseUp]);

  // Guardar edición
  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (setOverlayText) {
      setOverlayText(localText);
    }
  }, [localText, setOverlayText]);

  // Guardar cambios del textarea en tiempo real
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalText(e.target.value);
  }, []);

  // Generar estilos del texto
  const getTextStyles = () => {
    const style: React.CSSProperties = {
      fontFamily: displayStyles.fontFamily,
      fontSize: `${displayStyles.fontSize}px`,
      fontWeight: displayStyles.fontWeight,
      color: displayStyles.textColor,
      letterSpacing: `${displayStyles.letterSpacing}px`,
      textTransform: displayStyles.textTransform,
      backgroundColor: displayStyles.backgroundColor !== 'transparent' ? displayStyles.backgroundColor : undefined,
      padding: displayStyles.backgroundColor !== 'transparent' ? '8px 16px' : undefined,
      borderRadius: displayStyles.backgroundColor !== 'transparent' ? '8px' : undefined,
      cursor: isEditing ? 'text' : 'grab',
      zIndex: 100,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      textAlign: 'center',
      userSelect: 'none',
      pointerEvents: 'auto',
      outline: 'none',
      lineHeight: '1.4',
    };

    const shadows: string[] = [];
    if (displayStyles.effects.shadow) {
      shadows.push('2px 2px 4px rgba(0,0,0,0.8)');
    }
    if (displayStyles.effects.glow) {
      shadows.push(`0 0 10px ${displayStyles.textColor}`);
    }
    if (shadows.length > 0) {
      style.textShadow = shadows.join(', ');
    }

    if (displayStyles.effects.stroke) {
      style.WebkitTextStroke = `2px ${displayStyles.textColor}`;
    }

    return style;
  };

  // Componente de handles de resize - SIMPLIFICADO
  const ResizeHandles = () => {
    if (!isEditing) return null;
    
    const handleStyle: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: '#3B82F6',
      zIndex: 201,
    };
    
    const handleSize = 10;
    
    return (
      <>
        {/* Esquina NW */}
        <div
          style={{
            ...handleStyle,
            width: handleSize,
            height: handleSize,
            top: -handleSize / 2,
            left: -handleSize / 2,
            cursor: 'nw-resize',
          }}
          onMouseDown={(e) => handleResizeStart(e, 'nw')}
        />
        
        {/* Esquina NE */}
        <div
          style={{
            ...handleStyle,
            width: handleSize,
            height: handleSize,
            top: -handleSize / 2,
            right: -handleSize / 2,
            cursor: 'ne-resize',
          }}
          onMouseDown={(e) => handleResizeStart(e, 'ne')}
        />
        
        {/* Esquina SW */}
        <div
          style={{
            ...handleStyle,
            width: handleSize,
            height: handleSize,
            bottom: -handleSize / 2,
            left: -handleSize / 2,
            cursor: 'sw-resize',
          }}
          onMouseDown={(e) => handleResizeStart(e, 'sw')}
        />
        
        {/* Esquina SE */}
        <div
          style={{
            ...handleStyle,
            width: handleSize,
            height: handleSize,
            bottom: -handleSize / 2,
            right: -handleSize / 2,
            cursor: 'se-resize',
          }}
          onMouseDown={(e) => handleResizeStart(e, 'se')}
        />
        
        {/* Lado Top */}
        <div
          style={{
            ...handleStyle,
            width: '100%',
            height: handleSize / 2,
            top: -handleSize / 2,
            left: 0,
            cursor: 'n-resize',
            backgroundColor: 'transparent',
          }}
          onMouseDown={(e) => handleResizeStart(e, 'n')}
        />
        
        {/* Lado Bottom */}
        <div
          style={{
            ...handleStyle,
            width: '100%',
            height: handleSize / 2,
            bottom: -handleSize / 2,
            left: 0,
            cursor: 's-resize',
            backgroundColor: 'transparent',
          }}
          onMouseDown={(e) => handleResizeStart(e, 's')}
        />
        
        {/* Lado Left */}
        <div
          style={{
            ...handleStyle,
            width: handleSize / 2,
            height: '100%',
            left: -handleSize / 2,
            top: 0,
            cursor: 'w-resize',
            backgroundColor: 'transparent',
          }}
          onMouseDown={(e) => handleResizeStart(e, 'w')}
        />
        
        {/* Lado Right */}
        <div
          style={{
            ...handleStyle,
            width: handleSize / 2,
            height: '100%',
            right: -handleSize / 2,
            top: 0,
            cursor: 'e-resize',
            backgroundColor: 'transparent',
          }}
          onMouseDown={(e) => handleResizeStart(e, 'e')}
        />
      </>
    );
  };

  // Loading state
  if (status.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full font-mono">
        <div className="w-64 bg-black/50 backdrop-blur border border-white/10 rounded-lg p-4 shadow-2xl">
          <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] text-white/30 ml-auto">NUCLEO_ESTUDIO_56</span>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-green-400 flex gap-2">
              <span>➜</span>
              <span>Iniciando_Secuencia_Gen()</span>
            </div>
            <div className="text-xs text-white/50 flex gap-2">
              <span>ℹ</span>
              <span className="animate-pulse">{status.message}</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-4">
              <div className="h-full bg-blue-500 animate-[shimmer_1s_infinite] w-[60%]"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Loading indicator for retry
  if (isRetrying) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full font-mono">
        <div className="w-48 bg-black/50 backdrop-blur border border-yellow-500/30 rounded-lg p-4 shadow-2xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
            <span className="text-[10px] text-yellow-400">REINTENTANDO CARGA...</span>
          </div>
          <div className="text-xs text-white/50">
            Intento {retryCount}/3
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-yellow-500 animate-pulse" style={{ width: `${(retryCount / 3) * 100}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!imageUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white w-full">
        <div className="text-5xl md:text-6xl mb-4 opacity-30">✨</div>
        <p className="text-sm md:text-base font-mono tracking-wider text-center px-4">
          Bienvenido a Estudio 56
        </p>
        <p className="text-xs text-white/40 mt-2 text-center px-4">
          Ingresa tu descripción para comenzar
        </p>
      </div>
    );
  }

  // ========== RENDERIZAR LOGO ==========
  // Logo resize handles
  const LogoResizeHandles = () => {
    const handleStyle: React.CSSProperties = {
      position: 'absolute',
      backgroundColor: '#22c55e',
      zIndex: 201,
    };
    
    const handleSize = 12;
    
    return (
      <div className="logo-handle" style={{ position: 'absolute', inset: -6 }}>
        {/* Esquina SE - para agrandar */}
        <div
          className="resize-handle"
          style={{
            ...handleStyle,
            width: handleSize,
            height: handleSize,
            bottom: -handleSize / 2,
            right: -handleSize / 2,
            cursor: 'se-resize',
            borderRadius: '50%',
            position: 'absolute',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLogoResizeStart(e, 'se');
          }}
        />
        {/* Esquina SW */}
        <div
          className="resize-handle"
          style={{
            ...handleStyle,
            width: handleSize,
            height: handleSize,
            bottom: -handleSize / 2,
            left: -handleSize / 2,
            cursor: 'sw-resize',
            borderRadius: '50%',
            position: 'absolute',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLogoResizeStart(e, 'sw');
          }}
        />
        {/* Esquina NE */}
        <div
          className="resize-handle"
          style={{
            ...handleStyle,
            width: handleSize,
            height: handleSize,
            top: -handleSize / 2,
            right: -handleSize / 2,
            cursor: 'ne-resize',
            borderRadius: '50%',
            position: 'absolute',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLogoResizeStart(e, 'ne');
          }}
        />
        {/* Esquina NW */}
        <div
          className="resize-handle"
          style={{
            ...handleStyle,
            width: handleSize,
            height: handleSize,
            top: -handleSize / 2,
            left: -handleSize / 2,
            cursor: 'nw-resize',
            borderRadius: '50%',
            position: 'absolute',
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLogoResizeStart(e, 'nw');
          }}
        />
      </div>
    );
  };

  const renderLogo = () => {
    if (!logoUrl) return null;

    // Usar props o valores por defecto
    const filters = logoFilters || { grayscale: 0, brightness: 100, contrast: 100, opacity: 100 };
    const color = logoColor;
    
    // Construir filtros CSS
    const filterString = [
      filters.grayscale > 0 ? `grayscale(${filters.grayscale}%)` : '',
      filters.brightness !== 100 ? `brightness(${filters.brightness}%)` : '',
      filters.contrast !== 100 ? `contrast(${filters.contrast}%)` : '',
      filters.opacity !== 100 ? `opacity(${filters.opacity}%)` : '',
    ].filter(Boolean).join(' ');

    // Usar la imagen recoloreada si existe, sino la original
    const imageToShow = recoloredLogoUrl || logoUrl;

    return (
      <div
        className="logo-container"
        style={{
          position: 'absolute',
          left: `${logoPosition.x}%`,
          top: `${logoPosition.y}%`,
          transform: `translate(-50%, -50%) rotate(${logoRotation}deg) scale(${logoScale})`,
          zIndex: 50,
          cursor: isDraggingLogo ? 'grabbing' : 'grab',
          opacity: 0.9,
          userSelect: 'none',
          pointerEvents: 'auto',
          // Área de toque aumentada para mobile (padding invisible clickeable)
          padding: '16px',
          margin: '-16px',
          transition: pinchInfo.current.isPinching ? 'none' : 'transform 0.2s ease',
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowLogoHandles(true);
          handleLogoMouseDown(e);
        }}
        onMouseUp={() => {
          handleLogoMouseUp();
        }}
        onMouseLeave={() => {
          handleLogoMouseUp();
        }}
        // GESTOS TÁCTILES CON 2 DEDOS
        onTouchStart={handleLogoTouchStart}
        onTouchMove={handleLogoTouchMove}
        onTouchEnd={handleLogoTouchEnd}
      >
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={imageToShow}
            alt="Logo"
            draggable={false}
            style={{
              width: `${logoPosition.width}px`,
              maxWidth: '200px',
              objectFit: 'contain',
              filter: filterString || 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              pointerEvents: 'none',
              border: showLogoHandles ? '2px solid #22c55e' : '2px solid transparent',
              borderRadius: '8px',
            }}
          />
          {/* Logo resize handles - solo visibles cuando showLogoHandles es true */}
          {showLogoHandles && (
            <div className="logo-handle">
              <LogoResizeHandles />
            </div>
          )}
        </div>
        {/* Indicador visual de que es editable - solo visible en mobile */}
        <div className="lg:hidden absolute inset-0 -m-3 border-2 border-dashed border-white/30 rounded-lg opacity-50 pointer-events-none" />
        {showLogoHandles && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-50">
            🎯 Arrastra para mover
          </div>
        )}
      </div>
    );
  };

  // ========== RENDERIZAR PRODUCTO ==========
  const renderProduct = () => {
    if (!productUrl) return null;

    return (
      <div
        style={{
          position: 'absolute',
          left: `${productPosition.x}%`,
          top: `${productPosition.y}%`,
          transform: `translate(-50%, -50%) rotate(${productRotation}deg) scale(${productScale})`,
          zIndex: 45,
          cursor: editingProduct ? 'move' : 'grab',
          userSelect: 'none',
          pointerEvents: 'auto',
          // Área de toque aumentada para mobile
          padding: '20px',
          margin: '-20px',
          transition: pinchInfo.current.isPinching ? 'none' : 'transform 0.2s ease',
        }}
        onMouseDown={handleProductMouseDown}
        onMouseUp={handleProductMouseUp}
        // GESTOS TÁCTILES CON 2 DEDOS
        onTouchStart={handleProductTouchStart}
        onTouchMove={handleProductTouchMove}
        onTouchEnd={handleProductTouchEnd}
      >
        <img
          src={productUrl}
          alt="Producto"
          draggable={false}
          style={{
            width: `${productPosition.width}px`,
            height: `${productPosition.height}px`,
            maxWidth: '200px',
            maxHeight: '200px',
            objectFit: 'contain',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
            border: editingProduct ? '2px solid #22c55e' : '2px solid transparent',
          }}
        />
        {/* Indicador visual de que es editable - solo visible en mobile */}
        <div className="lg:hidden absolute inset-0 -m-2 border-2 border-dashed border-white/30 rounded-lg opacity-50 pointer-events-none" />
        {editingProduct && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap z-50">
            🎯 Arrastra para mover
          </div>
        )}
      </div>
    );
  };

  // Componente de texto - SIMPLIFICADO
  const renderText = (isComparisonDraft: boolean = false) => {
    const displayText = localText || overlayText || initialOverlayText || '';
    
    if (!displayText) return null;

    // Calcular escala para comparación de borrador
    // HD: 320px, Draft: 200px → escala = 200/320 = 0.625
    const comparisonScale = 0.625;
    const scaleFactor = isComparisonDraft ? comparisonScale : 1;

    if (isEditing && !isComparisonDraft) {
      return (
        <div
          style={{
            position: 'absolute',
            left: `${textPosition.x}%`,
            top: `${textPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 200,
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <textarea
              ref={textAreaRef}
              value={displayText}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                ...getTextStyles(),
                width: textDimensions.width,
                minHeight: textDimensions.height,
                backgroundColor: 'rgba(0,0,0,0.95)',
                border: '2px solid #3B82F6',
                overflow: 'hidden',
                cursor: 'text',
                resize: 'none',
                display: 'block',
              }}
              onMouseDown={(e) => e.stopPropagation()}
            />
            <ResizeHandles />
          </div>
        </div>
      );
    }

    const scaledFontSize = displayStyles.fontSize * scaleFactor;
    const scaledLineWidth = displayStyles.lineWidth * scaleFactor;
    const scaledLetterSpacing = displayStyles.letterSpacing * scaleFactor;

    // Calcular efectos escalados
    const scaledShadowBlur = 8 * scaleFactor;
    const scaledShadowOffset = 4 * scaleFactor;
    const scaledStrokeWidth = 3 * scaleFactor;
    const scaledGlowBlur = 20 * scaleFactor;

    // Construir textShadow igual que en TextEditorPanel
    const shadows: string[] = [];
    if (displayStyles.effects.shadow) {
      shadows.push(`${scaledShadowOffset}px ${scaledShadowOffset}px ${scaledShadowBlur}px rgba(0,0,0,0.8)`);
    }
    if (displayStyles.effects.glow) {
      shadows.push(`0 0 ${scaledGlowBlur}px ${displayStyles.textColor}`);
    }
    const textShadowValue = shadows.length > 0 ? shadows.join(', ') : undefined;

    return (
      <div
        style={{
          fontFamily: displayStyles.fontFamily,
          fontSize: `${scaledFontSize}px`,
          fontWeight: displayStyles.fontWeight,
          color: displayStyles.textColor,
          letterSpacing: `${scaledLetterSpacing}px`,
          textTransform: displayStyles.textTransform,
          backgroundColor: displayStyles.backgroundColor !== 'transparent' ? displayStyles.backgroundColor : undefined,
          padding: displayStyles.backgroundColor !== 'transparent'
            ? `${8 * scaleFactor + 16}px ${16 * scaleFactor + 16}px`
            : '16px',
          borderRadius: displayStyles.backgroundColor !== 'transparent' ? `${8 * scaleFactor}px` : undefined,
          cursor: isComparisonDraft ? 'default' : 'grab',
          zIndex: 100,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          textAlign: 'center',
          pointerEvents: 'auto',
          outline: 'none',
          lineHeight: '1.4',
          position: 'absolute',
          left: `${textPosition.x}%`,
          top: `${textPosition.y}%`,
          transform: `translate(-50%, -50%) rotate(${textRotation}deg) scale(${textScale})`,
          width: `${scaledLineWidth}px`,
          minHeight: `${40 * scaleFactor}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          WebkitUserSelect: 'none',
          transition: pinchInfo.current.isPinching ? 'none' : 'transform 0.2s ease',
          // EFECTOS DE TEXTO
          textShadow: textShadowValue,
          WebkitTextStroke: displayStyles.effects.stroke ? `${scaledStrokeWidth}px ${displayStyles.textColor}` : undefined,
          filter: displayStyles.effects.glow ? `drop-shadow(0 0 ${scaledGlowBlur}px ${displayStyles.textColor})` : undefined,
        }}
        onMouseDown={isComparisonDraft ? undefined : handleMouseDown}
        onTouchStart={(e) => {
          setIsTextTouching(true);
          if (!isComparisonDraft) {
            if (e.touches.length === 1) {
              e.preventDefault();
              const touch = e.touches[0];
              handleMouseDown({
                clientX: touch.clientX,
                clientY: touch.clientY,
                preventDefault: () => {},
                stopPropagation: () => {},
              } as any);
            }
            handleTextTouchStart(e);
          }
        }}
        onTouchMove={isComparisonDraft ? undefined : handleTextTouchMove}
        onTouchEnd={() => {
          setIsTextTouching(false);
          handleTextTouchEnd();
        }}
      >
        {/* Indicador visual de que es editable - visible en mobile y cuando se toca */}
        <span
          className={`
            lg:hidden absolute inset-0 -m-4 border-2 border-dashed rounded-lg pointer-events-none transition-all duration-150
            ${isTextTouching
              ? 'border-blue-400 bg-blue-400/10 opacity-80 scale-105'
              : 'border-white/40 opacity-50'
            }
          `}
          style={{ margin: '-16px' }}
        />
        {displayText}
      </div>
    );
  };

  // ========== RENDERIZAR LOGO PARA COMPARACIÓN ==========
  const renderLogoComparison = (isDraft: boolean) => {
    if (!logoUrl) return null;

    // Escala: Draft (200px) vs HD (320px) = 0.625
    const comparisonScale = 0.625;
    const scaleFactor = isDraft ? comparisonScale : 1;
    const scaledWidth = logoPosition.width * scaleFactor;

    // Usar la imagen recoloreada si existe
    const imageToShow = recoloredLogoUrl || logoUrl;

    return (
      <div
        style={{
          position: 'absolute',
          left: `${logoPosition.x}%`,
          top: `${logoPosition.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          cursor: 'default',
          opacity: 0.9,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <img
          src={imageToShow}
          alt="Logo"
          draggable={false}
          style={{
            width: `${scaledWidth}px`,
            maxWidth: '200px',
            objectFit: 'contain',
            filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
            pointerEvents: 'none',
            borderRadius: '8px',
          }}
        />
      </div>
    );
  };

  // ========== RENDERIZAR PRODUCTO PARA COMPARACIÓN ==========
  const renderProductComparison = (isDraft: boolean) => {
    if (!productUrl) return null;

    // Escala: Draft (200px) vs HD (320px) = 0.625
    const comparisonScale = 0.625;
    const scaleFactor = isDraft ? comparisonScale : 1;
    const scaledWidth = productPosition.width * scaleFactor;
    const scaledHeight = productPosition.height * scaleFactor;

    return (
      <div
        style={{
          position: 'absolute',
          left: `${productPosition.x}%`,
          top: `${productPosition.y}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 45,
          cursor: 'default',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <img
          src={productUrl}
          alt="Producto"
          draggable={false}
          style={{
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            maxWidth: '200px',
            maxHeight: '200px',
            objectFit: 'contain',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
          }}
        />
      </div>
    );
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start animate-fade-in">
      {/* CONTROLS - Solo visible en pantallas grandes (lg), oculto en mobile */}
      {!showComparison && (
        <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-black/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-1">
            <div className="flex items-center gap-1">
              <button onClick={() => setViewMode('mobile')} className={`px-4 py-2 rounded-xl text-[12px] font-bold ${viewMode === 'mobile' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>📱 MÓVIL</button>
              <button onClick={() => setViewMode('tablet')} className={`px-4 py-2 rounded-xl text-[12px] font-bold ${viewMode === 'tablet' ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>📱 TABLET</button>
              <button onClick={() => setViewMode('desktop')} className={`px-4 py-2 rounded-xl text-[12px] font-bold ${viewMode === 'desktop' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>💻 DESKTOP</button>
              <button onClick={() => setViewMode('clean')} className={`px-4 py-2 rounded-xl text-[12px] font-bold ${viewMode === 'clean' ? 'bg-gradient-to-r from-gray-500 to-slate-500 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>🧹 CRUDO</button>
            </div>
          </div>
        </div>
      )}

      {/* CERRAR COMPARACIÓN DE IMÁGENES */}
      {showComparison && !showVideoComparison && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => setShowComparison(false)}
            className="bg-red-500/20 backdrop-blur-xl border border-red-500/50 text-red-300 px-4 py-2 rounded-xl text-[12px] font-bold hover:bg-red-500/30 transition-all"
          >
            ✕ CERRAR COMPARACIÓN (IMAGEN)
          </button>
        </div>
      )}
      
      {/* CERRAR COMPARACIÓN DE VIDEOS */}
      {showVideoComparison && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => setShowVideoComparison(false)}
            className="bg-red-500/20 backdrop-blur-xl border border-red-500/50 text-red-300 px-4 py-2 rounded-xl text-[12px] font-bold hover:bg-red-500/30 transition-all"
          >
            ✕ CERRAR COMPARACIÓN (VIDEO)
          </button>
        </div>
      )}

      {/* DRAFT BADGE */}
      {isDraft && !showComparison && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-[60] bg-yellow-500/90 backdrop-blur text-black text-[10px] font-mono font-bold px-3 py-1 rounded-sm">⚡ MODO_BORRADOR</div>
      )}
      
      {/* COMPARISON BADGE - IMÁGENES */}
      {!isDraft && typeof draftImageUrl === 'string' && draftImageUrl.length > 0 && typeof hdImageUrl === 'string' && hdImageUrl.length > 0 && showComparison && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-[60]">
          <div className="bg-blue-500/90 backdrop-blur text-white text-[10px] font-mono font-bold px-3 py-1 rounded-sm">
            <span>👁️</span> COMPARANDO BORRADOR Y HD (IMAGEN)
          </div>
        </div>
      )}
      
      {/* VIDEO COMPARISON BADGE */}
      {!isDraft && typeof draftVideoUrl === 'string' && draftVideoUrl.length > 0 && typeof hdVideoUrl === 'string' && hdVideoUrl.length > 0 && showVideoComparison && (
        <div className="absolute top-36 left-1/2 -translate-x-1/2 z-[60]">
          <div className="bg-purple-500/90 backdrop-blur text-white text-[10px] font-mono font-bold px-3 py-1 rounded-sm">
            <span>🎬</span> COMPARANDO BORRADOR Y HD (VIDEO)
          </div>
        </div>
      )}

      {/* CANVAS - Padding aumentado arriba para que los botones no tapen la imagen */}
      <div className="w-full flex flex-col items-center justify-start px-2 md:px-0 pt-2 md:py-12 relative z-0">
        {/* VIDEO COMPARISON MODE - SIDE BY SIDE */}
        {showVideoComparison && !isDraft && typeof draftVideoUrl === 'string' && draftVideoUrl.length > 0 && typeof hdVideoUrl === 'string' && hdVideoUrl.length > 0 && (
          <div className="absolute inset-0 z-40 bg-black/95 flex items-center justify-center p-4">
            <div className="flex gap-4 lg:gap-8 items-center justify-center w-full h-full max-w-6xl">
              {/* VIDEO BORRADOR */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 text-xs font-mono font-bold">BORRADOR (16fps)</span>
                </div>
                <div
                  className={`relative bg-black rounded-[1rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] border-[4px] border-yellow-500/30 overflow-hidden
                    ${aspectRatio === '9:16' ? 'w-[200px] h-[356px]' :
                      aspectRatio === '1:1' ? 'w-[225px] h-[225px]' :
                      aspectRatio === '4:5' ? 'w-[200px] h-[250px]' :
                      'w-[200px] h-[356px]'}`}
                >
                  <div className="w-full h-full relative">
                    <video
                      src={draftVideoUrl}
                      className="w-full h-full object-cover opacity-90"
                      autoPlay
                      muted
                      loop
                      playsInline
                      crossOrigin="anonymous"
                    />
                    {/* OVERLAYS PARA BORRADOR */}
                    {renderLogoComparison(true)}
                    {renderProductComparison(true)}
                    {renderText(true)}
                  </div>
                </div>
              </div>
              
              {/* VS */}
              <div className="flex flex-col items-center">
                <span className="text-white/30 text-xl lg:text-3xl font-mono">VS</span>
              </div>
              
              {/* VIDEO HD */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-400 text-xs font-mono font-bold">HD (24fps)</span>
                </div>
                <div
                  className={`relative bg-black rounded-[1rem] shadow-[0_0_30px_rgba(16,185,129,0.3)] border-[4px] border-emerald-500/50 overflow-hidden
                    ${aspectRatio === '9:16' ? 'w-[320px] h-[569px]' :
                      aspectRatio === '1:1' ? 'w-[360px] h-[360px]' :
                      aspectRatio === '4:5' ? 'w-[320px] h-[400px]' :
                      'w-[320px] h-[569px]'}`}
                >
                  <div className="w-full h-full relative">
                    <video
                      src={hdVideoUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      crossOrigin="anonymous"
                    />
                    {/* OVERLAYS PARA HD */}
                    {renderLogoComparison(false)}
                    {renderProductComparison(false)}
                    {renderText(false)}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}
        
        {/* IMAGE COMPARISON MODE - SIDE BY SIDE */}
        {showComparison && !isDraft && typeof draftImageUrl === 'string' && draftImageUrl.length > 0 && typeof hdImageUrl === 'string' && hdImageUrl.length > 0 && !showVideoComparison && (
          <div className="absolute inset-0 z-40 bg-black/95 flex items-center justify-center p-4">
            <div className="flex gap-4 lg:gap-8 items-center justify-center w-full h-full max-w-6xl">
              {/* BORRADOR - Gemini 2.5 Flash */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 text-xs font-mono font-bold">BORRADOR</span>
                </div>
                <div
                  className={`relative bg-black rounded-[1rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] border-[4px] border-yellow-500/30 overflow-hidden
                    ${aspectRatio === '9:16' ? 'w-[200px] h-[356px]' :
                      aspectRatio === '1:1' ? 'w-[225px] h-[225px]' :
                      aspectRatio === '4:5' ? 'w-[200px] h-[250px]' :
                      'w-[200px] h-[356px]'}`}
                >
                  <div className="w-full h-full relative">
                    <img src={draftImageUrl} alt="Draft - Gemini 2.5" className="w-full h-full object-cover opacity-90" crossOrigin="anonymous" />
                    {renderLogoComparison(true)}
                    {renderProductComparison(true)}
                    {renderText(true)}
                  </div>
                </div>
              </div>
              
              {/* VS */}
              <div className="flex flex-col items-center">
                <span className="text-white/30 text-xl lg:text-3xl font-mono">VS</span>
              </div>
              
              {/* HD - Gemini 3.0 Pro */}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-400 text-xs font-mono font-bold">HD</span>
                </div>
                <div
                  className={`relative bg-black rounded-[1rem] shadow-[0_0_30px_rgba(16,185,129,0.3)] border-[4px] border-emerald-500/50 overflow-hidden
                    ${aspectRatio === '9:16' ? 'w-[320px] h-[569px]' :
                      aspectRatio === '1:1' ? 'w-[360px] h-[360px]' :
                      aspectRatio === '4:5' ? 'w-[320px] h-[400px]' :
                      'w-[320px] h-[569px]'}`}
                >
                  <div className="w-full h-full relative">
                    <img src={hdImageUrl} alt="HD - Gemini 3.0" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    {renderLogoComparison(false)}
                    {renderProductComparison(false)}
                    {renderText(false)}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}
        
        {/* VISTA MOBILE - Visible siempre en mobile - Proporcional a iPhone 17 */}
        <div
          id="flyer-container-mobile"
          className={`relative bg-black rounded-[1.5rem] shadow-[0_20px_80px_-20px_rgba(0,0,0,0.8)] border-[4px] border-[#2a2a2a] overflow-hidden flyer-download-container
            ${aspectRatio === '9:16' ? 'w-[280px] h-[498px]' :
              aspectRatio === '1:1' ? 'w-[280px] h-[280px]' :
              aspectRatio === '4:5' ? 'w-[280px] h-[350px]' :
              'w-[280px] h-[498px]'}`}
        >
          <div ref={flyerContainerRef} className="w-full h-full relative flyer-capture-target">
            {(() => {
              const needsCors = imageUrl && !imageUrl.startsWith('blob:');
              const videoSrc = imageUrl && isVideoUrl(imageUrl);
              
              if (videoSrc) {
                if (mediaError?.type === 'video' && mediaError.url === imageUrl) {
                  return renderMediaPlaceholder();
                }
                return (
                  <video
                    src={imageUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    crossOrigin={needsCors ? "anonymous" : undefined}
                    onError={(e) => handleMediaError(e, 'video')}
                  />
                );
              }
              
              if (mediaError?.type === 'image' && mediaError.url === imageUrl) {
                return renderMediaPlaceholder();
              }
              
              return (
                <img
                  src={imageUrl}
                  alt="Generated Content"
                  className="w-full h-full object-cover"
                  crossOrigin={needsCors ? "anonymous" : undefined}
                  onError={(e) => handleMediaError(e, 'image')}
                />
              );
            })()}
            {renderLogo()}
            {renderProduct()}
            {renderText()}
            
            {/* BOTÓN FLOTANTE PARA MOVER TEXTO - Solo visible en mobile */}
            <div className="lg:hidden absolute bottom-4 right-4 z-[150]">
              <button
                onClick={() => setShowTextControls(!showTextControls)}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200
                  ${showTextControls
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 backdrop-blur text-white border border-white/20'
                  }
                `}
                aria-label="Controles de texto"
              >
                <span className="text-xl">✏️</span>
              </button>
              
              {/* Menú desplegable de controles de texto */}
              {showTextControls && (
                <div className="absolute bottom-14 right-0 bg-black/90 backdrop-blur-xl rounded-xl p-3 border border-white/20 shadow-xl min-w-[160px]">
                  <div className="text-[10px] text-white/50 mb-2 font-mono uppercase tracking-wider">Texto</div>
                  
                  {/* Botón para activar edición de texto */}
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setTimeout(() => textAreaRef.current?.focus(), 100);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white text-xs transition-colors"
                  >
                    <span>📝</span>
                    <span>Editar texto</span>
                  </button>
                  
                  {/* Botón para mover texto con modo dedicado */}
                  <button
                    onClick={() => {
                      setIsDraggingText(true);
                      setShowTextControls(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white text-xs transition-colors"
                  >
                    <span>👆</span>
                    <span>Mover texto</span>
                  </button>
                  
                  {/* Indicador de posición actual */}
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <div className="text-[10px] text-white/40 font-mono">
                      Pos: {Math.round(textPosition.x)}%, {Math.round(textPosition.y)}%
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* MODO DEDICADO PARA MOVER TEXTO - Overlay que cubre toda la imagen */}
            {isDraggingText && (
              <div
                className="absolute inset-0 z-[140] bg-black/50 backdrop-blur-sm flex items-center justify-center"
                onClick={() => setIsDraggingText(false)}
                onTouchMove={(e) => {
                  // Manejar arrastre del texto mientras está activo el modo
                  const touch = e.touches[0];
                  const container = flyerContainerRef.current;
                  if (container) {
                    const rect = container.getBoundingClientRect();
                    const newX = ((touch.clientX - rect.left) / rect.width) * 100;
                    const newY = ((touch.clientY - rect.top) / rect.height) * 100;
                    const clampedX = Math.max(5, Math.min(95, newX));
                    const clampedY = Math.max(5, Math.min(95, newY));
                    if (setTextPosition) {
                      setTextPosition({ x: clampedX, y: clampedY });
                    }
                  }
                }}
                onTouchEnd={() => setIsDraggingText(false)}
              >
                {/* Instrucciones */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500/90 backdrop-blur text-white text-xs px-4 py-2 rounded-xl font-mono animate-pulse">
                  👆 Toca donde quieres el texto
                </div>
                
                {/* Preview del texto en la posición actual */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${textPosition.x}%`,
                    top: `${textPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    fontFamily: displayStyles.fontFamily,
                    fontSize: `${displayStyles.fontSize}px`,
                    fontWeight: displayStyles.fontWeight,
                    color: displayStyles.textColor,
                    textShadow: displayStyles.effects.shadow ? '2px 2px 4px rgba(0,0,0,0.8)' : undefined,
                    pointerEvents: 'none',
                    zIndex: 150,
                  }}
                >
                  {localText || overlayText || initialOverlayText || 'Texto'}
                </div>
                
                {/* Botón de cerrar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDraggingText(false);
                  }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500/80 backdrop-blur text-white text-xs px-6 py-3 rounded-xl font-mono"
                >
                  ✕ Listo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* UI DE PROGRESO DE PROCESAMIENTO DE VIDEO */}
      {isProcessingVideo && (
        <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
          <div className="w-80 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-white font-bold text-lg mb-1">Procesando Video</h3>
              <p className="text-white/60 text-sm">{processingMessage}</p>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-blue-400 text-sm font-mono">{processingProgress}%</span>
            </div>
            <p className="text-white/40 text-xs text-center mt-4">
              No cierres esta pestaña mientras procesamos tu video
            </p>
          </div>
        </div>
      )}

      {/* SPACER PEQUEÑO - Empuja los controles hacia abajo de la imagen */}
      <div className="h-4" />
      
      {/* REFINEMENT AREA - Debajo de la imagen, no superpuesto */}
      <div className="w-full max-w-[280px] flex flex-col gap-2">
        {/* Campo de refinamiento */}
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl p-2 pr-2.5 pl-3 rounded-xl border border-white/10">
          <input
            value={refineText}
            onChange={(e) => setRefineText(e.target.value)}
            placeholder="Escribe aqui los cambios"
            className="bg-transparent text-xs outline-none text-white w-full placeholder-white/30 font-light"
          />
          <button
            onClick={() => {onRefine(refineText); setRefineText('')}}
            disabled={!refineText.trim()}
            className="text-white/40 hover:text-white transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
        
        {/* Botón de refinamiento con IA */}
        <button
          onClick={() => {onRefine(refineText); setRefineText('')}}
          disabled={!refineText.trim()}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-2 px-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>✨</span>
          <span>APLICAR CAMBIOS</span>
        </button>
      </div>

      {/* BOTÓN GENERAR IMAGEN HD - Solo visible en mobile cuando hay borrador */}
      {isDraft && imageUrl && !showComparison && (
        <button
          onClick={onUpgradeToHD}
          className="w-full max-w-[280px] bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all text-xs flex items-center justify-center gap-2 mt-3 animate-pulse"
        >
          <span>✨</span>
          <span>Generar imagen HD</span>
        </button>
      )}
      
    </div>
  );
};

export default FlyerDisplay;
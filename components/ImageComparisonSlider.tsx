import React, { useState, useRef, useCallback } from 'react';

interface ImageComparisonSliderProps {
  originalImage: string;
  improvedImage: string;
  onDownload?: () => void;
}

/**
 * Comparador interactivo de imágenes con slider
 * Optimizado para mobile y desktop
 */
export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  originalImage,
  improvedImage,
  onDownload
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging || !e.touches[0]) return;
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div className="w-full max-w-5xl mx-auto p-2 sm:p-4 lg:p-6">
      <div className="text-center mb-3 sm:mb-6">
        <h3 className="text-white text-base sm:text-xl font-bold mb-1 sm:mb-2">
          Comparar con original
        </h3>
        <p className="text-white/60 text-xs sm:text-sm">
          <span className="hidden sm:inline">Arrastra el slider para ver las diferencias</span>
          <span className="sm:hidden">Desliza para comparar</span>
        </p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full aspect-[3/4] sm:aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-black/20 shadow-2xl cursor-ew-resize select-none touch-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute inset-0">
          <img
            src={improvedImage}
            alt="Mejorada con IA"
            className="w-full h-full object-contain"
            draggable={false}
          />
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-green-500/90 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
            <span className="hidden sm:inline">Mejorada con IA</span>
            <span className="sm:hidden">Mejorada</span>
          </div>
        </div>

        <div 
          className="absolute inset-0 transition-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={originalImage}
            alt="Original"
            className="w-full h-full object-contain"
            draggable={false}
          />
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 text-gray-900 text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
            Original
          </div>
        </div>

        <div 
          className="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center touch-manipulation">
            <svg className="w-4 h-4 sm:w-6 sm:h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:hidden pointer-events-none">
          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white/80 text-[10px] px-2 py-1 rounded-full animate-pulse">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>Desliza</span>
          </div>
        </div>
      </div>

      {onDownload && (
        <div className="mt-4 sm:mt-8 flex justify-center">
          <button
            onClick={onDownload}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-2.5 px-5 sm:py-3 sm:px-8 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Descargar imagen mejorada</span>
            <span className="sm:hidden">Descargar</span>
          </button>
        </div>
      )}
    </div>
  );
};

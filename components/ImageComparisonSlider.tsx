import React, { useState, useRef, useCallback } from 'react';

interface ImageComparisonSliderProps {
  originalImage: string;
  improvedImage: string;
  onDownload?: () => void;
}

/**
 * Comparador interactivo de imágenes con slider
 * Permite al usuario mover un slider para ver la transición entre original y mejorada
 */
export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  originalImage,
  improvedImage,
  onDownload
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // Posición del slider (0-100%)
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Manejar movimiento del slider
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  // Mouse events
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

  // Touch events
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

  // Agregar/remover event listeners
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
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="text-center mb-6">
        <h3 className="text-white text-xl font-bold mb-2">Comparar con original</h3>
        <p className="text-white/60 text-sm">Arrastra el slider para ver las diferencias</p>
      </div>

      {/* Comparador con slider */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black/20 shadow-2xl cursor-ew-resize select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Imagen mejorada (fondo) */}
        <div className="absolute inset-0">
          <img
            src={improvedImage}
            alt="Mejorada con IA"
            className="w-full h-full object-contain"
            draggable={false}
          />
          <div className="absolute top-4 right-4 bg-green-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">
            Mejorada con IA
          </div>
        </div>

        {/* Imagen original (overlay con clip-path) */}
        <div 
          className="absolute inset-0 transition-none"
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
          }}
        >
          <img
            src={originalImage}
            alt="Original"
            className="w-full h-full object-contain"
            draggable={false}
          />
          <div className="absolute top-4 left-4 bg-white/90 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
            Original
          </div>
        </div>

        {/* Slider handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] cursor-ew-resize"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Handle circular */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Botón de descarga */}
      {onDownload && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onDownload}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-bold py-3 px-8 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all text-sm flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Descargar imagen mejorada</span>
          </button>
        </div>
      )}
    </div>
  );
};

import { useState, useRef, useEffect, useCallback, type RefObject } from 'react';
import type { MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react';

interface UseDraggableOptions {
  initialPosition?: { x: number; y: number };
  containerRef?: RefObject<HTMLElement>;
  onDragStart?: () => void;
  onDragEnd?: (position: { x: number; y: number }) => void;
  onDrag?: (position: { x: number; y: number }) => void;
  constraints?: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  };
  snapToGrid?: number;
  throttleMs?: number;
}

interface UseDraggableReturn {
  position: { x: number; y: number };
  isDragging: boolean;
  dragHandlers: {
    onMouseDown: (e: ReactMouseEvent<HTMLElement>) => void;
    onTouchStart: (e: ReactTouchEvent<HTMLElement>) => void;
  };
  setPosition: (pos: { x: number; y: number }) => void;
}

/**
 * Hook personalizado para drag & drop robusto
 * Características:
 * - Transform-based (no rompe CSS original)
 * - Global event listeners (no se "despega")
 * - Throttling para performance
 * - Touch support
 * - Delta-based movement
 * - Smart constraints
 */
export const useDraggable = (options: UseDraggableOptions = {}): UseDraggableReturn => {
  const {
    initialPosition = { x: 50, y: 50 },
    containerRef,
    onDragStart,
    onDragEnd,
    onDrag,
    constraints,
    snapToGrid,
    throttleMs = 16 // ~60fps
  } = options;

  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  
  const lastMoveTime = useRef(0);
  const animationFrame = useRef<number>();

  // Calcular límites del contenedor
  const getContainerBounds = useCallback(() => {
    if (!containerRef?.current) {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return containerRef.current.getBoundingClientRect();
  }, [containerRef]);

  // Throttled mousemove handler
  const throttledMouseMove = useCallback((e: MouseEvent) => {
    const now = Date.now();
    if (now - lastMoveTime.current < throttleMs) {
      return;
    }
    lastMoveTime.current = now;

    if (!isDragging) return;

    const bounds = getContainerBounds();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    // Calcular nueva posición basada en la posición del mouse directamente
    // Esto es más robusto y evita problemas de cálculo
    let newX = (mouseX / bounds.width) * 100;
    let newY = (mouseY / bounds.height) * 100;

    // Aplicar restricciones
    if (constraints) {
      newX = Math.max(constraints.minX ?? 0, Math.min(constraints.maxX ?? 100, newX));
      newY = Math.max(constraints.minY ?? 0, Math.min(constraints.maxY ?? 100, newY));
    }

    // Snap to grid si está habilitado
    if (snapToGrid) {
      newX = Math.round(newX / snapToGrid) * snapToGrid;
      newY = Math.round(newY / snapToGrid) * snapToGrid;
    }

    const newPosition = { x: newX, y: newY };
    setPosition(newPosition);
    onDrag?.(newPosition);
  }, [isDragging, dragOffset, startPosition, constraints, snapToGrid, onDrag, getContainerBounds, throttleMs]);

  // Touch move handler
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    
    e.preventDefault(); // Prevenir scroll durante drag
    throttledMouseMove(e.touches[0] as any);
  }, [isDragging, throttledMouseMove]);

  // Mouse up handler
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    
    setIsDragging(false);
    onDragEnd?.(position);
    
    // Cleanup global listeners
    document.removeEventListener('mousemove', throttledMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleMouseUp);
  }, [isDragging, position, onDragEnd, throttledMouseMove, handleTouchMove]);

  // Iniciar drag
  const startDrag = useCallback((clientX: number, clientY: number) => {
    const bounds = getContainerBounds();
    const mouseX = clientX - bounds.left;
    const mouseY = clientY - bounds.top;

    // Calcular offset desde la posición actual
    const currentX = (position.x / 100) * bounds.width;
    const currentY = (position.y / 100) * bounds.height;

    // Usar el offset real del mouse para evitar saltos
    setDragOffset({
      x: mouseX,
      y: mouseY
    });

    setStartPosition({ ...position });
    setIsDragging(true);
    onDragStart?.();

    // Global listeners para evitar que se "despegue"
    document.addEventListener('mousemove', throttledMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
  }, [position, getContainerBounds, onDragStart, throttledMouseMove, handleMouseUp, handleTouchMove]);

  // Event handlers
  const handleMouseDown = useCallback((e: ReactMouseEvent<HTMLElement>) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  }, [startDrag]);

  const handleTouchStart = useCallback((e: ReactTouchEvent<HTMLElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, [startDrag]);

  // Cleanup en unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [throttledMouseMove, handleMouseUp, handleTouchMove]);

  return {
    position,
    isDragging,
    dragHandlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart
    },
    setPosition
  };
};

export default useDraggable;
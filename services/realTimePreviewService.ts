export interface PreviewState {
  isActive: boolean;
  textContent: string;
  position: { x: number; y: number };
  fontSize: number;
  fontFamily: string;
  color: string;
  effects: {
    shadow: boolean;
    glow: boolean;
    stroke: boolean;
  };
  style: {
    bold: boolean;
    italic: boolean;
    uppercase: boolean;
  };
}

export interface PreviewStyles {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  textTransform: string;
  color: string;
  textShadow: string;
  filter: string;
  letterSpacing: string;
  lineHeight: string;
  textDecoration: string;
  backgroundColor: string;
  padding: string;
  borderRadius: string;
  border: string;
}

export interface RealTimePreviewConfig {
  updateDelay: number; // ms
  enableSmoothTransitions: boolean;
  showDebugInfo: boolean;
  enableLiveEditing: boolean;
  maxFontSize: number;
  minFontSize: number;
}

/**
 * Clase para manejar el preview en tiempo real del texto sobre la imagen
 */
export class RealTimePreview {
  private container: HTMLElement;
  private textElement: HTMLElement;
  private config: RealTimePreviewConfig;
  private updateTimeout: NodeJS.Timeout | null = null;
  private isUpdating = false;

  constructor(container: HTMLElement, config?: Partial<RealTimePreviewConfig>) {
    this.container = container;
    this.config = {
      updateDelay: 100,
      enableSmoothTransitions: true,
      showDebugInfo: false,
      enableLiveEditing: true,
      maxFontSize: 120,
      minFontSize: 12,
      ...config
    };

    this.createPreviewElements();
    this.setupEventListeners();
  }

  /**
   * Crea los elementos del preview
   */
  private createPreviewElements() {
    // Crear contenedor del preview
    this.textElement = document.createElement('div');
    this.textElement.className = 'absolute inset-0 pointer-events-none z-10 transition-all duration-300';
    this.textElement.style.fontFamily = 'Inter, sans-serif';
    this.textElement.style.fontSize = '48px';
    this.textElement.style.fontWeight = 'bold';
    this.textElement.style.color = '#ffffff';
    this.textElement.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
    this.textElement.style.display = 'flex';
    this.textElement.style.alignItems = 'center';
    this.textElement.style.justifyContent = 'center';
    this.textElement.style.textAlign = 'center';
    this.textElement.style.padding = '20px';
    this.textElement.style.wordBreak = 'break-word';
    this.textElement.style.lineHeight = '1.2';

    // Crear overlay para mejor legibilidad
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 pointer-events-none';
    overlay.style.background = 'transparent';
    overlay.style.transition = 'background 0.3s ease';

    this.container.appendChild(this.textElement);
    this.container.appendChild(overlay);
  }

  /**
   * Configura los event listeners
   */
  private setupEventListeners() {
    // Observer para cambios en el contenedor
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'attributes') {
          this.scheduleUpdate();
        }
      });
    });

    observer.observe(this.container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  /**
   * Programa una actualización del preview
   */
  private scheduleUpdate() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.updateTimeout = setTimeout(() => {
      this.updatePreview();
    }, this.config.updateDelay);
  }

  /**
   * Actualiza el preview con los nuevos estilos
   */
  public updatePreview(state: Partial<PreviewState> = {}) {
    if (this.isUpdating) return;
    this.isUpdating = true;

    try {
      // Aplicar contenido del texto
      if (state.textContent !== undefined) {
        this.textElement.textContent = state.textContent || '';
      }

      // Aplicar posición
      if (state.position) {
        this.textElement.style.left = `${state.position.x}%`;
        this.textElement.style.top = `${state.position.y}%`;
        this.textElement.style.transform = 'translate(-50%, -50%)';
      }

      // Aplicar estilos de fuente
      if (state.fontSize) {
        const clampedSize = Math.max(this.config.minFontSize, Math.min(this.config.maxFontSize, state.fontSize));
        this.textElement.style.fontSize = `${clampedSize}px`;
      }

      if (state.fontFamily) {
        this.textElement.style.fontFamily = state.fontFamily;
      }

      // Aplicar estilos de texto
      if (state.style) {
        const { bold, italic, uppercase } = state.style;
        
        this.textElement.style.fontWeight = bold ? 'bold' : 'normal';
        this.textElement.style.fontStyle = italic ? 'italic' : 'normal';
        this.textElement.style.textTransform = uppercase ? 'uppercase' : 'none';
      }

      // Aplicar color
      if (state.color) {
        this.textElement.style.color = state.color;
      }

      // Aplicar efectos
      if (state.effects) {
        this.applyEffects(state.effects);
      }

      // Aplicar transiciones suaves
      if (this.config.enableSmoothTransitions) {
        this.textElement.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }

      // Mostrar información de debug si está habilitada
      if (this.config.showDebugInfo) {
        this.showDebugInfo();
      }

      console.log('✅ Preview actualizado:', state);

    } catch (error) {
      console.error('❌ Error actualizando preview:', error);
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Aplica efectos al texto
   */
  private applyEffects(effects: PreviewState['effects']) {
    let textShadow = '';
    let filter = '';

    // Sombra
    if (effects.shadow) {
      textShadow = '0 2px 8px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)';
    }

    // Glow
    if (effects.glow) {
      filter = 'drop-shadow(0 0 10px rgba(255,255,255,0.8)) drop-shadow(0 0 20px rgba(255,255,255,0.4))';
    }

    // Stroke
    if (effects.stroke) {
      textShadow += textShadow ? ', ' : '';
      textShadow += '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
    }

    this.textElement.style.textShadow = textShadow;
    this.textElement.style.filter = filter;
  }

  /**
   * Muestra información de debug
   */
  private showDebugInfo() {
    let debugInfo = this.textElement.querySelector('.debug-info');
    
    if (!debugInfo) {
      debugInfo = document.createElement('div');
      debugInfo.className = 'debug-info absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded font-mono';
      this.container.appendChild(debugInfo);
    }

    const computedStyle = window.getComputedStyle(this.textElement);
    debugInfo.innerHTML = `
      <div>Font: ${computedStyle.fontFamily}</div>
      <div>Size: ${computedStyle.fontSize}</div>
      <div>Weight: ${computedStyle.fontWeight}</div>
      <div>Color: ${computedStyle.color}</div>
      <div>Pos: ${this.textElement.style.left}, ${this.textElement.style.top}</div>
    `;
  }

  /**
   * Aplica estilos avanzados desde un objeto de estilos
   */
  public applyAdvancedStyles(styles: PreviewStyles) {
    const {
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      textTransform,
      color,
      textShadow,
      filter,
      letterSpacing,
      lineHeight,
      textDecoration,
      backgroundColor,
      padding,
      borderRadius,
      border
    } = styles;

    Object.assign(this.textElement.style, {
      fontFamily: fontFamily || 'Inter, sans-serif',
      fontSize: fontSize || '48px',
      fontWeight: fontWeight || 'bold',
      fontStyle: fontStyle || 'normal',
      textTransform: textTransform || 'none',
      color: color || '#ffffff',
      textShadow: textShadow || '0 2px 4px rgba(0,0,0,0.3)',
      filter: filter || 'none',
      letterSpacing: letterSpacing || 'normal',
      lineHeight: lineHeight || '1.2',
      textDecoration: textDecoration || 'none',
      backgroundColor: backgroundColor || 'transparent',
      padding: padding || '20px',
      borderRadius: borderRadius || '0px',
      border: border || 'none'
    });

    this.scheduleUpdate();
  }

  /**
   * Activa/desactiva el preview
   */
  public setActive(isActive: boolean) {
    this.container.style.display = isActive ? 'block' : 'none';
    this.textElement.style.pointerEvents = isActive ? 'auto' : 'none';
  }

  /**
   * Obtiene el estado actual del preview
   */
  public getCurrentState(): PreviewState {
    const computedStyle = window.getComputedStyle(this.textElement);
    
    return {
      isActive: this.container.style.display !== 'none',
      textContent: this.textElement.textContent || '',
      position: {
        x: parseFloat(this.textElement.style.left) || 50,
        y: parseFloat(this.textElement.style.top) || 50
      },
      fontSize: parseInt(computedStyle.fontSize) || 48,
      fontFamily: computedStyle.fontFamily,
      color: computedStyle.color,
      effects: {
        shadow: this.textElement.style.textShadow !== 'none',
        glow: this.textElement.style.filter.includes('drop-shadow'),
        stroke: this.textElement.style.textShadow.includes('-1px -1px')
      },
      style: {
        bold: computedStyle.fontWeight === 'bold',
        italic: computedStyle.fontStyle === 'italic',
        uppercase: computedStyle.textTransform === 'uppercase'
      }
    };
  }

  /**
   * Destruye el preview y limpia recursos
   */
  public destroy() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    
    this.container.innerHTML = '';
  }

  /**
   * Configura el preview para un modo específico
   */
  public setMode(mode: 'editing' | 'preview' | 'hidden') {
    switch (mode) {
      case 'editing':
        this.textElement.style.pointerEvents = 'auto';
        this.textElement.style.cursor = 'move';
        this.textElement.style.opacity = '1';
        break;
      case 'preview':
        this.textElement.style.pointerEvents = 'none';
        this.textElement.style.cursor = 'default';
        this.textElement.style.opacity = '0.9';
        break;
      case 'hidden':
        this.textElement.style.pointerEvents = 'none';
        this.textElement.style.cursor = 'default';
        this.textElement.style.opacity = '0';
        break;
    }
  }
}

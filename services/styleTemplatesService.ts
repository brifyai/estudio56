import { FlyerStyleKey } from '../types';

/**
 * PLANTILLAS CSS PREDEFINIDAS POR ESTILO
 * Solución lean: CSS + diseño en lugar de IA compleja
 */

export interface StyleTemplate {
  id: string;
  name: string;
  
  // POSICIÓN Y COMPOSICIÓN
  textPosition: {
    x: number; // Porcentaje horizontal
    y: number; // Porcentaje vertical
    alignment: 'left' | 'center' | 'right';
  };
  
  // ESTILO VISUAL
  visualStyle: 'badge' | 'overlay' | 'simple' | 'corner' | 'bottom-bar';
  
  // TIPOGRAFÍA
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    letterSpacing: string;
    textTransform: 'uppercase' | 'none';
  };
  
  // EFECTOS VISUALES
  effects: {
    // Scrim (degradado de sombra detrás del texto)
    scrim: {
      enabled: boolean;
      gradient: string;
      intensity: 'light' | 'medium' | 'heavy';
    };
    
    // Sombra del texto
    textShadow: {
      enabled: boolean;
      shadow: string;
      color: string;
    };
    
    // Contorno del texto
    textStroke: {
      enabled: boolean;
      width: string;
      color: string;
    };
    
    // Glow effect
    glow: {
      enabled: boolean;
      color: string;
      blur: string;
    };
  };
  
  // COLORES
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  
  // ANIMACIONES
  animations: {
    entrance: string;
    hover: string;
  };
}

// PLANTILLAS POR ESTILO
export const STYLE_TEMPLATES: Record<FlyerStyleKey, StyleTemplate> = {
  
  // === VENTAS & COMERCIAL ===
  retail_sale: {
    id: 'retail_sale',
    name: 'Ofertas Explosivas',
    textPosition: { x: 75, y: 25, alignment: 'right' },
    visualStyle: 'badge',
    typography: {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: 'clamp(24px, 8vw, 48px)',
      fontWeight: '900',
      letterSpacing: '0.02em',
      textTransform: 'uppercase'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(255,0,0,0.8) 0%, rgba(255,100,0,0.6) 100%)',
        intensity: 'heavy'
      },
      textShadow: {
        enabled: true,
        shadow: '0 4px 8px rgba(0,0,0,0.8)',
        color: '#000000'
      },
      textStroke: {
        enabled: true,
        width: '2px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#FF0000',
        blur: '0px'
      }
    },
    colors: {
      primary: '#FF0000',
      secondary: '#FFFF00',
      background: 'transparent'
    },
    animations: {
      entrance: 'bounceIn 0.6s ease-out',
      hover: 'pulse 2s infinite'
    }
  },

  typo_bold: {
    id: 'typo_bold',
    name: 'Tipografía Pura',
    textPosition: { x: 50, y: 45, alignment: 'center' }, // FASE 1: Mejorado de 50 a 45
    visualStyle: 'simple',
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(32px, 10vw, 72px)',
      fontWeight: '900',
      letterSpacing: '-0.02em',
      textTransform: 'uppercase'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
        intensity: 'medium'
      },
      textShadow: {
        enabled: true,
        shadow: '0 2px 4px rgba(0,0,0,0.5)',
        color: '#000000'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#000000',
        blur: '0px'
      }
    },
    colors: {
      primary: '#FFFFFF',
      secondary: '#000000',
      background: 'transparent'
    },
    animations: {
      entrance: 'fadeInUp 0.8s ease-out',
      hover: 'none'
    }
  },

  auto_metallic: {
    id: 'auto_metallic',
    name: 'Automotriz Industrial',
    textPosition: { x: 80, y: 20, alignment: 'right' },
    visualStyle: 'corner',
    typography: {
      fontFamily: 'Orbitron, monospace',
      fontSize: 'clamp(20px, 6vw, 40px)',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(255,100,0,0.4) 100%)',
        intensity: 'heavy'
      },
      textShadow: {
        enabled: true,
        shadow: '0 0 20px rgba(255,100,0,0.8)',
        color: '#FF6400'
      },
      textStroke: {
        enabled: true,
        width: '1px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: true,
        color: '#FF6400',
        blur: '8px'
      }
    },
    colors: {
      primary: '#FF6400',
      secondary: '#C0C0C0',
      background: 'transparent'
    },
    animations: {
      entrance: 'slideInRight 0.5s ease-out',
      hover: 'glow 2s infinite'
    }
  },

  gastronomy: {
    id: 'gastronomy',
    name: 'Gastronomía Cálida',
    textPosition: { x: 50, y: 70, alignment: 'center' }, // FASE 2: Reducido de 75 a 70
    visualStyle: 'bottom-bar',
    typography: {
      fontFamily: 'Playfair Display, serif',
      fontSize: 'clamp(18px, 5vw, 32px)',
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'none'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
        intensity: 'medium'
      },
      textShadow: {
        enabled: true,
        shadow: '0 2px 4px rgba(0,0,0,0.7)',
        color: '#000000'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#FFD700',
        blur: '0px'
      }
    },
    colors: {
      primary: '#FFD700',
      secondary: '#8B4513',
      background: 'transparent'
    },
    animations: {
      entrance: 'fadeInUp 0.7s ease-out',
      hover: 'none'
    }
  },

  // === CORPORATIVO & SERIO ===
  corporate: {
    id: 'corporate',
    name: 'Corporativo Limpio',
    textPosition: { x: 50, y: 70, alignment: 'center' }, // FASE 2: Reducido de 80 a 70
    visualStyle: 'bottom-bar',
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(16px, 4vw, 28px)',
      fontWeight: '600',
      letterSpacing: '0.02em',
      textTransform: 'none'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(to top, rgba(0,30,60,0.9) 0%, rgba(0,30,60,0.5) 70%, transparent 100%)',
        intensity: 'light'
      },
      textShadow: {
        enabled: true,
        shadow: '0 1px 3px rgba(0,0,0,0.3)',
        color: '#001E3C'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#0066CC',
        blur: '0px'
      }
    },
    colors: {
      primary: '#0066CC',
      secondary: '#FFFFFF',
      background: 'transparent'
    },
    animations: {
      entrance: 'slideInUp 0.6s ease-out',
      hover: 'none'
    }
  },

  medical_clean: {
    id: 'medical_clean',
    name: 'Médico Clínico',
    textPosition: { x: 50, y: 75, alignment: 'center' }, // FASE 2: Reducido de 85 a 75
    visualStyle: 'bottom-bar',
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(14px, 3.5vw, 24px)',
      fontWeight: '500',
      letterSpacing: '0.03em',
      textTransform: 'none'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(to top, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 70%, transparent 100%)',
        intensity: 'light'
      },
      textShadow: {
        enabled: false,
        shadow: 'none',
        color: '#000000'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#00CCCC',
        blur: '0px'
      }
    },
    colors: {
      primary: '#00CCCC',
      secondary: '#006666',
      background: 'transparent'
    },
    animations: {
      entrance: 'fadeIn 0.5s ease-out',
      hover: 'none'
    }
  },

  tech_saas: {
    id: 'tech_saas',
    name: 'Tech Futurista',
    textPosition: { x: 50, y: 30, alignment: 'center' },
    visualStyle: 'overlay',
    typography: {
      fontFamily: 'Orbitron, monospace',
      fontSize: 'clamp(20px, 6vw, 36px)',
      fontWeight: '700',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(0,0,50,0.8) 0%, rgba(0,0,100,0.4) 100%)',
        intensity: 'medium'
      },
      textShadow: {
        enabled: true,
        shadow: '0 0 20px rgba(100,150,255,0.8)',
        color: '#6496FF'
      },
      textStroke: {
        enabled: true,
        width: '1px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: true,
        color: '#6496FF',
        blur: '12px'
      }
    },
    colors: {
      primary: '#6496FF',
      secondary: '#FFFFFF',
      background: 'transparent'
    },
    animations: {
      entrance: 'pulse 1s ease-in-out',
      hover: 'glow 2s infinite'
    }
  },

  edu_sketch: {
    id: 'edu_sketch',
    name: 'Educación',
    textPosition: { x: 50, y: 70, alignment: 'center' },
    visualStyle: 'simple',
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(18px, 5vw, 32px)',
      fontWeight: '600',
      letterSpacing: '0.02em',
      textTransform: 'none'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(to top, rgba(0,100,0,0.8) 0%, rgba(0,100,0,0.4) 70%, transparent 100%)',
        intensity: 'medium'
      },
      textShadow: {
        enabled: true,
        shadow: '0 2px 4px rgba(0,0,0,0.5)',
        color: '#000000'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#00FF00',
        blur: '0px'
      }
    },
    colors: {
      primary: '#00FF00',
      secondary: '#FFFFFF',
      background: 'transparent'
    },
    animations: {
      entrance: 'fadeInUp 0.6s ease-out',
      hover: 'none'
    }
  },

  political_community: {
    id: 'political_community',
    name: 'Política',
    textPosition: { x: 50, y: 75, alignment: 'center' },
    visualStyle: 'bottom-bar',
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(16px, 4vw, 28px)',
      fontWeight: '700',
      letterSpacing: '0.02em',
      textTransform: 'none'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(to top, rgba(0,0,150,0.8) 0%, rgba(0,0,150,0.4) 70%, transparent 100%)',
        intensity: 'medium'
      },
      textShadow: {
        enabled: true,
        shadow: '0 2px 4px rgba(0,0,0,0.6)',
        color: '#000000'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#0000FF',
        blur: '0px'
      }
    },
    colors: {
      primary: '#0000FF',
      secondary: '#FF0000',
      background: 'transparent'
    },
    animations: {
      entrance: 'slideInUp 0.7s ease-out',
      hover: 'none'
    }
  },

  // === LIFESTYLE & VIBRA ===
  aesthetic_min: {
    id: 'aesthetic_min',
    name: 'Aesthetic Minimal',
    textPosition: { x: 50, y: 70, alignment: 'center' },
    visualStyle: 'simple',
    typography: {
      fontFamily: 'Playfair Display, serif',
      fontSize: 'clamp(16px, 4vw, 28px)',
      fontWeight: '400',
      letterSpacing: '0.08em',
      textTransform: 'none'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(to top, rgba(245,245,220,0.8) 0%, rgba(245,245,220,0.4) 70%, transparent 100%)',
        intensity: 'light'
      },
      textShadow: {
        enabled: false,
        shadow: 'none',
        color: '#000000'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#F5F5DC',
        blur: '0px'
      }
    },
    colors: {
      primary: '#8FBC8F',
      secondary: '#F5F5DC',
      background: 'transparent'
    },
    animations: {
      entrance: 'fadeInUp 0.8s ease-out',
      hover: 'none'
    }
  },

  wellness_zen: {
    id: 'wellness_zen',
    name: 'Zen Wellness',
    textPosition: { x: 50, y: 60, alignment: 'center' },
    visualStyle: 'simple',
    typography: {
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: 'clamp(18px, 5vw, 30px)',
      fontWeight: '300',
      letterSpacing: '0.1em',
      textTransform: 'none'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(139,69,19,0.6) 0%, rgba(160,82,45,0.3) 100%)',
        intensity: 'light'
      },
      textShadow: {
        enabled: true,
        shadow: '0 1px 2px rgba(0,0,0,0.2)',
        color: '#8B4513'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#D2B48C',
        blur: '0px'
      }
    },
    colors: {
      primary: '#D2B48C',
      secondary: '#8B4513',
      background: 'transparent'
    },
    animations: {
      entrance: 'fadeIn 1s ease-out',
      hover: 'none'
    }
  },

  summer_beach: {
    id: 'summer_beach',
    name: 'Verano',
    textPosition: { x: 50, y: 20, alignment: 'center' },
    visualStyle: 'overlay',
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(24px, 8vw, 48px)',
      fontWeight: '900',
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(0,191,255,0.8) 0%, rgba(255,165,0,0.4) 100%)',
        intensity: 'medium'
      },
      textShadow: {
        enabled: true,
        shadow: '0 2px 4px rgba(0,0,0,0.5)',
        color: '#000000'
      },
      textStroke: {
        enabled: true,
        width: '1px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#00BFFF',
        blur: '0px'
      }
    },
    colors: {
      primary: '#00BFFF',
      secondary: '#FFA500',
      background: 'transparent'
    },
    animations: {
      entrance: 'bounceIn 0.6s ease-out',
      hover: 'pulse 2s infinite'
    }
  },

  eco_organic: {
    id: 'eco_organic',
    name: 'Ecológico',
    textPosition: { x: 50, y: 75, alignment: 'center' },
    visualStyle: 'bottom-bar',
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(18px, 5vw, 32px)',
      fontWeight: '600',
      letterSpacing: '0.03em',
      textTransform: 'none'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(to top, rgba(34,139,34,0.8) 0%, rgba(34,139,34,0.4) 70%, transparent 100%)',
        intensity: 'medium'
      },
      textShadow: {
        enabled: true,
        shadow: '0 2px 4px rgba(0,0,0,0.5)',
        color: '#000000'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#228B22',
        blur: '0px'
      }
    },
    colors: {
      primary: '#228B22',
      secondary: '#8B4513',
      background: 'transparent'
    },
    animations: {
      entrance: 'fadeInUp 0.7s ease-out',
      hover: 'none'
    }
  },

  sport_gritty: {
    id: 'sport_gritty',
    name: 'Deporte',
    textPosition: { x: 50, y: 25, alignment: 'center' },
    visualStyle: 'overlay',
    typography: {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: 'clamp(28px, 9vw, 56px)',
      fontWeight: '900',
      letterSpacing: '0.02em',
      textTransform: 'uppercase'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(255,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
        intensity: 'heavy'
      },
      textShadow: {
        enabled: true,
        shadow: '0 4px 8px rgba(0,0,0,0.8)',
        color: '#000000'
      },
      textStroke: {
        enabled: true,
        width: '2px',
        color: '#FFFF00'
      },
      glow: {
        enabled: false,
        color: '#FF0000',
        blur: '0px'
      }
    },
    colors: {
      primary: '#FF0000',
      secondary: '#FFFF00',
      background: 'transparent'
    },
    animations: {
      entrance: 'bounceIn 0.5s ease-out',
      hover: 'pulse 1.5s infinite'
    }
  },

  // === NOCHE & ENTRETENCIÓN ===
  urban_night: {
    id: 'urban_night',
    name: 'Neón Urbano',
    textPosition: { x: 50, y: 25, alignment: 'center' },
    visualStyle: 'overlay',
    typography: {
      fontFamily: 'Orbitron, monospace',
      fontSize: 'clamp(24px, 8vw, 48px)',
      fontWeight: '900',
      letterSpacing: '0.15em',
      textTransform: 'uppercase'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(75,0,130,0.8) 0%, rgba(138,43,226,0.4) 100%)',
        intensity: 'heavy'
      },
      textShadow: {
        enabled: true,
        shadow: '0 0 30px rgba(255,0,255,1)',
        color: '#FF00FF'
      },
      textStroke: {
        enabled: true,
        width: '2px',
        color: '#00FFFF'
      },
      glow: {
        enabled: true,
        color: '#FF00FF',
        blur: '20px'
      }
    },
    colors: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      background: 'transparent'
    },
    animations: {
      entrance: 'neonFlicker 0.3s ease-in-out',
      hover: 'neonPulse 1.5s infinite'
    }
  },

  luxury_gold: {
    id: 'luxury_gold',
    name: 'Lujo Dorado',
    textPosition: { x: 50, y: 80, alignment: 'center' },
    visualStyle: 'bottom-bar',
    typography: {
      fontFamily: 'Playfair Display, serif',
      fontSize: 'clamp(20px, 6vw, 36px)',
      fontWeight: '700',
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 70%, transparent 100%)',
        intensity: 'medium'
      },
      textShadow: {
        enabled: true,
        shadow: '0 0 20px rgba(255,215,0,0.8)',
        color: '#FFD700'
      },
      textStroke: {
        enabled: true,
        width: '1px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: true,
        color: '#FFD700',
        blur: '15px'
      }
    },
    colors: {
      primary: '#FFD700',
      secondary: '#FFFFFF',
      background: 'transparent'
    },
    animations: {
      entrance: 'goldenShine 1s ease-out',
      hover: 'goldenGlow 2s infinite'
    }
  },

  realestate_night: {
    id: 'realestate_night',
    name: 'Lujo Nocturno',
    textPosition: { x: 50, y: 70, alignment: 'center' },
    visualStyle: 'simple',
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(20px, 6vw, 36px)',
      fontWeight: '700',
      letterSpacing: '0.02em',
      textTransform: 'none'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(to top, rgba(25,25,112,0.8) 0%, rgba(25,25,112,0.4) 70%, transparent 100%)',
        intensity: 'medium'
      },
      textShadow: {
        enabled: true,
        shadow: '0 2px 4px rgba(0,0,0,0.6)',
        color: '#000000'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#FFD700',
        blur: '0px'
      }
    },
    colors: {
      primary: '#FFD700',
      secondary: '#191970',
      background: 'transparent'
    },
    animations: {
      entrance: 'fadeInUp 0.8s ease-out',
      hover: 'none'
    }
  },

  gamer_stream: {
    id: 'gamer_stream',
    name: 'Gamer',
    textPosition: { x: 50, y: 30, alignment: 'center' },
    visualStyle: 'overlay',
    typography: {
      fontFamily: 'Orbitron, monospace',
      fontSize: 'clamp(24px, 8vw, 48px)',
      fontWeight: '900',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(0,255,0,0.8) 0%, rgba(128,0,128,0.4) 100%)',
        intensity: 'heavy'
      },
      textShadow: {
        enabled: true,
        shadow: '0 0 20px rgba(0,255,0,1)',
        color: '#00FF00'
      },
      textStroke: {
        enabled: true,
        width: '1px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: true,
        color: '#00FF00',
        blur: '15px'
      }
    },
    colors: {
      primary: '#00FF00',
      secondary: '#800080',
      background: 'transparent'
    },
    animations: {
      entrance: 'glitch 0.5s ease-out',
      hover: 'neonPulse 1s infinite'
    }
  },

  indie_grunge: {
    id: 'indie_grunge',
    name: 'Rock',
    textPosition: { x: 50, y: 60, alignment: 'center' },
    visualStyle: 'simple',
    typography: {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: 'clamp(28px, 9vw, 56px)',
      fontWeight: '900',
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(139,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
        intensity: 'heavy'
      },
      textShadow: {
        enabled: true,
        shadow: '3px 3px 0px rgba(0,0,0,1)',
        color: '#8B0000'
      },
      textStroke: {
        enabled: true,
        width: '1px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#FF0000',
        blur: '0px'
      }
    },
    colors: {
      primary: '#FF0000',
      secondary: '#000000',
      background: 'transparent'
    },
    animations: {
      entrance: 'shake 0.5s ease-out',
      hover: 'none'
    }
  },

  // === EVENTOS & ESPECIALES ===
  kids_fun: {
    id: 'kids_fun',
    name: 'Infantil',
    textPosition: { x: 50, y: 45, alignment: 'center' }, // FASE 1: Mejorado de 50 a 45
    visualStyle: 'simple',
    typography: {
      fontFamily: 'Comic Sans MS, cursive',
      fontSize: 'clamp(24px, 8vw, 48px)',
      fontWeight: '900',
      letterSpacing: '0.02em',
      textTransform: 'uppercase'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(255,182,193,0.8) 0%, rgba(173,216,230,0.6) 100%)',
        intensity: 'light'
      },
      textShadow: {
        enabled: true,
        shadow: '0 2px 4px rgba(0,0,0,0.3)',
        color: '#000000'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: true,
        color: '#FF69B4',
        blur: '8px'
      }
    },
    colors: {
      primary: '#FF69B4',
      secondary: '#00BFFF',
      background: 'transparent'
    },
    animations: {
      entrance: 'bounceIn 0.6s ease-out',
      hover: 'bounce 1s infinite'
    }
  },

  worship_sky: {
    id: 'worship_sky',
    name: 'Espiritual',
    textPosition: { x: 50, y: 70, alignment: 'center' },
    visualStyle: 'simple',
    typography: {
      fontFamily: 'Playfair Display, serif',
      fontSize: 'clamp(20px, 6vw, 36px)',
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'none'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(to top, rgba(135,206,235,0.8) 0%, rgba(135,206,235,0.4) 70%, transparent 100%)',
        intensity: 'light'
      },
      textShadow: {
        enabled: true,
        shadow: '0 1px 3px rgba(0,0,0,0.3)',
        color: '#000000'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#FFD700',
        blur: '0px'
      }
    },
    colors: {
      primary: '#FFD700',
      secondary: '#87CEEB',
      background: 'transparent'
    },
    animations: {
      entrance: 'fadeIn 1s ease-out',
      hover: 'none'
    }
  },

  seasonal_holiday: {
    id: 'seasonal_holiday',
    name: 'Festivo',
    textPosition: { x: 50, y: 45, alignment: 'center' }, // FASE 1: Mejorado de 50 a 45
    visualStyle: 'simple',
    typography: {
      fontFamily: 'Playfair Display, serif',
      fontSize: 'clamp(24px, 8vw, 48px)',
      fontWeight: '700',
      letterSpacing: '0.03em',
      textTransform: 'uppercase'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(255,0,0,0.8) 0%, rgba(0,255,0,0.4) 100%)',
        intensity: 'medium'
      },
      textShadow: {
        enabled: true,
        shadow: '0 0 20px rgba(255,215,0,0.8)',
        color: '#FFD700'
      },
      textStroke: {
        enabled: true,
        width: '1px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: true,
        color: '#FFD700',
        blur: '12px'
      }
    },
    colors: {
      primary: '#FFD700',
      secondary: '#FF0000',
      background: 'transparent'
    },
    animations: {
      entrance: 'sparkle 1s ease-out',
      hover: 'twinkle 2s infinite'
    }
  },

  art_double_exp: {
    id: 'art_double_exp',
    name: 'Artístico',
    textPosition: { x: 50, y: 60, alignment: 'center' },
    visualStyle: 'simple',
    typography: {
      fontFamily: 'Playfair Display, serif',
      fontSize: 'clamp(20px, 6vw, 36px)',
      fontWeight: '400',
      letterSpacing: '0.1em',
      textTransform: 'none'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(75,0,130,0.6) 0%, rgba(138,43,226,0.3) 100%)',
        intensity: 'light'
      },
      textShadow: {
        enabled: true,
        shadow: '0 2px 4px rgba(0,0,0,0.4)',
        color: '#000000'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#9370DB',
        blur: '0px'
      }
    },
    colors: {
      primary: '#9370DB',
      secondary: '#4B0082',
      background: 'transparent'
    },
    animations: {
      entrance: 'fadeIn 1.2s ease-out',
      hover: 'none'
    }
  },

  retro_vintage: {
    id: 'retro_vintage',
    name: 'Retro',
    textPosition: { x: 50, y: 70, alignment: 'center' },
    visualStyle: 'simple',
    typography: {
      fontFamily: 'Impact, Arial Black, sans-serif',
      fontSize: 'clamp(26px, 8vw, 52px)',
      fontWeight: '900',
      letterSpacing: '0.05em',
      textTransform: 'uppercase'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(210,180,140,0.8) 0%, rgba(139,69,19,0.6) 100%)',
        intensity: 'medium'
      },
      textShadow: {
        enabled: true,
        shadow: '2px 2px 0px rgba(0,0,0,0.8)',
        color: '#8B4513'
      },
      textStroke: {
        enabled: true,
        width: '1px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#D2B48C',
        blur: '0px'
      }
    },
    colors: {
      primary: '#D2B48C',
      secondary: '#8B4513',
      background: 'transparent'
    },
    animations: {
      entrance: 'vintage 0.8s ease-out',
      hover: 'none'
    }
  },

  podcast_mic: {
    id: 'podcast_mic',
    name: 'Podcast',
    textPosition: { x: 50, y: 75, alignment: 'center' },
    visualStyle: 'bottom-bar',
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(18px, 5vw, 32px)',
      fontWeight: '600',
      letterSpacing: '0.03em',
      textTransform: 'none'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(to top, rgba(128,0,128,0.9) 0%, rgba(128,0,128,0.5) 70%, transparent 100%)',
        intensity: 'medium'
      },
      textShadow: {
        enabled: true,
        shadow: '0 2px 4px rgba(0,0,0,0.6)',
        color: '#000000'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#9370DB',
        blur: '0px'
      }
    },
    colors: {
      primary: '#9370DB',
      secondary: '#FFFFFF',
      background: 'transparent'
    },
    animations: {
      entrance: 'fadeInUp 0.7s ease-out',
      hover: 'none'
    }
  },

  // === ESTILO DETECTADO AUTOMÁTICAMENTE ===
  brand_identity: {
    id: 'brand_identity',
    name: 'Identidad de Marca',
    textPosition: { x: 50, y: 45, alignment: 'center' }, // FASE 1: Mejorado de 50 a 45
    visualStyle: 'simple',
    typography: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 'clamp(20px, 6vw, 40px)',
      fontWeight: '600',
      letterSpacing: '0.02em',
      textTransform: 'none'
    },
    effects: {
      scrim: {
        enabled: true,
        gradient: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%)',
        intensity: 'medium'
      },
      textShadow: {
        enabled: true,
        shadow: '0 2px 4px rgba(0,0,0,0.5)',
        color: '#000000'
      },
      textStroke: {
        enabled: false,
        width: '0px',
        color: '#FFFFFF'
      },
      glow: {
        enabled: false,
        color: '#FFFFFF',
        blur: '0px'
      }
    },
    colors: {
      primary: '#FFFFFF',
      secondary: '#000000',
      background: 'transparent'
    },
    animations: {
      entrance: 'fadeIn 0.6s ease-out',
      hover: 'none'
    }
  }
};

// FUNCIONES DE UTILIDAD

/**
 * Obtiene la plantilla CSS para un estilo específico
 */
export const getStyleTemplate = (styleKey: FlyerStyleKey): StyleTemplate => {
  return STYLE_TEMPLATES[styleKey] || STYLE_TEMPLATES.brand_identity;
};

/**
 * Genera las clases CSS dinámicas basadas en la plantilla
 */
export const generateDynamicClasses = (template: StyleTemplate): string => {
  const classes = [
    'relative',
    'select-none',
    'transition-all',
    'duration-300'
  ];

  // Añadir clases de animación
  if (template.animations.entrance !== 'none') {
    classes.push(template.animations.entrance);
  }

  // Añadir clases de hover
  if (template.animations.hover !== 'none') {
    classes.push(`hover:${template.animations.hover}`);
  }

  return classes.join(' ');
};

/**
 * Genera los estilos CSS inline basados en la plantilla
 */
export const generateInlineStyles = (template: StyleTemplate, text: string): Record<string, any> => {
  const styles: Record<string, any> = {
    // Posición
    left: `${template.textPosition.x}%`,
    top: `${template.textPosition.y}%`,
    transform: 'translate(-50%, -50%)',
    textAlign: template.textPosition.alignment,
    
    // Tipografía
    fontFamily: template.typography.fontFamily,
    fontSize: template.typography.fontSize,
    fontWeight: template.typography.fontWeight,
    letterSpacing: template.typography.letterSpacing,
    textTransform: template.typography.textTransform,
    color: template.colors.primary,
    
    // Efectos
    textShadow: template.effects.textShadow.enabled ? template.effects.textShadow.shadow : 'none',
    WebkitTextStroke: template.effects.textStroke.enabled ?
      `${template.effects.textStroke.width} ${template.effects.textStroke.color}` : 'none',
    filter: template.effects.glow.enabled ?
      `drop-shadow(0 0 ${template.effects.glow.blur} ${template.effects.glow.color})` : 'none'
  };

  return styles;
};

/**
 * Genera el elemento Scrim (degradado de fondo) como objeto de configuración
 */
export const generateScrimConfig = (template: StyleTemplate): { enabled: boolean; gradient: string } | null => {
  if (!template.effects.scrim.enabled) {
    return null;
  }

  return {
    enabled: true,
    gradient: template.effects.scrim.gradient
  };
};

/**
 * CSS personalizado para animaciones especiales
 */
export const CUSTOM_CSS_ANIMATIONS = `
@keyframes bounceIn {
  0% { transform: scale(0.3) translate(-50%, -50%); opacity: 0; }
  50% { transform: scale(1.05) translate(-50%, -50%); }
  70% { transform: scale(0.9) translate(-50%, -50%); }
  100% { transform: scale(1) translate(-50%, -50%); opacity: 1; }
}

@keyframes neonFlicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes neonPulse {
  0%, 100% { 
    text-shadow: 0 0 30px rgba(255,0,255,1), 0 0 60px rgba(255,0,255,0.8);
  }
  50% { 
    text-shadow: 0 0 40px rgba(255,0,255,1), 0 0 80px rgba(255,0,255,1);
  }
}

@keyframes goldenShine {
  0% { 
    background: linear-gradient(45deg, transparent 30%, rgba(255,215,0,0.8) 50%, transparent 70%);
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    animation: shine 1s ease-out;
  }
}

@keyframes shine {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes goldenGlow {
  0%, 100% { 
    text-shadow: 0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,215,0,0.6);
  }
  50% { 
    text-shadow: 0 0 30px rgba(255,215,0,1), 0 0 60px rgba(255,215,0,0.8);
  }
}
`;
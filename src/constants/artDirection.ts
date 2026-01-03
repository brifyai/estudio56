/**
 * DIRECCIÓN DE ARTE PROFESIONAL - Rubros 1-20
 * 
 * Estructura: Asset Procesado (Estudio de Producto) + Dirección de Arte Específica 
 * + Composición Social Media (9:16) + Guardrail Negativo
 * 
 * Cada rubro está diseñado para "contratar virtualmente" a un fotógrafo
 * y diseñador editorial profesional.
 */

// ============================================
// DIRECCIÓN DE ARTE POR RUBRO (1-20)
// ============================================

export const ART_DIRECTION_PROMPTS: Record<number, ArtDirectionConfig> = {
  1: {
    id: 1,
    rubro: 'Retail General',
    prompt: `Clean commercial photography, studio lighting, bold high-contrast typography, center-focused composition for 9:16. Professional retail product shot with perfect exposure, sharp focus on merchandise, clean background that doesn't distract. Commercial-grade lighting setup with soft boxes for even illumination.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, uneven lighting, dark shadows, overprocessed, watermark, text overlay errors, distorted product)',
    aspectRatio: '9:16',
    style: 'commercial-retail'
  },
  
  2: {
    id: 2,
    rubro: 'Moda Mujer',
    prompt: `Fashion editorial look, soft daylight filtering through studio windows, minimalist serif fonts elegant and sophisticated, model in elegant pose with natural movement, moodboard aesthetic with cohesive color palette. High-fashion magazine quality, professional hair and makeup, fabric drape and flow visible.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, amateur photography, bad lighting, wrinkled clothes, awkward pose, low-res, stock photo look, inconsistent skin tone)',
    aspectRatio: '9:16',
    style: 'fashion-editorial'
  },
  
  3: {
    id: 3,
    rubro: 'Moda Hombre',
    prompt: `Urban streetwear vibe, harsh directional shadows creating depth, gritty texture visible in fabric and skin, bold sans-serif block fonts aggressive and modern, moody blue/grey tones with selective color pop. Street style photography, urban environment background, confident model stance.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, soft lighting, generic pose, outdated fashion, low contrast, washed out colors, amateur Instagram aesthetic)',
    aspectRatio: '9:16',
    style: 'streetwear-urban'
  },
  
  4: {
    id: 4,
    rubro: 'Calzado',
    prompt: `Dynamic low-angle shot from ground level, focus on sole texture and tread pattern, motion blur effect on background to emphasize speed, floating price stickers style with elegant typography. Action shot showing shoe in mid-air or dynamic movement, professional sports photography lighting.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, static product shot, flat lay only, poor focus on sole, amateur lighting, distorted perspective, blurry motion effect)',
    aspectRatio: '9:16',
    style: 'product-dynamic'
  },
  
  5: {
    id: 5,
    rubro: 'Joyas',
    prompt: `Extreme macro photography at jewelry scale, beautiful bokeh highlights from studio lights, dramatic rim lighting on metallic edges creating sparkle, luxury velvet textures as background, diamond and gemstone fire visible. Professional jewelry photography with light refraction analysis.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, flat lighting, no sparkle, dull metal, blurry gemstone, amateur product shot, inconsistent reflections)',
    aspectRatio: '9:16',
    style: 'luxury-jewelry'
  },
  
  6: {
    id: 6,
    rubro: 'Óptica',
    prompt: `Sharp focus on lenses showing perfect clarity, studio reflection creating geometric patterns on glass, symmetrical composition with optical frames centered, clean medical-modern aesthetic with white and chrome elements. Professional eyewear display with proper lighting to show frame details.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, crooked frames, dirty lenses, harsh reflections blocking view, cheap plastic look, inconsistent symmetry)',
    aspectRatio: '9:16',
    style: 'medical-clean'
  },
  
  7: {
    id: 7,
    rubro: 'Belleza/Cosmética',
    prompt: `Dewy skin textures with healthy glow visible, soft-focus pastel backgrounds in peach and rose tones, organic shapes in layout and product placement, minimalist cosmetic layout with elegant product arrangement. Beauty advertisement with professional makeup lighting, product swatches visible.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, oily skin, cakey makeup, harsh backgrounds, cluttered product placement, amateur beauty shot, inconsistent color grading)',
    aspectRatio: '9:16',
    style: 'beauty-soft'
  },
  
  8: {
    id: 8,
    rubro: 'Perfumería',
    prompt: `Ethereal lighting with soft gradients and light leaks, glass transparency effects showing liquid levels, floating liquid particles suspended in air around bottle, high-end fragrance ad style with luxury typography. Dreamy atmosphere with perfume mist visible in light beams.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, flat bottle, no atmosphere, harsh lighting, cheap packaging look, amateur product photography, over-saturated colors)',
    aspectRatio: '9:16',
    style: 'luxury-fragrance'
  },
  
  9: {
    id: 9,
    rubro: 'Bolsos/Carteras',
    prompt: `Flat-lay editorial composition on neutral surface, focus on leather grain texture and hardware details, rich saturated colors in leather tones, sophisticated shadow play creating depth and dimension. Professional e-commerce product photography with lifestyle elements.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, flat lighting, no texture visible, cheap PU leather look, inconsistent colors, amateur flat lay, distorted perspective)',
    aspectRatio: '9:16',
    style: 'luxury-bags'
  },
  
  10: {
    id: 10,
    rubro: 'Accesorios Tech',
    prompt: `Cyber-clean aesthetic with minimalist composition, matte black surfaces absorbing light, subtle RGB glow accents in cyan and magenta, futuristic UI element overlays showing specs, clean studio environment with tech-focused lighting.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, cluttered cables, fingerprints on surfaces, harsh RGB, amateur tech photography, inconsistent lighting, dated design)',
    aspectRatio: '9:16',
    style: 'tech-cyber'
  },
  
  11: {
    id: 11,
    rubro: 'Smartphones',
    prompt: `Glossy screen reflections showing ambient studio lights, smartphone floating in dark space creating depth, neon circuit lines glowing in background, ultra-modern tech vibe with dark aesthetic. Product shot highlighting screen technology and device thinness.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, cracked screen, visible fingerprints, cheap case, amateur product shot, inconsistent reflections, dated model look)',
    aspectRatio: '9:16',
    style: 'tech-premium'
  },
  
  12: {
    id: 12,
    rubro: 'Computación',
    prompt: `Deep shadows creating dramatic product separation, glowing keyboard backlight accents in soft blue, top-down professional setup view showing workspace, productivity-focused lighting with even coverage. Clean desk setup aesthetic with professional peripherals visible.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, messy cables, screen glare, uneven lighting, amateur setup photo, inconsistent shadows, dated hardware)',
    aspectRatio: '9:16',
    style: 'tech-setup'
  },
  
  13: {
    id: 13,
    rubro: 'Gaming',
    prompt: `High-energy RGB saturation with neon colors exploding, glitch art effects and digital artifacts, dark industrial background with metal textures, aggressive gaming typography with angular designs. Esports tournament aesthetic with dynamic composition.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, flat colors, no RGB, amateur gaming setup, inconsistent lighting, cartoony graphics, low contrast)',
    aspectRatio: '9:16',
    style: 'gaming-esports'
  },
  
  14: {
    id: 14,
    rubro: 'Fotografía',
    prompt: `Vintage camera aesthetic with classic film camera silhouette, warm lens flare from golden hour lighting, focus on glass optics showing lens elements, artistic black and white with film grain texture. Classic photography homage with modern execution.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, digital smooth, no grain, cold tones, amateur camera shot, inconsistent vintage look, overprocessed)',
    aspectRatio: '9:16',
    style: 'vintage-camera'
  },
  
  15: {
    id: 15,
    rubro: 'Audio/Sonido',
    prompt: `Visual sound waves represented as elegant curves, matte textures on speaker cabinets absorbing light, moody nightclub lighting with purple and blue tones, focus on grill and mesh details showing acoustic fabric weave. Professional audio equipment display.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, shiny plastic, damaged grill, harsh club lighting, amateur audio shot, inconsistent textures, dated equipment)',
    aspectRatio: '9:16',
    style: 'audio-pro'
  },
  
  16: {
    id: 16,
    rubro: 'Relojes',
    prompt: `Watchmaker precision shot showing movement mechanics, focus on visible gears and springs through transparent caseback, executive mahogany wood background with rich grain, timeless luxury lighting with warm amber tones. Macro watch photography with heritage aesthetic.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, plastic movement, blurry hands, cheap strap, amateur watch photography, inconsistent luxury, dated design)',
    aspectRatio: '9:16',
    style: 'luxury-watch'
  },
  
  17: {
    id: 17,
    rubro: 'Decoración',
    prompt: `Interior design magazine style with perfect room composition, symmetrical furniture placement creating balance, soft shadows indicating window light, warm home atmosphere with cozy color palette, airy composition with negative space. Professional interior photography.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, cluttered room, harsh shadows, cold atmosphere, amateur interior shot, inconsistent symmetry, dated furniture)',
    aspectRatio: '9:16',
    style: 'interior-design'
  },
  
  18: {
    id: 18,
    rubro: 'Muebles',
    prompt: `Studio furniture catalog look with isolated piece on seamless background, focus on wood grain texture and fabric upholstery details, soft bounce lighting eliminating harsh shadows, spacious minimalist room setting. Professional product catalog photography.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, flat lighting, no texture visible, cheap materials, amateur furniture shot, inconsistent shadows, distorted perspective)',
    aspectRatio: '9:16',
    style: 'furniture-catalog'
  },
  
  19: {
    id: 19,
    rubro: 'Iluminación',
    prompt: `High-contrast light and shadow play showing lamp design, long exposure light trails from bulb, focus on visible filament or LED elements, cozy warm glow emanating from fixture. Dramatic lighting design showcase.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, flat lamp, no shadow play, harsh cold light, amateur lighting shot, inconsistent contrast, dated fixture)',
    aspectRatio: '9:16',
    style: 'lighting-design'
  },
  
  20: {
    id: 20,
    rubro: 'Electrodomésticos',
    prompt: `Stainless steel reflections showing clean environment, kitchen setting with modern appliances visible, bright high-key lighting eliminating shadows, focus on digital displays and touch interfaces. Professional appliance showroom photography.`,
    negativePrompt: '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, fingerprints on steel, dark kitchen, outdated appliances, amateur appliance shot, inconsistent reflections, dated design)',
    aspectRatio: '9:16',
    style: 'appliance-modern'
  }
};

// ============================================
// TIPOS TYPESCRIPT
// ============================================

export interface ArtDirectionConfig {
  id: number;
  rubro: string;
  prompt: string;
  negativePrompt: string;
  aspectRatio: '9:16' | '1:1' | '4:5' | '16:9';
  style: string;
}

export interface ArtDirectionInput {
  /** ID del rubro (1-20) */
  industryId: number;
  /** Descripción del producto/servicio del usuario */
  userSubject: string;
  /** Detalles adicionales opcionales */
  userDetails?: string;
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Obtiene la configuración de dirección de arte por ID de rubro
 */
export function getArtDirectionById(id: number): ArtDirectionConfig | null {
  return ART_DIRECTION_PROMPTS[id] || null;
}

/**
 * Busca rubro por nombre (búsqueda flexible)
 */
export function findArtDirectionByName(name: string): ArtDirectionConfig | null {
  const searchTerm = name.toLowerCase();
  
  for (const config of Object.values(ART_DIRECTION_PROMPTS)) {
    if (config.rubro.toLowerCase().includes(searchTerm)) {
      return config;
    }
    // Mapeo de nombres comunes a rubros
    const nameMappings: Record<string, number> = {
      'zapatillas': 4,
      'zapatos': 4,
      'calzado': 4,
      'reloj': 16,
      'joyas': 5,
      'joyería': 5,
      'bolsos': 9,
      'carteras': 9,
      'bolso': 9,
      'moda mujer': 2,
      'ropa mujer': 2,
      'moda hombre': 3,
      'ropa hombre': 3,
      'tech': 10,
      'accesorios tech': 10,
      'celular': 11,
      'smartphone': 11,
      'teléfono': 11,
      'computadora': 12,
      'pc': 12,
      'gaming': 13,
      'videojuegos': 13,
      'perfume': 8,
      'perfumería': 8,
      'belleza': 7,
      'cosméticos': 7,
      'cosmética': 7,
      'óptica': 6,
      'lentes': 6,
      'gafas': 6,
      'muebles': 18,
      'decoración': 17,
      'hogar': 17,
      'iluminación': 19,
      'lampara': 19,
      'electrodomésticos': 20,
      'electrodomestico': 20,
      'audio': 15,
      'sonido': 15,
      'fotografía': 14,
      'foto': 14,
      'cámara': 14,
      'camera': 14,
      'retail': 1,
      'tienda': 1,
      'comercio': 1
    };
    
    if (nameMappings[searchTerm]) {
      return ART_DIRECTION_PROMPTS[nameMappings[searchTerm]] || null;
    }
  }
  
  return null;
}

/**
 * Lista todos los rubros disponibles
 */
export function getAllArtDirections(): ArtDirectionConfig[] {
  return Object.values(ART_DIRECTION_PROMPTS);
}

/**
 * Verifica si un ID de rubro es válido
 */
export function isValidArtDirectionId(id: number): boolean {
  return id in ART_DIRECTION_PROMPTS;
}

// ============================================
// PROMPT NEGATIVO AGENCY ESTÁNDAR
// ============================================

export const AGENCY_NEGATIVE_PROMPT = 
  '(low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design, ' +
  'inconsistent branding, poor color harmony, amateur typography, low resolution, ' +
  'watermark visible, text overlay errors, distorted product, uneven exposure, ' +
  'amateur photography, stock photo look, inconsistent style, overprocessed, ' +
  'AI artifacts, bad composition, rule of thirds violated, poor visual hierarchy)';

// ============================================
// REGLAS DE SAFE ZONE PARA SOCIAL MEDIA 9:16
// ============================================

export const SOCIAL_MEDIA_SAFE_ZONE = `
SAFE_ZONE_GUIDELINES: 
- Keep all critical text and logos within the center 60% of the frame
- Avoid placing important elements in the top 15% (status bar area) and bottom 20% (UI elements area)
- Ensure headline text is legible at small sizes (mobile viewing)
- Maintain 10% padding from all edges for safe margin
- Center composition should account for Instagram Stories and TikTok UI overlays
- Vertical composition optimized for 9:16 (1080x1920) aspect ratio
- Leave space at bottom for caption and interaction buttons
- Keep focal point at eye level (center vertical axis)
`;
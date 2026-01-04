/**
 * 🎬 ESTUDIO 56 - DICCIONARIO MAESTRO DE VIDEO (60 Estilos)
 * 
 * Sistema de 60 estilos de video mapeados 1:1 con los rubros de Dirección de Arte.
 * Cada estilo tiene un Motion Style único específico para el rubro.
 * 
 * Estructura: [DESCRIPCIÓN VISUAL] + [MOVIMIENTO DE CÁMARA] + [ACCIÓN] + High resolution, cinematic 4k.
 */

// ============================================
// CONFIGURACIÓN DE ESTILOS DE VIDEO
// ============================================

export interface VideoStyleConfig {
  /** ID del estilo de video */
  id: number;
  /** Clave del estilo (usada en el código) */
  key: string;
  /** Nombre legible del estilo */
  label: string;
  /** Rubro asociado */
  rubro: string;
  /** Categoría del estilo */
  category: string;
  /** Prompt completo de generación */
  prompt: string;
  /** Descripción del movimiento de cámara */
  motionStyle: string;
  /** Tags para búsqueda */
  tags: string[];
  /** Ejemplo de uso */
  example: string;
}

// ============================================
// 🎨 BLOQUE 1: RETAIL Y ESTÉTICA (Movimiento "Smooth & Macro")
// IDs 1-20: Retail, Moda, Accesorios, Tech
// ============================================

export const VIDEO_STYLES: Record<number, VideoStyleConfig> = {
  // --- Retail General (ID 1) ---
  1: {
    id: 1,
    key: 'video_retail_gen',
    label: 'Retail General',
    rubro: 'Retail General',
    category: 'Retail',
    prompt: `Clean commercial product shot, studio lighting with soft boxes, center-focused composition for 9:16. Professional retail display with perfect exposure, sharp focus on merchandise, clean background. Commercial-grade lighting setup. Smooth lateral pan across organized shelves.`,
    motionStyle: 'Paneo horizontal estable mostrando vitrinas organizadas',
    tags: ['retail', 'tienda', 'comercio', 'ofertas'],
    example: 'Promoción de tienda departamental'
  },

  // --- Moda Mujer (ID 2) ---
  2: {
    id: 2,
    key: 'video_fashion_women',
    label: 'Moda Mujer',
    rubro: 'Moda Mujer',
    category: 'Fashion',
    prompt: `Fashion editorial look, soft daylight filtering through studio windows, elegant serif fonts. Model in graceful pose with natural fabric movement. High-fashion magazine quality, professional hair and makeup visible. Slow runway zoom toward center, fabric flowing softly.`,
    motionStyle: '"Slow runway zoom" hacia el centro, movimiento de telas suave',
    tags: ['moda', 'mujer', 'ropa', 'fashion'],
    example: 'Colección de ropa femenina'
  },

  // --- Moda Hombre (ID 3) ---
  3: {
    id: 3,
    key: 'video_fashion_men',
    label: 'Moda Hombre',
    rubro: 'Moda Hombre',
    category: 'Fashion',
    prompt: `Urban streetwear vibe, harsh directional shadows creating depth, gritty texture in fabric and skin. Bold sans-serif block fonts, modern aggressive design. Street style photography, urban environment background. Handheld rhythmic camera, quick urban lighting cuts.`,
    motionStyle: 'Cámara en mano rítmica, cortes rápidos de iluminación urbana',
    tags: ['moda', 'hombre', 'urbano', 'streetwear'],
    example: 'Ropa urbana masculina'
  },

  // --- Calzado (ID 4) ---
  4: {
    id: 4,
    key: 'video_footwear',
    label: 'Calzado',
    rubro: 'Calzado',
    category: 'Fashion',
    prompt: `Dynamic low-angle shot from ground level, focus on sole texture and tread pattern. Motion blur effect on background emphasizing speed. Floating price stickers with elegant typography. Action shot showing shoe mid-air or dynamic movement. Professional sports photography lighting. Slow 360° rotation on shoe axis.`,
    motionStyle: 'Rotación de 360° lenta sobre el eje del calzado',
    tags: ['zapatos', 'zapatillas', 'calzado', 'sneakers'],
    example: 'Zapatos deportivos o formales'
  },

  // --- Joyas (ID 5) ---
  5: {
    id: 5,
    key: 'video_jewelry',
    label: 'Joyas',
    rubro: 'Joyas',
    category: 'Luxury',
    prompt: `Extreme macro photography at jewelry scale, beautiful bokeh highlights from studio lights. Dramatic rim lighting on metallic edges creating sparkle. Luxury velvet textures as background, diamond and gemstone fire visible. Professional jewelry photography with light refraction analysis. Macro focus pull between light bursts and metal.`,
    motionStyle: '"Macro focus pull" entre destellos de luz y el metal',
    tags: ['joyas', 'anillos', 'diamantes', 'oro', 'lujo'],
    example: 'Joyería fina y accesorios'
  },

  // --- Óptica (ID 6) ---
  6: {
    id: 6,
    key: 'video_optics',
    label: 'Óptica',
    rubro: 'Óptica',
    category: 'Health',
    prompt: `Sharp focus on lenses showing perfect clarity, studio reflection creating geometric patterns on glass. Symmetrical composition with optical frames centered. Clean medical-modern aesthetic with white and chrome elements. Professional eyewear display with proper lighting.`,
    motionStyle: 'Enfoque nítido en el cristal del lente, reflejos limpios',
    tags: ['lentes', 'óptica', 'gafas', 'vista'],
    example: 'Lentes ópticos y de sol'
  },

  // --- Belleza/Cosmética (ID 7) ---
  7: {
    id: 7,
    key: 'video_beauty',
    label: 'Belleza',
    rubro: 'Belleza/Cosmética',
    category: 'Beauty',
    prompt: `Dewy skin textures with healthy glow visible, soft-focus pastel backgrounds in peach and rose tones. Organic shapes in layout and product placement. Minimalist cosmetic layout with elegant product arrangement. Beauty advertisement with professional makeup lighting.`,
    motionStyle: 'Paneo circular en texturas de piel suave',
    tags: ['belleza', 'cosméticos', 'makeup', 'cuidado'],
    example: 'Productos de belleza y cuidado'
  },

  // --- Perfumería (ID 8) ---
  8: {
    id: 8,
    key: 'video_perfume',
    label: 'Perfumería',
    rubro: 'Perfumería',
    category: 'Luxury',
    prompt: `Ethereal lighting with soft gradients and light leaks, glass transparency effects showing liquid levels. Floating liquid particles suspended in air around bottle. High-end fragrance ad style with luxury typography. Dreamy atmosphere with perfume mist visible in light beams.`,
    motionStyle: 'Transparencias y partículas flotando en el aire',
    tags: ['perfume', 'fragancia', 'lujo', 'aromas'],
    example: 'Perfumes y fragancias'
  },

  // --- Bolsos/Carteras (ID 9) ---
  9: {
    id: 9,
    key: 'video_bags',
    label: 'Bolsos',
    rubro: 'Bolsos/Carteras',
    category: 'Fashion',
    prompt: `Flat-lay editorial composition on neutral surface, focus on leather grain texture and hardware details. Rich saturated colors in leather tones. Sophisticated shadow play creating depth and dimension. Professional e-commerce product photography.`,
    motionStyle: 'Enfoque en costuras y texturas de cuero',
    tags: ['bolsos', 'carteras', 'cuero', 'accesorios'],
    example: 'Bolsos y carteras'
  },

  // --- Accesorios Tech (ID 10) ---
  10: {
    id: 10,
    key: 'video_tech_acc',
    label: 'Accesorios Tech',
    rubro: 'Accesorios Tech',
    category: 'Tech',
    prompt: `Cyber-clean aesthetic with minimalist composition, matte black surfaces absorbing light. Subtle RGB glow accents in cyan and magenta. Futuristic UI element overlays showing specs. Clean studio environment with tech-focused lighting.`,
    motionStyle: '"Cyber-glide", luz de neón barriendo superficies mate',
    tags: ['tech', 'accesorios', 'gadgets', 'digital'],
    example: 'Accesorios tecnológicos'
  },

  // --- Smartphones (ID 11) ---
  11: {
    id: 11,
    key: 'video_smartphone',
    label: 'Smartphones',
    rubro: 'Smartphones',
    category: 'Tech',
    prompt: `Glossy screen reflections showing ambient studio lights, smartphone floating in dark space creating depth. Neon circuit lines glowing in background. Ultra-modern tech vibe with dark aesthetic. Product shot highlighting screen technology.`,
    motionStyle: 'Reflejos en pantalla, movimiento lateral suave',
    tags: ['celular', 'smartphone', 'móvil', 'iphone'],
    example: 'Teléfonos móviles'
  },

  // --- Computación (ID 12) ---
  12: {
    id: 12,
    key: 'video_computing',
    label: 'Computación',
    rubro: 'Computación',
    category: 'Tech',
    prompt: `Deep shadows creating dramatic product separation, glowing keyboard backlight accents in soft blue. Top-down professional setup view showing workspace. Productivity-focused lighting with even coverage. Clean desk setup aesthetic.`,
    motionStyle: 'Luces LED de teclado en penumbra',
    tags: ['computadora', 'pc', 'laptop', 'oficina'],
    example: 'Computadores y periféricos'
  },

  // --- Gaming (ID 13) ---
  13: {
    id: 13,
    key: 'video_gaming',
    label: 'Gaming',
    rubro: 'Gaming',
    category: 'Tech',
    prompt: `High-energy RGB saturation with neon colors exploding, glitch art effects and digital artifacts. Dark industrial background with metal textures. Aggressive gaming typography with angular designs. Esports tournament aesthetic with dynamic composition.`,
    motionStyle: 'Vibración de cámara y luces RGB dinámicas',
    tags: ['gaming', 'videojuegos', 'esports', 'rgb'],
    example: 'Setup gaming y periféricos'
  },

  // --- Fotografía (ID 14) ---
  14: {
    id: 14,
    key: 'video_photography',
    label: 'Fotografía',
    rubro: 'Fotografía',
    category: 'Tech',
    prompt: `Vintage camera aesthetic with classic film camera silhouette, warm lens flare from golden hour lighting. Focus on glass optics showing lens elements. Artistic black and white with film grain texture. Classic photography homage.`,
    motionStyle: 'Zoom a lente de cámara vintage',
    tags: ['cámara', 'fotografía', 'lentes', 'camera'],
    example: 'Cámaras y equipos fotográficos'
  },

  // --- Audio/Sonido (ID 15) ---
  15: {
    id: 15,
    key: 'video_audio',
    label: 'Audio',
    rubro: 'Audio/Sonido',
    category: 'Tech',
    prompt: `Visual sound waves represented as elegant curves, matte textures on speaker cabinets absorbing light. Moody nightclub lighting with purple and blue tones. Focus on grill and mesh details showing acoustic fabric weave. Professional audio equipment display.`,
    motionStyle: 'Ondas visuales en vibración mate',
    tags: ['audio', 'sonido', 'parlantes', 'música'],
    example: 'Equipos de audio'
  },

  // --- Relojes (ID 16) ---
  16: {
    id: 16,
    key: 'video_watches',
    label: 'Relojes',
    rubro: 'Relojes',
    category: 'Luxury',
    prompt: `Watchmaker precision shot showing movement mechanics, focus on visible gears and springs through transparent caseback. Executive mahogany wood background with rich grain. Timeless luxury lighting with warm amber tones. Macro watch photography.`,
    motionStyle: 'Zoom ultra-lento hacia las manecillas con desenfoque',
    tags: ['reloj', 'lujo', 'watches', 'premium'],
    example: 'Relojes de lujo'
  },

  // --- Decoración (ID 17) ---
  17: {
    id: 17,
    key: 'video_decor',
    label: 'Decoración',
    rubro: 'Decoración',
    category: 'Home',
    prompt: `Interior design magazine style with perfect room composition, symmetrical furniture placement creating balance. Soft shadows indicating window light. Warm home atmosphere with cozy color palette. Airy composition with negative space.`,
    motionStyle: 'Gran angular, simetría perfecta',
    tags: ['decoración', 'interior', 'hogar', 'diseño'],
    example: 'Productos de decoración'
  },

  // --- Muebles (ID 18) ---
  18: {
    id: 18,
    key: 'video_furniture',
    label: 'Muebles',
    rubro: 'Muebles',
    category: 'Home',
    prompt: `Studio furniture catalog look with isolated piece on seamless background. Focus on wood grain texture and fabric upholstery details. Soft bounce lighting eliminating harsh shadows. Spacious minimalist room setting.`,
    motionStyle: 'Barrido de texturas de madera',
    tags: ['muebles', 'madera', 'hogar', 'interior'],
    example: 'Muebles para el hogar'
  },

  // --- Iluminación (ID 19) ---
  19: {
    id: 19,
    key: 'video_lighting',
    label: 'Iluminación',
    rubro: 'Iluminación',
    category: 'Home',
    prompt: `High-contrast light and shadow play showing lamp design, long exposure light trails from bulb. Focus on visible filament or LED elements. Cozy warm glow emanating from fixture. Dramatic lighting design showcase.`,
    motionStyle: 'Juego de alto contraste luz/sombra',
    tags: ['iluminación', 'lámpara', 'luz', 'led'],
    example: 'Lámparas y sistemas de iluminación'
  },

  // --- Electrodomésticos (ID 20) ---
  20: {
    id: 20,
    key: 'video_appliances',
    label: 'Electrodomésticos',
    rubro: 'Electrodomésticos',
    category: 'Home',
    prompt: `Stainless steel reflections showing clean environment, kitchen setting with modern appliances visible. Bright high-key lighting eliminating shadows. Focus on digital displays and touch interfaces. Professional appliance showroom photography.`,
    motionStyle: 'Reflejos metálicos limpios',
    tags: ['electrodomésticos', 'cocina', 'hogar', 'moderno'],
    example: 'Electrodomésticos modernos'
  },

  // ============================================
  // 🍕 BLOQUE 2: GASTRONOMÍA (Movimiento "Organic & Appetite")
  // IDs 21-30: Comida, Restaurantes, Bebidas
  // ============================================

  // --- Gimnasio/Deporte (ID 21) ---
  21: {
    id: 21,
    key: 'video_gym',
    label: 'Gimnasio',
    rubro: 'Gimnasio/Deporte',
    category: 'Health',
    prompt: `High-energy fitness environment, dramatic rim lighting on athletes, sweat visible on skin. Dynamic action shots with muscle definition. Bold aggressive typography. Professional sports photography with intensity.`,
    motionStyle: '"Energy pulse", cámara que sigue el ritmo del ejercicio',
    tags: ['gym', 'deporte', 'fitness', 'entrenamiento'],
    example: 'Gimnasio y equipamiento deportivo'
  },

  // --- Gastronomía (ID 22) ---
  22: {
    id: 22,
    key: 'video_gastronomy',
    label: 'Gastronomía',
    rubro: 'Gastronomía',
    category: 'Food',
    prompt: `Professional food photography, steam rising from hot dishes, rich color saturation. Plated dishes with artistic presentation. Restaurant-quality lighting with warm tones. "Steam rising" camera approaching the plate.`,
    motionStyle: '"Steam rising", cámara que se acerca al plato humeante',
    tags: ['comida', 'restaurante', 'gastronomía', 'platos'],
    example: 'Platos de restaurante'
  },

  // --- Spa/Wellness (ID 23) ---
  23: {
    id: 23,
    key: 'video_wellness_zen',
    label: 'Spa/Wellness',
    rubro: 'Spa/Wellness',
    category: 'Health',
    prompt: `Tranquil spa environment, soft ambient lighting, water droplets on stones, gentle steam. Peaceful atmosphere with natural elements. Minimalist design with calming colors. "Water drop" gentle impact with ripple effect.`,
    motionStyle: 'Gota de agua cayendo con efecto ripple',
    tags: ['spa', 'wellness', 'relajación', 'masaje'],
    example: 'Servicios de spa y bienestar'
  },

  // --- Médico/Clínico (ID 24) ---
  24: {
    id: 24,
    key: 'video_medical',
    label: 'Médico',
    rubro: 'Médico/Clínico',
    category: 'Health',
    prompt: `Clinical medical environment, pristine white surfaces, sterile equipment in focus. Professional healthcare aesthetic with blue-toned lighting. "Clinical slide" camera movement showing clean spaces.`,
    motionStyle: 'Estabilidad total, "Clinical slide", ambiente blanco inmaculado',
    tags: ['médico', 'clínica', 'salud', 'dental'],
    example: 'Servicios médicos y clínicos'
  },

  // --- Corporativo (ID 25) ---
  25: {
    id: 25,
    key: 'video_corporate',
    label: 'Corporativo',
    rubro: 'Corporativo',
    category: 'Business',
    prompt: `Professional business environment, modern office architecture, clean lines and glass surfaces. Corporate meeting spaces, sleek design. Timelapse of office activity showing productivity.`,
    motionStyle: 'Timelapse de oficina, movimiento lento y profesional',
    tags: ['corporativo', 'oficina', 'negocios', 'empresa'],
    example: 'Servicios corporativos'
  },

  // --- Inmobiliaria (ID 26) ---
  26: {
    id: 26,
    key: 'video_real_estate',
    label: 'Inmobiliaria',
    rubro: 'Inmobiliaria',
    category: 'Real Estate',
    prompt: `Luxury property showcase, wide-angle interior shots, golden hour lighting through windows. Professional real estate cinematography. Slow 180° pan of illuminated interiors.`,
    motionStyle: 'Gran angular, paneo lento de habitaciones iluminadas',
    tags: ['inmobiliaria', 'propiedades', 'inmuebles', 'casa'],
    example: 'Propiedades y bienes raíces'
  },

  // --- Automotriz (ID 27) ---
  27: {
    id: 27,
    key: 'video_automotive',
    label: 'Automotriz',
    rubro: 'Automotriz',
    category: 'Auto',
    prompt: `Professional automotive photography, gleaming car surfaces, dramatic studio lighting. "Wheel spin" rotation showing tire and rim details. Metallic reflections on hood.`,
    motionStyle: 'Rotación de llanta ("Wheel spin"), reflejos metálicos',
    tags: ['auto', 'vehículos', 'automotriz', 'carro'],
    example: 'Vehículos y servicios automotrices'
  },

  // --- Mascotas (ID 28) ---
  28: {
    id: 28,
    key: 'video_pets',
    label: 'Mascotas',
    rubro: 'Mascotas',
    category: 'Pets',
    prompt: `Adorable pet photography, eye-level shots with animals, soft natural lighting. Playful interactions, happy pets in comfortable environments. Camera at eye level with subject.`,
    motionStyle: 'Cámara a nivel de ojos de la mascota, enfoque suave',
    tags: ['mascotas', 'veterinaria', 'perros', 'gatos'],
    example: 'Servicios para mascotas'
  },

  // --- Viajes (ID 29) ---
  29: {
    id: 29,
    key: 'video_travel',
    label: 'Viajes',
    rubro: 'Viajes',
    category: 'Travel',
    prompt: `Breathtaking travel destinations, vibrant colors of landscapes, golden sunset lighting. Aerial drone shots, scenic viewpoints. "Drone reveal" showing destination from above.`,
    motionStyle: 'Colores vibrantes, luz de atardecer, revelación aérea',
    tags: ['viajes', 'turismo', 'vacaciones', 'destinos'],
    example: 'Agencias de viajes'
  },

  // --- Construcción (ID 30) ---
  30: {
    id: 30,
    key: 'video_construction',
    label: 'Construcción',
    rubro: 'Construcción',
    category: 'Construction',
    prompt: `Construction site documentation, dramatic natural lighting on structures, dust particles visible in light beams. Technical pan shots showing building progress. Heavy movement, dust in light.`,
    motionStyle: 'Movimiento pesado, polvo en luz natural',
    tags: ['construcción', 'obra', 'edificación', 'ingeniería'],
    example: 'Servicios de construcción'
  },

  // ============================================
  // 🛠️ BLOQUE 3: SERVICIOS ESPECIALIZADOS
  // IDs 31-40: Talleres, Servicios Profesionales
  // ============================================

  // --- Taller Mecánico (ID 31) ---
  31: {
    id: 31,
    key: 'video_mechanic',
    label: 'Taller Mecánico',
    rubro: 'Taller Mecánico',
    category: 'Auto',
    prompt: `Professional auto repair environment, tool organization, clean workspace. Action shots of repairs in progress. "Technical fix" camera showing precision work.`,
    motionStyle: '"Technical fix", movimiento preciso de herramientas',
    tags: ['mecánico', 'taller', 'auto', 'reparación'],
    example: 'Servicios de mecánica automotriz'
  },

  // --- Vulcanización (ID 32) ---
  32: {
    id: 32,
    key: 'video_tire_service',
    label: 'Vulcanización',
    rubro: 'Vulcanización',
    category: 'Auto',
    prompt: `Tire service center, wheel and tire display, rubber texture focus. "Tire spin" rotation showing tire condition. Professional automotive service aesthetic.`,
    motionStyle: 'Giro de neumáticos en cámara lenta',
    tags: ['vulcanización', 'neumáticos', 'ruedas', 'gomas'],
    example: 'Servicios de vulcanización'
  },

  // --- Barbería (ID 33) ---
  33: {
    id: 33,
    key: 'video_barber',
    label: 'Barbería',
    rubro: 'Barbería',
    category: 'Beauty',
    prompt: `Classic barbershop environment, vintage aesthetic, dramatic shadows. Razor and tool details, steam from hot towels. "Barber precision" camera with dramatic contrast.`,
    motionStyle: 'Sombras de alto contraste, enfoque en navaja y vapor',
    tags: ['barbería', 'peluquería', 'corte', 'cabello'],
    example: 'Servicios de barbería'
  },

  // --- Veterinaria (ID 34) ---
  34: {
    id: 34,
    key: 'video_veterinary',
    label: 'Veterinaria',
    rubro: 'Veterinaria',
    category: 'Pets',
    prompt: `Clean veterinary clinic environment, professional medical equipment. "Pet interaction" camera showing gentle animal care. Warm, welcoming atmosphere.`,
    motionStyle: 'Interacción suave con mascotas',
    tags: ['veterinaria', 'mascotas', 'salud animal', 'clínica'],
    example: 'Servicios veterinarios'
  },

  // --- Yoga (ID 35) ---
  35: {
    id: 35,
    key: 'video_yoga',
    label: 'Yoga',
    rubro: 'Yoga',
    category: 'Health',
    prompt: `Peaceful yoga environment, soft natural light, practitioners in graceful poses. "Flowing breath" camera movement that rises and falls slowly. Calming atmosphere.`,
    motionStyle: '"Flowing breath", movimiento de cámara que respira',
    tags: ['yoga', 'meditación', 'bienestar', 'flexibilidad'],
    example: 'Estudios de yoga'
  },

  // --- Pilates (ID 36) ---
  36: {
    id: 36,
    key: 'video_pilates',
    label: 'Pilates',
    rubro: 'Pilates',
    category: 'Health',
    prompt: `Modern pilates studio, reformer machines visible, controlled movements. "Reformer glide" linear movement following the carriage. Precision and control aesthetic.`,
    motionStyle: '"Reformer glide", desplazamiento lineal siguiendo la máquina',
    tags: ['pilates', 'reformer', 'ejercicio', 'postura'],
    example: 'Estudios de pilates'
  },

  // --- Kinesiología (ID 37) ---
  37: {
    id: 37,
    key: 'video_physiotherapy',
    label: 'Kinesiología',
    rubro: 'Kinesiología',
    category: 'Health',
    prompt: `Professional rehabilitation environment, therapeutic equipment, patient exercises. "Rehab movement" camera showing recovery process. Clinical yet caring atmosphere.`,
    motionStyle: 'Movimiento de rehabilitación, cámara de seguimiento',
    tags: ['kinesiología', 'rehabilitación', 'fisioterapia', 'terapia'],
    example: 'Servicios de kinesiología'
  },

  // --- Estudio Jurídico (ID 38) ---
  38: {
    id: 38,
    key: 'video_legal',
    label: 'Estudio Jurídico',
    rubro: 'Estudio Jurídico',
    category: 'Professional',
    prompt: `Professional legal environment, law library backgrounds, formal office settings. "Corporate handshake" camera showing professional interactions. Serious, trustworthy atmosphere.`,
    motionStyle: 'Estabilidad corporativa, interacción profesional',
    tags: ['abogado', 'jurídico', 'legal', 'derecho'],
    example: 'Servicios legales'
  },

  // --- Jardinería (ID 39) ---
  39: {
    id: 39,
    key: 'video_gardening',
    label: 'Jardinería',
    rubro: 'Jardinería',
    category: 'Services',
    prompt: `Lush garden environments, healthy plants, natural lighting. "Lawn transformation" camera showing landscape changes. Organic, fresh aesthetic.`,
    motionStyle: 'Transformación de pasto, luz natural filtrada',
    tags: ['jardinería', 'paisajismo', 'plantas', 'verde'],
    example: 'Servicios de jardinería'
  },

  // --- Seguridad (ID 40) ---
  40: {
    id: 40,
    key: 'video_security',
    label: 'Seguridad',
    rubro: 'Seguridad',
    category: 'Services',
    prompt: `Security monitoring center, surveillance screens, professional security equipment. "Surveillance scan" camera movement. High-tech, protective atmosphere.`,
    motionStyle: 'Escaneo de vigilancia, movimiento técnico',
    tags: ['seguridad', 'vigilancia', 'cámaras', 'protección'],
    example: 'Servicios de seguridad'
  },

  // ============================================
  // 🍣 BLOQUE 4: GASTRONOMÍA ESPECIALIZADA
  // IDs 41-50: Comida Rápida, Bebidas, Postres
  // ============================================

  // --- Sushi/Nikkei (ID 41) ---
  41: {
    id: 41,
    key: 'video_sushi',
    label: 'Sushi/Nikkei',
    rubro: 'Sushi/Nikkei',
    category: 'Food',
    prompt: `Artistic Japanese cuisine presentation, fresh fish textures, knife skills. "Sushi prep" camera showing chef's precision. Clean, minimalist aesthetic.`,
    motionStyle: 'Preparación de sushi, precisión de chef',
    tags: ['sushi', 'japonés', 'nikkei', 'comida asiática'],
    example: 'Restaurante de sushi'
  },

  // --- Comida Rápida (ID 42) ---
  42: {
    id: 42,
    key: 'video_fast_food',
    label: 'Comida Rápida',
    rubro: 'Comida Rápida',
    category: 'Food',
    prompt: `Appetizing fast food photography, saturated colors, steam rising. "Griddle sizzle" camera showing cooking action. Energetic, vibrant aesthetic.`,
    motionStyle: 'Zoom agresivo al producto central, acción en plancha',
    tags: ['comida rápida', 'hamburguesa', 'fritura', 'fast food'],
    example: 'Restaurantes de comida rápida'
  },

  // --- Heladería (ID 43) ---
  43: {
    id: 43,
    key: 'video_ice_cream',
    label: 'Heladería',
    rubro: 'Heladería',
    category: 'Food',
    prompt: `Creamy ice cream textures, vibrant colors, cold steam effects. "Ice cream drip" camera showing smooth texture. Fun, colorful aesthetic.`,
    motionStyle: 'Textura cremosa, colores vivos, goteo lento',
    tags: ['helado', 'heladería', 'postre', 'frío'],
    example: 'Heladerías'
  },

  // --- Nail Studio (ID 44) ---
  44: {
    id: 44,
    key: 'video_nail_studio',
    label: 'Nail Studio',
    rubro: 'Nail Studio',
    category: 'Beauty',
    prompt: `Close-up nail art details, precise application of polish, sparkling effects. "Nail shine" camera focusing on details. Clean, glamorous aesthetic.`,
    motionStyle: 'Brillo en uñas, enfoque macro en detalles',
    tags: ['uñas', 'nail art', 'manicure', 'estética'],
    example: 'Salones de uñas'
  },

  // --- Tattoo Studio (ID 45) ---
  45: {
    id: 45,
    key: 'video_tattoo',
    label: 'Tattoo Studio',
    rubro: 'Tattoo Studio',
    category: 'Art',
    prompt: `Artistic tattoo design showcase, ink application process, artistic details. "Tattoo ink" camera showing precision work. Creative, alternative aesthetic.`,
    motionStyle: 'Aplicación de tinta, detalles artísticos',
    tags: ['tattoo', 'tatuaje', 'arte', 'body art'],
    example: 'Estudios de tatuajes'
  },

  // --- Pizzaría (ID 46) ---
  46: {
    id: 46,
    key: 'video_pizza',
    label: 'Pizzería',
    rubro: 'Pizzería',
    category: 'Food',
    prompt: `Wood-fired pizza presentation, bubbling cheese, golden crust. "Pizza heat" camera showing steam and texture. Warm, inviting aesthetic.`,
    motionStyle: 'Queso burbujeante, costra dorada, vapor ascendente',
    tags: ['pizza', 'italiano', 'horno', 'comida'],
    example: 'Pizzerías'
  },

  // --- Veggie/Vegetariano (ID 47) ---
  47: {
    id: 47,
    key: 'video_veggie',
    label: 'Veggie',
    rubro: 'Veggie/Vegetariano',
    category: 'Food',
    prompt: `Fresh vegetable textures, vibrant green colors, natural lighting. "Veggie fresh" camera showing organic movement. Healthy, natural aesthetic.`,
    motionStyle: 'Luz natural filtrada, colores verdes vibrantes',
    tags: ['vegetariano', 'vegano', 'saludable', 'verduras'],
    example: 'Restaurantes vegetarianos'
  },

  // --- Café (ID 48) ---
  48: {
    id: 48,
    key: 'video_coffee',
    label: 'Café',
    rubro: 'Café',
    category: 'Food',
    prompt: `Rich coffee textures, steam rising, latte art details. "Coffee pour" camera showing preparation process. Warm, cozy aesthetic.`,
    motionStyle: 'Vertido de café, vapor, texturas de grano',
    tags: ['café', 'barista', 'coffee shop', 'espresso'],
    example: 'Cafeterías'
  },

  // --- Panadería (ID 49) ---
  49: {
    id: 49,
    key: 'video_bakery',
    label: 'Panadería',
    rubro: 'Panadería',
    category: 'Food',
    prompt: `Golden crust bread textures, flour particles suspended in air, warm oven glow. "Golden crust focus" zoom to bread texture. Rustic, warm aesthetic.`,
    motionStyle: 'Zoom a la costra dorada, partículas de harina',
    tags: ['panadería', 'pan', 'horno', 'artesanal'],
    example: 'Panaderías'
  },

  // --- Pastelería (ID 50) ---
  50: {
    id: 50,
    key: 'video_pastry',
    label: 'Pastelería',
    rubro: 'Pastelería',
    category: 'Food',
    prompt: `Elegant pastry presentation, delicate cake details, glazes and decorations. "Cake slicing" camera showing texture. Refined, luxurious aesthetic.`,
    motionStyle: 'Enfoque en detalles de glaseado, corte de pastel',
    tags: ['pastelería', 'torta', 'postre', 'dulce'],
    example: 'Pastelerías'
  },

  // ============================================
  // 🥩 BLOQUE 5: COMERCIO ESPECIALIZADO
  // IDs 51-60: Tiendas por Rubro
  // ============================================

  // --- Carnicería (ID 51) ---
  51: {
    id: 51,
    key: 'video_butcher',
    label: 'Carnicería',
    rubro: 'Carnicería',
    category: 'Food',
    prompt: `Fresh meat cuts, clean studio lighting, vibrant red colors. "Fresh cut" macro focus on meat fiber and color. Professional butcher shop aesthetic.`,
    motionStyle: 'Macro en cortes frescos de carne, luz de estudio',
    tags: ['carnicería', 'carne', 'corte', 'carnicero'],
    example: 'Carnicerías'
  },

  // --- Ferretería (ID 52) ---
  52: {
    id: 52,
    key: 'video_hardware',
    label: 'Ferretería',
    rubro: 'Ferretería',
    category: 'Tools',
    prompt: `Industrial tool display, metallic textures, organized shelves. "Tool pick" camera showing details. Professional, technical aesthetic.`,
    motionStyle: 'Zoom a herramientas metálicas, texturas industriales',
    tags: ['ferretería', 'herramientas', 'construcción', 'industria'],
    example: 'Ferreterías'
  },

  // --- Librería (ID 53) ---
  53: {
    id: 53,
    key: 'video_bookstore',
    label: 'Librería',
    rubro: 'Librería',
    category: 'Retail',
    prompt: `Book displays, cozy reading environments, vintage and new books. "Book pan" camera showing covers and spines. Intellectual, warm aesthetic.`,
    motionStyle: 'Paneo de libros, movimiento suave entre estantes',
    tags: ['librería', 'libros', 'lectura', 'cultura'],
    example: 'Librerías'
  },

  // --- Florería (ID 54) ---
  54: {
    id: 54,
    key: 'video_florist',
    label: 'Florería',
    rubro: 'Florería',
    category: 'Flowers',
    prompt: `Fresh flower arrangements, water droplets on petals, soft natural light. "Flower mist" camera showing delicate textures. Romantic, fresh aesthetic.`,
    motionStyle: 'Gotas de agua en pétalos, brisa suave',
    tags: ['florería', 'flores', 'ramos', 'arreglos'],
    example: 'Florerías'
  },

  // --- Limpieza (ID 55) ---
  55: {
    id: 55,
    key: 'video_cleaning',
    label: 'Limpieza',
    rubro: 'Limpieza',
    category: 'Services',
    prompt: `Clean surfaces, sparkling results, before and after comparisons. "Cleaning shine" camera showing transformation. Fresh, hygienic aesthetic.`,
    motionStyle: 'Superficies brillantes, transformación visible',
    tags: ['limpieza', 'servicio', 'higiene', 'mantenimiento'],
    example: 'Servicios de limpieza'
  },

  // --- Lavandería (ID 56) ---
  56: {
    id: 56,
    key: 'video_laundry',
    label: 'Lavandería',
    rubro: 'Lavandería',
    category: 'Services',
    prompt: `Clean laundry, fresh fabrics, steam ironing process. "Steam iron" camera showing fabric care. Fresh, hygienic aesthetic.`,
    motionStyle: 'Plancha con vapor, movimiento de telas',
    tags: ['lavandería', 'ropa', 'lavado', 'secado'],
    example: 'Lavanderías'
  },

  // --- Zapatería (ID 57) ---
  57: {
    id: 57,
    key: 'video_shoe_store',
    label: 'Zapatería',
    rubro: 'Zapatería',
    category: 'Fashion',
    prompt: `Shoe displays, leather textures, organized collections. "Shoe walk" camera showing movement and style. Fashion-forward aesthetic.`,
    motionStyle: 'Enfoque en suelas y materiales, movimiento de calzado',
    tags: ['zapatería', 'zapatos', 'calzado', 'moda'],
    example: 'Zapaterías'
  },

  // --- Óptica (ID 58) ---
  58: {
    id: 58,
    key: 'video_optician',
    label: 'Óptica',
    rubro: 'Óptica',
    category: 'Health',
    prompt: `Optical frames display, lens reflections, professional eye care environment. "Optic focus" camera showing precision. Clean, professional aesthetic.`,
    motionStyle: 'Reflejos en cristales ópticos, enfoque preciso',
    tags: ['óptica', 'lentes', 'vista', 'eye care'],
    example: 'Ópticas'
  },

  // --- Servicio Técnico (ID 59) ---
  59: {
    id: 59,
    key: 'video_tech_repair',
    label: 'Servicio Técnico',
    rubro: 'Servicio Técnico',
    category: 'Tech',
    prompt: `Electronic repair environment, circuit boards, micro-soldering. "Tech micro" camera showing precision work. Technical, professional aesthetic.`,
    motionStyle: 'Micro-soldadura, detalles de circuitos',
    tags: ['servicio técnico', 'reparación', 'electrónica', 'tech'],
    example: 'Servicios técnicos'
  },

  // --- Botillería (ID 60) ---
  60: {
    id: 60,
    key: 'video_liquor_store',
    label: 'Botillería',
    rubro: 'Botillería',
    category: 'Food',
    prompt: `Beverage display, bottle arrangements, lighting effects on glass. "Bottle glow" camera showing premium products. Elegant, sophisticated aesthetic.`,
    motionStyle: 'Brillo en botellas, iluminación premium',
    tags: ['botillería', 'bebidas', 'licores', 'alcohol'],
    example: 'Botillerías'
  },
};

// ============================================
// UTILIDADES
// ============================================

/**
 * Obtiene la configuración de estilo de video por ID
 */
export function getVideoStyleById(id: number): VideoStyleConfig | null {
  return VIDEO_STYLES[id] || null;
}

/**
 * Obtiene la configuración de estilo de video por clave
 */
export function getVideoStyleByKey(key: string): VideoStyleConfig | null {
  return Object.values(VIDEO_STYLES).find(style => style.key === key) || null;
}

/**
 * Busca estilos de video por término de búsqueda
 */
export function searchVideoStyles(query: string): VideoStyleConfig[] {
  const normalizedQuery = query.toLowerCase().trim();
  
  if (!normalizedQuery) return Object.values(VIDEO_STYLES);
  
  return Object.values(VIDEO_STYLES).filter(style => 
    style.label.toLowerCase().includes(normalizedQuery) ||
    style.rubro.toLowerCase().includes(normalizedQuery) ||
    style.category.toLowerCase().includes(normalizedQuery) ||
    style.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
  );
}

/**
 * Obtiene todos los estilos de video
 */
export function getAllVideoStyles(): VideoStyleConfig[] {
  return Object.values(VIDEO_STYLES);
}

/**
 * Obtiene estilos de video por categoría
 */
export function getVideoStylesByCategory(category: string): VideoStyleConfig[] {
  return Object.values(VIDEO_STYLES).filter(style => 
    style.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Verifica si un ID de estilo de video es válido
 */
export function isValidVideoStyleId(id: number): boolean {
  return id in VIDEO_STYLES;
}

// ============================================
// MAPEO DE INDUSTRY ID → VIDEO STYLE KEY
// ============================================

/**
 * Mapeo directo de industryId (rubro de Dirección de Arte) a videoStyleKey
 * Esto asegura que cada rubro tenga su estilo de video correspondiente
 */
export const INDUSTRY_TO_VIDEO_MAP: Record<number, string> = {
  // Retail y Moda (1-20)
  1: 'video_retail_gen',
  2: 'video_fashion_women',
  3: 'video_fashion_men',
  4: 'video_footwear',
  5: 'video_jewelry',
  6: 'video_optics',
  7: 'video_beauty',
  8: 'video_perfume',
  9: 'video_bags',
  10: 'video_tech_acc',
  11: 'video_smartphone',
  12: 'video_computing',
  13: 'video_gaming',
  14: 'video_photography',
  15: 'video_audio',
  16: 'video_watches',
  17: 'video_decor',
  18: 'video_furniture',
  19: 'video_lighting',
  20: 'video_appliances',
  
  // Salud y Deporte (21-30)
  21: 'video_gym',
  22: 'video_gastronomy',
  23: 'video_wellness_zen',
  24: 'video_medical',
  25: 'video_corporate',
  26: 'video_real_estate',
  27: 'video_automotive',
  28: 'video_pets',
  29: 'video_travel',
  30: 'video_construction',
  
  // Servicios (31-40)
  31: 'video_mechanic',
  32: 'video_tire_service',
  33: 'video_barber',
  34: 'video_veterinary',
  35: 'video_yoga',
  36: 'video_pilates',
  37: 'video_physiotherapy',
  38: 'video_legal',
  39: 'video_gardening',
  40: 'video_security',
  
  // Gastronomía Especializada (41-50)
  41: 'video_sushi',
  42: 'video_fast_food',
  43: 'video_ice_cream',
  44: 'video_nail_studio',
  45: 'video_tattoo',
  46: 'video_pizza',
  47: 'video_veggie',
  48: 'video_coffee',
  49: 'video_bakery',
  50: 'video_pastry',
  
  // Comercio Especializado (51-60)
  51: 'video_butcher',
  52: 'video_hardware',
  53: 'video_bookstore',
  54: 'video_florist',
  55: 'video_cleaning',
  56: 'video_laundry',
  57: 'video_shoe_store',
  58: 'video_optician',
  59: 'video_tech_repair',
  60: 'video_liquor_store',
};

/**
 * Obtiene el videoStyleKey correspondiente a un industryId
 */
export function getVideoStyleKeyFromIndustryId(industryId: number): string {
  return INDUSTRY_TO_VIDEO_MAP[industryId] || 'video_retail_gen';
}

/**
 * Obtiene la configuración completa de video a partir de un industryId
 */
export function getVideoConfigFromIndustryId(industryId: number): VideoStyleConfig | null {
  const videoStyleKey = getVideoStyleKeyFromIndustryId(industryId);
  return getVideoStyleByKey(videoStyleKey);
}

// ============================================
// EXPORTACIÓN DEL SISTEMA
// ============================================

export const VIDEO_STYLES_SYSTEM = {
  /** Catálogo completo de estilos */
  catalog: VIDEO_STYLES,
  /** Total de estilos */
  totalStyles: 60,
  /** Mapeo industry → video */
  industryToVideo: INDUSTRY_TO_VIDEO_MAP,
  /** Versión del sistema */
  version: '2.0.0',
  /** Fecha de actualización */
  updated: new Date().toISOString(),
  
  // Funciones
  getById: getVideoStyleById,
  getByKey: getVideoStyleByKey,
  search: searchVideoStyles,
  getAll: getAllVideoStyles,
  getByCategory: getVideoStylesByCategory,
  getKeyFromIndustry: getVideoStyleKeyFromIndustryId,
  getConfigFromIndustry: getVideoConfigFromIndustryId,
  isValid: isValidVideoStyleId,
};
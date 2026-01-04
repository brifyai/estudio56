/**
 * 🎯 SISTEMA DE PALABRAS ANCLA PARA DETECCIÓN DE VIDEO
 * 
 * Este sistema implementa la lógica de "Palabras Ancla" para evitar errores
 * de detección como el caso "Vive Pilates" → "Spa".
 * 
 * Reglas:
 * - Sustantivos Técnicos (Anclas): Valen 3x más en el cálculo de confianza
 * - Adjetivos Genéricos: Valen 1x (ej. "premium", "sereno")
 * - Anti-Anclas: Si se detectan, reducen drásticamente la probabilidad
 */

// ============================================
// CONFIGURACIÓN DE ANCLAS POR ESTILO DE VIDEO
// ============================================

export interface VideoAnchorConfig {
  /** Clave del estilo de video */
  videoStyleKey: string;
  /** Palabras ancla (sustantivos técnicos) - Peso: 3x */
  anchors: string[];
  /** Palabras prohibidas (exclusión) - Peso: -5x */
  antiAnchors: string[];
  /** Palabras relacionadas (adjetivos) - Peso: 1x */
  relatedWords: string[];
  /** Rubro asociado */
  rubro: string;
  /** Descripción del estilo */
  description: string;
}

// ============================================
// DICCIONARIO DE ANCLAS (60 Estilos)
// ============================================

export const VIDEO_ANCHORS: Record<string, VideoAnchorConfig> = {
  // --- BLOQUE 1: RETAIL Y MODA ---
  
  video_retail_gen: {
    videoStyleKey: 'video_retail_gen',
    anchors: ['oferta', 'descuento', 'promoción', 'sale', 'liquidación', 'tienda', 'comercio'],
    antiAnchors: ['comida', 'restaurante', 'spa', 'gimnasio'],
    relatedWords: ['barato', 'económico', 'rebaja', 'temporada'],
    rubro: 'Retail General',
    description: 'Estilo general para comercio minorista'
  },

  video_fashion_women: {
    videoStyleKey: 'video_fashion_women',
    anchors: ['vestido', 'ropa', 'moda', 'fashion', 'colección', 'temporada', 'prenda'],
    antiAnchors: ['hombre', 'deporte', 'herramientas', 'comida'],
    relatedWords: ['elegante', 'femenino', 'tendencia', 'premium'],
    rubro: 'Moda Mujer',
    description: 'Fashion editorial para mujer'
  },

  video_fashion_men: {
    videoStyleKey: 'video_fashion_men',
    anchors: ['traje', 'camisa', 'hombre', 'masculino', 'urban', 'streetwear'],
    antiAnchors: ['mujer', 'niño', 'comida', 'belleza'],
    relatedWords: ['moderno', 'urbano', 'contemporáneo', 'formal'],
    rubro: 'Moda Hombre',
    description: 'Estilo urbano para hombre'
  },

  video_footwear: {
    videoStyleKey: 'video_footwear',
    anchors: ['zapato', 'zapatilla', 'calzado', 'tenis', 'sneaker', 'bota', 'sandalia'],
    antiAnchors: ['ropa', 'comida', 'tecnología'],
    relatedWords: ['deportivo', 'formal', 'cómodo', 'moda'],
    rubro: 'Calzado',
    description: 'Producto calzado dinámico'
  },

  video_jewelry: {
    videoStyleKey: 'video_jewelry',
    anchors: ['anillo', 'diamante', 'oro', 'joya', 'collar', 'pulsera', 'aros', 'joyería'],
    antiAnchors: ['ropa', 'comida', 'descuento', 'liquidación', 'barato'],
    relatedWords: ['lujo', 'premium', 'elegante', 'fino', 'exclusivo'],
    rubro: 'Joyas',
    description: 'Joyería fina y accesorios'
  },

  video_optics: {
    videoStyleKey: 'video_optics',
    anchors: ['lente', 'gafa', 'óptica', 'vista', 'armazón', 'receta', 'anteojo'],
    antiAnchors: ['joya', 'ropa', 'comida', 'spa'],
    relatedWords: ['visión', 'moda', 'protección', 'moderno'],
    rubro: 'Óptica',
    description: 'Lentes ópticos y de sol'
  },

  video_beauty: {
    videoStyleKey: 'video_beauty',
    anchors: ['makeup', 'cosmético', 'labial', 'base', 'sombras', 'perfume', 'crema'],
    antiAnchors: ['ropa', 'comida', 'herramientas', 'deporte'],
    relatedWords: ['bello', 'natural', 'cuidado', 'tendencia'],
    rubro: 'Belleza',
    description: 'Productos de belleza y cuidado'
  },

  video_perfume: {
    videoStyleKey: 'video_perfume',
    anchors: ['perfume', 'fragancia', 'esencia', 'aroma', 'colonia', 'eau'],
    antiAnchors: ['comida', 'ropa', 'herramientas', 'deporte'],
    relatedWords: ['lujo', 'elegante', 'femenino', 'masculino', 'exclusivo'],
    rubro: 'Perfumería',
    description: 'Perfumes y fragancias'
  },

  video_bags: {
    videoStyleKey: 'video_bags',
    anchors: ['bolso', 'cartera', 'mochila', 'bolso', 'bolsillo', 'accesorio'],
    antiAnchors: ['comida', 'herramientas', 'deporte'],
    relatedWords: ['cuero', 'moda', 'elegante', 'tendencia'],
    rubro: 'Bolsos',
    description: 'Bolsos y carteras'
  },

  video_tech_acc: {
    videoStyleKey: 'video_tech_acc',
    anchors: ['cargador', 'cable', 'funda', 'auricular', 'gadget', 'accesorio tech'],
    antiAnchors: ['ropa', 'comida', 'joya'],
    relatedWords: ['digital', 'moderno', 'innovador', 'práctico'],
    rubro: 'Accesorios Tech',
    description: 'Accesorios tecnológicos'
  },

  video_smartphone: {
    videoStyleKey: 'video_smartphone',
    anchors: ['celular', 'smartphone', 'móvil', 'iphone', 'samsung', 'android'],
    antiAnchors: ['computadora', 'ropa', 'comida'],
    relatedWords: ['moderno', 'tecnología', 'pantalla', 'cámara'],
    rubro: 'Smartphones',
    description: 'Teléfonos móviles'
  },

  video_computing: {
    videoStyleKey: 'video_computing',
    anchors: ['computadora', 'pc', 'laptop', 'notebook', 'mac', 'windows'],
    antiAnchors: ['celular', 'ropa', 'comida'],
    relatedWords: ['oficina', 'trabajo', 'productividad', 'potente'],
    rubro: 'Computación',
    description: 'Computadores y periféricos'
  },

  video_gaming: {
    videoStyleKey: 'video_gaming',
    anchors: ['videojuego', 'gaming', 'gamer', 'esports', 'consola', 'playstation', 'xbox'],
    antiAnchors: ['oficina', 'trabajo', 'comida', 'ropa'],
    relatedWords: ['rgb', 'dinámico', 'intenso', 'virtual'],
    rubro: 'Gaming',
    description: 'Setup gaming'
  },

  video_photography: {
    videoStyleKey: 'video_photography',
    anchors: ['cámara', 'lente', 'fotografía', 'sensor', 'dslr', 'mirrorless'],
    antiAnchors: ['comida', 'ropa', 'deporte'],
    relatedWords: ['profesional', 'calidad', 'imagen', 'captura'],
    rubro: 'Fotografía',
    description: 'Equipos fotográficos'
  },

  video_audio: {
    videoStyleKey: 'video_audio',
    anchors: ['parlante', 'audio', 'sonido', 'auricular', 'bocina', 'amplificador'],
    antiAnchors: ['imagen', 'visual', 'ropa', 'comida'],
    relatedWords: ['música', 'potencia', 'calidad', 'bass'],
    rubro: 'Audio',
    description: 'Equipos de audio'
  },

  video_watches: {
    videoStyleKey: 'video_watches',
    anchors: ['reloj', 'watch', 'cronógrafo', 'pulsera', 'caja', 'manecilla'],
    antiAnchors: ['anillo', 'collar', 'ropa', 'comida'],
    relatedWords: ['lujo', 'premium', 'elegante', 'clásico', 'moderno'],
    rubro: 'Relojes',
    description: 'Relojes de lujo'
  },

  video_decor: {
    videoStyleKey: 'video_decor',
    anchors: ['decoración', 'adorno', 'cuadro', 'escultura', 'jarón', 'velas'],
    antiAnchors: ['ropa', 'comida', 'deporte'],
    relatedWords: ['hogar', 'elegante', 'acogedor', 'estilo'],
    rubro: 'Decoración',
    description: 'Productos de decoración'
  },

  video_furniture: {
    videoStyleKey: 'video_furniture',
    anchors: ['mueble', 'silla', 'mesa', 'sofá', 'cama', 'armario'],
    antiAnchors: ['ropa', 'comida', 'tecnología'],
    relatedWords: ['madera', 'diseño', 'confort', 'moderno'],
    rubro: 'Muebles',
    description: 'Muebles para el hogar'
  },

  video_lighting: {
    videoStyleKey: 'video_lighting',
    anchors: ['lámpara', 'luz', 'iluminación', 'foco', 'ampolleta', 'led'],
    antiAnchors: ['ropa', 'comida', 'mueble'],
    relatedWords: ['ambiente', 'calidez', 'moderno', 'eficiente'],
    rubro: 'Iluminación',
    description: 'Sistemas de iluminación'
  },

  video_appliances: {
    videoStyleKey: 'video_appliances',
    anchors: ['electrodoméstico', 'refrigerador', 'lavadora', 'microondas', 'cocina'],
    antiAnchors: ['ropa', 'comida', 'mueble'],
    relatedWords: ['moderno', 'eficiente', 'hogar', 'tecnología'],
    rubro: 'Electrodomésticos',
    description: 'Electrodomésticos modernos'
  },

  // --- BLOQUE 2: SALUD Y DEPORTE ---

  video_gym: {
    videoStyleKey: 'video_gym',
    anchors: ['gimnasio', 'gym', 'pesa', 'mancuerna', 'barra', 'entrenamiento', 'crossfit'],
    antiAnchors: ['spa', 'masaje', 'velas', 'relajación', 'yoga', 'pilates'],
    relatedWords: ['fuerte', 'intenso', 'musculo', 'sudor', 'energía'],
    rubro: 'Gimnasio',
    description: 'Gimnasio y deporte'
  },

  video_gastronomy: {
    videoStyleKey: 'video_gastronomy',
    anchors: ['restaurante', 'plato', 'comida gourmet', 'chef', 'cocina', 'menú'],
    antiAnchors: ['ropa', 'tecnología', 'deporte', 'spa'],
    relatedWords: ['delicioso', 'fresco', 'artesanal', 'premium'],
    rubro: 'Gastronomía',
    description: 'Restaurantes y comida'
  },

  video_wellness_zen: {
    videoStyleKey: 'video_wellness_zen',
    anchors: ['spa', 'masaje', 'relajación', 'velas', 'aromaterapia', 'sauna', 'jacuzzi'],
    antiAnchors: ['gimnasio', 'deporte', 'entrenamiento', 'sudor', 'pesa'],
    relatedWords: ['calma', 'paz', 'serenidad', 'bienestar', 'zen'],
    rubro: 'Spa/Wellness',
    description: 'Servicios de spa y relax'
  },

  video_medical: {
    videoStyleKey: 'video_medical',
    anchors: ['médico', 'clínica', 'doctor', 'enfermería', 'hospital', 'salud'],
    antiAnchors: ['spa', 'relax', 'masaje', 'belleza', 'gimnasio'],
    relatedWords: ['profesional', 'limpio', 'seguro', 'confiable'],
    rubro: 'Médico',
    description: 'Servicios médicos'
  },

  video_corporate: {
    videoStyleKey: 'video_corporate',
    anchors: ['oficina', 'empresa', 'corporativo', 'negocio', 'trabajo', 'reunión'],
    antiAnchors: ['casa', 'hogar', 'deporte', 'comida'],
    relatedWords: ['profesional', 'formal', 'serio', 'confiable'],
    rubro: 'Corporativo',
    description: 'Entorno empresarial'
  },

  video_real_estate: {
    videoStyleKey: 'video_real_estate',
    anchors: ['inmueble', 'casa', 'departamento', 'propiedad', 'terreno', 'proyecto'],
    antiAnchors: ['ropa', 'comida', 'deporte'],
    relatedWords: ['lujoso', 'moderno', 'espacioso', 'ubicación'],
    rubro: 'Inmobiliaria',
    description: 'Propiedades inmobiliarias'
  },

  video_automotive: {
    videoStyleKey: 'video_automotive',
    anchors: ['auto', 'vehículo', 'coche', 'carro', 'camioneta', 'suv'],
    antiAnchors: ['casa', 'ropa', 'comida'],
    relatedWords: ['potente', 'lujoso', 'moderno', 'rendimiento'],
    rubro: 'Automotriz',
    description: 'Vehículos'
  },

  video_pets: {
    videoStyleKey: 'video_pets',
    anchors: ['mascota', 'perro', 'gato', 'veterinaria', 'pet', 'animal'],
    antiAnchors: ['ropa', 'comida humana', 'deporte'],
    relatedWords: ['cariñoso', 'divertido', 'leal', 'adorable'],
    rubro: 'Mascotas',
    description: 'Servicios para mascotas'
  },

  video_travel: {
    videoStyleKey: 'video_travel',
    anchors: ['viaje', 'vacaciones', 'turismo', 'destino', 'hotel', 'vuelo'],
    antiAnchors: ['trabajo', 'oficina', 'casa'],
    relatedWords: ['exótico', 'relajante', 'aventura', 'exploración'],
    rubro: 'Viajes',
    description: 'Agencias de viajes'
  },

  video_construction: {
    videoStyleKey: 'video_construction',
    anchors: ['construcción', 'obra', 'edificio', 'cemento', 'hierro', 'arquitectura'],
    antiAnchors: ['ropa', 'comida', 'tecnología'],
    relatedWords: ['sólido', 'seguro', 'moderno', 'innovador'],
    rubro: 'Construcción',
    description: 'Servicios de construcción'
  },

  // --- BLOQUE 3: SERVICIOS ESPECIALIZADOS ---

  video_mechanic: {
    videoStyleKey: 'video_mechanic',
    anchors: ['mecánico', 'taller', 'motor', 'reparación', 'auto', 'mecánica'],
    antiAnchors: ['ropa', 'comida', 'belleza', 'spa'],
    relatedWords: ['técnico', 'profesional', 'confiable', 'experto'],
    rubro: 'Taller Mecánico',
    description: 'Servicios mecánicos'
  },

  video_tire_service: {
    videoStyleKey: 'video_tire_service',
    anchors: ['neumático', 'llanta', 'rueda', 'vulcanización', 'goma', 'aceite'],
    antiAnchors: ['ropa', 'comida', 'belleza'],
    relatedWords: ['seguridad', 'tracción', 'durabilidad'],
    rubro: 'Vulcanización',
    description: 'Servicios de neumáticos'
  },

  video_barber: {
    videoStyleKey: 'video_barber',
    anchors: ['barbería', 'barba', 'corte', 'navaja', 'peluquería', 'cabello'],
    antiAnchors: ['spa', 'masaje', 'velas', 'relajación', 'uñas'],
    relatedWords: ['masculino', 'moderno', 'estilo', 'tendencia'],
    rubro: 'Barbería',
    description: 'Servicios de barbería'
  },

  video_veterinary: {
    videoStyleKey: 'video_veterinary',
    anchors: ['veterinaria', 'veterinario', 'mascota', 'animal', 'consulta', 'vacuna'],
    antiAnchors: ['ropa', 'comida humana', 'belleza'],
    relatedWords: ['cuidado', 'salud', 'amor', 'profesional'],
    rubro: 'Veterinaria',
    description: 'Servicios veterinarios'
  },

  video_yoga: {
    videoStyleKey: 'video_yoga',
    anchors: ['yoga', 'meditación', 'respiración', 'postura', 'flexibilidad', 'zen'],
    antiAnchors: ['gimnasio', 'pesa', 'crossfit', 'sudor', 'intenso'],
    relatedWords: ['calma', 'paz', 'equilibrio', 'armonía'],
    rubro: 'Yoga',
    description: 'Estudios de yoga'
  },

  video_pilates: {
    videoStyleKey: 'video_pilates',
    anchors: ['pilates', 'reformer', 'máquina', 'core', 'postura', 'flexión', 'control'],
    antiAnchors: ['spa', 'velas', 'masaje', 'sauna', 'relajación', 'yoga'],
    relatedWords: ['precisión', 'control', 'fortaleza', 'alineación'],
    rubro: 'Pilates',
    description: 'Estudios de pilates'
  },

  video_physiotherapy: {
    videoStyleKey: 'video_physiotherapy',
    anchors: ['kinesiología', 'fisioterapia', 'rehabilitación', 'terapia', 'ejercicio', 'recuperación'],
    antiAnchors: ['spa', 'relajación', 'belleza'],
    relatedWords: ['salud', 'recuperación', 'movimiento', 'bienestar'],
    rubro: 'Kinesiología',
    description: 'Servicios de rehabilitación'
  },

  video_legal: {
    videoStyleKey: 'video_legal',
    anchors: ['abogado', 'jurídico', 'legal', 'derecho', 'estudio', 'contrato'],
    antiAnchors: ['comida', 'ropa', 'deporte'],
    relatedWords: ['profesional', 'confiable', 'serio', 'experto'],
    rubro: 'Estudio Jurídico',
    description: 'Servicios legales'
  },

  video_gardening: {
    videoStyleKey: 'video_gardening',
    anchors: ['jardinería', 'paisajismo', 'planta', 'césped', 'jardín', 'flor'],
    antiAnchors: ['construcción', 'obra', 'cemento'],
    relatedWords: ['verde', 'natural', 'bello', 'armonioso'],
    rubro: 'Jardinería',
    description: 'Servicios de jardinería'
  },

  video_security: {
    videoStyleKey: 'video_security',
    anchors: ['seguridad', 'vigilancia', 'cámara', 'alarma', 'protección', 'cerco'],
    antiAnchors: ['comida', 'ropa', 'deporte'],
    relatedWords: ['protegido', 'seguro', 'confiable', 'vigilante'],
    rubro: 'Seguridad',
    description: 'Servicios de seguridad'
  },

  // --- BLOQUE 4: GASTRONOMÍA ESPECIALIZADA ---

  video_sushi: {
    videoStyleKey: 'video_sushi',
    anchors: ['sushi', 'japonés', 'nikkei', 'pescado', 'sashimi', 'roll', 'arroz'],
    antiAnchors: ['carne', 'parrilla', 'asado', 'hamburguesa'],
    relatedWords: ['fresco', 'artesanal', 'premium', 'elegante'],
    rubro: 'Sushi/Nikkei',
    description: 'Restaurante japonés'
  },

  video_fast_food: {
    videoStyleKey: 'video_fast_food',
    anchors: ['hamburguesa', 'fast food', 'comida rápida', 'papas fritas', 'gaseosa'],
    antiAnchors: ['gourmet', 'elegante', 'formal', 'restaurante'],
    relatedWords: ['rápido', 'delicioso', 'satisfactorio', 'popular'],
    rubro: 'Comida Rápida',
    description: 'Comida rápida'
  },

  video_ice_cream: {
    videoStyleKey: 'video_ice_cream',
    anchors: ['helado', 'heladería', 'sabor', 'cono', 'vaso', 'postre frío'],
    antiAnchors: ['caliente', 'cocina', 'horno', 'asado'],
    relatedWords: ['dulce', 'fresco', 'colorido', 'divertido'],
    rubro: 'Heladería',
    description: 'Heladerías'
  },

  video_nail_studio: {
    videoStyleKey: 'video_nail_studio',
    anchors: ['uñas', 'manicure', 'pedicure', 'nail art', 'esmalte', 'uña'],
    antiAnchors: ['cabello', 'barbería', 'masaje', 'spa'],
    relatedWords: ['bello', 'elegante', 'tendencia', 'cuidado'],
    rubro: 'Nail Studio',
    description: 'Salones de uñas'
  },

  video_tattoo: {
    videoStyleKey: 'video_tattoo',
    anchors: ['tattoo', 'tatuaje', 'ink', 'diseño', 'arte corporal'],
    antiAnchors: ['moda convencional', 'ropa', 'comida'],
    relatedWords: ['arte', 'expresión', 'único', 'personal'],
    rubro: 'Tattoo Studio',
    description: 'Estudios de tatuajes'
  },

  video_pizza: {
    videoStyleKey: 'video_pizza',
    anchors: ['pizza', 'italiano', 'horno de leña', 'queso', 'masa', 'pepperoni'],
    antiAnchors: ['sushi', 'comida asiática', 'carne'],
    relatedWords: ['italiano', 'familiar', 'delicioso', 'compartido'],
    rubro: 'Pizzería',
    description: 'Pizzerías'
  },

  video_veggie: {
    videoStyleKey: 'video_veggie',
    anchors: ['vegetariano', 'vegano', 'verdura', 'saludable', 'organic', 'planta'],
    antiAnchors: ['carne', 'pescado', 'asado', 'parrilla'],
    relatedWords: ['saludable', 'fresco', 'natural', 'ético'],
    rubro: 'Veggie',
    description: 'Restaurantes vegetarianos'
  },

  video_coffee: {
    videoStyleKey: 'video_coffee',
    anchors: ['café', 'espresso', 'barista', 'capuccino', 'latté', 'grano'],
    antiAnchors: ['comida', 'alcohol', 'refresco'],
    relatedWords: ['energía', 'mañana', 'relajación', 'arte'],
    rubro: 'Café',
    description: 'Cafeterías'
  },

  video_bakery: {
    videoStyleKey: 'video_bakery',
    anchors: ['pan', 'masa', 'horno', 'crujiente', 'harina', 'fermento'],
    antiAnchors: ['carne', 'parrilla', 'asado', 'sushi'],
    relatedWords: ['artesanal', 'tradicional', 'fresco', 'dorado'],
    rubro: 'Panadería',
    description: 'Panaderías'
  },

  video_pastry: {
    videoStyleKey: 'video_pastry',
    anchors: ['pastel', 'torta', 'glaseado', 'dulce', 'postre', 'repostería'],
    antiAnchors: ['pan', 'salado', 'carne'],
    relatedWords: ['elegante', 'decorado', 'celebración', 'fino'],
    rubro: 'Pastelería',
    description: 'Pastelerías'
  },

  // --- BLOQUE 5: COMERCIO ESPECIALIZADO ---

  video_butcher: {
    videoStyleKey: 'video_butcher',
    anchors: ['carne', 'corte', 'vacuno', 'cerdo', 'pollo', 'asado', 'carnicería'],
    antiAnchors: ['pan', 'postre', 'vegetariano', 'vegano'],
    relatedWords: ['fresco', 'calidad', 'premium', 'selección'],
    rubro: 'Carnicería',
    description: 'Carnicerías'
  },

  video_hardware: {
    videoStyleKey: 'video_hardware',
    anchors: ['herramienta', 'taladro', 'martillo', 'ferretería', 'tuerca', 'tornillo'],
    antiAnchors: ['moda', 'ropa', 'tela', 'pasarela'],
    relatedWords: ['resistente', 'profesional', 'industrial', 'potente'],
    rubro: 'Ferretería',
    description: 'Ferreterías'
  },

  video_bookstore: {
    videoStyleKey: 'video_bookstore',
    anchors: ['libro', 'lectura', 'librería', 'novela', 'editorial', 'página'],
    antiAnchors: ['comida', 'ropa', 'deporte'],
    relatedWords: ['cultura', 'conocimiento', 'historia', 'aventura'],
    rubro: 'Librería',
    description: 'Librerías'
  },

  video_florist: {
    videoStyleKey: 'video_florist',
    anchors: ['flor', 'ramo', 'arreglo', 'pétalo', 'florería', 'centro de mesa'],
    antiAnchors: ['carne', 'herramienta', 'tecnología'],
    relatedWords: ['bello', 'natural', 'romántico', 'elegante'],
    rubro: 'Florería',
    description: 'Florerías'
  },

  video_cleaning: {
    videoStyleKey: 'video_cleaning',
    anchors: ['limpieza', 'aseo', 'servicio', 'mantenimiento', 'higiene', 'sanitización'],
    antiAnchors: ['construcción', 'obra', 'comida'],
    relatedWords: ['fresco', 'brillante', 'puro', 'seguro'],
    rubro: 'Limpieza',
    description: 'Servicios de limpieza'
  },

  video_laundry: {
    videoStyleKey: 'video_laundry',
    anchors: ['lavandería', 'ropa', 'lavado', 'secado', 'plancha', 'tintorería'],
    antiAnchors: ['comida', 'construcción', 'herramienta'],
    relatedWords: ['fresco', 'limpio', 'ordenado', 'cuidado'],
    rubro: 'Lavandería',
    description: 'Lavanderías'
  },

  video_shoe_store: {
    videoStyleKey: 'video_shoe_store',
    anchors: ['zapato', 'calzado', 'talla', 'plantilla', 'suela', 'zapatería'],
    antiAnchors: ['ropa', 'comida', 'tecnología'],
    relatedWords: ['moda', 'confort', 'estilo', 'tendencia'],
    rubro: 'Zapatería',
    description: 'Zapaterías'
  },

  video_optician: {
    videoStyleKey: 'video_optician',
    anchors: ['óptica', 'lente', 'receta', 'armazón', 'vista', 'optometría'],
    antiAnchors: ['joya', 'moda', 'ropa'],
    relatedWords: ['visión', 'claridad', 'salud', 'moda'],
    rubro: 'Óptica',
    description: 'Ópticas'
  },

  video_tech_repair: {
    videoStyleKey: 'video_tech_repair',
    anchors: ['reparación', 'técnico', 'celular', 'computadora', 'pantalla', 'servicio técnico'],
    antiAnchors: ['ropa', 'comida', 'mueble'],
    relatedWords: ['experto', 'rápido', 'confiable', 'profesional'],
    rubro: 'Servicio Técnico',
    description: 'Servicios técnicos'
  },

  video_liquor_store: {
    videoStyleKey: 'video_liquor_store',
    anchors: ['botillería', 'vino', 'cerveza', 'licor', 'whisky', 'bebida'],
    antiAnchors: ['comida', 'ropa', 'deporte'],
    relatedWords: ['premium', 'selección', 'celebración', 'importado'],
    rubro: 'Botillería',
    description: 'Botillerías'
  },
};

// ============================================
// UTILIDADES DE DETECCIÓN
// ============================================

/**
 * Calcula el puntaje de coincidencia para un estilo de video
 * Basado en palabras ancla (3x), palabras relacionadas (1x) y anti-anclas (-5x)
 */
export function calculateVideoStyleScore(
  input: string,
  anchorConfig: VideoAnchorConfig
): number {
  const normalizedInput = input.toLowerCase();
  let score = 0;

  // Verificar anclas (sustantivos técnicos) - Peso 3x
  for (const anchor of anchorConfig.anchors) {
    if (normalizedInput.includes(anchor.toLowerCase())) {
      score += 3;
    }
  }

  // Verificar palabras relacionadas (adjetivos) - Peso 1x
  for (const related of anchorConfig.relatedWords) {
    if (normalizedInput.includes(related.toLowerCase())) {
      score += 1;
    }
  }

  // Verificar anti-anclas - Peso -5x (exclusión)
  for (const antiAnchor of anchorConfig.antiAnchors) {
    if (normalizedInput.includes(antiAnchor.toLowerCase())) {
      score -= 5;
    }
  }

  return score;
}

/**
 * Detecta el estilo de video más apropiado basado en el input del usuario
 * Implementa la lógica de "Palabras Ancla" para evitar errores como "Vive Pilates" → "Spa"
 */
export function detectVideoStyleFromInput(input: string): {
  videoStyleKey: string;
  confidence: number;
  matchedAnchors: string[];
  detectedAntiAnchors: string[];
} {
  const normalizedInput = input.toLowerCase();
  let bestMatch: { key: string; score: number; config: VideoAnchorConfig } | null = null;
  let bestAntiMatch: { key: string; antiAnchors: string[] } | null = null;

  // Calcular puntaje para cada estilo
  for (const [key, config] of Object.entries(VIDEO_ANCHORS)) {
    const score = calculateVideoStyleScore(input, config);
    
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { key, score, config };
    }

    // Detectar anti-anclas para el estilo actual
    const detectedAntiAnchors = config.antiAnchors.filter(
      anti => normalizedInput.includes(anti.toLowerCase())
    );

    if (detectedAntiAnchors.length > 0) {
      // Si hay anti-anclas detectadas, penalizar fuertemente
      if (!bestAntiMatch || detectedAntiAnchors.length > bestAntiMatch.antiAnchors.length) {
        bestAntiMatch = { key, antiAnchors: detectedAntiAnchors };
      }
    }
  }

  // Si el input contiene anti-anclas del mejor match, reducir confianza
  let finalScore = bestMatch?.score || 0;
  let confidence = 'high';

  if (bestMatch && bestAntiMatch && bestAntiMatch.key === bestMatch.key) {
    // El mejor match tiene anti-anclas, reducir confianza
    finalScore -= bestAntiMatch.antiAnchors.length * 5;
    confidence = 'low';

    // Buscar el segundo mejor match
    let secondBest: typeof bestMatch = null;
    for (const [key, config] of Object.entries(VIDEO_ANCHORS)) {
      if (key === bestMatch.key) continue;
      const score = calculateVideoStyleScore(input, config);
      if (!secondBest || score > secondBest.score) {
        secondBest = { key, score, config };
      }
    }

    // Si el segundo mejor tiene score positivo, usar ese
    if (secondBest && secondBest.score > 0) {
      bestMatch = secondBest;
      confidence = 'medium';
    }
  } else if (finalScore < 3) {
    confidence = 'medium';
  }

  // Recopilar anclas detectadas
  const matchedAnchors = bestMatch 
    ? bestMatch.config.anchors.filter(a => normalizedInput.includes(a.toLowerCase()))
    : [];

  const detectedAntiAnchors = bestMatch
    ? bestMatch.config.antiAnchors.filter(a => normalizedInput.includes(a.toLowerCase()))
    : [];

  return {
    videoStyleKey: bestMatch?.key || 'video_retail_gen',
    confidence: finalScore,
    matchedAnchors,
    detectedAntiAnchors
  };
}

/**
 * Verifica si un estilo de video tiene palabras ancla específicas
 */
export function hasAnchorWords(videoStyleKey: string): boolean {
  const config = VIDEO_ANCHORS[videoStyleKey];
  return config && config.anchors.length > 0;
}

/**
 * Obtiene las anclas de un estilo específico
 */
export function getAnchorsForStyle(videoStyleKey: string): string[] {
  return VIDEO_ANCHORS[videoStyleKey]?.anchors || [];
}

/**
 * Obtiene las anti-anclas de un estilo específico
 */
export function getAntiAnchorsForStyle(videoStyleKey: string): string[] {
  return VIDEO_ANCHORS[videoStyleKey]?.antiAnchors || [];
}

/**
 * Verifica si el input contiene palabras prohibidas para un estilo
 */
export function containsAntiAnchors(input: string, videoStyleKey: string): boolean {
  const antiAnchors = getAntiAnchorsForStyle(videoStyleKey);
  const normalizedInput = input.toLowerCase();
  
  return antiAnchors.some(anti => normalizedInput.includes(anti.toLowerCase()));
}

// ============================================
// EXPORTACIÓN DEL SISTEMA
// ============================================

export const VIDEO_ANCHORS_SYSTEM = {
  /** Catálogo completo de anclas */
  anchors: VIDEO_ANCHORS,
  /** Total de estilos con anclas */
  totalStyles: 60,
  /** Versión del sistema */
  version: '2.0.0',
  /** Fecha de actualización */
  updated: new Date().toISOString(),
  
  // Funciones
  calculateScore: calculateVideoStyleScore,
  detectFromInput: detectVideoStyleFromInput,
  hasAnchors: hasAnchorWords,
  getAnchors: getAnchorsForStyle,
  getAntiAnchors: getAntiAnchorsForStyle,
  containsAntiAnchors,
};
import { FlyerStyleKey, FlyerStyleKeyVideo, FlyerStyleConfig, VideoStyleConfig, AspectRatio, VideoPlanConfig } from './types';

// A. [MASTER STYLE]
// HD Version (Complex)
export const MASTER_STYLE = `Professional social media flyer design. Aesthetic: GraphicRiver bestseller, glossy finish, ultra-detailed, commercial photography, 8k resolution, Unreal Engine 5 render style.`;

// DRAFT Version (Simplified for Flash Model consistency)
export const MASTER_STYLE_DRAFT = `Professional commercial photography, high resolution, 4k, advertising aesthetic.`;

// NEW: PHYSICS GUARDRAIL FOR VIDEO
// Force the model to respect gravity and ground contact.
export const VIDEO_PHYSICS_GUARDRAIL = `
CRITICAL PHYSICS & MOTION RULES:
1. HIGH FRICTION: Feet must be FIRMLY glued to the floor. ABSOLUTELY NO SLIDING, gliding, or "moonwalking".
2. WEIGHT: Subjects must display heavy, realistic weight. No floating. No leaning on invisible walls.
3. MOTION SOURCE: Prefer CAMERA MOVEMENT (Parallax, Slow Zoom) and ATMOSPHERE (Wind, Lights, Particles) over complex body locomotion.
4. STATIC POSE: If the subject is standing, they must remain anchored. Only breathing and subtle posture shifts are allowed.
5. GROUNDING: Shadows must match foot contact perfectly.
6. NO SYMBOLS OR GLYPHS: STRICTLY FORBIDDEN to render letters, numbers, or pseudo-text symbols on any surface. 
7. SURFACE TEXTURES: All walls, signs, and backgrounds must be BLANK, SOLID COLOR, or RAW TEXTURE (e.g., pure brick, pure concrete, pure glass). 
   - IF A SIGN IS PRESENT, IT MUST BE COMPLETELY EMPTY/BLANK. 
   - NO SCRIBBLES. NO GRAFFITI. CLEAN SURFACES ONLY.
`;

// Aspect Ratio Labels for UI - Formatos Publicitarios Oficiales 2025
export const ASPECT_RATIO_LABELS: Record<AspectRatio, string> = {
  // FORMATOS PUBLICITARIOS PRIORITARIOS
  '1:1': '🟦 Ads Universal (1080x1080) - Facebook/Instagram',
  '9:16': '📱 Stories/Ads (1080x1920) - Instagram/TikTok/Facebook',
  '4:5': '📸 Instagram Feed Vertical (1080x1350)',
  '1.91:1': '📘 Facebook Link Post (1200x628)',
  
  // FORMATOS ADICIONALES
  '16:9': '💻 Video Horizontal (1920x1080)',
  '4:3': '📷 Foto Clásica (1024x768)',
  '3:4': '📐 Retrato (768x1024)',
  
  // FORMATOS DE ALTA RESOLUCIÓN
  '1080x1080': '🖼️ HD Cuadrado (1080x1080)',
  '1080x1920': '🎬 HD Vertical (1080x1920)',
  '1080x1350': '📸 HD Instagram (1080x1350)'
};

// B. [CHILEAN CONTEXT - SPLIT]

// 1. BASE: Applies to ALL images (People, Text, Currency)
export const CHILEAN_BASE_CONTEXT = `LOCALE SETTING: Chile (South America).
1. FACES/PEOPLE: Subjects must have realistic Chilean phenotypes (mixed heritage). Clothing: Modern urban western fashion suitable for temperate/cold weather (jackets, hoodies, jeans). No traditional folk costumes unless specified.
2. TEXT & LANGUAGE: ANY visible text in the image (signs, neon, chalkboards, pricing) MUST BE IN SPANISH (Chilean format). 
   - STRICTLY NO ENGLISH TEXT (No "Sale", "Open", "Shop"). 
   - USE: "Oferta", "Abierto", "Liquidación", "Rico".
   - CURRENCY: Use Chilean Peso format with dot separator (e.g. "$1.000", "$5.990").`;

// 1.5 BASE LITE (For Drafts)
export const CHILEAN_CONTEXT_LITE = `Context: Chile. People: Latin/Mixed heritage. Text: Spanish only.`;

// 2. OUTDOOR: Applies ONLY to outdoor styles (Geography Rules)
export const CHILEAN_OUTDOOR_CONTEXT = `GEOGRAPHIC SETTING: CHILE.
The landscape must be visually accurate to the Chilean territory stated in the subject.
1. IF COAST/BEACH: Pacific Ocean (Dark blue/cold water, energetic waves, grey or yellow coarse sand, rocky cliffs). 
   - STRICTLY FORBIDDEN: Turquoise Caribbean water, white powder sand, coconut palm trees.
2. IF LAKE/SOUTH: Deep blue water, surrounding volcanoes, green pine/native forests (Bosque Valdiviano), rainy or cloudy atmosphere.
3. IF CENTRAL ZONE (Santiago/Rapel): Mediterranean climate, dry brownish hills, low bushes, urban trees, modern highways.
4. IF MOUNTAINS: The Andes (High, rocky, sharp peaks, snow-capped).
5. GENERAL BANS: 
   - NO "Mexican" sepia filters or desert pueblo stereotypes. 
   - NO Tropical Jungles. 
   - NO Peruvian/Bolivian Altiplano aesthetics unless specifically asked.`;

// 3. STUDIO: Applies to Retail/Indoor styles (Prevents unwanted landscapes)
export const CHILEAN_STUDIO_CONTEXT = `BACKGROUND ENVIRONMENT:
- STUDIO / INDOOR SETTING.
- STRICTLY FORBIDDEN: Landscapes, Mountains, Skies, Outdoor scenery.
- Focus on the product/subject with the specific style background (Solid color, texture, gradient, interior).`;

// ============================================
// D. [REALIST STYLE VARIANTS - SOLUCIÓN AL "CHOQUE DE TRENES"]
// Cuando el usuario elige "Realista", estas variantes reemplazan los estilos 3D/premium
// Esto evita que Gemini reciba instrucciones contradictorias (ej: "explosión 3D" vs "foto auténtica de negocio local")
// ============================================
export const REALIST_STYLE_VARIANTS: Record<string, string> = {
  // retail_sale: De "explosión 3D" a "foto de tienda real"
  retail_sale: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Chilean Retail Photography. Context: Local neighborhood store or supermarket aisle. Background: Product shelves, promotional displays, shopping carts. Lighting: Bright fluorescent store lighting, harsh shadows. Vibe: Great value, accessible, trustworthy local business. NO floating elements. NO 3D effects. Products must be on shelves or displays.`,
  
  // sport_gritty: De "Nike campaign" a "gym real de barrio"
  sport_gritty: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Local Gym Photography. Context: Neighborhood fitness center, real people exercising. Background: Weight racks, exercise machines, mirrors. Lighting: Bright overhead fluorescent lights, some shadows. Vibe: Approachable, community-focused, no-nonsense fitness. NO dramatic rim lighting. NO sweat droplets in slow motion. Real gym atmosphere.`,
  
  // urban_night: De "cyberpunk club" a "pub/barrio real"
  urban_night: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Neighborhood Bar/Pub Photography. Context: Local bar interior, jukebox, pool table. Background: Wooden tables, bar counter, sports on TV. Lighting: Warm amber incandescent lights, cozy atmosphere. Vibe: Welcoming local hangout, affordable fun. NO neon lasers. NO volumetric fog. Real neighborhood bar.`,
  
  // tech_saas: De "abstract data viz" a "oficina tech real"
  tech_saas: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Local Tech Business Photography. Context: Small tech shop or coworking space, computers on desks. Background: Monitors, keyboards, coffee cups. Lighting: Bright natural window light, practical lamps. Vibe: Helpful local tech support, accessible innovation. NO glowing 3D cubes. NO abstract data networks. Real tech workspace.`,
  
  // luxury_gold: De "royal aesthetic" a "evento nice pero accesible"
  luxury_gold: `Subject: [INSERT SUBJECT HERE]. Style: Nice Local Event Photography. Context: Community hall, wedding reception, birthday celebration. Background: Decorated tables, balloons, stage. Lighting: Warm event lighting, spotlights. Vibe: Special but accessible celebration. NO gold foil textures. NO marble backgrounds. Real local event.`,
  
  // kids_fun: De "3D Pixar" a "fiesta de niños real"
  kids_fun: `Subject: [INSERT SUBJECT HERE]. Style: Real Children's Party Photography. Context: Backyard or party room, kids playing. Background: Piñatas, balloons, party tables. Lighting: Bright natural daylight or party lights. Vibe: Fun, chaotic, joyful childhood memories. NO 3D animated characters. NO glossy plastic textures. Real kids party.`,
  
  // auto_metallic: De "CGI automotriz" a "taller/mecánico real"
  auto_metallic: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Local Auto Shop Photography. Context: Neighborhood mechanic garage, cars on lift. Background: Tools, oil stains, car parts. Lighting: Practical garage lighting, some shadows. Vibe: Trustworthy local service, honest work. NO Unreal Engine renders. NO carbon fiber textures. Real auto shop.`,
  
  // gastronomy: De "Michelin star" a "restaurant/casual real"
  gastronomy: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Local Restaurant Photography. Context: Neighborhood eatery, table with food. Background: Restaurant interior, plates on table. Lighting: Warm indoor restaurant lighting. Vibe: Delicious local food, family-friendly. NO macro lens food porn. NO backlit steam effects. Real restaurant food.`
};

// C. [FLYER STYLES]
export const FLYER_STYLES: Record<FlyerStyleKey, FlyerStyleConfig> = {
  // --- ESTILO DINÁMICO ---
  brand_identity: {
    label: "Identidad Detectada",
    category: "TODOS",
    tags: ["IA", "Custom", "Brand"],
    english_prompt: "Style: Custom Brand Identity. Matching the specific colors, lighting, and composition found in the brand's online presence.",
    visualDescription: "Replica el estilo visual detectado en la URL (Colores, vibra y composición).",
    video_motion: "Slow subtle zoom in on the main subject. The subject remains static and professional.",
    example: "Estilo extraído automáticamente de tu sitio web.",
    previewUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=400&q=80" // Colorful gradient
  },

  // --- VENTAS & COMERCIAL ---
  retail_sale: {
    label: "Ofertas / Liquidación",
    category: "VENTAS",
    tags: ["Rojo", "Urgencia", "3D"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: High-End 3D Commercial Art. Tech: Cinema 4D, Octane Render, Raytracing, 8k resolution. Composition: Dynamic zero-gravity explosion, floating 3D percentage signs (%), confetti. Lighting: Studio softbox lighting, glossy reflections, vibrant rim lights. Vibe: Urgent, energetic, premium advertising.",
    visualDescription: "Explosión 3D en gravedad cero con signos de porcentaje y confetti.",
    video_motion: "Subject holds a static pose smiling. Confetti falls in the foreground. 3D elements float gently.",
    example: "Tienda 'El Ofertón': Liquidación de Invierno, todo con 50% de descuento.",
    previewUrl: "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?auto=format&fit=crop&w=400&q=80"
  },
  typo_bold: {
    label: "Solo Texto / Avisos",
    category: "VENTAS",
    tags: ["Tipografía", "Limpio", "Info"],
    english_prompt: "Subject: [NO SUBJECT - Abstract Background only]. Style: Swiss International Typographic Style Background. Visuals: Abstract smooth gradients, bold geometric shapes, or solid vibrant color. Purpose: Created specifically for heavy text overlays. Tech: Vector art style, ultra-clean, 8k.",
    visualDescription: "Fondos vectoriales limpios para superposición de texto.",
    video_motion: "Kinetic typography animation, words scaling up gently, background colors shifting in a loop.",
    example: "Aviso Económico: SE ARRIENDA / Dpto Estudio Centro, Gastos Comunes Incluidos.",
    previewUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80"
  },
  auto_metallic: {
    label: "Automotriz / Taller",
    category: "VENTAS",
    tags: ["Metal", "Velocidad", "Oscuro"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Automotive Commercial CGI. Render: Unreal Engine 5, Raytraced reflections. Texture: Carbon fiber, brushed aluminum, metallic paint flakes. Effects: Motion blur, sparks, tire smoke. Vibe: Powerful, fast, industrial.",
    visualDescription: "Render CGI automotriz con reflejos raytraced y efectos de velocidad.",
    video_motion: "Low-angle camera, steady, with sparks flying and smoke moving. Car is stationary or wheels spinning in place.",
    example: "Taller 'Velocidad Total': Cambio de Aceite + Revisión de Frenos Gratis.",
    previewUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80"
  },
  gastronomy: {
    label: "Gastronomía / Sushi",
    category: "VENTAS",
    tags: ["Comida", "Detalle", "Cálido"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Michelin-Star Food Photography / Food Porn. Camera: 100mm Macro Lens. Lighting: Backlit with warm golden light to enhance steam and texture. Details: Visible water droplets on fresh ingredients, subsurface scattering on food, smoke/steam rising. Texture: Rustic wood or dark slate background.",
    visualDescription: "Fotografía macro de comida con iluminación backlit dorada.",
    video_motion: "Cinematic Macro (extreme close-up) with minimal movement, steam rising softly.",
    example: "Sanguchería 'El Guatón': Churrasco Italiano XL + Schop Artesanal a $8.990.",
    previewUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80"
  },

  // --- CORPORATIVO & SERIO ---
  corporate: {
    label: "Corporativo / Inmobiliaria",
    category: "CORPORATIVO",
    tags: ["Azul", "Oficina", "Serio"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Premium Corporate Editorial (Forbes Magazine style). Camera: Canon EOS R5, 50mm Prime Lens, f/1.8 aperture. Background: Blurred modern glass architecture, city bokeh, clean geometric lines. Lighting: Cinematic office lighting, cool blue rim light, clean white key light. Vibe: Trustworthy, visionary, successful.",
    visualDescription: "Editorial corporativa estilo Forbes con arquitectura de vidrio.",
    video_motion: "Extremely slow parallax slide. The person is anchored and static. Glass reflections move on the windows.",
    example: "Inmobiliaria 'Los Andes': Últimas unidades en Las Condes, entrega inmediata.",
    previewUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80"
  },
  medical_clean: {
    label: "Médico / Clínica",
    category: "CORPORATIVO",
    tags: ["Blanco", "Salud", "Limpio"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Sterile Medical Design. Palette: Pure White and Light Cyan. Lighting: Bright, shadowless clinical light. Elements: Clean glass surfaces, abstract DNA or cross symbols subtly in background. Vibe: Professional, sanitary, safe, advanced technology.",
    visualDescription: "Diseño médico estéril con blanco puro y cian claro.",
    video_motion: "Clean mechanical camera slide (Slider shot) over static medical equipment.",
    example: "Centro Dental 'Sonrisas': Ortodoncia Invisible, evaluación inicial sin costo.",
    previewUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80"
  },
  tech_saas: {
    label: "Tecnología / Cripto",
    category: "CORPORATIVO",
    tags: ["Tech", "Futuro", "Datos"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Abstract High-Tech Data Visualization. Elements: Network nodes, floating isometric 3D cubes, fiber optics. Palette: Deep Royal Blue and glowing cyan dots. Tech: 3D render, glowing bloom effects, futuristic.",
    visualDescription: "Visualización de datos high-tech con nodos y cubos 3D.",
    video_motion: "Camera glides through static data streams. Glowing nodes pulse. No character movement required.",
    example: "StartUp 'DataChile': Diplomado en Inteligencia Artificial y Python.",
    previewUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80"
  },
  edu_sketch: {
    label: "Educación / Clases",
    category: "CORPORATIVO",
    tags: ["Dibujo", "Colegio", "Verde"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Education Mixed Media (Photo + Sketch). Background: Green Chalkboard or Notebook paper texture. Elements: White chalk hand-drawn doodles (formulas, arrows) overlaid on realistic objects. Vibe: Smart, creative, academic growth.",
    visualDescription: "Mixtura de foto real con doodles en tiza blanca.",
    video_motion: "Stop-motion animation style (low framerate), chalk drawings appearing line by line.",
    example: "Preuniversitario 'Nacional': Matricúlate ahora para la PAES 2025.",
    previewUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80"
  },
  political_community: {
    label: "Candidato / Municipal",
    category: "CORPORATIVO",
    tags: ["Política", "Vecinos", "Confianza"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Modern Political Campaign Photography. Camera: 85mm Portrait Lens (flattering). Lighting: Bright, optimistic daylight, no harsh shadows. Background: Blurred sunny park or suburban neighborhood. Vibe: Trustworthy, approachable, leadership.",
    visualDescription: "Fotografía política moderna con luz diurna optimista.",
    video_motion: "Steady confident push-in (Zoom) on the subject. Subject is smiling and nodding, not walking.",
    example: "Vota María González: Tu voz en el Concejo Municipal de Maipú.",
    previewUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=400&q=80"
  },

  // --- LIFESTYLE & VIBRA ---
  aesthetic_min: {
    label: "Aesthetic / Belleza",
    category: "LIFESTYLE",
    tags: ["Beige", "Suave", "Insta"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Minimalist Product Photography (Instagram 'Clean Girl' Trend). Lighting: Soft-focus natural window light, 'Gobo' shadows (shadows of leaves casting on the scene). Palette: Monochromatic Beige, Cream, White, Sage Green. Texture: Organic linen, matte stone.",
    visualDescription: "Fotografía minimalista con luz natural y sombras de hojas.",
    video_motion: "Very gentle handheld movement (breathing camera), shadows of leaves swaying softly on the wall.",
    example: "Boutique 'Amapola': Nueva colección de lino Otoño-Invierno.",
    previewUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80"
  },
  wellness_zen: {
    label: "Spa / Yoga",
    category: "LIFESTYLE",
    tags: ["Relax", "Naturaleza", "Paz"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Zen Wellness Photography. Lighting: Soft candle light, dim and relaxing. Elements: Water ripples, bamboo, steam. Palette: Earthy Browns, Greens, and Soft White. Vibe: Calm, balance, spiritual, silence.",
    visualDescription: "Fotografía Zen con luz de vela y elementos naturales.",
    video_motion: "Tripod shot (Static), water dripping in super slow motion, candle flame flickering gently.",
    example: "Centro 'Alma Zen': Masaje descontracturante y piedras calientes 2x1.",
    previewUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80"
  },
  pilates: {
    label: "Pilates / Core",
    category: "LIFESTYLE",
    tags: ["Core", "Flexibilidad", "Bienestar"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Pilates Studio Photography. Lighting: Soft, even studio lighting with subtle warm tones. Elements: Pilates reformer or mat, clean studio environment, smooth textures. Palette: Soft Sage Green, Cream, and Light Gray. Vibe: Strength, control, balance, mindful movement.",
    visualDescription: "Fotografía de estudio de pilates con luz suave y colores verdes.",
    video_motion: "Slow, controlled camera movement, subject performing a static pilates pose with controlled breathing.",
    example: "Studio 'Cuerpo Consciente': Clases de Pilates Reformer, mejora tu postura y fortalece tu core.",
    previewUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80"
  },
  summer_beach: {
    label: "Verano / Piscina",
    category: "LIFESTYLE",
    tags: ["Sol", "Agua", "Turismo"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Luxury Travel Photography. Camera: Polarized lens filter, high shutter speed to freeze water. Lighting: Bright natural sunlight, harsh summer shadows, beautiful lens flaring. Colors: Vibrant Teal (water) and Orange (sun warmth). Details: Crystal clear water refraction, wet surfaces.",
    visualDescription: "Fotografía de viaje de lujo con agua turquesa y sol.",
    video_motion: "High shutter speed freeze frame of water splashing. Sunlight flares moving across the lens.",
    example: "Sunset Beach Club: Fiesta de Espuma en Reñaca, Sector 5.",
    previewUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=400&q=80"
  },
  eco_organic: {
    label: "Ecológico / Feria",
    category: "LIFESTYLE",
    tags: ["Reciclado", "Verde", "Natural"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Eco-Friendly Organic Design. Background: Recycled Kraft paper texture or blurred nature. Elements: Fresh green leaves foreground, hand-drawn recycling doodles. Lighting: Soft, bright, shadowless daylight. Vibe: Fresh, clean, sustainable.",
    visualDescription: "Diseño ecológico con papel kraft y hojas frescas.",
    video_motion: "Natural breeze blowing leaves gently, dappled sunlight shifting on the surface.",
    example: "Emporio 'Raíces': Miel orgánica, frutos secos y mermeladas del sur.",
    previewUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80"
  },
  sport_gritty: {
    label: "Deporte / Gym",
    category: "LIFESTYLE",
    tags: ["Fuerza", "Sudor", "Intenso"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Gritty Sports Commercial Photography (Nike Campaign style). Lighting: 'Rembrandt Lighting' (dramatic shadows), high contrast, harsh rim light highlighting sweat and muscle definition. Texture: Skin pores visible, atmospheric dust/chalk in the air. Background: Dark concrete gym or stadium lights.",
    visualDescription: "Fotografía deportiva gritty con iluminación Rembrandt.",
    video_motion: "Super slow motion. Subject is tensed and breathing heavily (heaving chest). Sweat drips. No running.",
    example: "Gimnasio 'Titanium': Plan Anual 50% OFF, sin matrícula de incorporación.",
    previewUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80"
  },

  // --- NOCHE & ENTRETENCIÓN ---
  urban_night: {
    label: "Discoteca / Neón",
    category: "NOCHE",
    tags: ["Fiesta", "Neón", "Urbano"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Cyberpunk Nightlife / Concert Photography. Tech: Volumetric fog, Laser lights, Particle effects. Palette: Neon Purple, Cyan, and Magenta against deep blacks. Lighting: Strong backlighting (Silhouette effect), lens flares, atmospheric haze. Vibe: Electric, high energy, immersive.",
    visualDescription: "Fotografía cyberpunk con neón y efectos volumétricos.",
    video_motion: "Subject stands cool and static. Neon lights trail rapidly around them. Smoke swirls.",
    example: "Club 'La Casona': Sábado de Reggaeton Old School, ellas entran gratis hasta la 1 AM.",
    previewUrl: "https://images.unsplash.com/photo-1566421990479-d3e80064506f?auto=format&fit=crop&w=400&q=80"
  },
  luxury_gold: {
    label: "Gala VIP / Año Nuevo",
    category: "NOCHE",
    tags: ["Dorado", "Elegante", "Premium"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Luxury Royal Aesthetic. Materials: Gold foil, black silk, marble, glitter. Lighting: Soft, warm, sparkling bokeh. Palette: Black and Gold. Vibe: Exclusive, expensive, celebration.",
    visualDescription: "Estética de lujo real con oro y seda negra.",
    video_motion: "Smooth gliding camera (Gimbal shot), gold particles floating in the air. People are talking but standing still.",
    example: "Evento 'Gala Vino': Degustación Premium en Hotel W, reserva tu mesa.",
    previewUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=400&q=80"
  },
  realestate_night: {
    label: "Lujo Nocturno",
    category: "NOCHE",
    tags: ["Exclusivo", "Arquitectura", "Noche"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Luxury Architectural Night Photography. Lighting: Long exposure, 'Blue Hour' sky, warm tungsten interior lights glowing. Reflections: Perfect reflection in swimming pool or glass facade. Vibe: Sophisticated, expensive, serene.",
    visualDescription: "Arquitectura nocturna de lujo con hora azul.",
    video_motion: "Cinematic Drone hover (Aerial shot), slow parallax movement.",
    example: "Inmobiliaria 'Horizonte': Penthouse exclusivo con vista al mar y piscina privada.",
    previewUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80"
  },
  gamer_stream: {
    label: "Gamer / Twitch",
    category: "NOCHE",
    tags: ["Juegos", "Digital", "Glitch"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: 3D Esports Tournament Art. Effects: Glitch art, digital distortion, speed lines. Palette: Neon Green (Razer style) or Twitch Purple. Tech: Unreal Engine 5 render, high sharpness, aggressive angles. Vibe: Competitive, digital, aggressive.",
    visualDescription: "Arte 3D de esports con glitch y neón verde.",
    video_motion: "Character holds a power pose. Digital Glitch transitions overlay the screen. Neon electricity pulsing.",
    example: "Ciber 'Matrix': Torneo de Valorant y League of Legends, premios en efectivo.",
    previewUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80"
  },
  indie_grunge: {
    label: "Tocatas / Rock",
    category: "NOCHE",
    tags: ["Grunge", "Música", "Papel"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Underground Gig Poster. Texture: Distressed brick wall, spray paint stencils, dirty concrete. Palette: Black, Red, and dirty White. Vibe: Rebellious, raw, artistic, lo-fi.",
    visualDescription: "Póster de concierto underground con textura de ladrillo.",
    video_motion: "Vintage 8mm film shutter stutter, static camera with film grain flickering.",
    example: "Bar 'El Hueso': Tocata en vivo este viernes, Bandas Tributo Rock Latino.",
    previewUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=400&q=80"
  },

  // --- EVENTOS & ESPECIALES ---
  kids_fun: {
    label: "Infantil / Cumpleaños",
    category: "EVENTOS",
    tags: ["Niños", "Color", "3D"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: 3D Pixar/Disney Animation Style. Render: Glossy plastic textures, soft rubber. Palette: Bright Primary Colors (Red, Blue, Yellow). Lighting: Soft, rounded, high-key lighting. Vibe: Playful, safe, happy, magical.",
    visualDescription: "Animación 3D estilo Pixar con colores primarios.",
    video_motion: "Bouncy animation physics, balloons floating upwards, confetti popping. Characters jump in place.",
    example: "Cumpleaños 'Mundo Feliz': Arriendo de juegos inflables, pintacaritas y magia.",
    previewUrl: "https://images.unsplash.com/photo-1502086223501-681a6bc64936?auto=format&fit=crop&w=400&q=80"
  },
  worship_sky: {
    label: "Iglesia / Espiritual",
    category: "EVENTOS",
    tags: ["Cielo", "Paz", "Luz"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Majestic & Ethereal Photography. Lighting: 'God Rays' (Volumetric light beams) descending from clouds/sky. Palette: Gold, White, and Sky Blue. Atmosphere: Peaceful, divine, grand scale, minimal dust particles in light. Vibe: Hope, faith, solemnity.",
    visualDescription: "Fotografía etérea con rayos de luz divina.",
    video_motion: "Slow cinematic tilt up towards the sky, clouds drifting majestically.",
    example: "Iglesia 'Vida Nueva': Gran Vigilia de Jóvenes este Sábado a las 20:00 hrs.",
    previewUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=400&q=80"
  },
  seasonal_holiday: {
    label: "Navidad / Festivo",
    category: "EVENTOS",
    tags: ["Regalos", "Mágico", "Brillo"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: 3D Festive Holiday Render. Materials: High-gloss plastic, silk ribbons, glitter, snow texture. Lighting: Sparkling, magical, warm fairy lights. Render: 8k, Octane render, highly detailed. Vibe: Celebration, joy, abundance.",
    visualDescription: "Render 3D festivo con glitter y luces de hadas.",
    video_motion: "Magical atmosphere, camera orbiting slowly around centerpiece, snow/sparkles falling gently.",
    example: "Tienda 'Regalos Mágicos': Venta especial de Navidad, todo con 30% descuento.",
    previewUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=400&q=80"
  },
  art_double_exp: {
    label: "Artístico / Teatro",
    category: "EVENTOS",
    tags: ["Arte", "Surreal", "Teatro"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Artistic Double Exposure. Composition: Seamless blend between silhouette and nature landscape. Background: Minimalist solid color or subtle gradient. Vibe: Surreal, poetic, psychological, dreamy.",
    visualDescription: "Doble exposición artística entre silueta y paisaje.",
    video_motion: "Slow surreal morphing, fluid ink spreading in water, double exposure layers moving at different speeds.",
    example: "Teatro Municipal: Obra 'Sueños de una Noche de Verano', estreno Viernes.",
    previewUrl: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=400&q=80"
  },
  retro_vintage: {
    label: "Retro / 90s",
    category: "EVENTOS",
    tags: ["Vintage", "Grunge", "90s"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: 90s Grunge Collage Art / Mixed Media. Effects: Halftone dot pattern (comic style), paper texture overlay, digital noise/grain, ripped paper edges. Palette: Acid Green, Hot Pink, or Faded Polaroid tones. Composition: Chaotic but balanced.",
    visualDescription: "Arte collage grunge 90s con halftone y textura de papel.",
    video_motion: "Vintage VHS tracking error effect, film grain flickering, frame stuttering.",
    example: "Fonda 'La Chueca': Terremotos, anticuchos y la mejor cumbia este 18.",
    previewUrl: "https://images.unsplash.com/photo-1550259114-ad7188f0a967?auto=format&fit=crop&w=400&q=80"
  },
  
  // --- FERIA LIBRE / MERCADO CHILENO ---
  market_handwritten: {
    label: "Feria / Mercado",
    category: "VENTAS",
    tags: ["Feria", "Barato", "Fresco", "Pyme"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Traditional Chilean Market ('Feria Libre') Aesthetic. Background: Colorful cardboard signs (neon yellow, pink, green) with handwritten prices written in thick black marker (plumón). Texture: Slightly worn cardboard, rustic wooden crates, fruit baskets. Lighting: Bright outdoor sunlight, harsh shadows typical of open-air markets. Vibe: Popular, cheap, fresh, urgent. 'Bueno, bonito y barato'. NO professional graphics. NO clean studio backgrounds. Authentic Chilean market atmosphere.",
    visualDescription: "Carteles de cartón escritos a mano con precios en marker, cajones de madera, frutas frescas, ambiente de feria libre chilena.",
    video_motion: "Slow pan across market stalls, vendors arranging products, sunlight filtering through awnings. Authentic market movement.",
    example: "Verdulería 'Don Pedro': Tomates a $1.500 el kilo, limones $500, ofertas de la semana.",
    previewUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=400&q=80"
  },
  
  podcast_mic: {
    label: "Podcast / Entrevista",
    category: "EVENTOS",
    tags: ["Audio", "Studio", "Tech"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Modern Broadcast Studio Photography. Camera: Shallow depth of field (blurred background), sharp focus on subject. Background: Bokeh studio lights, acoustic foam texture. Elements: Colorful digital soundwaves overlay. Vibe: Professional, communicative, on-air.",
    visualDescription: "Fotografía de estudio broadcast con bokeh y soundwaves.",
    video_motion: "Slow circular dolly track around the microphone, digital audio waveform bars pulsing to the rhythm.",
    example: "Radio 'Futuro': Entrevista exclusiva a emprendedores locales sobre innovación.",
    previewUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80"
  },

  // --- NUEVOS ESTILOS 26-40 (2026) ---
  
  // 26. Taller Mecánico
  mechanic_workshop: {
    label: "Taller Mecánico",
    category: "SERVICIOS",
    tags: ["Auto", "Mecánico", "Industrial"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Professional Automotive Workshop. Background: [CAR_MODEL] on hydraulic lift, mechanic tools in foreground, industrial lighting. Details: Realistic grease and metal textures, concrete floor, garage atmosphere. Vibe: Professional service, trustworthy mechanical work.",
    visualDescription: "Taller mecánico profesional con auto en elevador y herramientas.",
    video_motion: "Slow camera orbit around the vehicle, mechanic hands working on engine in close-up.",
    example: "Taller 'AutoPro': Cambio de aceite y revisión completa para tu vehículo.",
    previewUrl: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=400&q=80"
  },

  // 27. Vulcanización
  tire_service: {
    label: "Vulcanización",
    category: "SERVICIOS",
    tags: ["Neumáticos", "Taller", "Autos"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Tire Service Center. Background: Professional tire changing equipment, stacks of new tires, hydraulic jacks. Details: High contrast, focus on rubber textures and tools, roadside service aesthetic. Vibe: Fast, reliable tire service.",
    visualDescription: "Centro de servicios de neumáticos con equipamiento profesional.",
    video_motion: "High-speed tire rotation on balancing machine, water droplets flying off.",
    example: "Vulcanización 'GomaSecure': Cambio de neumáticos y alineación exprés.",
    previewUrl: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=400&q=80"
  },

  // 28. Construcción
  construction_site: {
    label: "Construcción",
    category: "SERVICIOS",
    tags: ["Obra", "Edificación", "Profesional"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Construction Site Professional. Background: Construction site in progress, workers with safety gear, blueprints on site. Details: Steel and concrete structures, daylight, wide angle. Vibe: Professional building company, high scale project, reliable construction.",
    visualDescription: "Obra de construcción en progreso con trabajadores y equipos.",
    video_motion: "Drone flyover of construction site, workers moving, crane rotation.",
    example: "Constructora 'Edifica': Proyectos residenciales y comerciales de alta calidad.",
    previewUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80"
  },

  // 29. Logística
  logistics_delivery: {
    label: "Logística / Delivery",
    category: "SERVICIOS",
    tags: ["Paquetes", "Envíos", "Rápido"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Modern Logistics Warehouse. Background: [BRAND_NAME] delivery van, organized packages and cardboard boxes. Details: Professional courier service, fast-paced atmosphere, bright industrial lighting. Vibe: Efficient, reliable, fast delivery.",
    visualDescription: "Almacén logístico moderno con van de reparto y paquetes organizados.",
    video_motion: "Fast-paced warehouse activity, packages moving on conveyor, delivery van driving away.",
    example: "Logística 'ExpressChile': Delivery same-day en Santiago y regiones.",
    previewUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=400&q=80"
  },

  // 30. Panadería
  bakery_bread: {
    label: "Panadería / Horneado",
    category: "COMERCIO",
    tags: ["Pan", "Fresco", "Tradicional"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Artisanal Bakery. Background: Fresh [BREAD_TYPE] in wicker baskets, flour dust in the air, warm industrial ovens. Details: Golden crust textures, morning sunlight, cozy traditional shop vibe. Vibe: Fresh, warm, traditional bakery.",
    visualDescription: "Panadería artesanal con panes frescos en canastas de mimbre.",
    video_motion: "Time-lapse of bread rising in oven, steam rising from fresh loaf.",
    example: "Panadería 'El Trigo de Oro': Pan fresco horneado cada mañana.",
    previewUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
  },

  // 31. Botillería
  liquor_store: {
    label: "Botillería / Licores",
    category: "COMERCIO",
    tags: ["Bebidas", "Retail", "Variedad"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Organized Liquor Store. Background: Shelves with organized bottles, cold beverage coolers with condensation. Details: Professional commercial lighting, variety of bottles, retail display. Vibe: Neighborhood market, wide selection, convenient.",
    visualDescription: "Botillería organizada con estantes de bebidas y coolers.",
    video_motion: "Hand reaching into a cold cooler, condensation on glass, refreshing atmosphere.",
    example: "Botillería 'Don Vino': La mejor selección de vinos y cervezas del mercado.",
    previewUrl: "https://images.unsplash.com/photo-1574935971562-45a6e5d1e2eb?auto=format&fit=crop&w=400&q=80"
  },

  // 32. Comida Rápida
  fast_food_street: {
    label: "Comida Rápida / Street Food",
    category: "COMERCIO",
    tags: ["Comida callejera", "Fusión", "Rápido"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Street Fast Food. Background: Delicious [FOOD_ITEM] close-up, sizzling griddle, melting cheese. Details: Professional food styling, neon signage background, vibrant colors. Vibe: Appetizing, energetic, affordable street food.",
    visualDescription: "Comida rápida callejera appetitosa con iluminación neón.",
    video_motion: "Close-up of food sizzling on hot griddle, steam rising, spatula flipping.",
    example: "Street Food 'Sabores': Las mejores empanadas y completos de la zona.",
    previewUrl: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=400&q=80"
  },

  // 33. Peluquería / Barbería
  barber_shop: {
    label: "Peluquería / Barbería",
    category: "SERVICIOS",
    tags: ["Cabello", "Estilo", "Profesional"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Modern Barber Shop. Background: Classic leather barber chair, mirrors with LED backlight, grooming tools. Details: Scissors and combs, stylish and clean aesthetic. Vibe: High-end grooming, trendy, professional.",
    visualDescription: "Barbería moderna con silla de cuero y espejos con LED.",
    video_motion: "Slow motion of hair clippers or scissors in action, professional lighting.",
    example: "Barbería 'Corte VIP': Estilo y distinción para el hombre moderno.",
    previewUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80"
  },

  // 34. Veterinaria
  veterinary_clinic: {
    label: "Veterinaria / Mascotas",
    category: "SALUD",
    tags: ["Mascotas", "Cuidado", "Amor"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Clean Veterinary Clinic. Background: [PET_TYPE] on exam table, medical stethoscope. Details: Friendly and professional medical environment, bright clinical lighting. Vibe: Trustworthy pet care, compassionate veterinary service.",
    visualDescription: "Clínica veterinaria limpia con mascota en mesa de examen.",
    video_motion: "Caring vet examining a happy pet, warm natural lighting, emotional connection.",
    example: "Veterinaria 'Patitas': Cuidado integral para tus mascotas las 24 horas.",
    previewUrl: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=400&q=80"
  },

  // 35. Gasfitería / Climatización
  hvac_plumbing: {
    label: "Gasfitería / Climatización",
    category: "SERVICIOS",
    tags: ["Plomería", "Técnico", "Hogar"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Technical HVAC and Plumbing. Background: Plumbing and air conditioning service, technical tools, copper pipes. Details: HVAC unit installation, professional blue-collar expertise. Vibe: Hands-on technical service, precision, reliability.",
    visualDescription: "Servicio técnico de gasfitería y climatización con herramientas.",
    video_motion: "Close-up of wrench tightening pipe, water pressure test, focused technical movement.",
    example: "Servicios 'Técnico Pro': Gasfitería, calefacción y aire acondicionado a domicilio.",
    previewUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80"
  },

  // 36. Centro Dental
  dental_clinic: {
    label: "Centro Dental",
    category: "SALUD",
    tags: ["Dientes", "Sonrisa", "Limpio"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: High-Tech Dental Office. Background: Professional dentist chair, bright clinical lamp, sterile environment. Details: White and blue color palette, precision medical tools. Vibe: Clean, trustworthy, modern dental care.",
    visualDescription: "Consultorio dental moderno con equipamiento de alta tecnología.",
    video_motion: "Smooth pan over modern dental equipment, blue LED lights, sterile environment.",
    example: "Clínica Dental 'Sonrisa Perfecta': Ortodoncia, implantes y blanqueamiento dental.",
    previewUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80"
  },

  // 37. Kinesiología
  physiotherapy: {
    label: "Kinesiología / Rehab",
    category: "SALUD",
    tags: ["Rehabilitación", "Movimiento", "Deporte"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Physiotherapy Studio. Background: Rehabilitation equipment, elastic bands, treatment table. Details: Movement and recovery focus, bright airy room. Vibe: Sports medicine aesthetic, professional care, health focus.",
    visualDescription: "Estudio de kinesiología con equipamiento de rehabilitación.",
    video_motion: "Patient performing elastic band exercise, kinesiólogo guiding movement, slow controlled action.",
    example: "Kinesiología 'Movimiento': Rehabilitación deportiva y terapia física especializada.",
    previewUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"
  },

  // 38. Estudio Jurídico
  law_accounting: {
    label: "Estudio Jurídico / Contable",
    category: "PROFESIONAL",
    tags: ["Legal", "Corporativo", "Serio"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Professional Law Firm Office. Background: Wooden bookshelves with books, leather chairs, organized desk. Details: Sophisticated corporate atmosphere, serious and trustworthy aesthetic. Vibe: Legal expertise, professional consulting, reliable service.",
    visualDescription: "Oficina de estudio jurídico profesional con libreros de madera.",
    video_motion: "Professional handshake in office, slow pan over legal documents, serious atmosphere.",
    example: "Estudio 'LexChile': Asesoría legal y contable para empresas y personas.",
    previewUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&q=80"
  },

  // 39. Jardinería
  gardening_landscaping: {
    label: "Jardinería / Paisajismo",
    category: "SERVICIOS",
    tags: ["Jardín", "Naturaleza", "Verde"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Professional Gardening. Background: Beautiful [GARDEN_TYPE], lawn mower in action, garden tools. Details: Vibrant green grass and flowers, outdoor daylight. Vibe: Landscape transformation, fresh and natural aesthetic, garden care.",
    visualDescription: "Jardinería profesional con herramientas y pasto verde.",
    video_motion: "Lawn mower moving through green grass, grass clippings flying, satisfying transformation.",
    example: "Jardinería 'VerdePro': Diseño y mantención de jardines residenciales.",
    previewUrl: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=400&q=80"
  },

  // 40. Seguridad
  security_systems: {
    label: "Seguridad / Alarmas",
    category: "SERVICIOS",
    tags: ["Protección", "Tech", "Vigilancia"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Security Systems. Background: CCTV security camera installation, digital monitoring interface. Details: Protection and safety feeling, high-tech security devices. Vibe: Professional surveillance, modern tech, peace of mind.",
    visualDescription: "Sistema de seguridad con cámaras CCTV y monitoreo digital.",
    video_motion: "Security camera panning slowly, digital HUD overlay, night vision transition.",
    example: "Seguridad 'ProtecHome': Sistemas de alarma y cámaras de seguridad 24/7.",
    previewUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80"
  },

  // --- NUEVOS ESTILOS 41-60 (2026) ---

  // 41. Sushi & Nikkei
  sushi_nikkei: {
    label: "Sushi & Nikkei",
    category: "COMERCIO",
    tags: ["Sushi", "Japanese", "Minimalist"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Minimalist zen plating. Background: Fresh salmon textures, slate plates, chopsticks, Japanese aesthetic. Details: Clean presentation, artistic arrangement, fresh ingredients. Vibe: Minimalist, elegant, authentic Japanese cuisine.",
    visualDescription: "Presentación minimalista zen de sushi con platos de pizarra.",
    video_motion: "Precise knife cutting fish, smooth presentation movement.",
    example: "Sushi Bar 'Zen': Salmón fresco y nigiri artesanal.",
    previewUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80"
  },

  // 42. Pizzería
  pizzeria: {
    label: "Pizzería",
    category: "COMERCIO",
    tags: ["Pizza", "Italian", "Warm"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Pizza coming out of stone oven. Background: Melting mozzarella, charred crust, warm rustic atmosphere. Details: Golden cheese stretch, wood-fired oven, authentic Italian. Vibe: Warm, rustic, appetizing traditional pizzeria.",
    visualDescription: "Pizza saliendo del horno de piedra con mozzarella derritiéndose.",
    video_motion: "Cheese stretching when pulling pizza slice, oven heat glow.",
    example: "Pizzaría 'Napoli': Pizza napolitana horneada en leña.",
    previewUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80"
  },

  // 43. Heladería
  ice_cream: {
    label: "Heladería",
    category: "COMERCIO",
    tags: ["Ice Cream", "Summer", "Creamy"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Creamy ice cream scoops. Background: Waffle cones, cold vapor, macro food photography, summer vibe. Details: Smooth texture, vibrant colors, cold refreshment. Vibe: Fun, refreshing, summer treat.",
    visualDescription: "Bolas de helado cremoso en cono de wafla con vapor frío.",
    video_motion: "Creamy ice cream dripping slowly, cold vapor rising.",
    example: "Heladería 'Sweet Cream': Helados artesanales con toppings ilimitados.",
    previewUrl: "https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=400&q=80"
  },

  // 44. Nail Studio
  nail_studio: {
    label: "Nail Studio",
    category: "SALUD",
    tags: ["Nails", "Beauty", "Clean"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Close-up of manicured hands. Background: Nail art, vibrant polish, modern salon desk, clean aesthetic. Details: Perfect cuticles, glossy finish, creative designs. Vibe: Clean, professional, beauty focused.",
    visualDescription: "Manos con uñas manicuradas y arte de uñas en estudio moderno.",
    video_motion: "Light reflection sliding over polished nail, precise brush movement.",
    example: "Nail Studio 'Glamour': Manicure profesional y diseños personalizados.",
    previewUrl: "https://images.unsplash.com/photo-1632345031635-7b80009a6401?auto=format&fit=crop&w=400&q=80"
  },

  // 45. Tattoo Studio
  tattoo_studio: {
    label: "Tattoo Studio",
    category: "SERVICIOS",
    tags: ["Tattoo", "Art", "Urban"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Tattoo artist working. Background: Sterile equipment, ink bottles, dramatic lighting, urban edgy vibe. Details: Precision work, clean needles, artistic process. Vibe: Edgy, artistic, professional tattooing.",
    visualDescription: "Artista de tatuajes trabajando con equipamiento estéril.",
    video_motion: "Tattoo needle with ink detail macro, precise machine movement.",
    example: "Tattoo Studio 'Ink Art': Tatuajes personalizados con artistas profesionales.",
    previewUrl: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=400&q=80"
  },

  // 46. Yoga Studio
  yoga_studio: {
    label: "Yoga Studio",
    category: "LIFESTYLE",
    tags: ["Yoga", "Wellness", "Peaceful"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Person in yoga pose. Background: Yoga mats, zen minimalist studio, soft natural light, peaceful atmosphere. Details: Calm expression, balanced posture, serene environment. Vibe: Peaceful, balanced, wellness focused.",
    visualDescription: "Persona en pose de yoga en estudio zen minimalista.",
    video_motion: "Slow fluid stretching movement, controlled breathing rhythm.",
    example: "Yoga Studio 'Peace': Clases de yoga y meditación para todos los niveles.",
    previewUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80"
  },

  // 47. Car Detailing
  car_detailing: {
    label: "Car Detailing",
    category: "SERVICIOS",
    tags: ["Car", "Luxury", "Clean"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Luxury car detailing. Background: Foam bubbles, high-gloss reflection, microfiber towels, studio light. Details: Spotless finish, mirror-like reflection, premium care. Vibe: Luxury, pristine, professional auto care.",
    visualDescription: "Detalle de auto de lujo con espuma y reflejos brillantes.",
    video_motion: "Foam sliding down revealing shiny car surface, smooth reveal.",
    example: "Car Detailing 'Shine': Pulido y encerado premium para tu vehículo.",
    previewUrl: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=400&q=80"
  },

  // 48. Óptica
  optical: {
    label: "Óptica",
    category: "SALUD",
    tags: ["Glasses", "Vision", "Modern"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Modern eyeglass frames on display. Background: Eye exam equipment, bright clean retail store, minimalist design. Details: Stylish frames, professional equipment, clear vision focus. Vibe: Modern, professional, clear vision.",
    visualDescription: "Gafas modernas en exhibición con equipamiento de examen visual.",
    video_motion: "Focus transition between different frame displays, clean lighting.",
    example: "Óptica 'ClearView': Armazones de marcas exclusivas y examen de vista.",
    previewUrl: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=400&q=80"
  },

  // 49. Librería
  bookstore: {
    label: "Librería",
    category: "COMERCIO",
    tags: ["Books", "Cozy", "Culture"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Shelves full of books. Background: Organized stationery, notebooks, cozy reading nook, warm lighting. Details: Book spines, paper textures, inviting atmosphere. Vibe: Cozy, intellectual, book lover's paradise.",
    visualDescription: "Estantes llenos de libros con papelería organizada.",
    video_motion: "Smooth pan along book spines, gentle shelf movement.",
    example: "Librería 'El Lector': Los mejores libros y artículos de librería.",
    previewUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80"
  },

  // 50. Florería
  flower_shop: {
    label: "Florería",
    category: "COMERCIO",
    tags: ["Flowers", "Fresh", "Colorful"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Fresh colorful bouquets. Background: Flower shop interior, water mist on petals, natural vibrant colors. Details: Petal textures, fresh blooms, natural beauty. Vibe: Fresh, romantic, natural beauty.",
    visualDescription: "Ramos de flores frescas con rocío de agua en pétalos.",
    video_motion: "Water mist droplets falling on flowers in slow motion.",
    example: "Florería 'Rosas': Arreglos florales para todas las ocasiones.",
    previewUrl: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=400&q=80"
  },

  // 51. Transporte Escolar
  transport_school: {
    label: "Transporte Escolar",
    category: "SERVICIOS",
    tags: ["School", "Transport", "Safety"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Professional yellow school van. Background: Safety signs, clean vehicle, daylight, Chilean transport vibe. Details: Yellow color, safety equipment, reliable transport. Vibe: Safe, reliable, professional school transport.",
    visualDescription: "Furgón escolar amarillo profesional con señalética de seguridad.",
    video_motion: "Stable tracking of van driving on route, smooth forward movement.",
    example: "Transporte 'Escolar Express': Servicio de transporte escolar seguro y puntual.",
    previewUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ed532?auto=format&fit=crop&w=400&q=80"
  },

  // 52. Ferretería
  hardware_store: {
    label: "Ferretería",
    category: "COMERCIO",
    tags: ["Hardware", "Tools", "Industrial"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Hardware store interior. Background: Organized tool displays, paint cans, hand tools, industrial retail atmosphere. Details: Metal textures, organized shelves, professional supplies. Vibe: Industrial, reliable, complete hardware solutions.",
    visualDescription: "Interior de ferretería con herramientas y pinturas organizadas.",
    video_motion: "Professional hand picking up tool from display, precise grip.",
    example: "Ferretería 'El Tornillo': Herramientas y materiales de construcción.",
    previewUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=400&q=80"
  },

  // 53. Servicios de Limpieza
  cleaning_service: {
    label: "Servicios de Limpieza",
    category: "SERVICIOS",
    tags: ["Cleaning", "Hygiene", "Professional"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Sparkling clean home interior. Background: Cleaning equipment, bright surfaces, professional hygiene. Details: Streak-free glass, spotless floors, fresh atmosphere. Vibe: Clean, fresh, professional cleaning service.",
    visualDescription: "Interior de hogar impecablemente limpio con equipamiento de limpieza.",
    video_motion: "Cloth wiping glass revealing shine, sparkling clean reveal.",
    example: "Limpieza 'Brillo': Servicios de limpieza profesional para hogares y oficinas.",
    previewUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80"
  },

  // 54. Agencia de Viajes
  travel_agency: {
    label: "Agencia de Viajes",
    category: "SERVICIOS",
    tags: ["Travel", "Dreams", "Adventure"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Modern travel agency. Background: World maps, vacation posters, bright inviting space, dream vacation atmosphere. Details: Tropical destinations, travel brochures, excitement. Vibe: Exciting, adventurous, travel dreams come true.",
    visualDescription: "Agencia de viajes moderna con mapas mundiales y posters de destinos.",
    video_motion: "Globe spinning in bright office, travel dreams atmosphere.",
    example: "Viajes 'Mundo': Paquetes turísticos a los mejores destinos.",
    previewUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80"
  },

  // 55. Lavandería
  laundry: {
    label: "Lavandería",
    category: "SERVICIOS",
    tags: ["Laundry", "Clean", "Fresh"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Industrial washing machines. Background: Clean folded clothes, steam, bright white light, textile care atmosphere. Details: Fresh linen, organized piles, professional care. Vibe: Fresh, clean, professional laundry service.",
    visualDescription: "Lavadoras industriales con ropa limpia y vapor.",
    video_motion: "Steam rising from freshly ironed clothes, fresh linen movement.",
    example: "Lavandería 'Frescura': Servicio de lavado y planchado profesional.",
    previewUrl: "https://images.unsplash.com/photo-1582735689369-4fe8d7499698?auto=format&fit=crop&w=400&q=80"
  },

  // 56. Zapatería
  shoe_store: {
    label: "Zapatería",
    category: "COMERCIO",
    tags: ["Shoes", "Fashion", "Style"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Modern shoe store. Background: Footwear display, clean minimalist design, focus on shoe texture. Details: Leather textures, organized display, stylish footwear. Vibe: Stylish, modern, footwear focused.",
    visualDescription: "Tienda de zapatos moderna con exhibición de calzados.",
    video_motion: "Walking steps showing shoes in action, stylish walk.",
    example: "Zapatería 'Paso': Calzado de las mejores marcas nacionales e importadas.",
    previewUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80"
  },

  // 57. Servicio Técnico
  tech_repair: {
    label: "Servicio Técnico",
    category: "SERVICIOS",
    tags: ["Tech", "Repair", "Precision"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Smartphone repair station. Background: Precision tools, disassembled phone parts, high-tech lab light. Details: Circuit boards, tiny screws, technical expertise. Vibe: Technical, precise, professional repair service.",
    visualDescription: "Estación de reparación de smartphone con herramientas de precisión.",
    video_motion: "Tweezers working on phone circuit, micro precision movement.",
    example: "Tech Repair 'Fix': Reparación de celulares, computadores y más.",
    previewUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80"
  },

  // 58. Pastelería
  pastry_shop: {
    label: "Pastelería",
    category: "COMERCIO",
    tags: ["Pastry", "Cakes", "Sweet"],
    english_prompt: "Subject: [INSERT SUBJECT HERE]. Style: Custom cakes on display. Background: Pastry styling, soft pastel colors, warm bakery light, frosting details. Details: Decorative frosting, layered cakes, sweet artistry. Vibe: Sweet, elegant, artisanal bakery.",
    visualDescription: "Pasteles personalizados en exhibición con decoración elegante.",
    video_motion: "Cake being sliced revealing soft layers, smooth cut.",
    example: "Pastelería 'Dulce': Tortas y pasteles para celebraciones especiales.",
    previewUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80"
  }
};

// ============================================
// FÓRMULA MAESTRA PARA VIDEO (25 prompts)
// Estructura: [DESCRIPCIÓN VISUAL] + [MOVIMIENTO DE CÁMARA] + [ACCIÓN DEL SUJETO] + High resolution, cinematic 4k.
// ============================================
export const VIDEO_STYLES: Record<string, VideoStyleConfig> = {
  // 1. RETAIL / OFERTAS (Explosión 3D)
  video_retail_sale: {
    label: "Retail / Ofertas",
    category: "COMERCIAL",
    tags: ["3D", "Explosión", "Urgencia"],
    prompt: "3D Retail Sale concept. Floating sneakers, tech gadgets, and 3D percentage signs against a red background. Slow motion explosion effect. Items floating and rotating in zero gravity. Confetti falling gently. Camera slowly pushing in. High resolution, cinematic 4k.",
    motionStyle: "Zero gravity explosion, confetti falling, camera push-in",
    duration: "5-8 seg",
    aspectRatio: ['1:1', '9:16', '4:5'],
    example: "Tienda: Liquidación 50% OFF con productos flotando.",
    previewUrl: "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?auto=format&fit=crop&w=400&q=80"
  },
  
  // 2. VERANO / TURISMO (Agua en Movimiento)
  video_summer_beach: {
    label: "Verano / Turismo",
    category: "LIFESTYLE",
    tags: ["Agua", "Sol", "Lujo"],
    prompt: "Luxury infinity pool with a cocktail in the foreground, ocean background, sunny day. Crystal clear water rippling and splashing. Sunlight glimmering on the water surface. Slow camera dolly forward towards the cocktail. High resolution, cinematic 4k.",
    motionStyle: "Water rippling, sunlight glimmering, camera dolly forward",
    duration: "6-10 seg",
    aspectRatio: ['9:16', '16:9', '1:1'],
    example: "Beach Club: Cocktail tropical en piscina infinita.",
    previewUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=400&q=80"
  },
  
  // 3. WORSHIP / IGLESIA (Rayos de Luz)
  video_worship_sky: {
    label: "Iglesia / Espiritual",
    category: "EVENTOS",
    tags: ["Luz", "Cielo", "Paz"],
    prompt: "Silhouette of a crowd with hands raised, volumetric light beams descending from clouds. God rays shimmering and moving slowly through the fog. Clouds passing majestically in the background. Subtle handheld camera movement for realism. High resolution, cinematic 4k.",
    motionStyle: "God rays shimmering, clouds passing, subtle handheld",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '9:16', '1:1'],
    example: "Iglesia: Vigilia con rayos de luz divina.",
    previewUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=400&q=80"
  },
  
  // 4. CORPORATIVO (Timelapse / Oficina)
  video_corporate: {
    label: "Corporativo / Oficina",
    category: "NEGOCIOS",
    tags: ["Profesional", "Edificio", "Timelapse"],
    prompt: "Modern glass office building or professional working on a laptop. Cinematic rack focus from the person to the city skyline in the background. City traffic moving in fast-forward outside the window. High resolution, cinematic 4k.",
    motionStyle: "Rack focus, city timelapse, professional atmosphere",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1.91:1', '1:1'],
    example: "Empresa: Profesional trabajando con vista a la ciudad.",
    previewUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80"
  },
  
  // 5. URBANO / NIGHTLIFE (Luces Estroboscópicas)
  video_urban_night: {
    label: "Discoteca / Neón",
    category: "NOCHE",
    tags: ["Fiesta", "Laser", "DMX"],
    prompt: "DJ silhouette in a dark club with neon lasers and smoke. Strobing neon lights flashing in rhythm. Smoke billowing across the stage. The crowd jumping in slow motion. Dynamic camera shake. High resolution, cinematic 4k.",
    motionStyle: "Neon strobing, smoke billowing, crowd jumping, camera shake",
    duration: "6-10 seg",
    aspectRatio: ['16:9', '9:16', '1:1'],
    example: "Club: DJ con láseres y humo.",
    previewUrl: "https://images.unsplash.com/photo-1566421990479-d3e80064506f?auto=format&fit=crop&w=400&q=80"
  },
  
  // 6. GASTRONOMÍA (Food Porn / Slow Mo)
  video_gastronomy: {
    label: "Gastronomía / Comida",
    category: "COMIDA",
    tags: ["Slow Mo", "Steam", "Gourmet"],
    prompt: "Gourmet burger with melting cheese and steam. Extreme close-up. Cheese slowly oozing down the side of the burger. Steam rising gracefully. Sauce being poured in slow motion from above. High resolution, cinematic 4k.",
    motionStyle: "Cheese oozing, steam rising, sauce pouring slow motion",
    duration: "5-8 seg",
    aspectRatio: ['1:1', '4:5', '9:16'],
    example: "Restaurante: Hamburguesa gourmet con queso derritiéndose.",
    previewUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80"
  },
  
  // 7. DEPORTE / GYM (Sudor y Esfuerzo)
  video_sport_gritty: {
    label: "Deporte / Gym",
    category: "FITNESS",
    tags: ["Intenso", "Sudor", "Poder"],
    prompt: "Athlete lifting heavy weights, gritty texture, dramatic lighting. Slow motion capture of the intense effort. Sweat droplets flying off the skin. Dust particles floating in the heavy rim light. Muscle tension visible. High resolution, cinematic 4k.",
    motionStyle: "Sweat droplets flying, dust in rim light, muscle tension",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '16:9', '9:16'],
    example: "Gym: Atleta levantando pesas con sudor y esfuerzo.",
    previewUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80"
  },
  
  // 8. LUJO / GALA (Brillos y Burbujas)
  video_luxury_gold: {
    label: "Lujo / Gala VIP",
    category: "PREMIUM",
    tags: ["Champagne", "Oro", "Elegante"],
    prompt: "Champagne glasses toasting, gold foil background, fireworks. Champagne bubbles rising inside the glass. Fireworks exploding softly in the background. Gold sparkles shimmering. Smooth, elegant camera slide (parallax). High resolution, cinematic 4k.",
    motionStyle: "Bubbles rising, fireworks, gold sparkles, elegant parallax",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Evento VIP: Brindis con champagne y fuegos artificiales.",
    previewUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=400&q=80"
  },
  
  // 9. MINIMALISTA / AESTHETIC (Sombras Suaves)
  video_aesthetic_min: {
    label: "Aesthetic / Belleza",
    category: "LIFESTYLE",
    tags: ["Suave", "Minimal", "Zen"],
    prompt: "Skincare product on a stone, soft window light with leaf shadows. Shadows of leaves gently swaying and passing over the product. Soft sunlight shifting intensity. Very slow, calming camera zoom out. High resolution, cinematic 4k.",
    motionStyle: "Leaf shadows swaying, sunlight shifting, slow zoom out",
    duration: "8-12 seg",
    aspectRatio: ['1:1', '4:5', '9:16'],
    example: "Belleza: Producto de skincare con sombras de hojas.",
    previewUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80"
  },
  
  // 10. RETRO / VINTAGE (Ruido de Celuloide)
  video_retro_vintage: {
    label: "Retro / Vintage 90s",
    category: "NOSTALGIA",
    tags: ["Grunge", "Noise", "Cassette"],
    prompt: "90s Grunge Collage with cassette tape and neon colors. Stop-motion animation style. Elements jittering slightly. Film grain flickering. Glitch effects flashing intermittently on the screen. High resolution, cinematic 4k.",
    motionStyle: "Stop-motion jitter, film grain flicker, glitch flashes",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '4:5', '9:16'],
    example: "Retro: Collage grunge 90s con cassette.",
    previewUrl: "https://images.unsplash.com/photo-1550259114-ad7188f0a967?auto=format&fit=crop&w=400&q=80"
  },
  
  // 11. GAMER / ESPORTS (Glitch Digital)
  video_gamer_stream: {
    label: "Gamer / Esports",
    category: "GAMING",
    tags: ["Digital", "Neon", "Cyber"],
    prompt: "Cyborg gamer character with glowing neon eyes and keyboard. Digital distortion and glitch artifacts passing through the image. Neon lightning crackling. The character breathing heavily with glowing eyes pulsating. High resolution, cinematic 4k.",
    motionStyle: "Glitch artifacts, neon lightning, eyes pulsating",
    duration: "6-10 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Gaming: Personaje cyborg con glitch digital.",
    previewUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80"
  },
  
  // 12. ECO / NATURAL (Viento en las Hojas)
  video_eco_organic: {
    label: "Ecológico / Natural",
    category: "NATURALEZA",
    tags: ["Verde", "Frutas", "Butterfly"],
    prompt: "Basket of organic fruits in a nature setting. Leaves blowing gently in the wind. Sunlight filtering through moving trees (dappled light). A butterfly flying past the camera. High resolution, cinematic 4k.",
    motionStyle: "Leaves blowing, dappled light, butterfly flying",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Eco: Canasta de frutas orgánicas con mariposa.",
    previewUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80"
  },
  
  // 13. INDIE / GRUNGE (Humo y Mano Alzada)
  video_indie_grunge: {
    label: "Rock / Indie",
    category: "MÚSICA",
    tags: ["Smoke", "Raw", "Stage"],
    prompt: "Electric guitar amp on a dark stage, dirty texture. Thick stage smoke rolling on the floor. Handheld camera movement (shaky cam) to create a raw, documentary feel. Dust floating in the spotlight. High resolution, cinematic 4k.",
    motionStyle: "Smoke rolling, shaky cam, dust in spotlight",
    duration: "6-10 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Rock: Amplificador en escenario con humo.",
    previewUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=400&q=80"
  },
  
  // 14. POLÍTICA / COMUNIDAD (Caminar y Hablar)
  video_political: {
    label: "Política / Comunidad",
    category: "COMUNICACIÓN",
    tags: ["Candidato", "Parque", "Confianza"],
    prompt: "Candidate walking in a park, smiling at people. Tracking shot following the candidate walking forward. People in the background moving naturally. Trees swaying. Bright and energetic movement. High resolution, cinematic 4k.",
    motionStyle: "Tracking shot, natural background movement, bright energy",
    duration: "10-15 seg",
    aspectRatio: ['16:9', '1.91:1', '9:16'],
    example: "Política: Candidato caminando en el parque.",
    previewUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=400&q=80"
  },
  
  // 15. INFANTIL / KIDS (Globos Flotando)
  video_kids_fun: {
    label: "Infantil / Cumpleaños",
    category: "NIÑOS",
    tags: ["3D", "Balloons", "Party"],
    prompt: "3D Cartoon birthday cake and balloons. Balloons bobbing gently in the air. Confetti raining down slowly. The cake spinning slowly on a turntable. Bouncy, cheerful animation style. High resolution, cinematic 4k.",
    motionStyle: "Balloons bobbing, confetti raining, cake spinning",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '9:16', '4:5'],
    example: "Kids: Torta 3D con globos y confeti.",
    previewUrl: "https://images.unsplash.com/photo-1502086223501-681a6bc64936?auto=format&fit=crop&w=400&q=80"
  },
  
  // 16. DOBLE EXPOSICIÓN (Niebla Interna)
  video_art_double_exp: {
    label: "Artístico / Doble Exposición",
    category: "ARTE",
    tags: ["Surreal", "Silhouette", "Fog"],
    prompt: "Silhouette of a head filled with a forest landscape. The silhouette remains still, but the forest inside the head is alive: fog moving, birds flying, trees swaying inside the profile. Surreal dreamlike motion. High resolution, cinematic 4k.",
    motionStyle: "Fog moving inside silhouette, birds flying, trees swaying",
    duration: "8-12 seg",
    aspectRatio: ['1:1', '16:9', '9:16'],
    example: "Arte: Silueta con bosque interno en movimiento.",
    previewUrl: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=400&q=80"
  },
  
  // 17. MÉDICO / CLÍNICO (Escaneo Tech)
  video_medical_clean: {
    label: "Médico / Clínico",
    category: "SALUD",
    tags: ["DNA", "Tech", "Sterile"],
    prompt: "Doctor in a futuristic clinic, DNA strands in background. DNA strands rotating slowly in the background. Clean, smooth camera panning. No shaky movement, perfectly stable and sterile flow. High resolution, cinematic 4k.",
    motionStyle: "DNA rotating, smooth panning, stable sterile flow",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Médico: Doctor en clínica futurista con ADN.",
    previewUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80"
  },
  
  // 18. TECH / SAAS / AI (Flujo de Datos)
  video_tech_saas: {
    label: "Tech / AI / Digital",
    category: "TECNOLOGÍA",
    tags: ["Data", "Brain", "Network"],
    prompt: "Digital brain made of connecting dots and lines. Data lines flowing like electricity between nodes. The 3D brain rotating slowly. Glowing pulses of light traveling through the network. High resolution, cinematic 4k.",
    motionStyle: "Data flowing, brain rotating, light pulses",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Tech: Cerebro digital con nodos y líneas de datos.",
    previewUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80"
  },
  
  // 19. TIPOGRÁFICO (Fondo en Movimiento)
  video_typo_bold: {
    label: "Tipografía Pura",
    category: "DISEÑO",
    tags: ["Gradient", "Geometric", "Loop"],
    prompt: "Abstract gradient background or geometric shapes. Liquid gradients morphing and changing colors slowly. Geometric shapes rotating and floating. Designed as a perfect loop for text overlay. High resolution, cinematic 4k.",
    motionStyle: "Liquid gradients morphing, geometric shapes rotating",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '9:16', '16:9'],
    example: "Diseño: Gradientes líquidos y formas geométricas.",
    previewUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80"
  },
  
  // 20. REAL ESTATE NIGHT (Time-lapse Cielo)
  video_realestate_night: {
    label: "Inmobiliaria Nocturna",
    category: "INMOBILIARIA",
    tags: ["Luxury", "Pool", "Stars"],
    prompt: "Luxury mansion with pool at night. Time-lapse of the stars moving across the sky. Reflection in the pool water rippling gently. Interior lights turning on and off slowly. High resolution, cinematic 4k.",
    motionStyle: "Stars time-lapse, pool reflection, interior lights",
    duration: "10-15 seg",
    aspectRatio: ['16:9', '1.91:1', '9:16'],
    example: "Inmobiliaria: Mansión de lujo con time-lapse de estrellas.",
    previewUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80"
  },
  
  // 21. AUTOMOTRIZ (Rueda Girando)
  video_auto_metallic: {
    label: "Automotriz / Coche",
    category: "AUTO",
    tags: ["Speed", "Sparks", "Wheel"],
    prompt: "Sports car wheel close-up, smoke, sparks. Wheel spinning at high speed. Smoke billowing out aggressively from the tire. Sparks flying towards the camera. Fast, high-octane camera tracking. High resolution, cinematic 4k.",
    motionStyle: "Wheel spinning fast, smoke billowing, sparks flying",
    duration: "5-8 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Auto: Rueda de deportivo girando con humo y chispas.",
    previewUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80"
  },
  
  // 22. EDUCACIÓN / SKETCH (Dibujo Animado)
  video_edu_sketch: {
    label: "Educación / Clases",
    category: "EDUCACIÓN",
    tags: ["Chalk", "Books", "Animation"],
    prompt: "Books on a desk with white chalk doodles overlay. The chalk doodles (formulas, arrows) animating and drawing themselves on the screen. Write-on effect. Dust motes dancing in the library light. High resolution, cinematic 4k.",
    motionStyle: "Chalk drawing itself, dust motes dancing",
    duration: "10-15 seg",
    aspectRatio: ['16:9', '1.91:1', '1:1'],
    example: "Educación: Libros con doodles en tiza animándose.",
    previewUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80"
  },
  
  // 23. SPA / ZEN (Gota de Agua)
  video_wellness_zen: {
    label: "Spa / Zen",
    category: "WELLNESS",
    tags: ["Water", "Ripple", "Calm"],
    prompt: "Hot stones, bamboo, water surface. A single water drop falling into the pool creating perfect ripples. Candle flame flickering softly. Steam rising gently from the hot stones. High resolution, cinematic 4k.",
    motionStyle: "Water drop falling, perfect ripples, candle flickering",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '9:16', '4:5'],
    example: "Spa: Gota de agua creando ripples perfectos.",
    previewUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80"
  },
  
  // 24. PODCAST / MEDIA (Ondas de Audio)
  video_podcast_mic: {
    label: "Podcast / Media",
    category: "AUDIO",
    tags: ["Microphone", "Soundwaves", "Studio"],
    prompt: "Studio microphone close up, soundwaves. Digital soundwaves (equalizer) bars jumping up and down in the background. The ON AIR light pulsing on and off. Slow camera orbit around the mic. High resolution, cinematic 4k.",
    motionStyle: "Soundwaves jumping, ON AIR pulsing, camera orbit",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Podcast: Micrófono con ondas de audio.",
    previewUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80"
  },
  
  // 25. FESTIVIDADES (Nieve/Confetti)
  video_seasonal_holiday: {
    label: "Festividades / Navidad",
    category: "EVENTOS",
    tags: ["Snow", "Confetti", "Magical"],
    prompt: "Christmas gift boxes or Valentine hearts. Soft snow falling gently (Christmas) or 3D hearts floating upwards like bubbles (Valentine). Lights twinkling. Silk ribbons waving in the wind. High resolution, cinematic 4k.",
    motionStyle: "Snow falling, hearts floating, lights twinkling",
    duration: "8-12 seg",
    aspectRatio: ['1:1', '9:16', '16:9'],
    example: "Navidad: Regalos con nieve cayendo suavemente.",
    previewUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=400&q=80"
  },

  // --- NUEVOS VIDEO STYLES 26-40 (2026) ---

  // 26. Mechanic Action (Acción Mecánica)
  video_mechanic_action: {
    label: "Taller Mecánico / Acción",
    category: "SERVICIOS",
    tags: ["Mecánico", "Herramientas", "Taller"],
    prompt: "Close-up of mechanic hands working on an engine, sparks flying from welding or tool movement, dramatic workshop lighting, smooth camera orbit, industrial atmosphere, professional auto service.",
    motionStyle: "Hands working, sparks flying, camera orbit around engine",
    duration: "6-10 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Taller: Manos de mecánico trabajando en motor con chispas.",
    previewUrl: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=400&q=80"
  },

  // 27. Tire Spin (Giro de Neumático)
  video_tire_spin: {
    label: "Vulcanización / Neumático",
    category: "SERVICIOS",
    tags: ["Neumático", "Giro", "Taller"],
    prompt: "High-speed tire rotation on a balancing machine, water droplets flying off the tire, sharp focus on rubber texture, slow motion transition, industrial service action, professional tire work.",
    motionStyle: "Tire spinning fast, water droplets flying, slow motion",
    duration: "5-8 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Vulcanización: Neumático girando a alta velocidad con gotas de agua.",
    previewUrl: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=400&q=80"
  },

  // 28. Construction Drone (Dron de Obra)
  video_construction_drone: {
    label: "Construcción / Dron",
    category: "SERVICIOS",
    tags: ["Obra", "Dron", "Aéreo"],
    prompt: "Drone flyover of a construction site, workers in safety gear moving, crane rotating, cinematic scale showing architectural progress, daylight, wide aerial perspective of building project.",
    motionStyle: "Drone flyover, crane rotation, workers moving on site",
    duration: "10-15 seg",
    aspectRatio: ['16:9', '1.91:1', '9:16'],
    example: "Construcción: Dron sobre obra en progreso con trabajadores.",
    previewUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80"
  },

  // 29. Logistic Flow (Flujo Logístico)
  video_logistic_flow: {
    label: "Logística / Flujo",
    category: "SERVICIOS",
    tags: ["Paquetes", "Almacén", "Rápido"],
    prompt: "Fast-paced warehouse activity, packages moving on conveyor belts, delivery van driving away from warehouse, motion blur on fast objects, efficient logistics energy, professional courier service.",
    motionStyle: "Packages on conveyor, delivery van driving, fast motion",
    duration: "6-10 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Logística: Actividad rápida en almacén con paquetes en movimiento.",
    previewUrl: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=400&q=80"
  },

  // 30. Baking Rise (Crecimiento de Pan)
  video_baking_rise: {
    label: "Panadería / Horneado",
    category: "COMERCIO",
    tags: ["Pan", "Horno", "Steam"],
    prompt: "Time-lapse of bread rising in oven, steam rising from fresh golden loaf, crust forming slowly, warm appetizing glow, close-up of baking process, traditional bakery atmosphere.",
    motionStyle: "Bread rising, steam rising, crust forming in time-lapse",
    duration: "8-12 seg",
    aspectRatio: ['1:1', '9:16', '4:5'],
    example: "Panadería: Pan horneándose con vapor y proceso en time-lapse.",
    previewUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80"
  },

  // 31. Cooler Refresh (Refresco en Cooler)
  video_cooler_refresh: {
    label: "Botillería / Cooler",
    category: "COMERCIO",
    tags: ["Bebidas", "Frío", "Refrescante"],
    prompt: "Hand reaching into a cold beverage cooler, condensation droplets on glass, bright retail lighting, refreshing cold atmosphere, close-up of cold drinks, commercial retail energy.",
    motionStyle: "Hand reaching in cooler, condensation droplets, refreshing feel",
    duration: "5-8 seg",
    aspectRatio: ['1:1', '9:16', '4:5'],
    example: "Botillería: Mano llegando al cooler frío con condensación.",
    previewUrl: "https://images.unsplash.com/photo-1574935971562-45a6e5d1e2eb?auto=format&fit=crop&w=400&q=80"
  },

  // 32. Griddle Sizzle (Sabor a la Plancha)
  video_griddle_sizzle: {
    label: "Comida Rápida / Plancha",
    category: "COMERCIO",
    tags: ["Comida", "Plancha", "Sabor"],
    prompt: "Close-up of food sizzling on a hot griddle, steam rising dramatically, spatula flipping food, vibrant appetizing colors, high-energy food commercial style, street food cooking action.",
    motionStyle: "Food sizzling, steam rising, spatula flipping",
    duration: "5-8 seg",
    aspectRatio: ['1:1', '4:5', '9:16'],
    example: "Comida rápida: Comida chisporroteando en plancha caliente.",
    previewUrl: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=400&q=80"
  },

  // 33. Barber Precision (Precisión de Barbero)
  video_barber_precision: {
    label: "Barbería / Precisión",
    category: "SERVICIOS",
    tags: ["Corte", "Barbero", "Precisión"],
    prompt: "Slow motion close-up of hair clippers or scissors in action, hair falling, professional bright lighting, stylish barber movements, focus on precision cutting, modern grooming aesthetic.",
    motionStyle: "Clippers cutting hair, slow motion, precise movements",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '9:16', '16:9'],
    example: "Barbería: Tijeras y máquinas cortando cabello en slow motion.",
    previewUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80"
  },

  // 34. Pet Interaction (Interacción Mascota)
  video_pet_interaction: {
    label: "Veterinaria / Mascota",
    category: "SALUD",
    tags: ["Mascota", "Vet", "Cuidado"],
    prompt: "Caring veterinarian examining a happy dog, handheld camera following movement, warm natural lighting, emotional human-animal connection, professional pet care atmosphere, trustworthy veterinary service.",
    motionStyle: "Vet examining pet, warm lighting, emotional connection",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Veterinaria: Veterinario cuidando mascot feliz con cariño.",
    previewUrl: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=400&q=80"
  },

  // 35. Technical Fix (Reparación Técnica)
  video_technical_fix: {
    label: "Gasfitería / Técnica",
    category: "SERVICIOS",
    tags: ["Reparación", "Herramientas", "Técnico"],
    prompt: "Close-up of wrench tightening a pipe, water pressure test showing no leaks, focused technical movement, professional blue-collar hands at work, precise plumbing repair action.",
    motionStyle: "Wrench tightening pipe, water test, technical precision",
    duration: "6-10 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Gasfitería: Llave ajustando tubería con prueba de presión.",
    previewUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=400&q=80"
  },

  // 36. Dental Tech (Tecnología Dental)
  video_dental_tech: {
    label: "Dental / Tecnología",
    category: "SALUD",
    tags: ["Dental", "Tech", "Limpio"],
    prompt: "Smooth cinematic pan over modern dental equipment, blue LED clinical lights, sterile environment, futuristic medical feel, precision focus on dental tools, clean professional dentistry.",
    motionStyle: "Smooth pan over equipment, blue LED lights, sterile environment",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Dental: Equipamiento moderno con luces LED azules clínicas.",
    previewUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80"
  },

  // 37. Rehab Movement (Movimiento de Rehab)
  video_rehab_movement: {
    label: "Kinesiología / Rehab",
    category: "SALUD",
    tags: ["Rehabilitación", "Movimiento", "Salud"],
    prompt: "Patient performing elastic band exercise with kinesiologist guiding movement, slow controlled action showing proper form, bright studio lighting, health and recovery focus, professional rehabilitation environment.",
    motionStyle: "Elastic band exercise, guided movement, slow controlled action",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Kinesiología: Paciente haciendo ejercicio con bandas elásticas.",
    previewUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80"
  },

  // 38. Corporate Handshake (Acuerdo Corporativo)
  video_corporate_handshake: {
    label: "Estudio Jurídico / Corporativo",
    category: "PROFESIONAL",
    tags: ["Acuerdo", "Legal", "Serio"],
    prompt: "Professional handshake in a law or accounting office, slow pan over legal documents and books, serious and prestigious atmosphere, soft office lighting, corporate trust and professionalism.",
    motionStyle: "Handshake, document pan, professional corporate atmosphere",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1.91:1', '1:1'],
    example: "Estudio jurídico: Apretón de manos profesional en oficina.",
    previewUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=400&q=80"
  },

  // 39. Lawn Transformation (Corte de Pasto)
  video_lawn_transformation: {
    label: "Jardinería / Pasto",
    category: "SERVICIOS",
    tags: ["Jardín", "Corte", "Verde"],
    prompt: "Lawn mower moving through vibrant green grass, grass clippings flying in the air, outdoor sunlight, satisfying nature transformation, fresh cut grass look, professional landscaping action.",
    motionStyle: "Lawn mower moving, grass clippings flying, transformation",
    duration: "6-10 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Jardinería: Cortadora de pasto en acción con pasto verde.",
    previewUrl: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=400&q=80"
  },

  // 40. Surveillance Scan (Escaneo de Seguridad)
  video_surveillance_scan: {
    label: "Seguridad / Vigilancia",
    category: "SERVICIOS",
    tags: ["Cámara", "Seguridad", "Tech"],
    prompt: "Security camera panning slowly across a space, digital HUD interface overlay showing monitoring data, night vision transition effect, safety and protection focus, modern tech security aesthetic.",
    motionStyle: "Camera panning, HUD overlay, night vision transition",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Seguridad: Cámara de vigilancia escaneando con interfaz digital.",
    previewUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=400&q=80"
  },

  // --- NUEVOS VIDEO STYLES 41-60 (2026) ---

  // 41. Sushi Prep (Corte de Sushi)
  video_sushi_prep: {
    label: "Sushi / Preparación",
    category: "COMERCIO",
    tags: ["Sushi", "Corte", "Precisión"],
    prompt: "Precise knife cutting fresh salmon, zen minimalist plating, smooth professional movement, Japanese aesthetic, clean workspace, sharp blade detail, culinary precision.",
    motionStyle: "Precise knife cutting fish, smooth presentation",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '9:16', '4:5'],
    example: "Sushi: Corte preciso de pescado fresco.",
    previewUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80"
  },

  // 42. Pizza Heat (Calor de Pizza)
  video_pizza_heat: {
    label: "Pizza / Horno",
    category: "COMERCIO",
    tags: ["Pizza", "Queso", "Horno"],
    prompt: "Cheese stretching when pulling pizza slice from stone oven, golden crust, melting mozzarella, warm oven glow, rustic Italian atmosphere, appetizing steam rising.",
    motionStyle: "Cheese stretching, oven heat glow",
    duration: "5-8 seg",
    aspectRatio: ['1:1', '4:5', '9:16'],
    example: "Pizza: Queso derritiéndose al sacar del horno.",
    previewUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80"
  },

  // 43. Ice Cream Drip (Goteo de Helado)
  video_ice_cream_drip: {
    label: "Helado / Goteo",
    category: "COMERCIO",
    tags: ["Helado", "Crema", "Frío"],
    prompt: "Creamy ice cream scoop forming in machine, cold vapor rising, smooth dripping texture, vibrant colors, summer refreshment, appetizing cold treat.",
    motionStyle: "Creamy ice cream dripping slowly, cold vapor",
    duration: "5-8 seg",
    aspectRatio: ['1:1', '9:16', '4:5'],
    example: "Helado: Formación cremosa con vapor frío.",
    previewUrl: "https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=400&q=80"
  },

  // 44. Nail Shine (Brillo de Uñas)
  video_nail_shine: {
    label: "Nails / Brillo",
    category: "SALUD",
    tags: ["Uñas", "Brillo", "Belleza"],
    prompt: "Light reflection sliding over polished nail, smooth glossy surface, vibrant nail art, clean salon desk, professional beauty treatment, precise brush movement.",
    motionStyle: "Light reflection on nail, precise brush",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '9:16', '16:9'],
    example: "Nails: Reflejo de luz en uña pintada.",
    previewUrl: "https://images.unsplash.com/photo-1632345031635-7b80009a6401?auto=format&fit=crop&w=400&q=80"
  },

  // 45. Tattoo Ink (Tinta de Tatuaje)
  video_tattoo_ink: {
    label: "Tattoo / Tinta",
    category: "SERVICIOS",
    tags: ["Tattoo", "Tinta", "Arte"],
    prompt: "Tattoo needle with ink detail macro, precise machine movement, sterile equipment, dramatic lighting, urban edgy vibe, artistic tattoo process.",
    motionStyle: "Tattoo needle with ink, precise movement",
    duration: "6-10 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Tattoo: Aguja de tatuar con detalle de tinta.",
    previewUrl: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=400&q=80"
  },

  // 46. Yoga Flow (Flujo de Yoga)
  video_yoga_flow: {
    label: "Yoga / Flujo",
    category: "LIFESTYLE",
    tags: ["Yoga", "Movimiento", "Paz"],
    prompt: "Person in yoga pose with slow fluid stretching movement, controlled breathing rhythm, zen minimalist studio, soft natural light, peaceful atmosphere.",
    motionStyle: "Slow fluid stretching, controlled breathing",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Yoga: Movimiento fluido de estiramiento.",
    previewUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80"
  },

  // 47. Foam Reveal (Revelación de Espuma)
  video_foam_reveal: {
    label: "Car Detailing / Espuma",
    category: "SERVICIOS",
    tags: ["Auto", "Espuma", "Brillo"],
    prompt: "Foam sliding down luxury car revealing shiny surface, high-gloss reflection, professional detailing, clean transformation, satisfying reveal effect.",
    motionStyle: "Foam sliding down revealing shine",
    duration: "6-10 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Car Detailing: Espuma revelando brillo del auto.",
    previewUrl: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=400&q=80"
  },

  // 48. Optic Focus (Enfoque Óptico)
  video_optic_focus: {
    label: "Óptica / Enfoque",
    category: "SALUD",
    tags: ["Lentes", "Enfoque", "Vista"],
    prompt: "Focus transition between different eyeglass frames displays, clean bright retail lighting, modern optical store, professional eye care atmosphere.",
    motionStyle: "Focus transition between frames",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '9:16', '16:9'],
    example: "Óptica: Cambio de enfoque entre marcos de lentes.",
    previewUrl: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=400&q=80"
  },

  // 49. Book Pan (Paneo de Libros)
  video_book_pan: {
    label: "Librería / Libros",
    category: "COMERCIO",
    tags: ["Libros", "Paneo", "Cultura"],
    prompt: "Smooth pan along organized book spines, cozy bookstore atmosphere, warm lighting, reading nook, intellectual vibe, book lover's paradise.",
    motionStyle: "Smooth pan along book spines",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Librería: Paneo suave por lomos de libros.",
    previewUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80"
  },

  // 50. Flower Mist (Rocío de Flores)
  video_flower_mist: {
    label: "Florería / Rocío",
    category: "COMERCIO",
    tags: ["Flores", "Rocío", "Fresco"],
    prompt: "Water mist droplets falling on colorful flowers in slow motion, fresh bouquet, natural vibrant colors, romantic flower shop atmosphere.",
    motionStyle: "Water mist on flowers in slow motion",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '9:16', '4:5'],
    example: "Florería: Rocío de agua en flores.",
    previewUrl: "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=400&q=80"
  },

  // 51. Bottle Glow (Brillo de Botellas)
  video_bottle_glow: {
    label: "Botillería / Brillo",
    category: "COMERCIO",
    tags: ["Bebidas", "Neón", "Brillo"],
    prompt: "Neon light reflection on premium liquor bottles, cold atmosphere, retail display, professional liquor store, vibrant neon accents.",
    motionStyle: "Neon glow on bottles",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '9:16', '16:9'],
    example: "Botillería: Luz de neón en botellas.",
    previewUrl: "https://images.unsplash.com/photo-1574935971562-45a6e5d1e2eb?auto=format&fit=crop&w=400&q=80"
  },

  // 52. Van Drive (Conducción de Furgón)
  video_van_drive: {
    label: "Transporte / Furgón",
    category: "SERVICIOS",
    tags: ["Transporte", "Furgón", "Ruta"],
    prompt: "Professional yellow school van driving on route, stable tracking shot, daylight, Chilean transport, safety signs visible, reliable transport vibe.",
    motionStyle: "Stable tracking of van driving",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1.91:1', '9:16'],
    example: "Transporte: Furgón escolar en ruta.",
    previewUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ed532?auto=format&fit=crop&w=400&q=80"
  },

  // 53. Tool Pick (Selección de Herramienta)
  video_tool_pick: {
    label: "Ferretería / Herramienta",
    category: "COMERCIO",
    tags: ["Herramientas", "Ferretería", "Precisión"],
    prompt: "Professional hand picking up tool from hardware display, precise grip, organized tool wall, industrial retail atmosphere, reliable hardware service.",
    motionStyle: "Hand picking tool, precise grip",
    duration: "6-10 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Ferretería: Tomando herramienta del exhibidor.",
    previewUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=400&q=80"
  },

  // 54. Market Fresh (Frescura de Mercado)
  video_market_fresh: {
    label: "Mercado / Frescura",
    category: "COMERCIO",
    tags: ["Mercado", "Frutas", "Fresco"],
    prompt: "Pan across vibrant fruit crates at outdoor market, fresh produce colors, natural daylight, artisanal market feel, fresh and authentic atmosphere.",
    motionStyle: "Pan across fruit crates",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Mercado: Frutas frescas en cajones.",
    previewUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=400&q=80"
  },

  // 55. Cleaning Shine (Brillo de Limpieza)
  video_cleaning_shine: {
    label: "Limpieza / Brillo",
    category: "SERVICIOS",
    tags: ["Limpieza", "Brillo", "Higiene"],
    prompt: "Cloth wiping glass revealing sparkling clean surface, streak-free shine, bright fresh atmosphere, professional cleaning transformation.",
    motionStyle: "Cloth revealing clean shine",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '9:16', '16:9'],
    example: "Limpieza: Paño revelando brillo limpio.",
    previewUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80"
  },

  // 56. Globe Spin (Giro de Globo)
  video_globe_spin: {
    label: "Viajes / Globo",
    category: "SERVICIOS",
    tags: ["Viajes", "Globo", "Mundo"],
    prompt: "Globe spinning in bright modern travel agency office, world map background, travel dreams atmosphere, bright inviting space, vacation excitement.",
    motionStyle: "Globe spinning in bright office",
    duration: "8-12 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Viajes: Globo terráqueo girando.",
    previewUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80"
  },

  // 57. Steam Iron (Plancha a Vapor)
  video_steam_iron: {
    label: "Lavandería / Vapor",
    category: "SERVICIOS",
    tags: ["Lavandería", "Vapor", "Planchado"],
    prompt: "Steam rising from freshly ironed clothes, smooth fabric, bright white light, professional laundry care, fresh clean linen atmosphere.",
    motionStyle: "Steam rising from ironed clothes",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '9:16', '16:9'],
    example: "Lavandería: Vapor de plancha en ropa.",
    previewUrl: "https://images.unsplash.com/photo-1582735689369-4fe8d7499698?auto=format&fit=crop&w=400&q=80"
  },

  // 58. Shoe Walk (Caminata de Zapatos)
  video_shoe_walk: {
    label: "Zapatería / Caminata",
    category: "COMERCIO",
    tags: ["Zapatos", "Moda", "Caminata"],
    prompt: "Stylish walking steps showing quality footwear, modern shoe store background, clean minimalist design, fashion forward movement.",
    motionStyle: "Walking steps showing shoes",
    duration: "6-10 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Zapatería: Pasos caminando con zapatos.",
    previewUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80"
  },

  // 59. Tech Micro (Micro Técnico)
  video_tech_micro: {
    label: "Técnico / Micro",
    category: "SERVICIOS",
    tags: ["Técnico", "Celular", "Precisión"],
    prompt: "Tweezers working on smartphone circuit board, micro precision movement, technical repair station, high-tech lab light, professional repair service.",
    motionStyle: "Tweezers on phone circuit",
    duration: "6-10 seg",
    aspectRatio: ['16:9', '1:1', '9:16'],
    example: "Técnico: Pinzas en circuito de celular.",
    previewUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80"
  },

  // 60. Cake Slicing (Corte de Torta)
  video_cake_slicing: {
    label: "Pastelería / Torta",
    category: "COMERCIO",
    tags: ["Pastel", "Torta", "Corte"],
    prompt: "Cake being sliced revealing soft layers, smooth cutting motion, pastel colors, warm bakery light, sweet artisanal presentation.",
    motionStyle: "Cake being sliced, smooth cut",
    duration: "6-10 seg",
    aspectRatio: ['1:1', '4:5', '9:16'],
    example: "Pastelería: Corte de torta revelando capas.",
    previewUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80"
  }
};

// ============================================
// CONFIGURACIÓN DE PLANES DE GOOGLE VEO 3.1
// ============================================
export const VEO_VIDEO_CONFIG: VideoPlanConfig = {
  draft: {
    model: 'veo-3.1-fast-generate-preview',
    resolution: '720p',
    speed: 'fast',
    costMultiplier: 0.3,
    description: 'Para probar ideas rápidamente',
    quality: 'standard'
  },
  production: {
    model: 'veo-3.1-generate-preview',
    resolution: '1080p',
    speed: 'standard',
    costMultiplier: 1.0,
    description: 'Para descarga final del cliente',
    quality: 'high'
  }
};

// ============================================
// CONFIGURACIÓN DE CHUTES API (Wan-2.2-I2V-14B-Fast)
// https://chutes-wan-2-2-i2v-14b-fast.chutes.ai/
// ============================================

// Obtener URL base de API desde variable de entorno (sin endpoint)
const getChutesBaseUrl = (): string => {
  return import.meta.env.VITE_CHUTES_API_URL || 'https://chutes-wan-2-2-i2v-14b-fast.chutes.ai';
};

// Configuración de video: 6 segundos (96 frames × 16 fps)
const VIDEO_DURATION_SECONDS = 6;
const VIDEO_DEFAULT_FPS = 16;
const VIDEO_DEFAULT_FRAMES = VIDEO_DURATION_SECONDS * VIDEO_DEFAULT_FPS; // 96 frames

export const CHUTES_VIDEO_CONFIG = {
  // URL base del endpoint de Chutes (sin endpoint específico)
  apiUrl: getChutesBaseUrl(),
  
  // Obtener API key desde variable de entorno
  getApiKey: () => import.meta.env.VITE_CHUTES_API_KEY || '',
  
  // Parámetros por defecto (6 segundos)
  defaultParams: {
    steps: 25,
    fps: VIDEO_DEFAULT_FPS,        // 16 fps
    frames: VIDEO_DEFAULT_FRAMES,  // 96 frames = 6 segundos
    seed: 42,
    guidanceScale: 5.0,
    singleFrame: false
  },
  
  // Configuración de calidad
  quality: {
    draft: { steps: 20, fps: 16, frames: 96 },
    standard: { steps: 25, fps: 16, frames: 96 },
    high: { steps: 30, fps: 24, frames: 144 } // 6 segundos a 24fps
  },
  
  // Duración del video en segundos
  videoDurationSeconds: VIDEO_DURATION_SECONDS,
  
  // Prompt negativo por defecto
  negativePrompt: "Vibrant colors, overexposed, static, blurry details, subtitles, style, artwork, painting, picture, still, overall grayish, worst quality, low quality, JPEG compression artifacts, ugly, incomplete, extra fingers, poorly drawn hands, poorly drawn face, deformed, disfigured, malformed limbs, fused fingers, motionless image, cluttered background, three legs, many people in the background, walking backwards, slow motion"
};

// ============================================
// MATRIZ MAESTRA DE GUARDRAILS DE SEGURIDAD
// Negative Prompts por Estilo de Imagen
// ============================================

export const IMAGE_GUARDRAILS: Record<FlyerStyleKey, string> = {
  // --- ESTILOS ORIGINALES 1-25 ---
  brand_identity: "blur, low resolution, messy, organic chaos, vintage filters, watermark, text overlay, logo visible",
  
  retail_sale: "messy store, empty shelves, broken products, dark lighting, sad faces, outdated products, dust, cobwebs",
  
  summer_beach: "rain, storm, dark clouds, cold weather, winter scene, snow, indoor pool, dirty water, seaweed, trash",
  
  worship_sky: "dark clouds, thunderstorm, evil imagery, scary faces, hell fire, demons, blood, violence, sad ceremony",
  
  corporate: "casual friday, jeans, sneakers, coffee cup in hand, messy desk, unfinished presentation, error screens",
  
  urban_night: "daylight, bright sun, family friendly, quiet street, empty parking lot, closed businesses, peaceful scene",
  
  gastronomy: "burnt food, raw meat, dirty plates, empty restaurant, sad presentation, mold, expired food, insects",
  
  sport_gritty: "towels, candles, zen stones, massage tables, spa robes, oils, meditation, peaceful yoga, relaxation",
  
  luxury_gold: "cheap plastic, tarnished gold, broken champagne, empty venue, poor lighting, tacky decorations, fake items",
  
  aesthetic_min: "cluttered desk, bright colors, loud patterns, mess, chaos, multiple fonts, busy background, noise",
  
  retro_vintage: "modern technology, smartphones, laptops, contemporary clothing, modern cars, digital screens",
  
  gamer_stream: "realistic office, nature documentary, calm meditation, educational content, sports broadcast",
  
  eco_organic: "plastic packaging, industrial factory, pollution, trash, dead plants, synthetic materials, chemicals",
  
  indie_grunge: "clean polished studio, corporate meeting, business suits, pristine condition, organized neatness",
  
  political_community: "controversial symbols, protest signs, angry crowd, violence, negative campaign, mudslinging",
  
  kids_fun: "adult content, scary imagery, dark colors, violence, inappropriate themes, realistic war toys, weapons",
  
  art_double_exp: "sharp focus, clear image, simple composition, modern design, digital clean, minimal art",
  
  medical_clean: "blood, surgery, needles, dental tools, hospital bed, sick patient, dark shadows, emergency room",
  
  tech_saas: "pen and paper, manual process, outdated computer, broken keyboard, analog device, rotary phone",
  
  typo_bold: "complex image, detailed illustration, photo-realistic, busy background, multiple elements, clutter",
  
  realestate_night: "daylight, construction debris, unfinished walls, messy interiors, low ceilings, abandoned building",
  
  auto_metallic: "dirty cars, workshops, tools, grease, pedestrian streets, bicycles, motorcycles, traffic jam",
  
  edu_sketch: "party, gaming, toys, alcohol, unprofessional behavior, dark clubs, nightclub, bar scene",
  
  wellness_zen: "gym weights, heavy machines, sweat, dark moody lighting, surgery, medical equipment, clinical",
  
  pilates: "weightlifting, CrossFit, heavy deadlifts, combat sports, extreme sports, high intensity interval",
  
  podcast_mic: "silent studio, empty chair, turned off lights, broken equipment, analog tape, outdated technology",
  
  seasonal_holiday: "summer beach, spring flowers, autumn leaves, regular birthday, non-holiday celebration",
  
  market_handwritten: "digital signage, neon signs, LED screens, modern supermarket, corporate chain store, polished",

  // --- NUEVOS ESTILOS 26-40 ---
  mechanic_workshop: "business suits, luxury showroom, polished glass floors, ties, executives, office meeting, clean carpet",
  
  tire_service: "car wash, waxing, luxury lounge, interior detailing, soft furniture, waiting area, coffee bar, comfortable seating",
  
  construction_site: "finished luxury decor, curtains, indoor furniture, tidy gardens, completed building, move-in ready, polished interior",
  
  logistics_delivery: "shopping mall, retail customers, shopping carts, open products, display shelves, checkout counter, cashier",
  
  bakery_bread: "sushi, raw meat, wine bottles, dinner tables, soup, formal dining, restaurant setting, silver cutlery",
  
  liquor_store: "restaurant tables, cooked food, coffee machines, gym equipment, fresh produce, organic section, bakery items",
  
  fast_food_street: "fine dining, silver cutlery, white tablecloths, expensive wine, formal waiters, tasting menu, gourmet plating",
  
  barber_shop: "massage candles, aromatherapy, spa robes, surgery tools, water, wet shave, facial treatment, beauty salon",
  
  veterinary_clinic: "human patients, wild animals, taxidermy, dark lighting, kitchen, slaughterhouse, meat products, blood",
  
  hvac_plumbing: "interior design, computers, clean hands, office suits, soft fabrics, luxury furniture, executive desk, polished floor",
  
  dental_clinic: "hospital beds, surgical rooms, blood, dark shadows, massage oils, spa music, candles, relaxation chair",
  
  physiotherapy: "heavy gym weights, bodybuilders, powerlifting, spa candles, massage oils, aromatherapy, zen music, meditation",
  
  law_accounting: "casual clothing, workshop, outdoor nature, loud neon colors, party scene, casual Friday, jeans and t-shirt",
  
  gardening_landscaping: "indoor office, computers, desert, dry dead plants, industrial, construction zone, concrete jungle, pollution",
  
  security_systems: "police officers, guns, dark alleys, messy wiring, chaos, armed guards, violence, emergency vehicles, sirens",

  // --- NUEVOS ESTILOS 41-60 ---
  sushi_nikkei: "bread, burgers, wooden rustic tables, steam, pizza, fast food, dark lighting, casual atmosphere",
  
  pizzeria: "sushi, fine dining, elegant glassware, cold salads, raw ingredients, dirty oven, burnt crust, cold presentation",
  
  ice_cream: "hot food, steam, dark lighting, salty snacks, melted mess, industrial, frozen solid, plain vanilla",
  
  nail_studio: "hair cutting, massage beds, feet, medical tools, dirty nails, dark polish, casual setting, spa atmosphere",
  
  tattoo_studio: "medical hospital, bright white sterile, makeup, spa candles, clean clinical, relaxation, beauty treatment",
  
  yoga_studio: "gym weights, treadmill, heavy sneakers, sweat, intense cardio, loud music, competitive atmosphere, mirrors",
  
  car_detailing: "mechanical repairs, engines, greasy tools, rusty cars, dirty garage, oil stains, broken parts, chaos",
  
  optical: "dentist tools, surgery, sunglasses on beach, medical equipment, dark room, casual display, messy shop",
  
  bookstore: "digital screens, messy office, food, noisy crowds, electronic devices, loud music, fast food, coffee shop",
  
  flower_shop: "dry plants, artificial flowers, dark warehouse, wilted blooms, plastic, industrial, cold storage, dusty",
  
  transport_school: "racing cars, dark alleys, luxury sedans, construction vehicles, emergency, dirty, damaged, old",
  
  hardware_store: "luxury furniture, soft fabrics, food, spa candles, home decor, clothing, toys, beauty products",
  
  cleaning_service: "messy rooms, dark shadows, greasy tools, construction dust, dirt, clutter, chaos, industrial",
  
  travel_agency: "hospitals, dark offices, industrial warehouses, government building, boring, dull, gray, sterile",
  
  laundry: "grease, car parts, messy kitchens, dark colors, industrial, construction, outdoor, dirty environment",
  
  shoe_store: "bare feet, messy floors, clothes only, tools, food, drinks, casual display, disorganized",
  
  tech_repair: "heavy hammers, water, fire, messy garage, cooking, food, drinks, casual setting, outdoor",
  
  pastry_shop: "salty food, raw meat, fast food, beer, dark shadows, industrial, messy, casual, unhealthy"
};

// ============================================
// GUARDRAILS DE MOVIMIENTO PARA VIDEO
// Motion Physics & Composition Rules
// ============================================

export const VIDEO_MOTION_GUARDRAILS: Record<FlyerStyleKeyVideo, {
  prohibited: string;
  forced: string;
}> = {
  // --- ESTILOS ORIGINALES 1-25 ---
  video_retail_sale: {
    prohibited: "static image, no movement, frozen products, dead scene, still life, no energy",
    forced: "dynamic explosion, floating products, confetti falling, camera push-in, vibrant energy"
  },
  
  video_summer_beach: {
    prohibited: "indoor pool, dark water, storm waves, cold atmosphere, winter scene, empty beach",
    forced: "crystal clear water, warm sunlight, gentle waves, tropical vibe, inviting atmosphere"
  },
  
  video_worship_sky: {
    prohibited: "dark clouds, thunderstorm, evil imagery, scary faces, negative energy, sad ceremony",
    forced: "god rays, divine light, hopeful atmosphere, spiritual elevation, peaceful transcendence"
  },
  
  video_corporate: {
    prohibited: "casual friday, messy desk, unfinished work, error screens, casual clothing, coffee cup dominant",
    forced: "professional environment, clean workspace, polished presentation, business attire, success vibe"
  },
  
  video_urban_night: {
    prohibited: "daylight, bright sun, family friendly, quiet street, peaceful scene, empty venue",
    forced: "neon lights, laser beams, smoke atmosphere, dynamic energy, crowd excitement, club vibe"
  },
  
  video_gastronomy: {
    prohibited: "burnt food, raw meat, dirty plates, empty restaurant, sad presentation, slow motion drooping",
    forced: "appetizing steam, perfect lighting, delicious presentation, fresh ingredients, mouth-watering close-up"
  },
  
  video_sport_gritty: {
    prohibited: "towels, candles, zen stones, massage tables, spa robes, oils, meditation, peaceful yoga",
    forced: "intense effort, sweat droplets, muscle tension, heavy breathing, dynamic movement, power"
  },
  
  video_luxury_gold: {
    prohibited: "cheap plastic, tarnished gold, broken champagne, empty venue, poor lighting, tacky decorations",
    forced: "elegant champagne bubbles, gold sparkles, smooth camera glide, sophisticated atmosphere, premium feel"
  },
  
  video_aesthetic_min: {
    prohibited: "cluttered desk, bright colors, loud patterns, mess, chaos, multiple fonts, busy background",
    forced: "soft window light, leaf shadows swaying, slow camera movement, calming atmosphere, minimal beauty"
  },
  
  video_retro_vintage: {
    prohibited: "modern technology, smartphones, laptops, contemporary clothing, modern cars, digital screens",
    forced: "stop-motion jitter, film grain flicker, glitch effects, 90s aesthetic, nostalgic movement"
  },
  
  video_gamer_stream: {
    prohibited: "realistic office, nature documentary, calm meditation, educational content, sports broadcast",
    forced: "digital distortion, glitch artifacts, neon lightning, glowing eyes pulsating, cyber atmosphere"
  },
  
  video_eco_organic: {
    prohibited: "plastic packaging, industrial factory, pollution, trash, dead plants, synthetic materials",
    forced: "leaves blowing gently, dappled sunlight, butterfly flying, natural breeze, organic movement"
  },
  
  video_indie_grunge: {
    prohibited: "clean polished studio, corporate meeting, business suits, pristine condition, organized neatness",
    forced: "smoke rolling, shaky cam, dust in spotlight, raw documentary feel, authentic stage atmosphere"
  },
  
  video_political: {
    prohibited: "controversial symbols, protest signs, angry crowd, violence, negative campaign, mudslinging",
    forced: "confident walking, smiling at people, tracking shot, natural background movement, positive energy"
  },
  
  video_kids_fun: {
    prohibited: "adult content, scary imagery, dark colors, violence, inappropriate themes, realistic war toys",
    forced: "balloons bobbing, confetti raining, cake spinning, bouncy animation, cheerful movement"
  },
  
  video_art_double_exp: {
    prohibited: "sharp focus, clear image, simple composition, modern design, digital clean, minimal art",
    forced: "fog moving inside silhouette, birds flying, trees swaying, surreal dreamlike motion, double exposure"
  },
  
  video_medical_clean: {
    prohibited: "blood, surgery, needles, dental tools, hospital bed, sick patient, dark shadows, emergency",
    forced: "DNA rotating, smooth panning, stable sterile flow, clean professional atmosphere, futuristic tech"
  },
  
  video_tech_saas: {
    prohibited: "pen and paper, manual process, outdated computer, broken keyboard, analog device, rotary phone",
    forced: "data flowing, brain rotating, light pulses, network connections, digital transformation, innovation"
  },
  
  video_typo_bold: {
    prohibited: "complex image, detailed illustration, photo-realistic, busy background, multiple elements",
    forced: "liquid gradients morphing, geometric shapes rotating, perfect loop, clean text overlay support"
  },
  
  video_realestate_night: {
    prohibited: "daylight, construction debris, unfinished walls, messy interiors, low ceilings, abandoned",
    forced: "stars time-lapse, pool reflection, interior lights, luxury atmosphere, serene night beauty"
  },
  
  video_auto_metallic: {
    prohibited: "dirty cars, workshops, tools, grease, pedestrian streets, bicycles, traffic jam, urban chaos",
    forced: "wheel spinning fast, smoke billowing, sparks flying, high-octane action, automotive excellence"
  },
  
  video_edu_sketch: {
    prohibited: "party, gaming, toys, alcohol, unprofessional behavior, dark clubs, nightclub, bar scene",
    forced: "chalk drawing itself, dust motes dancing, write-on effect, academic atmosphere, learning focus"
  },
  
  video_wellness_zen: {
    prohibited: "gym weights, heavy machines, sweat, dark moody lighting, surgery, medical equipment, clinical",
    forced: "water drop falling, perfect ripples, candle flickering, steam rising, peaceful tranquility"
  },
  
  video_podcast_mic: {
    prohibited: "silent studio, empty chair, turned off lights, broken equipment, analog tape, outdated tech",
    forced: "soundwaves jumping, ON AIR pulsing, camera orbit, studio energy, broadcast professional"
  },
  
  video_seasonal_holiday: {
    prohibited: "summer beach, spring flowers, autumn leaves, regular birthday, non-holiday celebration",
    forced: "snow falling, hearts floating, lights twinkling, magical atmosphere, festive joy"
  },

  // --- NUEVOS VIDEO STYLES 26-40 ---
  video_mechanic_action: {
    prohibited: "dreamy lighting, slow-mo fashion, elegant poses, studio lighting, clean hands, business attire",
    forced: "industrial grit, sharp focus, sparks flying, hands working, mechanical precision, workshop atmosphere"
  },
  
  video_tire_spin: {
    prohibited: "slow motion beauty, elegant rotation, smooth gliding, calm atmosphere, luxury showroom",
    forced: "high-speed rotation, water droplets flying, industrial action, rubber texture focus, service efficiency"
  },
  
  video_construction_drone: {
    prohibited: "completed building, move-in ready, furnished interior, polished finish, empty site without workers",
    forced: "drone flyover, crane rotation, workers in action, architectural progress, construction energy"
  },
  
  video_logistic_flow: {
    prohibited: "shopping mall, retail customers, shopping carts, display shelves, checkout counter, casual browsing",
    forced: "packages on conveyor, delivery van driving, fast motion, efficiency focus, professional logistics"
  },
  
  video_baking_rise: {
    prohibited: "fast chaotic cuts, burnt food, raw dough, dark oven, cold kitchen, industrial factory",
    forced: "steady macro, slow growth, warm glow, golden crust forming, appetizing time-lapse, traditional bakery"
  },
  
  video_cooler_refresh: {
    prohibited: "warm drinks, hot food, restaurant setting, formal dining, slow service, empty shelves",
    forced: "hand reaching in cooler, condensation droplets, refreshing cold, bright retail lighting, convenient service"
  },
  
  video_griddle_sizzle: {
    prohibited: "fine dining, silver cutlery, white tablecloths, expensive wine, formal plating, gourmet presentation",
    forced: "food sizzling, steam rising, spatula flipping, vibrant colors, high-energy street food, appetizing action"
  },
  
  video_barber_precision: {
    prohibited: "wide landscape shots, spa atmosphere, massage candles, aromatherapy, relaxation focus, beauty salon",
    forced: "macro close-ups, sharp transitions, clippers cutting hair, precise movements, professional grooming"
  },
  
  video_pet_interaction: {
    prohibited: "human hospital, wild animals, taxidermy, dark lighting, kitchen, meat products, clinical cold",
    forced: "vet examining pet, warm natural lighting, emotional connection, trust and care, professional pet health"
  },
  
  video_technical_fix: {
    prohibited: "interior design, computers, clean hands, office suits, soft fabrics, luxury furniture, executive setting",
    forced: "wrench tightening pipe, water pressure test, focused technical movement, blue-collar expertise, precision"
  },
  
  video_dental_tech: {
    prohibited: "hospital beds, surgical rooms, blood, dark shadows, massage oils, spa music, relaxation chair",
    forced: "smooth equipment pan, blue LED lights, sterile environment, futuristic medical, clean precision"
  },
  
  video_rehab_movement: {
    prohibited: "high speed action, aggressive blur, extreme sports, heavy gym weights, bodybuilders, powerlifting",
    forced: "stable tripod, clear form, elastic band exercise, guided movement, slow controlled action, health focus"
  },
  
  video_corporate_handshake: {
    prohibited: "casual clothing, workshop, outdoor nature, loud neon colors, party scene, casual Friday vibe",
    forced: "professional handshake, document pan, serious atmosphere, corporate trust, soft office lighting, success"
  },
  
  video_lawn_transformation: {
    prohibited: "indoor office, computers, desert, dry dead plants, industrial, construction zone, concrete jungle",
    forced: "lawn mower moving, grass clippings flying, satisfying transformation, fresh cut look, outdoor professional"
  },
  
  video_surveillance_scan: {
    prohibited: "handheld shaky cam, action movie shake, dramatic camera movement, dynamic cinematography",
    forced: "mechanical smooth pan, CCTV jitter effect, digital HUD overlay, night vision transition, security focus"
  },

  // --- NUEVOS VIDEO STYLES 41-60 ---
  video_sushi_prep: {
    prohibited: "fast jerky movements, blurry, dark lighting, casual atmosphere, restaurant setting",
    forced: "precise knife cutting, smooth presentation, zen minimal, professional Japanese technique"
  },
  
  video_pizza_heat: {
    prohibited: "unstable handheld camera, blurry cheese, cold presentation, dark oven",
    forced: "cheese stretching smoothly, warm oven glow, rustic Italian, appetizing pull"
  },
  
  video_ice_cream_drip: {
    prohibited: "warm colors, fire, hot steam, fast chaotic, dark moody",
    forced: "cold vapor, creamy slow drip, vibrant colors, summer refreshment, smooth formation"
  },
  
  video_nail_shine: {
    prohibited: "fast zoom, blurry, dark shadows, uneven lighting, casual setting",
    forced: "light reflection sliding, smooth glossy, precise brush, clean salon, professional"
  },
  
  video_tattoo_ink: {
    prohibited: "soft dreamy focus, blurry, romantic lighting, spa atmosphere, relaxation",
    forced: "tattoo needle precision, ink detail macro, sterile equipment, urban edgy, dramatic"
  },
  
  video_yoga_flow: {
    prohibited: "fast cuts, high energy, intense cardio, loud music, competitive atmosphere",
    forced: "slow fluid stretching, controlled breathing, zen studio, peaceful, mindful movement"
  },
  
  video_foam_reveal: {
    prohibited: "war movie shake, action cam, fast cuts, dark gritty, chaotic movement",
    forced: "foam sliding smooth, reveal shiny surface, professional detailing, clean transformation"
  },
  
  video_optic_focus: {
    prohibited: "dramatic shadows, flickering lights, blurry transitions, dark moody",
    forced: "clean focus transition, bright retail, modern optical, professional eye care"
  },
  
  video_book_pan: {
    prohibited: "chaotic movement, blurry, fast cuts, noisy environment, digital screens",
    forced: "smooth pan along spines, cozy bookstore, warm lighting, intellectual, calm"
  },
  
  video_flower_mist: {
    prohibited: "aggressive zoom, digital zoom, harsh lighting, fast motion",
    forced: "water mist droplets, slow motion flowers, fresh bouquet, romantic, natural"
  },
  
  video_bottle_glow: {
    prohibited: "bright daylight, natural light, casual display, warm cozy",
    forced: "neon glow, cold bottles, retail display, professional liquor store, vibrant"
  },
  
  video_van_drive: {
    prohibited: "motion blur, fast speed, action driving, racing, dangerous stunts",
    forced: "stable tracking, smooth driving, safe transport, yellow school van, reliable"
  },
  
  video_tool_pick: {
    prohibited: "dim lighting, romantic atmosphere, casual handling, messy display",
    forced: "professional hand, precise grip, organized tool wall, industrial, reliable"
  },
  
  video_market_fresh: {
    prohibited: "deep shadows, LED artificial lights, indoor grocery, polished supermarket",
    forced: "natural daylight, outdoor market, fresh produce, artisanal, authentic"
  },
  
  video_cleaning_shine: {
    prohibited: "vintage filters, grainy, dirty before, grunge aesthetic, dark",
    forced: "sparkling clean, streak-free shine, bright fresh, professional transformation"
  },
  
  video_globe_spin: {
    prohibited: "static boring shot, dark office, dull atmosphere, gray colors",
    forced: "globe spinning, bright office, travel dreams, exciting, vacation atmosphere"
  },
  
  video_steam_iron: {
    prohibited: "dark dirty environment, industrial grime, outdoor, cold atmosphere",
    forced: "steam rising, fresh clothes, bright white, clean linen, professional care"
  },
  
  video_shoe_walk: {
    prohibited: "high angle overhead, static display, blurry feet, casual walk",
    forced: "walking steps, stylish shoes, modern store, fashion forward, clean movement"
  },
  
  video_tech_micro: {
    prohibited: "wide angle shots, casual handling, outdoor, messy environment",
    forced: "tweezers precision, micro work, circuit board, technical, professional repair"
  },
  
  video_cake_slicing: {
    prohibited: "fast aggressive cuts, messy crumbs, dark lighting, casual party",
    forced: "smooth cake slice, soft layers, pastel colors, warm bakery, sweet presentation"
  }
};

// ============================================
// DICCIONARIO DE ADVERTENCIAS DE CONSISTENCIA (v3.0)
// "Chileno Premium" - Fricción positiva para evitar errores semánticos
// ============================================

export const CONSISTENCY_CONFLICTS: Record<string, {
  title: string;
  message: string;
  icon: 'warning' | 'error' | 'info';
  confirmButtonText: string;
  cancelButtonText: string;
}> = {
  // --- BLOQUE 1: SALUD Y BIENESTAR (EL "FILTRO ANTI-SPA") ---
  PILATES_SPA: {
    title: '¿Estás seguro, jefe?',
    message: '¡Ojo ahí! Estás pidiendo velas o masajes en un rubro de Pilates. Tu marca se va a ver como un Spa y no como un centro de entrenamiento profesional. ¿Seguro que no prefieres resaltar las máquinas o el esfuerzo?',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  YOGA_INTENSE: {
    title: '¡Namasté... pero con calma!',
    message: 'Estás mezclando la paz del Yoga con la intensidad del Crossfit. Si ponemos gente transpirando a chorros y pesas gigantes, se nos va la armonía. ¿Nos quedamos con la flexibilidad?',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  KINE_GYM: {
    title: '¡Aguante un poco!',
    message: 'Eso suena más a entrenamiento pesado de gimnasio que a kinesiología profesional. Si quieres que los pacientes confíen, mejor nos enfocamos en la rehabilitación y la salud, ¿te parece?',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  DENTAL_HOSPITAL: {
    title: '¡Cuidado!',
    message: 'Esa descripción parece de una cirugía mayor. Un centro dental debe verse limpio pero acogedor. ¿Le bajamos un cambio al drama médico para no asustar a los pacientes?',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  VET_STYLING: {
    title: '¡Atención!',
    message: 'Estás pidiendo cortes de pelo y moñitos, pero estamos en modo "Veterinaria". Si quieres que se vea clínico y profesional, mejor nos quedamos con el estetoscopio y el cuidado médico.',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  NAIL_HAIR: {
    title: '¡Atención a las manos!',
    message: 'Elegiste Nail Studio pero hablas de cortes de pelo. El sistema se va a marear y el resultado va a ser cualquier cosa. Enfoquémonos en el brillo y el detalle de las uñas.',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },

  // --- BLOQUE 2: TÉCNICO E INDUSTRIAL (EL "FILTRO ANTI-LUJO") ---
  TALLER_LUXURY: {
    title: 'Mire, jefe...',
    message: 'Pusiste "taller mecánico" pero pide un ambiente de oficina de lujo. Los neumáticos y la grasa no se llevan muy bien con las alfombras blancas. ¿Quieres que sea un taller real o una automotora de Vitacura?',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  FERRE_BOUTIQUE: {
    title: '¡Mire, jefe!',
    message: 'Una ferretería es de soluciones reales, de fierros y herramientas. Si lo describimos como una boutique de lujo con vitrinas de cristal, el maestro chasquilla no nos va a encontrar nunca.',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  CONSTR_DECO: {
    title: '¡Se nos pasó la mano!',
    message: 'Estás pidiendo muebles y cortinas finas, pero elegiste el rubro de "Construcción". Si quieres mostrar la obra, mejor sacamos los adornos y ponemos los cascos y el cemento.',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  LOGISTICA_RETAIL: {
    title: '¡Ojo con la carga!',
    message: 'La logística se trata de eficiencia y movimiento. Si lo describimos como una tienda de mall, perdemos la fuerza de la distribución. ¿Lo dejamos más operativo?',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  DETA_WASH: {
    title: '¡Ojo ahí!',
    message: 'El Detailing es lujo y perfección técnica. Si la descripción suena a "manguerazo en la calle", el dueño del auto caro no va a entrar. ¡Hagamos que ese brillo duela de lo lindo!',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  TECH_REPAIR_MESS: {
    title: '¡Ojo con los cables!',
    message: 'Un servicio técnico profesional se ve ordenado y tecnológico. Si describimos un desorden de piezas sueltas, el cliente va a pensar que le van a sobrar tornillos al celular.',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },

  // --- BLOQUE 3: GASTRONOMÍA (EL "FILTRO DE IDENTIDAD") ---
  PAN_GOURMET: {
    title: '¡Cuidado!',
    message: 'Tu descripción suena a plato de restaurant fino. En una panadería de barrio lo que vende es la harina, el calor y el hornito caliente. Si seguimos, el pan va a parecer de plástico.',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  SUSHI_FASTFOOD: {
    title: '¡Un momento, maestro!',
    message: 'El sushi es pura precisión y frescura. Si le ponemos mucha fritura o salsas chorreando en la descripción, va a parecer un completo de carrito. ¿Mantenemos la elegancia Nikkei?',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  PIZZA_ITALIAN: {
    title: '¡Epa!',
    message: 'Una pizzería artesanal se trata del horno y la masa. Si nos ponemos muy elegantes con manteles largos y velas, la gente va a pensar que es una cena cara y no una pizza al paso.',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  PASTEL_BAJON: {
    title: '¡Cuidado con el azúcar!',
    message: 'Una pastelería fina entra por la vista con detalles delicados. Si la describimos como comida al paso o muy rústica, perdemos la magia de la torta de novios.',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  FERIA_SUPER: {
    title: '¡Caserito, escúcheme!',
    message: 'La gracia de la feria es lo natural y el color del cajón. Si lo describimos muy "empaquetado" o industrial, pierde el sabor del campo. ¿Le ponemos más frescura?',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },

  // --- BLOQUE 4: COMERCIO Y SERVICIOS (EL "FILTRO DE COHERENCIA") ---
  BOTI_DISCO: {
    title: '¡Tranquilein!',
    message: 'Pusiste "Botillería" pero la descripción parece el VIP de una disco. Si quieres que los vecinos te compren la promo, enfoquémonos en los coolers heladitos, no en la pista de baile.',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  BARBER_SPA: {
    title: '¡Tranquilo, compadre!',
    message: 'Las velas y el olor a lavanda son para el Spa. En la barbería mandan las tijeras y el estilo rudo. ¿Le quitamos el modo "zen" para que se vea con más actitud?',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  FURGON_RACING: {
    title: '¡Ojo con el exceso de velocidad!',
    message: 'Un furgón escolar tiene que transmitir seguridad a los papás. Si lo describimos con efectos de carrera, nos van a fiscalizar hasta por la pantalla.',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  TRAVEL_CLINIC: {
    title: '¡Cuidado con el destino!',
    message: 'Una agencia de viajes tiene que vender sueños y relajo. Si la descripción suena muy fría o administrativa, nadie se va a querer subir al avión.',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  SEGURIDAD_WAR: {
    title: '¡Tranquilo, Rambo!',
    message: 'Queremos vender protección, no una guerra. Si ponemos muchas armas o caos en la descripción, el cliente se va a asustar en vez de sentirse seguro.',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  },
  
  TATTOO_CLINIC: {
    title: '¡Cuidado con el estilo!',
    message: 'Un estudio de tatuajes tiene que tener onda urbana y arte. Si lo dejamos muy "blanco y clínico", va a parecer que vas a sacar sangre y no a tatuar.',
    icon: 'warning',
    confirmButtonText: 'Generar igual',
    cancelButtonText: 'Corregir'
  }
};

// ============================================
// REGLAS DE DETECCIÓN DE CONFLICTOS
// Keywords que disparan cada conflicto
// ============================================

export const CONFLICT_DETECTION_RULES: Array<{
  keywords: string[];
  styleKeys: string[];
  conflictCode: string;
}> = [
  // --- SALUD Y BIENESTAR ---
  {
    keywords: ['vela', 'masaje', 'spa', 'aromaterapia', 'relajante', 'zen', 'esencias', 'sahumerios'],
    styleKeys: ['pilates', 'sport_gritty', 'physiotherapy'],
    conflictCode: 'PILATES_SPA'
  },
  {
    keywords: ['crossfit', 'pesas', 'levantamiento', 'intenso', 'cardio', 'sudor', 'entrenamiento pesado'],
    styleKeys: ['yoga_studio', 'wellness_zen', 'pilates'],
    conflictCode: 'YOGA_INTENSE'
  },
  {
    keywords: ['gimnasio', 'maquina', 'pesa', 'entrenamiento', 'musculo', 'bodybuilding'],
    styleKeys: ['physiotherapy', 'medical_clean'],
    conflictCode: 'KINE_GYM'
  },
  {
    keywords: ['quirófano', 'quirurgico', 'sangre', 'operatorio', 'hospital', 'cirugia'],
    styleKeys: ['dental_clinic', 'optical'],
    conflictCode: 'DENTAL_HOSPITAL'
  },
  {
    keywords: ['corte de pelo', 'peluqueria', 'peinado', 'coloracion', 'tratamiento capilar'],
    styleKeys: ['veterinary_clinic', 'nail_studio'],
    conflictCode: 'VET_STYLING'
  },
  {
    keywords: ['corte de pelo', 'peluqueria', 'barberia', 'afeitado'],
    styleKeys: ['nail_studio'],
    conflictCode: 'NAIL_HAIR'
  },

  // --- TÉCNICO E INDUSTRIAL ---
  {
    keywords: ['lujo', 'elegante', 'vitrina', 'cristal', 'alfombra', 'oficina', 'ejecutivo'],
    styleKeys: ['mechanic_workshop', 'auto_metallic', 'car_detailing'],
    conflictCode: 'TALLER_LUXURY'
  },
  {
    keywords: ['boutique', 'tienda', 'vitrine', 'cristal', 'lujoso', 'exhibicion'],
    styleKeys: ['hardware_store', 'construction_site'],
    conflictCode: 'FERRE_BOUTIQUE'
  },
  {
    keywords: ['mueble', 'cortina', 'decoracion', 'interior', 'diseño'],
    styleKeys: ['construction_site', 'logistics_delivery'],
    conflictCode: 'CONSTR_DECO'
  },
  {
    keywords: ['tienda', 'mall', 'retail', 'cliente', 'compra', 'carrito'],
    styleKeys: ['logistics_delivery', 'transport_school'],
    conflictCode: 'LOGISTICA_RETAIL'
  },
  {
    keywords: ['lavado', 'manguera', 'calle', 'exterior', 'barrio'],
    styleKeys: ['car_detailing'],
    conflictCode: 'DETA_WASH'
  },
  {
    keywords: ['desorden', 'cable', 'piezas', 'suelto', 'roto'],
    styleKeys: ['tech_repair'],
    conflictCode: 'TECH_REPAIR_MESS'
  },

  // --- GASTRONOMÍA ---
  {
    keywords: ['plato gourmet', 'restaurant', 'fino', 'elegante', 'cena'],
    styleKeys: ['bakery_bread', 'market_handwritten'],
    conflictCode: 'PAN_GOURMET'
  },
  {
    keywords: ['fritura', 'completos', 'churrasco', 'carne', 'asado'],
    styleKeys: ['sushi_nikkei'],
    conflictCode: 'SUSHI_FASTFOOD'
  },
  {
    keywords: ['mantel', 'vela', 'cena', 'elegante', 'formal'],
    styleKeys: ['pizzeria'],
    conflictCode: 'PIZZA_ITALIAN'
  },
  {
    keywords: ['bajón', 'rapido', 'economico', 'carrito', 'calle'],
    styleKeys: ['pastry_shop'],
    conflictCode: 'PASTEL_BAJON'
  },
  {
    keywords: ['supermercado', 'empaquetado', 'industrial', 'congelado'],
    styleKeys: ['flower_shop', 'market_handwritten'],
    conflictCode: 'FERIA_SUPER'
  },

  // --- COMERCIO Y SERVICIOS ---
  {
    keywords: ['disco', 'fiesta', 'baile', 'vip', 'noche'],
    styleKeys: ['liquor_store'],
    conflictCode: 'BOTI_DISCO'
  },
  {
    keywords: ['vela', 'spa', 'relajante', 'masaje', 'aroma'],
    styleKeys: ['barber_shop'],
    conflictCode: 'BARBER_SPA'
  },
  {
    keywords: ['velocidad', 'carrera', 'rapido', 'deportivo', 'ruido'],
    styleKeys: ['transport_school'],
    conflictCode: 'FURGON_RACING'
  },
  {
    keywords: ['frio', 'administrativo', 'oficina', 'papeleo'],
    styleKeys: ['travel_agency'],
    conflictCode: 'TRAVEL_CLINIC'
  },
  {
    keywords: ['arma', 'pistola', 'bala', 'guerra', 'ataque', 'combate'],
    styleKeys: ['security_systems'],
    conflictCode: 'SEGURIDAD_WAR'
  },
  {
    keywords: ['clinico', 'esteril', 'blanco', 'medico', 'sangre'],
    styleKeys: ['tattoo_studio'],
    conflictCode: 'TATTOO_CLINIC'
  }
];

// ============================================
// INDUSTRY_SUGGESTIONS (41-60)
// Términos que gatillan la mejor respuesta visual en Gemini y Veo
// ============================================

export const INDUSTRY_SUGGESTIONS: Record<string, string[]> = {
  // --- GASTRONOMÍA ESPECÍFICA ---
  "41_sushi_nikkei": ["Corte de cuchillo preciso", "Pescado fresco", "Platos de pizarra", "Estilo zen", "Rolls premium"],
  "42_pizzeria": ["Masa madre", "Horno de piedra", "Bordes tostados", "Queso derretido", "Albahaca fresca"],
  "43_heladeria": ["Helado cremoso", "Cono de barquillo", "Frutas frescas", "Vapor de frío", "Colores vibrantes"],
  "60_pasteleria": ["Frosting delicado", "Capas de bizcocho", "Decoración artesanal", "Tonos pastel", "Azúcar flor"],

  // --- BELLEZA Y CUIDADO ---
  "44_nail_studio": ["Esmalte brillante", "Detalle de pincel", "Luz LED de mesa", "Manos cuidadas", "Arte en uñas"],
  "45_tattoo_studio": ["Máquina de tatuar", "Tinta intensa", "Guantes de nitrilo", "Diseño artístico", "Luz de estudio"],
  "46_yoga_studio": ["Incienso sutil", "Postura de loto", "Mat de yoga", "Silencio visual", "Luz natural"],

  // --- SERVICIOS TÉCNICOS Y OFICIOS ---
  "47_car_detailing": ["Sellado cerámico", "Brillo espejo", "Espuma de lavado", "Microfibra", "Focos de inspección"],
  "48_optica": ["Cristales limpios", "Marcos modernos", "Exhibición minimalista", "Examen visual", "Tecnología óptica"],
  "49_libreria": ["Lomos de libros", "Papelería fina", "Rincón de lectura", "Cuadernos", "Ambiente tranquilo"],
  "50_floreria": ["Rocío de agua", "Flores frescas", "Papel Kraft de regalo", "Vibrante natural", "Arreglos florales"],
  "53_ferreteria": ["Herramientas manuales", "Pinturas", "Materiales de construcción", "Estanterías Pro", "Fierros"],
  "55_limpieza": ["Superficies brillantes", "Hygiene total", "Uniforme profesional", "Aroma fresco", "Orden impecable"],
  "57_lavanderia": ["Vapor de planchado", "Ropa colgada", "Máquinas industriales", "Blanco puro", "Textiles suaves"],
  "59_tech_repair": ["Pinzas de precisión", "Circuitos", "Luz de laboratorio", "Pantallas abiertas", "Soldadura fina"],

  // --- COMERCIO Y TRANSPORTE ---
  "51_botilleria": ["Coolers empañados", "Hielo", "Estanterías llenas", "Iluminación LED comercial", "Bebidas heladas"],
  "52_furgon_escolar": ["Letreros amarillos", "Seguridad vial", "Entorno escolar", "Transporte ordenado", "Confianza"],
  "54_feria_fruteria": ["Cajones de mimbre", "Fruta de estación", "Rocío natural", "Venta al kilo", "Colores de campo"],
  "56_agencia_viajes": ["Pasaportes", "Tickets de avión", "Mapas", "Destinos de playa", "Maletas modernas"],
  "58_zapateria": ["Textura de cuero", "Vitrinas elegantes", "Cajas de zapatos", "Hormas de madera", "Diseño calzado"]
};
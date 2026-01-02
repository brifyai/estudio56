import { FlyerStyleKey, FlyerStyleConfig, VideoStyleConfig, AspectRatio, VideoPlanConfig } from './types';

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
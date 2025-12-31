import { FlyerStyleKey, FlyerStyleConfig, AspectRatio } from './types';

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
    english_prompt: "Style: 3D Retail Sale Explosion. Elements: Large 3D text render reading 'OFERTA' or 'LIQUIDACION'. Big 3D percentage symbols (%), megaphones, confetti, shopping bags. Background: Vibrant Red or Yellow bursts. Vibe: High urgency, commercial excitement.",
    visualDescription: "Fondo rojo vibrante, texto 'OFERTA' 3D y explosión de precios.",
    video_motion: "Subject holds a static pose smiling. Confetti falls in the foreground. 3D elements float gently.",
    example: "Tienda 'El Ofertón': Liquidación de Invierno, todo con 50% de descuento.",
    previewUrl: "https://images.unsplash.com/photo-1572584642822-6f8de0243c93?auto=format&fit=crop&w=400&q=80" // Shopping bags red
  },
  typo_bold: {
    label: "Solo Texto / Avisos",
    category: "VENTAS",
    tags: ["Tipografía", "Limpio", "Info"],
    english_prompt: "Style: Swiss International Typographic Style. Composition: Text-heavy layout. RENDER GIANT TEXT keywords like 'AVISO', 'INFO', or 'ATENCION'. Bold giant fonts. Background: Abstract gradients or solid vibrant color. No photo subjects. Vibe: Urgent, clear, modern.",
    visualDescription: "Tipografía gigante con palabras clave 'AVISO' o 'INFO'.",
    video_motion: "Kinetic typography animation, words scaling up gently, background colors shifting in a loop.",
    example: "Aviso Económico: SE ARRIENDA / Dpto Estudio Centro, Gastos Comunes Incluidos.",
    previewUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80" // Abstract typo art
  },
  auto_metallic: {
    label: "Automotriz / Taller",
    category: "VENTAS",
    tags: ["Metal", "Velocidad", "Oscuro"],
    english_prompt: "Style: Automotive Metallic. Texture: Carbon fiber and brushed steel. Elements: Neon Signage reading 'TALLER' or 'MECANICA'. Sparks, tire smoke, speed motion blur, mechanical parts gear. Lighting: Cold industrial light + Orange flares. Vibe: Powerful, fast.",
    visualDescription: "Metal cepillado, letreros neón 'TALLER' y luces de velocidad.",
    video_motion: "Low-angle camera, steady, with sparks flying and smoke moving. Car is stationary or wheels spinning in place.",
    example: "Taller 'Velocidad Total': Cambio de Aceite + Revisión de Frenos Gratis.",
    previewUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=400&q=80" // Dark car detail
  },
  gastronomy: {
    label: "Gastronomía / Sushi",
    category: "VENTAS",
    tags: ["Comida", "Detalle", "Cálido"],
    english_prompt: "Style: High-end Food Porn photography. Elements: Chalkboard or wooden sign reading 'MENU' or 'RICO'. Flying ingredients, steam, water droplets, macro details. Texture: Rustic wood or dark slate stone background. Lighting: Warm, appetizing golden hour light.",
    visualDescription: "Pizarra con 'MENU', texturas oscuras e iluminación cálida.",
    video_motion: "Cinematic Macro (extreme close-up) with minimal movement, steam rising softly.",
    example: "Sanguchería 'El Guatón': Churrasco Italiano XL + Schop Artesanal a $8.990.",
    previewUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80" // Sushi dark background
  },

  // --- CORPORATIVO & SERIO ---
  corporate: {
    label: "Corporativo / Inmobiliaria",
    category: "CORPORATIVO",
    tags: ["Azul", "Oficina", "Serio"],
    english_prompt: "Style: Corporate minimalist, Swiss design grid. Elements: Text overlay reading 'EXCLUSIVO' or 'PROYECTO'. Geometric overlays, glass reflections, city skylines. Lighting: Clean, cool white studio light. Palette: Trustworthy Blue, Grey, and White.",
    visualDescription: "Texto 'EXCLUSIVO' sobre arquitectura moderna de cristal.",
    video_motion: "Extremely slow parallax slide. The person is anchored and static. Glass reflections move on the windows.",
    example: "Inmobiliaria 'Los Andes': Últimas unidades en Las Condes, entrega inmediata.",
    previewUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80" // Modern office building
  },
  medical_clean: {
    label: "Médico / Clínica",
    category: "CORPORATIVO",
    tags: ["Blanco", "Salud", "Limpio"],
    english_prompt: "Style: Sterile Medical Design. Palette: Pure White and Light Cyan. Elements: Glass signage reading 'SALUD' or 'CLINICA'. DNA strands, microscopic abstract shapes, clean glass surfaces. Lighting: Bright, shadowless clinical light. Vibe: Professional, sanitary.",
    visualDescription: "Letrero 'SALUD' o 'CLINICA', blanco impecable y cian.",
    video_motion: "Clean mechanical camera slide (Slider shot) over static medical equipment.",
    example: "Centro Dental 'Sonrisas': Ortodoncia Invisible, evaluación inicial sin costo.",
    previewUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80" // Clean hospital corridor
  },
  tech_saas: {
    label: "Tecnología / Cripto",
    category: "CORPORATIVO",
    tags: ["Tech", "Futuro", "Datos"],
    english_prompt: "Style: Abstract High-Tech. Elements: Holographic text reading 'DATA' or 'FUTURO'. Network nodes connecting, floating 3D isometric shapes, data visualization waves. Palette: Deep Royal Blue and glowing dots. Vibe: Futuristic, smart.",
    visualDescription: "Texto holográfico 'DATA', redes y azul profundo.",
    video_motion: "Camera glides through static data streams. Glowing nodes pulse. No character movement required.",
    example: "StartUp 'DataChile': Diplomado en Inteligencia Artificial y Python.",
    previewUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80" // Tech chip
  },
  edu_sketch: {
    label: "Educación / Clases",
    category: "CORPORATIVO",
    tags: ["Dibujo", "Colegio", "Verde"],
    english_prompt: "Style: Education & Sketch. Background: Green Chalkboard. Elements: Chalk writing reading 'CLASES' or 'APRENDE'. White chalk hand-drawn doodles (formulas, lightbulbs, pencils) mixed with realistic photos. Vibe: Academic, smart, creative.",
    visualDescription: "Pizarra verde con texto 'CLASES' escrito en tiza.",
    video_motion: "Stop-motion animation style (low framerate), chalk drawings appearing line by line.",
    example: "Preuniversitario 'Nacional': Matricúlate ahora para la PAES 2025.",
    previewUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80" // Chalkboard
  },
  political_community: {
    label: "Candidato / Municipal",
    category: "CORPORATIVO",
    tags: ["Política", "Vecinos", "Confianza"],
    english_prompt: "Style: Modern Political Campaign. Elements: Banner text reading 'VOTA' or 'TU VOZ'. Clean curves, subtle Chilean flag colors (Red, Blue, White) as accents. Background: Blurred happy community park or neighborhood. Vibe: Trustworthy, optimistic, leadership.",
    visualDescription: "Banner con 'VOTA' o 'TU VOZ', colores patrios sutiles.",
    video_motion: "Steady confident push-in (Zoom) on the subject. Subject is smiling and nodding, not walking.",
    example: "Vota María González: Tu voz en el Concejo Municipal de Maipú.",
    previewUrl: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=400&q=80" // People meeting
  },

  // --- LIFESTYLE & VIBRA ---
  aesthetic_min: {
    label: "Aesthetic / Belleza",
    category: "LIFESTYLE",
    tags: ["Beige", "Suave", "Insta"],
    english_prompt: "Style: Instagram Aesthetic ('Clean Girl' vibe). Elements: Minimalist serif text reading 'GLOW' or 'BEAUTY'. Soft shadows of plants, organic shapes, cloth textures. Palette: Beige, Cream, Sage Green. Lighting: Soft natural window light.",
    visualDescription: "Texto minimalista 'GLOW', sombras suaves y tonos beige.",
    video_motion: "Very gentle handheld movement (breathing camera), shadows of leaves swaying softly on the wall.",
    example: "Boutique 'Amapola': Nueva colección de lino Otoño-Invierno.",
    previewUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80" // Beige clothes
  },
  wellness_zen: {
    label: "Spa / Yoga",
    category: "LIFESTYLE",
    tags: ["Relax", "Naturaleza", "Paz"],
    english_prompt: "Style: Zen Wellness. Elements: Stones with engraved text 'PAZ' or 'RELAX'. Stacked hot stones, bamboo, water ripples, orchid flowers. Lighting: Soft candle light, warm and relaxing. Palette: Earthy Browns, Greens, and Soft White.",
    visualDescription: "Piedras con grabado 'RELAX' y ambiente Zen.",
    video_motion: "Tripod shot (Static), water dripping in super slow motion, candle flame flickering gently.",
    example: "Centro 'Alma Zen': Masaje descontracturante y piedras calientes 2x1.",
    previewUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80" // Spa stones
  },
  summer_beach: {
    label: "Verano / Piscina",
    category: "LIFESTYLE",
    tags: ["Sol", "Agua", "Turismo"],
    english_prompt: "Style: Summer Party Flyer. Elements: Bright text overlay reading 'VERANO' or 'SOL'. Clear blue water splashes, bright sun lens flares, refreshing cocktails. Palette: Teal and Orange. Vibe: Refreshing, sunny, energetic. NO palm trees unless specified as coastal.",
    visualDescription: "Texto 'VERANO' brillante, agua turquesa y sol.",
    video_motion: "High shutter speed freeze frame of water splashing. Sunlight flares moving across the lens.",
    example: "Sunset Beach Club: Fiesta de Espuma en Reñaca, Sector 5.",
    previewUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=400&q=80" // Pool splash
  },
  eco_organic: {
    label: "Ecológico / Feria",
    category: "LIFESTYLE",
    tags: ["Reciclado", "Verde", "Natural"],
    english_prompt: "Style: Eco-friendly Organic design. Texture: Recycled paper kraft texture. Elements: Stamped ink text reading 'NATURAL' or 'BIO'. Fresh green leaves, hand-drawn recycling icons. Lighting: Soft, bright natural daylight. Palette: Earth tones and Green.",
    visualDescription: "Papel Kraft con sello 'NATURAL', hojas verdes frescas.",
    video_motion: "Natural breeze blowing leaves gently, dappled sunlight shifting on the surface.",
    example: "Emporio 'Raíces': Miel orgánica, frutos secos y mermeladas del sur.",
    previewUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80" // Green leaves
  },
  sport_gritty: {
    label: "Deporte / Gym",
    category: "LIFESTYLE",
    tags: ["Fuerza", "Sudor", "Intenso"],
    english_prompt: "Style: High-impact Sports poster. Elements: Spray paint text 'NO PAIN' or 'POWER'. Texture: Grunge concrete, metal mesh. Lighting: Dramatic, high contrast, sweaty skin texture (HDR style). Palette: Aggressive Red/Black or Yellow/Black.",
    visualDescription: "Graffiti 'POWER', metal oscuro y alto contraste.",
    video_motion: "Super slow motion. Subject is tensed and breathing heavily (heaving chest). Sweat drips. No running.",
    example: "Gimnasio 'Titanium': Plan Anual 50% OFF, sin matrícula de incorporación.",
    previewUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80" // Gym dark
  },

  // --- NOCHE & ENTRETENCIÓN ---
  urban_night: {
    label: "Discoteca / Neón",
    category: "NOCHE",
    tags: ["Fiesta", "Neón", "Urbano"],
    english_prompt: "Style: Cyberpunk nightlife. Elements: Bright Neon Sign reading 'FIESTA' or 'ABIERTO'. Neon lasers, smoke, 3D abstract shapes floating. Lighting: Dark background with vibrant Purple/Cyan rim lights.",
    visualDescription: "Letrero neón 'FIESTA', láseres y humo.",
    video_motion: "Subject stands cool and static. Neon lights trail rapidly around them. Smoke swirls.",
    example: "Club 'La Casona': Sábado de Reggaeton Old School, ellas entran gratis hasta la 1 AM.",
    previewUrl: "https://images.unsplash.com/photo-1566421990479-d3e80064506f?auto=format&fit=crop&w=400&q=80" // UPDATED: Concert/Club lights
  },
  luxury_gold: {
    label: "Gala VIP / Año Nuevo",
    category: "NOCHE",
    tags: ["Dorado", "Elegante", "Premium"],
    english_prompt: "Style: Luxury Royal aesthetic. Elements: Elegant serif gold text reading 'GALA' or 'VIP'. Gold foil textures, sparkles, light rays, silk fabric, confetti. Palette: Black and Gold or White and Gold.",
    visualDescription: "Texto dorado 'VIP', partículas y elegancia.",
    video_motion: "Smooth gliding camera (Gimbal shot), gold particles floating in the air. People are talking but standing still.",
    example: "Evento 'Gala Vino': Degustación Premium en Hotel W, reserva tu mesa.",
    previewUrl: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=400&q=80" // Champagne
  },
  realestate_night: {
    label: "Lujo Nocturno",
    category: "NOCHE",
    tags: ["Exclusivo", "Arquitectura", "Noche"],
    english_prompt: "Style: Luxury Night Real Estate. Subject: Modern architecture illuminated at dusk. Elements: Floating text label 'EN VENTA'. Glowing swimming pool water. Palette: Dark Midnight Blue, Gold, and warm interior orange lights. Vibe: Exclusive, expensive.",
    visualDescription: "Etiqueta 'EN VENTA' sobre casa de lujo nocturna.",
    video_motion: "Cinematic Drone hover (Aerial shot), slow parallax movement.",
    example: "Inmobiliaria 'Horizonte': Penthouse exclusivo con vista al mar y piscina privada.",
    previewUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=80" // Modern house night
  },
  gamer_stream: {
    label: "Gamer / Twitch",
    category: "NOCHE",
    tags: ["Juegos", "Digital", "Glitch"],
    english_prompt: "Style: Esports Tournament Poster. Elements: Glitch text 'LIVE' or 'WIN'. Glitch art effects, aggressive angular shapes, neon green or purple lightning. Character: 3D render game character style. Vibe: Competitive, digital.",
    visualDescription: "Texto 'LIVE' con efecto glitch y rayos neón.",
    video_motion: "Character holds a power pose. Digital Glitch transitions overlay the screen. Neon electricity pulsing.",
    example: "Ciber 'Matrix': Torneo de Valorant y League of Legends, premios en efectivo.",
    previewUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80" // Gaming headset
  },
  indie_grunge: {
    label: "Tocatas / Rock",
    category: "NOCHE",
    tags: ["Grunge", "Música", "Papel"],
    english_prompt: "Style: Grunge Gig Poster. Elements: Stencil spray paint text 'EN VIVO' or 'ROCK'. Texture: Distressed brick wall, spray paint effects, torn paper edges. Palette: Black, Red, and dirty White. Vibe: Urban, rebellious, artistic.",
    visualDescription: "Stencil 'EN VIVO' sobre pared grunge.",
    video_motion: "Vintage 8mm film shutter stutter, static camera with film grain flickering.",
    example: "Bar 'El Hueso': Tocata en vivo este viernes, Bandas Tributo Rock Latino.",
    previewUrl: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=400&q=80" // Concert light
  },

  // --- EVENTOS & ESPECIALES ---
  kids_fun: {
    label: "Infantil / Cumpleaños",
    category: "EVENTOS",
    tags: ["Niños", "Color", "3D"],
    english_prompt: "Style: 3D Cartoon Party. Aesthetic: Pixar-style glossy rendering. Elements: 3D Bubble text reading 'FELIZ' or 'FIESTA'. Balloons, confetti, soft rounded clouds. Palette: Bright Primary Colors (Red, Yellow, Blue). Vibe: Playful, safe, happy.",
    visualDescription: "Texto 'FELIZ' tipo globo 3D y colores vivos.",
    video_motion: "Bouncy animation physics, balloons floating upwards, confetti popping. Characters jump in place.",
    example: "Cumpleaños 'Mundo Feliz': Arriendo de juegos inflables, pintacaritas y magia.",
    previewUrl: "https://images.unsplash.com/photo-1502086223501-681a6bc64936?auto=format&fit=crop&w=400&q=80" // UPDATED: Colorful balloons
  },
  worship_sky: {
    label: "Iglesia / Espiritual",
    category: "EVENTOS",
    tags: ["Cielo", "Paz", "Luz"],
    english_prompt: "Style: Worship Event Flyer. Elements: Elegant serif text 'FE' or 'ESPERANZA'. Dramatic clouds, 'God rays' (volumetric light beams), doves, clean serif typography space. Palette: White, Gold, and Sky Blue. Vibe: Heavenly, peaceful, majestic.",
    visualDescription: "Texto 'FE' entre nubes y rayos de luz.",
    video_motion: "Slow cinematic tilt up towards the sky, clouds drifting majestically.",
    example: "Iglesia 'Vida Nueva': Gran Vigilia de Jóvenes este Sábado a las 20:00 hrs.",
    previewUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=400&q=80" // UPDATED: Sun rays/Sky
  },
  seasonal_holiday: {
    label: "Navidad / Festivo",
    category: "EVENTOS",
    tags: ["Regalos", "Mágico", "Brillo"],
    english_prompt: "Style: 3D Festive Holiday. Elements: Golden text reading 'FELICIDADES'. High-gloss 3D render of seasonal icons (Gift boxes, Ornaments, Hearts). Texture: Silk ribbons, snow or confetti. Lighting: Magical, sparkly, celebration.",
    visualDescription: "Texto 'FELICIDADES' dorado y ambiente festivo.",
    video_motion: "Magical atmosphere, camera orbiting slowly around centerpiece, snow/sparkles falling gently.",
    example: "Tienda 'Regalos Mágicos': Venta especial de Navidad, todo con 30% descuento.",
    previewUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=400&q=80" // Christmas
  },
  art_double_exp: {
    label: "Artístico / Teatro",
    category: "EVENTOS",
    tags: ["Arte", "Surreal", "Teatro"],
    english_prompt: "Style: Artistic Double Exposure. Composition: Silhouette of a human profile blended seamlessly with a dramatic landscape (forest or city). Elements: Floating artistic text 'ARTE' or 'TEATRO'. Vibe: Surreal, emotional, poetic, minimalist background.",
    visualDescription: "Texto 'ARTE' flotando en doble exposición surrealista.",
    video_motion: "Slow surreal morphing, fluid ink spreading in water, double exposure layers moving at different speeds.",
    example: "Teatro Municipal: Obra 'Sueños de una Noche de Verano', estreno Viernes.",
    previewUrl: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=400&q=80" // Abstract art
  },
  retro_vintage: {
    label: "Retro / 90s",
    category: "EVENTOS",
    tags: ["Vintage", "Grunge", "90s"],
    english_prompt: "Style: 90s Collage Art or Vintage Poster. Elements: Cutout magazine letters reading 'COOL' or 'RETRO'. Ripped paper textures, halftone dots, noise grain. Palette: Saturated primary colors or faded sepia. Vibe: Nostalgic, artistic.",
    visualDescription: "Letras de revista 'COOL' y collage grunge.",
    video_motion: "Vintage VHS tracking error effect, film grain flickering, frame stuttering.",
    example: "Fonda 'La Chueca': Terremotos, anticuchos y la mejor cumbia este 18.",
    previewUrl: "https://images.unsplash.com/photo-1550259114-ad7188f0a967?auto=format&fit=crop&w=400&q=80" // Cassette tape
  },
  podcast_mic: {
    label: "Podcast / Entrevista",
    category: "EVENTOS",
    tags: ["Audio", "Studio", "Tech"],
    english_prompt: "Style: Podcast Media. Subject: Professional Studio Microphone. Elements: Neon 'ON AIR' sign. Colorful digital soundwaves, blurred studio background. Vibe: Conversational, modern media.",
    visualDescription: "Letrero 'ON AIR' y micrófono de estudio.",
    video_motion: "Slow circular dolly track around the microphone, digital audio waveform bars pulsing to the rhythm.",
    example: "Radio 'Futuro': Entrevista exclusiva a emprendedores locales sobre innovación.",
    previewUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80" // Microphone
  }
};
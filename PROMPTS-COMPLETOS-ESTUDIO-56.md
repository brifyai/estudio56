# 📋 INFORME COMPLETO DE PROMPTS - ESTUDIO 56

## Tabla de Contenidos
1. [Prompts de Imagen (Gemini Image API)](#1-prompts-de-imagen-gemini-image-api)
2. [Prompts de Video (Gemini VEO API)](#2-prompts-de-video-gemini-veo-api)
3. [System Instructions](#3-system-instructions)
4. [Contextos y Configuraciones](#4-contextos-y-configuraciones)
5. [Plantillas por Industria](#5-plantillas-por-industria)

---

## 1. PROMPTS DE IMAGEN (Gemini Image API)

### Modelos Utilizados
- **Draft**: `gemini-2.5-flash-image` (más rápido, menor costo)
- **HD**: `gemini-3-pro-image-preview` (mayor calidad)

### MASTER STYLE (Base para todas las imágenes)
```
Professional social media flyer design. Aesthetic: GraphicRiver bestseller, glossy finish, ultra-detailed, commercial photography, 8k resolution, Unreal Engine 5 render style.
```

### Estructura del Prompt Unificado
```
[MASTER_STYLE]
[COMPOSITION_PROMPT]
[CHILEAN_BASE_CONTEXT]
[BACKGROUND_CONTEXT (Studio/Outdoor)]
[VISUAL_STYLE_SPECS]
[SUBJECT_DESCRIPTION]
[PRODUCT_PROMPT_SUFFIX]
[STRICT PROHIBITION - ZERO TOLERANCE]
[VISUAL REQUIREMENTS]
```

---

### ESTILOS DE IMAGEN (FLYER_STYLES)

#### 🔵 VENTAS & COMERCIAL

##### retail_sale - "Ofertas / Liquidación"
```
Subject: [INSERT SUBJECT HERE]. Style: High-End 3D Commercial Art. Tech: Cinema 4D, Octane Render, Raytracing, 8k resolution. Composition: Dynamic zero-gravity explosion, floating 3D percentage signs (%), confetti. Lighting: Studio softbox lighting, glossy reflections, vibrant rim lights. Vibe: Urgent, energetic, premium advertising.
```
**Video Motion**: "Subject holds a static pose smiling. Confetti falls in the foreground. 3D elements float gently."

---

##### typo_bold - "Solo Texto / Avisos"
```
Subject: [NO SUBJECT - Abstract Background only]. Style: Swiss International Typographic Style Background. Visuals: Abstract smooth gradients, bold geometric shapes, or solid vibrant color. Purpose: Created specifically for heavy text overlays. Tech: Vector art style, ultra-clean, 8k.
```
**Video Motion**: "Kinetic typography animation, words scaling up gently, background colors shifting in a loop."

---

##### auto_metallic - "Automotriz / Taller"
```
Subject: [INSERT SUBJECT HERE]. Style: Automotive Commercial CGI. Render: Unreal Engine 5, Raytraced reflections. Texture: Carbon fiber, brushed aluminum, metallic paint flakes. Effects: Motion blur, sparks, tire smoke. Vibe: Powerful, fast, industrial.
```
**Video Motion**: "Low-angle camera, steady, with sparks flying and smoke moving. Car is stationary or wheels spinning in place."

---

##### gastronomy - "Gastronomía / Sushi"
```
Subject: [INSERT SUBJECT HERE]. Style: Michelin-Star Food Photography / Food Porn. Camera: 100mm Macro Lens. Lighting: Backlit with warm golden light to enhance steam and texture. Details: Visible water droplets on fresh ingredients, subsurface scattering on food, smoke/steam rising. Texture: Rustic wood or dark slate background.
```
**Video Motion**: "Cinematic Macro (extreme close-up) with minimal movement, steam rising softly."

---

#### 🟢 CORPORATIVO & SERIO

##### corporate - "Corporativo / Inmobiliaria"
```
Subject: [INSERT SUBJECT HERE]. Style: Premium Corporate Editorial (Forbes Magazine style). Camera: Canon EOS R5, 50mm Prime Lens, f/1.8 aperture. Background: Blurred modern glass architecture, city bokeh, clean geometric lines. Lighting: Cinematic office lighting, cool blue rim light, clean white key light. Vibe: Trustworthy, visionary, successful.
```
**Video Motion**: "Extremely slow parallax slide. The person is anchored and static. Glass reflections move on the windows."

---

##### medical_clean - "Médico / Clínica"
```
Subject: [INSERT SUBJECT HERE]. Style: Sterile Medical Design. Palette: Pure White and Light Cyan. Lighting: Bright, shadowless clinical light. Elements: Clean glass surfaces, abstract DNA or cross symbols subtly in background. Vibe: Professional, sanitary, safe, advanced technology.
```
**Video Motion**: "Clean mechanical camera slide (Slider shot) over static medical equipment."

---

##### tech_saas - "Tecnología / Cripto"
```
Subject: [INSERT SUBJECT HERE]. Style: Abstract High-Tech Data Visualization. Elements: Network nodes, floating isometric 3D cubes, fiber optics. Palette: Deep Royal Blue and glowing cyan dots. Tech: 3D render, glowing bloom effects, futuristic.
```
**Video Motion**: "Camera glides through static data streams. Glowing nodes pulse. No character movement required."

---

##### edu_sketch - "Educación / Clases"
```
Subject: [INSERT SUBJECT HERE]. Style: Education Mixed Media (Photo + Sketch). Background: Green Chalkboard or Notebook paper texture. Elements: White chalk hand-drawn doodles (formulas, arrows) overlaid on realistic objects. Vibe: Smart, creative, academic growth.
```
**Video Motion**: "Stop-motion animation style (low framerate), chalk drawings appearing line by line."

---

##### political_community - "Candidato / Municipal"
```
Subject: [INSERT SUBJECT HERE]. Style: Modern Political Campaign Photography. Camera: 85mm Portrait Lens (flattering). Lighting: Bright, optimistic daylight, no harsh shadows. Background: Blurred sunny park or suburban neighborhood. Vibe: Trustworthy, approachable, leadership.
```
**Video Motion**: "Steady confident push-in (Zoom) on the subject. Subject is smiling and nodding, not walking."

---

#### 🟡 LIFESTYLE & VIBRA

##### aesthetic_min - "Aesthetic / Belleza"
```
Subject: [INSERT SUBJECT HERE]. Style: Minimalist Product Photography (Instagram 'Clean Girl' Trend). Lighting: Soft-focus natural window light, 'Gobo' shadows (shadows of leaves casting on the scene). Palette: Monochromatic Beige, Cream, White, Sage Green. Texture: Organic linen, matte stone.
```
**Video Motion**: "Very gentle handheld movement (breathing camera), shadows of leaves swaying softly on the wall."

---

##### wellness_zen - "Spa / Yoga"
```
Subject: [INSERT SUBJECT HERE]. Style: Zen Wellness Photography. Lighting: Soft candle light, dim and relaxing. Elements: Water ripples, bamboo, steam. Palette: Earthy Browns, Greens, and Soft White. Vibe: Calm, balance, spiritual, silence.
```
**Video Motion**: "Tripod shot (Static), water dripping in super slow motion, candle flame flickering gently."

---

##### pilates - "Pilates / Core"
```
Subject: [INSERT SUBJECT HERE]. Style: Pilates Studio Photography. Lighting: Soft, even studio lighting with subtle warm tones. Elements: Pilates reformer or mat, clean studio environment, smooth textures. Palette: Soft Sage Green, Cream, and Light Gray. Vibe: Strength, control, balance, mindful movement.
```
**Video Motion**: "Slow, controlled camera movement, subject performing a static pilates pose with controlled breathing."

---

##### summer_beach - "Verano / Piscina"
```
Subject: [INSERT SUBJECT HERE]. Style: Luxury Travel Photography. Camera: Polarized lens filter, high shutter speed to freeze water. Lighting: Bright natural sunlight, harsh summer shadows, beautiful lens flaring. Colors: Vibrant Teal (water) and Orange (sun warmth). Details: Crystal clear water refraction, wet surfaces.
```
**Video Motion**: "High shutter speed freeze frame of water splashing. Sunlight flares moving across the lens."

---

##### eco_organic - "Ecológico / Feria"
```
Subject: [INSERT SUBJECT HERE]. Style: Eco-Friendly Organic Design. Background: Recycled Kraft paper texture or blurred nature. Elements: Fresh green leaves foreground, hand-drawn recycling doodles. Lighting: Soft, bright, shadowless daylight. Vibe: Fresh, clean, sustainable.
```
**Video Motion**: "Natural breeze blowing leaves gently, dappled sunlight shifting on the surface."

---

##### sport_gritty - "Deporte / Gym"
```
Subject: [INSERT SUBJECT HERE]. Style: Gritty Sports Commercial Photography (Nike Campaign style). Lighting: 'Rembrandt Lighting' (dramatic shadows), high contrast, harsh rim light highlighting sweat and muscle definition. Texture: Skin pores visible, atmospheric dust/chalk in the air. Background: Dark concrete gym or stadium lights.
```
**Video Motion**: "Super slow motion. Subject is tensed and breathing heavily (heaving chest). Sweat drips. No running."

---

#### 🟣 NOCHE & ENTRETENCIÓN

##### urban_night - "Discoteca / Neón"
```
Subject: [INSERT SUBJECT HERE]. Style: Cyberpunk Nightlife / Concert Photography. Tech: Volumetric fog, Laser lights, Particle effects. Palette: Neon Purple, Cyan, and Magenta against deep blacks. Lighting: Strong backlighting (Silhouette effect), lens flares, atmospheric haze. Vibe: Electric, high energy, immersive.
```
**Video Motion**: "Subject stands cool and static. Neon lights trail rapidly around them. Smoke swirls."

---

##### luxury_gold - "Gala VIP / Año Nuevo"
```
Subject: [INSERT SUBJECT HERE]. Style: Luxury Royal Aesthetic. Materials: Gold foil, black silk, marble, glitter. Lighting: Soft, warm, sparkling bokeh. Palette: Black and Gold. Vibe: Exclusive, expensive, celebration.
```
**Video Motion**: "Smooth gliding camera (Gimbal shot), gold particles floating in the air. People are talking but standing still."

---

##### realestate_night - "Lujo Nocturno"
```
Subject: [INSERT SUBJECT HERE]. Style: Luxury Architectural Night Photography. Lighting: Long exposure, 'Blue Hour' sky, warm tungsten interior lights glowing. Reflections: Perfect reflection in swimming pool or glass facade. Vibe: Sophisticated, expensive, serene.
```
**Video Motion**: "Cinematic Drone hover (Aerial shot), slow parallax movement."

---

##### gamer_stream - "Gamer / Twitch"
```
Subject: [INSERT SUBJECT HERE]. Style: 3D Esports Tournament Art. Effects: Glitch art, digital distortion, speed lines. Palette: Neon Green (Razer style) or Twitch Purple. Tech: Unreal Engine 5 render, high sharpness, aggressive angles. Vibe: Competitive, digital, aggressive.
```
**Video Motion**: "Character holds a power pose. Digital Glitch transitions overlay the screen. Neon electricity pulsing."

---

##### indie_grunge - "Tocatas / Rock"
```
Subject: [INSERT SUBJECT HERE]. Style: Underground Gig Poster. Texture: Distressed brick wall, spray paint stencils, dirty concrete. Palette: Black, Red, and dirty White. Vibe: Rebellious, raw, artistic, lo-fi.
```
**Video Motion**: "Vintage 8mm film shutter stutter, static camera with film grain flickering."

---

#### 🟠 EVENTOS & ESPECIALES

##### kids_fun - "Infantil / Cumpleaños"
```
Subject: [INSERT SUBJECT HERE]. Style: 3D Pixar/Disney Animation Style. Render: Glossy plastic textures, soft rubber. Palette: Bright Primary Colors (Red, Blue, Yellow). Lighting: Soft, rounded, high-key lighting. Vibe: Playful, safe, happy, magical.
```
**Video Motion**: "Bouncy animation physics, balloons floating upwards, confetti popping. Characters jump in place."

---

##### worship_sky - "Iglesia / Espiritual"
```
Subject: [INSERT SUBJECT HERE]. Style: Majestic & Ethereal Photography. Lighting: 'God Rays' (Volumetric light beams) descending from clouds/sky. Palette: Gold, White, and Sky Blue. Atmosphere: Peaceful, divine, grand scale, minimal dust particles in light. Vibe: Hope, faith, solemnity.
```
**Video Motion**: "Slow cinematic tilt up towards the sky, clouds drifting majestically."

---

##### seasonal_holiday - "Navidad / Festivo"
```
Subject: [INSERT SUBJECT HERE]. Style: 3D Festive Holiday Render. Materials: High-gloss plastic, silk ribbons, glitter, snow texture. Lighting: Sparkling, magical, warm fairy lights. Render: 8k, Octane render, highly detailed. Vibe: Celebration, joy, abundance.
```
**Video Motion**: "Magical atmosphere, camera orbiting slowly around centerpiece, snow/sparkles falling gently."

---

##### art_double_exp - "Artístico / Teatro"
```
Subject: [INSERT SUBJECT HERE]. Style: Artistic Double Exposure. Composition: Seamless blend between silhouette and nature landscape. Background: Minimalist solid color or subtle gradient. Vibe: Surreal, poetic, psychological, dreamy.
```
**Video Motion**: "Slow surreal morphing, fluid ink spreading in water, double exposure layers moving at different speeds."

---

##### retro_vintage - "Retro / 90s"
```
Subject: [INSERT SUBJECT HERE]. Style: 90s Grunge Collage Art / Mixed Media. Effects: Halftone dot pattern (comic style), paper texture overlay, digital noise/grain, ripped paper edges. Palette: Acid Green, Hot Pink, or Faded Polaroid tones. Composition: Chaotic but balanced.
```
**Video Motion**: "Vintage VHS tracking error effect, film grain flickering, frame stuttering."

---

##### market_handwritten - "Feria / Mercado"
```
Subject: [INSERT SUBJECT HERE]. Style: Traditional Chilean Market ('Feria Libre') Aesthetic. Background: Colorful cardboard signs (neon yellow, pink, green) with handwritten prices written in thick black marker (plumón). Texture: Slightly worn cardboard, rustic wooden crates, fruit baskets. Lighting: Bright outdoor sunlight, harsh shadows typical of open-air markets. Vibe: Popular, cheap, fresh, urgent. 'Bueno, bonito y barato'. NO professional graphics. NO clean studio backgrounds. Authentic Chilean market atmosphere.
```
**Video Motion**: "Slow pan across market stalls, vendors arranging products, sunlight filtering through awnings. Authentic market movement."

---

##### podcast_mic - "Podcast / Entrevista"
```
Subject: [INSERT SUBJECT HERE]. Style: Modern Broadcast Studio Photography. Camera: Shallow depth of field (blurred background), sharp focus on subject. Background: Bokeh studio lights, acoustic foam texture. Elements: Colorful digital soundwaves overlay. Vibe: Professional, communicative, on-air.
```
**Video Motion**: "Slow circular dolly track around the microphone, digital audio waveform bars pulsing to the rhythm."

---

## 2. PROMPTS DE VIDEO (Gemini VEO API)

### Modelos Utilizados
- **Draft**: `veo-3.1-fast-generate-preview` (720p, rápido)
- **HD**: `veo-3.1-generate-preview` (1080p, mayor calidad)

### Estructura del Prompt de Video
```
HIGH FIDELITY PHYSICS. [CINEMATIC/STYLE]. STYLE: [PROMPT_BASE]. MOVEMENT: [MOTION_PROMPT]. CONTEXT: Chile. SUBJECT: [CLEAN_DESCRIPTION] [PRODUCT_SUFFIX] [VIDEO_PHYSICS_GUARDRAIL] [RESTRICTIONS]
```

### VIDEO_PHYSICS_GUARDRAIL
```
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
```

---

### ESTILOS DE VIDEO (VIDEO_STYLES)

| Estilo | Label | Prompt Base | Motion Style |
|--------|-------|-------------|--------------|
| video_retail_sale | Retail / Ofertas | 3D Retail Sale concept. Floating sneakers, tech gadgets, and 3D percentage signs against a red background. Slow motion explosion effect. | Zero gravity explosion, confetti falling, camera push-in |
| video_summer_beach | Verano / Turismo | Luxury infinity pool with a cocktail in the foreground, ocean background, sunny day. | Water rippling, sunlight glimmering, camera dolly forward |
| video_worship_sky | Iglesia / Espiritual | Silhouette of a crowd with hands raised, volumetric light beams descending from clouds. | God rays shimmering, clouds passing, subtle handheld |
| video_corporate | Corporativo / Oficina | Modern glass office building or professional working on a laptop. | Rack focus, city timelapse, professional atmosphere |
| video_urban_night | Discoteca / Neón | DJ silhouette in a dark club with neon lasers and smoke. | Neon strobing, smoke billowing, crowd jumping, camera shake |
| video_gastronomy | Gastronomía / Comida | Gourmet burger with melting cheese and steam. Extreme close-up. | Cheese oozing, steam rising, sauce pouring slow motion |
| video_sport_gritty | Deporte / Gym | Athlete lifting heavy weights, gritty texture, dramatic lighting. | Sweat droplets flying, dust in rim light, muscle tension |
| video_luxury_gold | Lujo / Gala VIP | Champagne glasses toasting, gold foil background, fireworks. | Bubbles rising, fireworks, gold sparkles, elegant parallax |
| video_aesthetic_min | Aesthetic / Belleza | Skincare product on a stone, soft window light with leaf shadows. | Leaf shadows swaying, sunlight shifting, slow zoom out |
| video_retro_vintage | Retro / Vintage 90s | 90s Grunge Collage with cassette tape and neon colors. | Stop-motion jitter, film grain flicker, glitch flashes |
| video_gamer_stream | Gamer / Esports | Cyborg gamer character with glowing neon eyes and keyboard. | Glitch artifacts, neon lightning, eyes pulsating |
| video_eco_organic | Ecológico / Natural | Basket of organic fruits in a nature setting. | Leaves blowing, dappled light, butterfly flying |
| video_indie_grunge | Rock / Indie | Electric guitar amp on a dark stage, dirty texture. | Smoke rolling, shaky cam, dust in spotlight |
| video_political | Política / Comunidad | Candidate walking in a park, smiling at people. | Tracking shot, natural background movement, bright energy |
| video_kids_fun | Infantil / Cumpleaños | 3D Cartoon birthday cake and balloons. | Balloons bobbing, confetti raining, cake spinning |
| video_art_double_exp | Artístico / Doble Exposición | Silhouette of a head filled with a forest landscape. | Fog moving inside silhouette, birds flying, trees swaying |
| video_medical_clean | Médico / Clínico | Doctor in a futuristic clinic, DNA strands in background. | DNA rotating, smooth panning, stable sterile flow |
| video_tech_saas | Tech / AI / Digital | Digital brain made of connecting dots and lines. | Data flowing, brain rotating, light pulses |
| video_typo_bold | Tipografía Pura | Abstract gradient background or geometric shapes. | Liquid gradients morphing, geometric shapes rotating |
| video_realestate_night | Inmobiliaria Nocturna | Luxury mansion with pool at night. Time-lapse of the stars moving across the sky. | Stars time-lapse, pool reflection, interior lights |
| video_auto_metallic | Automotriz / Coche | Sports car wheel close-up, smoke, sparks. | Wheel spinning fast, smoke billowing, sparks flying |
| video_edu_sketch | Educación / Clases | Books on a desk with white chalk doodles overlay. | Chalk drawing itself, dust motes dancing |
| video_wellness_zen | Spa / Zen | Hot stones, bamboo, water surface. A single water drop falling into the pool. | Water drop falling, perfect ripples, candle flickering |
| video_podcast_mic | Podcast / Media | Studio microphone close up, soundwaves. | Soundwaves jumping, ON AIR pulsing, camera orbit |
| video_seasonal_holiday | Festividades / Navidad | Christmas gift boxes or Valentine hearts. | Snow falling, hearts floating, lights twinkling |

---

## 3. SYSTEM INSTRUCTIONS

### 📝 Análisis de URL (analyzeUrlContent)
```
Eres un EXPERTO ANALISTA DE MARKETING para Chile.

Tu tarea es analizar páginas web chilenas y extraer información completa para crear flyers publicitarios.

Responde en formato JSON EXACTO (sin markdown, sin comentarios):
{
  "businessName": "Nombre del negocio",
  "tagline": "Lema o tagline principal del negocio",
  "description": "Descripción detallada del negocio",
  "products": ["producto1", "producto2", "producto3"],
  "services": ["servicio1", "servicio2"],
  "promotions": ["promo1", "promo2"],
  "industry": "Una palabra",
  "visualStyle": "Descripción del estilo visual en inglés",
  "primaryColors": ["color1 hex", "color2 hex"],
  "secondaryColors": ["color1 hex"],
  "atmosphere": "Descripción del ambiente",
  "targetAudience": "A quién va dirigido",
  "keySellingPoints": ["punto1", "punto2", "punto3"],
  "contactInfo": {...},
  "moodKeywords": ["palabra1", "palabra2", "palabra3"]
}

Reglas CRÍTICAS:
- description: Mínimo 50 palabras, máximo 100. En ESPAÑOL.
- industry: Solo una palabra de las listadas.
- Si no encuentras información, usa "other" para industry.
- Todo en español excepto visualStyle (inglés para la IA).
- NO generes información inventada.
```

---

### 🎨 Mejora de Prompt (enhancePrompt)
```
You are an expert AI Prompt Engineer for image generation.
Your task is to take a raw Spanish description of a business service or product and translate the VISUAL DESCRIPTION into English.

IMPORTANT RULES:
1. Translate visual elements (lighting, composition, objects) to English.
2. PRESERVE LOCATION NAMES (e.g., "Santiago", "Torres del Paine").
3. TEXT PRESERVATION: If user wants specific text, keep it in SPANISH inside single quotes.
4. Focus on physical details based on style: [STYLE_LABEL].
5. Return ONLY the enhanced prompt.
```

---

### 📱 Resumen en Español (enhancePrompt - Spanish)
```
Eres un asistente que resume descripciones visuales de negocios en español simple.
Tu tarea es crear un resumen BREVE y CLARO en español de la descripción del negocio.

Reglas:
1. Máximo 50 palabras
2. Usa español simple y directo
3. Describe el tipo de negocio, productos/servicios y ambiente
4. No incluyas instrucciones técnicas
5. Solo el resumen, sin explicaciones
```

---

### ✏️ Refinamiento de Descripción (refineDescription)
```
You are an expert image prompt editor.
Rewrite the English description to incorporate the user's Spanish instruction. Return ONLY the new description.
```

---

### 🔍 Análisis de Producto (analyzeProductImage)
```
Analyze this image and describe the MAIN PRODUCT or SUBJECT in detail.

Focus on:
- What is the product/object (type, category)
- Colors (exact colors, not just "colored")
- Materials (wood, metal, fabric, plastic, etc.)
- Shape and form (round, rectangular, organic, etc.)
- Size proportions
- Key distinguishing features
- Texture details

IGNORE the background if it's messy or cluttered - focus on the product itself.

Format your response as a detailed English description suitable for AI image generation.
```

---

### 💬 Texto Persuasivo (generatePersuasiveText)
```
Eres un experto en marketing para Chile.
Genera texto específico para la industria: [INDUSTRY]
Reglas:
- Texto MUY CORTO y específico al negocio
- Solo el texto, sin explicaciones
- Español chileno auténtico
```

---

## 4. CONTEXTOS Y CONFIGURACIONES

### CHILEAN_BASE_CONTEXT
```
LOCALE SETTING: Chile (South America).
1. FACES/PEOPLE: Subjects must have realistic Chilean phenotypes (mixed heritage). Clothing: Modern urban western fashion suitable for temperate/cold weather (jackets, hoodies, jeans). No traditional folk costumes unless specified.
2. TEXT & LANGUAGE: ANY visible text in the image (signs, neon, chalkboards, pricing) MUST BE IN SPANISH (Chilean format).
   - STRICTLY NO ENGLISH TEXT (No "Sale", "Open", "Shop").
   - USE: "Oferta", "Abierto", "Liquidación", "Rico".
   - CURRENCY: Use Chilean Peso format with dot separator (e.g. "$1.000", "$5.990").
```

### CHILEAN_OUTDOOR_CONTEXT
```
GEOGRAPHIC SETTING: CHILE.
The landscape must be visually accurate to the Chilean territory stated in the subject.
1. IF COAST/BEACH: Pacific Ocean (Dark blue/cold water, energetic waves, grey or yellow coarse sand, rocky cliffs).
   - STRICTLY FORBIDDEN: Turquoise Caribbean water, white powder sand, coconut palm trees.
2. IF LAKE/SOUTH: Deep blue water, surrounding volcanoes, green pine/native forests (Bosque Valdiviano), rainy or cloudy atmosphere.
3. IF CENTRAL ZONE (Santiago/Rapel): Mediterranean climate, dry brownish hills, low bushes, urban trees, modern highways.
4. IF MOUNTAINS: The Andes (High, rocky, sharp peaks, snow-capped).
5. GENERAL BANS:
   - NO "Mexican" sepia filters or desert pueblo stereotypes.
   - NO Tropical Jungles.
   - NO Peruvian/Bolivian Altiplano aesthetics unless specifically asked.
```

### CHILEAN_STUDIO_CONTEXT
```
BACKGROUND ENVIRONMENT:
- STUDIO / INDOOR SETTING.
- STRICTLY FORBIDDEN: Landscapes, Mountains, Skies, Outdoor scenery.
- Focus on the product/subject with the specific style background (Solid color, texture, gradient, interior).
```

### CHILEAN_CONTEXT_LITE (Drafts)
```
Context: Chile. People: Latin/Mixed heritage. Text: Spanish only.
```

---

## 5. PLANTILLAS POR INDUSTRIA

### INDUSTRY_TEXT_TEMPLATES

| Industria | Textos de Branding | Textos de Leads |
|-----------|-------------------|-----------------|
| **wellness_zen** | Armonía y Equilibrio, Bienestar Total, Tu Centro de Paz | Reserva Tu Clase, Comienza Hoy, Prueba Gratis |
| **pilates** | Vive Pilates, Cuerpo Consciente, Tu Equilibrio Interior | Agenda Tu Clase de Prueba, Reserva Tu Sesión |
| **gastronomy** | Sabor Auténtico, Experiencia Única, Cocina con Alma | Reserva Tu Mesa, Ordena Ahora, Delivery Disponible |
| **retail_sale** | Calidad Garantizada, Lo Mejor en, Tu Tienda de Confianza | ¡Ahora con DCTO!, Stock Limitado, Oferta del Día |
| **sport_gritty** | Fuerza y Disciplina, Supera Tus Límites, Entrenamiento Pro | Empieza Tu Transformación, Clase de Prueba |
| **aesthetic_min** | Belleza Natural, Tu Mejor Versión, Cuidado Profesional | Agenda Tu Cita, Reserva Tu Turno, Consultoría Gratis |
| **medical_clean** | Cuidado de Expertos, Tu Salud Primero, Atención Personalizada | Agenda Tu Consulta, Reserva Tu Hora, Atención Inmediata |
| **tech_saas** | Innovación Digital, Soluciones Tech, Futuro Automatizado | Demo Gratis, Prueba la Plataforma, Comienza Ahora |
| **edu_sketch** | Aprende de los Mejores, Conocimiento Real, Clases Personalizadas | Inscríbete Ya, Cupos Limitados, Clase de Prueba |
| **realestate_night** | Tu Hogar Ideal, Inversiones Premium, Propiedades de Lujo | Agenda Tu Visita, Tour de Propiedades, Cotización Gratis |
| **luxury_gold** | Exclusividad Absoluta, Lujo y Elegancia, Experiencia VIP | Reserva Tu Experiencia, Acceso VIP, Cita Privada |
| **auto_metallic** | Calidad Automotriz, Confianza Total, Servicio Premium | Agenda Tu Servicio, Cotiza Tu Auto, Revision Gratis |
| **worship_sky** | Fe y Esperanza, Comunidad de Fe, Esperanza Viva | Únete a Nosotros, Te Esperarmos, Visítanos |
| **kids_fun** | Diversión Garantizada, Magia y Alegría, Los Mejores Cumpleaños | Reserva Tu Fiesta, Cupos Disponibles, Agenda Tu Evento |
| **podcast_mic** | Voz Auténtica, Contenido Real, Historias Únicas | Escucha Ahora, Suscríbete Gratis, Nuevo Episodio |
| **gamer_stream** | Game On, Nivel Épico, Stream Legendario, Gaming Pro | Watch Live, Únete al Clan, Stream Ahora |
| **eco_organic** | Natural y Puro, Sustentable Real, Eco Friendly | Compra Consciente, Envío a Casa, Productos Nuevos |
| **urban_night** | Noche Épica, La Mejor Fiesta, Diversión Total | Reserva Tu Mesa, Entrada Anticipada, VIP Access |
| **corporate** | Soluciones Expertas, Profesionalismo Total, Resultados Garantizados | Agenda Reunión, Cotización Sin Compromiso, Consultoría Gratis |
| **default** | Calidad Premium, Experiencia Confiable, Profesionales Expertos | ¡Contáctanos Ya!, Agenda Tu Cita, Consulta Gratuita |

---

## 📊 RESUMEN DE MODELOS

### Imagen
| Calidad | Modelo | Resolución | Uso |
|---------|--------|------------|-----|
| Draft | gemini-2.5-flash-image | Variable | Borrador rápido |
| HD | gemini-3-pro-image-preview | 1024x1024 (1K) | Alta calidad |

### Video
| Calidad | Modelo | Resolución | Duración |
|---------|--------|------------|----------|
| Draft | veo-3.1-fast-generate-preview | 720p | 5-15 seg |
| HD | veo-3.1-generate-preview | 1080p | 5-15 seg |

---

## 🔧 PROMEDIO DE PROGRESSOS

### Flujo de Generación de Imagen
1. **0-10%**: Inicializando motor de IA
2. **10-30%**: Generando imagen (prompt enhancement)
3. **30-70%**: Renderizando imagen
4. **70-90%**: Analizando imagen para texto
5. **90-100%**: Finalizando

### Flujo de Generación de Video
1. **0-20%**: Generando imagen base
2. **20-40%**: Convirtiendo imagen a video
3. **40-80%**: Renderizando video (VEO)
4. **80-95%**: Descargando video
5. **95-100%**: Procesando overlays (FFmpeg)

---

*Documento generado automáticamente - Estudio 56*
*Fecha: Enero 2026*
# 📋 INFORME COMPLETO DE PROMPTS - ESTUDIO 56

## Tabla de Contenidos
1. [Prompts Principales de Generación](#1-prompts-principales-de-generación)
2. [Prompts de Estilos Visuales (38 estilos)](#2-prompts-de-estilos-visuales-38-estilos)
3. [Prompts de Video (25 estilos)](#3-prompts-de-video-25-estilos)
4. [Prompts de Contexto Chileno](#4-prompts-de-contexto-chileno)
5. [Prompts de Modo Magia (Detección Automática)](#5-prompts-de-modo-magia-detección-automática)
6. [Prompts de Análisis Inteligente](#6-prompts-de-análisis-inteligente)
7. [Prompts de Modificadores de Realismo](#7-prompts-de-modificadores-de-realismo)
8. [Prompts de Guardrails y Restricciones](#8-prompts-de-guardrails-y-restricciones)
9. [Templates de Texto por Industria](#9-templates-de-texto-por-industria)

---

## 1. PROMPTS PRINCIPALES DE GENERACIÓN

### 1.1 MASTER_STYLE (Estilo Maestro para HD)
**Propósito:** Define el estilo base para todas las imágenes de alta calidad.

```python
Professional social media flyer design. Aesthetic: GraphicRiver bestseller, 
glossy finish, ultra-detailed, commercial photography, 8k resolution, 
Unreal Engine 5 render style.
```

**Uso:** Se aplica a todas las generaciones HD para mantener consistencia visual profesional.

---

### 1.2 MASTER_STYLE_DRAFT (Estilo Maestro para Borrador)
**Propósito:** Versión simplificada del estilo maestro para el modelo Flash.

```python
Professional commercial photography, high resolution, 4k, advertising aesthetic.
```

**Uso:** Generaciones draft más rápidas con el modelo Gemini 2.5 Flash.

---

### 1.3 VIDEO_PHYSICS_GUARDRAIL (Física para Videos)
**Propósito:** Garantiza física realista en videos generados.

```python
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

**Uso:** Previene errores físicos comunes en videos generados por IA.

---

## 2. PROMPTS DE ESTILOS VISUALES (38 ESTILOS)

### 2.1 Categoría: VENTAS & COMERCIAL

#### **retail_sale** - Ofertas / Liquidación
```python
Subject: [INSERT SUBJECT HERE]. Style: High-End 3D Commercial Art. Tech: Cinema 4D, 
Octane Render, Raytracing, 8k resolution. Composition: Dynamic zero-gravity explosion, 
floating 3D percentage signs (%), confetti. Lighting: Studio softbox lighting, glossy 
reflections, vibrant rim lights. Vibe: Urgent, energetic, premium advertising.
```
**Movimiento:** Subject holds a static pose smiling. Confetti falls in the foreground. 3D elements float gently.
**Ejemplo:** "Tienda 'El Ofertón': Liquidación de Invierno, todo con 50% de descuento."

---

#### **typo_bold** - Solo Texto / Avisos
```python
Subject: [NO SUBJECT - Abstract Background only]. Style: Swiss International Typographic 
Style Background. Visuals: Abstract smooth gradients, bold geometric shapes, or solid vibrant 
color. Purpose: Created specifically for heavy text overlays. Tech: Vector art style, ultra-clean, 8k.
```
**Movimiento:** Kinetic typography animation, words scaling up gently, background colors shifting in a loop.
**Ejemplo:** "Aviso Económico: SE ARRIENDA / Dpto Estudio Centro, Gastos Comunes Incluidos."

---

#### **auto_metallic** - Automotriz / Taller
```python
Subject: [INSERT SUBJECT HERE]. Style: Automotive Commercial CGI. Render: Unreal Engine 5, 
Raytraced reflections. Texture: Carbon fiber, brushed aluminum, metallic paint flakes. Effects: 
Motion blur, sparks, tire smoke. Vibe: Powerful, fast, industrial.
```
**Movimiento:** Low-angle camera, steady, with sparks flying and smoke moving. Car is stationary or wheels spinning in place.
**Ejemplo:** "Taller 'Velocidad Total': Cambio de Aceite + Revisión de Frenos Gratis."

---

#### **gastronomy** - Gastronomía / Sushi
```python
Subject: [INSERT SUBJECT HERE]. Style: Michelin-Star Food Photography / Food Porn. Camera: 
100mm Macro Lens. Lighting: Backlit with warm golden light to enhance steam and texture. Details: 
Visible water droplets on fresh ingredients, subsurface scattering on food, smoke/steam rising. 
Texture: Rustic wood or dark slate background.
```
**Movimiento:** Cinematic Macro (extreme close-up) with minimal movement, steam rising softly.
**Ejemplo:** "Sanguchería 'El Guatón': Churrasco Italiano XL + Schop Artesanal a $8.990."

---

### 2.2 Categoría: CORPORATIVO & SERIO

#### **corporate** - Corporativo / Inmobiliaria
```python
Subject: [INSERT SUBJECT HERE]. Style: Premium Corporate Editorial (Forbes Magazine style). 
Camera: Canon EOS R5, 50mm Prime Lens, f/1.8 aperture. Background: Blurred modern glass architecture, 
city bokeh, clean geometric lines. Lighting: Cinematic office lighting, cool blue rim light, clean 
white key light. Vibe: Trustworthy, visionary, successful.
```
**Movimiento:** Extremely slow parallax slide. The person is anchored and static. Glass reflections move on the windows.
**Ejemplo:** "Inmobiliaria 'Los Andes': Últimas unidades en Las Condes, entrega inmediata."

---

#### **medical_clean** - Médico / Clínica
```python
Subject: [INSERT SUBJECT HERE]. Style: Sterile Medical Design. Palette: Pure White and Light Cyan. 
Lighting: Bright, shadowless clinical light. Elements: Clean glass surfaces, abstract DNA or cross 
symbols subtly in background. Vibe: Professional, sanitary, safe, advanced technology.
```
**Movimiento:** Clean mechanical camera slide (Slider shot) over static medical equipment.
**Ejemplo:** "Centro Dental 'Sonrisas': Ortodoncia Invisible, evaluación inicial sin costo."

---

#### **tech_saas** - Tecnología / Cripto
```python
Subject: [INSERT SUBJECT HERE]. Style: Abstract High-Tech Data Visualization. Elements: Network nodes, 
floating isometric 3D cubes, fiber optics. Palette: Deep Royal Blue and glowing cyan dots. Tech: 3D 
render, glowing bloom effects, futuristic.
```
**Movimiento:** Camera glides through static data streams. Glowing nodes pulse. No character movement required.
**Ejemplo:** "StartUp 'DataChile': Diplomado en Inteligencia Artificial y Python."

---

#### **edu_sketch** - Educación / Clases
```python
Subject: [INSERT SUBJECT HERE]. Style: Education Mixed Media (Photo + Sketch). Background: Green 
Chalkboard or Notebook paper texture. Elements: White chalk hand-drawn doodles (formulas, arrows) 
overlaid on realistic objects. Vibe: Smart, creative, academic growth.
```
**Movimiento:** Stop-motion animation style (low framerate), chalk drawings appearing line by line.
**Ejemplo:** "Preuniversitario 'Nacional': Matricúlate ahora para la PAES 2025."

---

#### **political_community** - Candidato / Municipal
```python
Subject: [INSERT SUBJECT HERE]. Style: Modern Political Campaign Photography. Camera: 85mm Portrait 
Lens (flattering). Lighting: Bright, optimistic daylight, no harsh shadows. Background: Blurred sunny 
park or suburban neighborhood. Vibe: Trustworthy, approachable, leadership.
```
**Movimiento:** Steady confident push-in (Zoom) on the subject. Subject is smiling and nodding, not walking.
**Ejemplo:** "Vota María González: Tu voz en el Conceño Municipal de Maipú."

---

### 2.3 Categoría: LIFESTYLE & VIBRA

#### **aesthetic_min** - Aesthetic / Belleza
```python
Subject: [INSERT SUBJECT HERE]. Style: Minimalist Product Photography (Instagram 'Clean Girl' Trend). 
Lighting: Soft-focus natural window light, 'Gobo' shadows (shadows of leaves casting on the scene). 
Palette: Monochromatic Beige, Cream, White, Sage Green. Texture: Organic linen, matte stone.
```
**Movimiento:** Very gentle handheld movement (breathing camera), shadows of leaves swaying softly on the wall.
**Ejemplo:** "Boutique 'Amapola': Nueva colección de lino Otoño-Invierno."

---

#### **wellness_zen** - Spa / Yoga
```python
Subject: [INSERT SUBJECT HERE]. Style: Zen Wellness Photography. Lighting: Soft candle light, dim 
and relaxing. Elements: Water ripples, bamboo, steam. Palette: Earthy Browns, Greens, and Soft White. 
Vibe: Calm, balance, spiritual, silence.
```
**Movimiento:** Tripod shot (Static), water dripping in super slow motion, candle flame flickering gently.
**Ejemplo:** "Centro 'Alma Zen': Masaje descontracturante y piedras calientes 2x1."

---

#### **pilates** - Pilates / Core
```python
Subject: [INSERT SUBJECT HERE]. Style: Pilates Studio Photography. Lighting: Soft, even studio 
lighting with subtle warm tones. Elements: Pilates reformer or mat, clean studio environment, smooth 
textures. Palette: Soft Sage Green, Cream, and Light Gray. Vibe: Strength, control, balance, mindful movement.
```
**Movimiento:** Slow, controlled camera movement, subject performing a static pilates pose with controlled breathing.
**Ejemplo:** "Studio 'Cuerpo Consciente': Clases de Pilates Reformer, mejora tu postura y fortalece tu core."

---

#### **summer_beach** - Verano / Piscina
```python
Subject: [INSERT SUBJECT HERE]. Style: Luxury Travel Photography. Camera: Polarized lens filter, 
high shutter speed to freeze water. Lighting: Bright natural sunlight, harsh summer shadows, beautiful 
lens flaring. Colors: Vibrant Teal (water) and Orange (sun warmth). Details: Crystal clear water refraction, wet surfaces.
```
**Movimiento:** High shutter speed freeze frame of water splashing. Sunlight flares moving across the lens.
**Ejemplo:** "Sunset Beach Club: Fiesta de Espuma en Reñaca, Sector 5."

---

#### **eco_organic** - Ecológico / Feria
```python
Subject: [INSERT SUBJECT HERE]. Style: Eco-Friendly Organic Design. Background: Recycled Kraft paper 
texture or blurred nature. Elements: Fresh green leaves foreground, hand-drawn recycling doodles. Lighting: 
Soft, bright, shadowless daylight. Vibe: Fresh, clean, sustainable.
```
**Movimiento:** Natural breeze blowing leaves gently, dappled sunlight shifting on the surface.
**Ejemplo:** "Emporio 'Raíces': Miel orgánica, frutos secos y mermeladas del sur."

---

#### **sport_gritty** - Deporte / Gym
```python
Subject: [INSERT SUBJECT HERE]. Style: Gritty Sports Commercial Photography (Nike Campaign style). 
Lighting: 'Rembrandt Lighting' (dramatic shadows), high contrast, harsh rim light highlighting sweat and 
muscle definition. Texture: Skin pores visible, atmospheric dust/chalk in the air. Background: Dark concrete 
gym or stadium lights.
```
**Movimiento:** Super slow motion. Subject is tensed and breathing heavily (heaving chest). Sweat drips. No running.
**Ejemplo:** "Gimnasio 'Titanium': Plan Anual 50% OFF, sin matrícula de incorporación."

---

### 2.4 Categoría: NOCHE & ENTRETENCIÓN

#### **urban_night** - Discoteca / Neón
```python
Subject: [INSERT SUBJECT HERE]. Style: Cyberpunk Nightlife / Concert Photography. Tech: Volumetric fog, 
Laser lights, Particle effects. Palette: Neon Purple, Cyan, and Magenta against deep blacks. Lighting: Strong 
backlighting (Silhouette effect), lens flares, atmospheric haze. Vibe: Electric, high energy, immersive.
```
**Movimiento:** Subject stands cool and static. Neon lights trail rapidly around them. Smoke swirls.
**Ejemplo:** "Club 'La Casona': Sábado de Reggaeton Old School, ellas entran gratis hasta la 1 AM."

---

#### **luxury_gold** - Gala VIP / Año Nuevo
```python
Subject: [INSERT SUBJECT HERE]. Style: Luxury Royal Aesthetic. Materials: Gold foil, black silk, marble, 
glitter. Lighting: Soft, warm, sparkling bokeh. Palette: Black and Gold. Vibe: Exclusive, expensive, celebration.
```
**Movimiento:** Smooth gliding camera (Gimbal shot), gold particles floating in the air. People are talking but standing still.
**Ejemplo:** "Evento 'Gala Vino': Degustación Premium en Hotel W, reserva tu mesa."

---

#### **realestate_night** - Lujo Nocturno
```python
Subject: [INSERT SUBJECT HERE]. Style: Luxury Architectural Night Photography. Lighting: Long exposure, 
'Blue Hour' sky, warm tungsten interior lights glowing. Reflections: Perfect reflection in swimming pool or 
glass facade. Vibe: Sophisticated, expensive, serene.
```
**Movimiento:** Cinematic Drone hover (Aerial shot), slow parallax movement.
**Ejemplo:** "Inmobiliaria 'Horizonte': Penthouse exclusivo con vista al mar y piscina privada."

---

#### **gamer_stream** - Gamer / Twitch
```python
Subject: [INSERT SUBJECT HERE]. Style: 3D Esports Tournament Art. Effects: Glitch art, digital distortion, 
speed lines. Palette: Neon Green (Razer style) or Twitch Purple. Tech: Unreal Engine 5 render, high sharpness, 
aggressive angles. Vibe: Competitive, digital, aggressive.
```
**Movimiento:** Character holds a power pose. Digital Glitch transitions overlay the screen. Neon electricity pulsing.
**Ejemplo:** "Ciber 'Matrix': Torneo de Valorant y League of Legends, premios en efectivo."

---

#### **indie_grunge** - Tocatas / Rock
```python
Subject: [INSERT SUBJECT HERE]. Style: Underground Gig Poster. Texture: Distressed brick wall, spray paint 
stencils, dirty concrete. Palette: Black, Red, and dirty White. Vibe: Rebellious, raw, artistic, lo-fi.
```
**Movimiento:** Vintage 8mm film shutter stutter, static camera with film grain flickering.
**Ejemplo:** "Bar 'El Hueso': Tocata en vivo este viernes, Bandas Tributo Rock Latino."

---

### 2.5 Categoría: EVENTOS & ESPECIALES

#### **kids_fun** - Infantil / Cumpleaños
```python
Subject: [INSERT SUBJECT HERE]. Style: 3D Pixar/Disney Animation Style. Render: Glossy plastic textures, 
soft rubber. Palette: Bright Primary Colors (Red, Blue, Yellow). Lighting: Soft, rounded, high-key lighting. 
Vibe: Playful, safe, happy, magical.
```
**Movimiento:** Bouncy animation physics, balloons floating upwards, confetti popping. Characters jump in place.
**Ejemplo:** "Cumpleaños 'Mundo Feliz': Arriendo de juegos inflables, pintacaritas y magia."

---

#### **worship_sky** - Iglesia / Espiritual
```python
Subject: [INSERT SUBJECT HERE]. Style: Majestic & Ethereal Photography. Lighting: 'God Rays' (Volumetric 
light beams) descending from clouds/sky. Palette: Gold, White, and Sky Blue. Atmosphere: Peaceful, divine, 
grand scale, minimal dust particles in light. Vibe: Hope, faith, solemnity.
```
**Movimiento:** Slow cinematic tilt up towards the sky, clouds drifting majestically.
**Ejemplo:** "Iglesia 'Vida Nueva': Gran Vigilia de Jóvenes este Sábado a las 20:00 hrs."

---

#### **seasonal_holiday** - Navidad / Festivo
```python
Subject: [INSERT SUBJECT HERE]. Style: 3D Festive Holiday Render. Materials: High-gloss plastic, silk 
ribbons, glitter, snow texture. Lighting: Sparkling, magical, warm fairy lights. Render: 8k, Octane render, 
highly detailed. Vibe: Celebration, joy, abundance.
```
**Movimiento:** Magical atmosphere, camera orbiting slowly around centerpiece, snow/sparkles falling gently.
**Ejemplo:** "Tienda 'Regalos Mágicos': Venta especial de Navidad, todo con 30% descuento."

---

#### **art_double_exp** - Artístico / Teatro
```python
Subject: [INSERT SUBJECT HERE]. Style: Artistic Double Exposure. Composition: Seamless blend between 
silhouette and nature landscape. Background: Minimalist solid color or subtle gradient. Vibe: Surreal, poetic, 
psychological, dreamy.
```
**Movimiento:** Slow surreal morphing, fluid ink spreading in water, double exposure layers moving at different speeds.
**Ejemplo:** "Teatro Municipal: Obra 'Sueños de una Noche de Verano', estreno Viernes."

---

#### **retro_vintage** - Retro / 90s
```python
Subject: [INSERT SUBJECT HERE]. Style: 90s Grunge Collage Art / Mixed Media. Effects: Halftone dot pattern 
(comic style), paper texture overlay, digital noise/grain, ripped paper edges. Palette: Acid Green, Hot Pink, 
or Faded Polaroid tones. Composition: Chaotic but balanced.
```
**Movimiento:** Vintage VHS tracking error effect, film grain flickering, frame stuttering.
**Ejemplo:** "Fonda 'La Chueca': Terremotos, anticuchos y la mejor cumbia este 18."

---

#### **podcast_mic** - Podcast / Entrevista
```python
Subject: [INSERT SUBJECT HERE]. Style: Modern Broadcast Studio Photography. Camera: Shallow depth of field 
(blurred background), sharp focus on subject. Background: Bokeh studio lights, acoustic foam texture. Elements: 
Colorful digital soundwaves overlay. Vibe: Professional, communicative, on-air.
```
**Movimiento:** Slow circular dolly track around the microphone, digital audio waveform bars pulsing to the rhythm.
**Ejemplo:** "Radio 'Futuro': Entrevista exclusiva a emprendedores locales sobre innovación."

---

## 3. PROMPTS DE VIDEO (25 ESTILOS)

### 3.1 FÓRMULA MAESTRA PARA VIDEO
**Estructura:** [DESCRIPCIÓN VISUAL] + [MOVIMIENTO DE CÁMARA] + [ACCIÓN DEL SUJETO] + High resolution, cinematic 4k.

---

#### **video_retail_sale** - Retail / Ofertas
```python
3D Retail Sale concept. Floating sneakers, tech gadgets, and 3D percentage signs against a red background. 
Slow motion explosion effect. Items floating and rotating in zero gravity. Confetti falling gently. 
Camera slowly pushing in. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Zero gravity explosion, confetti falling, camera push-in
**Duración:** 5-8 seg
**Ejemplo:** "Tienda: Liquidación 50% OFF con productos flotando."

---

#### **video_summer_beach** - Verano / Turismo
```python
Luxury infinity pool with a cocktail in the foreground, ocean background, sunny day. Crystal clear water 
rippling and splashing. Sunlight glimmering on the water surface. Slow camera dolly forward towards the 
cocktail. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Water rippling, sunlight glimmering, camera dolly forward
**Duración:** 6-10 seg
**Ejemplo:** "Beach Club: Cocktail tropical en piscina infinita."

---

#### **video_worship_sky** - Iglesia / Espiritual
```python
Silhouette of a crowd with hands raised, volumetric light beams descending from clouds. God rays shimmering 
and moving slowly through the fog. Clouds passing majestically in the background. Subtle handheld camera 
movement for realism. High resolution, cinematic 4k.
```
**Estilo de movimiento:** God rays shimmering, clouds passing, subtle handheld
**Duración:** 8-12 seg
**Ejemplo:** "Iglesia: Vigilia con rayos de luz divina."

---

#### **video_corporate** - Corporativo / Oficina
```python
Modern glass office building or professional working on a laptop. Cinematic rack focus from the person to 
the city skyline in the background. City traffic moving in fast-forward outside the window. High resolution, 
cinematic 4k.
```
**Estilo de movimiento:** Rack focus, city timelapse, professional atmosphere
**Duración:** 8-12 seg
**Ejemplo:** "Empresa: Profesional trabajando con vista a la ciudad."

---

#### **video_urban_night** - Discoteca / Neón
```python
DJ silhouette in a dark club with neon lasers and smoke. Strobing neon lights flashing in rhythm. Smoke 
billowing across the stage. The crowd jumping in slow motion. Dynamic camera shake. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Neon strobing, smoke billowing, crowd jumping, camera shake
**Duración:** 6-10 seg
**Ejemplo:** "Club: DJ con láseres y humo."

---

#### **video_gastronomy** - Gastronomía / Comida
```python
Gourmet burger with melting cheese and steam. Extreme close-up. Cheese slowly oozing down the side of the 
burger. Steam rising gracefully. Sauce being poured in slow motion from above. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Cheese oozing, steam rising, sauce pouring slow motion
**Duración:** 5-8 seg
**Ejemplo:** "Restaurante: Hamburguesa gourmet con queso derritiéndose."

---

#### **video_sport_gritty** - Deporte / Gym
```python
Athlete lifting heavy weights, gritty texture, dramatic lighting. Slow motion capture of the intense effort. 
Sweat droplets flying off the skin. Dust particles floating in the heavy rim light. Muscle tension visible. 
High resolution, cinematic 4k.
```
**Estilo de movimiento:** Sweat droplets flying, dust in rim light, muscle tension
**Duración:** 6-10 seg
**Ejemplo:** "Gym: Atleta levantando pesas con sudor y esfuerzo."

---

#### **video_luxury_gold** - Lujo / Gala VIP
```python
Champagne glasses toasting, gold foil background, fireworks. Champagne bubbles rising inside the glass. 
Fireworks exploding softly in the background. Gold sparkles shimmering. Smooth, elegant camera slide 
(parallax). High resolution, cinematic 4k.
```
**Estilo de movimiento:** Bubbles rising, fireworks, gold sparkles, elegant parallax
**Duración:** 8-12 seg
**Ejemplo:** "Evento VIP: Brindis con champagne y fuegos artificiales."

---

#### **video_aesthetic_min** - Aesthetic / Belleza
```python
Skincare product on a stone, soft window light with leaf shadows. Shadows of leaves gently swaying and 
passing over the product. Soft sunlight shifting intensity. Very slow, calming camera zoom out. High 
resolution, cinematic 4k.
```
**Estilo de movimiento:** Leaf shadows swaying, sunlight shifting, slow zoom out
**Duración:** 8-12 seg
**Ejemplo:** "Belleza: Producto de skincare con sombras de hojas."

---

#### **video_retro_vintage** - Retro / Vintage 90s
```python
90s Grunge Collage with cassette tape and neon colors. Stop-motion animation style. Elements jittering 
slightly. Film grain flickering. Glitch effects flashing intermittently on the screen. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Stop-motion jitter, film grain flicker, glitch flashes
**Duración:** 6-10 seg
**Ejemplo:** "Retro: Collage grunge 90s con cassette."

---

#### **video_gamer_stream** - Gamer / Esports
```python
Cyborg gamer character with glowing neon eyes and keyboard. Digital distortion and glitch artifacts 
passing through the image. Neon lightning crackling. The character breathing heavily with glowing eyes 
pulsating. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Glitch artifacts, neon lightning, eyes pulsating
**Duración:** 6-10 seg
**Ejemplo:** "Gaming: Personaje cyborg con glitch digital."

---

#### **video_eco_organic** - Ecológico / Natural
```python
Basket of organic fruits in a nature setting. Leaves blowing gently in the wind. Sunlight filtering 
through moving trees (dappled light). A butterfly flying past the camera. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Leaves blowing, dappled light, butterfly flying
**Duración:** 8-12 seg
**Ejemplo:** "Eco: Canasta de frutas orgánicas con mariposa."

---

#### **video_indie_grunge** - Rock / Indie
```python
Electric guitar amp on a dark stage, dirty texture. Thick stage smoke rolling on the floor. Handheld 
camera movement (shaky cam) to create a raw, documentary feel. Dust floating in the spotlight. High 
resolution, cinematic 4k.
```
**Estilo de movimiento:** Smoke rolling, shaky cam, dust in spotlight
**Duración:** 6-10 seg
**Ejemplo:** "Rock: Amplificador en escenario con humo."

---

#### **video_political** - Política / Comunidad
```python
Candidate walking in a park, smiling at people. Tracking shot following the candidate walking forward. 
People in the background moving naturally. Trees swaying. Bright and energetic movement. High resolution, 
cinematic 4k.
```
**Estilo de movimiento:** Tracking shot, natural background movement, bright energy
**Duración:** 10-15 seg
**Ejemplo:** "Política: Candidato caminando en el parque."

---

#### **video_kids_fun** - Infantil / Cumpleaños
```python
3D Cartoon birthday cake and balloons. Balloons bobbing gently in the air. Confetti raining down slowly. 
The cake spinning slowly on a turntable. Bouncy, cheerful animation style. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Balloons bobbing, confetti raining, cake spinning
**Duración:** 6-10 seg
**Ejemplo:** "Kids: Torta 3D con globos y confeti."

---

#### **video_art_double_exp** - Artístico / Doble Exposición
```python
Silhouette of a head filled with a forest landscape. The silhouette remains still, but the forest inside 
the head is alive: fog moving, birds flying, trees swaying inside the profile. Surreal dreamlike motion. 
High resolution, cinematic 4k.
```
**Estilo de movimiento:** Fog moving inside silhouette, birds flying, trees swaying
**Duración:** 8-12 seg
**Ejemplo:** "Arte: Silueta con bosque interno en movimiento."

---

#### **video_medical_clean** - Médico / Clínico
```python
Doctor in a futuristic clinic, DNA strands in background. DNA strands rotating slowly in the background. 
Clean, smooth camera panning. No shaky movement, perfectly stable and sterile flow. High resolution, cinematic 4k.
```
**Estilo de movimiento:** DNA rotating, smooth panning, stable sterile flow
**Duración:** 8-12 seg
**Ejemplo:** "Médico: Doctor en clínica futurista con ADN."

---

#### **video_tech_saas** - Tech / AI / Digital
```python
Digital brain made of connecting dots and lines. Data lines flowing like electricity between nodes. The 
3D brain rotating slowly. Glowing pulses of light traveling through the network. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Data flowing, brain rotating, light pulses
**Duración:** 8-12 seg
**Ejemplo:** "Tech: Cerebro digital con nodos y líneas de datos."

---

#### **video_typo_bold** - Tipografía Pura
```python
Abstract gradient background or geometric shapes. Liquid gradients morphing and changing colors slowly. 
Geometric shapes rotating and floating. Designed as a perfect loop for text overlay. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Liquid gradients morphing, geometric shapes rotating
**Duración:** 6-10 seg
**Ejemplo:** "Diseño: Gradientes líquidos y formas geométricas."

---

#### **video_realestate_night** - Inmobiliaria Nocturna
```python
Luxury mansion with pool at night. Time-lapse of the stars moving across the sky. Reflection in the pool 
water rippling gently. Interior lights turning on and off slowly. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Stars time-lapse, pool reflection, interior lights
**Duración:** 10-15 seg
**Ejemplo:** "Inmobiliaria: Mansión de lujo con time-lapse de estrellas."

---

#### **video_auto_metallic** - Automotriz / Coche
```python
Sports car wheel close-up, smoke, sparks. Wheel spinning at high speed. Smoke billowing out aggressively 
from the tire. Sparks flying towards the camera. Fast, high-octane camera tracking. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Wheel spinning fast, smoke billowing, sparks flying
**Duración:** 5-8 seg
**Ejemplo:** "Auto: Rueda de deportivo girando con humo y chispas."

---

#### **video_edu_sketch** - Educación / Clases
```python
Books on a desk with white chalk doodles overlay. The chalk doodles (formulas, arrows) animating and 
drawing themselves on the screen. Write-on effect. Dust motes dancing in the library light. High resolution, 
cinematic 4k.
```
**Estilo de movimiento:** Chalk drawing itself, dust motes dancing
**Duración:** 10-15 seg
**Ejemplo:** "Educación: Libros con doodles en tiza animándose."

---

#### **video_wellness_zen** - Spa / Zen
```python
Hot stones, bamboo, water surface. A single water drop falling into the pool creating perfect ripples. 
Candle flame flickering softly. Steam rising gently from the hot stones. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Water drop falling, perfect ripples, candle flickering
**Duración:** 6-10 seg
**Ejemplo:** "Spa: Gota de agua creando ripples perfectos."

---

#### **video_podcast_mic** - Podcast / Media
```python
Studio microphone close up, soundwaves. Digital soundwaves (equalizer) bars jumping up and down in the 
background. The ON AIR light pulsing on and off. Slow camera orbit around the mic. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Soundwaves jumping, ON AIR pulsing, camera orbit
**Duración:** 8-12 seg
**Ejemplo:** "Podcast: Micrófono con ondas de audio."

---

#### **video_seasonal_holiday** - Festividades / Navidad
```python
Christmas gift boxes or Valentine hearts. Soft snow falling gently (Christmas) or 3D hearts floating 
upwards like bubbles (Valentine). Lights twinkling. Silk ribbons waving in the wind. High resolution, cinematic 4k.
```
**Estilo de movimiento:** Snow falling, hearts floating, lights twinkling
**Duración:** 8-12 seg
**Ejemplo:** "Navidad: Regalos con nieve cayendo suavemente."

---

## 4. PROMPTS DE CONTEXTO CHILENO

### 4.1 CHILEAN_BASE_CONTEXT (Contexto Base)
**Propósito:** Aplica a TODAS las imágenes (personas, texto, moneda).

```python
LOCALE SETTING: Chile (South America).
1. FACES/PEOPLE: Subjects must have realistic Chilean phenotypes (mixed heritage). Clothing: Modern 
urban western fashion suitable for temperate/cold weather (jackets, hoodies, jeans). No traditional folk 
costumes unless specified.
2. TEXT & LANGUAGE: ANY visible text in the image (signs, neon, chalkboards, pricing) MUST BE IN SPANISH 
(Chilean format).
   - STRICTLY NO ENGLISH TEXT (No "Sale", "Open", "Shop").
   - USE: "Oferta", "Abierto", "Liquidación", "Rico".
   - CURRENCY: Use Chilean Peso format with dot separator (e.g. "$1.000", "$5.990").
```

---

### 4.2 CHILEAN_CONTEXT_LITE (Versión Lite para Borradores)
```python
Context: Chile. People: Latin/Mixed heritage. Text: Spanish only.
```

---

### 4.3 CHILEAN_OUTDOOR_CONTEXT (Geografía para Estilos al Aire Libre)
**Propósito:** Aplica SOLO a estilos de exterior.

```python
GEOGRAPHIC SETTING: CHILE.
The landscape must be visually accurate to the Chilean territory stated in the subject.
1. IF COAST/BEACH: Pacific Ocean (Dark blue/cold water, energetic waves, grey or yellow coarse sand, 
rocky cliffs).
   - STRICTLY FORBIDDEN: Turquoise Caribbean water, white powder sand, coconut palm trees.
2. IF LAKE/SOUTH: Deep blue water, surrounding volcanoes, green pine/native forests (Bosque Valdiviano), 
rainy or cloudy atmosphere.
3. IF CENTRAL ZONE (Santiago/Rapel): Mediterranean climate, dry brownish hills, low bushes, urban trees, 
modern highways.
4. IF MOUNTAINS: The Andes (High, rocky, sharp peaks, snow-capped).
5. GENERAL BANS:
   - NO "Mexican" sepia filters or desert pueblo stereotypes.
   - NO Tropical Jungles.
   - NO Peruvian/Bolivian Altiplano aesthetics unless specifically asked.
```

---

### 4.4 CHILEAN_STUDIO_CONTEXT (Estudio para Estilos Retail/Indoor)
```python
BACKGROUND ENVIRONMENT:
- STUDIO / INDOOR SETTING.
- STRICTLY FORBIDDEN: Landscapes, Mountains, Skies, Outdoor scenery.
- Focus on the product/subject with the specific style background (Solid color, texture, gradient, interior).
```

---

## 5. PROMPTS DE MODO MAGIA (DETECCIÓN AUTOMÁTICA)

### 5.1 Detección de Industria desde URL/Texto

**Lógica de Prioridad (24 industrias):**

```python
// ORDEN DE PRIORIDAD (primera coincidencia gana)

// 1. WELLNESS & PILATES (prioridad alta para evitar conflictos)
if (input.includes('pilates')) return 'pilates'
if (input.includes('yoga') || input.includes('spa') || input.includes('masaje')) return 'wellness_zen'

// 2. RELIGIOSO / IGLESIA
if (input.includes('iglesia') || input.includes('templo')) return 'worship_sky'

// 3. GASTRONOMÍA
if (input.includes('restaurant') || input.includes('restaurante')) return 'gastronomy'

// 4. RETAIL & VENTAS
if (input.includes('tienda') || input.includes('shop')) return 'retail_sale'

// 5. DEPORTE & FITNESS
if (input.includes('gym') || input.includes('gimnasio')) return 'sport_gritty'

// 6. BELLEZA & AESTHETIC
if (input.includes('belleza') || input.includes('estética')) return 'aesthetic_min'

// 7. MÉDICO & SALUD
if (input.includes('médico') || input.includes('doctor')) return 'medical_clean'

// 8. TECNOLOGÍA
if (input.includes('tech') || input.includes('software')) return 'tech_saas'

// 9. EDUCACIÓN
if (input.includes('educación') || input.includes('curso')) return 'edu_sketch'

// 10. CORPORATIVO & NEGOCIOS
if (input.includes('empresa') || input.includes('company')) return 'corporate'

// 11. INMOBILIARIA
if (input.includes('inmobiliaria') || input.includes('propiedad')) return 'realestate_night'

// 12. LUJO & PREMIUM
if (input.includes('lujo') || input.includes('luxury')) return 'luxury_gold'

// 13. AUTOMOTRIZ
if (input.includes('auto') || input.includes('vehiculo')) return 'auto_metallic'

// 14. NOCHE & ENTRETENIMIENTO
if (input.includes('discoteca') || input.includes('club')) return 'urban_night'

// 15. GAMING & STREAMING
if (input.includes('gaming') || input.includes('game')) return 'gamer_stream'

// 16. MÚSICA & PODCAST
if (input.includes('podcast') || input.includes('radio')) return 'podcast_mic'

// 17. INFANTIL
if (input.includes('niños') || input.includes('infantil')) return 'kids_fun'

// 18. ECOLÓGICO & NATURAL
if (input.includes('eco') || input.includes('organic')) return 'eco_organic'

// 19. VERANO & PLAYA
if (input.includes('verano') || input.includes('playa')) return 'summer_beach'

// 20. POLÍTICA
if (input.includes('política') || input.includes('politico')) return 'political_community'

// 21. ARTE & CREATIVO
if (input.includes('arte') || input.includes('galería')) return 'art_double_exp'

// 22. RETRO & VINTAGE
if (input.includes('retro') || input.includes('vintage')) return 'retro_vintage'

// 23. ROCK & MÚSICA INDIE
if (input.includes('rock') || input.includes('música')) return 'indie_grunge'

// 24. NAVIDAD & FESTIVIDADES
if (input.includes('navidad') || input.includes('christmas')) return 'seasonal_holiday'

// FALLBACK FINAL
return 'brand_identity'
```

---

## 6. PROMPTS DE ANÁLISIS INTELIGENTE

### 6.1 IMAGE_ANALYSIS_SERVICE - Análisis de Imagen para Estilos de Texto

```python
Analiza esta imagen y extrae la siguiente información en formato JSON:

{
  "dominantColors": ["#color1", "#color2", "#color3"],
  "mood": "elegant|modern|corporate|artistic|playful|luxury|minimalist",
  "lighting": "bright|soft|dramatic|warm|cool",
  "style": "clean|vibrant|muted|neon|metallic|organic",
  "recommendedTextStyle": {
    "fontFamily": "font-family-name",
    "fontWeight": "normal|bold|black",
    "color": "#hex-color",
    "textShadow": "shadow-description",
    "backgroundColor": "#hex-color (optional)",
    "borderColor": "#hex-color (optional)",
    "gradient": "gradient-description (optional)"
  }
}

Enfócate en:
1. Colores dominantes que se ven en la imagen
2. Mood general (elegante, moderno, corporativo, artístico, etc.)
3. Tipo de iluminación (brillante, suave, dramática, etc.)
4. Estilo visual (limpio, vibrante, muted, etc.)
5. Recomendaciones específicas para texto que combine con la imagen

Responde SOLO con el JSON, sin texto adicional.
```

---

### 6.2 CONTEXTUAL_TYPOGRAPHY_SERVICE - Análisis Contextual de Tipografía

```python
Analiza esta imagen y determina el contexto de negocio/contenido para aplicar tipografía apropiada.

CONTEXTO A DETECTAR:
- food: Restaurantes, comida, bebidas, cocina
- fashion: Ropa, accesorios, belleza, estilo
- technology: Software, apps, gadgets, innovación
- business: Corporativo, servicios, consultoría
- health: Médico, fitness, wellness, belleza
- travel: Turismo, hoteles, destinos, aventuras
- education: Cursos, libros, academia, aprendizaje
- entertainment: Cine, música, juegos, diversión
- sports: Deportes, fitness, competencia
- luxury: Lujo, premium, exclusivo, elegante
- art: Creativo, artístico, diseño, cultura
- automotive: Autos, vehículos, mecánica
- real_estate: Bienes raíces, propiedades, construcción
- general: Otros contextos

Responde en formato JSON:
{
  "context": "contexto_detectado",
  "typography": {
    "fontFamily": "nombre_fuente_especifica",
    "fontWeight": "normal|bold|black",
    "fontStyle": "normal|italic",
    "letterSpacing": "normal|tight|wide",
    "textTransform": "none|uppercase|lowercase|capitalize",
    "recommendedSize": "small|medium|large|xl"
  },
  "colorStrategy": {
    "primaryColor": "#hex_color",
    "secondaryColor": "#hex_color",
    "backgroundColor": "#hex_color",
    "contrastRatio": 4.5,
    "accessibility": "excellent|good|fair|poor"
  },
  "effects": {
    "shadowStyle": "descripcion_sombra",
    "glowEffect": "efecto_brillo",
    "gradientOverlay": "gradiente_especifico",
    "materialEffect": "none|glass|metal|neon|paper|leather|wood"
  }
}
```

---

### 6.3 CONTEXTUAL_EFFECTS_SERVICE - Análisis de Iluminación y Efectos

```python
Analiza esta imagen para determinar efectos de iluminación, sombras y materiales que se pueden aplicar 
al texto para que se integre naturalmente.

CONTEXTO A ANALIZAR:
1. ILUMINACIÓN:
   - Dirección de la luz (top-left, top, top-right, left, center, right, bottom-left, bottom, bottom-right)
   - Intensidad (0-1)
   - Color de la luz (hex)
   - Temperatura (warm, cool, neutral)

2. SOMBRAS:
   - Estilo (soft, medium, hard, dramatic)
   - Offset (x, y en píxeles)
   - Blur (0-50)
   - Spread (0-20)
   - Color (rgba)
   - Opacidad (0-1)
   - Dirección

3. HIGHLIGHTS:
   - Estilo (subtle, medium, strong, metallic)
   - Color
   - Opacidad (0-1)
   - Posición

4. GLOW:
   - Estilo (none, subtle, medium, strong, neon)
   - Color
   - Intensidad (0-1)
   - Distancia (0-50)

5. MATERIAL:
   - Tipo (paper, glass, metal, plastic, fabric, wood, stone, liquid)
   - Reflectividad (0-1)
   - Rugosidad (0-1)
   - Transparencia (0-1)

Responde en formato JSON con todos los parámetros detallados.
```

---

### 6.4 COMPOSITION_ANALYSIS_SERVICE - Análisis de Composición

```python
Analiza esta imagen para determinar la posición óptima del texto. Considera:

1. ESPACIOS VACÍOS: Identifica áreas con menos elementos visuales
2. COMPOSICIÓN: Regla de tercios, balance visual, flujo visual
3. LEGIBILIDAD: Asegura que el texto sea claramente visible
4. JERARQUÍA VISUAL: Donde el ojo se enfoca primero
5. CONTRASTE: Fondos claros vs oscuros para el texto

Responde SOLO con JSON válido:

{
  "optimalTextPosition": {
    "x": 50,
    "y": 50,
    "alignment": "center",
    "verticalAlignment": "center",
    "confidence": 0.9
  },
  "recommendedFontSize": {
    "base": 20,
    "responsive": {
      "mobile": 16,
      "tablet": 18,
      "desktop": 20
    },
    "confidence": 0.85
  },
  "contrastOptimization": {
    "recommendedTextColor": "#FFFFFF",
    "recommendedBackgroundColor": "#000000",
    "contrastRatio": 4.5,
    "isWCAGCompliant": true,
    "confidence": 0.9
  },
  "compositionOptimization": {
    "balanceScore": 0.8,
    "visualWeight": 0.7,
    "recommendedSpacing": {
      "margin": 20,
      "padding": 16,
      "lineHeight": 1.4
    },
    "confidence": 0.85
  },
  "safeAreas": {
    "top": 10,
    "right": 5,
    "bottom": 15,
    "left": 5
  }
}

INSTRUCCIONES ESPECÍFICAS:
- x, y: Porcentajes (0-100) donde posicionar el texto
- alignment: left|center|right
- verticalAlignment: top|center|bottom
- fontSize: Tamaño en píxeles apropiado para la imagen
- contrastRatio: Mínimo 4.5 para WCAG AA
- safeAreas: Porcentajes de margen seguro desde los bordes
```

---

### 6.5 CONTRAST_ANALYSIS_SERVICE - Análisis de Contraste

**Funciones principales:**
- `hexToRgb()` - Convierte color hex a RGB
- `rgbToHex()` - Convierte RGB a hex
- `getLuminance()` - Calcula luminancia relativa
- `getContrastRatio()` - Calcula ratio de contraste
- `adjustColorForContrast()` - Ajusta color para mejorar contraste
- `analyzeImageContrast()` - Analiza contraste de imagen
- `extractImageColors()` - Extrae colores dominantes
- `generateContrastOptimizedStyles()` - Genera estilos CSS optimizados
- `isAccessibleContrast()` - Verifica accesibilidad WCAG AA
- `enhanceTextContrast()` - Mejora automáticamente el contraste

---

## 7. PROMPTS DE MODIFICADORES DE REALISMO

### 7.1 REALITY_MODES - Control de Nivel de Realismo

#### **realist** - Para Pymes reales
```python
STYLE_INSTRUCTION: Authentic commercial photography. Bright natural daylight (morning light), clean 
white walls, realistic textures. The image should look trustworthy, approachable, and achievable for 
a local business in Chile. Avoid: hyper-luxury elements, dark moody lighting, cinematic fog, candles, 
8k unreal render aesthetics.
```

**Uso:** Evita el look "fake luxury" para negocios locales en Chile.

---

#### **aspirational** - Para quien quiere vender un sueño
```python
STYLE_INSTRUCTION: High-end editorial photography. Cinematic lighting with dramatic shadows, luxurious 
atmosphere, premium materials. Evoke desire and exclusivity.
```

**Uso:** Negocios que quieren transmitir exclusividad y lujo.

---

#### **studio** - Para Estudio de Producto
```python
STYLE_INSTRUCTION: Professional product photography. High-quality studio lighting, soft shadows, sharp 
focus on the main subject. Clean, uncluttered composition that highlights the product details.
```

**Uso:** Fotografía de producto profesional con iluminación de estudio.

---

## 8. PROMPTS DE GUARDRAILS Y RESTRICCIONES

### 8.1 PROHIBICIÓN ABSOLUTA DE TEXTO EN IMÁGENES

```python
STRICT PROHIBITION - ZERO TOLERANCE:
1. ABSOLUTELY NO TEXT whatsoever - this is non-negotiable
2. NO letters, numbers, words, symbols, or characters of any kind
3. NO signs, menus, billboards, posters, banners, labels, or text on objects
4. NO text on clothing, products, walls, buildings, vehicles, or any surfaces
5. NO brand names, logos, or text that looks like writing
6. If you include any text, the image will be REJECTED
7. Text will be professionally added LATER as a separate overlay layer

VISUAL REQUIREMENTS:
- Clean, blank surfaces where text would normally appear
- Plain walls, empty signs, blank menus, bare products
- Focus on textures, lighting, colors, and composition only

Generate a COMPLETE VISIBLE IMAGE with rich textures, clear subjects, and proper lighting.
The image must be 100% TEXT-FREE. Any image containing text will be considered a failure.
```

---

### 8.2 PALABRAS PROHIBIDAS (Forbidden Keywords)

```python
export const FORBIDDEN_KEYWORDS = [
  'nsfw', 'nude', 'naked', 'violence', 'blood', 'weapon',
  'drugs', 'alcohol', 'tobacco', 'gambling', 'scam',
  'hate', 'discrimination', 'harassment'
];
```

---

## 9. TEMPLATES DE TEXTO POR INDUSTRIA

### 9.1 Plantillas de Texto Persuasivo

#### **INDUSTRY_TEXT_TEMPLATES** (geminiService.ts)

```python
// WELLNESS / PILATES / YOGA
wellness_zen: {
  branding: ['Armonía y Equilibrio', 'Bienestar Total', 'Tu Centro de Paz', 'Transforma Tu Cuerpo', 'Vive con Flexibilidad'],
  leads: ['Reserva Tu Clase', 'Comienza Hoy', 'Prueba Gratis', 'Agenda Tu Sesión', 'Tu Primera Clase es Gratis']
}

// GASTRONOMÍA
gastronomy: {
  branding: ['Sabor Auténtico', 'Experiencia Única', 'Cocina con Alma', 'Sabores de Chile', 'Tradición y Sabor'],
  leads: ['Reserva Tu Mesa', 'Ordena Ahora', 'Delivery Disponible', 'Cupo Limitado', 'Ven y Disfruta']
}

// RETAIL / TIENDAS
retail_sale: {
  branding: ['Calidad Garantizada', 'Lo Mejor en', 'Tu Tienda de Confianza', 'Variedad Premium', 'Estilo y Calidad'],
  leads: ['¡Ahora con DCTO!', 'Última Oportunidad', 'Stock Limitado', 'Oferta del Día', 'No Te Lo Pierdas']
}

// DEPORTE / GYM
sport_gritty: {
  branding: ['Fuerza y Disciplina', 'Supera Tus Límites', 'Entrenamiento Pro', 'Resultados Reales', 'Poder Total'],
  leads: ['Empieza Tu Transformación', 'Clase de Prueba', 'Inscríbete Ya', 'Cupos Disponibles', 'Transforma Tu Cuerpo']
}

// BELLEZA / AESTHETIC
aesthetic_min: {
  branding: ['Belleza Natural', 'Tu Mejor Versión', 'Cuidado Profesional', 'Resultados Visibles', 'Lujo Accesible'],
  leads: ['Agenda Tu Cita', 'Reserva Tu Turno', 'Consultoría Gratis', 'Primera Sesión Gratis', 'Transforma Tu Look']
}

// SALUD / MÉDICO
medical_clean: {
  branding: ['Cuidado de Expertos', 'Tu Salud Primero', 'Atención Personalizada', 'Confianza Médica', 'Bienestar Integral'],
  leads: ['Agenda Tu Consulta', 'Reserva Tu Hora', 'Atención Inmediata', 'Cupos Disponibles', 'Tu Salud Es Lo Primero']
}

// TECNOLOGÍA
tech_saas: {
  branding: ['Innovación Digital', 'Soluciones Tech', 'Futuro Automatizado', 'Digitaliza Tu Negocio', 'Tecnología Avanzada'],
  leads: ['Demo Gratis', 'Prueba la Plataforma', 'Comienza Ahora', 'Sin Compromiso', 'Upgrade Tu Negocio']
}

// EDUCACIÓN
edu_sketch: {
  branding: ['Aprende de los Mejores', 'Conocimiento Real', 'Clases Personalizadas', 'Éxito Garantizado', 'Futuro Brillante'],
  leads: ['Inscríbete Ya', 'Cupos Limitados', 'Clase de Prueba', 'Comienza Este Mes', 'Reserva Tu Lugar']
}

// INMOBILIARIA
realestate_night: {
  branding: ['Tu Hogar Ideal', 'Inversiones Premium', 'Propiedades de Lujo', 'Sueños Hechos Realidad', 'Exclusividad Total'],
  leads: ['Agenda Tu Visita', 'Tour de Propiedades', 'Cotización Gratis', 'Opción Unica', 'Reserva Tu Propiedad']
}

// LUJO
luxury_gold: {
  branding: ['Exclusividad Absoluta', 'Lujo y Elegancia', 'Experiencia VIP', 'Lo Mejor de lo Mejor', 'Premium Total'],
  leads: ['Reserva Tu Experiencia', 'Acceso VIP', 'Cita Privada', 'Invitación Especial', 'Tu Momento de Lujo']
}

// AUTOMOTRIZ
auto_metallic: {
  branding: ['Calidad Automotriz', 'Confianza Total', 'Servicio Premium', 'Expertos en Autos', 'Driving Excellence'],
  leads: ['Agenda Tu Servicio', 'Cotiza Tu Auto', 'Revision Gratis', 'Oferta de Mantenimiento', 'Tu Auto en Buenas Manos']
}

// IGLESIA / ESPIRITUAL
worship_sky: {
  branding: ['Fe y Esperanza', 'Comunidad de Fe', 'Esperanza Viva', 'Amor y Servicio', 'Vida Espiritual'],
  leads: ['Únete a Nosotros', 'Te Esperarmos', 'Visítanos', 'Bautizos y Matrimonios', 'Grupos de Fe']
}

// NIÑOS
kids_fun: {
  branding: ['Diversión Garantizada', 'Magia y Alegría', 'Los Mejores Cumpleaños', 'Diversión Sin Límites', 'Recuerdos Especiales'],
  leads: ['Reserva Tu Fiesta', 'Cupos Disponibles', 'Fechas Limitadas', 'Comienza la Diversión', 'Agenda Tu Evento']
}

// MÚSICA / PODCAST
podcast_mic: {
  branding: ['Voz Auténtica', 'Contenido Real', 'Historias Únicas', 'Tu Voz al Mundo', 'Audio Premium'],
  leads: ['Escucha Ahora', 'Suscríbete Gratis', 'Nuevo Episodio', 'Síguenos', 'No Te Lo Pierdas']
}

// GAMING
gamer_stream: {
  branding: ['Game On', 'Nivel Épico', 'Stream Legendario', 'Gaming Pro', 'Victoria Asegurada'],
  leads: ['Watch Live', 'Únete al Clan', 'Stream Ahora', 'Seguir y Like', 'Participa en Torneos']
}

// ECOLÓGICO
eco_organic: {
  branding: ['Natural y Puro', 'Sustentable Real', 'Eco Friendly', 'Vida Natural', 'Orgánico de Verdad'],
  leads: ['Compra Consciente', 'Envío a Casa', 'Productos Nuevos', 'Descuentos Eco', 'Cambia a Lo Natural']
}

// FIESTA / NOCHE
urban_night: {
  branding: ['Noche Épica', 'La Mejor Fiesta', 'Diversión Total', 'Recuerdos de Locura', 'Live the Night'],
  leads: ['Reserva Tu Mesa', 'Entrada Anticipada', 'VIP Access', 'No Te Quedes Afuera', 'Fiesta Esta Noche']
}

// CORPORATIVO
corporate: {
  branding: ['Soluciones Expertas', 'Profesionalismo Total', 'Resultados Garantizados', 'Excelencia Empresarial', 'Socio Estratégico'],
  leads: ['Agenda Reunión', 'Cotización Sin Compromiso', 'Consultoría Gratis', 'Hablemos de Negocios', 'Contáctanos']
}

// DEFAULT / GENÉRICO
default: {
  branding: ['Calidad Premium', 'Experiencia Confiable', 'Profesionales Expertos', 'Marca de Confianza', 'Excelencia Garantizada'],
  leads: ['¡Contáctanos Ya!', 'Agenda Tu Cita', 'Consulta Gratuita', 'Oferta Especial', 'Llama Ahora', 'Reserva Hoy']
}
```

---

### 9.2 BRANDING_TEXTS y LEADS_TEXTS (Genéricos)

```python
const BRANDING_TEXTS = [
  'CALIDAD PREMIUM',
  'EXCELENCIA GARANTIZADA',
  'CONFIANZA TOTAL',
  'MARCA LÍDER',
  'TRADICIÓN Y CALIDAD'
];

const LEADS_TEXTS = [
  '¡CONTÁCTANOS YA!',
  'SOLICITA TU COTIZACIÓN',
  'LLAMA AHORA',
  'RESERVA HOY',
  '¡NO TE LO PIERDAS!'
];
```

---

## 10. SOLUCIÓN AL "CHOQUE DE TRENES" - REALIST STYLE VARIANTS

### 10.1 Problema Identificado
Cuando un usuario selecciona un estilo 3D/premium (como `retail_sale` con "explosión zero-gravity") Y elige el "Modo Realista", Gemini recibía instrucciones contradictorias que causaban "alucinaciones" - imágenes híbridas extrañas (ej: un negocio de barrio con productos flotando).

### 10.2 Solución: Dynamic Style Injection
Se crearon variantes "suaves" de los estilos más agresivos para cuando el usuario pide realismo.

#### **REALIST_STYLE_VARIANTS** (constants.ts)

```python
// retail_sale: De "explosión 3D" a "foto de tienda real"
retail_sale: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Chilean Retail Photography.
Context: Local neighborhood store or supermarket aisle. Background: Product shelves,
promotional displays, shopping carts. Lighting: Bright fluorescent store lighting,
harsh shadows. Vibe: Great value, accessible, trustworthy local business.
NO floating elements. NO 3D effects. Products must be on shelves or displays.`

// sport_gritty: De "Nike campaign" a "gym real de barrio"
sport_gritty: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Local Gym Photography.
Context: Neighborhood fitness center, real people exercising. Background: Weight racks,
exercise machines, mirrors. Lighting: Bright overhead fluorescent lights, some shadows.
Vibe: Approachable, community-focused, no-nonsense fitness. NO dramatic rim lighting.
NO sweat droplets in slow motion. Real gym atmosphere.`

// urban_night: De "cyberpunk club" a "pub/barrio real"
urban_night: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Neighborhood Bar/Pub Photography.
Context: Local bar interior, jukebox, pool table. Background: Wooden tables, bar counter,
sports on TV. Lighting: Warm amber incandescent lights, cozy atmosphere. Vibe: Welcoming
local hangout, affordable fun. NO neon lasers. NO volumetric fog. Real neighborhood bar.`

// tech_saas: De "abstract data viz" a "oficina tech real"
tech_saas: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Local Tech Business Photography.
Context: Small tech shop or coworking space, computers on desks. Background: Monitors,
keyboards, coffee cups. Lighting: Bright natural window light, practical lamps. Vibe:
Helpful local tech support, accessible innovation. NO glowing 3D cubes. NO abstract
data networks. Real tech workspace.`

// luxury_gold: De "royal aesthetic" a "evento nice pero accesible"
luxury_gold: `Subject: [INSERT SUBJECT HERE]. Style: Nice Local Event Photography. Context:
Community hall, wedding reception, birthday celebration. Background: Decorated tables,
balloons, stage. Lighting: Warm event lighting, spotlights. Vibe: Special but accessible
celebration. NO gold foil textures. NO marble backgrounds. Real local event.`

// kids_fun: De "3D Pixar" a "fiesta de niños real"
kids_fun: `Subject: [INSERT SUBJECT HERE]. Style: Real Children's Party Photography. Context:
Backyard or party room, kids playing. Background: Piñatas, balloons, party tables. Lighting:
Bright natural daylight or party lights. Vibe: Fun, chaotic, joyful childhood memories.
NO 3D animated characters. NO glossy plastic textures. Real kids party.`

// auto_metallic: De "CGI automotriz" a "taller/mecánico real"
auto_metallic: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Local Auto Shop Photography.
Context: Neighborhood mechanic garage, cars on lift. Background: Tools, oil stains, car parts.
Lighting: Practical garage lighting, some shadows. Vibe: Trustworthy local service, honest work.
NO Unreal Engine renders. NO carbon fiber textures. Real auto shop.`

// gastronomy: De "Michelin star" a "restaurant/casual real"
gastronomy: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Local Restaurant Photography.
Context: Neighborhood eatery, table with food. Background: Restaurant interior, plates on table.
Lighting: Warm indoor restaurant lighting. Vibe: Delicious local food, family-friendly. NO macro
lens food porn. NO backlit steam effects. Real restaurant food.`
```

**Uso:** Cuando `style === 'realist'` y `styleKey in REALIST_STYLE_VARIANTS`, se usa la variante en lugar del estilo original.

---

## 11. NUEVO ESTILO: FERIA LIBRE / MERCADO CHILENO

### 11.1 market_handwritten - Estilo para Pymes de Barrio

#### Propósito
Estilo faltante para negocios chilenos auténticos: Vega Central, Persa Biobío, ferias libres, verdulerías, y pyme de barrio.

```python
Subject: [INSERT SUBJECT HERE]. Style: Traditional Chilean Market ("Feria Libre") Aesthetic.
Background: Colorful cardboard signs (neon yellow, pink, green) with handwritten prices
written in thick black marker (plumón). Texture: Slightly worn cardboard, rustic wooden
crates, fruit baskets. Lighting: Bright outdoor sunlight, harsh shadows typical of
open-air markets. Vibe: Popular, cheap, fresh, urgent. "Bueno, bonito y barato".
NO professional graphics. NO clean studio backgrounds. Authentic Chilean market atmosphere.
```

**Movimiento:** Slow pan across market stalls, vendors arranging products, sunlight filtering through awnings. Authentic market movement.

**Ejemplo:** "Verdulería 'Don Pedro': Tomates a $1.500 el kilo, limones $500, ofertas de la semana."

**Tags:** ["Feria", "Barato", "Fresco", "Pyme"]

**Preview URL:** https://images.unsplash.com/photo-1488459716781-31db52582fe9

---

### 11.2 Plantilla CSS para market_handwritten

```typescript
market_handwritten: {
  id: 'market_handwritten',
  name: 'Feria / Mercado',
  textPosition: { x: 50, y: 75, alignment: 'center' },
  visualStyle: 'bottom-bar',
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: 'clamp(16px, 4.5vw, 28px)',
    fontWeight: '700',
    letterSpacing: '0.02em',
    textTransform: 'none'
  },
  effects: {
    scrim: {
      enabled: true,
      gradient: 'linear-gradient(to top, rgba(255,255,0,0.85) 0%, rgba(255,200,0,0.6) 70%, transparent 100%)',
      intensity: 'medium'
    },
    textShadow: {
      enabled: true,
      shadow: '2px 2px 0px rgba(0,0,0,0.5)',
      color: '#000000'
    },
    textStroke: { enabled: false },
    glow: { enabled: false }
  },
  colors: {
    primary: '#000000',
    secondary: '#FF6600',
    background: 'transparent'
  },
  animations: {
    entrance: 'fadeInUp 0.5s ease-out',
    hover: 'none'
  }
}
```

---

## 📊 RESUMEN DE PROMPTS POR CATEGORÍA

| Categoría | Cantidad | Propósito |
|-----------|----------|-----------|
| **Estilos de Imagen** | 39 | Definir apariencia visual de flyers (+1 nuevo) |
| **Estilos de Video** | 25 | Definir movimiento y composición de videos |
| **Contexto Chileno** | 4 | Adaptar contenido al mercado chileno |
| **Análisis Inteligente** | 5 | Extraer características de imágenes |
| **Modificadores de Realismo** | 3 | Controlar nivel de aspiracionalidad |
| **Realist Style Variants** | 8 | Solución al "Choque de Trenes" |
| **Templates de Texto** | 24 | Generar texto persuasivo por industria |
| **Guardrails** | 2 | Prevenir contenido inapropiado |

---

## 🎯 PROMEDIO DE PROMPTS ACTIVOS

- **Total de prompts únicos:** ~110+
- **Prompts de generación directa:** 64 (39 imágenes + 25 videos)
- **Prompts de análisis IA:** 4 (imagen, tipografía, efectos, composición)
- **Prompts de contexto:** 4 (chileano base, lite, outdoor, studio)
- **Realist Style Variants:** 8 (nuevos para evitar conflictos)
- **Templates de texto:** 24 industrias × 2 categorías = 48 templates
- **Guardrails y restricciones:** 2 (texto prohibido, palabras prohibidas)

---

## 🔧 ARQUITECTURA DE INYECCIÓN DE ESTILOS

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUJO DE GENERACIÓN                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Usuario selecciona:                                          │
│  ┌─────────────────┐    ┌─────────────────┐                  │
│  │ Style: retail_sale │ + │ Mode: realist   │                  │
│  └─────────────────┘    └─────────────────┘                  │
│                           │                                   │
│                           ▼                                   │
│              ┌────────────────────────┐                       │
│              │ ¿style in REALIST_     │                       │
│              │ STYLE_VARIANTS?        │                       │
│              └────────────────────────┘                       │
│                     │         │                               │
│                    SÍ        NO                               │
│                     │         │                               │
│                     ▼         ▼                               │
│         ┌─────────────────┐  ┌─────────────────┐              │
│         │ Usar VARIANT    │  │ Usar ESTILO     │              │
│         │ (tienda real)   │  │ ORIGINAL (3D)   │              │
│         └─────────────────┘  └─────────────────┘              │
│                     │                  │                      │
│                     ▼                  ▼                      │
│              ┌─────────────────────────────┐                  │
│              │ Gemini recibe:              │                  │
│              │ "Authentic Chilean Retail   │                  │
│              │  Photography..."            │                  │
│              └─────────────────────────────┘                  │
│                           │                                   │
│                           ▼                                   │
│              ┌─────────────────────────────┐                  │
│              │ Resultado: Foto real de     │                  │
│              │ negocio chileno ✓           │                  │
│              └─────────────────────────────┘                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

*Documento generado el 2026-01-02 para Estudio 56 - Plataforma de Generación de Marketing Visual con IA*
*Actualizado con REALIST_STYLE_VARIANTS y market_handwritten*
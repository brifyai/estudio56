# 📋 REPORTE COMPLETO DE PROMPTS - ESTUDIO 56

> **Versión 2.0 - Con Mejoras Estratégicas**
>
> Este reporte incluye las mejoras propuestas para evitar "choque de estilos", implementar jerarquía de modos y mejorar el renderizado de texto.

## Tabla de Contenidos
1. [Prompts de Imagen (Estilos de Campaña)](#1-prompts-de-imagen-estilos-de-campaña)
2. [Prompts de Video](#2-prompts-de-video)
3. [Sistema de Dirección de Arte (60+1 Rubros)](#3-sistema-de-dirección-de-arte-60-rubros)
4. [Modificadores de Prompt](#4-modificadores-de-prompt)
5. [System Instructions](#5-system-instructions)
6. [Contextos y Configuraciones](#6-contextos-y-configuraciones)
7. [Mapa de Conexiones](#7-mapa-de-conexiones)
8. [Mejoras Estratégicas v2.0](#8-mejoras-estratégicas-v20)

---

## 1. PROMPTS DE IMAGEN (Estilos de Campaña)

### 📊 Resumen por Categoría

| Categoría | Estilos | Descripción |
|-----------|---------|-------------|
| **VENTAS** | retail_sale, typo_bold, auto_metallic, gastronomy | Promociones, ofertas, productos |
| **CORPORATIVO** | corporate, medical_clean, tech_saas, edu_sketch, political_community | Servicios profesionales, empresas |
| **LIFESTYLE** | aesthetic_min, wellness_zen, pilates, summer_beach, eco_organic, sport_gritty | Belleza, bienestar, vida sana |
| **NOCHE** | urban_night, luxury_gold, realestate_night, gamer_stream, indie_grunge | Entretención, eventos nocturnos |
| **EVENTOS** | kids_fun, worship_sky, seasonal_holiday, art_double_exp, retro_vintage, market_handwritten, podcast_mic | Celebraciones, fechas especiales |

### 🎨 Detalle de Estilos de Imagen

#### 🔵 VENTAS & COMERCIAL

| Estilo | ID | Prompt Base | Conexión Dirección de Arte |
|--------|-----|-------------|---------------------------|
| **retail_sale** | 1 | High-End 3D Commercial Art, Cinema 4D, Octane Render, zero-gravity explosion, confetti | Rubro 1 (Retail General) |
| **typo_bold** | 2 | Swiss International Typographic Style, abstract gradients, bold geometric shapes | Rubro 2 (Retail Especializado) |
| **auto_metallic** | 3 | Automotive Commercial CGI, Unreal Engine 5, carbon fiber, metallic paint | Rubro 26 (Automotriz) |
| **gastronomy** | 4 | Michelin-Star Food Photography, 100mm Macro Lens, backlit golden lighting | Rubro 22 (Restaurantes) |

#### 🟢 CORPORATIVO & SERIO

| Estilo | ID | Prompt Base | Conexión Dirección de Arte |
|--------|-----|-------------|---------------------------|
| **corporate** | 5 | Premium Corporate Editorial, Forbes Magazine style, glass architecture | Rubro 25 (Educación) |
| **medical_clean** | 6 | Sterile Medical Design, pure white and light cyan palette | Rubro 24 (Salud/Medicina) |
| **tech_saas** | 7 | Abstract High-Tech Data Visualization, network nodes, glowing cyan | Rubro 38 (Tecnología/Startups) |
| **edu_sketch** | 8 | Education Mixed Media, chalkboard background, white chalk doodles | Rubro 25 (Educación/Cursos) |
| **political_community** | 9 | Modern Political Campaign Photography, 85mm Portrait Lens | Rubro 17 (Retail Comunitario) |

#### 🟡 LIFESTYLE & VIBRA

| Estilo | ID | Prompt Base | Conexión Dirección de Arte |
|--------|-----|-------------|---------------------------|
| **aesthetic_min** | 10 | Minimalist Product Photography, 'Clean Girl' Trend, Gobo shadows | Rubro 35 (Yoga Studio) |
| **wellness_zen** | 11 | Zen Wellness Photography, candle light, water ripples | Rubro 24 (Salud/Medicina) |
| **pilates** | 12 | Pilates Studio Photography, soft sage green palette | Rubro 36 (Kinesiología) |
| **summer_beach** | 13 | Luxury Travel Photography, polarized lens, vibrant teal water | Rubro 39 (Inmobiliaria/Turismo) |
| **eco_organic** | 14 | Eco-Friendly Organic Design, Kraft paper texture, fresh leaves | Rubro 39 (Jardinería) |
| **sport_gritty** | 15 | Gritty Sports Commercial Photography, Rembrandt Lighting | Rubro 37 (Deportes) |

#### 🟣 NOCHE & ENTRETENCIÓN

| Estilo | ID | Prompt Base | Conexión Dirección de Arte |
|--------|-----|-------------|---------------------------|
| **urban_night** | 16 | Cyberpunk Nightlife, volumetric fog, neon purple/cyan | Rubro 21 (Entretención) |
| **luxury_gold** | 17 | Luxury Royal Aesthetic, gold foil, black silk | Rubro 20 (Retail Premium) |
| **realestate_night** | 18 | Luxury Architectural Night Photography, Blue Hour | Rubro 16 (Retail Inmobiliario) |
| **gamer_stream** | 19 | 3D Esports Tournament Art, glitch art, neon green | Rubro 45 (Tattoo Studio) |
| **indie_grunge** | 20 | Underground Gig Poster, distressed brick wall | Rubro 33 (Barbería) |

#### 🟠 EVENTOS & ESPECIALES

| Estilo | ID | Prompt Base | Conexión Dirección de Arte |
|--------|-----|-------------|---------------------------|
| **kids_fun** | 21 | 3D Pixar/Disney Animation Style, bright primary colors | Rubro 47 (Heladería) |
| **worship_sky** | 22 | Majestic & Ethereal Photography, God Rays | Rubro 23 (Salud y Bienestar) |
| **seasonal_holiday** | 23 | 3D Festive Holiday Render, glitter, silk ribbons | Rubro 30 (Panadería) |
| **art_double_exp** | 24 | Artistic Double Exposure, silhouette blend | Rubro 45 (Tattoo Studio) |
| **retro_vintage** | 25 | 90s Grunge Collage Art, halftone, paper texture | Rubro 52 (Ferretería) |
| **market_handwritten** | 26 | Traditional Chilean Market Aesthetic, cardboard signs | Rubro 51 (Florería) |
| **podcast_mic** | 27 | Modern Broadcast Studio Photography, soundwaves | Rubro 44 (Librería) |

---

## 2. PROMPTS DE VIDEO

### 📊 Estilos de Video (25 total)

| Estilo | Label | Prompt Base | Motion Style | Duración | Aspect Ratios |
|--------|-------|-------------|--------------|----------|---------------|
| **video_retail_sale** | Retail / Ofertas | 3D Retail Sale concept, floating sneakers, percentage signs | Zero gravity explosion, confetti | 5-8 seg | 1:1, 9:16, 4:5 |
| **video_summer_beach** | Verano / Turismo | Luxury infinity pool, cocktail, ocean background | Water rippling, sunlight | 6-10 seg | 9:16, 16:9, 1:1 |
| **video_worship_sky** | Iglesia / Espiritual | Silhouette crowd, hands raised, volumetric light beams | God rays, clouds | 8-12 seg | 16:9, 9:16, 1:1 |
| **video_corporate** | Corporativo / Oficina | Modern glass office, professional working on laptop | Rack focus, timelapse | 8-12 seg | 16:9, 1.91:1, 1:1 |
| **video_urban_night** | Discoteca / Neón | DJ silhouette, neon lasers, smoke | Neon strobing, smoke | 6-10 seg | 16:9, 9:16, 1:1 |
| **video_gastronomy** | Gastronomía / Comida | Gourmet burger, melting cheese, steam | Cheese oozing, steam | 5-8 seg | 1:1, 4:5, 9:16 |
| **video_sport_gritty** | Deporte / Gym | Athlete lifting weights, gritty texture | Sweat droplets, dust | 6-10 seg | 1:1, 16:9, 9:16 |
| **video_luxury_gold** | Lujo / Gala VIP | Champagne toasting, gold foil, fireworks | Bubbles, sparkles | 8-12 seg | 16:9, 1:1, 9:16 |
| **video_aesthetic_min** | Aesthetic / Belleza | Skincare product, leaf shadows | Leaf shadows swaying | 8-12 seg | 1:1, 4:5, 9:16 |
| **video_retro_vintage** | Retro / Vintage 90s | 90s Grunge Collage, cassette tape | Stop-motion jitter | 6-10 seg | 1:1, 4:5, 9:16 |
| **video_gamer_stream** | Gamer / Esports | Cyborg gamer, glowing neon eyes, keyboard | Glitch, neon lightning | 6-10 seg | 16:9, 1:1, 9:16 |
| **video_eco_organic** | Ecológico / Natural | Basket of organic fruits, nature setting | Leaves, dappled light | 8-12 seg | 16:9, 1:1, 9:16 |
| **video_indie_grunge** | Rock / Indie | Electric guitar amp, dark stage, smoke | Smoke rolling, shaky cam | 6-10 seg | 16:9, 1:1, 9:16 |
| **video_political** | Política / Comunidad | Candidate walking in park, smiling | Tracking shot | 10-15 seg | 16:9, 1.91:1, 9:16 |
| **video_kids_fun** | Infantil / Cumpleaños | 3D Cartoon cake, balloons | Balloons bobbing | 6-10 seg | 1:1, 9:16, 4:5 |
| **video_art_double_exp** | Artístico / Doble Exposición | Silhouette head filled with forest | Fog moving inside | 8-12 seg | 1:1, 16:9, 9:16 |
| **video_medical_clean** | Médico / Clínico | Doctor in futuristic clinic, DNA strands | DNA rotating | 8-12 seg | 16:9, 1:1, 9:16 |
| **video_tech_saas** | Tech / AI / Digital | Digital brain, connecting dots and lines | Data flowing | 8-12 seg | 16:9, 1:1, 9:16 |
| **video_typo_bold** | Tipografía Pura | Abstract gradient, geometric shapes | Liquid gradients | 6-10 seg | 1:1, 9:16, 16:9 |
| **video_realestate_night** | Inmobiliaria Nocturna | Luxury mansion, pool at night | Stars time-lapse | 10-15 seg | 16:9, 1.91:1, 9:16 |
| **video_auto_metallic** | Automotriz / Coche | Sports car wheel, smoke, sparks | Wheel spinning | 5-8 seg | 16:9, 1:1, 9:16 |
| **video_edu_sketch** | Educación / Clases | Books, white chalk doodles overlay | Chalk drawing | 10-15 seg | 16:9, 1.91:1, 1:1 |
| **video_wellness_zen** | Spa / Zen | Hot stones, bamboo, water surface | Water drop falling | 6-10 seg | 1:1, 9:16, 4:5 |
| **video_podcast_mic** | Podcast / Media | Studio microphone, soundwaves | Soundwaves jumping | 8-12 seg | 16:9, 1:1, 9:16 |
| **video_seasonal_holiday** | Festividades / Navidad | Christmas gift boxes, snow falling | Snow falling | 8-12 seg | 1:1, 9:16, 16:9 |

### 🎬 VIDEO PHYSICS GUARDRAIL (Reglas de física para videos)

```
CRITICAL PHYSICS & MOTION RULES:
1. HIGH FRICTION: Feet must be FIRMLY glued to the floor. ABSOLUTELY NO SLIDING, gliding, or "moonwalking".
2. WEIGHT: Subjects must display heavy, realistic weight. No floating. No leaning on invisible walls.
3. MOTION SOURCE: Prefer CAMERA MOVEMENT (Parallax, Slow Zoom) and ATMOSPHERE (Wind, Lights, Particles) over complex body locomotion.
4. STATIC POSE: If the subject is standing, they must remain anchored. Only breathing and subtle posture shifts are allowed.
5. GROUNDING: Shadows must match foot contact perfectly.
6. NO SYMBOLS OR GLYPHS: STRICTLY FORBIDDEN to render letters, numbers, or pseudo-text symbols on any surface.
7. SURFACE TEXTURES: All walls, signs, and backgrounds must be BLANK, SOLID COLOR, or RAW TEXTURE.
```

---

## 3. SISTEMA DE DIRECCIÓN DE ARTE (60 RUBROS)

### 📊 Resumen por Fases

| Fase | Rubros | Descripción | Total |
|------|--------|-------------|-------|
| **Fase 1** | 1-20 | Retail y Productos General | 20 |
| **Fase 2** | 21-40 | Servicios y Gastronomía | 20 |
| **Fase 3** | 41-60 | Tiendas Especializadas | 20 |
| **Especial** | 61 | Estilo Editorial Universal | 1 |
| **Total** | **1-61** | **Sistema Completo** | **61** |

### 🎯 FASE 1: Rubros 1-20 (Retail y Productos)

| ID | Rubro | Prompt Clave | Estilo Visual |
|----|-------|--------------|---------------|
| 1 | Retail General | Clean commercial photography, studio lighting | commercial-retail |
| 2 | Moda Mujer | Fashion editorial look, soft daylight | fashion-editorial |
| 3 | Moda Hombre | Urban streetwear vibe, harsh shadows | streetwear-urban |
| 4 | Calzado | Dynamic low-angle shot, focus on sole texture | product-dynamic |
| 5 | Joyas | Extreme macro photography, bokeh highlights | luxury-jewelry |
| 6 | Óptica | Sharp focus on lenses, symmetrical composition | medical-clean |
| 7 | Belleza/Cosmética | Dewy skin textures, soft-focus pastel | beauty-soft |
| 8 | Perfumería | Ethereal lighting, glass transparency | luxury-fragrance |
| 9 | Bolsos/Carteras | Flat-lay editorial, leather grain focus | luxury-bags |
| 10 | Accesorios Tech | Cyber-clean aesthetic, matte black | tech-cyber |
| 11 | Smartphones | Glossy screen reflections, floating gadget | tech-premium |
| 12 | Computación | Deep shadows, glowing keyboard accents | tech-setup |
| 13 | Gaming | High-energy RGB saturation, glitch art | gaming-esports |
| 14 | Fotografía | Vintage camera aesthetic, warm lens flare | vintage-camera |
| 15 | Audio/Sonido | Visual sound waves, matte textures | audio-pro |
| 16 | Relojes | Watchmaker precision shot, moving gears | luxury-watch |
| 17 | Decoración | Interior design magazine style, symmetry | interior-design |
| 18 | Muebles | Studio furniture catalog, wood grain | furniture-catalog |
| 19 | Iluminación | High-contrast light and shadow play | lighting-design |
| 20 | Electrodomésticos | Stainless steel reflections | appliance-modern |

### 🍽️ FASE 2: Rubros 21-40 (Servicios y Gastronomía)

| ID | Rubro | Prompt Clave | Categoría |
|----|-------|--------------|-----------|
| 21 | Fitness / Gimnasio | High-energy athletic, dramatic rim lighting | Lifestyle |
| 22 | Restaurantes / Gastronomía | Cinematic food, backlit golden hour | Gastronomía |
| 23 | Bebidas / Licores | Premium liquid, glass transparency | Gastronomía |
| 24 | Salud / Medicina | Clinical clean, shadowless lighting | Salud |
| 25 | Educación / Cursos | Modern educational, natural window light | Servicios |
| 26 | Inmobiliaria | Luxury architectural, wide-angle lens | Servicios |
| 27 | Automotriz | Automotive commercial, glossy reflections | Servicios |
| 28 | Mascotas / Veterinaria | Heartwarming pet, soft natural lighting | Salud |
| 29 | Viajes / Turismo | Dream destination, vibrant tropical | Lifestyle |
| 30 | Eventos / Bodas | Elegant wedding, soft romantic lighting | Lifestyle |
| 31 | Limpieza / Mantenimiento | Before-after, sparkling clean | Servicios |
| 32 | Construcción / Reformas | Professional construction, worker action | Servicios |
| 33 | Servicios Profesionales | Corporate professional, executive office | Servicios |
| 34 | Arte / Cultura | Artistic gallery, dramatic museum lighting | Lifestyle |
| 35 | Música / Entretenimiento | Concert photography, stage lighting | Lifestyle |
| 36 | Deportes | Dynamic sports, frozen action | Lifestyle |
| 37 | Hogar / Interiorismo | Interior design magazine, symmetry | Lifestyle |
| 38 | Tecnología / Startups | Futuristic tech, glowing neon | Servicios |
| 39 | Servicios Financieros | Corporate financial, boardroom | Servicios |
| 40 | Alimentos / Comida Rápida | Appetizing fast food, vibrant saturated | Gastronomía |

### ✨ FASE 3: Rubros 41-60 (Tiendas Especializadas)

| ID | Rubro | Prompt Clave | Categoría |
|----|-------|--------------|-----------|
| 41 | Salón de Belleza | Glamour beauty, soft diffused lighting | Salud/Belleza |
| 42 | Barbería | Classic masculine, dramatic vintage lighting | Servicios |
| 43 | Gimnasio / Crossfit | High-intensity fitness, gritty gym | Lifestyle |
| 44 | Piscina / Acuático | Tropical pool, crystal clear blue | Lifestyle |
| 45 | Hotel / Hospedaje | Luxury hospitality, elegant room | Lifestyle |
| 46 | Restaurante Vegetariano | Fresh organic, plant-based colors | Gastronomía |
| 47 | Cafetería / Coffee Shop | Cozy coffee, warm brown tones | Gastronomía |
| 48 | Heladería Artesanal | Creamy ice cream, vibrant colors | Gastronomía |
| 49 | Panadería Artesanal | Golden crust, warm bakery lighting | Gastronomía |
| 50 | Pastelería / Tortas | Elegant cake, perfect frosting | Gastronomía |
| 51 | Carnicería | Fresh meat, clean display cases | Gastronomía |
| 52 | Verdulería | Fresh produce, vibrant colors | Gastronomía |
| 53 | Tienda de Ropa | Fashion retail, clean store interior | Retail |
| 54 | Zapatería | Footwear detail, leather texture | Retail |
| 55 | Joyería | Luxury jewelry, extreme macro | Retail |
| 56 | Óptica | Clean eyewear, sharp lens reflection | Retail |
| 57 | Perfumería | Luxury fragrance, glass transparency | Retail |
| 58 | Regalería | Gift product, creative display | Retail |
| 59 | Florería | Fresh flower, water droplet details | Retail |
| 60 | Mueblería | Interior furniture, room setting | Retail |

---

## 4. MODIFICADORES DE PROMPT

### 🎛️ REALITY MODES (Control de realismo)

```typescript
export const REALITY_MODES = {
  /**
   * MODO 1: Para Pymes reales (evita el look "fake luxury")
   * Genera imágenes con luz natural de día, fondos blancos limpios,
   * texturas realistas. Ideal para gimnasios de barrio, salons de belleza locales, etc.
   */
  realist: `STYLE_INSTRUCTION: Authentic commercial photography. 
    Bright natural daylight (morning light), clean white walls, realistic textures. 
    The image should look trustworthy, approachable, and achievable for a local 
    business in Chile. Avoid: hyper-luxury elements, dark moody lighting, 
    cinematic fog, candles, 8k unreal render aesthetics.`,

  /**
   * MODO 2: El modo actual (para quien quiere vender un sueño)
   * Genera imágenes de alta gama con iluminación cinematográfica,
   * atmósferas lujosas y materiales premium.
   */
  aspirational: `STYLE_INSTRUCTION: High-end editorial photography. 
    Cinematic lighting with dramatic shadows, luxurious atmosphere, premium materials. 
    Evoke desire and exclusivity.`,

  /**
   * MODO 3: Para la Opción B (Producto limpio)
   * Fotografía de producto profesional con iluminación de estudio,
   * sombras suaves y enfoque nítido en el sujeto principal.
   */
  studio: `STYLE_INSTRUCTION: Professional product photography. 
    High-quality studio lighting, soft shadows, sharp focus on the main subject. 
    Clean, uncluttered composition that highlights the product details.`
};
```

### 📛 FORBIDDEN_KEYWORDS (Palabras prohibidas)

```typescript
export const FORBIDDEN_KEYWORDS = [
  'nsfw', 'nude', 'naked', 'violence', 'blood', 'weapon',
  'drugs', 'alcohol', 'tobacco', 'gambling', 'scam',
  'hate', 'discrimination', 'harassment'
];
```

---

## 5. SYSTEM INSTRUCTIONS

### 📝 Análisis de URL (analyzeUrlContent)

```
Eres un EXPERTO ANALISTA DE MARKETING para Chile.

Tu tarea es analizar páginas web chilenas y extraer información completa para crear flyers publicitarios.

Responde en formato JSON EXACTO:
{
  "businessName": "Nombre del negocio",
  "tagline": "Lema o tagline principal",
  "description": "Descripción detallada (50-100 palabras en ESPAÑOL)",
  "products": ["producto1", "producto2"],
  "services": ["servicio1", "servicio2"],
  "promotions": ["promo1", "promo2"],
  "industry": "Una palabra",
  "visualStyle": "Descripción en INGLÉS",
  "primaryColors": ["#hex1", "#hex2"],
  "secondaryColors": ["#hex1"],
  "atmosphere": "Descripción del ambiente",
  "targetAudience": "A quién va dirigido",
  "keySellingPoints": ["punto1", "punto2"],
  "moodKeywords": ["palabra1", "palabra2"]
}
```

### 🎨 Mejora de Prompt (enhancePrompt)

```
You are an expert AI Prompt Engineer for image generation.
Your task is to take a raw Spanish description and translate the VISUAL DESCRIPTION into English.

IMPORTANT RULES:
1. Translate visual elements (lighting, composition, objects) to English.
2. PRESERVE LOCATION NAMES (e.g., "Santiago", "Torres del Paine").
3. TEXT PRESERVATION: If user wants specific text, keep it in SPANISH inside single quotes.
4. TEXT RENDERING: If text is requested, render it as a clean, minimalist 3D signage
   or a high-contrast overlay, ensuring it doesn't overlap with the main subject's face.
   Use clean typography with good contrast against the background.
5. Focus on physical details based on style: [STYLE_LABEL].
6. Return ONLY the enhanced prompt.
```

### 📱 Resumen en Español (enhancePrompt - Spanish)

```
Eres un asistente que resume descripciones visuales de negocios en español simple.
Tu tarea es crear un resumen BREVE y CLARO (máximo 50 palabras).
Usa español simple y directo. Solo el resumen, sin explicaciones.
```

### ✏️ Refinamiento de Descripción (refineDescription)

```
You are an expert image prompt editor.
Rewrite the English description to incorporate the user's Spanish instruction.
Return ONLY the new description.
```

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

IGNORE the background if it's messy or cluttered.
Format your response as a detailed English description suitable for AI image generation.
```

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

## 6. CONTEXTOS Y CONFIGURACIONES

### 🇨🇱 CHILEAN_BASE_CONTEXT (Aplicado a todas las imágenes)

```
LOCALE SETTING: Chile (South America).

1. FACES/PEOPLE: Subjects must have realistic Chilean phenotypes (mixed heritage). 
   Clothing: Modern urban western fashion suitable for temperate/cold weather 
   (jackets, hoodies, jeans). No traditional folk costumes unless specified.

2. TEXT & LANGUAGE: ANY visible text in the image MUST BE IN SPANISH (Chilean format).
   - STRICTLY NO ENGLISH TEXT (No "Sale", "Open", "Shop").
   - USE: "Oferta", "Abierto", "Liquidación", "Rico".
   - CURRENCY: Use Chilean Peso format with dot separator (e.g. "$1.000", "$5.990").
```

### 🏔️ CHILEAN_OUTDOOR_CONTEXT (Para estilos de paisaje)

```
GEOGRAPHIC SETTING: CHILE.

1. IF COAST/BEACH: Pacific Ocean (Dark blue/cold water, energetic waves, 
   grey or yellow coarse sand, rocky cliffs).
   - STRICTLY FORBIDDEN: Turquoise Caribbean water, white powder sand, coconut palm trees.

2. IF LAKE/SOUTH: Deep blue water, surrounding volcanoes, green pine/native forests 
   (Bosque Valdiviano), rainy or cloudy atmosphere.

3. IF CENTRAL ZONE (Santiago/Rapel): Mediterranean climate, dry brownish hills, 
   low bushes, urban trees, modern highways.

4. IF MOUNTAINS: The Andes (High, rocky, sharp peaks, snow-capped).

5. GENERAL BANS:
   - NO "Mexican" sepia filters or desert pueblo stereotypes.
   - NO Tropical Jungles.
   - NO Peruvian/Bolivian Altiplano aesthetics unless specifically asked.
```

### 🏠 CHILEAN_STUDIO_CONTEXT (Para estilos de interior/estudio)

```
BACKGROUND ENVIRONMENT:
- STUDIO / INDOOR SETTING.
- STRICTLY FORBIDDEN: Landscapes, Mountains, Skies, Outdoor scenery.
- Focus on the product/subject with the specific style background 
  (Solid color, texture, gradient, interior).
```

---

## 7. MAPA DE CONEXIONES

### 🔗 Conexión entre Estilos de Imagen y Dirección de Arte

```typescript
export const STYLE_TO_ART_DIRECTION_MAP: Record<string, number> = {
  // Estilos huérfanos mapeados a rubros con coherencia visual
  'summer_beach': 39,      // Verano/Turismo → Inmobiliaria/Turismo
  'art_double_exp': 61,    // Artístico/Teatro → Estilo Editorial Universal (NEUTRO)
  'retro_vintage': 61,     // Retro/Vintage → Estilo Editorial Universal (NEUTRO)
  'seasonal_holiday': 30,  // Festivo → Panadería
  
  // Mapeos adicionales para completar la cobertura
  'indie_grunge': 33,      // Rock/Música → Barbería
  'retail_sale': 1,        // Retail/Ofertas → Retail General
  'gastronomy': 46,        // Gastronomía → Sushi Nikkei
  'urban_night': 21,       // Noche/Discoteca → Entretención
  'corporate': 25,         // Corporativo → Servicios Profesionales
  'worship_sky': 23,       // Espiritual → Salud y Bienestar
  'kids_fun': 47,          // Infantil → Heladería
  'tech_saas': 57,         // Tecnología → Servicio Técnico
  'medical_clean': 42,     // Médico → Centro Dental
  'sport_gritty': 37,      // Deporte → Kinesiología
  'luxury_gold': 20,       // Lujo → Retail Premium
  'aesthetic_min': 35,     // Belleza → Yoga Studio
  'wellness_zen': 24,      // Wellness → Salud y Bienestar
  'eco_organic': 39,       // Ecológico → Jardinería
  'realestate_night': 16,  // Inmobiliaria → Retail Inmobiliario
  'auto_metallic': 26,     // Automotriz → Taller Mecánico
  'edu_sketch': 43,        // Educación → Óptica
  'podcast_mic': 44,       // Podcast → Librería
  'gamer_stream': 45,      // Gaming → Tattoo Studio
  'political_community': 17, // Política → Retail Comunitario
  'market_handwritten': 51, // Feria Libre → Florería
  'pilates': 36,           // Pilates → Kinesiología
  'typo_bold': 2,          // Tipografía → Retail Especializado
};
```

### 🔄 Flujo de Construcción de Prompt

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE CONSTRUCCIÓN DE PROMPT               │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   SUJETO     │    │    ESTILO    │    │   MODO DE    │
│   (Usuario)  │───▶│  (Imagen)    │───▶│   REALISMO   │
└──────────────┘    └──────────────┘    └──────────────┘
        │                  │                   │
        ▼                  ▼                   ▼
┌─────────────────────────────────────────────────────────────┐
│                    PROMPT BUILDER SERVICE                    │
│                                                             │
│  buildPrompt(input: PromptInput): string                    │
│  ├── sanitizeInput(text)                                    │
│  ├── REALITY_MODES[realityMode]                             │
│  └── buildPromptParts:                                      │
│      ├── SUBJECT: [cleanIndustry]                           │
│      ├── DETAILS: [cleanDetails]                            │
│      ├── STYLE_INSTRUCTION: [styleModifier]                 │
│      └── OUTPUT_FORMAT                                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              DIRECCIÓN DE ARTE (60 RUBROS)                   │
│                                                             │
│  buildArtDirectionPrompt(input: ArtDirectionInput): string  │
│  ├── getArtDirectionById(industryId)                        │
│  ├── ASSET: [userSubject]                                   │
│  ├── PRODUCT_DETAILS: [userDetails]                         │
│  ├── ART_DIRECTION: [config.prompt]                         │
│  ├── SOCIAL_MEDIA_SAFE_ZONE                                 │
│  └── NEGATIVE_PROMPT: [Agency Standard + config]            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    PROMPT FINAL                              │
│                                                             │
│  [ASSET] + [ART_DIRECTION] + [SAFE_ZONE] + [NEGATIVE]       │
│  + [CHILEAN_CONTEXT] + [REALITY_MODE]                       │
└─────────────────────────────────────────────────────────────┘
```

### 📊 Categorías Agrupadas

```typescript
export const ART_DIRECTION_CATEGORIES = {
  retail: {
    label: "Retail y Comercio",
    rubros: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  },
  food: {
    label: "Alimentación y Restaurantes",
    rubros: [22, 40, 46, 47, 48, 49, 50, 51, 52]
  },
  health: {
    label: "Salud y Bienestar",
    rubros: [24, 28, 41, 42, 43, 56]
  },
  services: {
    label: "Servicios Profesionales",
    rubros: [25, 31, 32, 33, 39]
  },
  lifestyle: {
    label: "Lifestyle y Entretención",
    rubros: [21, 29, 30, 34, 35, 36, 37, 38]
  },
  specialty: {
    label: "Tiendas Especializadas",
    rubros: [53, 54, 55, 57, 58, 59, 60]
  }
};
```

---

## 📈 RESUMEN ESTADÍSTICO

| Categoría | Prompts de Imagen | Prompts de Video | Dirección de Arte |
|-----------|-------------------|------------------|-------------------|
| Ventas | 4 | 1 | 2 |
| Corporativo | 5 | 1 | 6 |
| Lifestyle | 6 | 5 | 7 |
| Noche | 5 | 1 | 3 |
| Eventos | 7 | 7 | 5 |
| Especiales | - | 9 | - |
| Universal | - | - | 1 |
| **TOTAL** | **27** | **25** | **61** |

### 🎯 Gran Total: 113 Elementos del Sistema

- **Prompts de Imagen:** 27 estilos
- **Prompts de Video:** 25 estilos
- **Dirección de Arte:** 60 rubros
- **Reality Modes:** 3 modos
- **System Instructions:** 6 funciones
- **Contextos Chilenos:** 3 contextos

---

## 🗂️ ARCHIVOS RELACIONADOS

| Archivo | Propósito |
|---------|-----------|
| `PROMPTS-ESTUDIO-56.md` | Documento principal de prompts |
| `PROMPTS-COMPLETOS-ESTUDIO-56.md` | Informe completo con todos los detalles |
| `src/constants/artDirection.ts` | Configuración de rubros 1-20 |
| `src/constants/artDirectionPhase2.ts` | Configuración de rubros 21-40 |
| `src/constants/artDirectionPhase3.ts` | Configuración de rubros 41-60 |
| `src/constants/artDirectionIndex.ts` | Índice maestro y funciones de búsqueda |
| `src/constants/promptModifiers.ts` | Modificadores de realidad y palabras prohibidas |
| `src/services/promptBuilder.ts` | Servicio de construcción de prompts |
| `DIRECCION_ARTE_PROFESIONAL.md` | Documentación técnica del sistema |
| `DIRECCION_ARTE_PROFESIONAL_60_RUBROS.md` | Directorio completo de rubros |

---

---

## 8. MEJORAS ESTRATÉGICAS v2.0

### 🎯 Resumen de Cambios

| Mejora | Problema Original | Solución Implementada |
|--------|-------------------|----------------------|
| **ID 61 Universal** | retro_vintage mapeado a ferretería generaba "choque de estilos" | Creado estilo editorial neutral para estilos visuales fuertes |
| **Jerarquía de Modos** | Joyas/perfumería con realist mode perdían brillo | Rubros de lujo tienen aspirational como default |
| **Texto en Imágenes** | IA fallaba con texto sobre el sujeto | Añadida regla de "3D signage" y "no overlap face" |

### 🔧 Detalle Técnico de Mejoras

#### A. Estilo Editorial Universal (ID 61)

**Problema:** El mapeo original de `retro_vintage → 52 (Ferretería)` generaba resultados donde la IA intentaba incluir herramientas o texturas metálicas en un post de moda retro.

**Solución:** Crear un ID 61 que funciona como "lienzo en blanco" editorial:

```typescript
// El sistema ahora detecta estilos visuales fuertes y los redirige al ID 61
function getArtDirectionIdFromStyle(styleKey: string): number {
  const strongVisualStyles = ['retro_vintage', 'art_double_exp', 'seasonal_holiday'];
  
  if (strongVisualStyles.includes(styleKey)) {
    // Usar estilo universal para evitar "contaminación" de rubro
    return 61;
  }
  
  return STYLE_TO_ART_DIRECTION_MAP[styleKey] || 1;
}
```

#### B. Jerarquía de Modos para Rubros de Lujo

**Problema:** Un cliente de joyería que activaba "realist mode" obtenía fotos con luz de día y fondos blancos, matando el brillo y la exclusividad del producto.

**Solución:** Implementar modo recomendado por rubro:

```typescript
// El sistema sugiere el modo óptimo para cada rubro
function getOptimalRealityMode(rubroId: number): RealityMode {
  const luxuryRubros = [5, 8, 16, 17, 20, 45, 55, 57];
  
  if (luxuryRubros.includes(rubroId)) {
    // Joyas siempre usan aspirational por defecto
    return 'aspirational';
  }
  
  // Retail general usa realist
  return 'realist';
}

// El usuario puede cambiarlo manualmente si lo desea
function buildPromptWithModeHierarchy(
  subject: string,
  rubroId: number,
  userMode?: RealityMode
): string {
  const mode = userMode || getOptimalRealityMode(rubroId);
  return buildPrompt({ subject, realityMode: mode });
}
```

#### C. Mejora de Renderizado de Texto

**Problema:** Las IAs fallaban al renderizar texto, especialmente cuando se superponía sobre rostros o elementos complejos.

**Solución:** Añadir instrucciones específicas de composición:

```typescript
const TEXT_RENDER_PROMPT = `
If text is requested, apply these rules:
1. Render text as clean, minimalist 3D signage or high-contrast overlay
2. NEVER overlap text with the main subject's face
3. Use clean typography with good contrast against background
4. Place text in the upper third or lower third (safe zones)
5. If text must be near the subject, use negative space
6. Font style should match the overall aesthetic
`;
```

### 📊 Comparación Antes vs Después

| Aspecto | Antes (v1.0) | Después (v2.0) |
|---------|--------------|----------------|
| Estilos visuales fuertes | Mapeados a rubros específicos | ID 61 Universal |
| Rubros de lujo | Modo configurable libremente | Modo aspirational por defecto |
| Texto en imágenes | "Keep in Spanish quotes" | "3D signage, no overlap face" |
| Total rubros | 60 | 61 |
| Total elementos | 112 | 113 |

### ✅ Checklist de Calidad v2.0

- [x] ID 61 implementado como respaldo neutro
- [x] Jerarquía de modos para rubros de lujo
- [x] Mejora de prompt para texto en imágenes
- [x] Actualizado mapa de conexiones
- [x] Actualizado resumen estadístico
- [x] Documentadas todas las mejoras

---

*Reporte generado: Enero 2026*
*Versión: 2.0 - Con Mejoras Estratégicas*
*Sistema de Dirección de Arte Profesional v2.1 - Estudio 56*
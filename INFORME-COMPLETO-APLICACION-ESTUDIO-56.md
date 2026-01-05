# 📊 INFORME COMPLETO DE LA APLICACIÓN ESTUDIO 56

## Aplicación de Generación de Contenido Visual con Inteligencia Artificial

**Versión:** 2.0  
**Fecha:** Enero 2026  
**Tecnologías Principales:** React, TypeScript, Google Gemini API, Supabase

---

## 1. 📋 RESUMEN EJECUTIVO

Estudio 56 es una aplicación web de generación de contenido visual publicitario que utiliza inteligencia artificial para crear flyers, stories, videos y materiales de marketing para negocios chilenos. La aplicación integra múltiples servicios de IA, un sistema de dirección de arte profesional con 60 rubros especializados, y un regulador de realidad que permite ajustar el nivel de realismo de las imágenes generadas.

### Características Principales:
- 🎨 **60 rubros de dirección de arte** especializados por industria
- 🎚️ **Regulador de realidad (1.0 - 5.0 estrellas)** para control de realismo
- 📱 **Formatos múltiples:** 1:1, 9:16, 4:5, 16:9, 1:1.41 (Poster Pro)
- 🤖 **Generación de imágenes y videos** con Google Gemini API
- 📊 **Análisis inteligente de imágenes** para estilos de texto
- 💾 **Sistema de caché** para variaciones de realidad
- 🔐 **Autenticación y gestión de usuarios** con Supabase

---

## 2. 🏗️ ARQUITECTURA DE LA APLICACIÓN

### 2.1 Estructura de Archivos

```
estudio-56/
├── src/
│   ├── components/          # Componentes React
│   ├── services/            # Servicios de IA
│   ├── constants/           # Constantes y prompts
│   ├── hooks/               # Custom hooks
│   └── index.css           # Estilos globales
├── services/               # Servicios principales
├── database/               # Scripts SQL
├── scripts/                # Scripts de utilidad
└── public/                 # Archivos estáticos
```

### 2.2 Tecnologías y Dependencias

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.x | Framework UI |
| TypeScript | 5.x | Tipado estático |
| Google GenAI SDK | Latest | API de Gemini |
| Supabase | Latest | Backend as a Service |
| Tailwind CSS | 3.x | Estilización |
| Vite | 5.x | Build tool |

---

## 3. 🎨 SISTEMA DE DIRECCIÓN DE ARTE

### 3.1 Catálogo de 60 Rubros

La aplicación implementa un sistema de **Dirección de Arte Profesional** con 60 rubros especializados, cada uno con prompts específicos, negative prompts y configuraciones de composición.

#### **FASE 1: Retail y Estética (Rubros 1-20)**

| ID | Rubro | Estilo | Prompt Principal |
|----|-------|--------|------------------|
| 1 | Retail General | Commercial-Retail | Fotografía comercial limpia, iluminación de estudio |
| 2 | Moda Mujer | Fashion-Editorial | Look editorial de moda, luz natural suave |
| 3 | Moda Hombre | Streetwear-Urban | Vibra urbana, sombras duras, texturas gritty |
| 4 | Calzado | Product-Dynamic | Shot dinámico desde ángulo bajo |
| 5 | Joyas | Luxury-Jewelry | Macro extremo, bokeh, luz de borde |
| 6 | Óptica | Medical-Clean | Foco en lentes, composición simétrica |
| 7 | Belleza/Cosmética | Beauty-Soft | Texturas de piel, fondos pastel |
| 8 | Perfumería | Luxury-Fragrance | Iluminación etérea, partículas flotando |
| 9 | Bolsos/Carteras | Luxury-Bags | Flat-lay editorial, enfoque en texturas |
| 10 | Accesorios Tech | Tech-Cyber | Estética cyber-clean, RGB sutil |
| 11 | Smartphones | Tech-Premium | Reflejos de pantalla, espacio oscuro |
| 12 | Computación | Tech-Setup | Sombras profundas, teclado backlit |
| 13 | Gaming | Gaming-Esports | Saturación RGB, efectos glitch |
| 14 | Fotografía | Vintage-Camera | Cámaras vintage, luz golden hour |
| 15 | Audio/Sonido | Audio-Pro | Ondas visuales, tonos moody |
| 16 | Relojes | Luxury-Watch | Precisión relojería, fondo madera |
| 17 | Decoración | Interior-Design | Estilo revista de interiores |
| 18 | Muebles | Furniture-Catalog | Catálogo de muebles, fondo seamless |
| 19 | Iluminación | Lighting-Design | Contraste luz/sombra, filamento visible |
| 20 | Electrodomésticos | Appliance-Modern | Reflejos acero, cocina moderna |

#### **FASE 2: Salud y Deporte (Rubros 21-40)**

| ID | Rubro | Estilo | Prompt Principal |
|----|-------|--------|------------------|
| 21 | Gimnasio/Deporte | Sport-Gritty | Fotografía deportiva gritty, sudor visible |
| 22 | Gastronomía | Gastronomy | Fotografía Michelin, vapor ascendente |
| 23 | Spa/Wellness | Wellness-Zen | Velas, bambú, ripples de agua |
| 24 | Médico/Clínico | Medical-Clean | Ambiente clínico estéril, luz brillante |
| 25 | Corporativo | Corporate | Editorial corporativo estilo Forbes |
| 26 | Inmobiliaria | Real-Estate | Fotografía arquitectónica nocturna |
| 27 | Automotriz | Auto-Metallic | Render CGI automotriz, reflejos |
| 28 | Mascotas | Pets | Veterinaria, ambiente cálido |
| 29 | Viajes | Travel | Paisajes turísticos, luz de viaje |
| 30 | Construcción | Construction | Obra en progreso, trabajadores |

#### **FASE 3: Servicios Especializados (Rubros 31-60)**

| ID | Rubro | Estilo | Prompt Principal |
|----|-------|--------|------------------|
| 31 | Taller Mecánico | Mechanic-Workshop | Auto en elevador, herramientas |
| 32 | Vulcanización | Tire-Service | Neumáticos, equipamiento profesional |
| 33 | Barbería | Barber-Shop | Silla de cuero, espejos LED |
| 34 | Veterinaria | Veterinary-Clinic | Mascota en mesa de examen |
| 35 | Yoga | Yoga-Studio | Persona en pose yoga, luz natural |
| 36 | Pilates | Pilates | Reformer, estudio limpio |
| 37 | Kinesiología | Physiotherapy | Equipamiento rehabilitación |
| 38 | Estudio Jurídico | Law-Office | Oficina profesional, libreros |
| 39 | Jardinería | Gardening | Jardín verde, herramientas |
| 40 | Seguridad | Security-Systems | Cámaras CCTV, monitoreo digital |

---

## 4. 🤖 INTELIGENCIAS ARTIFICIALES UTILIZADAS

### 4.1 Google Gemini API

La aplicación utiliza **Google Gemini API** como motor principal de generación de imágenes y análisis.

#### **Modelos Utilizados**

| Modelo | Uso | Calidad | Velocidad |
|--------|-----|---------|-----------|
| `gemini-2.5-flash-image` | Borradores (Draft) | Media | Rápida |
| `gemini-3.0-flash-exp` | Imágenes HD | Alta | Media |
| `gemini-3-pro-image-preview` | Mejora de imágenes | Alta | Media |
| `gemini-3-flash-preview` | Análisis y prompts | Media | Rápida |
| `gemini-1.5-flash` | Análisis de imágenes | Media | Rápida |
| `veo-3.1-generate-preview` | Generación de video | Alta | Lenta |

#### **Configuración de Generación**

```typescript
// Parámetros principales
interface ImageGenerationConfig {
  aspectRatio: '1:1' | '9:16' | '16:9' | '4:5' | '1080x1080' | '1080x1920';
  imageSize: '1K' | '4K';  // Solo para HD
  seed: number;  // Para consistencia
  quality: 'draft' | 'hd';
}
```

### 4.2 Servicios de IA Implementados

#### **4.2.1 geminiService.ts**

Servicio principal para generación de imágenes y videos.

##### Funciones Principales:

| Función | Descripción | Endpoint |
|---------|-------------|----------|
| `generateImage()` | Genera imagen simple | `models.generateContent` |
| `generateFlyerImage()` | Genera flyer completo | `models.generateContent` |
| `generateHDFromDraft()` | Mejora borrador a HD | `models.generateContent` |
| `enhanceUserImage()` | Mejora imagen subida | `models.generateContent` |
| `analyzeUrlContent()` | Analiza URL para extraer estilo | `models.generateContent` |
| `generatePersuasiveText()` | Genera texto persuasivo | `models.generateContent` |
| `generateImageEdit()` | Edita imagen existente | `models.generateContent` |
| `generateVideoEdit()` | Edita video existente | `models.generateVideos` |

##### Prompts del Sistema:

```typescript
// MASTER_STYLE - Estilo maestro para todas las generaciones
const MASTER_STYLE = `
Professional social media flyer design. 
Aesthetic: GraphicRiver bestseller, glossy finish, 
ultra-detailed, commercial photography, 8k resolution, 
Unreal Engine 5 render style.
`;

// CHILEAN_BASE_CONTEXT - Contexto chileno
const CHILEAN_BASE_CONTEXT = `
LOCALE SETTING: Chile (South America).
1. FACES/PEOPLE: Subjects must have realistic Chilean phenotypes.
2. TEXT & LANGUAGE: ANY visible text MUST BE IN SPANISH.
   - STRICTLY NO ENGLISH TEXT
   - USE: "Oferta", "Abierto", "Liquidación", "Rico"
   - CURRENCY: Use Chilean Peso format with dot separator (e.g. "$1.000")
`;
```

#### **4.2.2 imageAnalysisService.ts**

Analiza imágenes para extraer información visual y recomendar estilos de texto.

##### Función Principal:

```typescript
analyzeImageForTextStyle(imageDataUrl: string): Promise<ImageAnalysisResult>
```

##### Salida:

```typescript
interface ImageAnalysisResult {
  dominantColors: string[];      // Colores dominantes
  mood: 'elegant' | 'modern' | 'corporate' | 'artistic' | 'playful' | 'luxury' | 'minimalist';
  lighting: 'bright' | 'soft' | 'dramatic' | 'warm' | 'cool';
  style: 'clean' | 'vibrant' | 'muted' | 'neon' | 'metallic' | 'organic';
  recommendedTextStyle: {
    fontFamily: string;
    fontWeight: string;
    color: string;
    textShadow: string;
    gradient?: string;
  };
}
```

##### Modelo Utilizado: `gemini-3-flash-preview`

#### **4.2.3 realitySliderService.ts**

Gestiona el regulador de realidad y caché de variaciones.

##### Funciones Principales:

| Función | Descripción |
|---------|-------------|
| `handleStarsChange()` | Cambia nivel de realidad |
| `generateAllVariations()` | Genera todas las variaciones |
| `getCachedVariation()` | Obtiene variación cacheada |
| `saveVariationToCache()` | Guarda variación en caché |
| `buildGeminiPromptWithReality()` | Construye prompt con nivel de realidad |

##### Niveles de Realidad:

| Nivel | Etiqueta | Descripción |
|-------|----------|-------------|
| 1.0 | Raw | Fotografía cruda de smartphone |
| 1.5 | Authentic | Más real, menos procesado |
| 2.0 | Natural | Equilibrio natural |
| 2.5 | Professional | Estándar profesional |
| 3.0 | Polished | Más pulido |
| 3.5 | Editorial | Estilo editorial |
| 4.0 | Premium | Alta calidad premium |
| 4.5 | Luxury | Estilo de lujo |
| 5.0 | Ultimate | Máxima calidad |

#### **4.2.4 visualMimicryService.ts**

Analiza el ADN cromático de imágenes y genera modos de fusión.

##### Función Principal:

```typescript
analyzeVisualMimicry(imageDataUrl: string): Promise<VisualMimicryResult>
```

##### Salida:

```typescript
interface VisualMimicryResult {
  extractedColors: {
    accentColor: string;      // Color de acento
    primaryPalette: string[]; // Paleta primaria
    secondaryPalette: string[]; // Paleta secundaria
  };
  blendMode: {
    mode: string;             // Modo de fusión
    opacity: number;          // Opacidad
  };
  noise: {
    hasNoise: boolean;        // Tiene ruido
    noiseType: string;        // Tipo de ruido
  };
  depthOfField: {
    hasBokeh: boolean;        // Tiene bokeh
    focusPoint: { x: number; y: number };
  };
}
```

#### **4.2.5 contextualTypographyService.ts**

Analiza tipografía contextual y genera estilos.

##### Funciones:

```typescript
analyzeContextualTypography(imageDataUrl: string, imageAnalysis: ImageAnalysisResult): Promise<ContextualTypographyResult>
generateContextualStyles(contextualTypography: ContextualTypographyResult): any
generateContextualClasses(contextualTypography: ContextualTypographyResult): string
```

#### **4.2.6 contrastAnalysisService.ts**

Analiza el contraste de la imagen para optimización de texto.

##### Función Principal:

```typescript
analyzeImageContrast(imageDataUrl: string, focusPoint: { x: number; y: number }): Promise<ContrastAnalysis>
```

##### Salida:

```typescript
interface ContrastAnalysis {
  overallContrast: number;      // Contraste general (0-1)
  brightness: number;           // Brillo (0-1)
  dynamicRange: number;         // Rango dinámico
  recommendedTextColor: string; // Color recomendado para texto
  recommendedShadow: string;    // Sombra recomendada
  contrastScore: number;        // Puntuación de contraste
}
```

#### **4.2.7 contextualEffectsService.ts**

Analiza efectos contextuales y genera estilos de efectos.

##### Función Principal:

```typescript
analyzeContextualEffects(imageDataUrl: string, imageAnalysis: ImageAnalysisResult): Promise<ContextualEffects>
```

#### **4.2.8 compositionAnalysisService.ts**

Analiza composición para posicionamiento automático de texto.

##### Función Principal:

```typescript
analyzeCompositionForText(imageDataUrl: string, enhancedDescription: string, aspectRatio: AspectRatio): Promise<CompositionAnalysisResult>
```

##### Salida:

```typescript
interface CompositionAnalysisResult {
  safeZones: {
    top: { start: number; end: number };
    middle: { start: number; end: number };
    bottom: { start: number; end: number };
  };
  focalPoint: { x: number; y: number };
  compositionType: 'centered' | 'rule-of-thirds' | 'diagonal' | 'symmetrical';
  recommendedTextPosition: 'top' | 'middle' | 'bottom';
  visualBalance: number;
}
```

---

## 5. 📝 PROMPTS DEL SISTEMA

### 5.1 Prompts de Guardrail (Negativos)

#### **GLOBAL_NEGATIVE_SHIELD**
```typescript
const GLOBAL_NEGATIVE_SHIELD = `
text, letters, words, logo, watermark, distorted characters, 
floating objects, extra limbs, morphing faces, sliding feet, 
anti-gravity, supernatural movement, distorted physics, 
glitching bodies, impossible perspectives, unrealistic skin, 
plastic textures, candles, smoke, steam, fog, water on floor, 
neon, fused objects, floating people, melting equipment, liquid floors
`;
```

#### **ANATOMY_SHIELD** (Prevención de errores anatómicos)
```typescript
const ANATOMY_SHIELD = `
deformed anatomy, disfigured body, extra limbs, fused limbs, 
feet on head, backwards limbs, inverted body, distorted proportions, 
morphing body parts, anatomical nonsense, floating body parts, 
wrong limb placement, upside down body, head at bottom, feet at top, 
merged body parts, twisted torso, dislocated joints, impossible bone structure, 
human deformation, body horror, creature features
`;
```

#### **ANTI_FANTASY_SHIELD** (Ambiente de negocio real)
```typescript
const ANTI_FANTASY_SHIELD = `
hotel lobby, luxury resort, marble palace, futuristic architecture, 
sterile, excessive gold, clinical white, unreachable luxury, 
3d render look, plastic textures, perfect symmetry, 
science fiction style, cathedral ceiling, reflective water floor, 
spa atmosphere, luxury candles, decorative smoke, vapor trails, fog effects
`;
```

#### **ANTI_MODEL_SHIELD** (Personas auténticas)
```typescript
const ANTI_MODEL_SHIELD = `
supermodel look, heavy makeup, plastic surgery look, perfect porcelain skin, 
bodybuilder physique, staring at camera, fake smile, airbrushed face, 
doll-like features
`;
```

#### **VIDEO_TEXT_BLOCK** (Bloqueo de texto en videos)
```typescript
const VIDEO_TEXT_BLOCK = `
VIDEO_TEXT_BLOCK_STRICT:
- FORBIDDEN: text, letters, words, numbers, symbols, characters of any kind
- FORBIDDEN: text on walls, signs, menus, products, clothing, surfaces
- FORBIDDEN: superimposed text, titles, captions, on-screen graphics
- FORBIDDEN: branding text, logos, price tags, labels with writing
- MANDATORY: Blank walls, empty signs, plain products, no writing anywhere
- MANDATORY: Pure video content only - NO typography, NO graphics, NO text overlays
- This is a RAW VIDEO, not a finished advertisement - NO text elements
- Zero tolerance: Any text in the video = FAILED generation
`;
```

### 5.2 Prompts de Estilo por Categoría

#### **FLYER_STYLES** (60 estilos visuales)

##### Estilos de VENTAS:

| Estilo | Prompt |
|--------|--------|
| retail_sale | `High-End 3D Commercial Art. Tech: Cinema 4D, Octane Render. Composition: Dynamic zero-gravity explosion, floating 3D percentage signs. Lighting: Studio softbox, vibrant rim lights.` |
| gastronomy | `Michelin-Star Food Photography. Camera: 100mm Macro. Lighting: Backlit with warm golden light. Details: Visible water droplets, smoke rising.` |
| auto_metallic | `Automotive Commercial CGI. Render: Unreal Engine 5, Raytraced reflections. Texture: Carbon fiber, brushed aluminum.` |

##### Estilos CORPORATIVOS:

| Estilo | Prompt |
|--------|--------|
| corporate | `Premium Corporate Editorial (Forbes Magazine style). Camera: Canon EOS R5, 50mm f/1.8. Background: Blurred modern glass architecture.` |
| medical_clean | `Sterile Medical Design. Palette: Pure White and Light Cyan. Lighting: Bright, shadowless clinical light.` |
| tech_saas | `Abstract High-Tech Data Visualization. Elements: Network nodes, floating isometric 3D cubes. Palette: Deep Royal Blue and glowing cyan.` |

##### Estilos LIFESTYLE:

| Estilo | Prompt |
|--------|--------|
| aesthetic_min | `Minimalist Product Photography (Instagram Clean Girl Trend). Lighting: Soft-focus natural window light. Palette: Monochromatic Beige, Cream, White, Sage Green.` |
| wellness_zen | `Zen Wellness Photography. Lighting: Soft candle light. Elements: Water ripples, bamboo, steam. Palette: Earthy Browns, Greens, Soft White.` |
| sport_gritty | `Gritty Sports Commercial Photography (Nike Campaign). Lighting: Rembrandt Lighting, high contrast, harsh rim light.` |

##### Estilos NOCHE:

| Estilo | Prompt |
|--------|--------|
| urban_night | `Cyberpunk Nightlife / Concert Photography. Tech: Volumetric fog, Laser lights. Palette: Neon Purple, Cyan, Magenta against deep blacks.` |
| luxury_gold | `Luxury Royal Aesthetic. Materials: Gold foil, black silk, marble, glitter. Lighting: Soft, warm, sparkling bokeh.` |
| gamer_stream | `3D Esports Tournament Art. Effects: Glitch art, digital distortion. Palette: Neon Green or Twitch Purple.` |

### 5.3 Prompts de Dirección de Arte por Rubro

#### **Ejemplo: Rubro 5 - Joyas**

```typescript
const JEWELRY_PROMPT = `
Extreme macro photography at jewelry scale, beautiful bokeh highlights 
from studio lights, dramatic rim lighting on metallic edges creating sparkle, 
luxury velvet textures as background, diamond and gemstone fire visible. 
Professional jewelry photography with light refraction analysis.
`;

const JEWELRY_NEGATIVE = `
(low quality, blurry text, amateur layout, stretched image, cheap flyer, 
cluttered design, flat lighting, no sparkle, dull metal, blurry gemstone, 
amateur product shot, inconsistent reflections)
`;
```

#### **Ejemplo: Rubro 13 - Gaming**

```typescript
const GAMING_PROMPT = `
High-energy RGB saturation with neon colors exploding, glitch art effects 
and digital artifacts, dark industrial background with metal textures, 
aggressive gaming typography with angular designs. Esports tournament aesthetic.
`;

const GAMING_NEGATIVE = `
(low quality, blurry text, amateur layout, stretched image, cheap flyer, 
cluttered design, flat colors, no RGB, amateur gaming setup, inconsistent 
lighting, cartoony graphics, low contrast)
`;
```

### 5.4 Prompts de Video

#### **Estructura del Prompt de Video**

```
[DESCRIPCIÓN VISUAL] + [MOVIMIENTO DE CÁMARA] + [ACCIÓN DEL SUJETO] + High resolution, cinematic 4k.
```

#### **Ejemplo: video_gastronomy**

```typescript
const VIDEO_GASTRONOMY_PROMPT = `
Gourmet burger with melting cheese and steam. Extreme close-up. 
Cheese slowly oozing down the side of the burger. Steam rising gracefully. 
Sauce being poured in slow motion from above. High resolution, cinematic 4k.
`;

const MOTION_STYLE = "Cheese oozing, steam rising, sauce pouring slow motion";
```

### 5.5 Prompts de Análisis

#### **Análisis de Imagen para Estilos de Texto**

```typescript
const ANALYSIS_PROMPT = `
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
    "textShadow": "shadow-description"
  }
}

Enfócate en:
1. Colores dominantes
2. Mood general
3. Tipo de iluminación
4. Estilo visual
5. Recomendaciones para texto

Responde SOLO con el JSON, sin texto adicional.
`;
```

---

## 6. 🔧 SERVICIOS Y ENDPOINTS

### 6.1 Supabase Service

#### **Configuración**

```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
```

#### **Variables de Entorno**

| Variable | Descripción |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clave anónima del proyecto |
| `VITE_GEMINI_API_KEY` | Clave de Google Gemini API |

#### **Tipos de Datos**

```typescript
interface User {
  id: string;
  email: string;
  created_at: string;
  plan: string;
  credits: number;
}

interface Flyer {
  id: string;
  user_id: string;
  title: string;
  description: string;
  style_key: string;
  aspect_ratio: string;
  media_type: string;
  image_quality: string;
  image_url?: string;
  video_url?: string;
  created_at: string;
  updated_at: string;
}

interface UserPlan {
  id: string;
  name: string;
  price: number;
  credits_per_month: number;
  features: string[];
}
```

### 6.2 Endpoints de API

#### **Google Gemini API**

| Endpoint | Método | Uso |
|----------|--------|-----|
| `models.generateContent` | POST | Generación de imágenes |
| `models.generateVideos` | POST | Generación de videos |
| `operations.getVideos` | GET | Estado de operación de video |

#### **Supabase (PostgreSQL)**

| Tabla | Operaciones | Descripción |
|-------|-------------|-------------|
| `users` | SELECT, INSERT, UPDATE | Usuarios y autenticación |
| `flyers` | CRUD completo | Flyers generados |
| `user_plans` | SELECT | Planes de usuario |
| `credits` | SELECT, UPDATE | Sistema de créditos |
| `reality_variations` | CRUD | Variaciones de realidad |

---

## 7. 📱 COMPONENTES PRINCIPALES

### 7.1 Dashboard

El componente principal que gestiona la generación de contenido visual.

### 7.2 StoryArtStyleSelector

Selector de estilos visuales para Story Art con 7 estilos únicos:

| ID | Estilo | Descripción |
|----|--------|-------------|
| vogue_negative | Vogue Negative | Estilo editorial de moda negativo |
| neon_kinetic | Neon Kinetic | Neón cinético urbano |
| macro_essence | Macro Essence | Macro de producto |
| cinematic_frame | Cinematic Frame | Marco cinematográfico |
| collage_dynamic | Collage Dynamic | Collage dinámico |
| marble_sculpture | Marble Sculpture | Escultura de mármol |
| anime_to_real | Anime to Real | Anime a realista |

### 7.3 RealitySlider

Componente del regulador de realidad con:

- Slider de 1.0 a 5.0 estrellas
- Vista previa de variaciones
- Caché local con localStorage
- Generación bajo demanda

### 7.4 FlyerForm

Formulario de generación con:

- Descripción del negocio
- Selección de formato (1:1, 9:16, 4:5, 16:9)
- Selección de estilo visual
- Calidad (Draft/HD)
- Modo de realidad

### 7.5 RealityComparator

Comparador de variaciones con:

- Vista lado a lado
- Slider de comparación
- Puntuación de coherencia

---

## 8. 🎛️ SISTEMA DE REGULADOR DE REALIDAD

### 8.1 Configuraciones por Nivel

```typescript
const REALITY_CONFIGS: Record<RealityLevel, RealityPromptConfig> = {
  1.0: {
    stars: 1.0,
    label: "Raw",
    description: "Fotografía cruda de smartphone",
    technicalProfile: "Smartphone photography, amateur aesthetic",
    lighting: "Overhead fluorescent, some shadows",
    human: "Real people, natural sweat, authentic effort",
    negative: "No filters, no professional lighting, no polish"
  },
  2.5: {
    stars: 2.5,
    label: "Professional",
    description: "Estándar profesional",
    technicalProfile: "Professional commercial photography",
    lighting: "Natural window daylight",
    human: "Real everyday people, authentic appearance",
    negative: "No excessive polish, no luxury elements"
  },
  5.0: {
    stars: 5.0,
    label: "Ultimate",
    description: "Máxima calidad editorial",
    technicalProfile: "8k render, Unreal Engine 5",
    lighting: "Cinematic lighting, perfect softboxes",
    human: "Perfect skin, no visible pores, airbrushed",
    negative: "No imperfections, no dust, no scuff marks"
  }
};
```

### 8.2 Caché de Variaciones

El sistema implementa caché en dos niveles:

1. **Memoria local (localCache):** Variaciones en memoria
2. **localStorage:** Persistencia de variaciones

```typescript
// Estructura de variación cacheada
interface RealityVariation {
  id: string;
  parent_scene_id: string;
  seed: number;
  stars: RealityLevel;
  image_url: string;
  prompt_used: string;
  created_at: Date;
  cached: boolean;
}
```

---

## 9. 🔒 SISTEMA DE SEGURIDAD

### 9.1 Guardrails Implementados

1. **Bloqueo de texto:** Evita generación de texto en imágenes
2. **Filtro anatómico:** Previene errores de anatomía humana
3. **Filtro de realismo:** Mantiene consistencia visual
4. **Sanitización de inputs:** Previene inyecciones de prompt
5. **Validación de contenido:** Filtra contenido inapropiado

### 9.2 Palabras Prohibidas

```typescript
const FORBIDDEN_KEYWORDS = [
  'violence', 'blood', 'weapons', 'drugs', 'abuse',
  'hate', 'discrimination', 'explicit', 'nsfw'
];
```

---

## 10. 📊 FLUJOS DE GENERACIÓN

### 10.1 Flujo de Generación de Imagen

```
1. Usuario ingresa descripción
2. Selección de rubro (1-60)
3. Selección de formato (1:1, 9:16, etc.)
4. Selección de calidad (Draft/HD)
5. Generación de prompt con dirección de arte
6. Envío a Gemini API
7. Recepción y validación de imagen
8. Diagnóstico y corrección (si es necesario)
9. Análisis inteligente de imagen
10. Generación de estilos de texto
11. Presentación al usuario
```

### 10.2 Flujo de Mejora a HD

```
1. Usuario selecciona borrador
2. Conversión de imagen a base64
3. Construcción de prompt de mejora
4. Envío a Gemini con imagen de referencia
5. Recepción de imagen HD
6. Diagnóstico y corrección
7. Análisis completo de imagen HD
8. Actualización de estilos de texto
```

### 10.3 Flujo de Análisis de URL

```
1. Usuario ingresa URL
2. Envío a Gemini para análisis
3. Extracción de información:
   - Nombre del negocio
   - Descripción
   - Productos/Servicios
   - Estilo visual
   - Colores
   - Audiencia objetivo
4. Generación de prompt basado en análisis
5. Presentación de resultados
```

---

## 11. 💳 SISTEMA DE CRÉDITOS

### 11.1 Planes Disponibles

| Plan | Precio | Créditos/Mes | Características |
|------|--------|--------------|-----------------|
| Free | $0 | 5 | Generación básica |
| Pro | $19.900 | 50 | HD + Análisis completo |
| Agency | $49.900 | 200 | Todo + Variaciones + Video |

### 11.2 Consumo de Créditos

| Operación | Costo |
|-----------|-------|
| Draft Image | 1 crédito |
| HD Image | 3 créditos |
| Análisis de URL | 1 crédito |
| Variación de Realidad | 1 crédito |
| Video (Draft) | 5 créditos |
| Video (Production) | 15 créditos |

---

## 12. 📈 ESTADÍSTICAS Y MÉTRICAS

### 12.1 Métricas de Caché

```typescript
interface CacheStats {
  totalScenes: number;        // Total de escenas
  totalVariations: number;    // Total de variaciones
  oldestVariation: Date | null;
  newestVariation: Date | null;
}
```

### 12.2 Puntuación de Coherencia

El sistema calcula una puntuación de coherencia para ediciones:

```typescript
interface CoherenceResult {
  isCoherent: boolean;        // Si es coherente
  score: number;              // Puntuación (0-1)
  issues: string[];           // Problemas encontrados
}
```

---

## 13. 🚀 OPTIMIZACIONES

### 13.1 Rendimiento

- **Timeout de 8 segundos** para generación de texto
- **Timeout de 20 segundos** para análisis de URL
- **Análisis inteligente** solo para HD (no para borradores)
- **Caché de variaciones** para evitar regeneraciones

### 13.2 Consistencia Visual

- **Seed fijo** para mantener consistencia entre Draft y HD
- **Mismo prompt** para todas las calidades
- **Variaciones con mismo seed** para comparabilidad

### 13.3 Corrección de Imágenes

El sistema implementa diagnóstico y corrección automática:

```typescript
// Detecta imágenes en negro (>80% píxeles oscuros)
if (blackPixelRatio > 0.8 || avgBrightness < 20) {
  // Aplica corrección: brillo(1.5) contraste(1.3) saturate(1.2)
}
```

---

## 14. 🔧 CONFIGURACIÓN Y VARIABLES DE ENTORNO

### 14.1 Variables Requeridas

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
VITE_GEMINI_API_KEY=tu-clave-de-gemini
```

### 14.2 Configuración de Netlify

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 15. 📝 CONCLUSIONES

### 15.1 Fortalezas del Sistema

1. **Dirección de arte profesional** con 60 rubros especializados
2. **Regulador de realidad** único en el mercado
3. **Análisis inteligente** de imágenes para estilos de texto
4. **Sistema de caché** eficiente para variaciones
5. **Consistencia visual** mediante seed fijo
6. **Bloqueo de texto** robusto para imágenes limpias
7. **Contexto chileno** específico para el mercado local

### 15.2 Áreas de Mejora

1. **Generación de video** actualmente deshabilitada
2. **Persistencia en base de datos** pendiente de implementación
3. **Modo offline** no disponible actualmente
4. **Colaboración en tiempo real** no implementada

### 15.3 Roadmap Futuro

- [ ] Implementación completa de video con VEO
- [ ] Sistema de colaboración multiusuario
- [ ] Templates personalizables
- [ ] Integración con más plataformas de redes sociales
- [ ] Modo batch para generación masiva
- [ ] API pública para integraciones

---

**Documento generado el 5 de Enero de 2026**  
**Aplicación: Estudio 56 v2.0**  
**Tecnologías: React, TypeScript, Google Gemini API, Supabase**
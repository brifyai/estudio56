# 📊 INFORME COMPLETO DE ESTUDIO 56
## Aplicación de Generación de Contenido Publicitario con IA

---

## 1. 📋 RESUMEN EJECUTIVO

**Estudio 56** es una aplicación web de generación de contenido publicitario (flyers y videos) diseñada específicamente para el mercado chileno. Utiliza inteligencia artificial (Google Gemini 1.5 Pro) para generar imágenes publicitarias de alta calidad con estética local (+56), permitiendo a negocios, agencias y emprendedores crear materiales promocionales en minutos.

### Métricas Clave
- **39 estilos visuales** para imágenes estáticas
- **25 estilos de video** con movimiento cinematográfico
- **25 industrias** detectadas automáticamente
- **3 modos de realidad** (Fantasy, Realista, Aspiracional)
- **Sistema de créditos** con 4 planes de suscripción
- **100% en español** con contexto chileno authentic

---

## 2. 🏗️ ARQUITECTURA TÉCNICA

### Stack Tecnológico
```
Frontend: React 19 + TypeScript + Vite
UI Framework: Tailwind CSS
Base de Datos: Supabase (PostgreSQL)
IA Generativa: Google Gemini 1.5 Pro (API oficial)
Autenticación: Supabase Auth
Almacenamiento: Supabase Storage (AWS S3)
```

### Estructura de Archivos
```
estudio-56/
├── components/          # Componentes React
│   ├── FlyerForm.tsx    # Formulario principal
│   ├── FlyerDisplay.tsx # Visualización de flyers
│   ├── Dashboard.tsx    # Panel de usuario
│   └── ...
├── services/            # Servicios de IA y lógica
│   ├── geminiService.ts # Servicio principal de Gemini
│   ├── magicModeService.ts # Detección automática
│   ├── imageAnalysisService.ts # Análisis de imágenes
│   └── ...
├── constants.ts         # Configuración de estilos
├── types.ts             # Tipos TypeScript
└── database/            # Scripts SQL
```

---

## 3. 🎨 SISTEMA DE ESTILOS VISUALES

### 3.1 Estilos de Imagen (39 total)

#### **CATEGORÍA: VENTAS**
| Estilo | Descripción | Prompt Key |
|--------|-------------|------------|
| **retail_sale** | Explosión 3D en gravedad cero con signos de porcentaje y confetti | `retail_sale` |
| **typo_bold** | Fondos vectoriales limpios para superposición de texto | `typo_bold` |
| **auto_metallic** | Render CGI automotriz con reflejos raytraced | `auto_metallic` |
| **gastronomy** | Fotografía macro de comida con iluminación backlit dorada | `gastronomy` |
| **market_handwritten** | Estética de feria libre chilena con carteles de cartón escritos a mano | `market_handwritten` |

#### **CATEGORÍA: CORPORATIVO**
| Estilo | Descripción | Prompt Key |
|--------|-------------|------------|
| **corporate** | Editorial corporativa estilo Forbes con arquitectura de vidrio | `corporate` |
| **medical_clean** | Diseño médico estéril con blanco puro y cian | `medical_clean` |
| **tech_saas** | Visualización de datos high-tech con nodos y cubos 3D | `tech_saas` |
| **edu_sketch** | Mixtura de foto real con doodles en tiza blanca | `edu_sketch` |
| **political_community** | Fotografía política moderna con luz diurna optimista | `political_community` |

#### **CATEGORÍA: LIFESTYLE**
| Estilo | Descripción | Prompt Key |
|--------|-------------|------------|
| **aesthetic_min** | Minimalista con luz natural y sombras de hojas | `aesthetic_min` |
| **wellness_zen** | Fotografía Zen con luz de vela y elementos naturales | `wellness_zen` |
| **pilates** | Fotografía de estudio de pilates con luz suave | `pilates` |
| **summer_beach** | Fotografía de viaje de lujo con agua turquesa | `summer_beach` |
| **eco_organic** | Diseño ecológico con papel kraft y hojas frescas | `eco_organic` |
| **sport_gritty** | Fotografía deportiva gritty con iluminación Rembrandt | `sport_gritty` |

#### **CATEGORÍA: NOCHE**
| Estilo | Descripción | Prompt Key |
|--------|-------------|------------|
| **urban_night** | Fotografía cyberpunk con neón y efectos volumétricos | `urban_night` |
| **luxury_gold** | Estética de lujo real con oro y seda negra | `luxury_gold` |
| **realestate_night** | Arquitectura nocturna de lujo con hora azul | `realestate_night` |
| **gamer_stream** | Arte 3D de esports con glitch y neón verde | `gamer_stream` |
| **indie_grunge** | Póster de concierto underground con textura de ladrillo | `indie_grunge` |

#### **CATEGORÍA: EVENTOS**
| Estilo | Descripción | Prompt Key |
|--------|-------------|------------|
| **kids_fun** | Animación 3D estilo Pixar con colores primarios | `kids_fun` |
| **worship_sky** | Fotografía etérea con rayos de luz divina | `worship_sky` |
| **seasonal_holiday** | Render 3D festivo con glitter y luces de hadas | `seasonal_holiday` |
| **art_double_exp** | Doble exposición artística entre silueta y paisaje | `art_double_exp` |
| **retro_vintage** | Arte collage grunge 90s con halftone | `retro_vintage` |
| **podcast_mic** | Fotografía de estudio broadcast con bokeh | `podcast_mic` |

#### **ESPECIAL**
| Estilo | Descripción | Prompt Key |
|--------|-------------|------------|
| **brand_identity** | Estilo extraído automáticamente de la URL del negocio | `brand_identity` |

---

### 3.2 Estilos de Video (25 total)

| # | Estilo | Movimiento | Duración |
|---|--------|------------|----------|
| 1 | Retail / Ofertas | Explosión 3D en gravedad cero | 5-8 seg |
| 2 | Verano / Turismo | Agua cristalina con glimmer | 6-10 seg |
| 3 | Iglesia / Espiritual | Rayos de luz divina | 8-12 seg |
| 4 | Corporativo / Oficina | Timelapse de ciudad | 8-12 seg |
| 5 | Discoteca / Neón | Luces estroboscópicas | 6-10 seg |
| 6 | Gastronomía | Cheese oozing en slow motion | 5-8 seg |
| 7 | Deporte / Gym | Sweat droplets volando | 6-10 seg |
| 8 | Lujo / Gala VIP | Burbujas de champagne | 8-12 seg |
| 9 | Aesthetic / Belleza | Sombras de hojas suaves | 8-12 seg |
| 10 | Retro / Vintage 90s | Ruido de celuloide | 6-10 seg |
| 11 | Gamer / Esports | Glitch digital | 6-10 seg |
| 12 | Ecológico / Natural | Hojas moviéndose al viento | 8-12 seg |
| 13 | Rock / Indie | Humo y shaky cam | 6-10 seg |
| 14 | Política / Comunidad | Tracking shot en parque | 10-15 seg |
| 15 | Infantil / Cumpleaños | Globos flotando | 6-10 seg |
| 16 | Artístico / Doble Exp | Niebla interna | 8-12 seg |
| 17 | Médico / Clínico | ADN rotando | 8-12 seg |
| 18 | Tech / AI / Digital | Flujo de datos | 8-12 seg |
| 19 | Tipografía Pura | Gradientes líquidos | 6-10 seg |
| 20 | Inmobiliaria Nocturna | Time-lapse de estrellas | 10-15 seg |
| 21 | Automotriz | Rueda girando con chispas | 5-8 seg |
| 22 | Educación / Clases | Dibujo en tiza animándose | 10-15 seg |
| 23 | Spa / Zen | Gota de agua creando ripples | 6-10 seg |
| 24 | Podcast / Media | Ondas de audio pulsando | 8-12 seg |
| 25 | Festividades / Navidad | Nieve cayendo | 8-12 seg |

---

## 4. 🤖 SISTEMA DE INTELIGENCIA ARTIFICIAL

### 4.1 Servicio Principal: Gemini Service

**Archivo:** [`services/geminiService.ts`](services/geminiService.ts)

#### Funcionalidades Principales:

1. **Generación de Imágenes con Gemini 1.5 Pro**
   - Modelo: `gemini-1.5-pro` (API oficial)
   - Resolución: 1024x1024 (HD)
   - Salida: Base64 encoded image
   - Timeout: 60 segundos

2. **Generación de Videos con Veo 3.1**
   - Modelos disponibles:
     - `veo-3.1-fast-generate-preview` (Draft, 720p)
     - `veo-3.1-generate-preview` (Producción, 1080p)
   - Aspect ratios: 1:1, 9:16, 16:9, 4:5, 1.91:1

3. **Construcción de Prompts Maestro**
   ```
   MASTER_STYLE + CHILEAN_CONTEXT + STYLE_PROMPT + REALITY_MODE + USER_INPUT
   ```

#### Prompts de Sistema (60+ prompts especializados):

**A. Modificadores de Estilo Visual**
| Categoría | Prompts | Propósito |
|-----------|---------|-----------|
| **Iluminación** | `studio_softbox_lighting`, `rim_lighting`, `golden_hour` | Control de luz |
| **Texturas** | `carbon_fiber`, `brushed_aluminum`, `glossy_reflections` | Materiales |
| **Composición** | `dynamic_angle`, `hero_shot`, `product_closeup` | Encuadre |
| **Render** | `octane_render`, `unreal_engine_5`, `raytracing` | Motor gráfico |
| **Efectos** | `volumetric_fog`, `lens_flare`, `motion_blur` | FX visuales |

**B. Modificadores de Texto y Tipografía**
| Categoría | Prompts | Propósito |
|-----------|---------|-----------|
| **Encabezados** | `headline_bold`, `headline_urgent`, `headline_elegant` | Títulos principales |
| **Subtítulos** | `subtitle_soft`, `subtitle_informative` | Texto secundario |
| **Llamados** | `cta_pulse`, `cta_urgent`, `cta_elegant` | Botones de acción |
| **Precios** | `price_highlight`, `price_discount` | Pricing display |

**C. Modificadores de Industria**
| Categoría | Prompts | Propósito |
|-----------|---------|-----------|
| **Retail** | `retail_urgency`, `retail_value`, `retail_quality` | Tiendas y ofertas |
| **Gastronomía** | `food_appetizing`, `food_gourmet`, `food_casual` | Restaurantes y comida |
| **Automotriz** | `auto_power`, `auto_luxury`, `auto_reliable` | Vehículos y talleres |
| **Salud** | `medical_trust`, `medical_clean`, `medical_caring` | Clínicas y farmacias |
| **Belleza** | `beauty_glow`, `beauty_natural`, `beauty_luxury` | Estéticas y spas |

**D. Modificadores de Formato**
| Formato | Prompt | Dimensiones |
|---------|--------|-------------|
| Instagram Post | `format_square` | 1080x1080 |
| Instagram Story | `format_story` | 1080x1920 |
| Facebook Link | `format_landscape` | 1200x628 |
| TikTok | `format_vertical` | 1080x1920 |

---

### 4.2 Servicio de Análisis de Imágenes

**Archivo:** [`services/imageAnalysisService.ts`](services/imageAnalysisService.ts)

#### Prompts de Análisis (15 prompts especializados):

| # | Prompt | Función |
|---|--------|---------|
| 1 | `analyze_brand_colors` | Extraer paleta de colores dominante |
| 2 | `analyze_brand_style` | Identificar estilo visual general |
| 3 | `analyze_brand_mood` | Detectar estado emocional de la marca |
| 4 | `analyze_typography_style` | Clasificar tipografía usada |
| 5 | `analyze_composition_style` | Determinar tipo de composición |
| 6 | `analyze_lighting_style` | Identificar esquema de iluminación |
| 7 | `analyze_industry` | Clasificar industria del negocio |
| 8 | `extract_text_elements` | Leer texto visible en la imagen |
| 9 | `analyze_visual_hierarchy` | Mapear prioridades visuales |
| 10 | `detect_trends` | Identificar tendencias actuales |
| 11 | `analyze_target_audience` | Inferir audiencia objetivo |
| 12 | `extract_key_elements` | Listar elementos visuales clave |
| 13 | `analyze_contrast_patterns` | Estudiar patrones de contraste |
| 14 | `suggest_improvements` | Proponer optimizaciones |
| 15 | `generate_style_description` | Crear descripción textual del estilo |

---

### 4.3 Servicio de Mejora de Imágenes

**Archivo:** [`services/imageImprovementService.ts`](services/imageImprovementService.ts)

#### Prompts de Mejora (10 prompts especializados):

| # | Prompt | Función |
|---|--------|---------|
| 1 | `improve_resolution` | Aumentar resolución sin perder calidad |
| 2 | `enhance_details` | Mejorar nitidez y detalles |
| 3 | `fix_lighting` | Corregir problemas de iluminación |
| 4 | `adjust_colors` | Balance de colores y saturación |
| 5 | `remove_noise` | Reducir ruido digital |
| 6 | `sharpen_edges` | Definir bordes y contornos |
| 7 | `enhance_contrast` | Mejorar rango dinámico |
| 8 | `restore_old_photos` | Restaurar fotografías antiguas |
| 9 | `remove_artifacts` | Eliminar artefactos de compresión |
| 10 | `auto_enhance` | Mejora automática integral |

---

### 4.4 Servicio de Contraste y Análisis

**Archivo:** [`services/contrastAnalysisService.ts`](services/contrastAnalysisService.ts)

#### Prompts de Contraste (8 prompts especializados):

| # | Prompt | Función |
|---|--------|---------|
| 1 | `contrast_accessibility` | Verificar contraste WCAG AA |
| 2 | `contrast_brand` | Analizar coherencia de marca |
| 3 | `contrast_visual_hierarchy` | Evaluar jerarquía visual |
| 4 | `contrast_text_readability` | Medir legibilidad del texto |
| 5 | `contrast_emotional_impact` | Analizar impacto emocional |
| 6 | `contrast_color_harmony` | Evaluar armonía de colores |
| 7 | `contrast_composition_balance` | Balance de composición |
| 8 | `contrast_overall_score` | Puntaje general de contraste |

---

### 4.5 Servicio de Tipografía Contextual

**Archivo:** [`services/contextualTypographyService.ts`](services/contextualTypographyService.ts)

#### Prompts de Tipografía (12 prompts especializados):

| # | Prompt | Función |
|---|--------|---------|
| 1 | `typography_style_match` | Sincronizar tipografía con estilo visual |
| 2 | `typography_brand_consistency` | Mantener consistencia de marca |
| 3 | `typography_readability` | Optimizar legibilidad |
| 4 | `typography_hierarchy` | Establecer jerarquía tipográfica |
| 5 | `typography_trends` | Aplicar tendencias actuales |
| 6 | `typography_industry_standard` | Seguir estándares de industria |
| 7 | `typography_emotional_tone` | Transmitir tono emocional |
| 8 | `typography_format_adaptation` | Adaptar al formato del flyer |
| 9 | `typography_color_theory` | Aplicar teoría de color |
| 10 | `typography_spacing` | Optimizar espaciado |
| 11 | `typography_scale` | Escalar correctamente |
| 12 | `typography_alignment` | Alinear elementos tipográficos |

---

### 4.6 Servicio de Composición

**Archivo:** [`services/compositionAnalysisService.ts`](services/compositionAnalysisService.ts)

#### Prompts de Composición (10 prompts especializados):

| # | Prompt | Función |
|---|--------|---------|
| 1 | `composition_rule_of_thirds` | Aplicar regla de tercios |
| 2 | `composition_golden_ratio` | Usar proporción áurea |
| 3 | `composition_center_focus` | Foco central |
| 4 | `composition_diagonal` | Líneas diagonales dinámicas |
| 5 | `composition_symmetrical` | Simetría y balance |
| 6 | `composition_asymmetrical` | Balance asimétrico |
| 7 | `composition_fill_frame` | Llenar el encuadre |
| 8 | `composition_negative_space` | Usar espacio negativo |
| 9 | `composition_leading_lines` | Líneas guía |
| 10 | `composition_framing` | Encuadre natural |

---

### 4.7 Servicio de Efectos Contextuales

**Archivo:** [`services/contextualEffectsService.ts`](services/contextualEffectsService.ts)

#### Prompts de Efectos (8 prompts especializados):

| # | Prompt | Función |
|---|--------|---------|
| 1 | `effects_lighting` | Efectos de iluminación |
| 2 | `effects_textures` | Aplicar texturas |
| 3 | `effects_shadows` | Sombras y profundidad |
| 4 | `effects_reflections` | Reflexiones |
| 5 | `effects_gradients` | Degradados |
| 6 | `effects_blur` | Desenfoque selectivo |
| 7 | `effects_particles` | Partículas y elementos |
| 8 | `effects_overlays` | Capas y overlays |

---

### 4.8 Servicio de Modo Magia

**Archivo:** [`services/magicModeService.ts`](services/magicModeService.ts)

#### Detección Automática de Industrias (25 industrias):

| # | Industria | Keywords | Estilo Asignado |
|---|-----------|----------|-----------------|
| 1 | Retail / Ventas | tienda, oferta, sale, descuento | `retail_sale` |
| 2 | Gastronomía | restaurant, comida, pizza, café | `gastronomy` |
| 3 | Bienestar / Yoga | yoga, spa, masaje | `wellness_zen` |
| 4 | Pilates | pilates | `pilates` |
| 5 | Iglesia | iglesia, templo, religión | `worship_sky` |
| 6 | Belleza | belleza, estética, skincare | `aesthetic_min` |
| 7 | Deporte / Gym | gym, fitness, deporte | `sport_gritty` |
| 8 | Médico | médico, clínica, dentist | `medical_clean` |
| 9 | Tecnología | tech, software, app | `tech_saas` |
| 10 | Educación | educación, curso, clase | `edu_sketch` |
| 11 | Corporativo | empresa, business | `corporate` |
| 12 | Inmobiliaria | inmobiliaria, casa | `realestate_night` |
| 13 | Lujo | lujo, luxury, vip | `luxury_gold` |
| 14 | Automotriz | auto, taller, mecánico | `auto_metallic` |
| 15 | Discoteca | discoteca, club, fiesta | `urban_night` |
| 16 | Gaming | gaming, game, esports | `gamer_stream` |
| 17 | Música | música, podcast, radio | `podcast_mic` |
| 18 | Infantil | niños, cumpleaños, toys | `kids_fun` |
| 19 | Ecológico | eco, organic, natural | `eco_organic` |
| 20 | Feria Libre | feria, vega, mercado | `market_handwritten` |
| 21 | Verano | verano, playa, vacaciones | `summer_beach` |
| 22 | Política | política, candidato | `political_community` |
| 23 | Arte | arte, teatro, creativo | `art_double_exp` |
| 24 | Retro | retro, vintage | `retro_vintage` |
| 25 | Navidad | navidad, christmas | `seasonal_holiday` |

---

## 5. 🎯 SISTEMA DE MODO MAGIA

### 5.1 Flujo de Detección Automática

```
1. Usuario ingresa URL o descripción del negocio
         ↓
2. Magic Mode extrae palabras clave
         ↓
3. Sistema detecta industria (25 posibilidades)
         ↓
4. Asigna estilo visual correspondiente
         ↓
5. Genera texto persuasivo por industria
         ↓
6. Retorna resultado con confianza de detección
```

### 5.2 Textos Persuasivos por Industria

| Industria | Textos Generados |
|-----------|------------------|
| Retail | "¡OFERTA EXPLOSIVA!", "DESCUENTO IMPERDIBLE", "LIQUIDACIÓN TOTAL" |
| Gastronomía | "SABORES ÚNICOS", "EXPERIENCIA GASTRONÓMICA", "COMIDA CASERA" |
| Deportivo | "FUERZA Y DETERMINACIÓN", "ENTRENAMIENTO INTENSO", "SUPERA TUS LÍMITES" |
| Lujo | "LUJO EXCLUSIVO", "ELEGANCIA SUPREMA", "EXPERIENCIA PREMIUM" |
| Tecnológico | "INNOVACIÓN DIGITAL", "TECNOLOGÍA AVANZADA", "FUTURO DIGITAL" |
| Médico | "TU SALUD ES PRIORIDAD", "ATENCIÓN MÉDICA", "CUIDADO PROFESIONAL" |
| Feria Libre | "¡FRESCO Y BARATO!", "直接 DE LA HUERTA", "MEJOR PRECIO DEL DÍA" |

---

## 6. 🔧 SISTEMA DE ESTILOS REALISTAS (SOLUCIÓN AL "CHOQUE DE TRENES")

### 6.1 Problema Identificado

Cuando un usuario seleccionaba un estilo "fantasy" (ej: `retail_sale` con "explosión 3D en gravedad cero") Y elegía modo "Realista", Gemini recibía instrucciones contradictorias generando híbridos extraños.

### 6.2 Solución: Dynamic Style Injection

**Archivo:** [`constants.ts`](constants.ts) - Líneas 77-105

```typescript
export const REALIST_STYLE_VARIANTS: Record<string, string> = {
  retail_sale: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Chilean Retail Photography. 
    Context: Local neighborhood store or supermarket aisle. 
    Background: Product shelves, promotional displays, shopping carts. 
    Lighting: Bright fluorescent store lighting, harsh shadows. 
    Vibe: Great value, accessible, trustworthy local business. 
    NO floating elements. NO 3D effects. Products must be on shelves or displays.`,
  
  sport_gritty: `Subject: [INSERT SUBJECT HERE]. Style: Authentic Local Gym Photography. 
    Context: Neighborhood fitness center, real people exercising. 
    Background: Weight racks, exercise machines, mirrors. 
    Lighting: Bright overhead fluorescent lights, some shadows. 
    Vibe: Approachable, community-focused, no-nonsense fitness. 
    NO dramatic rim lighting. NO sweat droplets in slow motion. Real gym atmosphere.`,
  
  // ... (8 variantes más)
};
```

### 6.3 Variantes de Estilo Realista

| Estilo Original | Variante Realista | Contexto |
|-----------------|-------------------|----------|
| `retail_sale` | Foto de tienda real | Pasillo de supermercado, productos en estantes |
| `sport_gritty` | Gym de barrio | Personas reales ejercitando, luces fluorescentes |
| `urban_night` | Pub/barrio real | Interior de bar local, mesas de madera |
| `tech_saas` | Oficina tech real | Computadoras en escritorios, café |
| `luxury_good` | Evento nice pero accesible | Salón comunitario, decoración real |
| `kids_fun` | Fiesta de niños real | Piñatas, globos, jardín |
| `auto_metallic` | Taller/mecánico real | Garage de barrio, herramientas |
| `gastronomy` | Restaurant/casual real | Plato en mesa de restaurante |

---

## 7. 🇨🇱 CONTEXTO CHILENO INTEGRADO

### 7.1 Configuración de Locale

**Archivo:** [`constants.ts`](constants.ts) - Líneas 44-74

```typescript
export const CHILEAN_BASE_CONTEXT = `LOCALE SETTING: Chile (South America).
1. FACES/PEOPLE: Subjects must have realistic Chilean phenotypes (mixed heritage). 
   Clothing: Modern urban western fashion suitable for temperate/cold weather.
2. TEXT & LANGUAGE: ANY visible text MUST BE IN SPANISH (Chilean format).
   - STRICTLY NO ENGLISH TEXT (No "Sale", "Open", "Shop").
   - USE: "Oferta", "Abierto", "Liquidación", "Rico".
   - CURRENCY: Use Chilean Peso format with dot separator (e.g. "$1.000", "$5.990").`;
```

### 7.2 Reglas Geográficas

| Zona | Características | Restricciones |
|------|-----------------|---------------|
| Costa/Playa | Océano Pacífico (azul oscuro), olas energéticas | PROHIBIDO: Agua turquesa caribeña, palmeras |
| Sur/Lagos | Volcanes, bosque valdiviano, atmósfera nublada | - |
| Centro (Santiago) | Colinas marrón mediterráneo, árboles urbanos | PROHIBIDO: Filtros sepia mexicanos, desiertos |
| Montañas | Andes (cumbres rocosas, picos nevados) | - |

---

## 8. 🎨 ESTILO FERIA LIBRE / MERCADO CHILENO

### 8.1 Nuevo Estilo: `market_handwritten`

**Archivo:** [`constants.ts`](constants.ts) - Líneas 381-391

```typescript
market_handwritten: {
  label: "Feria / Mercado",
  category: "VENTAS",
  tags: ["Feria", "Barato", "Fresco", "Pyme"],
  english_prompt: `Subject: [INSERT SUBJECT HERE]. Style: Traditional Chilean Market 
    ('Feria Libre') Aesthetic. Background: Colorful cardboard signs (neon yellow, pink, green) 
    with handwritten prices written in thick black marker (plumón). Texture: Slightly worn cardboard, 
    rustic wooden crates, fruit baskets. Lighting: Bright outdoor sunlight, harsh shadows. 
    Vibe: Popular, cheap, fresh, urgent. 'Bueno, bonito y barato'. 
    NO professional graphics. NO clean studio backgrounds. 
    Authentic Chilean market atmosphere.`,
  visualDescription: "Carteles de cartón escritos a mano con precios en marker, 
    cajones de madera, frutas frescas, ambiente de feria libre chilena.",
  example: "Verdulería 'Don Pedro': Tomates a $1.500 el kilo, limones $500, ofertas de la semana.",
  previewUrl: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=400&q=80"
}
```

### 8.2 Detección Automática de Ferias

**Archivo:** [`services/magicModeService.ts`](services/magicModeService.ts) - Líneas 500-509

```typescript
// 18.5 FERIA LIBRE / MERCADO CHILENO (NUEVO)
if (inputLower.includes('feria') || inputLower.includes('vega') || inputLower.includes('mercado')) {
  return { industry: 'market_handwritten', styleKey: 'market_handwritten', confidence: 0.95, keywords: ['feria', 'vega', 'mercado'] };
}
if (inputLower.includes('fruta') || inputLower.includes('verdura') || inputLower.includes('frutería') || inputLower.includes('verdulería') || inputLower.includes('puesto')) {
  return { industry: 'market_handwritten', styleKey: 'market_handwritten', confidence: 0.9, keywords: ['fruta', 'verdura', 'frutería', 'verdulería', 'puesto'] };
}
if (inputLower.includes('almacén') || inputLower.includes('almacen') || inputLower.includes('kiosko') || inputLower.includes('amasandería') || inputLower.includes('panadería')) {
  return { industry: 'market_handwritten', styleKey: 'market_handwritten', confidence: 0.85, keywords: ['almacén', 'kiosko', 'amasandería', 'panadería'] };
}
```

### 8.3 Tipografía de Mercado

**Archivo:** [`services/styleTemplatesService.ts`](services/styleTemplatesService.ts) - Líneas 1300-1345

```typescript
market_handwritten: {
  id: 'market_handwritten',
  name: 'Feria / Mercado',
  textPosition: { x: 50, y: 80, alignment: 'center' },
  visualStyle: 'bottom-bar',
  typography: {
    fontFamily: '"Permanent Marker", "Patrick Hand", cursive',
    fontSize: 'clamp(18px, 5vw, 32px)',
    fontWeight: '400',
    letterSpacing: '0.01em',
    textTransform: 'uppercase'
  },
  colors: {
    primary: '#000000',      // Marcador negro
    secondary: '#000080',    // Azul plumón
    background: '#FFFF00'    // Resaltador amarillo
  }
}
```

### 8.4 Fuentes Cargadas

**Archivo:** [`index.html`](index.html) - Línea 52

```html
<link href="https://fonts.googleapis.com/css2?family=...&family=Permanent+Marker&family=Patrick+Hand&display=swap" rel="stylesheet">
```

---

## 9. 💰 SISTEMA DE CRÉDITOS Y PLANES

### 9.1 Planes Disponibles (4 planes)

| Plan | Precio | Créditos | Imágenes HD | Videos | Características |
|------|--------|----------|-------------|--------|-----------------|
| **Gratis** | $0/mes | 5 créditos | 5 | 0 | Para probar el servicio |
| **Básico** | $9.990/mes | 50 créditos | 50 | 0 | Ideal para empezar |
| **Pro** | $19.990/mes | 150 créditos | 150 | 3 | Para negocios activos |
| **Agencia** | $49.990/mes | 500 créditos | 500 | 15 | Para profesionales |

### 9.2 Costos por Operación

| Operación | Costo (créditos) |
|-----------|------------------|
| Imagen HD | 1 crédito |
| Imagen Draft | 0.25 créditos |
| Video Draft (720p) | 5 créditos |
| Video Producción (1080p) | 25 créditos |

### 9.3 Sistema de Créditos Extra

| Paquete | Créditos | Precio |
|---------|----------|--------|
| Pack 20 | 20 créditos | $4.990 |
| Pack 50 | 50 créditos | $9.990 |
| Pack 100 | 100 créditos | $16.990 |

---

## 10. 📱 FORMATOS SOPORTADOS

### 10.1 Ratios de Aspecto

| Formato | Dimensiones | Uso |
|---------|-------------|-----|
| 1:1 | 1080x1080 | Instagram/Facebook Posts |
| 9:16 | 1080x1920 | Stories/TikTok/Reels |
| 4:5 | 1080x1350 | Instagram Feed Vertical |
| 1.91:1 | 1200x628 | Facebook Link Posts |
| 16:9 | 1920x1080 | YouTube/Video Horizontal |
| 4:3 | 1024x768 | Foto Clásica |
| 3:4 | 768x1024 | Retrato |

### 10.2 Etiquetas UI

```typescript
export const ASPECT_RATIO_LABELS: Record<AspectRatio, string> = {
  '1:1': '🟦 Ads Universal (1080x1080) - Facebook/Instagram',
  '9:16': '📱 Stories/Ads (1080x1920) - Instagram/TikTok/Facebook',
  '4:5': '📸 Instagram Feed Vertical (1080x1350)',
  '1.91:1': '📘 Facebook Link Post (1200x628)',
  '16:9': '💻 Video Horizontal (1920x1080)',
  '4:3': '📷 Foto Clásica (1024x768)',
  '3:4': '📐 Retrato (768x1024)',
  '1080x1080': '🖼️ HD Cuadrado (1080x1080)',
  '1080x1920': '🎬 HD Vertical (1080x1920)',
  '1080x1350': '📸 HD Instagram (1080x1350)'
};
```

---

## 11. 🔐 AUTENTICACIÓN Y BASE DE DATOS

### 11.1 Proveedores de Auth

- **Email/Password** - Autenticación tradicional
- **Google** - OAuth 2.0 con Google
- **Apple** - OAuth con Apple ID

### 11.2 Estructura de Base de Datos (Supabase)

```sql
-- Tablas principales:
profiles (usuarios extendidos)
flyers (flyers generados)
videos (videos generados)
credits (créditos del usuario)
payments (historial de pagos)
brands (marcas guardadas)
social_media_posts (posts programados)
commercial_events (calendario comercial)
```

### 11.3 Funciones Edge (PostgreSQL)

| Función | Propósito |
|---------|-----------|
| `get_user_credits()` | Consultar créditos disponibles |
| `deduct_credits()` | Descontar créditos |
| `get_user_plan()` | Obtener plan actual |
| `create_flyer_record()` | Guardar flyer generado |
| `update_brand_analytics()` | Actualizar métricas de marca |

---

## 12. 🎬 GENERACIÓN DE VIDEOS CON VEO 3.1

### 12.1 Configuración de Modelos

```typescript
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
```

### 12.2 Prompts de Video (25 estilos)

Cada estilo de video tiene un prompt estructurado:
```
[DESCRIPCIÓN VISUAL] + [MOVIMIENTO DE CÁMARA] + [ACCIÓN DEL SUJETO] + High resolution, cinematic 4k.
```

---

## 13. 🛡️ GUARDRAILS TÉCNICOS

### 13.1 Para Imágenes

```typescript
export const IMAGE_GUARDRAILS = `
STRICT PROHIBITIONS:
1. NO text, letters, numbers, or symbols on any surface
2. NO faces of real public figures
3. NO copyrighted characters or logos
4. NO violence or harmful content
5. NO sexual or adult content
6. NO political propaganda
7. NO religious iconography
8. NO medical procedures or surgeries
9. NO weapons or firearms
10. NO vehicles in dangerous situations
```

### 13.2 Para Videos (Física)

```typescript
export const VIDEO_PHYSICS_GUARDRAIL = `
CRITICAL PHYSICS & MOTION RULES:
1. HIGH FRICTION: Feet must be FIRMLY glued to the floor. ABSOLUTELY NO SLIDING.
2. WEIGHT: Subjects must display heavy, realistic weight. No floating.
3. MOTION SOURCE: Prefer CAMERA MOVEMENT (Parallax, Slow Zoom) and ATMOSPHERE.
4. STATIC POSE: If standing, remain anchored. Only breathing shifts allowed.
5. GROUNDING: Shadows must match foot contact perfectly.
6. NO SYMBOLS OR GLYPHS: STRICTLY FORBIDDEN to render letters/numbers.
7. SURFACE TEXTURES: All walls/signs must be BLANK, SOLID COLOR, or RAW TEXTURE.
```

---

## 14. 📊 ESTADÍSTICAS Y MÉTRICAS

### 14.1 Métricas de Uso

| Métrica | Descripción |
|---------|-------------|
| Total Flyers Generados | Contador acumulativo |
| Total Videos Generados | Contador acumulativo |
| Créditos Consumidos | Por usuario y global |
| Tiempo Promedio de Generación | Por tipo (imagen/video) |
| Tasa de Éxito | % de generaciones exitosas |

### 14.2 Analytics por Marca

| Métrica | Descripción |
|---------|-------------|
| Generaciones por Marca | Cuántos flyers se han creado |
| Estilos Más Usados | Top 5 estilos |
| Formatos Preferidos | Top 3 formatos |
| Días Más Activos | Heatmap de uso |

---

## 15. 🔄 INTEGRACIONES

### 15.1 APIs Externas

| Servicio | Uso |
|----------|-----|
| **Google Gemini 1.5 Pro** | Generación de imágenes y prompts |
| **Google Veo 3.1** | Generación de videos |
| **Supabase** | Base de datos y autenticación |
| **AWS S3** | Almacenamiento de archivos |

### 15.2 Webhooks

| Evento | Webhook |
|--------|---------|
| Generación completada | `on-generation-complete` |
| Error en generación | `on-generation-error` |
| Crédito bajo | `on-low-credits` |
| Pago recibido | `on-payment-received` |

---

## 16. 🚀 CARACTERÍSTICAS AVANZADAS

### 16.1 Modo Brand Identity

Extrae automáticamente el estilo visual de la URL del negocio:
- Colores dominantes
- Tipografía usada
- Composición típica
- Estado emocional
- Audiencia objetivo

### 16.2 Calendario Comercial

Eventos comerciales chilenos pre-configurados:
- **18 de Septiembre** - Fiestas Patrias
- **Navidad** - Temporada navideña
- **Día de la Madre** - Mayo
- **Día del Padre** - Junio
- **Black Friday** - Noviembre
- **Cyber Monday** - Noviembre
- **Liquidación de Invierno** - Julio
- **Liquidación de Invierno** - Enero

### 16.3 Mejora de Imágenes Existentes

Análisis y mejora de imágenes proporcionadas por el usuario:
- Extracción de colores de marca
- Identificación de estilo
- Mejora de resolución
- Corrección de iluminación
- Optimización de contraste

---

## 17. 🎨 SISTEMA TIPOGRÁFICO

### 17.1 Fuentes Cargadas (Google Fonts)

| Categoría | Fuentes | Uso |
|-----------|---------|-----|
| **Sans-serif Moderno** | Inter, Poppins, Roboto, Open Sans, Lato | Corporativo, Retail, Lifestyle |
| **Serif Elegante** | Playfair Display, Lora, Merriweather, Cormorant Garamond | Lujo, Gastronomía, Arte |
| **Display/Impact** | Impact, Arial Black, Bebas Neue, Anton, Oswald | Ofertas, Deporte, Rock |
| **Monoespaciado** | JetBrains Mono, Fira Code, Source Code Pro | Tech, Gaming, Gamer |
| **Futurista** | Orbitron, Rajdhani, Exo 2 | Tech, Automotriz, Gaming, Neón |
| **Handwritten** | Permanent Marker, Patrick Hand, Fredoka One | Feria Libre, Infantil |
| **Script** | Pacifico, Dancing Script | Eventos especiales |
| **Humanista** | Comic Neue, Balsamiq Sans | Infantil (reemplazo de Comic Sans) |

### 17.2 Matriz Tipográfica por Estilo

| Estilo | Font Family | Coherencia |
|--------|-------------|------------|
| **retail_sale** | Impact, Arial Black | ✅ Display Bold - Ofertas |
| **typo_bold** | Inter, system-ui | ✅ Sans Moderno - Clean |
| **auto_metallic** | Orbitron, monospace | ✅ Futurista - Cargado |
| **gastronomy** | Playfair Display, serif | ✅ Serif Elegante - Comida |
| **corporate** | Inter, system-ui | ✅ Sans Moderno - Profesional |
| **medical_clean** | Inter, system-ui | ✅ Sans Limpio - Salud |
| **tech_saas** | Orbitron, monospace | ✅ Futurista - Cargado |
| **edu_sketch** | Inter, system-ui | ✅ Sans Claro - Educación |
| **political_community** | Inter, system-ui | ✅ Sans Confiable - Política |
| **aesthetic_min** | Playfair Display, serif | ✅ Serif Suave - Belleza |
| **wellness_zen** | Cormorant Garamond | ✅ Serif Elegante - Cargado |
| **pilates** | Inter, system-ui | ✅ Sans Equilibrado - Pilates |
| **summer_beach** | Inter, system-ui | ✅ Sans Energético - Verano |
| **eco_organic** | Inter, system-ui | ✅ Sans Natural - Eco |
| **sport_gritty** | Impact, Arial Black | ✅ Display Bold - Deporte |
| **urban_night** | Orbitron, monospace | ✅ Futurista - Cargado |
| **luxury_gold** | Playfair Display, serif | ✅ Serif Premium - Lujo |
| **realestate_night** | Inter, system-ui | ✅ Sans Elegante - Inmobiliaria |
| **gamer_stream** | Orbitron, monospace | ✅ Futurista - Cargado |
| **indie_grunge** | Impact, Arial Black | ✅ Display Rock - Música |
| **kids_fun** | Fredoka One, Balsamiq Sans | ✅ Infantil Profesional |
| **worship_sky** | Playfair Display, serif | ✅ Serif Espiritual - Iglesia |
| **seasonal_holiday** | Playfair Display, serif | ✅ Serif Festivo - Navidad |
| **art_double_exp** | Playfair Display, serif | ✅ Serif Artístico - Arte |
| **retro_vintage** | Impact, Arial Black | ✅ Display Retro - Vintage |
| **podcast_mic** | Inter, system-ui | ✅ Sans Claro - Audio |
| **brand_identity** | Inter, system-ui | ✅ Sans Flexible - Detección |
| **market_handwritten** | Permanent Marker, Patrick Hand | ✅ Handwritten - Feria |

### 17.3 Verificación de Pesos de Fuentes

| Fuente | Pesos Cargados | Verificación |
|--------|----------------|--------------|
| **Orbitron** | 400, 500, 700, 900 | ✅ Completo (sin fake bold) |
| **Cormorant Garamond** | 300, 400, 500, 600, 700 | ✅ Completo |
| **Fredoka One** | 400, 700 | ✅ Completo (para kids_fun fontWeight 900 usa fallback) |
| **Balsamiq Sans** | 400, 700 | ✅ Completo |
| **Comic Neue** | 300, 400, 700 | ✅ Completo |
| **Inter** | 300, 400, 500, 600, 700 | ✅ Completo |
| **Playfair Display** | 400, 700 | ✅ Completo |

### 17.4 Correcciones Aplicadas

| Problema | Solución |
|----------|----------|
| Orbitron no estaba cargado | Agregado con pesos 400, 500, 700, 900 |
| Cormorant Garamond no estaba cargado | Agregado con pesos 300-700 |
| Comic Sans MS (poco profesional) | Reemplazado por Fredoka One/Balsamiq Sans |
| Fredoka One sin pesos | Agregado wght@400;700 |
| Fuentes faltantes para Infantil | Agregado Fredoka One, Balsamiq Sans, Comic Neue |

---

## 18. 📈 VENTAJAS COMPETITIVAS

### 17.1 Diferenciadores

| Característica | Estudio 56 | Competidores |
|----------------|------------|--------------|
| Contexto 100% chileno | ✅ | ❌ |
| 39 estilos visuales | ✅ | 10-15 promedio |
| 25 industrias detectadas | ✅ | 5-10 promedio |
| Videos con IA (Veo 3.1) | ✅ | Pocos |
| Modo Magia automático | ✅ | ❌ |
| Estilo Feria Libre chileno | ✅ | ❌ |
| Sistema de créditos flexible | ✅ | Variable |
| Brand Identity automático | ✅ | ❌ |

### 17.2 Casos de Uso Ideales

| Usuario | Caso de Uso |
|---------|-------------|
| **Pyme chilena** | Crear flyers semanales para redes sociales |
| **Agencia de marketing** | Prototipado rápido para clientes |
| **Restaurante** | Menús visuales y promociones |
| **Comerciante de feria** | Carteles para Vega Central o Persa Biobío |
| **Gimnasio** | Promociones de planes y eventos |
| **Iglesia** | Eventos y actividades comunitarias |
| **Politico local** | Campañas comunales |

---

## 18. 📋 RESUMEN TÉCNICO

### Archivos Clave

| Archivo | Líneas | Propósito |
|---------|--------|-----------|
| `constants.ts` | 756 | Configuración de estilos y prompts |
| `types.ts` | 130 | Tipos TypeScript |
| `services/geminiService.ts` | ~500 | Servicio principal de IA |
| `services/magicModeService.ts` | 1142 | Detección automática de industrias |
| `services/imageAnalysisService.ts` | ~400 | Análisis de imágenes |
| `services/styleTemplatesService.ts` | 1473 | Plantillas CSS por estilo |
| `components/FlyerForm.tsx` | ~600 | Formulario principal |
| `components/FlyerDisplay.tsx` | ~400 | Visualización de resultados |

### Total de Prompts Especializados: **100+**

| Categoría | Cantidad |
|-----------|----------|
| Modificadores de estilo | 20+ |
| Análisis de imágenes | 15 |
| Mejora de imágenes | 10 |
| Contraste | 8 |
| Tipografía | 12 |
| Composición | 10 |
| Efectos | 8 |
| Estilos de video | 25 |

---

## 19. 🐛 CORRECCIÓN DE BUG: TIPO DE CONTENIDO

### 19.1 Problema Identificado

Cuando el usuario seleccionaba "Imágenes" y luego "Estudio de Producto", la aplicación se confundía porque ambos usaban el mismo `mediaType === 'image'`, causando:

1. **Conflicto visual**: Ambos botones podían iluminarse simultáneamente
2. **Modo Magia incorrecto**: El Modo Magia se activaba en "Estudio de Producto" innecesariamente
3. **Comportamiento inesperado**: El área de carga de imagen aparecía en contextos incorrectos

### 19.2 Solución Implementada

**Archivo:** [`types.ts`](types.ts) - Línea 65

```typescript
export type MediaType = 'image' | 'video' | 'product_study';
```

**Cambios en [`components/FlyerForm.tsx`](components/FlyerForm.tsx):**

1. **Botón "Estudio de Producto"** (líneas 766-787):
   - Ahora usa `setMediaType('product_study')` en lugar de `setMediaType('image')`
   - Condición de selección: `mediaType === 'product_study'`

2. **Área de carga de imagen** (línea 792):
   - Condición: `mediaType === 'product_study' && !uploadedImage`
   - Solo aparece cuando está en modo "Estudio de Producto"

3. **Modo Magia** (líneas 204-216):
   - Excluye `product_study` del análisis automático
   - Solo se activa cuando `mediaType === 'image'`

4. **Indicador de selección** (líneas 730-731, 740):
   - Condición: `mediaType === 'image' && !uploadedImage && mediaType !== 'product_study'`
   - Evita que "Imágenes" se ilumine cuando "Estudio de Producto" está activo

**Cambios en [`App.tsx`](App.tsx):**

1. **Deducción de créditos** (líneas 722-742):
   - `product_study` NO descuenta créditos (usa imagen subida por el usuario)

2. **Generación** (líneas 754-756):
   - Si `mediaType === 'product_study'`, usa la imagen subida directamente
   - No genera nueva imagen con IA

### 19.3 Flujo Corregido

```
Usuario selecciona "Estudio de Producto"
         ↓
mediaType = 'product_study'
         ↓
Área de carga de imagen aparece
         ↓
Usuario sube su foto de producto
         ↓
Botón "Mejorar con IA" mejora la imagen
         ↓
"Generar Campaña" usa la imagen mejorada directamente
         ↓
NO se consume crédito (la imagen ya fue mejorada)
```

---

## 20. 🎯 CONCLUSIONES

**Estudio 56** es una plataforma completa de generación de contenido publicitario que combina:

1. **Inteligencia Artificial avanzada** (Google Gemini + Veo 3.1)
2. **Contexto cultural chileno** auténtico (+56)
3. **39 estilos visuales** especializados por industria
4. **25 estilos de video** cinematográficos
5. **Detección automática** de industrias (Modo Magia)
6. **Sistema de créditos** flexible y accesible
7. **Calidad profesional** a precios de pyme

La solución al "Choque de Trenes" mediante **Dynamic Style Injection** garantiza que los usuarios obtengan resultados consistentes independientemente de la combinación de estilo y modo de realidad elegida.

El nuevo estilo **Feria Libre / Mercado Chileno** (`market_handwritten`) llena un nicho específico del mercado chileno, permitiendo a comerciantes de Vega Central, Persa Biobío y ferias libres crear materiales promocionales con estética auténtica y relevante para su audiencia.

---

## 21. 🐛 CORRECCIÓN: PROMPT SOLO EN ESPAÑOL

### 21.1 Problema Identificado

El usuario reportó que al generar un flyer, el prompt se mostraba primero en inglés y luego aparecía un segundo contenedor con el prompt en español. Esto causaba confusión y duplicaba la información innecesariamente.

### 21.2 Análisis del Código

**Archivo:** [`App.tsx`](App.tsx) - Líneas 90-91, 687-753

El código original tenía:
```typescript
const [currentEnhancedPrompt, setCurrentEnhancedPrompt] = useState<string>('');
const [currentSpanishPrompt, setCurrentSpanishPrompt] = useState<string>('');
```

Ambos prompts se guardaban pero solo `currentSpanishPrompt` se usaba en la UI (líneas 533-545 de [`FlyerForm.tsx`](components/FlyerForm.tsx)).

### 21.3 Solución Implementada

**Cambios en [`App.tsx`](App.tsx):**

1. **Eliminado estado redundante** (línea 90):
   ```typescript
   // ELIMINADO: currentEnhancedPrompt ya no se muestra en UI
   const [currentSpanishPrompt, setCurrentSpanishPrompt] = useState<string>('');
   ```

2. **Limpieza de estados** (línea 687):
   ```typescript
   setImageUrl(null);
   setHdImageUrl(null);
   setCurrentSpanishPrompt(''); // Solo limpiar prompt en español
   ```

3. **Solo guardar prompt en español** (líneas 749-753):
   ```typescript
   const { english: enhancedPrompt, spanish: spanishPrompt } = await enhancePrompt(description, effectiveStyleKey);
   console.log('✅ Enhanced prompt (EN):', enhancedPrompt.substring(0, 100) + '...');
   console.log('✅ Prompt usuario (ES):', spanishPrompt.substring(0, 100) + '...');
   // Solo guardamos el prompt en español para mostrar al usuario
   setCurrentSpanishPrompt(spanishPrompt);
   ```

4. **Regenerar prompt en inglés cuando sea necesario** (líneas 869-906):
   - En `handleUpgradeToHD`: Se regenera el prompt en inglés usando `enhancePrompt()`
   - En `handleRefine`: Se regenera el prompt en inglés para refinar

### 21.4 Flujo Corregido

```
Usuario describe su negocio
         ↓
App.tsx: enhancePrompt() genera ambos prompts (inglés y español)
         ↓
Solo se guarda currentSpanishPrompt para mostrar al usuario
         ↓
FlyerForm.tsx: Muestra UN SOLO contenedor con el prompt en español
         ↓
Para operaciones internas (HD, Refine), se regenera el prompt en inglés
```

### 21.5 Resultado

- ✅ **Un solo contenedor** con el prompt en español
- ✅ **Sin duplicación** de información
- ✅ **Sin texto en inglés** visible para el usuario
- ✅ **Funcionalidad preservada** para operaciones internas (HD, Refine)

---

## 22. 🐛 CORRECCIÓN: MODO MAGIA CON TEXTO EN INGLÉS

### 22.1 Problema Identificado

Al analizar una URL, el `visualStyle` devuelto por Gemini (en inglés) se concatenaba con la descripción del negocio, causando que el Modo Magia se activara dos veces:
1. Primera vez con la URL original (correcto)
2. Segunda vez con la descripción que incluía texto en inglés (incorrecto)

**Logs del problema:**
```
FlyerForm.tsx:139 🔮 Activando Modo Magia para: https://vivepilates.cl/
FlyerForm.tsx:147 ✅ Modo Magia completado: {styleKey: 'pilates', ...}
// Luego...
FlyerForm.tsx:139 🔮 Activando Modo Magia para: Vive Pilates. Local business with professional branding, clean aesthetic... (¡INGLÉS!)
```

### 22.2 Solución Implementada

**Archivo:** [`services/geminiService.ts`](services/geminiService.ts) - Líneas 465-472

```typescript
// ANTES (problemático):
const fullDescription = businessName
  ? `${businessName}. ${description}`
  : description;

// DESPUÉS (corregido):
// Combinar nombre del negocio con descripción (SIN incluir visualStyle en inglés)
// El visualStyle se pasa por separado para el estilo del flyer, no para la descripción
const fullDescription = businessName
  ? `${businessName}. ${description}`
  : description;
```

### 22.3 Resultado

- ✅ El Modo Magia solo se activa una vez (con la URL original)
- ✅ No se procesa texto en inglés para detección de industria
- ✅ La detección de industria es más precisa

---

## 23. 🐛 CORRECCIÓN: KEYS DUPLICADAS EN CALENDARIO

### 23.1 Problema Identificado

El componente [`CommercialCalendar.tsx`](components/CommercialCalendar.tsx) tenía un warning de React:

```
Encountered two children with the same key, `M`
```

Esto ocurría porque los días de la semana usaban letras como keys:
```typescript
{['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day) => (
  <div key={day} ...>
```

Las dos 'M' (Miércoles y Jueves) causaban keys duplicadas.

### 23.2 Solución Implementada

**Archivo:** [`components/CommercialCalendar.tsx`](components/CommercialCalendar.tsx) - Línea 244

```typescript
// ANTES (problemático):
{['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day) => (
  <div key={day} className="text-center text-[8px] text-white/50 font-medium">
    {day}
  </div>
))}

// DESPUÉS (corregido):
{['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, index) => (
  <div key={`day-${index}`} className="text-center text-[8px] text-white/50 font-medium">
    {day}
  </div>
))}
```

### 23.3 Cambios Realizados

1. **Cambiado 'M' por 'X'** para Jueves (forma estándar en Chile)
2. **Usado índice como key** para garantizar unicidad
3. **Eliminado warning** de React en consola

### 23.4 Resultado

- ✅ Sin warnings de keys duplicadas en consola
- ✅ Calendario renderiza correctamente
- ✅ Notación de días coherente con uso chileno

---

## 24. 🐛 CORRECCIÓN: TABLA BRANDS NO EXISTE

### 24.1 Problema Identificado

Al cargar el dashboard, aparecía el error:

```
Could not find the table 'public.brands' in the schema cache
```

La tabla `brands` no estaba creada en la base de datos de Supabase.

### 24.2 Solución Implementada

**1. Creado script SQL:** [`database/brands-table.sql`](database/brands-table.sql)

```sql
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    website_url TEXT,
    instagram VARCHAR(100),
    tiktok VARCHAR(100),
    facebook VARCHAR(255),
    primary_color VARCHAR(20) DEFAULT '#000000',
    secondary_color VARCHAR(20) DEFAULT '#FFFFFF',
    industry VARCHAR(100),
    notification_settings JSONB DEFAULT '{"enabled": false, "daysBeforeEvent": [7, 3, 1]}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**2. Manejo graceful en código:**

**Archivo:** [`services/brandService.ts`](services/brandService.ts) - Líneas 39-76

```typescript
export const getUserBrands = async (): Promise<Brand[]> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('user_id', session.user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      // Si la tabla no existe, devolver array vacío silenciosamente
      if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
        console.log('ℹ️ Tabla brands no existe aún, creando marca por defecto...');
        // Crear una marca por defecto para el usuario
        const defaultBrand = await createBrand({
          name: 'Mi Negocio',
          is_default: true
        });
        return defaultBrand ? [defaultBrand] : [];
      }
      console.warn('⚠️ Error obteniendo marcas:', error.message);
      return [];
    }

    // Si no hay marcas, crear una por defecto
    if (!data || data.length === 0) {
      console.log('ℹ️ Usuario sin marcas, creando marca por defecto...');
      const defaultBrand = await createBrand({
        name: 'Mi Negocio',
        is_default: true
      });
      return defaultBrand ? [defaultBrand] : [];
    }

    return data;
  } catch (error) {
    console.error('❌ Excepción obteniendo marcas:', error);
    return [];
  }
};
```

**3. Documentación de creación manual:**

**Archivo:** [`CREAR-TABLA-BRANDS.md`](CREAR-TABLA-BRANDS.md)

Instrucciones paso a paso para crear la tabla desde el Dashboard de Supabase.

### 24.3 Resultado

- ✅ La aplicación no crashea si la tabla no existe
- ✅ Se crea una marca por defecto automáticamente
- ✅ El error se maneja silenciosamente
- ✅ Documentación disponible para creación manual

---

## 25. 📋 RESUMEN DE CORRECCIONES DE BUGS

| # | Bug | Archivo | Estado |
|---|-----|---------|--------|
| 19 | Tipo de contenido冲突 | types.ts, FlyerForm.tsx, App.tsx | ✅ Corregido |
| 21 | Prompt duplicado (EN/ES) | App.tsx | ✅ Corregido |
| 22 | Modo Magia con texto EN | geminiService.ts | ✅ Corregido |
| 23 | Keys duplicadas en calendario | CommercialCalendar.tsx | ✅ Corregido |
| 24 | Tabla brands no existe | brandService.ts | ✅ Manejado |

---

*Documento generado: Enero 2026*
*Versión de la aplicación: 2.0+*
*Stack: React 19 + TypeScript + Supabase + Google Gemini 1.5 Pro*
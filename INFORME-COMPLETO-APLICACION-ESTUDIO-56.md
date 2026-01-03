# 📊 INFORME COMPLETO DE LA APLICACIÓN ESTUDIO 56
## Plataforma de Generación de Contenido Publicitario con Inteligencia Artificial

---

## 1. 📋 RESUMEN EJECUTIVO

**Estudio 56** es una plataforma web de última generación diseñada para la creación automatizada de contenido publicitario (flyers, videos, banners) utilizando modelos de inteligencia artificial de Google (Gemini). La aplicación está orientada específicamente al mercado chileno y latinoamericano, con adaptaciones culturales, idiomáticas y de formato publicitario local.

### Características Principales:
- ✅ **Generación de Imágenes**: Modelos Gemini 2.5 Flash (borrador) y Gemini 3.0 Pro (HD)
- ✅ **Generación de Videos**: Google VEO 3.1 (720p draft / 1080p producción)
- ✅ **Modo Automático**: Análisis inteligente de URLs y detección automática de industria
- ✅ **Modo Manual**: Control total sobre estilo, texto y composición
- ✅ **Sistema de Créditos**: Gestión de recursos por planes de usuario
- ✅ **Marca Personal**: Gestión de múltiples marcas por usuario
- ✅ **Calendario Comercial**: Recordatorios de fechas促销 chilenas
- ✅ **Edición de Overlays**: Texto, logo y producto superpuestos con drag & drop

---

## 2. 🏗️ ARQUITECTURA TÉCNICA

### 2.1 Stack Tecnológico

```
Frontend:
├── React 18.3 (TypeScript)
├── Vite 6.0 (Build Tool)
├── Tailwind CSS 4.0 (Estilos)
├── React Router 7 (Navegación)
└── SweetAlert2 (Notificaciones)

Backend (BaaS):
├── Supabase (Auth + Database + Storage)
├── Google Gemini API (Imágenes + Videos)
└── Netlify (Hosting + Edge Functions)

Herramientas de Desarrollo:
├── ESLint (Linting)
├── TypeScript 5.x (Tipado)
└── PostCSS (Procesamiento CSS)
```

### 2.2 Estructura de Archivos

```
estudio-56/
├── App.tsx                          # Componente principal con routing
├── index.tsx                        # Entry point
├── index.html                       # Plantilla HTML
├── package.json                     # Dependencias
├── vite.config.ts                   # Configuración Vite
├── tsconfig.json                    # Configuración TypeScript
├── netlify.toml                     # Configuración Netlify
├── constants.ts                     # Estilos y configuraciones globales
├── types.ts                         # Definiciones de tipos TypeScript
│
├── components/                      # Componentes React
│   ├── Dashboard.tsx               # Panel principal
│   ├── FlyerForm.tsx               # Formulario de creación
│   ├── FlyerDisplay.tsx            # Visualización y descarga
│   ├── TextEditorPanel.tsx         # Editor de texto avanzado
│   ├── StyleGallery.tsx            # Galerías de estilos
│   ├── PricingModal.tsx            # Modal de precios
│   ├── BrandPanel.tsx              # Gestión de marcas
│   ├── CommercialCalendar.tsx      # Calendario comercial
│   ├── LoginPage.tsx               # Página de login
│   ├── RegisterPage.tsx            # Página de registro
│   └── [otras páginas]             # Auth, Perfil, Legal
│
├── services/                       # Servicios de negocio
│   ├── supabaseService.ts          # Autenticación y DB
│   ├── geminiService.ts            # IA de Google
│   ├── creditService.ts            # Sistema de créditos
│   ├── brandService.ts             # Gestión de marcas
│   ├── flyerGenerationService.ts   # Generaciones guardadas
│   ├── videoPostProcessingService.ts # FFmpeg.wasm
│   ├── compositionExportService.ts # Exportación de imágenes
│   ├── domCaptureService.ts        # Captura DOM
│   └── [servicios de análisis]     # IA para análisis de imagen
│
├── hooks/                          # Custom hooks
│   └── useDraggable.ts             # Hook para drag & drop
│
├── database/                       # Scripts SQL
│   ├── schema.sql                  # Schema completo
│   └── [scripts de migración]
│
└── scripts/                        # Scripts de utilidad
    ├── setup-database.js
    ├── insert-default-data.js
    └── [scripts varios]
```

### 2.3 Configuración de Headers (COOP/COEP)

**Archivo**: `netlify.toml`

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Embedder-Policy = "credentialless"
    Cross-Origin-Opener-Policy = "same-origin"
```

Esta configuración es **CRÍTICA** para:
- Habilitar `SharedArrayBuffer` en el navegador
- Permitir el funcionamiento de FFmpeg.wasm
- Procesamiento de video en el cliente

---

## 3. 🎨 SISTEMA DE ESTILOS (FLYER_STYLES)

La aplicación cuenta con **29 estilos predefinidos** organizados en categorías:

### 3.1 Categorías de Estilos

| Categoría | Descripción | Estilos Incluidos |
|-----------|-------------|-------------------|
| **VENTAS** | Ofertas y Liquidaciones | retail_sale, typo_bold, auto_metallic, gastronomy, market_handwritten |
| **CORPORATIVO** | Negocios profesionales | corporate, medical_clean, tech_saas, edu_sketch, political_community |
| **LIFESTYLE** | Estilo de vida | aesthetic_min, wellness_zen, pilates, summer_beach, eco_organic, sport_gritty |
| **NOCHE** | Entretenimiento nocturno | urban_night, luxury_gold, realestate_night, gamer_stream, indie_grunge |
| **EVENTOS** | Celebraciones especiales | kids_fun, worship_sky, seasonal_holiday, art_double_exp, retro_vintage, podcast_mic |
| **CUSTOM** | Personalizado | brand_identity (detectado desde URL) |

### 3.2 Detalle de Cada Estilo

#### retail_sale (Ofertas/Liquidación)
- **Prompt**: "High-End 3D Commercial Art. Dynamic zero-gravity explosion, floating 3D percentage signs (%), confetti."
- **Movimiento**: "Confetti falls in the foreground. 3D elements float gently."
- **Ejemplo**: "Tienda 'El Ofertón': Liquidación de Invierno, todo con 50% de descuento."

#### gastronomy (Gastronomía/Sushi)
- **Prompt**: "Michelin-Star Food Photography. 100mm Macro Lens. Backlit with warm golden light, visible water droplets, steam rising."
- **Movimiento**: "Cinematic Macro (extreme close-up) with minimal movement, steam rising softly."
- **Ejemplo**: "Sanguchería 'El Guatón': Churrasco Italiano XL + Schop Artesanal a $8.990."

#### corporate (Corporativo/Inmobiliaria)
- **Prompt**: "Premium Corporate Editorial (Forbes Magazine style). 50mm Prime Lens, f/1.8 aperture. Blurred modern glass architecture."
- **Movimiento**: "Extremely slow parallax slide. The person is anchored and static."
- **Ejemplo**: "Inmobiliaria 'Los Andes': Últimas unidades en Las Condes, entrega inmediata."

#### medical_clean (Médico/Clínica)
- **Prompt**: "Sterile Medical Design. Pure White and Light Cyan palette. Bright, shadowless clinical light."
- **Movimiento**: "Clean mechanical camera slide (Slider shot) over static medical equipment."
- **Ejemplo**: "Centro Dental 'Sonrisas': Ortodoncia Invisible, evaluación inicial sin costo."

#### urban_night (Discoteca/Neón)
- **Prompt**: "Cyberpunk Nightlife / Concert Photography. Volumetric fog, Laser lights. Neon Purple, Cyan, Magenta."
- **Movimiento**: "Subject stands cool and static. Neon lights trail rapidly around them. Smoke swirls."
- **Ejemplo**: "Club 'La Casona': Sábado de Reggaeton Old School, ellas entran gratis hasta la 1 AM."

#### luxury_gold (Gala VIP/Año Nuevo)
- **Prompt**: "Luxury Royal Aesthetic. Gold foil, black silk, marble, glitter. Soft warm sparkling bokeh."
- **Movimiento**: "Smooth gliding camera (Gimbal shot), gold particles floating in the air."
- **Ejemplo**: "Evento 'Gala Vino': Degustación Premium en Hotel W, reserva tu mesa."

#### wellness_zen (Spa/Yoga)
- **Prompt**: "Zen Wellness Photography. Soft candle light, dim and relaxing. Water ripples, bamboo, steam."
- **Movimiento**: "Tripod shot (Static), water dripping in super slow motion, candle flame flickering gently."
- **Ejemplo**: "Centro 'Alma Zen': Masaje descontracturante y piedras calientes 2x1."

#### sport_gritty (Deporte/Gym)
- **Prompt**: "Gritty Sports Commercial Photography (Nike Campaign). 'Rembrandt Lighting', high contrast, harsh rim light."
- **Movimiento**: "Super slow motion. Subject is tensed and breathing heavily. Sweat drips."
- **Ejemplo**: "Gimnasio 'Titanium': Plan Anual 50% OFF, sin matrícula de incorporación."

#### market_handwritten (Feria Libre Chilena)
- **Prompt**: "Traditional Chilean Market ('Feria Libre') Aesthetic. Colorful cardboard signs with handwritten prices in thick black marker."
- **Movimiento**: "Slow pan across market stalls, vendors arranging products, sunlight filtering through awnings."
- **Ejemplo**: "Verdulería 'Don Pedro': Tomates a $1.500 el kilo, limones $500, ofertas de la semana."

---

## 4. 🎬 SISTEMA DE VIDEOS (VIDEO_STYLES)

La aplicación incluye **25 estilos de video** con prompts de movimiento específicos:

### 4.1 Configuración de Video

| Configuración | Draft | Producción |
|--------------|-------|------------|
| **Modelo** | veo-3.1-fast-generate-preview | veo-3.1-generate-preview |
| **Resolución** | 720p | 1080p |
| **Velocidad** | Fast | Standard |
| **Calidad** | Standard | High |
| **Costo** | 0.3x | 1.0x |

### 4.2 Estilos de Video Principales

1. **video_retail_sale**: Explosión 3D con confetti
2. **video_summer_beach**: Piscina infinita con cóctel
3. **video_worship_sky**: Siluetas con rayos de luz divina
4. **video_urban_night**: DJ con neón y humo
5. **video_gastronomy**: Hamburguesa con queso derritiéndose
6. **video_sport_gritty**: Atleta sudando en slow motion
7. **video_luxury_gold**: Brindis con champagne y oro
8. **video_medical_clean**: Doctor con ADN en fondo
9. **video_tech_saas**: Cerebro digital con nodos
10. **video_wellness_zen**: Gota de agua creando ripples

---

## 5. 🔧 MODOS DE TRABAJO

### 5.1 Modo Automático (AUTO)

El sistema analiza la entrada del usuario y detecta automáticamente:

1. **Industria**: Basado en palabras clave
   - Pilates/Yoga → wellness_zen
   - Iglesia → worship_sky
   - Gym/Deporte → sport_gritty
   - Belleza → aesthetic_min
   - Ofertas → retail_sale
   - Gastronomía → gastronomy
   - Y más...

2. **Objetivo de Marketing**:
   - **Branding**: Reconocimiento de marca
   - **Leads**: Generar conversiones

3. **Texto Automático**:
   - Plantillas específicas por industria
   - Generación con IA como fallback

### 5.2 Modo Manual (MANUAL)

El usuario tiene control total sobre:
- Selección de estilo
- Texto personalizado
- Posición de elementos
- Formato (1:1, 9:16, 4:5)
- Calidad (Draft/HD)

---

## 6. 📐 FORMATOS DE IMAGEN SOPORTADOS

### Formatos Principales

| Formato | Dimensiones | Uso |
|---------|-------------|-----|
| **1:1** | 1080x1080 | Instagram/Facebook Ads |
| **9:16** | 1080x1920 | Stories/Reels/TikTok |
| **4:5** | 1080x1350 | Instagram Feed Vertical |
| **1.91:1** | 1200x628 | Facebook Link Post |
| **16:9** | 1920x1080 | Video Horizontal |

---

## 7. 🔄 SISTEMA DE GENERACIÓN

### 7.1 Flujo de Generación de Imágenes

```
┌─────────────────┐
│  Input Usuario  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Modo Auto/Manual│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Enhance Prompt │
│  (Español→Inglés)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Seleccionar    │
│  Estilo         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Generar Imagen │
│  (Gemini Flash) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Diagnóstico    │
│  (Corregir      │
│  imágenes negras)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Análisis IA    │
│  (Tipografía,   │
│  Contraste,     │
│  Composición)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Mostrar        │
│  Resultado      │
└─────────────────┘
```

### 7.2 Flujo de Mejora a HD

```
┌─────────────────┐
│  Imagen Draft   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Generar HD     │
│  (Gemini Pro)   │
│  Usando Draft   │
│  como Referencia│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Mostrar        │
│  Comparación    │
│  Draft vs HD    │
└─────────────────┘
```

### 7.3 Flujo de Generación de Videos

```
┌─────────────────┐
│  Input Usuario  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Generar Imagen │
│  Base (Draft)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Generar Video  │
│  (Google VEO)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Descargar      │
│  Video          │
└─────────────────┘
```

---

## 8. 🖼️ SISTEMA DE OVERLAYS

### 8.1 Elementos Superpuestos

| Elemento | Características |
|----------|-----------------|
| **Texto** | Drag & drop, redimensionable, efectos (sombra/borde/brillo) |
| **Logo** | Recolor automático, filtros (grayscale, brightness, contrast, opacity) |
| **Producto** | Imagen subida por usuario, posicionamiento libre |

### 8.2 Editor de Texto

**Efectos Disponibles**:
- ✅ Sombra (shadow)
- ✅ Borde (stroke)
- ✅ Brillo (glow)

**Estilos de Tipografía**:
- Familia de fuente
- Tamaño
- Peso (bold, normal)
- Color
- Espaciado
- Transformación (mayúsculas, capitalize)

### 8.3 Filtros de Logo

| Filtro | Rango | Descripción |
|--------|-------|-------------|
| Grayscale | 0-100% | Convierte a escala de grises |
| Brightness | 50-200% | Ajusta luminosidad |
| Contrast | 50-200% | Ajusta contraste |
| Opacity | 0-100% | Ajusta transparencia |

---

## 9. 💰 SISTEMA DE CRÉDITOS

### 9.1 Planes

| Plan | Créditos/Mes | Precio |
|------|--------------|--------|
| **GRATIS** | Limitado | $0 |
| **PRO** | Ilimitado | Por definir |
| **AGENCIA** | Multi-usuario | Por definir |

### 9.2 Tipos de Crédito

| Tipo | Uso |
|------|-----|
| `draft` | Generación de borrador |
| `final_image` | Mejora a HD |
| `video` | Generación de video |
| `product_study` | Mejora de imagen propia |

---

## 10. 🏢 SISTEMA DE MARCAS (BRANDS)

### 10.1 Estructura de Marca

```typescript
interface Brand {
  id: string;
  user_id: string;
  name: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  website_url?: string;
  instagram_url?: string;
  is_default: boolean;
  created_at: string;
}
```

### 10.2 Funcionalidades

- ✅ Crear múltiples marcas
- ✅ Seleccionar marca activa
- ✅ Colores personalizados
- ✅ Logos por marca
- ✅ Marca por defecto

---

## 11. 📅 CALENDARIO COMERCIAL

### 11.1 Fechas促销 Chilenas

| Fecha | Evento |
|-------|--------|
| 18 Septiembre | Fiestas Patrias |
| Octubre | Halloween |
| Noviembre | Black Friday |
| Diciembre | Navidad |
| Enero | Verano |
| Febrero | San Valentín |

### 11.2 Funcionalidades

- ✅ Visualización de calendario
- ✅ Recordatorios de eventos
- ✅ Generación rápida para eventos
- ✅ Notificaciones automáticas

---

## 12. 🔐 AUTENTICACIÓN

### 12.1 Proveedores

- **Email/Password**: Autenticación tradicional
- **Google OAuth**: Login con cuenta Google

### 12.2 Flujo de Auth

```
Login/Registro → Supabase Auth → Sesión Activa
                                    ↓
                           Verificar en DB (users)
                                    ↓
                           Cargar plan y créditos
                                    ↓
                           Acceso a Dashboard
```

---

## 13. 📊 ANÁLISIS INTELIGENTE DE IMÁGENES

### 13.1 Servicios de Análisis

| Servicio | Función |
|----------|---------|
| `imageAnalysisService` | Análisis de imagen para texto |
| `contextualTypographyService` | Tipografía contextual |
| `contrastAnalysisService` | Análisis de contraste |
| `contextualEffectsService` | Efectos contextuales |
| `compositionAnalysisService` | Composición para texto |
| `autoTextValidationService` | Validación automática |

### 13.2 Salida de Análisis

```typescript
interface GeneratedImageResult {
  imageDataUrl: string;
  imageAnalysis?: ImageAnalysisResult;
  contextualTypography?: ContextualTypographyResult;
  contrastAnalysis?: ContrastAnalysis;
  contextualEffects?: ContextualEffects;
  compositionAnalysis?: CompositionAnalysisResult;
  enhancedStyles?: {
    typography: any;
    contrast: any;
    effects: any;
    composition: any;
    combinedClasses: string;
  };
}
```

---

## 14. 🎬 PROCESAMIENTO DE VIDEO CON FFmpeg.wasm

### 14.1 Configuración Requerida

**Headers HTTP**:
```
Cross-Origin-Embedder-Policy: credentialless
Cross-Origin-Opener-Policy: same-origin
```

### 14.2 Funcionalidades

| Función | Descripción |
|---------|-------------|
| `processVideoWithOverlays` | Procesa video con logo y texto |
| `downloadProcessedVideo` | Descarga video procesado |
| `downloadOriginalVideo` | Descarga video original |
| `isSharedArrayBufferSupported` | Verifica soporte del navegador |
| `loadFFmpeg` | Carga FFmpeg.wasm |

### 14.3 Flujo de Procesamiento

```
┌─────────────────┐
│  Video Original │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cargar FFmpeg  │
│  (SharedArray   │
│   Buffer)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Agregar Logo   │
│  (Posición %)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Quemar Texto   │
│  (Burn-in)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Exportar MP4   │
│  (H.264)        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Descargar      │
└─────────────────┘
```

---

## 15. 📤 EXPORTACIÓN

### 15.1 Imágenes

**Método**: Captura DOM con html2canvas

**Resoluciones**:
- Draft: 1x (resolución nativa)
- HD: 2x (alta resolución)

### 15.2 Videos

**Método**: FFmpeg.wasm (cliente) o descarga directa

**Formatos**: MP4 (H.264)

---

## 16. 🌐 CONTEXTO CHILENO

### 16.1 Adaptaciones

| Aspecto | Adaptación |
|---------|------------|
| **Idioma** | Español chileno |
| **Moneda** | Pesos Chilenos ($) |
| **Formato moneda** | $1.000 (con punto) |
| **Fechas** | Formato DD/MM |
| **Personas** | Fenotipo chileno (herencia mixta) |
| **Clima** | Templado/fresco (no tropical) |
| **Eventos** | Fiestas Patrias, Cyber Monday, etc. |

### 16.2 Contextos de Fondo

```typescript
// Contexto base (aplica a todo)
CHILEAN_BASE_CONTEXT = `
LOCALE SETTING: Chile (South America).
FACES/PEOPLE: Chilean phenotypes.
TEXT: Spanish only (NO English).
CURRENCY: Chilean Peso format with dot separator.
`

// Contexto outdoor (estilos de paisaje)
CHILEAN_OUTDOOR_CONTEXT = `
GEOGRAPHIC SETTING: CHILE.
COAST: Pacific Ocean (dark blue, grey sand).
LAKE/SOUTH: Volcanoes, green forests.
CENTRAL ZONE: Mediterranean, dry hills.
MOUNTAINS: The Andes (snow-capped).
`

// Contexto studio (estilos interiores)
CHILEAN_STUDIO_CONTEXT = `
BACKGROUND: STUDIO / INDOOR.
FORBIDDEN: Landscapes, mountains, skies.
`
```

---

## 17. 🔑 PROMPTS DEL SISTEMA

### 17.1 Prompt Maestro (HD)

```typescript
MASTER_STYLE = `
Professional social media flyer design.
Aesthetic: GraphicRiver bestseller, glossy finish,
ultra-detailed, commercial photography, 8k resolution,
Unreal Engine 5 render style.
`
```

### 17.2 Regla Anti-Texto

```typescript
STRICT PROHIBITION - ZERO TOLERANCE:
1. ABSOLUTELY NO TEXT whatsoever
2. NO letters, numbers, words, symbols
3. NO signs, menus, billboards, posters
4. NO text on clothing, products, walls
5. Text will be added LATER as overlay
```

---

## 18. 📱 INTERFAZ DE USUARIO

### 18.1 Layout Principal

```
┌─────────────────────────────────────────┐
│  [Header: Logo + Marca + Plan]          │
├──────────────┬──────────────────┬───────┤
│              │                  │       │
│  LEFT PANEL  │   CENTER        │ RIGHT │
│  (Controles) │   (Canvas)      │ PANEL │
│              │                  │(Calendario)│
│              │                  │       │
│  - FlyerForm │  - FlyerDisplay │       │
│  - TextEditor│  - Comparación  │       │
│              │                  │       │
├──────────────┴──────────────────┴───────┤
│  [Footer: Links legales + Logout]       │
└─────────────────────────────────────────┘
```

### 18.2 Componentes Principales

| Componente | Función |
|------------|---------|
| `Dashboard` | Contenedor principal |
| `FlyerForm` | Formulario de entrada |
| `FlyerDisplay` | Visualización y acciones |
| `TextEditorPanel` | Editor avanzado de texto |
| `StyleGallery` | Selector de estilos |
| `BrandPanel` | Gestión de marcas |
| `CommercialCalendar` | Calendario comercial |
| `PricingModal` | Planes y precios |

---

## 19. 🔧 SERVICIOS TÉCNICOS

### 19.1 Servicios de IA

| Servicio | Función |
|----------|---------|
| `geminiService.ts` | Generación de imágenes y videos |
| `imageAnalysisService.ts` | Análisis de imagen |
| `magicModeService.ts` | Detección automática de estilo |

### 19.2 Servicios de Exportación

| Servicio | Función |
|----------|---------|
| `compositionExportService.ts` | Exportación de composiciones |
| `domCaptureService.ts` | Captura de DOM |
| `videoPostProcessingService.ts` | Procesamiento de video |

### 19.3 Servicios de Negocio

| Servicio | Función |
|----------|---------|
| `supabaseService.ts` | Auth y base de datos |
| `creditService.ts` | Sistema de créditos |
| `brandService.ts` | Gestión de marcas |
| `flyerGenerationService.ts` | Generaciones guardadas |

---

## 20. 🚀 FLUJO DE DESPLIEGUE

### 20.1 Netlify

**Configuración**: `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    Cross-Origin-Embedder-Policy = "credentialless"
    Cross-Origin-Opener-Policy = "same-origin"
```

### 20.2 Variables de Entorno

```env
VITE_SUPABASE_URL=xxx
VITE_SUPABASE_ANON_KEY=xxx
VITE_GEMINI_API_KEY=xxx
```

---

## 21. 📈 ESTADÍSTICAS DEL SISTEMA

### 21.1 Métricas de Código

| Métrica | Valor |
|---------|-------|
| Componentes React | 20+ |
| Servicios | 15+ |
| Estilos de flyer | 29 |
| Estilos de video | 25 |
| Formatos de imagen | 8 |
| Categorías de estilo | 6 |

### 21.2 Funcionalidades por Categoría

| Categoría | Funcionalidades |
|-----------|-----------------|
| **Generación** | Imagen, Video, Mejora de foto propia |
| **Edición** | Texto, Logo, Producto, Filtros |
| **Análisis** | Detección de industria, Texto automático |
| **Gestión** | Marcas, Créditos, Calendario |
| **Exportación** | PNG, MP4, Comparación |

---

## 22. 🔄 FLUJOS DE USUARIO

### 22.1 Flujo Completo de Creación

```
1. Usuario entra a la aplicación
   ↓
2. Inicia sesión (si no está logueado)
   ↓
3. Selecciona marca (opcional)
   ↓
4. Elige modo: AUTO o MANUAL
   ↓
5. Ingresa descripción o URL
   ↓
6. (Auto) Sistema detecta industria y estilo
   ↓
7. (Auto) Usuario selecciona objetivo (Branding/Leads)
   ↓
8. (Auto) Sistema genera opciones de texto
   ↓
9. Usuario selecciona texto
   ↓
10. Elige formato (1:1, 9:16, etc.)
    ↓
11. Elige tipo: Imagen, Video, o Estudio de Producto
    ↓
12. Clic en "GENERAR"
    ↓
13. Sistema procesa y muestra resultado
    ↓
14. Usuario edita overlays (texto, logo, producto)
    ↓
15. Usuario descarga resultado
```

### 22.2 Flujo de Mejora HD

```
1. Usuario tiene imagen draft
   ↓
2. Clic en "ESCALAR A HD"
   ↓
3. Sistema usa imagen draft como referencia
   ↓
4. Genera versión HD con mismo estilo
   ↓
5. Muestra comparación Draft vs HD
   ↓
6. Usuario descarga versión HD
```

---

## 23. 🎯 CASOS DE USO

### 23.1 Caso 1: Tienda de Ropa

```
Entrada: "Tienda de ropa femenina en Santiago, precios accesibles, tendencia 2025"
Modo: AUTO
Industria Detectada: retail_sale
Texto Generado: "Nueva Colección 2025 - Hasta 40% DCTO"
Formato: 1:1 (Instagram)
Resultado: Flyer con modelo en tienda, texto superpuesto
```

### 23.2 Caso 2: Restaurante

```
Entrada: "Restaurante de sushi premium en Providencia"
Modo: AUTO
Industria Detectada: gastronomy
Texto Generado: "Sushi Premium - Reserva Tu Mesa"
Formato: 9:16 (Stories)
Resultado: Close-up de sushi con iluminación dorada
```

### 23.3 Caso 3: Gimnasio

```
Entrada: "Gimnasio funcional en Maipú, clases grupales"
Modo: AUTO
Industria Detectada: sport_gritty
Texto Generado: "Transforma Tu Cuerpo Hoy"
Formato: 4:5 (Instagram Feed)
Resultado: Atleta sudando con iluminación dramática
```

### 23.4 Caso 4: Video Promocional

```
Entrada: "Bar de tragos en Bellavista, ambiente nocturno"
Modo: AUTO (Video)
Industria Detectada: urban_night
Estilo de Video: video_urban_night
Formato: 9:16
Resultado: Video de 6 segundos con DJ y neón
```

---

## 24. 🔐 SEGURIDAD

### 24.1 Autenticación

- Supabase Auth con JWT
- Tokens almacenados de forma segura
- Refresh token automático

### 24.2 Base de Datos

- RLS (Row Level Security) habilitado
- Acceso solo a datos propios
- Validación en el servidor

### 24.3 API

- Claves de API en variables de entorno
- Rate limiting (por implementar)
- Validación de inputs

---

## 25. 📊 LIMITACIONES Y MEJORAS

### 25.1 Limitaciones Actuales

| Limitación | Descripción |
|------------|-------------|
| Cuota VEO | Límite de generación de video |
| SharedArrayBuffer | No funciona en todos los navegadores |
| Tamaño de imagen | Máximo 10MB para subida |
| Procesamiento video | Solo en navegadores modernos |

### 25.2 Mejoras Planificadas

| Mejora | Prioridad |
|--------|-----------|
| Más estilos de video | Media |
| Editor de video avanzado | Alta |
| Templates por industria | Media |
| Colaboración multi-usuario | Baja |
| Integración con redes sociales | Media |

---

## 26. 📚 DOCUMENTACIÓN ADICIONAL

### Archivos de Documentación

| Archivo | Descripción |
|---------|-------------|
| `PROMPTS-COMPLETOS-ESTUDIO-56.md` | Prompts completos del sistema |
| `README.md` | Documentación general |
| `GUIA-DETALLADA-SUPABASE.md` | Guía de Supabase |
| `SOLUCION-COMPLETA-FINAL.md` | Solución de problemas |

---

## 27. 🛠️ TROUBLESHOOTING

### 27.1 Problemas Comunes

| Problema | Solución |
|----------|----------|
| Imagen en negro | Sistema de diagnóstico automático |
| Video no descarga | Verificar soporte SharedArrayBuffer |
| Estilo incorrecto | Verificar palabras clave en descripción |
| Texto no aparece | Verificar que overlayText no esté vacío |

### 27.2 Verificación de Configuración

```javascript
// Verificar en consola del navegador
console.log('crossOriginIsolated:', window.crossOriginIsolated);
// Debe ser: true
```

---

## 28. 📈 FUTURO DE LA APLICACIÓN

### 28.1 Roadmap

| Versión | Funcionalidades |
|---------|-----------------|
| v2.1 | Más estilos de video |
| v2.2 | Editor de video avanzado |
| v2.3 | Integración con Instagram |
| v2.4 | Team collaboration |
| v3.0 | AI Agent personalizado |

### 28.2 Integraciones Futuras

- Instagram API (publicación directa)
- WhatsApp Business API
- Shopify (productos automáticos)
- Canva (exportación)

---

## 29. 👥 EQUIPO DE DESARROLLO

### Roles

- **Desarrollo Frontend**: React, TypeScript, Tailwind
- **Desarrollo Backend**: Supabase, Node.js
- **IA/ML**: Google Gemini API, VEO
- **DevOps**: Netlify, CI/CD

---

## 30. 📝 NOTAS DE VERSIÓN

### v2.0.0 (Actual)

✅ Sistema de generación de imágenes HD
✅ Generación de video con VEO 3.1
✅ Modo automático con detección de industria
✅ Sistema de marcas múltiples
✅ Calendario comercial chileno
✅ Editor de overlays avanzado
✅ Procesamiento de video con FFmpeg.wasm
✅ Sistema de créditos
✅ Comparación Draft vs HD

### v1.x (Anterior)

✅ Versión inicial
✅ Generación básica de flyers
✅ Autenticación Supabase

---

## 31. 🔗 ENLACES ÚTILES

- **Producción**: https://estudio56.netlify.app
- **Documentación Gemini**: https://ai.dev/google/gemini
- **Supabase**: https://supabase.com
- **Netlify**: https://netlify.com

---

## 32. 📊 RESUMEN TÉCNICO FINAL

### Stack Completo

```
Frontend: React + TypeScript + Vite + Tailwind CSS
Backend: Supabase (PostgreSQL + Auth + Storage)
IA: Google Gemini (Imagenes) + Google VEO (Videos)
Hosting: Netlify
```

### APIs Utilizadas

```
1. Google Gemini API (imagen generation)
2. Google VEO API (video generation)
3. Supabase Auth (autenticación)
4. Supabase Database (datos)
5. Supabase Storage (archivos)
```

### Funcionalidades Clave

```
✅ 29 estilos de imagen
✅ 25 estilos de video
✅ 8 formatos de imagen
✅ Modo auto/manual
✅ Sistema de marcas
✅ Calendario comercial
✅ Editor de overlays
✅ Procesamiento de video
✅ Sistema de créditos
✅ Comparación Draft/HD
```

### Métricas de Rendimiento

```
Tiempo de generación imagen: 5-15 segundos
Tiempo de generación video: 30-120 segundos
Tiempo de mejora HD: 10-20 segundos
Procesamiento video local: 10-30 segundos
```

---

**Documento generado**: 2026-01-03
**Versión del documento**: 1.0
**Autor**: Sistema de Documentación Estudio 56

---

*Este documento contiene información técnica detallada sobre la aplicación Estudio 56. Para actualizaciones, consultar el repositorio oficial.*
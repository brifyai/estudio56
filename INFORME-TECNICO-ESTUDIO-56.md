# 📋 INFORME TÉCNICO COMPLETO - ESTUDIO 56

## Aplicación de Generación de Flyers con IA para el Mercado Chileno

---

## 1. 🔧 ARQUITECTURA GENERAL

### 1.1 Stack Tecnológico

| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| **Frontend** | React 18 + TypeScript | Interfaz de usuario |
| **Build Tool** | Vite 5 | Compilación y desarrollo |
| **Estilos** | Tailwind CSS | Diseño responsive |
| **Backend** | Supabase | Auth, Database, Storage |
| **IA Generativa** | Google Vertex AI | Gemini, Imagen, Veo |
| **Deployment** | Netlify | Hosting y CDN |

### 1.2 Estructura de Archivos

```
estudio-56/
├── src/
│   ├── components/       # Componentes React
│   ├── services/         # Servicios de IA y lógica
│   ├── constants/        # Constantes de configuración
│   ├── hooks/            # Custom hooks
│   └── lib/              # Utilidades
├── database/             # Scripts SQL
├── scripts/              # Scripts de utilidad
└── public/               # Archivos estáticos
```

---

## 2. 🤖 MODELOS DE IA Y ENDPOINTS

### 2.1 Google Vertex AI Configuration

```typescript
// src/constants/aiModels.ts
const MODELS = {
  ORCHESTRATOR: 'gemini-2.0-flash-001',      // Prompt building
  DRAFT_ENGINE: 'imagen-3.0-fast-001',        // Imágenes rápidas
  HD_ENGINE: 'imagen-3.0-pro-001',            // Imágenes alta calidad
  VIDEO_ENGINE: 'veo-1.0-preview-001'         // Videos
}
```

| Modelo | Uso | Velocidad | Calidad |
|--------|-----|-----------|---------|
| Gemini 2.0 Flash | Orquestación de prompts | Rápido | Alta |
| Imagen 3.0 Fast | Draft/Preview | Muy rápido | Media |
| Imagen 3.0 Pro | Final HD | Lento | Muy alta |
| Veo 1.0 Preview | Videos | Lento | Alta |

### 2.2 Flujo de Generación de Imágenes

```
Usuario → Gemini (Prompt Builder) → Imagen 3.0 Fast (Draft) → Usuario revisa
                                                      ↓
                                            Imagen 3.0 Pro (HD)
                                                      ↓
                                            Descarga/Publicación
```

---

## 3. 🎨 SISTEMA DE ESTILOS (60 ESTILOS)

### 3.1 Estilos de Flyer (Imágenes)

#### Bloque 1: Estilos Generales (1-20)
| ID | Nombre ES | Categoría | Prompt Key |
|----|-----------|-----------|------------|
| 1 | Identidad de Marca | General | `brand_identity` |
| 2 | Ofertas / Liquidación | Retail | `retail_sale` |
| 3 | Automotriz / Taller | Servicios | `auto_metallic` |
| 4 | Gastronomía / Comida | Food | `gastronomy` |
| 5 | Corporativo / Inmobiliaria | Business | `corporate` |
| 6 | Médico / Salud | Salud | `medical_clean` |
| 7 | Tecnología / Digital | Tech | `tech_saas` |
| 8 | Educación / Clases | Edu | `edu_sketch` |
| 9 | Política / Comunidad | Social | `political_community` |
| 10 | Aesthetic / Belleza | Lifestyle | `aesthetic_min` |
| 11 | Spa / Yoga / Wellness | Wellness | `wellness_zen` |
| 12 | Pilates / Core | Fitness | `pilates` |
| 13 | Verano / Playa | Seasonal | `summer_beach` |
| 14 | Ecológico / Natural | Eco | `eco_organic` |
| 15 | Deporte / Gym | Fitness | `sport_gritty` |
| 16 | Discoteca / Neón | Night | `urban_night` |
| 17 | Lujo / VIP | Premium | `luxury_gold` |
| 18 | Inmobiliaria Premium | Real Estate | `realestate_night` |
| 19 | Gamer / Streaming | Gaming | `gamer_stream` |
| 20 | Rock / Música | Music | `indie_grunge` |

#### Bloque 2: Estilos Infantiles y Festivos (21-30)
| ID | Nombre ES | Prompt Key |
|----|-----------|------------|
| 21 | Infantil / Cumpleaños | `kids_fun` |
| 22 | Espiritual / Iglesia | `worship_sky` |
| 23 | Navidad / Festivo | `seasonal_holiday` |
| 24 | Artístico / Teatro | `art_double_exp` |
| 25 | Retro / Vintage | `retro_vintage` |
| 26 | Podcast / Audio | `podcast_mic` |
| 27 | Tipografía Pura | `typo_bold` |
| 28 | Feria / Mercado | `market_handwritten` |

#### Bloque 3: Servicios Chilenos (29-40)
| ID | Nombre ES | Prompt Key |
|----|-----------|------------|
| 29 | Taller Mecánico | `mechanic_workshop` |
| 30 | Vulcanización | `tire_service` |
| 31 | Construcción | `construction_site` |
| 32 | Logística / Delivery | `logistics_delivery` |
| 33 | Panadería | `bakery_bread` |
| 34 | Botillería | `liquor_store` |
| 35 | Comida Rápida | `fast_food_street` |
| 36 | Barbería | `barber_shop` |
| 37 | Veterinaria | `veterinary_clinic` |
| 38 | Gasfitería / Climatización | `hvac_plumbing` |
| 39 | Centro Dental | `dental_clinic` |
| 40 | Kinesiología | `physiotherapy` |

#### Bloque 4: Servicios Especializados (41-60)
| ID | Nombre ES | Prompt Key |
|----|-----------|------------|
| 41 | Estudio Jurídico | `law_accounting` |
| 42 | Jardinería | `gardening_landscaping` |
| 43 | Seguridad | `security_systems` |
| 44 | Sushi / Nikkei | `sushi_nikkei` |
| 45 | Pizzería | `pizzeria` |
| 46 | Heladería | `ice_cream` |
| 47 | Nail Studio | `nail_studio` |
| 48 | Tattoo Studio | `tattoo_studio` |
| 49 | Yoga Studio | `yoga_studio` |
| 50 | Car Detailing | `car_detailing` |
| 51 | Óptica | `optical` |
| 52 | Librería | `bookstore` |
| 53 | Florería | `flower_shop` |
| 54 | Transporte Escolar | `transport_school` |
| 55 | Ferretería | `hardware_store` |
| 56 | Limpieza | `cleaning_service` |
| 57 | Agencia de Viajes | `travel_agency` |
| 58 | Lavandería | `laundry` |
| 59 | Zapatería | `shoe_store` |
| 60 | Servicio Técnico | `tech_repair` |
| 61 | Pastelería | `pastry_shop` |

### 3.2 Estilos de Video (60 Estilos v2.0)

#### Bloque 1: Retail y Estética (1-20)
| ID | Nombre ES | Prompt Key |
|----|-----------|------------|
| 1 | Retail General | `video_retail_gen` |
| 2 | Moda Mujer | `video_fashion_women` |
| 3 | Moda Hombre | `video_fashion_men` |
| 4 | Calzado | `video_footwear` |
| 5 | Joyas | `video_jewelry` |
| 6 | Óptica | `video_optics` |
| 7 | Belleza/Cosmética | `video_beauty` |
| 8 | Perfumería | `video_perfume` |
| 9 | Bolsos/Carteras | `video_bags` |
| 10 | Accesorios Tech | `video_tech_acc` |
| 11 | Smartphones | `video_smartphone` |
| 12 | Computación | `video_computing` |
| 13 | Gaming | `video_gaming` |
| 14 | Fotografía | `video_photography` |
| 15 | Audio/Sonido | `video_audio` |
| 16 | Relojes | `video_watches` |
| 17 | Decoración | `video_decor` |
| 18 | Muebles | `video_furniture` |
| 19 | Iluminación | `video_lighting` |
| 20 | Electrodomésticos | `video_appliances` |

#### Bloque 2: Salud y Deporte (21-30)
| ID | Nombre ES | Prompt Key |
|----|-----------|------------|
| 21 | Gimnasio/Deporte | `video_gym` |
| 22 | Gastronomía | `video_gastronomy` |
| 23 | Spa/Wellness | `video_wellness_zen` |
| 24 | Médico/Clínico | `video_medical` |
| 25 | Corporativo | `video_corporate` |
| 26 | Inmobiliaria | `video_real_estate` |
| 27 | Automotriz | `video_automotive` |
| 28 | Mascotas | `video_pets` |
| 29 | Viajes | `video_travel` |
| 30 | Construcción | `video_construction` |

#### Bloque 3-5: Servicios Especializados (31-60)
| ID | Nombre ES | Prompt Key |
|----|-----------|------------|
| 31 | Taller Mecánico | `video_mechanic` |
| 32 | Vulcanización | `video_tire_service` |
| 33 | Barbería | `video_barber` |
| 34 | Veterinaria | `video_veterinary` |
| 35 | Yoga | `video_yoga` |
| 36 | Pilates | `video_pilates` |
| 37 | Kinesiología | `video_physiotherapy` |
| 38 | Estudio Jurídico | `video_legal` |
| 39 | Jardinería | `video_gardening` |
| 40 | Seguridad | `video_security` |
| 41-50 | Gastronomía Especializada | `video_sushi`, `video_fast_food`, etc. |
| 51-60 | Comercio Especializado | `video_butcher`, `video_hardware`, etc. |

---

## 4. 🎚️ SISTEMA REALITY SLIDER (Niveles de Realismo)

### 4.1 Escala de 1.0 a 5.0 Estrellas

| Nivel | Categoría | Label | Perfil Técnico |
|-------|-----------|-------|----------------|
| **1.0** | Crudo | CCTV / Seguridad | Evidencia / Seguridad |
| **1.5** | Crudo | Cámara Espía | Captura 'In fraganti' |
| **2.0** | Auténtico | Celular Básico | Post rápido / Espontáneo |
| **2.5** | Auténtico | **Auténtico Local** | **El ancla de Estudio 56** |
| **3.0** | Profesional | Semi-Pro | Perfil de Negocio Google |
| **3.5** | Profesional | Comercial | Web / Landing Page |
| **4.0** | Aspiracional | Editorial | Catálogo / Revista |
| **4.5** | Aspiracional | Premium Ad | Campañas de Pago (Ads) |
| **5.0** | Lujo | Cinematográfico | Branding Aspiracional |

### 4.2 Características por Nivel

#### 🔴 CRUDO (1.0 - 1.5)
- **Iluminación:** Poor overhead lighting, harsh fluorescent
- **Cámara:** Old security camera, 480p, visible compression
- **Humanos:** Unrecognizable faces, candid and unpolished
- **Negative Prompt:** `professional lighting, studio, sharp focus`

#### 🟢 AUTÉNTICO (2.0 - 2.5) - DEFAULT
- **Iluminación:** Standard overhead LED, natural window light
- **Cámara:** Modern smartphone, 12-48MP, visible skin pores
- **Humanos:** Average person, natural sweat visible, relatable
- **Negative Prompt:** `luxury, marble, cinematic, airbrushed skin`

#### 🔵 PROFESIONAL (3.0 - 3.5)
- **Iluminación:** Balanced natural light, soft shadows
- **Cámara:** Entry-level DSLR, 1080p-4k, shallow bokeh
- **Humanos:** Fit but relatable subjects, genuine smiles
- **Negative Prompt:** `digital noise, blurry, messy, poor lighting`

#### 🟣 ASPIRACIONAL (4.0 - 4.5)
- **Iluminación:** Professional softbox, perfect highlights
- **Cámara:** High-end camera, 8k capable, cinematic bokeh
- **Humanos:** Fit models, quality branded clothing, subtle makeup
- **Negative Prompt:** `scuffed walls, sweat, realistic clutter`

#### 🏆 LUJO (5.0)
- **Iluminación:** Cinematic sunset, studio softboxes, dramatic
- **Cámara:** Arri Alexa or RED, 8k raw, film grain aesthetic
- **Humanos:** Supermodel, perfect skin, designer luxury wear
- **Negative Prompt:** `poverty, real life, basic equipment`

### 4.3 Funciones del Reality Mapper

```typescript
// Obtener configuración completa
getRealityConfig(stars: RealityLevel): RealityPromptConfig

// Obtener label
getRealityLabel(stars: RealityLevel): string

// Generar bloque de prompt completo
getRealityPromptBlock(stars: RealityLevel): string

// Verificar categoría
getRealityCategory(stars: RealityLevel): 'crudo'|'autentico'|'profesional'|'aspiracional'|'lujo'

// Determinar si es realista (≤2.5)
isRealisticLevel(stars: RealityLevel): boolean

// Determinar si es aspiracional (≥4.0)
isAspirationalLevel(stars: RealityLevel): boolean

// Generar prompt completo combinando todos los elementos
buildRealityPrompt(basePrompt: string, stars: RealityLevel): string
```

---

## 5. 🏭 SISTEMA ART DIRECTION (60 RUBROS)

### 5.1 Industrias por Fase

#### Fase 1: Retail y Belleza (1-20)
| ID | Rubro | Descripción |
|----|-------|-------------|
| 1 | Tienda de Ropa | Retail de moda femenina/masculina |
| 2 | Boutique | Moda exclusiva y accesorios |
| 3 | Joyería | Joyas, relojes y bisutería |
| 4 | Óptica | Lentes y atención visual |
| 5 | Perfumería | Fragancias y cosméticos |
| 6 | Belleza | Centros estéticos y belleza |
| 7 | Nail Studio | Uñas y manicure |
| 8 | Peluquería | Cabello y styling |
| 9 | Barbería | Servicios masculinos |
| 10 | Spa | Relax y bienestar |

#### Fase 2: Gastronomía (21-40)
| ID | Rubro | Descripción |
|----|-------|-------------|
| 21 | Restaurant | Comida formal y gourmet |
| 22 | Café | Cafeterías y coffee shop |
| 23 | Bar | Bebidas y vida nocturna |
| 24 | Pastelería | Dulces y repostería |
| 25 | Panadería | Pan artesanal y masas |
| 26 | Heladería | Postres fríos |
| 27 | Comida Rápida | Fast food y delivery |
| 28 | Sushi | Cocina japonesa |
| 29 | Pizzería | Pizza artesanal |
| 30 | Vegetariano | Comida saludable |

#### Fase 3: Salud y Fitness (41-60)
| ID | Rubro | Descripción |
|----|-------|-------------|
| 41 | Gimnasio | Fitness y entrenamiento |
| 42 | Yoga | Meditación y flexibilidad |
| 43 | Pilates | Ejercicio estructurado |
| 44 | Crossfit | Entrenamiento intenso |
| 45 | Natación | Acuática y deportes |
| 46 | Deportes | Multimarca deportivo |
| 47 | Médico | Consultas y clínicas |
| 48 | Dental | Odontología |
| 49 | Veterinaria | Mascotas y animales |
| 50 | Farmacia | Salud y medicamentos |

### 5.2 Mapeo Estilo → Rubro

```typescript
// src/constants/artDirectionIndex.ts
STYLE_TO_ART_DIRECTION_MAP: Record<FlyerStyleKey, number> = {
  brand_identity: 1,
  retail_sale: 2,
  auto_metallic: 51,
  gastronomy: 21,
  // ... más mapeos
}
```

---

## 6. 📝 SISTEMA DE PROMPTS

### 6.1 Prompt Base Structure

```typescript
// Composición del prompt final
const FINAL_PROMPT = `
  ${BASE_PROMPT}           // Descripción del producto/servicio
  ${REALITY_SETTINGS}      // Configuración del slider (1.0-5.0)
  ${ART_DIRECTION}         // Rubro específico
  ${STYLE_MODIFIERS}       // Modificadores del estilo elegido
  ${NEGATIVE_PROMPT}       // Elementos a evitar
`;
```

### 6.2 Negative Prompts Globales (Shields)

```typescript
// src/services/geminiService.ts

// 1. GLOBAL_NEGATIVE_SHIELD - Elementos básicos a evitar
GLOBAL_NEGATIVE_SHIELD = `
  watermark, text overlay, logo overlay, signature,
  ugly, deformed, noisy, blurry, distorted, grainy,
  amateur, low quality, sketch, drawing, cartoon
`

// 2. ANATOMY_SHIELD - Anatomía humana
ANATOMY_SHIELD = `
  missing fingers, extra fingers, fused fingers,
  too many fingers, malformed hands, extra limbs,
  missing arms, missing legs, amputee, disfigured
`

// 3. BONE_ANCHOR_RULES - Estructura ósea
BONE_ANCHOR_RULES = `
  natural neck, proper shoulder alignment,
  straight spine, natural posture, relaxed shoulders
`

// 4. REAL_BUSINESS_ENVIRONMENT - Entorno de negocio real
REAL_BUSINESS_ENVIRONMENT = `
  visible power outlet, wear mark on floor,
  fire extinguisher on wall, minor clutter,
  functional space, everyday objects
`

// 5. RAW_PHOTO_TEXTURE - Textura de foto cruda
RAW_PHOTO_TEXTURE = `
  visible skin pores, natural skin texture,
  slight imperfections, authentic lighting,
  auto white balance artifacts, mixed color temperature
`

// 6. HUMAN_AUTHENTICITY_RULES - Autenticidad humana
HUMAN_AUTHENTICITY_RULES = `
  natural expressions, genuine smile,
  authentic effort visible, relatable subjects,
  common clothing brands, natural movements
`

// 7. NEGATIVE_TEXT_SHIELD - Bloqueo de texto
NEGATIVE_TEXT_SHIELD = `
  no text, no letters, no words, no typography,
  no signage, no labels, no numbers, no prices
```

### 6.3 Modificadores de Realidad por Modo

```typescript
// src/constants/promptModifiers.ts

const REALIST_MODE = {
  lighting: 'natural daylight, window light, ambient',
  camera: 'shot on iPhone, smartphone camera, authentic',
  human: 'average people, real customers, candid moments'
}

const ASPIRATIONAL_MODE = {
  lighting: 'softbox lighting, professional setup',
  camera: 'DSLR quality, commercial photography',
  human: 'fit models, professional posing, branded clothing'
}

const STUDIO_MODE = {
  lighting: 'studio lighting, controlled environment',
  camera: 'high-end camera, perfect focus',
  human: 'professional models, perfect retouching'
}
```

---

## 7. 🎭 ESTILOS STORY ART (7 Estilos Visuales)

### 7.1 Catálogo de Estilos

| ID | Estilo | Descripción | Prompt Key |
|----|--------|-------------|------------|
| 1 | Vogue Negative | Editorial de moda en negativo | `vogue_negative` |
| 2 | Neon Kinetic | Neón vibrante y movimiento | `neon_kinetic` |
| 3 | Macro Essence | Fotografía macro detallada | `macro_essence` |
| 4 | Cinematic Frame | Formato cinematográfico | `cinematic_frame` |
| 5 | Collage Dynamic | Collage artístico dinámico | `collage_dynamic` |
| 6 | Marble Sculpture | Escultura de mármol | `marble_sculpture` |
| 7 | Anime to Real | Anime convertido a real | `anime_to_real` |

### 7.2 Detalles de Cada Estilo

#### Vogue Negative
- **Categoría:** Fashion / Editorial
- **Colores:** Monocromático, alto contraste
- **Keywords:** `vogue, monochrome, high contrast, editorial`
- **Negative:** `color, rainbow, bright colors`

#### Neon Kinetic
- **Categoría:** Nightlife / Entertainment
- **Colores:** Neón, cian, magenta
- **Keywords:** `neon lights, cyberpunk, vibrant, glowing`
- **Negative:** `dark, muted colors, daylight`

#### Macro Essence
- **Categoría:** Product / Detail
- **Colores:** Naturales, realistas
- **Keywords:** `macro photography, extreme close-up, details`
- **Negative:** `wide shot, distant, zoomed out`

#### Cinematic Frame
- **Categoría:** Video / Motion
- **Colores:** Cinematográficos, dramáticos
- **Keywords:** `cinematic, movie frame, film grain, anamorphic`
- **Negative:** `flat, amateur, snapshot`

#### Collage Dynamic
- **Categoría:** Creative / Art
- **Colores:** Mixtos, artísticos
- **Keywords:** `collage, mixed media, artistic, layered`
- **Negative:** `flat design, simple, minimal`

#### Marble Sculpture
- **Categoría:** Luxury / Premium
- **Colores:** Blanco, mármol, tonos fríos
- **Keywords:** `marble sculpture, classical, elegant, timeless`
- **Negative:** `modern, contemporary, colorful`

#### Anime to Real
- **Categoría:** Creative / Pop Culture
- **Colores:** Estilizados, vibrantes
- **Keywords:** `anime style, japanese art, illustrated`
- **Negative:** `realistic, photographic, 3d render`

---

## 8. 🗣️ SISTEMA MODO MAGIA

### 8.1 Detección Automática de Industria

```typescript
// src/services/magicModeService.ts

detectIndustryFromInput(input: string): IndustryDetection
```

**Keywords de Detección (Prioridad):**

| Prioridad | Industria | Keywords |
|-----------|-----------|----------|
| 1 | Pilates | `pilates`, `reformer`, `core` |
| 2 | Yoga | `yoga`, `meditación`, `postura` |
| 3 | Wellness/SPA | `spa`, `masaje`, `velas`, `sauna` |
| 4 | Iglesia | `iglesia`, `templo`, `congregación` |
| 5 | Gastronomía | `restaurante`, `comida`, `food` |
| 6 | Retail | `tienda`, `shop`, `oferta` |
| 7 | Fitness | `gym`, `gimnasio`, `fitness` |
| 8 | Belleza | `belleza`, `estética`, `skincare` |
| 9 | Médico | `médico`, `doctor`, `clínica` |
| 10 | Tech | `tech`, `software`, `app` |
| ... | ... | ... |

### 8.2 Textos Persuasivos por Industria

```typescript
// Plantillas de texto según objetivo
const BRANDING_TEXTS = [
  'CALIDAD PREMIUM',
  'EXCELENCIA GARANTIZADA',
  'CONFIANZA TOTAL',
  'MARCA LÍDER',
  'TRADICIÓN Y CALIDAD'
]

const LEADS_TEXTS = [
  '¡CONTÁCTANOS YA!',
  'SOLICITA TU COTIZACIÓN',
  'LLAMA AHORA',
  'RESERVA HOY',
  '¡NO TE LO PIERDAS!'
]
```

### 8.3 Mapeo URL a Estilo

```typescript
enhancedUrlAnalysis(url: string): IndustryDetection
```

**Ejemplos de Mapeo:**
- `pizzeria.cl` → `pizzeria` → Estilo: `pizzeria`
- `gymfitness.cl` → `gym` → Estilo: `sport_gritty`
- `sparelax.cl` → `spa` → Estilo: `wellness_zen`

---

## 9. 💳 SISTEMA DE CRÉDITOS

### 9.1 Planes de Suscripción

| Plan | Precio CLP | Créditos/Mes | Features |
|------|------------|--------------|----------|
| **GRATIS** | $0 | 5 | Limitado |
| **ESTOY PARTIENDO** | $4.990 | 20 | Básico |
| **JEFE PYME** | $9.990 | 50 | Intermedio |
| **AGENCIA** | $19.990 | 150 | Completo |

### 9.2 Funciones del Credit Service

```typescript
// src/services/creditService.ts

// Obtener resumen de créditos
getCreditSummary(): Promise<CreditSummary>

// Obtener historial de transacciones
getTransactionHistory(): Promise<Transaction[]>

// Verificar si puede usar créditos
canUseCredit(amount: number): Promise<boolean>

// Deducir créditos
deductCredit(amount: number, description: string): Promise<boolean>

// Agregar créditos (admin)
addCredits(amount: number, userId: string): Promise<boolean>
```

### 9.3 Tabla de Transacciones

```sql
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'deduction', 'addition', 'bonus'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 10. 🗄️ ESQUEMA DE BASE DE DATOS

### 10.1 Tabla Principal: Users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'GRATIS',
  credits INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10.2 Tabla: Flyers

```sql
CREATE TABLE flyers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  prompt_used TEXT,
  style_key TEXT NOT NULL,
  aspect_ratio TEXT DEFAULT '1:1',
  image_url TEXT,
  image_url_hd TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'completed', 'failed'
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10.3 Tabla: User Plans

```sql
CREATE TABLE user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan_name TEXT NOT NULL,
  monthly_credits INTEGER NOT NULL,
  price CLP NOT NULL,
  is_active BOOLEAN DEFAULT true,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10.4 Tabla: Brands

```sql
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  logo_url TEXT,
  colors TEXT[], -- Array de colores hex
  website TEXT,
  social_media JSONB, -- {instagram, facebook, etc.}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 10.5 Tabla: Commercial Events

```sql
CREATE TABLE commercial_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_type TEXT, -- 'sale', 'opening', 'special'
  brand_id UUID REFERENCES brands(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 11. 🔐 AUTENTICACIÓN (Supabase Auth)

### 11.1 Métodos de Auth Soportados

| Método | Descripción |
|--------|-------------|
| Email/Password | Registro tradicional |
| Google OAuth | Login con Google |
| Magic Link | Login sin contraseña |

### 11.2 Configuración de RLS (Row Level Security)

```sql
-- Usuarios solo ven sus propios datos
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Flyers privados por usuario
CREATE POLICY "Users can view own flyers" ON flyers
  FOR SELECT USING (user_id = auth.uid());
```

---

## 12. 📱 COMPONENTES PRINCIPALES

### 12.1 Dashboard (App.tsx - 732 líneas)

**Estado Principal:**
```typescript
interface DashboardState {
  // Estilo seleccionado
  selectedStyle: FlyerStyleKey;
  
  // Slider de realidad
  realityStars: RealityLevel;
  
  // Gestión de marcas
  userBrands: Brand[];
  selectedBrand: Brand | null;
  
  // Textos y overlays
  mainText: string;
  overlayTexts: OverlayText[];
  
  // Autenticación
  user: User | null;
  session: Session | null;
  
  // Modo de edición
  editingMode: 'simple' | 'advanced';
}
```

### 12.2 FlyerForm (1325 líneas)

**Funcionalidades:**
- ✨ Modo Magia (detección automática)
- 🔗 Análisis de URLs
- 📐 Selección de aspect ratio
- 🎬 Selección de estilo de video
- 🎭 Selección de Story Art
- 📝 Generación de texto persuasivo
- 🎯 Objetivos de marketing (Branding/Leads)

### 12.3 FlyerDisplay (2052 líneas)

**Funcionalidades:**
- 🖱️ Drag & drop para textos/logo/producto
- 📱 Gestos táctiles (pinch/rotate)
- 🎨 Visual Mimicry (detección de superficies)
- 🔍 Comparación Draft vs HD
- 💾 Composición para descarga
- 📱 Controles móviles específicos

### 12.4 RealitySlider (414 líneas)

**Componente del Slider:**
- Escala de 1.0 a 5.0 estrellas
- Colores por categoría
- Indicadores de caché
- Modos compact/full

### 12.5 RealityComparator (397 líneas)

**Comparador Visual:**
- Slider de comparación antes/después
- Soporte para múltiples aspect ratios
- Generación bajo demanda
- Labels con estrellas y categorías

---

## 13. 🎨 CONFIGURACIONES DE ESTILO (constants.ts)

### 13.1 MASTER_STYLES Structure

```typescript
interface FlyerStyle {
  id: string;
  label: string;
  category: string;
  tags: string[];
  english_prompt: string;
  visualDescription: string;
  video_motion: string;
  example: string;
  previewUrl: string;
  artDirection?: number; // Rubro asociado
  storyArtStyle?: string; // Estilo Story Art
}
```

### 13.2 Aspect Ratios Soportados

| Ratio | Dimensiones | Uso |
|-------|-------------|-----|
| 1:1 | 1024x1024 | Instagram, Posts |
| 9:16 | 1024x1792 | Stories, Reels |
| 4:5 | 1024x1280 | Instagram Portrait |
| 16:9 | 1024x576 | YouTube, Web |
| 1.91:1 | 1200x628 | Facebook Ads |
| 1:1.41 | Square | General |

### 13.3 Video Motion Descriptions

```typescript
// Ejemplo para gastronomía
const video_motion = `
  Gentle camera movement revealing the dish,
  steam rising subtly, soft focus on details,
  smooth transition between shots, warm color grading
`;
```

---

## 14. 🔄 FLUJO DE USUARIO COMPLETO

### 14.1 Flujo de Generación de Flyer

```
┌─────────────────────────────────────────────────────────────┐
│ 1. ENTRADA                                                   │
│    ├── Modo Magia (URL o texto)                              │
│    ├── Selección manual de estilo                            │
│    └── Análisis de URL existente                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. DETECCIÓN                                                 │
│    ├── Identificar industria (60 rubros)                     │
│    ├── Detectar estilo de video                              │
│    └── Generar texto persuasivo automático                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. CONFIGURACIÓN                                             │
│    ├── Slider de realidad (1.0-5.0)                          │
│    ├── Aspect ratio                                          │
│    ├── Story Art style                                       │
│    └── Marca/logo del usuario                                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. GENERACIÓN DRAFT                                          │
│    ├── Gemini construye prompt completo                      │
│    ├── Imagen 3.0 Fast genera preview                        │
│    └── Usuario revisa resultado                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. REFINAMIENTO                                              │
│    ├── Ajustar texto overlay                                 │
│    ├── Mover elementos (drag & drop)                         │
│    ├── Ajustar realidad si es necesario                      │
│    └── Generar variaciones de realidad                       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. GENERACIÓN HD                                             │
│    ├── Prompt refinado con ajustes                           │
│    ├── Imagen 3.0 Pro genera versión final                   │
│    └── Comparación Draft vs HD                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. EXPORTACIÓN                                               │
│    ├── Composición final                                     │
│    ├── Descarga PNG/JPG                                      │
│    └── Publicación directa (opcional)                        │
└─────────────────────────────────────────────────────────────┘
```

### 14.2 Flujo de Auth

```
Usuario → Login/Register → Supabase Auth → Session Creada
                                            ↓
                            Dashboard ← Redirect
                            ├── Ver créditos
                            ├── Ver flyers históricos
                            └── Generar nuevo flyer
```

---

## 15. 🛡️ SISTEMAS DE SEGURIDAD

### 15.1 Content Safety

```typescript
// Verificación de contenido inapropiado
const CONTENT_SHIELDS = {
  anatomy: ANATOMY_SHIELD,
  text: NEGATIVE_TEXT_SHIELD,
  quality: GLOBAL_NEGATIVE_SHIELD,
  realism: REAL_BUSINESS_ENVIRONMENT
};

// Aplicación automática a todos los prompts
const safePrompt = applyShields(basePrompt, CONTENT_SHIELDS);
```

### 15.2 Credit Security

```typescript
// Verificación server-side de créditos
async function verifyCreditDeduction(userId: string, amount: number) {
  const user = await supabase
    .from('users')
    .select('credits')
    .eq('id', userId)
    .single();
    
  if (user.credits < amount) {
    throw new Error('Créditos insuficientes');
  }
  
  // Deducción atómica
  await supabase.rpc('deduct_credits', { 
    user_id: userId, 
    amount 
  });
}
```

---

## 16. 📊 MÉTRICAS Y ANALYTICS

### 16.1 Eventos Rastreados

| Evento | Descripción |
|--------|-------------|
| `flyer_generated` | Flyer completado exitosamente |
| `credits_used` | Crédito deducido |
| `style_selected` | Estilo elegido por usuario |
| `reality_changed` | Slider de realidad ajustado |
| `download_completed` | Descarga finalizada |

### 16.2 Dashboard de Métricas

```typescript
// Uso interno para analytics
const trackEvent = (event: string, properties?: Record<string, any>) => {
  console.log(`[Analytics] ${event}`, properties);
  // Envío a servicio de analytics
};
```

---

## 17. 🚀 DEPLOYMENT

### 17.1 Configuración Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### 17.2 Variables de Entorno

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GOOGLE_VERTEX_PROJECT=your_project_id
VITE_GOOGLE_VERTEX_LOCATION=us-central1
```

---

## 18. 📈 CARACTERÍSTICAS CHILE ESPECÍFICAS

### 18.1 Localización

| Aspecto | Configuración |
|---------|---------------|
| Moneda | CLP (Pesos Chilenos) |
| Idoma | Español (es-CL) |
| Formato fecha | DD/MM/YYYY |
| Teléfono | +56 |

### 18.2 Rubros Chilenos Únicos

| Rubro | Descripción |
|-------|-------------|
| Feria Libre | Mercados tradicionales chilenos |
| Vega | La Vega Central (Santiago) |
| Botillería | Tradicional chilena |
| Entretención | Casinos y juegos |
| Delivery | Rappi, PedidosYa |

### 18.3 Contextos Culturales

```typescript
// constants.ts
CHILEAN_BASE_CONTEXT = `
  Chilean market aesthetic, local business environment,
  Santiago urban setting, casual professional,
  authentic local commerce, trustworthy and genuine
`;

CHILEAN_OUTDOOR_CONTEXT = `
  Outdoor Chilean landscape, natural lighting,
  Pacific coast influence, mountain backdrop optional,
  casual authentic atmosphere
`;

CHILEAN_STUDIO_CONTEXT = `
  Professional Chilean studio setup,
  clean and trustworthy aesthetic,
  local business credibility,
  modern yet approachable
`;
```

---

## 19. 🔧 UTILIDADES Y HERRAMIENTAS

### 19.1 Scripts de Base de Datos

| Script | Propósito |
|--------|-----------|
| `setup-database.js` | Configuración inicial |
| `create-tables.js` | Creación de tablas |
| `insert-default-data.js` | Datos iniciales |
| `update-plans.js` | Actualización de planes |

### 19.2 Scripts de Diagnóstico

| Script | Propósito |
|--------|-----------|
| `diagnose-email-issue.js` | Problemas de email |
| `verify-auth.js` | Verificación de auth |
| `check-credit-system.js` | Sistema de créditos |
| `debug-auth-flow.js` | Flujo de autenticación |

---

## 20. 📝 RESUMEN TÉCNICO

### 20.1 Stack Completo

```
Frontend:     React 18 + TypeScript + Vite + Tailwind
Backend:      Supabase (PostgreSQL + Auth + Storage)
IA:           Google Vertex AI (Gemini + Imagen + Veo)
Deployment:   Netlify
```

### 20.2 Características Clave

✅ 60 estilos de flyer para el mercado chileno
✅ 60 estilos de video
✅ Sistema de realidad (1.0-5.0 estrellas)
✅ 60 rubros de Art Direction
✅ 7 estilos Story Art
✅ Modo Magia (detección automática)
✅ Sistema de créditos con 4 planes
✅ Drag & drop visual
✅ Comparación Draft vs HD
✅ Visual Mimicry
✅ Autenticación completa
✅ Base de datos relacional

### 20.3 Escalabilidad

- **Usuarios:** Sin límite (Supabase scale)
- **AI:** Google Vertex AI (enterprise grade)
- **Storage:** Supabase Storage (S3 backed)
- **CDN:** Netlify Global Edge Network

---

## 21. 📚 REFERENCIAS

### Archivos Clave

| Archivo | Líneas | Propósito |
|---------|--------|-----------|
| `App.tsx` | 732 | Componente principal |
| `types.ts` | 460 | Definiciones de tipos |
| `constants.ts` | 1103+ | Configuraciones de estilo |
| `services/geminiService.ts` | 2346+ | Servicio de IA principal |
| `services/realityMapper.ts` | 485 | Sistema de realidad |
| `services/magicModeService.ts` | 1617 | Modo magia |
| `components/FlyerForm.tsx` | 1325 | Formulario de generación |
| `components/FlyerDisplay.tsx` | 2052 | Visualización y edición |

---

*Informe generado el 6 de Enero de 2026*
*Aplicación: Estudio 56 - Generador de Flyers con IA*
*Versión: 1.0.0*
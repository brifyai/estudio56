# 📋 INFORME COMPLETO DE ESTUDIO 56
## Plataforma de Generación de Contenido Visual con Inteligencia Artificial

---

## 1. RESUMEN EJECUTIVO

**Estudio 56** es una plataforma web de última generación diseñada para pequeños y medianos empresarios (PYMEs) en Chile, que utiliza inteligencia artificial para generar contenido visual profesional (flyers, videos, banners) de manera automática. La aplicación permite a usuarios sin conocimientos técnicos en diseño gráfico crear materiales promocionales de alta calidad en cuestión de segundos.

### Características Principales:
- ✅ Generación de imágenes con IA (Gemini 2.5 Flash, Gemini 3.0 Pro)
- ✅ Generación de videos con IA (Veo 3.1)
- ✅ Modo Magia: detección automática de industria y estilo
- ✅ Mejora de imágenes de productos con IA
- ✅ Sistema de créditos y planes de suscripción
- ✅ Calendario comercial con alertas automáticas
- ✅ Gestión de múltiples marcas
- ✅ Editor de texto con drag & drop
- ✅ Comparación Draft vs HD

---

## 2. ARQUITECTURA TÉCNICA

### 2.1 Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite |
| Estilos | Tailwind CSS |
| Base de Datos | Supabase (PostgreSQL) |
| IA Generativa | Google Gemini API |
| Autenticación | Supabase Auth |
| Alertas | SweetAlert2 |

### 2.2 Estructura del Proyecto

```
estudio-56/
├── components/          # Componentes React
│   ├── FlyerForm.tsx    # Formulario principal
│   ├── FlyerDisplay.tsx # Visualización y edición
│   ├── LandingPage.tsx  # Página de inicio
│   ├── LoginPage.tsx    # Autenticación
│   ├── Dashboard.tsx    # Panel de usuario
│   ├── BrandPanel.tsx   # Gestión de marcas
│   ├── CommercialCalendar.tsx # Calendario comercial
│   └── ...
├── services/            # Servicios de negocio
│   ├── geminiService.ts # Integración con Gemini API
│   ├── supabaseService.ts # Base de datos
│   ├── creditService.ts # Sistema de créditos
│   ├── magicModeService.ts # Modo magia
│   ├── brandService.ts  # Gestión de marcas
│   ├── commercialCalendarService.ts # Calendario
│   └── ...
├── hooks/               # Custom hooks
├── types/               # Definiciones TypeScript
├── constants/           # Constantes y configuraciones
└── database/            # Scripts SQL
```

---

## 3. COMPONENTES PRINCIPALES

### 3.1 FlyerForm.tsx (Formulario Principal)

El componente [`FlyerForm`](components/FlyerForm.tsx:1) es el núcleo de la aplicación donde los usuarios configuran sus diseños.

#### Características:

**🎯 Modos de Trabajo:**
- **Modo Automático**: El sistema detecta automáticamente la industria, estilo y genera texto persuasivo
- **Modo Manual**: El usuario tiene control total sobre todos los parámetros

**📝 Entrada Unificada:**
- Campo de texto que acepta descripciones en español
- Detección automática de URLs para análisis
- Modo Magia: análisis automático al escribir (800ms de delay)

**🔍 Análisis de URLs:**
- Extrae información del negocio desde URLs
- Detecta industria, estilo visual y texto real
- Timeout de 15 segundos para evitar bloqueos

**🎨 Estilos Visuales (38 estilos disponibles):**

| Categoría | Estilos |
|-----------|---------|
| Retail | `retail_sale`, `typo_bold` |
| Gastronomía | `gastronomy` |
| Bienestar | `wellness_zen`, `pilates`, `aesthetic_min` |
| Deportivo | `sport_gritty` |
| Lujo | `luxury_gold`, `realestate_night` |
| Tecnología | `tech_saas` |
| Médico | `medical_clean` |
| Educativo | `edu_sketch` |
| Entretención | `urban_night`, `gamer_stream`, `podcast_mic` |
| Estacional | `seasonal_holiday`, `worship_sky`, `kids_fun` |
| Especiales | `eco_organic`, `retro_vintage`, `art_double_exp` |

**📐 Formatos Soportados:**
- **1:1** (1080x1080): Instagram/Facebook
- **9:16** (1080x1920): Stories/Reels/TikTok

**🎬 Tipos de Contenido:**
1. **Imágenes IA**: Generación automática con Gemini
2. **Videos**: Motion graphics con Veo 3.1
3. **Estudio de Producto**: Mejora de fotos propias con IA

**✨ Modo Magia (Auto-detección):**
- Detecta industria desde la descripción
- Genera texto persuasivo automáticamente
- Selecciona el estilo visual apropiado
- Muestra confianza de detección (%)
- Para videos: detecta 23 estilos diferentes

**📝 Generación de Texto Persuasivo:**
- **Objetivo Branding**: Texto para reconocimiento de marca
- **Objetivo Leads**: Texto para conversiones
- 3 opciones generadas por objetivo
- Templates específicos por industria
- Limpieza automática de texto (remueve prefijos)

**🖼️ Estudio de Producto:**
- Carga de imágenes propias (JPG, PNG, máx 10MB)
- **Modo Realista**: Para negocios locales
- **Modo Premium**: Para productos de lujo
- Mejora automática con IA (reconstrucción semántica)
- Mejora iluminación, fondo y presentación

**⚙️ Controles del Formulario:**
- Selector de modo (auto/manual)
- Selector de formato (1:1, 9:16)
- Selector de tipo de contenido
- Selector de modo de realismo
- Botón de generación con estados de carga

---

### 3.2 FlyerDisplay.tsx (Visualización y Edición)

El componente [`FlyerDisplay`](components/FlyerDisplay.tsx:1) maneja la visualización del contenido generado y las herramientas de edición.

#### Características:

**📱 Modos de Vista:**
- **Móvil** (320x569px para 9:16)
- **Tablet** (420x747px para 9:16)
- **Desktop** (simulación de pantalla completa)
- **Clean** (vista limpia sin marcos)

**✏️ Editor de Texto:**
- **Drag & Drop**: Arrastrar texto libremente
- **Resize**: Redimensionar área de texto (8 handles)
- **Edición directa**: Click para editar texto
- **Efectos visuales**:
  - Sombra (shadow)
  - Brillo (glow)
  - Contorno (stroke)
- **Estilos personalizables**:
  - Tamaño de fuente
  - Familia tipográfica
  - Peso (bold, normal)
  - Color de texto
  - Espaciado de letras
  - Mayúsculas/minúsculas

**🖼️ Gestión de Logo:**
- Drag & drop para posicionar
- Resize con handles
- **Recoloración automática**: Cambia el color del logo para que coincida con la marca
- **Filtros**: Escala de grises, brillo, contraste, opacidad

**📦 Gestión de Producto:**
- Posicionamiento independiente
- Redimensionamiento
- Efecto de vidrio esmerilado (glassmorphism)

**🔄 Comparación Draft vs HD:**
- Vista lado a lado
- Escala automática (Draft 200px vs HD 320px)
- Indicadores visuales (amarillo= draft, verde= HD)
- Badge de modo borrador
- Badge de comparación activa

**💾 Descarga de Archivos:**
- Captura del DOM con html2canvas
- Resolución HD (2x scale)
- Nombre de archivo con timestamp
- Soporte para todos los formatos

**⏳ Estados de Carga:**
- Animación de terminal/hacker
- Mensajes de progreso
- Barra de progreso animada
- Indicador de modelo usado

---

### 3.3 LandingPage.tsx (Página de Inicio)

La [`LandingPage`](components/LandingPage.tsx:1) es la página pública de marketing.

#### Secciones:

**🎯 Hero Section:**
- Título impactante con humor chileno
- Subtítulo en español
- CTA principal: "Reparar mi dignidad digital"
- Elementos flotantes con memes de diseño

**📊 Comparación Antes/Después:**
- Visualización del problema (diseños malos)
- Visualización de la solución (diseños profesionales)
- Mockup interactivo de la plataforma

**💰 Planes de Precios:**

| Plan | Precio | Características |
|------|--------|-----------------|
| **GRATIS** | $0/mes | 5 borradores/día con marca de agua, solo visualización |
| **ESTOY PARTIENDO** | $12.990/mes + IVA | 50 imágenes HD, ∞ borradores, sin videos |
| **JEFE PYME** | $39.990/mes + IVA | 250 imágenes HD, ∞ borradores, 5 videos HD/semana, carga de productos |
| **AGENCIA** | $99.990/mes + IVA | 1000 imágenes HD, 20 videos HD, licencia comercial, soporte |

**📩 Formulario de Contacto:**
- Nombre, correo, mensaje
- Estados de envío (enviando, éxito)
- Diseño atractivo con efectos

**🎨 Footer:**
- Copyright con humor
- Descargo de responsabilidad

---

## 4. SERVICIOS DE IA

### 4.1 geminiService.ts

El servicio [`geminiService`](services/geminiService.ts:1) maneja toda la integración con la API de Google Gemini.

#### Funciones Principales:

**🖼️ Generación de Imágenes:**

| Función | Descripción |
|---------|-------------|
| `generateFlyerImage()` | Genera imágenes con Gemini |
| `generateHDFromDraft()` | Mejora un borrador a HD manteniendo composición |
| `generateImage()` | Wrapper simplificado para compatibilidad |

**Modelos Utilizados:**
- **Draft**: `gemini-2.5-flash-image` (rápido, económico)
- **HD**: `gemini-3-pro-image-preview` (alta calidad)

**🎬 Generación de Videos:**

| Función | Descripción |
|---------|-------------|
| `generateFlyerVideo()` | Genera videos con Veo 3.1 |
| Draft: `veo-3.1-fast-generate-preview` (720p) |
| HD: `veo-3.1-generate-preview` (1080p) |

**🔍 Análisis de Contenido:**

| Función | Descripción |
|---------|-------------|
| `analyzeUrlContent()` | Extrae información de URLs |
| `enhancePrompt()` | Traduce y mejora prompts en español |
| `refineDescription()` | Refina descripción existente |

**✨ Mejora de Imágenes de Usuario:**

| Función | Descripción |
|---------|-------------|
| `enhanceUserImage()` | Reconstrucción semántica de productos |
| `analyzeProductImage()` | Análisis con Gemini Vision |
| `quickEnhanceImage()` | Versión simplificada |

**🛠️ Utilidades:**

| Función | Descripción |
|---------|-------------|
| `diagnoseAndFixBlackImage()` | Detecta y corrige imágenes en negro |
| `generatePersuasiveText()` | Genera texto persuasivo por industria |
| `detectIndustryFromDescription()` | Detecta industria automáticamente |

**📝 Templates de Texto por Industria:**

El servicio incluye **20+ templates específicos** para industrias como:
- Wellness/Pilates/Yoga
- Gastronomía
- Retail/Ofertas
- Deporte/Gym
- Belleza/Aesthetic
- Médico/Salud
- Tecnología
- Educación
- Inmobiliaria
- Lujo
- Automotriz
- Iglesia/Espiritual
- Infantil
- Gaming
- Ecológico
- Y más...

---

### 4.2 magicModeService.ts

El servicio [`magicModeService`](services/magicModeService.ts:1) implementa la detección automática de industria y estilo.

#### Características:

**🔍 Detección de Industria:**
- **24 industrias detectadas** con palabras clave específicas
- Sistema de prioridad (primera coincidencia gana)
- Confianza de detección (0.3 a 0.95)
- Keywords extraídas automáticamente

**🎨 Mapeo de Estilos:**

| Industria | Estilo Asignado |
|-----------|-----------------|
| Pilates | `pilates` |
| Yoga/Spa | `wellness_zen` |
| Restaurant | `gastronomy` |
| Tienda/Oferta | `retail_sale` |
| Gym | `sport_gritty` |
| Belleza | `aesthetic_min` |
| Médico | `medical_clean` |
| Tech | `tech_saas` |
| Educación | `edu_sketch` |
| Discoteca | `urban_night` |
| Lujo | `luxury_gold` |
| Gaming | `gamer_stream` |
| Y más... | ... |

**📝 Generación de Texto:**

| Función | Descripción |
|---------|-------------|
| `generateTextOptions()` | Genera opciones de branding y leads |
| `generatePersuasiveText()` | Texto persuasivo automático |
| `processMagicMode()` | Procesamiento completo |

**🎬 Detección de Video:**
- **23 estilos de video** mapeados
- Mapeo imagen→video automático
- Nombres en español para UI

**🌐 Análisis de URLs:**

| Función | Descripción |
|---------|-------------|
| `extractBusinessInfoFromUrl()` | Extrae dominio, path, parámetros |
| `enhancedUrlAnalysis()` | Análisis avanzado de URLs |

---

## 5. SERVICIOS DE NEGOCIO

### 5.1 creditService.ts

El servicio [`creditService`](services/creditService.ts:1) gestiona el sistema de créditos y suscripciones.

#### Tipos de Crédito:

| Tipo | Descripción |
|------|-------------|
| `draft` | Borradores de imagen |
| `final_image` | Imágenes finales HD |
| `video` | Videos generados |
| `product_upload` | Carga de productos |

#### Funciones:

| Función | Descripción |
|---------|-------------|
| `getCreditSummary()` | Obtiene resumen de créditos |
| `getTransactionHistory()` | Historial de transacciones |
| `getMonthlyUsage()` | Uso mensual por tipo |
| `canUseCredit()` | Verifica si puede usar créditos |
| `deductCredit()` | Descuenta créditos al usar |
| `addCredits()` | Agrega créditos (compra/bonus) |

#### Transacciones:

| Tipo | Icono | Descripción |
|------|-------|-------------|
| `usage` | 📉 | Uso de créditos |
| `purchase` | 💳 | Compra de créditos |
| `bonus` | 🎁 | Bonificación |
| `reset` | 🔄 | Reset mensual |

---

### 5.2 brandService.ts

Gestiona la información de las marcas del usuario.

#### Funciones:

| Función | Descripción |
|---------|-------------|
| `getUserBrands()` | Obtiene marcas del usuario |
| `createBrand()` | Crea nueva marca |
| `updateBrand()` | Actualiza marca |
| `deleteBrand()` | Elimina marca |
| `setDefaultBrand()` | Establece marca por defecto |

#### Datos de Marca:

```typescript
interface Brand {
  id: string;
  user_id: string;
  name: string;
  website_url?: string;
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  primary_color: string;
  secondary_color: string;
  industry?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}
```

---

### 5.3 commercialCalendarService.ts

Servicio de calendario comercial con eventos y alertas.

#### Funciones:

| Función | Descripción |
|---------|-------------|
| `getCommercialEvents()` | Obtiene todos los eventos |
| `getUpcomingEvents()` | Eventos próximos (n días) |
| `getActiveAlertEvents()` | Eventos con alerta activa |
| `getDaysUntilEvent()` | Días hasta un evento |

#### Categorías de Eventos:

| Categoría | Emoji | Color |
|-----------|-------|-------|
| festivo | 🎉 | Ámbar |
| consumo | 🛒 | Esmeralda |
| comercio | 🏪 | Azul |
| marketing | 📢 | Púrpura |
| especial | ⭐ | Rosa |

#### Ejemplos de Eventos:
- **Días Festivos**: Navidad, Año Nuevo, Fiestas Patrias
- **Consumo**: CyberMonday, Black Friday
- **Comercio**: Día del Comercio
- **Marketing**: Inicio de campañas
- **Especiales**: Eventos deportivos, elecciones

---

## 6. BASE DE DATOS (SUPABASE)

### 6.1 Tablas Principales

**users** - Usuarios registrados
```sql
id, email, created_at, plan, credits, last_credit_reset
```

**brands** - Marcas de usuarios
```sql
id, user_id, name, website_url, instagram, tiktok, facebook,
primary_color, secondary_color, industry, is_default
```

**credit_transactions** - Historial de créditos
```sql
id, user_id, type, amount, credit_type, description, reference_id, created_at
```

**credit_summary** - Resumen de créditos (vista materializada)
```sql
user_id, current_credits, monthly_limit, total_used_this_month, remaining_this_month
```

**commercial_events** - Eventos comerciales
```sql
id, name, date, category, description, is_active
```

**flyer_generations** - Generaciones realizadas
```sql
id, user_id, style_key, aspect_ratio, media_type, image_quality,
prompt, image_url, video_url, credits_used, created_at
```

### 6.2 Funciones RPC

| Función | Descripción |
|---------|-------------|
| `get_monthly_credit_usage()` | Uso mensual de créditos |
| `can_use_credit()` | Verifica disponibilidad |
| `deduct_credit()` | Descuenta créditos |
| `add_credits()` | Agrega créditos |

---

## 7. FLUJOS DE USUARIO

### 7.1 Flujo de Generación de Imagen

```
1. Usuario ingresa descripción o URL
           ↓
2. Modo Magia detecta industria y estilo
           ↓
3. Usuario selecciona objetivo (Branding/Leads)
           ↓
4. Sistema genera opciones de texto
           ↓
5. Usuario selecciona texto y formato
           ↓
6. Genera BORRADOR (Gemini 2.5 Flash)
           ↓
7. Usuario puede:
   a) Descargar borrador
   b) Escalar a HD (Gemini 3.0 Pro)
   c) Refinar con instrucciones
           ↓
8. Descarga final
```

### 7.2 Flujo de Estudio de Producto

```
1. Usuario selecciona "Estudio de Producto"
           ↓
2. Sube foto de su producto
           ↓
3. Selecciona modo (Realista/Premium)
           ↓
4. Sistema analiza producto con Gemini Vision
           ↓
5. Regenera imagen en entorno profesional
           ↓
6. Usuario puede descargar o usar como base
```

### 7.3 Flujo de Generación de Video

```
1. Usuario describe su negocio
           ↓
2. Modo Magia detecta estilo de video
           ↓
3. Selecciona formato (9:16 recomendado)
           ↓
4. Genera VIDEO (Veo 3.1)
           ↓
5. Descarga o comparte
```

---

## 8. CARACTERÍSTICAS AVANZADAS

### 8.1 Sistema de Análisis Inteligente

La aplicación incluye múltiples servicios de análisis que se ejecutan después de generar una imagen:

| Servicio | Función |
|----------|---------|
| `imageAnalysisService` | Analiza la imagen para posicionar texto |
| `contextualTypographyService` | Tipografía contextual |
| `contrastAnalysisService` | Análisis de contraste |
| `contextualEffectsService` | Efectos contextuales |
| `compositionAnalysisService` | Análisis de composición |
| `autoTextValidationService` | Validación automática |

### 8.2 Modo de Comparación Draft vs HD

- **Borrador**: Generado con Gemini 2.5 Flash (rápido, económico)
- **HD**: Generado con Gemini 3.0 Pro (alta calidad, lento)
- **Comparación lado a lado** para ver la diferencia
- **Escala automática** para comparación visual justa
- **Indicadores de confianza** y calidad

### 8.3 Sistema de Alertas

- **Calendario comercial** con eventos chilenos
- **Alertas visuales** para eventos próximos
- **Contadores** por período (1d, 5d, 15d, 30d)
- **Generación rápida** desde eventos del calendario

### 8.4 Gestión de Marca

- **Múltiples marcas** por usuario
- **Colores primarios/secundarios** automáticos
- **Redes sociales** vinculadas
- **Logo recoloreado** automáticamente
- **Marca por defecto** para nuevos diseños

---

## 9. SEGURIDAD Y RENDIMIENTO

### 9.1 Medidas de Seguridad

- ✅ Autenticación con Supabase Auth
- ✅ RLS (Row Level Security) en base de datos
- ✅ Variables de entorno para API keys
- ✅ Timeout en llamadas API (15s)
- ✅ Validación de entradas
- ✅ Sanitización de datos

### 9.2 Optimizaciones

- ✅ **Modo Draft**: 5x más rápido que HD
- ✅ **Cacheo de prompts**: Reintentos con mismo seed
- ✅ **Diagnóstico automático**: Corrige imágenes en negro
- ✅ **Fallbacks**: Múltiples niveles de recuperación
- ✅ **Lazy loading**: Carga bajo demanda

### 9.3 Manejo de Errores

- ✅ Timeout de 15 segundos para análisis de URL
- ✅ Retry automático para generaciones fallidas
- ✅ Fallbacks a templates locales si la API falla
- ✅ Diagnóstico de imágenes corruptas
- ✅ Mensajes de error claros para el usuario

---

## 10. INTERFAZ DE USUARIO

### 10.1 Diseño Visual

- **Tema oscuro** con acentos de color
- **Glassmorphism** en elementos flotantes
- **Animaciones sutiles** (fade, slide, pulse)
- **Feedback visual** en todas las acciones
- **Responsive design** para todos los dispositivos

### 10.2 Componentes UI

| Componente | Uso |
|------------|-----|
| SweetAlert2 | Alertas y confirmaciones |
| Tailwind CSS | Estilos y layout |
| Framer Motion | Animaciones |
| Lucide React | Iconos |

### 10.3 Accesibilidad

- ✅ Labels en todos los inputs
- ✅ Estados de carga visibles
- ✅ Mensajes de error claros
- ✅ Contraste de colores adecuado
- ✅ Navegación por teclado

---

## 11. INTEGRACIONES

### 11.1 Google Gemini API

| Modelo | Uso | Velocidad | Calidad |
|--------|-----|-----------|---------|
| `gemini-2.5-flash-image` | Borradores | Rápida | Media |
| `gemini-3-pro-image-preview` | HD | Lenta | Alta |
| `gemini-1.5-flash` | Análisis | Rápida | Buena |
| `veo-3.1-fast-generate-preview` | Videos Draft | Rápida | Media |
| `veo-3.1-generate-preview` | Videos HD | Lenta | Alta |

### 11.2 Supabase

- **Auth**: Autenticación de usuarios
- **Database**: PostgreSQL con RLS
- **Storage**: Almacenamiento de imágenes
- **Realtime**: Actualizaciones en tiempo real

---

## 12. LIMITACIONES Y FUTURAS MEJORAS

### 12.1 Limitaciones Actuales

- ⚠️ Sin editor de imagen avanzado
- ⚠️ Sin integración con redes sociales
- ⚠️ Sin templates personalizables
- ⚠️ Sin colaboración en equipo
- ⚠️ Sin API pública

### 12.2 Mejoras Planificadas

- 🔮 Editor de imagen con IA (inpainting)
- 🔮 Publicación directa a redes sociales
- 🔮 Templates personalizados por marca
- 🔮 Modo equipo/collaboración
- 🔮 API para integraciones
- 🔮 App móvil (React Native)
- 🔮 Más idiomas (inglés, portugués)

---

## 13. ESTADÍSTICAS DEL PROYECTO

| Métrica | Valor |
|---------|-------|
| Componentes React | 15+ |
| Servicios | 10+ |
| Estilos visuales | 38 |
| Industrias soportadas | 24+ |
| Funciones principales | 50+ |
| Líneas de código | 10,000+ |

---

## 14. CONCLUSIONES

**Estudio 56** es una plataforma completa y bien estructurada para la generación de contenido visual con IA, diseñada específicamente para el mercado chileno. Sus principales fortalezas son:

1. **Facilidad de uso**: El Modo Magia permite generar diseños profesionales sin conocimientos técnicos
2. **Calidad**: La combinación de Draft + HD permite iterar rápido y obtener alta calidad
3. **Versatilidad**: Soporta imágenes, videos, múltiples formatos y 24+ industrias
4. **Integración**: Sistema de créditos, gestión de marcas y calendario comercial
5. **Escalabilidad**: Arquitectura moderna preparada para crecer

La plataforma está lista para uso en producción y puede competir con herramientas internacionales como Canva, pero con la ventaja de estar diseñada específicamente para PYMEs chilenas.

---

*Informe generado el 2 de enero de 2026*
*Versión del documento: 1.0*
*Proyecto: Estudio 56 - Plataforma de Generación de Contenido Visual con IA*
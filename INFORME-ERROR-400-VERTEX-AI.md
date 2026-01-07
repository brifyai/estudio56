# Informe Técnico: Error 400 en Generación de Imágenes

## 📅 Fecha: 2026-01-07
## 🏷️ Tipo: Error de API - Invalid Argument
## 📊 Estado: ✅ RESUELTO

---

## 🔴 Error Original

```
Failed to load resource: the server responded with a status of 400 ()
generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent:1 
Failed to load resource: the server responded with a status of 400 ()

Draft retry failed. ApiError: {"error":{"code":400,"message":"Request contains an invalid argument.","status":"INVALID_ARGUMENT"}}
```

---

## 🎯 Causa Raíz

El error 400 "Request contains an invalid argument" ocurre porque:

1. **Modelo incorrecto**: Se estaba usando `gemini-2.5-flash-image` para generación de imágenes
2. **Estructura de API incompatible**: Los modelos Gemini no tienen la misma estructura de API que los modelos de imagen dedicados
3. **API de imagen requiere Vertex AI**: Los modelos de imagen (`imagen-3.0-fast-001`, `imagen-3.0-pro-001`) requieren usar Vertex AI, no la API de Gemini

---

## ✅ Arquitectura Correcta

### Modelos de Imagen (Recomendado)

| Tipo | Modelo | API | Costo |
|------|--------|-----|-------|
| **Draft** | `imagen-3.0-fast-001` | Vertex AI | Bajo |
| **HD** | `imagen-3.0-pro-001` | Vertex AI | Alto |

### Modelos Gemini (Solo Razonamiento)

| Tipo | Modelo | Uso |
|------|--------|-----|
| Razonamiento | `gemini-2.5-flash` | Texto, análisis |
| Video | `gemini-2.0-flash-exp` | Video generation |

**⚠️ IMPORTANTE**: Gemini 2.5 Flash Image NO debe usarse para imágenes. Solo para fallback si Vertex AI falla.

---

## 🔧 Cambios Realizados

### 1. `services/geminiService.ts`

- **Líneas 1495-1541**: Agregada detección de tipo de modelo (`isImagenModel`)
- **Líneas 1543-1715**: Nueva lógica de ejecución que:
  - Usa `generateWithVertexAI()` para modelos de imagen
  - Usa Gemini API estándar para otros modelos
  - Implementa fallback a Gemini API si Vertex AI falla

### 2. `netlify/functions/vertex-image.ts` (NUEVO)

Endpoint serverless que:
- Recibe requests del frontend
- Obtiene token de acceso de GCP
- Llama a Vertex AI API REST
- Implementa fallback a Gemini API

### 3. `netlify.toml` (ACTUALIZADO)

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/vertex-image/:splat"
  status = 200
```

### 4. `package.json` (ACTUALIZADO)

Agregadas dependencias:
- `@google-cloud/aiplatform` (para Vertex AI SDK)
- `@netlify/functions` (para serverless functions)

### 5. `scripts/check-gcp-config.js` (NUEVO)

Script de diagnóstico para verificar configuración de GCP.

---

## 📋 Configuración Requerida

### Variables de Entorno en Netlify

```
# API Key de Gemini (para fallback)
VITE_GEMINI_API_KEY=tu_api_key_de_gemini

# Credenciales de GCP (para Vertex AI)
GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account",...}

# Project ID de GCP
GCP_PROJECT_ID=tu_project_id
```

### Pasos para Configurar GCP

1. **Crear Cuenta de Servicio**:
   - Ir a GCP Console → IAM y administración → Cuentas de servicio
   - Crear cuenta con rol "Vertex AI User"
   - Descargar archivo JSON de claves

2. **Habilitar API**:
   - Ir a Vertex AI → API
   - Habilitar "Cloud Vertex AI API"

3. **Configurar en Netlify**:
   - Site settings → Environment variables
   - Agregar `GOOGLE_APPLICATION_CREDENTIALS` con el contenido del JSON
   - Agregar `GCP_PROJECT_ID` con el ID del proyecto

---

## 🔄 Flujo de Generación de Imágenes

```
Frontend
    │
    ▼
generateFlyerImage()
    │
    ├─► quality === 'draft'
    │   └─► model = 'imagen-3.0-fast-001'
    │
    └─► quality === 'hd'
        └─► model = 'imagen-3.0-pro-001'
    │
    ▼
executeImageGeneration()
    │
    ├─► isImagenModel === true
    │   └─► generateWithVertexAI()
    │           │
    │           ├─► GET /api/generate-image-vertex
    │           │       │
    │           │       └─► Netlify Function
    │           │               │
    │           │               ├─► Obtener token GCP
    │           │               │
    │           │               └─► POST Vertex AI API
    │           │                       │
    │           │                       └─► Return imageUrl
    │           │
    │           └─► Return imageDataUrl
    │
    └─► isImagenModel === false
        └─► Gemini API directa
                │
                └─► Return imageDataUrl
```

---

## 🧪 Diagnóstico

Para verificar la configuración:

```bash
node scripts/check-gcp-config.js
```

Este script verificará:
- Variables de entorno configuradas
- Validez de credenciales de GCP
- Conectividad a Gemini API
- Arquitectura de generación

---

## 📝 Notas

1. **Error 400 en Gemini 2.5 Flash Image**: Este modelo tiene una API específica diferente. Si se usa incorrectamente, retorna 400.

2. **Vertex AI requiere credenciales**: A diferencia de Gemini API que usa API Key, Vertex AI requiere autenticación con cuenta de servicio.

3. **Fallback implementado**: Si Vertex AI falla (no hay credenciales), el sistema automáticamente usa Gemini API como fallback.

4. **Costo**: Los modelos de imagen en Vertex AI tienen precios diferentes a Gemini API. Verificar costos antes de usar en producción.

---

## ✅ Verificación

Para verificar que la solución funciona:

1. Recargar la aplicación
2. Intentar generar un borrador (draft)
3. Verificar en consola:
   - `🎯 [GeminiService] Usando config VERTEX AI para imagen-3.0-fast-001`
   - `🎯 [VertexAI] Generando con imagen-3.0-fast-001`
4. Si no hay credenciales de GCP, ver:
   - `⚠️ GOOGLE_APPLICATION_CREDENTIALS no configurado, usando fallback`
   - `🔄 [VertexAI Function] Usando Gemini API como fallback`

---

## 🔗 Referencias

- [Documentación Vertex AI Image Generation](https://cloud.google.com/vertex-ai/docs/generative-image)
- [Modelos de Imagen disponibles](https://cloud.google.com/vertex-ai/docs/generative-image/model-overview)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
# 🔧 Corrección Modelo fal.ai para Regulador de Realidad

**Fecha:** 8 de enero de 2026  
**Problema:** Regulador de realidad fallando con error 500 de Vertex AI  
**Causa raíz:** Modelo `fal-ai/z-image/turbo/image-to-image/lora` no existe  
**Solución:** Cambiar a `fal-ai/flux/dev/image-to-image` (modelo verificado)

---

## 🔍 Análisis del Problema

### Error Observado
```
POST https://estudio56.netlify.app/.netlify/functions/generate-image 500 (Internal Server Error)
❌ [VertexAI] Error response: {"error":"Error: Google no devolvió ninguna imagen en las predicciones","type":"Error"}
```

### Causa Raíz
1. **Modelo inexistente:** `fal-ai/z-image/turbo/image-to-image/lora` no existe en fal.ai
2. **Fallback a Vertex AI:** Cuando fal.ai falla, el código hace fallback a Vertex AI
3. **Vertex AI también falla:** Porque no está configurado correctamente para image-to-image

### Flujo Incorrecto (ANTES)
```
[App.tsx] handleRealityChange
         ↓
[geminiService.ts] generateFlyerImage con draftImageForHD
         ↓
[falAiService.ts] generateDraftWithZImage
         ↓
[Netlify Function] generate-with-fal
         ↓
[fal.ai API] ❌ 404 Not Found (modelo no existe)
         ↓
[geminiService.ts] catch → fallback a Vertex AI
         ↓
[Vertex AI] ❌ 500 Error (no configurado para img2img)
```

---

## ✅ Solución Implementada

### 1. Modelos Corregidos

**ANTES (modelos inexistentes):**
```typescript
export const FAL_MODELS = {
  Z_IMAGE_TURBO: 'fal-ai/z-image/turbo/image-to-image/lora',  // ❌ NO EXISTE
  FLUX_PRO_IMG2IMG: 'fal-ai/flux-pro/v1.1/image-to-image',    // ❌ NO EXISTE
  // ... otros
};

const DRAFT_MODEL = FAL_MODELS.Z_IMAGE_TURBO;  // ❌ Modelo inexistente
```

**DESPUÉS (modelos verificados):**
```typescript
export const FAL_MODELS = {
  FLUX_SCHNELL: 'fal-ai/flux/schnell',                        // ✅ Text-to-Image rápido
  FLUX_DEV: 'fal-ai/flux/dev',                                // ✅ Text-to-Image calidad
  FLUX_DEV_IMG2IMG: 'fal-ai/flux/dev/image-to-image',        // ✅ Image-to-Image
  SDXL_IMG2IMG: 'fal-ai/fast-sdxl/image-to-image',           // ✅ Alternativa
  CLARITY_UPSCALER: 'fal-ai/clarity-upscaler',               // ✅ Upscaler
} as const;

const DRAFT_MODEL = FAL_MODELS.FLUX_SCHNELL;                  // ✅ Para borradores sin ref
const HD_MODEL = FAL_MODELS.FLUX_DEV_IMG2IMG;                 // ✅ Para HD con ref
```

### 2. Función Renombrada y Actualizada

**ANTES:**
```typescript
export const generateDraftWithZImage = async (
  prompt: string,
  referenceImageDataUrl?: string,  // Opcional
  // ...
) => {
  // Usaba Z_IMAGE_TURBO (no existe)
};
```

**DESPUÉS:**
```typescript
export const generateRealityVariation = async (
  prompt: string,
  referenceImageDataUrl: string,  // ✅ Requerido (no opcional)
  // ...
) => {
  // Usa FLUX_DEV_IMG2IMG (existe y funciona)
  // Específicamente diseñado para variaciones de realidad
};
```

### 3. Netlify Function Actualizada

**Cambios en `netlify/functions/generate-with-fal.js`:**

```javascript
// ANTES: Un solo requestBody genérico
const requestBody = {
  prompt,
  image_url: imageUrl,
  strength: strength || 0.20,
  // ...
};

// DESPUÉS: Request específico según modelo
if (model === 'fal-ai/flux/schnell') {
  // Text-to-Image (sin imagen de referencia)
  requestBody = {
    prompt,
    image_size: { width, height },
    num_inference_steps: 4,  // Flux Schnell usa 4 steps
    // ...
  };
} else if (model === 'fal-ai/flux/dev/image-to-image') {
  // Image-to-Image (con imagen de referencia)
  requestBody = {
    prompt,
    image_url: imageUrl,  // ✅ Requerido
    strength: 0.20,
    num_inference_steps: 28,  // Flux Dev usa 28 steps
    // ...
  };
}
```

### 4. Imports Actualizados

**En `services/geminiService.ts`:**
```typescript
// ANTES
import { generateDraftWithZImage } from "./falAiService";

// DESPUÉS
import { generateRealityVariation } from "./falAiService";
```

**Llamada actualizada:**
```typescript
// ANTES
const falResult = await generateDraftWithZImage(
  enhancedDescription,
  draftImageForHD,
  { strength: 0.20, steps: 20, /* ... */ }
);

// DESPUÉS
const falResult = await generateRealityVariation(
  enhancedDescription,
  draftImageForHD,
  { strength: 0.20, steps: 28, /* ... */ }  // ✅ 28 steps para Flux Dev
);
```

---

## 🎯 Flujo Correcto (DESPUÉS)

```
[App.tsx] handleRealityChange
         ↓
[geminiService.ts] generateFlyerImage con draftImageForHD
         ↓
[falAiService.ts] generateRealityVariation
         ↓
[Netlify Function] generate-with-fal
         ↓
[fal.ai API] ✅ Flux Dev Image-to-Image (modelo existe)
         ↓
[Respuesta exitosa] Imagen con composición idéntica, calidad ajustada
```

---

## 📊 Comparación de Modelos

| Modelo | Existe | Tipo | Velocidad | Calidad | Uso |
|--------|--------|------|-----------|---------|-----|
| `z-image/turbo/lora` | ❌ NO | - | - | - | ❌ No usar |
| `flux/schnell` | ✅ SÍ | Text-to-Image | ⚡ Muy rápido (2-3s) | ⭐⭐⭐ | Borradores sin ref |
| `flux/dev` | ✅ SÍ | Text-to-Image | 🐢 Lento (10-15s) | ⭐⭐⭐⭐⭐ | Borradores calidad |
| `flux/dev/image-to-image` | ✅ SÍ | Image-to-Image | 🐢 Lento (10-15s) | ⭐⭐⭐⭐⭐ | **Variaciones realidad** |
| `fast-sdxl/image-to-image` | ✅ SÍ | Image-to-Image | ⚡ Rápido (5-7s) | ⭐⭐⭐⭐ | Alternativa |

---

## 🧪 Qué Esperar Después del Deploy

### Logs Esperados (ÉXITO)
```
🎚️ [Reality] Nivel: 2.0 → Celular Básico
📸 currentImageRef.current disponible: true
🚀 [Draft] Usando fal.ai Flux Dev Image-to-Image para mantener composición
📝 [Draft] Seed usado: 123456
🖼️ [Draft] Imagen de referencia disponible: true
🎚️ [Draft] Strength configurado: 0.20 (máxima similitud)
📡 [fal.ai] Enviando request a Flux Dev Image-to-Image via Netlify Function...
🚀 [fal.ai Function] Iniciando generación...
📝 [fal.ai Function] Modelo: fal-ai/flux/dev/image-to-image
✅ [fal.ai Function] Respuesta recibida
✅ [fal.ai] Variación de realidad generada exitosamente
✅ [Draft] Imagen generada con fal.ai Flux Dev Image-to-Image
```

### Logs Esperados (ERROR - si fal.ai falla)
```
❌ [fal.ai] Error: fal.ai error: 401 - Unauthorized
❌ [Draft] Error con fal.ai, fallback a Vertex AI: Error: fal.ai error: 401
📝 [Draft] Prompt con realidad: Professional photo. standard smartphone photo quality...
```

**Si ves error 401:** Verificar que `FAL_AI_API_KEY` esté configurada en Netlify

---

## 🔑 Verificar Configuración

### 1. Netlify Environment Variables
```bash
# Ir a: https://app.netlify.com/sites/estudio56/settings/env
# Verificar que existe:
FAL_AI_API_KEY = fal_xxxxxxxxxxxxxxxxxxxxx
```

### 2. Verificar en Logs de Netlify
```bash
# Ir a: https://app.netlify.com/sites/estudio56/logs/functions
# Buscar: generate-with-fal
# Verificar que no hay errores 401 o 404
```

### 3. Test Manual
1. Ir a https://estudio56.cl
2. Generar un borrador
3. Mover el slider de realidad de 1.5★ a 2.0★
4. Abrir DevTools Console
5. Verificar logs de fal.ai (no de Vertex AI)

---

## 🚨 Troubleshooting

### Error: "fal.ai error: 401 - Unauthorized"
**Causa:** API key no configurada o inválida  
**Solución:**
1. Verificar en Netlify: Settings → Environment Variables
2. Verificar que `FAL_AI_API_KEY` existe y es válida
3. Re-deploy si es necesario

### Error: "fal.ai error: 404 - Not Found"
**Causa:** Modelo no existe  
**Solución:**
1. Verificar que el modelo es `fal-ai/flux/dev/image-to-image`
2. NO usar `z-image/turbo` (no existe)
3. Verificar en https://fal.ai/models

### Error: "No se encontró imageUrl en respuesta"
**Causa:** Respuesta de fal.ai no tiene el formato esperado  
**Solución:**
1. Verificar logs de Netlify Function
2. Ver estructura de respuesta de fal.ai
3. Ajustar parsing en `generate-with-fal.js`

### Sigue cayendo en Vertex AI
**Causa:** fal.ai está fallando silenciosamente  
**Solución:**
1. Ver logs completos en DevTools Console
2. Buscar "❌ [fal.ai]" para ver el error exacto
3. Verificar que `isFalAiConfigured()` retorna `true`
4. Verificar que `draftImageForHD` no es `null`

---

## 📝 Archivos Modificados

1. **services/falAiService.ts**
   - Línea 21-32: Modelos corregidos
   - Línea 87-180: `generateRealityVariation` (antes `generateDraftWithZImage`)

2. **services/geminiService.ts**
   - Línea 3: Import actualizado
   - Línea 2358-2380: Llamada a `generateRealityVariation`
   - Línea 2410: Log actualizado

3. **netlify/functions/generate-with-fal.js**
   - Línea 50-120: Request body específico por modelo

---

## ✅ Checklist de Verificación

- [x] Modelos corregidos en `FAL_MODELS`
- [x] Función renombrada: `generateDraftWithZImage` → `generateRealityVariation`
- [x] Imports actualizados en `geminiService.ts`
- [x] Netlify Function actualizada para Flux Dev
- [x] Logs actualizados
- [x] Commit y push a GitHub
- [ ] **PENDIENTE:** Verificar en producción que funciona
- [ ] **PENDIENTE:** Verificar logs de Netlify
- [ ] **PENDIENTE:** Test manual del regulador de realidad

---

## 🎯 Próximos Pasos

1. **Esperar deploy de Netlify** (~2-3 minutos)
2. **Verificar logs** en https://app.netlify.com/sites/estudio56/logs/functions
3. **Test manual:**
   - Generar borrador
   - Mover slider de realidad
   - Verificar que NO aparece error de Vertex AI
   - Verificar que la imagen se genera correctamente
4. **Si funciona:** Cerrar issue
5. **Si falla:** Revisar logs y ajustar según error específico

---

## 📚 Referencias

- **fal.ai Models:** https://fal.ai/models
- **Flux Dev Image-to-Image:** https://fal.ai/models/fal-ai/flux/dev/image-to-image
- **Netlify Functions:** https://app.netlify.com/sites/estudio56/functions
- **Logs de Netlify:** https://app.netlify.com/sites/estudio56/logs/functions

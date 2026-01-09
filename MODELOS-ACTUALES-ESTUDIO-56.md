# 📊 MODELOS ACTUALES - Estudio 56
**Fecha**: 9 de Enero 2026  
**Actualizado**: Última verificación

---

## 🎨 GENERACIÓN DE IMÁGENES (Story Art)

### Modelo para BORRADOR (Draft)
```
fal-ai/flux/schnell
```

**Características**:
- ✅ **Velocidad**: 2-3 segundos (muy rápido)
- ✅ **Tipo**: Text-to-Image
- ✅ **Uso**: Generación inicial de borradores
- ✅ **Calidad**: Buena para previews rápidos
- ✅ **Usado en**: Story Art (Borrador)

**Código**:
```typescript
const DRAFT_MODEL = FAL_MODELS.FLUX_SCHNELL;
```

**Ubicación**: `services/falAiService.ts` línea 34  
**Llamado desde**: `services/geminiService.ts` línea 2453

---

### Modelo para HD (Alta Definición)
```
fal-ai/flux/dev/image-to-image
```

**Características**:
- ✅ **Velocidad**: 5-10 segundos
- ✅ **Tipo**: Image-to-Image
- ✅ **Uso**: Mejora de calidad del borrador a HD
- ✅ **Calidad**: Alta calidad, mantiene composición
- ✅ **Strength**: 0.20 (muy similar al borrador)
- ✅ **Usado en**: Story Art (HD)

**Código**:
```typescript
const HD_MODEL = FAL_MODELS.FLUX_DEV_IMG2IMG;
```

**Ubicación**: `services/falAiService.ts` línea 36  
**Llamado desde**: `services/geminiService.ts` línea 2593

**Nota importante**: El comentario en el código dice "SDXL img2img" pero en realidad usa `FLUX_DEV_IMG2IMG` (Flux Dev Image-to-Image), que es el modelo configurado en `HD_MODEL`.

---

### Modelo para VARIACIONES DE REALIDAD (Editor de Realidad)
```
fal-ai/flux/dev/image-to-image
```

**Características**:
- ✅ **Velocidad**: 5-10 segundos
- ✅ **Tipo**: Image-to-Image
- ✅ **Uso**: Ajustar nivel de realismo fotográfico
- ✅ **Strength**: 0.35 (cambios más visibles)
- ✅ **Mantiene**: Composición exacta

**Código**:
```typescript
export const generateRealityVariation = async (
  prompt: string,
  referenceImageDataUrl: string,
  options: {
    strength = 0.35, // ✅ AUMENTADO para cambios más visibles
    // ...
  }
)
```

**Ubicación**: `services/falAiService.ts` línea 207

---

## 🎬 GENERACIÓN DE VIDEOS

### Modelo para VIDEO (Draft y HD)
```
fal-ai/pika/v2/turbo/text-to-video
```

**Características**:
- ✅ **Velocidad**: 2-5 minutos (normal para la industria)
- ✅ **Tipo**: Text-to-Video
- ✅ **Uso**: Generación de videos desde prompt
- ✅ **Resoluciones**: 
  - Draft: 720p (1280x720)
  - HD: 1080p (1920x1080)
- ✅ **Duración**: 5 segundos
- ✅ **Aspect Ratio**: 9:16 (vertical para stories)

**Código**:
```typescript
const FAL_MODEL = 'fal-ai/pika/v2/turbo/text-to-video';
```

**Ubicación**: `netlify/functions/generate-video.ts` línea 11

---

## 📋 MODELOS DISPONIBLES (No Usados Actualmente)

### Flux Dev (Text-to-Image)
```
fal-ai/flux/dev
```
- Mejor calidad que Schnell
- Más lento (10-15 segundos)
- No usado actualmente

### Stable Diffusion XL Image-to-Image
```
fal-ai/fast-sdxl/image-to-image
```
- Alternativa a Flux Dev
- No usado actualmente

### Clarity Upscaler
```
fal-ai/clarity-upscaler
```
- Para mejorar resolución sin cambiar contenido
- No usado actualmente

---

## 🎯 FLUJO DE GENERACIÓN ACTUAL

### Para Imágenes (Story Art)

```
1. Usuario solicita borrador
   ↓
2. Flux Schnell (text-to-image)
   - Genera imagen inicial desde prompt
   - 2-3 segundos
   - Modelo: fal-ai/flux/schnell
   ↓
3. Usuario solicita HD
   ↓
4. Flux Dev Image-to-Image
   - Mejora calidad manteniendo composición
   - Usa imagen del borrador como referencia
   - Strength: 0.20 (muy similar)
   - 5-10 segundos
   - Modelo: fal-ai/flux/dev/image-to-image
   ↓
5. (Opcional) Usuario ajusta realidad
   ↓
6. Flux Dev Image-to-Image
   - Ajusta nivel de realismo
   - Usa imagen HD como referencia
   - Strength: 0.35 (cambios visibles)
   - 5-10 segundos
   - Modelo: fal-ai/flux/dev/image-to-image
```

**Resumen**: 
- ✅ **Borrador**: Flux Schnell (text-to-image) - genera desde cero
- ✅ **HD**: Flux Dev img2img - mejora el borrador
- ✅ **Editor de Realidad**: Flux Dev img2img - ajusta realismo del HD

### Para Videos

```
1. Usuario solicita video (Draft o HD)
   ↓
2. Pika v2 Turbo (text-to-video)
   - Genera video desde prompt
   - 2-5 minutos
   - Resolución según calidad seleccionada
   ↓
3. Video listo para descargar
```

---

## ⚡ TIEMPOS DE GENERACIÓN

| Tipo | Modelo | Tiempo | Calidad |
|------|--------|--------|---------|
| **Borrador (Imagen)** | Flux Schnell | 2-3 seg | Buena |
| **HD (Imagen)** | Flux Dev img2img | 5-10 seg | Alta |
| **Variación Realidad** | Flux Dev img2img | 5-10 seg | Alta |
| **Video Draft** | Pika v2 Turbo | 2-5 min | Alta (720p) |
| **Video HD** | Pika v2 Turbo | 2-5 min | Muy Alta (1080p) |

---

## 💰 CONSIDERACIONES DE COSTO

### Flux Schnell (Borrador)
- ✅ Más económico
- ✅ Muy rápido
- ✅ Ideal para iteraciones rápidas

### Flux Dev Image-to-Image (HD)
- 💰 Más costoso que Schnell
- ✅ Mejor calidad
- ✅ Mantiene composición (img2img)

### Pika v2 Turbo (Video)
- 💰💰 Más costoso (generación de video)
- ✅ "Turbo" = 3x más rápido que Pika Standard
- ✅ Más económico que Pika Standard

---

## 🔧 CONFIGURACIÓN

### Variables de Entorno
```
FAL_AI_API_KEY=fal_...
```

**Ubicación**: Netlify Environment Variables

### Archivos de Configuración

1. **Servicio de Imágenes**: `services/falAiService.ts`
   - Modelos de imagen
   - Funciones de generación
   - Configuración de parámetros

2. **Servicio de Videos**: `services/vertexVideoService.ts`
   - Funciones de generación de video
   - Polling de estado

3. **Backend de Videos**: `netlify/functions/generate-video.ts`
   - Endpoint de generación
   - Configuración de Pika

4. **Backend de Polling**: `netlify/functions/check-video-operation.ts`
   - Verificación de estado
   - Obtención de resultado

---

## 📚 DOCUMENTACIÓN DE MODELOS

### Flux Schnell
- **Docs**: https://fal.ai/models/fal-ai/flux/schnell
- **Tipo**: Text-to-Image
- **Velocidad**: Ultra rápido (2-3s)

### Flux Dev Image-to-Image
- **Docs**: https://fal.ai/models/fal-ai/flux/dev/image-to-image
- **Tipo**: Image-to-Image
- **Calidad**: Alta
- **Mantiene**: Composición y estructura

### Pika v2 Turbo Text-to-Video
- **Docs**: https://fal.ai/models/fal-ai/pika/v2/turbo/text-to-video
- **Tipo**: Text-to-Video
- **Velocidad**: 3x más rápido que Pika Standard
- **Calidad**: Alta

---

## 🎯 OPTIMIZACIONES APLICADAS

### Compresión de Imágenes
**Problema**: Payloads grandes causaban timeouts  
**Solución**: Compresión de imagen de referencia antes de enviar
```typescript
compressedImage = await compressImageDataUrl(referenceImageDataUrl, 768, 0.75);
```
**Resultado**: Reducción de 60-80% en tamaño

### Strength Ajustado para Realidad
**Problema**: Cambios de realidad no eran visibles  
**Solución**: Aumentar strength de 0.20 a 0.35
```typescript
strength = 0.35, // ✅ AUMENTADO para cambios más visibles
```
**Resultado**: Cambios más perceptibles entre niveles

### Polling con statusUrl
**Problema**: URL de polling incorrecta causaba errores 405  
**Solución**: Usar statusUrl proporcionada por Fal.ai
```typescript
const url = statusUrl || `https://queue.fal.run/fal-ai/pika/requests/${taskId}/status`;
```
**Resultado**: Polling funciona correctamente

---

## ✅ ESTADO ACTUAL

### Imágenes (Story Art)
- ✅ **Borrador**: Funcionando perfectamente (Flux Schnell)
- ✅ **HD**: Funcionando perfectamente (Flux Dev img2img)
- ✅ **Editor de Realidad**: Funcionando perfectamente (Flux Dev img2img)

### Videos
- ✅ **Generación**: Funcionando correctamente (Pika v2 Turbo)
- ✅ **Polling**: Corregido (usa statusUrl correcta)
- ⏳ **Tiempos**: 2-5 minutos (normal para la industria)

---

## 🚀 POSIBLES MEJORAS FUTURAS

### Para Imágenes
1. Probar Flux Pro para calidad aún mayor
2. Implementar upscaling con Clarity Upscaler
3. Agregar más opciones de aspect ratio

### Para Videos
1. Agregar opción de 3 segundos para generación más rápida
2. Implementar video con audio
3. Probar modelos alternativos (Kling, Veo) para comparar

---

**Última actualización**: 9 de Enero 2026  
**Versión**: 1.0


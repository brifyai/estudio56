# ✅ MIGRACIÓN A TEXT-TO-VIDEO (T2V) COMPLETADA

**Fecha:** 7 de Enero, 2026  
**Cambio:** Migración de Image-to-Video (I2V) a Text-to-Video (T2V)

---

## 🎯 RESUMEN DEL CAMBIO

Se ha migrado el sistema de generación de videos de **Image-to-Video (I2V)** a **Text-to-Video (T2V)** usando el modelo **wan2.5-t2v-preview** de Alibaba Cloud.

### Antes (I2V):
```
Prompt → Genera IMAGEN → Imagen + Prompt → VIDEO
```

### Ahora (T2V):
```
Prompt → VIDEO (directo)
```

---

## 🎬 MODELOS IMPLEMENTADOS

### Draft (Borrador):
- **Modelo**: `wan2.5-t2v-preview`
- **Resolución**: 480P (832×480)
- **Duración**: 5 segundos
- **Formato**: `"size": "832*480"`

### HD (Alta Definición):
- **Modelo**: `wan2.5-t2v-preview`
- **Resolución**: 720P (1280×720)
- **Duración**: 5 segundos
- **Formato**: `"size": "1280*720"`

---

## 📝 ARCHIVOS MODIFICADOS

### 1. `netlify/functions/generate-video.ts`

**Cambios realizados:**

✅ **Modelos actualizados:**
```typescript
// ANTES (I2V):
const VIDEO_MODELS = {
  draft: 'wan2.2-i2v-flash',
  hd: 'wan2.6-i2v'
};

// AHORA (T2V):
const VIDEO_MODELS = {
  draft: 'wan2.5-t2v-preview',
  hd: 'wan2.5-t2v-preview'
};
```

✅ **Interfaz actualizada:**
```typescript
// ANTES (I2V):
interface VideoGenerationRequest {
  prompt: string;
  imageUrl: string;  // ← REMOVIDO
  quality: 'draft' | 'hd';
  aspectRatio?: string;
  duration?: number;
}

// AHORA (T2V):
interface VideoGenerationRequest {
  prompt: string;
  // ← NO requiere imageUrl
  quality: 'draft' | 'hd';
  aspectRatio?: string;
  duration?: number;
}
```

✅ **Validación actualizada:**
```typescript
// ANTES (I2V):
if (!body.prompt || !body.imageUrl) {
  throw new Error("Faltan parámetros requeridos: prompt e imageUrl");
}

// AHORA (T2V):
if (!body.prompt) {
  throw new Error("Falta parámetro requerido: prompt");
}
```

✅ **Parámetros de resolución actualizados:**
```typescript
// ANTES (I2V):
const resolution = body.quality === 'hd' ? '720P' : '480P';

parameters: {
  resolution: resolution,  // "480P" o "720P"
  // ...
}

// AHORA (T2V):
const size = body.quality === 'hd' ? '1280*720' : '832*480';

parameters: {
  size: size,  // "832*480" o "1280*720"
  // ...
}
```

✅ **Request body actualizado:**
```typescript
// ANTES (I2V):
const requestBody = {
  model: model,
  input: {
    prompt: cleanPrompt,
    img_url: body.imageUrl  // ← REMOVIDO
  },
  parameters: {
    resolution: resolution,  // ← CAMBIADO a "size"
    // ...
  }
};

// AHORA (T2V):
const requestBody = {
  model: model,
  input: {
    prompt: cleanPrompt
    // ← NO incluir img_url
  },
  parameters: {
    size: size,  // ← Nuevo formato
    // ...
  }
};
```

---

### 2. `services/vertexVideoService.ts`

**Cambios realizados:**

✅ **Documentación actualizada:**
```typescript
// ANTES (I2V):
/**
 * Modelos disponibles:
 * - wan2.2-i2v-flash (480P - rápido, draft)
 * - wan2.6-i2v (720P/1080P - alta calidad, HD)
 */

// AHORA (T2V):
/**
 * Modelos TEXT-TO-VIDEO (T2V):
 * - wan2.5-t2v-preview (480P - draft, 720P - HD)
 * 
 * NOTA: T2V genera video directamente desde prompt, sin necesidad de imagen base
 */
```

✅ **Interfaz actualizada:**
```typescript
// ANTES (I2V):
export interface VideoGenerationOptions {
  prompt: string;
  imageUrl: string;  // ← REMOVIDO
  quality: 'draft' | 'hd';
  aspectRatio?: '9:16' | '16:9' | '1:1';
  duration?: number;
}

// AHORA (T2V):
export interface VideoGenerationOptions {
  prompt: string;
  // ← NO requiere imageUrl
  quality: 'draft' | 'hd';
  aspectRatio?: '9:16' | '16:9' | '1:1';
  duration?: number;
}
```

✅ **Función generateVideo actualizada:**
```typescript
// ANTES (I2V):
body: JSON.stringify({
  prompt: options.prompt,
  imageUrl: options.imageUrl,  // ← REMOVIDO
  quality: options.quality,
  aspectRatio: options.aspectRatio || '9:16',
  duration: options.duration || 5
})

// AHORA (T2V):
body: JSON.stringify({
  prompt: options.prompt,
  // ← NO incluir imageUrl
  quality: options.quality,
  aspectRatio: options.aspectRatio || '9:16',
  duration: options.duration || 5
})
```

✅ **Logs actualizados:**
```typescript
// ANTES (I2V):
console.log('🎬 [AlibabaVideo] Iniciando generación de video...');
console.log('🎬 [AlibabaVideo] Image URL:', options.imageUrl.substring(0, 100));

// AHORA (T2V):
console.log('🎬 [AlibabaVideo] Iniciando generación de video TEXT-TO-VIDEO...');
// ← NO loguear imageUrl
```

---

### 3. `App.tsx` (líneas 1323-1420)

**Cambios realizados:**

✅ **ELIMINADO: Paso de generación de imagen base**
```typescript
// ANTES (I2V): PASO 1 - Generar imagen base
console.log('🖼️ Generando imagen base para video...');
setStatus({
  isLoading: true,
  step: 'analyzing',
  message: ':: GENERANDO_IMAGEN_BASE ::'
});

const videoSeed = Math.floor(Math.random() * 2000000000);
const imageResult = await generateFlyerImage(
  enhancedPrompt,
  effectiveVideoStyleKey,
  aspectRatio,
  'draft',
  videoSeed,
  undefined,
  hasProductOverlay,
  false,
  undefined,
  undefined
);

if (!imageResult.imageDataUrl) {
  throw new Error('No se pudo generar la imagen base para el video');
}

console.log('✅ Imagen base generada');
setDraftVideoImageUrl(imageResult.imageDataUrl);

// AHORA (T2V): ← TODO ESTE BLOQUE ELIMINADO
```

✅ **SIMPLIFICADO: Generación directa de video**
```typescript
// ANTES (I2V): PASO 2 - Generar video desde imagen
const videoUrl = await generateVideoAndWait(
  {
    prompt: enhancedPrompt,
    imageUrl: imageResult.imageDataUrl,  // ← REMOVIDO
    quality: imageQuality === 'draft' ? 'draft' : 'hd',
    aspectRatio: aspectRatio as '9:16' | '16:9' | '1:1',
    duration: 5
  },
  // ...
);

// AHORA (T2V): Generación directa
const videoUrl = await generateVideoAndWait(
  {
    prompt: enhancedPrompt,
    // ← NO incluir imageUrl
    quality: imageQuality === 'draft' ? 'draft' : 'hd',
    aspectRatio: aspectRatio as '9:16' | '16:9' | '1:1',
    duration: 5
  },
  // ...
);
```

✅ **SIMPLIFICADO: Manejo de errores**
```typescript
// ANTES (I2V): Fallback complejo con imagen base
if (draftVideoImageUrl) {
  console.log('⚠️ Fallback: Mostrando imagen base generada');
  setImageUrl(draftVideoImageUrl);
  setIsDraft(true);
  estudioAlerts.warning(`No se pudo generar el video: ${videoError.message}. Se muestra la imagen base.`);
} else {
  // Generar imagen estática...
}

// AHORA (T2V): Fallback simple
console.log('⚠️ Fallback: Generando imagen estática');
const videoSeed = Math.floor(Math.random() * 2000000000);
const imageResult = await generateFlyerImage(
  enhancedPrompt,
  effectiveVideoStyleKey,
  aspectRatio,
  'draft',
  videoSeed,
  undefined,
  hasProductOverlay,
  false,
  undefined,
  undefined
);

setImageUrl(imageResult.imageDataUrl);
if (imageQuality === 'draft') {
  setDraftVideoImageUrl(imageResult.imageDataUrl);
}
setIsDraft(imageQuality === 'draft');

estudioAlerts.warning(`No se pudo generar el video: ${videoError.message}. Se generó una imagen estática.`);
```

✅ **Comentarios actualizados:**
```typescript
// ANTES (I2V):
// ✅ GENERACIÓN DE VIDEO CON VERTEX AI

// AHORA (T2V):
// ✅ GENERACIÓN DE VIDEO CON ALIBABA CLOUD TEXT-TO-VIDEO (T2V)
```

---

## 💰 BENEFICIOS DEL CAMBIO

### 1. Reducción de Costos
- ❌ **Antes**: $0.04 (imagen) + $0.10-0.20 (video) = **$0.14-0.24 por video**
- ✅ **Ahora**: $0.10-0.20 (video) = **$0.10-0.20 por video**
- 💰 **Ahorro**: ~28% en draft, ~16% en HD

### 2. Velocidad
- ❌ **Antes**: 2 pasos (imagen + video) = ~2-6 minutos
- ✅ **Ahora**: 1 paso (video directo) = ~1-5 minutos
- ⚡ **Mejora**: ~30-50% más rápido

### 3. Simplicidad
- ❌ **Antes**: 2 llamadas a API (Imagen 3 + Alibaba Cloud)
- ✅ **Ahora**: 1 llamada a API (Alibaba Cloud)
- 🎯 **Mejora**: Menos puntos de fallo

### 4. Consumo de Créditos
- ❌ **Antes**: Consume créditos de imagen + video
- ✅ **Ahora**: Solo consume créditos de video
- 💎 **Ahorro**: ~30% menos créditos

---

## ⚠️ CONSIDERACIONES

### Ventajas de T2V:
- ✅ Más económico (~28% ahorro)
- ✅ Más rápido (~30-50% mejora)
- ✅ Menos llamadas a API
- ✅ Menos créditos consumidos
- ✅ Código más simple

### Desventajas de T2V:
- ❌ Menos control visual (no defines composición exacta)
- ❌ No puedes incluir logos/productos específicos
- ❌ Menos consistencia (cada video es único)
- ❌ Menos predecible (IA tiene libertad total)

---

## 🧪 PRUEBAS RECOMENDADAS

### Prueba 1: Video Draft (480P)
1. Ir a la app
2. Seleccionar "Video" como tipo de medio
3. Ingresar descripción: "Modern gym with people exercising"
4. Seleccionar calidad: "Draft"
5. Generar video
6. Verificar que se genera directamente (sin imagen base)
7. Verificar resolución: 480P (832×480)

### Prueba 2: Video HD (720P)
1. Ir a la app
2. Seleccionar "Video" como tipo de medio
3. Ingresar descripción: "Professional Pilates studio session"
4. Seleccionar calidad: "HD"
5. Generar video
6. Verificar que se genera directamente (sin imagen base)
7. Verificar resolución: 720P (1280×720)

### Prueba 3: Manejo de Errores
1. Desconectar internet temporalmente
2. Intentar generar video
3. Verificar que muestra fallback con imagen estática
4. Verificar mensaje de error apropiado

---

## 📋 CHECKLIST DE DESPLIEGUE

- [x] Actualizar `generate-video.ts` para T2V
- [x] Actualizar `vertexVideoService.ts` para T2V
- [x] Actualizar `App.tsx` para T2V
- [ ] **Configurar `ALIBABA_API_KEY` en Netlify** ⚠️ PENDIENTE
- [ ] Redesplegar sitio en Netlify
- [ ] Probar generación de video draft (480P)
- [ ] Probar generación de video HD (720P)
- [ ] Verificar que URLs de video funcionan
- [ ] Verificar que fallback funciona correctamente
- [ ] Monitorear logs en Netlify
- [ ] Verificar costos reales en Alibaba Cloud Console

---

## 🔗 RECURSOS

- **Alibaba Cloud Console**: https://modelstudio.console.alibabacloud.com/
- **Documentación T2V**: https://www.alibabacloud.com/help/en/model-studio/text-to-video-api-reference/
- **Netlify Dashboard**: https://app.netlify.com/sites/estudio56/
- **Pricing**: https://www.alibabacloud.com/help/en/model-studio/billing-and-throttling

---

## 📊 COMPARACIÓN TÉCNICA

| Característica | I2V (Antes) | T2V (Ahora) |
|----------------|-------------|-------------|
| **Modelos Draft** | wan2.2-i2v-flash | wan2.5-t2v-preview |
| **Modelos HD** | wan2.6-i2v | wan2.5-t2v-preview |
| **Requiere Imagen** | ✅ Sí | ❌ No |
| **Pasos** | 2 (imagen + video) | 1 (video) |
| **Parámetro Resolución** | `resolution` | `size` |
| **Formato Resolución** | "480P", "720P" | "832*480", "1280*720" |
| **Costo Draft** | $0.14 | $0.10 |
| **Costo HD** | $0.24 | $0.20 |
| **Tiempo Draft** | ~2-3 min | ~1-2 min |
| **Tiempo HD** | ~4-6 min | ~3-5 min |
| **Control Visual** | Alto | Medio |
| **Logos/Productos** | ✅ Sí | ❌ No |

---

## 🎯 PRÓXIMOS PASOS

### Inmediato (Hoy):
1. ✅ Código actualizado
2. ⚠️ **Configurar ALIBABA_API_KEY en Netlify**
3. ⚠️ **Redesplegar sitio**
4. ⚠️ **Probar generación de videos**

### Corto Plazo (Esta Semana):
1. Monitorear costos reales
2. Recopilar feedback de usuarios
3. Ajustar prompts si es necesario
4. Optimizar duración de videos

### Mediano Plazo (Próximo Mes):
1. Analizar calidad de videos generados
2. Comparar con I2V anterior
3. Evaluar si implementar modo híbrido (T2V + I2V)
4. Considerar agregar opciones de duración (5s/10s)

---

**Última actualización:** 7 de Enero, 2026  
**Estado:** ✅ Código actualizado - ⚠️ Pendiente despliegue en Netlify

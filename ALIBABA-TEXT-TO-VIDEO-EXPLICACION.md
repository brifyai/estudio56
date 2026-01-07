# 🎬 ALIBABA CLOUD: TEXT-TO-VIDEO vs IMAGE-TO-VIDEO

**Fecha:** 7 de Enero, 2026  
**Pregunta:** ¿Este modelo genera video a partir de un prompt?

---

## 📊 RESPUESTA CORTA

**SÍ**, Alibaba Cloud Wanx tiene modelos que generan video **solo con prompt** (Text-to-Video), pero **actualmente estás usando Image-to-Video** que requiere imagen + prompt.

---

## 🎯 IMPLEMENTACIÓN ACTUAL: IMAGE-TO-VIDEO (I2V)

### Modelos Implementados:
- **wan2.2-i2v-flash** (Draft - 480P)
- **wan2.6-i2v** (HD - 720P/1080P)

### Flujo Actual:
```
1. Usuario ingresa descripción
2. Sistema genera IMAGEN BASE (draft)
3. Sistema envía imagen + prompt a Alibaba Cloud
4. Alibaba Cloud genera VIDEO a partir de imagen + prompt
5. Usuario recibe video final
```

### Parámetros Requeridos:
```typescript
{
  model: "wan2.2-i2v-flash" | "wan2.6-i2v",
  input: {
    prompt: "descripción del video",
    img_url: "https://..." // ← IMAGEN REQUERIDA
  },
  parameters: {
    resolution: "480P" | "720P" | "1080P",
    duration: 5 | 10 | 15
  }
}
```

---

## 🆕 ALTERNATIVA DISPONIBLE: TEXT-TO-VIDEO (T2V)

### Modelos Disponibles:
- **wan2.2-t2v-plus** (480P/1080P, 5s fijo)
- **wan2.5-t2v-preview** (480P/720P/1080P, 5/10s)
- **wan2.6-t2v** (720P/1080P, 5/10/15s, multi-shot)

### Flujo con T2V:
```
1. Usuario ingresa descripción
2. Sistema envía SOLO PROMPT a Alibaba Cloud
3. Alibaba Cloud genera VIDEO directamente desde prompt
4. Usuario recibe video final
```

### Parámetros Requeridos:
```typescript
{
  model: "wan2.6-t2v" | "wan2.5-t2v-preview" | "wan2.2-t2v-plus",
  input: {
    prompt: "descripción del video"
    // ← NO requiere img_url
  },
  parameters: {
    size: "832*480" | "1280*720" | "1920*1080", // ← Formato diferente
    duration: 5 | 10 | 15
  }
}
```

---

## 🔄 COMPARACIÓN: I2V vs T2V

| Característica | Image-to-Video (I2V) | Text-to-Video (T2V) |
|----------------|----------------------|---------------------|
| **Implementación** | ✅ Actual | ❌ No implementado |
| **Requiere Imagen** | ✅ Sí | ❌ No |
| **Modelos Draft** | wan2.2-i2v-flash | wan2.2-t2v-plus |
| **Modelos HD** | wan2.6-i2v | wan2.6-t2v |
| **Resolución Draft** | 480P | 480P/1080P |
| **Resolución HD** | 720P/1080P | 720P/1080P |
| **Duración** | 5/10/15s | 5/10/15s |
| **Parámetro Resolución** | `resolution` | `size` |
| **Formato Resolución** | "480P", "720P" | "832*480", "1280*720" |
| **Endpoint** | Mismo | Mismo |
| **Velocidad** | Rápido | Rápido |
| **Control Visual** | Alto (imagen base) | Medio (solo prompt) |

---

## ✅ VENTAJAS DE IMAGE-TO-VIDEO (Actual)

1. **Mayor control visual**: La imagen base define composición, colores, estilo
2. **Consistencia de marca**: Puedes usar logos, productos, elementos específicos
3. **Mejor para marketing**: Control preciso sobre elementos visuales
4. **Reutilización**: Puedes generar múltiples videos desde la misma imagen

---

## ✅ VENTAJAS DE TEXT-TO-VIDEO (Alternativa)

1. **Más rápido**: Elimina paso de generación de imagen base
2. **Más simple**: Solo requiere prompt
3. **Menos créditos**: No gastas créditos en imagen base
4. **Más creativo**: IA tiene libertad total para interpretar prompt

---

## 🤔 ¿CUÁL USAR?

### Usa IMAGE-TO-VIDEO (I2V) si:
- ✅ Necesitas control preciso sobre composición visual
- ✅ Quieres incluir logos, productos, elementos específicos
- ✅ Necesitas consistencia de marca
- ✅ Trabajas con materiales de marketing existentes

### Usa TEXT-TO-VIDEO (T2V) si:
- ✅ Quieres generación más rápida
- ✅ No necesitas control visual preciso
- ✅ Prefieres dejar creatividad a la IA
- ✅ Quieres ahorrar créditos (no generas imagen base)

---

## 🔧 CAMBIOS NECESARIOS PARA T2V

Si quieres cambiar a Text-to-Video, necesitas modificar:

### 1. `netlify/functions/generate-video.ts`
```typescript
// CAMBIAR:
const requestBody = {
  model: model,
  input: {
    prompt: cleanPrompt,
    img_url: body.imageUrl // ← REMOVER
  },
  parameters: {
    resolution: resolution, // ← CAMBIAR a "size"
    // ...
  }
};

// POR:
const requestBody = {
  model: model === 'wan2.2-i2v-flash' ? 'wan2.2-t2v-plus' : 'wan2.6-t2v',
  input: {
    prompt: cleanPrompt
    // ← NO incluir img_url
  },
  parameters: {
    size: resolution === '480P' ? '832*480' : '1280*720', // ← Nuevo formato
    // ...
  }
};
```

### 2. `services/vertexVideoService.ts`
```typescript
// CAMBIAR interfaz:
export interface VideoGenerationOptions {
  prompt: string;
  imageUrl: string; // ← REMOVER
  quality: 'draft' | 'hd';
  aspectRatio?: '9:16' | '16:9' | '1:1';
  duration?: number;
}

// POR:
export interface VideoGenerationOptions {
  prompt: string;
  // ← NO incluir imageUrl
  quality: 'draft' | 'hd';
  aspectRatio?: '9:16' | '16:9' | '1:1';
  duration?: number;
}
```

### 3. `App.tsx` (líneas 1330-1450)
```typescript
// REMOVER PASO 1 (generación de imagen base):
// PASO 1: Generar imagen base primero (requerido por Alibaba Cloud)
// ... TODO EL BLOQUE DE GENERACIÓN DE IMAGEN ...

// CAMBIAR PASO 2:
const videoUrl = await generateVideoAndWait(
  {
    prompt: enhancedPrompt,
    imageUrl: imageResult.imageDataUrl, // ← REMOVER
    quality: imageQuality === 'draft' ? 'draft' : 'hd',
    aspectRatio: aspectRatio as '9:16' | '16:9' | '1:1',
    duration: 5
  },
  // ...
);

// POR:
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

---

## 📝 RECOMENDACIÓN

**Para tu caso de uso (Estudio 56 - Marketing Local):**

### Mantén IMAGE-TO-VIDEO (I2V) porque:

1. **Control de marca**: Puedes incluir logos, colores corporativos
2. **Productos específicos**: Puedes mostrar productos reales
3. **Consistencia visual**: Mantienes estilo de marca
4. **Reutilización**: Generas imagen una vez, múltiples videos

### Considera TEXT-TO-VIDEO (T2V) para:

1. **Contenido genérico**: Videos de relleno, backgrounds
2. **Pruebas rápidas**: Testear ideas sin generar imagen
3. **Contenido abstracto**: Conceptos que no requieren elementos específicos

---

## 🎯 DECISIÓN FINAL

**¿Quieres cambiar a Text-to-Video (T2V)?**

- **SÍ** → Te ayudo a hacer los cambios en los 3 archivos
- **NO** → Mantenemos Image-to-Video (I2V) actual

**Mi recomendación:** Mantener I2V por ahora, pero podemos implementar T2V como **opción adicional** en el futuro (toggle en UI).

---

## 📚 DOCUMENTACIÓN OFICIAL

- **Image-to-Video API**: https://www.alibabacloud.com/help/en/model-studio/image-to-video-api-reference/
- **Text-to-Video API**: https://www.alibabacloud.com/help/en/model-studio/text-to-video-api-reference/
- **Model Studio Console**: https://modelstudio.console.alibabacloud.com/

---

**Última actualización:** 7 de Enero, 2026  
**Estado:** ✅ Explicación completa - Esperando decisión del usuario

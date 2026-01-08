# 🔍 Informe: Imagen HD no se parece al Borrador

## 📋 Problema Reportado

Cuando el usuario genera una imagen en HD, **la imagen resultante no se parece en nada al borrador**.

## 🔎 Análisis del Código

### 1. Flujo de Generación HD (App.tsx líneas 1000-1500)

Cuando el usuario hace clic en "Mejorar a HD":

```typescript
const handleUpgradeToHD = async () => {
  // ...
  const hdPrompt = `Enhance this image with better quality, sharpness, and detail. 
                    Keep EXACTLY the same composition, layout, colors, and elements. 
                    Do not change anything except improving quality.`;
  
  const result = await generateFlyerImage(
    hdPrompt,
    styleKey,
    aspectRatio,
    'hd',
    seed,
    customStylePrompt,
    hasProductOverlay,
    true,
    undefined,
    undefined,
    draftImageUrl || undefined, // ← Imagen de referencia
    upgradeArtDirectionId
  );
}
```

### 2. Servicio de Generación (geminiService.ts líneas 2400-2500)

El código detecta que hay una imagen de referencia (`draftImageForHD`) y usa **fal.ai Image-to-Image**:

```typescript
if (isFalAiConfigured() && draftImageForHD) {
  console.log('🚀 [HD] Usando fal.ai Image-to-Image nativo (95%+ similitud)');
  
  // Analiza el borrador con Gemini Vision
  const draftAnalysis = await analyzeImageWithGemini(draftImageForHD);
  
  // Construye un prompt COMPLEJO con todos los filtros
  const hdPrompt = `
    ${realityPrompt}
    REFERENCE IMAGE ANALYSIS: ${draftAnalysis}
    ${REAL_BUSINESS_ENVIRONMENT}
    ${RAW_PHOTO_TEXTURE}
    ${HUMAN_AUTHENTICITY_RULES}
    ${BONE_ANCHOR_RULES}
    VISUAL STYLE: ${activeStylePrompt}
    ...
  `;
  
  // Llama a fal.ai
  const falResult = await generateHDWithImg2Img(
    hdPrompt,
    draftImageForHD,
    {
      seed: consistencySeed,
      aspectRatio,
      // ...
    }
  );
}
```

### 3. Servicio fal.ai (falAiService.ts)

El código usa **Clarity Upscaler**:

```typescript
export const generateHDWithImg2Img = async (
  prompt: string,
  referenceImageDataUrl: string,
  options: {
    strength?: number; // 0.05 = máxima similitud
    guidanceScale?: number; // 5 = mínimo
    steps?: number; // 15 = mínimo
    seed?: number;
    aspectRatio?: AspectRatio;
    negativePrompt?: string;
  } = {}
): Promise<FalImg2ImgResponse> => {
  // ...
  
  // Clarity Upscaler tiene una API diferente
  const upscalerRequestBody = {
    prompt: requestBody.prompt,
    image: requestBody.image,
    scale: 2, // 2x upscale
    enhance_prompt: true,
    enhance_negative_prompt: true,
  };

  const response = await fetch(`${FAL_AI_BASE_URL}/${HD_MODEL}`, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_AI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(upscalerRequestBody),
  });
}
```

## 🐛 Problemas Identificados

### Problema 1: Clarity Upscaler NO usa el prompt correctamente

**Clarity Upscaler** es un modelo de **upscaling puro** que:
- ✅ Toma una imagen y la escala 2x o 4x
- ❌ **NO usa el prompt para modificar la imagen**
- ❌ **NO usa strength, guidance_scale, steps** (estos parámetros se ignoran)

El código está enviando un prompt complejo de 2000+ caracteres que **se está ignorando completamente**.

### Problema 2: Parámetros incorrectos para Clarity Upscaler

El código está configurando:
```typescript
strength = 0.05,
guidanceScale = 5,
steps = 15,
```

Pero **Clarity Upscaler NO usa estos parámetros**. Solo usa:
- `image`: La imagen a escalar
- `scale`: Factor de escala (2 o 4)
- `prompt`: (opcional, pero no lo usa para modificar la imagen)

### Problema 3: Posible error en la conversión de imagen

El código convierte la imagen de referencia a base64:

```typescript
const imageBase64 = extractBase64(referenceImageDataUrl);
```

Si `draftImageUrl` no es un data URL válido, esto puede fallar silenciosamente.

### Problema 4: No hay manejo de errores visible

Si fal.ai falla, el código retorna:
```typescript
return {
  success: false,
  error: error.message,
};
```

Pero en `geminiService.ts` no hay un `catch` que maneje este caso y haga fallback.

## 🔧 Soluciones Propuestas

### Solución 1: Usar un modelo Image-to-Image real (RECOMENDADO)

En lugar de Clarity Upscaler, usar **SDXL img2img** que SÍ respeta el prompt y los parámetros:

```typescript
// En falAiService.ts
const HD_MODEL = FAL_MODELS.SDXL_IMG2IMG; // En lugar de CLARITY_UPSCALER

export const generateHDWithImg2Img = async (...) => {
  const requestBody = {
    prompt: prompt,
    negative_prompt: negativePrompt,
    image_url: referenceImageDataUrl, // o 'image' con base64
    strength: 0.15, // Bajo = mantener similitud
    guidance_scale: 7, // Moderado
    num_inference_steps: 25,
    width: dimensions.width,
    height: dimensions.height,
    seed: seed,
  };

  const response = await fetch(`${FAL_AI_BASE_URL}/${FAL_MODELS.SDXL_IMG2IMG}`, {
    method: 'POST',
    headers: {
      'Authorization': `Key ${FAL_AI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
}
```

### Solución 2: Simplificar el prompt HD

El prompt actual es demasiado complejo (2000+ caracteres). Simplificarlo a:

```typescript
const hdPrompt = `
  High quality professional photograph.
  ${draftAnalysis}
  Maintain exact composition, colors, lighting, and subject placement.
  Improve only: sharpness, detail, texture quality.
`.trim();
```

### Solución 3: Agregar logging detallado

Agregar logs para diagnosticar:

```typescript
console.log('🖼️ [HD] Draft image URL type:', typeof draftImageForHD);
console.log('🖼️ [HD] Draft image URL length:', draftImageForHD?.length);
console.log('🖼️ [HD] Draft image URL prefix:', draftImageForHD?.substring(0, 50));
console.log('🖼️ [HD] Base64 length:', imageBase64?.length);
```

### Solución 4: Agregar manejo de errores

```typescript
const falResult = await generateHDWithImg2Img(...);

if (!falResult.success) {
  console.error('❌ [HD] fal.ai falló:', falResult.error);
  // Fallback: Usar Gemini o Vertex AI
  imageDataUrl = await generateWithVertexAI(...);
} else {
  // Descargar la imagen de fal.ai y convertir a data URL
  const response = await fetch(falResult.imageUrl);
  const blob = await response.blob();
  imageDataUrl = await blobToDataURL(blob);
}
```

### Solución 5: Verificar configuración de fal.ai

Verificar que la API key esté configurada:

```typescript
if (!isFalAiConfigured()) {
  console.warn('⚠️ [HD] fal.ai no configurado, usando fallback');
  // Usar Gemini o Vertex AI directamente
}
```

## 🎯 Recomendación Final

**Opción A: Usar SDXL img2img** (Mejor calidad, respeta el prompt)
- Cambiar `HD_MODEL` de `CLARITY_UPSCALER` a `SDXL_IMG2IMG`
- Ajustar `strength` a 0.15-0.25 para mantener similitud
- Simplificar el prompt a 500-800 caracteres

**Opción B: Usar solo Clarity Upscaler correctamente** (Más rápido, pero menos control)
- Eliminar el prompt complejo (no se usa)
- Solo enviar la imagen y `scale: 2`
- Aceptar que la imagen HD será idéntica al borrador, solo en mayor resolución

**Opción C: Usar Vertex AI Imagen** (Más confiable, pero más lento)
- Usar `imagen-4.0-generate-001` con img2img
- Configurar `strength` bajo para mantener similitud

## 📊 Diagnóstico Rápido

Para diagnosticar el problema actual, agregar estos logs en `App.tsx`:

```typescript
const handleUpgradeToHD = async () => {
  console.log('═══════════════════════════════════════');
  console.log('🔍 DIAGNÓSTICO HD');
  console.log('═══════════════════════════════════════');
  console.log('📸 Draft URL disponible:', !!draftImageUrl);
  console.log('📸 Draft URL type:', typeof draftImageUrl);
  console.log('📸 Draft URL length:', draftImageUrl?.length);
  console.log('📸 Draft URL prefix:', draftImageUrl?.substring(0, 100));
  console.log('🔑 fal.ai configurado:', isFalAiConfigured());
  console.log('🎨 Style key:', styleKey);
  console.log('📐 Aspect ratio:', aspectRatio);
  console.log('🎲 Seed:', seed);
  console.log('═══════════════════════════════════════');
  
  // ... resto del código
}
```

## 🚀 Próximos Pasos

1. **Verificar logs en consola** cuando se genera HD
2. **Verificar que fal.ai esté configurado** (API key en `.env`)
3. **Probar con SDXL img2img** en lugar de Clarity Upscaler
4. **Simplificar el prompt HD** a 500-800 caracteres
5. **Agregar manejo de errores** para fallback a Vertex AI

---

**Fecha:** 8 de enero de 2026  
**Archivo:** `INFORME-PROBLEMA-HD-NO-PARECE-BORRADOR.md`

# 🎯 ESTRATEGIA FINAL: Regulador de Realidad con Prompt Vacío

## 📋 OBJETIVO DEL REGULADOR DE REALIDAD

Generar **DIFERENTES VERSIONES de la MISMA ESCENA** con diferentes niveles de calidad fotográfica:

- **Misma persona**
- **Misma pose**
- **Mismo fondo**
- **Misma composición**
- **Solo cambia la calidad fotográfica** (granulado, iluminación, nitidez, etc.)

## ❌ PROBLEMA IDENTIFICADO

Incluso con Image-to-Image y strength bajo (0.20), si pasamos un **prompt descriptivo**, el modelo puede:
- Reinterpretar la escena
- Cambiar la persona
- Cambiar la pose
- Cambiar el fondo
- Generar una escena completamente diferente

**Evidencia**: Comparador mostraba mujer con celular (1.5★) vs persona en oficina (2.0★)

## ✅ SOLUCIÓN IMPLEMENTADA

### 1. Prompt VACÍO para Image-to-Image

```typescript
// App.tsx - handleRealityChange
const technicalPrompt = '';  // Vacío para máxima fidelidad
```

**Razón**: Con prompt vacío, el modelo se basa 100% en la imagen de referencia y solo aplica transformaciones técnicas.

### 2. Negative Prompt Específico por Nivel

El negative prompt controla QUÉ EVITAR según el nivel de calidad deseado:

```typescript
const qualityNegativeMap: Record<number, string> = {
  // Niveles BAJOS (1.0-2.5): Evitar calidad ALTA
  1.0: 'high quality, sharp, clear, professional, polished, clean, crisp, detailed',
  1.5: 'professional lighting, studio quality, polished, perfect, crisp, ultra detailed',
  2.0: 'studio lighting, professional setup, polished, perfect, magazine quality',
  2.5: 'studio lighting, theatrical, cinematic, perfect, ultra polished',
  
  // Niveles ALTOS (3.0-5.0): Evitar calidad BAJA
  3.0: 'low quality, grainy, pixelated, blurry, compressed, poor lighting',
  3.5: 'low quality, grainy, pixelated, blurry, compressed',
  4.0: 'low quality, grainy, pixelated, blurry',
  4.5: 'low quality, grainy, pixelated',
  5.0: 'low quality, grainy'
};

// Siempre evitar cambios de composición
const fullNegativePrompt = `${qualityNegative}, different composition, different person, different pose, different background, different scene, changed elements, text, letters, words`;
```

**Lógica**:
- **Nivel 1.0★**: Queremos foto granulada → Evitamos "high quality, sharp, professional"
- **Nivel 5.0★**: Queremos foto perfecta → Evitamos "low quality, grainy, pixelated"

### 3. Strength 0.20 (Máxima Similitud)

```typescript
// services/falAiService.ts
strength: 0.20  // Solo 20% de cambios permitidos
```

**Escala de Strength**:
- 0.10-0.15: Cambios mínimos (upscaling)
- **0.20-0.25**: **Cambios sutiles** ✅ (óptimo para regulador)
- 0.30-0.40: Cambios moderados
- 0.50+: Cambios significativos

### 4. Imagen de Referencia SIEMPRE

```typescript
// App.tsx - handleRealityChange
const referenceImage = currentImageRef.current || imageUrl || draftImageUrl;
```

**Prioridad**:
1. `currentImageRef.current` (ref, no afectado por batching)
2. `imageUrl` (estado actual)
3. `draftImageUrl` (fallback)

## 🔧 ARQUITECTURA COMPLETA

### Flujo de Generación de Variación

```
Usuario mueve slider a 2.0★
         ↓
handleRealityChange(2.0)
         ↓
Verificar caché → No existe
         ↓
Construir parámetros:
  - technicalPrompt = '' (vacío)
  - qualityNegative = 'studio lighting, professional setup, polished...'
  - fullNegativePrompt = qualityNegative + 'different composition...'
  - referenceImage = currentImageRef.current
  - strength = 0.20
         ↓
generateFlyerImage(
  technicalPrompt,  // ''
  styleKey,
  aspectRatio,
  'draft',
  seed,  // Bloqueado
  customStylePrompt,
  !!productUrl,
  true,
  overlayText,
  textStyle,
  referenceImage,  // Imagen actual
  artDirectionId
)
         ↓
generateDraftWithZImage(
  '',  // Prompt vacío
  referenceImage,
  {
    strength: 0.20,
    guidanceScale: 7.5,
    steps: 20,
    seed: seed,
    aspectRatio: aspectRatio,
    negativePrompt: fullNegativePrompt
  }
)
         ↓
Netlify Function → fal.ai Z-Image Turbo
         ↓
Imagen generada con:
  - Misma composición (referencia + strength bajo)
  - Calidad ajustada (negative prompt)
         ↓
Guardar en caché
         ↓
Mostrar al usuario
```

## 📊 PARÁMETROS POR NIVEL

| Nivel | Label | Negative Prompt | Resultado Esperado |
|-------|-------|-----------------|-------------------|
| 1.0★ | Celular Antiguo | Evitar: high quality, sharp, professional | Foto granulada, pixelada, baja calidad |
| 1.5★ | Celular Viejo | Evitar: professional lighting, studio quality | Foto con grano, saturación baja |
| 2.0★ | Celular Básico | Evitar: studio lighting, professional setup | Foto clara pero básica |
| 2.5★ | Auténtico Local | Evitar: studio lighting, theatrical, cinematic | Foto auténtica, natural |
| 3.0★ | Semi-Pro | Evitar: low quality, grainy, pixelated, blurry | Foto limpia, enfoque nítido |
| 3.5★ | Comercial | Evitar: low quality, grainy, pixelated | Foto profesional, luz balanceada |
| 4.0★ | Editorial | Evitar: low quality, grainy | Foto editorial, calidad revista |
| 4.5★ | Premium Ad | Evitar: low quality | Foto premium, alta gama |
| 5.0★ | Cinematográfico | Evitar: low quality | Foto cinematográfica, perfección |

## ✅ VENTAJAS DE ESTA ESTRATEGIA

### 1. Máxima Fidelidad a la Referencia
- Prompt vacío = No redescripción
- Strength 0.20 = Solo 20% de cambios
- Imagen de referencia = Fuente de verdad

### 2. Control Preciso de Calidad
- Negative prompt específico por nivel
- Evita características no deseadas según el nivel
- Mantiene la dirección correcta (baja → alta o alta → baja)

### 3. Consistencia Visual
- Seed bloqueado
- Misma imagen de referencia
- Mismo artDirectionId

### 4. Performance
- Z-Image Turbo (rápido)
- 20 steps (balance velocidad/calidad)
- Caché de variaciones

## 🧪 VERIFICACIÓN

### Logs Esperados

```
🔍 DIAGNÓSTICO REALITY - Estado antes de generar variación
📸 currentImageRef.current disponible: true
📸 currentImageRef.current length: 123456
📸 referenceImage final disponible: true
📸 referenceImage final length: 123456

📝 [Reality] Prompt VACÍO - imagen de referencia es la fuente de verdad
🚫 [Reality] Negative prompt: studio lighting, professional setup, polished...
🖼️ [Reality] Strength 0.20 controlará los cambios
🎚️ [Reality] Nivel: 2.0 → Celular Básico

🚀 [Draft] Llamando a generateDraftWithZImage...
🖼️ [Draft] Imagen de referencia length: 123456
🎚️ [Draft] Strength configurado: 0.20 (máxima similitud)

📦 [Draft] Resultado de fal.ai: { success: true, hasImageUrl: true }
✅ [Draft] Imagen generada con fal.ai Z-Image Turbo
```

### Resultado Visual Esperado

**Antes (1.5★ - Celular Viejo)**:
- Mujer tomando selfie
- Pose: Sosteniendo celular
- Fondo: Interior con luz natural
- Calidad: Granulada, saturación baja

**Después (2.0★ - Celular Básico)**:
- ✅ Misma mujer
- ✅ Misma pose (sosteniendo celular)
- ✅ Mismo fondo (interior con luz natural)
- ✅ Calidad mejorada: Menos grano, mejor saturación

## 🚨 SI EL PROBLEMA PERSISTE

### Opción 1: Reducir Strength Aún Más

```typescript
strength: 0.15  // Máxima similitud posible
```

### Opción 2: Usar Flux Dev en Lugar de Z-Image Turbo

Z-Image Turbo es rápido pero menos preciso. Flux Dev es más lento pero más preciso.

```typescript
// Cambiar en App.tsx - handleRealityChange
import { generateHDWithImg2Img } from './services/falAiService';

const result = await generateHDWithImg2Img(
  '',  // Prompt vacío
  referenceImage,
  {
    strength: 0.20,
    guidanceScale: 7.5,
    steps: 30,  // Más steps para mejor calidad
    seed: seed,
    aspectRatio: aspectRatio,
    negativePrompt: fullNegativePrompt
  }
);
```

### Opción 3: Ajustar Negative Prompt

Si la calidad no cambia lo suficiente, ajustar el negative prompt:

```typescript
// Para niveles bajos, ser más agresivo evitando calidad alta
1.0: 'high quality, sharp, clear, professional, polished, clean, crisp, detailed, perfect, flawless, pristine, immaculate',

// Para niveles altos, ser más agresivo evitando calidad baja
5.0: 'low quality, grainy, pixelated, blurry, compressed, noisy, artifacts, distorted'
```

## 📝 ARCHIVOS MODIFICADOS

1. **App.tsx**
   - Línea 1916-1940: Prompt vacío + negative prompt por nivel
   - Línea 230: currentImageRef
   - Línea 1292: Actualizar ref en handleGenerate
   - Línea 2008: Actualizar ref en handleRealityChange

2. **services/falAiService.ts**
   - Línea 85: Strength 0.20
   - Línea 90: Negative prompt mejorado

3. **services/geminiService.ts**
   - Línea 2360-2380: Logs detallados
   - Línea 2370: Strength 0.20

4. **FIX-CRITICO-REGULADOR-REALIDAD.md** (documentación)
5. **ESTRATEGIA-FINAL-REGULADOR-REALIDAD.md** (este archivo)

## 🎯 RESULTADO FINAL

Con esta estrategia:

1. ✅ **Prompt vacío** → No redescribe la escena
2. ✅ **Negative prompt por nivel** → Controla la calidad
3. ✅ **Strength 0.20** → Máxima similitud
4. ✅ **Imagen de referencia siempre** → Mantiene composición
5. ✅ **currentImageRef** → No afectado por batching de React

**Resultado esperado**: Misma escena, solo cambia la calidad fotográfica según el nivel seleccionado.

---

**Fecha**: 8 de Enero, 2026  
**Commit**: `352efb1`  
**Estado**: ✅ IMPLEMENTADO Y DESPLEGADO

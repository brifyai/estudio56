# 🔍 ANÁLISIS: Código Muerto de Vertex AI

**Fecha:** 8 de Enero 2026  
**Estado:** ℹ️ INFORMATIVO

---

## 📋 RESUMEN

El usuario preguntó si hay código de Vertex AI en la app. La respuesta es:

**✅ SÍ hay referencias a Vertex AI en el código**  
**❌ PERO NO se está usando para imágenes** (solo código muerto)  
**✅ Todas las imágenes usan fal.ai** (Flux Schnell + Flux Dev)

---

## 🔍 ANÁLISIS DETALLADO

### Archivos con Referencias a Vertex AI

#### 1. `services/geminiService.ts`

**Líneas 2320-2345:** Código que asigna modelos Vertex AI
```typescript
if (quality === 'draft') {
  model = 'imagen-3.0-fast-001'; // ❌ NUNCA SE USA
  console.log('🖼️ [Image Draft] Usando imagen-3.0-fast-001');
} else {
  model = 'imagen-4.0-generate-001'; // ❌ NUNCA SE USA
  console.log('💎 [Image HD] Usando imagen-4.0-generate-001');
}
```

**Líneas 2347-2450:** Código que usa fal.ai (ESTE SÍ SE EJECUTA)
```typescript
if (quality === 'draft') {
  // ✅ ESTE CÓDIGO SÍ SE EJECUTA
  if (isFalAiConfigured() && draftImageForHD) {
    // Flux Dev Image-to-Image
    const falResult = await generateRealityVariation(...);
  } else {
    // Flux Schnell Text-to-Image
    const falResult = await generateDraftWithFluxSchnell(...);
  }
}
```

**¿Por qué el código de Vertex AI nunca se ejecuta?**

El flujo es:
1. Se asigna `model = 'imagen-3.0-fast-001'` (línea 2338)
2. **INMEDIATAMENTE DESPUÉS** se verifica `if (quality === 'draft')` (línea 2347)
3. Se ejecuta el código de fal.ai y se retorna
4. El código de Vertex AI (líneas 1585-1600) **NUNCA se alcanza**

#### 2. `services/vertexImageService.ts`

**Estado:** ❌ ARCHIVO COMPLETO ES CÓDIGO MUERTO

Este archivo contiene funciones para Vertex AI pero **nunca se importa ni se usa** en ningún lugar de la app.

#### 3. `netlify/functions/generate-image.ts`

**Estado:** ❌ FUNCIÓN COMPLETA ES CÓDIGO MUERTO

Esta Netlify Function era para Vertex AI pero **ya no se llama** desde el frontend. Todas las llamadas van a `generate-with-fal.js`.

#### 4. `src/constants/aiModels.ts`

**Estado:** ⚠️ CONSTANTES DEFINIDAS PERO NO USADAS

```typescript
DRAFT_ENGINE: 'imagen-3.0-fast-001', // ❌ NO SE USA
HD_ENGINE: 'imagen-4.0-generate-001', // ❌ NO SE USA
```

---

## 🎯 FLUJO ACTUAL (SIN VERTEX AI)

### Borradores Nuevos (sin referencia)

```
Usuario genera borrador
    ↓
generateFlyerImage(quality='draft')
    ↓
generateDraftWithFluxSchnell() ✅ FAL.AI
    ↓
Netlify Function: generate-with-fal.js
    ↓
fal.ai API: Flux Schnell
    ↓
✅ Imagen 480p
```

### Editor de Realidad (con referencia)

```
Usuario mueve slider
    ↓
generateFlyerImage(quality='draft', draftImageForHD=...)
    ↓
generateRealityVariation() ✅ FAL.AI
    ↓
Netlify Function: generate-with-fal.js
    ↓
fal.ai API: Flux Dev Image-to-Image
    ↓
✅ Variación de realidad 480p
```

### HD (con referencia)

```
Usuario genera HD
    ↓
generateFlyerImage(quality='hd', draftImageForHD=...)
    ↓
generateHDWithImg2Img() ✅ FAL.AI
    ↓
Netlify Function: generate-with-fal.js
    ↓
fal.ai API: Flux Dev Image-to-Image
    ↓
✅ Imagen HD alta resolución
```

---

## 🧹 RECOMENDACIÓN: LIMPIEZA DE CÓDIGO

### Opción 1: Eliminar Código Muerto (Recomendado)

**Ventajas:**
- ✅ Código más limpio y mantenible
- ✅ Menos confusión para futuros desarrolladores
- ✅ Reduce tamaño del bundle

**Archivos a eliminar:**
- `services/vertexImageService.ts`
- `netlify/functions/generate-image.ts`

**Código a eliminar en `services/geminiService.ts`:**
- Función `generateWithVertexAI()` (líneas 714-787)
- Referencias a modelos Vertex AI en `generateFlyerImage()` (líneas 2332-2345)
- Código de fallback a Vertex AI (líneas 1585-1600, 1790-1800)

**Constantes a eliminar en `src/constants/aiModels.ts`:**
- `DRAFT_ENGINE`
- `HD_ENGINE`
- `VERTEX_AI_CONFIG`

### Opción 2: Mantener Código Muerto (No Recomendado)

**Ventajas:**
- ✅ Fácil revertir si se necesita Vertex AI en el futuro

**Desventajas:**
- ❌ Código confuso
- ❌ Logs engañosos (`Usando imagen-3.0-fast-001` pero usa fal.ai)
- ❌ Mantenimiento más difícil

---

## 📊 IMPACTO DE ELIMINAR CÓDIGO MUERTO

### Archivos Afectados

| Archivo | Acción | Impacto |
|---------|--------|---------|
| `services/vertexImageService.ts` | ❌ Eliminar | Ninguno (no se usa) |
| `netlify/functions/generate-image.ts` | ❌ Eliminar | Ninguno (no se llama) |
| `services/geminiService.ts` | 🧹 Limpiar | Código más claro |
| `src/constants/aiModels.ts` | 🧹 Limpiar | Menos constantes |

### Líneas de Código a Eliminar

- **~500 líneas** de código muerto
- **~200 líneas** de comentarios obsoletos
- **~50 líneas** de constantes no usadas

### Beneficios

1. ✅ **Código más limpio** - Menos confusión
2. ✅ **Logs más claros** - No dice "Usando Vertex AI" cuando usa fal.ai
3. ✅ **Mantenimiento más fácil** - Menos código que mantener
4. ✅ **Bundle más pequeño** - Menos código en producción

---

## 🎯 DECISIÓN

### ¿Eliminar o Mantener?

**Recomendación:** **ELIMINAR** código muerto de Vertex AI

**Razones:**
1. Ya no se usa Vertex AI para imágenes (solo fal.ai)
2. El código confunde a desarrolladores
3. Los logs son engañosos
4. No hay planes de volver a Vertex AI

**Excepción:** Mantener código de Vertex AI para **videos** (Veo 1.0) si se usa.

---

## 📝 PRÓXIMOS PASOS (OPCIONAL)

Si decides limpiar el código muerto:

### 1. Eliminar Archivos Completos
```bash
rm services/vertexImageService.ts
rm netlify/functions/generate-image.ts
```

### 2. Limpiar `services/geminiService.ts`
- Eliminar función `generateWithVertexAI()`
- Eliminar asignación de modelos Vertex AI en `generateFlyerImage()`
- Eliminar código de fallback a Vertex AI

### 3. Limpiar `src/constants/aiModels.ts`
- Eliminar `DRAFT_ENGINE`
- Eliminar `HD_ENGINE`
- Eliminar `VERTEX_AI_CONFIG`

### 4. Actualizar Documentación
- Actualizar README.md
- Actualizar comentarios en código

### 5. Testing
- ✅ Verificar que borradores funcionan
- ✅ Verificar que editor de realidad funciona
- ✅ Verificar que HD funciona

---

## ✅ CONCLUSIÓN

**ESTADO ACTUAL:**
- ✅ Todas las imágenes usan fal.ai (Flux Schnell + Flux Dev)
- ❌ Código de Vertex AI existe pero NO se ejecuta (código muerto)
- ⚠️ Logs engañosos dicen "Usando imagen-3.0-fast-001" pero usa fal.ai

**RECOMENDACIÓN:**
- 🧹 Eliminar código muerto de Vertex AI para imágenes
- ✅ Mantener código de Vertex AI para videos (si se usa)
- 📝 Actualizar logs para reflejar uso real de fal.ai

---

**Documentado por:** Kiro AI  
**Fecha:** 8 de Enero 2026

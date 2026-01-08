# 🎚️ REFERENCIA RÁPIDA: Editor de Realidad

**Fecha:** 8 de Enero 2026  
**Estado:** ✅ FUNCIONANDO CORRECTAMENTE

---

## 🎯 PROPÓSITO DEL EDITOR DE REALIDAD

### ¿Por qué existe?

La IA a veces genera imágenes **demasiado perfectas** que no se ven realistas para negocios locales chilenos:
- ❌ Parecen hoteles 5 estrellas
- ❌ Demasiado profesionales/pulidas
- ❌ No representan la realidad de un negocio local

### Solución: Editor de Realidad

El slider de realidad permite **ajustar el nivel de perfección** de la imagen:

**Niveles bajos (1.0★ - 2.5★):**
- ✅ Fotos más realistas
- ✅ Calidad de celular/cámara básica
- ✅ Más auténtico para negocios locales
- ✅ Grano, compresión, colores naturales

**Niveles altos (3.0★ - 5.0★):**
- ✅ Fotos profesionales
- ✅ Calidad de estudio
- ✅ Perfecto para marcas premium
- ✅ Ultra nítido, colores vibrantes

**Nivel por defecto: 1.5★ (Celular Viejo)**
- Balance perfecto para negocios locales chilenos
- Se ve auténtico y cercano
- No parece hotel 5 estrellas

---

## ✅ CONFIGURACIÓN CORRECTA

### 1. API Key en Netlify (Backend)

**Ubicación:** Netlify Dashboard → Site settings → Environment variables

```
Variable: FAL_AI_API_KEY
Valor: 53f17bdf-d... (tu API key de fal.ai)
```

⚠️ **IMPORTANTE:** La API key SOLO debe estar en Netlify, NUNCA en el código frontend.

### 2. Modelos Usados

| Caso de Uso | Modelo | Función |
|-------------|--------|---------|
| **Borradores nuevos** | `fal-ai/flux/schnell` | `generateDraftWithFluxSchnell()` |
| **Editor de realidad** | `fal-ai/flux/dev/image-to-image` | `generateRealityVariation()` |
| **HD** | `fal-ai/flux/dev/image-to-image` | `generateHDWithImg2Img()` |

### 3. Compresión de Imágenes

**Parámetros:**
- Max Width: 768px
- Quality: 75% (0.75)
- Formato: JPEG

**Reducción típica:** 60-80% del tamaño original

### 4. Strength para Cambios Visibles

```typescript
// Editor de realidad
strength: 0.35  // Cambios MÁS visibles entre niveles

// HD
strength: 0.20  // Máxima similitud con borrador
```

---

## 🚨 SI EL EDITOR DE REALIDAD FALLA

### Checklist de Diagnóstico

#### 1. Verificar API Key en Netlify
```bash
# Ir a: https://app.netlify.com/sites/estudio56/settings/env
# Verificar que existe: FAL_AI_API_KEY
```

#### 2. Verificar Logs en Netlify
```bash
# Ir a: https://app.netlify.com/sites/estudio56/logs/functions
# Buscar logs de: generate-with-fal
```

**Logs esperados (éxito):**
```
✅ FAL_AI_API_KEY configurada correctamente
🗜️ [fal.ai] Comprimiendo imagen de referencia...
📊 [fal.ai] Reducción: 81%
✅ [fal.ai Function] Imagen generada exitosamente
```

**Logs esperados (error):**
```
❌ FAL_AI_API_KEY no está configurada en Netlify
```

#### 3. Verificar Console del Navegador

**NO debe aparecer:**
```javascript
❌ [fal.ai] Error: FAL_AI_API_KEY is not defined
```

**Debe aparecer:**
```javascript
🗜️ [fal.ai] Comprimiendo imagen de referencia antes de enviar...
✅ [fal.ai] Imagen comprimida exitosamente
✅ [fal.ai] Variación de realidad generada exitosamente
```

---

## 🔧 SOLUCIONES RÁPIDAS

### Error: "FAL_AI_API_KEY is not defined"

**Causa:** Variable `FAL_AI_API_KEY` referenciada en frontend

**Solución:**
1. Verificar que `services/falAiService.ts` NO tenga referencias a `FAL_AI_API_KEY`
2. Todas las llamadas deben ir vía `/.netlify/functions/generate-with-fal`
3. Ver commit: `d3f62b7` para referencia

### Error: Request nunca llega a Netlify Function

**Causa:** Payload demasiado grande (imagen sin comprimir)

**Solución:**
1. Verificar que `compressImageDataUrl()` esté implementado
2. Verificar que se llama antes de enviar request
3. Ver commit: `eead959` para referencia

### Cambios entre niveles no son visibles

**Causa:** Strength muy bajo

**Solución:**
1. Verificar que `strength: 0.35` en `generateRealityVariation()`
2. Verificar prompts técnicos extremos en `App.tsx`
3. Ver `MEJORA-CAMBIOS-REALIDAD-VISIBLES.md`

---

## 📁 ARCHIVOS CLAVE

### Frontend
```
services/falAiService.ts
├── generateDraftWithFluxSchnell()     // Borradores nuevos
├── generateRealityVariation()         // Editor de realidad
├── generateHDWithImg2Img()            // HD
└── compressImageDataUrl()             // Compresión

App.tsx
└── handleRealityChange()              // Handler del slider
```

### Backend
```
netlify/functions/generate-with-fal.js
└── handler()                          // Netlify Function
```

---

## 📊 FLUJO COMPLETO

```
Usuario mueve slider de realidad
    ↓
App.tsx: handleRealityChange(newLevel)
    ↓
geminiService.ts: generateFlyerImage(quality='draft', draftImageForHD=...)
    ↓
falAiService.ts: generateRealityVariation(prompt, imageUrl, options)
    ↓
🗜️ COMPRIMIR IMAGEN (768px, 75% quality)
    ↓
Fetch: /.netlify/functions/generate-with-fal
    ↓
Netlify Function: generate-with-fal.js
    ↓
Verificar FAL_AI_API_KEY (Environment Variable)
    ↓
Fetch: https://queue.fal.run/fal-ai/flux/dev/image-to-image
    ↓
fal.ai API: Flux Dev Image-to-Image
    ↓
Polling hasta completar (max 60 intentos, 2s cada uno)
    ↓
Retornar imageUrl al frontend
    ↓
✅ Mostrar variación de realidad
```

---

## 🎯 PARÁMETROS ÓPTIMOS

### Compresión
```typescript
maxWidth: 768,      // Suficiente para Flux Dev
quality: 0.75,      // Balance calidad/tamaño
format: 'JPEG'      // Mejor compresión que PNG
```

### Editor de Realidad
```typescript
model: 'fal-ai/flux/dev/image-to-image',
strength: 0.35,     // Cambios visibles
guidanceScale: 7.5, // Balance
steps: 28,          // Flux Dev default
aspectRatio: '9:16',
negativePrompt: '...' // Evitar características opuestas
```

### HD
```typescript
model: 'fal-ai/flux/dev/image-to-image',
strength: 0.20,     // Máxima similitud
guidanceScale: 7.5,
steps: 30,          // Más steps para calidad
aspectRatio: '9:16',
negativePrompt: '...' // Preservar composición
```

---

## 📝 DOCUMENTACIÓN RELACIONADA

### Fixes Aplicados (en orden)
1. `CORRECCION-MODELO-FAL-AI.md` - Modelo correcto
2. `MEJORA-CAMBIOS-REALIDAD-VISIBLES.md` - Strength y prompts
3. `SOLUCION-PAYLOAD-GRANDE-EDITOR-REALIDAD.md` - Compresión
4. `FIX-FAL-AI-API-KEY-UNDEFINED.md` - Eliminar referencias frontend

### Resúmenes
- `RESUMEN-FIX-EDITOR-REALIDAD-8-ENERO.md` - Resumen ejecutivo
- `RESUMEN-SESION-8-ENERO-2026.md` - Sesión completa

### Análisis
- `ANALISIS-VERTEX-AI-CODIGO-MUERTO.md` - Código legacy
- `ANALISIS-PROFUNDO-REGULADOR-REALIDAD.md` - Análisis técnico

---

## 🚀 COMMITS IMPORTANTES

```bash
# Fix modelo incorrecto
git show 26f6e9f

# Compresión de imágenes
git show eead959

# Eliminar referencias FAL_AI_API_KEY
git show d3f62b7
```

---

## ✅ VERIFICACIÓN FINAL

### Test Completo

1. **Generar borrador**
   - ✅ Debe funcionar (2-3 segundos)
   - ✅ Imagen 480p

2. **Mover slider de realidad**
   - ✅ De 1.5★ a 2.0★
   - ✅ Cambios visibles
   - ✅ Sin errores en consola
   - ✅ Logs de compresión

3. **Verificar logs en Netlify**
   - ✅ Logs aparecen
   - ✅ API key configurada
   - ✅ Imagen generada exitosamente

4. **Generar HD**
   - ✅ Debe funcionar (10-15 segundos)
   - ✅ Similar al borrador
   - ✅ Alta resolución

---

## 🎉 ESTADO ACTUAL

**✅ EDITOR DE REALIDAD FUNCIONANDO CORRECTAMENTE**

- ✅ API key segura en backend
- ✅ Compresión de imágenes implementada
- ✅ Cambios visibles entre niveles
- ✅ Sin errores en consola
- ✅ Logs claros en Netlify

---

## 📞 CONTACTO

Si el editor de realidad vuelve a fallar:

1. Revisar este documento
2. Verificar checklist de diagnóstico
3. Revisar documentación relacionada
4. Verificar commits importantes

---

**Última actualización:** 8 de Enero 2026  
**Versión:** 1.0  
**Estado:** ✅ PRODUCCIÓN

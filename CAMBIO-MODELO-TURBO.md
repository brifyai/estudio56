# ⚡ CAMBIO A MODELO TURBO PARA BORRADORES

**Fecha:** 7 de Enero, 2026  
**Cambio:** Draft model cambiado a `wan2.1-t2v-turbo`

---

## 🎯 MODELOS ACTUALIZADOS

### Draft (Borrador):
- **Modelo anterior**: `wan2.5-t2v-preview`
- **Modelo nuevo**: `wan2.1-t2v-turbo` ⚡
- **Resolución**: 480P (832×480)
- **Duración**: 5 segundos
- **Ventaja**: Ultra rápido (~30-60 segundos)

### HD (Alta Definición):
- **Modelo**: `wan2.5-t2v-preview` (sin cambios)
- **Resolución**: 720P (1280×720)
- **Duración**: 5 segundos
- **Ventaja**: Mayor calidad visual

---

## ⚡ VENTAJAS DE wan2.1-t2v-turbo

### 1. Velocidad Ultra Rápida
- **wan2.1-t2v-turbo**: ~30-60 segundos
- **wan2.5-t2v-preview**: ~2-3 minutos
- **Mejora**: 3-4x más rápido

### 2. Más Económico
- Modelo optimizado para velocidad
- Menor costo de cómputo
- Ideal para previsualizaciones

### 3. Mismo Formato
- Resolución: 480P (832×480)
- Duración: 5 segundos
- Formato: MP4

---

## 📊 COMPARACIÓN DE MODELOS

| Característica | wan2.1-t2v-turbo | wan2.5-t2v-preview |
|----------------|------------------|-------------------|
| **Uso** | Draft | HD |
| **Resolución** | 480P | 720P |
| **Velocidad** | ⚡⚡⚡⚡⚡ Ultra rápido | ⚡⚡⚡ Rápido |
| **Tiempo** | 30-60s | 2-3 min |
| **Calidad** | ⭐⭐⭐ Buena | ⭐⭐⭐⭐ Alta |
| **Costo** | $ Bajo | $$ Medio |
| **Ideal para** | Previews, pruebas | Producción, clientes |

---

## 🔧 ARCHIVOS MODIFICADOS

### 1. `netlify/functions/generate-video.ts`

```typescript
// ANTES:
const VIDEO_MODELS = {
  draft: 'wan2.5-t2v-preview',
  hd: 'wan2.5-t2v-preview'
};

// AHORA:
const VIDEO_MODELS = {
  draft: 'wan2.1-t2v-turbo',    // ⚡ Ultra rápido
  hd: 'wan2.5-t2v-preview'      // Alta calidad
};
```

### 2. `services/vertexVideoService.ts`

```typescript
// Documentación actualizada:
/**
 * Modelos TEXT-TO-VIDEO (T2V):
 * - wan2.1-t2v-turbo (480P - ultra rápido, draft)
 * - wan2.5-t2v-preview (720P - alta calidad, HD)
 */
```

---

## 🎬 CASOS DE USO

### Usar Draft (wan2.1-t2v-turbo) para:
- ✅ Previsualizaciones rápidas
- ✅ Pruebas de prompts
- ✅ Validación de concepto
- ✅ Iteración rápida de ideas
- ✅ Contenido temporal

### Usar HD (wan2.5-t2v-preview) para:
- ✅ Videos finales para clientes
- ✅ Contenido para redes sociales
- ✅ Material de marketing
- ✅ Presentaciones profesionales
- ✅ Contenido de alta calidad

---

## 📈 IMPACTO EN EXPERIENCIA DE USUARIO

### Antes (wan2.5-t2v-preview para draft):
```
Usuario genera draft → Espera 2-3 minutos → Ve resultado
```

### Ahora (wan2.1-t2v-turbo para draft):
```
Usuario genera draft → Espera 30-60 segundos → Ve resultado
```

**Mejora:** 3-4x más rápido = Mejor experiencia de usuario

---

## 💰 IMPACTO EN COSTOS

### Estimación de Costos:

**Draft (wan2.1-t2v-turbo):**
- Costo estimado: ~$0.05-0.08 por video
- Velocidad: Ultra rápida
- Uso: Alto volumen

**HD (wan2.5-t2v-preview):**
- Costo estimado: ~$0.15-0.20 por video
- Velocidad: Moderada
- Uso: Producción final

**Ahorro potencial:**
- Si 70% de videos son draft: ~30% ahorro total
- Si 50% de videos son draft: ~20% ahorro total

---

## 🧪 PRUEBAS RECOMENDADAS

### Prueba 1: Velocidad de Draft
1. Generar video draft con prompt simple
2. Medir tiempo de generación
3. Verificar que sea < 90 segundos
4. Comparar con HD (debería ser 3-4x más rápido)

### Prueba 2: Calidad de Draft
1. Generar video draft
2. Verificar calidad visual (480P)
3. Confirmar que es suficiente para preview
4. Comparar con HD para validar diferencia

### Prueba 3: Volumen
1. Generar 5 videos draft consecutivos
2. Verificar consistencia de velocidad
3. Verificar que no hay throttling
4. Monitorear costos en Alibaba Cloud Console

---

## 📋 ESPECIFICACIONES TÉCNICAS

### wan2.1-t2v-turbo

**Resoluciones soportadas:**
- 480P (832×480) ✅ Implementado

**Duración:**
- 5 segundos (fijo)

**Formato de parámetros:**
```json
{
  "model": "wan2.1-t2v-turbo",
  "input": {
    "prompt": "descripción del video"
  },
  "parameters": {
    "size": "832*480",
    "duration": 5,
    "prompt_extend": true,
    "watermark": false,
    "seed": 12345
  }
}
```

**Características:**
- ⚡ Optimizado para velocidad
- 💰 Más económico que wan2.5
- 🎯 Ideal para iteración rápida
- ✅ Misma API que otros modelos T2V

---

## ⚠️ CONSIDERACIONES

### Calidad Visual:
- **480P es suficiente para:**
  - Previsualizaciones
  - Validación de concepto
  - Pruebas de prompts
  - Contenido temporal

- **480P NO es ideal para:**
  - Presentaciones a clientes
  - Redes sociales (preferir 720P)
  - Material de marketing final
  - Impresiones o pantallas grandes

### Recomendación de Flujo:
```
1. Generar DRAFT (wan2.1-t2v-turbo) → Validar concepto
2. Si aprueba → Generar HD (wan2.5-t2v-preview) → Entregar a cliente
```

---

## 🎯 WORKFLOW RECOMENDADO

### Para Estudio 56:

**Fase 1: Exploración (Draft)**
```
1. Cliente describe lo que quiere
2. Generar 2-3 drafts con diferentes prompts
3. Cliente elige el que más le gusta
4. Tiempo total: 2-3 minutos
```

**Fase 2: Refinamiento (Draft)**
```
1. Ajustar prompt según feedback
2. Generar nuevo draft
3. Iterar hasta que cliente apruebe
4. Tiempo por iteración: 30-60 segundos
```

**Fase 3: Producción (HD)**
```
1. Generar versión HD del draft aprobado
2. Entregar a cliente
3. Tiempo: 2-3 minutos
```

**Beneficio:**
- ✅ Iteración rápida en fase de exploración
- ✅ Cliente ve resultados casi inmediatos
- ✅ Solo se genera HD cuando está aprobado
- ✅ Ahorro de tiempo y costos

---

## 📊 MÉTRICAS ESPERADAS

### Velocidad:
- **Draft (turbo)**: 30-60 segundos
- **HD (preview)**: 2-3 minutos
- **Ratio**: 3-4x más rápido

### Calidad:
- **Draft**: 480P, buena para preview
- **HD**: 720P, alta calidad para producción

### Costos:
- **Draft**: ~$0.05-0.08 por video
- **HD**: ~$0.15-0.20 por video
- **Ahorro**: ~30% si 70% son drafts

---

## 🔗 RECURSOS

- **Alibaba Cloud Console**: https://modelstudio.console.alibabacloud.com/
- **Documentación T2V**: https://www.alibabacloud.com/help/en/model-studio/text-to-video-api-reference/
- **Netlify Dashboard**: https://app.netlify.com/sites/estudio56/

---

## 📝 CHECKLIST DE DESPLIEGUE

- [x] Actualizar modelo draft en `generate-video.ts`
- [x] Actualizar documentación en `vertexVideoService.ts`
- [ ] Commit y push a Git
- [ ] Netlify redespliegue automáticamente
- [ ] Probar generación de video draft (verificar velocidad)
- [ ] Probar generación de video HD (sin cambios)
- [ ] Comparar tiempos de generación
- [ ] Validar calidad de draft (480P)
- [ ] Monitorear costos en Alibaba Cloud Console

---

**Última actualización:** 7 de Enero, 2026  
**Estado:** ✅ Código actualizado  
**Acción requerida:** Commit, push y probar velocidad

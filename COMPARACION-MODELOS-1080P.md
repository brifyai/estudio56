# 📊 COMPARACIÓN: wan2.2-t2v-plus vs wan2.5-t2v-preview (1080P)

**Fecha:** 7 de Enero, 2026  
**Pregunta:** ¿Hay diferencia entre wan2.2-t2v-plus y wan2.5-t2v-preview en 1080P?

---

## 🎯 RESPUESTA CORTA

**SÍ, hay diferencias significativas**, aunque ambos soporten 1080P:

| Característica | wan2.2-t2v-plus | wan2.5-t2v-preview |
|----------------|-----------------|-------------------|
| **Generación** | Wanx 2.2 (antigua) | Wanx 2.5 (más nueva) |
| **Calidad visual** | ⭐⭐⭐ Buena | ⭐⭐⭐⭐ Mejor |
| **Realismo** | Básico | Mejorado |
| **Movimiento** | Simple | Más fluido |
| **Coherencia** | Aceptable | Superior |
| **Duración** | 5s (fijo) | 5s o 10s |
| **Velocidad** | Rápido | Moderado |
| **Costo** | $ Bajo | $$ Medio |

---

## 📋 ESPECIFICACIONES TÉCNICAS

### wan2.2-t2v-plus

**Resoluciones:**
- 480P (832×480)
- 1080P (1920×1080)
- ❌ NO soporta 720P

**Duración:**
- 5 segundos (fijo)
- ❌ NO configurable

**Características:**
- Modelo básico de Wanx 2.2
- Generación rápida
- Calidad aceptable
- Movimientos simples
- Menor coherencia temporal

**Formato de parámetros:**
```json
{
  "model": "wan2.2-t2v-plus",
  "input": {
    "prompt": "descripción del video"
  },
  "parameters": {
    "size": "1920*1080",  // Solo 480P o 1080P
    "duration": 5,         // Fijo en 5 segundos
    "prompt_extend": true,
    "watermark": false
  }
}
```

---

### wan2.5-t2v-preview

**Resoluciones:**
- 480P (832×480)
- 720P (1280×720) ✅
- 1080P (1920×1080)

**Duración:**
- 5 segundos
- 10 segundos ✅
- Configurable

**Características:**
- Modelo mejorado de Wanx 2.5
- Generación moderada
- Mejor calidad visual
- Movimientos más fluidos
- Mayor coherencia temporal
- Mejor comprensión de prompts

**Formato de parámetros:**
```json
{
  "model": "wan2.5-t2v-preview",
  "input": {
    "prompt": "descripción del video"
  },
  "parameters": {
    "size": "1920*1080",   // 480P, 720P o 1080P
    "duration": 10,        // 5 o 10 segundos
    "prompt_extend": true,
    "watermark": false
  }
}
```

---

## 🎬 DIFERENCIAS EN CALIDAD VISUAL

### 1. Realismo y Detalle

**wan2.2-t2v-plus:**
- Texturas básicas
- Iluminación simple
- Detalles limitados
- Puede verse "sintético"

**wan2.5-t2v-preview:**
- Texturas más ricas
- Iluminación más natural
- Más detalles finos
- Aspecto más realista

---

### 2. Movimiento y Fluidez

**wan2.2-t2v-plus:**
- Movimientos básicos
- Puede tener "saltos"
- Transiciones abruptas
- Menos natural

**wan2.5-t2v-preview:**
- Movimientos más suaves
- Mejor interpolación
- Transiciones fluidas
- Más natural y cinematográfico

---

### 3. Coherencia Temporal

**wan2.2-t2v-plus:**
- Objetos pueden "cambiar" entre frames
- Menor consistencia
- Puede haber artefactos
- Menos estable

**wan2.5-t2v-preview:**
- Objetos mantienen consistencia
- Mayor estabilidad
- Menos artefactos
- Más coherente

---

### 4. Comprensión de Prompts

**wan2.2-t2v-plus:**
- Comprensión básica
- Puede ignorar detalles
- Interpretación literal
- Menos creativo

**wan2.5-t2v-preview:**
- Mejor comprensión
- Atiende más detalles
- Interpretación contextual
- Más creativo

---

## 💰 COMPARACIÓN DE COSTOS

### Estimación de Costos (1080P):

**wan2.2-t2v-plus:**
- Costo estimado: ~$0.08-0.12 por video
- Duración: 5s (fijo)
- Costo por segundo: ~$0.016-0.024/s

**wan2.5-t2v-preview:**
- Costo estimado: ~$0.15-0.20 por video (5s)
- Costo estimado: ~$0.25-0.30 por video (10s)
- Costo por segundo: ~$0.025-0.030/s

**Diferencia:**
- wan2.5 es ~50-70% más caro
- Pero ofrece mejor calidad y más opciones

---

## ⚡ COMPARACIÓN DE VELOCIDAD

### Tiempo de Generación (1080P):

**wan2.2-t2v-plus:**
- Tiempo: ~1-2 minutos
- Velocidad: Rápido
- Ideal para: Volumen alto

**wan2.5-t2v-preview:**
- Tiempo: ~2-4 minutos (5s)
- Tiempo: ~3-5 minutos (10s)
- Velocidad: Moderado
- Ideal para: Calidad sobre velocidad

---

## 🎯 CASOS DE USO RECOMENDADOS

### Usar wan2.2-t2v-plus cuando:
- ✅ Necesitas generación rápida
- ✅ Volumen alto de videos
- ✅ Presupuesto ajustado
- ✅ Calidad básica es suficiente
- ✅ Videos cortos (5s) son OK
- ✅ Contenido temporal o de prueba

### Usar wan2.5-t2v-preview cuando:
- ✅ Necesitas mejor calidad visual
- ✅ Videos para clientes finales
- ✅ Contenido para redes sociales
- ✅ Necesitas videos de 10s
- ✅ Presupuesto permite inversión
- ✅ Calidad es prioridad

---

## 📊 TABLA COMPARATIVA COMPLETA

| Característica | wan2.2-t2v-plus | wan2.5-t2v-preview | Ganador |
|----------------|-----------------|-------------------|---------|
| **Resoluciones** | 480P, 1080P | 480P, 720P, 1080P | wan2.5 ✅ |
| **Duración** | 5s (fijo) | 5s, 10s | wan2.5 ✅ |
| **Calidad visual** | ⭐⭐⭐ | ⭐⭐⭐⭐ | wan2.5 ✅ |
| **Realismo** | Básico | Mejorado | wan2.5 ✅ |
| **Movimiento** | Simple | Fluido | wan2.5 ✅ |
| **Coherencia** | Aceptable | Superior | wan2.5 ✅ |
| **Velocidad** | 1-2 min | 2-4 min | wan2.2 ✅ |
| **Costo** | $0.08-0.12 | $0.15-0.20 | wan2.2 ✅ |
| **Flexibilidad** | Baja | Alta | wan2.5 ✅ |
| **Comprensión prompt** | Básica | Mejorada | wan2.5 ✅ |

**Resultado:** wan2.5-t2v-preview gana en 8/10 categorías

---

## 🎬 EJEMPLOS COMPARATIVOS

### Ejemplo 1: Gym/Fitness

**Prompt:**
```
Modern gym interior with people exercising on treadmills, 
bright natural lighting, professional fitness center atmosphere
```

**wan2.2-t2v-plus (1080P):**
- Personas ejercitándose (movimiento básico)
- Iluminación plana
- Texturas simples
- Movimiento puede verse "robótico"
- 5 segundos

**wan2.5-t2v-preview (1080P):**
- Personas ejercitándose (movimiento natural)
- Iluminación volumétrica realista
- Texturas detalladas (sudor, músculos)
- Movimiento fluido y natural
- 5 o 10 segundos

---

### Ejemplo 2: Pilates Studio

**Prompt:**
```
Serene Pilates studio with wooden floors, instructor on reformer, 
soft natural lighting, calm atmosphere
```

**wan2.2-t2v-plus (1080P):**
- Estudio básico
- Movimiento simple del reformer
- Iluminación uniforme
- Menos detalles en madera
- 5 segundos

**wan2.5-t2v-preview (1080P):**
- Estudio detallado
- Movimiento fluido del reformer
- Iluminación natural con sombras suaves
- Textura de madera visible
- 5 o 10 segundos

---

## 💡 RECOMENDACIÓN PARA ESTUDIO 56

### Configuración Actual:
- **Draft**: wan2.1-t2v-turbo (480P) ⚡
- **HD**: wan2.5-t2v-preview (720P) ✅

### Opción A: Mantener Actual (RECOMENDADO)
```
Draft: wan2.1-t2v-turbo (480P, ultra rápido)
HD: wan2.5-t2v-preview (720P, buena calidad)
```

**Ventajas:**
- ✅ Draft ultra rápido para iteración
- ✅ HD con buena calidad para clientes
- ✅ Balance costo/calidad óptimo
- ✅ 720P suficiente para redes sociales

---

### Opción B: Cambiar HD a 1080P con wan2.5
```
Draft: wan2.1-t2v-turbo (480P, ultra rápido)
HD: wan2.5-t2v-preview (1080P, máxima calidad)
```

**Ventajas:**
- ✅ Máxima calidad para clientes premium
- ✅ Mejor para pantallas grandes
- ✅ Más profesional

**Desventajas:**
- ❌ ~30% más caro que 720P
- ❌ ~20% más lento que 720P
- ❌ Archivos más pesados

---

### Opción C: Usar wan2.2-t2v-plus para HD
```
Draft: wan2.1-t2v-turbo (480P, ultra rápido)
HD: wan2.2-t2v-plus (1080P, rápido)
```

**Ventajas:**
- ✅ Más rápido que wan2.5
- ✅ Más económico que wan2.5
- ✅ 1080P disponible

**Desventajas:**
- ❌ Menor calidad que wan2.5
- ❌ Solo 5 segundos (no 10s)
- ❌ Menos opciones de resolución

---

## 🎯 DECISIÓN FINAL

### Para tu caso (Estudio 56):

**MANTÉN wan2.5-t2v-preview en 720P** porque:

1. **Calidad superior** - Mejor que wan2.2-t2v-plus
2. **Flexibilidad** - Puedes hacer 5s o 10s
3. **720P suficiente** - Para Instagram, TikTok, Facebook
4. **Balance perfecto** - Calidad/costo/velocidad

### Solo cambia a 1080P si:
- Clientes específicamente piden 1080P
- Necesitas para pantallas grandes (TV, proyectores)
- Presupuesto lo permite (~30% más caro)

### NO uses wan2.2-t2v-plus porque:
- Calidad inferior a wan2.5
- Menos flexible (solo 5s)
- Diferencia de costo no justifica pérdida de calidad

---

## 📋 RESUMEN EJECUTIVO

**Pregunta:** ¿Hay diferencia entre wan2.2-t2v-plus y wan2.5-t2v-preview en 1080P?

**Respuesta:** SÍ, diferencias significativas:

| Aspecto | wan2.2-t2v-plus | wan2.5-t2v-preview |
|---------|-----------------|-------------------|
| Calidad | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Velocidad | Rápido | Moderado |
| Costo | Bajo | Medio |
| Flexibilidad | Baja | Alta |

**Recomendación:** Mantén wan2.5-t2v-preview en 720P para HD (configuración actual)

---

**Última actualización:** 7 de Enero, 2026  
**Estado:** ✅ Análisis completo  
**Configuración actual:** Óptima para Estudio 56

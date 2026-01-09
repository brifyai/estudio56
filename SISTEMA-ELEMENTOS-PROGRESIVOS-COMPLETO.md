# 🎨 SISTEMA DE ELEMENTOS PROGRESIVOS POR INDUSTRIA

**Fecha:** 8 de Enero 2026  
**Estado:** ✅ IMPLEMENTADO

---

## 🎯 OBJETIVO

Crear un sistema que **agregue o quite elementos decorativos/atmosféricos** según el nivel de realidad (1.0-5.0) de forma **específica para cada uno de los 60 rubros**.

### Problema Resuelto

❌ **ANTES:** Las velas, humo, fog aparecían en niveles bajos (1.5) cuando no deberían  
✅ **AHORA:** Los elementos se agregan/quitan progresivamente según el nivel Y el rubro

---

## 🎚️ FUNCIONAMIENTO

### Regla Fundamental

**La composición base se mantiene constante** (persona, pose, ángulo, equipamiento principal)  
**Solo cambian los elementos decorativos/atmosféricos**

### Niveles de Realidad

#### 1.0-2.5 (Hostal → 3★) - FUNCIONAL
- ✅ **PERMITIDO**: Equipamiento básico, iluminación overhead, paredes simples
- ❌ **PROHIBIDO**: Velas, humo, fog, steam, mármol, oro, cristal

#### 3.0-3.5 (4★ → 4★+) - PROFESIONAL
- ✅ **PERMITIDO**: Equipamiento profesional, plantas, iluminación ambiental, arte sutil
- ❌ **PROHIBIDO**: Velas, humo, fog, mármol excesivo

#### 4.0-4.5 (5★ → 5★+) - ASPIRACIONAL
- ✅ **PERMITIDO**: Velas decorativas, fog sutil, plantas tropicales, iluminación dramática
- ❌ **PROHIBIDO**: Objetos flotantes, física imposible

#### 5.0 (Resort) - LUJO
- ✅ **PERMITIDO**: Velas de lujo, fog atmosférico, mármol, oro, fuentes de agua
- ❌ **PROHIBIDO**: Física imposible, anatomía distorsionada

---

## 📊 EJEMPLOS POR RUBRO

### Ejemplo 1: Pilates / Yoga (Rubro 28)

**Nivel 1.5 (Motel):**
```
ALLOWED: reformer machines, mats, blocks, straps
FORBIDDEN: candles, fog, smoke, marble, gold
ATMOSPHERE: Functional, authentic, everyday studio
```

**Nivel 4.0 (5★):**
```
ALLOWED: reformer machines, mats, blocks, straps, soft ambient lighting, plants, natural wood, minimal decor
FORBIDDEN: floating objects, impossible physics
ATMOSPHERE: Polished, aspirational, premium studio
```

**Nivel 5.0 (Resort):**
```
ALLOWED: reformer machines, mats, blocks, straps, soft ambient lighting, plants, natural wood, minimal decor, luxury finishes
FORBIDDEN: floating objects, impossible physics, distorted anatomy
ATMOSPHERE: Luxury, aspirational, high-end studio with cinematic quality
```

### Ejemplo 2: Cafetería (Rubro 47)

**Nivel 1.5 (Motel):**
```
ALLOWED: coffee machines, cups, tables, chairs
FORBIDDEN: fog, marble floors, crystal, excessive gold
ATMOSPHERE: Functional, authentic, everyday cafe
```

**Nivel 4.0 (5★):**
```
ALLOWED: coffee machines, cups, tables, chairs, ambient lighting, plants, artwork, cozy decor, candles on tables
FORBIDDEN: floating objects, impossible physics
ATMOSPHERE: Polished, aspirational, premium cafe
```

### Ejemplo 3: Joyería (Rubro 55)

**Nivel 1.5 (Motel):**
```
ALLOWED: jewelry displays, cases, lighting, security
FORBIDDEN: fog, floating objects, excessive smoke
ATMOSPHERE: Functional, authentic, everyday jewelry store
```

**Nivel 5.0 (Resort):**
```
ALLOWED: jewelry displays, cases, lighting, security, spotlights, velvet displays, crystal cases, gold accents, elegant candles
FORBIDDEN: floating objects, impossible physics, distorted anatomy
ATMOSPHERE: Luxury, aspirational, high-end jewelry boutique with cinematic quality
```

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### Archivos Creados/Modificados

1. **`services/progressiveElementsByIndustry.ts`** (NUEVO)
   - Configuración de elementos para los 60 rubros
   - Función `getProgressiveElementsForIndustry(stars, industryId)`
   - Función `getForbiddenElementsForIndustry(stars, industryId)`

2. **`services/realitySliderService.ts`** (MODIFICADO)
   - `buildPowerPromptWithReality()` ahora acepta `industryId`
   - Integra elementos progresivos específicos por industria

3. **`services/geminiService.ts`** (MODIFICADO)
   - Pasa `artDirectionId` a `buildPowerPromptWithReality()`
   - Log de industria ID para debugging

### Flujo de Datos

```
Usuario genera imagen
    ↓
App.tsx: realityLevel=1.5, artDirectionId=28 (Pilates)
    ↓
geminiService.ts: generateFlyerImage(realityLevel=1.5, artDirectionId=28)
    ↓
realitySliderService.ts: buildPowerPromptWithReality(prompt, 1.5, 28)
    ↓
progressiveElementsByIndustry.ts: getProgressiveElementsForIndustry(1.5, 28)
    ↓
Retorna: "ALLOWED: mats, blocks... FORBIDDEN: candles, fog..."
    ↓
Prompt final enviado a fal.ai con elementos específicos
```

---

## 📋 CONFIGURACIÓN POR CATEGORÍA

### Wellness & Fitness (21, 24, 28, 43)
- **Básico**: Equipamiento deportivo, mats, pesas
- **Prohibido (bajo)**: Velas, fog, mármol, oro
- **Permitido (alto)**: Iluminación ambiental, plantas, madera natural

### Gastronomía (5, 22, 46, 47, 48, 49, 50)
- **Básico**: Platos, mesas, equipamiento de cocina
- **Prohibido (bajo)**: Velas excesivas, fog, mármol
- **Permitido (alto)**: Velas ambientales, flores frescas, iluminación suave

### Belleza & Cuidado Personal (41, 42, 56, 57)
- **Básico**: Sillas, espejos, herramientas profesionales
- **Prohibido (bajo)**: Fog, velas excesivas, mármol
- **Permitido (alto)**: Iluminación ambiental, espejos decorativos, velas sutiles

### Retail & Comercio (1-20, 53-60)
- **Básico**: Displays, estanterías, productos
- **Prohibido (bajo)**: Velas, fog, mármol, oro, cristal
- **Permitido (alto)**: Iluminación ambiental, plantas, arte, displays premium

---

## ✅ BENEFICIOS

### 1. Precisión por Industria
Cada rubro tiene elementos específicos apropiados para su contexto

### 2. Progresión Natural
Los elementos se agregan gradualmente, no de golpe

### 3. Coherencia Visual
Los elementos permitidos son coherentes con la industria

### 4. Control Total
El usuario puede subir/bajar el nivel y ver cambios predecibles

### 5. Mantiene Composición
La pose, ángulo y sujeto principal se mantienen constantes

---

## 🎯 CASOS DE USO

### Caso 1: Estudio de Pilates Local

**Usuario genera borrador (1.5):**
- Reformer, mat, persona haciendo ejercicio
- Iluminación overhead LED
- Paredes simples, sin decoración
- ❌ SIN velas, fog, elementos de spa

**Usuario sube a 4.0:**
- Misma composición (persona, reformer, pose)
- ✅ SE AGREGAN: Iluminación ambiental suave, plantas, madera natural
- Ambiente más pulido pero realista

**Usuario sube a 5.0:**
- Misma composición
- ✅ SE AGREGAN: Acabados de lujo, iluminación cinematográfica
- Ambiente aspiracional tipo resort

### Caso 2: Cafetería de Barrio

**Usuario genera borrador (1.5):**
- Máquina de café, tazas, mesas básicas
- Iluminación natural/overhead
- ❌ SIN velas, fog, mármol

**Usuario sube a 4.0:**
- Misma composición
- ✅ SE AGREGAN: Plantas, arte en paredes, velas en mesas
- Ambiente acogedor tipo café boutique

---

## 🔍 DEBUGGING

### Logs Importantes

```javascript
🎚️ [generateFlyerImage] Aplicando nivel de realidad: 1.5
🎨 [generateFlyerImage] Rubro/Industria ID: 28
🎚️ [generateFlyerImage] Prompt con realidad: [MODE: MOTEL PHOTO]...
```

### Verificar Elementos

1. Revisar `progressiveElementsByIndustry.ts` línea del rubro específico
2. Verificar que `artDirectionId` se pase correctamente
3. Comprobar logs de elementos permitidos/prohibidos

---

## 📝 MANTENIMIENTO

### Agregar Nuevo Rubro

1. Editar `services/progressiveElementsByIndustry.ts`
2. Agregar configuración en `INDUSTRY_PROGRESSIVE_ELEMENTS[ID]`
3. Definir `basicElements`, `luxuryForbidden`, `luxuryAllowed`

### Ajustar Elementos Existentes

1. Localizar rubro en `progressiveElementsByIndustry.ts`
2. Modificar arrays según necesidad
3. Probar con diferentes niveles de realidad

---

## ✅ ESTADO FINAL

**✅ SISTEMA COMPLETO IMPLEMENTADO**

- ✅ 60 rubros configurados con elementos específicos
- ✅ Progresión suave de 1.0 a 5.0
- ✅ Elementos prohibidos en niveles bajos
- ✅ Elementos de lujo en niveles altos
- ✅ Composición base se mantiene constante
- ✅ Integrado con sistema de realidad existente

---

**Última actualización:** 8 de Enero 2026  
**Versión:** 1.0  
**Estado:** ✅ PRODUCCIÓN

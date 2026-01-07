# 🛡️ SOLUCIÓN: ERROR "INAPPROPRIATE CONTENT" EN ALIBABA CLOUD

**Fecha:** 7 de Enero, 2026  
**Error:** "Output data may contain inappropriate content"

---

## 🔍 DIAGNÓSTICO

### Logs de Netlify:
```
✅ Tarea creada exitosamente
✅ Task ID: 76964558-8e23-4bc7-80de-80d8260cadcd
✅ Status inicial: PENDING
❌ Error durante polling: "inappropriate content"
```

### Causa del Error:
Alibaba Cloud tiene **filtros de seguridad** muy estrictos que analizan el contenido del prompt. Cuando detecta términos o conceptos que considera "sensibles", rechaza la generación del video con status `FAILED`.

---

## 🎯 PROMPT QUE CAUSÓ EL ERROR

```
Subject: A majestic and ethereal wellness studio in Chile named 'VivePilates', 
designed like a grand temple of movement with high ceilings and large arched windows. 
A person is performing a graceful, mindful movement on a sleek white Pilates Reformer 
in the center of the hall. 

Style: Majestic & Ethereal Photography. 
Lighting: Dramatic 'God Rays' (volumetric light beams) descending from the sky through 
the windows, illuminating the scene. 
Palette: Gold, White, and Sky Blue. 
Atmosphere: Peaceful, divine, grand scale, with minimal dust particles dancing in the light. 
Vibe: Hope, faith, solemnity, and integral health.
```

### Posibles Términos Problemáticos:
- ❌ **"temple"** - Puede ser interpretado como religioso
- ❌ **"God Rays"** - Referencia religiosa explícita
- ❌ **"divine"** - Término religioso
- ❌ **"faith"** - Término religioso
- ❌ **"solemnity"** - Contexto religioso

---

## ✅ SOLUCIONES

### Solución 1: Simplificar el Prompt (RECOMENDADO)

**Prompt Original:**
```
A majestic and ethereal wellness studio in Chile named 'VivePilates', 
designed like a grand temple of movement with high ceilings and large 
arched windows. A person is performing a graceful, mindful movement on 
a sleek white Pilates Reformer in the center of the hall. Style: Majestic 
& Ethereal Photography. Lighting: Dramatic 'God Rays' (volumetric light 
beams) descending from the sky through the windows, illuminating the scene. 
Palette: Gold, White, and Sky Blue. Atmosphere: Peaceful, divine, grand 
scale, with minimal dust particles dancing in the light. Vibe: Hope, faith, 
solemnity, and integral health.
```

**Prompt Simplificado (SIN términos religiosos):**
```
A bright and spacious wellness studio in Chile named 'VivePilates', 
with high ceilings and large arched windows. A person is performing 
a graceful movement on a white Pilates Reformer in the center of the 
hall. Style: Professional wellness photography. Lighting: Natural 
sunlight beams coming through the windows, creating a peaceful atmosphere. 
Palette: Gold, White, and Sky Blue. Atmosphere: Calm, serene, and healthy. 
Vibe: Hope, wellness, and vitality.
```

**Cambios realizados:**
- ❌ "temple" → ✅ "studio"
- ❌ "God Rays" → ✅ "sunlight beams"
- ❌ "divine" → ✅ "peaceful"
- ❌ "faith" → ✅ "wellness"
- ❌ "solemnity" → ✅ "vitality"

---

### Solución 2: Usar Términos Técnicos en Lugar de Descriptivos

**Evitar:**
- ❌ Términos religiosos (temple, divine, faith, God, sacred, holy)
- ❌ Términos políticos (revolution, protest, freedom, democracy)
- ❌ Términos violentos (fight, battle, war, blood, death)
- ❌ Términos sexuales (sexy, sensual, erotic, intimate)
- ❌ Términos de drogas (high, trip, euphoria, intoxicated)

**Usar:**
- ✅ Términos técnicos (studio, hall, space, room, facility)
- ✅ Términos profesionales (professional, commercial, business)
- ✅ Términos descriptivos neutros (bright, spacious, modern, clean)
- ✅ Términos de iluminación técnicos (natural light, soft light, ambient light)

---

### Solución 3: Estructura de Prompt Segura

**Template recomendado:**
```
[TIPO DE ESPACIO]: [DESCRIPCIÓN FÍSICA]
[ACTIVIDAD]: [DESCRIPCIÓN DE ACCIÓN]
[ESTILO]: [ESTILO FOTOGRÁFICO]
[ILUMINACIÓN]: [TIPO DE LUZ TÉCNICA]
[COLORES]: [PALETA DE COLORES]
[ATMÓSFERA]: [ADJETIVOS NEUTROS]
```

**Ejemplo aplicado:**
```
WELLNESS STUDIO: A bright and spacious Pilates studio with high ceilings 
and large windows.

ACTIVITY: A person performing a controlled movement on a white Pilates 
Reformer machine.

STYLE: Professional wellness photography, clean and modern aesthetic.

LIGHTING: Natural daylight streaming through windows, creating soft shadows 
and highlights.

COLORS: White, gold accents, and light blue tones.

ATMOSPHERE: Calm, peaceful, and energizing environment focused on health 
and movement.
```

---

## 🔧 CAMBIOS IMPLEMENTADOS EN EL CÓDIGO

### 1. Mejor Manejo de Errores en `check-video-operation.ts`

```typescript
// Detectar error de contenido inapropiado
let errorMessage = output.message || 'Error desconocido';
if (output.code === 'DataInspectionFailed' || 
    errorMessage.includes('inappropriate content') ||
    errorMessage.includes('inappropriate') ||
    errorMessage.includes('content safety')) {
  errorMessage = 'El contenido fue rechazado por filtros de seguridad de Alibaba Cloud. Intenta con una descripción más simple y profesional, evitando términos que puedan ser ambiguos.';
}
```

### 2. Sanitización de Prompts en `generate-video.ts`

```typescript
// Sanitizar prompt: remover caracteres especiales problemáticos
cleanPrompt = cleanPrompt
  .replace(/[^\w\s.,!?-]/g, ' ') // Remover caracteres especiales
  .replace(/\s+/g, ' ') // Normalizar espacios
  .trim();
```

---

## 📋 CHECKLIST PARA EVITAR ERRORES

Antes de generar un video, verifica que tu prompt:

- [ ] **NO contiene términos religiosos** (temple, God, divine, faith, sacred)
- [ ] **NO contiene términos políticos** (revolution, protest, freedom)
- [ ] **NO contiene términos violentos** (fight, battle, war, blood)
- [ ] **NO contiene términos sexuales** (sexy, sensual, erotic)
- [ ] **NO contiene términos de drogas** (high, trip, euphoria)
- [ ] **USA términos técnicos y profesionales**
- [ ] **USA descripciones físicas objetivas**
- [ ] **USA términos de iluminación técnicos**
- [ ] **ES claro y directo** (sin metáforas complejas)
- [ ] **ES profesional y comercial** (enfoque de negocio)

---

## 🎬 EJEMPLOS DE PROMPTS SEGUROS

### Ejemplo 1: Gym/Fitness
```
MODERN FITNESS CENTER: A spacious gym with large windows and modern equipment. 
People are exercising on treadmills and lifting weights. Professional fitness 
photography style. Natural daylight mixed with warm interior lighting. Colors: 
Black, white, and orange accents. Atmosphere: Energetic, motivating, and clean.
```

### Ejemplo 2: Pilates Studio (CORREGIDO)
```
PILATES WELLNESS STUDIO: A bright studio space with wooden floors and mirrors. 
An instructor is guiding a client on a white Pilates Reformer machine. Professional 
wellness photography. Soft natural light from large windows. Colors: White, beige, 
and light wood tones. Atmosphere: Calm, focused, and professional.
```

### Ejemplo 3: Restaurante
```
MODERN RESTAURANT: An elegant dining space with customers enjoying meals. 
Open kitchen visible in the background with chefs preparing food. Professional 
food photography style. Warm ambient lighting with pendant lamps. Colors: Warm 
browns, gold accents, and white. Atmosphere: Welcoming, sophisticated, and lively.
```

### Ejemplo 4: Café
```
CONTEMPORARY COFFEE SHOP: A cozy café with wooden tables and comfortable seating. 
Barista preparing coffee at the counter. Professional lifestyle photography. 
Natural daylight from large windows mixed with warm interior lights. Colors: 
Brown, cream, and green plants. Atmosphere: Relaxed, friendly, and inviting.
```

---

## 🚨 TÉRMINOS A EVITAR COMPLETAMENTE

### Categoría: Religión
- ❌ temple, church, mosque, synagogue
- ❌ God, divine, sacred, holy, blessed
- ❌ faith, prayer, worship, spiritual
- ❌ heaven, hell, angel, demon
- ❌ soul, salvation, redemption

### Categoría: Política
- ❌ revolution, protest, riot, uprising
- ❌ freedom, democracy, dictatorship
- ❌ war, conflict, battle, fight
- ❌ propaganda, censorship, oppression

### Categoría: Violencia
- ❌ blood, gore, death, kill
- ❌ weapon, gun, knife, sword
- ❌ attack, assault, violence
- ❌ injury, wound, pain, suffering

### Categoría: Sexual
- ❌ sexy, sensual, erotic, seductive
- ❌ intimate, passionate, romantic (en exceso)
- ❌ nude, naked, bare
- ❌ provocative, suggestive

### Categoría: Drogas/Alcohol
- ❌ drunk, intoxicated, high, stoned
- ❌ drug, narcotic, substance
- ❌ trip, euphoria, hallucination
- ❌ addiction, overdose

---

## 🎯 RECOMENDACIONES FINALES

### Para Estudio 56:

1. **Usa prompts simples y directos**
   - Describe lo que ves, no lo que sientes
   - Usa términos técnicos de fotografía/video
   - Evita metáforas y simbolismos

2. **Enfócate en lo comercial**
   - "Professional photography"
   - "Commercial video style"
   - "Business environment"

3. **Describe físicamente, no emocionalmente**
   - ✅ "Bright studio with large windows"
   - ❌ "Divine space filled with hope"

4. **Usa términos de iluminación técnicos**
   - ✅ "Natural daylight", "Soft ambient light"
   - ❌ "God rays", "Heavenly light"

5. **Mantén el prompt bajo 300 palabras**
   - Más corto = menos probabilidad de términos problemáticos
   - Más directo = mejor comprensión del modelo

---

## 🔄 PRÓXIMOS PASOS

1. **Redesplegar código actualizado** con mejor manejo de errores
2. **Probar con prompt simplificado** (sin términos religiosos)
3. **Crear biblioteca de prompts seguros** para diferentes industrias
4. **Documentar términos problemáticos** según feedback de usuarios

---

## 📚 RECURSOS

- **Alibaba Cloud Content Policy**: https://www.alibabacloud.com/help/en/model-studio/content-safety-policy
- **Netlify Logs**: https://app.netlify.com/sites/estudio56/logs
- **Documentación T2V**: https://www.alibabacloud.com/help/en/model-studio/text-to-video-api-reference/

---

**Última actualización:** 7 de Enero, 2026  
**Estado:** ✅ Código actualizado con mejor manejo de errores  
**Acción requerida:** Redesplegar y probar con prompts simplificados

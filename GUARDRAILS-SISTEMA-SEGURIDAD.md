# 🛡️ Matriz Maestra de Seguridad (Guardrails) - Estudio 56

## Descripción General

Este documento define los **Guardrails de Seguridad** definitivos para la aplicación Estudio 56. El sistema transforma la IA de "adivinar" a "obedecer reglas de industria", garantizando que cada estilo genere imágenes y videos semánticamente correctos.

---

## 📋 PARTE 1: Guardrails de Imagen (Negative Prompts)

### Estilos 1-15: Diseño & Tech
| Estilo | Negative Prompt |
|--------|-----------------|
| brand_identity | blur, low resolution, messy, organic chaos, vintage filters, watermark, text overlay, logo visible |
| retail_sale | messy store, empty shelves, broken products, dark lighting, sad faces, outdated products, dust, cobwebs |
| summer_beach | rain, storm, dark clouds, cold weather, winter scene, snow, indoor pool, dirty water, seaweed, trash |
| worship_sky | dark clouds, thunderstorm, evil imagery, scary faces, hell fire, demons, blood, violence, sad ceremony |
| corporate | casual friday, jeans, sneakers, coffee cup in hand, messy desk, unfinished presentation, error screens |
| urban_night | daylight, bright sun, family friendly, quiet street, empty parking lot, closed businesses, peaceful scene |
| gastronomy | burnt food, raw meat, dirty plates, empty restaurant, sad presentation, mold, expired food, insects |
| sport_gritty | towels, candles, zen stones, massage tables, spa robes, oils, meditation, peaceful yoga, relaxation |
| luxury_gold | cheap plastic, tarnished gold, broken champagne, empty venue, poor lighting, tacky decorations, fake items |
| aesthetic_min | cluttered desk, bright colors, loud patterns, mess, chaos, multiple fonts, busy background, noise |
| retro_vintage | modern technology, smartphones, laptops, contemporary clothing, modern cars, digital screens |
| gamer_stream | realistic office, nature documentary, calm meditation, educational content, sports broadcast |
| eco_organic | plastic packaging, industrial factory, pollution, trash, dead plants, synthetic materials, chemicals |
| indie_grunge | clean polished studio, corporate meeting, business suits, pristine condition, organized neatness |
| political_community | controversial symbols, protest signs, angry crowd, violence, negative campaign, mudslinging |

### Estilos 16-25: Salud & Lifestyle
| Estilo | Negative Prompt |
|--------|-----------------|
| kids_fun | adult content, scary imagery, dark colors, violence, inappropriate themes, realistic war toys, weapons |
| art_double_exp | sharp focus, clear image, simple composition, modern design, digital clean, minimal art |
| medical_clean | blood, surgery, needles, dental tools, hospital bed, sick patient, dark shadows, emergency room |
| tech_saas | pen and paper, manual process, outdated computer, broken keyboard, analog device, rotary phone |
| typo_bold | complex image, detailed illustration, photo-realistic, busy background, multiple elements, clutter |
| realestate_night | daylight, construction debris, unfinished walls, messy interiors, low ceilings, abandoned building |
| auto_metallic | dirty cars, workshops, tools, grease, pedestrian streets, bicycles, motorcycles, traffic jam |
| edu_sketch | party, gaming, toys, alcohol, unprofessional behavior, dark clubs, nightclub, bar scene |
| wellness_zen | gym weights, heavy machines, sweat, dark moody lighting, surgery, medical equipment, clinical |
| pilates | weightlifting, CrossFit, heavy deadlifts, combat sports, extreme sports, high intensity interval |
| podcast_mic | silent studio, empty chair, turned off lights, broken equipment, analog tape, outdated technology |
| seasonal_holiday | summer beach, spring flowers, autumn leaves, regular birthday, non-holiday celebration |
| market_handwritten | digital signage, neon signs, LED screens, modern supermarket, corporate chain store, polished |

### Estilos 26-40: Nuevos Rubros (2026)
| Estilo | Negative Prompt |
|--------|-----------------|
| mechanic_workshop | business suits, luxury showroom, polished glass floors, ties, executives, office meeting, clean carpet |
| tire_service | car wash, waxing, luxury lounge, interior detailing, soft furniture, waiting area, coffee bar, comfortable seating |
| construction_site | finished luxury decor, curtains, indoor furniture, tidy gardens, completed building, move-in ready, polished interior |
| logistics_delivery | shopping mall, retail customers, shopping carts, open products, display shelves, checkout counter, cashier |
| bakery_bread | sushi, raw meat, wine bottles, dinner tables, soup, formal dining, restaurant setting, silver cutlery |
| liquor_store | restaurant tables, cooked food, coffee machines, gym equipment, fresh produce, organic section, bakery items |
| fast_food_street | fine dining, silver cutlery, white tablecloths, expensive wine, formal waiters, tasting menu, gourmet plating |
| barber_shop | massage candles, aromatherapy, spa robes, surgery tools, water, wet shave, facial treatment, beauty salon |
| veterinary_clinic | human patients, wild animals, taxidermy, dark lighting, kitchen, slaughterhouse, meat products, blood |
| hvac_plumbing | interior design, computers, clean hands, office suits, soft fabrics, luxury furniture, executive desk, polished floor |
| dental_clinic | hospital beds, surgical rooms, blood, dark shadows, massage oils, spa music, candles, relaxation chair |
| physiotherapy | heavy gym weights, bodybuilders, powerlifting, spa candles, massage oils, aromatherapy, zen music, meditation |
| law_accounting | casual clothing, workshop, outdoor nature, loud neon colors, party scene, casual Friday, jeans and t-shirt |
| gardening_landscaping | indoor office, computers, desert, dry dead plants, industrial, construction zone, concrete jungle, pollution |
| security_systems | police officers, guns, dark alleys, messy wiring, chaos, armed guards, violence, emergency vehicles, sirens |

---

## 🎬 PARTE 2: Guardrails de Movimiento (Video)

### Reglas de Física y Composición para Video

| Estilo | Prohibido | Forzado |
|--------|-----------|---------|
| video_sport_gritty | towels, candles, zen stones, massage tables, spa robes, oils, meditation, peaceful yoga | intense effort, sweat droplets, muscle tension, heavy breathing, dynamic movement, power |
| video_mechanic_action | dreamy lighting, slow-mo fashion, elegant poses, studio lighting, clean hands, business attire | industrial grit, sharp focus, sparks flying, hands working, mechanical precision, workshop atmosphere |
| video_baking_rise | fast chaotic cuts, burnt food, raw dough, dark oven, cold kitchen, industrial factory | steady macro, slow growth, warm glow, golden crust forming, appetizing time-lapse, traditional bakery |
| video_barber_precision | wide landscape shots, spa atmosphere, massage candles, aromatherapy, relaxation focus, beauty salon | macro close-ups, sharp transitions, clippers cutting hair, precise movements, professional grooming |
| video_rehab_movement | high speed action, aggressive blur, extreme sports, heavy gym weights, bodybuilders, powerlifting | stable tripod, clear form, elastic band exercise, guided movement, slow controlled action, health focus |
| video_surveillance_scan | handheld shaky cam, action movie shake, dramatic camera movement, dynamic cinematography | mechanical smooth pan, CCTV jitter effect, digital HUD overlay, night vision transition, security focus |

---

## 🔧 Integración Técnica

### Flujo de Generación de Imagen

```typescript
// En geminiService.ts - generateFlyerImage()

// 1. Obtener el guardrail de seguridad para el estilo
const industryGuardrail = IMAGE_GUARDRAILS[styleKey] || "";

// 2. Construir negative prompt final
const baseNegativePrompt = "blur, low resolution, messy, watermark, text overlay, logo visible, deformed, disfigured, ugly, incomplete, extra fingers, poorly drawn hands";
const finalNegativePrompt = `${baseNegativePrompt}, ${industryGuardrail}`;

// 3. Incluir en el prompt para la API
const promptWithGuardrails = `${unifiedPrompt} AVOID: ${finalNegativePrompt}`;
```

### Flujo de Generación de Video

```typescript
// En geminiService.ts - generateFlyerVideoVEO()

// 1. Obtener guardrails de movimiento
const motionGuardrailKey = styleKey.startsWith('video_') ? styleKey : `video_${styleKey}`;
const motionGuardrail = VIDEO_MOTION_GUARDRAILS[motionGuardrailKey];

// 2. Aplicar al prompt de video
if (motionGuardrail) {
  const motionGuardrailText = ` MOTION GUARDRAIL - PROHIBITED: ${motionGuardrail.prohibited}. FORCED: ${motionGuardrail.forced}.`;
  finalPrompt += motionGuardrailText;
}
```

---

## ✅ Beneficios del Sistema

1. **Precisión Semántica**: Un taller mecánico siempre se verá como un taller, nunca como una oficina corporativa.

2. **Consistencia de Industria**: Los centros de pilates nunca tendrán velas de spa.

3. **Eliminación de Errores Comunes**: 
   - No más restaurantes con comida quemada
   - No más gimnasios con ambiente zen
   - No más barberías con estética de spa

4. **Control de Movimiento**: Videos con física correcta y composición profesional.

---

## 📁 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `constants.ts` | Agregados `IMAGE_GUARDRAILS` y `VIDEO_MOTION_GUARDRAILS` |
| `services/geminiService.ts` | Integración de guardrails en generación de imágenes y videos |

---

## 🎯 Ejemplos de Aplicación

### Ejemplo 1: Taller Mecánico
- **Prompt positivo**: "Professional automotive workshop with car on lift"
- **Negative prompt**: "business suits, luxury showroom, polished glass floors, ties, executives"
- **Resultado**: Taller mecánico realista, no oficina corporativa

### Ejemplo 2: Barbería
- **Prompt positivo**: "Modern barber shop with leather chair and mirrors"
- **Negative prompt**: "massage candles, aromatherapy, spa robes, surgery tools, water"
- **Resultado**: Barbería profesional, no spa de relajación

### Ejemplo 3: Video de Gimnasio
- **Prohibido**: "slow ethereal pans, soft focus"
- **Forzado**: "dynamic cuts, high energy, sweat droplets, muscle tension"
- **Resultado**: Video de gimnasio enérgico, no sesión de yoga

---

## 🔍 Monitoreo y Debug

Los guardrails se registran en la consola durante la generación:

```
🛡️ [Guardrails] Negative prompt aplicado: blur, low resolution, messy, watermark, text overlay, logo visible, deformed, disfigured, ugly, incomplete, extra fingers, poorly drawn hands, business suits, luxury showroom, polished glass floors, ties, executives, office meeting, clean carpet

🛡️ [Video Guardrails] Aplicando para: video_mechanic_action
```

---

**Fecha de implementación**: 2026-01-03
**Versión**: 1.0
**Autor**: Sistema Estudio 56
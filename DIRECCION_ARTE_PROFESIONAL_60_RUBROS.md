# 🎨 Sistema de Dirección de Arte Profesional - Estudio 56

## Directorio Completo: Rubros 1-60

Este documento describe el sistema de **Dirección de Arte Profesional** que transforma el editor de código de una herramienta genérica a una plataforma de nivel agencia. Cada rubro "contrata virtualmente" a un fotógrafo y diseñador editorial profesional.

---

## 📐 Estructura del Prompt

Cada rubro sigue esta estructura infalible:

```
[ASSET PROCESADO] + [DIRECCIÓN DE ARTE ESPECÍFICA] + [COMPOSICIÓN SOCIAL MEDIA 9:16] + [GUARDRAIL NEGATIVO]
```

### Negative Prompt Agency (Hardcoded)
```typescript
const AGENCY_NEGATIVE_PROMPT = "(low quality, blurry text, amateur layout, stretched image, 
cheap flyer, cluttered design, distorted products, messy fingers, clip art style, 
watermark visible, low resolution, poor composition, uneven lighting, color banding, 
pixelated, dithered, oversaturated, undersaturated, harsh shadows, blown highlights)";
```

---

## 📋 FASE 1: Rubros 1-20 (Retail y Productos)

### 1. Retail General
- **Prompt:** Clean commercial photography, studio lighting, bold high-contrast typography, center-focused composition for 9:16.
- **Negative:** low quality, blurry text, amateur layout, stretched image, cheap flyer, cluttered design.
- **Estilo:** commercial-retail

### 2. Moda Mujer
- **Prompt:** Fashion editorial look, soft daylight, minimalist serif fonts, elegant pose, moodboard aesthetic.
- **Negative:** amateur photography, bad lighting, wrinkled clothes, awkward pose, low-res.
- **Estilo:** fashion-editorial

### 3. Moda Hombre
- **Prompt:** Urban streetwear vibe, harsh shadows, gritty texture, bold sans-serif block fonts, moody blue/grey tones.
- **Negative:** soft lighting, generic pose, outdated fashion, low contrast, washed out colors.
- **Estilo:** streetwear-urban

### 4. Calzado
- **Prompt:** Dynamic low-angle shot, focus on sole texture, motion blur background, floating price stickers style.
- **Negative:** static product shot, flat lay only, poor focus on sole, amateur lighting.
- **Estilo:** product-dynamic

### 5. Joyas
- **Prompt:** Extreme macro photography, bokeh highlights, dramatic rim lighting on metallic edges, luxury velvet textures.
- **Negative:** flat lighting, no sparkle, dull metal, blurry gemstone, amateur product shot.
- **Estilo:** luxury-jewelry

### 6. Óptica
- **Prompt:** Sharp focus on lenses, studio reflection, symmetrical composition, clean medical-modern aesthetic.
- **Negative:** crooked frames, dirty lenses, harsh reflections, cheap plastic look.
- **Estilo:** medical-clean

### 7. Belleza/Cosmética
- **Prompt:** Dewy skin textures, soft-focus pastel backgrounds, organic shapes, minimalist cosmetic layout.
- **Negative:** oily skin, cakey makeup, harsh backgrounds, cluttered product placement.
- **Estilo:** beauty-soft

### 8. Perfumería
- **Prompt:** Ethereal lighting, glass transparency effects, floating liquid particles, high-end fragrance ad style.
- **Negative:** flat bottle, no atmosphere, harsh lighting, cheap packaging look.
- **Estilo:** luxury-fragrance

### 9. Bolsos/Carteras
- **Prompt:** Flat-lay editorial, focus on leather grain and hardware, rich saturated colors, sophisticated shadows.
- **Negative:** flat lighting, no texture visible, cheap PU leather look, inconsistent colors.
- **Estilo:** luxury-bags

### 10. Accesorios Tech
- **Prompt:** Cyber-clean aesthetic, matte black surfaces, subtle RGB glow, futuristic UI element overlays.
- **Negative:** cluttered cables, fingerprints on surfaces, harsh RGB, amateur tech photography.
- **Estilo:** tech-cyber

### 11. Smartphones
- **Prompt:** Glossy screen reflections, floating gadget in dark space, neon circuit lines, ultra-modern tech vibe.
- **Negative:** cracked screen, visible fingerprints, cheap case, amateur product shot.
- **Estilo:** tech-premium

### 12. Computación
- **Prompt:** Deep shadows, glowing keyboard accents, top-down professional setup view, productivity-focused lighting.
- **Negative:** messy cables, screen glare, uneven lighting, amateur setup photo.
- **Estilo:** tech-setup

### 13. Gaming
- **Prompt:** High-energy RGB saturation, glitch art effects, dark industrial background, aggressive gaming typography.
- **Negative:** flat colors, no RGB, amateur gaming setup, inconsistent lighting.
- **Estilo:** gaming-esports

### 14. Fotografía
- **Prompt:** Vintage camera aesthetic, warm lens flare, focus on glass optics, artistic black and white with grain.
- **Negative:** digital smooth, no grain, cold tones, amateur camera shot.
- **Estilo:** vintage-camera

### 15. Audio/Sonido
- **Prompt:** Visual sound waves, matte textures, moody nightclub lighting, focus on grill and mesh details.
- **Negative:** shiny plastic, damaged grill, harsh club lighting, amateur audio shot.
- **Estilo:** audio-pro

### 16. Relojes
- **Prompt:** Watchmaker precision shot, focus on moving gears, executive mahogany background, timeless luxury lighting.
- **Negative:** plastic movement, blurry hands, cheap strap, amateur watch photography.
- **Estilo:** luxury-watch

### 17. Decoración
- **Prompt:** Interior design magazine style, perfect symmetry, soft shadows, warm home atmosphere, airy composition.
- **Negative:** cluttered room, harsh shadows, cold atmosphere, amateur interior shot.
- **Estilo:** interior-design

### 18. Muebles
- **Prompt:** Studio furniture catalog look, focus on wood grain and fabric, soft bounce lighting, spacious minimalist room.
- **Negative:** flat lighting, no texture visible, cheap materials, amateur furniture shot.
- **Estilo:** furniture-catalog

### 19. Iluminación
- **Prompt:** High-contrast light and shadow play, long exposure light trails, focus on the lamp filament, cozy glow.
- **Negative:** flat lamp, no shadow play, harsh cold light, amateur lighting shot.
- **Estilo:** lighting-design

### 20. Electrodomésticos
- **Prompt:** Stainless steel reflections, clean kitchen environment, bright high-key lighting, focus on digital displays.
- **Negative:** fingerprints on steel, dark kitchen, outdated appliances, amateur appliance shot.
- **Estilo:** appliance-modern

---

## 🍽️ FASE 2: Rubros 21-40 (Servicios y Gastronomía)

### 21. Fitness / Gimnasio
- **Prompt:** High-energy athletic photography, dramatic rim lighting on muscles, sweat droplets in beam, gritty texture, bold sans-serif block fonts in neon accent colors, Nike campaign aesthetic.
- **Negative:** zen meditation, yoga pose, peaceful atmosphere, candle lighting, spa aesthetic.

### 22. Restaurantes / Gastronomía
- **Prompt:** Cinematic food photography, backlit golden hour lighting, steam rising dramatically, macro lens on texture, elegant serif fonts with warm amber tones, Michelin guide presentation style.
- **Negative:** burnt food, dark shadows, cold lighting, raw meat, dirty plates, empty restaurant.

### 23. Bebidas / Licores
- **Prompt:** Premium liquid photography, glass transparency effects, condensation droplets, dramatic backlighting, gold foil accents, sophisticated serif fonts with deep burgundy tones, luxury bar aesthetic.
- **Negative:** plastic cups, cheap beer, bright fluorescent lighting, empty shelf, broken bottle.

### 24. Salud / Medicina
- **Prompt:** Clinical clean photography, bright shadowless lighting, pure white and cyan palette, sterile medical environment, modern sans-serif fonts, hospital equipment precision aesthetic.
- **Negative:** blood, surgery, needles, dark shadows, dirty equipment, outdated facility.

### 25. Educación / Cursos
- **Prompt:** Modern educational photography, bright natural window light, diverse students engaged, clean modern classroom, bold sans-serif fonts in trustworthy blue tones, LinkedIn learning aesthetic.
- **Negative:** empty classroom, dark basement, outdated books, chaotic mess, party scene.

### 26. Inmobiliaria
- **Prompt:** Luxury architectural photography, wide-angle interior lens, soft shadows, warm golden hour exterior, professional real estate aesthetic, elegant serif fonts in navy and gold tones.
- **Negative:** construction debris, empty lot, dark rooms, cluttered interior, ugly view.

### 27. Automotriz
- **Prompt:** Automotive commercial photography, glossy reflections, dramatic rim lighting on curves, motion blur background, bold sans-serif block fonts, automotive magazine aesthetic.
- **Negative:** dirty vehicle, rust, flat tire, broken window, dark garage, mechanic shop.

### 28. Mascotas / Veterinaria
- **Prompt:** Heartwarming pet photography, soft natural lighting, candid happy moments, clean veterinary clinic background, warm serif fonts in gentle earth tones, pet care trust aesthetic.
- **Negative:** scared animal, dark clinic, dirty, aggressive dog, sad atmosphere, medical procedure.

### 29. Viajes / Turismo
- **Prompt:** Dream destination photography, vibrant tropical colors, golden hour lighting, iconic landmark background, bold sans-serif fonts in sunset gradient, travel magazine aesthetic.
- **Negative:** rainy weather, dark clouds, crowded tourist mess, dirty beach, urban decay.

### 30. Eventos / Bodas
- **Prompt:** Elegant wedding photography, soft romantic lighting, bokeh highlights, delicate floral arrangements, elegant script fonts in blush and gold tones, bridal magazine aesthetic.
- **Negative:** dark reception, tacky decorations, chaotic party, casual atmosphere, ugly dress.

### 31. Limpieza / Mantenimiento
- **Prompt:** Before-after transformation photography, bright sparkling clean surfaces, fresh mint and blue palette, professional service aesthetic, bold sans-serif fonts in trustworthy blue tones.
- **Negative:** dirty messy room, dark shadows, mold, grime, industrial factory, construction dust.

### 32. Construcción / Reformas
- **Prompt:** Professional construction photography, dramatic worker action shots, architectural precision, bold industrial fonts in steel gray and safety orange, professional builder aesthetic.
- **Negative:** unfinished mess, dangerous site, no workers, abandoned building, trash debris.

### 33. Servicios Profesionales / Jurídico
- **Prompt:** Corporate professional photography, executive office setting, confident handshake, trustworthy blue palette, elegant serif fonts in navy and white, Forbes business aesthetic.
- **Negative:** casual friday, messy desk, jeans and t-shirt, party scene, casual atmosphere.

### 34. Arte / Cultura
- **Prompt:** Artistic gallery photography, dramatic museum lighting, abstract compositions, elegant minimal typography in black and white, contemporary art gallery aesthetic.
- **Negative:** damaged artwork, empty museum, poor lighting, casual selfie, commercial product.

### 35. Música / Entretenimiento
- **Prompt:** Concert photography, dramatic stage lighting, smoke and laser effects, bold aggressive fonts in neon colors, music festival poster aesthetic.
- **Negative:** empty stage, quiet venue, daytime concert, acoustic gentle, peaceful atmosphere.

### 36. Deportes
- **Prompt:** Dynamic sports photography, frozen action moment, dramatic stadium lighting, gritty texture, bold block fonts in team colors, Sports Illustrated aesthetic.
- **Negative:** empty field, boring practice, casual play, peaceful yoga, meditation atmosphere.

### 37. Hogar / Interiorismo
- **Prompt:** Interior design magazine photography, perfect symmetry, soft shadows, warm cozy atmosphere, elegant serif fonts in earth tones, Architectural Digest aesthetic.
- **Negative:** messy room, empty cold space, poor lighting, DIY amateur, construction zone.

### 38. Tecnología / Startups
- **Prompt:** Futuristic tech photography, glowing neon accents, clean minimal surfaces, modern sans-serif fonts in cyan and dark tones, Silicon Valley startup aesthetic.
- **Negative:** outdated technology, broken device, messy cables, dark basement, analog equipment.

### 39. Servicios Financieros
- **Prompt:** Corporate financial photography, executive boardroom setting, confident professional, trustworthy navy and gold palette, elegant serif fonts, Wall Street journal aesthetic.
- **Negative:** casual clothing, messy office, party scene, debt collector, dark atmosphere, poverty imagery.

### 40. Alimentos / Comida Rápida
- **Prompt:** Appetizing fast food photography, vibrant saturated colors, steam rising, macro details, bold sans-serif fonts in red and yellow, fast food commercial aesthetic.
- **Negative:** burnt food, cold presentation, empty restaurant, dirty packaging, healthy salad.

---

## ✨ FASE 3: Rubros 41-60 (Tiendas Especializadas)

### 41. Salón de Belleza
- **Prompt:** Glamour beauty photography, soft diffused lighting, flawless skin texture, elegant makeup detail shots, sophisticated serif fonts in rose gold tones, high-end beauty editorial aesthetic.
- **Negative:** harsh shadows, uneven makeup, dark room, casual selfie, unflattering angle.

### 42. Barbería
- **Prompt:** Classic masculine grooming photography, dramatic vintage lighting, sharp beard detail, leather and chrome textures, bold sans-serif fonts in black and silver tones, old school barbershop aesthetic.
- **Negative:** modern spa, feminine decor, bright fluorescent, casual haircut, messy shop.

### 43. Gimnasio / Crossfit
- **Prompt:** High-intensity fitness photography, harsh dramatic lighting, muscle definition focus, gritty gym environment, bold aggressive fonts in red and black tones, Crossfit games aesthetic.
- **Negative:** yoga class, zen atmosphere, light weights, peaceful meditation, spa vibes.

### 44. Piscina / Acuático
- **Prompt:** Tropical pool photography, crystal clear blue water, sun reflections, summer vacation vibes, vibrant sans-serif fonts in turquoise and orange, resort advertisement aesthetic.
- **Negative:** dirty water, empty pool, winter scene, dark basement, industrial tank.

### 45. Hotel / Hospedaje
- **Prompt:** Luxury hospitality photography, elegant room interior, perfect bedding detail, lobby sophistication, elegant serif fonts in navy and cream, boutique hotel aesthetic.
- **Negative:** messy room, old furniture, dirty bathroom, budget motel, cluttered lobby.

### 46. Restaurante Vegetariano
- **Prompt:** Fresh organic food photography, vibrant plant-based colors, natural light, rustic wooden textures, elegant serif fonts in earth green tones, health-conscious dining aesthetic.
- **Negative:** meat dishes, dark restaurant, wilted greens, processed food, fast food.

### 47. Cafetería / Coffee Shop
- **Prompt:** Cozy coffee photography, warm brown tones, steam rising from espresso, latte art detail, rustic serif fonts in warm beige, specialty coffee aesthetic.
- **Negative:** cold drink, burnt coffee, empty shop, bright fluorescent, fast food chain.

### 48. Heladería Artesanal
- **Prompt:** Creamy ice cream photography, vibrant colors, cold vapor effect, perfect scoops, playful sans-serif fonts in pastel colors, artisanal gelato aesthetic.
- **Negative:** melted mess, hard ice cream, dark freezer, cheap popsicles, industrial bulk.

### 49. Panadería Artesanal
- **Prompt:** Golden crust bread photography, warm bakery lighting, flour dust effect, rustic wooden baskets, warm serif fonts in wheat tones, traditional bakery aesthetic.
- **Negative:** burnt crust, stale bread, industrial factory, dark kitchen, packaged commercial.

### 50. Pastelería / Tortas
- **Prompt:** Elegant cake photography, perfect frosting details, soft pastel colors, delicate sugar decorations, sophisticated serif fonts in blush tones, wedding cake aesthetic.
- **Negative:** messy frosting, uneven layers, dark bakery, cheap supermarket, damaged delivery.

### 51. Carnicería
- **Prompt:** Fresh meat photography, clean display cases, quality cuts detail, bright clean lighting, bold sans-serif fonts in red and white, traditional butcher shop aesthetic.
- **Negative:** old meat, dark display, dirty counter, expired products, unpleasant smell.

### 52. Verdulería
- **Prompt:** Fresh produce photography, vibrant fruit and vegetable colors, water droplets on greens, clean market display, bold sans-serif fonts in green tones, fresh market aesthetic.
- **Negative:** wilted produce, empty display, bruised fruit, old stock, dirty market.

### 53. Tienda de Ropa
- **Prompt:** Fashion retail photography, clean store interior, garment detail shots, manequins displays, elegant serif fonts in neutral tones, boutique clothing aesthetic.
- **Negative:** messy rack, outdated fashion, damaged clothes, dark store, discount bin.

### 54. Zapatería
- **Prompt:** Footwear detail photography, leather texture focus, shoe display elegance, studio lighting on materials, bold sans-serif fonts in brown and black, premium footwear aesthetic.
- **Negative:** damaged shoes, dirty soles, old inventory, discount pile, messy display.

### 55. Joyería
- **Prompt:** Luxury jewelry photography, extreme macro on gemstones, dramatic rim lighting, velvet display, elegant serif fonts in gold tones, high-end jewelry aesthetic.
- **Negative:** tarnished metal, fake stones, costume jewelry, messy display, cheap materials.

### 56. Óptica
- **Prompt:** Clean eyewear photography, sharp lens reflection, modern frame display, clinical clean lighting, modern sans-serif fonts in blue and white, professional optical aesthetic.
- **Negative:** scratched lenses, old frames, dirty showroom, budget store, damaged eyewear.

### 57. Perfumería
- **Prompt:** Luxury fragrance photography, glass bottle transparency, ethereal lighting effects, floating particles, elegant serif fonts in gold and black, luxury perfume aesthetic.
- **Negative:** cheap scent, broken bottle, empty shelf, drugstore display, counterfeit product.

### 58. Regalería
- **Prompt:** Gift product photography, creative display, wrapping paper details, emotional presentation, playful sans-serif fonts in vibrant colors, gift shop aesthetic.
- **Negative:** damaged gift, cheap materials, empty store, wrapping mess, last minute pile.

### 59. Florería
- **Prompt:** Fresh flower photography, vibrant petal colors, water droplet details, elegant bouquet composition, soft serif fonts in romantic tones, romantic florist aesthetic.
- **Negative:** wilted blooms, dried flowers, empty shop, plastic fakes, messy bouquet.

### 60. Mueblería
- **Prompt:** Interior furniture photography, room setting display, wood grain focus, fabric texture details, elegant serif fonts in warm browns, premium furniture aesthetic.
- **Negative:** damaged piece, scratched surface, old inventory, discount warehouse, broken delivery.

---

## 🔧 Implementación Técnica

### Uso del Sistema

```typescript
import { 
  getArtDirectionById, 
  getArtDirectionByName,
  buildAgencyPrompt,
  ART_DIRECTION_CATALOG 
} from './constants/artDirectionIndex';

// Obtener por ID
const config = getArtDirectionById(4); // Calzado
// { id: 4, rubro: 'Calzado', prompt: '...', negativePrompt: '...', aspectRatio: '9:16', style: 'product-dynamic' }

// Obtener por nombre
const config = getArtDirectionByName('zapatillas'); // Calzado

// Construir prompt completo
const prompt = buildAgencyPrompt('running shoes', 4);
// "Dynamic low-angle shot... running shoes. (low quality, blurry text...)"
```

### Categorías Agrupadas

```typescript
const ART_DIRECTION_CATEGORIES = {
  retail: { label: "Retail y Comercio", rubros: [1-20] },
  food: { label: "Alimentación y Restaurantes", rubros: [22, 40, 46-52] },
  health: { label: "Salud y Bienestar", rubros: [24, 28, 41-43, 56] },
  services: { label: "Servicios Profesionales", rubros: [25, 31-33, 39] },
  lifestyle: { label: "Lifestyle y Entretención", rubros: [21, 29, 30, 34-38] },
  specialty: { label: "Tiendas Especializadas", rubros: [53-60] }
};
```

---

## 📱 Integración con UI

### Botón STORY ART (9:16)

```tsx
<button 
  onClick={() => {
    setIsStoryArtModeActive(true);
    setAspectRatio('9:16');
    setFeedbackMessage("Modo Agencia Activado: Dirección de arte profesional aplicada");
  }}
  className="story-art-btn"
>
  🎨 STORY ART (9:16)
</button>
```

### Feedback al Usuario

```
✅ "Modo Agencia Activado"
✅ "Dirección de arte automática aplicada"
✅ "Negative prompt de agencia inyectado"
```

---

## 📊 Resumen del Sistema

| Fase | Rubros | Descripción |
|------|--------|-------------|
| 1 | 1-20 | Retail y Productos General |
| 2 | 21-40 | Servicios y Gastronomía |
| 3 | 41-60 | Tiendas Especializadas |
| **Total** | **60** | **Sistema Completo** |

---

## 🎯 Ejemplo de Uso

**Input:** "Vendo zapatillas de running"

**Lógica:**
1. Sistema detecta rubro relacionado: Calzado (ID 4)
2. Aplica dirección de arte específica
3. Fuerza formato 9:16
4. Inyecta negative prompt de agencia

**Prompt Resultante:**
```
Dynamic low-angle shot, focus on sole texture, motion blur background, 
floating price stickers style. running shoes. 
(low quality, blurry text, amateur layout, stretched image, cheap flyer, 
cluttered design, distorted products, messy fingers, clip art style, 
watermark visible, low resolution, poor composition, uneven lighting)
```

---

*Sistema de Dirección de Arte Profesional v2.0 - Estudio 56*
import { ArtDirectionPrompt } from '../../types';

// ============================================
// DIRECCIÓN DE ARTE PROFESIONAL - FASE 3
// Rubros 41-60: Continuación del Sistema de Agencia
// Estructura: Asset Procesado + Dirección de Arte Específica + Composición Social Media (9:16) + Guardrail Negativo
// ============================================

export const ART_DIRECTION_PHASE3: Record<number, ArtDirectionPrompt> = {
  // 41. SALÓN DE BELLEZA
  41: {
    rubro: "Salón de Belleza",
    artDirection: "Glamour beauty photography, soft diffused lighting, flawless skin texture, elegant makeup detail shots, sophisticated serif fonts in rose gold tones, high-end beauty editorial aesthetic.",
    socialMediaComposition: "Vertical 9:16, model or beauty detail centered with soft bokeh, elegant color palette, transformation reveal effect, sophisticated beauty service call-to-action.",
    negativePrompt: "low quality, blurry beauty, amateur salon photo, stretched image, cheap flyer, cluttered design, harsh shadows, uneven makeup, dark room, casual selfie, unflattering angle."
  },

  // 42. BARBERÍA
  42: {
    rubro: "Barbería",
    artDirection: "Authentic masculine grooming photography, natural vintage lighting, sharp beard detail, leather and chrome textures, bold sans-serif fonts in black and silver tones, local barbershop aesthetic.",
    socialMediaComposition: "Vertical 9:16, barber in action or client transformation centered, clean shadows, masculine color palette, classic barbershop pole integration, bold service call-to-action.",
    negativePrompt: "low quality, blurry barber, amateur grooming photo, stretched image, cheap flyer, cluttered design, modern spa, feminine decor, bright fluorescent, casual haircut, messy shop, dramatic lighting."
  },

  // 43. GIMNASIO / CROSSFIT
  43: {
    rubro: "Gimnasio / Crossfit",
    artDirection: "Authentic fitness photography, natural gym lighting, muscle definition focus, clean gym environment, bold fonts in red and black tones, local gym aesthetic.",
    socialMediaComposition: "Vertical 9:16, athlete lifting weights centered, clean energy, equipment visible, fitness call-to-action, professional gym atmosphere.",
    negativePrompt: "low quality, blurry gym, amateur fitness photo, stretched image, cheap flyer, cluttered design, yoga class, zen atmosphere, light weights, peaceful meditation, spa vibes, dramatic lighting."
  },

  // 44. PISCINA / ACUÁTICO
  44: {
    rubro: "Piscina / Acuático",
    artDirection: "Tropical pool photography, crystal clear blue water, sun reflections, summer vacation vibes, vibrant sans-serif fonts in turquoise and orange, resort advertisement aesthetic.",
    socialMediaComposition: "Vertical 9:16, pool scene centered with water sparkle effects, tropical colors, summer excitement call-to-action, vacation resort feel with bright vibrant palette.",
    negativePrompt: "low quality, blurry pool, amateur water photo, stretched image, cheap flyer, cluttered design, dirty water, empty pool, winter scene, dark basement, industrial tank."
  },

  // 45. HOTEL / HOSPEDAJE
  45: {
    rubro: "Hotel / Hospedaje",
    artDirection: "Luxury hospitality photography, elegant room interior, perfect bedding detail, lobby sophistication, elegant serif fonts in navy and cream, boutique hotel aesthetic.",
    socialMediaComposition: "Vertical 9:16, room or amenity centered with elegant lighting, sophisticated color palette, booking call-to-action, aspirational travel experience feel.",
    negativePrompt: "low quality, blurry hotel, amateur accommodation photo, stretched image, cheap flyer, cluttered design, messy room, old furniture, dirty bathroom, budget motel, cluttered lobby."
  },

  // 46. RESTAURANTE VEGETARIANO
  46: {
    rubro: "Restaurante Vegetariano",
    artDirection: "Fresh organic food photography, vibrant plant-based colors, natural light, rustic wooden textures, elegant serif fonts in earth green tones, health-conscious dining aesthetic.",
    socialMediaComposition: "Vertical 9:16, fresh plant-based dish centered with garnish details, natural colors, healthy lifestyle call-to-action, conscious dining feel with warm earth tones.",
    negativePrompt: "low quality, blurry vegetarian, amateur health food photo, stretched image, cheap flyer, cluttered design, meat dishes, dark restaurant, wilted greens, processed food, fast food."
  },

  // 47. CAFETERÍA / COFFEE SHOP
  47: {
    rubro: "Cafetería / Coffee Shop",
    artDirection: "Cozy coffee photography, warm brown tones, steam rising from espresso, latte art detail, rustic serif fonts in warm beige, specialty coffee aesthetic.",
    socialMediaComposition: "Vertical 9:16, coffee drink centered with latte art, warm inviting colors, coffee culture call-to-action, comfortable cafe atmosphere with soft lighting.",
    negativePrompt: "low quality, blurry coffee, amateur cafe photo, stretched image, cheap flyer, cluttered design, cold drink, burnt coffee, empty shop, bright fluorescent, fast food chain."
  },

  // 48. HELADERÍA ARTESANAL
  48: {
    rubro: "Heladería Artesanal",
    artDirection: "Creamy ice cream photography, vibrant colors, cold vapor effect, perfect scoops, playful sans-serif fonts in pastel colors, artisanal gelato aesthetic.",
    socialMediaComposition: "Vertical 9:16, ice cream scoop centered with drip effect, cold vibrant colors, summer treat call-to-action, fun playful feel with appetizing appeal.",
    negativePrompt: "low quality, blurry ice cream, amateur gelato photo, stretched image, cheap flyer, cluttered design, melted mess, hard ice cream, dark freezer, cheap popsicles, industrial bulk."
  },

  // 49. PANADERÍA ARTESANAL
  49: {
    rubro: "Panadería Artesanal",
    artDirection: "Golden crust bread photography, warm bakery lighting, flour dust effect, rustic wooden baskets, warm serif fonts in wheat tones, traditional bakery aesthetic.",
    socialMediaComposition: "Vertical 9:16, fresh bread centered with steam rising, warm golden colors, bakery fresh call-to-action, traditional artisan feel with comforting atmosphere.",
    negativePrompt: "low quality, blurry bread, amateur bakery photo, stretched image, cheap flyer, cluttered design, burnt crust, stale bread, industrial factory, dark kitchen, packaged commercial."
  },

  // 50. PASTELERÍA / TORTAS
  50: {
    rubro: "Pastelería / Tortas",
    artDirection: "Elegant cake photography, perfect frosting details, soft pastel colors, delicate sugar decorations, sophisticated serif fonts in blush tones, wedding cake aesthetic.",
    socialMediaComposition: "Vertical 9:16, cake detail centered with elegant lighting, sophisticated colors, celebration call-to-action, premium bakery feel with refined presentation.",
    negativePrompt: "low quality, blurry cake, amateur pastry photo, stretched image, cheap flyer, cluttered design, messy frosting, uneven layers, dark bakery, cheap supermarket, damaged delivery."
  },

  // 51. CARNICERÍA
  51: {
    rubro: "Carnicería",
    artDirection: "Fresh meat photography, clean display cases, quality cuts detail, bright clean lighting, bold sans-serif fonts in red and white, traditional butcher shop aesthetic.",
    socialMediaComposition: "Vertical 9:16, premium meat cut centered with fresh appearance, clean professional colors, quality meat call-to-action, trustworthy butcher feel with hygiene focus.",
    negativePrompt: "low quality, blurry meat, amateur butcher photo, stretched image, cheap flyer, cluttered design, old meat, dark display, dirty counter, expired products, unpleasant smell."
  },

  // 52. VERDULERÍA
  52: {
    rubro: "Verdulería",
    artDirection: "Fresh produce photography, vibrant fruit and vegetable colors, water droplets on greens, clean market display, bold sans-serif fonts in green tones, fresh market aesthetic.",
    socialMediaComposition: "Vertical 9:16, fresh produce centered with water droplets, vibrant natural colors, farm fresh call-to-action, healthy market feel with quality assurance.",
    negativePrompt: "low quality, blurry vegetables, amateur market photo, stretched image, cheap flyer, cluttered design, wilted produce, empty display, bruised fruit, old stock, dirty market."
  },

  // 53. TIENDA DE ROPA
  53: {
    rubro: "Tienda de Ropa",
    artDirection: "Fashion retail photography, clean store interior, garment detail shots, manequins displays, elegant serif fonts in neutral tones, boutique clothing aesthetic.",
    socialMediaComposition: "Vertical 9:16, fashion item or outfit centered with clean background, stylish colors, fashion forward call-to-action, trendy retail feel with aspirational style.",
    negativePrompt: "low quality, blurry clothing, amateur boutique photo, stretched image, cheap flyer, cluttered design, messy rack, outdated fashion, damaged clothes, dark store, discount bin."
  },

  // 54. ZAPATERÍA
  54: {
    rubro: "Zapatería",
    artDirection: "Footwear detail photography, leather texture focus, shoe display elegance, studio lighting on materials, bold sans-serif fonts in brown and black, premium footwear aesthetic.",
    socialMediaComposition: "Vertical 9:16, shoe centered with texture detail, sophisticated colors, step in style call-to-action, premium footwear feel with quality emphasis.",
    negativePrompt: "low quality, blurry shoes, amateur footwear photo, stretched image, cheap flyer, cluttered design, damaged shoes, dirty soles, old inventory, discount pile, messy display."
  },

  // 55. JOYERÍA
  55: {
    rubro: "Joyería",
    artDirection: "Clean jewelry photography, natural gemstone detail, soft rim lighting, clean display, elegant serif fonts in gold tones, professional jewelry aesthetic.",
    socialMediaComposition: "Vertical 9:16, jewelry piece centered with clean sparkle, elegant colors, special occasion call-to-action, trustworthy jewelry feel with natural elegance.",
    negativePrompt: "low quality, blurry jewelry, amateur jewelry photo, stretched image, cheap flyer, cluttered design, tarnished metal, fake stones, costume jewelry, messy display, cheap materials, dramatic lighting."
  },

  // 56. ÓPTICA
  56: {
    rubro: "Óptica",
    artDirection: "Clean eyewear photography, sharp lens reflection, modern frame display, clinical clean lighting, modern sans-serif fonts in blue and white, professional optical aesthetic.",
    socialMediaComposition: "Vertical 9:16, eyeglasses centered with reflection effect, clean professional colors, vision care call-to-action, trustworthy optical feel with modern style.",
    negativePrompt: "low quality, blurry glasses, amateur optical photo, stretched image, cheap flyer, cluttered design, scratched lenses, old frames, dirty showroom, budget store, damaged eyewear."
  },

  // 57. PERFUMERÍA
  57: {
    rubro: "Perfumería",
    artDirection: "Luxury fragrance photography, glass bottle transparency, ethereal lighting effects, floating particles, elegant serif fonts in gold and black, luxury perfume aesthetic.",
    socialMediaComposition: "Vertical 9:16, perfume bottle centered with glow effect, sophisticated colors, signature scent call-to-action, premium fragrance feel with elegance and allure.",
    negativePrompt: "low quality, blurry perfume, amateur fragrance photo, stretched image, cheap flyer, cluttered design, cheap scent, broken bottle, empty shelf, drugstore display, counterfeit product."
  },

  // 58. REGALERÍA
  58: {
    rubro: "Regalería",
    artDirection: "Gift product photography, creative display, wrapping paper details, emotional presentation, playful sans-serif fonts in vibrant colors, gift shop aesthetic.",
    socialMediaComposition: "Vertical 9:16, gift item centered with creative presentation, warm inviting colors, gift giving call-to-action, thoughtful present feel with care and creativity.",
    negativePrompt: "low quality, blurry gift, amateur gift shop photo, stretched image, cheap flyer, cluttered design, damaged gift, cheap materials, empty store, wrapping mess, last minute pile."
  },

  // 59. FLORERÍA
  59: {
    rubro: "Florería",
    artDirection: "Fresh flower photography, vibrant petal colors, water droplet details, elegant bouquet composition, soft serif fonts in romantic tones, romantic florist aesthetic.",
    socialMediaComposition: "Vertical 9:16, flower arrangement centered with natural beauty, romantic colors, special delivery call-to-action, romantic florist feel with fresh elegance.",
    negativePrompt: "low quality, blurry flowers, amateur florist photo, stretched image, cheap flyer, cluttered design, wilted blooms, dried flowers, empty shop, plastic fakes, messy bouquet."
  },

  // 60. MUEBLERÍA
  60: {
    rubro: "Mueblería",
    artDirection: "Interior furniture photography, room setting display, wood grain focus, fabric texture details, elegant serif fonts in warm browns, premium furniture aesthetic.",
    socialMediaComposition: "Vertical 9:16, furniture piece centered in room setting, warm sophisticated colors, home transformation call-to-action, premium furniture feel with lifestyle inspiration.",
    negativePrompt: "low quality, blurry furniture, amateur furniture photo, stretched image, cheap flyer, cluttered design, damaged piece, scratched surface, old inventory, discount warehouse, broken delivery."
  }
};

// ============================================
// UTILIDADES DE BÚSQUEDA PARA FASE 3
// ============================================

export function getArtDirectionPhase3ById(id: number): ArtDirectionPrompt | null {
  if (id >= 41 && id <= 60) {
    return ART_DIRECTION_PHASE3[id] || null;
  }
  return null;
}

export function getArtDirectionPhase3ByName(name: string): ArtDirectionPrompt | null {
  const normalizedName = name.toLowerCase().trim();
  
  for (const id in ART_DIRECTION_PHASE3) {
    const prompt = ART_DIRECTION_PHASE3[Number(id)];
    if (prompt.rubro.toLowerCase().includes(normalizedName)) {
      return prompt;
    }
  }
  
  return null;
}

export function buildArtDirectionPromptFullPhase3(
  subject: string,
  rubroId: number
): string {
  const artDirection = getArtDirectionPhase3ById(rubroId);
  
  if (!artDirection) {
    return `${subject}, professional commercial photography, high quality, clean design`;
  }
  
  return `${artDirection.artDirection} ${subject}. ${artDirection.socialMediaComposition}. ${artDirection.negativePrompt}`;
}

// ============================================
// EXPORT PARA CONSUMO EXTERNO
// ============================================

export const ART_DIRECTION_CATALOG_PHASE3 = {
  phase: 3,
  totalPrompts: 20,
  rubros: Object.values(ART_DIRECTION_PHASE3).map(p => p.rubro),
  prompts: ART_DIRECTION_PHASE3
};
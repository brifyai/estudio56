import { ArtDirectionPrompt } from '../../types';

// ============================================
// DIRECCIÓN DE ARTE PROFESIONAL - FASE 2
// Rubros 21-40: Continuación del Sistema de Agencia
// Estructura: Asset Procesado + Dirección de Arte Específica + Composición Social Media (9:16) + Guardrail Negativo
// ============================================

export const ART_DIRECTION_PHASE2: Record<number, ArtDirectionPrompt> = {
  // 21. FITNESS / GIMNASIO
  21: {
    rubro: "Fitness / Gimnasio",
    artDirection: "Authentic gym photography, natural daylight through windows, realistic muscle definition, clean equipment visible, bold sans-serif fonts in solid colors, local gym campaign aesthetic.",
    socialMediaComposition: "Vertical 9:16 composition, subject centered with even lighting, action text overlay space at top, brand colors in lower third, clean gym atmosphere.",
    negativePrompt: "low quality, blurry action, amateur gym photo, stretched image, cheap flyer, cluttered design, zen meditation, yoga pose, peaceful atmosphere, candle lighting, spa aesthetic, dramatic shadows."
  },

  // 22. RESTAURANTES / GASTRONOMÍA
  22: {
    rubro: "Restaurantes / Gastronomía",
    artDirection: "Natural food photography, soft daylight illumination, appetizing food presentation, clean plate composition, elegant serif fonts with warm tones, authentic restaurant aesthetic.",
    socialMediaComposition: "Vertical 9:16, food centered in lower portion, natural colors, elegant typography overlay, appetite appeal focus with negative space at top.",
    negativePrompt: "low quality, blurry food, amateur restaurant photo, stretched image, cheap flyer, cluttered design, burnt food, dark shadows, cold lighting, raw meat, dirty plates, empty restaurant, dramatic lighting."
  },

  // 23. BEBIDAS / LICORES
  23: {
    rubro: "Bebidas / Licores",
    artDirection: "Authentic beverage photography, natural glass transparency, clean condensation, soft lighting, sophisticated serif fonts with warm tones, local bar aesthetic.",
    socialMediaComposition: "Vertical 9:16, bottle or glass centered with clean presentation, condensation detail visible, elegant text overlay, warm inviting atmosphere.",
    negativePrompt: "low quality, blurry glass, amateur bar photo, stretched image, cheap flyer, cluttered design, plastic cups, cheap beer, bright fluorescent lighting, empty shelf, broken bottle, dramatic backlighting."
  },

  // 24. SALUD / MEDICINA
  24: {
    rubro: "Salud / Medicina",
    artDirection: "Clinical clean photography, bright shadowless lighting, pure white and cyan palette, sterile medical environment, modern sans-serif fonts, hospital equipment precision aesthetic.",
    socialMediaComposition: "Vertical 9:16, clean white background with medical equipment, symmetrical composition, professional trust evoking, medical cross subtly integrated, clear readable text.",
    negativePrompt: "low quality, blurry medical, amateur clinic photo, stretched image, cheap flyer, cluttered design, blood, surgery, needles, dark shadows, dirty equipment, outdated facility."
  },

  // 25. EDUCACIÓN / CURSOS
  25: {
    rubro: "Educación / Cursos",
    artDirection: "Modern educational photography, bright natural window light, diverse students engaged, clean modern classroom, bold sans-serif fonts in trustworthy blue tones, LinkedIn learning aesthetic.",
    socialMediaComposition: "Vertical 9:16, students or books centered, warm inviting colors, clean layout with clear text hierarchy, professional yet approachable educational feel.",
    negativePrompt: "low quality, blurry classroom, amateur school photo, stretched image, cheap flyer, cluttered design, empty classroom, dark basement, outdated books, chaotic mess, party scene."
  },

  // 26. INMOBILIARIA
  26: {
    rubro: "Inmobiliaria",
    artDirection: "Clean architectural photography, wide-angle interior lens, natural daylight, professional real estate aesthetic, elegant serif fonts in navy tones, authentic property presentation.",
    socialMediaComposition: "Vertical 9:16, property interior or exterior centered, clean view, elegant typography with price call-to-action, trustworthy property feel with natural colors.",
    negativePrompt: "low quality, blurry property, amateur listing photo, stretched image, cheap flyer, cluttered design, construction debris, empty lot, dark rooms, cluttered interior, ugly view, dramatic shadows."
  },

  // 27. AUTOMOTRIZ
  27: {
    rubro: "Automotriz / Autos",
    artDirection: "Clean automotive photography, natural reflections, even lighting on curves, clean background, bold sans-serif block fonts, professional dealership aesthetic.",
    socialMediaComposition: "Vertical 9:16, vehicle in clean pose, reflections visible, clean typography, professional car dealership feel with natural lighting.",
    negativePrompt: "low quality, blurry car, amateur dealership photo, stretched image, cheap flyer, cluttered design, dirty vehicle, rust, flat tire, broken window, dark garage, mechanic shop, dramatic lighting."
  },

  // 28. MASCOTAS / VETERINARIA
  28: {
    rubro: "Mascotas / Veterinaria",
    artDirection: "Heartwarming pet photography, soft natural lighting, candid happy moments, clean veterinary clinic background, warm serif fonts in gentle earth tones, pet care trust aesthetic.",
    socialMediaComposition: "Vertical 9:16, happy pet centered with caring vet or owner, warm color palette, emotional connection evoking text, trustworthy and compassionate design feel.",
    negativePrompt: "low quality, blurry pet, amateur vet photo, stretched image, cheap flyer, cluttered design, scared animal, dark clinic, dirty, aggressive dog, sad atmosphere, medical procedure."
  },

  // 29. VIAJES / TURISMO
  29: {
    rubro: "Viajes / Turismo",
    artDirection: "Dream destination photography, vibrant tropical colors, golden hour lighting, iconic landmark background, bold sans-serif fonts in sunset gradient, travel magazine aesthetic.",
    socialMediaComposition: "Vertical 9:16, destination beauty centered, warm sunset gradient overlay, wanderlust evoking text, Instagram wanderlust aesthetic with vibrant saturated colors.",
    negativePrompt: "low quality, blurry destination, amateur travel photo, stretched image, cheap flyer, cluttered design, rainy weather, dark clouds, crowded tourist mess, dirty beach, urban decay."
  },

  // 30. EVENTOS / BODAS
  30: {
    rubro: "Eventos / Bodas",
    artDirection: "Elegant wedding photography, soft romantic lighting, bokeh highlights, delicate floral arrangements, elegant script fonts in blush and gold tones, bridal magazine aesthetic.",
    socialMediaComposition: "Vertical 9:16, romantic couple or detail centered, soft dreamy bokeh, elegant typography with RSVP call-to-action, sophisticated wedding invitation feel with gentle colors.",
    negativePrompt: "low quality, blurry wedding, amateur event photo, stretched image, cheap flyer, cluttered design, dark reception, tacky decorations, chaotic party, casual atmosphere, ugly dress."
  },

  // 31. LIMPIEZA / MANTENIMIENTO
  31: {
    rubro: "Limpieza / Mantenimiento",
    artDirection: "Before-after transformation photography, bright sparkling clean surfaces, fresh mint and blue palette, professional service aesthetic, bold sans-serif fonts in trustworthy blue tones.",
    socialMediaComposition: "Vertical 9:16, sparkling clean surface or transformation centered, fresh color palette, clear service call-to-action, trustworthy professional home service feel.",
    negativePrompt: "low quality, blurry cleaning, amateur service photo, stretched image, cheap flyer, cluttered design, dirty messy room, dark shadows, mold, grime, industrial factory, construction dust."
  },

  // 32. CONSTRUCCIÓN / REFORMAS
  32: {
    rubro: "Construcción / Reformas",
    artDirection: "Professional construction photography, natural worker action shots, architectural precision, bold industrial fonts in steel gray, professional builder aesthetic.",
    socialMediaComposition: "Vertical 9:16, construction progress or finished project centered, worker action visible, bold typography with quote request call-to-action, reliable contractor feel with strong colors.",
    negativePrompt: "low quality, blurry construction, amateur contractor photo, stretched image, cheap flyer, cluttered design, unfinished mess, dangerous site, no workers, abandoned building, trash debris, dramatic lighting."
  },

  // 33. SERVICIOS PROFESIONALES
  33: {
    rubro: "Servicios Profesionales / Jurídico",
    artDirection: "Corporate professional photography, executive office setting, confident handshake, trustworthy blue palette, elegant serif fonts in navy and white, Forbes business aesthetic.",
    socialMediaComposition: "Vertical 9:16, professional setting or portrait centered, trustworthy color scheme, clear contact information, serious and reliable business feel with clean composition.",
    negativePrompt: "low quality, blurry office, amateur business photo, stretched image, cheap flyer, cluttered design, casual friday, messy desk, jeans and t-shirt, party scene, casual atmosphere."
  },

  // 34. ARTE / CULTURA
  34: {
    rubro: "Arte / Cultura",
    artDirection: "Artistic gallery photography, natural museum lighting, clean compositions, elegant minimal typography in black and white, contemporary art gallery aesthetic.",
    socialMediaComposition: "Vertical 9:16, artwork or cultural event centered, clean lighting focus, artistic typography, sophisticated gallery feel with negative space and minimal elements.",
    negativePrompt: "low quality, blurry art, amateur gallery photo, stretched image, cheap flyer, cluttered design, damaged artwork, empty museum, poor lighting, casual selfie, commercial product, dramatic lighting."
  },

  // 35. MÚSICA / ENTRETENIMIENTO
  35: {
    rubro: "Música / Entretenimiento",
    artDirection: "Concert photography, natural stage lighting, clean performance capture, bold fonts in solid colors, music event aesthetic.",
    socialMediaComposition: "Vertical 9:16, performer or stage centered with clean presentation, dynamic energy, bold typography with event details, high-energy entertainment feel with natural colors.",
    negativePrompt: "low quality, blurry concert, amateur music photo, stretched image, cheap flyer, cluttered design, empty stage, quiet venue, daytime concert, acoustic gentle, peaceful atmosphere, dramatic lighting effects."
  },

  // 36. DEPORTES
  36: {
    rubro: "Deportes",
    artDirection: "Authentic sports photography, natural action moment, clean field lighting, realistic texture, bold block fonts in team colors, local sports coverage aesthetic.",
    socialMediaComposition: "Vertical 9:16, athlete in action centered, clean composition, bold team colors, exciting score or event call-to-action, energetic sports feel with natural feel.",
    negativePrompt: "low quality, blurry sports, amateur game photo, stretched image, cheap flyer, cluttered design, empty field, boring practice, casual play, peaceful yoga, meditation atmosphere, dramatic stadium lighting."
  },

  // 37. HOGAR / INTERIORISMO
  37: {
    rubro: "Hogar / Interiorismo",
    artDirection: "Interior design magazine photography, perfect symmetry, soft shadows, warm cozy atmosphere, elegant serif fonts in earth tones, Architectural Digest aesthetic.",
    socialMediaComposition: "Vertical 9:16, beautifully designed room centered, warm inviting colors, elegant furniture call-to-action, sophisticated home design feel with aspirational lifestyle.",
    negativePrompt: "low quality, blurry interior, amateur decoration photo, stretched image, cheap flyer, cluttered design, messy room, empty cold space, poor lighting, DIY amateur, construction zone."
  },

  // 38. TECNOLOGÍA / STARTUPS
  38: {
    rubro: "Tecnología / Startups",
    artDirection: "Futuristic tech photography, glowing neon accents, clean minimal surfaces, modern sans-serif fonts in cyan and dark tones, Silicon Valley startup aesthetic.",
    socialMediaComposition: "Vertical 9:16, tech product or workspace centered, glowing UI elements, modern typography with innovation call-to-action, cutting-edge tech feel with futuristic colors.",
    negativePrompt: "low quality, blurry tech, amateur startup photo, stretched image, cheap flyer, cluttered design, outdated technology, broken device, messy cables, dark basement, analog equipment."
  },

  // 39. SERVICIOS FINANCIEROS
  39: {
    rubro: "Servicios Financieros",
    artDirection: "Corporate financial photography, executive boardroom setting, confident professional, trustworthy navy and gold palette, elegant serif fonts, Wall Street journal aesthetic.",
    socialMediaComposition: "Vertical 9:16, professional meeting or success moment centered, trustworthy colors, clear financial call-to-action, serious and successful business feel with clean composition.",
    negativePrompt: "low quality, blurry finance, amateur bank photo, stretched image, cheap flyer, cluttered design, casual clothing, messy office, party scene, debt collector, dark atmosphere, poverty imagery."
  },

  // 40. ALIMENTOS / COMIDA RÁPIDA
  40: {
    rubro: "Alimentos / Comida Rápida",
    artDirection: "Appetizing fast food photography, vibrant saturated colors, steam rising, macro details, bold sans-serif fonts in red and yellow, fast food commercial aesthetic.",
    socialMediaComposition: "Vertical 9:16, delicious food item centered with steam, vibrant appetite appeal colors, urgent deal call-to-action, crave-inducing fast food feel with dynamic composition.",
    negativePrompt: "low quality, blurry food, amateur fast food photo, stretched image, cheap flyer, cluttered design, burnt food, cold presentation, empty restaurant, dirty packaging, healthy salad."
  }
};

// ============================================
// UTILIDADES DE BÚSQUEDA PARA FASE 2
// ============================================

export function getArtDirectionById(id: number): ArtDirectionPrompt | null {
  if (id >= 21 && id <= 40) {
    return ART_DIRECTION_PHASE2[id] || null;
  }
  return null;
}

export function getArtDirectionByName(name: string): ArtDirectionPrompt | null {
  const normalizedName = name.toLowerCase().trim();
  
  for (const id in ART_DIRECTION_PHASE2) {
    const prompt = ART_DIRECTION_PHASE2[Number(id)];
    if (prompt.rubro.toLowerCase().includes(normalizedName)) {
      return prompt;
    }
  }
  
  return null;
}

export function buildArtDirectionPromptFull(
  subject: string,
  rubroId: number
): string {
  const artDirection = getArtDirectionById(rubroId);
  
  if (!artDirection) {
    return `${subject}, professional commercial photography, high quality, clean design`;
  }
  
  return `${artDirection.artDirection} ${subject}. ${artDirection.socialMediaComposition}. ${artDirection.negativePrompt}`;
}

export function buildArtDirectionPromptSimple(
  subject: string,
  rubroId: number
): string {
  const artDirection = getArtDirectionById(rubroId);
  
  if (!artDirection) {
    return `${subject}, professional commercial photography`;
  }
  
  return `${artDirection.artDirection} ${subject}`;
}

// ============================================
// EXPORT PARA CONSUMO EXTERNO
// ============================================

export const ART_DIRECTION_CATALOG = {
  phase2: ART_DIRECTION_PHASE2,
  totalPrompts: 20,
  rubros: Object.values(ART_DIRECTION_PHASE2).map(p => p.rubro)
};
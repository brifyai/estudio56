// ============================================
// GUÍA DE ESTILOS DE TIPOGRAFÍA PROFESIONAL
// 60 Rubros con Fuentes, Colores y Headlines
// Estructura: [ID] → Configuración tipográfica completa
// ============================================

// Interfaz para configuración tipográfica por rubro
export interface TypographyConfig {
  fontFamily: string;
  fontWeight: string;
  fontSize?: string;
  letterSpacing: string;
  lineHeight: string;
  suggestedColor: string;
  backgroundColor?: string;
  overlayOpacity: number;
  alignment: 'left' | 'center' | 'right';
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  headlines: string[];
}

export const TYPOGRAPHY_GUIDE: Record<number, TypographyConfig> = {
  // ============================================
  // FASE 1: RETAIL Y COMERCIO (1-20)
  // ============================================

  // 1. Retail General
  1: {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: "700",
    fontSize: "2.5rem",
    letterSpacing: "0.02em",
    lineHeight: "1.2",
    suggestedColor: "#1a1a1a",
    backgroundColor: "rgba(255,255,255,0.9)",
    overlayOpacity: 0.85,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Oferta de Temporada",
      "Nuevos Productos",
      "Calidad Garantizada",
      "Tu Tienda de Confianza"
    ]
  },

  // 2. Moda Mujer
  2: {
    fontFamily: "Playfair Display, serif",
    fontWeight: "500",
    fontSize: "2.2rem",
    letterSpacing: "0.08em",
    lineHeight: "1.3",
    suggestedColor: "#2d2d2d",
    backgroundColor: "rgba(255,255,255,0.8)",
    overlayOpacity: 0.75,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Elegancia Natural",
      "Tendencias de Temporada",
      "Belleza sin Esfuerzo",
      "Tu Estilo, Tu Identidad"
    ]
  },

  // 3. Moda Hombre
  3: {
    fontFamily: "Oswald, sans-serif",
    fontWeight: "700",
    fontSize: "2.8rem",
    letterSpacing: "0.03em",
    lineHeight: "1.1",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.6)",
    overlayOpacity: 0.5,
    alignment: "left",
    textTransform: "uppercase",
    headlines: [
      " attitude",
      "Estilo Urbano",
      "Hombre Moderno",
      "Sin Compromiso"
    ]
  },

  // 4. Calzado
  4: {
    fontFamily: "Teko, sans-serif",
    fontWeight: "600",
    fontSize: "3rem",
    letterSpacing: "0.05em",
    lineHeight: "1",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.7)",
    overlayOpacity: 0.6,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Paso Firme",
      "Comodidad Total",
      "Estilo que Camina",
      "Nuevos Zapatos, Nueva Vida"
    ]
  },

  // 5. Joyas
  5: {
    fontFamily: "Cinzel, serif",
    fontWeight: "600",
    fontSize: "2rem",
    letterSpacing: "0.15em",
    lineHeight: "1.4",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.5)",
    overlayOpacity: 0.4,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Brillo Eterno",
      "Joyas que Cuentan Historias",
      "Lujo en Cada Detalle",
      "Tu Momento Especial"
    ]
  },

  // 6. Óptica
  6: {
    fontFamily: "Lato, sans-serif",
    fontWeight: "400",
    fontSize: "2rem",
    letterSpacing: "0.05em",
    lineHeight: "1.5",
    suggestedColor: "#0066cc",
    backgroundColor: "rgba(255,255,255,0.95)",
    overlayOpacity: 0.9,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Ve el Mundo con Claridad",
      "Tu Visión, Nuestra Pasión",
      "Protege Tu Mirada",
      "Estilo y Salud Visual"
    ]
  },

  // 7. Belleza / Cosmética
  7: {
    fontFamily: "Raleway, sans-serif",
    fontWeight: "300",
    fontSize: "2.2rem",
    letterSpacing: "0.1em",
    lineHeight: "1.4",
    suggestedColor: "#4a4a4a",
    backgroundColor: "rgba(255,255,255,0.85)",
    overlayOpacity: 0.8,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Piel Perfecta",
      "Belleza Natural",
      "Radia y Confiada",
      "Cuidado Profesional"
    ]
  },

  // 8. Perfumería
  8: {
    fontFamily: "Cormorant Garamond, serif",
    fontWeight: "400",
    fontSize: "2.4rem",
    letterSpacing: "0.08em",
    lineHeight: "1.3",
    suggestedColor: "#1a1a1a",
    backgroundColor: "rgba(255,255,255,0.75)",
    overlayOpacity: 0.7,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Fragancia que Seduce",
      "Tu Firma Personal",
      "Esencia de Elegancia",
      "Aroma que Inspira"
    ]
  },

  // 9. Bolsos / Carteras
  9: {
    fontFamily: "Prata, serif",
    fontWeight: "500",
    fontSize: "2.2rem",
    letterSpacing: "0.05em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.6)",
    overlayOpacity: 0.5,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Elegancia en Cada Bolsa",
      "Tu Compañero Perfecto",
      "Estilo y Funcionalidad",
      "Lujo Accesible"
    ]
  },

  // 10. Accesorios Tech
  10: {
    fontFamily: "Rajdhani, sans-serif",
    fontWeight: "600",
    fontSize: "2.6rem",
    letterSpacing: "0.08em",
    lineHeight: "1.2",
    suggestedColor: "#00ffff",
    backgroundColor: "rgba(0,0,0,0.8)",
    overlayOpacity: 0.7,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Tech Life",
      "Conecta tu Mundo",
      "Innovación en tus Manos",
      "Sin Límites"
    ]
  },

  // 11. Smartphones
  11: {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: "800",
    fontSize: "2.8rem",
    letterSpacing: "0.02em",
    lineHeight: "1.1",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.7)",
    overlayOpacity: 0.6,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "El Futuro es Ahora",
      "Potencia Infinita",
      "Captura Cada Momento",
      "Conectado al Máximo"
    ]
  },

  // 12. Computación
  12: {
    fontFamily: "Roboto Mono, monospace",
    fontWeight: "500",
    fontSize: "2.4rem",
    letterSpacing: "0.03em",
    lineHeight: "1.3",
    suggestedColor: "#00ff88",
    backgroundColor: "rgba(0,0,0,0.85)",
    overlayOpacity: 0.75,
    alignment: "left",
    textTransform: "uppercase",
    headlines: [
      "Code Your Dreams",
      "Productividad Sin Límites",
      "Potencia Profesional",
      "Trabaja Más Inteligente"
    ]
  },

  // 13. Gaming
  13: {
    fontFamily: "Orbitron, sans-serif",
    fontWeight: "900",
    fontSize: "3rem",
    letterSpacing: "0.1em",
    lineHeight: "1",
    suggestedColor: "#ff00ff",
    backgroundColor: "rgba(0,0,0,0.85)",
    overlayOpacity: 0.8,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Level Up",
      "Game On",
      "Dominio Total",
      "Victory Awaits"
    ]
  },

  // 14. Fotografía
  14: {
    fontFamily: "Cormorant Garamond, serif",
    fontWeight: "400",
    fontSize: "2.2rem",
    letterSpacing: "0.1em",
    lineHeight: "1.4",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.5)",
    overlayOpacity: 0.4,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Captura la Esencia",
      "Momentos Eternos",
      "Arte Visual",
      "Tu Historia en Imágenes"
    ]
  },

  // 15. Audio / Sonido
  15: {
    fontFamily: "Bebas Neue, sans-serif",
    fontWeight: "400",
    fontSize: "3rem",
    letterSpacing: "0.05em",
    lineHeight: "1",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.7)",
    overlayOpacity: 0.6,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Siente el Sonido",
      "Bass Drop",
      "Experiencia Auditiva",
      "Música que Move"
    ]
  },

  // 16. Relojes
  16: {
    fontFamily: "Cinzel, serif",
    fontWeight: "700",
    fontSize: "2.4rem",
    letterSpacing: "0.12em",
    lineHeight: "1.2",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.6)",
    overlayOpacity: 0.5,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Tiempo Perfecto",
      "Precisión Suiza",
      "Lujo Atemporal",
      "Tu Legado en el Tiempo"
    ]
  },

  // 17. Decoración
  17: {
    fontFamily: "Lora, serif",
    fontWeight: "400",
    fontSize: "2.2rem",
    letterSpacing: "0.03em",
    lineHeight: "1.4",
    suggestedColor: "#3d3d3d",
    backgroundColor: "rgba(255,255,255,0.9)",
    overlayOpacity: 0.85,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Tu Hogar, Tu Estilo",
      "Espacios que Inspiran",
      "Diseño con Alma",
      "Confort y Elegancia"
    ]
  },

  // 18. Muebles
  18: {
    fontFamily: "Merriweather, serif",
    fontWeight: "700",
    fontSize: "2.4rem",
    letterSpacing: "0.02em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.65)",
    overlayOpacity: 0.55,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Diseño que Vive",
      "Calidad que perdura",
      "Transforma tu Espacio",
      "Muebles con Personalidad"
    ]
  },

  // 19. Iluminación
  19: {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: "300",
    fontSize: "2.6rem",
    letterSpacing: "0.1em",
    lineHeight: "1.3",
    suggestedColor: "#ffd700",
    backgroundColor: "rgba(0,0,0,0.5)",
    overlayOpacity: 0.4,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Ilumina tu Vida",
      "Ambiente Perfecto",
      "Luz que Transforma",
      "Brillo sin Límites"
    ]
  },

  // 20. Electrodomésticos
  20: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: "500",
    fontSize: "2.2rem",
    letterSpacing: "0.03em",
    lineHeight: "1.4",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.7)",
    overlayOpacity: 0.6,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Tecnología para tu Hogar",
      "Facilidad Total",
      "Innovación Diaria",
      "Vida Más Fácil"
    ]
  },

  // ============================================
  // FASE 2: SERVICIOS Y LIFESTYLE (21-40)
  // ============================================

  // 21. Fitness / Gimnasio
  21: {
    fontFamily: "Bebas Neue, sans-serif",
    fontWeight: "900",
    fontSize: "3.2rem",
    letterSpacing: "0.02em",
    lineHeight: "1",
    suggestedColor: "#FFD700",
    backgroundColor: "rgba(0,0,0,0.75)",
    overlayOpacity: 0.65,
    alignment: "left",
    textTransform: "uppercase",
    headlines: [
      "Sin Excusas",
      "Resultados Reales",
      "Transforma tu Cuerpo",
      "Poder Total"
    ]
  },

  // 22. Restaurantes / Gastronomía
  22: {
    fontFamily: "Abril Fatface, serif",
    fontWeight: "400",
    fontSize: "2.6rem",
    letterSpacing: "0.02em",
    lineHeight: "1.2",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.55)",
    overlayOpacity: 0.45,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Sabor Auténtico",
      "Experiencia Gourmet",
      "Tradición y Sabor",
      "Sabores que Inspiran"
    ]
  },

  // 23. Bebidas / Licores
  23: {
    fontFamily: "Playfair Display, serif",
    fontWeight: "600",
    fontSize: "2.4rem",
    letterSpacing: "0.05em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.6)",
    overlayOpacity: 0.5,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Sabor Premium",
      "Brindis Perfecto",
      "Elegancia en Copa",
      "Tu Momento Especial"
    ]
  },

  // 24. Salud / Medicina
  24: {
    fontFamily: "Lato, sans-serif",
    fontWeight: "700",
    fontSize: "2rem",
    letterSpacing: "0.05em",
    lineHeight: "1.4",
    suggestedColor: "#0066cc",
    backgroundColor: "rgba(255,255,255,0.95)",
    overlayOpacity: 0.9,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Tu Salud Primero",
      "Cuidado de Expertos",
      "Bienestar Integral",
      "Confianza Médica"
    ]
  },

  // 25. Educación / Cursos
  25: {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: "700",
    fontSize: "2.4rem",
    letterSpacing: "0.03em",
    lineHeight: "1.3",
    suggestedColor: "#1a365d",
    backgroundColor: "rgba(255,255,255,0.95)",
    overlayOpacity: 0.9,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Aprende con los Mejores",
      "Conocimiento Real",
      "Futuro Brillante",
      "Transforma tu Carrera"
    ]
  },

  // 26. Inmobiliaria
  26: {
    fontFamily: "Cormorant Garamond, serif",
    fontWeight: "600",
    fontSize: "2.6rem",
    letterSpacing: "0.05em",
    lineHeight: "1.2",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.6)",
    overlayOpacity: 0.5,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Tu Hogar Ideal",
      "Inversiones Premium",
      "Propiedades de Lujo",
      "Sueños Hechos Realidad"
    ]
  },

  // 27. Automotriz / Autos
  27: {
    fontFamily: "Oswald, sans-serif",
    fontWeight: "700",
    fontSize: "3rem",
    letterSpacing: "0.03em",
    lineHeight: "1",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.7)",
    overlayOpacity: 0.6,
    alignment: "left",
    textTransform: "uppercase",
    headlines: [
      "Potencia y Estilo",
      "Conduce tu Sueño",
      "Libertad Total",
      "Calidad Automotriz"
    ]
  },

  // 28. Mascotas / Veterinaria
  28: {
    fontFamily: "Quicksand, sans-serif",
    fontWeight: "600",
    fontSize: "2.2rem",
    letterSpacing: "0.03em",
    lineHeight: "1.4",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.6)",
    overlayOpacity: 0.5,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Amor de Cuatro Patas",
      "Cuidado con Corazón",
      "Salud para tu Mascota",
      "Felicidad Compartida"
    ]
  },

  // 29. Viajes / Turismo
  29: {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: "300",
    fontSize: "2.6rem",
    letterSpacing: "0.1em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.5)",
    overlayOpacity: 0.4,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Explora el Mundo",
      "Aventuras Inolvidables",
      "Tu Próximo Destino",
      "Viaja sin Límites"
    ]
  },

  // 30. Eventos / Bodas
  30: {
    fontFamily: "Great Vibes, cursive",
    fontWeight: "400",
    fontSize: "3rem",
    letterSpacing: "0.05em",
    lineHeight: "1.2",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.4)",
    overlayOpacity: 0.35,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "El Día Perfecto",
      "Amor Eterno",
      "Momentos Mágicos",
      "Celebración Única"
    ]
  },

  // 31. Limpieza / Mantenimiento
  31: {
    fontFamily: "Roboto, sans-serif",
    fontWeight: "700",
    fontSize: "2.4rem",
    letterSpacing: "0.03em",
    lineHeight: "1.2",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,150,136,0.85)",
    overlayOpacity: 0.8,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Limpieza Perfecta",
      "Brillo y Frescura",
      "Confianza Total",
      "Servicio Profesional"
    ]
  },

  // 32. Construcción / Reformas
  32: {
    fontFamily: "Oswald, sans-serif",
    fontWeight: "700",
    fontSize: "2.8rem",
    letterSpacing: "0.03em",
    lineHeight: "1.1",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.7)",
    overlayOpacity: 0.6,
    alignment: "left",
    textTransform: "uppercase",
    headlines: [
      "Construyendo Futuros",
      "Calidad Garantizada",
      "Expertos en Obras",
      "Resultados que Perduran"
    ]
  },

  // 33. Servicios Profesionales / Jurídico
  33: {
    fontFamily: "Playfair Display, serif",
    fontWeight: "600",
    fontSize: "2.2rem",
    letterSpacing: "0.05em",
    lineHeight: "1.4",
    suggestedColor: "#1a365d",
    backgroundColor: "rgba(255,255,255,0.95)",
    overlayOpacity: 0.9,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Confianza y Experiencia",
      "Soluciones Legales",
      "Profesionalismo Total",
      "Resultados Garantizados"
    ]
  },

  // 34. Arte / Cultura
  34: {
    fontFamily: "Cormorant Garamond, serif",
    fontWeight: "400",
    fontSize: "2.4rem",
    letterSpacing: "0.08em",
    lineHeight: "1.4",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.5)",
    overlayOpacity: 0.4,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Arte en Movimiento",
      "Expresión sin Límites",
      "Cultura Viva",
      "Creatividad Pura"
    ]
  },

  // 35. Música / Entretenimiento
  35: {
    fontFamily: "Bebas Neue, sans-serif",
    fontWeight: "400",
    fontSize: "3.2rem",
    letterSpacing: "0.05em",
    lineHeight: "1",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.7)",
    overlayOpacity: 0.6,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Vive la Música",
      "Noche Épica",
      "Ritmo sin Fin",
      "Entretención Total"
    ]
  },

  // 36. Deportes
  36: {
    fontFamily: "Teko, sans-serif",
    fontWeight: "700",
    fontSize: "3rem",
    letterSpacing: "0.03em",
    lineHeight: "1",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.75)",
    overlayOpacity: 0.65,
    alignment: "left",
    textTransform: "uppercase",
    headlines: [
      "Gana o Pierde",
      "Pasión por el Deporte",
      "Campeón Interior",
      "Victoria Asegurada"
    ]
  },

  // 37. Hogar / Interiorismo
  37: {
    fontFamily: "Lora, serif",
    fontWeight: "400",
    fontSize: "2.2rem",
    letterSpacing: "0.03em",
    lineHeight: "1.4",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.55)",
    overlayOpacity: 0.45,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Hogar Soñado",
      "Diseño con Alma",
      "Espacios Lindos",
      "Confort Total"
    ]
  },

  // 38. Tecnología / Startups
  38: {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: "800",
    fontSize: "2.6rem",
    letterSpacing: "0.05em",
    lineHeight: "1.2",
    suggestedColor: "#00ffff",
    backgroundColor: "rgba(0,0,0,0.8)",
    overlayOpacity: 0.7,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Innovación Total",
      "El Futuro es Ahora",
      "Transforma tu Negocio",
      "Tecnología Avanzada"
    ]
  },

  // 39. Servicios Financieros
  39: {
    fontFamily: "Playfair Display, serif",
    fontWeight: "600",
    fontSize: "2.2rem",
    letterSpacing: "0.05em",
    lineHeight: "1.3",
    suggestedColor: "#1a365d",
    backgroundColor: "rgba(255,255,255,0.95)",
    overlayOpacity: 0.9,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Tu Futuro Financiero",
      "Invierte con Confianza",
      "Crecimiento Seguro",
      "Éxito Garantizado"
    ]
  },

  // 40. Alimentos / Comida Rápida
  40: {
    fontFamily: "Bebas Neue, sans-serif",
    fontWeight: "400",
    fontSize: "3rem",
    letterSpacing: "0.03em",
    lineHeight: "1",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(200,50,50,0.85)",
    overlayOpacity: 0.8,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Sabor Explosivo",
      "Rápido y Delicioso",
      "Tu Hambre, Nuestra Pasión",
      "Come sin Esperar"
    ]
  },

  // ============================================
  // FASE 3: ESPECIALIZADOS (41-60)
  // ============================================

  // 41. Salón de Belleza
  41: {
    fontFamily: "Playfair Display, serif",
    fontWeight: "500",
    fontSize: "2.4rem",
    letterSpacing: "0.08em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.5)",
    overlayOpacity: 0.4,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Belleza sin Esfuerzo",
      "Tu Mejor Versión",
      "Transformación Total",
      "Lujo y Cuidado"
    ]
  },

  // 42. Barbería
  42: {
    fontFamily: "Oswald, sans-serif",
    fontWeight: "700",
    fontSize: "2.8rem",
    letterSpacing: "0.05em",
    lineHeight: "1.1",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.7)",
    overlayOpacity: 0.6,
    alignment: "left",
    textTransform: "uppercase",
    headlines: [
      "Corte Clásico",
      "Estilo Masculino",
      "Tradición y Arte",
      "El Barbero Experto"
    ]
  },

  // 43. Gimnasio / Crossfit
  43: {
    fontFamily: "Teko, sans-serif",
    fontWeight: "700",
    fontSize: "3.2rem",
    letterSpacing: "0.03em",
    lineHeight: "1",
    suggestedColor: "#ff4444",
    backgroundColor: "rgba(0,0,0,0.8)",
    overlayOpacity: 0.7,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Ruptura Total",
      "Fuerza Extrema",
      "Sin Límites",
      "Supera Todo"
    ]
  },

  // 44. Piscina / Acuático
  44: {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: "300",
    fontSize: "2.6rem",
    letterSpacing: "0.1em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,150,200,0.7)",
    overlayOpacity: 0.6,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Frescura Total",
      "Verano Eterno",
      "Splash de Diversión",
      "Agua y Relax"
    ]
  },

  // 45. Hotel / Hospedaje
  45: {
    fontFamily: "Cormorant Garamond, serif",
    fontWeight: "500",
    fontSize: "2.4rem",
    letterSpacing: "0.08em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.5)",
    overlayOpacity: 0.4,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Escape Perfecto",
      "Lujo y Confort",
      "Tu Refugio Ideal",
      "Experiencia Exclusiva"
    ]
  },

  // 46. Restaurante Vegetariano
  46: {
    fontFamily: "Merriweather, serif",
    fontWeight: "400",
    fontSize: "2.2rem",
    letterSpacing: "0.03em",
    lineHeight: "1.4",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(34,139,34,0.8)",
    overlayOpacity: 0.7,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Sabor Natural",
      "Vegetariano con Alma",
      "Frescura en Plato",
      "Salud y Sabor"
    ]
  },

  // 47. Cafetería / Coffee Shop
  47: {
    fontFamily: "Lora, serif",
    fontWeight: "400",
    fontSize: "2.4rem",
    letterSpacing: "0.03em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(101,67, 33, 0.8)",
    overlayOpacity: 0.7,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Café con Alma",
      "Moments de Calma",
      "Aroma que Despierta",
      "Tu Rincón Favorito"
    ]
  },

  // 48. Heladería Artesanal
  48: {
    fontFamily: "Quicksand, sans-serif",
    fontWeight: "600",
    fontSize: "2.4rem",
    letterSpacing: "0.05em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(255,105,180,0.75)",
    overlayOpacity: 0.65,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Dulce Tentación",
      "Helado de Ensueño",
      "Frescura Artesanal",
      "Sabor Inolvidable"
    ]
  },

  // 49. Panadería Artesanal
  49: {
    fontFamily: "Merriweather, serif",
    fontWeight: "700",
    fontSize: "2.4rem",
    letterSpacing: "0.03em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(139,69,19,0.85)",
    overlayOpacity: 0.75,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Pan Casero",
      "Tradición en Cada Bocado",
      "Dorado y Crujiente",
      "Sabor de Casa"
    ]
  },

  // 50. Pastelería / Tortas
  50: {
    fontFamily: "Great Vibes, cursive",
    fontWeight: "400",
    fontSize: "3rem",
    letterSpacing: "0.05em",
    lineHeight: "1.2",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(255,182,193,0.7)",
    overlayOpacity: 0.6,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Dulce Tentación",
      "Momentos Especiales",
      "Celebración Perfecta",
      "Arte Dulce"
    ]
  },

  // 51. Carnicería
  51: {
    fontFamily: "Oswald, sans-serif",
    fontWeight: "700",
    fontSize: "2.6rem",
    letterSpacing: "0.03em",
    lineHeight: "1.2",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(139,0,0,0.8)",
    overlayOpacity: 0.7,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Carne Premium",
      "Calidad de Campo",
      "Frescura Garantizada",
      "Sabor Auténtico"
    ]
  },

  // 52. Verdulería
  52: {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: "600",
    fontSize: "2.2rem",
    letterSpacing: "0.05em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(34,139,34,0.85)",
    overlayOpacity: 0.75,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Frescura Natural",
      "Del Campo a tu Mesa",
      "Vitaminas y Salud",
      "Verduras de Calidad"
    ]
  },

  // 53. Tienda de Ropa
  53: {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: "700",
    fontSize: "2.4rem",
    letterSpacing: "0.05em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.6)",
    overlayOpacity: 0.5,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Moda con Estilo",
      "Tu Armario Ideal",
      "Tendencias del Momento",
      "Look Perfecto"
    ]
  },

  // 54. Zapatería
  54: {
    fontFamily: "Teko, sans-serif",
    fontWeight: "600",
    fontSize: "2.8rem",
    letterSpacing: "0.04em",
    lineHeight: "1.1",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.7)",
    overlayOpacity: 0.6,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Paso con Estilo",
      "Comodidad Total",
      "Calidad en Cada Paso",
      "Zapatos que Inspiran"
    ]
  },

  // 55. Joyería
  55: {
    fontFamily: "Cinzel, serif",
    fontWeight: "600",
    fontSize: "2.2rem",
    letterSpacing: "0.12em",
    lineHeight: "1.3",
    suggestedColor: "#ffd700",
    backgroundColor: "rgba(0,0,0,0.6)",
    overlayOpacity: 0.5,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Brillo Eterno",
      "Joyas de Ensueño",
      "Elegancia Absoluta",
      "Tesoro Personal"
    ]
  },

  // 56. Óptica
  56: {
    fontFamily: "Lato, sans-serif",
    fontWeight: "400",
    fontSize: "2rem",
    letterSpacing: "0.05em",
    lineHeight: "1.4",
    suggestedColor: "#0066cc",
    backgroundColor: "rgba(255,255,255,0.95)",
    overlayOpacity: 0.9,
    alignment: "center",
    textTransform: "uppercase",
    headlines: [
      "Claridad Visual",
      "Estilo y Salud",
      "Tu Mirada Perfecta",
      "Vision Premium"
    ]
  },

  // 57. Perfumería
  57: {
    fontFamily: "Cormorant Garamond, serif",
    fontWeight: "400",
    fontSize: "2.4rem",
    letterSpacing: "0.08em",
    lineHeight: "1.4",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.55)",
    overlayOpacity: 0.45,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Fragancia que Seduce",
      "Esencia de Elegancia",
      "Tu Firma Personal",
      "Aroma Inolvidable"
    ]
  },

  // 58. Regalería
  58: {
    fontFamily: "Quicksand, sans-serif",
    fontWeight: "600",
    fontSize: "2.2rem",
    letterSpacing: "0.03em",
    lineHeight: "1.4",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.6)",
    overlayOpacity: 0.5,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Regalo Perfecto",
      "Detalle con Amor",
      "Sorpresas Lindas",
      "Presentes Especiales"
    ]
  },

  // 59. Florería
  59: {
    fontFamily: "Great Vibes, cursive",
    fontWeight: "400",
    fontSize: "2.8rem",
    letterSpacing: "0.05em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,100,0,0.6)",
    overlayOpacity: 0.5,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Flores que Hablan",
      "Amor en Pétalos",
      "Belleza Natural",
      "Detalles Florales"
    ]
  },

  // 60. Mueblería
  60: {
    fontFamily: "Merriweather, serif",
    fontWeight: "700",
    fontSize: "2.4rem",
    letterSpacing: "0.03em",
    lineHeight: "1.3",
    suggestedColor: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.65)",
    overlayOpacity: 0.55,
    alignment: "center",
    textTransform: "capitalize",
    headlines: [
      "Hogar Soñado",
      "Muebles con Estilo",
      "Confort y Diseño",
      "Tu Espacio Perfecto"
    ]
  }
};

// ============================================
// UTILIDADES DE BÚSQUEDA
// ============================================

export function getTypographyConfig(id: number): TypographyConfig | null {
  return TYPOGRAPHY_GUIDE[id] || null;
}

export function getTypographyByName(name: string): TypographyConfig | null {
  const normalizedName = name.toLowerCase().trim();
  
  // Mapeo de nombres a IDs
  const nameToId: Record<string, number> = {
    'retail': 1,
    'moda mujer': 2,
    'moda hombre': 3,
    'calzado': 4,
    'joyas': 5,
    'óptica': 6,
    'belleza': 7,
    'perfumería': 8,
    'bolsos': 9,
    'accesorios tech': 10,
    'smartphones': 11,
    'computación': 12,
    'gaming': 13,
    'fotografía': 14,
    'audio': 15,
    'relojes': 16,
    'decoración': 17,
    'muebles': 18,
    'iluminación': 19,
    'electrodomésticos': 20,
    'fitness': 21,
    'gimnasio': 21,
    'restaurantes': 22,
    'gastronomía': 22,
    'bebidas': 23,
    'licores': 23,
    'salud': 24,
    'medicina': 24,
    'educación': 25,
    'cursos': 25,
    'inmobiliaria': 26,
    'automotriz': 27,
    'autos': 27,
    'mascotas': 28,
    'veterinaria': 28,
    'viajes': 29,
    'turismo': 29,
    'eventos': 30,
    'bodas': 30,
    'limpieza': 31,
    'mantenimiento': 31,
    'construcción': 32,
    'reformas': 32,
    'servicios profesionales': 33,
    'jurídico': 33,
    'arte': 34,
    'cultura': 34,
    'música': 35,
    'entretenimiento': 35,
    'deportes': 36,
    'hogar': 37,
    'interiorismo': 37,
    'tecnología': 38,
    'startups': 38,
    'servicios financieros': 39,
    'comida rápida': 40,
    'alimentos': 40,
    'salón de belleza': 41,
    'barbería': 42,
    'crossfit': 43,
    'piscina': 44,
    'acuático': 44,
    'hotel': 45,
    'hospedaje': 45,
    'vegetariano': 46,
    'cafetería': 47,
    'coffee shop': 47,
    'heladería': 48,
    'panadería': 49,
    'pastelería': 50,
    'tortas': 50,
    'carnicería': 51,
    'verdulería': 52,
    'tienda de ropa': 53,
    'ropa': 53,
    'zapatería': 54,
    'zapatos': 54,
    'regalería': 58,
    'regalos': 58,
    'florería': 59,
    'flores': 59,
    'mueblería': 60
  };

  const id = nameToId[normalizedName];
  if (id) {
    return TYPOGRAPHY_GUIDE[id] || null;
  }

  return null;
}

export function getRandomHeadline(id: number): string {
  const config = TYPOGRAPHY_GUIDE[id];
  if (config && config.headlines && config.headlines.length > 0) {
    return config.headlines[Math.floor(Math.random() * config.headlines.length)];
  }
  return "Calidad Profesional";
}

// ============================================
// EXPORT PARA CONSUMO EXTERNO
// ============================================

export const TYPOGRAPHY_SYSTEM = {
  catalog: TYPOGRAPHY_GUIDE,
  totalConfigs: 60,
  version: "1.0.0",
  updated: new Date().toISOString(),
  
  // Funciones
  getById: getTypographyConfig,
  getByName: getTypographyByName,
  getRandomHeadline: getRandomHeadline
};
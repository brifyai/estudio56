# 🎨 Sistema de Dirección de Arte Profesional - Estudio 56

## Resumen Ejecutivo

Este documento describe la implementación del sistema de **Dirección de Arte Profesional** para la aplicación Estudio 56. El sistema transforma un editor de imágenes genérico en una herramienta de nivel agencia, generando prompts que "contratan virtualmente" a un fotógrafo y diseñador editorial para cada rubro.

---

## 📁 Estructura de Archivos

```
estudio-56/
├── src/
│   ├── constants/
│   │   ├── artDirection.ts          ← Configuración de 20 rubros
│   │   └── promptModifiers.ts       ← Modificadores existentes
│   ├── services/
│   │   └── promptBuilder.ts         ← Funciones de construcción de prompts
│   ├── hooks/
│   │   └── useArtDirection.ts       ← Hook personalizado
│   └── components/
│       └── StoryArtButton.tsx       ← UI del botón STORY ART
└── types.ts                         ← Tipos TypeScript
```

---

## 🎯 Los 20 Rubros Implementados

| ID | Rubro | Estilo Visual | Prompt Clave |
|----|-------|---------------|--------------|
| 1 | Retail General | Commercial limpio | `Clean commercial photography, studio lighting` |
| 2 | Moda Mujer | Editorial elegante | `Fashion editorial look, soft daylight` |
| 3 | Moda Hombre | Streetwear urbano | `Urban streetwear vibe, harsh shadows` |
| 4 | Calzado | Acción dinámica | `Dynamic low-angle shot, focus on sole texture` |
| 5 | Joyas | Macro de lujo | `Extreme macro photography, bokeh highlights` |
| 6 | Óptica | Médico-moderno | `Sharp focus on lenses, symmetrical composition` |
| 7 | Belleza/Cosmética | Soft glow | `Dewy skin textures, soft-focus pastel backgrounds` |
| 8 | Perfumería | Etérea | `Ethereal lighting, glass transparency effects` |
| 9 | Bolsos/Carteras | Flat-lay editorial | `Flat-lay editorial, focus on leather grain` |
| 10 | Accesorios Tech | Cyber-clean | `Cyber-clean aesthetic, matte black surfaces` |
| 11 | Smartphones | Tech futurista | `Glossy screen reflections, floating gadget` |
| 12 | Computación | Setup profesional | `Deep shadows, glowing keyboard accents` |
| 13 | Gaming | Esports RGB | `High-energy RGB saturation, glitch art` |
| 14 | Fotografía | Vintage analógico | `Vintage camera aesthetic, warm lens flare` |
| 15 | Audio/Sonido | Club moody | `Visual sound waves, matte textures` |
| 16 | Relojes | Joyería técnica | `Watchmaker precision shot, moving gears` |
| 17 | Decoración | Interior magazine | `Interior design magazine style, symmetry` |
| 18 | Muebles | Catalog profesional | `Studio furniture catalog, wood grain focus` |
| 19 | Iluminación | Light trails | `High-contrast light and shadow play` |
| 20 | Electrodomésticos | Stainless clean | `Stainless steel reflections, bright high-key` |

---

## 🔧 Estructura del Prompt Generado

```
ASSET: [Producto del usuario]

PRODUCT_DETAILS: [Detalles opcionales]

ART_DIRECTION: [Prompt específico del rubro]

SAFE_ZONE_GUIDELINES:
- Keep all critical text and logos within the center 60% of the frame
- Avoid placing important elements in the top 15% and bottom 20%
- Ensure headline text is legible at small sizes
- Maintain 10% padding from all edges
- Vertical composition optimized for 9:16 (1080x1920)

NEGATIVE_PROMPT: [Agency Standard + Rubro específico]

OUTPUT_FORMAT: Professional flyer/advertisement image, 9:16 aspect ratio...
```

---

## 📱 Uso del Componente UI

### Integración básica:

```tsx
import { StoryArtButton } from './components/StoryArtButton';
import { useArtDirection } from './hooks/useArtDirection';

function MiComponente() {
  const {
    contentType,
    applyArtDirection,
    getCurrentPrompt,
    isStoryArtActive
  } = useArtDirection({ initialIndustryId: 4 });

  const handleGenerate = async () => {
    const result = await applyArtDirection(
      4,                    // ID del rubro (Calzado)
      'zapatillas running', // Sujeto
      'precio oferta $39.990' // Detalles
    );

    if (result.success) {
      console.log('Prompt generado:', result.prompt);
      console.log('Configuración:', result.config);
    }
  };

  return (
    <div>
      <StoryArtButton
        industryId={4}
        subject="zapatillas running"
        details="precio oferta $39.990"
        onPromptGenerated={(result) => {
          console.log('Dirección de arte aplicada:', result);
        }}
        onContentTypeChange={(type) => {
          console.log('Tipo de contenido:', type);
        }}
      />
      
      {isStoryArtActive && (
        <button onClick={handleGenerate}>
          Generar con Dirección de Arte
        </button>
      )}
    </div>
  );
}
```

---

## 🔍 Búsqueda de Rubros por Nombre

```typescript
import { findArtDirectionByName } from './src/constants/artDirection';

// Búsqueda flexible por nombre
const config = findArtDirectionByName('zapatillas');
// → Retorna configuración del rubro 4 (Calzado)

const config2 = findArtDirectionByName('perfume');
// → Retorna configuración del rubro 8 (Perfumería)

// Mapeo de nombres comunes
const mappings = {
  'zapatillas': 4,
  'zapatos': 4,
  'reloj': 16,
  'joyas': 5,
  'bolsos': 9,
  'moda mujer': 2,
  'moda hombre': 3,
  'tech': 10,
  'celular': 11,
  'gaming': 13,
  'perfume': 8,
  'belleza': 7,
  'óptica': 6,
  'muebles': 18,
  'decoración': 17,
  'iluminación': 19,
  'electrodomésticos': 20,
  'audio': 15,
  'fotografía': 14,
  'retail': 1
};
```

---

## 🚫 Negative Prompt Agency Estándar

```typescript
export const AGENCY_NEGATIVE_PROMPT = 
  '(low quality, blurry text, amateur layout, stretched image, ' +
  'cheap flyer, cluttered design, inconsistent branding, ' +
  'poor color harmony, amateur typography, low resolution, ' +
  'watermark visible, text overlay errors, distorted product, ' +
  'uneven exposure, amateur photography, stock photo look, ' +
  'inconsistent style, overprocessed, AI artifacts, ' +
  'bad composition, rule of thirds violated, poor visual hierarchy)';
```

---

## 📐 Safe Zone para Social Media 9:16

```
┌─────────────────────────┐
│    ████████████████     │  ← Top 15% (Status bar - EVITAR)
│                         │
│   ┌─────────────────┐   │
│   │                 │   │
│   │   ZONA SEGURA   │   │  ← Center 60% (Mantener texto aquí)
│   │   (60% width)   │   │
│   │                 │   │
│   └─────────────────┘   │
│                         │
│    ████████████████     │  ← Bottom 20% (UI elements - EVITAR)
└─────────────────────────┘
```

---

## 🎨 Integración con Flujo Existente

### 1. En el formulario de generación:

```typescript
// Si el usuario selecciona STORY ART, usar dirección de arte
if (contentType === 'story_art' && artDirectionApplied) {
  prompt = getCurrentPrompt(); // Prompt de dirección de arte
} else {
  prompt = buildPrompt({ industryBase, userDetails, realityMode });
}
```

### 2. Validación de créditos:

```typescript
// STORY ART puede tener costo adicional por ser "nivel agencia"
const creditCost = contentType === 'story_art' ? 2 : 1;
```

### 3. Tracking de uso:

```typescript
// Registrar qué rubros usan dirección de arte
analytics.track('art_direction_used', {
  rubro_id: industryId,
  rubro_name: artConfig?.rubro,
  content_type: 'story_art'
});
```

---

## 🔄 Próximos Rubros (21-40)

La arquitectura está preparada para expandir a más rubros:

```typescript
// Ejemplo de cómo agregar rubro 21 (Gimnasio)
export const ART_DIRECTION_PROMPTS: Record<number, ArtDirectionConfig> = {
  // ... existentes 1-20 ...
  21: {
    id: 21,
    rubro: 'Gimnasio/Fitness',
    prompt: `High-energy fitness photography, dramatic gym lighting, 
             sweat and effort visible, bold athletic typography, 
             motivational poster aesthetic. Professional fitness 
             campaign look with clean equipment background.`,
    negativePrompt: '(low quality, blurry, amateur gym photo, 
                     poor lighting, dated equipment, stock photo look)',
    aspectRatio: '9:16',
    style: 'fitness-athletic'
  },
  // ... más rubros ...
};
```

---

## ✅ Checklist de Calidad

- [x] 20 rubros implementados con prompts detallados
- [x] Negative prompts específicos por rubro
- [x] Safe zone para Social Media 9:16
- [x] Componente UI con feedback visual
- [x] Hook personalizado para gestión de estado
- [x] Búsqueda flexible por nombre de rubro
- [x] Tipos TypeScript completos
- [x] Documentación técnica

---

## 📊 Métricas de Éxito

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| Tasa de adopción STORY ART | >30% de usuarios | Analytics |
| Calidad visual percibida | >4.5/5 estrellas | Survey |
| Tiempo de generación | <5 segundos extra | Performance |
| Errores de prompt | <1% | Error tracking |

---

## 🛡️ Consideraciones de Seguridad

1. **Sanitización de inputs**: Todos los inputs del usuario se sanitizan
2. **Palabras prohibidas**: Sistema de filtering de keywords
3. **Validación de tipos**: TypeScript previene errores de tipo
4. **Fallback automático**: Si no hay dirección de arte, usa modo estándar

---

## 📝 Changelog

### v1.0.0 (2026-01-03)
- ✅ Implementación inicial de 20 rubros
- ✅ Componente StoryArtButton
- ✅ Hook useArtDirection
- ✅ Documentación técnica completa
- ✅ Integración con promptBuilder existente

---

**Desarrollado para Estudio 56**  
*Transformando herramientas de diseño en soluciones de nivel agencia.*
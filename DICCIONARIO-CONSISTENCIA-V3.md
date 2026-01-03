# 📋 Diccionario de Advertencias de Consistencia (v3.0)

## Descripción General

Sistema de "fricción positiva" que detecta cuando el usuario está mezclando conceptos contradictorios (ej: pedir velas en un rubro de Pilates) y muestra advertencias con el tono "Chileno Premium" antes de generar el flyer.

## Archivos del Sistema

### 1. `constants.ts`
Contiene las constantes principales:
- `CONSISTENCY_CONFLICTS`: Diccionario con 24 códigos de conflicto y sus mensajes
- `CONFLICT_DETECTION_RULES`: Reglas de detección con keywords y estilos objetivo

### 2. `services/consistencyCheckService.ts`
Servicio con funciones utilitarias:
- `checkConsistency(input)`: Detecta conflictos
- `getConflictSummary(result)`: Genera resumen para debugging
- `validateStyleForCategory(style, category)`: Valida estilos por categoría

### 3. `components/ConsistencyWarningDialog.tsx`
Componente React con integración SweetAlert2:
- `ConsistencyWarningDialog`: Componente visual
- `showConsistencyWarning()`: Función utilitaria
- `useConsistencyCheck()`: Hook personalizado

## Códigos de Conflicto Implementados

### Bloque 1: Salud y Bienestar
| Código | Título | Descripción |
|--------|--------|-------------|
| PILATES_SPA | ¿Estás seguro, jefe? | Velas/masajes en Pilates |
| YOGA_INTENSE | ¡Namasté... pero con calma! | Crossfit en Yoga |
| KINE_GYM | ¡Aguante un poco! | Gimnasio en Kinesiología |
| DENTAL_HOSPITAL | ¡Cuidado! | Cirugía mayor en Dental |
| VET_STYLING | ¡Atención! | Cortes de pelo en Veterinaria |
| NAIL_HAIR | ¡Atención a las manos! | Peluquería en Nail Studio |

### Bloque 2: Técnico e Industrial
| Código | Título | Descripción |
|--------|--------|-------------|
| TALLER_LUXURY | Mire, jefe... | Lujo en taller mecánico |
| FERRE_BOUTIQUE | ¡Mire, jefe! | Boutique en ferretería |
| CONSTR_DECO | ¡Se nos pasó la mano! | Decoración en construcción |
| LOGISTICA_RETAIL | ¡Ojo con la carga! | Retail en logística |
| DETA_WASH | ¡Ojo ahí! | Lavado callejero en Detailing |
| TECH_REPAIR_MESS | ¡Ojo con los cables! | Desorden en servicio técnico |

### Bloque 3: Gastronomía
| Código | Título | Descripción |
|--------|--------|-------------|
| PAN_GOURMET | ¡Cuidado! | Gourmet en panadería |
| SUSHI_FASTFOOD | ¡Un momento, maestro! | Fastfood en sushi |
| PIZZA_ITALIAN | ¡Epa! | Formal en pizzería |
| PASTEL_BAJON | ¡Cuidado con el azúcar! | Bajón en pastelería |
| FERIA_SUPER | ¡Caserito, escúcheme! | Industrial en feria |

### Bloque 4: Comercio y Servicios
| Código | Título | Descripción |
|--------|--------|-------------|
| BOTI_DISCO | ¡Tranquilein! | Disco en botillería |
| BARBER_SPA | ¡Tranquilo, compadre! | Spa en barbería |
| FURGON_RACING | ¡Ojo con el exceso de velocidad! | Carrera en furgón escolar |
| TRAVEL_CLINIC | ¡Cuidado con el destino! | Administrativo en viajes |
| SEGURIDAD_WAR | ¡Tranquilo, Rambo! | Guerra en seguridad |
| TATTOO_CLINIC | ¡Cuidado con el estilo! | Clínico en tattoo |

## Integración en FlyerForm.tsx

```tsx
import { showConsistencyWarning } from '../components/ConsistencyWarningDialog';

const handleGenerate = async () => {
  // 1. Verificar consistencia antes de generar
  const warningResult = await showConsistencyWarning(
    description, 
    selectedStyle
  );

  if (warningResult === 'cancelled') {
    return; // Usuario decidió corregir
  }

  // 2. Continuar con generación normal
  // ... lógica de generación
};
```

## Integración en Modo Magia

```tsx
import { useConsistencyCheck } from '../components/ConsistencyWarningDialog';

const MagicModeForm = () => {
  const { checkConsistencyWarning } = useConsistencyCheck();

  const handleMagicGenerate = async () => {
    await checkConsistencyWarning(
      magicDescription,
      detectedStyle,
      () => {
        // Continuar generación
        executeMagicGeneration();
      },
      () => {
        // Abrir editor manual
        setShowManualEditor(true);
      }
    );
  };
};
```

## Personalización de Colores SweetAlert2

```javascript
Swal.fire({
  title: 'Título',
  text: 'Mensaje',
  icon: 'warning',
  confirmButtonColor: '#f39c12',  // Naranja
  cancelButtonColor: '#3085d6',   // Azul
  background: '#1a1a2e',          // Oscuro
  color: '#ffffff'                // Texto blanco
});
```

## Beneficios del Sistema

1. **Ahorro de créditos**: Evita generar flyers que se verán mal
2. **Percepción de expertiz**: Estudio 56 parece conocer el mercado chileno
3. **Fricción positiva**: El usuario se siente guiado, no bloqueado
4. **Tono local**: El "Chileno Premium" crea conexión emocional

## Próximos Pasos

- [ ] Agregar más reglas de detección
- [ ] Integrar con analytics para medir efectividad
- [ ] Crear dashboard de conflictos más frecuentes
- [ ] Agregar traducciones para otros mercados
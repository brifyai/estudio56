# Nivel de Realidad en Generación de Nuevo Borrador

## Respuesta Directa
Cuando se genera un **nuevo borrador**, la imagen se crea con el nivel de realidad **1.5 ★ (Cámara Espía)**.

## Detalles Técnicos

### Valor por Defecto
```typescript
// App.tsx línea 218
const [realityLevel, setRealityLevel] = useState<number>(1.5);
```

### Reset al Generar Nuevo Borrador
```typescript
// App.tsx línea 958
setRealityLevel(1.5); // RESETEAR a Cámara Espía
setIsRealityVariation(false);
setRealityVariations({});
```

### Uso en Generación
```typescript
// App.tsx línea 1278
realityLevel // 🎚️ Pasar nivel de realidad (1.5 por defecto)
```

## Características del Nivel 1.5 ★

### Nombre
**"Cámara Espía"** 📸

### Categoría
**AUTÉNTICO** (Rango: 1.5 - 2.5 estrellas)

### Descripción Visual
- Granulado
- Saturación baja
- Óptica deficiente
- Resolución 720p
- Look "captura in fraganti"

### Perfil Técnico
```typescript
{
  stars: 1.5,
  label: "Cámara Espía",
  category: "AUTENTICO",
  description: "Granulado, saturación baja, óptica deficiente, 720p",
  technicalProfile: "Captura 'In fraganti'"
}
```

### Modificadores de Prompt
**Agregar:**
- amateur photo
- smartphone camera
- natural but imperfect
- authentic everyday look
- auto white balance artifacts
- mixed lighting sources
- slight color cast

**Remover:**
- professional photography
- studio
- perfect lighting
- magazine quality
- perfect color harmony

## Razón de Elección

El nivel **1.5 ★ (Cámara Espía)** fue elegido como predeterminado porque:

1. **Look auténtico y cercano** - Ideal para negocios locales chilenos
2. **Genera confianza** - Se ve real, no artificial
3. **Punto medio** - Entre "Crudo" (1.0) y "Auténtico" (2.0-2.5)
4. **Recomendado para clientes locales** - Según el tooltip del slider

## Comportamiento del Sistema

### Primera Generación
1. Usuario ingresa descripción
2. Sistema genera imagen con `realityLevel = 1.5`
3. Imagen se guarda en caché como nivel base (1.5★)

### Generar Nuevo Borrador
1. Usuario hace clic en "Genera nuevo borrador"
2. Sistema resetea `realityLevel = 1.5`
3. Limpia variaciones anteriores
4. Genera nueva imagen con nivel 1.5★

### Cambiar Nivel de Realidad
1. Usuario mueve el slider a otro nivel (ej: 3.0★)
2. Sistema genera variación con nuevo nivel
3. Mantiene imagen original (1.5★) en caché para comparación

## Niveles Disponibles
```
1.0 ★ - Crudo (📱 Celular Viejo)
1.5 ★ - Auténtico (📸 Cámara Espía) ← PREDETERMINADO
2.0 ★ - Auténtico (🏪 Auténtico)
2.5 ★ - Auténtico (✨ Profesional)
3.0 ★ - Profesional
3.5 ★ - Profesional
4.0 ★ - Aspiracional
4.5 ★ - Aspiracional
5.0 ★ - Lujo (🏆 Lujo)
```

## Archivos Relacionados
- `App.tsx` (líneas 218, 958, 1278)
- `services/realityMapper.ts` (configuración de niveles)
- `services/realitySliderService.ts` (lógica de generación)
- `components/RealitySlider.tsx` (UI del slider)

## Fecha
8 de enero de 2026

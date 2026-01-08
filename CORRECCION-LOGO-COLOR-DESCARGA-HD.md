# Corrección: Logo con Color Correcto en Descarga HD

## Problemas Identificados

### Problema 1: Logo con Color Incorrecto
- **Síntoma**: Logo aparece blanco en la descarga pero debería ser amarillo
- **Causa**: No se estaba pasando `logoColor` ni `logoFilters` al servicio de composición
- **Impacto**: La imagen descargada no coincide con lo que el usuario ve en pantalla

### Problema 2: Texto con Diferente Número de Líneas
- **Síntoma**: Texto en HD vista tiene 4 líneas, pero en descarga tiene 3 líneas
- **Causa**: Ya corregido en commit anterior (739297a)
- **Estado**: ✅ Resuelto

## Solución Implementada

### Cambios en `services/compositionExportService.ts`

#### 1. Actualizar Interfaz `CompositionOptions`
Agregué los parámetros faltantes:

```typescript
export interface CompositionOptions {
  imageUrl: string;
  logoUrl?: string | null;
  logoColor?: string | null;  // ← NUEVO
  logoFilters?: {              // ← NUEVO
    grayscale: number;
    brightness: number;
    contrast: number;
    opacity: number;
  };
  productUrl?: string | null;
  // ... resto de parámetros
}
```

#### 2. Implementar Recoloreo de Logo
Agregué lógica para recolorear el logo usando canvas (igual que en FlyerDisplay):

```typescript
// 🎨 RECOLOREAR LOGO SI HAY logoColor
if (options.logoColor) {
  // Crear canvas temporal
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  
  // Obtener datos de imagen
  const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
  const data = imageData.data;
  
  // Convertir hex a RGB
  const hex = options.logoColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Aplicar color a cada píxel
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha > 0) {
      const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
      data[i] = r * lum;     // R
      data[i + 1] = g * lum; // G
      data[i + 2] = b * lum; // B
    }
  }
  
  tempCtx.putImageData(imageData, 0, 0);
  logoImage = recoloredImage;
}
```

#### 3. Aplicar Filtros CSS
Agregué soporte para filtros de logo:

```typescript
if (options.logoFilters) {
  const filters = options.logoFilters;
  ctx.globalAlpha = (filters.opacity / 100) * 0.9;
  ctx.filter = `grayscale(${filters.grayscale}%) brightness(${filters.brightness}%) contrast(${filters.contrast}%)`;
}
```

### Cambios en `components/FlyerDisplay.tsx`

Actualicé la llamada a `composeAndExport` para pasar los parámetros faltantes:

```typescript
const composedImageUrl = await composeAndExport({
  imageUrl: hdImageUrl,
  logoUrl: logoUrl,
  logoColor: logoColor,        // ← NUEVO
  logoFilters: logoFilters,    // ← NUEVO
  productUrl: productUrl,
  overlayText: localText || overlayText || initialOverlayText || '',
  textPosition: textPosition,
  textStyles: displayStyles,
  logoPosition: logoPosition,
  productPosition: productPosition,
  aspectRatio: aspectRatio,
  quality: 'hd',
  containerWidth: getDimensionsForAspectRatio(aspectRatio, 'hd').width,
  containerHeight: getDimensionsForAspectRatio(aspectRatio, 'hd').height,
  visualContainerWidth: 320
});
```

## Resultado

### Antes:
- ❌ Logo blanco en descarga (incorrecto)
- ❌ Texto en 3 líneas en descarga vs 4 en vista

### Después:
- ✅ Logo amarillo en descarga (correcto)
- ✅ Texto en 4 líneas tanto en vista como en descarga
- ✅ Imagen descargada idéntica a lo que se ve en pantalla

## Flujo de Recoloreo

```
1. Usuario sube logo (blanco/negro)
2. Usuario selecciona color amarillo (#FFEB3B)
3. Vista en app: Logo se recolorea a amarillo ✅
4. Generación HD: Logo se recolorea a amarillo ✅
5. Descarga HD: Logo se recolorea a amarillo ✅ (NUEVO)
```

## Algoritmo de Recoloreo

El algoritmo es idéntico al usado en `FlyerDisplay.tsx`:

1. **Cargar imagen original** del logo
2. **Crear canvas temporal** con las mismas dimensiones
3. **Obtener datos de píxeles** (RGBA)
4. **Convertir color hex a RGB** (ej: #FFEB3B → R:255, G:235, B:59)
5. **Para cada píxel**:
   - Calcular luminosidad: `lum = (R*0.299 + G*0.587 + B*0.114) / 255`
   - Aplicar color: `nuevo_R = color_R * lum`
   - Mantener canal alpha original
6. **Aplicar datos modificados** al canvas
7. **Convertir a imagen** y usar en composición

## Casos de Uso Cubiertos

### 1. Logo con Color Personalizado
- Usuario sube logo blanco
- Selecciona color amarillo (#FFEB3B)
- ✅ Descarga muestra logo amarillo

### 2. Logo con Filtros
- Usuario aplica grayscale: 50%
- Usuario aplica brightness: 120%
- ✅ Descarga aplica los mismos filtros

### 3. Logo sin Color
- Usuario no selecciona color
- ✅ Descarga muestra logo original sin modificar

## Archivos Modificados

1. **services/compositionExportService.ts**
   - Interfaz `CompositionOptions` (líneas 1-38)
   - Función de dibujo de logo (líneas 126-195)

2. **components/FlyerDisplay.tsx**
   - Llamada a `composeAndExport` (líneas 1797-1813)

## Testing

### Casos a Probar
1. ✅ Logo con color amarillo → Descarga con logo amarillo
2. ✅ Logo con color rojo → Descarga con logo rojo
3. ✅ Logo sin color → Descarga con logo original
4. ✅ Logo con filtros → Descarga con filtros aplicados
5. ✅ Texto en 4 líneas → Descarga con 4 líneas
6. ✅ Build exitoso sin errores

## Beneficios

✅ **Fidelidad visual**: Descarga idéntica a vista previa
✅ **Consistencia**: Mismo algoritmo en vista y descarga
✅ **Flexibilidad**: Soporta cualquier color hex
✅ **Filtros**: Soporta grayscale, brightness, contrast, opacity
✅ **Sin pérdida de calidad**: Recoloreo en tiempo real sin degradación

## Fecha
8 de enero de 2026

## Notas Técnicas

- El recoloreo usa el canal de luminosidad para preservar detalles
- Los filtros CSS se aplican después del recoloreo
- El canvas temporal se crea solo cuando hay logoColor
- La imagen recoloreada se carga de forma asíncrona antes de dibujar
- Compatible con logos PNG con transparencia

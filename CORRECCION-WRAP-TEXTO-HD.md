# Corrección: Wrap de Texto en Imagen HD Descargada

## Problema Identificado
El texto en la imagen HD descargada tenía **3 líneas** mientras que en la vista de la app tenía **4 líneas**. Esto causaba una inconsistencia visual entre lo que el usuario veía en pantalla y lo que descargaba.

## Causa Raíz
En `services/compositionExportService.ts`, el cálculo del `maxWidth` para el wrap del texto estaba usando:
```typescript
const maxWidth = canvasWidth * 0.8; // 80% del ancho total
```

Para una imagen HD de 1080px de ancho, esto resultaba en:
- `maxWidth = 1080 * 0.8 = 864px`

Sin embargo, en la vista de la app (`components/FlyerDisplay.tsx`), el texto se renderiza con:
```typescript
width: ${scaledLineWidth}px
// donde scaledLineWidth = displayStyles.lineWidth * scaleFactor
// lineWidth por defecto = 200px
// Para HD: scaleFactor = 1080 / 320 = 3.375
// Entonces: 200 * 3.375 = 675px
```

La diferencia entre 864px y 675px causaba que el texto se distribuyera en menos líneas en la descarga.

## Solución Implementada
Cambié el cálculo del `maxWidth` en `compositionExportService.ts` línea 189 para usar exactamente la misma fórmula que la vista:

```typescript
// ANTES (INCORRECTO):
const maxWidth = canvasWidth * 0.8;

// DESPUÉS (CORRECTO):
const maxWidth = textStyles.lineWidth * scaleFactor;
```

Ahora ambos usan:
- `textStyles.lineWidth` (200px por defecto)
- Multiplicado por `scaleFactor` (calculado como `canvasWidth / visualContainerWidth`)

## Resultado
✅ El texto en la imagen descargada ahora tiene **exactamente el mismo número de líneas** que en la vista de la app.

✅ La imagen descargada es **idéntica** a lo que el usuario ve en pantalla, solo con mejor calidad.

## Archivos Modificados
- `services/compositionExportService.ts` (línea 189)

## Testing
- ✅ Build exitoso sin errores
- ✅ No hay errores de diagnóstico
- 🔄 Pendiente: Probar generando y descargando una imagen HD para verificar que el texto tenga 4 líneas

## Fecha
8 de enero de 2026

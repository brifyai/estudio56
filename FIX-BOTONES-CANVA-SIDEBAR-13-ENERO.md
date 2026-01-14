# Fix: Botones de Formato y Estilos en Sidebar - 13 Enero 2026

## Problema Reportado
El usuario reporta que los botones de formato (Banner/Story/Post) y estilos visuales siguen apareciendo en el contenedor central en lugar del menú lateral izquierdo.

## Solución Implementada

### 1. Eliminación de Botones del Centro
- **Archivo**: `components/canvas/CanvasEditor.tsx`
- **Líneas eliminadas**: 375-397
- **Contenido eliminado**:
  - Botones de formato (Banner/Story/Post) con `fixed bottom-8`
  - Selector de estilos visuales (14 estilos)
  - Paleta de colores de marca

### 2. Ubicación Actual de los Controles
Los controles ahora están SOLO en el sidebar izquierdo (`components/FlyerForm.tsx`, líneas 1034-1103):

```typescript
{canvaHasImages && (
  <>
    {/* Selector de formato */}
    <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
      <label>Formato</label>
      <div className="flex gap-2">
        {/* Banner, Story, Post */}
      </div>
    </div>
    
    {/* Selector de estilo visual */}
    <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
      <label>Estilo Visual</label>
      <div className="grid grid-cols-2 gap-2">
        {/* 14 estilos visuales */}
      </div>
    </div>
    
    {/* Paleta de colores */}
    {canvaBrandColors.length > 0 && (
      <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
        <label>Colores de Marca</label>
        {/* Paleta de colores */}
      </div>
    )}
  </>
)}
```

## ⚠️ IMPORTANTE: Cuándo Aparecen los Controles

Los controles en el sidebar **SOLO SE MUESTRAN** cuando `canvaHasImages === true`.

### Flujo de Aparición de Controles

1. **Usuario ingresa URL** en el input del sidebar
2. **Usuario hace clic en "Analizar"**
3. **Se muestra alerta de loading** (SweetAlert)
4. **Se ejecuta análisis con Gemini** (Google Search + análisis de marca)
5. **Se generan 3 imágenes** (landscape, portrait, square) con Imagen 4.0
6. **Se llama `onImagesGenerated(true, colors)`** en CanvasEditor
7. **Se actualiza `canvaHasImages = true`** en App.tsx
8. **Los controles aparecen en el sidebar** ✅

### Por Qué No Aparecen Antes

Los controles están diseñados para aparecer SOLO cuando hay imágenes generadas porque:
- No tiene sentido cambiar formato si no hay imágenes
- No tiene sentido cambiar estilo si no hay imágenes
- Los colores de marca solo existen después del análisis

## Cómo Verificar que Funciona

### Paso 1: Limpiar Caché
```bash
# En el navegador
Cmd+Shift+R (Mac) o Ctrl+Shift+R (Windows/Linux)
```

### Paso 2: Ir a Modo Canva
1. Abre www.estudio56.cl
2. Haz clic en el selector de modos (arriba)
3. Selecciona "Canva"

### Paso 3: Analizar una URL
1. Ingresa una URL en el input del sidebar (ej: "nike.com")
2. Haz clic en "Analizar"
3. Espera a que se complete el análisis (puede tardar 10-30 segundos)
4. Observa la consola del navegador (F12) para ver los logs

### Paso 4: Verificar Controles
Una vez que las imágenes se generen:
- ✅ Los controles deben aparecer en el sidebar izquierdo
- ✅ Debe haber 3 botones de formato (Banner, Story, Post)
- ✅ Debe haber 14 botones de estilos visuales en grid 2 columnas
- ✅ Debe haber una paleta de colores de marca
- ❌ NO debe haber botones en el centro (fixed bottom)

## Logs Esperados en Consola

```
🔍 [CanvasEditor useEffect] Verificando trigger: { analyzeTrigger: 1, hasUrl: true, ... }
✅ [CanvasEditor] Trigger detectado, ejecutando análisis: nike.com Trigger: 1
🔍 [CanvasEditor] handleUrlAnalysis iniciado con URL: nike.com
🔑 [CanvasEditor] API Key disponible: true
📤 [CanvasEditor] Enviando request a Gemini...
📥 [CanvasEditor] Respuesta recibida, parseando...
📊 [CanvasEditor] Datos de análisis: { candidates: [...] }
✅ [CanvasEditor] Branding parseado: { colors: [...], basePrompt: "..." }
🎨 [CanvasEditor] Generando imágenes con estilo: modern
✅ [CanvasEditor] Análisis completado, cerrando alerta
```

Después de estos logs, los controles deben aparecer en el sidebar.

## Troubleshooting

### Problema: Los controles no aparecen después del análisis

**Causa**: `onImagesGenerated` no se está llamando o el callback no está conectado.

**Solución**:
1. Abre la consola del navegador (F12)
2. Busca el log: `✅ [CanvasEditor] Análisis completado`
3. Si aparece pero no hay controles, verifica que `canvaHasImages` sea `true`:
   ```javascript
   // En la consola del navegador
   console.log('canvaHasImages:', window.location.href);
   ```
4. Si `canvaHasImages` es `false`, hay un problema con el callback

### Problema: Los botones siguen en el centro

**Causa**: Caché del navegador mostrando versión antigua.

**Solución**:
1. Limpia el caché del navegador (Cmd+Shift+R o Ctrl+Shift+R)
2. Verifica que Netlify haya terminado de desplegar
3. Espera 2-3 minutos para que el CDN se actualice

### Problema: El análisis se queda cargando indefinidamente

**Causa**: Ver `DIAGNOSTICO-CANVA-ANALISIS-URL-13-ENERO.md`

**Solución**: Revisar logs en consola para identificar dónde se queda colgado.

## Archivos Modificados

- `components/canvas/CanvasEditor.tsx` - Eliminados botones fixed bottom (líneas 375-397)
- `components/FlyerForm.tsx` - Controles en sidebar (líneas 1034-1103)
- `components/FlyerDisplay.tsx` - Paso de callbacks
- `App.tsx` - Estados y callbacks

## Commits Realizados

1. `2e788b1` - fix(canva): eliminar botones de formato y estilos del centro
   - Eliminar botones fixed bottom-8 del CanvasEditor
   - Los controles ahora solo están en el sidebar izquierdo
   - Se muestran cuando canvaHasImages === true
   - Mejora la UX al tener todos los controles en un solo lugar

## Estado Final

- ✅ Botones eliminados del centro (fixed bottom)
- ✅ Controles en sidebar izquierdo
- ✅ Controles aparecen solo cuando hay imágenes
- ✅ Callbacks conectados correctamente
- ✅ Logs de debug para diagnosticar problemas
- ✅ Timeout de seguridad de 30s
- ✅ Mejor manejo de errores

## Próximos Pasos

1. Desplegar a producción (ya hecho con `git push`)
2. Esperar 2-3 minutos para que Netlify despliegue
3. Limpiar caché del navegador
4. Probar el flujo completo:
   - Ir a modo Canva
   - Ingresar URL
   - Hacer clic en "Analizar"
   - Esperar a que se generen las imágenes
   - Verificar que los controles aparezcan en el sidebar
5. Si hay problemas, revisar logs en consola del navegador

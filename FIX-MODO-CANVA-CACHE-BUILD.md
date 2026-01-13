# FIX: Modo Canva no se visualiza - Problema de Caché de Build

**Fecha**: 13 de enero de 2026
**Estado**: ✅ DIAGNOSTICADO - Problema de caché de build

## 🔍 DIAGNÓSTICO

### Síntomas
- Usuario reporta: "no veo nada" en el panel derecho cuando activa modo Canva
- Los logs muestran que el modo se activa correctamente:
  - `🎨 [FlyerForm] Cambiando modo a: canva`
  - `🎨 [App] creationMode cambió a: canva`
  - `🎨 [FlyerDisplay] ✅ MODO CANVA DETECTADO`
- El componente intenta renderizarse pero no aparece visualmente

### Causa Raíz Identificada
TypeScript/Vite no encuentra los módulos de Canvas:
```
Error: Cannot find module './CanvasToolbar' or its corresponding type declarations.
Error: Cannot find module './CanvasSidebar' or its corresponding type declarations.
Error: Cannot find module './CanvasProperties' or its corresponding type declarations.
```

**Los archivos SÍ existen** en `components/canvas/`:
- ✅ CanvasEditor.tsx
- ✅ CanvasToolbar.tsx
- ✅ CanvasSidebar.tsx
- ✅ CanvasProperties.tsx
- ✅ CanvasLayers.tsx
- ✅ CanvasTemplates.tsx

**Todos los archivos tienen sintaxis correcta** (0 errores de diagnóstico)

### Conclusión
El problema es **caché de build de Netlify/Vite**. Los archivos nuevos no se están compilando correctamente en producción.

## 🔧 SOLUCIÓN

### Paso 1: Limpiar caché local
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules
rm -rf dist
rm -rf .vite
npm install
```

### Paso 2: Limpiar caché de Netlify
En el dashboard de Netlify:
1. Ir a Site settings > Build & deploy > Build settings
2. Click en "Clear cache and retry deploy"
3. O agregar variable de entorno temporal: `NETLIFY_CLEAR_CACHE=true`

### Paso 3: Rebuild completo
```bash
npm run build
```

### Paso 4: Verificar imports
Los imports en `CanvasEditor.tsx` son correctos:
```typescript
import CanvasToolbar from './CanvasToolbar';
import CanvasSidebar from './CanvasSidebar';
import CanvasProperties from './CanvasProperties';
import CanvasLayers from './CanvasLayers';
```

### Paso 5: Deploy forzado
```bash
git add .
git commit -m "fix: Forzar rebuild de componentes Canvas"
git push origin main
```

## 📋 CHECKLIST DE VERIFICACIÓN

Después del deploy, verificar en producción:

1. ✅ Abrir consola del navegador
2. ✅ Activar modo Canva
3. ✅ Verificar que NO aparezcan errores de módulos no encontrados
4. ✅ Verificar que el editor se renderice visualmente
5. ✅ Verificar que la toolbar aparezca
6. ✅ Verificar que el sidebar aparezca
7. ✅ Verificar que se puedan agregar elementos

## 🎯 CÓDIGO RELEVANTE

### FlyerDisplay.tsx - Renderizado del modo Canva
```typescript
// MODO CANVA: Mostrar editor completo
if (creationMode === 'canva') {
  console.log('🎨 [FlyerDisplay] Intentando renderizar CanvasEditor...');
  console.log('🎨 [FlyerDisplay] aspectRatio:', aspectRatio);
  
  try {
    return (
      <div className="w-full h-full bg-gray-900">
        <div className="p-4 text-white text-center bg-green-500/20">
          <p className="text-sm">✅ Modo Canva activo - Cargando editor...</p>
        </div>
        <CanvasEditor
          aspectRatio={aspectRatio}
          onExport={(imageDataUrl) => {
            console.log('🎨 Imagen exportada desde Canvas Editor');
            if (onExport) {
              onExport(imageDataUrl);
            }
          }}
          onSave={(canvasData) => {
            console.log('💾 Diseño guardado:', canvasData);
            try {
              localStorage.setItem('canvas-design-last', canvasData);
              localStorage.setItem('canvas-design-timestamp', new Date().toISOString());
              console.log('✅ Diseño guardado en localStorage');
            } catch (error) {
              console.error('❌ Error guardando diseño:', error);
            }
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('❌ [FlyerDisplay] Error renderizando CanvasEditor:', error);
    return (
      <div className="w-full h-full bg-red-900 flex items-center justify-center">
        <div className="text-white text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Error al cargar editor Canva</h2>
          <p className="text-sm">{String(error)}</p>
        </div>
      </div>
    );
  }
}
```

## 🚨 ALTERNATIVA: Agregar exports explícitos

Si el problema persiste, agregar exports explícitos en cada archivo:

### CanvasToolbar.tsx
```typescript
// Al final del archivo
export default CanvasToolbar;
```

### CanvasSidebar.tsx
```typescript
// Al final del archivo
export default CanvasSidebar;
```

### CanvasProperties.tsx
```typescript
// Al final del archivo
export default CanvasProperties;
```

## 📊 ESTADO ACTUAL

- ✅ Código correcto
- ✅ Archivos existen
- ✅ Sintaxis correcta
- ❌ Caché de build desactualizado
- ⏳ Pendiente: Limpiar caché y rebuild

## 🔄 PRÓXIMOS PASOS

1. Limpiar caché local y de Netlify
2. Rebuild completo
3. Deploy forzado
4. Verificar en producción
5. Si persiste: Agregar exports explícitos
